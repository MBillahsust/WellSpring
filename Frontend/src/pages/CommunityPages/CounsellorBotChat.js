// import React, { useState, useEffect, useRef } from 'react';
// import {
//   FaMicrophone,
//   FaMicrophoneSlash,
//   FaPaperPlane,
// } from 'react-icons/fa';

// export default function CounsellorBotChat() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.continuous = false;

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setInput(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Speech recognition error:', event.error);
//       setIsListening(false);
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//     };

//     recognitionRef.current = recognition;
//   }, []);

//   const sendMessage = async (text) => {
//     if (!text.trim() || isLoading) return;

//     const userMessage = { sender: 'user', text };
//     setMessages((prev) => [...prev, userMessage]);
//     setIsLoading(true);

//     try {
//       const systemPrompt = `You are CounsellorGPT, a kind, thoughtful and compassionate AI counselor who supports emotional well-being and mental health. Respond simply, clearly, and empathetically.`;

//       const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: 'llama-3.3-70b-versatile',
//           messages: [
//             { role: 'system', content: systemPrompt },
//             { role: 'user', content: text },
//           ],
//         }),
//       });

//       const data = await response.json();
//       const botReply = data.choices?.[0]?.message?.content || "I'm here for you.";
//       setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
//     } catch (error) {
//       console.error('Error from Groq:', error);
//       setMessages((prev) => [
//         ...prev,
//         { sender: 'bot', text: 'Sorry, something went wrong. Please try again shortly.' },
//       ]);
//     } finally {
//       setIsLoading(false);
//       setInput('');
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (isListening) stopListening(); // stop before sending
//     await sendMessage(input);
//   };

//   const toggleListening = () => {
//     const recognition = recognitionRef.current;
//     if (!recognition || isLoading) return;

//     if (isListening) {
//       recognition.stop();
//     } else {
//       setInput('');
//       recognition.start();
//     }

//     setIsListening(!isListening);
//   };

//   const stopListening = () => {
//     const recognition = recognitionRef.current;
//     if (recognition) {
//       recognition.stop();
//       setIsListening(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.chatContainer}>
//         <h2 style={styles.header}>🧠 CounsellorGPT</h2>
//         <div style={styles.chatBox}>
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               style={{
//                 ...styles.messageRow,
//                 justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
//               }}
//             >
//               <div
//                 style={{
//                   ...styles.message,
//                   backgroundColor: msg.sender === 'user' ? '#007bff' : '#e6e6e6',
//                   color: msg.sender === 'user' ? '#fff' : '#000',
//                 }}
//               >
//                 {msg.text}
//               </div>
//             </div>
//           ))}
//           {isListening && (
//             <div style={{ textAlign: 'center', color: 'red', marginTop: 8 }}>
//               ● Recording voice...
//             </div>
//           )}
//         </div>

//         <form onSubmit={handleSubmit} style={styles.inputRow}>
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder={isLoading ? 'Thinking...' : 'Type or speak...'}
//             style={styles.input}
//             disabled={isLoading}
//           />
//           <button
//             type="button"
//             onClick={toggleListening}
//             disabled={isLoading}
//             style={{
//               ...styles.iconButton,
//               backgroundColor: isListening ? '#dc3545' : '#28a745',
//             }}
//             title={isListening ? 'Stop Recording' : 'Start Recording'}
//           >
//             {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
//           </button>
//           <button
//             type="submit"
//             style={styles.iconButton}
//             disabled={isLoading}
//             title="Send"
//           >
//             <FaPaperPlane />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     background: '#f2f2f2',
//     height: '100vh',
//     padding: '20px',
//   },
//   chatContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     backgroundColor: '#fff',
//     borderRadius: '16px',
//     boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
//     width: '100%',
//     maxWidth: '700px',
//     height: '90vh',
//     overflow: 'hidden',
//   },
//   header: {
//     backgroundColor: '#007bff',
//     color: 'white',
//     padding: '16px',
//     fontSize: '22px',
//     textAlign: 'center',
//   },
//   chatBox: {
//     flex: 1,
//     padding: '16px',
//     overflowY: 'auto',
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   messageRow: {
//     display: 'flex',
//     marginBottom: '10px',
//   },
//   message: {
//     padding: '12px 18px',
//     borderRadius: '20px',
//     maxWidth: '70%',
//     wordBreak: 'break-word',
//     fontSize: '16px',
//     boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//   },
//   inputRow: {
//     display: 'flex',
//     padding: '16px',
//     borderTop: '1px solid #ddd',
//     gap: '10px',
//   },
//   input: {
//     flex: 1,
//     borderRadius: '30px',
//     border: '1px solid #ccc',
//     padding: '12px 16px',
//     fontSize: '16px',
//   },
//   iconButton: {
//     border: 'none',
//     borderRadius: '50%',
//     width: '44px',
//     height: '44px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '18px',
//     color: 'white',
//     cursor: 'pointer',
//   },
// };


import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPaperPlane,
} from 'react-icons/fa';

export default function CounsellorBotChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
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
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const systemPrompt = `You are CounsellorGPT, a kind, thoughtful and compassionate AI counselor who supports emotional well-being and mental health. Respond simply, clearly, and empathetically.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text },
          ],
        }),
      });

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content || "I'm here for you.";
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Error from Groq:', error);
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
    if (isListening) stopListening(); // stop before sending
    await sendMessage(input);
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition || isLoading) return;

    if (isListening) {
      recognition.stop();
    } else {
      setInput('');
      recognition.start();
    }

    setIsListening(!isListening);
  };

  const stopListening = () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatContainer}>
        <h2 style={styles.header}>🧠 CounsellorGPT</h2>
        <div style={styles.chatBox}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageRow,
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...styles.message,
                  backgroundColor: msg.sender === 'user' ? '#007bff' : '#e6e6e6',
                  color: msg.sender === 'user' ? '#fff' : '#000',
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isListening && (
            <div style={{ textAlign: 'center', color: 'red', marginTop: 8 }}>
              ● Recording voice...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={styles.inputRow}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? 'Thinking...' : 'Type or speak...'}
            style={styles.input}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={toggleListening}
            disabled={isLoading}
            style={{
              ...styles.iconButton,
              backgroundColor: isListening ? '#dc3545' : '#28a745',
            }}
            title={isListening ? 'Stop Recording' : 'Start Recording'}
          >
            {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          <button
            type="submit"
            style={styles.iconButton}
            disabled={isLoading}
            title="Send"
          >
            <FaPaperPlane />
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
    background: '#f2f2f2',
    height: '100vh',
    padding: '20px',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '700px',
    height: '90vh',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '16px',
    fontSize: '22px',
    textAlign: 'center',
  },
  chatBox: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  messageRow: {
    display: 'flex',
    marginBottom: '10px',
  },
  message: {
    padding: '12px 18px',
    borderRadius: '20px',
    maxWidth: '70%',
    wordBreak: 'break-word',
    fontSize: '16px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  inputRow: {
    display: 'flex',
    padding: '16px',
    borderTop: '1px solid #ddd',
    gap: '10px',
  },
  input: {
    flex: 1,
    borderRadius: '30px',
    border: '1px solid #ccc',
    padding: '12px 16px',
    fontSize: '16px',
  },
  iconButton: {
    border: 'none',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: 'white',
    cursor: 'pointer',
  },
};
