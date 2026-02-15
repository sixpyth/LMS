export async function activateUser(token, email, password, login, message) {
  const res = await fetch("http://localhost:8000/api/v1/profile/{user}/activate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, email, password, login, message })
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw data;
  }

  return data
}
