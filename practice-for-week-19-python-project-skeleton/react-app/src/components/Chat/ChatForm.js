import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChatMessages from "./ChatMessage";
import { getChat, newChatMessage } from "../../store/chat";
import { io } from "socket.io-client";

let socket;

function ChatForm({ chat }) {
  const dispatch = useDispatch();
  const [text, setText] = useState();

  useEffect(() => {
    //   TODO SETUP THIS REDUX
    dispatch(getChat());
  }, [dispatch]);

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
      console.log(data, "INCOMING MESSAGE****");
      //TODO SEND DATA TO REDUX AT APPEND TO CHATS->CHAT-> CHAT_MESSAGES
    });

    socket.on("initialize", (data) => {
      console.log("initialized data", data);
      // TODO SEND DATA TO REDUX optional
      //THIS IS BEING HANDLED BY REDUX THUNK
    });

    return () => {
      socket.disconnect();
    };
  }, [chat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = { body: text, chat_id: chat.id };
    const response = await dispatch(newChatMessage(message));
    dispatch(getChat());
    socket.emit("newmessage", response);
  };

  return (
    <>
      <div className="message-history">
        {/* TODO ADD TERNARY WITH USESTATE VARIABLE IF CHANNEL MESSAGE OR PRIVATE MESSAGE */}
        <ChatMessages chat_id={chat?.id} />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          name="type-here"
          onChange={(e) => {
            setText(e.target.value);
          }}
        ></input>
        <input type="submit" value=">"></input>
      </form>
    </>
  );
}

export default ChatForm;
