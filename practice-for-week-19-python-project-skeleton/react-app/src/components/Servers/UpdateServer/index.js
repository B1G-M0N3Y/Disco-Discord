import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, Redirect } from "react-router-dom";
import { getOneServer, getServers, updateServer } from "../../../store/servers";
import { useSelectedServer } from "../../../context/ServerContext.js";
import DeleteServer from "../DeleteServer";

const UpdateServer = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // get song id from url
  let { serverId } = useParams();
  serverId = parseInt(serverId);
  const userId = useSelector((state) => state.session.user.id);
  const servers = useSelector((state) => state.servers.servers);
  const currServer = useSelector((state) => state.servers.currentServer);
  const serverArr = Object.values(servers);
  // identify the server that matches the id from url
  const thisServer = serverArr.find((server) => server.id === serverId);
  // getters and setters for update song form
  const [name, setName] = useState(thisServer?.name);
  const [imageUrl, setImageUrl] = useState(thisServer?.image_url);
  const [validationErrors, setValidationErrors] = useState([]);
  const { selectedServer, setSelectedServer } = useSelectedServer();

  // get servers
  useEffect(() => {
    dispatch(getOneServer(serverId));
    setSelectedServer(currServer);

    return () => {
      dispatch(getOneServer(serverId));
      setSelectedServer(currServer);
      window.localStorage.setItem("SERVER", JSON.stringify(currServer));
    };
  }, [dispatch, servers]);

  const user = useSelector((state) => state.session.user);

  // helper function for clearing the form after submit
  const revert = () => {
    setName("");
    setImageUrl("");
  };

  // form validations
  useEffect(() => {
    const errors = [];
    setValidationErrors(errors);
    if (!name) errors.push("Server name is required.");
    if (imageUrl?.length > 255) errors.push("Url cannot exceed length limit.");
    if (user.id !== thisServer?.admin_id)
      errors.push("Only the admin can update this server.");
    setValidationErrors(errors);
  }, [name, imageUrl]);

  // set user albums for form select
  // const updateChannel = (e) => setChannelSelect(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors([]);
    let serverBody = {
      name,
      image_url: imageUrl,
    };
    // a user needs to be the admin in order to allow editing
    if (userId === thisServer.admin_id) {
      revert();
      dispatch(updateServer(serverBody, serverId));
      // window.localStorage.setItem("SERVER", JSON.stringify(thisServer));
    }
  };

  if (!Object.values(servers).length) return null;

  return (
    <div className="wrapper-container">
      <div className="edit-container">
        <br></br>
        <form className="edit-song-form" onSubmit={handleSubmit}>
          <div className="edit-title">Edit server details below:</div>
          <input
            type="name"
            placeholder="Name"
            value={name}
            required={true}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="imageUrl"
            placeholder="Image Url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <ul className="errors">
            {validationErrors.length > 0 &&
              validationErrors.map((err) => (
                <li id="err" key={err}>
                  {err}
                </li>
              ))}
          </ul>
          <button
            className="edit-server-submit"
            type="submit"
            disabled={!!validationErrors.length}
          >
            Submit
          </button>
          <div>
            <DeleteServer />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateServer;
