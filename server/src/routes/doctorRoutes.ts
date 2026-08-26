import { Router } from 'express';
import { verifyPatientToken, addDoctorSuggestion, createAccessGrant } from '../controllers/doctorController.js';

const router = Router();

router.post('/verify-token', verifyPatientToken);
router.post('/suggestions', addDoctorSuggestion);
router.post('/access-grants', createAccessGrant);

export default router;
