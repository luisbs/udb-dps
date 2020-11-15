import * as React from "react";

import Header from "../components/Header";
import Main from "./Main";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Main />
      </main>
    </div>
  );
}
