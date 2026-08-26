import { Router } from 'express';
import { queryAI } from '../controllers/aiController.js';

const router = Router();

router.post('/query', queryAI);

export default router;
