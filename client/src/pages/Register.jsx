// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import AddressDropdown from "../components/AddressDropdown";
// import api from "@/services/api";

// export default function Register() {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [showSuccess, setShowSuccess] = useState(false);

//   const [userData, setUserData] = useState({
//     name: "",
//     mobile: "",
//     email: "",
//     password: "",
//     role: "user",
//     mealType: "breakfast",
//     mealsCount: 1,
//     address: {},
//   });

//   // 🔒 Restrict page to only Admin users
//   useEffect(() => {
//     if (!user || user.role !== "admin") {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   const handleAddress = (addr) =>
//     setUserData((prev) => ({ ...prev, address: addr }));

//   // 🔥 Submit Data to Backend
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const token = sessionStorage.getItem("accessToken");

//       // Convert frontend role → backend role
//       const apiRole =
//         userData.role === "user" ? "customer" : "delivery_boy";

//       // ✅ Convert address object → properly formatted string
//       const fullAddress = Object.values(userData.address)
//         .filter(Boolean)
//         .join(", ");

//       console.log("FULL ADDRESS SENT:", fullAddress);

//       // Payload for backend
//       const payload = {
//         name: userData.name,
//         email: userData.email,
//         password: userData.password,
//         phone: userData.mobile,
//         address: fullAddress,
//         role: apiRole,
//       };

//       const res = await api.post("/admin/users", payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("User Registered:", res.data);

//       setShowSuccess(true);
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="min-h-screen py-6 flex flex-col md:flex-row bg-sky-100">
//       {/* Left Image Section */}
//       <div className="md:w-1/2 w-full flex items-center justify-center relative">
//         <img
//           src="/login-img.png"
//           alt="Register Banner"
//           className="md:object-cover object-contain w-[90%] md:w-[85%] h-[250px] md:h-[90vh] mt-2 md:mt-0 md:ml-14"
//         />
//       </div>

//       {/* Right Form Section */}
//       <div className="md:w-1/2 w-full flex items-center justify-center px-4 py-8 md:py-0">
//         <form
//           onSubmit={handleSubmit}
//           className="w-full max-w-2xl bg-white shadow-xl rounded-3xl px-8 py-4 space-y-5 animate-fadeIn"
//         >
//           {/* 🔙 BACK BUTTON */}
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-lg shadow-md transition active:scale-95"
//           >
//             ← Back
//           </button>

//           <h2 className="text-2xl font-bold text-sky-700 text-center">
//             Create Account
//           </h2>

//           {/* Role */}
//           <div>
//             <label className="block text-gray-600 mb-1">Register As</label>
//             <select
//               value={userData.role}
//               onChange={(e) =>
//                 setUserData({ ...userData, role: e.target.value })
//               }
//               className="w-full border border-sky-200 rounded-lg h-10 px-3 focus:ring-2 focus:ring-sky-300 transition"
//             >
//               <option value="user">User</option>
//               <option value="delivery">Delivery Man</option>
//             </select>
//           </div>

//           {/* Two Columns Inputs */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={userData.name}
//               onChange={(e) =>
//                 setUserData({ ...userData, name: e.target.value })
//               }
//               className="border border-sky-200 rounded-lg h-10 px-3 focus:ring-2 focus:ring-sky-300 transition"
//               required
//             />
//             <input
//               type="number"
//               placeholder="Mobile Number"
//               value={userData.mobile}
//               onChange={(e) =>
//                 setUserData({ ...userData, mobile: e.target.value })
//               }
//               className="border border-sky-200 rounded-lg h-10 px-3 focus:ring-2 focus:ring-sky-300 transition"
//               required
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="email"
//               placeholder="Email"
//               value={userData.email}
//               onChange={(e) =>
//                 setUserData({ ...userData, email: e.target.value })
//               }
//               className="border border-sky-200 rounded-lg h-10 px-3 focus:ring-2 focus:ring-sky-300 transition"
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={userData.password}
//               onChange={(e) =>
//                 setUserData({ ...userData, password: e.target.value })
//               }
//               className="border border-sky-200 rounded-lg h-10 px-3 focus:ring-2 focus:ring-sky-300 transition"
//               required
//             />
//           </div>

//           {/* Meal Section for USER Only */}
//           {userData.role === "user" && (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-gray-600 mb-1">
//                     Meal Type
//                   </label>
//                   <select
//                     value={userData.mealType}
//                     onChange={(e) =>
//                       setUserData({ ...userData, mealType: e.target.value })
//                     }
//                     className="w-full border border-sky-200 rounded-lg h-10 px-2 focus:ring-2 focus:ring-sky-300 transition"
//                   >
//                     <option value="breakfast">Breakfast</option>
//                     <option value="lunch">Lunch</option>
//                     <option value="dinner">Dinner</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-gray-600 mb-1">
//                     Meals per day
//                   </label>
//                   <input
//                     type="number"
//                     min="1"
//                     value={userData.mealsCount}
//                     onChange={(e) =>
//                       setUserData({ ...userData, mealsCount: e.target.value })
//                     }
//                     className="w-full border border-sky-200 rounded-lg h-10 px-2 focus:ring-2 focus:ring-sky-300 transition"
//                   />
//                 </div>
//               </div>

//               {/* Address Dropdown */}
//               <AddressDropdown onSelect={handleAddress} />
//             </>
//           )}

//           {/* Register Button */}
//           <button className="w-full bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-300">
//             Register
//           </button>
//         </form>
//       </div>

//       {/* 🔹 SUCCESS MODAL */}
//       {showSuccess && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-80 p-6 rounded-2xl shadow-lg text-center animate-fadeIn">
//             <h3 className="text-lg font-semibold text-sky-700">
//               Registration Successful 🎉
//             </h3>

//             <p className="text-gray-600 text-sm mt-1">
//               User has been registered successfully.
//             </p>

//             <button
//               onClick={() => navigate("/")}
//               className="mt-4 w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-xl transition"
//             >
//               Continue
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showSuccess, setShowSuccess] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    role: "user",
    mealType: "breakfast",
    mealsCount: 1,

    // 🔥 Address fields moved here
    state: "",
    city: "",
    area: "",
    block: "",
    flat: "",
  });

  // 🔒 Restrict page to admin only
  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/");
  }, [user, navigate]);

  // Generic handler
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // 🔥 Submit Data to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("accessToken");

      const apiRole =
        userData.role === "user" ? "customer" : "delivery_boy";

      // Format address into single string
      const fullAddress = [
        userData.flat,
        userData.block,
        userData.area,
        userData.city,
        userData.state,
      ]
        .filter(Boolean)
        .join(", ");

      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.mobile,
        address: fullAddress || "Not Provided",
        role: apiRole,
      };

      const res = await api.post("/admin/users", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("User Registered:", res.data);
      setShowSuccess(true);

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen py-6 flex flex-col md:flex-row bg-sky-100">
      {/* Left Image */}
      <div className="md:w-1/2 w-full flex items-center justify-center relative">
        <img
          src="/login-img.png"
          alt="Register Banner"
          className="md:object-cover object-contain w-[90%] md:w-[85%] h-[250px] md:h-[90vh] mt-2 md:mt-0 md:ml-14"
        />
      </div>

      {/* Right Form Section */}
      <div className="md:w-1/2 w-full flex items-center justify-center px-4 py-8 md:py-0">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white shadow-xl rounded-3xl px-8 py-4 space-y-5 animate-fadeIn"
        >
          {/* 🔙 Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-lg shadow-md transition active:scale-95"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-bold text-sky-700 text-center">
            Create Account
          </h2>

          {/* Role Select */}
          <div>
            <label className="block text-gray-600 mb-1">Register As</label>
            <select
              name="role"
              value={userData.role}
              onChange={handleChange}
              className="w-full border border-sky-200 rounded-lg h-10 px-3"
            >
              <option value="user">User</option>
              <option value="delivery">Delivery Man</option>
            </select>
          </div>

          {/* Two Column Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={userData.name}
              onChange={handleChange}
              className="border border-sky-200 rounded-lg"
              required
            />

            <Input
              type="number"
              name="mobile"
              placeholder="Mobile Number"
              value={userData.mobile}
              onChange={handleChange}
              className="border border-sky-200 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
              className="border border-sky-200 rounded-lg"
              required
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
              className="border border-sky-200 rounded-lg"
              required
            />
          </div>

          {/* Meal Fields (User Only) */}
          {userData.role === "user" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="mealType"
                value={userData.mealType}
                onChange={handleChange}
                className="border border-sky-200 rounded-lg h-10 px-2"
                required
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>

              <Input
                type="number"
                min="1"
                name="mealsCount"
                value={userData.mealsCount}
                onChange={handleChange}
                className="border border-sky-200 rounded-lg"
                required
              />
            </div>
          )}

          {/* 📍 Address Fields (Both Roles) */}
          <div className="space-y-4 mt-3">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">State</Label>
                <Input
                  name="state"
                  value={userData.state}
                  onChange={handleChange}
                  placeholder="Enter State"
                  required
                />
              </div>

              <div>
                <Label className="text-sm text-gray-600">City</Label>
                <Input
                  name="city"
                  value={userData.city}
                  onChange={handleChange}
                  placeholder="Enter City"
                  required
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Area / Colony</Label>
                <Input
                  name="area"
                  value={userData.area}
                  onChange={handleChange}
                  placeholder="Enter Area / Colony"
                  required
                />
              </div>

              <div>
                <Label className="text-sm text-gray-600">Block</Label>
                <Input
                  name="block"
                  value={userData.block}
                  onChange={handleChange}
                  placeholder="Enter Block"
                  required
                />
              </div>
            </div>

            {/* Row 3 */}
            <div>
              <Label className="text-sm text-gray-600">
                Flat / House / Apartment
              </Label>
              <Input
                name="flat"
                value={userData.flat}
                onChange={handleChange}
                placeholder="Enter Flat / House / Apartment"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button className="w-full bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-300">
            Register
          </button>
        </form>
      </div>

      {/* 🔹 Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-80 p-6 rounded-2xl shadow-lg text-center animate-fadeIn">
            <h3 className="text-lg font-semibold text-sky-700">
              Registration Successful 🎉
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              User has been registered successfully.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-xl transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
