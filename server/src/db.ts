// ============================================================
// SMARTCROWD — Database Initialization
// ============================================================

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️  DATABASE_URL environment variable is missing. Will try to connect without it, which may fail.');
}

export const pool = new Pool({
  connectionString,
});

export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS passenger_signals (
        id VARCHAR(255) PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        route_id VARCHAR(255) NOT NULL,
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        speed DOUBLE PRECISION NOT NULL,
        heading DOUBLE PRECISION NOT NULL,
        role VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        reliability_score INTEGER NOT NULL,
        raw_data JSONB NOT NULL,
        created_at BIGINT NOT NULL
      );
    `);

    // Create index on session_id and created_at for fast history lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_passenger_signals_session_time 
      ON passenger_signals(session_id, created_at DESC);
    `);

    // Create index on route_id and created_at for fast estimate queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_passenger_signals_route_time 
      ON passenger_signals(route_id, created_at DESC);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS bus_estimates (
        route_id VARCHAR(255) PRIMARY KEY,
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        current_stop_id VARCHAR(255) NOT NULL,
        next_stop_id VARCHAR(255) NOT NULL,
        eta_minutes INTEGER NOT NULL,
        confidence INTEGER NOT NULL,
        raw_data JSONB NOT NULL,
        timestamp BIGINT NOT NULL
      );
    `);
    console.log('[SmartCrowd] PostgreSQL initialized successfully.');
  } catch (err) {
    console.error('[SmartCrowd] Error initializing PostgreSQL:', err);
    throw err;
  } finally {
    client.release();
  }
}
