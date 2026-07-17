const ChatHistory = require('../models/ChatHistory');
const { getAIResponse } = require('../services/aiService');

// ── POST /api/chat ─────────────────────────────────────────────────────────────
const sendMessage = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    // Validation
    if (!sessionId || typeof sessionId !== 'string' || !sessionId.trim()) {
      return res.status(400).json({
        success: false,
        message: '"sessionId" is required and must be a non-empty string.',
      });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: '"message" is required and must be a non-empty string.',
      });
    }

    const cleanMessage = message.trim();
    const cleanSessionId = sessionId.trim();

    // Find or create the session document
    let session = await ChatHistory.findOne({ sessionId: cleanSessionId });
    if (!session) {
      session = new ChatHistory({ sessionId: cleanSessionId, messages: [] });
    }

    // Persist the user message
    const userMsg = { role: 'user', content: cleanMessage, timestamp: new Date() };
    session.messages.push(userMsg);

    // Get AI response (never throws — falls back to FAQ internally)
    const { content: aiContent, usedFallback } = await getAIResponse(
      session.messages.slice(0, -1), // history before this new message
      cleanMessage
    );

    // Persist the AI message
    const aiMsg = { role: 'assistant', content: aiContent, timestamp: new Date() };
    session.messages.push(aiMsg);
    await session.save();

    return res.status(200).json({
      success: true,
      data: {
        sessionId: cleanSessionId,
        message: aiMsg,
        usedFallback,
      },
    });
  } catch (error) {
    console.error('[chatController.sendMessage]', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred. Please try again.',
    });
  }
};

// ── GET /api/chat/history/:sessionId ─────────────────────────────────────────
const getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'sessionId param is required.',
      });
    }

    const session = await ChatHistory.findOne({ sessionId: sessionId.trim() });
    if (!session) {
      return res.status(200).json({
        success: true,
        data: { sessionId, messages: [] },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        messages: session.messages,
        createdAt: session.createdAt,
      },
    });
  } catch (error) {
    console.error('[chatController.getHistory]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat history.',
    });
  }
};

// ── DELETE /api/chat/history/:sessionId ───────────────────────────────────────
const clearHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'sessionId param is required.',
      });
    }

    await ChatHistory.deleteOne({ sessionId: sessionId.trim() });

    return res.status(200).json({
      success: true,
      message: 'Chat history cleared.',
    });
  } catch (error) {
    console.error('[chatController.clearHistory]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear chat history.',
    });
  }
};

module.exports = { sendMessage, getHistory, clearHistory };
