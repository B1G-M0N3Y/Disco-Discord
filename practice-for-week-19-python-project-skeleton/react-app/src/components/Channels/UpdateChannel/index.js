import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { updateChannelThunk, getCurrentChannels, deleteChannel} from "../../../store/channels"

const UpdateChannel = ({channel})
    const dispatch = useDispatch();
    const history = useHistory();

    const user = useSelector((state) => state.session.user);
    const userId = useSelector((state) => state.session.user.id);
    const servers = useSelector((state) => state.servers.servers);
    const serverArr = Object.values(servers);

    // identify the server that matches the id from url
    const thisServer = serverArr.find((item) => item.id === server?.id);

    // getters and setters for update channel form
    const [name, setName] = useState(channel?.name);
    const [serverId, setServerId] = useState(server?.image_url);

    const [validationErrors, setValidationErrors] = useState([]);
    const { selectedServer, setSelectedServer } = useSelectedServer();
