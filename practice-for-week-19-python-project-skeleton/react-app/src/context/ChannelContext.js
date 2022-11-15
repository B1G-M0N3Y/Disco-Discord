import { createContext, useContext, useState } from "react";

export const ChannelsContext = createContext();
export const useSelectedChannels = () => useContext(ChannelsContext);

export default function ChannelsProvider(props) {
  const [selectedChannels, setSelectedChannels] = useState([]);

  return (
    <ChannelsContext.Provider
      value={{
        selectedChannels,
        setSelectedChannels,
      }}
    >
      {props.children}
    </ChannelsContext.Provider>
  );
}
