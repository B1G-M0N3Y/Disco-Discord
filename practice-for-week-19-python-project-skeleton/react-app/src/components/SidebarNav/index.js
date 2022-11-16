import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { getOneServer, getServers } from "../../store/servers";
import { useSelectedServer } from "../../context/ServerContext";
import { useSelectedChannels } from "../../context/ChannelContext";

function SidebarNav({ servers }) {
  const dispatch = useDispatch();

  // getters and setters
  const [myServer, setMyServer] = useState([]);
  const { selectedServer, setSelectedServer } = useSelectedServer();
  const { selectedChannels, setSelectedChannels } = useSelectedServer();
  const currServers = useSelector((state) => state.servers.servers);

  useEffect(() => {
    dispatch(getServers());
    if (myServer) {
      dispatch(getOneServer(myServer.id));
      setSelectedServer(myServer);
      // console.log("selectedServer channels", selectedServer.channels);
    }
  }, [dispatch, myServer]);

  useEffect(() => {
    const data = window.localStorage.getItem(
      "SERVER",
      JSON.stringify(myServer)
    );
    if (data) {
      setMyServer(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("SERVER", JSON.stringify(myServer));
  }, [myServer]);

  const serversArr = Object.values(currServers);
  console.log("all servers", servers);

  // map over filtered severs to display them
  const myServers = serversArr.map((server) => {
    if (!server) return null;
    return (
      <div
        key={server.id}
        onClick={() => {
          // update current server
          setMyServer(server);
          console.log(myServer, "current server in SidebarNav, after onClick");
        }}
      >
        <div>{server?.name}</div>
        <NavLink to={`/servers/${server.id}`}>{server.image_url}</NavLink>
      </div>
    );
  });

  if (!serversArr.length) return null;
  return <>{myServers}</>;
}

export default SidebarNav;
