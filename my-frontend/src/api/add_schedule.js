export async function add_schedule(payload) {
  const res = await fetch("http://localhost:8000/api/v1/manager/set-schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  console.log("STATUS:", res.status);
  console.log("RAW RESPONSE:", text);

  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch {}

  if (!res.ok) throw data || { detail: text || "Request failed" };
  return data;
}