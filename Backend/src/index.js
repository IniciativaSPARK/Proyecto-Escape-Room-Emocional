import express from 'express';

import credentialsRoutes from './routes/credentialsRoutes.js';

const app = express();

app.use(express.json());

// ======================================
// API ROUTES
// ======================================

app.use('/api', credentialsRoutes);

// ======================================
// SERVER
// ======================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});