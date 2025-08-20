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

    // Global date-time range (defaults to last 7 days)
    rangeFrom: Date;
    rangeTo: Date;
    rangeFromInput: string; // for datetime-local input binding
    rangeToInput: string;   // for datetime-local input binding

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
        this.setDefaultRange();
        this.buildCharts();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.buildCharts();
    }

    // Helpers for date-time range
    setDefaultRange(): void {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        this.rangeFrom = weekAgo;
        this.rangeTo = now;
        this.rangeFromInput = this.formatDateTimeLocal(this.rangeFrom);
        this.rangeToInput = this.formatDateTimeLocal(this.rangeTo);
    }

    onRangeInputChange(which: 'from' | 'to', value: string): void {
        const parsed = this.parseDateTimeLocal(value);
        if (which === 'from') {
            this.rangeFrom = parsed;
            this.rangeFromInput = value;
        } else {
            this.rangeTo = parsed;
            this.rangeToInput = value;
        }
        this.buildCharts();
    }

    setQuickRange(preset: '12h' | '1d' | '3d' | '7d' | '14d' | '1m'): void {
        const now = new Date();
        let from = new Date(now);
        switch (preset) {
            case '12h':
                from = new Date(now.getTime() - 12 * 60 * 60 * 1000);
                break;
            case '1d':
                from = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
                break;
            case '3d':
                from = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
                break;
            case '7d':
                from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '14d':
                from = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
                break;
            case '1m':
                from = new Date(now);
                from.setMonth(now.getMonth() - 1);
                break;
        }
        this.rangeFrom = from;
        this.rangeTo = now;
        this.rangeFromInput = this.formatDateTimeLocal(this.rangeFrom);
        this.rangeToInput = this.formatDateTimeLocal(this.rangeTo);
        this.buildCharts();
    }

    private buildCharts(): void {
        const neonatiAnswersAll = (this.answers || []).filter(a => a.questionnaire === 'neonati');
        const fromMs = this.rangeFrom ? this.rangeFrom.getTime() : Number.NEGATIVE_INFINITY;
        const toMs = this.rangeTo ? this.rangeTo.getTime() : Number.POSITIVE_INFINITY;
        const neonatiAnswers = neonatiAnswersAll.filter((a) => {
            const t = new Date(a.createdAt).getTime();
            return t >= fromMs && t <= toMs;
        });
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

    private formatDateTimeLocal(d: Date): string {
        const pad = (n: number): string => String(n).padStart(2, '0');
        const yyyy = d.getFullYear();
        const MM = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const hh = pad(d.getHours());
        const mm = pad(d.getMinutes());
        return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
    }

    private parseDateTimeLocal(s: string): Date {
        // s expected format: YYYY-MM-DDTHH:mm
        const d = new Date(s);
        return isNaN(d.getTime()) ? new Date() : d;
    }

    private buildDynamicCharts(neonatiAnswers: ReadAnswerDto[]): void {
        // Exclude the base vitals that are shown above
        const excludeKeys = new Set(['fc', 'fr', 'spo2', 'temp']);
        // Also exclude dropdowns that are actually categorical (string) even if their options use numeric codes
        const dropdownStringKeys = new Set<string>(
            (this.q?.singleQuestion || [])
                .filter((sq: any) => sq?.controlType === 'dropdown' && sq?.valueType === 'string')
                .map((sq: any) => sq.key)
        );
        const numericKeys = new Map<string, string>();

        const labelOf = (key: string): string =>
            this.q?.singleQuestion?.find(sq => (sq as any).key === key)?.label ||
            this.q?.results?.find(r => (r as any).key === key)?.label || key;

        // Collect numeric keys from answers (include all numeric keys, we'll filter values later)
        neonatiAnswers.forEach(a => a.answers.forEach((as) => {
            if (typeof as.value === 'number' && !excludeKeys.has(as.key) && !dropdownStringKeys.has(as.key)) {
                if (!numericKeys.has(as.key)) {numericKeys.set(as.key, labelOf(as.key));}
            }
        }));

        // Include numeric results too
        neonatiAnswers.forEach(a => (a.results || []).forEach((rs) => {
            if (typeof rs.value === 'number' && !excludeKeys.has(rs.key) && !dropdownStringKeys.has(rs.key)) {
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
                // console.log(`Creating chart for ${key}:`, data);
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
        // Identify dropdown keys (textual categories possibly encoded as numbers)
        const dropdownKeys = new Map<string, { label: string; options: any[] }>();

        const labelOf = (key: string): string =>
            this.q?.singleQuestion?.find(sq => (sq as any).key === key)?.label ||
            this.q?.results?.find(r => (r as any).key === key)?.label || key;

        (this.q?.singleQuestion || []).forEach((sq: any) => {
            if (sq?.controlType === 'dropdown') {
                console.log('stringKeys', sq.key, sq, labelOf(sq.key));
                dropdownKeys.set(sq.key, { label: labelOf(sq.key), options: (sq.options || []) });
            }
        });

        // Build charts per key using line timeline with peaks (x: datetime, y: 0→1→0 around event)
        this.categoricalCharts = [];
        dropdownKeys.forEach((meta, key) => {
            // Collect events from answers for this key
            const events = neonatiAnswers
                .filter(a => (a.answers || []).some(ans => ans.key === key))
                .map((a) => {
                    const ans = (a.answers || []).find(tr => tr.key === key) as any;
                    const rawValue = ans?.value;
                    const opt = (meta.options || []).find((o: any) => String(o?.value) === String(rawValue));
                    const label = (opt?.label ?? opt?.key ?? String(rawValue ?? '')).toString();
                    if (rawValue === null || rawValue === undefined) { return null; }
                    return { createdAt: a.createdAt, label };
                })
                .filter(e => !!e);

            if (events.length === 0) { return; }

            // Sort by time
            events.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

            // Establish global bounds for this key (span lines from first to last event)
            const eventTimes = events.map(e => new Date(e.createdAt).getTime());
            const globalFirst = Math.min(...eventTimes);
            const globalLast = Math.max(...eventTimes);

            // Group by label -> one series per category value, build peaks
            type TimePoint = { x: number; y: number | null };
            const labelToPoints = new Map<string, TimePoint[]>();
            events.forEach((e) => {
                const t = new Date(e.createdAt).getTime();
                const arr = labelToPoints.get(e.label) || [];
                const oneMinute = 60 * 1000;
                // Insert nulls to avoid drawing constant zero lines between peaks
                arr.push(
                    { x: t - oneMinute - 1, y: null },
                    { x: t - oneMinute, y: 0 },
                    { x: t, y: 1 },
                    { x: t + oneMinute, y: 0 },
                    { x: t + oneMinute + 1, y: null }
                );
                labelToPoints.set(e.label, arr);
            });

            // Dedupe x and keep the highest defined y (1 > 0 > null)
            labelToPoints.forEach((points, lbl) => {
                points.sort((a, b) => a.x - b.x);
                const unique: TimePoint[] = [];
                for (const p of points) {
                    const last = unique[unique.length - 1];
                    if (!last || last.x !== p.x) {
                        unique.push(p);
                    } else {
                        const rank = (v: number | null): number => (v === null ? -1 : v);
                        last.y = rank(p.y) >= rank(last.y) ? p.y : last.y;
                    }
                }
                labelToPoints.set(lbl, unique);
            });

            const seriesLabels: string[] = Array.from(labelToPoints.keys());
            const seriesColors: string[] = seriesLabels.map(l => this.getColorForValue(l));
            const series = seriesLabels.map(l => ({
                name: l,
                data: (labelToPoints.get(l) || []).sort((a, b) => a.x - b.x)
            }));

            const chart: ApexOptions = {
                chart: {
                    animations: { enabled: false },
                    fontFamily: 'inherit',
                    foreColor: 'inherit',
                    height: 220,
                    type: 'area' as const
                },
                colors: seriesColors,
                series: series as any,
                markers: {
                    size: 0
                },
                stroke: {
                    curve: 'smooth'
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    type: 'datetime',
                    min: this.rangeFrom ? this.rangeFrom.getTime() : undefined,
                    max: this.rangeTo ? this.rangeTo.getTime() : undefined
                },
                yaxis: {
                    show: false,
                    min: 0,
                    max: 1.2
                },
                legend: {
                    show: true,
                    showForSingleSeries: true
                },
                tooltip: {
                    followCursor: true,
                    theme: 'dark',
                    x: {
                        formatter: (val: number): string => new Date(val).toLocaleString()
                    },
                    y: {
                        formatter: (_: number, opts: any): string => seriesLabels[opts.seriesIndex] || ''
                    }
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


