import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import ChannelList from "../Channels/ChannelList";
import SidebarNav from "../SidebarNav";
import { getServers, getOneServer } from "../../store/servers";
import { getChannels } from "../../store/channels";
import { useSelectedServer } from "../../context/ServerContext";
import "./NavBar.css";

const NavBar = ({ servers }) => {
  const dispatch = useDispatch();
  // const [showLogout, setShowLogout] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showChannels, setShowChannels] = useState(false);

  const sessionUser = useSelector((state) => state.session.user);
  const { selectedServer, setSelectedServer } = useSelectedServer();

  const openLogout = () => {
    if (showLogout) return;
    setShowLogout(true);
  };

  useEffect(() => {
    if (!showLogout) return;

    const closeLogout = () => {
      setShowLogout(false);
    };

    document.addEventListener("click", closeLogout);

    return () => document.removeEventListener("click", closeLogout);
  }, [showLogout]);

  useEffect(() => {
    dispatch(getServers());
    if (selectedServer?.id) {
      dispatch(getOneServer(selectedServer.id));
      console.log("MY SERVER", selectedServer);
      dispatch(getChannels(selectedServer.channels));
      setShowChannels(true);
    }
    if (localStorage.getItem("SERVER") === null) {
      setShowChannels(false);
    }
  }, [dispatch, selectedServer]);

  useEffect(() => {
    const data = window.localStorage.getItem(
      "MY_KEY",
      JSON.stringify(showChannels)
    );
    if (data) {
      setShowChannels(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("MY_KEY", JSON.stringify(showChannels));
  }, [showChannels]);

  let userDisplay;

  // Displays different options at the bottom of the navbar
  // depending on if a user is logged in
  if (sessionUser) {
    // if logged in, display user info
    userDisplay = (
      <div className="session-user-info">
        {showLogout ? (
          <LogoutButton />
        ) : (
          <>
            <img className="user-pic-nav" src={sessionUser.image_url}></img>
            <p className="username-nav">{sessionUser.username}</p>
            <i
              onClick={openLogout}
              className="fa-solid fa-right-from-bracket"
            ></i>
          </>
        )}
      </div>
    );
  } else {
    // if not logged in, display additional buttons for login and sign up
    userDisplay = (
      <>
        <NavLink to="/login" exact={true} activeClassName="active">
          Login
        </NavLink>
        <NavLink to="/sign-up" exact={true} activeClassName="active">
          Sign Up
        </NavLink>
      </>
    );
  }

  return (
    <nav>
      <div className="navbar">
        {/* TODO: Insert logo here */}
        <div className="flex-row">
          <div className="flex-column-start server-list">
            <NavLink
              className="navlink"
              to="/home"
              exact={true}
              activeClassName="active"
              onClick={() => setShowChannels(false)}
            >
              LOGO HERE
            </NavLink>
            <SidebarNav servers={servers} />
          </div>
          <div className="flex-column-space-between">
            {showChannels && (
              <div className="flex-column-start">
                <ChannelList channelArr={selectedServer.channels} />
              </div>
            )}
            {!showChannels && (
              <div className="flex-column-start">CHATS HERE</div>
            )}

            <div className="flex-column-end">
              <NavLink
                className="navlink"
                to="/users"
                exact={true}
                activeClassName="active"
              >
                Users
              </NavLink>
              {userDisplay}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
