# Backend Deployment

## Runtime and architecture

The Express API remains organized into routes, controllers, middleware, and Prisma repositories. Render runs the backend in `Clases/16_10NOV/MiPrimeraApiProductos/backend`; it listens on Render's `PORT` at `0.0.0.0`. `GET /health` checks PostgreSQL connectivity and returns only `{"status":"ok"}` or `{"status":"unavailable"}`.

## Local setup

1. Copy `Clases/16_10NOV/MiPrimeraApiProductos/.env.example` to `.env` in that same folder.
2. Set a local PostgreSQL password in both `POSTGRES_PASSWORD` and `DATABASE_URL`. Do not commit `.env`.
3. Start the project's local PostgreSQL service using its Docker Compose instructions.
4. From the `backend` directory run:

```powershell
npm ci
npm run db:generate
npm start
```

The Prisma schema maps the existing `productos` and `transacciones_productos` tables. `npm run db:push` changes schema state and must only be run against a database whose owner has approved the change; it is not part of the production start command.

## GitHub Actions

`.github/workflows/backend-ci.yml` runs for backend/deployment changes on pushes to `main` and pull requests targeting `main`. It installs from `package-lock.json`, generates Prisma Client, creates schema in an ephemeral PostgreSQL service, runs ESLint and syntax checks, exercises API CRUD/validation/health endpoints, and runs `npm audit --audit-level=high`. Any failed validation blocks the deployment job.

To enable deployment, configure the GitHub Actions repository secret `RENDER_DEPLOY_HOOK` with the deploy hook URL from Render. The deploy job triggers it only after CI passes on a push to `main`. Without this secret, CI reports that deployment was skipped. Never put the hook URL in source control.

The GitHub Pages workflow publishes the repository tree and the product frontend is available at `https://juanfercaicedo.github.io/DesarrolloBasadoEnPlataformas_PUCE/Clases/16_10NOV/MiPrimeraApiProductos/frontend/public/`. It injects the public Render backend origin into `frontend/public/config.js`; set the optional Actions repository variable `RENDER_API_URL` only if the backend domain changes. Render production CORS allows the Pages origin `https://juanfercaicedo.github.io`.

## Render setup

1. Create a PostgreSQL instance in Render and a Web Service connected to this repository.
2. Use the repository root, branch `main`, and the settings in `render.yaml` (or configure the service with root directory `Clases/16_10NOV/MiPrimeraApiProductos/backend`, build command `npm ci && npm run db:generate`, start command `npm start`, and health check `/health`).
3. Set `DATABASE_URL` to the Render database's **internal** connection URL when both services are in the same region. For external connections, follow the database provider's TLS requirements; do not disable certificate verification as a workaround.
4. Set `FRONTEND_URL` to `https://juanfercaicedo.github.io` (the site origin, without the repository path). Multiple exact origins may be comma-separated. Production rejects unlisted browser origins. Localhost is allowed only outside production. The existing Render service needs this environment variable added manually if the Blueprint is not applied to it.
5. Set `NODE_ENV=production`. Render supplies `PORT`; do not hardcode it. `DATABASE_URL` and `FRONTEND_URL` are marked as secret/manual values in the Blueprint.
6. Confirm the schema exists before enabling traffic. The app does not run schema-changing commands on startup. Review and apply any required schema changes deliberately; never point `db:push` at a production database without approval and a backup.
7. After CI has passed and the deploy hook is configured, verify `/health`, `/api/productos`, CORS from the frontend origin, and Render logs. Do not treat deployment as successful unless these checks pass.

## Tests and operational checks

Run checks locally from `backend` with `npm run lint`, `npm audit --audit-level=high`, and `npm run db:generate`. Integration tests require `NODE_ENV=test` and a local disposable PostgreSQL database whose name ends in `_test`; they create and remove only a uniquely named test product. The test file refuses Render/production hosts. CI uses an isolated PostgreSQL service and never uses production credentials.

The API currently has no authentication or authorization layer. Do not expose write endpoints to untrusted clients until access control is designed and implemented. Rate limiting, Helmet, input validation, parameterized Prisma operations, and strict production CORS are enabled as baseline protections, not substitutes for authentication.

If any real credential has ever been committed, rotate it at its provider. Removing `.env` from the current Git index does not erase it from prior commits or remote clones.

## Deployment status

Render backend URL: `https://desarrollobasadoenplataformas-puce.onrender.com`. The frontend URL is `https://juanfercaicedo.github.io/DesarrolloBasadoEnPlataformas_PUCE/Clases/16_10NOV/MiPrimeraApiProductos/frontend/public/` after the Pages workflow completes. Public Pages deployment and browser-level integration remain pending until the local changes are pushed and the workflow succeeds.