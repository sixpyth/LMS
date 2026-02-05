import React, { useState } from 'react';
import { createUser } from '../api/auth';
import styles from './CreateUser.module.css';

const CreateUser = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(phone, name, surname);
      setMessage("Студент добавлен!");
    } catch (err) {
      const errors = err.errors;
      if (errors) {
        const text = errors
          .map((e, i) => {
            const invalid = e.invalid_values?.length ? ` (${e.invalid_values.join(', ')})` : '';
            return `${i + 1}. ${e.message}${invalid}`;
          })
          .join('\n');
        setMessage(text);
      } else {
        setMessage(err.detail || "Ошибка активации");
      }
    }
  };

  
  return (
    <div className={styles.container}>
      <form className={styles.formWrapper} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Добавить учителя</h2>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Имя" 
          required 
          className={styles.input}
        />
        <input 
          type="text" 
          value={surname} 
          onChange={e => setSurname(e.target.value)} 
          placeholder="Фамилия" 
          required 
          className={styles.input}
        />
        <input 
          type="phone"
          value={phone} 
          onChange={e => setPhone(e.target.value)} 
          placeholder="Номер телефона" 
          required 
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Добавить</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default CreateUser;