import { NavLink } from "react-router-dom"
import "./index.css"

function Navbar() {
    return (
        <nav>
            <NavLink to="/">
                Klassen-Buch-App
            </NavLink>
            <NavLink to="/login">
                Login
            </NavLink>
            <NavLink to="/admin">
                Admin
            </NavLink>
        </nav>
    )
}

export default Navbar