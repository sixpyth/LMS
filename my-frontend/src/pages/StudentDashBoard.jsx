import React, { useState, useEffect } from "react";
import { FaGraduationCap, FaTimes, FaCalendarAlt, FaHeadphones, FaChartBar, FaBars, FaCog, FaDoorOpen } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../userContext";
import { useContext } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from "recharts"

export default function StudyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { user } = useUser();
  const navigate = useNavigate();

 
  const COLORS = ["#f74f4f", "#2ff6c4", "#4f6ef7", "#f7d74f","#4f76f7bc","rgba(255, 107, 1, 0.73)"];
 
  const data = [
  { month: "2026-01", created: 61, done: 27 },
  { month: "2026-02", created: 80, done: 55 },
];

  const dataPie = [
    {name:"Kirill", value: 10},
    {name:"Madina", value:32},
    {name:"Sergey", value:30},
    {name:"Sergey", value:30},
    {name:"Sergey", value:30},
    {name:"Sergey", value:30},
    
  ]

  const handleLogout = () => {
  localStorage.removeItem("user");
  user(null)
  navigate("/login");
};


  const openSchedule = () => {
    navigate("/schedule")
  }

  const openSettings = () => {
    navigate("/settings")
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

//   <LineChart width={600} height={300} data={data}>
//   <XAxis dataKey="month" />
//   <YAxis />
//   <Tooltip />
//   <Line type="monotone" dataKey="created" stroke="#4f6ef7" />
//   <Line type="monotone" dataKey="done" stroke="green" />
// </LineChart>


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
            <div
  style={{
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: '#de2d2d',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.2rem',
    color: 'white'
  }}
>
  {user?.avatar ? (
  <img
    src={user.avatar}
    alt="avatar"
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
) : (
  user?.name?.[0]?.toUpperCase() || "?"
)}
</div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '1rem' }}>
          <p>Добро пожаловать, {user?.name}!</p>
          {message && <p>{message}</p>}

  {/* выполненные quilzet/аудио */}
  <LineChart width={600} height={300} data={data}>
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="created" stroke="#fa3c1a" />
  <Line type="monotone" dataKey="done" stroke="green" />
  </LineChart>

    <PieChart width={400} height={300} data={dataPie}>
      <Pie
        stroke="#3d3d3d00"
        dataKey="value" 
        nameKey="name"
        outerRadius={100}
        innerRadius={50}
      >
       {dataPie.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
    </Pie>

      <Tooltip/>
    </PieChart>

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