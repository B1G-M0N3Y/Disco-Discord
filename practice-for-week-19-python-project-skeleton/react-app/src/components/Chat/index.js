import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { getServerMembers } from "../../store/servers";
import ChatForm from "./ChatForm";
import "./chats.css";
import { getChat } from "../../store/chat";
import IndividualChat from "./IndividualChat";

function Chat() {
  const dispatch = useDispatch();

  // getters and setters
  const chats = useSelector((state) => state.chats);
  const [chat, setChat] = useState(Object.values(chats)[0]);

  // fetch chats

  useEffect(() => {
    //   TODO SETUP THIS REDUX
    dispatch(getChat());
    setChat(Object.values(chats)[0]);
  }, [dispatch]);

  return (
    <>
      <h1>Chats</h1>
      <ul className="chats">
        {chats ? (
          Object.values(chats)?.map((chat, idx) => (
            <IndividualChat chat={chat} setChat={setChat} />
          ))
        ) : (
          <div>No Chats To Display</div>
        )}
      </ul>
      <ChatForm chat={chat} />
    </>
  );
}

export default Chat;
