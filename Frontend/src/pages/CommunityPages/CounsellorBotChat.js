import React, { useState } from 'react';

export default function CounsellorBotChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const prompt = `You are CounsellorGPT, a compassionate and supportive mental health chatbot. Your purpose is to help users explore their feelings, thoughts, and challenges in a safe and confidential space. 

      Please respond to the following user message in plain text, without any formatting or special characters. Focus on providing a clear and concise response that promotes emotional well-being and mental health:
      
      User: ${input}`;      


      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyATesepFKDuKiy3erERfUg2FqsSYOWEn9A', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt 
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const botMessageText = data.candidates[0].content.parts[0].text;
      const botMessage = { sender: 'bot', text: botMessageText };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (error) {
      console.error('Error communicating with the API:', error);

      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setInput('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatContainer}>
        <h2 style={styles.header}>CounsellorGPT</h2> 
        <div style={styles.chatBox}>
          {messages.map((msg, index) => (
            <div key={index} style={{ ...styles.messageContainer, justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <p style={{
                ...styles.message,
                backgroundColor: msg.sender === 'user' ? '#dcf8c6' : '#f1f0f0',
              }}>
                {msg.text}
              </p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7',
    padding: '20px',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '900px', 
    height: '85vh', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '20px',
  },
  chatBox: {
    flexGrow: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    backgroundColor: '#fafafa',
    marginBottom: '20px', 
  },
  message: {
    padding: '12px 18px', 
    borderRadius: '20px',
    maxWidth: '75%',
    marginBottom: '10px',
    fontSize: '16px', 
    lineHeight: '1.5',
    wordWrap: 'break-word',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    padding: '10px 0', 
  },
  input: {
    flexGrow: 1,
    padding: '15px', 
    borderRadius: '30px', 
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  button: {
    padding: '10px 30px', 
    borderRadius: '30px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

