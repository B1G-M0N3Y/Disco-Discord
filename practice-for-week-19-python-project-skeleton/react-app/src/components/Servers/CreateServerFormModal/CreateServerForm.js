import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSelectedServer } from "../../../context/ServerContext";
import { createServer } from "../../../store/servers";
import "./CreateServerFormModal.css";

const CreateServerForm = ({setShowModal}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const currentUser = useSelector((state) => state.session.user)
    const selectedServer = useSelectedServer()

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

        setValidationErrors(errors)
    }, [serverName, imageURL, adminId])

    const handleSubmit = async (e) => {
        console.log("TESTING")
        e.preventDefault();

        let createServerInputs;

        if (validationErrors.length > 0)
            createServerInputs = {
                name: serverName,
                image_url: imageURL,
                admin_id: adminId
            };

        console.log("THESE ARE CREATE SERVER INPUTS", createServerInputs)

        dispatch(createServer(createServerInputs));
        // selectedServer(newServer);
        // console.log("THIS IS NEW SERVER VARIABLE: ", newServer)
        setShowModal(false)
        return history.push(`/servers`);
    };

    return (
        <form
        className='create-server-form'
        onSubmit={handleSubmit}>

        <div className="errors-create-server-form">
            {validationErrors.length > 0 && (
                <ul className="create-spot-errors">
                    {validationErrors.map(e => (
                        <li key={e}>{e}</li>
                        ))}
                </ul>
            )}
        </div>

      <label id="title-create-new-server">CREATE NEW SERVER</label>
      <label id="title-create-server-input">Name of New Server</label>
      <input
        id="form-input-create-server"
        type="text"
        name="name"
        value={serverName}
        onChange={(e) => setServerName(e.target.value)}
      />

      <label id="title-create-server-input">Server Profile Image - URL</label>
      <input
        id="form-input-create-server"
        type="url"
        name="imageURL"
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
      />

      {/* <label id="title-create-server-input">Server Owner - UserId</label>
                <input id="form-input-create-server"
                type="text"
                name="adminId"
                value={adminId}
                onChange={e => setAdminId(e.target.value)}
                /> */}

      <button className="button-create-server" type="submit">
        Create New Server
      </button>
    </form>
  );
};

export default CreateServerForm;
