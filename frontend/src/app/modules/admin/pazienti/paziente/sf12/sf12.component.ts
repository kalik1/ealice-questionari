import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ReadAnswerDto} from '../../../../../core/api/models/read-answer-dto';
import {LastSF12Results} from '../paziente.interfaces';
import {ApexAxisChartSeries, ApexOptions} from 'ng-apexcharts';

@Component({
    selector: 'app-sf12',
    templateUrl: './sf12.component.html',
    styleUrls: ['./sf12.component.scss']
})
export class Sf12Component implements OnInit, OnChanges {

    @Input() answers: ReadAnswerDto[];

    badgeData: LastSF12Results;
    sf12ChartView: ApexOptions;
    sf2Data: ApexAxisChartSeries = [];
    last2AnswersMCS: number;
    last2AnswersPCS: number;

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
        const lastAnswersMCSArray = this.answers.filter(a => a.questionnaire === 'sf12')
            .filter(Sf12Component.keyExists('mcs'))
            .map(r => ({createdAt: r.createdAt, mcs: Sf12Component.getKey(r, 'mcs')}));

        const lastAnswersPCSArray = this.answers.filter(a => a.questionnaire === 'sf12')
            .filter(Sf12Component.keyExists('pcs'))
            .map(r => ({createdAt: r.createdAt, pcs: Sf12Component.getKey(r, 'pcs')}));

        this.sf2Data = [
            {
                name: 'MCS12',
                data: lastAnswersMCSArray.map(a => ({
                    x: new Date(a.createdAt),
                    y: a.mcs
                }))
            },
            {
                name: 'PCS12',
                data: lastAnswersPCSArray.map(a => ({
                    x: new Date(a.createdAt),
                    y: a.pcs
                }))
            }
        ];
        const lastAnswersMCS = lastAnswersMCSArray.length >= 1 ? lastAnswersMCSArray[0].mcs as number : null;
        const last2AnswersMCS = lastAnswersMCSArray.length >= 2 ? lastAnswersMCSArray[1].mcs as number : null;
        const lastAnswersPCS = lastAnswersPCSArray.length >= 1 ? lastAnswersPCSArray[0].pcs as number : null;
        const last2AnswersPCS = lastAnswersPCSArray.length >= 2 ? lastAnswersPCSArray[1].pcs as number : null;

        this.last2AnswersPCS = lastAnswersPCS as number;
        this.last2AnswersMCS = last2AnswersMCS as number;


        this.badgeData = {
            lastMCS: lastAnswersMCS as number,
            lastPCS: lastAnswersPCS as number,
            lastMCSinPct: last2AnswersMCS != null ? lastAnswersMCS - last2AnswersMCS : null,
            lastPCSinPct: last2AnswersPCS != null ? lastAnswersPCS - last2AnswersPCS : null
        };
        console.log(lastAnswersMCSArray, lastAnswersMCS, last2AnswersMCS, this.badgeData);
        this.sf12ChartView = this._prepareChartData(this.sf2Data);
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
                    formatter: (val): string => val?.toFixed(1) || 'n/a'
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
                        return (val || 0).toFixed(0);
                    },
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                },
                // max       : (max): number => max + 250,
                // min       : (min): number => min - 250,
                max: (max): number => 100,
                min: (min): number => 0,
                show: true,
                tickAmount: 5,
            }
        };
    }


}
