import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChatMessages from "./ChatMessage";

function IndividualChat({ chat }) {
  const dispatch = useDispatch();

  // getters and setters
  const [chats, setChats] = useState([]);

  // fetch chats
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/chat/");
      const responseData = await response.json();
      setChats(responseData);
      console.log(chats, "chats***");
    }
    fetchData();
  }, []);

  return (
    <>
      <li>
        {chat.name}
        {chat.chat_members.map((member) => (
          <div>{member.username}</div>
        ))}
      </li>
    </>
  );
}

export default IndividualChat;
