/**
 * SecurityRiskService — Camada de Infraestrutura / Acesso a Dados
 *
 * Decisão arquitetural:
 *   - Usa BehaviorSubject como store local (RxJS) — evolui facilmente
 *     para NgRx ou Signals sem mudança nos componentes consumidores.
 *   - Mock de backend via localStorage para persistência entre sessões
 *     de desenvolvimento. Substitua os métodos privados por chamadas
 *     HttpClient para integração com backend real.
 *
 * Para integração real com backend:
 *   1. Injete HttpClient
 *   2. Substitua _loadFromStorage() por GET /api/security-analyses
 *   3. Substitua _persist() por POST/PUT /api/security-analyses/:id
 *   4. Mantenha a interface pública idêntica — zero impacto nos componentes.
 */
import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  SecurityAnalysis,
  SecurityChecklistItem,
  DashboardData,
  ChecklistStatus,
  Severity,
  RiskLevel,
  SprintScore,
  ChangeHistoryEntry,
  HttpMethod,
  AuthType,
  DataSensitivity,
  SystemImpacted,
} from '../models/security-risk.models';
import { generateChecklist } from '../models/checklist-template';
import { RiskEngineService } from '../risk-engine/risk-engine.service';

const STORAGE_KEY = 'security_risk_analyses';

@Injectable({ providedIn: 'root' })
export class SecurityRiskService {

  // ── Estado central (Observable store pattern) ─────────────────────────
  private readonly _analyses$ = new BehaviorSubject<SecurityAnalysis[]>(this._loadFromStorage());

  /** Stream público somente-leitura das análises */
  readonly analyses$: Observable<SecurityAnalysis[]> = this._analyses$.asObservable();

  /** Signal para uso em componentes Standalone com OnPush */
  readonly analysisCount = signal(this._analyses$.value.length);

  constructor(private riskEngine: RiskEngineService) {}

  // ─────────────────────────────────────────────────────────────────────
  // LEITURA
  // ─────────────────────────────────────────────────────────────────────

  getAll(): Observable<SecurityAnalysis[]> {
    return this.analyses$;
  }

  getById(id: string): Observable<SecurityAnalysis | undefined> {
    return this.analyses$.pipe(
      map(list => list.find(a => a.id === id))
    );
  }

  /** Retorna análises com risco crítico – usado no dashboard */
  getCriticalAnalyses(): Observable<SecurityAnalysis[]> {
    return this.analyses$.pipe(
      map(list =>
        list.filter(a => a.riskAssessment?.riskLevel === RiskLevel.CRITICAL)
      )
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // ESCRITA
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Cria uma nova análise de segurança com checklist padrão gerado.
   * O risco é recalculado automaticamente após a criação.
   */
  create(partial: Partial<SecurityAnalysis>): SecurityAnalysis {
    const now = new Date();
    const newAnalysis: SecurityAnalysis = {
      id: this._generateId(),
      userStoryId: partial.userStoryId ?? '',
      featureName: partial.featureName ?? '',
      sprint: partial.sprint ?? '',
      systemsImpacted: partial.systemsImpacted ?? [],
      apiSurface: partial.apiSurface ?? {
        endpoint: '',
        method: HttpMethod.GET,
        requiresAuth: false,
        authType: AuthType.NONE,
        requiresRoleAuthorization: false,
        movesFinancialValue: false,
        dataSensitivity: DataSensitivity.LOW,
      },
      mqIntegration: partial.mqIntegration ?? {
        checksMessageIntegrity: false,
        checksSchemaOnMainframeEntry: false,
        hasIdempotencyKey: false,
        hasReplayProtection: false,
        hasDeadLetterQueue: false,
      },
      checklist: generateChecklist(),
      riskAssessment: null,
      hasSecurityDebt: partial.hasSecurityDebt ?? false,
      requiresPentest: partial.requiresPentest ?? false,
      requiresThreatModeling: partial.requiresThreatModeling ?? false,
      notes: partial.notes ?? '',
      changeHistory: [{
        timestamp: now,
        user: this._getCurrentUser(),
        action: 'Análise criada',
      }],
      createdAt: now,
      updatedAt: now,
      createdBy: this._getCurrentUser(),
    };

    // Calcula risco inicial
    newAnalysis.riskAssessment = this.riskEngine.calculateRisk(newAnalysis);

    const current = this._analyses$.value;
    const updated = [...current, newAnalysis];
    this._emit(updated);
    return newAnalysis;
  }

  /** Atualiza campos da análise e recalcula o risco */
  update(id: string, changes: Partial<SecurityAnalysis>): void {
    const current = this._analyses$.value;
    const idx = current.findIndex(a => a.id === id);
    if (idx === -1) return;

    const original = current[idx];
    const historyEntry: ChangeHistoryEntry = {
      timestamp: new Date(),
      user: this._getCurrentUser(),
      action: 'Análise atualizada',
    };

    const updated: SecurityAnalysis = {
      ...original,
      ...changes,
      id,
      updatedAt: new Date(),
      changeHistory: [...original.changeHistory, historyEntry],
    };

    // Recalcula risco após qualquer mudança
    updated.riskAssessment = this.riskEngine.calculateRisk(updated);

    const newList = [...current];
    newList[idx] = updated;
    this._emit(newList);
  }

  /** Atualiza item específico do checklist e recalcula risco global */
  updateChecklistItem(
    analysisId: string,
    itemId: string,
    changes: Partial<SecurityChecklistItem>
  ): void {
    const current = this._analyses$.value;
    const idx = current.findIndex(a => a.id === analysisId);
    if (idx === -1) return;

    const analysis = current[idx];
    const updatedChecklist = analysis.checklist.map(item =>
      item.id === itemId ? { ...item, ...changes } : item
    );

    const historyEntry: ChangeHistoryEntry = {
      timestamp: new Date(),
      user: this._getCurrentUser(),
      action: `Checklist atualizado: ${changes.status ?? 'item modificado'}`,
      field: itemId,
    };

    const updatedAnalysis: SecurityAnalysis = {
      ...analysis,
      checklist: updatedChecklist,
      updatedAt: new Date(),
      changeHistory: [...analysis.changeHistory, historyEntry],
    };
    updatedAnalysis.riskAssessment = this.riskEngine.calculateRisk(updatedAnalysis);

    const newList = [...current];
    newList[idx] = updatedAnalysis;
    this._emit(newList);
  }

  delete(id: string): void {
    const updated = this._analyses$.value.filter(a => a.id !== id);
    this._emit(updated);
  }

  /** Recalcula risco de todas as análises (útil após mudança de pesos) */
  recalculateAllRisks(): void {
    const updated = this._analyses$.value.map(a => ({
      ...a,
      riskAssessment: this.riskEngine.calculateRisk(a),
    }));
    this._emit(updated);
  }

  // ─────────────────────────────────────────────────────────────────────
  // EXPORTAÇÃO
  // ─────────────────────────────────────────────────────────────────────

  exportAsJSON(id?: string): string {
    const data = id
      ? this._analyses$.value.find(a => a.id === id)
      : this._analyses$.value;
    return JSON.stringify(data, null, 2);
  }

  downloadReport(id?: string): void {
    const json = this.exportAsJSON(id);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${id ?? 'all'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ─────────────────────────────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────────────────────────────

  getDashboardData(): Observable<DashboardData> {
    return this.analyses$.pipe(
      map(analyses => this._aggregateDashboard(analyses))
    );
  }

  private _aggregateDashboard(analyses: SecurityAnalysis[]): DashboardData {
    const vulnBySeverity = {
      [Severity.LOW]: 0, [Severity.MEDIUM]: 0,
      [Severity.HIGH]: 0, [Severity.CRITICAL]: 0,
    };
    const vulnByCategory: Record<string, number> = {};
    const statusDist = {
      [ChecklistStatus.NOT_STARTED]: 0,
      [ChecklistStatus.IN_PROGRESS]: 0,
      [ChecklistStatus.APPROVED]: 0,
      [ChecklistStatus.VULNERABLE]: 0,
    };

    let totalScore = 0;
    const sprintMap = new Map<string, { total: number; count: number }>();

    for (const a of analyses) {
      // Score por sprint
      if (a.riskAssessment) {
        totalScore += a.riskAssessment.riskScore;
        const prev = sprintMap.get(a.sprint) ?? { total: 0, count: 0 };
        sprintMap.set(a.sprint, {
          total: prev.total + a.riskAssessment.riskScore,
          count: prev.count + 1,
        });
      }

      // Métricas de checklist
      for (const item of a.checklist) {
        statusDist[item.status] = (statusDist[item.status] ?? 0) + 1;
        if (item.status === ChecklistStatus.VULNERABLE) {
          vulnBySeverity[item.severity] = (vulnBySeverity[item.severity] ?? 0) + 1;
          vulnByCategory[item.category] = (vulnByCategory[item.category] ?? 0) + 1;
        }
      }
    }

    const scoreBySprintData: SprintScore[] = Array.from(sprintMap.entries())
      .map(([sprint, { total, count }]) => ({
        sprint,
        averageScore: Math.round(total / count),
        analysisCount: count,
      }))
      .sort((a, b) => a.sprint.localeCompare(b.sprint));

    return {
      totalAnalyses: analyses.length,
      criticalRiskCount: analyses.filter(a => a.riskAssessment?.riskLevel === RiskLevel.CRITICAL).length,
      highRiskCount: analyses.filter(a => a.riskAssessment?.riskLevel === RiskLevel.HIGH).length,
      averageRiskScore: analyses.length
        ? Math.round(totalScore / analyses.length)
        : 0,
      vulnerabilitiesBySeverity: vulnBySeverity,
      vulnerabilitiesByCategory: vulnByCategory,
      criticalStories: analyses.filter(a => a.riskAssessment?.riskLevel === RiskLevel.CRITICAL),
      scoreBySprintData,
      statusDistribution: statusDist,
    };
  }

  // ─────────────────────────────────────────────────────────────────────
  // INFRAESTRUTURA / MOCK BACKEND
  // ─────────────────────────────────────────────────────────────────────

  private _emit(list: SecurityAnalysis[]): void {
    this._analyses$.next(list);
    this.analysisCount.set(list.length);
    this._persist(list);
  }

  /** Persiste em localStorage — substituir por POST/PUT HTTP em produção */
  private _persist(analyses: SecurityAnalysis[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
    } catch {
      console.warn('[SecurityRiskService] Falha ao persistir no localStorage');
    }
  }

  /** Carrega do localStorage — substituir por GET HTTP em produção */
  private _loadFromStorage(): SecurityAnalysis[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this._seedMockData();
      const parsed = JSON.parse(raw) as SecurityAnalysis[];
      // Reidrata datas que o JSON não tipa automaticamente
      return parsed.map(a => ({
        ...a,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt),
        riskAssessment: a.riskAssessment
          ? { ...a.riskAssessment, calculatedAt: new Date(a.riskAssessment.calculatedAt) }
          : null,
        changeHistory: a.changeHistory.map(h => ({
          ...h, timestamp: new Date(h.timestamp),
        })),
      }));
    } catch {
      return this._seedMockData();
    }
  }

  /** Gera dados de exemplo para demonstração */
  private _seedMockData(): SecurityAnalysis[] {
    const a1: SecurityAnalysis = {
      id: 'anlz-001',
      userStoryId: 'US-4521',
      featureName: 'Transferência Bancária via PIX',
      sprint: 'Sprint 12',
      systemsImpacted: [SystemImpacted.WEB, SystemImpacted.API, SystemImpacted.MQ, SystemImpacted.MAINFRAME],
      apiSurface: {
        endpoint: '/api/v1/pix/transfer',
        method: HttpMethod.POST,
        requiresAuth: true,
        authType: AuthType.JWT,
        requiresRoleAuthorization: true,
        movesFinancialValue: true,
        dataSensitivity: DataSensitivity.CRITICAL,
      },
      mqIntegration: {
        checksMessageIntegrity: false,
        checksSchemaOnMainframeEntry: true,
        hasIdempotencyKey: false,
        hasReplayProtection: false,
        hasDeadLetterQueue: true,
      },
      checklist: generateChecklist().map((item, i) =>
        i === 0
          ? { ...item, status: ChecklistStatus.VULNERABLE, evidence: 'Foi possível acessar transações de outro CPF via IDOR' }
          : item
      ),
      riskAssessment: null,
      hasSecurityDebt: true,
      requiresPentest: true,
      requiresThreatModeling: true,
      notes: 'Endpoint crítico de movimentação financeira. Exige pentest antes do go-live.',
      changeHistory: [{ timestamp: new Date(), user: 'qa.engineer@banco.com', action: 'Análise criada (seed)' }],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'qa.engineer@banco.com',
    };

    const a2: SecurityAnalysis = {
      id: 'anlz-002',
      userStoryId: 'US-4789',
      featureName: 'Consulta de Extrato Mobile',
      sprint: 'Sprint 12',
      systemsImpacted: [SystemImpacted.MOBILE, SystemImpacted.API],
      apiSurface: {
        endpoint: '/api/v1/account/statement',
        method: HttpMethod.GET,
        requiresAuth: true,
        authType: AuthType.OAUTH2,
        requiresRoleAuthorization: false,
        movesFinancialValue: false,
        dataSensitivity: DataSensitivity.HIGH,
      },
      mqIntegration: {
        checksMessageIntegrity: true,
        checksSchemaOnMainframeEntry: true,
        hasIdempotencyKey: true,
        hasReplayProtection: true,
        hasDeadLetterQueue: true,
      },
      checklist: generateChecklist(),
      riskAssessment: null,
      hasSecurityDebt: false,
      requiresPentest: false,
      requiresThreatModeling: false,
      notes: '',
      changeHistory: [{ timestamp: new Date(), user: 'qa.lead@banco.com', action: 'Análise criada (seed)' }],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'qa.lead@banco.com',
    };

    const riskEngine = new RiskEngineService();
    a1.riskAssessment = riskEngine.calculateRisk(a1);
    a2.riskAssessment = riskEngine.calculateRisk(a2);

    return [a1, a2];
  }

  private _generateId(): string {
    return `anlz-${Date.now()}`;
  }

  /** Simulação de usuário autenticado — substituir por AuthService real */
  private _getCurrentUser(): string {
    return 'qa.user@banco.com';
  }
}

//Para integrar com backend real
//Substitua apenas os 2 métodos privados em security-risk.service.ts:
//private _persist(analyses)  → this.http.put('/api/security-analyses', analyses)
//private _loadFromStorage()  → this.http.get<SecurityAnalysis[]>('/api/security-analyses')
