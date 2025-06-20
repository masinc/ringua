import { RouteObject } from "react-router";
import App from "./App";
import Home from "./pages/Home";
import History, { loader as historyLoader } from "./pages/History";
import Settings, { loader as settingsLoader } from "./pages/Settings";
import About, { loader as aboutLoader } from "./pages/About";

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
  {
    path: "/about",
    Component: About,
    loader: aboutLoader,
  },
  {
    path: "/demo",
    Component: App,
  },
];