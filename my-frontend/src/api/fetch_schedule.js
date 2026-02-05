import axios from "axios";

const fetch_schedule = async () => {
    const res = await axios.get(
        "http://localhost:8000/api/v1/manager/get-schedule"
    );
    return res.data;
};

export default fetch_schedule;