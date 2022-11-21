import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateServer } from "../../../store/servers";
import { useHistory, useParams, Redirect } from "react-router-dom";
import {
  getOneServer,
  getServers,
  deleteServerThunk,
} from "../../../store/servers";
import { useSelectedServer } from "../../../context/ServerContext.js";
import "../DeleteServer/DeleteServerButton.css";

const UpdateServer = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // get song id from url
  const { serverId } = useParams();
  const userId = useSelector((state) => state.session.user.id);
  const servers = useSelector((state) => state.servers.servers);
  // // getters and setters for update song form
  const [name, setName] = useState(servers[serverId]?.name);
  const [imageUrl, setImageUrl] = useState(servers[serverId]?.imageUrl);
  const [validationErrors, setValidationErrors] = useState([]);
  const { selectedServer, setSelectedServer } = useSelectedServer();

  // when leaving the page:
  // get servers, then all servers
  // so deleted server is removed immediately
  useEffect(() => {
    setSelectedServer(serverId);
    return () => {
      dispatch(getOneServer(serverId));
      dispatch(getServers());
    };
  }, [dispatch]);

  const user = useSelector((state) => state.session.user);

  // helper function for clearing the form after submit
  const revert = () => {
    setName(name);
    setImageUrl(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors([]);
    let serverBody = {
      name,
      image_url: imageUrl,
    };
    // a user needs to be the admin in order to allow editing
    if (userId === servers[serverId].admin_id) {
      revert();
      dispatch(updateServer(serverBody, selectedServer));
    }
  };

  const deleteHandler = async (e) => {
    e.preventDefault();
    await dispatch(deleteServerThunk(serverId));
    return history.push("/");
  };

  if (!Object.values(servers).length) return null;

  if (userId === servers[serverId].admin_id) {
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
            {user && user.id === servers[serverId].admin_id && (
              <>
                <button id="delete-server-button" onClick={deleteHandler}>
                  {" "}
                  Delete Server{" "}
                </button>
              </>
            )}
          </form>
        </div>
        <div className="delete-channel">
          <div></div>
        </div>
      </div>
    );
  } else {
    history.push(`/server/${serverId}`);
    return null;
  }
};

export default UpdateServer;
