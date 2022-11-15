import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { addServer } from "../../../store/servers";
import "./CreateServerFormModal.css";

const CreateServerForm = ({setShowModal}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const currentUser = useSelector((state) => state.session.user)

    const [serverName, setServerName] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [adminId, setAdminId] = useState(currentUser.id);

    const [validationErrors, setValidationErrors] = useState('');

    useEffect(() => {
        const errors = [];

        if (!serverName || serverName.length < 100 || serverName.length < 5) {
            errors.push("Please enter valid Server Name. Server Name must be more than 5 and less than 100 characters.");
        }

        if (imageURL.length > 255) {
            errors.push("Please enter a vaild Image URL. Image URL must be less than 255 characters");
        }

        if (!adminId) {
            errors.push("Please log in to create a new server");
        }

    }, [serverName, imageURL, adminId])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validationErrors.length > 0) return
            const createServerInputs = {
                serverName,
                imageURL,
                adminId
            };

        let newServer = await dispatch(addServer(createServerInputs));
        setShowModal(false)
        return history.push(`/servers/${newServer.id}`);

    }
}
