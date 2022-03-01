import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import "antd/dist/antd.css";
import "../assets/css/custom.css";
import "../assets/css/custom-mobile.css";
import getUserData from "../providers/getUserData";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

import Errors from "../views/public/Widgets/Error";
import Error403 from "../views/public/Widgets/Error403";
import Error404 from "../views/public/Widgets/Error404";
import Error500 from "../views/public/Widgets/Error500";
import Info from "../views/public/Widgets/Info";
import Success from "../views/public/Widgets/Success";
import Warning from "../views/public/Widgets/Warning";
import { H } from "highlight.run";


import PageLogin from "../views/public/PageLogin/PageLogin";
import PageLogout from "../views/public/PageLogin/PageLogout";

import PageDashboard from "../views/private/admins/PageDashboard/PageDashboard";

const queryClient = new QueryClient();
// const userdata = getUserData();

// const isLoggedIn = localStorage.getItem("token");
import { ErrorBoundary } from "@highlight-run/react";
export default function Routes() {
    // if (userdata) {
    //     H.identify(userdata.email, {
    //         id: userdata.id,
    //         name: userdata.name,
    //         phone: userdata.phone_number
    //     });
    // }
    return (
        <ErrorBoundary showDialog>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Switch>
                        <PublicRoute
                            exact
                            path="/"
                            component={PageLogin}
                        />

                        <PublicRoute
                            exact
                            path="/logout"
                            component={PageLogout}
                        />

                        <PublicRoute
                            exact
                            path="/error-500"
                            component={Error500}
                        />

                        <PrivateRoute
                            exact
                            path="/dashboard"
                            component={PageDashboard}
                            permission="Dashboard"
                        />
                    </Switch>
                </BrowserRouter>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}
