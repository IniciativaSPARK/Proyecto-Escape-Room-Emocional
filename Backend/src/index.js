//Aqui tendremos el codigo principal del backend
//Importaremos dependencias y configuraremos el servidor

import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/',(req, res) => {
    res.send('Servidor Express funcionando')
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en https://localhost:${PORT}`);
})
