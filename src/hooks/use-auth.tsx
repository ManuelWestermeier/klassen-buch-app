import useLocalStorage from "use-local-storage";
import Auth from "../types/auth";
import { useEffect } from "react";
import getUrl from "../utils/get-url";

export default function useAuth(): [Auth, React.Dispatch<React.SetStateAction<Auth | undefined>>] {
    const [auth, setAuth] = useLocalStorage<Auth>("klassen-buch-app-auth", { isAuth: false, className: "", password: "" })

    useEffect(() => {
        if (auth.isAuth) {
            (async () => {
                try {
                    const res = await fetch(getUrl("/auth-class/", {
                        "class": auth.className,
                        "password": auth.password
                    }))

                    const isAuth = await res.json()

                    if (!isAuth) {
                        setAuth({
                            isAuth: false,
                            className: "",
                            password: ""
                        })
                    }
                } catch (error) { }
            })()
        }
    }, [auth])

    return [auth, setAuth]
}