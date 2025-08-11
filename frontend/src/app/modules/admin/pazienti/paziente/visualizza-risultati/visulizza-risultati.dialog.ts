import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {tap} from 'rxjs';
import {PatientService} from '../../../../../core/api/services/patient.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {createPatientDtoForm} from '../../../../../core/api-forms/coopQuestionari';
import {FormErrorService} from '../../../../../shared/services/form-error.service';
import {ReadAnswerDto} from '../../../../../core/api/models/read-answer-dto';
import {ReadQuestionDto} from '../../../../../core/api/models/read-question-dto';
import {SingleQuestionStringDto} from '../../../../../core/api/models/single-question-string-dto';
import {SingleQuestionNumberDto} from '../../../../../core/api/models/single-question-number-dto';
import {ReadSingleAnswerDto} from '../../../../../core/api/models/read-single-answer-dto';
import { ReadSingleTextDto } from '../../../../../core/api/models/read-single-text-dto';

@Component({
    selector: 'visulizza-risultati-dialog',
    templateUrl: './visulizza-risultati.dialog.html',
    styleUrls: ['./visulizza-risultati.dialog.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VisualizzaRisultatiDialogComponent {

    pazienteForm: typeof createPatientDtoForm = createPatientDtoForm;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            answer: ReadAnswerDto;
            questionnaire: ReadQuestionDto;
        },
        private readonly _pazientiService: PatientService,
        readonly dialogRef: MatDialogRef<VisualizzaRisultatiDialogComponent, null>,
        public readonly formErrorService: FormErrorService,
    ) {
        if (data.answer && data.answer.notes) {
            data.answer.answers?.push({key: 'notes', value: data.answer.notes});
        }
    }

    print(): void {
        window.print();
    }

    getAnswerFormQuestion(q: SingleQuestionStringDto | SingleQuestionNumberDto): (ReadSingleAnswerDto | ReadSingleTextDto) {
        if (q.controlType === 'textbox' && q.type === 'text') {
            return this.data.answer.textResponses?.find(e => e.key === q.key);
        }
        return this.data.answer.answers.find(e => e.key === q.key);
    }

    getResultFormQuestion(q: SingleQuestionStringDto | SingleQuestionNumberDto): ReadSingleAnswerDto {
        return this.data.answer.results.find(e => e.key === q.key);
    }

    public getKeyFormAnswer(sa: ReadSingleAnswerDto): SingleQuestionStringDto | SingleQuestionNumberDto {
       return this.data.questionnaire.singleQuestion.find(q => q.key === sa.key);
    }

    public getValueFormAnswer(sa: ReadAnswerDto['results'][number], sq: ReadQuestionDto['singleQuestion'][number]): string | number {
        switch (sq.controlType) {
            case 'textbox':
                return sa.value;
            case 'dropdown':
                return sq.options.find(o => o.value === sa.value).key;
            default:
                return sa.value;
        }
    }

    salvaPaziente(): void {
        this._pazientiService.patientControllerCreate({body: this.pazienteForm.getRawValue()}).pipe(
            tap(assistito => this.dialogRef.close(null)),
        ).subscribe();
    }

    cancel(): void {
        this.dialogRef.close(undefined);
    }

}
