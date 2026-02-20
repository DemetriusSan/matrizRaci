import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SecurityAnalysis, RiskLevel } from './models/security-risk.models';
import { SecurityRiskService } from './services/security-risk.service';
import { RiskEngineService } from './risk-engine/risk-engine.service';
import { AnalysisFormComponent } from './components/analysis-form/analysis-form.component';
import { ChecklistComponent } from './components/checklist/checklist.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

/**
 * Shell do Security Risk Management Module
 *
 * Gerencia 4 views internas:
 *   - dashboard: visão executiva agregada
 *   - list: lista de todas as análises
 *   - form: criação/edição de análise
 *   - checklist: checklist detalhado de um análise
 *
 * Decisão: roteamento interno por estado de componente (sem filho de router)
 * para simplificar e permitir uso como modal em apps maiores.
 * Para escalar: mover para routes filhas do security-risk.routes.ts.
 */
@Component({
  selector: 'app-security-risk',
  standalone: true,
  imports: [
    CommonModule,
    AnalysisFormComponent,
    ChecklistComponent,
    DashboardComponent,
  ],
  templateUrl: './security-risk.component.html',
  styleUrls: ['./security-risk.component.scss'],
})
export class SecurityRiskComponent implements OnInit, OnDestroy {
  currentView: 'dashboard' | 'list' | 'form' | 'checklist' = 'dashboard';
  analyses: SecurityAnalysis[] = [];
  selectedAnalysisId: string | undefined;
  editingAnalysisId: string | undefined;

  private destroy$ = new Subject<void>();

  constructor(
    public service: SecurityRiskService,
    public riskEngine: RiskEngineService,
  ) {}

  ngOnInit(): void {
    this.service.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => (this.analyses = list));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Navegação ─────────────────────────────────────────────────────────
  goTo(view: typeof this.currentView): void {
    this.currentView = view;
  }

  openNew(): void {
    this.editingAnalysisId = undefined;
    this.currentView = 'form';
  }

  openEdit(id: string): void {
    this.editingAnalysisId = id;
    this.currentView = 'form';
  }

  openChecklist(id: string): void {
    this.selectedAnalysisId = id;
    this.currentView = 'checklist';
  }

  onFormSaved(analysis: SecurityAnalysis): void {
    this.selectedAnalysisId = analysis.id;
    this.currentView = 'list';
  }

  onFormCanceled(): void {
    this.currentView = 'list';
  }

  deleteAnalysis(id: string, event: MouseEvent): void {
    event.stopPropagation();
    if (confirm('Remover esta análise permanentemente?')) {
      this.service.delete(id);
    }
  }

  downloadReport(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.service.downloadReport(id);
  }

  // ── Helpers de template ───────────────────────────────────────────────
  getRiskColor(analysis: SecurityAnalysis): string {
    if (!analysis.riskAssessment) return '#6c757d';
    return this.riskEngine.getRiskColor(analysis.riskAssessment.riskLevel);
  }

  getRiskIcon(analysis: SecurityAnalysis): string {
    if (!analysis.riskAssessment) return '⚪';
    return this.riskEngine.getRiskIcon(analysis.riskAssessment.riskLevel);
  }

  isCritical(analysis: SecurityAnalysis): boolean {
    return analysis.riskAssessment?.riskLevel === RiskLevel.CRITICAL;
  }

  countVulns(analysis: SecurityAnalysis): number {
    return analysis.checklist.filter(i => i.status === 'Vulnerável').length;
  }

  countApproved(analysis: SecurityAnalysis): number {
    return analysis.checklist.filter(i => i.status === 'Aprovado').length;
  }
}
