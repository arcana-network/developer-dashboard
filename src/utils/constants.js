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

export const isAppDown = import.meta.env.VITE_IS_APP_DOWN || false;

export const chains = [
  {
    label: "Ethereum",
    value: "ethereum",
  },
  {
    label: "Polygon",
    value: "polygon",
  },
  {
    label: "Binance",
    value: "binance",
  },
];

export default {
  sentry,
  api,
  arcanaAppId,
  isAppDown,
  chains,
};
