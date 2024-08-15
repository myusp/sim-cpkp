import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { AppContextType } from "../types";
import { useLocalStorage } from "@mantine/hooks"
import { UserDetailResponse } from "app-type/response";
import { userDetailService } from "@/services/user";

export const Context = createContext<AppContextType | null>(null)

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useLocalStorage({
        key: "token",
        defaultValue: "",
    })

    const [user, setUser] = useState<UserDetailResponse>()
    const isLoggedIn = useMemo(() => !!user, [user])

    useEffect(() => {
        if (token) {
            userDetailService()
                .then(res => {
                    setUser(res)
                })
        }
    }, [token])


    const handleLogin = (token: string) => {
        setToken(token)
    }
    const handleLogout = () => {
        setToken("")
        setUser(undefined)
    }
    return <Context.Provider
        value={{
            token,
            isLoggedIn,
            auth: {
                login: handleLogin,
                logout: handleLogout
            },
            user: user
        }}
    >
        {children}
    </Context.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    const ctx = useContext(Context)
    if (!ctx) {
        throw new Error("invalid usage useAppContext");
    }
    return ctx
}