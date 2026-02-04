# 📊 Matriz RACI - Interface de Gestão

Uma interface completa e profissional para criar e gerenciar **Matrizes RACI** (Responsibility Assignment Matrix) para estruturar a área de trabalho com ferramentas de qualidade.

## ✨ O que é uma Matriz RACI?

A Matriz RACI é uma ferramenta de gestão que define claramente as responsabilidades e papéis de cada membro da equipe em relação às tarefas ou processos. Cada letra representa um papel específico:

- **R (Responsável)**: Quem executa o trabalho
- **A (Autoridade)**: Quem é responsável pelo resultado final (deve haver apenas um)
- **C (Consultado)**: Quem fornece informações e expertise antes da decisão
- **I (Informado)**: Quem precisa ser notificado após a decisão ou ação

## 🚀 Funcionalidades Principais

### 📋 Gerenciamento de Matriz
- ✅ Criar e gerenciar múltiplas matrizes RACI
- ✅ Adicionar/remover tarefas dinamicamente
- ✅ Adicionar/remover stakeholders
- ✅ Atualizar atribuições de papéis RACI

### 🎯 Interface Intuitiva
- ✅ Tabela interativa com visualização clara de responsabilidades
- ✅ Clique para alternar entre papéis RACI
- ✅ Cores codificadas para cada papel
- ✅ Resumo visual de atribuições por stakeholder

### ✔️ Validação Inteligente
- ✅ Validação automática da estrutura da matriz
- ✅ Alertas para problemas de atribuição
- ✅ Verificação de papéis obrigatórios (R e A)

### 📥 Exportação
- ✅ Exportar matriz para JSON
- ✅ Salvar configurações para análise posterior

### 📱 Responsivo
- ✅ Design adapta-se a diferentes tamanhos de tela
- ✅ Otimizado para desktop, tablet e mobile

## 🛠️ Como Usar

### Instalação

```bash
cd matrizRaci
npm install
```

### Executar Desenvolvimento

```bash
npm start
```

A aplicação estará disponível em `http://localhost:4200`

### Construir para Produção

```bash
npm run build
```

## 📖 Guia de Uso

### 1️⃣ Adicionar um Stakeholder

1. Clique no botão **"➕ Adicionar Stakeholder"**
2. Digite o nome do stakeholder
3. Clique em **"Adicionar"**

### 2️⃣ Adicionar uma Tarefa

1. Clique no botão **"➕ Adicionar Tarefa"**
2. Digite o nome e descrição da tarefa (descrição é opcional)
3. Clique em **"Adicionar"**

### 3️⃣ Atribuir Papéis RACI

1. Clique na célula onde deseja atribuir um papel (cruzamento da tarefa com stakeholder)
2. A célula alterará automaticamente entre:
   - Vazio (-) → R (Responsável) → A (Autoridade) → C (Consultado) → I (Informado) → Vazio

### 4️⃣ Visualizar Detalhes

1. Clique no botão "⋯" ao lado da tarefa
2. Veja o resumo de todas as atribuições da tarefa

### 5️⃣ Validar a Matriz

A validação é automática:
- ✅ Se verde: Sua matriz está válida
- ⚠️ Se amarelo: Há avisos de validação que você deve resolver

### 6️⃣ Exportar para JSON

1. Clique no botão **"📥 Exportar"** no cabeçalho
2. Um arquivo JSON será baixado com toda a estrutura da matriz

## 🎨 Estrutura de Cores

| Papel | Cor | Descrição |
|-------|-----|-----------|
| **R** | Azul | Responsável pela execução |
| **A** | Vermelho | Autoridade/Responsabilização |
| **C** | Laranja | Consultado |
| **I** | Cinza | Informado |
| **-** | Cinza claro | Sem atribuição |

## 📊 Exemplo de Matriz RACI

Veja o exemplo incluído na aplicação:

| Tarefa | Gerente de Projeto | Líder Técnico | Designer | QA | Cliente | Diretor |
|--------|---|---|---|---|---|---|
| **Definir Escopo** | A | C | - | - | R | I |
| **Planejar Recursos** | R | C | - | I | - | A |
| **Desenvolvimento** | I | A | R | C | - | - |
| **Testes de Qualidade** | A | C | - | R | I | - |
| **Aprovação e Deploy** | R | I | - | - | C | A |

## 🔧 Estrutura do Projeto

```
src/
├── app/
│   ├── features/
│   │   └── raci/
│   │       ├── raci-matrix.component.ts          # Lógica do componente
│   │       ├── raci-matrix.component.html        # Template
│   │       └── raci-matrix.component.scss        # Estilos
│   ├── shared/
│   │   ├── models/
│   │   │   └── raci.model.ts                     # Interfaces e modelos
│   │   └── services/
│   │       └── raci.service.ts                   # Lógica de negócio
│   └── app.ts                                     # Componente raiz
└── ...
```

## 📝 Modelos de Dados

### RACIMatrix
```typescript
{
  id: string;
  name: string;
  description?: string;
  team: string;
  department: string;
  createdDate: Date;
  updatedDate: Date;
  stakeholders: string[];
  tasks: RACITask[];
}
```

### RACITask
```typescript
{
  id: string;
  name: string;
  description?: string;
  assignments: Map<string, RACIAssignment>;
}
```

### RACIAssignment
```typescript
{
  id: string;
  role: RACIRole | null;
  notes?: string;
}
```

## 🧪 Validação da Matriz

A aplicação valida automaticamente:

1. **Tarefas sem Responsável (R)**: Aviso ⚠️
2. **Tarefas sem Autoridade (A)**: Erro ❌
3. **Tarefas com múltiplos Responsáveis (A)**: Erro ❌
4. **Ausência de stakeholders**: Aviso ⚠️
5. **Ausência de tarefas**: Aviso ⚠️

## 💡 Boas Práticas

✅ **Faça:**
- Defina claramente um (e apenas um) Responsável pela Autoridade (A) por tarefa
- Tenha pelo menos um Responsável (R) para executar cada tarefa
- Consulte especialistas (C) antes de tomar decisões importantes
- Mantenha informados (I) todos os stakeholders relevantes

❌ **Evite:**
- Deixar tarefas sem atribuições
- Ter múltiplos Responsáveis pela Autoridade (A)
- Matrizes muito grandes e complexas (divida em múltiplas matrizes)

## 📱 Responsividade

A Matriz RACI é totalmente responsiva:
- **Desktop**: Visualização completa com scroll horizontal se necessário
- **Tablet**: Layout otimizado com fonte ajustada
- **Mobile**: Colapsável com detalhes expandíveis

## 🔐 Armazenamento

Atualmente, os dados são armazenados em memória. Para produção, você pode:

1. Adicionar persistência com LocalStorage
2. Integrar com um backend API
3. Conectar com banco de dados

## 🚀 Próximas Melhorias

Funcionalidades sugeridas para futuras versões:

- [ ] Persistência em banco de dados
- [ ] Importar matriz de JSON
- [ ] Histórico de alterações
- [ ] Comentários e notas nas atribuições
- [ ] Gráficos de distribuição de responsabilidades
- [ ] Colaboração em tempo real
- [ ] Exportar para Excel/PDF
- [ ] Integração com ferramentas de gestão de projetos

## 📞 Suporte

Para dúvidas ou sugestões sobre a Matriz RACI:

- 📖 Leia a documentação no cabeçalho
- 🎯 Consulte os exemplos inclusos
- 💬 Verifique a seção de validação para dicas

## 📄 Licença

Este projeto é fornecido como ferramenta de qualidade para estruturação organizacional.

---

**Desenvolvido com ❤️ para melhorar a clareza de responsabilidades em sua organização.**
