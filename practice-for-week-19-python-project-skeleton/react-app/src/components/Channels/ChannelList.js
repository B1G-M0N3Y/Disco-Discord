import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { useSelectedServer } from "../../context/ServerContext";
import { getOneServer, getServers } from "../../store/servers";
import { getChannels } from "../../store/channels";

const ChannelList = ({ channelArr }) => {
  const dispatch = useDispatch();

  // get serverId from url
  const { serverId } = useParams();
  const { selectedServer } = useSelectedServer();
  const [channels, setChannels] = useState(channelArr);

  useEffect(() => {
    dispatch(getServers());
    if (selectedServer?.id) {
      dispatch(getOneServer(serverId));
      console.log("MY SERVER", selectedServer);
      dispatch(getChannels(selectedServer.channels));
      setChannels(selectedServer.channels);
    }
  }, [dispatch, selectedServer, serverId]);

  useEffect(() => {
    const data = window.localStorage.getItem(
      "CHANNELS",
      JSON.stringify(channels)
    );
    if (data && data !== "undefined") {
      setChannels(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("CHANNELS", JSON.stringify(channels));
  }, [channels]);

  // map through channel list to display channels
  const channelList = channels?.map((channel) => {
    return (
      <div key={channel.id}>
        <NavLink to={`/servers/${selectedServer.id}/channels/${channel?.id}`}>
          {channel.name}
        </NavLink>
      </div>
    );
  });
  return <>{channelList}</>;
};

export default ChannelList;
