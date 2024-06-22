import { useState } from "react"
import useAdminAuth from "../../hooks/use-admin-auth"
import { NavLink, Outlet } from "react-router-dom"

function Admin() {
    const [{ isAuth, password }, authenticate] = useAdminAuth()
    const [error, setError] = useState("")

    if (!isAuth) {
        return <form onSubmit={async e => {
            e.preventDefault()
            const form = e.target as HTMLFormElement
            const fd = new FormData(form)
            setError(await authenticate(fd.get("password") as string) ? "eingeloggt" : "fehler: falsches Password")
        }}>
            <input type="text" name="password" placeholder="password..." />
            <p style={{ color: "red" }}>
                {error}
            </p>
            <button type="submit">
                Login
            </button>
        </form>
    }

    return <div>
        <h2>
            Admin
        </h2>
        <p>
            password: <input readOnly type="text" placeholder="password..." value={password} />
        </p>
        <br />
        <p>
            <NavLink className="btn" to="/admin/absent">
                Heute nicht da
            </NavLink>
        </p>
        <br />
        <p>
            <NavLink className="btn" to="/admin/classes">
                Klassen
            </NavLink>
        </p>
        <div className="view">
            <Outlet context={password} />
        </div>
    </div>
}

export default Admin