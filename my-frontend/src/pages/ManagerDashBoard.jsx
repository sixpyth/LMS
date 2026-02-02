// import React from "react";
import Sidebar from "./Sidebar";
import "./ManagerDashboard.css";
import { useNavigate } from "react-router-dom";


export default function ManagerDashboard() {
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
          <button className="btn-primary">+ Добавить учителя</button>
          <button className="btn-secondary">+ Создать расписаниеe</button>
          <button className="btn-secondary">+ Создать курс</button>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <span className="stat-number">124</span>
            <span className="stat-label">Студенты</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">12</span>
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