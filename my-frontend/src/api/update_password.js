export async function updatePassword(current_password, new_password, confirm_password) {
const token = localStorage.getItem("token");

const res = await fetch("http://localhost:8000/api/v1/users/update-password", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({ current_password, new_password, confirm_password })
});

const data = await res.json()

if (!res.ok) {
  throw data
}

return data;
}