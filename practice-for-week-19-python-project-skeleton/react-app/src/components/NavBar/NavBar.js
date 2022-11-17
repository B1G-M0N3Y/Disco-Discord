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

import "./NavBar.css";

const NavBar = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [showLogout, setShowLogout] = useState(false);
  const [showChannels, setShowChannels] = useState(true);

  const sessionUser = useSelector((state) => state.session.user);
  const currServers = useSelector((state) => state.servers.servers);
  const thisServer = useSelector((state) => state.servers.currentServer);
  const currChannels = useSelector(
    (state) => state.servers.currentServer["channels"]
  );
  const { selectedServer, setSelectedServer } = useSelectedServer();
  const { selectedChannels, setSelectedChannels } = useSelectedChannels();

  console.log(selectedChannels, "SELECTED CHANNELS CONTEXT");
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
      setSelectedChannels(selectedServer.channels);
      if (selectedServer !== []) {
        dispatch(getOneServer(selectedServer.id));
      }
    }
  }, [dispatch, selectedServer]);

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
    if (selectedServer?.id !== null || selectedServer?.id !== undefined) {
      window.localStorage.setItem("SERVER", JSON.stringify(selectedServer));
    }
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

  let userDisplay;
  let serverDisplay;
  let channelDisplay;
  let channelList;

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

    if (Object.values(currServers).length) {
      serverDisplay = Object.values(currServers).map((server) => {
        console.log(JSON.parse(localStorage.getItem("SERVER")).id);
        console.log(server.id);

        if (JSON.parse(localStorage.getItem("SERVER")).id === server.id) {
          channelList = server["channels"]?.map((channel) => {
            return (
              <div key={channel.id}>
                <NavLink to={`/servers/${server.id}/channels/${channel?.id}`}>
                  {channel?.name}
                </NavLink>
              </div>
            );
          });
        }
        return (
          <div
            key={server.id}
            onClick={() => {
              // on click, set the selectedServer context
              setSelectedChannels(currChannels);
              setSelectedServer(server);
              setShowChannels(true);
              dispatch(getOneServer(server.id));
            }}
          >
            <div
              onClick={() => {
                history.push(`/servers/${server.id}`);
              }}
            >
              {server.name}
              <img
                alt={server.id}
                className="server-pic-nav"
                src={
                  "https://cdn3.vectorstock.com/i/1000x1000/35/52/placeholder-rgb-color-icon-vector-32173552.jpg"
                }
                // src={server.image_url}
              ></img>
            </div>
            {/* <ChannelList server={server} /> */}
          </div>
        );
      });
    }
    // // once a server is selected
    // if (thisServer !== {}) {
    //   channelDisplay = currChannels?.map((channel) => {
    //     return (
    //       <>
    //         <div key={channel.id}>
    //           <NavLink to={`/servers/${thisServer.id}/channels/${channel?.id}`}>
    //             {channel.name}
    //           </NavLink>
    //         </div>
    //       </>
    //     );
    //   });
    // }

    // // if the user has servers and a server is not selected:
    // if (serversArray && window.localStorage.getItem("SERVER") === "null") {
    //   channelDisplay = firstChannels?.map((channel) => {
    //     return (
    //       <div key={channel.id}>
    //         <NavLink to={`/servers/${firstServer.id}/channels/${channel?.id}`}>
    //           {channel.name}
    //         </NavLink>
    //       </div>
    //     );
    //   });
    // }
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
                    setSelectedServer(thisServer);
                    history.push(`/servers/${thisServer.id}/update`);
                  }}
                >
                  {selectedServer?.name
                    ? selectedServer?.name
                    : firstServer?.name}
                </div>
                <div>{channelDisplay}</div>
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
};

export default NavBar;
