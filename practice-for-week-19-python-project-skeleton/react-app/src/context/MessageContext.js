import { createContext, useContext, useState } from "react";

export const MessageContext = createContext();
export const useSelectedMessages = () => useContext(MessageContext);

export default function MessageProvider(props) {
  const [showMessages, setShowMessages] = useState(null);

  return (
    <MessageContext.Provider
      value={{
        showMessages,
        setShowMessages,
      }}
    >
      {props.children}
    </MessageContext.Provider>
  );
}
