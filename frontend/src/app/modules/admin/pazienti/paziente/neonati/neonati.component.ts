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
    // Categorical (string) timelines for dropdown/text responses
    categoricalCharts: { title: string; chart: ApexOptions }[] = [];

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

        // Build categorical timelines for string dropdowns/text responses
        this.buildCategoricalCharts(neonatiAnswers);
    }

    private buildDynamicCharts(neonatiAnswers: ReadAnswerDto[]): void {
        // Exclude the base vitals that are shown above
        const excludeKeys = new Set(['fc', 'fr', 'spo2', 'temp']);
        const numericKeys = new Map<string, string>();

        const labelOf = (key: string): string =>
            this.q?.singleQuestion?.find(sq => (sq as any).key === key)?.label ||
            this.q?.results?.find(r => (r as any).key === key)?.label || key;

        // Collect numeric keys from answers (include all numeric keys, we'll filter values later)
        neonatiAnswers.forEach(a => a.answers.forEach((as) => {
            if (typeof as.value === 'number' && !excludeKeys.has(as.key)) {
                if (!numericKeys.has(as.key)) {numericKeys.set(as.key, labelOf(as.key));}
            }
        }));

        // Include numeric results too
        neonatiAnswers.forEach(a => (a.results || []).forEach((rs) => {
            if (typeof rs.value === 'number' && !excludeKeys.has(rs.key)) {
                if (!numericKeys.has(rs.key)) {numericKeys.set(rs.key, labelOf(rs.key));}
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
                //console.log(`Chart data for ${key}:`, chartData);

                this.dynamicCharts.push({
                    title: label,
                    chart: this._prepareChartData(chartData)
                });
            }
        });
    }

    private buildCategoricalCharts(neonatiAnswers: ReadAnswerDto[]): void {
        // Identify string-type keys from questionnaire definition
        const stringKeys = new Map<string, { label: string }>();

        const labelOf = (key: string): string =>
            this.q?.singleQuestion?.find(sq => (sq as any).key === key)?.label ||
            this.q?.results?.find(r => (r as any).key === key)?.label || key;

        (this.q?.singleQuestion || []).forEach((sq: any) => {
            if (sq?.valueType === 'string' && (sq?.controlType === 'dropdown')) {
                console.log('stringKeys', sq.key, sq, labelOf(sq.key));
                stringKeys.set(sq.key, { label: labelOf(sq.key) });
            }
        });

        // Build charts per key from textResponses
        this.categoricalCharts = [];
        stringKeys.forEach((meta, key) => {
            // Collect values over time from textResponses
            const timeline = neonatiAnswers
                .filter(a => (a.answers || []).some(tr => tr.key === key))
                .map(a => ({ createdAt: a.createdAt, v: (a.answers || []).find(tr => tr.key === key)?.value }))
                .filter(p => !!p.v);

            if (timeline.length === 0) {return;}

            // Sort timeline by date
            timeline.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

            // Create timeline data for rangeBar chart
            const timelineData: any[] = [];
            let currentValue = timeline[0]?.v;
            let startDate = new Date(timeline[0]?.createdAt);
            let endDate = startDate;

            for (let i = 1; i < timeline.length; i++) {
                const currentEntry = timeline[i];
                const currentDate = new Date(currentEntry.createdAt);

                if (currentEntry.v === currentValue) {
                    // Same value, extend the range
                    endDate = currentDate;
                } else {
                    // Value changed, add the previous range and start new one
                    if (currentValue && startDate && endDate) {
                        timelineData.push({
                            x: String(currentValue),
                            y: [startDate.getTime(), endDate.getTime()],
                            fillColor: this.getColorForValue(String(currentValue))
                        });
                    }
                    currentValue = currentEntry.v;
                    startDate = currentDate;
                    endDate = currentDate;
                }
            }

            // Add the last range
            if (currentValue && startDate && endDate) {
                timelineData.push({
                    x: String(currentValue),
                    y: [startDate.getTime(), endDate.getTime()],
                    fillColor: this.getColorForValue(String(currentValue))
                });
            }

            if (timelineData.length === 0) {
                return;
            }

            const chart: ApexOptions = {
                chart: {
                    animations: { enabled: false },
                    fontFamily: 'inherit',
                    foreColor: 'inherit',
                    height: 200,
                    type: 'rangeBar' as const
                },
                series: [{
                    data: timelineData
                }],
                plotOptions: {
                    bar: {
                        horizontal: true,
                        distributed: true,
                        dataLabels: {
                            hideOverflowingLabels: false
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: (val: any, opts: any) => {
                        const label = opts.w.globals.labels[opts.dataPointIndex];
                        const a = new Date(val[0]);
                        const b = new Date(val[1]);
                        const diff = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
                        return label + ': ' + diff + (diff > 1 ? ' giorni' : ' giorno');
                    },
                    style: {
                        colors: ['#f3f4f5', '#fff']
                    }
                },
                xaxis: {
                    type: 'datetime'
                },
                yaxis: {
                    show: false
                },
                tooltip: {
                    followCursor: true,
                    theme: 'dark'
                },
                grid: {
                    row: {
                        colors: ['#f3f4f5', '#fff'],
                        opacity: 1
                    }
                }
            };

            console.log('categoricalCharts', meta.label, chart);
            this.categoricalCharts.push({ title: meta.label, chart });
        });
    }

    private getColorForValue(value: string): string {
        // Consistent color mapping for string values
        const colorMap: { [key: string]: string } = {
            si: '#10b981',
            no: '#ef4444',
            sì: '#10b981',
            bene: '#10b981',
            male: '#ef4444',
            normale: '#3b82f6',
            anormale: '#f59e0b',
            buono: '#10b981',
            cattivo: '#ef4444',
            alto: '#f59e0b',
            basso: '#3b82f6',
            medio: '#8b5cf6'
        };

        // If no specific mapping, generate a consistent color based on string hash
        if (colorMap[value.toLowerCase()]) {
            return colorMap[value.toLowerCase()];
        }

        // Generate consistent color for unknown values
        const hash = value.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 70%, 60%)`;
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
        //console.log('_prepareChartData input:', data);
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
        //console.log('_prepareChartData result:', result);
        return result;
    }
}


