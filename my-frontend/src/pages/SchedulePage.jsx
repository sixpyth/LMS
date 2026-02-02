import { useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./SchedulePage.module.css";

const localizer = dayjsLocalizer(dayjs);

export default function SchedulePage({ role = "student" }) {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "English A2",
      start: new Date(2026, 1, 3, 10, 0),
      end: new Date(2026, 1, 3, 11, 0),
    },
  ]);

  const onSelectSlot = ({ start, end }) => {
    if (role !== "manager") return;

    const title = prompt("Название занятия");
    if (!title) return;

    setEvents([
      ...events,
      { id: Date.now(), title, start, end },
    ]);
  };

  const onSelectEvent = (event) => {
    if (role !== "manager") return;

    if (window.confirm("Удалить занятие?")) {
      setEvents(events.filter((e) => e.id !== event.id));
    }
  };

  return (
    <div className="schedule-page">
      <header className="schedule-header">
        <h1>Schedule</h1>
        <span className={`role-badge ${role}`}>
          {role}
        </span>
      </header>

      <div className="schedule-container">
        <Calendar
          localizer={localizer}
          events={events}
          selectable={role === "manager"}
          defaultView="week"
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
        />
      </div>
    </div>
  );
}