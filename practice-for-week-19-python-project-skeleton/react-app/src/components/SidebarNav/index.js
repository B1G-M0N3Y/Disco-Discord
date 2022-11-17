import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { getOneServer, getServers } from "../../store/servers";
import { useSelectedServer } from "../../context/ServerContext";
import CreateServerFormModal from "../Servers/CreateServerFormModal"

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
  const currentUser = useSelector((state) => state.session.user);
  const allServers = useSelector((state) => state.servers.servers);
  const serversArr = Object.values(allServers);
  const filteredMembers = members.filter(
    (item) => item.user_id === currentUser?.id
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

  // map over filtered severs to display them
  const userServers = filteredServers.map((server) => {
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


  if (!filteredServers.length) return null;
  return <>
          {userServers}
          <div id="create-server-button">
            <CreateServerFormModal />
          </div>
          </>;


}


export default SidebarNav;
