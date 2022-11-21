import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSelectedChat } from "../../context/ChatContext";
import { useHistory } from "react-router-dom";
import { deleteChat } from "../../store/chat";

const DEFAULT_IMAGE_URL =
  "https://ledstagelightmfg.com/wp-content/uploads/2020/09/40inch-disco-ball.jpg";

function IndividualChat({ chat, setChat }) {
  const dispatch = useDispatch();
  const history = useHistory();
  // getters and setters
  const user = useSelector((state) => state.session.user);
  const chats = useSelector((state) => state.chats);

  const chatsArr = Object.keys(chats).map((chatId) => parseInt(chatId));
  console.log(
    chatsArr?.findIndex((chatIdx) => chatIdx === chat.id),
    "find index"
  );

  const { selectedChat, setSelectedChat } = useSelectedChat();

  const handleDelete = async (chatId) => {
    await dispatch(deleteChat(chatId));
    // determineNextChatOnDelete();
    const indexOfChatInChatsArr = chatsArr?.findIndex(
      (chatIdx) => chatIdx === chat.id
    );
    let nextChatIndex;
    if (indexOfChatInChatsArr === 0) {
      nextChatIndex = chatsArr[indexOfChatInChatsArr + 1];
    } else {
      nextChatIndex = chatsArr[indexOfChatInChatsArr - 1];
    }
    setSelectedChat(nextChatIndex);
    return history.push(`/chats/${nextChatIndex}`);
  };

  let chatSelector;

  const selectChat = () => {
    setSelectedChat(chat.id);
    history.push(`/chats/${chat.id}`);
  };

  // If there are more members than 2 in a chat, it is a group
  // chat. If the currently selected chat is a group chat, render
  // either their custom chat name or the names of the members if
  // they have not set a custom chat name. If the chat is not a
  // group chat, display the name of the other user and their image
  if (chat.chat_members?.length > 2) {
    chatSelector = (
      <>
        <img className="user-pic-nav" src={DEFAULT_IMAGE_URL} alt="chat"></img>
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
      await response.json();
    }
    fetchData();
  }, []);

  return (
    <>
      <div
        className={
          selectedChat === chat.id ? "selected-chat" : "not-selected-chat"
        }
      >
        <div
          id={chat.id}
          className="chat-nav"
          onClick={() => {
            selectChat();
          }}
        >
          {chatSelector}
          {chat.adminId === user.id && (
            <div className="delete-chat-button-container">
              <i
                class="fa-solid fa-x delete-chat-button"
                onClick={() => {
                  handleDelete(chat.id);
                }}
              ></i>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default IndividualChat;
