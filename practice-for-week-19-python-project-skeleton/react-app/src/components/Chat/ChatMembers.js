import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelectedChat } from "../../context/ChatContext";
import { getChat } from "../../store/chat";

// import { getServerMembers } from "../../store/servers";

function ChatMembers() {
  const dispatch = useDispatch();
  // getters and setters

  useEffect(() => {
    (async () => {
      await dispatch(getChat());
    })();
  }, [dispatch]);
  const chats = useSelector((state) => state.chats);

  let chatMembers;
  const { chatId } = useParams();

  if (chats && chatId && chats[chatId]) {
    chatMembers = Object.values(chats[chatId]?.chat_members);
  }

  return (
    <div className="member-component">
      <h1>Chat Members: </h1>
      <div className="chat-member-list">
      {chatMembers?.map((member) => (
          <div className="member">
            <img src={member.image_url}></img>
            <p>{member?.username}</p>
          </div>
      ))}
      </div>
    </div>
  );
}

export default ChatMembers;
