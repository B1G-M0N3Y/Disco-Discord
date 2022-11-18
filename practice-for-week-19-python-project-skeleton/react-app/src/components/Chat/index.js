import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./chats.css";
import { getChat } from "../../store/chat";
import IndividualChat from "./IndividualChat";
import { useSelectedChat } from "../../context/ChatContext";

function Chat() {
  const dispatch = useDispatch();

  // getters and setters
  const chats = useSelector((state) => state.chats);
  const { setSelectedChat } = useSelectedChat();

  // fetch chats

  useEffect(() => {
    //   TODO SETUP THIS REDUX
    dispatch(getChat());
    setSelectedChat(Object.values(chats)[0].id);
    // DONT ADD CHATS TO DEPENDENCY ARRAY OR EVERYTHING WILL BREAK AND I WILL CRY
  }, [dispatch, setSelectedChat]);

  return (
    <>
      <div>
        <h1>Chats</h1>
        {chats ? (
          Object.values(chats)?.map((chat, idx) => (
            <IndividualChat chat={chat} />
          ))
        ) : (
          <div>No Chats To Display</div>
        )}
      </div>
    </>
  );
}

export default Chat;
