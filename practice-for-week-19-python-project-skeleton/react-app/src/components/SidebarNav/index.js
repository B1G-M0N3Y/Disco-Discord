import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { getOneServer, getServers } from "../../store/servers";
import { useSelectedServer } from "../../context/ServerContext";

function SidebarNav() {
  const dispatch = useDispatch();

  // getters and setters
  const [members, setMembers] = useState([]);
  const { setSelectedServer } = useSelectedServer();

  // get the current server
  const currServer = useSelector((state) => state.servers.currentServer);

  // get all the servers
  useEffect(() => {
    dispatch(getServers());
  }, [dispatch]);

  // get all members
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/servers/members");
      const responseData = await response.json();
      setMembers(responseData);
    }
    fetchData();
  }, []);

  // filter all servers to find only user's servers
  const allServers = useSelector((state) => state.servers.servers);
  const serversArr = Object.values(allServers);

  // map over filtered severs to display them
  const userServers = serversArr.map((server) => {
    if (!server) return null;
    return (
      <div
        key={server.id}
        onClick={() => {
          // update current server
          dispatch(getOneServer(server.id));
          setSelectedServer(currServer);
        }}
      >
        <div>{server?.name}</div>
        <NavLink to={`/servers/${server?.id}`}>{server?.image_url}</NavLink>
      </div>
    );
  });

  if (!serversArr.length) return null;
  return <>{userServers}</>;
}

export default SidebarNav;
