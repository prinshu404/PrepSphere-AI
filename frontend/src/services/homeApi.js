import api from "./api";

export const getHomeData = async () => {
  const response = await api.get("/");
  return response.data;
};