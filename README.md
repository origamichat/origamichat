# Cossistant

Cossistant is an open source chat support widget focused on the React ecosystem. This monorepo contains all the packages and applications that make up the Cossistant platform.

## Getting Started

Run the following command to install dependencies:

```sh
bun install --workspaces
```

## What's inside?

This monorepo includes the following packages/apps:

### Apps and Packages

- `@cossistant/web`: a Next.js application for the web frontend
- `@cossistant/api`: a [Hono](https://hono.dev/) API server providing backend services
- `@cossistant/database`: a database package using [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL
- `@cossistant/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This monorepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Drizzle ORM](https://orm.drizzle.team/) for database operations

## Database Setup

### Setting up PostgreSQL with Neon.tech

1. Create a free account on [Neon.tech](https://neon.tech)
2. Create a new project in the Neon dashboard
3. Once your project is created, you'll get a connection string that looks like:
   ```
   postgresql://[user]:[password]@[endpoint]/[dbname]
   ```

### Running database migrations

After setting up your Neon.tech database:

1. Configure your database connection in the `.env` file:

   ```
   DATABASE_URL=postgresql://[user]:[password]@[endpoint]/[dbname]
   ```

2. Run the database migrations:
   ```
   cd packages/database
   pnpm db:migrate
   ```

### Database development

To make changes to the database schema:

1. Update the schema files in `packages/database/src/schema`
2. Generate migrations:
   ```
   cd packages/database
   pnpm db:generate
   ```

## API Server

The `api` app provides HTTP endpoints and is built with [Hono](https://hono.dev/).

### Setup

1. Create a `.env` file in the `apps/api` directory:

   ```
   PORT=3001
   DATABASE_URL=postgresql://
   ```

2. Start the API server:
   ```
   cd apps/api
   pnpm dev
   ```

## Development

To develop all apps and packages, run the following command:

```
pnpm dev
```

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

## License

This project is licensed under the **[AGPL-3.0](https://opensource.org/licenses/AGPL-3.0)** for non-commercial use.

### Commercial Use

For commercial use or deployments requiring a setup fee, please contact us
for a commercial license at [anthony@cossistant.com](mailto:anthony@cossistant.com).

By using this software, you agree to the terms of the license.
