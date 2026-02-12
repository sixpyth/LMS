import { useEffect, useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./SchedulePage.module.css";
import { deleteSchedule } from "../api/delete_schedule";
import { title } from "framer-motion/client";


const localizer = dayjsLocalizer(dayjs);

export default function SchedulePage({ role = "Student" }) {
  const [events, setEvents] = useState([]);
  const [color, setColor] = useState("#3174ad");

  useEffect(() => {
    const loadSchedule = async () => {
      const res = await fetch("http://localhost:8000/api/v1/manager/get-schedule");
      const data = await res.json();

      const formatted = data.schedule.map((lesson, index) => ({
        id: index + 1,
        title: `${lesson.lesson_type} (${lesson.lesson_format}) ${lesson.teacher}` ,
        start: new Date(lesson.start),
        end: new Date(lesson.finish),
        color: lesson.color,
        lesson_id: lesson.lesson_id
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

  const onSelectEvent = async (event) => {
    if (window.confirm("Удалить занятие?")) {
      console.log(event.lesson_id)
      await deleteSchedule(event.lesson_id)
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
    <div className={styles.schedulePage}>
      <header className={styles.scheduleHeader}>
        <h1>Расписание</h1>
        <span className={`${styles.roleBadge} ${styles[role]}`}>
  {role}
</span>
      </header>

      <div className={styles.scheduleContainer}>
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