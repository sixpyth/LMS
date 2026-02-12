import React, { useEffect, useState } from "react";
import styles from "./StudentsPage.module.css";
import fetch_teachers from "../api/fetch_teachers";
import { deleteUser } from "../api/delete_user";


const TeachersPage = () => {
  const [teachers, setTeacher] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedUserLogin, setSelectedUserLogin] = useState(null);
  const [page,setPage] = useState(1)
  const [count,setTotal] = useState(0)
  
  const limit = 5
  const totalPages = Math.ceil(count / limit);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
      const res = await fetch_teachers(page,limit);
      setTeacher(res.profiles); 
      setTotal(res.count)     
      
    } catch (err) {
      console.error(err);
    }
  };
  
  fetchTeachers();
  
}, [page]);

const handleDelete = async (login) => {
  try{
    await deleteUser(login);

    setTeacher(prev => prev.filter(u => u.login !== login));
    selectedUserLogin(null);
  } catch(e) {
    console.error(e);
    alert("Ошибка при удалении пользователя")
  }
}

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
          {filteredTeachers.map((teacher) => (
            <tr 
            key={teacher.id}
            onClick={()=>setSelectedUserLogin(teacher.login)}
            style={{
              background: selectedUserLogin === teacher.login ? "#e6f0ff" : "transparent",
        cursor: "pointer",
            }}
            >
              
              <td>{teacher.name}</td>
              <td>{teacher.surname}</td>
              <td>{teacher.profile_type}</td>
              <td>{teacher.age}</td>
              <td>{teacher.status}</td>
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
      <button 
  onClick={() => handleDelete(selectedUserLogin)}
  disabled={!selectedUserLogin}
>
  Удалить
</button>
    </div>
  </div>
  );
};

export default TeachersPage;