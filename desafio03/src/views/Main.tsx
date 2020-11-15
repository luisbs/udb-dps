import * as React from "react";
import { useRoute } from "react-router5";

import { Auth } from "../plugins/firebase";

import LogIn from "./LogIn";

const views: Record<string, JSX.Element> = {
  home: <p>Hola mundo!</p>,
};

export default function Main() {
  const { route } = useRoute();

  console.log(Auth.currentUser);
  if (!Auth.currentUser) return LogIn();

  if (views[route.name]) {
    return views[route.name];
  }

  return views.home;
}
