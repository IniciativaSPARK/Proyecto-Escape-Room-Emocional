import express from 'express';
import {
  getAll,
  getById,
  getByUsuario,
  create,
  update,
  remove
} from '../controllers/credencialesController.js';

const router = express.Router();

router.get('/credenciales', getAll);
router.get('/credenciales/:id', getById);
router.get('/usuarios/:usuarioId/credenciales', getByUsuario);
router.post('/credenciales', create);
router.put('/credenciales/:id', update);
router.delete('/credenciales/:id', remove);

export default router;