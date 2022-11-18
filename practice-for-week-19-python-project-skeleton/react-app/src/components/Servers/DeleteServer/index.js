import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

const DeleteServer = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // identify the server from the url
  let { serverId } = useParams();
  serverId = parseInt(serverId);

  const servers = useSelector((state) => state.servers.servers);

  // get servers
  useEffect(() => {
    // dispatch(getServers());
  }, [dispatch]);

  // onClick, delete the server from the url
  const handleClick = async (e) => {
    e.preventDefault();
    // await dispatch(deleteServer(serverId));
    return history.push(`/`);
  };

  if (!Object.values(servers).length) return null;

  return (
    <>
      <i class="fa-regular fa-trash-can" onClick={handleClick}></i>
    </>
  );
};

export default DeleteServer;
