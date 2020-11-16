import React, { useState } from "react";
import { useRoute, BaseLink } from "react-router5";
import { Auth } from "../plugins/firebase";
import Toast from "../plugins/Toastr";

export default function Header() {
  const { router } = useRoute();
  const [logged, setLogged] = useState(false);

  Auth.onAuthStateChanged((user) => {
    setLogged(!!user);
  });

  const logout = () =>
    Auth.signOut()
      .then(() => {
        Toast.show("Sesión cerrada", "success");
        router.navigateToDefault();
      })
      .catch(Toast.error);

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <p className="navbar-brand">Desafio practico 03</p>
        <button
          type="button"
          className="navbar-toggler"
          data-toggle="collapse"
          data-target="#navbar"
          aria-controls="navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbar">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <BaseLink
                router={router}
                routeName="sucursales"
                className="nav-link"
              >
                Sucursales
              </BaseLink>
            </li>
            <li className="nav-item">
              <BaseLink
                router={router}
                routeName="resultados"
                className="nav-link"
              >
                Resultados
              </BaseLink>
            </li>
            {logged ? (
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={logout}
                >
                  Cerrar sesión
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <BaseLink
                  router={router}
                  routeName="login"
                  className="nav-link"
                >
                  Ingresar
                </BaseLink>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
