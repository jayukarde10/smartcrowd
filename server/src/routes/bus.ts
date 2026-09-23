// ============================================================
// SMARTCROWD — Bus Estimate API Routes
// GET /api/bus/:routeId     — current bus estimate
// GET /api/bus/:routeId/eta — ETA only
// ============================================================

import { Router } from 'express';
import type { Request, Response } from 'express';
import { store } from '../store.js';
import { computeBusEstimate } from '../engine/crowdConsensus.js';

const router = Router();

// GET /api/bus/:routeId — full bus estimate
router.get('/:routeId', async (req: Request, res: Response) => {
  try {
    const { routeId } = req.params;

    if (routeId !== 'route-104') {
      res.status(404).json({ error: `Route "${routeId}" not found.` });
      return;
    }

    // Recompute fresh estimate from current signals
    const signals = await store.getSignals();
    const estimate = computeBusEstimate(signals);
    await store.setEstimate(estimate);

    res.json(estimate);
  } catch (err) {
    console.error('Error fetching bus estimate:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/bus/:routeId/eta — ETA subset
router.get('/:routeId/eta', async (req: Request, res: Response) => {
  try {
    const { routeId } = req.params;

    if (routeId !== 'route-104') {
      res.status(404).json({ error: `Route "${routeId}" not found.` });
      return;
    }

    const signals = await store.getSignals();
    const estimate = computeBusEstimate(signals);

    res.json({
      routeId: estimate.routeId,
      etaMinutes: estimate.etaMinutes,
      etaAvailable: estimate.etaAvailable,
      nextStopId: estimate.nextStopId,
      confidence: estimate.confidence,
      confidenceLevel: estimate.confidenceLevel,
    });
  } catch (err) {
    console.error('Error fetching bus eta:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
