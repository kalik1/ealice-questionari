import { QuestionValueTypeEnum } from '../questions/dto/question-value-type.enum';

export type QuestionnaireField = {
  key: string;
  fieldName: string;
  valueType: QuestionValueTypeEnum;
};

export type QuestionnaireRuntimeMap = Record<string, QuestionnaireField[]>;

class QuestionnaireRuntimeRegistry {
  private questionnaireToFields: QuestionnaireRuntimeMap = {};

  setMapping(map: QuestionnaireRuntimeMap) {
    this.questionnaireToFields = map;
  }

  getMapping(): QuestionnaireRuntimeMap {
    return this.questionnaireToFields;
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
