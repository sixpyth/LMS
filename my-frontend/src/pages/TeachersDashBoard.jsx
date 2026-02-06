import React, { useState, useEffect } from "react";
import { FaGraduationCap, FaTimes, FaCalendarAlt, FaHeadphones, FaChartBar, FaBars, FaCog, FaDoorOpen } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function StudyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState("");
  const [avatar, setAvatar] = useState(null); 
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      if (JSON.parse(savedUser).avatar_url) setAvatar(JSON.parse(savedUser).avatar_url);
    }
  }, []);
  
const handleLogout = () => {
  localStorage.removeItem("user");
  setUser(null)
  navigate("/login");
};

  const navigate = useNavigate()

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file)); 
    }
  };

  const openSchedule = () => {
    navigate("/schedule")
  }

  const openSettings = () => {
    navigate("/student/settings")
  }

  const openAudioCourse = () => {
    navigate("/student/audio-course")
  }

  const openQuizlet = () => {
    navigate("/student/quizlet")
  }

  const handleAvatarUpload = async () => {
    const fileInput = document.getElementById("avatarInput");
    if (!fileInput.files[0]) return;

    const formData = new FormData();
    formData.append("avatar", fileInput.files[0]);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/api/v1/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Аватарка успешно загружена!");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Ошибка при загрузке аватарки");
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'white', color: 'black', fontFamily: 'sans-serif' }}>
      {/* Sidebar toggle button */}
      <ToggleButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Left sidebar */}
      <aside style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: sidebarOpen ? '200px' : '0',
        background: '#de2d2d',
        padding: sidebarOpen ? '1rem' : '0',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '3rem' }}>
          <button style={largeButtonStyle}><FaGraduationCap style={{ marginRight: '0.5rem' }} />Уроки</button>
          <button onClick={openSchedule} style={largeButtonStyle}><FaCalendarAlt style={{ marginRight: '0.5rem' }} />Расписание</button>
          <button onClick={openAudioCourse} style={largeButtonStyle}><FaHeadphones style={{ marginRight: '0.5rem' }} />Аудио курс</button>
          <button onClick={openQuizlet} style={largeButtonStyle}><FaChartBar style={{ marginRight: '0.5rem' }} />Quizlet</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
          <button onClick={openSettings} style={largeButtonStyle}><FaCog style={{ marginRight: '0.5rem' }} />Настройки</button>
          <button onClick={handleLogout} style={largeButtonStyle}><FaDoorOpen style={{ marginRight: '0.5rem' }} />Выход</button>
        </div>
      </aside>

   
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem', alignItems: 'center', gap: '1rem' }}>
         
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#de2d2d',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              fontSize: '1.2rem'
            }}>
              {avatar ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name ? user.name[0].toUpperCase() : "?"}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '1rem' }}>
          <p>Добро пожаловать, {user.name}!</p>
          {message && <p>{message}</p>}
        </div>
      </main>
    </div>
  );
}

const largeButtonStyle = {
  background: '#ffffff',
  color: 'black',
  border: 'none',
  padding: '0.5rem 0.75rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center'
};

function ToggleButton({ sidebarOpen, setSidebarOpen }) {
  return (
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      style={{
        position: 'fixed',
        top: '4rem',
        left: '1rem',
        zIndex: 1000,
        background: '#de2d2d',
        border: 'none',
        borderRadius: '0.25rem',
        padding: '0.5rem',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '40px',
        height: '40px',
      }}
    >
      <FaBars style={{
        position: 'absolute',
        transition: 'all 0.3s ease',
        opacity: sidebarOpen ? 0 : 1,
        transform: sidebarOpen ? 'rotate(90deg) scale(0.5)' : 'rotate(0deg) scale(1)',
      }} />
      <FaTimes style={{
        position: 'absolute',
        transition: 'all 0.3s ease',
        opacity: sidebarOpen ? 1 : 0,
        transform: sidebarOpen ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.5)',
      }} />
    </button>
  );
}