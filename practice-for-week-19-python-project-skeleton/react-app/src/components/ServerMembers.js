import React, { useEffect, useState } from "react";
import { useSelector, useDispatch} from "react-redux";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { getServerMembers } from "../store/servers";

function ServerMembers() {
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const membersObj = useSelector((state) => state.servers.members);
  const membersArr = Object.values(membersObj)

  // get members
  useEffect(() => {
    dispatch(getServerMembers(serverId));
  }, [dispatch]); 

  const serverMembers = membersArr.map((member) => {
    return (
      <li key={member.user_id}>
        <NavLink to={`/users/${member.user_id}`}>{member.user_id}</NavLink>
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
