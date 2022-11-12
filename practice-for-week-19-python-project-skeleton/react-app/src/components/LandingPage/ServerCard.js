import { NavLink } from "react-router-dom"

const ServerCard = ({ server }) => {
    return (
        <div className="server-card">
            <img className="server-pic" src="https://cdn.dribbble.com/users/13774/screenshots/5041932/media/943cf55e50910174f55394b58464eb90.png" />
            {/* <NavLink className="server-link" to="link"> */}
            <p className="server-name">Dance House</p>
            {/* </NavLink> */}
        </div>
    )
}

export default ServerCard
