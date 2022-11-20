import ServerCard from "./ServerCard";
import "./LandingPage.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { login } from "../../store/session";
import { getAllServers } from "../../store/servers";

const LandingPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const allServers = useSelector((state) => state.servers.allServers);
  const serversArr = Object.values(allServers).slice(0, 9);

  useEffect(() => {
    dispatch(getAllServers());
  }, []);
  console.log(allServers, "all servers");

  // Logs in a default demo user
  const loginDemoUser = async () => {
    await dispatch(login("demo@aa.io", "password"));
  };

  const isEven = (id) => {
    if (id % 2 === 0) {
      return true;
    }
  };

  return (
    <>
      {currentUser && (
        <div>
          <div class="logged-in-landing">
            <div class="logged-in-neon-title">
              <div id="title-1">
                <h2>BAD DECISIONS. MAKE BETTER STORIES.</h2>
                {/* <h2>MAKE BETTER STORIES</h2> */}
              </div>
              <div>
                <h1 id="title-2">let's create some memories.</h1>
                <img
                  id="disco-gif"
                  alt="disco"
                  src="https://i.pinimg.com/originals/15/1f/07/151f073cab6e304361f4f22577756974.gif"
                ></img>
              </div>
            </div>
            <div className="server-card-container">
              {/* TODO: Write Loop For all public servers */}
              {serversArr.map((server) => {
                let isAqua = isEven(server.id);
                return (
                  <>
                    <button
                      id={isAqua ? "sc-1" : "sc-2"}
                      onClick={() => history.push("/servers/1")}
                    ></button>
                  </>
                );
              })}

              <button
                id="sc-2"
                onClick={() => history.push("/servers/2")}
              ></button>
              <button
                id="sc-1"
                onClick={() => history.push("/servers/3")}
              ></button>
              <button
                id="sc-2"
                onClick={() => history.push("/servers/4")}
              ></button>
              <button
                id="sc-1"
                onClick={() => history.push("/servers/5")}
              ></button>
              <button
                id="sc-2"
                onClick={() => history.push("/servers/6")}
              ></button>
              <button
                id="sc-1"
                onClick={() => history.push("/servers/7")}
              ></button>
              <button
                id="sc-2"
                onClick={() => history.push("/servers/8")}
              ></button>
              <button
                id="sc-1"
                onClick={() => history.push("/servers/9")}
              ></button>
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
                className="landing-buttons"
                id="lb-1"
                onClick={() => history.push("/login")}
              >
                <h2>LOGIN</h2>
              </button>
            </div>

            <div>
              <button
                className="landing-buttons"
                id="lb-2"
                onClick={() => history.push("/sign-up")}
              >
                <h2>SIGN UP</h2>
              </button>
            </div>

            <div>
              <button className="demo-button" onClick={() => loginDemoUser()}>
                {" "}
                let's boogie
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingPage;
