import api from "./axios";

export const login = async (email: string, password: string) => {
  try {
    // Clear old tokens before login
    localStorage.removeItem("token");
    localStorage.removeItem("refreshtoken");

    const response = await api.post("/api/login/login", { email, password });
    if (response && response.data) {
      const data = response.data;
      if (data.statusCode === 200 && data.data) {
        // Token is nested in data.data structure from ApiResponse
        debugger;
        if (data.data.token) localStorage.setItem("token", data.data.token);
        if (data.data.refreshToken)
          localStorage.setItem("refreshtoken", data.data.refreshToken);
      }
      return data;
    }
    return response;
  } catch (error) {
    const message =
      (error as any)?.response?.data?.message ||
      (error as any)?.message ||
      "Login failed";
    throw new Error(message);
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshtoken");
};

export const register = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  age: number,
  gender: string,
  address: string,
) => {
  try {
    debugger;
    const params = {
      name,
      Email: email,
      Password: password,
      phone,
      age,
      address,
      gender,
    };
    const response = await api.post("/api/login/register", params);
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || "Registration failed";
    throw new Error(message);
  }
};
