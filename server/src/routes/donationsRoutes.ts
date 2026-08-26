import { Router } from 'express';
import { getCampaigns, createCampaign, verifyCampaign, processContribution } from '../controllers/donationsController.js';

const router = Router();

router.get('/', getCampaigns);
router.post('/', createCampaign);
router.patch('/:id/verify', verifyCampaign);
router.post('/:id/contribute', processContribution);

export default router;
