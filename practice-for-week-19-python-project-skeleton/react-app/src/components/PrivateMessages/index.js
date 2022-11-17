import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSelectedChannels } from "../../context/ChannelContext";
import { getChat } from "../../store/chat";
import { getPrivateChats } from "../../store/private_messages";

const PrivateMessages = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => {
    return state.chats;
  });
  const [chat, setChat] = useState(Object.values(chats)[0]);

  useEffect(() => {
    dispatch(getChat());
  }, [dispatch]);

  return (
    <div>
      {Object.values(chats).map((chat) => (
        <div onClick={() => setChat(chat.id)} className="private-chat-nav">
          <p className="private-chat-nav">
            {chat.name}
          </p>
          <p className="">
            {chat.chat_members?.map((member) => (
              <p>{member.username}</p>
            ))}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PrivateMessages;
