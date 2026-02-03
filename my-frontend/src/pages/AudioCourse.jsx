
import styles from "./AudioCourse.module.css"


export default function AudioCourses() {
  const role = "student"; 

  const audioCourses = [
    {
      id: 1,
      title: "Daily English – Episode 1",
      description: "Повседневные выражения и разговорная речь",
      duration: "8:32",
      author: "Anna",
      listened: true,
    },
    {
      id: 2,
      title: "IELTS Listening Practice",
      description: "Академический английский для экзамена",
      duration: "12:10",
      author: "John",
      listened: false,
    },
  ];

  return (
    <div className={styles.audio_page}>
      <h1 className={styles.page_title}>🎧 Аудио-курсы</h1>

      {role === "teacher" && (
        <div className="card">
          <h2>Загрузка нового аудио</h2>
          <input placeholder="Название" />
          <textarea placeholder="Описание" rows={3} />
          <input type="file" />
          <button className="btn-primary">Загрузить</button>
        </div>
      )}

      <div className={styles.card}>
        <h2>Доступные аудио</h2>

        <div className={styles.audio_list}>
          {audioCourses.map((audio) => (
            <div key={audio.id} className={styles.audio_item}>
              <div>
                <h3>{audio.title}</h3>
                <p className={styles.desc}>{audio.description}</p>
                <span className="meta">
                  {audio.author} · {audio.duration}
                </span>
              </div>

              <div className={styles.audio_actions}>
                <button className={styles.btn_primary}>▶ Слушать</button>
                {audio.listened && <span className={styles.listened}>✔ Прослушано</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

