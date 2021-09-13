export const sso = {
  google: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  twitter: import.meta.env.VITE_TWITTER_CLIENT_ID,
  github: import.meta.env.VITE_GITHUB_CLIENT_ID,
  discord: import.meta.env.VITE_DISCORD_CLIENT_ID,
  twitch: import.meta.env.VITE_TWITCH_CLIENT_ID,
  reddit: import.meta.env.VITE_REDDIT_CLIENT_ID,
};

export const sentry = {
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracingOrigins: [
    import.meta.env.VITE_SENTRY_TRACING_ORIGINS.split(","),
    /^\//,
  ],
};

export default {
  sso,
  sentry,
};
