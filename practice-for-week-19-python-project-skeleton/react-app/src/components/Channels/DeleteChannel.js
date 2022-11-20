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
  const [channelName, setChannelName] = useState([]);
  const { selectedServer, setSelectedServer } = useSelectedServer();

  console.log(server?.id, "serverID in form");

  useEffect(() => {
    return () => {
      dispatch(getServers());
      dispatch(getOneServer(selectedServer?.id));
      getCurrentChannels(selectedServer?.id);
    };
  }, [dispatch]);

  useEffect(() => {
    let selected = server.channels.find(
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
    console.log('da id', channelId)
    // a user needs to be the admin in order to allow editing
    if (user.id === server?.admin_id) {
      // dispatch(deleteChannel(channelId));
      // return history.push(`/servers/${selectedServer}`);
      await fetch(`/channels/${channelId}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({name: channelName})
      })
      history.push(`/servers/${selectedServer}/channels/${channelId}`)
    }
  };


  if (!Object.values(servers).length) return null;

  return (
    <div className="wrapper-container">
      <div className="edit-container">
        <br></br>
        <div className="edit-title">Update or Delete Channel:</div>
        <form className="delete-channel-form" onSubmit={handleSubmit}>
          <select
            onChange={updateChannel}
            value={channelSelect}
            placeholder="Delete Channel:"
          >
            <option value="" disabled selected>
              Select an channel...
            </option>
            {server.channels.map((channel) => {
              return <option key={channel.name} value={channel.id}>{channel.name}</option>;
            })}
          </select>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          ></input>
          <button type="submit"> Update Name</button>
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
            // type="submit"
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
