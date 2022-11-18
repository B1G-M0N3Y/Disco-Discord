import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteServerThunk } from "../../../store/servers";
import "./DeleteServerButton.css"

const DeleteServerButton = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const currentUser = useSelector((state) => state.session.user)

    const deleteHandler = async () => {
        await dispatch(deleteServerThunk(spotId));
        alert("Server Successfully Deleted")
        history.push("/")
    }

    return (
        <div id='button'>
            {currentUser && currentUser.id === Server.adminId && (
                <>
                < button id="delete-server-button"
                    onClick={deleteHandler}
                    > Delete Server </button>
                </>
            )}
    </div>
)}

export default DeleteServerButton;
