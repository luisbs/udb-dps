import React, { FormEvent, useState } from "react";
import { useRouter } from "react-router5";

import firebase, { Auth } from "../plugins/firebase";
import Toast from "../plugins/Toastr";

export default function LogIn() {
  const { navigateToDefault } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function ToastAndRedirect() {
    Toast.show("Logueado!!", "success");
    navigateToDefault();
  }
  if (Auth.currentUser) ToastAndRedirect();

  const withGoogle = () => {
    Auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(ToastAndRedirect)
      .catch(Toast.error);
  };

  const withEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Auth.signInWithEmailAndPassword(email, password)
      .then(ToastAndRedirect)
      .catch((err) => {
        err.code !== "auth/user-not-found"
          ? Toast.error(err)
          : Auth.createUserWithEmailAndPassword(email, password)
              .then(ToastAndRedirect)
              .catch(Toast.error);
      });
  };

  return (
    <section
      className="row justify-content-center mt-5"
      style={{ minWidth: "260px" }}
    >
      <div className="w-100">
        <button
          type="button"
          onClick={withGoogle}
          className="d-block btn btn-primary mx-auto"
        >
          Continuar con Google
        </button>
        <hr className="w-75 text-dark mx-auto mb-3" />
        <form onSubmit={withEmail}>
          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              type="email"
              value={email}
              placeholder="Correo electronico"
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              value={password}
              placeholder="Contraseña"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button type="submit" className="btn btn-outline-primary">
              Continuar con correo y contraseña
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
