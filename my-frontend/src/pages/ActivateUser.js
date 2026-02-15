import React, { useState } from 'react';
import { activateUser } from "../api/activate";
import styles from './ActivateUser.module.css';

const ActivateUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return; 
    
    try {
    setLoading(true);
    const data = await activateUser(token, email, password, login);
    setErrors([]);
    setDetail(data.message);

  } catch (err) {
    if (err.errors) {
      setErrors(err.errors);
      setDetail("");
    } else if (err.detail) {
      setDetail(err.detail);
      setErrors([]);
    }
  } finally {setLoading(false)}
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
        
        {detail && <p className={styles.message}>{detail}</p>}

        {errors.length > 0 && (
          <ol style={{textAlign:"left",lineHeight:"20px",paddingTop:"2px",paddingRight:"25px",fontWeight:"500",color:"grey", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
            {errors.map((e, index) => (
              <li key={index}>
                {e.detail}
              </li>
            ))}
          </ol>
        )}

      </form>
    </div>
  );
};

export default ActivateUser;