import axios from "axios";

const USE_MOCK_AUTH = true;

export const register = async (payload) => {
  if (USE_MOCK_AUTH) {
    return {
      token: "mock-token",
      user: { name: payload?.name || "Mock User", email: payload?.email || "" },
    };
  }
  const { data } = await axios.post("/api/auth/register", payload);
  return data;
};

export const login = async (payload) => {
  if (USE_MOCK_AUTH) {
    return {
      token: "mock-token",
      user: { name: payload?.email || "Mock User", email: payload?.email || "" },
    };
  }
  const { data } = await axios.post("/api/auth/login", payload);
  return data;
};

export const getMe = async () => {
  if (USE_MOCK_AUTH) {
    return { name: "Mock User", email: "mock@bytefinance.local", role: "user" };
  }
  const { data } = await axios.get("/api/auth/me");
  return data;
};
