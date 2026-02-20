/**
 * Motor de Cálculo de Risco de Segurança
 *
 * Decisão arquitetural: isolado como serviço puro (sem estado, sem deps Angular)
 * para facilitar unit testing e reutilização independente de framework.
 *
 * Algoritmo:
 *   score = sensitivityScore + financialScore + authScore + vulnScore + mqScore
 *   score é normalizado entre 0–100 e mapeado para RiskLevel.
 *
 * Injeção de pesos configuráveis permite ajuste sem recompilação.
 */
import { Injectable } from '@angular/core';
import {
  SecurityAnalysis,
  SecurityChecklistItem,
  RiskAssessment,
  RiskLevel,
  RiskWeights,
  RiskScoreBreakdown,
  DEFAULT_RISK_WEIGHTS,
  ChecklistStatus,
  Severity,
  DataSensitivity,
  MQIntegrationCheck,
} from '../models/security-risk.models';

@Injectable({ providedIn: 'root' })
export class RiskEngineService {

  /**
   * Score máximo teórico (usado para normalização).
   * Calculado com base nos pesos configurados.
   */
  private readonly MAX_SCORE = 100;

  /**
   * Calcula a avaliação de risco completa para uma análise de segurança.
   * Retorna RiskAssessment com score, nível e breakdown detalhado.
   */
  calculateRisk(
    analysis: SecurityAnalysis,
    weights: RiskWeights = DEFAULT_RISK_WEIGHTS
  ): RiskAssessment {
    const { apiSurface, checklist, mqIntegration } = analysis;

    // ── 1. Score de sensibilidade dos dados ──────────────────────────────
    const sensitivityScore = weights.sensitivity[apiSurface.dataSensitivity] ?? 0;

    // ── 2. Score financeiro ───────────────────────────────────────────────
    const financialScore = apiSurface.movesFinancialValue ? weights.financial : 0;

    // ── 3. Score de autenticação/autorização ─────────────────────────────
    let authorizationScore = 0;
    if (!apiSurface.requiresAuth) {
      authorizationScore += weights.missingAuth;
    }
    if (!apiSurface.requiresRoleAuthorization) {
      authorizationScore += weights.missingAuthorization;
    }

    // ── 4. Score de vulnerabilidades encontradas no checklist ─────────────
    const vulnerableItems = checklist.filter(
      item => item.status === ChecklistStatus.VULNERABLE
    );
    let vulnerabilityScore = 0;
    for (const item of vulnerableItems) {
      if (item.severity === Severity.CRITICAL) {
        vulnerabilityScore += weights.criticalVulnerableItem;
      } else {
        vulnerabilityScore += weights.vulnerableItem;
      }
    }

    // ── 5. Score de integridade MQ ────────────────────────────────────────
    const mqIntegrityScore = this.calculateMQScore(mqIntegration, weights);

    // ── Soma total (sem normalização para evitar distorção) ───────────────
    const rawScore =
      sensitivityScore +
      financialScore +
      authorizationScore +
      vulnerabilityScore +
      mqIntegrityScore;

    // Clamp 0–100
    const riskScore = Math.min(100, rawScore);

    const breakdown: RiskScoreBreakdown = {
      sensitivityScore,
      financialScore,
      authorizationScore,
      vulnerabilityScore,
      mqIntegrityScore,
    };

    const riskLevel = this.scoreToLevel(riskScore);
    const criticalFindings = this.extractCriticalFindings(analysis, riskScore);

    return {
      riskScore,
      riskLevel,
      criticalFindings,
      calculatedAt: new Date(),
      scoreBreakdown: breakdown,
    };
  }

  /**
   * Calcula score de penalidade pela falta de controles de integridade MQ.
   * Cada controle ausente adiciona peso ao score de risco.
   */
  private calculateMQScore(mq: MQIntegrationCheck, weights: RiskWeights): number {
    let score = 0;
    if (!mq.checksMessageIntegrity)        score += weights.mqIntegrityMissing;
    if (!mq.checksSchemaOnMainframeEntry)  score += weights.mqIntegrityMissing;
    if (!mq.hasIdempotencyKey)             score += weights.mqIntegrityMissing;
    if (!mq.hasReplayProtection)           score += weights.mqIntegrityMissing;
    return score;
  }

  /**
   * Mapeia score numérico para nível de risco categórico.
   *
   * Thresholds calibrados para contexto financeiro:
   *   < 20  → Baixo
   *   20–49 → Médio
   *   50–74 → Alto
   *   ≥ 75  → Crítico
   */
  scoreToLevel(score: number): RiskLevel {
    if (score >= 75) return RiskLevel.CRITICAL;
    if (score >= 50) return RiskLevel.HIGH;
    if (score >= 20) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  /**
   * Extrai os achados críticos textuais para exibição no relatório executivo.
   * Combinação de regras de negócio explícitas + achados do checklist.
   */
  private extractCriticalFindings(
    analysis: SecurityAnalysis,
    score: number
  ): string[] {
    const findings: string[] = [];
    const { apiSurface, checklist, mqIntegration } = analysis;

    if (apiSurface.dataSensitivity === DataSensitivity.CRITICAL) {
      findings.push('Dados classificados como CRÍTICOS sem medidas adequadas');
    }
    if (apiSurface.movesFinancialValue && !apiSurface.requiresAuth) {
      findings.push('Endpoint financeiro SEM autenticação configurada');
    }
    if (apiSurface.movesFinancialValue && !apiSurface.requiresRoleAuthorization) {
      findings.push('Endpoint financeiro SEM autorização por perfil');
    }
    if (!mqIntegration.checksMessageIntegrity) {
      findings.push('Integridade da mensagem MQ não verificada — risco de manipulação de payload');
    }
    if (!mqIntegration.hasIdempotencyKey) {
      findings.push('Ausência de chave de idempotência — risco de double spend');
    }
    if (!mqIntegration.hasReplayProtection) {
      findings.push('Sem proteção contra replay attack na fila MQ');
    }

    // Adiciona vulnerabilidades críticas do checklist
    checklist
      .filter(
        item =>
          item.status === ChecklistStatus.VULNERABLE &&
          item.severity === Severity.CRITICAL
      )
      .forEach(item => findings.push(`Vulnerabilidade CRÍTICA: ${item.title}`));

    return findings;
  }

  /**
   * Retorna a cor CSS correspondente ao nível de risco.
   * Centralizado aqui para garantir consistência entre componentes.
   */
  getRiskColor(level: RiskLevel): string {
    const map: Record<RiskLevel, string> = {
      [RiskLevel.LOW]:      '#28a745',  // verde
      [RiskLevel.MEDIUM]:   '#ffc107',  // amarelo
      [RiskLevel.HIGH]:     '#fd7e14',  // laranja
      [RiskLevel.CRITICAL]: '#dc3545',  // vermelho
    };
    return map[level] ?? '#6c757d';
  }

  /** Retorna o ícone correspondente ao nível de risco */
  getRiskIcon(level: RiskLevel): string {
    const map: Record<RiskLevel, string> = {
      [RiskLevel.LOW]:      '🟢',
      [RiskLevel.MEDIUM]:   '🟡',
      [RiskLevel.HIGH]:     '🟠',
      [RiskLevel.CRITICAL]: '🔴',
    };
    return map[level] ?? '⚪';
  }
}
