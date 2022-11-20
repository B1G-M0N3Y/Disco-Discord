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
      <div class="landing-page">
        <div class="neon-title">
          <h2>FOLLOW THE CALL</h2>
          <h2>OF THE</h2>
          <h2>DISCO BALL</h2>
          {/* <h2>FOLLOW THE CALL OF THE DISCO BALL</h2> */}
          {/* <h1>Follow the Call</h1>
          <h2>of the</h2>
          <h1>Disco Ball</h1> */}
        </div>

        {currentUser && (
          <div>
          </div>
        )}

        {!currentUser && (
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
                onClick={() => history.push("/signup")}>
                <h2>SIGN UP</h2>
              </button>
            </div>
            <div>
              <button
                className="demo-button"
                onClick={() => loginDemoUser()}
              >
                LET'S BOOGIE
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LandingPage;
