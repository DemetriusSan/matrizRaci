# 🚀 Primeiros Passos - Guia de Início Rápido

**Você tem 30 minutos?** Siga este guia e estará usando RACI!

---

## ⏱️ 5 MIN: Setup Inicial

### 1. Clone ou acesse o repositório
```bash
cd c:/Users/Demetrius/matrizRaci/matrizRaci
npm install
npm start
```

### 2. Abra no navegador
```
http://localhost:4200
```

### 3. Você deve ver
- ✅ Página com título "Matriz RACI - Tribo Monetário"
- ✅ 6 stakeholders listados
- ✅ 6 tarefas na tabela
- ✅ Células coloridas com R/A/C/I

**Pronto!** Aplicação rodando ✨

---

## ⏱️ 10 MIN: Entender RACI

### Leia rápido
**Abra:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

Pule para: **"🎲 Letras RACI"**

```
R = Responsible  → Quem EXECUTA
A = Accountable  → Quem APROVA
C = Consulted    → Quem OPINA
I = Informed     → Quem FICA SABENDO
```

### Regra de ouro
```
Cada tarefa precisa de:
✅ 1 Accountable (A)
✅ 1+ Responsible (R)
```

**Tempo:** ~5 min  
**Saída:** Você entende o conceito!

---

## ⏱️ 10 MIN: Explorar a Aplicação

### Clique em uma tarefa (ex: "Definição de Requisitos")

Você verá:
```
MATRIZ:
PO          → A (Accountable)
Tech Lead   → C (Consulted)
Dev Backend → C (Consulted)
QA          → I (Informed)
DevOps      → I (Informed)
Dev COBOL   → I (Informed)
Leader      → I (Informed)
```

### Clique em uma célula

Por exemplo: Clique na célula **PO** da tarefa **"Implementação Backend"**

Você verá:
- Célula muda de cor
- Agora é **R** (Responsible)
- Clique de novo → vira **A** (Accountable)
- Clique novamente → **C** (Consulted)
- Continue → **I** (Informed)
- Uma mais → fica vazia

**Isso é atribuição dinâmica!**

### Botão "Validar Matriz"

Clique e você verá:
```
✅ Validação passou!

ou

❌ Erro: Tarefa "X" não tem Accountable
   (Precisa exatamente de 1 A)
```

**Pronto!** Você explorou a app ✨

---

## ⏱️ 5 MIN: Adicionar Sua Primeira Tarefa

### 1. Clique "Adicionar Tarefa"

Um formulário aparece:

```
Nome da Tarefa: [_____________]
Descrição:      [_____________]
```

### 2. Digite
```
Nome: "Integração com Banco de Dados"
Descrição: "Conectar com Oracle para Fatura"
```

### 3. Clique "Salvar"

Tarefa aparece na matriz!

### 4. Atribua RACI

Clique nas células para definir:
- Dev Backend = R (vai implementar)
- Tech Lead = A (vai aprovar)
- QA = C (vai consultar)

### 5. Clique "Validar Matriz"

Se ficar verde ✅ = tudo certo!

**Pronto!** Você criou sua primeira tarefa RACI ✨

---

## ⏱️ 5 MIN: Exportar & Compartilhar

### 1. Clique "Exportar para JSON"

Arquivo `.json` baixa no seu computador.

### 2. Abra o arquivo em editor de texto

Você verá:
```json
{
  "id": "1",
  "name": "Matriz RACI - Tribo Monetário",
  "tasks": [
    { "id": "1", "name": "...", "assignments": {...} }
  ]
}
```

### 3. Compartilhe!

- Email para seu time
- Slack para group
- Confluence/Wiki da empresa
- GitHub repo

**Pronto!** Matriz compartilhada ✨

---

## 📚 Próximas Leituras (por ordem)

### 🟢 Essencial (15 min)
1. [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) - Seção "Papéis"
2. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Tabelas RACI padrão

### 🟡 Importante (30 min)
3. [PLAYBOOK_DIARIO.md](PLAYBOOK_DIARIO.md) - Como usar no dia a dia
4. [RACI_GUIDE.md](RACI_GUIDE.md) - Guia completo da app

### 🔵 Técnico (1h)
5. [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) - Se for customizar
6. [CUSTOMIZACAO.md](CUSTOMIZACAO.md) - Como estender
7. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Deploy em produção

### ⚪ Referência
8. [INDEX.md](INDEX.md) - Índice completo de tudo

---

## ❓ Perguntas Rápidas

### "Sou PO, por onde começo?"
1. Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) - "PO"
2. Veja [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Tabelas
3. Use [PLAYBOOK_DIARIO.md](PLAYBOOK_DIARIO.md) - "Definir Requisitos"

### "Sou Dev Backend, por onde começo?"
1. Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) - "Dev Backend"
2. Estude [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) - Arquitetura
3. Customize em [CUSTOMIZACAO.md](CUSTOMIZACAO.md) - Integração com API

### "Sou QA, por onde começo?"
1. Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) - "QA"
2. Veja [PLAYBOOK_DIARIO.md](PLAYBOOK_DIARIO.md) - "QA Testa Feature"
3. Consulte [RACI_GUIDE.md](RACI_GUIDE.md) - Como usar

### "Sou Tech Lead, por onde começo?"
1. Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) - Completo
2. Revise [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) - Design
3. Implemente [SETUP_GUIDE.md](SETUP_GUIDE.md) - Deploy

### "Sou Leader/Gestor, por onde começo?"
1. Leia [SUMARIO_EXECUTIVO.md](SUMARIO_EXECUTIVO.md)
2. Siga [PLANO_4_SEMANAS.md](PLANO_4_SEMANAS.md)
3. Use [PLAYBOOK_DIARIO.md](PLAYBOOK_DIARIO.md) - Facilitação

### "Sou DevOps, por onde começo?"
1. Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) - "DevOps"
2. Estude [SETUP_GUIDE.md](SETUP_GUIDE.md) - Deployment
3. Configure [CUSTOMIZACAO.md](CUSTOMIZACAO.md) - Backend real

---

## 🎯 Seu Checklist (Primeiros 30 min)

- [ ] npm start rodando (5 min)
- [ ] App aberto em http://localhost:4200 (1 min)
- [ ] Entendeu RACI (5 min) - [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- [ ] Explorou a app (5 min)
- [ ] Adicionou 1 tarefa (5 min)
- [ ] Atribuiu RACI (5 min)
- [ ] Exportou JSON (2 min)
- [ ] Leu seu papel em [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) (2 min)

**Total:** 30 min ✅

---

## 🚀 Próximos Passos (Dia 1)

**Manhã:**
- [ ] Ler [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) (30 min)
- [ ] Imprimir [QUICK_REFERENCE.md](QUICK_REFERENCE.md) (2 min)

**Tarde:**
- [ ] Customizar dados para seu time (1h)
  - Adicionar tarefas reais
  - Atribuir seus papéis
  - Validar
- [ ] Compartilhar com 1 colega (10 min)

**Resultado:**
- ✅ Team conhece conceito
- ✅ Matriz customizada
- ✅ Pronto para usar

---

## 📞 Problemas Comuns & Soluções

### "App não carrega"
```
Solução:
1. npm install
2. npm start
3. Aguarde "Application bundle generation complete"
4. Abra http://localhost:4200
```

### "Não consigo clicar nas células"
```
Solução:
1. Certifique que tem Accountable (A) na tarefa
2. Clique na célula específica (não na row inteira)
3. Refresh página (Ctrl+R)
```

### "Não consigo adicionar tarefa"
```
Solução:
1. Clique "Adicionar Tarefa"
2. Preencha nome e descrição
3. Clique "Salvar"
4. Se erro: veja console (F12)
```

### "Exportou JSON vazio"
```
Solução:
1. Certifique que tem tarefas na matriz
2. Clique "Validar Matriz" primeiro
3. Depois "Exportar para JSON"
```

### "Dúvida sobre qual é meu papel"
```
Solução:
1. Abra [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md)
2. Procure sua seção (PO, Dev, QA, etc)
3. Leia "O que faz" e "Responsabilidades"
```

---

## 🎓 Aprender Mais

| Tópico | Documento | Tempo |
|--------|-----------|-------|
| Entender RACI | QUICK_REFERENCE | 5 min |
| Seu papel específico | CONTEXTO_FINANCEIRO | 10 min |
| Como usar diário | PLAYBOOK_DIARIO | 15 min |
| App completa | RACI_GUIDE | 20 min |
| Arquitetura | TECHNICAL_DOCS | 30 min |
| Customizar | CUSTOMIZACAO | 1h |
| Roadmap completo | PLANO_4_SEMANAS | 30 min |

---

## ✅ Sucesso = Quando Você Pensa RACI Naturalmente

```
Amanhã em standup:

Dev: "Preciso de dados do mainframe"

You: "Quem é Responsible? Dev COBOL?"
     "Quem é Accountable? Tech Lead?"

Dev: "Sim!"

You: "Abrir RACI, consultar Dev COBOL,
      Tech Lead aprova. Pronto em 2h?"

Dev: "Perfeito!"
```

**Quando chega aqui, RACI virou cultura!** 🎉

---

## 📞 Precisa de Ajuda?

1. **Pergunta rápida?** → Consulte [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
2. **Seu papel?** → Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md)
3. **Como usar?** → Veja [PLAYBOOK_DIARIO.md](PLAYBOOK_DIARIO.md)
4. **Problema técnico?** → Confira [SETUP_GUIDE.md](SETUP_GUIDE.md)
5. **Tudo?** → Consulte [INDEX.md](INDEX.md)

---

**Você está pronto!** 🚀

Volta aqui em 1 semana e conte como foi usar RACI com seu time.

**Próxima revisão:** 7 dias  
**Feedback esperado:** NPS ≥ 4.0

Sucesso! 🎯
