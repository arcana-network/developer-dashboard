# Arcana Developer Dashboard

## Quick Start

For local developer, start by cloning the repository.

```
git clone git@github.com:arcana-network/developer-dashboard.git
```

Ensure you have **node** version v16 or higher installed. Install dependencies.

```bash
npm install
```

In the project root, create an `.env` file by copying the content of `.env.example`, and filling in the environment variables.

```bash
cp .env.example .env
```

## Development

Start the development server.

```bash
npm run dev
```

Build and generate static files for production.

```bash
npm run build
```

Preview the generated site before deploying.

```bash
npm run preview
```

## Usage with Docker

If you'd like to use [Docker](https://docs.docker.com/engine/install/) for development, follow the above quick start steps and then use

```bash
make run-local
```

to spin up a local dashboard serve.
