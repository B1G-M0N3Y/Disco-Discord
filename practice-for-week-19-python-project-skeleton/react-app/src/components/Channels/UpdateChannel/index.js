import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { updateChannelThunk, getCurrentChannels, deleteChannel} from "../../../store/channels"
import { useSelectedChannels } from "../../../context/ChannelContext";

const UpdateChannel = ({channel})
    const dispatch = useDispatch();
    const history = useHistory();

    const user = useSelector((state) => state.session.user);
    const userId = useSelector((state) => state.session.user.id);
    const servers = useSelector((state) => state.servers.servers);
    const channels = useSelector((state) => state.servers.channels);
    const serversArr = Object.values(servers);
    const channelsArr = Object.values(channels);


    // identify the server that matches the id from url
    const thisChannel = channelsArr.find((item) => item.id === channel?.id);

    // getters and setters for update channel form
    const [name, setName] = useState(channel?.name);
    const [channelId, setChannelId] = useState(channel?.id);

    const [validationErrors, setValidationErrors] = useState([]);
    const { selectedChannel, setSelectedChannel } = useSelectedChannels();

    useEffect(() => {
        dispatch(getCurrentChannels(selectedChannel.id));
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

        const updatedChannel = await dispatch(updateChannelThunk(updateChannelInputs, selectedChannel?.id));
    }
