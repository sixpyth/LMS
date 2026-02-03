import React, { useState } from 'react';
import { activateUser } from "../api/activate";
import styles from './ActivateUser.module.css';

const ActivateUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [message, setMessage] = useState("");

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await activateUser(token, email, password, login);
      setMessage("Аккаунт успешно активирован!");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.formWrapper} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Активация аккаунта</h2>
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
          className={styles.input}
        />
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Пароль" 
          required 
          className={styles.input}
        />
        <input 
          type="text"
          value={login} 
          onChange={e => setLogin(e.target.value)} 
          placeholder="Логин" 
          required 
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Активировать</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default ActivateUser;