import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
// import ChannelList from "../Channels/ChannelList";
// import SidebarNav from "../SidebarNav";
import { getServers, getOneServer } from "../../store/servers";
import { getChannels } from "../../store/channels";
import { useSelectedServer } from "../../context/ServerContext";
import { useSelectedChannels } from "../../context/ChannelContext";

import "./NavBar.css";
import LandingPage from "../LandingPage";
import PrivateMessages from "../PrivateMessages";
import Chat from "../Chat";

const NavBar = ({ servers }) => {
  const dispatch = useDispatch();
  const [showLogout, setShowLogout] = useState(false);
  const [showChannels, setShowChannels] = useState(false);

  const sessionUser = useSelector((state) => state.session.user);
  const currServers = useSelector((state) => state.servers.servers);
  const thisServer = useSelector((state) => state.servers.currentServer);
  // const currChannels = useSelector((state) => state.channels.channels);

  const { selectedServer, setSelectedServer } = useSelectedServer();
  const { setSelectedChannels } = useSelectedChannels();

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

  // conditionally render the channels with state boolean
  useEffect(() => {
    dispatch(getServers());
    if (sessionUser) {
      setShowChannels(true);
    } else {
      setShowChannels(false);
    }
  }, [sessionUser]);

  // if selected server changes, update store
  useEffect(() => {
    if (selectedServer?.id) {
      setSelectedChannels(selectedServer.channels);
      dispatch(getChannels(selectedServer.channels));
      if (selectedServer !== []) {
        dispatch(getOneServer(selectedServer.id));
      }
    }
  }, [selectedServer]);

  // save the selected server in local storage
  // (cleared on logout and login)
  useEffect(() => {
    const data = window.localStorage.getItem(
      "SERVER",
      JSON.stringify(selectedServer)
    );
    if (data) {
      setSelectedServer(JSON.parse(data));
    }
  }, []);

  // on click, server context changes and gets stored in local storage
  useEffect(() => {
    window.localStorage.setItem("SERVER", JSON.stringify(selectedServer));
  }, [selectedServer]);

  const serversArray = Object.values(currServers);
  const firstServer = serversArray[0];
  let firstChannels;
  let selChannels;
  if (firstServer) {
    firstChannels = firstServer.channels;
  }
  if (thisServer) {
    selChannels = thisServer.channels;
  }

  // console.log(serversArray, "SERVERS ARRAY");
  // console.log(firstServer, "FIRST SERVER");
  // console.log(firstChannels, "FIRST CHANNELS");
  // console.log(thisServer, "THIS SERVER");
  // console.log(selChannels, "SELECTED CHANNELS");

  let userDisplay;
  let serverDisplay;
  let channelDisplay;

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

    // display the user's servers
    if (Object.values(currServers).length) {
      serverDisplay = Object.values(currServers).map((server) => {
        return (
          <div
            key={server.id}
            onClick={() => {
              // on click, set the selectedServer context
              setSelectedServer(server);
              setShowChannels(true);
            }}
          >
            <div>{server?.name}</div>
            <NavLink to={`/servers/${server.id}`}>{server.image_url}</NavLink>
          </div>
        );
      });
    }
    // once a server is selected
    if (thisServer !== {}) {
      channelDisplay = selChannels?.map((channel) => {
        return (
          <div key={channel.id}>
            <NavLink to={`/servers/${firstServer?.id}/channels/${channel?.id}`}>
              {channel.name}
            </NavLink>
          </div>
        );
      });
    }
    // if the user has servers and a server is not selected:
    if (serversArray && window.localStorage.getItem("SERVER") === "null") {
      channelDisplay = firstChannels?.map((channel) => {
        return (
          <div key={channel.id}>
            <NavLink to={`/servers/${firstServer.id}/channels/${channel?.id}`}>
              {channel.name}
            </NavLink>
          </div>
        );
      });
    }
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
              to="/chat"
              exact={true}
              activeClassName="active"
              onClick={() => setShowChannels(false)}
            >
              PRIVATE CHATS
            </NavLink>
            {sessionUser && <>{serverDisplay}</>}
          </div>
          <div className="flex-column-space-between">
            {showChannels && (
              <div className="flex-column-start">{channelDisplay}</div>
            )}
            {!showChannels && sessionUser && (
              <Chat />
            )}
            {!showChannels && !sessionUser && (
              <div className="flex-column-start">
                <div>Discover</div>
                <NavLink
                  className="navlink"
                  to="/"
                  exact={true}
                  activeClassName="active"
                >
                  Home
                </NavLink>
              </div>
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
