import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { getServers } from "../../store/servers";
import ChannelMessagesPage from "../Channels/ChannelMessages";
import { useSelectedMessages } from "../../context/MessageContext";
import { useSelectedServer } from "../../context/ServerContext";
import UpdateServer from "./UpdateServer";
import { useSelectedChannels } from "../../context/ChannelContext";

const Servers = () => {
  const dispatch = useDispatch();
  const { showMessages, setShowMessages } = useSelectedMessages();
  const { selectedServer, setSelectedServer } = useSelectedServer();
  const { selectedChannel, setSelectedChannel } = useSelectedChannels();
  const { serverId } = useParams();

  const servers = useSelector((state) => state.servers.servers);
  console.log(Object.values(servers)[0]?.channels[0]?.messages, "messages");
  const [server, setServer] = useState(Object.values(servers)[0]);
  // const [channel, setChannel] = useState(
  //   Object.values(servers)[0]?.channels[0]
  // );
  console.log("selected server", selectedServer);
  console.log("selected channel", selectedChannel);

  useEffect(() => {
    dispatch(getServers());
    setSelectedServer(serverId);
  }, [dispatch]);

  console.log(server, "server");
  console.log(selectedChannel, "channel in server component");

  // load all servers

  let serverDisplay;
  let channelDisplay;

  // const channelList = currServers[selectedServer]?.channels.map(
  //   (channel, idx) => (
  //     <div className="channel-nav chat-nav">
  //       <div
  //         onClick={() => {
  //           setShowMessages(true);
  //           setSelectedChannel(channel);
  //           console.log("selected channel", channel);
  //           history.push(`/servers/${currServerId}/channels/${channel?.id}`);
  //         }}
  //       >
  //         <div className="width-90">{channel.name}</div>
  //       </div>
  //     </div>
  //   )
  // );

  return (
    <>
      {/* {showChannels &&
      } */}
      {showMessages && (
        <>
          <div className="server-details-container">
            <ChannelMessagesPage />
          </div>
        </>
      )}
      {showMessages === false && (
        <>
          <UpdateServer server={selectedServer} />
        </>
      )}
    </>
  );
};

export default Servers;
