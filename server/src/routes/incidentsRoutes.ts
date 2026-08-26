import { Router } from 'express';
import { getIncidents, createIncident, closeIncident, reopenIncident } from '../controllers/incidentsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getIncidents);
router.post('/', createIncident);
router.patch('/:id/close', closeIncident);
router.patch('/:id/reopen', reopenIncident);

export default router;
