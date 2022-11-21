import "./LandingPage.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../../store/session";
import { getAllServers } from "../../store/servers";

const LandingPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const servers = useSelector((state) => state.servers.servers);
  const allServers = useSelector((state) => state.servers.allServers);
  const serversArr = Object.values(allServers);

  useEffect(() => {
    return () => {
      dispatch(getAllServers());
    };
  }, []);

  useEffect(() => {
    dispatch(getAllServers());
  }, [servers]);

  // Logs in a default demo user
  const loginDemoUser = async () => {
    await dispatch(login("demo@aa.io", "password"));
  };

  const isEven = (idx) => {
    if (idx % 2 === 0) {
      return true;
    }
  };

  return (
    <>
      {currentUser && (
        <div className="message-section">
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
              {serversArr?.map((server) => {
                let idx = serversArr.indexOf(server);
                let isAqua = isEven(idx);
                return (
                  <>
                    <button
                      id={isAqua ? "sc-1" : "sc-2"}
                      onClick={() => history.push(`/servers/${server.id}`)}
                    >
                      {server.name}
                    </button>
                  </>
                );
              })}
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
