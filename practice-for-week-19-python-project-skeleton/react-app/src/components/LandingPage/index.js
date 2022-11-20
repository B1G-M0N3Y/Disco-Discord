import ServerCard from "./ServerCard";
import "./LandingPage.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { login } from "../../store/session";
import { getAllServers } from "../../store/servers";

const LandingPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const allServers = useSelector((state) => state.servers.allServers);
  const serversArr = Object.values(allServers);
  const history = useHistory();

  useEffect(() => {
    dispatch(getAllServers());
  }, []);
  console.log(allServers, "all servers");

  // Logs in a default demo user
  const loginDemoUser = async () => {
    await dispatch(login("demo@aa.io", "password"));
  };

  return (
    <>
      {currentUser && (
        <div>
            <div class="logged-in-landing">
              <div class="logged-in-neon-title">
                <h2>BAD DECISIONS MAKE BETTER STORIES</h2>
                <h1>let's create memories</h1>
              </div>
              <div className="server-card-container">
                {/* TODO: Write Loop For all public servers */}
                  <h2 id="sc-1">1</h2>
                  <h2 id="sc-2">2</h2>
                  <h2 id="sc-1">3</h2>
                  <h2 id="sc-2">4</h2>
                  <h2 id="sc-1">5</h2>
                  <h2 id="sc-2">6</h2>
                  <h2 id="sc-1">7</h2>
                  <h2 id="sc-2">8</h2>
                  <h2 id="sc-1">9</h2>
              </div>
            </div>
        </div>
      )}

      {!currentUser && (
        <div class="landing-page">
          <div class="neon-title">
            <h2>follow the call</h2>
            <h2>of the</h2>
            <h2>disco ball</h2>
          </div>

          <div className="auth-container">
            <div>
              <button
                className="landing-buttons" id="lb-1"
                onClick={() => history.push("/login")}>
                <h2>LOGIN</h2>
              </button>
            </div>

            <div>
              <button
                className="landing-buttons" id="lb-2"
                onClick={() => history.push("/sign-up")}>
                <h2>SIGN UP</h2>
              </button>
            </div>

            <div>
              <button
                className="demo-button"
                onClick={() => loginDemoUser()}
              > let's boogie
              </button>
            </div>
          </div>
        </div>
        )}
    </>
  );
};

export default LandingPage;
