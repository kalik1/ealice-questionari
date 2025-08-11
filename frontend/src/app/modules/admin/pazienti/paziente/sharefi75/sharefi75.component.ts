import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ReadAnswerDto} from '../../../../../core/api/models/read-answer-dto';
import {LastSharefi75Results} from '../paziente.interfaces';
import {ApexAxisChartSeries, ApexOptions} from 'ng-apexcharts';
import {ReadQuestionDto} from '../../../../../core/api/models/read-question-dto';

@Component({
    selector: 'app-sharefi75',
    templateUrl: './sharefi75.component.html',
    styleUrls: ['./sharefi75.component.scss']
})
export class Sharefi75Component implements OnInit, OnChanges {

    @Input() answers: ReadAnswerDto[];
    @Input() q: ReadQuestionDto;

    frailstatus: string = '';
    badgeData: LastSharefi75Results;
    sharefi75ChartView: ApexOptions;
    sharefi75Data: ApexAxisChartSeries = [];
    lastDFactor: number;
    last2AnswersDFactor: number;

    constructor() {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Priva Static methods
    // -----------------------------------------------------------------------------------------------------
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

    ngOnInit(): void {
        this.setChartAndLabels();
    }

    private setChartAndLabels(): void {
        const lastAnswersDFactorArray = this.answers.filter(a => a.questionnaire === 'sharefi75').filter(Sharefi75Component.keyExists('dfactor'))
            .map(r => ({createdAt: r.createdAt, dfactor: Sharefi75Component.getKey(r, 'dfactor')}));

        const frailStatusArray = this.answers.filter(a => a.questionnaire === 'sharefi75').filter(Sharefi75Component.keyExists('frailstatus'))
            .map(r => ({createdAt: r.createdAt, frailstatus: Sharefi75Component.getKey(r, 'frailstatus')}));

        if (frailStatusArray.length > 0) {
            const frailstatusValue = frailStatusArray[0].frailstatus as string;
            this.frailstatus = this.q.results.find(r => r.key === 'frailstatus').options?.find(o => o?.value === frailstatusValue)?.key;
        }
        this.sharefi75Data = [
            {
                name: 'DFactor',
                data: lastAnswersDFactorArray.map(a => ({
                    x: new Date(a.createdAt),
                    y: a.dfactor
                }))
            },
        ];

        const lastAnswersDFactor = lastAnswersDFactorArray.length >= 1 ? lastAnswersDFactorArray[0].dfactor as number : null;
        const last2AnswersDFactor = lastAnswersDFactorArray.length >= 2 ? lastAnswersDFactorArray[1].dfactor as number : null;

        this.last2AnswersDFactor = last2AnswersDFactor;

        this.badgeData = {
            lastDFactor: lastAnswersDFactor,
            lastDFactorinPct: last2AnswersDFactor != null ? lastAnswersDFactor - last2AnswersDFactor : null,
        };
        this.sharefi75ChartView = this._prepareChartData(this.sharefi75Data);
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
            colors: ['#64748B', '#94A3B8'],
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
                    formatter: (val): string => val?.toFixed(2) || 'n/a'
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
                tickAmount: 6,
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
                        return (val || 0).toFixed(1);
                    },
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                },
                // max       : (max): number => max + 250,
                // min       : (min): number => min - 250,
                max: (max): number => 1,
                min: (min): number => 0,
                show: true,
                tickAmount: 5,
            }
        };
    }


}
