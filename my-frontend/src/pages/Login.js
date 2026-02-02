import React, { useState } from "react";
import { loginUser } from "../api/login";
import styles from "./Login.module.css"; 
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      setMessage("Вы успешно вошли в аккаунт!");
      navigate("/student");
    } catch (err) {
      setMessage(err.message || "Ошибка при входе");
    }
  };


  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Вход в аккаунт</h2>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Войти
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default Login;