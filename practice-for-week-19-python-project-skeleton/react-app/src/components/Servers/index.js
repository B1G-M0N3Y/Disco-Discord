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
  const [server, setServer] = useState(Object.values(servers)[0]);

  useEffect(() => {
    dispatch(getServers());
    setSelectedServer(serverId);
  }, [dispatch]);

  return null;
};

export default Servers;
