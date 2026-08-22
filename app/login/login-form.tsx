"use client";

import { useActionState } from "react";
import { login } from "./actions";
import styles from "./login.module.css";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action}>
      <label htmlFor="email">Correo</label>
      <input id="email" name="email" type="email" required autoComplete="email" />

      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />

      {state?.error && (
        <p role="alert" className="mensaje-error">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={styles.enviar}>
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
