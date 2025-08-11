import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormErrorService} from 'app/shared/services/form-error.service';
import {QuestionBase} from '../controls/question-base.class';
import {DefaultErrorStateMatcher} from '../default-error-state-mather.class';

@Component({
    selector: 'app-question',
    templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent {
    @Input() question!: QuestionBase;
    @Input() form!: FormGroup;
    formFieldHelpers: string[] = [''];
    errorStateMatcher: DefaultErrorStateMatcher = new DefaultErrorStateMatcher();

    constructor(
        private _formErrorService: FormErrorService,
    ) {
    }

    get isValid(): boolean {
        return this.form.controls[this.question.key].valid;
    }

    getOption(k: string): string | number {
        return this.question.options?.find(v => v.key === k).value;
    }

    getErrorMessage(controlName: string): string {
        return this._formErrorService.getErrorMessage(this.form.controls[controlName]);
    }

    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

}
