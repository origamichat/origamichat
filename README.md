![hero](github.png)

<p align="center">
    Open source chat &lt;Support /&gt; widget for React
    <br />
    <br />
    <a href="https://github.com/cossistant/cossistant/issues">Issues</a>
    ·
    <a href="https://cossistant.com/docs">Docs</a>
    ·
    <a href="https://discord.gg/vQkPjgvzcc">Discord</a>
</p>

## About Cossistant

Cossistant is an open source chat support widget focused on the React ecosystem. Built for developers who need a flexible, customizable chat solution that integrates with their applications. It provides headless components, real-time messaging, and a complete backend infrastructure.

## Features

**Headless Components**: Collection of unstyled, accessible React components to build your perfect chat interface.<br/>
**Real-time Messaging**: WebSocket-powered live chat with instant message delivery and presence indicators.<br/>
**Conversation Management**: Organize and track customer conversations with persistent chat history.<br/>
**API-First Design**: RESTful and tRPC APIs for complete integration flexibility.<br/>
**Self-Hosted**: Full control over your data with easy deployment options.<br/>
**Developer-Friendly**: TypeScript-first with excellent DX and comprehensive documentation.<br/>

## Get started

Install dependencies and run the development environment:

```sh
bun install --workspaces
bun dev
```

## App Architecture

- Monorepo
- Bun
- React
- TypeScript
- Next.js
- Hono
- tRPC
- Drizzle ORM
- TailwindCSS
- WebSockets

### Database

- PlanetScale (Production Postgres)
- DBgin (Local Development)

### Services

- Resend (Transactional Email)
- Drizzle (Database ORM)
- Better Auth (Authentication)

## Database Setup

### Production: PlanetScale Postgres

1. Create an account on [PlanetScale](https://planetscale.com)
2. Create a new Postgres database
3. Get your connection string from the dashboard

### Local Development: DBgin

For local development, use [DBgin](https://dbgin.com/) for a quick PostgreSQL setup.

### Configuration

1. Configure your database connection in the `.env` file:

   ```
   DATABASE_URL=postgresql://[user]:[password]@[endpoint]/[dbname]
   ```

2. Run the database migrations:
   ```
   cd apps/api
   bun db:migrate
   ```

### Schema Changes

To make changes to the database schema:

1. Update the schema files in `apps/api/src/db/schema`
2. Generate migrations:
   ```
   cd apps/api
   bun db:generate
   ```

## License

This project is licensed under the **[AGPL-3.0](https://opensource.org/licenses/AGPL-3.0)** for non-commercial use.

### Commercial Use

For commercial use or deployments requiring a setup fee, please contact us
for a commercial license at [anthony@cossistant.com](mailto:anthony@cossistant.com).

By using this software, you agree to the terms of the license.
