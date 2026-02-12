const API_URL = "http://localhost:8000/api/v1/profile/me";

export default async function getProfile() {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load profile");
  }

  
  const data = await res.json();

return data;

}