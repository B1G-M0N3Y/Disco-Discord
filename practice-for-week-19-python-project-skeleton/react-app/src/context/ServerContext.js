import { createContext, useContext, useState } from "react";

export const ServerContext = createContext();
export const useSelectedServer = () => useContext(ServerContext);

export default function ServerProvider(props) {
  const [selectedServer, setSelectedServer] = useState([]);

  return (
    <ServerContext.Provider
      value={{
        selectedServer,
        setSelectedServer,
      }}
    >
      {props.children}
    </ServerContext.Provider>
  );
}
