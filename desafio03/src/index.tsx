import React from "react";
import ReactDOM from "react-dom";

import { RouterProvider } from "react-router5";
import createRouter from "./plugins/router";

import "./index.css";
import App from "./views/App";
import { Auth } from "./plugins/firebase";
// import App from "./App";
// import reportWebVitals from './reportWebVitals';

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
