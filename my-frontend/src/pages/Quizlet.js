import React, { useMemo, useState } from "react";
import styles from "./Quizlet.module.css";

const DEFAULT_MODULES = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `Module ${i + 1}`,
  description: `Vocabulary set for Module ${i + 1}`,
  url: "https://quizlet.com/kz/689388275/words-unit-1-flash-cards/?funnelUUID=8c3c46fc-7729-4f1b-b969-ac2636a8bc1a",
}));

export default function QuizletPage() {
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return DEFAULT_MODULES.filter(m =>
      `${m.title} ${m.description}`.toLowerCase().includes(q)
    );
  }, [query]);

  const onCopy = async (url, id) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.container}>
          <div className={styles.brand}>
            <div className={styles.logo}>📚</div>
            <div>
              <div className={styles.title}>Quizlet Modules</div>
              <div className={styles.subtitle}>
                Pick your module and open the card set
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <input
          className={styles.search}
          placeholder="Search module..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className={styles.grid}>
          {filtered.map(m => (
            <div key={m.id} className={styles.card}>
              <div className={styles.badge}>Q</div>

              <h3>{m.title}</h3>
              <p>{m.description}</p>

              <div className={styles.url}>{m.url}</div>

              <div className={styles.actions}>
                <a href={m.url} target="_blank" className={styles.btnMain}>
                  Open
                </a>

                <button
                  className={styles.btnGhost}
                  onClick={() => onCopy(m.url, m.id)}
                >
                  {copiedId === m.id ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          Quizlet modules list
        </div>
      </div>
    </div>
  );
}