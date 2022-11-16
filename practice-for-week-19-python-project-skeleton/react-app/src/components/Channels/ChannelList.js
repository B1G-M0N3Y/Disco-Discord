import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
// import ServerMembers from "../ServerMembers";
import { useSelectedServer } from "../../context/ServerContext";

import { getServerChannels, getOneServer } from "../../store/servers";

const ChannelList = () => {
  const dispatch = useDispatch();

  // get serverId from url
  const { serverId } = useParams();
  const { selectedServer } = useSelectedServer();

  // get the current server
  const currServer = useSelector((state) => state.servers.currentServer);

  useEffect(() => {
    dispatch(getServerChannels(currServer.id));
    dispatch(getOneServer(serverId));
  }, [dispatch, serverId, currServer.id]);

  // get current channels
  const channels = useSelector((state) => state.servers.channels);
  const channelsArr = Object.values(channels);

  // map through channel list to display channels
  const channelList = channelsArr.map((channel) => {
    return (
      <div key={channel.id}>
        <NavLink to={`/servers/${selectedServer.id}/channels/${channel?.id}`}>
          {channel?.name}
        </NavLink>
      </div>
    );
  });

  return <>{channelList}</>;
};

export default ChannelList;
