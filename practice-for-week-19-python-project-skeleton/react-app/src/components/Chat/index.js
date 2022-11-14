import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { getServerMembers } from "../../store/servers";
import ChatForm from "./ChatForm";
import "./chats.css";
import IndividualChat from "./IndividualChat";

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
          chats.map((chat, idx) => <IndividualChat chat={chat} />)
        ) : (
          <div>No Chats To Display</div>
        )}
      </ul>
      <NavLink to="/chat/new">Start A New Chat</NavLink>
      <ChatForm />
    </>
  );
}

export default Chat;
