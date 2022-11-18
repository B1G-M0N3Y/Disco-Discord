import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import ChannelList from "../Channels/ChannelList";
// import SidebarNav from "../SidebarNav";
import { getServers, getOneServer } from "../../store/servers";
// import { getChannels } from "../../store/channels";
import { useSelectedServer } from "../../context/ServerContext";
import { useSelectedChannels } from "../../context/ChannelContext";
import { useSelectedMessages } from "../../context/MessageContext";

import "./NavBar.css";

const NavBar = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [showLogout, setShowLogout] = useState(false);
  const [currServerId, setCurrServerId] = useState();

  const sessionUser = useSelector((state) => state.session.user);
  const currServers = useSelector((state) => state.servers.servers);
  const thisServer = currServers[currServerId];
  const currChannels = useSelector(
    (state) => state.servers.currentServer["channels"]
  );
  const { selectedServer, setSelectedServer } = useSelectedServer();
  const { showChannels, setShowChannels, selectedChannel, setSelectedChannel } =
    useSelectedChannels(false);
  const { showMessages, setShowMessages } = useSelectedMessages();

  // console.log(selectedChannels, "SELECTED CHANNELS CONTEXT");
  console.log(selectedServer, "SELECTED SERVER CONTEXT");
  console.log(typeof currChannels, "currChannels, typof on line 32");
  console.log(currChannels, "currChannels");

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
  }, [dispatch, sessionUser]);

  // if selected server changes, update store
  useEffect(() => {
    if (selectedServer?.id) {
      // setSelectedChannels(selectedServer.channels);
      if (selectedServer !== []) {
        dispatch(getOneServer(selectedServer.id));
      }
    }
  }, [dispatch, selectedServer]);

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
            <img
              alt={sessionUser.id}
              className="user-pic-nav"
              src={sessionUser.image_url}
            ></img>
            <p className="username-nav">{sessionUser.username}</p>
            <i
              onClick={openLogout}
              className="fa-solid fa-right-from-bracket"
            ></i>
          </>
        )}
      </div>
    );
    const channelList = currServers[currServerId]?.channels.map(
      (channel, idx) => (
        <div
          onClick={() => {
            setShowMessages(true);
            setSelectedChannel(channel);
            console.log(showMessages, "SHOW MESSAGE CONTEXT");
            history.push("/servers");
          }}
        >
          {channel.name}
        </div>
      )
    );
    const serverDisplay = Object.values(currServers).map((server) => (
      <div
        key={server.id}
        onClick={() => {
          setShowChannels(true);
          setCurrServerId(server.id);
        }}
      >
        <div>
          {server.name}
          <img
            alt={currServerId}
            className="server-pic-nav"
            src={
              "https://cdn3.vectorstock.com/i/1000x1000/35/52/placeholder-rgb-color-icon-vector-32173552.jpg"
            }
          ></img>
        </div>
      </div>
    ));

    return (
      <nav>
        <div className="navbar">
          {/* TODO: Insert logo here */}
          <div className="flex-row">
            <div className="flex-column-start server-list">
              <NavLink
                className="navlink"
                to="/"
                exact={true}
                activeClassName="active"
                onClick={() => setShowChannels(false)}
              >
                LOGO HERE
              </NavLink>
              {sessionUser && <>{serverDisplay}</>}
            </div>
            <div className="flex-column-space-between channels-chats">
              {showChannels && (
                <div className="flex-column-start">
                  <div
                    onClick={() => {
                      dispatch(getServers());
                      setSelectedServer(currServers[selectedServer?.id]);
                      setShowMessages(false);
                      console.log(showMessages, "SHOW MESSAGE CONTEXT");
                      history.push(`/servers`);
                    }}
                  >
                    {currServers[currServerId]?.name}
                  </div>
                  {/* <div>{channelDisplay}</div> */}
                  <div>{channelList}</div>
                </div>
              )}
              {!showChannels && sessionUser && (
                <div className="flex-column-start">CHATS HERE</div>
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
  }
};

export default NavBar;
