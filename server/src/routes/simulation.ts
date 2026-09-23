// ============================================================
// SMARTCROWD — Simulation API Routes
// POST /api/simulation/start  — start server-side sim loop
// POST /api/simulation/stop   — stop the loop
// POST /api/simulation/reset  — clear all state
// GET  /api/simulation/status — current status
// ============================================================

import { Router } from 'express';
import type { Request, Response } from 'express';
import { store } from '../store.js';
import { simulationTick, resetSimulation } from '../engine/simulation.js';
import { computeBusEstimate } from '../engine/crowdConsensus.js';

const router = Router();

const TICK_MS = 1500;
let simInterval: ReturnType<typeof setInterval> | null = null;
let simRunning = false;

async function runTick() {
  try {
    const signals = simulationTick('NORMAL');
    await store.addSignals(signals);
    const allSignals = await store.getSignals();
    const estimate = computeBusEstimate(allSignals);
    await store.setEstimate(estimate);
  } catch (err) {
    console.error('Simulation tick error:', err);
  }
}

// POST /api/simulation/start
router.post('/start', async (_req: Request, res: Response) => {
  if (simRunning) {
    res.json({ message: 'Simulation already running.', running: true });
    return;
  }

  resetSimulation();
  await store.clear();
  simRunning = true;

  // Run first tick immediately
  runTick();

  simInterval = setInterval(runTick, TICK_MS);

  console.log('[SmartCrowd] Simulation started (tick every 1.5s)');
  res.json({ message: 'Simulation started.', running: true });
});

// POST /api/simulation/stop
router.post('/stop', (_req: Request, res: Response) => {
  if (simInterval) {
    clearInterval(simInterval);
    simInterval = null;
  }
  simRunning = false;

  console.log('[SmartCrowd] Simulation stopped');
  res.json({ message: 'Simulation stopped.', running: false });
});

// POST /api/simulation/reset
router.post('/reset', async (_req: Request, res: Response) => {
  if (simInterval) {
    clearInterval(simInterval);
    simInterval = null;
  }
  simRunning = false;
  resetSimulation();
  await store.clear();

  console.log('[SmartCrowd] Simulation reset');
  res.json({ message: 'Simulation reset.', running: false });
});

// GET /api/simulation/status
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const signals = await store.getSignals();
    const estimate = await store.getEstimate();
    res.json({
      running: simRunning,
      tickCount: store.getTickCount(),
      signalCount: signals.length,
      hasEstimate: estimate !== null,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
