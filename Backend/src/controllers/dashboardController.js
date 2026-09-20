import { getSystemMetrics } from '../services/dashboardService.js';

export const getDashboardData = async (req, res) => {
    try {
        const metrics = await getSystemMetrics();
        res.status(200).json({
            success: true,
            data: metrics
        });
    } catch (error) {
        console.error("Error en dashboardController:", error);
        res.status(500).json({ error: 'Internal server error while fetching dashboard data' });
    }
};