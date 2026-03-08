import axiosInstance from "./axios";

export const register = async (payload) => {
  const { data } = await axiosInstance.post("/api/register", payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await axiosInstance.post("/api/login", payload);
  return data;
};

export const verifyTwoFactor = async (payload) => {
  const { data } = await axiosInstance.post("/api/two-factor/verify", payload);
  return data;
};

export const getMe = async () => {
  const { data } = await axiosInstance.get("/api/user");
  return data.user;
};

export const logout = async () => {
  const { data } = await axiosInstance.post("/api/logout");
  return data;
};
