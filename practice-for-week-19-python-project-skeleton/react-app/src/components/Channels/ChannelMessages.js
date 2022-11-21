import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
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
import { useSelectedServer } from "../../context/ServerContext";

let socket;

const ChannelMessagesPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [newMessage, setNewMessage] = useState();
  const [allMessages, setAllMessages] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const user = useSelector((state) => state.session.user);
  const messageStore = useSelector((state) => state.channelMessages.messages);
  const { selectedServer, setSelectedServer } = useSelectedServer();
  const { selectedChannel } = useSelectedChannels();
  const { channelId, serverId } = useParams();

  useEffect(() => {
    //   setAllMessages([...Object.values(messageStore)]);
    dispatch(getChannelMessages(channelId));
    setSelectedServer(serverId);
  }, [dispatch, selectedChannel]);

  // when leaving the page...
  useEffect(() => {
    return () => {
      dispatch(getChannelMessages(channelId));
      dispatch(getServers());
    };
  }, [dispatch]);

  useEffect(() => {
    socket = io();

    socket.on("chat", (chat) => {
      setAllMessages((messages) => [...messages, chat]);
    });

    socket.on("channelmessage", (message) => {
      dispatch(addMessage(message));
      dispatch(getChannelMessages(channelId));
    });

    socket.on("connect", () => {
      console.log("**CONNECTED");
    });

    return () => {
      socket.disconnect();
    };
  }, [channelId]);

  // error validations
  useEffect(() => {
    let errors = [];
    setValidationErrors(errors);
    if (!newMessage) errors.push("Please enter a message body.");
    setValidationErrors(errors);
  }, [newMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMessage) {
      return;
    }
    // const liveMsg = { user: user.username, body: newMessage };
    const dbMsg = {
      user_id: user.id,
      channel_id: channelId,
      body: newMessage,
    };
    const response = await dispatch(newChannelMessage(channelId, dbMsg));
    dispatch(addMessage(response));
    dispatch(getChannelMessages(channelId));
    socket.emit("channelmessage", response);
    setNewMessage("");
  };

  return (
    <>
      {messageStore ? (
        <div className="message-section">
          <div className="all-messages">
            {Object.values(messageStore).map((message) => (
              <div className="message">
                <div className="inner-message">
                  {/* <div className="flex-row-center"> */}
                  {message.message_author.image_url ? (
                    <img
                      alt={message.id}
                      src={message.message_author.image_url}
                      className="author-message-image"
                    ></img>
                  ) : (
                    <div className="author-message-image default-image">
                      {message.message_author.username[0].toUpperCase()}
                    </div>
                  )}
                  <div className="message-text">
                    <p className="username-message">
                      {message.message_author.username}
                    </p>
                    <p className="message-body">{message.body}</p>
                    {/* </div> */}
                  </div>
                  <div className="flex-row-end trash">
                    {message?.user_id === user?.id && (
                      <i
                        className="fa-regular fa-trash-can"
                        onClick={async () => {
                          await dispatch(deleteChannelMessage(message?.id));
                          dispatch(getChannelMessages(channelId));
                          return history.push(
                            `/servers/${serverId}/channels/${channelId}`
                          );
                        }}
                      ></i>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {allMessages?.map((message) => (
              <div className="message">
                <div className="message-text">
                  <p className="username-message">{message.user}</p>
                  <p className="message-body">{message.body}</p>
                </div>
                <div>
                  {message?.user_id === user?.id && (
                    <i
                      className="fa-regular fa-trash-can"
                      onClick={async () => {
                        await dispatch(deleteChannelMessage(message?.id));
                        dispatch(getChannelMessages(channelId));
                        return history.push(`/servers`);
                      }}
                    ></i>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="form-wrapper">
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
                className={
                  validationErrors.length > 0
                    ? "disabled-message"
                    : "message-button"
                }
                onClick={handleSubmit}
                disabled={!!validationErrors.length}
              >
                {validationErrors.length > 0 && (
                  <i class="fa-solid fa-paper-plane disabled-plane"></i>
                )}
                {validationErrors.length === 0 && (
                  <i class="fa-solid fa-paper-plane"></i>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div>No Chats To Display</div>
      )}
    </>
  );
};

export default ChannelMessagesPage;
