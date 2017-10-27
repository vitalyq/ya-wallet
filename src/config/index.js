const Joi = require('joi');

// Validate config variables
const envSchema = Joi.object({
  // General
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  NO_CLIENT: Joi.number().valid(1),

  // Server
  PORT: Joi.number(),

  // Database
  DATABASE_URL: Joi.string().uri(),

  // Logger
  LOGGER_LEVEL: Joi.string()
    .valid('off', 'mark', 'fatal', 'error', 'warn', 'info', 'debug', 'trace', 'all'),
}).unknown().required();

const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw Error(`Config validation error: ${error.message}`);
}

// Set up config based on environment
module.exports = {
  env: envVars.NODE_ENV,
  isProduction: envVars.NODE_ENV === 'production',
  isDevelopment: envVars.NODE_ENV === 'development',
  renderClient: envVars.NO_CLIENT !== 1,

  server: {
    port: envVars.PORT || 3000,
  },
  database: {
    url: envVars.DATABASE_URL || 'mongodb://localhost:27017/wallet',
  },
  logger: {
    level: envVars.LOGGER_LEVEL || (envVars.NODE_ENV === 'production' ? 'info' : 'debug'),
  },
};
