import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function UsersList() {
  const [users, setUsers] = useState([]);
  // const [servers, setServers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/users/");
      const responseData = await response.json();
      setUsers(responseData.users);
    }
    fetchData();
  }, []);

  // this is just a test
  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await fetch("/api/servers/")
  //       .then((resp) => resp.json())
  //       .then((data) => {
  //         setServers(data);
  //       });
  //     // const responseData = await response.json();
  //     // console.log(responseData.servers);
  //     // setServers(responseData.servers);
  //   }
  //   fetchData();
  // }, []);

  const userComponents = users.map((user) => {
    return (
      <li key={user.id}>
        <NavLink to={`/users/${user.id}`}>{user.username}</NavLink>
      </li>
    );
  });

  // this is just a test
  // const serverComponents = servers.map((server) => {
  //   return (
  //     <li key={server.id}>
  //       <NavLink to={`/servers/${server.id}`}>{server.name}</NavLink>
  //     </li>
  //   );
  // });

  return (
    <>
      <h1>User List: </h1>
      <ul>{userComponents}</ul>
    </>
  );
}

export default UsersList;
