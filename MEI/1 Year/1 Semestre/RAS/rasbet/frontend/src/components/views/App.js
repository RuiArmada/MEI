import { NavBar } from "../blocks/NavBar";
import "../../css/index.scss";
import { useUserAuth } from "../../hooks/useAuth";
import { useStateValue } from "../../state";
import { validateToken } from "../../utils/authApi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const App = ({ child }) => {
    const { signout } = useUserAuth()
    const { dispatch } = useStateValue()
    const nav = useNavigate()

    const validateTokenRequest = async () => {
        const userData = await validateToken()

        if(userData.message){
            signout()
            dispatch({ type: 'setAuthUser', value: null })
            nav('/signin')
            return
        }

        dispatch({ type: 'setAuthUser', value: userData })
    }

    useEffect(() => {
        validateTokenRequest()
    }, [])

    return (
        <main className="main-container">
            <NavBar />
            { child }
        </main>
    );
};
