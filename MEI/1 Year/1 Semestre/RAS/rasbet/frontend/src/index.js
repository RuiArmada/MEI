import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import { StateProvider } from "./state";
import { initialState, globalStateReducer } from "./globalState";
import { AuthProvider } from "./utils/auth";

import { userRoutes } from "./routing/user";
import { specialistRoutes } from "./routing/specialist";
import { adminRoutes } from "./routing/admin";
import { generalRoutes } from "./routing/general";


const router = createBrowserRouter([
    ...generalRoutes,
    ...userRoutes,
    ...specialistRoutes,
    ...adminRoutes,
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <StateProvider initialState={initialState} reducer={globalStateReducer}>
            <AuthProvider children={<RouterProvider router={router} />} />
        </StateProvider>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
