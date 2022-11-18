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

  const servers = useSelector((state) => state.servers.servers);
  console.log(Object.values(servers)[0]?.channels[0]?.messages, "messages");
  const [server, setServer] = useState(Object.values(servers)[0]);
  // const [channel, setChannel] = useState(
  //   Object.values(servers)[0]?.channels[0]
  // );
  const [messages, setMessages] = useState(
    Object.values(servers)[0]?.channels[0]?.messages
  );

  useEffect(() => {
    dispatch(getServers());
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
          <h1>Messages</h1>
          <ul className="messages">
            {messages ? (
              Object.values(messages)?.map((message, idx) => (
                // console.log(messages, "messages in map")
                <ChannelMessagesPage />
              ))
            ) : (
              <div>No Chats To Display</div>
            )}
          </ul>
        </>
      )}
      {showMessages === false && <UpdateServer server={server} />}
    </>
  );
};

export default Servers;
