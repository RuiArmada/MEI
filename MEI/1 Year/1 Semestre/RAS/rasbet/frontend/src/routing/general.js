import { App } from "../components/views/App"
import { Navigate } from "react-router-dom"
import { SignInView } from "../components/views/SingInView"
import { SignUpView } from "../components/views/SingUpView"
import GamesListView from "../components/views/GamesListView"

export const generalRoutes = [
    {
        path: "/",
        element: <Navigate to="/todos" />,
    },
    {
        path: "/todos",
        element: <App child={
            <div className="main-content">
                <GamesListView game={'football'} />
            </div>
        }/>,
    },
    {
        path: "/football",
        element: <App child={
            <div className="main-content">
                <GamesListView game={'football'} />
            </div>
        }/>,
    },
    {
        path: "/basketball",
        element: <App child={
            <div className="main-content">
                <GamesListView game={'basketball'} />
            </div>
        }/>,
    },
    {
        path: "/tenis",
        element: <App child={
            <div className="main-content">
                <GamesListView game={'tenis'} />
            </div>
        }/>,
    },
    {
        path: "/motogp",
        element: <App child={
            <div className="main-content">
                <GamesListView game={'motoGP'} />
            </div>
        }/>,
    },
    {
        path: "/signin",
        element: <SignInView />,
    },
    {
        path: "/signup",
        element: <SignUpView />,
    },
]