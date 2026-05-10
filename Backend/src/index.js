//Aqui tendremos el codigo principal del backend
//Importaremos dependencias y configuraremos el servidor



import express from 'express';
import credencialesRoutes from './routes/credencialesRoutes.js';

const app = express();
app.use(express.json());

app.use('/api', credencialesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});