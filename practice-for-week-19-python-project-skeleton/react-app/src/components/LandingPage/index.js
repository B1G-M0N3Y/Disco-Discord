import ServerCard from "./ServerCard";
import "./LandingPage.css";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const currentUser = useSelector((state) => state.session.user);

  console.log(currentUser);

  return (
    <>
        <div className="landing-page">
          <div className="center-panel">
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
			</div>
		</div>
			{!currentUser &&
			<div className="auth-container">
				Login
				Sign Up
			</div>
			}
    </>
  );
};

export default LandingPage;
