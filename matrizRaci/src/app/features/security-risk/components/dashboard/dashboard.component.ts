import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { DashboardData, SecurityAnalysis, RiskLevel, Severity, ChecklistStatus } from '../../models/security-risk.models';
import { SecurityRiskService } from '../../services/security-risk.service';
import { RiskEngineService } from '../../risk-engine/risk-engine.service';

/**
 * Dashboard Executivo de Segurança
 *
 * Decisão arquitetural: gráficos renderizados com CSS/SVG inline para
 * evitar dependência de biblioteca de terceiros. Para ambientes corporativos
 * com ng2-charts instalado, substituir os métodos de gráfico por
 * ChartConfiguration do Chart.js (zero impacto na lógica de dados).
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  data: DashboardData | null = null;
  loading = true;

  private destroy$ = new Subject<void>();

  readonly Severity = Severity;
  readonly ChecklistStatus = ChecklistStatus;
  readonly RiskLevel = RiskLevel;

  readonly severityColors: Record<Severity, string> = {
    [Severity.LOW]:      '#28a745',
    [Severity.MEDIUM]:   '#ffc107',
    [Severity.HIGH]:     '#fd7e14',
    [Severity.CRITICAL]: '#dc3545',
  };
  readonly riskColors: Record<RiskLevel, string> = {
    [RiskLevel.LOW]:      '#28a745',
    [RiskLevel.MEDIUM]:   '#ffc107',
    [RiskLevel.HIGH]:     '#fd7e14',
    [RiskLevel.CRITICAL]: '#dc3545',
  };

  constructor(
    private service: SecurityRiskService,
    public riskEngine: RiskEngineService,
  ) {}

  ngOnInit(): void {
    this.service.getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.data = data;
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Métodos auxiliares para template ──────────────────────────────────

  severityEntries(): { key: Severity; value: number }[] {
    if (!this.data) return [];
    return Object.entries(this.data.vulnerabilitiesBySeverity)
      .filter(([, v]) => v > 0)
      .map(([key, value]) => ({ key: key as Severity, value }));
  }

  categoryEntries(): { key: string; value: number }[] {
    if (!this.data) return [];
    return Object.entries(this.data.vulnerabilitiesByCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({ key, value }));
  }

  maxCategoryValue(): number {
    const entries = this.categoryEntries();
    return entries.length ? Math.max(...entries.map(e => e.value)) : 1;
  }

  maxSprintScore(): number {
    if (!this.data?.scoreBySprintData.length) return 100;
    return Math.max(...this.data.scoreBySprintData.map(s => s.averageScore));
  }

  statusEntries(): { key: ChecklistStatus; value: number }[] {
    if (!this.data) return [];
    return Object.entries(this.data.statusDistribution)
      .map(([key, value]) => ({ key: key as ChecklistStatus, value }));
  }

  totalChecklistItems(): number {
    if (!this.data) return 1;
    return Object.values(this.data.statusDistribution).reduce((a, b) => a + b, 0) || 1;
  }

  statusColor(status: ChecklistStatus): string {
    const map: Record<ChecklistStatus, string> = {
      [ChecklistStatus.NOT_STARTED]: '#6c757d',
      [ChecklistStatus.IN_PROGRESS]: '#2196F3',
      [ChecklistStatus.APPROVED]:    '#28a745',
      [ChecklistStatus.VULNERABLE]:  '#dc3545',
    };
    return map[status] ?? '#999';
  }

  scoreColor(score: number): string {
    return this.riskEngine.getRiskColor(this.riskEngine.scoreToLevel(score));
  }

  downloadFullReport(): void {
    this.service.downloadReport();
  }

  getRiskIcon(level: RiskLevel): string {
    return this.riskEngine.getRiskIcon(level);
  }

  getRiskColor(level: RiskLevel): string {
    return this.riskEngine.getRiskColor(level);
  }
}
