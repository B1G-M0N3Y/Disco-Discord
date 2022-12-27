import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./chats.css";
import { getChat } from "../../store/chat";
import IndividualChat from "./IndividualChat";
import { useSelectedChat } from "../../context/ChatContext";
import CreateChat from "./CreateChat";
import { io } from "socket.io-client";

function Chat() {
  const dispatch = useDispatch();

  // getters and setters
  const chats = useSelector((state) => state.chats);
  const { setSelectedChat } = useSelectedChat();

  // fetch chats

  useEffect(() => {
    //   TODO SETUP THIS REDUX
    // dispatch(getChat());
    setSelectedChat(Object.values(chats)[0]?.id);
    // DONT ADD CHATS TO DEPENDENCY ARRAY OR EVERYTHING WILL BREAK AND I WILL CRY
  }, [dispatch, setSelectedChat]);

  useEffect(()=>{

    const socket = io();

    socket.on("newchat", (data) => {
      console.log( "NEW CHAT ALERT****");
      // dispatch(addChatMessage(data));
      dispatch(getChat());
    });
    return () => {
      socket.disconnect();
    };
  })

  return (
    <>
      <div>
        <div className="server-name">
          <div className="width-90">Chats</div>
          <CreateChat />
        </div>
        <hr />
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
