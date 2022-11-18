import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getOneServer, getServers } from "../../store/servers";
import { deleteChannel, getCurrentChannels } from "../../store/channels";
import { useSelectedServer } from "../../context/ServerContext";

const UpdateServer = ({ server }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const servers = useSelector((state) => state.servers.servers);
  const channels = useSelector((state) => state.channels.channels);
  const channelsArr = Object.values(channels);

  const [channelId, setChannelId] = useState();
  const [channelSelect, setChannelSelect] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const { selectedServer, setSelectedServer } = useSelectedServer();

  console.log(server?.id, "serverID in form");

  useEffect(() => {
    return () => {
      dispatch(getServers());
      dispatch(getOneServer(selectedServer.id));
      getCurrentChannels(selectedServer.id);
    };
  }, [dispatch]);

  useEffect(() => {
    let selected = channelsArr.find(
      (channel) => channel.name === channelSelect
    );
    setChannelId(selected?.id);
  }, [channelSelect]);

  // helper function for clearing the form after submit
  const revert = () => {
    setChannelId();
    setChannelSelect([]);
  };

  console.log(channelSelect, "SELECTED CHANNEL IN DELETE CHANNEL");
  console.log(channelId, "CHANNEL ID IN DELETE CHANNEL");

  // set user albums for form select
  const updateChannel = (e) => {
    setChannelSelect(e.target.value);
  };

  // form validations
  useEffect(() => {
    const errors = [];
    setValidationErrors(errors);
    // if (!name) errors.push("Server name is required.");
    setValidationErrors(errors);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors([]);
    // a user needs to be the admin in order to allow editing
    if (user.id === server?.admin_id) {
      dispatch(deleteChannel(channelId));
      return history.push("/");
    }
  };

  if (!Object.values(servers).length) return null;

  return (
    <div className="wrapper-container">
      <div className="edit-container">
        <br></br>
        <form className="delete-channel-form" onSubmit={handleSubmit}>
          <div className="edit-title">Delete Channel:</div>
          <select
            onChange={updateChannel}
            value={channelSelect}
            placeholder="Delete Channel:"
          >
            <option value="" disabled selected>
              Select an channel...
            </option>
            {channelsArr.map((channel) => {
              return <option key={channel.name}>{channel.name}</option>;
            })}
          </select>
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
            Delete Channel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateServer;
