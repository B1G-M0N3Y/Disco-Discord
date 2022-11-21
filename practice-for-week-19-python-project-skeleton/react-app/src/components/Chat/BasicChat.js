import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

let socket;

const BasicChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    socket = io();

    socket.on("chat", (chat) => {
      setAllMessages((messages) => [...messages, chat]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newMessage) {
      return;
    }
    const payload = { user: user.username, body: newMessage };
    socket.emit("chat", payload);
    setNewMessage("");
  };

  return (
    <>
      <div className="message-section">
        {allMessages.map((message) => (
          <div className="message">
            <p className="username-message">{message.user}</p>
            <p className="message-body">{message.body}</p>
          </div>
        ))}
      </div>
      <form className="message-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type here..."
          autoComplete="off"
        />
        <button type="submit" className="button" onClick={handleSubmit}>
          SEND
        </button>
      </form>
    </>
  );
};

export default BasicChat;
