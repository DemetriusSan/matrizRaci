import { Component, OnInit, OnDestroy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, switchMap, filter, takeUntil } from 'rxjs';
import {
  SecurityAnalysis, SecurityChecklistItem,
  ChecklistStatus, Severity, CheckCategory, RiskLevel,
} from '../../models/security-risk.models';
import { SecurityRiskService } from '../../services/security-risk.service';
import { RiskEngineService } from '../../risk-engine/risk-engine.service';

/**
 * Componente de Checklist de Segurança
 *
 * Exibe e gerencia todos os itens do checklist OWASP + financeiro
 * para uma análise específica. Agrupado por categoria para melhor UX.
 *
 * Decisão: atualiza item por item via service para manter
 * audit trail completo no changeHistory.
 */
@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
})
export class ChecklistComponent implements OnInit, OnDestroy {
  analysisId = input.required<string>();

  analysis: SecurityAnalysis | null = null;
  groupedItems: { category: string; items: SecurityChecklistItem[] }[] = [];
  expandedCategories = new Set<string>();

  // Upload mock
  pendingEvidenceItemId: string | null = null;
  mockUploadInProgress = false;

  readonly statusOptions  = Object.values(ChecklistStatus);
  readonly severityColors: Record<Severity, string> = {
    [Severity.LOW]:      '#28a745',
    [Severity.MEDIUM]:   '#ffc107',
    [Severity.HIGH]:     '#fd7e14',
    [Severity.CRITICAL]: '#dc3545',
  };
  readonly statusColors: Record<ChecklistStatus, string> = {
    [ChecklistStatus.NOT_STARTED]: '#6c757d',
    [ChecklistStatus.IN_PROGRESS]: '#2196F3',
    [ChecklistStatus.APPROVED]:    '#28a745',
    [ChecklistStatus.VULNERABLE]:  '#dc3545',
  };

  private destroy$ = new Subject<void>();

  constructor(
    private service: SecurityRiskService,
    public riskEngine: RiskEngineService,
  ) {}

  ngOnInit(): void {
    this.service.getById(this.analysisId())
      .pipe(
        filter(Boolean),
        takeUntil(this.destroy$)
      )
      .subscribe(analysis => {
        this.analysis = analysis;
        this._buildGroups(analysis.checklist);
        // Expande todas as categorias por padrão
        this.groupedItems.forEach(g => this.expandedCategories.add(g.category));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleCategory(category: string): void {
    if (this.expandedCategories.has(category)) {
      this.expandedCategories.delete(category);
    } else {
      this.expandedCategories.add(category);
    }
  }

  isCategoryExpanded(category: string): boolean {
    return this.expandedCategories.has(category);
  }

  /** Atualiza status do item e persiste via service */
  onStatusChange(item: SecurityChecklistItem, newStatus: ChecklistStatus): void {
    this.service.updateChecklistItem(this.analysisId(), item.id, { status: newStatus });
  }

  /** Salva evidência textual */
  onEvidenceBlur(item: SecurityChecklistItem, evidence: string): void {
    this.service.updateChecklistItem(this.analysisId(), item.id, { evidence });
  }

  /** Simula upload de evidência (arquivo) */
  onEvidenceFileChange(item: SecurityChecklistItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    this.mockUploadInProgress = true;
    this.pendingEvidenceItemId = item.id;

    // Simula delay de upload (substituir por HttpClient em produção)
    setTimeout(() => {
      this.service.updateChecklistItem(this.analysisId(), item.id, {
        evidenceFileName: `[Upload] ${file.name}`,
      });
      this.mockUploadInProgress = false;
      this.pendingEvidenceItemId = null;
    }, 800);
  }

  /** Retorna contagem de vulnerabilidades na categoria */
  countVulnerable(items: SecurityChecklistItem[]): number {
    return items.filter(i => i.status === ChecklistStatus.VULNERABLE).length;
  }

  countApproved(items: SecurityChecklistItem[]): number {
    return items.filter(i => i.status === ChecklistStatus.APPROVED).length;
  }

  /** Progresso (%) de itens concluídos (aprovados ou vulneráveis = testados) */
  categoryProgress(items: SecurityChecklistItem[]): number {
    const done = items.filter(i =>
      i.status === ChecklistStatus.APPROVED || i.status === ChecklistStatus.VULNERABLE
    ).length;
    return items.length ? Math.round((done / items.length) * 100) : 0;
  }

  totalProgress(): number {
    if (!this.analysis) return 0;
    const all = this.analysis.checklist;
    const done = all.filter(i =>
      i.status === ChecklistStatus.APPROVED || i.status === ChecklistStatus.VULNERABLE
    ).length;
    return all.length ? Math.round((done / all.length) * 100) : 0;
  }

  getRiskColor(): string {
    if (!this.analysis?.riskAssessment) return '#6c757d';
    return this.riskEngine.getRiskColor(this.analysis.riskAssessment.riskLevel);
  }

  getRiskIcon(): string {
    if (!this.analysis?.riskAssessment) return '⚪';
    return this.riskEngine.getRiskIcon(this.analysis.riskAssessment.riskLevel);
  }

  private _buildGroups(items: SecurityChecklistItem[]): void {
    const map = new Map<string, SecurityChecklistItem[]>();
    for (const item of items) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    this.groupedItems = Array.from(map.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  }
}
