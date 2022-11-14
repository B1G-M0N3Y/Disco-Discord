import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { getServerMembers, getServers } from "../../store/servers";

function SidebarNav() {
  const dispatch = useDispatch();

  // get all the servers
  useEffect(() => {
    dispatch(getServers());
  }, [dispatch]);

  // get current user and servers state
  const currentUser = useSelector((state) => state.session.user);
  const servers = useSelector((state) => state.servers.servers);
  const serversArr = Object.values(servers);

  const allServers = serversArr.map((server) => {
    return (
      <div>
        <div>{server?.name}</div>
        <NavLink to={`/servers/${server?.id}`}>{server?.image_url}</NavLink>
      </div>
    );
  });

  return <>{allServers}</>;
}

export default SidebarNav;
