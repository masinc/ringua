import { RouteObject } from "react-router";
import Home from "./pages/Home";
import History, { loader as historyLoader } from "./pages/History";
import Settings, { loader as settingsLoader } from "./pages/Settings";

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/history",
    Component: History,
    loader: historyLoader,
  },
  {
    path: "/settings",
    Component: Settings,
    loader: settingsLoader,
  },
];