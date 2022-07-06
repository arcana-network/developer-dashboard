# Arcana Developer Dashboard

Arcana Developer Dashboard allows dApp developers to configure how they choose to integrate and use Arcana SDKs. It is used to tailor the desired dApp user experience for authentication, data privacy, storage access, and monitoring dApp user storage consumption metrics.

## Installation

Install dependencies.

```bash
npm install
```

Create `.env` file in root, copy the content of `.env.example`, and fill in the environment variables.

```bash
cp .env.example .env
```

## Local Development and Build

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

## Local Environment Setup

### Prerequisites

- [Docker](https://docs.docker.com/engine/install/)

### Setup Steps

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
