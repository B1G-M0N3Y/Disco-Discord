import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

function ChatMessages({ chat, chat_id }) {
  const dispatch = useDispatch();

  // getters and setters
  const [messages, setMessages] = useState([]);

  // fetch chats
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/chat/${chat ? chat.id : chat_id}`);
      const responseData = await response.json();
      setMessages(responseData);
      console.log(messages, "messages");
    }
    fetchData();
  }, []);

  return (
    <>
      <ul>
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <li className="chat-message">
              <div>
                <img
                  src={message.author.username}
                  alt={`${message.author.username} chat pic`}
                ></img>
              </div>
              <div>{message.author.username}</div>
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
