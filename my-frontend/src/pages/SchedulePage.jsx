import { useEffect, useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./SchedulePage.module.css";
import { deleteSchedule } from "../api/delete_schedule";
import { b, title } from "framer-motion/client";
import { add_lessons_students } from "../api/add_lessons_students";


const localizer = dayjsLocalizer(dayjs);

export default function SchedulePage({ role = "Student" }) {
  const [events, setEvents] = useState([]);
  const [color, setColor] = useState("#3174ad");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const loadSchedule = async () => {
      const res = await fetch("http://localhost:8000/api/v1/manager/get-schedule");
      const data = await res.json();

    fetch("http://localhost:8000/api/v1/manager/get-students?limit=5&skip=0&profile_type=STUDENT")
      .then(res => res.json())
      .then(data => setAllStudents(data.profiles));


      const formatted = data.schedule.map((lesson, index) => ({
        id: index + 1,
        title: `${lesson.lesson_type} (${lesson.lesson_format}) ${lesson.teacher}`,

        students: lesson.students.length
  ? lesson.students.map(s => `${s.name} ${s.surname}`).join(", ")
  : "пока учеников нет",

        start: new Date(lesson.start),
        end: new Date(lesson.finish),
        color: lesson.color,
        lesson_id: lesson.lesson_id
      }));

      setEvents(formatted);
    };

    loadSchedule();
  }, []);

  useEffect(() => {
  if (!selectedEvent) return;

  fetch(`/api/lesson/${selectedEvent.lesson_id}`)
    .then(res => res.json())
    .then(data => {
    
    });
}, [selectedEvent]);

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
      await deleteSchedule(event.lesson_id)
      setEvents(events.filter((e) => e.id !== event.id));
    }
  };

const handleAddStudents = async (e) => {
  e.preventDefault();
  console.log(selectedStudents);
  try {
    await Promise.all(
      selectedStudents.map(login =>
        add_lessons_students({
          login,
          lesson_id: selectedEvent.lesson_id
        })
      )
    );
    alert("Ученики добавлены");

    setSelectedStudents([]);
    setIsOpen(false);
  } catch (err) {

    alert("Ошибка при добавлении учеников");
  }
};

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color || "#3174ad",
      color: "white",
      borderRadius: "6px",
      border: "none",
      fontSize: "15px"
    },
  });

  const EventCard = ({ event }) => {
  return (
    <div className={styles.eventCard}>
      <div>
        <div style={{ fontSize:"12px"}}>{event.title}</div>
      </div>

      <button
        className={styles.moreBtn}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedEvent(event);
        }}
      >
        ...
      </button>
    </div>
  );
};

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
        components={{ event: EventCard }}
        selectable={role === "manager"}
        defaultView="week"
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventStyleGetter}
      />

      {selectedEvent && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Детали занятия</h3>

            <p><b>Преподаватель:</b> {selectedEvent.teacher_name}</p>
            <p><b>Начало:</b> {selectedEvent.start.toLocaleString()}</p>
            <p><b>Конец:</b> {selectedEvent.end.toLocaleString()}</p>
            <p><b>Ученики:</b> {selectedEvent.students}</p>

            <h4
              className={styles.dropdownHeader}
              onClick={() => setIsOpen(prev => !prev)}
            >
              Добавить учеников {isOpen ? "▲" : "▼"}
            </h4>
            
            {isOpen && (
              <div className={styles.studentList}>
                {allStudents.map(student => (
                  <label key={student.login} className={styles.studentItem}>
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.login)}
                      disabled={selectedEvent.students.includes(
                        `${student.name} ${student.surname}`
                      )}
                      onChange={() => {
                        setSelectedStudents(prev =>
                          prev.includes(student.id)
                            ? prev.filter(id => id !== student.login)
                            : [...prev, student.login]
                        );
                      }}
                    />
                    {student.name} {student.surname}
                  </label>
                ))}
              </div>
            )}

            <div className={styles.buttonGroup}>
              <button className={styles.add} onClick={handleAddStudents}>
                Добавить
              </button>

              <button
                className={styles.closeBtn}
                onClick={() => setSelectedEvent(null)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}