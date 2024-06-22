import useLocalStorage from "use-local-storage";
import AdminAuthData from "../types/admin-auth-data";
import getUrl from "../utils/get-url";
import { useEffect } from "react";

export default function useAdminAuth(): [AdminAuthData, (password: string) => Promise<boolean>] {
    const [auth, setAuth] = useLocalStorage<AdminAuthData>("klassen-buch-app-admin-auth-data", {
        isAuth: false,
        password: ""
    });

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(getUrl("/admin/login/", { password: auth.password }))

                const isAuth = await res.json() as boolean

                if (!isAuth) {
                    setAuth({ isAuth: false, password: "" })
                }
            } catch (error) { }
        })()
    }, [])

    const authenticate = async (password: string): Promise<boolean> => {
        var isAuth;

        try {
            const res = await fetch(getUrl("/admin/login/", { password }))

            isAuth = await res.json() as boolean
        } catch (error) {
            return false
        }

        if (isAuth) {
            const authData: AdminAuthData = {
                isAuth: true,
                password
            };
            setAuth(authData);
        }

        return isAuth;
    };

    return [auth, authenticate];
}