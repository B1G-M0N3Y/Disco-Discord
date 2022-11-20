import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateServer } from "../../../store/servers";
import { useHistory, useParams } from "react-router-dom";
import {
  getOneServer,
  getServers,
  deleteServerThunk,
} from "../../../store/servers";
import { useSelectedServer } from "../../../context/ServerContext.js";
import "../DeleteServer/DeleteServerButton.css";
import UpdateChannel from "../../Channels/DeleteChannel";
import "./UpdateServer.css";

const UpdateServer = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // get song id from url
  const { serverId } = useParams();
  const user = useSelector((state) => state.session.user);
  const servers = useSelector((state) => state.servers.servers);
  // // getters and setters for update song form
  const [name, setName] = useState(servers[serverId]?.name);
  console.log("name", name);
  const [imageUrl, setImageUrl] = useState(servers[serverId]?.imageUrl);
  console.log("image url", imageUrl);
  const [editErrors, setEditErrors] = useState([]);
  const [deleteErrors, setDeleteErrors] = useState([]);
  const { selectedServer, setSelectedServer } = useSelectedServer();

  // when leaving the page:
  useEffect(() => {
    setSelectedServer(serverId);
    return () => {
      dispatch(getOneServer(serverId));
      dispatch(getServers());
    };
  }, [dispatch]);

  // helper function for clearing the form after submit
  const revert = () => {
    setName(name);
    setImageUrl(imageUrl);
  };

  // edit form validations
  useEffect(() => {
    const errors = [];
    setEditErrors(errors);
    if (!name) errors.push("Server name is required.");
    if (imageUrl?.length > 255) errors.push("Url cannot exceed length limit.");
    if (user.id !== servers[serverId]?.admin_id)
      errors.push("Only the admin can make server edits.");
    setEditErrors(errors);
  }, [name, imageUrl]);

  // delete button form validations
  useEffect(() => {
    const errors = [];
    setDeleteErrors(errors);
    if (user.id !== servers[serverId]?.admin_id)
      errors.push("Only the admin can make server edits.");
    setDeleteErrors(errors);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditErrors([]);
    let serverBody = {
      name,
      image_url: imageUrl,
    };
    // a user needs to be the admin in order to allow editing
    if (user.id === servers[serverId].admin_id) {
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

  if (user.id === servers[serverId].admin_id) {
    return (
      <div className="update-delete-server flex-column-center">
        <div className="edit-container">
          <br></br>
          <form
            className="edit-server-form flex-column"
            onSubmit={handleSubmit}
          >
            <div className="edit-title">Edit server details:</div>
            <input
              className="edit-input"
              type="name"
              placeholder="Name"
              value={name}
              required={true}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="edit-input"
              type="imageUrl"
              placeholder="Image Url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <ul className="errors">
              {editErrors.length > 0 &&
                editErrors.map((err) => (
                  <li id="err" key={err}>
                    {err}
                  </li>
                ))}
            </ul>
            <button
              className="edit-server-submit"
              type="submit"
              disabled={!!editErrors.length}
            >
              Submit
            </button>
            {user && user.id === servers[serverId].admin_id && (
              <>
                <button
                  disabled={!!deleteErrors.length}
                  id="delete-server-button"
                  onClick={deleteHandler}
                >
                  {" "}
                  Delete Server{" "}
                </button>
              </>
            )}
          </form>
        </div>

        <UpdateChannel />
      </div>
    );
  } else {
    history.push(`/server/${serverId}`);
    return null;
  }
};

export default UpdateServer;
