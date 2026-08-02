import axios from "axios";

const API_URL =
  "http://localhost:8080/api";

export const getDashboard = async () => {
  const response = await axios.get(
    `${API_URL}/dashboard`
  );

  return response.data;
};