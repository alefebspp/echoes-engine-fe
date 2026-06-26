# Echoes Engine — Front-end

Um **observatório de memória** pessoal para atividade digital. Este app se conecta à API NestJS do Echoes Engine e ajuda você a responder:

> *O que minha vida digital tem feito ultimamente?*

Visitas capturadas no navegador se transformam em linhas do tempo, domínios, categorias, fontes e ritmos por hora — visualizados em um painel instrumento violeta-escuro com a **fita de sinal** como elemento assinatura.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **React Router** — rotas públicas e autenticadas
- **TanStack Query** — estado do servidor para dashboard e usuários
- **React Hook Form** + **Zod** — validação de formulários
- **Tailwind CSS** — estilização (tokens definidos em `src/styles/tokens.css`, mapeados em `tailwind.config.js`)
- **Vitest** + **Testing Library** — testes unitários

## Pré-requisitos

- Node.js 18+
- API Echoes Engine rodando localmente (padrão `http://localhost:3000`)

## Configuração

```bash
# 1. Instalar dependências
npm install

# Se o npm install travar na sua rede (problema de IPv6/DNS), force IPv4:
NODE_OPTIONS="--dns-result-order=ipv4first" npm install

# 2. Configurar a URL da API
cp .env.example .env

# 3. Iniciar o servidor de desenvolvimento
npm run dev
```

O app roda em **http://localhost:5173**.

### Variáveis de ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `VITE_API_BASE_URL` | `/api/v1` | URL base para todas as chamadas à API. Por padrão usa o proxy do Vite em dev para que o cookie `access_token` permaneça same-site. |

## Autenticação

O login usa um cookie HttpOnly **`access_token`** definido pela API em `POST /auth/login`. O front-end **não** armazena o JWT em `localStorage`.

- Todas as chamadas à API enviam `credentials: "include"` para que o navegador anexe o cookie.
- Na inicialização, `GET /users/me` carrega a sessão em memória.
- `POST /auth/logout` limpa o cookie; o logout sempre chama este endpoint.
- O estado da sessão fica em `authStore` (apenas autenticado / anônimo / pendente).

Para desenvolvimento local, o Vite faz proxy de `/api` → `http://localhost:3000`. Se você apontar `VITE_API_BASE_URL` diretamente para o host da API, o back-end precisa permitir CORS com credenciais a partir de `http://localhost:5173`.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento Vite |
| `npm run build` | Typecheck + build de produção |
| `npm run preview` | Visualiza o build de produção |
| `npm run typecheck` | Verificação TypeScript |
| `npm test` | Executa testes unitários |
| `npm run test:watch` | Executa testes em modo watch |

## Rotas

| Caminho | Acesso | Descrição |
|---------|--------|-----------|
| `/` | Público | Página inicial |
| `/login` | Público | Entrar |
| `/register` | Público | Criar conta |
| `/app/dashboard` | Autenticado | Dashboard principal de analytics |
| `/app/activity` | Autenticado | Ritmo por hora + domínios |
| `/app/events/test` | Autenticado | Enviar evento de teste WEB_VISIT |
| `/app/profile` | Autenticado | Editar sua conta |
| `/app/users` | Autenticado | Lista interna de usuários |
| `/app/users/:id` | Autenticado | Detalhe e edição de usuário |

Visitas não autenticadas a `/app/*` redirecionam para `/login`. Usuários logados que acessam `/login` ou `/register` são redirecionados para `/app/dashboard`.

## Perfil / usuário atual

A tela de perfil carrega o usuário logado via **`GET /users/me`**. O id do usuário vem da API (derivado do JWT no servidor), não de decodificação de token no cliente.

## Design

A interface é construída como um **observatório de memória** — não um dashboard administrativo genérico.

- **Paleta:** midnight ink, deep violet, memory blue, signal cyan, soft lilac, trace amber (`src/styles/tokens.css`)
- **Tipografia:** Space Grotesk (display), Inter (corpo), IBM Plex Mono (dados)
- **Assinatura:** a **fita de sinal** — uma faixa temporal horizontal onde a atividade diária vira pulsos, lacunas e mudanças de densidade

Consulte `docs/setup.md` para o contrato completo de produto e API.

## Estrutura do projeto

```
src/
  app/           Router, shell, providers
  shared/        Cliente HTTP, auth store, primitivos de UI
  features/
    auth/        Login, registro
    dashboard/   Páginas e gráficos de analytics
    events/      Ingestão de eventos de teste
    users/       Perfil e gestão de usuários
    landing/     Landing pública + 404
  styles/        Design tokens + globals Tailwind
```

## Testes

```bash
npm test
```

Os testes cobrem bootstrap de sessão por cookie, comportamento de fetch com credenciais, guards de rota, validação de formulários, estados de carregamento/erro/vazio/sucesso do dashboard, mudanças de período, envio de evento de teste com invalidação do dashboard e validação de diff do perfil.

## O que está (e não está) implementado

**Disponível hoje:** eventos de visita no navegador, analytics por período (7–90 dias), gráficos do dashboard, ingestão de teste, autenticação, gestão de perfil/usuários.

**Apenas no roadmap** (rotulado assim na landing page, sem UI ativa): busca semântica, embeddings, grafo de conhecimento, insights comportamentais.
