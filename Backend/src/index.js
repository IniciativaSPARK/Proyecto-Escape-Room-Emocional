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

// any person can entrar por q no tenemos cors
// cors : que dominions o ip pueden acceder
// tipo de solicitudes

// CORS permite o no tener http o https
// 
