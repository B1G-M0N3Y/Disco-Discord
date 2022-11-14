import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import {
  getOneServer,
  getServerChannels,
  getServers,
} from "../../store/servers";

const ChannelList = () => {
  const dispatch = useDispatch();

  // get serverId from url
  const { serverId } = useParams();

  // get all server channels
  useEffect(() => {
    dispatch(getServers());
    dispatch(getOneServer(serverId));
    dispatch(getServerChannels(currServer.id));
  }, [dispatch, serverId]);

  // get the current server
  const currServer = useSelector((state) => state.servers.currentServer);
  console.log("this is the current server in Channel List", currServer);
  // get current channel state
  const channels = useSelector((state) => state.servers.channels);
  const channelsArr = Object.values(channels);

  const channelList = channelsArr.map((channel) => {
    // if (!currServer) return null;
    return (
      <div>
        <NavLink to={`/servers/${currServer?.id}/channels/${channel?.id}`}>
          {channel?.name}
        </NavLink>
      </div>
    );
  });

  return <>{channelList}</>;
};

export default ChannelList;
