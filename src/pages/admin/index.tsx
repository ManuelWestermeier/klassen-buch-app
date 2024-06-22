import { useRef, useState } from "react"
import useAdminAuth from "../../hooks/use-admin-auth"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import getUrl from "../../utils/get-url"

function Admin() {
    const [{ isAuth, password }, authenticate] = useAdminAuth()
    const [error, setError] = useState("")
    const newPasswordInput = useRef<HTMLInputElement>(null)
    const navigate = useNavigate();

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

    const handlePasswordChange = async () => {
        const newPasswordValue = newPasswordInput.current?.value + "";
        if (password !== newPasswordValue) {
            try {
                await fetch(getUrl("/admin/set-password/", { password, newPassword: newPasswordValue }));
            } catch (error) { }
            authenticate(newPasswordValue);
            navigate("/admin/")
        }
    };

    return <div>
        <h2>
            Admin
        </h2>
        <p>
            password: <input
                defaultValue={password}
                type="text"
                placeholder="password..."
                ref={newPasswordInput}
            />
            {password != (newPasswordInput.current?.value + "") && (
                <button onClick={handlePasswordChange} type="submit">
                    Passwort ändern
                </button>
            )}
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