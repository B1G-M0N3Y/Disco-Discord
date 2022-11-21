import React from "react";
import { useSelector } from "react-redux";

function ChatMessages({ chat_id }) {
  const messages = useSelector(
    (state) => chat_id && state.chats[chat_id]?.chat_messages
  );

  return (
    <>
      {/* TODO ADD TERNARY FOR TO SELECT A CHAT TO LOAD MESSAGES */}
      {messages && messages.length > 0 ? (
        messages.map((message, idx) => (
          <div className="message" key={idx}>
            <div className="inner-message">
              {/* <div className="flex-row-center"> */}
              <img
                className="author-message-image"
                src={message?.author.image_url}
                alt={`${message?.author.username} chat pic`}
              ></img>
              <div className="message-text">
                <div className="message-text-top">
                  <p className="username-message">{message?.author.username}</p>
                  <p className="message-date">{message.createdAt}</p>
                </div>
                <div className="message-body">{message.body}</div>
              </div>
              {/* </div> */}
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
