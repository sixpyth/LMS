import { useEffect, useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./SchedulePage.module.css";

const localizer = dayjsLocalizer(dayjs);

export default function SchedulePage({ role = "student" }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
  const loadSchedule = async () => {
    const res = await fetch("http://localhost:8000/api/v1/manager/get-schedule");
    const data = await res.json();

    const formatted = data.schedule.map((lesson, index) => ({
      id: index + 1,
      title: `${lesson.lesson_type} (${lesson.lesson_format})`,
      start: new Date(lesson.start),
      end: new Date(lesson.finish),
    }));

    setEvents(formatted);
  };

  loadSchedule();
}, []);

  const onSelectSlot = ({ start, end }) => {
    // if (role !== "manager") return;

    const title = prompt("Название занятия");
    if (!title) return;

    setEvents([...events, { id: Date.now(), title, start, end }]);
  };

  const onSelectEvent = (event) => {
    // if (role !== "manager") return;

    if (window.confirm("Удалить занятие?")) {
      setEvents(events.filter((e) => e.id !== event.id));
    }
  };

  const eventStyleGetter = (event) => {
  let backgroundColor = "#3174ad"; // стандартный синий

  if (event.title.includes("IELTS")) {
    backgroundColor = "#e74c3c"; // красный
  }

  if (event.title.includes("ONLINE")) {
    backgroundColor = "#27ae60"; // зелёный
  }

  return {
    style: {
      backgroundColor,
      color: "white",
      borderRadius: "6px",
      border: "none",
    },
  };
};

  return (
    <div className="schedule-page">
      <header className="schedule-header">
        <h1>Schedule</h1>
        <span className={`role-badge ${role}`}>{role}</span>
      </header>

      <div className="schedule-container">
        <Calendar
          localizer={localizer}
          events={events}
          selectable={role === "manager"}
          defaultView="week"
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
}