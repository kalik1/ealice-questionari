import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {QuestionBase} from '../../../core/dynamic-forms/controls/question-base.class';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionControlService} from '../../../core/dynamic-forms/question-control.service';
import {IQuestionnarieInfo} from '../../../core/dynamic-forms/questionnaries/questionnaries.interfaces';
import {MatSelectChange} from '@angular/material/select';
import {catchError, map, Observable, of, filter, tap} from 'rxjs';
import {WINDOW} from '../../../core/services/window.service';
import {AlertService} from '../../../core/services/alert.service';
import {AnswerService} from '../../../core/api/services/answer.service';
import {PatientService} from '../../../core/api/services/patient.service';
import {ReadPatientDto} from '../../../core/api/models/read-patient-dto';
import {HttpErrorResponse} from '@angular/common/http';
import {BaseAnswers, IQuestionnary} from './inserisci-questionario.interfaces';
import {ActivatedRoute} from '@angular/router';
import { ReadQuestionDto } from 'app/core/api/models';
import { UpdateAnswerDto } from 'app/core/api/models/update-answer-dto';

@Component({
    selector: 'inserisci-questionario',
    templateUrl: './inserisci-questionario.component.html',
    encapsulation: ViewEncapsulation.None
})
export class InserisciQuestionarioComponent implements OnInit {

    // @Input() questions: QuestionBase<string>[] | null = [];
    pazienteForm = new FormGroup({
        paziente: new FormControl(undefined, Validators.required),
        questionnaire: new FormControl(undefined, Validators.required),
        overrideCreatedAt: new FormControl(false),
        createdAt: new FormControl(null)
    });
    form!: FormGroup;
    formInfo: IQuestionnarieInfo;
    // payLoad = '';
    questions: QuestionBase[] = [];

    patientCode: string = '';
    patients: ReadPatientDto[] = [];
    saveErrors: string[] = [];
    filteredPatients: Observable<ReadPatientDto[]> = of([]);

    questionnaries: ReadQuestionDto[];
    private questionMetaByKey: Record<string, any> = {};
    private editAnswerId?: string;

    /**
     * Constructor
     */

    constructor(
        private qcs: QuestionControlService,
        // private _questionService: QuestionService,
        // private _sf12Service: Sf12Service,
        private _route: ActivatedRoute,
        public alertService: AlertService,
        private _answerService: AnswerService,
        private _patientService: PatientService,
        @Inject(WINDOW) private window: Window,
    ) {
    }

    public setQuestionnarie(e: MatSelectChange): void {
        const questioner = e?.value as ReadQuestionDto;
        if (!questioner) {
            this.questions = [];
            this.form = null;
            this.questionMetaByKey = {};
            return;
        }

        this.questions = questioner.singleQuestion.map(q => new QuestionBase(q as unknown as QuestionBase));
        this.form = this.qcs.toFormGroup(this.questions);
        this.questionMetaByKey = (questioner.singleQuestion || []).reduce((acc, q: any) => {
            acc[q.key] = q;
            return acc;
        }, {} as Record<string, any>);

        this.formInfo = {
            title: questioner.name,
            description: questioner.description
        };
    }

    ngOnInit(): void {

        this.questionnaries = this._route.snapshot.data['questions'] as ReadQuestionDto[];
        this._patientService.patientControllerFindAll().pipe(
            tap(patients => this.patients = patients),
        ).subscribe();

        this.filteredPatients = this.pazienteForm.controls['paziente'].valueChanges.pipe(
            // startWith([]),
            filter(value => !!value),
            map((value: string | ReadPatientDto) => (typeof value === 'string' ? value : value.code.toString())),
            map((p: string) => (p ? this._filter(p) : this.patients.slice())),
        );

        const patientId = this._route.snapshot.params['patientId'];
        const answerId = this._route.snapshot.params['answerId'];
        if (patientId && answerId) {
            this.editAnswerId = answerId;
            this._answerService.answerControllerFindOne({patientId, id: answerId}).pipe(
                tap((answer: any) => {
                    const readAnswer = answer as any as {
                        questionnaire: ReadQuestionDto['questionnaire'];
                        answers: any[];
                        textResponses: any[];
                        notes?: string;
                        createdAt: string;
                    };
                    const qDef = this.questionnaries.find(q => q.questionnaire === readAnswer.questionnaire);
                    if (qDef) {
                        this.pazienteForm.controls['questionnaire'].setValue(qDef);
                        this.setQuestionnarie({value: qDef} as any);
                    }
                    // Pre-fill patient selection by id if available
                    const patient = this.patients.find(p => p.id === patientId);
                    if (patient) {
                        this.pazienteForm.controls['paziente'].setValue(patient);
                    }
                    // Build value map for form fields
                    const valueMap: Record<string, any> = {};
                    (readAnswer.answers || []).forEach((a) => { valueMap[a.key] = a.value; });
                    (readAnswer.textResponses || []).forEach((t) => { valueMap[t.key] = t.value ?? ''; });
                    if (this.form) {
                        Object.keys(valueMap).forEach((k) => {
                            if (this.form.controls[k]) {
                                this.form.controls[k].setValue(valueMap[k]);
                            }
                        });
                        this.form.markAsPristine();
                    }
                    this.pazienteForm.controls['overrideCreatedAt'].setValue(false);
                    this.pazienteForm.controls['createdAt'].setValue(readAnswer.createdAt);
                })
            ).subscribe();
        }
    }

    onReset($event: MouseEvent): void {
        $event.preventDefault();
        this.reset();
        this.form.markAsTouched({onlySelf: false});
    }

    onSubmit(event: MouseEvent): void {
        event.preventDefault();
        // this.payLoad = JSON.stringify(this.form.getRawValue());
        if (this.pazienteForm.invalid) {
            this.pazienteForm.markAsTouched({onlySelf: false});
            this.window.scroll(0, 0);
            return;
        }
        const currentPaziente = this.pazienteForm.controls['paziente'].value as ReadPatientDto;
        if (!currentPaziente || !currentPaziente.id) {
            this.pazienteForm.controls['paziente'].setValue('');
            this.window.scroll(0, 0);
            return;
        }
        const rawAnswers = this.form.getRawValue() as BaseAnswers;

        const answerKeys = Object.keys(rawAnswers).filter(f => f !== 'notes');
        const answers = answerKeys
            .filter((k) => {
                const meta = this.questionMetaByKey[k];
                return !(meta && meta.controlType === 'textbox' && meta.type === 'text');
            })
            .map((key) => {
                const value = rawAnswers[key];
                // Se il valore è undefined, null, stringa vuota o NaN, invia null
                if (value === undefined || value === null || value === '' || Number.isNaN(Number(value))) {
                    return { key, value: null };
                }
                return { key, value: Number(value) };
            });

        const textResponses = answerKeys
            .filter((k) => {
                const meta = this.questionMetaByKey[k];
                return meta && meta.controlType === 'textbox' && meta.type === 'text';
            })
            .map(key => ({ key, value: String(rawAnswers[key] ?? '') }));

        const overrideCreatedAt = this.pazienteForm.controls['overrideCreatedAt'].value === true;
        const createdAtValue = this.pazienteForm.controls['createdAt'].value;

        const baseBody = {
            answers,
            textResponses,
            notes: rawAnswers['notes'] || null,
            questionnaire: (this.pazienteForm.controls['questionnaire'].value as ReadQuestionDto).questionnaire
        } as any;

        const request$: Observable<any> = this.editAnswerId
            ? this._answerService.answerControllerUpdate({
                id: this.editAnswerId,
                patientId: currentPaziente.id,
                body: {
                    ...baseBody,
                    ...(overrideCreatedAt && createdAtValue ? { createdAt: createdAtValue } as Partial<UpdateAnswerDto> : {})
                }
            })
            : this._answerService.answerControllerCreate({
                patientId: currentPaziente.id,
                body: baseBody
            });

        request$.pipe(
            tap(() => this.onSendSuccess()),
            catchError((response: HttpErrorResponse) => {
                const errorMessages: string[] =  Array.isArray(response.error?.message || []) ? response.error?.message || [] : [response.error.message];
                this.onSendError(errorMessages);
                return of({});
            })
        ).subscribe();

        // this._answerService.answerControllerCreate();
    }

    reset(): void {
        this.qcs.resetFields(this.questions, this.form);
        this.patientCode = '';
    }

    onSendSuccess(): void {
        this.alertService.show('questionInsertSuccess', 3000);
        this.window.scroll(0, 0);
        this.qcs.resetFields(this.questions, this.form);
        this.setQuestionnarie({value: undefined, source: undefined});
        this.pazienteForm.reset(undefined, {onlySelf: false, emitEvent: true});
        this.formInfo = undefined;
    }

    onSendError(errors?: string[]): void {
        this.alertService.show('questionInsertError', 8000);
        this.saveErrors = errors;
        this.window.scroll(0, 0);
    }

    codicePazienteDisplay(paziente: ReadPatientDto): string {
        return paziente && paziente.code ? `${paziente.code} (${paziente.yearOfBirth})` : '';
    }

    private _filter(value: string): ReadPatientDto[] {
        const filterValue = value.toLowerCase();
        return this.patients.filter(p =>
            p.code.toString().toLowerCase().includes(filterValue) ||
            (filterValue.length > 1 && p.yearOfBirth.toString().toLowerCase().includes(filterValue))
        );
    }
}

