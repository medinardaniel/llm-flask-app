import './App.css';
import React, { useState } from 'react';

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const sendMessage = () => {
    const message = userInput.trim();
    if (!message) return;

    setConversation(conversation => [...conversation, { sender: 'user', text: message }]);
    setUserInput('');
    setIsLoading(true); // Set loading state to true

    fetch("http://127.0.0.1:5000/chat", { 
      method: "POST", 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ message })
    })
    .then(response => response.json())
    .then(data => {
      setConversation(conversation => [...conversation, { sender: 'bot', text: data.reply }]);
      setIsLoading(false); // Set loading state to false
    })
    .catch(error => {
      console.error('Error:', error);
      setConversation(conversation => [...conversation, { sender: 'bot', text: 'Error getting response.' }]);
      setIsLoading(false); // Set loading state to false
    });
  };

  return (
    <div className="App">
      <h1>Daniel's Chatbot</h1>
      <input 
        className='Form-style'
        value={userInput} 
        onChange={handleInputChange}
        placeholder="Ask me about my professional background..."
      />
      <button onClick={sendMessage}>
        Send
      </button>
      <div className="chat-window">
        {conversation.map((msg, index) => (
          <p key={index} className={msg.sender === 'user' ? 'user' : 'chatbot'}>
            {msg.text}
          </p>
        ))}
        {isLoading && <div className="loading-indicator">Thinking...</div>} {/* Render loading indicator */}
      </div>
    </div>
  );
};

export default App;
