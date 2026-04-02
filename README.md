# Recruitment and Selection

Aplicação de recrutamento e seleção com **API em Go** e **interface web em React**.

## Visão geral

- **Back-end (`server/`)**: API REST com Go, Gin, GORM e PostgreSQL.
- **Front-end (`web/`)**: React + TypeScript + Vite.
- **Documentação da API**: disponível em `GET /docs` quando o back-end estiver rodando.

## Back-end

Principais pontos:

- Arquitetura em camadas (`domain`, `usecase`, `infrastructure`, `interface`).
- Autenticação com JWT.
- Rotas versionadas em `/api/v1`.
- Banco de dados PostgreSQL.

Variáveis de ambiente esperadas (arquivo `server/.env.example`):

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `PORT`

## Front-end

Principais pontos:

- SPA com React + TypeScript.
- Cliente HTTP com Axios em `web/src/http/recruitment-api/api-client.ts`.
- URL base da API via `VITE_API_URL` (fallback: `http://localhost:8080/api/v1`).

## Como rodar com Docker

> O `docker-compose.yml` está em `server/` e sobe **API + PostgreSQL**.

1. Acesse a pasta do servidor:

```bash
cd server
```

2. Suba os containers:

```bash
docker compose up --build
```

3. Acesse os serviços:

- API: `http://localhost:8080`
- Docs da API: `http://localhost:8080/docs`
- PostgreSQL: `localhost:5432`

4. Para parar:

```bash
docker compose down
```

## Rodando o front-end localmente (opcional)

Com a API já em execução (Docker), rode o front-end:

```bash
cd web
npm install
npm run dev
```

App web padrão: `http://localhost:5173`

Se necessário, configure `VITE_API_URL` para apontar para a API.
