import { Router } from 'express';
import { upload, uploadDocuments, getDocuments } from '../controllers/documentsController.js';

const router = Router();

router.get('/', getDocuments);
router.post('/upload', upload.array('files', 10), uploadDocuments);

export default router;
