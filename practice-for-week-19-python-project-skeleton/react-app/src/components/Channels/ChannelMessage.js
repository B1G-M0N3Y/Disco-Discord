import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import {
  deleteChannelMessage,
  getChannelMessages,
} from "../../store/channel_messages";

import "./ChannelMessages.css";

const ChannelMessage = ({ message }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const { socket } = useSocket();

  const handleDelete = async () => {
    await dispatch(deleteChannelMessage(message?.id));
    dispatch(getChannelMessages(message["channel_id"]));
    const payload = {
      channel_id: message["channel_id"],
    };
    socket.emit("channelmessage", payload);
    return history.push(
      `/servers/${message?.serverId}/channels/${message["channel_id"]}`
    );
  };
  return (
    <>
      <div className="message">
        <div className="inner-message">
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
              <i className="fa-regular fa-trash-can" onClick={handleDelete}></i>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChannelMessage;
