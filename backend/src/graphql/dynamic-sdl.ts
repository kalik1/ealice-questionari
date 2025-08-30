import { DataSource } from 'typeorm';
import { Question } from '../questions/entities/question.entity';
import { QuestionSingle } from '../questions/entities/question-single.entity';
import { QuestionSingleResult } from '../questions/entities/question-single-result.entity';
import { QuestionValueTypeEnum } from '../questions/dto/question-value-type.enum';
import { questionnaireRuntime, sanitizeFieldName } from './runtime-schema.registry';

function gqlTypeFor(valueType: QuestionValueTypeEnum): string {
  switch (valueType) {
    case QuestionValueTypeEnum.number:
      return 'Float';
    case QuestionValueTypeEnum.string:
    default:
      return 'String';
  }
}

export async function buildDynamicQuestionnaireSDL(dataSource: DataSource): Promise<string> {
  // Read all questions and their keys grouped by questionnaire
  const questions = await dataSource.getRepository(Question).find({
    relations: ['singleQuestion', 'results'],
  });

  const typeToFields: Record<string, { key: string; fieldName: string; valueType: QuestionValueTypeEnum }[]> = {};

  for (const q of questions) {
    const questionnaire = q.questionnaire as unknown as string;
    const typeName = questionnaireRuntime.getTypeNameFor(questionnaire);
    if (!typeToFields[typeName]) typeToFields[typeName] = [];

    const addField = (key: string | null | undefined, vt: QuestionValueTypeEnum) => {
      if (!key) return;
      const fieldName = sanitizeFieldName(key);
      // Avoid duplicates with deterministic precedence
      if (!typeToFields[typeName].some((f) => f.key === key)) {
        typeToFields[typeName].push({ key, fieldName, valueType: vt });
      }
    };

    for (const s of q.singleQuestion || []) addField(s.key, s.valueType);
    for (const s of q.results || []) addField(s.key, s.valueType);
  }

  // Persist runtime mapping for resolvers to use
  const runtimeMap: Record<string, { key: string; fieldName: string; valueType: QuestionValueTypeEnum }[]> = {};
  for (const [typeName, fields] of Object.entries(typeToFields)) {
    // Reverse map to questionnaire id (strip prefix 'Questionnaire') by scanning back
    // We can reconstruct questionnaire by simple heuristic: store alongside
    // For registry, map by original questionnaire string
  }

  // Instead, compute questionnaire -> fields directly again
  const questionnaireToFields: Record<string, { key: string; fieldName: string; valueType: QuestionValueTypeEnum }[]> = {};
  for (const q of questions) {
    const questionnaire = q.questionnaire as unknown as string;
    if (!questionnaireToFields[questionnaire]) questionnaireToFields[questionnaire] = [];
    const pushUnique = (key: string | null | undefined, vt: QuestionValueTypeEnum) => {
      if (!key) return;
      const fieldName = sanitizeFieldName(key);
      if (!questionnaireToFields[questionnaire].some((f) => f.key === key)) {
        questionnaireToFields[questionnaire].push({ key, fieldName, valueType: vt });
      }
    };
    for (const s of q.singleQuestion || []) pushUnique(s.key, s.valueType);
    for (const s of q.results || []) pushUnique(s.key, s.valueType);
  }

  questionnaireRuntime.setMapping(questionnaireToFields);

  // Build SDL strings: object per questionnaire, and a union of all
  let sdl = '';
  const unionMembers: string[] = [];
  for (const [questionnaire, fields] of Object.entries(questionnaireToFields)) {
    const typeName = questionnaireRuntime.getTypeNameFor(questionnaire);
    unionMembers.push(typeName);
    const fieldLines = fields
      .map((f) => `  ${f.fieldName}: ${gqlTypeFor(f.valueType)}`)
      .join('\n');
    sdl += `type ${typeName} {\n${fieldLines}\n}\n\n`;
  }

  if (unionMembers.length > 0) {
    sdl += `union QuestionnaireData = ${unionMembers.join(' | ')}\n\n`;
    // Extend TimeseriesPointGQL with a typed field
    sdl += `extend type TimeseriesPointGQL { data: QuestionnaireData }\n`;
  } else {
    // Fallback: no dynamic types, still extend with scalar map to keep schema valid
    sdl += `extend type TimeseriesPointGQL { data: JSON }\n`;
  }

  return sdl;
}


