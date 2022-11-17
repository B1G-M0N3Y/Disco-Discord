import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChatMessages from "./ChatMessage";
import { useSelectedChat } from "../../context/ChatContext";

function IndividualChat({ chat, setChat }) {
  const dispatch = useDispatch();

  // getters and setters
  const [chats, setChats] = useState([]);

  const { setSelectedChat } = useSelectedChat()

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
      <li
        id={chat.id}
        onClick={() => {
          console.log(chat.id)
          setSelectedChat(chat.id)}}
      >
        {chat.name}
        {chat.chat_members?.map((member) => (
          <div>{member.username}</div>
        ))}
      </li>
    </>
  );
}

export default IndividualChat;
