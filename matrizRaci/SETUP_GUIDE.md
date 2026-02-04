# 🚀 Guia de Instalação e Setup - Matriz RACI

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Node.js e npm
- **Node.js**: v18.0.0 ou superior
- **npm**: v8.0.0 ou superior

Verificar versões:
```powershell
node --version
npm --version
```

### Angular CLI (Opcional, mas recomendado)
```powershell
npm install -g @angular/cli@latest
```

## 📦 Instalação

### 1. Clone ou Acesse o Projeto

```powershell
cd c:\Users\Demetrius\matrizRaci\matrizRaci
```

### 2. Instale as Dependências

```powershell
npm install
```

Isso instalará todos os pacotes necessários:
- @angular/core@^21.1.0
- @angular/common@^21.1.0
- @angular/forms@^21.1.0
- rxjs@^7.0.0
- e outras dependências

### 3. Verifique a Instalação

```powershell
npm list
```

Você verá uma árvore de dependências. Procure por:
- @angular/core
- @angular/common
- @angular/forms

## 🎯 Executar em Desenvolvimento

### Opção 1: npm start

```powershell
npm start
```

### Opção 2: Angular CLI

```powershell
ng serve
```

### Opção 3: Com Puerto Específico

```powershell
ng serve --port 3000
```

### ✅ Resultado Esperado

```
✔ Compiled successfully.
⠙ Building...
Application bundle generated successfully. (2.3 MB)
Initial Chunk Files | Names         | Raw Size
...

Watch mode enabled. Watching for file changes...

Local:     http://localhost:4200
External:  http://192.168.1.100:4200
```

Abra o navegador em `http://localhost:4200`

## 🛠️ Desenvolvimento

### Estrutura do Projeto

```
matrizRaci/
├── src/
│   ├── app/
│   │   ├── features/
│   │   │   └── raci/
│   │   │       ├── raci-matrix.component.ts
│   │   │       ├── raci-matrix.component.html
│   │   │       └── raci-matrix.component.scss
│   │   ├── shared/
│   │   │   ├── models/
│   │   │   │   └── raci.model.ts
│   │   │   └── services/
│   │   │       └── raci.service.ts
│   │   ├── app.ts
│   │   └── app.html
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss
│   └── ...
├── angular.json
├── package.json
├── tsconfig.json
├── RACI_GUIDE.md
├── TECHNICAL_DOCS.md
└── ...
```

### Editar e Salvar

A aplicação recompila automaticamente quando você salva arquivos:

1. Abra o arquivo em VS Code
2. Faça as alterações
3. Salve (Ctrl+S)
4. O navegador atualiza automaticamente

## 🧪 Testes

### Executar Testes Unitários

```powershell
npm test
```

ou

```powershell
ng test
```

### Executar com Coverage

```powershell
ng test --code-coverage
```

## 🏗️ Build para Produção

### Build Padrão

```powershell
npm run build
```

ou

```powershell
ng build
```

**Output**: `dist/matrizRaci/`

### Build com Otimizações

```powershell
ng build --configuration production
```

### Resultado

```
✔ Build at: 2026-02-04T10:00:00.000Z
✔ Hash: abc123def456

Initial Chunk Files | Names         | Raw Size | Gzip Size
main.js              | -             | 100 KB   | 30 KB
polyfills.js         | -             | 50 KB    | 15 KB
styles.css           | -             | 25 KB    | 8 KB
```

## 🚀 Deploy

### Deploy em Servidor Node.js

1. Build o projeto
```powershell
npm run build
```

2. Copie os arquivos de `dist/matrizRaci/` para seu servidor

3. Serve com seu servidor HTTP

### Deploy em Vercel

```powershell
npm install -g vercel
vercel
```

### Deploy em Netlify

```powershell
npm run build
netlify deploy --prod --dir=dist/matrizRaci
```

### Deploy com SSR (Server-Side Rendering)

```powershell
npm run build
npm run serve:ssr:matrizRaci
```

## 🐛 Troubleshooting

### Problema: Porta 4200 já está em uso

**Solução 1**: Use outra porta
```powershell
ng serve --port 3000
```

**Solução 2**: Libere a porta
```powershell
# Windows PowerShell (como Admin)
Get-Process -Id (Get-NetTCPConnection -LocalPort 4200).OwningProcess | Stop-Process
```

### Problema: Erro "Cannot find module"

**Solução**:
```powershell
rm -r node_modules
npm install
```

### Problema: Erro de Compilação TypeScript

**Solução 1**: Verifique a sintaxe
```powershell
ng lint
```

**Solução 2**: Reconstrua
```powershell
npm run watch
```

### Problema: Páginas em branco no navegador

**Solução**:
1. Abra DevTools (F12)
2. Verifique a aba "Console" para erros
3. Limpe o cache: Ctrl+Shift+Del
4. Recarregue: Ctrl+F5

## 📊 Verificar Saúde do Projeto

### Listar Scripts Disponíveis

```powershell
npm run
```

Mostrará:
```
ng              ng
start           ng serve
build           ng build
watch           ng build --watch --configuration development
test            ng test
serve:ssr:matrizRaci    node dist/matrizRaci/server/server.mjs
```

### Verificar Dependências Desatualizadas

```powershell
npm outdated
```

### Verificar Vulnerabilidades

```powershell
npm audit
```

Corrigir automaticamente:
```powershell
npm audit fix
```

## 🔄 Atualizar Dependências

### Atualizar Angular

```powershell
ng update @angular/cli @angular/core
```

### Atualizar Todos os Pacotes

```powershell
npm update
```

## 📚 Documentação Adicional

- [Angular Docs](https://angular.dev)
- [Angular CLI Docs](https://angular.dev/tools/cli)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [RxJS Docs](https://rxjs.dev/)

## 🎓 Primeiros Passos

1. **Inicie a aplicação**
   ```powershell
   npm start
   ```

2. **Abra no navegador**
   - http://localhost:4200

3. **Explore a Interface**
   - Adicione stakeholders
   - Crie tarefas
   - Atribua papéis RACI
   - Valide a matriz

4. **Exporte seus dados**
   - Clique em "Exportar"
   - Salve o JSON

## 💡 Dicas Úteis

### Melhorar Performance

```typescript
// Em seu componente
changeDetection: ChangeDetectionStrategy.OnPush
```

### Debug em Desenvolvimento

```typescript
// Adicione logs
console.log('Matrix:', this.matrix);
```

Use DevTools:
- F12 ou Ctrl+Shift+I
- Aba "Sources" para Debugger
- Aba "Network" para requisições HTTP

### Hot Module Replacement (HMR)

```powershell
ng serve --hmr
```

## ✨ Próximos Passos

Após a instalação:

1. ✅ Leia [RACI_GUIDE.md](RACI_GUIDE.md)
2. ✅ Consulte [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)
3. ✅ Customize conforme sua necessidade
4. ✅ Implemente persistência em banco de dados
5. ✅ Deploy em produção

## 🆘 Suporte

Se encontrar problemas:

1. Verifique o console do navegador (F12)
2. Consulte a documentação do Angular
3. Verifique os arquivos de log

---

**Guia de Instalação v1.0 - Matriz RACI**
