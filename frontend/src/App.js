import React from "react";
import './App.css'; // используем обычный CSS вместо Tailwind

export default function HomePage() {
  return (
    <div className="home-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">LOGO</div>
          <button className="btn-red">Записаться</button>
        </div>
      </header>

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
          {[1, 2, 3].map((item) => (
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

      <footer className="footer">
        <div>© 2026. Все права защищены.</div>
      </footer>
    </div>
  );
}