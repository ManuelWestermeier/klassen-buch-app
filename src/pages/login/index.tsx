import React, { useState } from 'react';
import Auth from '../../types/auth';
import ClassOptions from '../../comp/class-options';
import getUrl from '../../utils/get-url';
import { useNavigate } from 'react-router-dom';

function Login({ setAuth }: {
    setAuth: React.Dispatch<React.SetStateAction<Auth | undefined>>;
}) {
    const [error, setError] = useState<boolean | string>(false)
    const navigate = useNavigate()

    return (
        <div>
            <h2>
                Login
            </h2>
            <form onSubmit={async e => {
                e.preventDefault()
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form)

                try {
                    const res = await fetch(getUrl("/auth-class/", {
                        "class": fd.get("class") + "",
                        "password": fd.get("password") + ""
                    }))

                    const isAuth = await res.json()

                    if (!isAuth) {
                        return setError("falsches Password")
                    }

                    setAuth({
                        isAuth,
                        className: fd.get("class") + "",
                        password: fd.get("password") + ""
                    })

                    setError("Erfolg => Umleiten")

                    navigate("/")
                } catch (error) {
                    setError("Fehler: " + error)
                }
            }}>
                <select name="class">
                    <ClassOptions />
                </select>
                <input type="text" name='password' placeholder='password...' />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">
                    Hinzufügen
                </button>
            </form>
        </div>
    )
}

export default Login