import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../../store/session";
import { useSelectedServer } from "../../context/ServerContext";
import { useSelectedChannels } from "../../context/ChannelContext";
import "./LogoutButton.css"

const LogoutButton = () => {
  const { setShowChannels } = useSelectedChannels();
  const { setSelectedServer } = useSelectedServer();
  const dispatch = useDispatch();
  const history = useHistory();
  const onLogout = async (e) => {
    setShowChannels(null);
    setSelectedServer(null);
    await dispatch(logout());
    return history.push("/");
  };

  return (
    <button className="logout-button" onClick={onLogout}>
      Logout?
    </button>
  );
};

export default LogoutButton;
