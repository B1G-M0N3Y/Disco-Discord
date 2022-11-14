import React, { useEffect, useState } from "react";
import { useSelector, useDispatch} from "react-redux";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { getServerMembers } from "../store/servers";

function ServerMembers() {
  const { serverId } = useParams();
  const dispatch = useDispatch();

  // getters and setters
  const [users, setUsers] = useState([]);

  // get server member state
  const membersObj = useSelector((state) => state.servers.members);
  const membersArr = Object.values(membersObj)

  // get server members with id from url
  useEffect(() => {
    dispatch(getServerMembers(serverId));
  }, [dispatch, serverId]); 

  //
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/users/");
      const responseData = await response.json();
      setUsers(responseData.users);
    }
    fetchData();
  }, []);
  
  // find user from member's user_id
  const findUser = (id) => {
    const user = users.find((user) => user.id === id);
    console.log(users)
    return `${user?.username}`;
  };

  const serverMembers = membersArr.map((member) => {
    return (
      <li key={member.user_id}>
        <NavLink to={`/users/${member.user_id}`}>{findUser(member.user_id)}</NavLink>
      </li>
    );
  });

  return (
    <>
      <h1>Member List: </h1>
      <ul>{serverMembers}</ul>
    </>
  );
}

export default ServerMembers;
