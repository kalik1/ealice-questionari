import { QuestionValueTypeEnum } from '../questions/dto/question-value-type.enum';

export type QuestionnaireField = {
  key: string;
  fieldName: string;
  valueType: QuestionValueTypeEnum;
};

export type QuestionnaireRuntimeMap = Record<string, QuestionnaireField[]>;
export type QuestionnaireOptionLabelsMap = Record<
  string,
  Record<string, Record<string, string>>
>; // questionnaire -> fieldKey -> optionKey -> label
export type QuestionnaireOptionEnumTypeMap = Record<
  string,
  Record<string, string>
>; // questionnaire -> fieldKey -> enumTypeName
export type QuestionnaireOptionEnumValuesMap = Record<
  string,
  Record<string, Record<string, string>>
>; // questionnaire -> fieldKey -> optionKey -> enumValueName

class QuestionnaireRuntimeRegistry {
  private questionnaireToFields: QuestionnaireRuntimeMap = {};
  private questionnaireToOptionLabels: QuestionnaireOptionLabelsMap = {};
  private questionnaireToOptionEnumType: QuestionnaireOptionEnumTypeMap = {};
  private questionnaireToOptionEnumValues: QuestionnaireOptionEnumValuesMap = {};

  setMapping(map: QuestionnaireRuntimeMap) {
    this.questionnaireToFields = map;
  }

  getMapping(): QuestionnaireRuntimeMap {
    return this.questionnaireToFields;
  }

  setOptionLabels(map: QuestionnaireOptionLabelsMap) {
    this.questionnaireToOptionLabels = map;
  }

  getOptionLabels(): QuestionnaireOptionLabelsMap {
    return this.questionnaireToOptionLabels;
  }

  getOptionLabel(
    questionnaire: string,
    fieldKey: string,
    optionKey: string,
  ): string | undefined {
    return this.questionnaireToOptionLabels?.[questionnaire]?.[fieldKey]?.[
      optionKey
    ];
  }

  getOptionLabelsFor(
    questionnaire: string,
    fieldKey: string,
  ): Record<string, string> | undefined {
    return this.questionnaireToOptionLabels?.[questionnaire]?.[fieldKey];
  }

  setOptionEnums(map: QuestionnaireOptionEnumTypeMap) {
    this.questionnaireToOptionEnumType = map;
  }

  getOptionEnums(): QuestionnaireOptionEnumTypeMap {
    return this.questionnaireToOptionEnumType;
  }

  getOptionEnumTypeFor(
    questionnaire: string,
    fieldKey: string,
  ): string | undefined {
    return this.questionnaireToOptionEnumType?.[questionnaire]?.[fieldKey];
  }

  setOptionEnumValues(map: QuestionnaireOptionEnumValuesMap) {
    this.questionnaireToOptionEnumValues = map;
  }

  getOptionEnumValues(): QuestionnaireOptionEnumValuesMap {
    return this.questionnaireToOptionEnumValues;
  }

  getOptionEnumValueFor(
    questionnaire: string,
    fieldKey: string,
    optionKey: string,
  ): string | undefined {
    return this.questionnaireToOptionEnumValues?.[questionnaire]?.[fieldKey]?.[
      optionKey
    ];
  }

  getFieldsFor(questionnaire: string): QuestionnaireField[] {
    return this.questionnaireToFields[questionnaire] ?? [];
  }

  // GraphQL type name for a questionnaire (e.g., sf12 -> QuestionnaireSf12)
  getTypeNameFor(questionnaire: string): string {
    const normalized = questionnaire
      .replace(/[^a-zA-Z0-9_]/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');
    return `Questionnaire${normalized}`;
  }
}

export const questionnaireRuntime = new QuestionnaireRuntimeRegistry();

export function sanitizeFieldName(key: string): string {
  let name = key.replace(/[^a-zA-Z0-9_]/g, '_');
  // Collapse multiple underscores
  name = name.replace(/_+/g, '_');
  // Disallow names beginning with digits
  if (/^[0-9]/.test(name)) {
    name = `f_${name}`;
  }
  // Disallow GraphQL-reserved introspection prefix "__"
  if (name.startsWith('__')) {
    name = `f${name}`; // prepend a letter to avoid reserved prefix
  }
  // Ensure not empty
  if (name.length === 0) {
    name = 'f_unknown';
  }
  return name;
}
