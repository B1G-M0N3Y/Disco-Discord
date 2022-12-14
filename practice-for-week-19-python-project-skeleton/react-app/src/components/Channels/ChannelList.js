import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { useSelectedServer } from "../../context/ServerContext";
import { getOneServer } from "../../store/servers";

const ChannelList = ({ server }) => {
  const dispatch = useDispatch();

  const { selectedServer, setSelectedServer } = useSelectedServer();

  useEffect(() => {
    dispatch(getOneServer(server.id));
    setSelectedServer(server.id);
  }, [dispatch, server.name]);

  const channelList = selectedServer["channels"]?.map((channel) => {
    return (
      <div key={channel.id}>
        <NavLink to={`/servers/${selectedServer.id}/channels/${channel?.id}`}>
          {channel?.name}
        </NavLink>
      </div>
    );
  });

  // map through channel list to display channels
  return <>{channelList}</>;
};

export default ChannelList;
