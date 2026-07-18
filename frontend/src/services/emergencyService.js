import api from "./api";

export const getEmergencyContacts = async () => {
  const response = await api.get("/emergency");
  return response.data;
};

export const getEmergencyByType = async (type) => {
  const response = await api.get(`/emergency/${type}`);
  return response.data;
};