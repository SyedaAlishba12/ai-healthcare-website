const express = require('express');
const router = express.Router();
const { sendMessage, getHistory, clearHistory } = require('../controllers/chatController');

// POST   /api/chat              — send a message, get AI response
router.post('/', sendMessage);

// GET    /api/chat/history/:sessionId — retrieve message history
router.get('/history/:sessionId', getHistory);

// DELETE /api/chat/history/:sessionId — clear message history
router.delete('/history/:sessionId', clearHistory);

module.exports = router;
