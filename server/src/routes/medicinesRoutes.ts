import { Router } from 'express';
import { getMedicines, getReminders, addMedicineWithReminders, toggleReminderStatus } from '../controllers/medicinesController.js';

const router = Router();

router.get('/', getMedicines);
router.get('/reminders', getReminders);
router.post('/', addMedicineWithReminders);
router.patch('/reminders/:id/status', toggleReminderStatus);

export default router;
