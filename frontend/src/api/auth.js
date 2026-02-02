import axios from "axios";

export async function activateUser(token, email, password, login) {
  const res = await fetch("http://localhost:8000/api/v1/users/{user}/activate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, email, password, login })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Ошибка активации");
  }
  return await res.json();
}


export const loginUser = async (emailOrLogin, password) => {
  const res = await axios.post("/api/v1/users/login", {
    emailOrLogin,
    password,
  });
  return res.data;
};