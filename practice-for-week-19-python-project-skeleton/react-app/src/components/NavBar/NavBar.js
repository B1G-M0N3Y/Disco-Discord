import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import ChannelList from "../Channels/ChannelList";
import "./NavBar.css";

const NavBar = () => {
  const sessionUser = useSelector((state) => state.session.user);

  let userDisplay;

  // Displays different options at the bottom of the navbar
  // depending on if a user is logged in
  if (sessionUser) {
    // if logged in, display user info
    userDisplay = (
      <>
        <div className="session-user-info">
          <img src={sessionUser.image_url}></img>
          <p>{sessionUser.username}</p>
        </div>
        <LogoutButton />
      </>
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
      <ul className="navbar">
        <ChannelList />
        <li>
          {/* TODO: Insert logo here */}
          <NavLink
            className="navlink"
            to="/home"
            exact={true}
            activeClassName="active"
          >
            LOGO HERE
          </NavLink>
        </li>

        <li>
          <NavLink
            className="navlink"
            to="/users"
            exact={true}
            activeClassName="active"
          >
            Users
          </NavLink>
        </li>
        {userDisplay}
      </ul>
    </nav>
  );
};

export default NavBar;
