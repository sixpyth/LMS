import axios from "axios";

const fetch_teachers = async () => {
  const res = await axios.get(
    "http://localhost:8000/api/v1/manager/get-teachers"
  );
  return res.data;
};

export default fetch_teachers;