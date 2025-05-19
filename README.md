# OrigamiChat

OrigamiChat is an open source chat support widget focused on the React ecosystem. This monorepo contains all the packages and applications that make up the OrigamiChat platform.

## Getting Started

Run the following command to install dependencies:

```sh
pnpm install
```

## What's inside?

This monorepo includes the following packages/apps:

### Apps and Packages

- `dashboard`: a [Next.js](https://nextjs.org/) app for the main admin dashboard with [Tailwind CSS](https://tailwindcss.com/)
- `docs`: a [Next.js](https://nextjs.org/) app for documentation
- `origami-web`: a Next.js application for the web frontend
- `api`: a [Hono](https://hono.dev/) API server providing backend services
- `@repo/ui`: a React component library shared across applications
- `@repo/database`: a database package using [Drizzle ORM](https://orm.drizzle.team/) with MySQL
- `@repo/eslint-config`: `eslint` configurations
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This monorepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Drizzle ORM](https://orm.drizzle.team/) for database operations

## Database Setup

### Setting up MySQL locally with DBngin

1. Download and install [DBngin](https://dbngin.com/) for your platform
2. Open DBngin and create a new MySQL database:
   - Click "Create a Database Server"
   - Select MySQL
   - Set a name, version (8.0+ recommended), and port (default: 3306)
   - Click "Create"
3. Once your database server is running, create a new database for OrigamiChat

### Running database migrations

After setting up your MySQL database:

1. Configure your database connection in the `.env` file:

   ```
   DATABASE_URL=mysql://root:@localhost:3306/origami
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
   DATABASE_URL=mysql://root:@localhost:3306/origami
   ```

2. Start the API server:
   ```
   cd apps/api
   pnpm dev
   ```

### Endpoints

- `GET /healthcheck` - Check if the API is running

### Using from the Web App

The API exports TypeScript types that can be used by the web app for type-safe API calls:

```typescript
import { apiClient } from "@/lib/api-client";

// Make a type-safe API call
const healthResponse = await apiClient.healthcheck.$get();
const healthData = await healthResponse.json();
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

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Contributing

We welcome contributions to OrigamiChat! If you'd like to contribute, please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure to update tests as appropriate and follow the code style guidelines.

## License

OrigamiChat is open-sourced software licensed under the [MIT license](LICENSE).

## Useful Links

- [OrigamiChat Documentation](https://docs.origamichat.com)
- [Turborepo](https://turborepo.com/docs)
- [Next.js](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Hono](https://hono.dev)
