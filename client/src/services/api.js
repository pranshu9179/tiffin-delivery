// import axios from "axios";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// // 🔹 Main API instance (used everywhere)
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true, // important for cookies (refresh token)
// });

// // Attach token to headers
// api.interceptors.request.use((config) => {
//   const token = sessionStorage.getItem("accessToken"); // store in memory/session
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;





// import axios from "axios";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// const DEV_ACCESS_KEY = import.meta.env.VITE_DEV_ACCESS_KEY; // ⬅ get from env

// // 🔹 Main API instance (used everywhere)
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true, // important for cookies (refresh token)
// });

// // Attach token to headers
// api.interceptors.request.use((config) => {
//   const token = sessionStorage.getItem("accessToken");

//   // ⬅ USE ENV VALUE HERE
//   if (DEV_ACCESS_KEY) {
//     config.headers["x-dev-access"] = DEV_ACCESS_KEY;
//   }

//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // ⬅ ADD refreshToken function (needed for retry)
// async function refreshToken() {
//   try {
//     const res = await axios.post(
//       `${API_BASE_URL}/auth/refresh`,
//       {},
//       { withCredentials: true }
//     );

//     const newToken = res.data.accessToken;

//     if (newToken) {
//       sessionStorage.setItem("accessToken", newToken);
//       return newToken;
//     }

//     throw new Error("No accessToken received");
//   } catch (err) {
//     console.error("Refresh token failed", err);
//     sessionStorage.removeItem("accessToken");
//     return null;
//   }
// }

// // ⬅ ADD RESPONSE INTERCEPTOR
// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     if (error.response?.status === 401 && !error.config._retry) {
//       error.config._retry = true;

//       const newToken = await refreshToken();

//       if (newToken) {
//         error.config.headers.Authorization = `Bearer ${newToken}`;
//         return api.request(error.config);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;





import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

const DEV_ACCESS_KEY = import.meta.env.VITE_DEV_ACCESS_KEY;

// 🔹 Main API instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 🔹 REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");

  if (DEV_ACCESS_KEY) {
    config.headers["x-dev-access"] = DEV_ACCESS_KEY;
  }

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔹 REFRESH TOKEN FUNCTION
async function refreshToken() {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );

    const newToken = res.data.accessToken;
    sessionStorage.setItem("accessToken", newToken);
    return newToken;
  } catch (err) {
    console.error("Refresh failed");
    sessionStorage.removeItem("accessToken");
    return null;
  }
}

// 🔹 RESPONSE INTERCEPTOR (auto retry)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      const newToken = await refreshToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api.request(error.config);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
