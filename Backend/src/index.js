//Aqui tendremos el codigo principal del backend
//Importaremos dependencias y configuraremos el servidor

import express from 'express';
import cors from 'cors';       
import dotenv from 'dotenv';   
import usuariosRoutes from './routes/usuarios.routes.js';

dotenv.config();      

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());       
app.use(express.json());        

app.get('/', (req, res) => {
    res.send('Servidor Express funcionando');
});

app.use('/api', usuariosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);  
});
