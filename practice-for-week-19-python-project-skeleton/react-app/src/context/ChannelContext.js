import { createContext, useContext, useState } from "react";

export const ChannelsContext = createContext();
export const useSelectedChannels = () => useContext(ChannelsContext);

export default function ChannelsProvider(props) {
  const [showChannels, setShowChannels] = useState();
  const [selectedChannel, setSelectedChannel] = useState();

  return (
    <ChannelsContext.Provider
      value={{
        showChannels,
        setShowChannels,
        selectedChannel,
        setSelectedChannel,
      }}
    >
      {props.children}
    </ChannelsContext.Provider>
  );
}
