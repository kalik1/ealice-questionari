import {ReadAnswerDto} from '../../../core/api/models/read-answer-dto';
import {GenericQuestionnarie} from '../../../core/dynamic-forms/questionnaries/questionnaries.interfaces';
import {CreateSingleAnswerDto} from '../../../core/api/models/create-single-answer-dto';

export interface IQuestionnary {
    name: string;
    key: ReadAnswerDto['questionnaire'];
    q: GenericQuestionnarie;
}

export type NotesT = Partial<Record<'notes', string>>;

export interface BaseAnswers extends NotesT {
    answers: CreateSingleAnswerDto[];
    notes: string;
}
