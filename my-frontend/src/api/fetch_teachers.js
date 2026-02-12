import axios from "axios";

const fetch_teachers = async (page = 1, limit = 5) => {
  const skip = (page-1) * limit
  const res = await axios.get(
    "http://localhost:8000/api/v1/manager/get-teachers",
    {
      params:
      {
        skip,
        limit
      }
    }
  );
  return res.data;
};

export default fetch_teachers;