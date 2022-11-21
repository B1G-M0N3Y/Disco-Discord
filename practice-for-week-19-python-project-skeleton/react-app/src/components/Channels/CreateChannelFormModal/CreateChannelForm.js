import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSelectedServer } from "../../../context/ServerContext";
import { createChannel, getCurrentChannels } from "../../../store/channels";
import { getChannelMessages } from "../../../store/channel_messages";
import { getServers } from "../../../store/servers";
import "./CreateChannelForm.css";

const CreateChannelForm = ({ setShowModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { selectedServer } = useSelectedServer();
  const [channelName, setChannelName] = useState("");

  const [validationErrors, setValidationErrors] = useState([]);

  // useEffect(() => {
  //   const errors = [];

  //   if (!channelName || channelName.length < 100 || channelName.length < 1) {
  //     errors.push(
  //       "Please enter valid Channel Name. Channel Name must be less than 100 characters."
  //     );
  //   }

  //   setValidationErrors(errors);
  // }, [channelName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newChannelInput;

    const errors = [];

    if (!channelName || channelName.length > 100 || channelName.length < 1) {
      errors.push(
        "Please enter valid Channel Name. Channel Name must be less than 100 characters."
      );
    }
    console.log(errors, errors.length, "errs");
    setValidationErrors(errors);

    if (errors.length === 0) {
      newChannelInput = {
        name: channelName,
        server_id: selectedServer,
      };

      const newChannel = await dispatch(
        createChannel(newChannelInput, selectedServer)
      );

      // Forcing re-render
      if (newChannel) {
        await dispatch(getServers());
        await dispatch(getCurrentChannels(selectedServer));
        await dispatch(getChannelMessages(newChannel.id));
        setShowModal(false);
        history.push(`/servers/${selectedServer}/channels/${newChannel?.id}`);
      }
    }
  };

  return (
    <div className="create-form-wrapper channel-form">
      <form className="create-channel-form" onSubmit={handleSubmit}>
        <div className="errors-create-channel-form">
          {validationErrors.length > 0 && (
            <ul className="create-channel-errors">
              {validationErrors.map((e) => (
                <li className="error" key={e}>
                  {e}
                </li>
              ))}
            </ul>
          )}
        </div>

        <label className="title-create-new-channel modal-title">
          CREATE NEW CHANNEL
        </label>
        <div className="modal-input">
          <label className="title-create-channel-input">Name</label>
          <input
            id="form-input-create-channel"
            type="text"
            name="name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            required
          />
        </div>

        <button className="button-create-channel" type="submit">
          Create New Channel
        </button>
      </form>
    </div>
  );
};

export default CreateChannelForm;
