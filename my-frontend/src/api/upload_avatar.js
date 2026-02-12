const API_URL = "http://localhost:8000/profile/avatar";

export default async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:8000/api/v1/profile/set-profile-picture", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  const data = await res.json();

  return data.avatar;
}