import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ChatMessages({ chat, chat_id }) {
  console.log(chat_id, typeof chat_id, "chat id");
  const messages = useSelector(
    (state) => state.chats[chat_id]["chat_messages"]
  );

  return (
    <>
      <ul>
        {/* TODO ADD TERNARY FOR TO SELECT A CHAT TO LOAD MESSAGES */}
        {messages && messages.length > 0 ? (
          messages.map((message, idx) => (
            <li className="chat-message" key={idx}>
              <div>
                <img
                  src={message?.author.username}
                  alt={`${message?.author.username} chat pic`}
                ></img>
              </div>
              <div>{message?.author.username}</div>
              <div>{message.createdAt}</div>
              <div>{message.body}</div>
            </li>
          ))
        ) : (
          <div>No Messages Found</div>
        )}
      </ul>
    </>
  );
}

export default ChatMessages;
