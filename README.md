# Turnera

Plataforma de turnos reutilizable por negocio. Backend con Node.js, TypeScript,
Express, Prisma 7 y PostgreSQL 17. El frontend React está pendiente.

## Requisitos

- Node.js 22.12 o superior dentro de la rama 22, o Node.js 24 o superior.
- npm y Docker con Docker Compose.
- Puerto 5432 disponible para PostgreSQL y 3000 para la API.

## Instalación local

Desde la raíz del repositorio:

```bash
cp backend/.env.example backend/.env
docker compose up -d postgres
docker compose exec postgres pg_isready -U turnera -d turnera
cd backend
npm ci
npm run prisma:validate
npm run db:deploy
npm run build
npm start
```

Si `pg_isready` todavía no indica que acepta conexiones, esperar y repetirlo
antes de aplicar migraciones. `db:deploy` aplica las migraciones existentes;
no crea migraciones ni reinicia la base. El volumen Docker conserva los datos.
La configuración de Docker y sus credenciales son para desarrollo local.

En otra terminal:

```bash
curl http://localhost:3000/health
```

Respuesta esperada: `{"status":"ok"}`. Este endpoint comprueba que la API
responde; no comprueba la conexión con PostgreSQL.

Para desarrollar con recarga automática, ejecutar `npm run dev` desde `backend`.

## Variables de entorno

El backend carga `backend/.env` cuando los comandos se ejecutan desde `backend`.
Las variables ya definidas en el proceso tienen prioridad sobre ese archivo.

| Variable | Regla |
| --- | --- |
| `NODE_ENV` | `development`, `test` o `production`. Por defecto: `development` |
| `PORT` | Entero de 1 a 65535. Por defecto: `3000` |
| `FRONTEND_URL` | Obligatoria. Origen HTTP(S) exacto, por ejemplo `http://localhost:5173`, sin barra final, ruta ni credenciales |
| `DATABASE_URL` | Obligatoria. URL `postgresql://` o `postgres://`, con host y nombre de base |

Los valores vacíos no activan los valores predeterminados: son inválidos.
La API rechaza la configuración inválida antes de escuchar conexiones y muestra
solo los nombres de las variables afectadas, sin revelar sus valores.
El ejemplo de conexión supone que Node corre en el host y PostgreSQL en Docker.

## Comandos del backend

Ejecutar desde `backend`:

| Comando | Función |
| --- | --- |
| `npm ci` | Instala las versiones del lockfile |
| `npm run dev` | Genera Prisma e inicia el servidor con recarga |
| `npm run prisma:generate` | Genera el único cliente en `src/generated/prisma` |
| `npm run prisma:validate` | Valida el esquema Prisma |
| `npm run typecheck` | Genera Prisma y verifica tipos sin emitir JavaScript |
| `npm run build` | Genera Prisma y compila a `dist` |
| `npm start` | Ejecuta `dist/server.js`; requiere build previo |
| `npm test` | Compila y prueba configuración y rechazo de arranque inválido |
| `npm run db:deploy` | Aplica las migraciones existentes a la base configurada |
| `npm run db:status` | Consulta el estado de las migraciones |
| `npm run db:migrate -- --name nombre` | Crea y aplica una migración en una base de desarrollo |

Los comandos Prisma usan explícitamente `prisma7.config.ts`. La generación usa
imports `.js` compatibles con el build ESM y no necesita una conexión activa a
PostgreSQL, aunque la configuración Prisma requiere `DATABASE_URL` definida.

## Estructura y versionado

- `backend/src/modules`: rutas, controladores, servicios y validación de dominio.
- `backend/src/config`: entorno validado y conexión Prisma.
- `backend/prisma/schema.prisma`: modelo de datos.
- `backend/prisma/migrations`: historial SQL que debe versionarse.
- `backend/tests`: comprobaciones de configuración y arranque.
- `frontend`: reservado para React.

Versionar código fuente, migraciones, `package-lock.json`, configuración,
`docker-compose.yml` y `.env.example`. Los archivos `.env`, dependencias,
`dist` y clientes generados se excluyen de Git. El cliente se regenera durante
el build y antes del desarrollo; no mantener una segunda copia en
`backend/generated`.

## Alcance actual

La etapa 1 prepara compilación, configuración e instalación reproducibles.
Quedan pendientes autenticación administrativa, garantías contra reservas
concurrentes, reglas de zonas horarias y pagos. No desplegar como plataforma
de reservas de producción hasta completar esas etapas.
