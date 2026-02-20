import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartDataset, ChartOptions, registerables } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import {
  AgileMetricsSettings,
  BaselineGoal,
  METRIC_DEFINITIONS,
  MetricCategory,
  MetricDefinition,
  MetricEntry,
  RADAR_DIMENSIONS,
} from '../../shared/models/agile-metrics.model';
import { AgileMetricsService } from '../../shared/services/agile-metrics.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

Chart.register(...registerables);

interface MetricKpi {
  definition: MetricDefinition;
  currentValue: number | null;
  baseline: number;
  goal: number;
  evolutionPercent: number | null;
  status: 'success' | 'warning' | 'danger';
}

@Component({
  selector: 'app-agile-metrics',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    BaseChartDirective,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './agile-metrics.html',
  styleUrl: './agile-metrics.scss',
})
export class AgileMetricsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  METRIC_DEFINITIONS = METRIC_DEFINITIONS;
  RADAR_DIMENSIONS = RADAR_DIMENSIONS;

  productivityForm!: FormGroup;
  qualityForm!: FormGroup;
  satisfactionForm!: FormGroup;
  processForm!: FormGroup;
  baselineForm!: FormGroup;
  settingsForm!: FormGroup;
  radarForm!: FormGroup;
  roiForm!: FormGroup;
  comparisonForm!: FormGroup;

  entries: MetricEntry[] = [];
  baseline: Record<string, BaselineGoal> = {};
  settings: AgileMetricsSettings = {} as AgileMetricsSettings;

  kpis: MetricKpi[] = [];
  metricLineCharts = new Map<string, ChartConfiguration<'line'>>();
  metricComparisonCharts = new Map<string, ChartConfiguration<'bar'>>();
  radarChart?: ChartConfiguration<'radar'>;
  roiChart?: ChartConfiguration<'line'>;

  historyColumns = ['date', 'category', 'values', 'notes', 'actions'];
  filterCategory: MetricCategory | 'todas' = 'todas';
  filterStart = '';
  filterEnd = '';

  editingEntry: MetricEntry | null = null;
  editForm?: FormGroup;

  comparisonResult?: {
    metricLabel: string;
    period1Average: number;
    period2Average: number;
    variationPercent: number;
  };

  slides = [
    { title: 'Transformação Ágil', subtitle: 'Relatório Executivo', key: 'cover' },
    { title: 'Resumo Executivo', subtitle: 'KPIs Principais', key: 'summary' },
    { title: 'Produtividade', subtitle: 'Evolução e Meta', key: 'produtividade' },
    { title: 'Qualidade', subtitle: 'Evolução e Meta', key: 'qualidade' },
    { title: 'Satisfação', subtitle: 'Clima e Stakeholders', key: 'satisfacao' },
    { title: 'Processo', subtitle: 'Disciplina e Rituais', key: 'processo' },
    { title: 'ROI e Projeções', subtitle: 'Custos x Ganhos', key: 'roi' },
    { title: 'Recomendações', subtitle: 'GO/NO-GO', key: 'recomendacoes' },
  ];
  currentSlideIndex = 0;

  constructor(private metricsService: AgileMetricsService, private fb: FormBuilder) {
    this.settings = this.metricsService.getSettingsSnapshot();
    this.baseline = this.metricsService.getBaselineSnapshot();

    this.productivityForm = this.buildCategoryForm('produtividade');
    this.qualityForm = this.buildCategoryForm('qualidade');
    this.satisfactionForm = this.buildCategoryForm('satisfacao');
    this.processForm = this.buildCategoryForm('processo');
    this.baselineForm = this.buildBaselineForm();
    this.settingsForm = this.buildSettingsForm();
    this.radarForm = this.buildRadarForm();
    this.roiForm = this.buildRoiForm();
    this.comparisonForm = this.buildComparisonForm();
  }

  ngOnInit(): void {
    this.metricsService.entries$.pipe(takeUntil(this.destroy$)).subscribe((entries) => {
      this.entries = entries;
      this.recalculateAll();
    });

    this.metricsService.baseline$.pipe(takeUntil(this.destroy$)).subscribe((baseline) => {
      this.baseline = baseline;
      this.baselineForm = this.buildBaselineForm();
      this.recalculateAll();
    });

    this.metricsService.settings$.pipe(takeUntil(this.destroy$)).subscribe((settings) => {
      this.settings = settings;
      this.settingsForm = this.buildSettingsForm();
      this.radarForm = this.buildRadarForm();
      this.roiForm = this.buildRoiForm();
      this.recalculateAll();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDefinitionsByCategory(category: MetricCategory | string): MetricDefinition[] {
    const key = category as MetricCategory;
    return METRIC_DEFINITIONS.filter((metric) => metric.category === key);
  }

  submitCategory(category: MetricCategory): void {
    const form = this.getFormByCategory(category);
    if (!form.valid) {
      form.markAllAsTouched();
      return;
    }

    const { date, notes, ...values } = form.value as Record<string, any>;
    const entry: MetricEntry = {
      id: crypto.randomUUID(),
      category,
      date: new Date(date).toISOString(),
      values: this.cleanValues(values),
      notes,
    };

    this.metricsService.addEntry(entry);
    form.reset();
  }

  saveBaseline(): void {
    const values = this.baselineForm.value as Record<string, any>;
    const updated: Record<string, BaselineGoal> = {};

    METRIC_DEFINITIONS.forEach((metric) => {
      const baseline = Number(values[`${metric.key}_baseline`] ?? 0);
      const goal = Number(values[`${metric.key}_goal`] ?? 0);
      updated[metric.key] = { baseline, goal };
    });

    this.metricsService.updateBaseline(updated);
  }

  saveSettings(): void {
    const formValue = this.settingsForm.value as Record<string, any>;
    const updated: AgileMetricsSettings = {
      ...this.settings,
      squadName: formValue['squadName'] ?? '',
      pilotStart: formValue['pilotStart'] ? new Date(formValue['pilotStart']).toISOString() : '',
      wave1: formValue['wave1'] ? new Date(formValue['wave1']).toISOString() : '',
      wave2: formValue['wave2'] ? new Date(formValue['wave2']).toISOString() : '',
      wave3: formValue['wave3'] ? new Date(formValue['wave3']).toISOString() : '',
      logoDataUrl: this.settings.logoDataUrl,
      radarBaseline: this.settings.radarBaseline,
      radarCurrent: this.settings.radarCurrent,
      roi: this.settings.roi,
    };

    this.metricsService.updateSettings(updated);
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const updated = { ...this.settings, logoDataUrl: reader.result as string };
      this.metricsService.updateSettings(updated);
    };
    reader.readAsDataURL(file);
  }

  saveRadar(): void {
    const baseline = { ...this.settings.radarBaseline };
    const current = { ...this.settings.radarCurrent };

    RADAR_DIMENSIONS.forEach((dimension) => {
      baseline[dimension] = Number(this.radarForm.value[`${dimension}_baseline`] ?? 0);
      current[dimension] = Number(this.radarForm.value[`${dimension}_current`] ?? 0);
    });

    this.metricsService.updateSettings({
      ...this.settings,
      radarBaseline: baseline,
      radarCurrent: current,
    });
  }

  saveRoi(): void {
    const formValue = this.roiForm.value as Record<string, any>;
    this.metricsService.updateSettings({
      ...this.settings,
      roi: {
        dysfunctionCosts: Number(formValue['dysfunctionCosts'] ?? 0),
        projectedGains: Number(formValue['projectedGains'] ?? 0),
        investment: Number(formValue['investment'] ?? 0),
      },
    });
  }

  startEdit(entry: MetricEntry): void {
    this.editingEntry = entry;
    this.editForm = this.buildEditForm(entry);
  }

  cancelEdit(): void {
    this.editingEntry = null;
    this.editForm = undefined;
  }

  saveEdit(): void {
    if (!this.editingEntry || !this.editForm?.valid) {
      return;
    }

    const formValue = this.editForm.value as Record<string, any>;
    const updated: MetricEntry = {
      ...this.editingEntry,
      date: new Date(formValue['date']).toISOString(),
      values: this.cleanValues(formValue['values']),
      notes: formValue['notes'],
    };

    this.metricsService.updateEntry(updated);
    this.cancelEdit();
  }

  deleteEntry(entry: MetricEntry): void {
    this.metricsService.deleteEntry(entry.id);
  }

  exportEntries(): void {
    const rows = this.entries.map((entry) => ({
      Data: entry.date,
      Categoria: entry.category,
      Notas: entry.notes ?? '',
      ...entry.values,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Metricas');
    XLSX.writeFile(workbook, 'metricas-agil.xlsx');
  }

  runComparison(): void {
    const formValue = this.comparisonForm.value as Record<string, any>;
    const metricKey = formValue['metricKey'] as string;
    const metric = METRIC_DEFINITIONS.find((item) => item.key === metricKey);

    if (
      !metric ||
      !formValue['start1'] ||
      !formValue['end1'] ||
      !formValue['start2'] ||
      !formValue['end2']
    ) {
      this.comparisonResult = undefined;
      return;
    }

    const period1 = this.getMetricAverage(metricKey, formValue['start1'], formValue['end1']);
    const period2 = this.getMetricAverage(metricKey, formValue['start2'], formValue['end2']);
    const variation = period1 === 0 ? 0 : ((period2 - period1) / period1) * 100;

    this.comparisonResult = {
      metricLabel: metric.label,
      period1Average: period1,
      period2Average: period2,
      variationPercent: variation,
    };
  }

  async generateWeeklyReport(): Promise<void> {
    await this.generatePdfFromElement('weekly-report', 'relatorio-semanal.pdf');
  }

  async generateCheckpointReport(): Promise<void> {
    await this.generatePdfFromElement('checkpoint-report', 'relatorio-checkpoint.pdf');
  }

  async generatePdfFromElement(elementId: string, fileName: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      return;
    }

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(fileName);
  }

  nextSlide(): void {
    this.currentSlideIndex = Math.min(this.currentSlideIndex + 1, this.slides.length - 1);
  }

  previousSlide(): void {
    this.currentSlideIndex = Math.max(this.currentSlideIndex - 1, 0);
  }

  enterFullscreen(): void {
    const container = document.getElementById('slides-container');
    container?.requestFullscreen();
  }

  getFilteredEntries(): MetricEntry[] {
    return this.entries.filter((entry) => {
      if (this.filterCategory !== 'todas' && entry.category !== this.filterCategory) {
        return false;
      }
      if (this.filterStart && new Date(entry.date) < new Date(this.filterStart)) {
        return false;
      }
      if (this.filterEnd && new Date(entry.date) > new Date(this.filterEnd)) {
        return false;
      }
      return true;
    });
  }

  getCategoryLabel(category: MetricCategory | string): string {
    const key = category as MetricCategory;
    const map: Record<MetricCategory, string> = {
      produtividade: 'Produtividade',
      qualidade: 'Qualidade',
      satisfacao: 'Satisfação',
      processo: 'Processo',
    };
    return map[key] ?? category;
  }

  getStatusIcon(status: MetricKpi['status']): string {
    if (status === 'success') {
      return '✅';
    }
    if (status === 'warning') {
      return '⚠️';
    }
    return '❌';
  }

  getGoNoGo(): { status: string; details: string[] } {
    const velocity = this.getKpiByKey('velocity');
    const bugs = this.getKpiByKey('bugsProd');
    const enps = this.getKpiByKey('enps');

    const checks = [
      { label: 'Velocity melhorou ≥ 15%', passed: (velocity?.evolutionPercent ?? 0) >= 15 },
      { label: 'Bugs reduziram ≥ 20%', passed: (bugs?.evolutionPercent ?? 0) <= -20 },
      { label: 'eNPS melhorou ≥ 20 pontos', passed: (enps?.evolutionPercent ?? 0) >= 20 },
    ];

    const passedCount = checks.filter((check) => check.passed).length;
    return {
      status: passedCount >= 2 ? 'GO para Onda 2' : 'NO-GO',
      details: checks.map((check) => `${check.passed ? '✅' : '❌'} ${check.label}`),
    };
  }

  getLineChart(metricKey: string): ChartConfiguration<'line'> | undefined {
    return this.metricLineCharts.get(metricKey);
  }

  getComparisonChart(metricKey: string): ChartConfiguration<'bar'> | undefined {
    return this.metricComparisonCharts.get(metricKey);
  }

  getRoiValue(): number {
    const { projectedGains, investment } = this.settings.roi;
    if (investment === 0) {
      return 0;
    }
    return ((projectedGains - investment) / investment) * 100;
  }

  private recalculateAll(): void {
    this.kpis = METRIC_DEFINITIONS.map((metric) => this.buildKpi(metric));
    this.buildCharts();
  }

  private buildKpi(metric: MetricDefinition): MetricKpi {
    const baseline = this.baseline[metric.key]?.baseline ?? 0;
    const goal = this.baseline[metric.key]?.goal ?? 0;
    const currentValue = this.getLatestMetricValue(metric.key);

    let evolutionPercent: number | null = null;
    if (currentValue !== null && baseline !== 0) {
      evolutionPercent = ((currentValue - baseline) / baseline) * 100;
    }

    const status = this.getKpiStatus(metric, currentValue, baseline, goal);

    return {
      definition: metric,
      currentValue,
      baseline,
      goal,
      evolutionPercent,
      status,
    };
  }

  private getKpiStatus(
    metric: MetricDefinition,
    currentValue: number | null,
    baseline: number,
    goal: number
  ): MetricKpi['status'] {
    if (currentValue === null) {
      return 'danger';
    }

    if (metric.higherIsBetter) {
      if (currentValue >= goal) {
        return 'success';
      }
      if (currentValue >= baseline) {
        return 'warning';
      }
      return 'danger';
    }

    if (currentValue <= goal) {
      return 'success';
    }
    if (currentValue <= baseline) {
      return 'warning';
    }
    return 'danger';
  }

  private buildCharts(): void {
    this.metricLineCharts.clear();
    this.metricComparisonCharts.clear();

    METRIC_DEFINITIONS.forEach((metric) => {
      this.metricLineCharts.set(metric.key, this.buildLineChart(metric));
      this.metricComparisonCharts.set(metric.key, this.buildComparisonChart(metric));
    });

    this.radarChart = this.buildRadarChart();
    this.roiChart = this.buildRoiChart();
  }

  private buildLineChart(metric: MetricDefinition): ChartConfiguration<'line'> {
    const series = this.getMetricSeries(metric.key);
    const baselineValue = this.baseline[metric.key]?.baseline ?? 0;
    const goalValue = this.baseline[metric.key]?.goal ?? 0;

    const datasets: ChartDataset<'line'>[] = [
      {
        data: series.map(() => baselineValue),
        label: 'Baseline',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        tension: 0.3,
      },
      {
        data: series.map(() => goalValue),
        label: 'Meta',
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        tension: 0.3,
      },
      {
        data: series.map((item) => item.value),
        label: 'Real',
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.15)',
        tension: 0.3,
      },
    ];

    return {
      type: 'line',
      data: {
        labels: series.map((item) => item.label),
        datasets,
      },
      options: this.baseLineOptions(metric.unit),
    };
  }

  private buildComparisonChart(metric: MetricDefinition): ChartConfiguration<'bar'> {
    const currentValue = this.getLatestMetricValue(metric.key) ?? 0;
    const baselineValue = this.baseline[metric.key]?.baseline ?? 0;

    const datasets: ChartDataset<'bar'>[] = [
      {
        data: [baselineValue],
        label: 'Baseline',
        backgroundColor: '#94a3b8',
      },
      {
        data: [currentValue],
        label: 'Atual',
        backgroundColor: currentValue >= baselineValue ? '#22c55e' : '#ef4444',
      },
    ];

    return {
      type: 'bar',
      data: {
        labels: [metric.label],
        datasets,
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: true },
        },
      },
    };
  }

  private buildRadarChart(): ChartConfiguration<'radar'> {
    return {
      type: 'radar',
      data: {
        labels: RADAR_DIMENSIONS,
        datasets: [
          {
            data: RADAR_DIMENSIONS.map((dimension) => this.settings.radarBaseline[dimension] ?? 0),
            label: 'Baseline',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
          },
          {
            data: RADAR_DIMENSIONS.map((dimension) => this.settings.radarCurrent[dimension] ?? 0),
            label: 'Atual',
            backgroundColor: 'rgba(249, 115, 22, 0.2)',
            borderColor: '#f97316',
          },
        ],
      },
      options: {
        responsive: true,
      },
    };
  }

  private buildRoiChart(): ChartConfiguration<'line'> {
    const weeks = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];
    const dysfunction = this.settings.roi.dysfunctionCosts;
    const gains = this.settings.roi.projectedGains;
    const investment = this.settings.roi.investment;

    return {
      type: 'line',
      data: {
        labels: weeks,
        datasets: [
          {
            data: weeks.map(() => dysfunction),
            label: 'Custos da disfunção',
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.3)',
            fill: true,
          },
          {
            data: weeks.map(() => gains),
            label: 'Ganhos projetados',
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.3)',
            fill: true,
          },
          {
            data: weeks.map(() => investment),
            label: 'Investimento necessário',
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.3)',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
      },
    };
  }

  private baseLineOptions(unit: string): ChartOptions<'line'> {
    return {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      },
      scales: {
        y: {
          title: { display: true, text: unit },
        },
      },
    };
  }

  getLatestMetricValue(metricKey: string): number | null {
    const entry = this.entries
      .filter((item) => metricKey in item.values)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return entry ? Number(entry.values[metricKey]) : null;
  }

  private getMetricSeries(metricKey: string): Array<{ label: string; value: number }> {
    const sorted = this.entries
      .filter((item) => metricKey in item.values)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sorted.map((entry, index) => ({
      label: `Sem ${index + 1}`,
      value: Number(entry.values[metricKey]),
    }));
  }

  private buildCategoryForm(category: MetricCategory): FormGroup {
    const group = this.fb.group({
      date: ['', Validators.required],
      notes: [''],
    }) as unknown as FormGroup<Record<string, any>>;

    this.getDefinitionsByCategory(category).forEach((metric) => {
      group.addControl(metric.key, this.fb.control('', Validators.required));
    });

    return group;
  }

  private buildBaselineForm(): FormGroup {
    const group = this.fb.group({}) as FormGroup<Record<string, any>>;
    METRIC_DEFINITIONS.forEach((metric) => {
      const baseline = this.baseline[metric.key]?.baseline ?? 0;
      const goal = this.baseline[metric.key]?.goal ?? 0;
      group.addControl(`${metric.key}_baseline`, this.fb.control(baseline, Validators.required));
      group.addControl(`${metric.key}_goal`, this.fb.control(goal, Validators.required));
    });
    return group;
  }

  private buildSettingsForm(): FormGroup {
    return this.fb.group({
      squadName: [this.settings.squadName, Validators.required],
      pilotStart: [this.settings.pilotStart ? new Date(this.settings.pilotStart) : ''],
      wave1: [this.settings.wave1 ? new Date(this.settings.wave1) : ''],
      wave2: [this.settings.wave2 ? new Date(this.settings.wave2) : ''],
      wave3: [this.settings.wave3 ? new Date(this.settings.wave3) : ''],
    });
  }

  private buildRadarForm(): FormGroup {
    const group = this.fb.group({}) as FormGroup<Record<string, any>>;
    RADAR_DIMENSIONS.forEach((dimension) => {
      group.addControl(
        `${dimension}_baseline`,
        this.fb.control(this.settings.radarBaseline[dimension] ?? 3, Validators.required)
      );
      group.addControl(
        `${dimension}_current`,
        this.fb.control(this.settings.radarCurrent[dimension] ?? 3, Validators.required)
      );
    });
    return group;
  }

  private buildRoiForm(): FormGroup {
    return this.fb.group({
      dysfunctionCosts: [this.settings.roi.dysfunctionCosts, Validators.required],
      projectedGains: [this.settings.roi.projectedGains, Validators.required],
      investment: [this.settings.roi.investment, Validators.required],
    });
  }

  private buildComparisonForm(): FormGroup {
    return this.fb.group({
      metricKey: ['velocity', Validators.required],
      start1: ['', Validators.required],
      end1: ['', Validators.required],
      start2: ['', Validators.required],
      end2: ['', Validators.required],
    });
  }

  private buildEditForm(entry: MetricEntry): FormGroup {
    return this.fb.group({
      date: [new Date(entry.date), Validators.required],
      notes: [entry.notes ?? ''],
      values: this.fb.group({
        ...Object.keys(entry.values).reduce((acc, key) => {
          acc[key] = this.fb.control(entry.values[key], Validators.required);
          return acc;
        }, {} as Record<string, any>),
      }),
    });
  }

  private getFormByCategory(category: MetricCategory): FormGroup {
    switch (category) {
      case 'produtividade':
        return this.productivityForm;
      case 'qualidade':
        return this.qualityForm;
      case 'satisfacao':
        return this.satisfactionForm;
      case 'processo':
        return this.processForm;
    }
  }

  private cleanValues(values: Record<string, any>): Record<string, number> {
    return Object.keys(values).reduce((acc, key) => {
      acc[key] = Number(values[key] ?? 0);
      return acc;
    }, {} as Record<string, number>);
  }

  private getMetricAverage(metricKey: string, start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const values = this.entries
      .filter((entry) => new Date(entry.date) >= startDate && new Date(entry.date) <= endDate)
      .map((entry) => entry.values[metricKey])
      .filter((value) => value !== undefined) as number[];

    if (!values.length) {
      return 0;
    }

    const sum = values.reduce((acc, value) => acc + Number(value), 0);
    return sum / values.length;
  }

  private getKpiByKey(key: string): MetricKpi | undefined {
    return this.kpis.find((kpi) => kpi.definition.key === key);
  }
}
