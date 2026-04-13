const { z } = require('zod');
require('dotenv').config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL connection string"),
  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN is required").transform(val => val.split(',')),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.error('❌ Invalid environment variables:');
  console.error(JSON.stringify(envServer.error.format(), null, 2));
  process.exit(1);
}

module.exports = envServer.data;
