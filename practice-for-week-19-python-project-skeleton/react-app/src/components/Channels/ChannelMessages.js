import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { getChannelMessages } from "../../store/channel_messages";
import './ChannelMessages.css'

let socket;

const ChannelMessagesPage = () => {
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const user = useSelector((state) => state.session.user);
  const messageStore = useSelector((state) => state.channelMessages.messages);
  const { channelId } = useParams();

  useEffect(() => {
    //   setAllMessages([...Object.values(messageStore)]);
    dispatch(getChannelMessages(channelId));

    //   console.log("in use effect", allMessages)
  }, [dispatch]);

  useEffect(() => {
    console.log("use effecting");

    socket = io();

    socket.on("chat", (chat) => {
      setAllMessages((messages) => [...messages, chat]);
    });

    return () => {
      socket.disconnect();
    };
  }, [channelId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newMessage) {
      return;
    }
    const payload = { user: user.username, body: newMessage };
    socket.emit("chat", payload);
    setNewMessage("");
  };

  console.log("fart", allMessages);

  return (
    <>
      <div className="message-section">
        {Object.values(messageStore).map((message) => (
          <div className="message">
            {/* TODO: ADD USER IMAGE */}
            {/* TODO: ADD DELETE BUTTON IF OWNER */}
            {/* TODO: ADD DYNAMIC USERNAME */}
            <p className="username-message">{message.user}</p>
            <p className="message-body">{message.body}</p>
          </div>
        ))}
        {console.log("fart", allMessages)}
        {allMessages?.map((message) => (
          <div className="message">
            {/* TODO: ADD USER IMAGE */}
            {/* TODO: ADD DELETE BUTTON IF OWNER */}
            {/* TODO: ADD DYNAMIC USERNAME */}
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

export default ChannelMessagesPage;
