import { RouteObject } from "react-router";
import App from "./App";
import About, { loader as aboutLoader } from "./pages/About";

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: App,
  },
  {
    path: "/about",
    Component: About,
    loader: aboutLoader,
  },
];