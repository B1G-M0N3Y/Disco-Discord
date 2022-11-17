import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChatMessages from "./ChatMessage";
import { useSelectedChat } from "../../context/ChatContext";

function IndividualChat({ chat, setChat }) {
  const dispatch = useDispatch();

  // getters and setters
  const [chats, setChats] = useState([]);

  const { setSelectedChat } = useSelectedChat();

  // fetch chats
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/chat/");
      const responseData = await response.json();
      setChats(responseData);
    }
    fetchData();
  }, []);

  return (
    <>
      <div
        id={chat.id}
        className="chat-nav"
        onClick={() => {
          console.log(chat.id);
          setSelectedChat(chat.id);
        }}
      >
        <p className="chat-nav-label">{chat.name}</p>
        <div className="chat-nav-members">
          {chat.chat_members?.map((member) => (
            <p className="chat-nav-member"> {member.username} </p>
          ))}
        </div>
      </div>
    </>
  );
}

export default IndividualChat;
