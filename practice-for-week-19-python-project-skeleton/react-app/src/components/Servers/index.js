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
  const {serverId} = useParams()

  const servers = useSelector((state) => state.servers.servers);
  console.log(Object.values(servers)[0]?.channels[0]?.messages, "messages");
  const [server, setServer] = useState(Object.values(servers)[0]);
  // const [channel, setChannel] = useState(
  //   Object.values(servers)[0]?.channels[0]
  // );
  console.log("selected server", selectedServer);
  console.log("selected channel", selectedChannel);
  const [messages, setMessages] = useState(
    Object.values(servers)[selectedServer]?.channels[selectedChannel]?.messages
  );

  useEffect(() => {
    dispatch(getServers());
    setSelectedServer(serverId)
  }, [dispatch]);

  console.log(server, "server");
  console.log(selectedChannel, "channel in server component");

  // load all servers

  let serverDisplay;
  let channelDisplay;

  // use state to pick the server to display channel
  // pass in server id props to channel messages

  return (
    <>
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
