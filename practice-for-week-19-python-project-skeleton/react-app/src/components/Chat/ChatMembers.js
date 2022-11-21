import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useSelectedChat } from "../../context/ChatContext";
import { useSelectedServer } from "../../context/ServerContext";
import { getServers } from "../../store/servers";

// import { getServerMembers } from "../../store/servers";

function ChatMembers() {
  // getters and setters

  // get server member state
  // const membersObj = useSelector((state) => state.servers.members);
  // const membersArr = Object.values(membersObj);
  let membersArr = [];
  // const currMembers = useSelector(state => state.servers[selectedServer?.id]?.serverMembers)

  const chats = useSelector((state) => state.chats);
  const { selectedChat } = useSelectedChat();
  const currChat = chats[selectedChat];
  let chatMembers;

  if (chats && selectedChat)
    chatMembers = Object.values(chats[selectedChat]["chat_members"]);
  console.log(chatMembers, "chat members");
  // fetch users

  return (
    <div className="chat-members">
      <h1>Chat Members: </h1>
      {chatMembers?.map((member) => (
        <div>
          <p>{member?.username}</p>
        </div>
      ))}
    </div>
  );
}

export default ChatMembers;
