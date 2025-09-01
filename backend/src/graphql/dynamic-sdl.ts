import { DataSource } from 'typeorm';
import { Question } from '../questions/entities/question.entity';
import { QuestionValueTypeEnum } from '../questions/dto/question-value-type.enum';
import {
  questionnaireRuntime,
  sanitizeFieldName,
} from './runtime-schema.registry';

function gqlTypeFor(valueType: QuestionValueTypeEnum): string {
  switch (valueType) {
    case QuestionValueTypeEnum.number:
      return 'Float';
    case QuestionValueTypeEnum.string:
    default:
      return 'String';
  }
}

export async function buildDynamicQuestionnaireSDL(
  dataSource: DataSource,
): Promise<string> {
  // Read all questions and their keys grouped by questionnaire
  const questions = await dataSource.getRepository(Question).find({
    relations: ['singleQuestion', 'singleQuestion.options', 'results'],
  });

  const typeToFields: Record<
    string,
    { key: string; fieldName: string; valueType: QuestionValueTypeEnum }[]
  > = {};

  for (const q of questions) {
    const questionnaire = q.questionnaire as unknown as string;
    const typeName = questionnaireRuntime.getTypeNameFor(questionnaire);
    if (!typeToFields[typeName]) typeToFields[typeName] = [];
    // console.log(
    //   'q',
    //   q.singleQuestion
    //     .filter((s) => s.controlType === 'dropdown')
    //     .map(
    //       (s) =>
    //         `${s.key}: ${s.valueType}, ${s.options?.map((o) => `${o.key}: ${o.value}`).join(', ')}`,
    //     ),
    // );
    //console.log('q', q.singleQuestion.filter(s => s.controlType === "dropdown").map(s => `${Object.values(s).join(', ')}`));

    const addField = (
      key: string | null | undefined,
      vt: QuestionValueTypeEnum,
    ) => {
      if (!key || key === '\\\\N') return;
      const fieldName = sanitizeFieldName(key);
      // Avoid duplicates with deterministic precedence
      if (!typeToFields[typeName].some((f) => f.key === key)) {
        typeToFields[typeName].push({ key, fieldName, valueType: vt });
      }
    };

    for (const s of q.singleQuestion || []) addField(s.key, s.valueType);
    for (const s of q.results || []) addField(s.key, s.valueType);
  }

  // Instead, compute questionnaire -> fields directly again
  const questionnaireToFields: Record<
    string,
    { key: string; fieldName: string; valueType: QuestionValueTypeEnum }[]
  > = {};
  const questionnaireToOptionLabels: Record<
    string,
    Record<string, Record<string, string>>
  > = {};
  const questionnaireToEnumTypeName: Record<
    string,
    Record<string, string>
  > = {};
  const questionnaireToEnumValues: Record<
    string,
    Record<string, Record<string, string>>
  > = {};
  for (const q of questions) {
    const questionnaire = q.questionnaire as unknown as string;
    if (!questionnaireToFields[questionnaire])
      questionnaireToFields[questionnaire] = [];
    if (!questionnaireToOptionLabels[questionnaire])
      questionnaireToOptionLabels[questionnaire] = {};
    if (!questionnaireToEnumTypeName[questionnaire])
      questionnaireToEnumTypeName[questionnaire] = {};
    if (!questionnaireToEnumValues[questionnaire])
      questionnaireToEnumValues[questionnaire] = {};
    const pushUnique = (
      key: string | null | undefined,
      vt: QuestionValueTypeEnum,
    ) => {
      if (!key || key === '\\\\N') return;
      const fieldName = sanitizeFieldName(key);
      if (!questionnaireToFields[questionnaire].some((f) => f.key === key)) {
        questionnaireToFields[questionnaire].push({
          key,
          fieldName,
          valueType: vt,
        });
      }
    };
    for (const s of q.singleQuestion || []) pushUnique(s.key, s.valueType);
    for (const s of q.results || []) pushUnique(s.key, s.valueType);
    // Capture dropdown option labels and add _label fields + enum type
    for (const s of q.singleQuestion || []) {
      if (s.controlType === 'dropdown' && s.key) {
        const labelKey = `${s.key}_label`;
        const labelFieldName = sanitizeFieldName(labelKey);
        if (
          !questionnaireToFields[questionnaire].some((f) => f.key === labelKey)
        ) {
          questionnaireToFields[questionnaire].push({
            key: labelKey,
            fieldName: labelFieldName,
            valueType: QuestionValueTypeEnum.string,
          });
        }
        if (!questionnaireToOptionLabels[questionnaire][s.key]) {
          questionnaireToOptionLabels[questionnaire][s.key] = {};
        }
        if (!questionnaireToEnumValues[questionnaire][s.key]) {
          questionnaireToEnumValues[questionnaire][s.key] = {};
        }
        // Stable enum type name per questionnaire+field
        const enumTypeName = `${questionnaireRuntime.getTypeNameFor(
          questionnaire,
        )}_${sanitizeFieldName(s.key)}_Label_Enum`;
        questionnaireToEnumTypeName[questionnaire][s.key] = enumTypeName;
        for (const o of s.options || []) {
          if (o && o.key) {
            questionnaireToOptionLabels[questionnaire][s.key][o.key] =
              o.value ?? '';
            // Enum value name must be GraphQL safe; derive from label or key
            const base = o.key ?? o.value;
            let enumVal = base
              .replace(/[^a-zA-Z0-9_]/g, '_')
              .replace(/_+/g, '_')
              .replace(/^_+|_+$/g, '');
            if (/^[0-9]/.test(enumVal)) {
              // Adding a V_ prefix to the enum value to make it GraphQL safe (enum cannot start with a number)
              enumVal = `V_${enumVal}`;
            }
            if (enumVal.length === 0) {
              enumVal = `V_${o.key}`;
            }
            // console.log('enumVal', enumVal, o.key, o.value);
            questionnaireToEnumValues[questionnaire][s.key][o.value] = enumVal;
          }
        }
      }
    }
  }

  questionnaireRuntime.setMapping(questionnaireToFields);
  questionnaireRuntime.setOptionLabels(questionnaireToOptionLabels);
  questionnaireRuntime.setOptionEnums(questionnaireToEnumTypeName);
  questionnaireRuntime.setOptionEnumValues(questionnaireToEnumValues);

  // Build SDL strings: object per questionnaire, and a union of all
  let sdl = '';
  const unionMembers: string[] = [];
  for (const [questionnaire, fields] of Object.entries(questionnaireToFields)) {
    const typeName = questionnaireRuntime.getTypeNameFor(questionnaire);
    unionMembers.push(typeName);
    const fieldLines = fields
      .map((f) => {
        let typeName = gqlTypeFor(f.valueType);
        if (f.key.endsWith('_label')) {
          const baseKey = f.key.replace(/_label$/, '');
          const enumName = (questionnaireToEnumTypeName[questionnaire] || {})[
            baseKey
          ];
          if (enumName) {
            typeName = enumName;
          }
        }
        return `  ${f.fieldName}: ${typeName}`;
      })
      .join('\n');
    sdl += `type ${typeName} {\n${fieldLines}\n}\n\n`;

    // Emit enums for each dropdown label set
    const enumTypes = questionnaireToEnumTypeName[questionnaire] || {};
    for (const [fieldKey, enumName] of Object.entries(enumTypes)) {
      const valuesMap = questionnaireToEnumValues[questionnaire][fieldKey] || {};
      const values = Object.values(valuesMap);
      if (values.length > 0) {
        sdl += `enum ${enumName} {\n  ${values.join('\n  ')}\n}\n\n`;
      }
    }
  }

  if (unionMembers.length > 0) {
    sdl += `union QuestionnaireData = ${unionMembers.join(' | ')}\n\n`;
    // Extend TimeseriesPointGQL with a typed field
    sdl += `extend type TimeseriesPointGQL { data: QuestionnaireData }\n`;
  } else {
    // Fallback: no dynamic types, still extend with scalar map to keep schema valid
    sdl += `extend type TimeseriesPointGQL { data: JSON }\n`;
  }
  // console.log('getOptionLabels', questionnaireRuntime.getOptionEnumValues()['sf12']['q1']);
  //console.log('getOptionEnums', questionnaireRuntime.getOptionEnumValueFor('sf12', 'q1', '0'));
  return sdl;
}
