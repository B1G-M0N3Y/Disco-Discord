import { NavLink } from "react-router-dom"

const ServerCard = ({ server }) => {
    return (
        <div className="server-card">
            <button className="server-pic"></button>
            {/* <NavLink className="server-link" to="link"> */}
            {/* <p className="server-name">Dance House</p> */}
            {/* </NavLink> */}
        </div>
    )
}

export default ServerCard
