import React, { useState } from "react";
import {
  FaGraduationCap,
  FaTimes,
  FaCalendarAlt,
  FaHeadphones,
  FaChartBar,
  FaBars,
  FaCog,
  FaDoorOpen
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../userContext";

export default function StudyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const openSchedule = () => navigate("/schedule");
  const openSettings = () => navigate("/settings");
  const openAudioCourse = () => navigate("/student/audio-course");
  const openQuizlet = () => navigate("/student/quizlet");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "white", color: "black" }}>
      <ToggleButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <aside
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: sidebarOpen ? "200px" : "0",
          background: "#de2d2d",
          padding: sidebarOpen ? "1rem" : "0",
          overflow: "hidden",
          transition: "all 0.3s ease"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "3rem" }}>
          <button style={largeButtonStyle}><FaGraduationCap /> Уроки</button>
          <button onClick={openSchedule} style={largeButtonStyle}><FaCalendarAlt /> Расписание</button>
          <button onClick={openAudioCourse} style={largeButtonStyle}><FaHeadphones /> Аудио курс</button>
          <button onClick={openQuizlet} style={largeButtonStyle}><FaChartBar /> Quizlet</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
          <button onClick={openSettings} style={largeButtonStyle}><FaCog /> Настройки</button>
          <button onClick={handleLogout} style={largeButtonStyle}><FaDoorOpen /> Выход</button>
        </div>
      </aside>

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "#de2d2d",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.2rem"
            }}
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              user?.name?.[0]?.toUpperCase() || "?"
            )}
          </div>
        </div>

        <div style={{ flex: 1, padding: "1rem" }}>
          <p>Добро пожаловать, {user?.name}!</p>
          {message && <p>{message}</p>}
        </div>
      </main>
    </div>
  );
}

const largeButtonStyle = {
  background: "#ffffff",
  color: "black",
  border: "none",
  padding: "0.5rem 0.75rem",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontSize: "1rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

function ToggleButton({ sidebarOpen, setSidebarOpen }) {
  return (
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      style={{
        position: "fixed",
        top: "4rem",
        left: "1rem",
        zIndex: 1000,
        background: "#de2d2d",
        border: "none",
        borderRadius: "0.25rem",
        padding: "0.5rem",
        cursor: "pointer",
        width: 40,
        height: 40
      }}
    >
      {sidebarOpen ? <FaTimes /> : <FaBars />}
    </button>
  );
}