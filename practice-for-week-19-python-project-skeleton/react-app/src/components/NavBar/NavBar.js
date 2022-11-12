import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import ChannelList from "../Channels/ChannelList";
import './NavBar.css'

const NavBar = () => {
  return (
    <nav>
      <ul className="navbar">
        <ChannelList />
        <li>
          <NavLink className="navlink" to="/home" exact={true} activeClassName="active">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink className="navlink" to="/login" exact={true} activeClassName="active">
            Login
          </NavLink>
        </li>
        <li>
          <NavLink className="navlink" to="/sign-up" exact={true} activeClassName="active">
            Sign Up
          </NavLink>
        </li>
        <li>
          <NavLink className="navlink" to="/users" exact={true} activeClassName="active">
            Users
          </NavLink>
        </li>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
