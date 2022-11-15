import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import ChannelList from "../Channels/ChannelList";
import SidebarNav from "../SidebarNav";
import "./NavBar.css";

const NavBar = () => {
  // const [showLogout, setShowLogout] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);
  const [showLogout, setShowLogout] = useState(false);

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
            >
              LOGO HERE
            </NavLink>
            <SidebarNav />
          </div>
          <div className="flex-column-space-between">
            <div className="flex-column-start">
              <ChannelList />
            </div>
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
