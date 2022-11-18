import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import { useSelectedServer } from "../../context/ServerContext";

const LogoutButton = () => {
  const { setSelectedServer } = useSelectedServer();
  const dispatch = useDispatch();
  const onLogout = async (e) => {
    setSelectedServer(null);
    await dispatch(logout());
  };

  return (
    <button className="logout-button" onClick={onLogout}>
      Logout?
    </button>
  );
};

export default LogoutButton;
