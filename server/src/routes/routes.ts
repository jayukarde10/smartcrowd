// ============================================================
// SMARTCROWD — Transit Route API Routes
// GET /api/routes          — all routes
// GET /api/routes/:routeId — specific route with polyline/stops
// ============================================================

import { Router } from 'express';
import type { Request, Response } from 'express';
import { ALL_ROUTES, ROUTE_104 } from '../data/routes.js';

const router = Router();

// GET /api/routes — list all routes
router.get('/', (_req: Request, res: Response) => {
  res.json({
    count: ALL_ROUTES.length,
    routes: ALL_ROUTES.map(r => ({
      id: r.id,
      name: r.name,
      shortName: r.shortName,
      stopCount: r.stops.length,
      color: r.color,
    })),
  });
});

// GET /api/routes/:routeId — full route detail
router.get('/:routeId', (req: Request, res: Response) => {
  const { routeId } = req.params;

  if (routeId !== 'route-104') {
    res.status(404).json({ error: `Route "${routeId}" not found.` });
    return;
  }

  res.json(ROUTE_104);
});

export default router;
