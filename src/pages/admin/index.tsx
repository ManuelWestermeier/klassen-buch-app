import { useState } from "react"
import useAdminAuth from "../../hooks/use-admin-auth"

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

    return <div>Admin {password}</div>
}

export default Admin