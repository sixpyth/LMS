import axios from "axios";

const fetch_schedule = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    "http://localhost:8000/api/v1/profile/fetch-schedule",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export default fetch_schedule;