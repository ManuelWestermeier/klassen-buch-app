import { NavLink } from "react-router-dom"
import "./index.css"

function Navbar({ className, isAuth }: {
    className: string,
    isAuth: boolean
}) {
    return (
        <nav>
            <NavLink to="/">
                Klassen-Buch-App
            </NavLink>
            {isAuth && <NavLink to={`/classes/${className}/`}>
                Deine Klasse
            </NavLink>}
            <NavLink to="/login">
                Login
            </NavLink>
        </nav>
    )
}

export default Navbar