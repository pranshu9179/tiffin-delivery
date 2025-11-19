import { useEffect, useState } from "react";
import data from "../../utils/data.json"; // ✅ Reads from data.json

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Truck,
  Users,
  Clock,
  Filter,
  Edit3,
  Utensils,
} from "lucide-react";

export default function DeliveryStatus() {
  const [logs, setLogs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDeliveryMan, setFilterDeliveryMan] = useState("All");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedDeliveryMan, setUpdatedDeliveryMan] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ✅ Load delivery logs from data.json
  useEffect(() => {
    if (data?.users?.length) {
      const extractedLogs = data.users.flatMap((user) =>
        user.deliveryStatus.map((status) => ({
          deliveryMan: status.assignedTo,
          transferredTo: status.transferredTo,
          emptyTiffinCount: status.emptyTiffinCount,
          customer: user.name,
          action: status.status,
          time: status.date,
        }))
      );

      setLogs(extractedLogs);
    }
  }, []);

  const deliveryMen = ["All", ...new Set(logs.map((l) => l.deliveryMan))];

  const filteredLogs = logs.filter(
    (log) =>
      (filterStatus === "All" || log.action.includes(filterStatus)) &&
      (filterDeliveryMan === "All" || log.deliveryMan === filterDeliveryMan)
  );

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterDeliveryMan]);

  const handleEditSave = () => {
    setLogs((prev) =>
      prev.map((log) =>
        log === selectedLog
          ? { ...log, action: updatedStatus, deliveryMan: updatedDeliveryMan }
          : log
      )
    );
    setIsEditOpen(false);
  };

  const summary = {
    Pending: logs.filter((l) => l.action === "Pending").length,
    Delivered: logs.filter((l) => l.action === "Delivered").length,
    Transferred: logs.filter((l) => l.action === "Transferred").length,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-100 via-white to-emerald-50 p-6 sm:p-10">
      {/* ✅ HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl font-extrabold text-emerald-700 tracking-tight drop-shadow-sm flex items-center gap-2">
          Delivery Status <span>📦</span>
        </h1>

        {/* ✅ FILTERS (Fixed mobile responsive layout) */}
        <div className="bg-white border rounded-2xl shadow-lg p-3 flex items-center gap-4 overflow-x-auto whitespace-nowrap w-full sm:w-auto">
          <Filter size={20} className="text-gray-600 shrink-0" />
          <span className="font-medium text-gray-700 text-sm shrink-0">
            Filters:
          </span>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-xl md:px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-emerald-300 shrink-0"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
            <option value="Transferred">Transferred</option>
          </select>

          {/* Delivery Man Filter */}
          <select
            value={filterDeliveryMan}
            onChange={(e) => setFilterDeliveryMan(e.target.value)}
            className="border rounded-xl md:px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-emerald-300 shrink-0"
          >
            {deliveryMen.map((man, i) => (
              <option key={i}>{man}</option>
            ))}
          </select>
        </div>

        {/* Back button */}
        <motion.button
          onClick={() => window.history.back()}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="flex items-center gap-2 bg-gray-800 hover:bg-black text-white px-5 py-2 rounded-xl shadow-xl"
        >
          <ArrowLeft size={18} /> Back
        </motion.button>
      </div>

      {/* ✅ SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {Object.entries(summary).map(([label, count], i) => (
          <motion.div key={i} whileHover={{ scale: 1.06 }}>
            <div className="rounded-2xl bg-white shadow-lg border border-emerald-200 p-6 text-center hover:border-emerald-500 transition-all">
              <h3 className="text-lg font-semibold">{label}</h3>
              <p className="text-4xl font-bold text-emerald-600">{count}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-20">
          <Truck size={70} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-lg text-gray-500 font-medium">
            No delivery activity yet.
          </h2>
        </div>
      )}

      {/* ✅ LOG CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {paginatedLogs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Card className="rounded-3xl bg-white shadow-lg border hover:border-emerald-400 hover:shadow-xl transition-all h-full">
              <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                {/* Status Badge */}
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full self-start ${
                    log.action === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : log.action === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {log.action}
                </span>

                <div className="space-y-2">
                  <p className="text-sm text-gray-800 font-semibold">
                    {log.customer}
                  </p>

                  <p className="text-sm text-emerald-700 font-medium flex items-center gap-2">
                    <Users size={16} /> Assigned: <b>{log.deliveryMan}</b>
                  </p>

                  {log.emptyTiffinCount > 0 && (
                    <p className="text-sm text-purple-700 font-medium flex items-center gap-2">
                      <Utensils size={16} /> Empty Tiffin Count:{" "}
                      <b>{log.emptyTiffinCount}</b>
                    </p>
                  )}

                  {log.action === "Transferred" && (
                    <p className="text-sm text-orange-600 font-semibold">
                      🔁 Transferred To: <b>{log.transferredTo}</b>
                    </p>
                  )}

                  <p className="text-xs text-gray-600 flex items-center gap-2">
                    <Clock size={14} /> {log.time}
                  </p>
                </div>

                {/* ✅ EDIT BUTTON */}
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 mt-2"
                  onClick={() => {
                    setSelectedLog(log);
                    setUpdatedStatus(log.action);
                    setUpdatedDeliveryMan(log.deliveryMan);
                    setIsEditOpen(true);
                  }}
                >
                  <Edit3 size={16} /> Edit Status
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ✅ PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    isActive={currentPage === idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className="cursor-pointer rounded-lg hover:bg-sky-600 hover:text-white"
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* ✅ EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-emerald-700">
              Edit Delivery Status
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <label className="text-sm font-medium">Status</label>
            <select
              value={updatedStatus}
              onChange={(e) => setUpdatedStatus(e.target.value)}
              className="border rounded-xl px-4 py-2 w-full shadow-sm"
            >
              <option>Pending</option>
              <option>Delivered</option>
              <option>Transferred</option>
            </select>

            <label className="text-sm font-medium">Assign Delivery Man</label>
            <select
              value={updatedDeliveryMan}
              onChange={(e) => setUpdatedDeliveryMan(e.target.value)}
              className="border rounded-xl px-4 py-2 w-full shadow-sm"
            >
              {deliveryMen.map((man, i) => (
                <option key={i}>{man}</option>
              ))}
            </select>

            <Button
              onClick={handleEditSave}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              ✅ Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
