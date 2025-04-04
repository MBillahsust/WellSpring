import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaPaperPlane, FaPlus, FaTrash, FaChevronDown, FaChevronUp, FaCalendarAlt, FaHistory } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AICounselor = () => {
  // State for assessments
  const [assessments, setAssessments] = useState([
    { id: 1, name: 'Depression Screening', date: '2023-05-15', selected: false },
    { id: 2, name: 'Anxiety Assessment', date: '2023-06-20', selected: false },
    { id: 3, name: 'Stress Level Test', date: '2023-07-10', selected: false },
    { id: 4, name: 'Sleep Quality Survey', date: '2023-08-05', selected: false },
    { id: 5, name: 'Mood Tracking Analysis', date: '2023-09-12', selected: false },
  ]);

  // State for mood tracking
  const [moodData, setMoodData] = useState([
    { id: 1, date: '2023-09-15', mood: 'Happy', score: 8, notes: 'Had a great day at work' },
    { id: 2, date: '2023-09-14', mood: 'Calm', score: 7, notes: 'Meditation helped a lot' },
    { id: 3, date: '2023-09-13', mood: 'Anxious', score: 4, notes: 'Stressed about upcoming deadline' },
    { id: 4, date: '2023-09-12', mood: 'Sad', score: 3, notes: 'Missing family' },
    { id: 5, date: '2023-09-11', mood: 'Neutral', score: 5, notes: 'Regular day' },
    { id: 6, date: '2023-09-10', mood: 'Happy', score: 8, notes: 'Spent time with friends' },
    { id: 7, date: '2023-09-09', mood: 'Calm', score: 7, notes: 'Weekend relaxation' },
  ]);

  // State for chat
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I\'m your AI counselor. How can I help you today?' },
    { id: 2, sender: 'user', text: 'Hi! I\'d like to discuss my recent depression screening results.' },
    { id: 3, sender: 'ai', text: 'I\'d be happy to help you with that. I see you have a depression screening from May 15th. Would you like to discuss the specific results?' },
    { id: 4, sender: 'user', text: 'Yes, I scored moderate on the screening and I\'m feeling a bit overwhelmed.' },
    { id: 5, sender: 'ai', text: 'I understand that can be challenging. Moderate scores on depression screenings often indicate that you might benefit from some support. Have you been experiencing any specific symptoms lately?' },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [expandedMood, setExpandedMood] = useState(false);
  const chatEndRef = useRef(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatHistories, setChatHistories] = useState([
    { 
      id: 1, 
      title: 'Depression Discussion', 
      date: '2023-09-10',
      messages: [
        { id: 1, sender: 'ai', text: 'Hello! How are you feeling today?' },
        { id: 2, sender: 'user', text: 'I\'ve been feeling down lately.' },
        { id: 3, sender: 'ai', text: 'I\'m sorry to hear that. Can you tell me more about what\'s been contributing to these feelings?' },
        { id: 4, sender: 'user', text: 'Work has been stressful and I\'m having trouble sleeping.' },
        { id: 5, sender: 'ai', text: 'Sleep issues can definitely impact mood. Have you tried any relaxation techniques before bed?' }
      ]
    },
    { 
      id: 2, 
      title: 'Anxiety Management', 
      date: '2023-09-05',
      messages: [
        { id: 1, sender: 'ai', text: 'Hello! What brings you here today?' },
        { id: 2, sender: 'user', text: 'I\'ve been feeling anxious about an upcoming presentation.' },
        { id: 3, sender: 'ai', text: 'Public speaking can be challenging for many people. What specific aspects of the presentation are causing you the most anxiety?' },
        { id: 4, sender: 'user', text: 'I\'m worried about making mistakes or freezing up.' },
        { id: 5, sender: 'ai', text: 'Those are common concerns. Would you like to practice some breathing exercises that can help during your presentation?' }
      ]
    },
    { 
      id: 3, 
      title: 'Stress Relief Session', 
      date: '2023-08-28',
      messages: [
        { id: 1, sender: 'ai', text: 'Hi there! How can I assist you today?' },
        { id: 2, sender: 'user', text: 'I\'m feeling overwhelmed with all my responsibilities.' },
        { id: 3, sender: 'ai', text: 'That sounds challenging. Sometimes breaking things down can help. Would you like to discuss what\'s on your plate?' },
        { id: 4, sender: 'user', text: 'Yes, I have work deadlines, family obligations, and personal projects all competing for my time.' },
        { id: 5, sender: 'ai', text: 'That\'s a lot to manage. Let\'s explore some time management strategies that might help you feel more in control.' }
      ]
    }
  ]);

  // Toggle assessment selection
  const toggleAssessment = (id) => {
    setAssessments(assessments.map(assessment => 
      assessment.id === id ? { ...assessment, selected: !assessment.selected } : assessment
    ));
  };

  // Toggle mood table expansion
  const toggleMoodExpansion = () => {
    setExpandedMood(!expandedMood);
  };

  // Toggle chat history
  const toggleChatHistory = () => {
    setShowChatHistory(!showChatHistory);
  };

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: newMessage
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        text: 'Thank you for sharing that. I\'m here to support you. Would you like to discuss specific coping strategies or explore your feelings further?'
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 1000);
  };

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history
  const loadChatHistory = (id) => {
    // Implementation of loadChatHistory function
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 p-4">
            <h1 className="text-2xl font-bold text-white text-center">AI Counselor</h1>
            <p className="text-white/80 text-center">Your personal mental health assistant</p>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left side - Assessments */}
            <div className="w-full md:w-1/4 p-4 bg-blue-50">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Assessments</h3>
                <p className="text-sm text-gray-600 mb-4">Select assessments to discuss with your AI counselor</p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                    <thead className="bg-blue-100">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Select</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Assessment</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {assessments.map((assessment) => (
                        <tr key={assessment.id} className="hover:bg-gray-50">
                          <td className="py-2 px-3">
                            <input
                              type="checkbox"
                              checked={assessment.selected}
                              onChange={() => toggleAssessment(assessment.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="py-2 px-3 text-sm text-gray-700">{assessment.name}</td>
                          <td className="py-2 px-3 text-sm text-gray-500">{assessment.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Selected Assessments</h4>
                <div className="text-xs text-gray-600">
                  {assessments.filter(a => a.selected).length > 0 ? (
                    <ul className="space-y-1">
                      {assessments.filter(a => a.selected).map(assessment => (
                        <li key={assessment.id} className="flex items-center">
                          <span className="mr-2">•</span> {assessment.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No assessments selected</p>
                  )}
                </div>
              </div>
            </div>

            {/* Center - AI Chat */}
            <div className="w-full md:w-3/5 p-4">
              <div className="flex flex-col h-[700px] bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={toggleChatHistory}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                        title="View Chat History"
                      >
                        <FaHistory size={16} />
                      </button>
                      <div className="flex items-center">
                        <FaRobot className="text-white mr-2" size={20} />
                        <h3 className="text-lg font-semibold text-white whitespace-nowrap">AI Counselor Chat</h3>
                      </div>
                    </div>
                    <div className="text-xs text-white/80">
                      {showChatHistory ? "Select a conversation" : "Active session"}
                    </div>
                  </div>
                </div>
                
                {showChatHistory ? (
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Previous Conversations</h4>
                    <div className="space-y-3">
                      {chatHistories.map((history) => (
                        <div 
                          key={history.id} 
                          className="p-3 bg-white rounded-lg shadow-sm hover:bg-blue-50 cursor-pointer transition-colors border border-gray-100"
                          onClick={() => loadChatHistory(history.id)}
                        >
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium text-gray-800">{history.title}</h5>
                            <span className="text-xs text-gray-500">{history.date}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {history.messages[history.messages.length - 1].text.substring(0, 60)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === 'user' 
                              ? 'bg-blue-600 text-white rounded-br-none shadow-sm' 
                              : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                )}
                
                <div className="bg-white p-3 border-t border-gray-200">
                  <form onSubmit={sendMessage} className="flex items-center">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center"
                      style={{ width: '48px' }}
                    >
                      <FaPaperPlane size={14} />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right side - Mood Tracking & Routine */}
            <div className="w-full md:w-1/4 p-4 bg-blue-50">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-blue-900">Mood Tracking</h3>
                  <button 
                    onClick={toggleMoodExpansion}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {expandedMood ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                    <thead className="bg-blue-100">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Date</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Mood</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {expandedMood 
                        ? moodData.map((mood) => (
                            <tr key={mood.id} className="hover:bg-gray-50">
                              <td className="py-2 px-3 text-sm text-gray-700">{mood.date}</td>
                              <td className="py-2 px-3 text-sm text-gray-700">{mood.mood}</td>
                              <td className="py-2 px-3 text-sm text-gray-700">{mood.score}/10</td>
                            </tr>
                          ))
                        : moodData.slice(0, 3).map((mood) => (
                            <tr key={mood.id} className="hover:bg-gray-50">
                              <td className="py-2 px-3 text-sm text-gray-700">{mood.date}</td>
                              <td className="py-2 px-3 text-sm text-gray-700">{mood.mood}</td>
                              <td className="py-2 px-3 text-sm text-gray-700">{mood.score}/10</td>
                            </tr>
                          ))
                      }
                    </tbody>
                  </table>
                </div>
                
                {!expandedMood && moodData.length > 3 && (
                  <p className="text-xs text-blue-600 text-center mt-2">
                    Click to see more mood history
                  </p>
                )}
              </div>
              
              <div className="mt-6">
                <Link 
                  to="/routine" 
                  className="w-full flex items-center justify-center bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaCalendarAlt className="mr-2" />
                  Create Routine
                </Link>
                <p className="text-xs text-gray-600 text-center mt-2">
                  Get personalized routine based on your assessments and mood
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICounselor; 