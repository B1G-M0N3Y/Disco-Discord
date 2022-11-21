import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getOneServer, getServers } from "../../store/servers";
import {
  deleteChannel,
  getCurrentChannels,
  updateChannel,
} from "../../store/channels";
import { useSelectedServer } from "../../context/ServerContext";
import "../Servers/UpdateServer/UpdateServer.css";

const UpdateChannel = ({ server }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { serverId } = useParams();
  const user = useSelector((state) => state.session.user);
  const servers = useSelector((state) => state.servers.servers);
  const currServer = useSelector((state) => state.servers.servers[serverId]);
  const channelsFromServer = currServer?.channels;
  let channelsArr;
  if (channelsFromServer) channelsArr = Object.values(channelsFromServer);
  let arrOfNames;
  if (channelsArr) arrOfNames = channelsArr.map((channel) => channel.name);

  const [name, setName] = useState();
  const [channelId, setChannelId] = useState(null);
  const [channelSelect, setChannelSelect] = useState([]);
  const [editErrors, setEditErrors] = useState([]);
  const [deleteErrors, setDeleteErrors] = useState([]);

  useEffect(() => {
    return () => {
      dispatch(getServers());
      dispatch(getOneServer(serverId));
      getCurrentChannels(serverId);
    };
  }, [dispatch]);

  useEffect(() => {
    let selected = channelsArr?.find(
      (channel) => channel?.name == channelSelect
    );
    setChannelId(selected?.id);
  }, [channelSelect]);

  // helper function for clearing the form after submit
  const revert = () => {
    setChannelId();
    setChannelSelect([]);
  };

  // edit form validations
  useEffect(() => {
    const errors = [];
    setEditErrors(errors);
    if (channelSelect === []) errors.push("Please select a channel.");
    if (channelId === undefined) errors.push("Please select a channel.");
    if (!name) errors.push("Please enter a name.");
    if (arrOfNames?.includes(name))
      errors.push("Channel names must be unique.");
    if (user.id !== servers[serverId]?.admin_id)
      errors.push("Only the admin can make channel edits.");
    setEditErrors(errors);
  }, [channelSelect, channelId, name]);

  // delete button form validations
  useEffect(() => {
    const errors = [];
    setDeleteErrors(errors);
    if (channelSelect === []) errors.push("Please select a channel.");
    if (channelId === undefined) errors.push("Please select a channel.");
    if (user.id !== servers[serverId]?.admin_id)
      errors.push("Only the admin can make channel edits.");
    setDeleteErrors(errors);
  }, [channelSelect, channelId]);

  const handleClick = async (e) => {
    e.preventDefault();
    revert();
    await dispatch(deleteChannel(channelId));
    await dispatch(getServers());
    return history.push(`/servers/${serverId}/edit`);
  };

  const editHandler = async (e) => {
    e.preventDefault();
    setEditErrors([]);
    let channelBody = {
      name,
    };
    revert();
    // a user needs to be the admin in order to allow editing
    if (user.id === servers[serverId].admin_id) {
      await dispatch(updateChannel(channelBody, channelId));
      await dispatch(getServers());
      return history.push(`/servers/${serverId}/edit`);
    }
  };

  if (!Object.values(servers).length) return null;

  return (
    <div className="update-delete-server flex-column-center">
      <div className="edit-container">
        <br></br>
        <form className="edit-server-form flex-column" onSubmit={editHandler}>
          <div className="edit-title">Edit Channel Details:</div>
          <br></br>
          <select
            className="channel-select"
            onChange={(e) => setChannelSelect(e.target.value)}
            value={channelSelect}
            placeholder="Delete Channel:"
          >
            <option value="" disabled selected className="select-dropdown">
              Select an channel...
            </option>
            {channelsArr?.map((channel) => {
              return <option key={channel.name}>{channel.name}</option>;
            })}
          </select>
          <div className="edit-name">Edit Channel Name: </div>
          <input
            className="edit-input"
            type="name"
            placeholder="Channel Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br></br>
          <div className="errors">
            {editErrors.length > 0 &&
              editErrors.map((err) => (
                <li id="err" key={err}>
                  {err}
                </li>
              ))}
          </div>
          <br></br>
          <button
            className={
              editErrors.length > 0 ? "edit-disabled" : "edit-server-submit"
            }
            type="submit"
            disabled={!!editErrors.length}
          >
            Submit
          </button>
          <button
            className={
              deleteErrors.length > 0 ? "edit-disabled" : "delete-server-button"
            }
            disabled={!!deleteErrors.length}
            onClick={handleClick}
          >
            Delete Channel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateChannel;
