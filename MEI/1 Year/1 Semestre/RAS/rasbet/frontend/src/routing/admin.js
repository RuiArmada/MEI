import { AdminFunctionsView } from "../components/views/AdminFunctionsView";
import { App } from "../components/views/App";
import { BetStateChangeView } from "../components/views/BetStateChangeView";
import CreatePromotionsView from "../components/views/CreatePromotionsView";
import ManageNotificationsView from "../components/views/ManageNotificationsView";

export const adminRoutes = [
    {
        path: "/admin",
        element:  <App child={<AdminFunctionsView />} />,
    },
    {
        path: "/admin/betState",
        element:  <App child={<BetStateChangeView />} />,
    },
    {
        path: "/admin/manageNotifications",
        element: <App child={<ManageNotificationsView />} />,
    },
    {
        path: "/admin/createPromotions",
        element:  <App child={<CreatePromotionsView />} />,
    },
]