import React, { useMemo, useRef, useState } from "react";
import token from "../api/update_password"
import uploadAvatar from "../api/upload_avatar"
import { updatePassword } from "../api/update_password";
import { useUser } from "../userContext";

export default function ProfileSettingsPage() {
  const fileRef = useRef(null);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  const [status, setStatus] = useState({ type: "", message: "" }); 

  const { user, setUser } = useUser()

  const styles = useMemo(
    () => ({
      page: {
        minHeight: "100vh",
        background: "#fff",
        color: "#111",
        fontFamily:
          'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial',
        padding: "32px 16px",
      },
      container: {
        maxWidth: 980,
        margin: "0 auto",
      },
      header: {
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 18,
      },
      title: { fontSize: 28, fontWeight: 800, margin: 0 },
      subtitle: { margin: 0, color: "#444", fontSize: 14 },
      grid: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 16,
      },
      card: {
        border: "1px solid #111",
        borderRadius: 16,
        padding: 18,
        background: "#fff",
        boxShadow: "6px 6px 0 #111",
      },
      cardTitleRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 12,
      },
      cardTitle: { margin: 0, fontSize: 18, fontWeight: 800 },
      badge: {
        fontSize: 12,
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid #111",
        background: "#fff",
      },
      row: {
        display: "grid",
        gridTemplateColumns: "140px 1fr",
        gap: 14,
        alignItems: "center",
      },
      avatarWrap: {
        width: 120,
        height: 120,
        borderRadius: 20,
        border: "2px solid #111",
        background: "#fff",
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
      },
      avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
      avatarPlaceholder: {
        fontSize: 12,
        color: "#555",
        textAlign: "center",
        padding: 10,
        lineHeight: 1.3,
      },
      actions: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 },
      btn: {
        appearance: "none",
        border: "2px solid #111",
        borderRadius: 12,
        padding: "10px 14px",
        fontWeight: 800,
        cursor: "pointer",
        background: "#ff1a1a",
        color: "#fff",
        transition: "transform .05s ease",
      },
      btnGhost: {
        appearance: "none",
        border: "2px solid #111",
        borderRadius: 12,
        padding: "10px 14px",
        fontWeight: 800,
        cursor: "pointer",
        background: "#fff",
        color: "#111",
      },
      btnDisabled: { opacity: 0.6, cursor: "not-allowed" },
      label: { fontSize: 13, fontWeight: 800, marginBottom: 6 },
      input: {
        width: "100%",
        border: "2px solid #111",
        borderRadius: 12,
        padding: "10px 12px",
        outline: "none",
        fontSize: 14,
        background: "#fff",
        color: "#111",
      },
      hint: { marginTop: 6, fontSize: 13, color: "#444", paddingLeft: "1px" },
      divider: {
        height: 2,
        background: "#111",
        margin: "14px 0",
      },
      status: {
        marginTop: 14,
        borderRadius: 14,
        border: "2px solid #111",
        padding: "10px 12px",
        fontWeight: 700,
        fontSize: 13,
      },
      statusSuccess: { background: "#eaffea" },
      statusError: { background: "#ffecec" },
      statusInfo: { background: "#f3f3f3" },
      footerNote: { marginTop: 14, fontSize: 12, color: "#444" },
      redLine: { height: 6, background: "#ff1a1a", borderRadius: 999, marginTop: 10 },
    }),
    []
  );


function validatePasswordForm() {
  if (!current_password || !new_password || !confirm_password) {
    return "Заполни все поля пароля.";
  }
  if (new_password.length < 8) {
    return "Новый пароль должен быть минимум 8 символов.";
  }
  if (new_password !== confirm_password) {
    return "Новый пароль и подтверждение не совпадают.";
  }
  if (new_password === current_password) {
    return "Новый пароль не должен совпадать со старым.";
  }
  return "";
}

async function ChangePassword(e) {
  e.preventDefault();
const err = validatePasswordForm()
if (err) {
  setStatus({type:"error",message:err})
  return
}

try{
    setStatus({ type: "info", message: "Загрузка..." });
    await new Promise((r) => setTimeout(r, 700));
  
  const result = await updatePassword(
    current_password,
    new_password,
    confirm_password
  )

  setCurrentPassword("");
  setNewPassword("");
  setConfirmPassword("");

  setStatus({type:"success", message:"Пароль успешно изменен"});

} 
catch (err) {
  const message = Array.isArray(err.detail)
    ? err.detail.map(e => e.msg).join(", ")
    : err.detail || "Ошибка при смене пароля";

  setStatus({
    type: "error",
    message
  });
}
}

function setFileAndPreview(file) {
  setAvatarFile(file || null);

  if (!file) {
    setAvatarPreview("");
    return;
  }
  const url = URL.createObjectURL(file);
  setAvatarPreview(url);
}

function onPickAvatar() {
  fileRef.current?.click();
}

function onAvatarChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;


  const okTypes = ["image/png", "image/jpeg", "image/webp"];
  if (!okTypes.includes(file.type)) {
    setStatus({ type: "error", message: "Поддерживаются PNG / JPG / WEBP." });
    e.target.value = "";
    return;
  }

  const maxBytes = 2 * 1024 * 1024;
  if (file.size > maxBytes) {
    setStatus({ type: "error", message: "Файл слишком большой. До 2MB, пожалуйста." });
    e.target.value = "";
    return;
  }

  setStatus({ type: "info", message: "Аватар выбран. Нажми «Сохранить аватар»." });
  setFileAndPreview(file);
}

  function onRemoveAvatar() {
    setStatus({ type: "info", message: "Аватар сброшен (локально). Сохрани, если нужно." });
    setFileAndPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

 async function onSaveAvatar() {
  if (!avatarFile) {
    setStatus({ type: "error", message: "Сначала выбери файл аватара." });
    return;
  }

  try {
    setStatus({ type: "info", message: "Загружаю аватар…" });

    const avatar_url = await uploadAvatar(avatarFile);

    setUser(prev => ({
      ...prev,
      avatar_url: avatar_url
    }));

    setStatus({ type: "success", message: "Аватар сохранён." });

  } catch (e) {
    console.error(e);
    setStatus({ type: "error", message: "Не удалось сохранить аватар." });
  }
}

  const statusStyle =
    status.type === "success"
      ? { ...styles.status, ...styles.statusSuccess }
      : status.type === "error"
      ? { ...styles.status, ...styles.statusError }
      : { ...styles.status, ...styles.statusInfo };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Настройки профиля</h1>
            <p style={styles.subtitle}>Аватар и пароль. Минимум драмы, максимум красного.</p>
            <div style={styles.redLine} />
          </div>
          <span style={styles.badge}>Theme: red / black / white</span>
        </div>

        <div style={styles.grid}>
          {/* Avatar card */}
          <section style={styles.card}>
            <div style={styles.cardTitleRow}>
              <h2 style={styles.cardTitle}>Аватар</h2>
              <span style={styles.badge}>PNG/JPG/WEBP • до 5MB</span>
            </div>

            <div style={styles.row}>
              <div style={styles.avatarWrap}>
  {user?.avatar_url ? (
    <img
      src={user.avatar_url}
      style={styles.avatarImg}
    />
  ) : avatarPreview ? (
    <img
      src={avatarPreview}
      style={styles.avatarImg}
    />
  ) : (
    <div style={styles.avatarPlaceholder}>
      Нет аватара
    </div>
  )}
</div>
              <div>
                <div style={styles.actions}>
                  <button
                    type="button"
                    style={styles.btn}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(1px)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
                    onClick={onPickAvatar}
                  >
                    Выбрать файл
                  </button>

                  <button type="button" style={styles.btnGhost} onClick={onRemoveAvatar}>
                    Удалить
                  </button>

                  <button
                    type="button"
                    style={{
                      ...styles.btn,
                      ...(avatarFile ? null : styles.btnDisabled),
                    }}
                    disabled={!avatarFile}
                    onClick={onSaveAvatar}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(1px)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
                  >
                    Сохранить аватар
                  </button>
                </div>

                <p style={styles.hint}>
                  Совет: приукрась свой <b>профиль</b> новым аватаром.
                </p>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={onAvatarChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </section>

          <section style={styles.card}>
            <div style={styles.cardTitleRow}>
              <h2 style={styles.cardTitle}>Смена пароля</h2>
              <span style={styles.badge}>минимум 8 символов</span>
            </div>

            <form onSubmit={ChangePassword}>
              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <div style={styles.label}>Текущий пароль</div>
                  <input
                    style={styles.input}
                    type="password"
                    value={current_password}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>

                <div style={styles.divider} />

                <div>
                  <div style={styles.label}>Новый пароль</div>
                  <input
                    style={styles.input}
                    type="password"
                    value={new_password}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="минимум 8 символов"
                    autoComplete="new-password"
                  />
                  <div style={styles.hint}>Совет №2: не ставь “12345678”.</div>
                </div>

                <div>
                  <div style={styles.label}>Подтверди новый пароль</div>
                  <input
                    style={styles.input}
                    type="password"
                    value={confirm_password}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="повтори новый пароль"
                    autoComplete="new-password"
                  />
                </div>

                <div style={styles.actions}>
                  <button
                    type="submit"
                    style={styles.btn}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(1px)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
                  >
                    Изменить пароль
                  </button>

                  <button
                    type="button"
                    style={styles.btnGhost}
                    onClick={() => {
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setStatus({ type: "info", message: "Поля очищены. Потому что можем." });
                    }}
                  >
                    Очистить
                  </button>
                </div>

                <p style={styles.footerNote}>
                </p>
              </div>
            </form>
          </section>
          {status.message ? <div style={statusStyle}>{status.message}</div> : null}
        </div>
      </div>
    </div>
  );
}