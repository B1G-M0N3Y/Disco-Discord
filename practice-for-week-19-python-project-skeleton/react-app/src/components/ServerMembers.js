import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";

function ServerMembers() {
  // get the server id from the url
  const { serverId } = useParams();

  // getters and setters for members and users
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);

  // fetch the server members
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/servers/1/members")
        .then((resp) => resp.json())
        .then((data) => setMembers(data));
    }
    fetchData();
  }, []);

  const serverMembers = members.map((member) => {
    return (
      <li key={member.user_id}>
        <NavLink to={`/users/${member.user_id}`}>{member.user_id}</NavLink>
      </li>
    );
  });

  return (
    <>
      <h1>User List: </h1>
      <ul>{userComponents}</ul>
    </>
  );
}

export default ServerMembers;
