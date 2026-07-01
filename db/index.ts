import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

export const createPool = () => {
  return new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 10000, // Cleanly close idle clients after 10s to prevent forced terminations
    max: 10,                 // Healthy connection limit for serverless instances
  });
};

const pool = createPool();

pool.on('error', (err: any) => {
  const errMsg = err?.message || '';
  // Suppress severe logging for benign scale-to-zero connection closures
  if (
    errMsg.includes('terminating connection due to administrator command') || 
    errMsg.includes('closed') || 
    errMsg.includes('ECONNRESET')
  ) {
    console.info('SQL Pool: Cleaned up idle scale-to-zero connection gracefully.');
  } else {
    console.error('Unexpected error on idle SQL pool client:', err);
  }
});

export const db = drizzle(pool, { schema });
