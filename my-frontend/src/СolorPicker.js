export default function ColorPicker({ color, setColor }) {
  const colors = [
    "#e74c3c", // red
    "#3498db", // blue
    "#2ecc71", // green
    "#f1c40f", // yellow
    "#9b59b6", // purple
    "#e67e22", // orange
  ];

  return (
    <>
      <label>Цвет занятия</label>

      <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
        {colors.map((c) => (
          <div
            key={c}
            onClick={() => setColor(c)}
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              backgroundColor: c,
              cursor: "pointer",
              border: c === color ? "1.5px solid pink" : "2px solid #ffffff",
            }}
          />
        ))}
      </div>
    </>
  );
}