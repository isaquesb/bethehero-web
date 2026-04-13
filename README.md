# Be The Hero — Web

Painel web da plataforma *Be The Hero*, desenvolvido com Vite 8 + React 19 + TypeScript.
Consome a [bethehero-api](../bethehero-api/README.md) — veja o contrato HTTP completo (rotas, payloads, status codes) nesse README antes de integrar.

---

## Visão Geral

**bethehero-web** é o cliente web da plataforma *Be The Hero*. O público-alvo são **ONGs**: uma ONG se cadastra pelo app, faz login com seu e-mail, gerencia seus casos de ajuda financeira (criação e exclusão) e obtém o ID de acesso que o app mobile usa para exibir esses casos aos voluntários.

Esta é uma SPA (Single Page Application) sem backend próprio — toda a persistência passa pela **bethehero-api** exposta em `http://localhost:3333` (configurável via `VITE_API_URL`). O contrato HTTP completo — rotas, formatos de request/response, headers de autenticação e status codes — está documentado em [`../bethehero-api/README.md`](../bethehero-api/README.md).

### O que o app faz

| Rota | Funcionalidade |
|------|----------------|
| `/` | Login da ONG por e-mail |
| `/register` | Cadastro de nova ONG (retorna ID de acesso) |
| `/profile` | Lista os casos da ONG logada com botão de exclusão |
| `/incidents/new` | Formulário para cadastrar novo caso |

Autenticação é mantida via `localStorage` (chaves `token` e `userName`). Rotas protegidas redirecionam para `/` quando não há token.

---

## Stack

Versões exatas instaladas (extraídas de `package.json` + `npm ls`):

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| UI | React + react-dom | 19.2.5 |
| Bundler | Vite | 8.0.8 |
| Linguagem | TypeScript | 5.9.3 |
| Rotas | react-router-dom | 7.14.0 |
| HTTP | axios | 1.15.0 |
| Test runner | Vitest | 4.1.4 |
| Component testing | @testing-library/react | 16.3.2 |
| User events | @testing-library/user-event | 14.6.1 |
| DOM matchers | @testing-library/jest-dom | 6.9.1 |
| Coverage | @vitest/coverage-v8 | 4.1.4 |
| Ícones | react-icons | 5.6.0 |
| JSDOM | jsdom | 29.0.2 |

> **Nota de segurança:** axios está pinado em `1.15.0`. As versões `1.14.1` e `0.30.4` possuem CVEs conhecidos — não faça downgrade para essas versões.

> **Nota de migração:** O entry point usa `createRoot` (React 19), não o `ReactDOM.render` legado do React 16. Veja `src/main.tsx`.

---

## Arquitetura

### Estrutura de pastas

```
bethehero-web/
├── index.html                   # entry point HTML (Vite)
├── vite.config.ts               # bundler config + plugin react
├── vitest.config.ts             # test runner + coverage thresholds
├── tsconfig.json                # TypeScript strict mode
├── .env.example                 # template de variáveis de ambiente
└── src/
    ├── main.tsx                 # createRoot + StrictMode (entry React)
    ├── App.tsx                  # monta o Router
    ├── router.tsx               # BrowserRouter + Routes + Route
    ├── pages/
    │   ├── Login/               # / — login por e-mail
    │   │   ├── index.tsx
    │   │   └── styles.css
    │   ├── Register/            # /register — cadastro de ONG
    │   │   ├── index.tsx
    │   │   └── styles.css
    │   ├── Profile/             # /profile — casos da ONG (protegido)
    │   │   ├── index.tsx
    │   │   └── styles.css
    │   └── NewIncident/         # /incidents/new — novo caso (protegido)
    │       ├── index.tsx
    │       └── styles.css
    ├── components/
    │   └── ProtectedRoute/      # guarda de rota via localStorage
    │       └── index.tsx
    ├── services/
    │   └── api.ts               # instância axios com baseURL
    ├── types/
    │   └── api.ts               # interfaces Ong e Incident
    ├── assets/
    │   ├── global.css           # reset e estilos globais
    │   └── *.svg / *.png        # imagens e logos
    └── test/
        └── setup.ts             # importa @testing-library/jest-dom
```

### Fluxo de dados

```
index.html
  ↓
src/main.tsx  (createRoot + StrictMode)
  ↓
src/App.tsx   (monta <Router />)
  ↓
src/router.tsx  (BrowserRouter + Routes)
  ↓
src/pages/<Página>/index.tsx
  — useState local para formulários e listas
  — chama src/services/api.ts (instância axios)
  ↓
src/services/api.ts  (axios.create({ baseURL: VITE_API_URL }))
  ↓
bethehero-api  (http://localhost:3333)
```

### Proteção de rotas

`ProtectedRoute` envolve as páginas que exigem autenticação:

```tsx
// router.tsx
<Route path="/profile" element={
  <ProtectedRoute><Profile /></ProtectedRoute>
} />
```

`ProtectedRoute` lê `localStorage.getItem('token')`. Se ausente, renderiza `<Navigate to="/" replace />`. Se presente, renderiza os `children`.

### Header de autenticação

A API usa o `ong_id` bruto no header `Authorization` — **sem prefixo "Bearer"**:

```
Authorization: A3F8B2C1
```

Esse detalhe é crítico: não adicione `Bearer ` antes do ID. Ver documentação completa em [`../bethehero-api/README.md`](../bethehero-api/README.md).

---

## Setup Local

### Pré-requisitos

- **Node.js 20 LTS** ou superior — `node --version`
- **bethehero-api** rodando em `http://localhost:3333` — veja [`../bethehero-api/README.md`](../bethehero-api/README.md) para subir a API

### Passos

1. **Acesse o diretório:**
   ```bash
   cd bethehero-web
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente** (opcional — o default já funciona para dev local):
   ```bash
   cp .env.example .env
   ```

4. **Garanta que a API está rodando:**
   ```bash
   # Em outro terminal, no diretório bethehero-api:
   npm run dev
   # API disponível em http://localhost:3333
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # App disponível em http://localhost:5173
   ```

---

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `VITE_API_URL` | `http://localhost:3333` | URL base da API REST (`bethehero-api`) |

Para sobrescrever o default, crie um arquivo `.env` na raiz de `bethehero-web/`:

```bash
# bethehero-web/.env
VITE_API_URL=http://localhost:3333
```

> **Importante:** Variáveis do Vite devem começar com `VITE_` para serem expostas ao browser via `import.meta.env`. O prefixo `REACT_APP_` do CRA não funciona no Vite.

> **Segurança:** Nunca commite `.env` — ele está no `.gitignore`. Use `.env.example` como referência.

---

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento (Vite, porta 5173) com HMR |
| `npm run build` | Roda `tsc --noEmit` (type-check) e gera o build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente para inspeção |
| `npm test` | Roda a suíte completa de testes uma vez (`vitest run`) |
| `npm run test:watch` | Modo watch — re-executa testes ao salvar arquivos |
| `npm run test:coverage` | Roda os testes com relatório de cobertura (thresholds configurados em `vitest.config.ts`) |
| `npm run typecheck` | Verificação de tipos sem emitir arquivos (`tsc --noEmit`) |

### Build de produção

```bash
npm run build
# Artefatos gerados em dist/:
#   dist/index.html
#   dist/assets/index-[hash].js
#   dist/assets/index-[hash].css
```

O comando `build` inclui type-check automático — se houver erros de TypeScript, o build falha antes de gerar os artefatos.

---

## Fluxo de Uso

### 1. Cadastro de ONG (`/register`)

1. Acesse `/register`
2. Preencha: nome da ONG, e-mail, WhatsApp, cidade e UF
3. Submeta — a API faz `POST /ongs` e retorna `{ id }`
4. O app exibe o ID de acesso (guarde — é o "token" de login)
5. Redireciona para `/` (login)

### 2. Login (`/`)

1. Informe o e-mail cadastrado e clique em "Entrar"
2. A API faz `POST /auth/login` com `{ email }` e retorna o perfil da ONG
3. O app salva `token` (ong_id) e `userName` (nome) no `localStorage`
4. Redireciona para `/profile`

Se o e-mail não estiver cadastrado, exibe alerta "Falha no login" e não altera o `localStorage`.

### 3. Perfil e gestão de casos (`/profile`)

1. A página carrega com `GET /profile/incidents` (header `Authorization: <ong_id>`)
2. Lista os casos com título, descrição e valor em BRL (ex.: `R$ 120,50`)
3. Botão de lixeira em cada caso chama `DELETE /incidents/:id` — remove da lista ao confirmar 204
4. Botão de logout limpa `localStorage` e redireciona para `/`

> Acesso direto a `/profile` sem token redireciona imediatamente para `/`.

### 4. Novo caso (`/incidents/new`)

1. Preencha título, descrição e valor (em reais)
2. Submeta — a API faz `POST /incidents` com `Authorization: <ong_id>`
3. Ao receber `{ id }`, redireciona para `/profile`
4. Botão "Voltar" retorna para `/profile` sem submeter

### Fluxo resumido

```
/register → recebe ID → /
  ↓
/ (login com e-mail) → localStorage { token, userName } → /profile
  ↓
/profile → lista casos → (botão trash) DELETE /incidents/:id
                        → (botão +) /incidents/new → POST /incidents → /profile
                        → (botão logout) limpa localStorage → /
```

---

## Testes

### Stack de testes

| Ferramenta | Versão | Papel |
|-----------|--------|-------|
| Vitest | 4.1.4 | Test runner + coverage |
| @testing-library/react | 16.3.2 | Render de componentes React |
| @testing-library/user-event | 14.6.1 | Simulação realista de interações |
| @testing-library/jest-dom | 6.9.1 | Matchers DOM (`toBeInTheDocument`, etc.) |
| @vitest/coverage-v8 | 4.1.4 | Instrumentação V8 + relatório LCOV |
| jsdom | 29.0.2 | Ambiente DOM simulado (sem browser) |

### Estrutura dos testes

```
src/
├── components/ProtectedRoute/ProtectedRoute.test.tsx  (2 testes)
├── services/api.test.ts                               (1 teste)
├── pages/Login/Login.test.tsx                         (3 testes)
├── pages/Register/Register.test.tsx                   (3 testes)
├── pages/Profile/Profile.test.tsx                     (5 testes)
└── pages/NewIncident/NewIncident.test.tsx             (3 testes)
                                              Total:   17 testes
```

### Como rodar

```bash
# Executar todos os testes uma vez
npm test

# Executar com relatório de cobertura
npm run test:coverage

# Modo watch (desenvolvimento)
npm run test:watch
```

### Thresholds de cobertura

Configurados em `vitest.config.ts` — o comando `test:coverage` falha se não atingir:

| Métrica | Threshold | Atual |
|---------|-----------|-------|
| Statements | ≥ 90% | 97.18% |
| Branches | ≥ 80% | 100% |
| Functions | ≥ 90% | 92.3% |
| Lines | ≥ 90% | 97.1% |

### Estratégia de mock

Os testes usam `vi.mock()` para substituir a instância axios de `src/services/api.ts`:

```typescript
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))
```

Não há MSW (Mock Service Worker) — os mocks são declarados no topo de cada arquivo de teste (hoisting automático do Vitest). Cada teste controla as respostas via `mockResolvedValueOnce` / `mockRejectedValueOnce`.

O `react-router-dom` é parcialmente mockado para espionar `useNavigate`:

```typescript
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: vi.fn(() => mockNavigate) }
})
```

As páginas são renderizadas com `MemoryRouter` do RTL para evitar dependência do `BrowserRouter` global. Interações assíncronas (chamadas de API, updates de estado) são aguardadas com `waitFor`.

### Exclusões de cobertura

Arquivos excluídos do enforcement (boilerplate / infraestrutura):

| Arquivo | Motivo |
|---------|--------|
| `src/main.tsx` | Entry point React — boilerplate `createRoot` |
| `src/types/**` | Apenas interfaces TypeScript (sem lógica executável) |
| `src/test/**` | Setup do jest-dom (não é código de produção) |

---

*Refatorado em abril/2026 como parte do roadmap Be The Hero. Veja `.planning/phases/02-web-refactor/` para o histórico completo de decisões e planos.*
