import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
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
  console.log(chatId, "test");
  console.log(chats, chatId, Object.keys(chats).length > 1, "test2");
  if (chats && chatId && chats[chatId]) {
    chatMembers = Object.values(chats[chatId]?.chat_members);
  }
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
