import { useContext } from "react"
import { AuthContext } from "../utils/auth"

export const useUserAuth = () => {
    const context = useContext(AuthContext)
    return context
}