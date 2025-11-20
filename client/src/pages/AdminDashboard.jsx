// // import { useState, useEffect } from "react";
// // import { useAuth } from "@/context/AuthContext";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { getAllUsers, toggleMealEatAtMess } from "@/utils/storage";
// // import { useNavigate } from "react-router-dom";

// // export default function AdminDashboard() {
// //   const [users, setUsers] = useState([]);
// //   const { logout } = useAuth();
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     loadUsers();
// //   }, []);

// //   const loadUsers = () => {
// //     const allUsers = getAllUsers();
// //     setUsers(allUsers);
// //   };

// //   const handleToggleMealEatAtMess = (userId) => {
// //     toggleMealEatAtMess(userId);
// //     loadUsers(); // Refresh the list
// //   };

// //   return (
// //     <div className="min-h-screen bg-linear-to-b from-sky-50 to-white p-6 sm:p-8">
// //       <header className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
// //         {/* LEFT SIDE — Title */}
// //         <div className="flex flex-col">
// //           <h1 className="text-2xl font-bold text-sky-700">Admin Dashboard</h1>
// //           <p className="text-xs text-gray-500">
// //             Manage all users and meal preferences
// //           </p>
// //         </div>

// //         {/* RIGHT SIDE — Buttons */}
// //         <div className="flex flex-row items-center gap-3 md:gap-8  w-full sm:w-auto justify-between">
// //           {/* Register Page Button */}
// //           <Button
// //             onClick={() => navigate("/register")}
// //             className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md text-sm px-4 py-2"
// //           >
// //             Register ➕
// //           </Button>

// //           {/* ✅ Delivery Status Page Button */}
// //           <Button
// //             onClick={() => navigate("/delivery-status")}
// //             className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md text-sm px-4 py-2"
// //           >
// //             Delivery Status 📦
// //           </Button>

// //           <Button
// //             onClick={async () => {
// //               await logout(); // calls backend API
// //               navigate("/"); // redirect safely
// //             }}
// //             className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md text-sm px-4 py-2"
// //           >
// //             Logout
// //           </Button>
// //         </div>
// //       </header>

// //       <main>
// //         <section>
// //           <h2 className="text-sm font-medium text-gray-600 mb-2">
// //             All Users ({users.length})
// //           </h2>

// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //             {users.map((user) => (
// //               <Card
// //                 key={user.id}
// //                 className={`rounded-2xl shadow-sm hover:shadow-md transition-shadow ${
// //                   user.mealEatAtMess ? "bg-gray-100" : ""
// //                 }`}
// //               >
// //                 <CardContent className="p-4 flex flex-col gap-3">
// //                   <div className="flex items-start justify-between">
// //                     <div className="flex-1">
// //                       <p className="text-md font-semibold text-sky-700">
// //                         {user.name}
// //                       </p>
// //                       <p className="text-xs text-gray-500">{user.address}</p>
// //                       <p className="text-xs text-gray-800 mt-1">
// //                         {user.areaName} • {user.colonyName}
// //                       </p>
// //                     </div>
// //                   </div>

// //                   <div className="flex flex-wrap gap-2 items-center">
// //                     <span className="text-xs text-sky-600 font-medium bg-sky-50 px-2 py-1 rounded-lg">
// //                       {user.mealsCount} {user.mealsCount > 1 ? "meals" : "meal"}
// //                     </span>
// //                     <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-lg capitalize">
// //                       {user.mealType}
// //                     </span>
// //                     <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-lg">
// //                       Due: ₹{user.due ?? 0}
// //                     </span>
// //                   </div>

// //                   <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
// //                     <input
// //                       type="checkbox"
// //                       id={`meal-${user.id}`}
// //                       checked={user.mealEatAtMess || false}
// //                       onChange={() => handleToggleMealEatAtMess(user.id)}
// //                       className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
// //                     />
// //                     <label
// //                       htmlFor={`meal-${user.id}`}
// //                       className="text-sm text-gray-700 cursor-pointer"
// //                     >
// //                       Meal eat at mess
// //                     </label>
// //                   </div>

// //                   {user.mealEatAtMess && (
// //                     <p className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-lg mt-2">
// //                       This user won't appear in delivery dashboard
// //                     </p>
// //                   )}
// //                 </CardContent>
// //               </Card>
// //             ))}
// //           </div>

// //           {users.length === 0 && (
// //             <div className="text-center py-12">
// //               <p className="text-gray-500">No users found</p>
// //             </div>
// //           )}
// //         </section>
// //       </main>
// //     </div>
// //   );
// // }

// import { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { Button } from "@/components/ui/button";
// import CustomerList from "../pages/adminpage/CustomerList"; // 🔥 new import
// import { getAllUsers, toggleMealEatAtMess } from "@/utils/storage";
// import { useNavigate } from "react-router-dom";

// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const loadUsers = () => {
//     const allUsers = getAllUsers();
//     setUsers(allUsers);
//   };

//   const handleToggleMealEatAtMess = (userId) => {
//     toggleMealEatAtMess(userId);
//     loadUsers();
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-b from-sky-50 to-white p-6 sm:p-8">
//       <header className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
//         <div className="flex flex-col">
//           <h1 className="text-2xl font-bold text-sky-700">Admin Dashboard</h1>
//           <p className="text-xs text-gray-500">
//             Manage all users and meal preferences
//           </p>
//         </div>

//         <div className="flex flex-row items-center gap-3 md:gap-8  w-full sm:w-auto justify-between">
//           <Button
//             onClick={() => navigate("/register")}
//             className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md text-sm px-4 py-2"
//           >
//             Register ➕
//           </Button>

//           <Button
//             onClick={() => navigate("/delivery-status")}
//             className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md text-sm px-4 py-2"
//           >
//             Delivery Status 📦
//           </Button>

//           <Button
//             onClick={async () => {
//               await logout();
//               navigate("/");
//             }}
//             className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md text-sm px-4 py-2"
//           >
//             Logout
//           </Button>
//         </div>
//       </header>

//       {/* 🔥 Customer List UI moved into separate file */}
//       <main>
//         <section>
//           <CustomerList
//             users={users}
//             handleToggleMealEatAtMess={handleToggleMealEatAtMess}
//           />
//         </section>
//       </main>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { Button } from "@/components/ui/button";
// import CustomerList from "../pages/adminpage/CustomerList";
// import api from "@/services/api";
// import { useNavigate } from "react-router-dom";

// export default function AdminDashboard() {
//   const [customers, setCustomers] = useState([]);
//   const [deliveryBoys, setDeliveryBoys] = useState([]);
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState("customers"); // default view

//   useEffect(() => {
//     fetchAllUsers();
//   }, []);

//   const fetchAllUsers = async () => {
//     try {
//       const token = sessionStorage.getItem("accessToken");

//       const res = await api.get("/admin/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const all = res.data.rows;

//       setCustomers(all.filter((u) => u.role === "customer"));
//       setDeliveryBoys(all.filter((u) => u.role === "delivery_boy"));
//     } catch (err) {
//       console.error("Failed to fetch users", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-b from-sky-50 to-white p-6 sm:p-8">
//       {/* HEADER */}
//       <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
//         <div className="flex flex-col">
//           <h1 className="text-2xl font-bold text-sky-700">Admin Dashboard</h1>
//           <p className="text-xs text-gray-500">Manage customers & staff</p>
//         </div>

//         <div className="flex flex-row items-center gap-3 md:gap-8 w-full sm:w-auto justify-between">
//           <Button
//             onClick={() => navigate("/register")}
//             className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md text-sm px-4 py-2"
//           >
//             Register ➕
//           </Button>

//           <Button
//             onClick={() => navigate("/delivery-status")}
//             className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md text-sm px-4 py-2"
//           >
//             Delivery Status 📦
//           </Button>

//           <Button
//             onClick={async () => {
//               await logout();
//               navigate("/");
//             }}
//             className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md text-sm px-4 py-2"
//           >
//             Logout
//           </Button>
//         </div>
//       </header>

//       {/* 🔥 TOP STAT CARDS */}
//       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//         {/* TOTAL CUSTOMERS CARD */}
//         <div
//           onClick={() => setActiveTab("customers")}
//           className="cursor-pointer bg-white shadow-md hover:shadow-xl transition-all rounded-2xl p-6 border border-gray-100 hover:-translate-y-1"
//         >
//           <h3 className="text-lg font-semibold text-gray-800">Total Customers</h3>
//           <p className="text-3xl font-bold text-sky-600 mt-2">
//             {customers.length}
//           </p>
//         </div>

//         {/* TOTAL DELIVERY BOYS */}
//         <div
//           onClick={() => setActiveTab("delivery")}
//           className="cursor-pointer bg-white shadow-md hover:shadow-xl transition-all rounded-2xl p-6 border border-gray-100 hover:-translate-y-1"
//         >
//           <h3 className="text-lg font-semibold text-gray-800">
//             Total Delivery Boys
//           </h3>
//           <p className="text-3xl font-bold text-purple-600 mt-2">
//             {deliveryBoys.length}
//           </p>
//         </div>

//         {/* TOTAL USERS (OPTIONAL) */}
//         <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
//           <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
//           <p className="text-3xl font-bold text-green-600 mt-2">
//             {customers.length + deliveryBoys.length}
//           </p>
//         </div>
//       </section>

//       {/* 🔥 SWITCH LIST BASED ON TAB */}
//       {/* <main>
//         <section>
//           {activeTab === "customers" && <CustomerList />}
//           {activeTab === "delivery" && (
//             <p className="text-gray-500 text-center py-10 text-lg">
//               🚧 DeliveryMan List Component Required (create similar to CustomerList)
//             </p>
//           )}
//         </section>
//       </main> */}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import CustomerList from "../pages/adminpage/CustomerList";
import DeliveryManList from "../pages/adminpage/DeliveryManList"; // 🔥 new import
import api from "@/services/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [customers, setCustomers] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("customers"); // default view

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");

      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const all = res.data.rows;

      setCustomers(all.filter((u) => u.role === "customer"));
      setDeliveryBoys(all.filter((u) => u.role === "delivery_boy"));
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-50 to-white p-6 sm:p-8">
      {/* HEADER */}
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-sky-700">Admin Dashboard</h1>
          <p className="text-xs text-gray-500">Manage customers & staff</p>
        </div>

        <div className="flex flex-row items-center gap-3 md:gap-8 w-full sm:w-auto justify-between">
          <Button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md text-sm px-4 py-2"
          >
            Register ➕
          </Button>
          <Button
            onClick={() => navigate("/subscription-plans")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md text-sm px-4 py-2"
          >
            Subscription Plans 📋
          </Button>

          <Button
            onClick={() => navigate("/delivery-status")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md text-sm px-4 py-2"
          >
            Delivery Status 📦
          </Button>

          <Button
            onClick={async () => {
              await logout();
              navigate("/");
            }}
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md text-sm px-4 py-2"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* 🔥 TOP STAT CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* TOTAL CUSTOMERS CARD */}
        <div
          onClick={() => setActiveTab("customers")}
          className={`cursor-pointer bg-white shadow-md transition-all rounded-2xl p-6 border hover:shadow-xl hover:-translate-y-1 ${
            activeTab === "customers"
              ? "border-sky-500 shadow-lg"
              : "border-gray-100"
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-800">
            Total Customers
          </h3>
          <p className="text-3xl font-bold text-sky-600 mt-2">
            {customers.length}
          </p>
        </div>

        {/* TOTAL DELIVERY BOYS */}
        <div
          onClick={() => setActiveTab("delivery")}
          className={`cursor-pointer bg-white shadow-md transition-all rounded-2xl p-6 border hover:shadow-xl hover:-translate-y-1 ${
            activeTab === "delivery"
              ? "border-purple-500 shadow-lg"
              : "border-gray-100"
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-800">
            Total Delivery Boys
          </h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {deliveryBoys.length}
          </p>
        </div>

        {/* TOTAL USERS */}
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
          <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {customers.length + deliveryBoys.length}
          </p>
        </div>
      </section>

      {/* 🔥 TAB SWITCH UI */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        <button
          onClick={() => setActiveTab("customers")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "customers"
              ? "text-sky-600 border-b-2 border-sky-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Customers
        </button>

        <button
          onClick={() => setActiveTab("delivery")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "delivery"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Delivery Boys
        </button>
      </div>

      {/* 🔥 SWITCH LIST BASED ON TAB */}
      <main>
        <section>
          {activeTab === "customers" && <CustomerList />}
          {activeTab === "delivery" && <DeliveryManList />}
        </section>
      </main>
    </div>
  );
}
