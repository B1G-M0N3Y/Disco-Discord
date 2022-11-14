import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChatMessages from "./ChatMessage";

function ChatForm({ chat }) {
  const dispatch = useDispatch();
  const [text, setText] = useState();

  //TODO SET THIS UP AS CONTEXT & REMOVE HARDCODED
  const chat_id = 2;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(text, "submitted");
    const body = JSON.stringify({ body: text });
    console.log(body, "body");
    const response = await fetch(`/api/chat/${chat_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    });
    const responseData = await response.json();
    console.log(responseData, "chatform response");
  };

  return (
    <>
      <div className="message-history">
        {/* TODO ADD TERNARY WITH USESTATE VARIABLE IF CHANNEL MESSAGE OR PRIVATE MESSAGE */}
        <ChatMessages chat_id={chat_id} />
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
