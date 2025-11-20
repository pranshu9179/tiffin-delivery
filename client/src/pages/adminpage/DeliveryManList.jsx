

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
import { Edit, Trash, Eye } from "lucide-react";

export default function DeliveryManList() {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false); // 🔥 New View modal

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

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");

      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const onlyDelivery = res.data.rows.filter(
        (user) => user.role === "delivery_boy"
      );

      setDeliveryBoys(onlyDelivery);
    } catch (error) {
      toast.error("Failed to load delivery boys");
    }
  };

  const handleUpdate = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const payload = {
        name: selectedUser.name,
        phone: selectedUser.phone,
        is_active: selectedUser.is_active,
      };

      await api.put(`/admin/users/${selectedUser.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Delivery Boy updated successfully");
      setIsEditOpen(false);
      fetchDeliveryBoys();
    } catch {
      toast.error("Failed to update delivery boy");
    }
  };

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");

      await api.delete(`/admin/users/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Delivery Boy deleted successfully");
      setIsDeleteOpen(false);
      fetchDeliveryBoys();
    } catch {
      toast.error("Failed to delete delivery boy");
    }
  };

  return (
    <>
      <h2 className="text-sm font-medium text-gray-600 mb-3">
        All Delivery Boys ({deliveryBoys.length})
      </h2>

      {/* 🔥 TABLE VIEW */}
      <div className="overflow-x-auto bg-white rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-purple-50 text-gray-700">
            <tr>
              <th className="p-3 text-left">No.</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Created</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {deliveryBoys.map((user, index) => (
              <tr key={user.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3 font-medium">{user.name}</td>
                <td className="p-3 text-xs break-all">{user.email}</td>
                <td className="p-3">{user.phone || "N/A"}</td>

                <td className="p-3 max-w-[260px] truncate">
                  {user.address || "Not Provided"}
                </td>

                {/* STATUS */}
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

                {/* CREATED DATE */}
               
<td className="p-3 text-center text-xs">
  {formatDateUI(user.createdAt)}
</td>

                {/* ACTION BUTTONS */}
                <td className="p-3 flex justify-center gap-3 flex-wrap">

                  {/* VIEW DETAILS */}
                  <Button
                    size="sm"
                    className="bg-gray-700 hover:bg-gray-800 text-white"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsViewOpen(true);
                    }}
                  >
                    <Eye size={14} /> View
                  </Button>

                  {/* EDIT */}
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditOpen(true);
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

      {/* ---------------- VIEW DETAILS MODAL ---------------- */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delivery Boy Details</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-2 text-sm p-2">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Address:</strong> {selectedUser.address}</p>
             <p>
                <strong>Status:</strong>{" "}
                {selectedUser.is_active ? (
                  <span className="text-green-600 font-semibold">Active</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactive</span>
                )}
              </p>
              <p><strong>Created:</strong> {formatDateUI(selectedUser.createdAt)}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              className="bg-gray-700 text-white"
              onClick={() => setIsViewOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- EDIT MODAL ---------------- */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Delivery Boy</DialogTitle>
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
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleUpdate} className="bg-purple-600 w-full">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- DELETE MODAL ---------------- */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Delivery Boy?</DialogTitle>
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
