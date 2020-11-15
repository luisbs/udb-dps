import * as React from "react";
import { useRoute, BaseLink } from "react-router5";

import { nameRoutes } from "../plugins/router";

export default function Header() {
  const { router } = useRoute();

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <BaseLink router={router} routeName="home" className="navbar-brand">
            Home
          </BaseLink>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
              {nameRoutes
                .filter((r) => r !== "home")
                .map((r, i) => (
                  <li className="nav-item" key={i}>
                    <BaseLink
                      router={router}
                      routeName={r}
                      className="nav-link"
                    >
                      {r}
                    </BaseLink>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
