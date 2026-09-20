import pool from '../lib/db.js';

export const getSystemMetrics = async () => {
    try {
        const userCountResult = await pool.query('SELECT COUNT(*) FROM users');

        const securityStatsResult = await pool.query(`
            SELECT 
                COUNT(*) AS total_credentials,
                SUM(failed_login_attempts) AS total_failed_attempts
            FROM credentials
        `);

        return {
            totalUsers: parseInt(userCountResult.rows[0].count, 10),
            totalCredentials: parseInt(securityStatsResult.rows[0].total_credentials, 10),
            totalFailedLogins: parseInt(securityStatsResult.rows[0].total_failed_attempts || 0, 10),
            serverStatus: "Online",
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        throw new Error(`Error fetching dashboard metrics: ${error.message}`);
    }
};