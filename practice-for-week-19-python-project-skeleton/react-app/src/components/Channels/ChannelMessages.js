import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { getChannelMessages, newChannelMessage } from "../../store/channel_messages";
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

  }, [dispatch]);

  useEffect(() => {

    socket = io();

    socket.on("chat", (chat) => {
      setAllMessages((messages) => [...messages, chat]);
    });

    return () => {
      socket.disconnect();
    };
  }, [channelId]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMessage) {
      return;
    }
    const liveMsg = { user: user.username, body: newMessage };
    const dbMsg = { user_id: user.id, channel_id:channelId, body: newMessage }


    socket.emit("chat", liveMsg);
    await dispatch(newChannelMessage(channelId, dbMsg))
    setNewMessage("");
  };

  return (
    <>
    {/* TODO: REFACTOR TO SINGLE MAP */}
    {/* CURRENT IMPLEMENTATION JUST BARE BONES FOR TESTING */}
    {/* AND SETTING UP THE CREATE THUNK */}
      <div className="message-section">
        {Object.values(messageStore).map((message) => (
          <div className="message">
            {/* TODO: ADD USER IMAGE */}
            {/* TODO: ADD DELETE BUTTON IF OWNER */}
            {/* TODO: ADD DYNAMIC USERNAME */}
            <p className="username-message">{message.author.username}</p>
            <p className="message-body">{message.body}</p>
          </div>
        ))}
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
