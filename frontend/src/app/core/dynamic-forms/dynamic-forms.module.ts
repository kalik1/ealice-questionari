import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {QuestionControlService} from './question-control.service';
import {DynamicFormQuestionComponent} from './component/dynamic-form-question.component';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';

@NgModule({
    imports: [
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatDividerModule,
    ],
    declarations: [DynamicFormQuestionComponent],
    providers: [QuestionControlService],
    exports: [DynamicFormQuestionComponent,]
})
export class DynamicsForms {
    constructor() {
    }
}
