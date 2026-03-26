import { useEffect, useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./SchedulePage.module.css";
import { deleteSchedule } from "../api/delete_schedule";
import { createPortal } from "react-dom";
import { add_lessons_students } from "../api/add_lessons_students";
import fetch_schedule from "../api/fetch_schedule";

const localizer = dayjsLocalizer(dayjs);

function parseTimeHM(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return { h: 0, m: 0 };
  const m = timeStr.match(/^(\d{2}):(\d{2})/);
  if (!m) return { h: 0, m: 0 };
  return { h: Number(m[1]), m: Number(m[2]) };
}



function toJsDow(apiDow) {
  return apiDow === 7 ? 0 : apiDow;
}

export default function SchedulePage({ role = "Student" }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  
  const [color, setColor] = useState("#3174ad");

  const [isOpen, setIsOpen] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);


  useEffect(() => {
    const loadSchedule = async () => {
      const res = await fetch_schedule();
      const data = res

      fetch("http://localhost:8000/api/v1/manager/get-students?limit=5&skip=0&profile_type=STUDENT")
        .then(res => res.json())
        .then(data => setAllStudents(data.profiles));


      const formatted = [];

      data.schedule.forEach((lesson) => {
        const periodStart = dayjs(lesson.start_date);
        const periodEnd = dayjs(lesson.finish_date);

        const { h: sh, m: sm } = parseTimeHM(lesson.start_time);
        const { h: eh, m: em } = parseTimeHM(lesson.finish_time);

        const baseTitle = `${lesson.lesson_type} (${lesson.lesson_format}) ${lesson.teacher}`;
        const studentsText = lesson.students?.length
          ? lesson.students.map(s => `${s.name} ${s.surname}`).join(", ")
          : "пока учеников нет";

        if (!lesson.days || lesson.days.length === 0) {
          const start = periodStart.hour(sh).minute(sm).second(0).millisecond(0);
          const end = periodStart.hour(eh).minute(em).second(0).millisecond(0);

          formatted.push({
            id: `${lesson.lesson_id}-${periodStart.format("YYYYMMDD")}`,
            title: baseTitle,
            start: start.toDate(),
            end: end.toDate(),
            color: lesson.color,
            lesson_id: lesson.lesson_id,
            students: studentsText,
            teacher: lesson.teacher
          });

          return;
        }

        let weekStart = periodStart.startOf("week").add(1, "day"); 
        if (weekStart.isAfter(periodStart)) {

          weekStart = weekStart.subtract(7, "day");
        }

        for (
          let w = weekStart.clone();
          w.isBefore(periodEnd.add(1, "day"));
          w = w.add(1, "week")
        ) {
          lesson.days.forEach(({ day }) => {
            const jsDow = toJsDow(day); // 1..7 -> js dow

            const offset = jsDow === 0 ? 6 : jsDow - 1; 
            const lessonDay = w.add(offset, "day");

            if (lessonDay.isBefore(periodStart, "day") || lessonDay.isAfter(periodEnd, "day")) {
              return;
            }

            const start = lessonDay.hour(sh).minute(sm).second(0).millisecond(0);
            const end = lessonDay.hour(eh).minute(em).second(0).millisecond(0);

            formatted.push({
              id: `${lesson.lesson_id}-${lessonDay.format("YYYYMMDD")}`,
              title: baseTitle,
              start: start.toDate(),
              end: end.toDate(),
              color: lesson.color,
              lesson_id: lesson.lesson_id,
              students: studentsText,
              teacher: lesson.teacher
            });
          });
        }
      });


      setEvents(formatted);
    };

    loadSchedule();
  }, []);

  const onSelectEvent = async (event) => {

    if (!window.confirm("Удалить занятие?")) {
      setSelectedEvent(event);
      return;
    }
    await deleteSchedule(event.lesson_id);
    setEvents((prev) => prev.filter((e) => e.id !== event.id));
  };

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color || "#3174ad",
      color: "white",
      borderRadius: "6px",
      border: "none",
      fontSize: "14px",
      padding: "4px",
    },
  });



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

  const EventCard = ({ event }) => (
    <div className={styles.eventCard}>
      <div style={{ fontSize: "12px" }}>{event.title}</div>
      <div style={{ fontSize: "11px", opacity: 0.85 }}>{event.students}</div>
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

  return (
    <div className={styles.schedulePage}>
      <header className={styles.scheduleHeader}>
        <h1>Расписание</h1>
        <span className={`${styles.roleBadge} ${styles[role]}`}>{role}</span>
      </header>

      <div className={styles.scheduleContainer}>
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="week"
          culture="ru"
          weekStartsOn={1}
          components={{ event: EventCard }}
          selectable={role === "manager"}
          onSelectEvent={onSelectEvent}
          eventPropGetter={eventStyleGetter}
          style={{ height: "85vh" }}
        />
     {selectedEvent &&
  createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalWindow}>
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
                      prev.includes(student.login)
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
    </div>,
    document.body  
  )
}
</div>
</div>
)}
