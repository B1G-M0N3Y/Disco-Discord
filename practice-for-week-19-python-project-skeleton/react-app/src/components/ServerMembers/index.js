import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useSelectedServer } from "../../context/ServerContext";
import NewServerMember from "./NewServerMember";
// import { getServerMembers } from "../../store/servers";

function ServerMembers() {
  const { serverId } = useParams();
  const dispatch = useDispatch();

  // getters and setters
  const [users, setUsers] = useState([]);
  const { selectedServer } = useSelectedServer();

  // get server member state
  // const membersObj = useSelector((state) => state.servers.members);
  // const membersArr = Object.values(membersObj);
  let membersArr = [];
  // const currMembers = useSelector(state => state.servers[selectedServer?.id]?.serverMembers)

  console.log("selected", selectedServer);

  if (selectedServer) membersArr = Object.values(selectedServer.server_members);

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
  }, []);

  // find one user
  const findUser = (id) => {
    const user = users.find((user) => user.id === id);
    return user;
  };

  const serverMembers = membersArr.map((member) => {
    return (
      <div>
        {/* <div>{findUser(member.user_id)?.image_url}</div>
        <NavLink to={`/users/${member.user_id}`}>
          {findUser(member.user_id)?.username}
        </NavLink> */}
        <p>{member.username}</p>
      </div>
    );
  });

  return (
    <div>
      <h1>Member List: </h1>
      {/* <ul>{serverMembers}</ul> */}
      {membersArr.map((member) => (
        <div>
          {/* <div>{findUser(member.user_id)?.image_url}</div>
        <NavLink to={`/users/${member.user_id}`}>
          {findUser(member.user_id)?.username}
        </NavLink> */}
          <p>{member.username}</p>
        </div>
      ))}
      <NewServerMember currMembers = {membersArr}/>
    </div>
  );
}

export default ServerMembers;
