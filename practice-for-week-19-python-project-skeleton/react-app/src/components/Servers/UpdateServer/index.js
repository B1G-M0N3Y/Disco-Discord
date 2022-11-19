import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateServer } from "../../../store/servers";
import { useHistory, useParams, Redirect } from "react-router-dom";
import {
  getOneServer,
  getServers,
  deleteServerThunk,
} from "../../../store/servers";
import { getCurrentChannels } from "../../../store/channels";
import { useSelectedServer } from "../../../context/ServerContext.js";
import DeleteChannel from "../../Channels/DeleteChannel.js";
import "../DeleteServer/DeleteServerButton.css";

const UpdateServer = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // get song id from url
  const { serverId } = useParams();
  const userId = useSelector((state) => state.session.user.id);
  const servers = useSelector((state) => state.servers.servers);
  const channels = useSelector((state) => state.channels.channels);
  const currServer = useSelector((state) => state.servers.currentServer);
  const serverArr = Object.values(servers);
  // identify the server that matches the id from url
  // const thisServer = serverArr.find((item) => item.id === server?.id);
  // // getters and setters for update song form
  const [name, setName] = useState(servers[serverId]?.name);
  console.log("name", name);
  const [imageUrl, setImageUrl] = useState(servers[serverId]?.imageUrl);
  console.log("image url", imageUrl);
  const [validationErrors, setValidationErrors] = useState([]);
  const { selectedServer, setSelectedServer } = useSelectedServer();


  // when leaving the page:
  // get servers, then all servers
  // so deleted server is removed immediately
  useEffect(() => {
    setSelectedServer(serverId)
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

  // form validations
  // useEffect(() => {
  //   const errors = [];
  //   setValidationErrors(errors);
  //   if (!name) errors.push("Server name is required.");
  //   if (imageUrl?.length > 255) errors.push("Url cannot exceed length limit.");
  //   // TODO if (user.id !== server?.admin_id)
  //   //   errors.push("Only the admin can update this server.");
  //   setValidationErrors(errors);
  // }, [name, imageUrl]);

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
    // alert("Server Successfully Deleted");
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
          <div>
            {/* {userId === servers[serverId].admin_id && (
              <DeleteChannel server={servers[serverId]} />
            )} */}
          </div>
        </div>
      </div>
    );
  } else {
    history.push(`/server/${serverId}`)
    return null
  }
};

export default UpdateServer;
