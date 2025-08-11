import {QuestionBase} from './question-base.class';

export class NumberQuestion extends QuestionBase<string> {
    override controlType = 'number';
}
