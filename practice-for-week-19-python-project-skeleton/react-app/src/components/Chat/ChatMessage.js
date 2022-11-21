import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteChatMessage, getChat } from "../../store/chat";

function ChatMessages({ chat_id }) {
  const messages = useSelector(
    (state) => chat_id && state.chats[chat_id]?.chat_messages
  );
  const chat = useSelector((state) => chat_id && state.chats[chat_id]);
  const dispatch = useDispatch();
  const handleDelete = async (chatMessageId) => {
    await dispatch(deleteChatMessage(chatMessageId, chat_id));
    await dispatch(getChat());
  };
  const currentUser = useSelector((state) => state.session.user);

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
                {currentUser.id === message.author_id && (
                  <i
                    className="fa-regular fa-trash-can"
                    onClick={() => handleDelete(message.id)}
                  ></i>
                )}
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
