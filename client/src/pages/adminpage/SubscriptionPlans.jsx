// import { useState, useEffect } from "react";
// import api from "@/services/api";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { toast } from "sonner";
// import { Plus, Edit, Power } from "lucide-react";

// export default function SubscriptionPlans() {
//   const [plans, setPlans] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editPlan, setEditPlan] = useState(null);

//   const [form, setForm] = useState({
//     name: "",
//     duration_days: "",
//     skip_days: "",
//     price: "",
//     description: "",
//     is_active: true,
//   });

//   const token = sessionStorage.getItem("accessToken");

//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   const fetchPlans = async () => {
//     try {
//       const res = await api.get("/admin/subscription-plans", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPlans(res.data.rows || []);
//     } catch {
//       toast.error("Failed to load subscription plans");
//     }
//   };

//   const handleCreateOrUpdate = async () => {
//     try {
//       const payload = { ...form };

//       if (editPlan) {
//         await api.put(`/admin/subscription-plans/${editPlan.id}`, payload, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         toast.success("Plan updated successfully");
//       } else {
//         await api.post("/admin/subscription-plans", payload, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         toast.success("Subscription plan created");
//       }

//       setIsModalOpen(false);
//       setEditPlan(null);
//       resetForm();
//       fetchPlans();
//     } catch {
//       toast.error("Failed to save plan");
//     }
//   };

//   const resetForm = () =>
//     setForm({
//       name: "",
//       duration_days: "",
//       skip_days: "",
//       price: "",
//       description: "",
//       is_active: true,
//     });

//   const toggleStatus = async (plan) => {
//     try {
//       await api.put(
//         `/admin/subscription-plans/${plan.id}`,
//         { is_active: !plan.is_active },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("Plan status updated");
//       fetchPlans();
//     } catch {
//       toast.error("Failed to update status");
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-bold text-sky-700">Subscription Plans</h1>

//         <Button
//           className="bg-sky-600 hover:bg-sky-700 text-white flex gap-2"
//           onClick={() => {
//             setEditPlan(null);
//             resetForm();
//             setIsModalOpen(true);
//           }}
//         >
//           <Plus size={18} /> Add Plan
//         </Button>
//       </div>

//       {/* PLAN LIST TABLE */}
//       <div className="overflow-x-auto mt-3">
//         <table className="w-full text-sm border">
//           <thead className="bg-sky-50">
//             <tr>
//               <th className="p-3 text-left">Plan</th>
//               <th className="p-3">Days</th>
//               <th className="p-3">Skip Days</th>
//               <th className="p-3">Price</th>
//               <th className="p-3">Status</th>
//               <th className="p-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {plans.map((plan) => (
//               <tr key={plan.id} className="border-t hover:bg-gray-50">
//                 <td className="p-3 font-medium">{plan.name}</td>
//                 <td className="p-3 text-center">{plan.duration_days}</td>
//                 <td className="p-3 text-center">{plan.skip_days}</td>
//                 <td className="p-3 text-center text-green-600 font-semibold">
//                   ₹{plan.price}
//                 </td>
//                 <td className="p-3 text-center">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       plan.is_active
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-600"
//                     }`}
//                   >
//                     {plan.is_active ? "Active" : "Inactive"}
//                   </span>
//                 </td>

//                 <td className="p-3 flex justify-center gap-3">
//                   <Button
//                     size="sm"
//                     className="bg-sky-500 hover:bg-sky-600 text-white"
//                     onClick={() => {
//                       setEditPlan(plan);
//                       setForm(plan);
//                       setIsModalOpen(true);
//                     }}
//                   >
//                     <Edit size={14} />
//                   </Button>

//                   <Button
//                     size="sm"
//                     className="bg-gray-600 hover:bg-gray-700 text-white"
//                     onClick={() => toggleStatus(plan)}
//                   >
//                     <Power size={14} />
//                   </Button>
//                 </td>
//               </tr>
//             ))}

//             {plans.length === 0 && (
//               <tr>
//                 <td className="p-4 text-center text-gray-500" colSpan="6">
//                   No plans found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ADD / EDIT PLAN MODAL */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>
//               {editPlan ? "Edit Subscription Plan" : "Add Subscription Plan"}
//             </DialogTitle>
//           </DialogHeader>

//           <div className="flex flex-col gap-3">
//             <input
//               placeholder="Plan Name"
//               className="border p-2 rounded"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//             />
//             <input
//               type="number"
//               placeholder="Duration (Days)"
//               className="border p-2 rounded"
//               value={form.duration_days}
//               onChange={(e) =>
//                 setForm({ ...form, duration_days: e.target.value })
//               }
//             />
//             <input
//               type="number"
//               placeholder="Skip Days"
//               className="border p-2 rounded"
//               value={form.skip_days}
//               onChange={(e) =>
//                 setForm({ ...form, skip_days: e.target.value })
//               }
//             />
//             <input
//               type="number"
//               placeholder="Price (₹)"
//               className="border p-2 rounded"
//               value={form.price}
//               onChange={(e) =>
//                 setForm({ ...form, price: e.target.value })
//               }
//             />
//             <textarea
//               className="border p-2 rounded"
//               placeholder="Description"
//               rows={3}
//               value={form.description}
//               onChange={(e) =>
//                 setForm({ ...form, description: e.target.value })
//               }
//             />
//           </div>

//           <DialogFooter>
//             <Button
//               onClick={handleCreateOrUpdate}
//               className="bg-sky-600 text-white w-full"
//             >
//               Save Plan
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Power, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState(null);

  const [form, setForm] = useState({
    name: "",
    duration_days: "",
    skip_days: "",
    price: "",
    description: "",
    is_active: true,
  });

  const navigate = useNavigate();
  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/admin/subscription-plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(res.data.rows || []);
    } catch {
      toast.error("Failed to load subscription plans");
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      const payload = { ...form };

      if (editPlan) {
        await api.put(`/admin/subscription-plans/${editPlan.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Plan updated successfully");
      } else {
        await api.post("/admin/subscription-plans", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Subscription plan created");
      }

      setIsModalOpen(false);
      setEditPlan(null);
      resetForm();
      fetchPlans();
    } catch {
      toast.error("Failed to save plan");
    }
  };

  const resetForm = () =>
    setForm({
      name: "",
      duration_days: "",
      skip_days: "",
      price: "",
      description: "",
      is_active: true,
    });

  const toggleStatus = async (plan) => {
    try {
      await api.put(
        `/admin/subscription-plans/${plan.id}`,
        { is_active: !plan.is_active },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Plan status updated");
      fetchPlans();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      {/* 🔙 BACK BUTTON */}
      <Button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm mb-4 bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg"
      >
        <ArrowLeft size={16} /> Back
      </Button>

      {/* 🔥 MAIN WRAPPER */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-sky-700">
            Subscription Plans
          </h1>

          <Button
            className="bg-sky-600 hover:bg-sky-700 text-white flex gap-2 px-4 py-2"
            onClick={() => {
              setEditPlan(null);
              resetForm();
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} /> Add Plan
          </Button>
        </div>

        {/* PLAN LIST TABLE */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-sm border rounded-lg">
            <thead className="bg-sky-50 text-gray-700">
              <tr className="text-xs sm:text-sm">
                <th className="p-3 text-left">Plan</th>
                <th className="p-3">Days</th>
                <th className="p-3">Skip Days</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {plans.map((plan) => (
                <tr
                  key={plan.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{plan.name}</td>
                  <td className="p-3 text-center">{plan.duration_days}</td>
                  <td className="p-3 text-center">{plan.skip_days}</td>
                  <td className="p-3 text-center text-green-600 font-semibold">
                    ₹{plan.price}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        plan.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {plan.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 flex justify-center gap-3">
                    <Button
                      size="sm"
                      className="bg-sky-500 hover:bg-sky-600 text-white"
                      onClick={() => {
                        setEditPlan(plan);
                        setForm(plan);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit size={14} />
                    </Button>

                    <Button
                      size="sm"
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                      onClick={() => toggleStatus(plan)}
                    >
                      <Power size={14} />
                    </Button>
                  </td>
                </tr>
              ))}

              {plans.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No plans found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PLAN MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>
              {editPlan ? "Edit Subscription Plan" : "Add Subscription Plan"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-2">
            <input
              placeholder="Plan Name"
              className="border p-2 rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="number"
              placeholder="Duration (Days)"
              className="border p-2 rounded"
              value={form.duration_days}
              onChange={(e) =>
                setForm({ ...form, duration_days: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Skip Days"
              className="border p-2 rounded"
              value={form.skip_days}
              onChange={(e) =>
                setForm({ ...form, skip_days: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Price (₹)"
              className="border p-2 rounded"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <textarea
              className="border p-2 rounded"
              placeholder="Description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button
              onClick={handleCreateOrUpdate}
              className="bg-sky-600 text-white w-full"
            >
              Save Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
