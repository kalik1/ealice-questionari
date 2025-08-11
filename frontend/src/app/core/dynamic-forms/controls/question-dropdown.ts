import {QuestionBase} from './question-base.class';

export class DropdownQuestion<T = string | number> extends QuestionBase<T> {
    override controlType = 'dropdown';
}
