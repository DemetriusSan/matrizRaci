/**
 * Security Risk Management Module - Modelos de Domínio
 *
 * Arquitetura de segurança para sistemas financeiros com comunicação:
 * Web/Mobile → API REST → Middleware → Fila MQ → Mainframe
 *
 * Decisão arquitetural: todas as enums são string-typed para serialização
 * limpa em JSON e compatibilidade com backend real.
 */

// ─────────────────────────────────────────────
// ENUMS DE DOMÍNIO
// ─────────────────────────────────────────────

export enum SystemImpacted {
  WEB       = 'Web',
  MOBILE    = 'Mobile',
  MAINFRAME = 'Mainframe',
  MQ        = 'Fila MQ',
  API       = 'API REST',
}

export enum HttpMethod {
  GET    = 'GET',
  POST   = 'POST',
  PUT    = 'PUT',
  DELETE = 'DELETE',
  PATCH  = 'PATCH',
}

export enum DataSensitivity {
  LOW      = 'Baixa',
  MEDIUM   = 'Média',
  HIGH     = 'Alta',
  CRITICAL = 'Crítica',
}

export enum AuthType {
  JWT    = 'JWT',
  OAUTH2 = 'OAuth2',
  MTLS   = 'mTLS',
  BASIC  = 'Basic Auth',
  APIKEY = 'API Key',
  NONE   = 'Nenhuma',
}

export enum ChecklistStatus {
  NOT_STARTED = 'Não iniciado',
  IN_PROGRESS = 'Em teste',
  APPROVED    = 'Aprovado',
  VULNERABLE  = 'Vulnerável',
}

export enum Severity {
  LOW      = 'Baixa',
  MEDIUM   = 'Média',
  HIGH     = 'Alta',
  CRITICAL = 'Crítica',
}

export enum RiskLevel {
  LOW      = 'Baixo',
  MEDIUM   = 'Médio',
  HIGH     = 'Alto',
  CRITICAL = 'Crítico',
}

export enum CheckCategory {
  ACCESS_CONTROL  = 'Controle de Acesso',
  INJECTION       = 'Injection',
  DATA_EXPOSURE   = 'Exposição de Dados',
  RATE_LIMIT      = 'Rate Limit',
  REPLAY_ATTACK   = 'Replay Attack',
  RACE_CONDITION  = 'Race Condition',
  MQ_INTEGRITY    = 'Integridade MQ',
  SCHEMA_VALID    = 'Validação de Schema',
  IDEMPOTENCY     = 'Idempotência',
  FINANCIAL       = 'Financeiro',
}

// ─────────────────────────────────────────────
// INTERFACE: SUPERFÍCIE DA API
// Descreve o endpoint e suas características de segurança
// ─────────────────────────────────────────────
export interface ApiSurface {
  endpoint: string;
  method: HttpMethod;
  requiresAuth: boolean;
  authType: AuthType;
  requiresRoleAuthorization: boolean;
  movesFinancialValue: boolean;
  dataSensitivity: DataSensitivity;
}

// ─────────────────────────────────────────────
// INTERFACE: VERIFICAÇÃO DE INTEGRAÇÃO MQ
// Checagem específica de integridade de mensagens na fila
// ─────────────────────────────────────────────
export interface MQIntegrationCheck {
  checksMessageIntegrity: boolean;       // HMAC / assinatura da mensagem
  checksSchemaOnMainframeEntry: boolean; // Validação de schema no mainframe
  hasIdempotencyKey: boolean;            // Chave de idempotência para evitar double-submit
  hasReplayProtection: boolean;          // Timestamp + nonce contra replay
  hasDeadLetterQueue: boolean;           // Fila de mensagens mortas configurada
}

// ─────────────────────────────────────────────
// INTERFACE: ITEM DO CHECKLIST DE SEGURANÇA
// Baseado em OWASP Top 10 + riscos financeiros específicos
// ─────────────────────────────────────────────
export interface SecurityChecklistItem {
  id: string;
  category: CheckCategory;
  title: string;
  description: string;
  owaspRef?: string;                     // Ex: "OWASP A01:2021"
  status: ChecklistStatus;
  severity: Severity;
  evidence: string;
  evidenceFileName?: string;             // Mock de upload de evidência
  isMandatory: boolean;                  // Itens obrigatórios para go-live
}

// ─────────────────────────────────────────────
// INTERFACE: AVALIAÇÃO DE RISCO
// Resultado calculado pelo motor de risco
// ─────────────────────────────────────────────
export interface RiskAssessment {
  riskScore: number;              // 0–100
  riskLevel: RiskLevel;
  criticalFindings: string[];     // Lista de achados críticos
  calculatedAt: Date;
  scoreBreakdown: RiskScoreBreakdown;
}

export interface RiskScoreBreakdown {
  sensitivityScore: number;
  financialScore: number;
  authorizationScore: number;
  vulnerabilityScore: number;
  mqIntegrityScore: number;
}

// ─────────────────────────────────────────────
// INTERFACE PRINCIPAL: ANÁLISE DE SEGURANÇA POR USER STORY
// ─────────────────────────────────────────────
export interface SecurityAnalysis {
  id: string;
  userStoryId: string;
  featureName: string;
  sprint: string;
  systemsImpacted: SystemImpacted[];
  apiSurface: ApiSurface;
  mqIntegration: MQIntegrationCheck;
  checklist: SecurityChecklistItem[];
  riskAssessment: RiskAssessment | null;
  // ── Extras Estratégicos ──────────────────
  hasSecurityDebt: boolean;
  requiresPentest: boolean;
  requiresThreatModeling: boolean;
  notes: string;
  changeHistory: ChangeHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// ─────────────────────────────────────────────
// INTERFACE: HISTÓRICO DE ALTERAÇÕES
// Auditoria de todas as mudanças (decisão: imutável, append-only)
// ─────────────────────────────────────────────
export interface ChangeHistoryEntry {
  timestamp: Date;
  user: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
}

// ─────────────────────────────────────────────
// INTERFACE: DADOS DO DASHBOARD
// Agregações calculadas pelo serviço, não pelo componente (separação de concerns)
// ─────────────────────────────────────────────
export interface DashboardData {
  totalAnalyses: number;
  criticalRiskCount: number;
  highRiskCount: number;
  averageRiskScore: number;
  vulnerabilitiesBySeverity: Record<Severity, number>;
  vulnerabilitiesByCategory: Record<string, number>;
  criticalStories: SecurityAnalysis[];
  scoreBySprintData: SprintScore[];
  statusDistribution: Record<ChecklistStatus, number>;
}

export interface SprintScore {
  sprint: string;
  averageScore: number;
  analysisCount: number;
}

// ─────────────────────────────────────────────
// PESOS DO MOTOR DE RISCO (configuráveis)
// Externalizados para facilitar ajuste sem recompilação
// ─────────────────────────────────────────────
export interface RiskWeights {
  sensitivity: Record<DataSensitivity, number>;
  financial: number;             // peso extra se movimenta valor
  missingAuth: number;           // sem autenticação
  missingAuthorization: number;  // sem autorização por perfil
  vulnerableItem: number;        // por vulnerabilidade encontrada no checklist
  criticalVulnerableItem: number;// por vuln crítica encontrada
  mqIntegrityMissing: number;    // por falha de integridade MQ
}

/** Pesos padrão para o motor de risco – podem ser sobrescritos via config */
export const DEFAULT_RISK_WEIGHTS: RiskWeights = {
  sensitivity: {
    [DataSensitivity.LOW]:      5,
    [DataSensitivity.MEDIUM]:  15,
    [DataSensitivity.HIGH]:    30,
    [DataSensitivity.CRITICAL]:45,
  },
  financial:              20,
  missingAuth:            25,
  missingAuthorization:   15,
  vulnerableItem:         10,
  criticalVulnerableItem: 20,
  mqIntegrityMissing:     10,
};
