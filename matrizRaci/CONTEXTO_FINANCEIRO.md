# Matriz RACI - Contexto: Instituição Financeira

## 📊 Estrutura Organizacional

```
INSTITUIÇÃO FINANCEIRA
│
├── Business Domain: CARTÕES
│   │
│   └── Tribo Monetário
│       ├── Squad 1: Fatura (Billing)
│       │   └── Processar e gerar faturas de cartões
│       │
│       └── Squad 2: Produtos de Crédito
│           └── Criar e gerenciar linhas de crédito
│
└── Stack Tecnológico
    ├── Backend: Java/Node.js (APIs modernas)
    ├── Legacy: COBOL (Mainframe)
    ├── QA: Automação com Cypress/Selenium
    └── DevOps: CI/CD Pipeline (GitLab/Jenkins)
```

---

## 👥 Roles da Equipe

| Papel | Responsabilidade | Squad |
|-------|------------------|-------|
| **PO (Product Owner)** | Define requirements, prioriza features, aceita critérios | Ambas |
| **Tech Lead Cobol** | Lidera integração com mainframe, governa mudanças legadas | Ambas |
| **Dev Backend Pleno/Sênior** | Desenvolve APIs, serviços de negócio, integrações | Ambas |
| **Dev Cobol** | Mantém e evoluir sistema COBOL legacy | Squad 1 |
| **QA Automação** | Testes funcionais, integração, performance, regressão | Ambas |
| **Leader (Gestor de Time)** | Gerencia capacidade, problemas de RH, saúde do time | Ambas |
| **DevOps (CI/CD)** | Pipeline, deploy, monitoramento, infra-as-code | Ambas |

---

## 🏦 Processos do Business Domain: Cartões

### Squad 1: Fatura (Billing)

**Produtos:**
- Fatura de cartão de crédito
- Extrato eletrônico
- Cobrança de anuidade
- Multas e juros

**Fluxos:**
1. **Captura de Transações** → Dev Backend coleta dados de transações
2. **Cálculo de Encargos** → Tech Lead Cobol governa regras no mainframe
3. **Geração de Fatura** → Dev Backend orquestra com sistema COBOL
4. **Validação** → QA testa cenários de fatura normal/exceção
5. **Deploy** → DevOps publica mudanças em produção

---

### Squad 2: Produtos de Crédito

**Produtos:**
- Limite de crédito
- Antecipação de recebíveis
- Empréstimo pessoal
- Cheque especial

**Fluxos:**
1. **Análise de Crédito** → PO define critérios, Dev Backend implementa
2. **Integração com Rating** → Tech Lead Cobol integra com scoring legacy
3. **Aprovação Automática** → Dev Backend executa motor de regras
4. **QA de Cenários** → QA testa limites, rejeições, exceções
5. **Launch em Produção** → DevOps gerencia canary/rollout

---

## 📋 Matriz RACI Padrão - Exemplo Realista

### Iniciativas Comuns

#### 1️⃣ Definição de Requisitos (Feature/Epic)

| Stakeholder | Responsabilidade |
|-------------|------------------|
| **PO** | **A** - Accountable (define, prioriza, aceita) |
| **Tech Lead Cobol** | **C** - Consulted (impacto no legacy) |
| **Dev Backend** | **C** - Consulted (esforço técnico) |
| **QA** | **I** - Informed (entendem critérios) |

---

#### 2️⃣ Design de Arquitetura

| Stakeholder | Responsabilidade |
|-------------|------------------|
| **Tech Lead Cobol** | **A** - Accountable (governa decisões) |
| **Dev Backend** | **R** - Responsible (desenha APIs) |
| **Dev Cobol** | **C** - Consulted (mudanças no legacy) |
| **QA** | **I** - Informed (critérios de teste) |

---

#### 3️⃣ Implementação Backend

| Stakeholder | Responsabilidade |
|-------------|------------------|
| **Dev Backend** | **R** - Responsible (codifica) |
| **Tech Lead Cobol** | **C** - Consulted (integração) |
| **QA** | **I** - Informed (teste paralelo) |
| **PO** | **I** - Informed (acompanha progresso) |

---

#### 4️⃣ Integração com COBOL/Mainframe

| Stakeholder | Responsabilidade |
|-------------|------------------|
| **Tech Lead Cobol** | **A** - Accountable (governa mudança) |
| **Dev Cobol** | **R** - Responsible (implementa) |
| **Dev Backend** | **C** - Consulted (lado da API) |
| **QA** | **C** - Consulted (teste de integração) |

---

#### 5️⃣ Testes Automatizados

| Stakeholder | Responsabilidade |
|-------------|------------------|
| **QA Automação** | **R** - Responsible (escreve testes) |
| **Dev Backend** | **C** - Consulted (expõe APIs/dados) |
| **Tech Lead Cobol** | **C** - Consulted (cenários legacy) |
| **PO** | **A** - Accountable (aprova casos de teste) |

---

#### 6️⃣ Deploy em Produção

| Stakeholder | Responsabilidade |
|-------------|------------------|
| **DevOps** | **R** - Responsible (executa deploy) |
| **Tech Lead Cobol** | **A** - Accountable (aprova mudanças) |
| **Dev Backend** | **C** - Consulted (validação final) |
| **Leader** | **I** - Informed (comunicação time) |

---

#### 7️⃣ Monitoramento Pós-Deploy

| Stakeholder | Responsabilidade |
|-------------|------------------|
| **DevOps** | **R** - Responsible (monitora) |
| **Tech Lead Cobol** | **A** - Accountable (decisão de rollback) |
| **QA** | **C** - Consulted (regressão smoke) |
| **Leader** | **I** - Informed (saúde do time) |

---

## 🎯 Estratégia de Qualidade do Time

Como **designado a melhorar o time com visão de qualidade**, a Matriz RACI ajuda:

### ✅ Clareza de Responsabilidades
- **Evita** trabalho duplicado entre Backend e Cobol
- **Define** quem aprova e quem executa
- **Garante** que QA não fica isolado

### ✅ Integração Backend + Legacy
- **Tech Lead Cobol** = ponte entre mundos
- **Dev Backend** = implementa com consciência do legacy
- **Dev Cobol** = evolui código antigo de forma controlada

### ✅ QA como Guardião da Qualidade
- **Não é** apenas executor de testes
- **É** consultor de critérios de aceite
- **Participa** desde design de requisitos

### ✅ CI/CD Confiável
- **DevOps** governa pipeline
- **Tech Lead** aprova por risco
- **QA** valida antes de merge

### ✅ Comunicação Ágil
- **Leader** informado de bloqueadores
- **PO** governa prioridades e trade-offs
- **Dev Backend** + **Dev Cobol** trabalham em sinergia

---

## 📈 Casos de Uso Reais

### Caso 1: Nova Feature de Limite de Crédito (Squad 2)

**Contexto:** Aumentar limite automático baseado em histórico

| Etapa | Atividade | RACI |
|-------|-----------|------|
| 1 | PO define critério de elegibilidade | A: PO, C: Tech Lead, I: Dev Backend |
| 2 | Tech Lead desenha integração com scoring legacy | A: Tech Lead, R: Dev Backend, C: Dev Cobol |
| 3 | Dev Backend implementa motor de regras | R: Dev Backend, C: Tech Lead, I: QA |
| 4 | Dev Cobol ajusta consulta no DB mainframe | R: Dev Cobol, C: Tech Lead |
| 5 | QA automatiza testes de elegibilidade | R: QA, C: Dev Backend, A: PO |
| 6 | Deploy via pipeline | R: DevOps, A: Tech Lead, C: Dev Backend |
| 7 | Monitoramento de taxa de aprovação | R: DevOps, A: Tech Lead, C: QA, I: PO |

**Resultado:** Feature entregue em 2 sprints com 0 retrabalho

---

### Caso 2: Refaturação de Geração de Fatura (Squad 1)

**Contexto:** Migrar lógica do COBOL para Java para melhorar performance

| Etapa | Atividade | RACI |
|-------|-----------|------|
| 1 | PO define SLA de performance | A: PO, C: DevOps, I: Tech Lead |
| 2 | Tech Lead desenha arquitetura híbrida | A: Tech Lead, R: Dev Backend, C: Dev Cobol |
| 3 | Dev Backend implementa nova geração | R: Dev Backend, C: Tech Lead, I: QA |
| 4 | Dev Cobol mantém versão legado em paralelo | R: Dev Cobol, C: Tech Lead |
| 5 | QA testa parity entre versões | R: QA, C: Dev Backend, A: PO |
| 6 | Deploy com feature flag | R: DevOps, A: Tech Lead, C: Dev Backend |
| 7 | Gradual rollout (10% → 50% → 100%) | R: DevOps, A: Tech Lead, I: Leader |

**Resultado:** Zero downtime, rollback seguro, time confiante

---

### Caso 3: Incidente em Produção

**Contexto:** Fatura gerada com juros incorretos

| Etapa | Atividade | RACI |
|-------|-----------|------|
| 1 | Detectar problema | R: DevOps/QA, I: Tech Lead, PO |
| 2 | Tech Lead abre war room | A: Tech Lead, I: Todos |
| 3 | Dev Backend investiga Java | R: Dev Backend, C: Tech Lead |
| 4 | Dev Cobol investiga COBOL | R: Dev Cobol, C: Tech Lead |
| 5 | QA cria teste de regressão | R: QA, C: Dev Backend, A: PO |
| 6 | Deploy hotfix | R: DevOps, A: Tech Lead, I: Leader |
| 7 | Post-mortem + lições aprendidas | A: Leader, C: Tech Lead, R: Todos |

**Resultado:** Conhecimento compartilhado, processos melhorados

---

## 🔄 Fluxo de Trabalho Padrão (Ágil)

### Sprint Planning
- **A:** PO (define backlog)
- **C:** Tech Lead, Dev Backend (estimam)
- **I:** QA, Leader

### Sprint Execution
- **R:** Dev Backend, Dev Cobol (codificam)
- **A:** Tech Lead (governa arquitetura)
- **C:** QA (testes paralelos)
- **I:** PO, Leader (acompanham)

### Sprint Review
- **A:** PO (aceita stories)
- **C:** Tech Lead (valida qualidade)
- **R:** Dev Backend (apresenta)
- **I:** Leader, QA (feedback)

### Sprint Retro
- **R:** Leader (facilita)
- **A:** Dev Backend, Dev Cobol (donos de ações)
- **C:** Tech Lead, QA (feedback)
- **I:** PO (contexto de negócio)

---

## 🎓 Como Usar Esta Matriz

### Para o PO
- Entender quem aprova cada decisão
- Quando consultar Tech Lead antes de prometer date
- Como elevar bloqueadores para Leader

### Para Tech Lead
- Governar mudanças de forma eficiente
- Quando deixar Dev Backend decidir
- Como mentorar Dev Cobol

### Para Dev Backend
- Quando envolver Tech Lead e Dev Cobol
- Como escaldar tarefas com QA
- Comunicação com DevOps

### Para Dev Cobol
- Participar ativamente em design
- Não ser "consultado após" mas "consultado antes"
- Evoluir legacy com confiança

### Para QA
- Voz ativa em critério de aceite
- Testes desde o design, não apenas ao final
- Automação como investimento estratégico

### Para DevOps
- Ser responsável por segurança do pipeline
- Trabalhar em sinergia com Tech Lead
- Monitoramento contínuo

### Para Leader
- Remover bloqueadores de dependência
- Garantir sinergia entre squads
- Saúde do time é responsabilidade coletiva

---

## 📊 Métricas de Sucesso

Com esta Matriz RACI bem implementada:

✅ **Redução de Bloqueadores**: Tempo de decisão < 1 dia  
✅ **Qualidade de Fatura**: Zero erros críticos em produção  
✅ **Deploy Frequency**: 2+ deploys por semana (Squad)  
✅ **Lead Time**: Definição → Produção < 2 sprints  
✅ **Satisfação de Dev**: Time entende quem faz o quê  
✅ **Retrabalho**: < 10% de esforço total  

---

## 🚀 Próximos Passos

1. **Apresentar Matriz** para todo o time
2. **Validar Roles** - ajustar se necessário
3. **Publicar em Wiki/Confluence** para referência
4. **Revisar Quarterly** - learnings de retros
5. **Expandir** para outras tribos conforme modelo de sucesso

---

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Proprietário:** Tech Lead / Leader  
**Próxima Review:** Maio 2026
