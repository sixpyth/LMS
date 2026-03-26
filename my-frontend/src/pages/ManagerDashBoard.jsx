import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./ManagerDashboard.css";
import { useNavigate } from "react-router-dom";
import fetch_users from "../api/fetch_users";
import fetch_teachers from "../api/fetch_teachers";
import { add_schedule } from "../api/add_schedule";
import ColorPicker from "../СolorPicker.js"


export default function ManagerDashboard() {
  const [studentNumber, setStudentNumber] = useState(0);
  const [teacherNumber, setTeacherNumber] = useState(0);
  // Creates lessons
  const now = new Date().toISOString().slice(0, 16);
  const [start_time, setStart] = useState(now);
  const [finish_time, setFinish] = useState(now);
  const [teacher, setTeacher] = useState("");
  const [format, setFormat] = useState("");
  const [type, setType] = useState("");

  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [color, setColor] = useState("#3174ad");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weekdays, setWeekdays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  function toggleWeekday(day) {
    setWeekdays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  }

  const fetchStudents = async () => {
    try {
      const res = await fetch_users();
      setStudentNumber(res.count);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch_teachers();
      setTeacherNumber(res.count);
    } catch (err) {
      console.error(err);
    }
  };

const handleCreateLesson = async () => {
  try {
    const payload = {
      start_time: `${startTime}:00+00:00`,
      finish_time: `${endTime}:00+00:00`,
      teacher_login: teacher,
      days: weekdays,
      format,
      type,
      color,
      start_date: startDate,
      finish_date: endDate,
    };

    await add_schedule(payload);
    setShowScheduleModal(false);
  } catch (e) {
    alert(e?.detail || "Ошибка при создании урока");
  }
};

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, []);

  const navigate = useNavigate();


  return (
    <div className="manager-layout">
      <Sidebar />

      <main className="manager-content">
        <h1>Доска менеджера</h1>

        {/* Quick actions */}
        <div className="quick-actions">
          <button
            className="btn-primary"
            onClick={() => navigate("/manager/add-student")}
          >
            + Добавить студента
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate("/manager/add-teacher")}
          >
            + Добавить учителя
          </button>

          <button
            className="btn-secondary"
            onClick={() => setShowScheduleModal(true)}
          >
            + Создать расписание
          </button>

          <button className="btn-secondary">+ Создать курс</button>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <span className="stat-number">{studentNumber}</span>
            <span className="stat-label">Студенты</span>
          </div>

          <div className="stat-card">
            <span className="stat-number">{teacherNumber}</span>
            <span className="stat-label">Учителя</span>
          </div>

          <div className="stat-card">
            <span className="stat-number">8</span>
            <span className="stat-label">Courses</span>
          </div>

          <div className="stat-card">
            <span className="stat-number">15</span>
            <span className="stat-label">Lessons Today</span>
          </div>
        </div>

        {/* Tables placeholders */}
        <section className="section">
          <h2>Recent Students</h2>
          <div className="table-placeholder">Student list table goes here</div>
        </section>

        <section className="section">
          <h2>Upcoming Lessons</h2>
          <div className="table-placeholder">Schedule table goes here</div>
        </section>

        {showScheduleModal && (
  <div className="modal-overlay">
    <div className="modal-window">
      <h2>Создать расписание уроков</h2>

      <label>Период занятий</label>
      <div className="date-range">
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>

        <label>Дни недели</label>
      <div className="weekdays-row">
        {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((day, i) => (
          <button
            key={i}
            type="button"
            className={`weekday-btn ${weekdays.includes(i) ? "active" : ""}`}
            onClick={() => toggleWeekday(i)}
          >
            {day}
          </button>
        ))}
      </div>

      <label>Время урока</label>
      <div className="time-range">
        <input
          type="time"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
        />
        <input
          type="time"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
        />
      </div>

      <label>Учитель (логин)</label>
      <input
        type="text"
        value={teacher}
        onChange={(e) => setTeacher(e.target.value)}
        placeholder="ivanov123"
      />

      <label>Тип урока</label>
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="">Выбери тип урока</option>
        <option value="IELTS">IELTS</option>
        <option value="GENERAL">General</option>
        <option value="INTENSIVE">Интенсив</option>
        <option value="TRIAL">Пробный</option>
      </select>

      <label>Формат урока</label>
      <select value={format} onChange={e => setFormat(e.target.value)}>
        <option value="">Выбери формат урока</option>
        <option value="ONLINE">Онлайн</option>
        <option value="OFFLINE">Оффлайн</option>
      </select>

      <ColorPicker color={color} setColor={setColor} />

      <div className="modal-actions">
        <button
          className="btn-secondary"
          onClick={() => setShowScheduleModal(false)}
        >
          Отмена
        </button>

        <button className="btn-primary" onClick={handleCreateLesson}>
          Создать
        </button>
      </div>
    </div>
  </div>
)}
      </main>
    </div>
  );
}