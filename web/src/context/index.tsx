import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { AppContextType } from "../types";
import { useLocalStorage } from "@mantine/hooks"

export const Context = createContext<AppContextType | null>(null)

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useLocalStorage({
        key: "login-tk",
        defaultValue: "",
    })

    const [user, setUser] = useState()
    const isLoggedIn = useMemo(() => false, [])


    return <Context.Provider
        value={{
            token,
            isLoggedIn
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