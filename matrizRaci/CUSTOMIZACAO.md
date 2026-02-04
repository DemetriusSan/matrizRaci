# 🎨 Guia de Customização - Matriz RACI Financeira

Você recebeu a Matriz RACI configurada para sua instituição financeira (Cartões, Fatura, Crédito). Este arquivo explica como customizar para seus **processos específicos**.

---

## 🔧 Como Customizar

### 1️⃣ Alterar Dados de Exemplo

**Arquivo:** `src/app/shared/services/raci.service.ts`

No método `loadSampleData()`:

```typescript
private loadSampleData(): void {
    const sampleMatrix: RACIMatrix = {
      id: '1',
      name: 'Sua Matriz Aqui',           // ← Mude o nome
      description: 'Sua descrição',       // ← Descrição
      team: 'Nome do Time',               // ← Time
      department: 'Seu Departamento',     // ← Depto
      stakeholders: [                     // ← Adicione seus papéis
        'Papel 1',
        'Papel 2',
        // ...
      ],
      tasks: [                            // ← Adicione suas tarefas
        {
          id: '1',
          name: 'Sua Tarefa',
          description: 'Descrição',
          assignments: new Map([          // ← Defina RACI para cada papel
            ['Papel 1', { id: '1-1', role: RACIRole.RESPONSIBLE }],
            ['Papel 2', { id: '1-2', role: RACIRole.ACCOUNTABLE }],
          ])
        }
      ]
    };
}
```

**Valores de RACIRole:**
- `RACIRole.RESPONSIBLE` = **R** (Responsável, executa)
- `RACIRole.ACCOUNTABLE` = **A** (Accountable, aprova)
- `RACIRole.CONSULTED` = **C** (Consultado, fornece input)
- `RACIRole.INFORMED` = **I** (Informado, fica sabendo)

### 2️⃣ Adicionar Múltiplas Matrizes

Se sua Tribo precisa de **matrizes diferentes** para cada Squad:

```typescript
private loadSampleData(): void {
    // Matriz Squad 1: Fatura
    const squad1Matrix: RACIMatrix = {
      id: '1',
      name: 'Squad 1 - Fatura',
      // ...
    };

    // Matriz Squad 2: Crédito
    const squad2Matrix: RACIMatrix = {
      id: '2',
      name: 'Squad 2 - Produtos de Crédito',
      // ...
    };

    // Carrega ambas
    this.matrices$.next([squad1Matrix, squad2Matrix]);
    this.currentMatrix$.next(squad1Matrix);  // Define a primeira como padrão
}
```

### 3️⃣ Mudar Cores RACI

**Arquivo:** `src/app/shared/models/raci.model.ts`

```typescript
export const RACI_DEFINITIONS: RACIDefinition[] = [
  {
    role: RACIRole.RESPONSIBLE,
    label: 'Responsável',
    description: 'Executa o trabalho',
    color: '#3498db',  // ← Azul (mude aqui)
    backgroundColor: '#ebf5fb'
  },
  {
    role: RACIRole.ACCOUNTABLE,
    label: 'Accountable',
    description: 'Prestação de contas final',
    color: '#e74c3c',  // ← Vermelho
    backgroundColor: '#fadbd8'
  },
  {
    role: RACIRole.CONSULTED,
    label: 'Consultado',
    description: 'Consulta para expertise',
    color: '#f39c12',  // ← Laranja
    backgroundColor: '#fdebd0'
  },
  {
    role: RACIRole.INFORMED,
    label: 'Informado',
    description: 'Recebe notificação',
    color: '#95a5a6',  // ← Cinza
    backgroundColor: '#ecf0f1'
  }
];
```

**Cores sugeridas para instituição financeira:**
- R (Responsável): Verde `#27ae60` (ação, execução)
- A (Accountable): Vermelho `#c0392b` (autoridade, decisão)
- C (Consulted): Azul `#2980b9` (expertise)
- I (Informed): Cinza `#7f8c8d` (observação)

### 4️⃣ Customizar Estilos (Tema)

**Arquivo:** `src/app/features/raci/raci-matrix.component.scss`

```scss
// Cores principais
$header-gradient-start: #667eea;    // ← Mude aqui
$header-gradient-end: #764ba2;      // ← E aqui

// Espaçamentos
$spacing-unit: 16px;
$border-radius: 8px;

// Tabela
$table-header-bg: #f8f9fa;
$table-border-color: #dee2e6;

// Células
$cell-padding: 12px;
```

### 5️⃣ Adicionar Validações Customizadas

**Arquivo:** `src/app/shared/services/raci.service.ts`

Método `validateMatrix()`:

```typescript
validateMatrix(matrix: RACIMatrix): string[] {
    const errors: string[] = [];

    for (const task of matrix.tasks) {
      // Validação padrão: Todo task precisa de exatamente 1 A (Accountable)
      const accountables = Array.from(task.assignments.values())
        .filter(a => a.role === RACIRole.ACCOUNTABLE);
      
      if (accountables.length === 0) {
        errors.push(`Task "${task.name}": Precisa de 1 Accountable (A)`);
      }
      if (accountables.length > 1) {
        errors.push(`Task "${task.name}": Só pode ter 1 Accountable (A)`);
      }

      // Validação customizada: Adicione aqui
      // Exemplo: Deve ter pelo menos 1 R (Responsible)
      const responsibles = Array.from(task.assignments.values())
        .filter(a => a.role === RACIRole.RESPONSIBLE);
      
      if (responsibles.length === 0) {
        errors.push(`Task "${task.name}": Precisa de pelo menos 1 Responsible (R)`);
      }
    }

    return errors;
}
```

### 6️⃣ Integrar com Backend Real

Atualmente, a aplicação usa dados em memória. Para **conectar com API real**:

**Arquivo:** `src/app/shared/services/raci.service.ts`

```typescript
import { HttpClient } from '@angular/common/http';

export class RACIService {
  constructor(private http: HttpClient) {
    // Ao invés de loadSampleData(), faça:
    this.loadFromBackend();
  }

  private loadFromBackend(): void {
    this.http.get<RACIMatrix[]>('/api/matrices').subscribe(matrices => {
      this.matrices$.next(matrices);
      if (matrices.length > 0) {
        this.currentMatrix$.next(matrices[0]);
      }
    });
  }

  saveMatrix(matrix: RACIMatrix): Observable<RACIMatrix> {
    return this.http.post<RACIMatrix>('/api/matrices', matrix);
  }
}
```

Depois importe `HttpClientModule` em `app.config.ts`:

```typescript
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),  // ← Adicione
    // ...
  ]
};
```

---

## 📱 Personalizações Comuns

### Adicionar Novo Campo na Task

Você quer rastrear **Sprint** ou **Epic** em cada tarefa?

1. **Atualize o modelo** (`raci.model.ts`):
```typescript
export interface RACITask {
  id: string;
  name: string;
  description: string;
  sprint?: string;        // ← Novo campo
  epic?: string;          // ← Novo campo
  assignments: Map<string, RACIAssignment>;
}
```

2. **Atualize o template** (`raci-matrix.component.html`):
```html
<div class="task-detail" *ngIf="getSelectedTask() as selectedTask">
  <h4>{{ selectedTask.name }}</h4>
  <p>{{ selectedTask.description }}</p>
  <p v-if="selectedTask.sprint">Sprint: {{ selectedTask.sprint }}</p>
  <p v-if="selectedTask.epic">Epic: {{ selectedTask.epic }}</p>
</div>
```

### Exportar para Excel

Ao invés de JSON, exportar para Excel (usando `xlsx` library):

```typescript
npm install xlsx

// No serviço:
exportToExcel(matrix: RACIMatrix): void {
  const workbook = XLSX.utils.book_new();
  
  // Preparar dados da tabela
  const data = matrix.tasks.map(task => ({
    'Tarefa': task.name,
    ...matrix.stakeholders.reduce((acc, sh) => ({
      ...acc,
      [sh]: this.getAssignment(task.id, sh)?.role || '-'
    }), {})
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'RACI');
  XLSX.writeFile(workbook, `${matrix.name}.xlsx`);
}
```

### Adicionar Histórico de Versões

Rastrear mudanças ao longo do tempo:

```typescript
export interface RACIMatrixVersion {
  version: number;
  matrix: RACIMatrix;
  changedBy: string;
  changedAt: Date;
  changeDescription: string;
}

export interface RACIMatrix {
  // ... campos anteriores
  versions?: RACIMatrixVersion[];
}
```

---

## 🚀 Dicas de Implementação

### Deploy para Produção

```bash
# Build para produção
npm run build

# Resultado em: dist/browser/
# Fazer upload para seu servidor
```

### CI/CD Integration

Se integrar com GitLab/GitHub:

```yaml
# .github/workflows/deploy.yml
name: Deploy RACI

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - name: Deploy
        run: |
          # Seu script de deploy aqui
```

### Adicionar Autenticação

Se usar Auth0 ou similar:

```typescript
import { AuthService } from '@auth0/auth0-angular';

export class RACIMatrixComponent implements OnInit {
  user$ = this.auth.user$;
  
  constructor(private auth: AuthService) {}
  
  ngOnInit() {
    this.user$.subscribe(user => {
      console.log('Usuário:', user?.name);
    });
  }
}
```

---

## 📚 Recursos Adicionais

- **CONTEXTO_FINANCEIRO.md** - Detalhes da sua instituição
- **TECHNICAL_DOCS.md** - Arquitetura técnica
- **RACI_GUIDE.md** - Uso da aplicação
- **SETUP_GUIDE.md** - Deployment

---

## ✅ Checklist de Customização

- [ ] Atualizei stakeholders com meu time real
- [ ] Atualizei tarefas com meus processos
- [ ] Defini RACI para cada task
- [ ] Testei a validação
- [ ] Customizei cores (opcional)
- [ ] Exportei dados para compartilhar
- [ ] Integrei com meu backend (se aplicável)
- [ ] Fiz deploy em produção

---

**Precisa de ajuda?** Consulte a documentação ou abra uma issue no seu repo.

**Última atualização:** Fevereiro 2026
