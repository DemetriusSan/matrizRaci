# 📅 Playbook Diário - Usando RACI no Dia a Dia

Um guia rápido de **como aplicar RACI em situações reais** do seu time.

---

## 🌅 Manhã: Planejamento de Sprint

**Cenário:** PO e Tech Lead estão definindo tarefas da próxima sprint.

**O que fazer:**

1. **Abrir Matriz RACI** (http://localhost:4200)

2. **Para cada feature proposta:**
   - [ ] Clique "Adicionar Tarefa"
   - [ ] Nome: "Implementar [Feature]"
   - [ ] Descrição: Um parágrafo explicando
   - [ ] Clique "Adicionar Stakeholder" se necessário

3. **Atribuir responsabilidades:**
   - [ ] Clique nas células para atribuir R/A/C/I
   - [ ] Validar: "Tem 1 A + 1+ R?"
   - [ ] Se erro: Sistema avisa

4. **Documentar:**
   - [ ] "Exportar para JSON" (salvar em Confluence)
   - [ ] Compartilhar link da matriz com time
   - [ ] Mencionar RACI na story do Jira/Azure DevOps

**Exemplo prático:**

```
Feature: "Squad 1 - Ajustar taxa de juros"

R (Responsible) = Dev Backend
  ↳ "Quem implementa? Dev Backend"

A (Accountable) = Tech Lead
  ↳ "Quem aprova? Tech Lead"

C (Consulted) = Dev COBOL, QA
  ↳ "Quem consulta? Dev COBOL (integração), QA (testes)"

I (Informed) = PO, Leader, DevOps
  ↳ "Quem fica sabendo? Todos os outros"
```

**Resultado:**
- ✅ Feature clara
- ✅ Papéis definidos
- ✅ Zero ambiguidade

---

## 💼 Meio do Dia: Standup Ágil

**Cenário:** Time em daily standup (15 min).

**Como usar RACI:**

**Leader (facilita):**
```
"Pessoal, olhando a matriz de tarefas de hoje:

🟢 Dev Backend: Continua em 'Ajustar taxa de juros' (Responsible)
🟢 Dev COBOL: Integração com mainframe (Responsible)
🟡 QA: Bloqueado? Precisa de dados do Dev Backend?
🟡 Tech Lead: Alguém precisa da sua aprovação?
```

**Quando há problema:**
```
Dev: "Descobri que preciso do Dev COBOL para acessar tabela X"
Leader: "Olhando matriz: Dev COBOL está como C (Consulted)
        Vocês já se falaram? Se não, façam depois do standup."
```

**Atualizar matriz:**
- [ ] Task concluída? Remover ou marcar como "Done"
- [ ] Bloqueador? Adicionar tarefa "Desbloquear X"
- [ ] Descoberta de dependência? Atualizar assignments

**Tempo:**
- Verificar matriz: 2 min
- Atualizar: 3 min
- Total: dentro dos 15 min

---

## 🔧 Tarde: Resolução de Bloqueador

**Cenário:** Dev Backend diz "Preciso de dados do Dev COBOL, mas ele está ocupado"

**Usar RACI:**

1. **Abrir matriz > Tarefa: "Buscar dados do mainframe"**
2. **Verificar assignment:**
   - Dev Backend = **R** (Responsible - trabalho dele)
   - Dev COBOL = **C** (Consulted - opinião dele)
   - Tech Lead = ? (falta definir!)

3. **Chamada rápida com Dev COBOL:**
   - "Qual é seu estimado para isso?"
   - "Preciso de 2h? Pode ser depois?"

4. **Tech Lead decide:**
   - [ ] Aumentar prioridade (Dev COBOL faz AGORA)
   - [ ] Esperar até amanhã
   - [ ] Usar dados mockados enquanto espera

5. **Atualizar matriz:**
   - Se Tech Lead assumiu responsabilidade: Marcar como **R**
   - Se vai esperar: Atualizar timeline na descrição

**Resultado:**
- ✅ Bloqueador resolvido em 15 min
- ✅ Decisão documentada na matriz
- ✅ Próxima vez é mais rápido

---

## 🧪 Final de Dia: QA Testa Feature

**Cenário:** QA recebeu a tarefa pronta e vai testar.

**Usar RACI:**

1. **Abrir matriz > Tarefa: "Implementar [Feature]"**

2. **Ver quem foi Consulted (C):**
   - Se QA foi C: Deveria ter testes já escritos
   - Se QA NÃO foi C: Avisa Dev Backend

3. **Verificar:**
   - "Está tudo que combinamos nos testes?"
   - Comparar com especificação da tarefa

4. **Se encontrar bug:**
   - [ ] Criar nova tarefa: "Fix: [Bug]"
   - [ ] Marcar como bloqueador
   - [ ] Atribuir ao Dev Backend (R)
   - [ ] Atribuir Tech Lead (A)

5. **Se tudo OK:**
   - [ ] Marcar tarefa como validada
   - [ ] Liberar para DevOps fazer deploy

**Dica:**
```
Se fez bom trabalho como C (Consulted), QA vai gostar.
Se ignorou QA (não foi C), haverá retrabalho.
```

---

## 📱 Weekly Sync: Revisão da Matriz

**Cenário:** Toda sexta-feira (1h), o time faz sync semanal.

**Agenda:**

**1. Verificar integridade (5 min)**
```
- Todas as tarefas têm 1 A?
- Todas as tarefas têm 1+ R?
- Alguém ficou de fora de muitas tasks?
```

**2. Atualizar status (10 min)**
```
Para cada tarefa da semana:
- ✅ Concluída? Marcar como done, remover
- 🟡 Em progresso? Deixar como está
- 🔴 Bloqueada? Documentar bloqueador
```

**3. Identificar padrões (15 min)**
```
- Sempre um papel fica consultado? Talvez deveria ser C
- Dev COBOL sempre ocupado? Precisa de ajuda
- QA sempre encontra bugs? Teste mais cedo
```

**4. Atualizar documento (10 min)**
```
Se o padrão de RACI mudou para melhor:
- Atualizar CONTEXTO_FINANCEIRO.md
- Atualizar matriz padrão em QUICK_REFERENCE.md
```

**5. Compartilhar (10 min)**
```
- Email: "Matriz da semana de X/Y"
- Anexo: JSON exportado
- Slack: "Semana de sucesso! 5 features prontas"
```

**Exemplo de relatório:**
```
📊 SEMANA 5 - Relatório RACI

✅ Tasks Concluídas: 8
🟡 Em Progresso: 3
🔴 Bloqueadas: 1

🎯 Destaques:
- Squad 1 (Fatura) manteve 100% RACI compliance
- Squad 2 (Crédito) identificou 2 gaps no design

⚠️ Ações para semana que vem:
- Dev COBOL pediu ajuda do Dev Backend (load repartido)
- QA sugeriu testes no design (implementado!)
- Tech Lead vai revisar matriz de "Deploy" (foi caótico)
```

---

## 🚨 Quando Há Crise/Incident

**Cenário:** Sistema de fatura saiu do ar. War room agora!

**Usar RACI rapidamente:**

```
⚡ INCIDENT: Fatura não sendo gerada

1️⃣ Quem coordena? (A = Accountable)
   → Tech Lead (toma a decisão final)

2️⃣ Quem investi? (R = Responsible)
   → Dev Backend + Dev COBOL + QA (todos investigam)

3️⃣ Quem consulta? (C = Consulted)
   → DevOps (qual foi a mudança em prod?)
   → PO (qual é o impacto de negócio?)

4️⃣ Quem fica sabendo? (I = Informed)
   → Leader (comunicar status)
   → Operações (clientes podem estar vendo erro)
```

**Dividir trabalho baseado em RACI:**
```
🔴 Dev Backend: Investigar lado Java
   → "Quem foi Responsible pela integração? Dev Backend!"

🔴 Dev COBOL: Investigar lado mainframe
   → "Quem foi Responsible pela integração legacy? Dev COBOL!"

🟡 QA: Procurar testes que falharam
   → "QA era Consulted no design, deveria ter casos para isso"

🟡 DevOps: Verificar log de deploy
   → "Quando foi o deploy? O que mudou?"
```

**Resultado:**
- ✅ Problema resolvido 3x mais rápido
- ✅ Ninguém duplica trabalho
- ✅ Pós-mortem documentado

---

## 📚 Referência Rápida: Decisões Comuns

### "Quem aprova isto?"
→ Procure a célula **A (Accountable)**
```
Matriz > Tarefa > Coluna [Seu Papel] = A
```

### "Quem implementa?"
→ Procure a célula **R (Responsible)**
```
Matriz > Tarefa > Coluna [Seu Papel] = R
```

### "Preciso da opinião de alguém?"
→ Procure as células **C (Consulted)**
```
Matriz > Tarefa > Colunas com C
```

### "Alguém precisa saber disso?"
→ Procure as células **I (Informed)**
```
Matriz > Tarefa > Colunas com I
```

### "Fiz algo errado?"
→ Validar com "Validar Matriz"
```
Matriz > Botão "Validar"
Se aparecer erro: "Task X precisa de 1 Accountable"
```

---

## 💡 Dicas Ninja de RACI

### 1. Nunca deixe vazio
```
❌ BAD: Task sem ninguém atribuído
✅ GOOD: Sempre ter pelo menos R + A
```

### 2. Não atribua a mais de 1 A
```
❌ BAD: Dois Accountables (quem aprova?)
✅ GOOD: Um A + múltiplos R
```

### 3. Se alguém está sempre isolado, revise
```
Exemplo: "Dev COBOL nunca é C, sempre é I"
→ Talvez deveria participar mais do design
```

### 4. Use RACI para detectar dependências
```
Exemplo: Dev Backend = R, Dev COBOL = C
→ Prova que há dependência, valide timeline
```

### 5. Atualize quando aprender
```
Primeira vez que atribui: Chute informado
Depois: Aprendeu mais, mude a matriz
```

---

## 🎯 Checklist: Usando RACI Todo Dia

### Todo Dia (5 min)
- [ ] Ao começar sprint: adicionar tarefas à matriz
- [ ] Em standup: verificar bloqueadores via RACI
- [ ] Ao final: atualizar status das tarefas

### Toda Semana (30 min)
- [ ] Sexta (final do dia): revisão de integridade
- [ ] Atualizar matriz padrão se aprendeu algo novo
- [ ] Compartilhar com time (Slack/Email)

### Todo Mês (2h)
- [ ] Revisar padrões de RACI
- [ ] Atualizar [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md)
- [ ] Agregar learnings

### Todo Trimestre (meio dia)
- [ ] Reunião: Como está funcionando?
- [ ] Ajustar papéis se necessário
- [ ] Treinar nova pessoa com RACI

---

## 🔗 Links Rápidos

- **Entender RACI?** → Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md)
- **Ver tabelas prontas?** → Imprima [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Como usar o app?** → Veja [RACI_GUIDE.md](RACI_GUIDE.md)
- **Casos reais?** → Consulte [USE_CASES.md](USE_CASES.md)
- **Estrutura técnica?** → Leia [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)

---

## ✅ Sucesso = Quando Você Pensa em RACI Naturalmente

```
"Vocês já definiram quem faz quê nessa feature?"
    ↓
"Abrir RACI, rapidinho"
    ↓
"Ah, Dev COBOL não estava como Consulted!"
    ↓
"Chama Dev COBOL aqui"
    ↓
"Pronto, combinado"
    ↓
"Matriz atualizada, pode começar"
```

Quando você chega aqui, **RACI virou cultura**, não ferramenta.

---

**Playbook v1.0 • Fevereiro 2026**  
**Use este doc diariamente!**
