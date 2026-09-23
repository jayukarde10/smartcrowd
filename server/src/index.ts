// ============================================================
// SMARTCROWD — Express Server Entry Point
// CX0403: The Last-Mile Bus Mystery
//
// Port 3001, CORS enabled for Vite dev server on :5173
// ============================================================

import express from 'express';
import cors from 'cors';

import signalsRouter from './routes/signals.js';
import busRouter from './routes/bus.js';
import routesRouter from './routes/routes.js';
import simulationRouter from './routes/simulation.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ───────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ origin: allowedOrigins as string[] }));
app.use(express.json());

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'SmartCrowd API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ──────────────────────────────────────────────
app.use('/api/signals', signalsRouter);
app.use('/api/bus', busRouter);
app.use('/api/routes', routesRouter);
app.use('/api/simulation', simulationRouter);

import { initDb } from './db.js';

// ── 404 handler ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// ── Start ───────────────────────────────────────────────────
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════╗
    ║   SmartCrowd API — CX0403                ║
    ║   http://localhost:${PORT}                  ║
    ║   CORS: http://localhost:5173             ║
    ╚═══════════════════════════════════════════╝
    `);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
