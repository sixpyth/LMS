import { useEffect, useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./SchedulePage.module.css";

const localizer = dayjsLocalizer(dayjs);

export default function SchedulePage({ role = "student" }) {
  const [events, setEvents] = useState([]);
  const [color, setColor] = useState("#3174ad");

  useEffect(() => {
    const loadSchedule = async () => {
      const res = await fetch("http://localhost:8000/api/v1/manager/get-schedule");
      const data = await res.json();

      const formatted = data.schedule.map((lesson, index) => ({
        id: index + 1,
        title: `${lesson.lesson_type} (${lesson.lesson_format})`,
        start: new Date(lesson.start),
        end: new Date(lesson.finish),
        color: setColor,
      }));

      setEvents(formatted);
    };

    loadSchedule();
  }, []);

  const onSelectSlot = ({ start, end }) => {
    const title = prompt("Название занятия");
    if (!title) return;

    setEvents([
      ...events,
      { id: Date.now(), title, start, end, color },
    ]);
  };

  const onSelectEvent = (event) => {
    if (window.confirm("Удалить занятие?")) {
      setEvents(events.filter((e) => e.id !== event.id));
    }
  };

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color || "#3174ad",
      color: "white",
      borderRadius: "6px",
      border: "none",
    },
  });

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