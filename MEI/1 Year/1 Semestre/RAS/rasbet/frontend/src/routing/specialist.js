import { App } from "../components/views/App";
import { ChangeOddView } from "../components/views/ChangeOddView";
import { CreateGameView } from "../components/views/CreateGameView";
import { EspFunctionsView } from "../components/views/EspFunctionsView";
import { InsertOddView } from "../components/views/InsertOddView";
import { RemoveGameView } from "../components/views/RemoveGameView";

export const specialistRoutes = [
    {
        path: "/specialist",
        element:<App child={<EspFunctionsView />} />,
    },
    {
        path: "/specialist/addGame",
        element:<App child={<CreateGameView />} />,
    },
    {
        path: "/specialist/removeGame",
        element: <App child={<RemoveGameView />} />,
    },
    {
        path: "/specialist/changeOdd",
        element: <App child={<ChangeOddView />} />,
    },
    {
        path: "/specialist/insertOdd",
        element: <App child={<InsertOddView />} />,
    },
]