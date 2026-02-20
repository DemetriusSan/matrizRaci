/**
 * Catálogo de itens de checklist de segurança
 * Baseado em: OWASP Top 10 2021 + riscos financeiros específicos
 *
 * Decisão: centralizar aqui para facilitar manutenção e
 * evolução do catálogo sem impactar o serviço.
 */
import {
  CheckCategory, ChecklistStatus, SecurityChecklistItem, Severity
} from '../models/security-risk.models';

let _idCounter = 1;
const id = () => `chk-${String(_idCounter++).padStart(3, '0')}`;

export const SECURITY_CHECKLIST_TEMPLATE: Omit<SecurityChecklistItem, 'id'>[] = [
  // ── CONTROLE DE ACESSO ────────────────────────────────────────────────
  {
    category: CheckCategory.ACCESS_CONTROL,
    title: 'Broken Access Control (IDOR)',
    description: 'Verificar se é possível acessar recursos de outro usuário manipulando IDs na URL/payload.',
    owaspRef: 'OWASP A01:2021',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.CRITICAL,
    evidence: '',
    isMandatory: true,
  },
  {
    category: CheckCategory.ACCESS_CONTROL,
    title: 'Autorização por Perfil',
    description: 'Verificar se endpoints respeitam papéis (roles) e permissões por usuário/perfil.',
    owaspRef: 'OWASP A01:2021',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.HIGH,
    evidence: '',
    isMandatory: true,
  },
  {
    category: CheckCategory.ACCESS_CONTROL,
    title: 'Elevação de Privilégio Horizontal',
    description: 'Usuário com perfil padrão não deve conseguir executar operações de perfis superiores.',
    owaspRef: 'OWASP A01:2021',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.HIGH,
    evidence: '',
    isMandatory: true,
  },
  // ── INJECTION ─────────────────────────────────────────────────────────
  {
    category: CheckCategory.INJECTION,
    title: 'SQL / NoSQL Injection',
    description: 'Testar campos de entrada contra injeção de comandos de banco de dados.',
    owaspRef: 'OWASP A03:2021',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.CRITICAL,
    evidence: '',
    isMandatory: true,
  },
  {
    category: CheckCategory.INJECTION,
    title: 'Command Injection / SSTI',
    description: 'Verificar se inputs são processados por shell ou template engine sem sanitização.',
    owaspRef: 'OWASP A03:2021',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.HIGH,
    evidence: '',
    isMandatory: false,
  },
  // ── EXPOSIÇÃO DE DADOS ────────────────────────────────────────────────
  {
    category: CheckCategory.DATA_EXPOSURE,
    title: 'Exposição de Stack Trace',
    description: 'API não deve retornar stack traces ou mensagens de erro técnicas ao cliente.',
    owaspRef: 'OWASP A05:2021',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.MEDIUM,
    evidence: '',
    isMandatory: true,
  },
  {
    category: CheckCategory.DATA_EXPOSURE,
    title: 'Vazamento de Dados Sensíveis em Log',
    description: 'Verificar se CPF, senha, token ou dados financeiros aparecem em logs de aplicação.',
    owaspRef: 'OWASP A09:2021',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.HIGH,
    evidence: '',
    isMandatory: true,
  },
  {
    category: CheckCategory.DATA_EXPOSURE,
    title: 'Mass Assignment',
    description: 'API não deve aceitar campos não esperados no payload que possam alterar dados privilegiados.',
    owaspRef: 'OWASP A08:2021',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.HIGH,
    evidence: '',
    isMandatory: true,
  },
  {
    category: CheckCategory.DATA_EXPOSURE,
    title: 'Validação Server-Side',
    description: 'Todas as validações de negócio devem ocorrer no servidor, nunca apenas no cliente.',
    owaspRef: 'OWASP A04:2021',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.HIGH,
    evidence: '',
    isMandatory: true,
  },
  // ── RATE LIMIT ────────────────────────────────────────────────────────
  {
    category: CheckCategory.RATE_LIMIT,
    title: 'Rate Limit e Throttling',
    description: 'API possui controle de taxa de requisições para prevenir abuso e DDoS.',
    owaspRef: 'OWASP A04:2021',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.MEDIUM,
    evidence: '',
    isMandatory: false,
  },
  // ── REPLAY ATTACK ──────────────────────────────────────────────────────
  {
    category: CheckCategory.REPLAY_ATTACK,
    title: 'Proteção contra Replay Attack',
    description: 'Requests com timestamp vencido ou nonce já utilizado devem ser rejeitados.',
    owaspRef: 'OWASP A02:2021',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.CRITICAL,
    evidence: '',
    isMandatory: true,
  },
  {
    category: CheckCategory.REPLAY_ATTACK,
    title: 'Validação de Token Expirado',
    description: 'Tokens JWT/OAuth2 expirados devem ser rejeitados em todos os endpoints protegidos.',
    owaspRef: 'OWASP A02:2021',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.CRITICAL,
    evidence: '',
    isMandatory: true,
  },
  // ── RACE CONDITION ─────────────────────────────────────────────────────
  {
    category: CheckCategory.RACE_CONDITION,
    title: 'Race Condition em Operações Financeiras',
    description: 'Testar envios paralelos simultâneos para detectar double spend ou duplicidade de crédito.',
    owaspRef: 'OWASP A04:2021',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.CRITICAL,
    evidence: '',
    isMandatory: true,
  },
  // ── FINANCEIRO ─────────────────────────────────────────────────────────
  {
    category: CheckCategory.FINANCIAL,
    title: 'Double Submit / Double Spend',
    description: 'Garantir que submissões duplicadas não resultem em transações duplicadas financeiras.',
    owaspRef: '',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.CRITICAL,
    evidence: '',
    isMandatory: true,
  },
  {
    category: CheckCategory.FINANCIAL,
    title: 'Manipulação de Payload Financeiro',
    description: 'Verificar se alterações no valor, conta destino ou moeda no payload são detectadas e rejeitadas.',
    owaspRef: '',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.CRITICAL,
    evidence: '',
    isMandatory: true,
  },
  {
    category: CheckCategory.FINANCIAL,
    title: 'Alteração de ID de Recurso',
    description: 'IDs de transação, conta ou operação não devem ser manipuláveis para redirecionar valores.',
    owaspRef: 'OWASP A01:2021',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.CRITICAL,
    evidence: '',
    isMandatory: true,
  },
  // ── IDEMPOTÊNCIA ───────────────────────────────────────────────────────
  {
    category: CheckCategory.IDEMPOTENCY,
    title: 'Chave de Idempotência',
    description: 'Operações POST financeiras devem ter chave de idempotência para reprocessamento seguro.',
    owaspRef: '',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.HIGH,
    evidence: '',
    isMandatory: true,
  },
  // ── INTEGRIDADE MQ ─────────────────────────────────────────────────────
  {
    category: CheckCategory.MQ_INTEGRITY,
    title: 'Integridade da Mensagem MQ (HMAC/Assinatura)',
    description: 'Mensagens na fila MQ devem possuir HMAC ou assinatura digital para garantir não-repúdio.',
    owaspRef: '',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.CRITICAL,
    evidence: '',
    isMandatory: true,
  },
  {
    category: CheckCategory.MQ_INTEGRITY,
    title: 'Dead Letter Queue Configurada',
    description: 'Mensagens que falham no processamento devem ser redirecionadas para DLQ e monitoradas.',
    owaspRef: '',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.MEDIUM,
    evidence: '',
    isMandatory: false,
  },
  // ── VALIDAÇÃO DE SCHEMA ────────────────────────────────────────────────
  {
    category: CheckCategory.SCHEMA_VALID,
    title: 'Validação de Schema na Entrada do Mainframe',
    description: 'O mainframe deve rejeitar mensagens MQ que não obedeçam o schema definido (campos, tipos).',
    owaspRef: '',
    status: ChecklistStatus.NOT_STARTED,
    severity: Severity.HIGH,
    evidence: '',
    isMandatory: true,
  },
];

/** Gera uma cópia fresca do checklist com IDs únicos */
export function generateChecklist(): SecurityChecklistItem[] {
  _idCounter = 1;
  return SECURITY_CHECKLIST_TEMPLATE.map(item => ({
    ...item,
    id: id(),
  }));
}
