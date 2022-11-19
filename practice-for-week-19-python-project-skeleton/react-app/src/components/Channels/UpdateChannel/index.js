import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { updateChannelThunk, getCurrentChannels, deleteChannel} from "../../../store/channels"
import { useSelectedChannels } from "../../../context/ChannelContext";

const UpdateChannel = ({ server, channelId }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const user = useSelector((state) => state.session.user);
    const userId = useSelector((state) => state.session.user.id);
    const servers = useSelector((state) => state.servers.servers);
    const channels = useSelector((state) => state.channels.channels);
    const serversArr = Object.values(servers);
    const channelsArr = Object.values(channels);


    // identify the server that matches the id from url
    const thisChannel = channelsArr.find((item) => item.id === channelId);

    // getters and setters for update channel form
    const [name, setName] = useState(thisChannel?.name);
    // const [channelId, setChannelId] = useState(channel?.id);

    const [validationErrors, setValidationErrors] = useState([]);
    const { selectedChannel, setSelectedChannel } = useSelectedChannels();

    useEffect(() => {
        dispatch(getCurrentChannels(channelId));
    })

    useEffect(() => {
        const errors = [];

        if (!name) errors.push("New Channel Name required for Update.")
        setValidationErrors(errors);

        if (!channelId) errors.push("No Channel found. Please check your Server.")
    }, [name, channelId])

    const handleSubmit = async (e) => {
        e.preventDefault();

        let updateChannelInputs;

        if (validationErrors.length > 0)
            updateChannelInputs = {
                name: name,
                channel_Id: channelId
            };

        dispatch(updateChannelThunk(updateChannelInputs, channelId));
        history.push("/servers")
    }

    return (
        <div className="wrapper-container">
          <div className="edit-channel-container">
            <br></br>
              {/* {user && user.id === thisChannel?.admin_id && ( */}
            <>
            <form className="edit-channel-form" onSubmit={handleSubmit}>
              <div className="edit-title">Edit Channel details below:</div>
              <input
                type="name"
                placeholder="Name"
                value={name}
                required={true}
                onChange={(e) => setName(e.target.value)}
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
                className="edit-channel-submit"
                type="submit"
                disabled={!!validationErrors.length}
              >
                Submit
              </button>
            </form>
            </>
             )
              {/* } */}
          </div>
          {/* <div className="delete-channel">
            <div>
              {userId === server.admin_id && <DeleteChannel server={server} />}
            </div>
          </div> */}
        </div>
      );
    };

export default UpdateChannel;
