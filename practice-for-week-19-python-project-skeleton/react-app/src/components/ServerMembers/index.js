import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useSelectedServer } from "../../context/ServerContext";
import { getServers } from "../../store/servers";
import { getAllUsers, removeServerMember, setServerUsers } from "../../store/users";
import Servers from "../Servers";
import NewServerMember from "./NewServerMember";
// import { getServerMembers } from "../../store/servers";

function ServerMembers() {
  const { serverId } = useParams();
  const dispatch = useDispatch();

  // getters and setters
  const [users, setUsers] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const { selectedServer } = useSelectedServer();
  const currServer = useSelector(state => state.servers.currentServer)

  // get server member state
  // const membersObj = useSelector((state) => state.servers.members);
  // const membersArr = Object.values(membersObj);
  let membersArr = [];
  // const currMembers = useSelector(state => state.servers[selectedServer?.id]?.serverMembers)

  console.log("selected", selectedServer);

  if (currServer.server_members) membersArr = Object.values(currServer.server_members);

  console.log("da members", membersArr);
  // get server members with id from url
  // useEffect(() => {
  //   // dispatch(getServerMembers(serverId));
  // }, [dispatch, selectedServer]);


  // fetch users
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/users/");
      const responseData = await response.json();
      setUsers(responseData.users);
    }
    fetchData();
    console.log('ihatelife', currServer.server_members)
    setServerUsers(currServer.server_members)
  }, []);

  useEffect(() => {
    console.log("we are gaming")
    dispatch(getServers())
  },[deleted, membersArr])

  const removeMember = async (userId) => {
    dispatch(removeServerMember(selectedServer.id, userId))
  };

  // find one user
  const findUser = (id) => {
    const user = users.find((user) => user.id === id);
    return user;
  };


  const rawahaLog = (str) =>{
    console.log(str)
  }

  console.log("admin id", selectedServer?.admin_id)
  return (
    <div>
      <h1>Member List: </h1>
      {/* <ul>{serverMembers}</ul> */}
      {membersArr.map((member) => (
        <div>
          <p>{member.username}</p>
          {rawahaLog(member.id)}
          {member.id !== selectedServer?.admin_id && (
            <i onClick={() => removeMember(member.id)} class="fa-solid fa-user-minus"></i>
          )}
        </div>
      ))}
      <NewServerMember serverId={selectedServer?.id} currMembers={membersArr} />
    </div>
  );
}

export default ServerMembers;
