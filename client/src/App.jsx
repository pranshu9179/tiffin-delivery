// import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";
// import { useEffect } from "react";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import UserDashboard from "./pages/UserDashboard";
// import DeliveryDashboard from "./pages/DeliveryDashboard";
// import AdminDashboard from "./pages/AdminDashboard";

// import MyOrders from "./pages/orderForDeliveryMan/MyOrder";

// // Private Route
// function PrivateRoute({ children, allowedRole }) {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/" replace />;
//   if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
//   return children;
// }

// // Default route: redirect according to role
// function DefaultRoute() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       if (user.role === "admin") navigate("/admin-dashboard", { replace: true });
//       else if (user.role === "delivery") navigate("/delivery-dashboard", { replace: true });
//       else navigate("/user-dashboard", { replace: true });
//     }
//   }, [user, navigate]);

//   return user ? null : <Login />;
// }

// export default function App() {
//   return (
//     <div className="min-h-screen bg-linear-to-b from-sky-100 to-white flex flex-col">
//       <Routes>
//         <Route path="/" element={<DefaultRoute />} />
//         <Route path="/register" element={<Register />} />
//         <Route
//           path="/user-dashboard"
//           element={
//             <PrivateRoute allowedRole="user">
//               <UserDashboard />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/delivery-dashboard"
//           element={
//             <PrivateRoute allowedRole="delivery">
//               <DeliveryDashboard />
//             </PrivateRoute>
//           }
//         />
//           {/*  ROUTE FOR MY ORDERS */}
//         <Route
//           path="/my-orders"
//           element={
//             <PrivateRoute allowedRole="delivery">
//               <MyOrders />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/admin-dashboard"
//           element={
//             <PrivateRoute allowedRole="admin">
//               <AdminDashboard />
//             </PrivateRoute>
//           }
//         />
//       </Routes>
//     </div>
//   );
// }

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Delivery Boy Orders Page
import MyOrders from "./pages/orderForDeliveryMan/MyOrder";

// ✅ Toast Provider
import { Toaster } from "@/components/ui/sonner.tsx";
import DeliveryStatus from "./pages/deliveryStatusForAdmin/DeliveryStatus";

// ✅ PRIVATE ROUTE (Role based protection)
function PrivateRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />; // not logged in, go to login

  if (allowedRole && user.role !== allowedRole)
    return <Navigate to="/" replace />; // logged in but wrong role

  return children;
}

// ✅ DEFAULT ROUTE (redirect based on role)
function DefaultRoute() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin")
        navigate("/admin-dashboard", { replace: true });
      else if (user.role === "delivery")
        navigate("/delivery-dashboard", { replace: true });
      else navigate("/user-dashboard", { replace: true });
    }
  }, [user, navigate]);

  return user ? null : <Login />;
}

// ✅ MAIN APP
export default function App() {
  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-sky-100 to-white flex flex-col">
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<DefaultRoute />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ USER DASHBOARD */}
          <Route
            path="/user-dashboard"
            element={
              <PrivateRoute allowedRole="user">
                <UserDashboard />
              </PrivateRoute>
            }
          />

          {/* ✅ DELIVERY DASHBOARD */}
          <Route
            path="/delivery-dashboard"
            element={
              <PrivateRoute allowedRole="delivery">
                <DeliveryDashboard />
              </PrivateRoute>
            }
          />

          {/* ✅ DELIVERY - MY ORDERS PAGE */}
          <Route
            path="/my-orders"
            element={
              <PrivateRoute allowedRole="delivery">
                <MyOrders />
              </PrivateRoute>
            }
          />

          {/* ✅ ADMIN DASHBOARD */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute allowedRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/delivery-status"
            element={
              <PrivateRoute allowedRole="admin">
                <DeliveryStatus />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>

      {/* ✅ TOAST SYSTEM - Global */}
      <Toaster />
    </>
  );
}
