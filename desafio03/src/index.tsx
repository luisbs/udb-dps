import React from "react";
import ReactDOM from "react-dom";

import { RouterProvider } from "react-router5";
import createRouter from "./plugins/router";

import App from "./views/App";
import { Auth } from "./plugins/firebase";

const router = createRouter();

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </React.StrictMode>,
    document.getElementById("root")
  );
}

router.start(render);
Auth.onAuthStateChanged(render);
