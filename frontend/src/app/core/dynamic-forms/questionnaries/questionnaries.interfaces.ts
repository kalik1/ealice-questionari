import {Observable} from 'rxjs';
import {QuestionBase} from '../controls/question-base.class';

export interface IQuestionnarieInfo {
    title: string;
    description?: string;
}

export abstract class GenericQuestionnarie<T = string | number> {
    getInfo: () => Observable<IQuestionnarieInfo>;
    getQuestions: () => Observable<QuestionBase<T>[]>;
}
