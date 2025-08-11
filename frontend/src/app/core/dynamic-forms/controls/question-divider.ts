import {QuestionBase} from './question-base.class';

export class Divider extends QuestionBase<string> {
    override controlType = 'divider';
    value: string;
    override key: never;
    label: string;
    override required: never;
    order: number;
    override type: 'divider' | 'no-divider';
    override validators: never;
    // Options per la select o per i radio
    override options: never;
}
