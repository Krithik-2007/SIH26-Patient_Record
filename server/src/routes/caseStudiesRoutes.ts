import { Router } from 'express';
import { getCaseStudies, submitCaseStudy } from '../controllers/caseStudiesController.js';

const router = Router();

router.get('/', getCaseStudies);
router.post('/', submitCaseStudy);

export default router;
