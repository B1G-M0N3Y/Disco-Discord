import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
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
import { useSocket } from "../../context/SocketContext";
import ChannelMessage from "./ChannelMessage";

const ChannelMessagesPage = () => {
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState();
  const [validationErrors, setValidationErrors] = useState([]);
  const user = useSelector((state) => state.session.user);
  const messageStore = useSelector((state) => state.channelMessages.messages);
  const { selectedServer, setSelectedServer } = useSelectedServer();
  const { selectedChannel } = useSelectedChannels();
  const { channelId, serverId } = useParams();
  const { socket } = useSocket();

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
              <ChannelMessage message={message} />
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
