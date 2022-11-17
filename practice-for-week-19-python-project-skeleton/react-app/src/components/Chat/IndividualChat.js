import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChatMessages from "./ChatMessage";
import { useSelectedChat } from "../../context/ChatContext";

const DEFAULT_IMAGE_URL =
  "https://ledstagelightmfg.com/wp-content/uploads/2020/09/40inch-disco-ball.jpg";

function IndividualChat({ chat, setChat }) {
  const dispatch = useDispatch();

  // getters and setters
  const [chats, setChats] = useState([]);
  const user = useSelector((state) => state.session.user);

  const { selectedChat ,setSelectedChat } = useSelectedChat();

  let chatSelector;


  // If there are more members than 2 in a chat, it is a group
  // chat. If the currently selected chat is a group chat, render
  // either their custom chat name or the names of the members if
  // they have not set a custom chat name. If the chat is not a
  // group chat, display the name of the other user and their image
  if (chat.chat_members?.length > 2) {
    chatSelector = (
      <>
        <img className="user-pic-nav" src={DEFAULT_IMAGE_URL}></img>
        <div className="chat-label-container">
          <p className="chat-nav-label">{chat.name}</p>
          <p className="chat-nav-members">{chat.chat_members.length} members</p>
        </div>
      </>
    );
  } else {
    const otherUser = chat.chat_members?.filter(
      (member) => member.email !== user.email
      )[0];
      console.log(otherUser);
      chatSelector = (
      <>
        <img
          className="user-pic-nav"
          src={otherUser?.image_url}
          alt={otherUser?.username}
          ></img>
        <p className="chat-nav-username">{otherUser?.username}</p>
      </>
    );
  }

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
      <div
        id={chat.id}
        className="chat-nav"
        onClick={() => {
          setSelectedChat(chat.id)
        }}
      >
        {chatSelector}
        {/* <p className="chat-nav-label">{chat.name}</p>
        <div className="chat-nav-members">
          {chat.chat_members?.map((member) => (
            <p className="chat-nav-member"> {member.username} </p>
          ))}
        </div> */}
      </div>
    </>
  );
}

export default IndividualChat;
