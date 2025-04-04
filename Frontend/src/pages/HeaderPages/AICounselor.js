import React, { useState } from 'react';
import { FaRobot, FaComments, FaHistory, FaUserCircle } from 'react-icons/fa';

const AICounselor = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = {
        text: "I'm here to listen and support you. How are you feeling today?",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#6d8ded] p-4 flex items-center space-x-4">
            <FaRobot className="text-2xl text-white" />
            <div>
              <h1 className="text-xl font-bold text-white">AI Counselor</h1>
              <p className="text-sm text-white/80">Available 24/7 to support you</p>
            </div>
          </div>

          {/* Chat Container */}
          <div className="h-[600px] overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FaComments className="text-4xl mb-4" />
                <p className="text-center">
                  Start a conversation with your AI counselor.<br />
                  They're here to listen and support you.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-[#6d8ded] text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p>{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#6d8ded]"
              />
              <button
                type="submit"
                className="bg-[#6d8ded] text-white px-6 py-2 rounded-lg hover:bg-[#5a7ad9] transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaHistory className="text-2xl text-[#6d8ded] mb-4" />
            <h3 className="text-lg font-semibold mb-2">24/7 Availability</h3>
            <p className="text-gray-600">Access support anytime, anywhere.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaUserCircle className="text-2xl text-[#6d8ded] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Personalized Support</h3>
            <p className="text-gray-600">Tailored responses to your needs.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaComments className="text-2xl text-[#6d8ded] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Confidential Chat</h3>
            <p className="text-gray-600">Your privacy is our top priority.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICounselor; 