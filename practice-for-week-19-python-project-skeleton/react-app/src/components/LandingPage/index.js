import ServerCard from "./ServerCard";
import "./LandingPage.css";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const LandingPage = () => {
  const currentUser = useSelector((state) => state.session.user);

  console.log(currentUser);

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
          </div>
        )}
      </div>
    </>
  );
};

export default LandingPage;
