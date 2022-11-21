import React, { useState } from "react"
import { Modal } from "../../../context/Modal"
import CreateServerForm from "./CreateServerForm"

const CreateServerFormModal = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className="create-server-button-in-modal" onClick={() => setShowModal(true)}>+</button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <CreateServerForm setShowModal={setShowModal}/>
                </Modal>
            )}
        </>
    );
}

export default CreateServerFormModal;
