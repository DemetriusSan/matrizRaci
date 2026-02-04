# 🗓️ Plano de Implementação - 4 Semanas

## Visão Geral

**Objetivo:** Implementar Matriz RACI na Tribo Monetário e torná-la ferramenta estratégica de qualidade.

**Duração:** 4 semanas (20 dias úteis)

**Públicos:**
- Devs Backend pleno/sênior
- Dev COBOL
- QA com automação
- Tech Lead COBOL
- Leader
- PO
- DevOps

---

## 📋 Semana 1: Preparação & Kick-off

### Dia 1 (Segunda)

**Manhã:**
- [ ] Setup técnico (1h)
  - Dev lead: `git clone` + `npm install` + `npm start`
  - Servidor rodando em http://localhost:4200
  - Todos conseguem acessar

- [ ] Leitura individual (1h)
  - Todos: [README.md](README.md) (5 min)
  - Todos: [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) (25 min)
  - Imprimir: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**Tarde:**
- [ ] Workshop: O que é RACI? (1h)
  - Apresentação: Papéis (R, A, C, I)
  - Exemplo: Uma feature comum
  - Q&A

**Saída do dia:**
- ✅ Ambiente rodando
- ✅ Time entende conceito RACI
- ✅ Todos têm referência visual

---

### Dias 2-3 (Terça-Quarta)

**Cada pessoa: Ler seu papel**

| Papel | Leitura | Tempo |
|-------|---------|-------|
| **PO** | [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) Seção "PO" | 30 min |
| **Tech Lead** | [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) Seção "Tech Lead" | 30 min |
| **Dev Backend** | [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) Seção "Dev Backend" | 30 min |
| **Dev COBOL** | [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) Seção "Dev COBOL" | 30 min |
| **QA** | [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) Seção "QA" | 30 min |
| **Leader** | [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) Seção "Leader" | 30 min |
| **DevOps** | [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) Seção "DevOps" | 30 min |

**Paralelo:**
- [ ] Devs técnicos (Backend, COBOL, QA, DevOps):
  - Leia [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) (1h)
  - Explore código (30 min)
  - Execute `npm test` (15 min)

**Resultado:**
- Cada pessoa entende seu papel na matriz
- Devs entendem a implementação técnica

---

### Dias 4-5 (Quinta-Sexta)

**Manhã:**
- [ ] Workshop: Validar Papéis (1h)
  - Quadro: Papéis + Responsabilidades
  - Cada pessoa apresenta 2 min seu role
  - Q&A

- [ ] Demo: Usar a Aplicação (45 min)
  - Mostrar: Como adicionar tarefa
  - Mostrar: Como atribuir RACI
  - Mostrar: Validação automática
  - Mostrar: Exportar JSON
  - Todos tentam

**Tarde:**
- [ ] Customizar Matriz (1h)
  - Remover dados de exemplo
  - Adicionar papéis reais do time
  - Adicionar 3-5 tarefas padrão
  - Validar e exportar

- [ ] Publicar Matriz (30 min)
  - Confluence/Wiki da empresa
  - Email com [QUICK_REFERENCE.md](QUICK_REFERENCE.md) anexo
  - Slack: Link + explicação rápida

**Saída da Semana 1:**
- ✅ Time entende conceito RACI
- ✅ Matriz customizada com seu time
- ✅ Todos sabem seu papel
- ✅ Matriz publicada
- ✅ Ambiente técnico pronto

---

## 🛠️ Semana 2: Implementação Técnica

### Dias 6-7 (Segunda-Terça)

**Objetivo:** Integrar Matriz RACI com seus sistemas

**Dev Backend:**
- [ ] Ler [CUSTOMIZACAO.md](CUSTOMIZACAO.md) (1h)
- [ ] Criar endpoint: `GET /api/raci/matrices` (2h)
  - Retorna matrices do banco de dados
  - Teste com Postman
- [ ] Criar endpoint: `POST /api/raci/matrices` (2h)
  - Recebe nova matriz
  - Valida RACI rules
  - Persiste no banco
- [ ] Criar endpoint: `PUT /api/raci/matrices/{id}` (2h)

**Tech Lead:**
- [ ] Code review dos endpoints (1h)
- [ ] Decidir: Autenticação (JWT/OAuth)? (30 min)
- [ ] Design: Integração com legacy COBOL? (1h)
- [ ] Criar subtask para Dev COBOL

**Dev COBOL:**
- [ ] Ler [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) (30 min)
- [ ] Reunião: Como expor dados mainframe? (1h)
- [ ] Criar teste de integração (2h)

**QA:**
- [ ] Ler [CUSTOMIZACAO.md](CUSTOMIZACAO.md) (1h)
- [ ] Escrever testes para validação RACI (3h)
  - Teste: 0 Accountables = erro
  - Teste: 2+ Accountables = erro
  - Teste: Sem Responsible = erro
- [ ] Teste de UI (adicionar tarefa, atribuir RACI) (2h)

**DevOps:**
- [ ] Ler [SETUP_GUIDE.md](SETUP_GUIDE.md) (1h)
- [ ] Setup: Docker image (2h)
- [ ] Setup: CI/CD pipeline (2h)
  - Build automático
  - Testes antes de deploy

---

### Dias 8-9 (Quarta-Quinta)

**Objetivo:** Integração e testes

**Dev Backend:**
- [ ] Integração com banco de dados (3h)
- [ ] Teste de integração (2h)

**Dev COBOL:**
- [ ] Primeira integração com APIs Backend (2h)
- [ ] Teste de dados do mainframe (2h)

**QA:**
- [ ] Teste integração: Backend → COBOL (3h)
- [ ] Teste performance: Matriz com 100 tarefas (1h)
- [ ] Teste: Exportar JSON + reimportar (1h)

**Tech Lead:**
- [ ] Code review de tudo (2h)
- [ ] Resolver bottlenecks (2h)

**DevOps:**
- [ ] Deploy em dev (1h)
- [ ] Deploy em homolog (1h)
- [ ] Monitoramento: Alertas? (1h)

---

### Dia 10 (Sexta)

**Objetivo:** Code freeze + testes finais

**Todos:**
- [ ] Verificar: Tudo está integrado? (1h)
- [ ] Teste de fumaça (smoke test) (30 min)
  - Abrir app
  - Criar matriz
  - Adicionar tarefa
  - Atribuir RACI
  - Validar
  - Exportar

**Tech Lead:**
- [ ] Decidir: Pronto para prod? SIM/NÃO
- [ ] Se SIM: Criar release notes

**Saída da Semana 2:**
- ✅ Endpoints de API funcionando
- ✅ Integração com COBOL funcionando
- ✅ Testes passando (backend + frontend)
- ✅ CI/CD pipeline funcionando
- ✅ Deploy em homolog ✅

---

## 🚀 Semana 3: Deploy & Treinamento

### Dia 11 (Segunda)

**Objetivo:** Deploy em produção

**DevOps:**
- [ ] Checklist de deploy (1h)
  - Backup de dados?
  - Rollback plan?
  - Monitoring ativo?
- [ ] Deploy para produção (1h)
- [ ] Teste pós-deploy (30 min)
- [ ] Comunicar URL ao time

**Tech Lead + Dev Backend:**
- [ ] Monitorar logs (2h)
- [ ] Responder a problemas

**Saída:**
- ✅ Aplicação em PROD
- ✅ Time pode acessar
- ✅ Monitoramento ativo

---

### Dias 12-14 (Terça-Quinta)

**Objetivo:** Treinar time + usar em produção

**Leader:**
- [ ] Workshop 1: Como usar a matriz (1h)
  - Demo: Adicionar tarefa
  - Demo: Atribuir papéis
  - Demo: Validar
  - Prática: Exercício com o time
- [ ] Workshop 2: Casos de uso (1h)
  - Exemplo: Esquire uma feature
  - Exemplo: Identificar bloqueador
  - Exemplo: Escalar problema
- [ ] Monitorar: Alguém está usando?
- [ ] Feedback: Coletar problemas

**Todos:**
- [ ] Usar a matriz para uma tarefa REAL (2h)
  - Escolher: Uma iniciativa em andamento
  - Mapear: Quem faz o quê? (RACI)
  - Validar: A matriz aceita?
  - Documentar: Exportar JSON
  - Compartilhar: Com o time

**QA:**
- [ ] Teste em produção com dados reais (2h)
- [ ] Relatório: Bugs encontrados?

---

### Dia 15 (Sexta)

**Objetivo:** Retrospectiva da Semana 3

**Todos:**
- [ ] Reunião: Como foi usar?
  - O que funcionou bem?
  - Problemas encontrados?
  - Melhorias necessárias?
- [ ] Documentar feedback

**Saída da Semana 3:**
- ✅ Aplicação em PRODUÇÃO
- ✅ Time sabe usar
- ✅ Está sendo usada em tarefas reais
- ✅ Feedback coletado

---

## 📈 Semana 4: Otimização & Consolidação

### Dias 16-17 (Segunda-Terça)

**Objetivo:** Corrigir bugs + implementar melhorias

**Dev Backend + Dev COBOL:**
- [ ] Corrigir bugs reportados (2h)
- [ ] Performance: Otimizar queries (2h)
- [ ] Feature: Adicionar histórico de versões? (2h)

**QA:**
- [ ] Teste dos fixes (1h)

**Tech Lead:**
- [ ] Code review (1h)
- [ ] Decidir: Quais melhorias fazer?

---

### Dias 18-19 (Quarta-Quinta)

**Objetivo:** Documentar + consolidar

**Leader:**
- [ ] Workshop 3: Best practices
  - Como estruturar matriz (recomendações)
  - Erros comuns (evitar)
  - Dicas de facilitação
- [ ] Update: [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md)
  - Learnings da Semana 3
  - Ajustes na matriz padrão

**Todos:**
- [ ] Documentar: Casos de uso REAIS (2h cada)
  - Feature da Squad 1: Fatura
  - Feature da Squad 2: Crédito
  - Incidente
  - Refaturação

**Saída:**
- ✅ Documentação atualizada
- ✅ Melhores práticas claras
- ✅ Casos reais documentados

---

### Dia 20 (Sexta)

**Objetivo:** Validar sucesso + planejar próximas semanas

**Leader + Tech Lead:**
- [ ] Reunião: Temos métricas?
  - Quantas matrizes criadas?
  - Quantas pessoas usam?
  - Quantos bugs encontrados?
  - NPS: People gostam?

**Todos:**
- [ ] Feedback final: Classificar (1 a 5)
  - Conceito RACI ficou claro? (1-5)
  - Aplicação é útil? (1-5)
  - Algo mais que precise? (aberto)

**Tech Lead:**
- [ ] Decidir roadmap:
  - Melhorias necessárias?
  - Integração com outras ferramentas?
  - Expansão para outras tribos?

**Saída da Semana 4:**
- ✅ Métricas de sucesso
- ✅ Time confiante com RACI
- ✅ Documentação consolidada
- ✅ Roadmap para próximas semanas

---

## 🎯 Métricas de Sucesso

### Semana 1
- ✅ 100% do time treinou
- ✅ Matriz publicada
- ✅ 0 bugs críticos

### Semana 2
- ✅ APIs funcionando
- ✅ Integração com COBOL OK
- ✅ Todos os testes passando

### Semana 3
- ✅ Deploy bem-sucedido
- ✅ 100% do time consegue usar
- ✅ 5+ matrizes criadas

### Semana 4
- ✅ NPS ≥ 4.0 (escala 1-5)
- ✅ 0 bugs críticos em prod
- ✅ Roadmap definido

---

## 📞 Roles & Responsabilidades

| Papel | Semana 1 | Semana 2 | Semana 3 | Semana 4 |
|-------|----------|----------|----------|----------|
| **Leader** | Workshop, Setup | Coordenação | Treinar, Feedback | Métricas |
| **Tech Lead** | Kick-off | Code review | Monitorar | Roadmap |
| **Dev Backend** | Leitura | APIs (4h) | Suporte | Otimização |
| **Dev COBOL** | Leitura | Integração (4h) | Suporte | Documentação |
| **QA** | Setup | Testes (5h) | Validação | Casos reais |
| **PO** | Papel | Aceitação | Usar | Feedback |
| **DevOps** | Setup | CI/CD (4h) | Deploy | Monitoramento |

---

## 🎓 Documentação por Fase

### Semana 1
📖 [README.md](README.md)
📖 [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md)
📖 [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

### Semana 2
📖 [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)
📖 [CUSTOMIZACAO.md](CUSTOMIZACAO.md)
📖 [SETUP_GUIDE.md](SETUP_GUIDE.md)

### Semana 3
📖 [RACI_GUIDE.md](RACI_GUIDE.md)
📖 [USE_CASES.md](USE_CASES.md)

### Semana 4
📖 [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) (atualizado)
📖 Release notes

---

## ⚠️ Riscos & Mitigação

| Risco | Impacto | Mitigation |
|-------|--------|-----------|
| Tech Lead fora da semana | Alto | Designar backup |
| COBOL lento demais | Alto | Parallelizar com mock |
| Produção cai | Crítico | Rollback plan + monitoria 24/7 |
| Time não engaja | Médio | Fazer obrigatório em sprint |
| Customização complexa | Médio | MVP simples, iterar depois |

---

## ✅ Checklist Final

**Fim da Semana 1:**
- [ ] Time treinou
- [ ] Matriz publicada
- [ ] Feedback positivo

**Fim da Semana 2:**
- [ ] Testes 100% passando
- [ ] Deploy em homolog OK
- [ ] Code review aprovado

**Fim da Semana 3:**
- [ ] Em PRODUÇÃO
- [ ] Time usando
- [ ] 0 bugs críticos

**Fim da Semana 4:**
- [ ] Métricas coletadas
- [ ] Documentação consolidada
- [ ] Roadmap próximas semanas

---

**Plano versão 1.0**  
**Data:** Fevereiro 2026  
**Responsável:** Tech Lead + Leader  
**Review:** Quinzenalmente
