import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaMicrophone, FaMicrophoneSlash, FaPaperPlane, FaThumbsUp, FaThumbsDown, FaRegCopy, FaRegEdit } from 'react-icons/fa';

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

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    if (!hasPrompted) setHasPrompted(true);
    const userMessage = { sender: 'user', text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    try {
      const systemPrompt = `You are an empathetic and professional AI mental health counselor. Your role is to understand the user's mental health condition, mood patterns, daily activities, and cognitive performance based on the detailed data provided. Use this comprehensive overview of the user's recent assessments, mood history, activity logs, and game performance metrics to offer personalized, supportive, and practical advice that promotes the user's emotional well-being, cognitive health, and overall balance in daily life. Always communicate with compassion, avoid judgment, and tailor your responses to reflect the unique experiences and needs revealed by the data.`;
      let contextString = '';
      if (context) {
        try {
          const jsonStr = JSON.stringify(context);

          console.log(context.length);


          contextString = jsonStr.length > 3000 ? jsonStr.slice(0, 3000) + '...[truncated]' : jsonStr;   // This is just for the temp usage. For getting full context use the full context
           
          console.log(contextString.length);
        
        } catch {
          contextString = 'Context data unavailable due to serialization error.';
        }
      }
      const messagesPayload = [{ role: 'system', content: systemPrompt }];
      if (contextString) {
        messagesPayload.push({ role: 'system', content: `User context data: ${contextString}` });
      }
      const lastTurns = updatedMessages.slice(-10);
      for (const msg of lastTurns) {
        messagesPayload.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        });
      }
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: messagesPayload,
        }),
      });
      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content || "Something went wrong...";
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, something went wrong. Please try again shortly.' },
      ]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isListening) stopListening();
    await sendMessage(input);
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition || isLoading) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .copilot-exit-btn {
            top: 10px !important;
            right: 10px !important;
            width: 36px !important;
            height: 36px !important;
            font-size: 18px !important;
          }
          .copilot-input-bar {
            max-width: 100vw !important;
            border-radius: 18px !important;
            padding: 10px 8px !important;
            min-height: 54px !important;
          }
          .copilot-mic-btn, .copilot-send-btn {
            width: 36px !important;
            height: 36px !important;
            border-radius: 18px !important;
            font-size: 18px !important;
          }
          .copilot-send-btn {
            border-radius: 18px !important;
            font-size: 18px !important;
            padding: 0 !important;
          }
          .copilot-input {
            font-size: 15px !important;
            padding: 8px 8px !important;
            border-radius: 12px !important;
          }
          .copilot-chat-bubble {
            font-size: 15px !important;
            padding: 10px 12px !important;
            border-radius: 12px !important;
            max-width: 95vw !important;
          }
          .copilot-prompt {
            font-size: 1.1em !important;
            margin-top: 40px !important;
            padding: 0 4vw !important;
          }
        }
      `}</style>
      <div style={{
        minHeight: '100vh',
        background: '#faf8f6',
        width: '100vw',
        position: 'relative',
        fontFamily: 'Segoe UI, Arial, sans-serif',
      }}>
        {/* Exit Button */}
        <button
          onClick={() => navigate('/')}
          className="copilot-exit-btn"
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
            fontWeight: 600,
            fontSize: 22,
            cursor: 'pointer',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          title="Exit to Home"
        >
          ×
        </button>

        {/* Centered Prompt or Chat */}
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 120,
        }}>
          {/* Initial Prompt */}
          {!hasPrompted && (
            <div className="copilot-prompt" style={{
              marginTop: 80,
              textAlign: 'center',
              color: '#222',
            }}>
              <div style={{ fontSize: '1.5em', fontWeight: 500, marginBottom: 24 }}>
                   Hi, I am your AI counsellor...!!
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 18, alignItems: 'center', color: '#b0b0b0', fontSize: 20 }}>
                <FaThumbsUp style={{ cursor: 'pointer' }} />
                <FaThumbsDown style={{ cursor: 'pointer' }} />
                <FaRegCopy style={{ cursor: 'pointer' }} />
                <span style={{ fontSize: 22, color: '#e0e0e0' }}>|</span>
                <FaRegEdit style={{ cursor: 'pointer' }} />
                <span style={{ fontSize: 15, color: '#888', marginLeft: 8 }}>AI counsellor</span>
              </div>
            </div>
          )}

          {/* Chat Window */}
          {hasPrompted && (
            <div style={{
              width: '100%',
              maxWidth: 700,
              margin: '0 auto',
              marginTop: 40,
              marginBottom: 40,
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className="copilot-chat-bubble"
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.sender === 'user' ? '#e6f0ff' : '#fff',
                    color: '#222',
                    borderRadius: 18,
                    padding: '14px 22px',
                    maxWidth: '80%',
                    fontSize: 17,
                    lineHeight: 1.6,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    wordBreak: 'break-word',
                  }}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
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

        {/* Chat Input Floating Bar */}
        <form
          id="chat-form"
          onSubmit={handleSubmit}
          className="copilot-input-bar"
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            margin: '0 auto',
            width: '100%',
            maxWidth: 600,
            background: '#fff',
            borderRadius: 32,
            boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
            padding: '18px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            zIndex: 99,
            minHeight: 72,
          }}
        >
          {/* Mic Button */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={isLoading}
            title={isListening ? 'Stop Recording' : 'Start Recording'}
            className="copilot-mic-btn"
            style={{
              background: '#f5f5f5',
              border: 'none',
              color: isListening ? '#ff4444' : '#b0b0b0',
              fontSize: 24,
              cursor: 'pointer',
              width: 44,
              height: 44,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          {/* Input Field */}
          <input
            type="text"
            placeholder="Type or speak your thoughts..."
            id="chat-message"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="copilot-input"
            style={{
              flex: 1,
              background: '#faf8f6',
              border: 'none',
              borderRadius: 18,
              fontSize: 18,
              color: '#222',
              padding: '12px 18px',
              margin: '0 8px',
              outline: 'none',
              minWidth: 0,
            }}
          />
          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            title="Send Message"
            className="copilot-send-btn"
            style={{
              background: '#7baaf7',
              border: 'none',
              color: '#fff',
              width: 64,
              height: 44,
              borderRadius: 22,
              fontWeight: 600,
              fontSize: 22,
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: isLoading || !input.trim() ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <FaPaperPlane style={{ fontSize: 22 }} />
          </button>
        </form>
      </div>
    </>
  );
};

export default CopilotLikeChat;