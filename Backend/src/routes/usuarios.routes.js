import express from 'express';

import { 
  getUsuarios, 
  getUsuarioById, 
  createUsuario, 
  updateUsuario, 
  deleteUsuario 
} from '../controllers/usuarios.controller.js';

const router = express.Router();

router.get('/usuarios', getUsuarios);
router.get('/usuarios/:id', getUsuarioById);  
router.post('/usuarios', createUsuario);
router.put('/usuarios/:id', updateUsuario);  
router.delete('/usuarios/:id', deleteUsuario);

export default router;