# 🎯 MATRIZ RACI - CARTÕES (REFERÊNCIA RÁPIDA)

## 👥 Papéis - Tribo Monetário

| Papel | Sigla | Descrição |
|-------|-------|-----------|
| **PO** | PO | Define requisitos, prioriza, aceita features |
| **Tech Lead COBOL** | TLC | Governa arquitetura, mainframe, legado |
| **Dev Backend** | DEV | Implementa APIs e serviços Java/Node |
| **Dev COBOL** | COBOL | Mantém/evoluir código mainframe |
| **QA Automação** | QA | Testes funcionais, automação, integração |
| **Leader** | LEAD | Gestor: RH, capacidade, saúde do time |
| **DevOps** | OPS | CI/CD pipeline, deploy, infraestrutura |

---

## 🎲 Letras RACI

| Letra | Significado | O que faz | Exemplo |
|-------|-------------|----------|---------|
| **R** | **Responsible** | Faz o trabalho | Dev Backend codifica a API |
| **A** | **Accountable** | Aprova/responde | Tech Lead aprova a integração |
| **C** | **Consulted** | Opina/contribui | QA sugere casos de teste |
| **I** | **Informed** | Fica sabendo | PO acompanha progresso |

---

## 📋 MATRIZ PADRÃO - ATIVIDADES COMUNS

### 1️⃣ Definir Requisitos (Feature)
```
PO:          A (Define, prioriza, aceita)
TLC:         C (Impacto no legacy)
DEV:         C (Esforço técnico)
QA:          I (Entendem critérios)
COBOL:       I
LEAD:        I
OPS:         I
```

### 2️⃣ Design de Arquitetura
```
TLC:         A (Governa decisões)
DEV:         R (Desenha APIs)
COBOL:       C (Mudanças no legacy)
QA:          I (Critérios de teste)
PO:          C (Viabilidade negócio)
LEAD:        I
OPS:         I
```

### 3️⃣ Implementação Backend
```
DEV:         R (Codifica)
TLC:         C (Integração)
QA:          I (Teste paralelo)
COBOL:       C (Integração legacy)
PO:          I (Acompanha)
LEAD:        I
OPS:         I
```

### 4️⃣ Integração COBOL/Mainframe
```
TLC:         A (Governa mudança)
COBOL:       R (Implementa)
DEV:         C (Lado da API)
QA:          C (Teste integração)
PO:          I
LEAD:        I
OPS:         I
```

### 5️⃣ Testes Automatizados
```
QA:          R (Escreve testes)
DEV:         C (Expõe APIs/dados)
TLC:         C (Cenários legacy)
PO:          A (Aprova casos)
COBOL:       C (Dados mainframe)
LEAD:        I
OPS:         I
```

### 6️⃣ Deploy Produção
```
OPS:         R (Executa)
TLC:         A (Aprova mudanças)
DEV:         C (Validação final)
QA:          C (Smoke test)
LEAD:        I (Comunica time)
PO:          I
COBOL:       I
```

### 7️⃣ Monitoramento Pós-Deploy
```
OPS:         R (Monitora)
TLC:         A (Rollback?)
QA:          C (Regressão)
DEV:         C (Debug)
LEAD:        I (Saúde time)
PO:          I
COBOL:       I
```

---

## 💡 Regras Ouro

✅ **Toda task precisa de:**
- Exatamente **1 Accountable** (A)
- Pelo menos **1 Responsible** (R)
- Zero buracos (ninguém esquecido)

❌ **Evite:**
- Múltiplos A (confunde quem aprova)
- Nenhum C (isolamento de conhecimento)
- Tarefas ambíguas (quem faz?)

---

## 🚀 Exemplo Real: Feature Limite Auto

**Squad 2: Produtos de Crédito**

```
TAREFA: "Implementar Limite Automático"

PO:          R  ← Define critério de elegibilidade
TLC:         A  ← Aprova design final
DEV:         R  ← Codifica motor de regras
COBOL:       C  ← Consulta scoring legacy
QA:          R  ← Testa elegibilidade
LEAD:        I  ← Acompanha sprints
OPS:         I  ← Prepara deploy
```

**Fluxo esperado:**
1. PO define critério (sexta) → TLC revisa (segunda) ✅
2. DEV implementa (segunda-quarta) → COBOL integra dados ✅
3. QA testa (quarta-quinta) → PO aprova (sexta) ✅
4. OPS faz deploy (segunda próxima semana) ✅

---

## 📞 Quando Escalar

| Problema | Quem Avisa | Quem Resolve |
|----------|-----------|-------------|
| Requisito mudou | PO | TLC + DEV decidem impacto |
| Legacy bloqueado | COBOL | TLC governa solução |
| Bug crítico | QA | TLC aprova hotfix |
| Infra fora | OPS | TLC + OPS resolvem |
| Conflito de prioridade | LEAD | PO + LEAD decidem |

---

## 📊 Documento Vivo

**Esta matriz é um documento vivo:**
- Review **Quarterly** (a cada 3 meses)
- Atualize em **Retrospectivas**
- Teste em **Pilots** antes de aplicar globalmente
- Documenta **Exceções** (quando não seguir)

---

**Matriz RACI v1.0 • Fevereiro 2026**  
**Tribo Monetário • Business Domain: Cartões**  
**Próxima revisão: Maio 2026**

---

## 🔗 Links Úteis

- Full Docs: `CONTEXTO_FINANCEIRO.md`
- Guia Uso: `RACI_GUIDE.md`
- Customizar: `CUSTOMIZACAO.md`
- Técnico: `TECHNICAL_DOCS.md`
