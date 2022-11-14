import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { getServerMembers, getServers } from "../../store/servers";

function SidebarNav() {
  const dispatch = useDispatch();

  // getters and setters
  const [members, setMembers] = useState([]);

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
      // console.log(members, "all members");
    }
    fetchData();
  }, []);

  // filter all servers to find only user's servers
  const currentUser = useSelector((state) => state.session.user);
  const allServers = useSelector((state) => state.servers.servers);
  const serversArr = Object.values(allServers);
  const filteredMembers = members.filter(
    (item) => item.user_id === currentUser.id
  );
  const filteredServers = [];
  for (let i = 0; i < filteredMembers.length; i++) {
    let member = filteredMembers[i];
    for (let j = 0; j < serversArr.length; j++) {
      let server = serversArr[j];
      if (server.id === member.server_id) {
        filteredServers.push(server);
      }
    }
  }

  const userServers = filteredServers.map((server) => {
    return (
      <div>
        <div>{server?.name}</div>
        <NavLink to={`/servers/${server?.id}`}>{server?.image_url}</NavLink>
      </div>
    );
  });

  return <>{userServers}</>;
}

export default SidebarNav;
