export const sso = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  },
  twitter: {
    clientId: import.meta.env.VITE_TWITTER_CLIENT_ID,
    clientSecret: import.meta.env.VITE_TWITTER_CLIENT_SECRET,
  },
  github: {
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
    clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
  },
  discord: {
    clientId: import.meta.env.VITE_DISCORD_CLIENT_ID,
  },
  twitch: {
    clientId: import.meta.env.VITE_TWITCH_CLIENT_ID,
  },
  reddit: {
    clientId: import.meta.env.VITE_REDDIT_CLIENT_ID,
  },
};

export const ssoRedirectUrl = window.location.origin + "/oauth/redirect";

export const sentry = {
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracingOrigins: [
    import.meta.env.VITE_SENTRY_TRACING_ORIGINS.split(","),
    /^\//,
  ],
};

export const api = {
  testnet: import.meta.env.VITE_TESTNET_API,
  mainnet: import.meta.env.VITE_MAINNET_API,
};

export const arcanaAppId = import.meta.env.VITE_ARCANA_APP_ID;

export const origin = window.location.origin;

export const isAppDown = import.meta.env.VITE_IS_APP_DOWN || false;

export default {
  sso,
  ssoRedirectUrl,
  sentry,
  api,
  arcanaAppId,
  origin,
  isAppDown,
};
