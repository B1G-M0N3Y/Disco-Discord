import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { getServerMembers } from "../../store/servers";
import "./chats.css";

function Chat() {
  const dispatch = useDispatch();

  // getters and setters
  const [chats, setChats] = useState([]);

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
      <h1>Chats</h1>
      <ul className="chats">
        {chats ? (
          chats.map((chat) => (
            <li>
              {chat.name}
              {chat.chat_members.map((member) => (
                <div>{member.username}</div>
              ))}
            </li>
          ))
        ) : (
          <div>No Chats To Display</div>
        )}
      </ul>
    </>
  );
}

export default Chat;
