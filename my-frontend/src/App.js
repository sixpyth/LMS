import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import StudentDashBoard from "./pages/StudentDashBoard";
import ManagerDashboard from "./pages/ManagerDashBoard";
import CreateUser from "./pages/CreateUser";
import Login from "./pages/Login";
import StudentsPage from "./pages/StudentsPage";
import TeachersPage from "./pages/TeachersPage"
import SchedulePage from "./pages/SchedulePage";
import ProfileSettingsPage from "./pages/ProfileSettings";
import ActivateUser from "./pages/ActivateUser"
import AudioCourses from "./pages/AudioCourse";
import CreateTeacher from "./pages/CreateTeacher";
import QuizletLinksPage from "./pages/Quizlet";
import TeacherDashBoard from "./pages/TeachersDashBoard"
import { UserProvider } from "./userContext";
import { useUser } from "./userContext";
import getProfile from "./api/get_profile";



const ProtectedRoute = ({ children, role }) => {
  const userStr = localStorage.getItem("user");

  return children;
};

export default function App() {
  return (
    <UserProvider>
      <Router>
        <AppLayout />
      </Router>
    </UserProvider>
  );
}

function AppLayout() {
  const { setUser } = useUser();

useEffect(() => {
  getProfile()
    .then(setUser)
    .catch(err => {
      console.error("Profile load failed:", err);
    });
}, []);
  return (
    <div className="home-container">

      <header className="header">
        <div className="header-content">
          <div className="logo">DNK STUDIO</div>
          <nav style={{ display: "flex", gap: "1rem" }}>
            <Link to="/"><button className="btn-red">Главная</button></Link>
            <Link to="/login"><button className="btn-red">Войти</button></Link>
          </nav>
        </div>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route path="/settings" element={<ProfileSettingsPage />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/students" element={<StudentsPage />} />
          <Route path="/manager/teachers" element={<TeachersPage />} />
          <Route path="/manager/add-student" element={<CreateUser />} />
          <Route path="/manager/add-teacher" element={<CreateTeacher />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/student/audio-course" element={<AudioCourses />} />
          <Route path="/student/quizlet" element={<QuizletLinksPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={<StudentDashBoard />} />
          <Route path="/activate" element={<ActivateUser />} />
          <Route path="/teacher" element={<TeacherDashBoard />} />
        </Routes>
      </main>

      <footer className="footer">
        <span className="footer-text">© 2026. Все права защищены.</span>
        <div className="footer-icons">
          <Link to="https://www.instagram.com/english.dnk/">
            <img className="footer-icon" src="https://upload.wikimedia.org/wikipedia/commons/2/28/Instagram_logo.png" />
          </Link>
          <Link to="/wikipedia.com">
            <img className="footer-icon" src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/whatsapp-white-icon.png" />
          </Link>
        </div>
      </footer>

    </div>
  );
}

function HomeContent() {
  return (
    <div className="home-container">
       <main className="content">
  
  </main>
      <section className="hero">
        <div className="hero-text">
          <h1>Курсы, которые реально работают</h1>
          <p>Онлайн и офлайн обучение. Практика, поддержка и результат, а не красивые обещания.</p>
          <button className="btn-red btn-lg">Выбрать курс</button>
        </div>
        <div className="hero-image">Баннер / изображение</div>
      </section>

      <section className="courses">
        <h2>Наши курсы</h2>
        <div className="courses-grid">
          {[1,2,3].map(item => (
            <div key={item} className="course-card">
              <h3>Курс {item}</h3>
              <p>Краткое описание курса. Что изучите и какой будет результат.</p>
              <button className="btn-red">Подробнее</button>
            </div>
          ))}
        </div>
      </section>

      <section className="info">
        <div className="info-grid">
          <div>
            <h2>Почему мы</h2>
            <p>Мы не продаем мотивацию. Мы даем систему, практику и поддержку.</p>
          </div>
          <div>
            <h2>Формат обучения</h2>
            <p>Онлайн, офлайн, индивидуально и в группах.</p>
          </div>
        </div>
      </section>
    </div>
  );
}