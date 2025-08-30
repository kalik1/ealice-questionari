import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ReadAnswerDto} from '../../../../../core/api/models/read-answer-dto';
import {LastParametriResults} from '../paziente.interfaces';
import {ApexAxisChartSeries, ApexOptions} from 'ng-apexcharts';

@Component({
    selector: 'app-parametri',
    templateUrl: './parametri.component.html',
    styleUrls: ['./parametri.component.scss']
})
export class ParametriComponent implements OnInit, OnChanges {

    @Input() answers: ReadAnswerDto[];

    badgeData: LastParametriResults;
    frequenzaChartView: ApexOptions;
    frequenzaArray: {
        [index: string]: number | string;
        createdAt: string;
    }[];

    pesoChartView: ApexOptions;
    pesoArray: {
        [index: string]: number | string;
        createdAt: string;
    }[];

    saturazioneChartView: ApexOptions;
    saturazioneArray: {
        [index: string]: number | string;
        createdAt: string;
    }[];

    glicemiaChartView: ApexOptions;
    glicemiaArray: {
        [index: string]: number | string;
        createdAt: string;
    }[];

    constructor() {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Priva Static methods
    // -----------------------------------------------------------------------------------------------------
    private static keyAnswerExists(key: string) {
        return (a: ReadAnswerDto): boolean => a.answers.map(r => r.key === key).length > 0;
    }

    private static getAnswerKey(a: ReadAnswerDto, key: string): number | string {
        return a.answers.find(e => e.key === key)?.value;
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
        this.frequenzaArray = this.answers.filter(a => a.questionnaire === 'parametri').filter(ParametriComponent.keyAnswerExists('q1'))
            .map(r => ({createdAt: r.createdAt, q1: ParametriComponent.getAnswerKey(r, 'q1')})).filter(a => a.q1 != null);
        this.pesoArray = this.answers.filter(a => a.questionnaire === 'parametri').filter(ParametriComponent.keyAnswerExists('q2'))
            .map(r => ({createdAt: r.createdAt, q2: ParametriComponent.getAnswerKey(r, 'q2')})).filter(a => a.q2 != null);
        this.saturazioneArray = this.answers.filter(a => a.questionnaire === 'parametri').filter(ParametriComponent.keyAnswerExists('q3'))
            .map(r => ({createdAt: r.createdAt, q3: ParametriComponent.getAnswerKey(r, 'q3')})).filter(a => a.q3 != null);
        this.glicemiaArray = this.answers.filter(a => a.questionnaire === 'parametri').filter(ParametriComponent.keyAnswerExists('q4'))
            .map(r => ({createdAt: r.createdAt, q4: ParametriComponent.getAnswerKey(r, 'q4')})).filter(a => a.q4 != null);

        const lastAnswersFrequenza = this.frequenzaArray.length >= 1 ? this.frequenzaArray[0].q1 as number : null;
        const lastAnswersPeso = this.pesoArray.length >= 1 ? this.pesoArray[0].q2 as number : null;
        const lastAnswerssaturazione = this.saturazioneArray.length >= 1 ? this.saturazioneArray[0].q3 as number : null;
        const lastAnswersGlicemia = this.glicemiaArray.length >= 1 ? this.glicemiaArray[0].q4 as number : null;

        this.badgeData = {
            lastFrequenza: lastAnswersFrequenza,
            lastPeso: lastAnswersPeso,
            lastsaturazione: lastAnswerssaturazione,
            lastGlicemia: lastAnswersGlicemia
        };

        this.frequenzaChartView = this._prepareChartData([{
            name: 'Frequenza Cardiaca',
            color: '#38BDF8',
            data: this.frequenzaArray.reverse().map(a => ({
                x: new Date(a.createdAt).toLocaleString(),
                y: a.q1
            }))
        }]);

        // console.log( this.saturazioneArray);
        this.pesoChartView = this._prepareChartData([{
            name: 'Peso',
            color: '#4ef838',
            data: this.pesoArray.reverse().map(a => ({
                x: new Date(a.createdAt).toLocaleString(),
                y: a.q2
            }))
        }]);

        this.saturazioneChartView = this._prepareChartData([{
            name: 'SpO2',
            color: '#f89b38',
            data: this.saturazioneArray.reverse().map(a => ({
                x: new Date(a.createdAt).toLocaleString(),
                y: a.q3
            }))
        }]);

        this.glicemiaChartView = this._prepareChartData([{
            name: 'HbA1c',
            color: '#9e38f8',
            data: this.glicemiaArray.reverse().map(a => ({
                x: new Date(a.createdAt).toLocaleString(),
                y: a.q4
            }))
        }]);
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(data: ApexAxisChartSeries): ApexOptions {
        return {
            chart: {
                animations: {
                    enabled: false
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'area',
                sparkline: {
                    enabled: true
                }
            },
            colors: data.map(d => d.color),
            fill: {
                colors: ['#38BDF8'],
                opacity: 0.5
            },
            series: [{name: data[0].name, data: data[0].data.map(d => d.y)}],
            stroke: {
                curve: 'smooth'
            },
            tooltip: {
                followCursor: true,
                theme: 'dark'
            },
            xaxis: {
                type: 'category',
                categories: data[0].data.map(d => d.x)
            },
            yaxis: {
                labels: {
                    formatter: (val): string => val.toString()
                }
            }
        };
    };
}
