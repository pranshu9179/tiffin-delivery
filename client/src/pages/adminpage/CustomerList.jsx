import { useEffect, useState } from "react";
import api from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Edit, Trash, PlusCircle, List, Eye } from "lucide-react";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // VIEW subscription list dialog
  const [isSubsOpen, setIsSubsOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);

  // Assign subscription modal
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [subscriptionPlanId, setSubscriptionPlanId] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  });
  const formatDateUI = (isoDate) => {
    if (!isoDate) return "—";
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Edit & Delete modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const onlyCustomers = res.data.rows.filter(
        (user) => user.role === "customer"
      );

      setCustomers(onlyCustomers);
    } catch {
      toast.error("Failed to load customers");
    }
  };

  // Fetch available plans
  const fetchPlans = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await api.get("/admin/subscription-plans", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPlans(res.data.rows || []);
    } catch {
      toast.error("Failed to load plans");
    }
  };

  // Fetch subscription list for specific user
  const fetchSubscriptions = async (
    id,
    openSubsModal = false,
    openEdit = false
  ) => {
    try {
      const token = sessionStorage.getItem("accessToken");

      const res = await api.get("/admin/subscriptions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = res.data.rows || [];
      data = data.filter((sub) => sub.customer_id === id);

      setSubscriptions(data);

      // pick active subscription for editing modal
      const activeSub = data.find((sub) => sub.status === "active");
      setActiveSubscription(activeSub);

      if (openSubsModal) setIsSubsOpen(true);
      if (openEdit) setIsEditOpen(true);
    } catch {
      toast.error("Failed to load subscriptions");
    }
  };

  // Assign subscription plan
  const handleAssignSubscription = async () => {
    if (!subscriptionPlanId || !startDate)
      return toast.error("Select plan & date");

    try {
      const token = sessionStorage.getItem("accessToken");

      const payload = {
        customer_id: selectedUser.id,
        subscription_plan_id: subscriptionPlanId,
        start_date: startDate,
      };

      await api.post("/admin/subscriptions", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Subscription assigned successfully");
      setIsPlanOpen(false);
      setSubscriptionPlanId("");
      setStartDate("");

      fetchSubscriptions(selectedUser.id);
    } catch {
      toast.error("Failed to assign subscription");
    }
  };

  // 🔥 CANCEL Subscription API
  const handleCancelSubscription = async () => {
    if (!activeSubscription) return toast.error("No active subscription found");

    try {
      const token = sessionStorage.getItem("accessToken");

      await api.put(
        `/admin/subscriptions/${activeSubscription.id}/status`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Subscription cancelled successfully");
      setIsEditOpen(false);
      fetchSubscriptions(selectedUser.id);
    } catch {
      toast.error("Failed to cancel subscription");
    }
  };

  // Update user
  const handleUpdateUser = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");

      await api.put(
        `/admin/users/${selectedUser.id}`,
        {
          name: selectedUser.name,
          phone: selectedUser.phone,
          is_active: selectedUser.is_active,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("User updated successfully");
      setIsEditOpen(false);
      fetchCustomers();
    } catch {
      toast.error("Failed to update user");
    }
  };

  // Delete user
  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");

      await api.delete(`/admin/users/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("User deleted successfully");
      setIsDeleteOpen(false);
      fetchCustomers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <>
      <h2 className="text-sm font-medium text-gray-600 mb-3">
        All Customers ({customers.length})
      </h2>

      {/* TABLE VIEW */}
      <div className="overflow-x-auto bg-white rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-sky-50 text-gray-700">
            <tr>
              <th className="p-3 text-left">No.</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((user, index) => (
              <tr
                key={user.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3 font-medium">{user.name}</td>
                <td className="p-3 break-all text-xs">{user.email}</td>
                <td className="p-3">{user.phone || "N/A"}</td>
                <td className="p-3 max-w-[250px] truncate">
                  {user.address || "Not Provided"}
                </td>

                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-3 flex justify-center gap-3 flex-wrap">
                  {/* ASSIGN PLAN (DISABLED IF ACTIVE PLAN EXIST) */}
                  <Button
                    size="sm"
                    disabled={subscriptions.some(
                      (sub) =>
                        sub.customer_id === user.id && sub.status === "active"
                    )}
                    className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      setSelectedUser(user);
                      fetchPlans();
                      fetchSubscriptions(user.id);
                      setIsPlanOpen(true);
                    }}
                  >
                    <PlusCircle size={14} /> Assign Plan
                  </Button>

                  {/* VIEW SUBSCRIPTIONS */}
                  <Button
                    size="sm"
                    className="bg-gray-700 hover:bg-gray-800 text-white"
                    onClick={() => {
                      setSelectedUser(user);
                      fetchSubscriptions(user.id, true);
                    }}
                  >
                    <Eye size={14} /> View
                  </Button>

                  {/* EDIT */}
                  <Button
                    size="sm"
                    className="bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => {
                      setSelectedUser(user);
                      fetchSubscriptions(user.id, false, true);
                    }}
                  >
                    <Edit size={14} /> Edit
                  </Button>

                  {/* DELETE */}
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <Trash size={14} /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- ASSIGN PLAN MODAL ---------------- */}
      <Dialog open={isPlanOpen} onOpenChange={setIsPlanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Subscription Plan</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-2">
            <select
              className="border p-2 rounded"
              value={subscriptionPlanId}
              onChange={(e) => setSubscriptionPlanId(e.target.value)}
            >
              <option value="">Select Plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} — ₹{plan.price}
                </option>
              ))}
            </select>

            {/* 🔥 Input shows ISO format but converted to dd/mm/yyyy visually */}
            <input
              type="date"
              className="border p-2 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            {/* Display formatted date (DD/MM/YYYY) */}
            <p className="text-xs text-gray-500 mt-1">
              Selected Date: {formatDateUI(startDate)}
            </p>
          </div>

          <DialogFooter>
            <Button
              onClick={handleAssignSubscription}
              className="bg-purple-600 text-white w-full"
            >
              Assign Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- VIEW SUBSCRIPTIONS MODAL ---------------- */}
      <Dialog open={isSubsOpen} onOpenChange={setIsSubsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>

          {/* CUSTOMER DETAILS (Cleaner UI like requested) */}
          {selectedUser && (
            <div className="space-y-2 text-sm p-2">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone || "Not Provided"}
              </p>
              <p>
                <strong>Address:</strong> {selectedUser.address}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedUser.is_active ? (
                  <span className="text-green-600 font-semibold">Active</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactive</span>
                )}
              </p>
              <p>
                <strong>Created:</strong> {formatDateUI(selectedUser.createdAt)}
              </p>
            </div>
          )}

          {/* NO SUBSCRIPTION */}
          {subscriptions.length === 0 && (
            <p className="text-center p-6 text-gray-500">
              ❌ No active subscriptions found
            </p>
          )}

          {/* SUBSCRIPTIONS TABLE */}
          {subscriptions.length > 0 && (
            <div>
              {" "}
              <DialogTitle>Current Subscription Plan </DialogTitle>
              <div className="overflow-x-auto rounded-lg border mt-2">
                <table className="min-w-full text-sm">
                  <thead className="bg-sky-50 text-gray-700">
                    <tr>
                      <th className="p-3 text-left">Plan</th>
                      <th className="p-3 text-center">Start</th>
                      <th className="p-3 text-center">End</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Price</th>
                    </tr>
                  </thead>

                  <tbody>
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{sub.subscriptionPlan?.name}</td>

                        <td className="p-3 text-center">
                          {formatDateUI(sub.start_date)}
                        </td>

                        <td className="p-3 text-center">
                          {formatDateUI(sub.end_date)}
                        </td>

                        <td className="p-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              sub.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {sub.status.toUpperCase()}
                          </span>
                        </td>

                        <td className="p-3 text-center text-green-600 font-semibold">
                          ₹{sub.subscriptionPlan?.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FOOTER */}
          <DialogFooter>
            <Button
              className="bg-gray-700 text-white"
              onClick={() => setIsSubsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ------------------ EDIT MODAL ------------------ */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="flex flex-col gap-3">
              <input
                className="border p-2 rounded"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
              />

              <input
                className="border p-2 rounded"
                value={selectedUser.phone}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, phone: e.target.value })
                }
              />

              <select
                className="border p-2 rounded"
                value={selectedUser.is_active}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    is_active: e.target.value === "true",
                  })
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              {/* 🔥 SHOW SUBSCRIPTION STATUS UPDATE IF ACTIVE PLAN EXISTS */}
              {activeSubscription && (
                <div className="border p-3 rounded bg-red-50 mt-3">
                  <p className="text-sm font-medium mb-2">
                    Current Subscription:{" "}
                    {activeSubscription.subscriptionPlan.name}
                  </p>

                  <Button
                    className="bg-red-600 text-white w-full"
                    onClick={handleCancelSubscription}
                  >
                    Cancel Subscription
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleUpdateUser} className="bg-sky-600 w-full">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- DELETE MODAL ---------------- */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-medium text-red-600">
              {selectedUser?.name}
            </span>
            ?
          </p>

          <DialogFooter>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white w-full"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
