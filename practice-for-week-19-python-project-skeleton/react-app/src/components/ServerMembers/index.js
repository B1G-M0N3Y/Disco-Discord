import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSelectedServer } from "../../context/ServerContext";

import { setServerUsers } from "../../store/users";
import NewServerMember from "./NewServerMember";
// import { getServerMembers } from "../../store/servers";
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
    <div className="member-component">
      <h1 className="member-title">Members-{membersArr?.length} </h1>
      {/* <ul>{serverMembers}</ul> */}
      <div className="member-container">
        <div className="member-list">
          {membersArr.map((member) => (
            <div className="member">
              <img src={member.image_url}></img>
              <p>{member?.username}</p>
            </div>
          ))}
        </div>
        {currServer?.admin_id === currUser?.id && (
          <NewServerMember serverId={selectedServer} currMembers={membersArr} />
        )}
      </div>
    </div>
  );
}

export default ServerMembers;
