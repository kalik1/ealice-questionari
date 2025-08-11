import {QuestionBase} from './question-base.class';

export class TextboxRadio extends QuestionBase<string> {
    override controlType = 'radio';
}
