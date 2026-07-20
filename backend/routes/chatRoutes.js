import express from 'express';
const router = express.Router();
import { sendMessage, getHistory, clearHistory } from '../controllers/chatController.js';

// POST   /api/chat              — send a message, get AI response
router.post('/', sendMessage);

// GET    /api/chat/history/:sessionId — retrieve message history
router.get('/history/:sessionId', getHistory);

// DELETE /api/chat/history/:sessionId — clear message history
router.delete('/history/:sessionId', clearHistory);

export default router;
