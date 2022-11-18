import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { io } from "socket.io-client";
import { getServers } from "../../store/servers";
import {
  deleteChannelMessage,
  getChannelMessages,
  newChannelMessage,
  addMessage,
} from "../../store/channel_messages";
import { useSelectedChannels } from "../../context/ChannelContext";
import "./ChannelMessages.css";

let socket;

const ChannelMessagesPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const user = useSelector((state) => state.session.user);
  const messageStore = useSelector((state) => state.channelMessages.messages);
  const { selectedChannel, setSelectedChannel } = useSelectedChannels();
  useEffect(() => {
    //   setAllMessages([...Object.values(messageStore)]);
    dispatch(getChannelMessages(selectedChannel.id));
  }, [dispatch, selectedChannel]);

  // when leaving the page...
  useEffect(() => {
    return () => {
      dispatch(getChannelMessages(selectedChannel.id));
      dispatch(getServers());
    };
  }, [dispatch]);

  useEffect(() => {
    socket = io();

    // const channelNameSpace = socket.("/channel");

    // channelNameSpace.on("connect", () => {
    //   console.log("**CHANNEL NAMESPACE CONNECTED");
    // });

    socket.on("chat", (chat) => {
      setAllMessages((messages) => [...messages, chat]);
    });

    socket.on("channelmessage", (message) => {
      console.log(message, "HERES THE CHANNEL MESSAGE");
      dispatch(addMessage(message));
      dispatch(getChannelMessages(selectedChannel.id));
    });

    socket.on("connect", () => {
      console.log("**CONNECTED");
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedChannel.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMessage) {
      return;
    }
    // const liveMsg = { user: user.username, body: newMessage };
    const dbMsg = {
      user_id: user.id,
      channel_id: selectedChannel.id,
      body: newMessage,
    };
    const response = await dispatch(
      newChannelMessage(selectedChannel.id, dbMsg)
    );
    dispatch(addMessage(response));
    dispatch(getChannelMessages(selectedChannel.id));
    socket.emit("channelmessage", response);

    setNewMessage("");
    return history.push("/servers");
  };

  return (
    <>
      {/* TODO: REFACTOR TO SINGLE MAP */}
      {/* CURRENT IMPLEMENTATION JUST BARE BONES FOR TESTING */}
      {/* AND SETTING UP THE CREATE THUNK */}
      {messageStore ? (
        // console.log(messages, "messages in map")
        <div className="message-section">
          <div className="all-messages">
            {Object.values(messageStore).map((message) => (
              <div className="message">
                {/* TODO: ADD DELETE BUTTON IF OWNER */}
                <img
                  alt={message.id}
                  src={message.message_author.image_url}
                  className="author-message-image"
                ></img>
                <div className="message-text">
                  <p className="username-message">
                    {message.message_author.username}
                  </p>
                  <p className="message-body">{message.body}</p>
                </div>
                {message?.user_id === user?.id && (
                  <i
                    className="fa-regular fa-trash-can"
                    onClick={async () => {
                      await dispatch(deleteChannelMessage(message?.id));
                      dispatch(getChannelMessages(selectedChannel.id));
                      return history.push(`/servers`);
                    }}
                  ></i>
                )}
              </div>
            ))}
            {allMessages?.map((message) => (
              <div className="message">
                {/* TODO: ADD DELETE BUTTON IF OWNER */}
                <img className="message-image"></img>
                <div className="message-text">
                  <p className="username-message">{message.user}</p>
                  <p className="message-body">{message.body}</p>
                </div>
                {message?.user_id === user?.id && (
                  <i
                    className="fa-regular fa-trash-can"
                    onClick={async () => {
                      await dispatch(deleteChannelMessage(message?.id));
                      dispatch(getChannelMessages(selectedChannel.id));
                      return history.push(`/servers`);
                    }}
                  ></i>
                )}
              </div>
            ))}
          </div>
          <form className="message-input-form" onSubmit={handleSubmit}>
            <input
              className="message-input"
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type here..."
              autoComplete="off"
            />
            <button
              type="submit"
              className="message-button"
              onClick={handleSubmit}
            >
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      ) : (
        <div>No Chats To Display</div>
      )}
    </>
  );
};

export default ChannelMessagesPage;
