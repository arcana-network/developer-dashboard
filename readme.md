# Arcana Developer Dashboard

## Quick Start

For local development, start by cloning the repository.

```
git clone git@github.com:arcana-network/developer-dashboard.git
```

Move to the project directory.

```bash
cd developer-dashboard
```

Ensure you have **node** version v16 or higher installed. Install project dependencies.

```bash
npm install
```

In the project root, create an `.env` file by copying the content of `.env.example`, and filling in the environment variables.

```bash
cp .env.example .env
```

## Development

Start the local development server.

```bash
npm run dev
```

Run all linters and formatters.

```bash
npm run lint
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

If you'd like to use [Docker](https://docs.docker.com/engine/install/) to setup the dashboard as a service, follow the above quick start steps and then use

```bash
make run-local
```

to spin up the service.
