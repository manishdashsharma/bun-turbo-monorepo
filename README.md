# bun-turbo-monorepo — My First Turborepo

My first hands-on experience with **Turborepo**. I wanted to understand what a monorepo actually feels like day to day, so I built a small full-stack todo app — Express API, React frontend, Prisma + Postgres — all living in one repo and sharing code with each other.

Small app, but the setup is the same way I build real projects.

---

## What is Turborepo (in my words)

A **monorepo** is one Git repo holding multiple apps and packages. Bun **workspaces** link them together, so `apps/api` can `import { createTodoSchema } from '@repo/shared'` without publishing anything to npm.

**Turborepo** sits on top and runs tasks (`dev`, `build`, `lint`) across all of them:

- **Runs things in parallel** — `bun run dev` starts the API and the frontend together.
- **Understands dependencies** — `^db:generate` means "generate the Prisma client in `@repo/db` before starting anything that depends on it".
- **Caches everything** — run `bun run build` twice and the second run finishes in milliseconds with `>>> FULL TURBO`, because nothing changed.
- **Filters** — `bunx turbo run dev --filter=api` runs only the API.

---

## Structure

```
turbo-repo/
├── apps/
│   ├── api/          Express 5 API  (modules → controllers / services / routes / validations)
│   └── web/          React 19 + Vite + Tailwind v4 + shadcn/ui + TanStack Query
├── packages/
│   ├── db/           @repo/db      → Prisma 7 schema, migrations, getWriteDB / getReadDB
│   └── shared/       @repo/shared  → Zod schemas used by BOTH api and web
├── docker-compose.yml   postgres + api + web
└── turbo.json           task pipeline
```

### The part that clicked for me: shared code

`packages/shared/src/todo.schema.js` defines `createTodoSchema` **once**:

- **web** uses it in the form (`zodResolver(createTodoSchema)`) → instant validation in the browser
- **api** uses it in `validateRequest(createTodoSchema)` → same rules enforced on the server

Change the max length in one place, both sides update. No copy-paste, no drift.

Same idea for the database — `packages/db` owns Prisma, and any app that needs the DB just depends on `@repo/db`.

---

## Tech stack

| Layer    | Tools |
|----------|-------|
| Monorepo | Turborepo, Bun workspaces |
| API      | Express 5, Zod, Winston, Helmet, CORS |
| Database | PostgreSQL 17, Prisma 7 (`@prisma/adapter-pg`) |
| Frontend | React 19, Vite, Tailwind CSS v4, shadcn/ui, TanStack Query, axios, react-hook-form |
| DevOps   | Docker, docker-compose, nginx |

---

## Getting started

**Requirements:** [Bun](https://bun.sh) and Docker.

```bash
bun install
bun run db:up          # starts Postgres on localhost:5433
bun run db:migrate     # applies Prisma migrations
bun run dev            # api → http://localhost:4000, web → http://localhost:3000
```

Each app/package has its own `.env` (copy from `.env.example`):

| File | Holds |
|------|-------|
| `apps/api/.env`     | `PORT`, `DATABASE_URL`, `CORS_ORIGIN`, `LOG_LEVEL` |
| `apps/web/.env`     | `VITE_API_URL` |
| `packages/db/.env`  | `DATABASE_URL` (for the Prisma CLI) |

### Run everything in Docker

```bash
bun run docker:up      # web → http://localhost:8080, api → http://localhost:4000
bun run docker:logs
bun run docker:down
```

The API container runs `prisma migrate deploy` on startup. Stop Docker before `bun run dev` — both use port 4000.

---

## Scripts

| Command | What it does |
|---------|--------------|
| `bun run dev` | API + web in parallel with hot reload |
| `bun run build` | Builds everything (cached by Turbo) |
| `bun run lint` | Lints all apps |
| `bun run db:up` | Starts only Postgres |
| `bun run db:migrate` | `prisma migrate dev` |
| `bun run db:studio` | Opens Prisma Studio |
| `bun run docker:up` / `docker:down` / `docker:logs` | Full stack in Docker |

---

## API

All routes are under `/v1`. GET and POST only.

| Method | Route | Description |
|--------|-------|-------------|
| GET  | `/health` | Liveness |
| GET  | `/health/ready` | Checks DB connection |
| GET  | `/todos?page=1&limit=20` | Paginated list → `{ items, pagination }` |
| POST | `/todos` | Create — `{ "title": "..." }` |
| POST | `/todos/:id/toggle` | Mark done / not done |
| POST | `/todos/:id/delete` | Soft delete (`isActive: false`) |

---

## What I learned

- **Workspaces do the linking, Turbo does the running.** Bun resolves `workspace:*` packages; Turbo just orchestrates tasks. Took me a moment to separate those two.
- **`dependsOn: ["^task"]`** — the `^` means "run this in my dependencies first". That's how Prisma client generation happens automatically before `dev`.
- **Docker in a monorepo is different.** The build context has to be the repo root (apps need `packages/*`). `turbo prune <app> --docker` creates a slim copy with only what that one app needs, which keeps images small and layer caching sane.
- **Don't mix package managers.** Running `npm install` inside a Bun workspace creates a `package-lock.json` and breaks `workspace:*` links. Bun everywhere.
- **Separate ports and container names per project.** I have another Postgres running on 5432 for a different project, so this one uses 5433 with its own compose project name (`turbo-todo`). `docker compose down` here never touches the other one.
- **shadcn in a JS monorepo** needs `"tsx": false` in `components.json` and an `@/` alias in both `vite.config.js` and `jsconfig.json`.

---

## Next things to try

- [ ] Turbo **remote caching** (share the build cache across machines / CI)
- [ ] A second app (admin panel) reusing `@repo/shared` and `@repo/db`
- [ ] A shared `packages/ui` for shadcn components
- [ ] Shared ESLint config package
- [ ] GitHub Actions with `turbo run lint build --filter=...[origin/main]`
