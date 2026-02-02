import React from "react";
import "../App.css"; // подключаем глобальный CSS
import { Link } from "react-router-dom";


const Header = () => {
  return (
    <header className="header">
      <div className="logo">LMS</div>
      <ul className="nav-links">
        <li>
          <Link to="/">Главная</Link>
          </li>
        
        <li>
          <Link to="/activate">Вход</Link>
          </li>
        <li>Регистрация</li>
      </ul>
    </header>
  );
};

export default Header;