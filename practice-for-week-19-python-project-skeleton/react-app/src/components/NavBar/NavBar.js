import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
// import SidebarNav from "../SidebarNav";
import { getServers } from "../../store/servers";
import { getCurrentChannels } from "../../store/channels";
// import { getChannels } from "../../store/channels";
import { useSelectedServer } from "../../context/ServerContext";
import { useSelectedChannels } from "../../context/ChannelContext";
import { useSelectedMessages } from "../../context/MessageContext";

import "./NavBar.css";
import CreateServerFormModal from "../Servers/CreateServerFormModal";
import Chat from "../Chat";
import CreateChannelFormModal from "../Channels/CreateChannelFormModal";

const NavBar = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [showLogout, setShowLogout] = useState(false);

  const [currServerId, setCurrServerId] = useState();

  const sessionUser = useSelector((state) => state.session.user);
  const currServers = useSelector((state) => state.servers.servers);

  const { setShowMessages } = useSelectedMessages();
  const { showChannels, setShowChannels } = useSelectedChannels(false);
  const { selectedServer, setSelectedServer } = useSelectedServer();
  const { setSelectedChannel } = useSelectedChannels(false);

  //open logout menu
  const openLogout = () => {
    if (showLogout) return;
    setShowLogout(true);
  };

  // close logout
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
  }, [selectedServer]);

  // conditionally render the channels with state boolean
  useEffect(() => {
    dispatch(getServers());
    if (sessionUser) {
      setShowChannels(true);
    } else {
      setShowChannels(false);
    }
  }, [dispatch, sessionUser]);

  let userDisplay;

  // Displays logged in/out links
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
    const channelList = currServers[selectedServer]?.channels?.map(
      (channel, idx) => (
        <div
          className="channel-nav chat-nav"
          onClick={() => {
            setSelectedChannel(channel);
            history.push(`/servers/${selectedServer}/channels/${channel?.id}`);
          }}
        >
          <div className="width-90">{channel.name}</div>
        </div>
      )
    );
    const serverDisplay = Object.values(currServers).map((server) => (
      <div
        key={server.id}
        onClick={() => {
          dispatch(getCurrentChannels(server.id));
          setCurrServerId(server.id);
          setSelectedServer(server.id);
          history.push(`/servers/${server?.id}`);
        }}
      >
        <div>
          <img
            alt={currServerId}
            className="server-pic-nav"
            src="https://res.cloudinary.com/duvgdb8rd/image/upload/v1668887061/serverStockImg_lxsd2e.png"
          ></img>
          {/* TODO: don't display the name here */}
          {/* <p>{server.name}</p> */}
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
                to="/chats"
                exact={true}
                activeClassName="active"
                onClick={() =>
                  // setShowChannels(false)
                  setSelectedServer(null)
                }
              >
                <img
                  alt={currServerId}
                  className="server-pic-nav"
                  src="https://res.cloudinary.com/duvgdb8rd/image/upload/v1668891927/discoball3_fi1fmg.png"
                ></img>
              </NavLink>
              {sessionUser && (
                <div className="server-dropdown">
                  {serverDisplay}
                  <CreateServerFormModal />
                </div>
              )}
            </div>
            <div className="flex-column-space-between channels-chats">
              {selectedServer && (
                <div className="flex-column-start">
                  <div className="server-name">
                    <div
                      className="width-90"
                      onClick={() => {
                        dispatch(getServers());
                        // setSelectedServer(currServers[selectedServer?.id]);
                        setShowMessages(false);
                        history.push(`/servers/${selectedServer}/edit`);
                      }}
                    >
                      <div>{currServers[selectedServer]?.name}</div>
                    </div>
                    {sessionUser.id ===
                      currServers[selectedServer]?.admin_id && (
                      <i
                        onClick={() => {
                          dispatch(getServers());
                          // setSelectedServer(currServers[selectedServer?.id]);
                          setShowMessages(false);
                          history.push(`/servers/${selectedServer}/edit`);
                        }}
                        class="fa-solid fa-pen-to-square"
                      ></i>
                    )}
                  </div>
                  <div>
                    <hr />
                  </div>

                  {selectedServer &&
                    sessionUser.id ===
                      currServers[selectedServer]?.admin_id && (
                      <CreateChannelFormModal />
                    )}

                  <div>{channelList}</div>
                </div>
              )}
              {!selectedServer && sessionUser && <Chat />}
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
              <div className="flex-column-end">{userDisplay}</div>
            </div>
          </div>
        </div>
      </nav>
    );
  } else {
    return <></>;
  }
};

export default NavBar;
