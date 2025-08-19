import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ReadAnswerDto } from '../../../../../core/api/models/read-answer-dto';
import { ReadQuestionDto } from '../../../../../core/api/models/read-question-dto';
import { ApexAxisChartSeries, ApexOptions } from 'ng-apexcharts';

@Component({
    selector: 'app-neonati',
    templateUrl: './neonati.component.html',
    styleUrls: ['./neonati.component.scss']
})
export class NeonatiComponent implements OnInit, OnChanges {

    @Input() answers: ReadAnswerDto[];
    @Input() q?: ReadQuestionDto;

    // Vital signs data (using same structure as parametri component)
    fcArray: { createdAt: string; fc: number }[] = [];
    frArray: { createdAt: string; fr: number }[] = [];
    spo2Array: { createdAt: string; spo2: number }[] = [];
    tempArray: { createdAt: string; temp: number }[] = [];

    // Chart views for vital signs
    fcChartView: ApexOptions;
    frChartView: ApexOptions;
    spo2ChartView: ApexOptions;
    tempChartView: ApexOptions;

    // Dynamic charts for other parameters
    dynamicCharts: { title: string; chart: ApexOptions }[] = [];

    ngOnInit(): void {
        this.buildCharts();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.buildCharts();
    }

    private buildCharts(): void {
        const neonatiAnswers = (this.answers || []).filter(a => a.questionnaire === 'neonati');
        if (neonatiAnswers.length === 0) {
            this.clearCharts();
            return;
        }

                                // Build vital signs arrays (same logic as parametri component)
                        this.fcArray = neonatiAnswers
                            .filter(a => a.answers.some(as => as.key === 'fc'))
                            .map(r => ({ createdAt: r.createdAt, fc: Number(r.answers.find(as => as.key === 'fc')?.value) }))
                            .filter(a => !Number.isNaN(a.fc) && a.fc > 0);

                        this.frArray = neonatiAnswers
                            .filter(a => a.answers.some(as => as.key === 'fr'))
                            .map(r => ({ createdAt: r.createdAt, fr: Number(r.answers.find(as => as.key === 'fr')?.value) }))
                            .filter(a => !Number.isNaN(a.fr) && a.fr > 0);

                        this.spo2Array = neonatiAnswers
                            .filter(a => a.answers.some(as => as.key === 'spo2'))
                            .map(r => ({ createdAt: r.createdAt, spo2: Number(r.answers.find(as => as.key === 'spo2')?.value) }))
                            .filter(a => !Number.isNaN(a.spo2) && a.spo2 > 0);

                        this.tempArray = neonatiAnswers
                            .filter(a => a.answers.some(as => as.key === 'temp'))
                            .map(r => ({ createdAt: r.createdAt, temp: Number(r.answers.find(as => as.key === 'temp')?.value) }))
                            .filter(a => !Number.isNaN(a.temp) && a.temp > 0);

        // Build vital signs charts (using same style as parametri)
        if (this.fcArray.length > 0) {
            this.fcChartView = this._prepareChartData([{
                name: 'Frequenza Cardiaca',
                color: '#e11d48',
                data: this.fcArray.reverse().map(a => ({
                    x: new Date(a.createdAt).toLocaleString(),
                    y: a.fc
                }))
            }]);
        }

        if (this.frArray.length > 0) {
            this.frChartView = this._prepareChartData([{
                name: 'Frequenza Respiratoria',
                color: '#2563eb',
                data: this.frArray.reverse().map(a => ({
                    x: new Date(a.createdAt).toLocaleString(),
                    y: a.fr
                }))
            }]);
        }

        if (this.spo2Array.length > 0) {
            this.spo2ChartView = this._prepareChartData([{
                name: 'SpO₂',
                color: '#16a34a',
                data: this.spo2Array.reverse().map(a => ({
                    x: new Date(a.createdAt).toLocaleString(),
                    y: a.spo2
                }))
            }]);
        }

        if (this.tempArray.length > 0) {
            this.tempChartView = this._prepareChartData([{
                name: 'Temperatura',
                color: '#ea580c',
                data: this.tempArray.reverse().map(a => ({
                    x: new Date(a.createdAt).toLocaleString(),
                    y: a.temp
                }))
            }]);
        }

        // Build dynamic charts for other numeric parameters
        this.buildDynamicCharts(neonatiAnswers);
    }

    private buildDynamicCharts(neonatiAnswers: ReadAnswerDto[]): void {
        // Exclude the base vitals that are shown above
        const excludeKeys = new Set(['fc', 'fr', 'spo2', 'temp']);
        const numericKeys = new Map<string, string>();

        const labelOf = (key: string): string =>
            this.q?.singleQuestion?.find(sq => (sq as any).key === key)?.label ||
            this.q?.results?.find(r => (r as any).key === key)?.label || key;

        // Collect numeric keys from answers (include all numeric keys, we'll filter values later)
        neonatiAnswers.forEach(a => a.answers.forEach(as => {
            if (typeof as.value === 'number' && !excludeKeys.has(as.key)) {
                if (!numericKeys.has(as.key)) numericKeys.set(as.key, labelOf(as.key));
            }
        }));

        // Include numeric results too
        neonatiAnswers.forEach(a => (a.results || []).forEach(rs => {
            if (typeof rs.value === 'number' && !excludeKeys.has(rs.key)) {
                if (!numericKeys.has(rs.key)) numericKeys.set(rs.key, labelOf(rs.key));
            }
        }));

        this.dynamicCharts = [];
        numericKeys.forEach((label, key) => {
            const timeSeries = neonatiAnswers
                .filter(a => a.answers.some(as => as.key === key))
                .map(a => ({ createdAt: a.createdAt, v: Number(a.answers.find(as => as.key === key)?.value) }))
                .filter(p => !Number.isNaN(p.v) && p.v > 0);

            const dataRes = neonatiAnswers
                .filter(a => (a.results || []).some(r => r.key === key))
                .map(a => ({ createdAt: a.createdAt, v: Number((a.results || []).find(r => r.key === key)?.value) }))
                .filter(p => !Number.isNaN(p.v) && p.v > 0);

            const data = (timeSeries.length > 0 ? timeSeries : dataRes);

            // Only create chart if there are enough valid values (> 0)
            if (data.length > 0) {
                console.log(`Creating chart for ${key}:`, data);
                const chartData = [{
                    name: label,
                    color: '#22c55e',
                    data: data.reverse().map(p => ({
                        x: new Date(p.createdAt).toLocaleString(),
                        y: p.v
                    }))
                }];
                console.log(`Chart data for ${key}:`, chartData);

                this.dynamicCharts.push({
                    title: label,
                    chart: this._prepareChartData(chartData)
                });
            }
        });
    }

    private clearCharts(): void {
        this.fcChartView = undefined as any;
        this.frChartView = undefined as any;
        this.spo2ChartView = undefined as any;
        this.tempChartView = undefined as any;
        this.dynamicCharts = [];
        this.fcArray = [];
        this.frArray = [];
        this.spo2Array = [];
        this.tempArray = [];
    }

    /**
     * Prepare the chart data from the data (same style as parametri component)
     */
    private _prepareChartData(data: ApexAxisChartSeries): ApexOptions {
        console.log('_prepareChartData input:', data);
        const result: ApexOptions = {
            chart: {
                animations: {
                    enabled: false
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'area' as const,
                sparkline: {
                    enabled: true
                }
            },
            colors: data.map(d => d.color),
            fill: {
                colors: data.map(d => d.color),
                opacity: 0.5
            },
            series: data.map(d => ({name: d.name, data: d.data.map(dd => dd.y)})),
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
        console.log('_prepareChartData result:', result);
        return result;
    }
}


