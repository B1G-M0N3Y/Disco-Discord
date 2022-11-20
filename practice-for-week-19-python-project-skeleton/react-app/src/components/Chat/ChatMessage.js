import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ChatMessages({ chat_id }) {
  console.log(chat_id, typeof chat_id, "chat id");
  const messages = useSelector(
    (state) => chat_id && state.chats[chat_id]?.chat_messages
  );

  console.log("da messages", messages);

  return (
    <>
      {/* TODO ADD TERNARY FOR TO SELECT A CHAT TO LOAD MESSAGES */}
      {messages && messages.length > 0 ? (
        messages.map((message, idx) => (
          <div className="message" key={idx}>
            <img
              className="chat-message-image"
              src={message?.author.image_url}
              alt={`${message?.author.username} chat pic`}
            ></img>
            <div className="message-text">
              <p className="username-message">{message?.author.username}</p>
              <p>{message.createdAt}</p>
              <p className="message-body">{message.body}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="no-chat-messages">
          No Messages Found <br /> Send A Groovy Message Below!
        </div>
      )}
    </>
  );
}

export default ChatMessages;
