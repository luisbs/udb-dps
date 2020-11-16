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
    <section className="row justify-content-center mt-5">
      <div className="col-12 col-md-4 text-center">
        <form action="#" onSubmit={withEmail}>
          <input
            type="email"
            value={email}
            placeholder="Correo electronico"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            value={password}
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            className="mt-3"
          />
          <button type="submit" className="btn btn-outline-primary mt-3">
            Ingresar con Email
          </button>
        </form>
        <button
          type="button"
          onClick={withGoogle}
          className="btn btn-primary mt-3"
        >
          Ingresar con Google
        </button>
      </div>
    </section>
  );
}
