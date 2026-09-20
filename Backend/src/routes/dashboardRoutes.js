import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';

const router = Router();

router.get('/dashboard', getDashboardData);

router.get('/dashboard/patient/:id', (req, res) => {
    const { id } = req.params;
    res.json({ userId: id, role: 'patient' });
});

router.get('/dashboard/psychologist/:id', (req, res) => {
    const { id } = req.params;
    res.json({ psychologistId: id, role: 'psychologist' });
});

export default router;