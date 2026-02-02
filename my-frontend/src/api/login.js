import axios from "axios";

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/v1/users/login/user",
      { username, password }
    );

    const { access_token, user } = response.data;

 
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(user));

    return user; 
  } catch (err) {
    throw new Error(err.response?.data?.detail || "Ошибка при входе");
  }
};