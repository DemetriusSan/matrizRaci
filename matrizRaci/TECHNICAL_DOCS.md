# 🔧 Documentação Técnica - Matriz RACI

## 📚 Visão Geral da Arquitetura

A aplicação da Matriz RACI foi desenvolvida com **Angular 21** usando a arquitetura de componentes autônomos (Standalone Components) seguindo as melhores práticas modernas.

### Estrutura de Camadas

```
┌─────────────────────────────────┐
│   Componente RACI Matrix        │ ← User Interface
├─────────────────────────────────┤
│   RACIService                   │ ← Business Logic
├─────────────────────────────────┤
│   RACI Models & Interfaces      │ ← Data Models
└─────────────────────────────────┘
```

## 🗂️ Estrutura de Arquivos

### Models (`shared/models/raci.model.ts`)

Define todas as interfaces e tipos de dados:

```typescript
// Enumeração dos papéis RACI
enum RACIRole {
  RESPONSIBLE = 'R',
  ACCOUNTABLE = 'A',
  CONSULTED = 'C',
  INFORMED = 'I'
}

// Interface para uma atribuição
interface RACIAssignment {
  id: string;
  role: RACIRole | null;
  notes?: string;
}

// Interface para uma tarefa
interface RACITask {
  id: string;
  name: string;
  description?: string;
  assignments: Map<string, RACIAssignment>;
}

// Interface para a matriz completa
interface RACIMatrix {
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

### Serviço (`shared/services/raci.service.ts`)

Gerencia toda a lógica de negócio:

#### BehaviorSubjects
```typescript
private matrices$ = new BehaviorSubject<RACIMatrix[]>([]);
private currentMatrix$ = new BehaviorSubject<RACIMatrix | null>(null);
```

#### Métodos Principais

| Método | Descrição |
|--------|-----------|
| `getMatrices()` | Retorna observable com todas as matrizes |
| `getCurrentMatrix()` | Retorna a matriz atual |
| `setCurrentMatrix(id)` | Define a matriz ativa |
| `createMatrix()` | Cria nova matriz |
| `addTask(task)` | Adiciona tarefa à matriz |
| `updateTask()` | Atualiza tarefa existente |
| `removeTask()` | Remove tarefa |
| `updateAssignment()` | Atualiza atribuição RACI |
| `addStakeholder()` | Adiciona stakeholder |
| `removeStakeholder()` | Remove stakeholder |
| `validateMatrix()` | Valida estrutura da matriz |
| `exportToJSON()` | Exporta matriz como JSON |

### Componente (`features/raci/raci-matrix.component.ts`)

O componente principal que orquestra a interface do usuário:

#### Propriedades
```typescript
matrix: RACIMatrix | null;
validationErrors: string[] = [];
selectedTaskId: string | null = null;
showAddTaskForm = false;
showAddStakeholderForm = false;
```

#### Ciclo de Vida
1. **ngOnInit**: Carrega a matriz atual do serviço
2. **Observa**: Mudanças na matriz através de Observable
3. **Atualiza**: UI em resposta aos eventos

#### Métodos de Interação

- **Adição**: `addTask()`, `addStakeholder()`
- **Remoção**: `removeTask()`, `removeStakeholder()`
- **Atualização**: `toggleRole()` (cicla entre papéis)
- **Validação**: `validateMatrix()`
- **Exportação**: `exportToJSON()`

### Template (`features/raci/raci-matrix.component.html`)

Estrutura HTML organizada em seções:

```html
<div class="raci-container">
  <header class="raci-header"><!-- Cabeçalho --></header>
  <div class="validation-section"><!-- Validação --></div>
  <div class="tools-section"><!-- Ferramentas --></div>
  <div class="form-section"><!-- Formulários --></div>
  <table class="raci-matrix-table"><!-- Matriz --></table>
  <div class="task-detail"><!-- Detalhes da Tarefa --></div>
</div>
```

#### Estrutura da Tabela

```
┌─────────────────────────────────────────────────────────────┐
│          │ Stakeholder 1 │ Stakeholder 2 │ ... │
├─────────────────────────────────────────────────────────────┤
│ Tarefa 1 │      R        │      A        │ ... │
│ Tarefa 2 │      C        │      -        │ ... │
│ Tarefa 3 │      I        │      R        │ ... │
│ ...      │     ...       │     ...       │ ... │
└─────────────────────────────────────────────────────────────┘
```

### Estilos (`features/raci/raci-matrix.component.scss`)

SCSS bem estruturado com:

- **Variáveis de cores** para cada papel RACI
- **Mixins** para componentes reutilizáveis
- **Media queries** para responsividade
- **CSS Grid e Flexbox** para layout
- **Transições e animações** suaves

#### Paleta de Cores

```scss
$raci-responsible: #3498db;   // Azul
$raci-accountable: #e74c3c;   // Vermelho
$raci-consulted: #f39c12;     // Laranja
$raci-informed: #95a5a6;      // Cinza
```

## 🔄 Fluxo de Dados

### Criação de Tarefa

```
Usuário clica "Adicionar Tarefa"
    ↓
Form aparece (showAddTaskForm = true)
    ↓
Usuário preenche e clica "Adicionar"
    ↓
addTask() no componente
    ↓
raciService.addTask(task)
    ↓
Service atualiza currentMatrix$
    ↓
Componente recebe via Observable
    ↓
Template re-renderiza
```

### Atualização de Atribuição

```
Usuário clica em célula (tarefa x stakeholder)
    ↓
toggleRole() executa
    ↓
Calcula próximo papel (getNextRole)
    ↓
raciService.updateAssignment()
    ↓
Service atualiza Map de assignments
    ↓
currentMatrix$ emite novo valor
    ↓
Template atualiza cor e texto da célula
```

### Validação

```
validateMatrix() executa
    ↓
Itera sobre cada tarefa
    ↓
Verifica:
  ✓ Presença de R (Responsible)
  ✓ Presença de A (Accountable)
  ✓ Quantidade de A (máximo 1)
    ↓
Popula validationErrors[]
    ↓
Template exibe alertas
```

## 🎯 Padrões de Design Utilizados

### 1. **Reactive Programming** (RxJS)
```typescript
// Observables para reatividade
matrix$ = this.raciService.getCurrentMatrix();
```

### 2. **Service Singleton**
```typescript
// Serviço fornecido em root
@Injectable({ providedIn: 'root' })
```

### 3. **Component Composition**
```typescript
// Componente autônomo
@Component({
  selector: 'app-raci-matrix',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
```

### 4. **Two-Way Binding**
```html
<input [(ngModel)]="newTaskName" />
```

### 5. **Structural Directives**
```html
<ng-container *ngIf="matrix">...</ng-container>
<ng-container *ngFor="let task of matrix.tasks">...</ng-container>
```

## 📊 Exemplo de JSON Exportado

```json
{
  "id": "1",
  "name": "Matriz RACI - Gestão de Projetos",
  "description": "Matriz de responsabilidades",
  "team": "Gestão de Projetos",
  "department": "Operações",
  "createdDate": "2026-02-04T10:30:00.000Z",
  "updatedDate": "2026-02-04T10:35:00.000Z",
  "stakeholders": [
    "Gerente de Projeto",
    "Líder Técnico",
    "Designer",
    "QA",
    "Cliente",
    "Diretor"
  ],
  "tasks": [
    {
      "id": "1",
      "name": "Definir Escopo do Projeto",
      "description": "Estabelecer requisitos",
      "assignments": [
        {
          "stakeholder": "Gerente de Projeto",
          "id": "1-1",
          "role": "A"
        },
        {
          "stakeholder": "Cliente",
          "id": "1-3",
          "role": "R"
        }
      ]
    }
  ]
}
```

## 🔌 Integração com Backend

Para integrar com um backend:

### 1. Criar API Service
```typescript
@Injectable({ providedIn: 'root' })
export class RACIApiService {
  constructor(private http: HttpClient) {}

  getMatrices(): Observable<RACIMatrix[]> {
    return this.http.get('/api/matrices');
  }

  saveMatrix(matrix: RACIMatrix): Observable<RACIMatrix> {
    return this.http.post('/api/matrices', matrix);
  }
}
```

### 2. Modificar RACIService
```typescript
constructor(private api: RACIApiService) {
  this.loadMatrices();
}

private loadMatrices() {
  this.api.getMatrices().subscribe(
    matrices => this.matrices$.next(matrices)
  );
}
```

## 🧪 Testes Unitários (Exemplo)

```typescript
describe('RACIService', () => {
  let service: RACIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RACIService);
  });

  it('should add a task', (done) => {
    const task: RACITask = { id: '1', name: 'Test', assignments: new Map() };
    
    service.addTask(task);
    service.getCurrentMatrix().subscribe(matrix => {
      expect(matrix?.tasks.length).toBe(1);
      done();
    });
  });
});
```

## ⚡ Performance

### Otimizações Implementadas

1. **OnPush Change Detection** (possível adicionar)
   ```typescript
   changeDetection: ChangeDetectionStrategy.OnPush
   ```

2. **TrackBy para Lists**
   ```html
   *ngFor="let task of matrix.tasks; trackBy: trackByTaskId"
   ```

3. **Lazy Loading** (para aplicações maiores)

4. **Pipe Async**
   ```html
   <app-raci-matrix *ngIf="(matrix$ | async) as matrix">
   ```

## 🔒 Segurança

- **Input Sanitization**: Angular trata automaticamente XSS
- **Validação de Entrada**: Verificação de tipos em tempo de compilação
- **Controle de Acesso**: A ser implementado em produção

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

### Servir Estáticamente
```bash
npm run serve:ssr:matrizRaci
```

## 📝 Changelog

### v1.0.0 (Atual)
- ✅ Interface completa de Matriz RACI
- ✅ Gerenciamento dinâmico de tarefas e stakeholders
- ✅ Validação automática
- ✅ Exportação para JSON
- ✅ Design responsivo

## 🤝 Contribuindo

Para adicionar novos recursos:

1. Adicione interfaces em `raci.model.ts`
2. Implemente lógica em `raci.service.ts`
3. Atualize template e componente
4. Adicione estilos necessários

---

**Documentação Técnica v1.0 - Matriz RACI**
