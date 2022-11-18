import React, { useState } from "react"
import { Modal } from "../../../context/Modal"
import CreateChannelForm from "./CreateChannelForm";

const CreateChannelFormModal = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className="create-channel-button-in-modal" onClick={() => setShowModal(true)}>Create New Channel</button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <CreateChannelForm setShowModal={setShowModal}/>
                </Modal>
            )}
        </>
    );
}

export default CreateChannelFormModal;
