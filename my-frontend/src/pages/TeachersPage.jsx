import React, { useEffect, useState } from "react";
import styles from "./StudentsPage.module.css";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {

    fetch("/api/users") 
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.surname.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1>Список учителей</h1>
      <input
        type="text"
        placeholder="Поиск по имени или фамилии"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className={styles.searchInput}
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Тип курса</th>
            <th>Возраст</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.surname}</td>
              <td>{student.profile_type}</td>
              <td>{student.age}</td>
              <td>{student.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsPage;