import axios from "axios";

export const deleteUser = (login) => {
  return axios.delete(`http://localhost:8000/api/v1/manager/delete-user?login=${login}`);
};