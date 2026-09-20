import { Router } from 'express';
import { handleAiChat } from '../controllers/aiController.js';

const router = Router();

router.post('/ai/chat', handleAiChat);

export default router;