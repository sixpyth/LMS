const token = localStorage.getItem("token");

fetch("http://localhost:8000/api/v1/users/update-password", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`
  }
});