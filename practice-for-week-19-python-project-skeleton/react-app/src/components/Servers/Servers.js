import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import UpdateServer from "./UpdateServer";

const Servers = () => {
  const [serverId, setServerId] = useState();
  // load all servers
  // use state to pick the server to display channel
  // pass in server id props to channel messages

  return (
    <>
      <UpdateServer />
    </>
  );
};

export default Servers;
