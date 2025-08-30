import {AfterViewInit, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, Subject, switchMap,  tap} from 'rxjs';
import { ApexOptions} from 'ng-apexcharts';
import {PazienteService} from './paziente.service';
import {ReadAnswerDto, ReadPatientDto, ReadQuestionDto} from '../../../../core/api/models';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {FuseConfirmationService} from '../../../../../@fuse/services/confirmation';
import {AnswerService, PatientService, QuestionsService} from '../../../../core/api/services';
import { LocalUserService } from 'app/core/user/local-user.service';
import { RoleEnum } from 'app/shared/models/role.enum';
import { Observable } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {VisualizzaRisultatiDialogComponent} from './visualizza-risultati/visulizza-risultati.dialog';
import {MatTableDataSource} from '@angular/material/table';

@Component({
    selector: 'app-paziente',
    templateUrl: './paziente.component.html',
    styleUrls: ['./paziente.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PazienteComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('recentTransactionsTable', {read: MatSort}) recentTransactionsTableMatSort: MatSort;
    @ViewChild('paginator') paginator: MatPaginator;

    chartVisitors: ApexOptions;
    chartVisits: ApexOptions;
    chartNewVsReturning: ApexOptions;
    chartGender: ApexOptions;
    chartAge: ApexOptions;
    patient: ReadPatientDto | Record<string, never> = {};
    questionnaires: ReadQuestionDto[];
    data: any;
    readonly now: Date = new Date();
    answers: ReadAnswerDto[];
    recentTransactionsTableColumns: string[] = ['assistente', /*'gender_assistente',*/ 'createdAt', 'questionario', 'azioni'];
    elencoRisposteTableDataSource = new MatTableDataSource<ReadAnswerDto>();
    canEdit$: Observable<boolean>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _pazienteService: PazienteService,
        private _patientService: PatientService,
        private _questionService: QuestionsService,
        private _answerService: AnswerService,
        private _router: Router,
        private _route: ActivatedRoute,
        public dialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private _localUserService: LocalUserService,
    ) {

        this.answers = this._route.snapshot.data['answers'] as ReadAnswerDto[];
        this.questionnaires = this._route.snapshot.data['questionnaires'] as ReadQuestionDto[];
        this.patient = this._route.snapshot.data['paziente'] as ReadPatientDto || {};
        this.elencoRisposteTableDataSource.data = this.answers;
        this.canEdit$ = this._localUserService.user$.pipe(map(u => u.role === RoleEnum.admin || u.role === RoleEnum.coopAdmin));
    }

    ngOnInit(): void {

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    }
                }
            }
        };
    }

    public getQuestionnaire(k: ReadQuestionDto['questionnaire']): ReadQuestionDto {
        return this.questionnaires.find(q => q.questionnaire === k);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    ngAfterViewInit(): void {
        // Make the data source sortable
        this.elencoRisposteTableDataSource.sort = this.recentTransactionsTableMatSort;
        this.elencoRisposteTableDataSource.paginator = this.paginator;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    public showQ(e: MouseEvent, answer: ReadAnswerDto): void {
        e.preventDefault();
        this._questionService.questionsControllerFindOne({id: answer.questionnaire}).pipe(
            map(q => this.dialog.open<VisualizzaRisultatiDialogComponent,
                { questionnaire: ReadQuestionDto; answer: ReadAnswerDto },
                ReadPatientDto | undefined>(VisualizzaRisultatiDialogComponent, {
                data: {
                    questionnaire: q,
                    answer
                }
            })),
            switchMap(dialogRef => dialogRef.afterClosed())
        ).subscribe();
    }


    public eliminaQ(e: MouseEvent, answer: ReadAnswerDto): void {
        e.preventDefault();

        const dialogRef = this._fuseConfirmationService.open({
            title: 'Elimina Questionario',
            message: 'Sicuro di voler eliminare il Quesitonario selezionato? <br> <span class="font-medium">ATTENZIONE: Questa azione non può essere annullata!</span>',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn'
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Elimina',
                    color: 'warn'
                },
                cancel: {
                    show: true,
                    label: 'Annulla'
                }
            }
        });

        dialogRef.afterClosed().pipe(
            filter((r: 'confirmed' | 'cancelled') => r === 'confirmed'),
            switchMap(() => this._answerService.answerControllerRemove({
                id: answer.id,
                patientId: this._route.snapshot.params['id']
            })),
            tap(() => this.answers.splice(this.answers.findIndex(a => a.id === answer.id), 1)),
            tap(() => this.answers = [...this.answers]),
            tap(() => this.reloadResults())
        ).subscribe();
    }

    public modificaQ(answer: ReadAnswerDto): void {
        this._router.navigate(['/inserisci-questionario', this._route.snapshot.params['id'], answer.id]);
    }

    reloadResults(): void {
        this.elencoRisposteTableDataSource.data = this.answers;
    }

    public print(): void {
        window.print();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
            });
    }



}
