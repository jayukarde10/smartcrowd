// ============================================================
// SMARTCROWD — Database Store
// Uses PostgreSQL for persistent storage
// ============================================================

import type { PassengerSignal, BusEstimate } from './types.js';
import { pool } from './db.js';

const SIGNAL_TTL_MS = 60_000; // Only consider signals from the last 60 seconds

class SignalStore {
  private tickCount = 0;

  async addSignals(newSignals: PassengerSignal[]): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO passenger_signals 
        (id, session_id, route_id, lat, lng, speed, heading, role, status, reliability_score, raw_data, created_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          lat = EXCLUDED.lat,
          lng = EXCLUDED.lng,
          speed = EXCLUDED.speed,
          heading = EXCLUDED.heading,
          status = EXCLUDED.status,
          reliability_score = EXCLUDED.reliability_score,
          raw_data = EXCLUDED.raw_data,
          created_at = EXCLUDED.created_at
      `;

      for (const sig of newSignals) {
        await client.query(query, [
          sig.id,
          sig.sessionId,
          sig.routeId,
          sig.position.lat,
          sig.position.lng,
          sig.speed,
          sig.heading,
          sig.role,
          sig.status,
          sig.scoring.reliabilityScore,
          JSON.stringify(sig),
          sig.timestamp
        ]);
      }
      
      await client.query('COMMIT');
      this.tickCount++;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async getSignals(): Promise<PassengerSignal[]> {
    const cutoff = Date.now() - SIGNAL_TTL_MS;
    const res = await pool.query(
      'SELECT raw_data FROM passenger_signals WHERE created_at >= $1 ORDER BY created_at DESC',
      [cutoff]
    );
    
    // De-duplicate by session_id to get only the latest signal per session within TTL
    const uniqueSignals = new Map<string, PassengerSignal>();
    for (const row of res.rows) {
      const sig = row.raw_data as PassengerSignal;
      if (!uniqueSignals.has(sig.sessionId)) {
        uniqueSignals.set(sig.sessionId, sig);
      }
    }
    
    return Array.from(uniqueSignals.values());
  }

  async getDemoPassengers(): Promise<PassengerSignal[]> {
    const res = await pool.query(
      `SELECT raw_data
       FROM passenger_signals
       WHERE raw_data->>'demo' = 'true'
       ORDER BY created_at DESC`
    );

    const uniquePassengers = new Map<string, PassengerSignal>();

    for (const row of res.rows) {
      const sig = row.raw_data as PassengerSignal;

      if (!uniquePassengers.has(sig.sessionId)) {
        uniquePassengers.set(sig.sessionId, sig);
      }
    }

    return Array.from(uniquePassengers.values());
  }

  async getSignalHistory(sessionId: string, limit = 8): Promise<{ lat: number; lng: number; speed: number }[]> {
    const res = await pool.query(
      'SELECT lat, lng, speed FROM passenger_signals WHERE session_id = $1 ORDER BY created_at DESC LIMIT $2',
      [sessionId, limit]
    );
    return res.rows.map(row => ({ lat: row.lat, lng: row.lng, speed: row.speed })).reverse();
  }

  async setEstimate(est: BusEstimate): Promise<void> {
    const query = `
      INSERT INTO bus_estimates 
      (route_id, lat, lng, current_stop_id, next_stop_id, eta_minutes, confidence, raw_data, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (route_id) DO UPDATE SET
        lat = EXCLUDED.lat,
        lng = EXCLUDED.lng,
        current_stop_id = EXCLUDED.current_stop_id,
        next_stop_id = EXCLUDED.next_stop_id,
        eta_minutes = EXCLUDED.eta_minutes,
        confidence = EXCLUDED.confidence,
        raw_data = EXCLUDED.raw_data,
        timestamp = EXCLUDED.timestamp
    `;
    
    await pool.query(query, [
      est.routeId,
      est.position.lat,
      est.position.lng,
      est.currentStopId,
      est.nextStopId,
      est.etaMinutes,
      est.confidence,
      JSON.stringify(est),
      est.timestamp
    ]);
  }

  async getEstimate(routeId = 'route-104'): Promise<BusEstimate | null> {
    const res = await pool.query('SELECT raw_data FROM bus_estimates WHERE route_id = $1', [routeId]);
    if (res.rows.length > 0) {
      return res.rows[0].raw_data as BusEstimate;
    }
    return null;
  }

  getTickCount(): number {
    return this.tickCount;
  }

  async clear(): Promise<void> {
    // For prototype simulation reset, we truncate the tables
    await pool.query('TRUNCATE TABLE passenger_signals');
    await pool.query('TRUNCATE TABLE bus_estimates');
    this.tickCount = 0;
  }
}

// Singleton instance
export const store = new SignalStore();
