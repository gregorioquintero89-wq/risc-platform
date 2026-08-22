import styles from "./login.module.css";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className={styles.main}>
      <div className={`tarjeta ${styles.tarjeta}`}>
        <h1 className={styles.titulo}>RISC — Panel</h1>
        <LoginForm />
      </div>
    </main>
  );
}
