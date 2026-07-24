/**
 * Chatbot.jsx — Floating AI Support Chatbot Widget
 *
 * Self-contained floating widget. Import and render it once in App.jsx
 * (or any layout wrapper) OUTSIDE the <Routes> block so it's visible on
 * every page:
 *
 *   import Chatbot from './components/Chatbot/Chatbot';
 *   // Inside the return, after <Routes>...</Routes>:
 *   <Chatbot />
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../UI/Button';
import './Chatbot.css';

// ── Constants ─────────────────────────────────────────────────────────────────
const DISCLAIMER =
  'This chatbot provides general information only. It does not diagnose diseases or replace a qualified doctor. For an emergency, contact emergency services immediately.';

const QUICK_QUESTIONS = [
  'How do I book an appointment?',
  'Find hospitals near me',
  'What lab tests are available?',
  'Emergency contacts',
];

const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    "👋 Hi! I'm your healthcare website assistant. I can help you navigate the site — booking appointments, finding hospitals, lab tests, and more.\n\nHow can I help you today?",
  timestamp: new Date(),
  id: 'welcome',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Generate a stable session ID for this browser session */
const getSessionId = () => {
  const key = 'chatbot_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id =
      typeof crypto?.randomUUID === 'function'
        ? crypto.randomUUID()
        : `sess-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
};

/** Convert **bold** markdown to <strong> tags for assistant messages */
const renderMarkdown = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

/** Format a timestamp to HH:MM */
const formatTime = (ts) => {
  const d = ts instanceof Date ? ts : new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// ── Main Component ────────────────────────────────────────────────────────────
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const sessionId = useRef(getSessionId());
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Clear unread badge when chat opens
  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 100)}px`;
    }
  };

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text) => {
      const content = (text ?? input).trim();
      if (!content || isLoading) return;

      setInput('');
      setNetworkError('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';

      // Optimistically add user message
      const userMsg = {
        role: 'user',
        content,
        timestamp: new Date(),
        id: `u-${Date.now()}`,
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // AbortController gives us a hard 15-second client-side timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const res = await fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionId.current, message: content }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || 'Unknown server error');
        }

        const aiMsg = {
          ...json.data.message,
          id: `a-${Date.now()}`,
          usedFallback: json.data.usedFallback,
        };
        setMessages((prev) => [...prev, aiMsg]);

        // Bump unread badge if chat is closed
        if (!isOpen) setUnreadCount((c) => c + 1);
      } catch (err) {
        clearTimeout(timeoutId);
        // Treat AbortError (timeout) the same as a network failure
        const isNetworkOrTimeout =
          err.name === 'AbortError' ||
          !navigator.onLine ||
          err.message.includes('fetch') ||
          err.message.includes('Failed to fetch');

        if (isNetworkOrTimeout) {
          const msg =
            err.name === 'AbortError'
              ? 'The request timed out (15 s). Please try again.'
              : 'Unable to reach the server. Please check your connection and try again.';
          setNetworkError(msg);
        } else {
          // Surface specific server error as a chat message so UI never looks broken
          const errorMsg = {
            role: 'assistant',
            content:
              "I'm sorry, something went wrong on my end. Please try again in a moment.",
            timestamp: new Date(),
            id: `err-${Date.now()}`,
          };
          setMessages((prev) => [...prev, errorMsg]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, isOpen]
  );

  // Send on Enter (Shift+Enter = newline)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Clear chat ──────────────────────────────────────────────────────────────
  const clearChat = async () => {
    setMessages([WELCOME_MESSAGE]);
    setNetworkError('');
    try {
    await fetch(`http://localhost:5000/api/chat/history/${sessionId.current}`, { method: 'DELETE' });
    } catch {
      // Ignore — local state is already cleared
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Floating trigger button ─────────────────────────────────────── */}
      <button
        id="chatbot-trigger-btn"
        className={`chatbot-trigger ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close chat' : 'Open AI support chat'}
        title={isOpen ? 'Close chat' : 'Chat with us'}
      >
        {isOpen ? (
          /* X icon */
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        ) : (
          /* Chat bubble icon */
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        )}
        {!isOpen && unreadCount > 0 && (
          <span className="chatbot-badge">{unreadCount}</span>
        )}
      </button>

      {/* ── Chat window ─────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          id="chatbot-window"
          className="chatbot-window"
          role="dialog"
          aria-label="AI Support Chat"
        >
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>
              <div className="chatbot-header-text">
                <h3>Healthcare Assistant</h3>
                <p>AI-powered · Always here to help</p>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button
                id="chatbot-clear-btn"
                className="chatbot-icon-btn"
                onClick={clearChat}
                title="Clear chat history"
                aria-label="Clear chat"
              >
                🗑
              </button>
              <button
                id="chatbot-close-btn"
                className="chatbot-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Disclaimer — always visible at top */}
          <div className="chatbot-disclaimer" role="note">
            <span className="disc-icon">⚠️</span>
            <span>{DISCLAIMER}</span>
          </div>

          {/* Messages */}
          <div
            id="chatbot-messages"
            className="chatbot-messages"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((msg) => (
              <div
                key={msg.id ?? `${msg.role}-${msg.timestamp}`}
                className={`chatbot-msg ${msg.role}`}
              >
                <div className="chatbot-bubble">
                  {msg.role === 'assistant'
                    ? renderMarkdown(msg.content)
                    : msg.content}
                </div>
                <div className="chatbot-time">{formatTime(msg.timestamp)}</div>
                {msg.usedFallback && (
                  <div className="chatbot-fallback-tag">
                    ⚡ Offline mode
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="chatbot-msg assistant">
                <div className="chatbot-typing" aria-label="Assistant is typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Network error banner */}
          {networkError && (
            <div id="chatbot-error" className="chatbot-error" role="alert">
              <span>⚠️</span>
              <span>{networkError}</span>
            </div>
          )}

          {/* Quick question chips */}
          <div className="chatbot-chips" aria-label="Quick questions">
            {QUICK_QUESTIONS.map((q) => (
              <Button
                key={q}
                variant="outline"
                className="chatbot-chip"
                onClick={() => sendMessage(q)}
                disabled={isLoading}
                aria-label={`Quick question: ${q}`}
              >
                {q}
              </Button>
            ))}
          </div>

          {/* Input row */}
          <div className="chatbot-input-row">
            <textarea
              id="chatbot-input"
              ref={textareaRef}
              className="chatbot-textarea"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message… (Enter to send)"
              disabled={isLoading}
              rows={1}
              aria-label="Chat message input"
            />
            <Button
              id="chatbot-send-btn"
              variant="primary"
              className="chatbot-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              title="Send"
            >
              {/* Paper-plane icon */}
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
