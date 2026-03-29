import React, { useState, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
import Navbar from "../components/navbar";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message;

    // ✅ show user message instantly
    setChat(prev => [...prev, { user: userMsg, bot: "..." }]);
    setMessage("");

    try {
      const res = await axios.get(
        `https://bank-backend-production-92f5.up.railway.app/chatbot/ask?query=${userMsg}`
      );

      // ✅ replace last bot "..." with actual response
      setChat(prev =>
        prev.map((c, i) =>
          i === prev.length - 1 ? { ...c, bot: res.data } : c
        )
      );

    } catch (err) {
      console.error(err);

      setChat(prev =>
        prev.map((c, i) =>
          i === prev.length - 1
            ? { ...c, bot: "Something went wrong ❌" }
            : c
        )
      );
    }

    // ✅ auto scroll
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // ✅ ENTER key support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div>
      <Header />
      <Navbar />

      <div className="card chatbot-card">
        <h2>🤖 Chatbot</h2>

        {/* Chat Area */}
        <div className="chat-box">
          {chat.map((c, i) => (
            <div key={i}>
              
              {/* User Message */}
              <div className="chat-row user">
                <div className="chat-bubble user-bubble">
                  {c.user}
                </div>
              </div>

              {/* Bot Message */}
              <div className="chat-row bot">
                <div className="chat-bubble bot-bubble">
                  {c.bot}
                </div>
              </div>

            </div>
          ))}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />

          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;