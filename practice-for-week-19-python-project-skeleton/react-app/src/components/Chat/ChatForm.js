import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChatMessages from "./ChatMessage";
import { io } from "socket.io-client";

let socket;

function ChatForm({ chat }) {
  const dispatch = useDispatch();
  const [text, setText] = useState();

  //TODO SET THIS UP AS CONTEXT & REMOVE HARDCODED

  useEffect(() => {
    socket = io();

    socket.on("connect", () => {
      console.log("***CONNECTED TO WEB SOCKET");
      socket.emit("join", { chat_id: chat.id });
    });

    socket.on("join", (data) => {
      console.log("JOIN ROOM ***");
      console.log(data);
    });

    socket.on("privatechat", (data) => {
      console.log(data, "INCOMING MESSAGE****");
    });

    return () => {
      socket.disconnect();
    };
  }, [chat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = JSON.stringify({ body: text, chat_id: chat.id });
    const response = await fetch(`/api/chat/${chat?.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    });
    const responseData = await response.json();
    socket.emit("privatechat", body);
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
