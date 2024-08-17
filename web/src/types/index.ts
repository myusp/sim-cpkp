import { UserDetailResponse } from "app-type/response"

export type AppContextType = {
    token: string,
    isLoggedIn: boolean,
    user?: UserDetailResponse
    auth: {
        login: (token: string) => void,
        logout: () => void
    },
    isAppReady: boolean
}