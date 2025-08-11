import {ValidatorFn} from '@angular/forms';
import {ReadQuestionDto} from '../../api/models/read-question-dto';

export class QuestionBase<T = string | number> {
    value: T|undefined;
    key: string;
    label: string;
    required: boolean;
    order: number;
    controlType: string;
    hint: string;
    type: string;
    validators: ValidatorFn[];
    // Options per la select o per i radio
    options: {key: string; value: T}[];

    constructor(options: {
        value?: T;
        key?: string;
        label?: string;
        required?: boolean;
        order?: number;
        hint?: string;
        controlType?: string;
        type?: string;
        options?: {key: string; value: T}[];
        validators?: ValidatorFn[];
    } = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.hint = options.hint || '';
        this.required = !!options.required;
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.type = options.type || '';
        this.options = options.options || [];
        this.validators = options.validators || [];
    }
}
