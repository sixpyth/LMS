import React from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate() 
  return (
    <aside className="sidebar">
      <div className="sidebar-title">LMS Manager</div>

      <nav className="sidebar-nav">
        <button className="sidebar-item active">Dashboard</button>
        <button className="sidebar-item" onClick={()=> navigate("/manager/students")}>Students</button>
        <button className="sidebar-item" onClick={()=> navigate("/manager/teachers")}>Teachers</button>
        <button className="sidebar-item" onClick={()=> navigate("/schedule")}>Schedule</button>
        <button className="sidebar-item">Courses</button>
        <button className="sidebar-item">Reports</button>
        <button className="sidebar-item">Settings</button>
      </nav>
    </aside>
  );
}