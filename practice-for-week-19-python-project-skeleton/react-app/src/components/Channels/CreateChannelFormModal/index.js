import React, { useState } from "react";
import { Modal } from "../../../context/Modal";
import CreateChannelForm from "./CreateChannelForm";
import './CreateChannelForm.css'

const CreateChannelFormModal = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <i onClick={() => setShowModal(true)} class="fa-solid fa-plus"></i>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <CreateChannelForm setShowModal={setShowModal} />
        </Modal>
      )}
    </>
  );
};

export default CreateChannelFormModal;
