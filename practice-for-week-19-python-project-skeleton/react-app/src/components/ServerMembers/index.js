import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSelectedServer } from "../../context/ServerContext";

import { setServerUsers } from "../../store/users";
import NewServerMember from "./NewServerMember";
import "./ServerMembers.css";

function ServerMembers() {
  const dispatch = useDispatch();

  // getters and setters
  const [members, setMembers] = useState([]);
  const { selectedServer } = useSelectedServer();
  const servers = useSelector((state) => state.servers.servers);
  const currUser = useSelector((state) => state.session.user);
  const currServer = servers[selectedServer];

  let membersArr = [];

  if (currServer?.server_members)
    membersArr = Object.values(currServer?.server_members);

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
      <div className="member-title">Members-{membersArr?.length} </div>
      {/* <ul>{serverMembers}</ul> */}
      <br></br>
      {membersArr.map((member) => (
        <div className="flex-row">
          <div className="member-image-container">
            <img
              className="member-image"
              src={member?.image_url}
              alt={member?.id}
            ></img>
          </div>
          <div className="member-name">
            <p>{member?.username}</p>
          </div>
        </div>
      ))}
      {currServer?.admin_id === currUser?.id && (
        <NewServerMember serverId={selectedServer} currMembers={membersArr} />
      )}
    </div>
  );
}

export default ServerMembers;
