# 📑 Índice Completo - Matriz RACI Financeira

## 🎯 Por Onde Começar?

### Se você é um **Executivo/Leader** do Time
1. Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) - Entender estrutura
2. Imprima [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Compartilhar com time
3. Use [RACI_GUIDE.md](RACI_GUIDE.md) - Treinar o time

### Se você é um **Product Owner (PO)**
1. Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) - Seu papel específico
2. Use [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Referência rápida
3. Revise [RACI_GUIDE.md](RACI_GUIDE.md) - Como usar a aplicação

### Se você é um **Desenvolvedor Backend**
1. Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) - Entender contexto
2. Consulte [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) - Arquitetura
3. Customize em [CUSTOMIZACAO.md](CUSTOMIZACAO.md) - Adicionar features

### Se você é um **Tech Lead / Arquiteto**
1. Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) - Seu papel
2. Revise [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) - Decisões arquiteturais
3. Customize em [CUSTOMIZACAO.md](CUSTOMIZACAO.md) - Governança
4. Deploy com [SETUP_GUIDE.md](SETUP_GUIDE.md) - Infraestrutura

### Se você é **QA / Tester**
1. Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) - Seu papel (R/C/I)
2. Use [RACI_GUIDE.md](RACI_GUIDE.md) - Usar a aplicação
3. Contribua com [CUSTOMIZACAO.md](CUSTOMIZACAO.md) - Validações

### Se você é **DevOps / SRE**
1. Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) - Seu papel (R/A/C)
2. Customize em [SETUP_GUIDE.md](SETUP_GUIDE.md) - Deploy & CI/CD
3. Implemente em [CUSTOMIZACAO.md](CUSTOMIZACAO.md) - Autenticação/Backend

---

## 📁 Estrutura de Documentos

### Documentos Contextuais (Leia Primeiro)

| Arquivo | Tamanho | Público | Propósito |
|---------|---------|---------|-----------|
| [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) | ~500 linhas | ✅ Todos | **Entender sua instituição, tribo, squads e papéis** |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | ~400 linhas | ✅ Todos | **Tabelas RACI prontas para imprimir** |

### Guias de Uso

| Arquivo | Tamanho | Público | Propósito |
|---------|---------|---------|-----------|
| [RACI_GUIDE.md](RACI_GUIDE.md) | ~400 linhas | ✅ Todos | **Como usar a aplicação interativa** |
| [README.md](README.md) | ~150 linhas | ✅ Todos | **Início rápido, quick start** |

### Guias Técnicos

| Arquivo | Tamanho | Público | Propósito |
|---------|---------|---------|-----------|
| [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) | ~400 linhas | 👨‍💻 Devs | **Arquitetura, data flow, componentes** |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | ~350 linhas | 👨‍💻 Devs | **Ambiente, build, deploy, troubleshooting** |
| [CUSTOMIZACAO.md](CUSTOMIZACAO.md) | ~450 linhas | 👨‍💻 Devs | **Como adaptar para seu contexto** |

### Arquivos Automáticos

| Arquivo | Tipo | Propósito |
|---------|------|-----------|
| IMPLEMENTATION_SUMMARY.md | Info | Resumo do que foi implementado |
| USE_CASES.md | Exemplos | Casos de uso reais |

---

## 🔄 Matriz de Cruzamento: Doc × Papel

|  | PO | Dev Backend | Tech Lead | Dev COBOL | QA | Leader | DevOps |
|--|----|-----------|-----------|---------|----|--------|--------|
| **CONTEXTO_FINANCEIRO.md** | 🔴 | 🟢 | 🔴 | 🔴 | 🟢 | 🔴 | 🟢 |
| **QUICK_REFERENCE.md** | 🔴 | 🟢 | 🔴 | 🟢 | 🟢 | 🔴 | 🟢 |
| **RACI_GUIDE.md** | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 |
| **TECHNICAL_DOCS.md** | 🟡 | 🔴 | 🔴 | 🟡 | 🟢 | ⚪ | 🟢 |
| **SETUP_GUIDE.md** | ⚪ | 🟡 | 🟡 | ⚪ | 🟡 | ⚪ | 🔴 |
| **CUSTOMIZACAO.md** | 🟡 | 🔴 | 🔴 | 🟡 | 🟡 | 🟡 | 🟡 |

**Cores:** 🔴 Crítico = 🟢 Importante = 🟡 Referência = ⚪ Opcional

---

## 📊 Fluxo de Leitura Recomendado

### Semana 1: Kick-off

**Segunda:**
- Team: Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md) (30 min)
- Print: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- Setup: `npm install && npm start`

**Terça-Quinta:**
- Cada pessoa: Seu role em [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md)
- Workshop: Discutir matriz padrão (1h)

**Sexta:**
- Demo: Usar a aplicação [RACI_GUIDE.md](RACI_GUIDE.md)
- Customizar: Dados do seu time
- Publicar matriz no Confluence/Wiki

### Semana 2: Implementação

- Devs: [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) + [SETUP_GUIDE.md](SETUP_GUIDE.md)
- QA: Adicionar testes (veja [CUSTOMIZACAO.md](CUSTOMIZACAO.md))
- DevOps: CI/CD setup ([SETUP_GUIDE.md](SETUP_GUIDE.md))

### Semana 3+: Iteração

- Use [RACI_GUIDE.md](RACI_GUIDE.md) para atualizar matriz
- Customize conforme necessidade ([CUSTOMIZACAO.md](CUSTOMIZACAO.md))
- Review quarterly (update [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md))

---

## 🎓 Glossário Rápido

| Termo | Significado | Exemplo |
|-------|-------------|---------|
| **RACI** | Responsible, Accountable, Consulted, Informed | Matriz de papéis |
| **Tribo** | Grupo de squads com mesma área de negócio | Tribo Monetário |
| **Squad** | Time pequeno, autossuficiente | Squad de Fatura |
| **Domain** | Domínio de negócio | Cartões |
| **Epic** | Grande funcionalidade, vários sprints | "Novo motor de crédito" |
| **Feature** | Pequena funcionalidade | "Limite automático" |
| **R** | Responsible - Faz o trabalho | Dev Backend codifica |
| **A** | Accountable - Aprova/responde | Tech Lead aprova design |
| **C** | Consulted - Opina/contribui | QA sugere testes |
| **I** | Informed - Fica sabendo | PO acompanha |

---

## 🔗 Links Cruzados

### De [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md)
- Matriz padrão → Veja [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- Usar a matriz → Leia [RACI_GUIDE.md](RACI_GUIDE.md)
- Código da aplicação → Revise [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)

### De [RACI_GUIDE.md](RACI_GUIDE.md)
- Entender papéis → Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md)
- Tabelas de referência → Imprima [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- Adicionar dados reais → Configure em [CUSTOMIZACAO.md](CUSTOMIZACAO.md)

### De [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)
- Contexto negócio → Leia [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md)
- Como modificar → Siga [CUSTOMIZACAO.md](CUSTOMIZACAO.md)
- Deploy → Configure em [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## ✅ Checklist de Onboarding

### Para o Time (1h)
- [ ] Todos leram [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md)
- [ ] Print de [QUICK_REFERENCE.md](QUICK_REFERENCE.md) na mesa
- [ ] Discutir: "Qual é meu papel?" (R/A/C/I em cada atividade)
- [ ] Agregar sobre validação: "1 A + 1+ R por tarefa"

### Para Devs (3h)
- [ ] Setup local: `npm install && npm start`
- [ ] Entender arquitetura ([TECHNICAL_DOCS.md](TECHNICAL_DOCS.md))
- [ ] Customizar dados ([CUSTOMIZACAO.md](CUSTOMIZACAO.md))
- [ ] Executar testes locais
- [ ] Deploy em dev ([SETUP_GUIDE.md](SETUP_GUIDE.md))

### Para Produção (1 dia)
- [ ] Build: `npm run build`
- [ ] Deploy: Seguir [SETUP_GUIDE.md](SETUP_GUIDE.md)
- [ ] Teste de smoke
- [ ] Comunicar URL ao time
- [ ] Começar a usar: [RACI_GUIDE.md](RACI_GUIDE.md)

---

## 🚀 Próximos Passos

1. **Escolha seu caminho:** Qual papel você tem?
2. **Leia o documento** recomendado para seu perfil (veja acima)
3. **Customize** usando [CUSTOMIZACAO.md](CUSTOMIZACAO.md)
4. **Compartilhe** [QUICK_REFERENCE.md](QUICK_REFERENCE.md) com time
5. **Deploy** seguindo [SETUP_GUIDE.md](SETUP_GUIDE.md)
6. **Use** conforme [RACI_GUIDE.md](RACI_GUIDE.md)
7. **Review** trimestralmente e atualize [CONTEXTO_FINANCEIRO.md](CONTEXTO_FINANCEIRO.md)

---

## 📞 Suporte

Se tiver dúvidas:
1. Procure no **Índice** (este arquivo)
2. Consulte o **Glossário** acima
3. Leia o documento específico para seu perfil
4. Abra issue no repositório ou chame o Tech Lead

---

**Última atualização:** Fevereiro 2026  
**Mantido por:** Tech Lead / Leader  
**Acesso:** Público (compartilhar com time)
