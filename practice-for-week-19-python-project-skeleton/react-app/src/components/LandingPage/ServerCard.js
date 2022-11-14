import { NavLink } from "react-router-dom"

const ServerCard = ({ server }) => {
    return (
        <div className="server-card">
            <img className="server-pic" src="https://img.freepik.com/free-vector/hand-drawn-distorted-groovy-background_23-2148850187.jpg" />
            {/* <NavLink className="server-link" to="link"> */}
            <p className="server-name">Dance House</p>
            {/* </NavLink> */}
        </div>
    )
}

export default ServerCard
