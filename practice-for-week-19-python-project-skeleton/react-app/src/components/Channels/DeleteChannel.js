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
// import DeleteChannel from "./UpdateChannel";

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

  console.log("channelsFromServer", channelsFromServer);
  console.log("arrayOfNames", arrOfNames);

  const [name, setName] = useState();
  const [channelId, setChannelId] = useState(null);
  const [channelSelect, setChannelSelect] = useState([]);
  const [editErrors, setEditErrors] = useState([]);
  const [deleteErrors, setDeleteErrors] = useState([]);
  const { selectedServer, setSelectedServer } = useSelectedServer();

  console.log(serverId, "serverID in form");

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

  console.log(channelSelect, "SELECTED CHANNEL IN DELETE CHANNEL");
  console.log(channelId, "CHANNEL ID IN DELETE CHANNEL");

  // edit form validations
  useEffect(() => {
    const errors = [];
    setEditErrors(errors);
    if (channelSelect === []) errors.push("Please select a channel.");
    if (channelId === undefined) errors.push("Please select a channel.");
    if (!name) errors.push("Please enter a name.");
    if (arrOfNames?.includes(name)) errors.push("Channel names must be unique.");
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
    <div className="wrapper-container">
      <div className="edit-container">
        <br></br>
        <form className="delete-channel-form" onSubmit={editHandler}>
          <div>Edit Channel Details:</div>
          <select
            onChange={(e) => setChannelSelect(e.target.value)}
            value={channelSelect}
            placeholder="Delete Channel:"
          >
            <option value="" disabled selected>
              Select an channel...
            </option>
            {channelsArr?.map((channel) => {
              return <option key={channel.name}>{channel.name}</option>;
            })}
          </select>
          <div>Edit Channel Name: </div>
          <input
            type="name"
            placeholder="Channel Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <ul className="errors">
            {editErrors.length > 0 &&
              editErrors.map((err) => (
                <li id="err" key={err}>
                  {err}
                </li>
              ))}
              {/* Commented out to prevent double errors displaying */}
            {/* {deleteErrors.length > 0 &&
              deleteErrors.map((err) => (
                <li id="err" key={err}>
                  {err}
                </li>
              ))} */}
          </ul>
          <button
            className="edit-server-submit"
            type="submit"
            disabled={!!editErrors.length}
          >
            Submit
          </button>
          <button
            className="delete-server-submit"
            disabled={!!deleteErrors.length}
            onClick={handleClick}
          >
            Delete Channel
          </button>
        </form>
      </div>

      {/* <DeleteChannel channelId={channelId} /> */}
    </div>
  );
};

export default UpdateChannel;

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";
// import { getOneServer, getServers } from "../../store/servers";
// import { deleteChannel, getCurrentChannels } from "../../store/channels";
// import { useSelectedServer } from "../../context/ServerContext";

// const UpdateServer = ({ server }) => {
//   const dispatch = useDispatch();
//   const history = useHistory();
//   const user = useSelector((state) => state.session.user);
//   const servers = useSelector((state) => state.servers.servers);
//   const channels = useSelector((state) => state.channels.channels);
//   const channelsArr = Object.values(channels);

//   const [channelId, setChannelId] = useState();
//   const [channelSelect, setChannelSelect] = useState([]);
//   const [validationErrors, setValidationErrors] = useState([]);
//   const { selectedServer, setSelectedServer } = useSelectedServer();

//   console.log(server?.id, "serverID in form");

//   useEffect(() => {
//     return () => {
//       dispatch(getServers());
//       dispatch(getOneServer(selectedServer.id));
//       getCurrentChannels(selectedServer.id);
//     };
//   }, [dispatch]);

//   useEffect(() => {
//     let selected = channelsArr.find(
//       (channel) => channel.name === channelSelect
//     );
//     setChannelId(selected?.id);
//   }, [channelSelect]);

//   // helper function for clearing the form after submit
//   const revert = () => {
//     setChannelId();
//     setChannelSelect([]);
//   };

//   console.log(channelSelect, "SELECTED CHANNEL IN DELETE CHANNEL");
//   console.log(channelId, "CHANNEL ID IN DELETE CHANNEL");

//   // set user albums for form select
//   const updateChannel = (e) => {
//     setChannelSelect(e.target.value);
//   };

//   // form validations
//   useEffect(() => {
//     const errors = [];
//     setValidationErrors(errors);
//     // if (!name) errors.push("Server name is required.");
//     setValidationErrors(errors);
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setValidationErrors([]);
//     // a user needs to be the admin in order to allow editing
//     if (user.id === server?.admin_id) {
//       dispatch(deleteChannel(channelId));
//       return history.push("/");
//     }
//   };

//   if (!Object.values(servers).length) return null;

//   return (
//     <div className="wrapper-container">
//       <div className="edit-container">
//         <br></br>
//         <form className="delete-channel-form" onSubmit={handleSubmit}>
//           <div className="edit-title">Delete Channel:</div>
//           <select
//             onChange={updateChannel}
//             value={channelSelect}
//             placeholder="Delete Channel:"
//           >
//             <option value="" disabled selected>
//               Select an channel...
//             </option>
//             {channelsArr.map((channel) => {
//               return <option key={channel.name}>{channel.name}</option>;
//             })}
//           </select>
//           <ul className="errors">
//             {validationErrors.length > 0 &&
//               validationErrors.map((err) => (
//                 <li id="err" key={err}>
//                   {err}
//                 </li>
//               ))}
//           </ul>
//           <button
//             className="edit-server-submit"
//             type="submit"
//             disabled={!!validationErrors.length}
//           >
//             Delete Channel
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateServer;
