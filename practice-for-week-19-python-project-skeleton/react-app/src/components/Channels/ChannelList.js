import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { getServerChannels, getServers } from "../../store/servers";

const ChannelList = () => {
  const dispatch = useDispatch();

  // get serverId from url
  const { serverId } = useParams();

  // get all server channels
  useEffect(() => {
    dispatch(getServers());
    dispatch(getServerChannels(serverId));
  }, [dispatch, serverId]);

  // get current channel state
  const channels = useSelector((state) => state.servers.channels);
  const channelsArr = Object.values(channels);

  const channelList = channelsArr.map((channel) => {
    // if (!server) return null;
    return (
      <div>
        <NavLink to={`/servers/${channel?.server_id}/channels/${channel?.id}`}>
          {channel?.name}
        </NavLink>
      </div>
    );
  });

  return <>{channelList}</>;
};

export default ChannelList;
