# Arcana Developer Dashboard

## Quick Start

Install dependencies.

```bash
npm install
```

Create `.env` file in root, copy the content of `.env.example`, and fill in the environment variables.

```bash
cp .env.example .env
```

## Development

Run the project in development environment.

```bash
npm run dev
```

Build and generate static files.

```bash
npm run build
```

Preview the generated site before deploying.

```bash
npm run serve
```

## Local environment setup

#### Prerequisits

- [Docker](https://docs.docker.com/engine/install/)

1. Clone the repository

```
git clone git@github.com:arcana-network/developer-dashboard.git
```

2. Create environment file

```
cp .env.example .env
```

3. Run local environment with Dashboard service

```
make run-local
```
