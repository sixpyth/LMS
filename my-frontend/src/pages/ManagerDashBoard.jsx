import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./ManagerDashboard.css";
import { useNavigate } from "react-router-dom";
import fetch_users from "../api/fetch_users"
import fetch_teachers from "../api/fetch_teachers";
import { nav } from "framer-motion/client";

export default function ManagerDashboard() {
  
  const [studentNumber, setStudentNumber] = useState([0]);
  const [teacherNumber, setTeacherNumber] = useState([0]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch_users();
        setStudentNumber(res.count);      
        
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();

    const fetchTeachers = async () => {
      try {
        const res = await fetch_teachers();
        setTeacherNumber(res.count);
      } catch(err) {
        console.error(err);
      }
    };
    
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
            onClick={()=> navigate("/manager/add-student")}> 
            + Добавить студента
          </button>
          <button className="btn-primary"
          onClick={()=> navigate("/manager/add-teacher")}>+ Добавить учителя</button>
          <button className="btn-secondary">+ Создать расписаниеe</button>
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
          <div className="table-placeholder">
            Student list table goes here
          </div>
        </section>

        <section className="section">
          <h2>Upcoming Lessons</h2>
          <div className="table-placeholder">
            Schedule table goes here
          </div>
        </section>
      </main>
    </div>
  );
}