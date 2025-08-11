import {Injectable} from '@angular/core';
import {FormControl, FormGroup, MinValidator, Validator, ValidatorFn, Validators} from '@angular/forms';
import {QuestionBase} from './controls/question-base.class';

@Injectable()
export class QuestionControlService {

    constructor() {

    }

    toFormGroup(questions: QuestionBase[]): FormGroup {
        //const group: { [key: string]: FormControl } = {};
        const group: { [key: string]: FormControl } = {};

        questions.filter(question => question.controlType !== 'divider').forEach((question) => {
            let validators: ValidatorFn[] = [];
            if (question.required) {
                validators.push(Validators.required);
            }
            if (question.validators) {
                validators = [...validators, ...question.validators];
            }

            if (question.controlType === 'number') {
                const typeArray = question.type.split('|');
                question.options = [];
                if (typeArray[0] != null && !Number.isNaN(typeArray[0])) {
                    question.options = [...question.options, {key: 'min', value: typeArray[0] }];
                    validators.push(Validators.min(Number(typeArray[0])));
                }
                if (typeArray[1] != null && !Number.isNaN(typeArray[1])) {
                    question.options = [...question.options, {key: 'max', value: typeArray[1] }];
                    validators.push(Validators.max(Number(typeArray[1])));
                }
                question.options = [...question.options, {key: 'step', value: typeArray[2] }];
            }
            group[question.key] = new FormControl(question.value ?? '', validators);
        });
        return new FormGroup(group);
    }

    resetFields(questions: QuestionBase[], formGroup: FormGroup): void {
        questions.filter(question => question.controlType !== 'divider').forEach((question) => {
            formGroup.controls[question.key].setValue(question.value);
        });
    }
}
