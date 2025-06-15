import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPaperPlane,
  FaThumbsUp,
  FaThumbsDown,
  FaRegCopy,
  FaRegEdit
} from 'react-icons/fa';

// Simple typewriter effect for bot text
const Typewriter = ({ text }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let idx = 0;
    const interval = setInterval(() => {
      setDisplayed(prev => prev + text.charAt(idx));
      idx++;
      if (idx >= text.length) clearInterval(interval);
    }, 2); // adjust speed here (ms per character)
    return () => clearInterval(interval);
  }, [text]);
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {displayed}
    </ReactMarkdown>
  );
};

const CopilotLikeChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { summary, context } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const recognitionRef = useRef(null);

  // set up speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recog = new SpeechRecognition();
    recog.lang = 'en-US';
    recog.interimResults = false;
    recog.continuous = false;
    recog.onresult = e => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => prev ? prev + ' ' + transcript : transcript);
    };
    recog.onerror = () => setIsListening(false);
    recog.onend = () => setIsListening(false);
    recognitionRef.current = recog;
    return () => recognitionRef.current?.abort();
  }, []);

  // send user message to AI
  const sendMessage = async text => {
    if (!text.trim() || isLoading) return;
    if (!hasPrompted) setHasPrompted(true);

    setMessages(prev => [...prev, { sender: 'user', text }]);
    setIsLoading(true);
    try {
      const systemPrompt = `You are an empathetic and professional AI mental health counselor. Your role is to understand the user's mental health condition, mood patterns, daily activities, and cognitive performance based on the detailed data provided. Use this comprehensive overview of the user's recent assessments, mood history, activity logs, and game performance metrics to offer personalized, supportive, and practical advice that promotes the user's emotional well-being, cognitive health, and overall balance in daily life. Always communicate with compassion, avoid judgment, and tailor your responses to reflect the unique experiences and needs revealed by the data.`;
      let contextString = '';
      if (context) {
        try {
          const full = JSON.stringify(context);
          contextString = full.slice(0, 3000) + (full.length > 3000 ? '...[truncated]' : '');
        } catch {
          contextString = 'Context data unavailable.';
        }
      }

      const payload = [{ role: 'system', content: systemPrompt }];
      if (contextString) {
        payload.push({ role: 'system', content: `User context: ${contextString}` });
      }
      const recent = [...messages, { sender: 'user', text }].slice(-10);
      recent.forEach(msg =>
        payload.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })
      );

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: payload
        })
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Something went wrong...';
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Sorry, something went wrong. Please try again shortly.' }
      ]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  // handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    await sendMessage(input);
  };

  // toggle listening
  const toggleListening = () => {
    if (!recognitionRef.current || isLoading) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <>
      <style>{`
        /* INITIAL PROMPT */
        .initial-message {
          background: #fff;
          padding: 24px 32px;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          width: 65vw;
          margin: 80px auto 24px;
          text-align: center;
          color: #333;
          line-height: 1.6;
        }
        @media (max-width: 600px) {
          .initial-message { width: 90vw; }
        }

        /* CHAT WINDOW */
        .chat-window {
          margin: 40px auto;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          width: 65vw;
        }
        @media (max-width: 600px) {
          .chat-window { width: 100vw; padding: 0 16px; }
        }

        /* BOT MESSAGE */
        .bot-message {
          align-self: flex-start;
          color: #222;
          font-size: 17px;
          line-height: 1.6;
          word-break: break-word;
          width: 100%;
        }

        /* USER BUBBLE */
        .user-bubble {
          align-self: flex-end;
          background: #e6f0ff;
          color: #222;
          border-radius: 18px;
          padding: 14px 22px;
          max-width: 80%;
          font-size: 17px;
          line-height: 1.6;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          word-break: break-word;
        }

        /* INPUT BAR */
        .input-bar {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 65vw;
          padding: 12px 24px;
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 2000;
        }
        @media (max-width: 600px) {
          .input-bar {
            bottom: 0;
            width: 100vw !important;
            padding: 10px 16px !important;
          }
        }

        .input-field {
          flex: 1;
          background: #faf8f6;
          border: 1px solid #ddd;
          border-radius: 20px;
          font-size: 16px;
          color: #222;
          padding: 8px 12px;
          outline: none;
          height: 36px;
        }
        .mic-btn, .send-btn {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .mic-btn {
          background: #f5f5f5;
          color: #b0b0b0;
          font-size: 20px;
        }
        .mic-btn.recording {
          color: #ff4444;
        }
        .send-btn {
          background: #7baaf7;
          color: #fff;
          font-size: 18px;
        }
        .send-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#faf8f6',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        position: 'relative',
        paddingBottom: '140px'
      }}>
        {/* Exit Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: 24,
            right: 32,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#fff',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            color: '#222',
            fontSize: 22,
            cursor: 'pointer',
            zIndex: 2100
          }}
          title="Exit to Home"
        >
          ×
        </button>

        {/* Center Area */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Initial Prompt */}
          {!hasPrompted && (
            <div className="initial-message">
              <p style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 16 }}>
                Hi, I’m your personalized AI counselor!
              </p>
              <p style={{ marginBottom: 12 }}>
                I’m not a real doctor or psychologist, and I can’t see or fully understand your situation like a human can. I use your assessments and other data to give you some initial personalized guidance.
              </p>
              <p style={{ marginBottom: 24 }}>
                For proper support, it’s always best to speak with a real doctor or psychologist—there’s nothing wrong with that.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 18, color: '#b0b0b0', fontSize: 20 }}>
                <FaThumbsUp style={{ cursor: 'pointer' }} />
                <FaThumbsDown style={{ cursor: 'pointer' }} />
                <FaRegCopy style={{ cursor: 'pointer' }} />
                <span style={{ fontSize: 22, color: '#e0e0e0' }}>|</span>
                <FaRegEdit style={{ cursor: 'pointer' }} />
                <span style={{ fontSize: 15, color: '#888' }}>AI counsellor</span>
              </div>
            </div>
          )}

          {/* Chat History */}
          {hasPrompted && (
            <div className="chat-window">
              {messages.map((msg, idx) => (
                msg.sender === 'bot'
                  ? <div key={idx} className="bot-message">
                      <Typewriter text={msg.text} />
                    </div>
                  : <div key={idx} className="user-bubble">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
              ))}
              {isListening && (
                <div style={{ textAlign: 'center', color: '#ff4444', fontWeight: 600, fontSize: 16 }}>
                  ● Recording voice...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="input-bar">
          <button
            type="button"
            onClick={toggleListening}
            disabled={isLoading}
            className={`mic-btn ${isListening ? 'recording' : ''}`}
          >
            {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>

          <input
            type="text"
            placeholder="Ask me anything!"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
            className="input-field"
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="send-btn"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </>
  );
};

export default CopilotLikeChat;