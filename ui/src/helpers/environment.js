const env = process && process.env && process.env.NODE_ENV;

export const ENV  = {
  PRODUCTION : 'production',
  DEVELOPMENT : 'development'
}

function isProduction() {
  return  env === ENV.PRODUCTION;
}

function isDevelopment() {
  return env === ENV.DEVELOPMENT;
}

export const environment = {
  isDevelopment,
  isProduction,
};
