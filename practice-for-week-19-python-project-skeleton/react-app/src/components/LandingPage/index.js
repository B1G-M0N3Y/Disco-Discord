import ServerCard from "./ServerCard";
import "./LandingPage.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { login } from "../../store/session";
import { getAllServers } from "../../store/servers";

const LandingPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const allServers = useSelector((state) => state.servers.allServers);
  const serversArr = Object.values(allServers);

  useEffect(() => {
    dispatch(getAllServers());
  }, []);

  // Logs in a default demo user
  const loginDemoUser = async () => {
    await dispatch(login("demo@aa.io", "password"));
  };

  return (
    <>
      <div className="landing-page">
        <h1>Welcome to the party!</h1>
        {currentUser && (
          <div>
            <h3>Explore our open clubs:</h3>
            {/*displays a grid of available public servers */}
            <div className="server-card-container">
              {/* TODO: Write Loop For all public servers */}
              <ServerCard />
              <ServerCard />
              <ServerCard />
              <ServerCard />
              <ServerCard />
              <ServerCard />
              <ServerCard />
              <ServerCard />
            </div>
          </div>
        )}

        {!currentUser && (
          <div className="auth-container">
            <NavLink className="navlink landing-button" to="/login">
              Login
            </NavLink>
            <NavLink className="navlink landing-button" to="/sign-up">
              Sign Up
            </NavLink>
            <button
              className="demo-login landing-button"
              onClick={() => loginDemoUser()}
            >
              Demo User
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default LandingPage;
