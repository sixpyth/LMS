import React, { useEffect, useState } from "react";
import styles from "./StudentsPage.module.css";
import fetch_users from "../api/fetch_users"

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState(""); 
  const [page, setPage] = useState(1);
  const [count, setTotal] = useState(0);

  const limit = 10
  const totalPages = Math.ceil(count / limit);
  
  useEffect(() => {
  const fetchStudents = async () => {
    try {
      const res = await fetch_users(page, limit);
      setStudents(res.profiles);
      setTotal(res.count)      
      
    } catch (err) {
      console.error(err);
    }
  };

  fetchStudents();
}, [page]);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.surname.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1>Список студентов</h1>
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
          {filteredStudents.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              <td>{student.surname}</td>
              <td>{student.profile_type}</td>
              <td>{student.age}</td>
              <td>{student.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
  <button
    disabled={page === 1}
    onClick={() => setPage((p) => p - 1)}
  >
    Назад
  </button>

  <span>
    Страница {page} из {totalPages}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage((p) => p + 1)}
  >
    Вперёд
  </button>
          

</div>

    </div>

);
};
export default StudentsPage;

