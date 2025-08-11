import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ReadAnswerDto} from '../../../../../core/api/models/read-answer-dto';
import {LastSharefi75Results} from '../paziente.interfaces';
import {ApexAxisChartSeries, ApexOptions} from 'ng-apexcharts';
import {ReadQuestionDto} from '../../../../../core/api/models/read-question-dto';

@Component({
    selector: 'app-condizioni-generali',
    templateUrl: './condizioni-generali.component.html',
    styleUrls: ['./condizioni-generali.component.scss']
})
export class CondizioniGeneraliComponent implements OnInit, OnChanges {

    @Input() answers: ReadAnswerDto[];
    @Input() q: ReadQuestionDto;

    frailstatus: string = '';
    badgeData: {
        lastPuliziaAmbiente: number;
        lastCorrispondenzaLuogo: number;
        lastPuliziaPersonale: number;
        lastCorrispondenzaPresidi: number;
        lastCareGiver: number;
        lastAutosufficienza: number;
    };
    ambienteChartView: ApexOptions;
    condizioniGeneraliData: ApexAxisChartSeries = [];
    lastDFactor: number;
    lastAmbiente: boolean = false;
    last2AnswersDFactor: number;

    constructor() {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private Static methods
    // -----------------------------------------------------------------------------------------------------
    private static resetDate(d: string): string {
        const date = new Date(d);
        date.setSeconds(-1);
        date.setSeconds(-2);
        return date.toString();
    }

    private static duplicateLastValue<T extends { createdAt: string }>(a: Array<T>): Array<T> {
        return (a.length === 1) ? [a[0], {
            ...a[0],
            createdAt: CondizioniGeneraliComponent.resetDate(a[0].createdAt)
        }] : a;
    }

    private static keyAnswerExists(key: string) {
        return (a: ReadAnswerDto): boolean => a.answers.map(r => r.key === key).length > 0;
    }

    private static getAnswerKey(a: ReadAnswerDto, key: string): number | string {
        return a.answers.find(e => e.key === key)?.value;
    }

    private static keyExists(key: string) {
        return (a: ReadAnswerDto): boolean => a.results.map(r => r.key === key).length > 0;
    }

    private static getKey(a: ReadAnswerDto, key: string): number | string {
        return a.results.find(e => e.key === key)?.value;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('answers' in changes) {
            this.setChartAndLabels();
        }
    }

    public getAnswerOption(key: string, val: number): string {
        return this.q.singleQuestion.find(r => r.key === key)?.options?.find(o => o?.value === val)?.key || 'n/a';
    }

    public getResultOption(key: string, val: number): string {
        console.log(this.q);
        return this.q.results.find(r => r.key === key)?.options?.find(o => o?.value === val)?.key || 'n/a';
    }

    ngOnInit(): void {
        this.setChartAndLabels();
    }

    private getAnswerFromKey<T extends string>(k: T): Array<{ createdAt: string } & Record<string, string | number>> {
        return this.answers.filter(a => a.questionnaire === 'ambiente').filter(CondizioniGeneraliComponent.keyAnswerExists(k))
            .map(r => ({createdAt: r.createdAt, [k]: CondizioniGeneraliComponent.getAnswerKey(r, k)}));
    }

    private tryToGetTooltipValue(val: number, v: any): string {
        let key = 'q1';

        if (v.w.config.series[v.seriesIndex]?.data[0]?.meta) {
            const meta = v.w.config.series[v.seriesIndex]?.data[0]?.meta;
            if (meta.values && Array.isArray(meta.values)) {
                return meta.values[val];
            }
            if (meta.seriesName) {
                key = meta.seriesName;
            }
        }
        return this.getAnswerOption(key, val);

    }

    private setChartAndLabels(): void {

        const puliziaAmbienteArray = CondizioniGeneraliComponent.duplicateLastValue(this.getAnswerFromKey('q1'));
        const corrispondenzaLuogoArray = CondizioniGeneraliComponent.duplicateLastValue(this.getAnswerFromKey('q2'));
        const puliziaPersonaleArray = CondizioniGeneraliComponent.duplicateLastValue(this.getAnswerFromKey('q3'));
        const corrispondenzaPresidiArray = CondizioniGeneraliComponent.duplicateLastValue(this.getAnswerFromKey('q4'));
        const careGiverArray = CondizioniGeneraliComponent.duplicateLastValue(this.getAnswerFromKey('q11'));
        const autosufficienzaArray = CondizioniGeneraliComponent.duplicateLastValue(this.answers.filter(a => a.questionnaire === 'ambiente')
            .filter(CondizioniGeneraliComponent.keyExists('selfsufficient'))
            .map(r => r)
            .map(r => ({
                createdAt: r.createdAt,
                selfsufficient: CondizioniGeneraliComponent.getKey(r, 'selfsufficient')
            }))
        );

        this.condizioniGeneraliData = [
            {
                name: 'Pulizia Ambiente',
                data: puliziaAmbienteArray.map(a => ({
                    x: new Date(a.createdAt),
                    y: a.q1
                }))
            },
            {
                name: 'Corrispondenza Luogo',
                data: corrispondenzaLuogoArray.map(a => ({
                    x: new Date(a.createdAt),
                    y: a.q2
                }))
            },
            {
                name: 'Pulizia Personale',
                data: puliziaPersonaleArray.map(a => ({
                    x: new Date(a.createdAt),
                    y: a.q3
                }))
            },
            {
                name: 'Corrispondenza Presidi',
                data: corrispondenzaPresidiArray.map(a => ({
                    x: new Date(a.createdAt),
                    y: a.q4
                }))
            },
            {
                name: 'Presenza Caregiver',
                data: careGiverArray.map(a => ({
                    x: new Date(a.createdAt),
                    y: a.q11,
                    meta: {
                        seriesName: 'q11',
                        values: ['No', 'Si']
                    },
                }))
            },
            {
                name: 'Autosufficenza',
                data: autosufficienzaArray.map(a => ({
                    x: new Date(a.createdAt),
                    y: a.selfsufficient
                }))
            },
        ];

        this.lastAmbiente = puliziaAmbienteArray.length > 0;
        this.badgeData = {
            lastPuliziaAmbiente: puliziaAmbienteArray.length >= 1 ? puliziaAmbienteArray[0].q1 as number : null,
            lastCorrispondenzaLuogo: corrispondenzaLuogoArray.length >= 1 ? corrispondenzaLuogoArray[0].q2 as number : null,
            lastPuliziaPersonale: puliziaPersonaleArray.length >= 1 ? puliziaPersonaleArray[0].q3 as number : null,
            lastCorrispondenzaPresidi: corrispondenzaPresidiArray.length >= 1 ? corrispondenzaPresidiArray[0].q4 as number : null,
            lastCareGiver: careGiverArray.length >= 1 ? careGiverArray[0].q11 as number : null,
            lastAutosufficienza: autosufficienzaArray.length >= 1 ? autosufficienzaArray[0].selfsufficient as number : null,
        };
        //
        // this.last2AnswersDFactor = last2AnswersDFactor;
        //
        // this.badgeData = {
        //     lastDFactor: lastAnswersDFactor,
        //     lastDFactorinPct: last2AnswersDFactor != null ? lastAnswersDFactor - last2AnswersDFactor : null,
        // };
        this.ambienteChartView = this._prepareChartData(this.condizioniGeneraliData);
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(data: ApexAxisChartSeries): ApexOptions {
        // Visitors vs Page Views
        return {
            chart: {
                animations: {
                    enabled: false
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'area',
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            colors: [
                '#64748B',
                '#94A3B8',
                '#9e94b8',
                '#b894b7',
                '#94b89c',
                '#aeb894',],
            dataLabels: {
                enabled: false
            },
            fill: {
                colors: ['#64748B', '#94A3B8'],
                opacity: 0.5
            },
            grid: {
                xaxis: {
                    lines: {
                        show: true
                    }
                },
                yaxis: {
                    lines: {
                        show: true
                    }
                },
                show: true,
                padding: {
                    bottom: -40,
                    left: 0,
                    right: 0
                }
            },
            legend: {
                show: false
            },
            series: data,

            stroke: {
                curve: 'smooth',
                width: 2
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
                x: {
                    format: 'MMM dd, yyyy (HH:mm)'
                },
                y: {
                    formatter: this.tryToGetTooltipValue.bind(this)
                }
            },
            xaxis: {
                axisBorder: {
                    show: false
                },
                labels: {
                    offsetY: -20,
                    offsetX: 20,
                    rotate: 0,
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    },
                },
                tooltip: {
                    enabled: false
                },
                type: 'datetime'
            },
            yaxis: {
                labels: {
                    offsetX: -5,
                    formatter: (val: number): string => {
                        if (val === 0) {
                            return '';
                        }
                        return (val || 0).toFixed(0);
                    },
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                },
                // max       : (max): number => max + 250,
                // min       : (min): number => min - 250,
                max: (max): number => 5,
                min: (min): number => 0,
                show: true,
                tickAmount: 5,
            }
        };
    }


}
