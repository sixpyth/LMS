export async function getAvatarUrl(key) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://127.0.0.1:8000/api/v1/profile/presign?key=${encodeURIComponent(key)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(`key`,key);
  
  if (!res.ok) {
    throw new Error("Failed to get avatar url");
  }

  const data = await res.json();

  return data.url;
}