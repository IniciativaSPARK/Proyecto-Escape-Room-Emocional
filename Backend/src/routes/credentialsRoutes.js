import express from 'express';

import {
  getAll,
  getById,
  getByUser,
  create,
  update,
  remove
} from '../controllers/credentialsController.js';

const router = express.Router();

// ======================================================
// CREDENTIAL ROUTES
// ======================================================

router.get('/credentials', getAll);

router.get('/credentials/:id', getById);

router.get('/users/:userId/credentials', getByUser);

router.post('/credentials', create);

router.put('/credentials/:id', update);

router.delete('/credentials/:id', remove);

export default router;