export async function createUser(phone, name, surname) {
  const res = await fetch("http://localhost:8000/api/v1/users/{user}/teacher-create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, name, surname })
  });

  const data = await res.json();

  if (!res.ok) {
    throw data; 
  }

  return data;
}

