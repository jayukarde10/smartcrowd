// ============================================================
// SMARTCROWD — Signal API Routes
// POST /api/signals — ingest raw signals, score, store
// GET  /api/signals — return all active scored signals
// ============================================================

import { Router } from 'express';
import type { Request, Response } from 'express';
import { store } from '../store.js';
import { scoreSignal } from '../engine/signalScoring.js';
import { computeBusEstimate } from '../engine/crowdConsensus.js';
import type { PassengerSignal } from '../types.js';

const router = Router();

// POST /api/signals — accept raw signal data, score it, store it
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body || !Array.isArray(body.signals)) {
      res.status(400).json({ error: 'Request body must contain a "signals" array.' });
      return;
    }

    const rawSignals: PassengerSignal[] = body.signals;

    // Validate each signal has required fields
    for (const sig of rawSignals) {
      if (!sig.position || typeof sig.position.lat !== 'number' || typeof sig.position.lng !== 'number') {
        res.status(400).json({ error: `Signal ${sig.id || 'unknown'} has invalid position.` });
        return;
      }
      if (typeof sig.speed !== 'number' || sig.speed < 0) {
        res.status(400).json({ error: `Signal ${sig.id || 'unknown'} has invalid speed.` });
        return;
      }
    }

    // Pre-process histories by fetching from Postgres
    const enrichedSignals = await Promise.all(rawSignals.map(async sig => {
      const sid = sig.sessionId || sig.id || 'unknown';
      const history = await store.getSignalHistory(sid, 8);
      
      const posHist = history.map(h => ({ lat: h.lat, lng: h.lng }));
      const speedHist = history.map(h => h.speed);

      // Append current point
      posHist.push(sig.position);
      speedHist.push(sig.speed);

      return {
        ...sig,
        positionHistory: posHist,
        speedHistory: speedHist
      };
    }));

    // Score each signal through the pipeline
    const scored = enrichedSignals.map(s => scoreSignal(s));

    // Store them
    await store.addSignals(scored);

    // Recompute bus estimate
    const allSignals = await store.getSignals();
    const estimate = computeBusEstimate(allSignals);
    await store.setEstimate(estimate);

    res.json({
      processed: scored.length,
      reliable: scored.filter(s => s.status === 'RELIABLE').length,
      rejected: scored.filter(s => s.status !== 'RELIABLE').length,
      signals: scored,
    });
  } catch (err) {
    console.error('Error processing signals:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/signals — return all active signals
router.get('/', async (_req: Request, res: Response) => {
  try {
    const signals = await store.getSignals();
    res.json({ count: signals.length, signals });
  } catch (err) {
    console.error('Error fetching signals:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
