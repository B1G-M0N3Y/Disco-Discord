import { createContext, useContext, useState } from "react";

export const ChatContext = createContext();
export const useSelectedChat = () => useContext(ChatContext);

export default function ChatProvider(props) {
  const [selectedChat, setSelectedChat] = useState(0);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
}
