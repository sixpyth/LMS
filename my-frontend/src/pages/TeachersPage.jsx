import React, { useEffect, useState } from "react";
import styles from "./StudentsPage.module.css";
import fetch_teachers from "../api/fetch_teachers";

const StudentsPage = () => {
  const [teachers, setTeacher] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
  const fetchTeachers = async () => {
    try {
      const res = await fetch_teachers();
      setTeacher(res.profiles);      
      
    } catch (err) {
      console.error(err);
    }
  };

  fetchTeachers();

}, []);

  const filteredTeachers = teachers.filter(
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
          {filteredTeachers.map((student) => (
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