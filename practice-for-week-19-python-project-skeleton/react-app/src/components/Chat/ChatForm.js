import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ChatMessages from "./ChatMessage";
import { getChat, newChatMessage, addChatMessage } from "../../store/chat";
import { io } from "socket.io-client";
import { useSelectedChat } from "../../context/ChatContext";
import { useParams } from "react-router-dom";

let socket;

function ChatForm() {
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const [text, setText] = useState();
  const { selectedChat } = useSelectedChat();
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    dispatch(getChat());
  }, [dispatch, chatId]);

  useEffect(() => {
    setText("");
  }, [chatId]);

  useEffect(() => {
    socket = io();

    socket.on("connect", () => {
      console.log("***CONNECTED TO WEB SOCKET");
    });

    socket.on("join", (data) => {
      console.log("JOIN ROOM ***");
      console.log(data);
    });

    socket.on("newmessage", (data) => {
      console.log(data, typeof data, "INCOMING MESSAGE****");
      dispatch(addChatMessage(data));
      dispatch(getChat());
    });

    socket.on("initialize", (data) => {
      console.log("initialized data", data);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedChat, dispatch]);

  // error validations
  useEffect(() => {
    let errors = [];
    setValidationErrors(errors);
    if (!text) errors.push("Please enter a message body.");
    setValidationErrors(errors);
  }, [text]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.length === 0) return;
    const message = { body: text, chat_id: chatId };
    console.log(message, "message");
    const response = await dispatch(newChatMessage(message));
    console.log(response, "fetch response");
    socket.emit("newmessage", response);
    setText("");
  };

  return (
    // <div className="message-history">
    <div className="message-section">
      <div className="all-messages">
        {/* TODO ADD TERNARY WITH USESTATE VARIABLE IF CHANNEL MESSAGE OR PRIVATE MESSAGE */}

        <ChatMessages chat_id={chatId} />
      </div>
      <div className="form-wrapper">
        <form className="message-input-form" onSubmit={handleSubmit}>
          <input
            className="message-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
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
  );
}

export default ChatForm;
