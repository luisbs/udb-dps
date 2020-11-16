import * as React from "react";
import { useRoute } from "react-router5";

import { Auth } from "../plugins/firebase";

import LogIn from "./LogIn";
import Sucursales from "./Sucursales";
import Resultados from "./Resultados";

export default function Main() {
  const { route } = useRoute();

  const user = Auth.currentUser;
  if (!user) return <LogIn />;
  if (route.name === "login") return <LogIn />;

  if (route.name === "sucursales") return <Sucursales />;
  if (route.name === "resultados") return <Resultados />;
  return <Sucursales />;
}
