<p align="center">
<a href="#start"><img height="30rem" src="https://raw.githubusercontent.com/arcana-network/branding/main/an_logo_light_temp.png"/></a>
<h2 align="center"> <a href="https://arcana.network/">Arcana Network Developer Dashboard </a></h2>
</p>
<br/>
<p id="banner" align="center">
<br/>
<a title="MIT License" href="https://github.com/arcana-network/license/blob/main/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue"/></a>
<a title="Beta release" href="https://github.com/arcana-network/developer-dashboard/releases"><img src="https://img.shields.io/github/v/release/arcana-network/developer-dashboard?style=flat-square&color=28A745"/></a>
<a title="Twitter" href="https://twitter.com/ArcanaNetwork"><img alt="Twitter URL" src="https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2FArcanaNetwork"/></a>
</p><p id="start" align="center">
<a href="https://docs.beta.arcana.network/"><img src="https://raw.githubusercontent.com/arcana-network/branding/main/an_banner_temp.png" alt="Arcana Developer Dashboard"/></a>
</p>

# ⚙️ Arcana Developer Dashboard

Arcana Developer Dashboard allows dApp developers to configure how they choose to integrate and use Arcana SDKs. It is used to tailor the desired dApp user experience for authentication, data privacy, storage access, and monitoring dApp user storage consumption metrics.

# 💪 Key Features

<p>⛓️ &nbsp; Register your dApp with Arcana Network and select storage region for dApp user data</p>
<p>🔒 &nbsp; Configure social authentication, passwordless login to onboard dApp users</p>
<p>👛 &nbsp; Specify Storage usage and bandwidth limit per dApp user</p>
<p>⚙️ &nbsp; Configure transaction signing user experience (no UI, popup UI) as per dApp use case</p>

# 📚 Documentation

Check out [Arcana Network documentation](https://docs.beta.arcana.network/) and refer to [How to Register and Configure dApp Guide](https://docs.beta.arcana.network/docs/config_dapp) for details.

# 💡 Support

For any support or integration related queries, contact [Arcana support team](mailto:support@arcana.network).

# 🤝 Contributing

We welcome all contributions to the Arcana Developer Dashboard from the community. Read our [contributing guide](https://github.com/arcana-network/license/blob/main/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and the code of conduct that we expect the participants to adhere to. Refer to the development section of this readme for details on how to build and validate your changes to the Developer Dashboard code before submitting your contributions.

# ℹ️ License

Arcana Developer Dashboard is distributed under the [MIT License](https://fossa.com/blog/open-source-licenses-101-mit-license/).

For details see [Arcana License](https://github.com/arcana-network/license/blob/main/LICENSE.md).

# 🚀 Development and Setup

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

## 🧪 Build and Test

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

## 🫙 Docker Setup

If you'd like to use [Docker](https://docs.docker.com/engine/install/) to setup the dashboard as a service, follow the above quick start steps and then use

```bash
make run-local
```

to spin up the service.
