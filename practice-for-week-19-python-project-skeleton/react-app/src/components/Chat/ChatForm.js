import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ChatMessages from "./ChatMessage";
import { getChat, newChatMessage, addChatMessage } from "../../store/chat";
import { io } from "socket.io-client";
import { useSelectedChat } from "../../context/ChatContext";
import { useParams } from "react-router-dom";

let socket;

function ChatForm() {
  const dispatch = useDispatch();
  const [text, setText] = useState();
  const { selectedChat } = useSelectedChat();
  const { chatId } = useParams();

  useEffect(() => {
    //   TODO SETUP THIS REDUX
    dispatch(getChat());
  }, [dispatch, chatId]);

  useEffect(() => {
    socket = io();

    socket.on("connect", () => {
      console.log("***CONNECTED TO WEB SOCKET");
      // socket.emit("join", { chat_id: chat.id });
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
      // TODO SEND DATA TO REDUX optional
      //THIS IS BEING HANDLED BY REDUX THUNK
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedChat, dispatch]);
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
    <div className="message-history">
      <div className="message-section">
        {/* TODO ADD TERNARY WITH USESTATE VARIABLE IF CHANNEL MESSAGE OR PRIVATE MESSAGE */}

        <ChatMessages className="message-section" chat_id={chatId} />
      </div>
      {/* <form onSubmit={handleSubmit}>
        <input
        name="type-here"
          onChange={(e) => {
            setText(e.target.value);
          }}
          ></input>
          <input type="submit" value=">"></input>
        </form> */}
      <form className="message-input-form" onSubmit={handleSubmit}>
        <input
          className="message-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type here..."
          autoComplete="off"
        />
        <button type="submit" className="message-button" onClick={handleSubmit}>
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}

export default ChatForm;
