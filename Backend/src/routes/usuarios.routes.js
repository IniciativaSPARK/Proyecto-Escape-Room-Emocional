import express from 'express';

import { 
  getUsuarios, 
  getUsuarioById, 
  createUsuario, 
  updateUsuario, 
  deleteUsuario 
} from '../controllers/usuarios.controller.js';
import { authMiddleware, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/usuarios', authMiddleware, getUsuarios);
router.get('/usuarios/:id', authMiddleware, getUsuarioById);  
router.post('/usuarios', createUsuario);
router.put('/usuarios/:id', authMiddleware, authorize('admin'), updateUsuario);  
router.delete('/usuarios/:id', authMiddleware, authorize('admin'), deleteUsuario);

export default router;