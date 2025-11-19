// import { createContext, useState, useContext } from "react";
// import api from "@/services/api";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user")) || null;
//     } catch {
//       return null;
//     }
//   });

//   const [accessToken, setAccessToken] = useState(
//     sessionStorage.getItem("accessToken") || null
//   );

//   // ---------------- LOGIN ----------------
//   const login = async (email, password) => {
//     try {
//       const res = await api.post("/auth/login", { email, password });

//       setUser(res.data.user);
//       setAccessToken(res.data.accessToken);

//       // ⬅ STORE TOKENS
//       sessionStorage.setItem("accessToken", res.data.accessToken);
//       if (res.data.refreshToken) {
//         sessionStorage.setItem("refreshToken", res.data.refreshToken);
//       }

//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       return { success: true, role: res.data.user.role };
//     } catch (err) {
//       return { success: false, message: "Invalid credentials" };
//     }
//   };

//   // ---------------- LOGOUT ----------------
//   // const logout = async () => {
//   //   try {
//   //     const refreshToken = sessionStorage.getItem("refreshToken");

//   //     // ⬅ SEND REFRESH TOKEN IN LOGOUT REQUEST
//   //     await api.post("/auth/logout", {
//   //       refreshToken,
//   //     });
//   //   } catch (err) {}

//   //   setUser(null);
//   //   setAccessToken(null);

//   //   // REMOVE TOKENS
//   //   sessionStorage.removeItem("accessToken");
//   //   sessionStorage.removeItem("refreshToken");
//   //   localStorage.removeItem("user");
//   // };

//   const logout = async () => {
//   try {
//     await api.post("/auth/logout");
//   } catch (err) {}

//   setUser(null);
//   setAccessToken(null);

//   sessionStorage.removeItem("accessToken");
//   sessionStorage.removeItem("refreshToken");
//   localStorage.removeItem("user");
// };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, accessToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useState, useContext } from "react";
import api from "@/services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(
    sessionStorage.getItem("accessToken") || null
  );

  // ---------------- LOGIN ----------------
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      setUser(res.data.user);
      setAccessToken(res.data.accessToken);

      // Store token & user
      sessionStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      return { success: true, role: res.data.user.role };
    } catch (err) {
      return { success: false, message: "Invalid credentials" };
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // no refresh token needed
    } catch (err) {}

    // Clear local auth
    setUser(null);
    setAccessToken(null);

    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
