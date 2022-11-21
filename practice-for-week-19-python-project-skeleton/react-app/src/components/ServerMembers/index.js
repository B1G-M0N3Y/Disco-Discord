import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useSelectedServer } from "../../context/ServerContext";
import { getServers } from "../../store/servers";
import {
  getAllUsers,
  removeServerMember,
  setServerUsers,
} from "../../store/users";
import Servers from "../Servers";
import NewServerMember from "./NewServerMember";
// import { getServerMembers } from "../../store/servers";

function ServerMembers() {
  const dispatch = useDispatch();

  // getters and setters
  const [members, setMembers] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const { selectedServer } = useSelectedServer();
  const servers = useSelector((state) => state.servers.servers);
  const currUser = useSelector((state) => state.session.user);
  const currServer = servers[selectedServer];
  // get server member state
  // const membersObj = useSelector((state) => state.servers.members);
  // const membersArr = Object.values(membersObj);
  let membersArr = [];
  // const currMembers = useSelector(state => state.servers[selectedServer?.id]?.serverMembers)

  if (currServer?.server_members)
    membersArr = Object.values(currServer?.server_members);

  // get server members with id from url
  // useEffect(() => {
  //   // dispatch(getServerMembers(serverId));
  // }, [dispatch, selectedServer]);

  // fetch users
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/users/");
      const responseData = await response.json();
      setMembers(responseData.users);
    }
    fetchData();
    setServerUsers(currServer?.server_members);
  }, []);

  return (
    <div>
      <h1>Member List: </h1>
      {/* <ul>{serverMembers}</ul> */}
      {membersArr.map((member) => (
        <div>
          <p>{member?.username}</p>
        </div>
      ))}
      {currServer?.admin_id === currUser?.id && (
        <NewServerMember serverId={selectedServer} currMembers={membersArr} />
      )}
    </div>
  );
}

export default ServerMembers;
