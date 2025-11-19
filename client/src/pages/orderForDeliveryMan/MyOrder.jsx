// import React, { useEffect, useState } from "react";
// import { getUsersByColony, getColoniesByArea, getAreas } from "@/utils/storage";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner"; // ✅ Sonner Toast
// import { Search, MapPin, Phone, Utensils } from "lucide-react";
// import { motion } from "framer-motion";

// export default function MyOrders() {
//   const [orders, setOrders] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeFilter, setActiveFilter] = useState("Pending");

//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isTransferDialogOpen, setTransferDialogOpen] = useState(false);
//   const [isDeliveredDialogOpen, setDeliveredDialogOpen] = useState(false);
//   const [tiffinCount, setTiffinCount] = useState([]);

//   const nearestDeliveryMan = "Amit Sharma";

//   // ✅ Load Data
//   useEffect(() => {
//     const areas = getAreas();
//     const colonies = areas.flatMap((a) => getColoniesByArea(a.id));
//     const allOrders = colonies.flatMap((c) => getUsersByColony(c.id));

//     const savedStatuses =
//       JSON.parse(localStorage.getItem("orderStatuses")) || {};

//     const final = allOrders.map((o) => ({
//       ...o,
//       status: savedStatuses[o.id] || "Pending",
//     }));

//     setOrders(final);
//   }, []);

//   // ✅ Update Status + Toast + Persist to localStorage
//   const updateStatus = (orderId, newStatus, message) => {
//     setOrders((prev) => {
//       const updated = prev.map((o) =>
//         o.id === orderId ? { ...o, status: newStatus } : o
//       );

//       const saved = {};
//       updated.forEach((o) => (saved[o.id] = o.status));
//       localStorage.setItem("orderStatuses", JSON.stringify(saved));

//       toast.success(message, { duration: 1500 }); // ✅ SUCCESS TOAST

//       return updated;
//     });
//   };

//   const confirmDeliveryWithoutReturn = () => {
//     updateStatus(selectedOrder.id, "Delivered", "Order marked as delivered ✅");
//   };

//   const confirmPreviousTiffin = () => {
//     updateStatus(
//       selectedOrder.id,
//       "Delivered",
//       "Delivery confirmed with empty tiffin return ✅"
//     );
//     setTiffinCount([]);
//     setDeliveredDialogOpen(false);
//   };

//   const confirmTransfer = () => {
//     updateStatus(
//       selectedOrder.id,
//       "Transferred",
//       "Order transferred to another delivery man 🔁"
//     );
//     setTransferDialogOpen(false);
//   };

//   const handleCheckboxChange = (value) => {
//     setTiffinCount((prev) =>
//       prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
//     );
//   };

//   // ✅ Apply filter + search
//   const filteredOrders = orders.filter(
//     (o) =>
//       o.status === activeFilter &&
//       `${o.name} ${o.address} ${o.phone}`
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
//       {/* HEADER + SEARCH + BACK BUTTON */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         {/* LEFT SIDE → BACK + TITLE */}
//         {/* BACK BUTTON + TITLE */}
//         <div className="flex items-center gap-4">
//           <motion.button
//             whileTap={{ scale: 0.92 }}
//             whileHover={{ scale: 1.05 }}
//             onClick={() => window.history.back()}
//             className="relative overflow-hidden  bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-xl shadow-lg transition-all"
//           >
//             ⬅ Back
//             {/* Ripple effect */}
//             <span className="absolute inset-0 bg-white opacity-10 rounded-xl scale-0 hover:scale-150 transition-all duration-500"></span>
//           </motion.button>

//           <h1 className="text-3xl font-extrabold text-sky-700 tracking-tight">
//             My Orders 🚚
//           </h1>
//         </div>

//         {/* RIGHT SIDE → SEARCH */}
//         <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2 shadow-md border w-full sm:w-72">
//           <Search className="h-5 w-5 text-gray-400" />
//           <input
//             className="w-full outline-none text-sm text-gray-600"
//             placeholder="Search by name / phone / address"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* ✅ Filter Tabs */}
//       <Tabs
//         value={activeFilter}
//         onValueChange={setActiveFilter}
//         className="mt-6"
//       >
//         <TabsList className="bg-white rounded-xl shadow-md p-1 flex justify-between gap-4">
//           <TabsTrigger
//             value="Pending"
//             className="px-6 py-2 rounded-xl data-[state=active]:bg-sky-600 data-[state=active]:text-white"
//           >
//             Pending
//           </TabsTrigger>
//           <TabsTrigger
//             value="Delivered"
//             className="px-6 py-2 rounded-xl data-[state=active]:bg-green-600 data-[state=active]:text-white"
//           >
//             Delivered
//           </TabsTrigger>
//           <TabsTrigger
//             value="Transferred"
//             className="px-6 py-2 rounded-xl data-[state=active]:bg-orange-600 data-[state=active]:text-white"
//           >
//             Transferred
//           </TabsTrigger>
//         </TabsList>
//       </Tabs>

//       {/* ✅ Orders */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
//         {filteredOrders.length > 0 ? (
//           filteredOrders.map((order) => (
//             <div
//               key={order.id}
//               className="bg-white border rounded-3xl p-5 shadow-lg hover:shadow-lg hover:border-cyan-300 hover:scale-[1.02] transition-all duration-300 cursor-default"
//             >
//               <div className="flex justify-between items-center">
//                 <h2 className="text-lg font-bold text-gray-800">
//                   {order.name}
//                 </h2>
//                 <span
//                   className={`text-xs px-3 py-1 rounded-full font-medium ${
//                     order.status === "Delivered"
//                       ? "bg-green-100 text-green-700"
//                       : order.status === "Transferred"
//                       ? "bg-orange-100 text-orange-700"
//                       : "bg-gray-200 text-gray-700"
//                   }`}
//                 >
//                   {order.status}
//                 </span>
//               </div>

//               <div className="mt-3 space-y-1 text-sm text-gray-600">
//                 <p className="flex items-center gap-2">
//                   <MapPin size={16} className="text-sky-600" /> {order.address}
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <Phone size={16} className="text-green-600" /> {order.phone}
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <Utensils size={16} className="text-orange-600" />
//                   {order.mealType} — {order.mealsCount} meal(s)
//                 </p>
//               </div>

//               <div className="mt-5 flex gap-3">
//                 <Button
//                   disabled={order.status !== "Pending"}
//                   className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-700"
//                   onClick={() => {
//                     setSelectedOrder(order);
//                     setDeliveredDialogOpen(true);
//                   }}
//                 >
//                   ✅ Delivered
//                 </Button>

//                 <Button
//                   disabled={order.status !== "Pending"}
//                   className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-700"
//                   onClick={() => {
//                     setSelectedOrder(order);
//                     setTransferDialogOpen(true);
//                   }}
//                 >
//                   🔁 Transfer
//                 </Button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="col-span-full text-center text-gray-500 font-medium pt-6">
//             No <span className="font-semibold">{activeFilter}</span> orders
//             found.
//           </p>
//         )}
//       </div>

//       {/* ✅ Mark Delivered Dialog */}
//       <Dialog
//         open={isDeliveredDialogOpen}
//         onOpenChange={setDeliveredDialogOpen}
//       >
//         <DialogContent className="rounded-2xl p-6">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold">
//               Mark as Delivered
//             </DialogTitle>
//           </DialogHeader>

//           {/* Confirm without tiffin return */}
//           <Button
//             onClick={confirmDeliveryWithoutReturn}
//             className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             ✅ Confirm Delivery (No Previous Tiffin)
//           </Button>

//           <h3 className="mt-6 text-gray-700 font-medium">
//             Previous Empty Tiffin Count
//           </h3>

//           <div className="flex gap-4 mt-2">
//             {[1, 2].map((num) => (
//               <label
//                 key={num}
//                 className="flex items-center gap-2 cursor-pointer"
//               >
//                 <input
//                   type="checkbox"
//                   checked={tiffinCount.includes(num)}
//                   onChange={() => handleCheckboxChange(num)}
//                   className="w-5 h-5"
//                 />
//                 <span className="text-base font-medium">{num}</span>
//               </label>
//             ))}
//           </div>

//           {tiffinCount.length > 0 && (
//             <DialogFooter>
//               <Button
//                 onClick={confirmPreviousTiffin}
//                 className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white"
//               >
//                 ✅ Confirm Previous Empty Tiffin
//               </Button>
//             </DialogFooter>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* ✅ Transfer Dialog */}
//       <Dialog open={isTransferDialogOpen} onOpenChange={setTransferDialogOpen}>
//         <DialogContent className="rounded-2xl p-6">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold">
//               Transfer Order
//             </DialogTitle>
//           </DialogHeader>

//           <p className="text-gray-600">Nearest available delivery man:</p>

//           <div className="p-3 rounded-xl bg-gray-100 font-semibold mt-2 border">
//             {nearestDeliveryMan}
//           </div>

//           <DialogFooter>
//             <Button
//               onClick={confirmTransfer}
//               className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 text-white"
//             >
//               ✅ Confirm Transfer
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import { getUsersByColony, getColoniesByArea, getAreas } from "@/utils/storage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search, MapPin, Phone, Utensils } from "lucide-react";
import { motion } from "framer-motion";

// ✅ Pagination imports (shadcn ui)
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Pending");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTransferDialogOpen, setTransferDialogOpen] = useState(false);
  const [isDeliveredDialogOpen, setDeliveredDialogOpen] = useState(false);

  const [tiffinCount, setTiffinCount] = useState([]);

  const nearestDeliveryMan = "Amit Sharma";

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 cards per page

  // ✅ Load Data
  useEffect(() => {
    const areas = getAreas();
    const colonies = areas.flatMap((a) => getColoniesByArea(a.id));
    const allOrders = colonies.flatMap((c) => getUsersByColony(c.id));

    const savedStatuses =
      JSON.parse(localStorage.getItem("orderStatuses")) || {};

    const final = allOrders.map((o) => ({
      ...o,
      status: savedStatuses[o.id] || "Pending",
    }));

    setOrders(final);
  }, []);

  // ✅ Update Status + Toast + Save to localStorage
  const updateStatus = (orderId, newStatus, message) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      );

      const saved = {};
      updated.forEach((o) => (saved[o.id] = o.status));
      localStorage.setItem("orderStatuses", JSON.stringify(saved));

      toast.success(message, { duration: 1500 });

      return updated;
    });
  };

  const confirmDeliveryWithoutReturn = () => {
    updateStatus(selectedOrder.id, "Delivered", "Order marked as delivered ✅");
  };

  const confirmPreviousTiffin = () => {
    updateStatus(
      selectedOrder.id,
      "Delivered",
      "Delivery confirmed with empty tiffin return ✅"
    );
    setTiffinCount([]);
    setDeliveredDialogOpen(false);
  };

  const confirmTransfer = () => {
    updateStatus(
      selectedOrder.id,
      "Transferred",
      "Order transferred to another delivery man 🔁"
    );
    setTransferDialogOpen(false);
  };

  const handleCheckboxChange = (value) => {
    setTiffinCount((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // ✅ Apply Filter + Search
  const filteredOrders = orders.filter(
    (o) =>
      o.status === activeFilter &&
      `${o.name} ${o.address} ${o.phone}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to first page whenever filter or search changes
  }, [activeFilter, searchQuery]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
      {/* HEADER + SEARCH + BACK BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => window.history.back()}
            className="relative overflow-hidden bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-xl shadow-lg transition-all"
          >
            ⬅ Back
            <span className="absolute inset-0 bg-white opacity-10 rounded-xl scale-0 hover:scale-150 transition-all duration-500"></span>
          </motion.button>

          <h1 className="text-3xl font-extrabold text-sky-700 tracking-tight">
            My Orders 🚚
          </h1>
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2 shadow-md border w-full sm:w-72">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            className="w-full outline-none text-sm text-gray-600"
            placeholder="Search by name / phone / address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ✅ Filter Tabs */}
      <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mt-6">
        <TabsList className="bg-white rounded-xl shadow-md p-1 flex justify-between gap-4">
          <TabsTrigger value="Pending" className="px-6 py-2 rounded-xl data-[state=active]:bg-sky-600 data-[state=active]:text-white">
            Pending
          </TabsTrigger>
          <TabsTrigger value="Delivered" className="px-6 py-2 rounded-xl data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Delivered
          </TabsTrigger>
          <TabsTrigger value="Transferred" className="px-6 py-2 rounded-xl data-[state=active]:bg-orange-600 data-[state=active]:text-white">
            Transferred
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ✅ Orders (Paginated Results) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
        {paginatedOrders.length > 0 ? (
          paginatedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border rounded-3xl p-5 shadow-lg hover:shadow-lg hover:border-cyan-300 hover:scale-[1.02] transition-all duration-300 cursor-default"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{order.name}</h2>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Transferred"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-sky-600" /> {order.address}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-green-600" /> {order.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Utensils size={16} className="text-orange-600" />
                  {order.mealType} — {order.mealsCount} meal(s)
                </p>
              </div>

              <div className="mt-5 flex gap-3">
                <Button
                  disabled={order.status !== "Pending"}
                  className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-700"
                  onClick={() => {
                    setSelectedOrder(order);
                    setDeliveredDialogOpen(true);
                  }}
                >
                  ✅ Delivered
                </Button>

                <Button
                  disabled={order.status !== "Pending"}
                  className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-700"
                  onClick={() => {
                    setSelectedOrder(order);
                    setTransferDialogOpen(true);
                  }}
                >
                  🔁 Transfer
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 font-medium pt-6">
            No <span className="font-semibold">{activeFilter}</span> orders found.
          </p>
        )}
      </div>

      {/* ✅ Pagination UI */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* ✅ Delivered Dialog */}
      <Dialog open={isDeliveredDialogOpen} onOpenChange={setDeliveredDialogOpen}>
        <DialogContent className="rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Mark as Delivered
            </DialogTitle>
          </DialogHeader>

          <Button
            onClick={confirmDeliveryWithoutReturn}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          >
            ✅ Confirm Delivery (No Previous Tiffin)
          </Button>

          <h3 className="mt-6 text-gray-700 font-medium">
            Previous Empty Tiffin Count
          </h3>

          <div className="flex gap-4 mt-2">
            {[1, 2].map((num) => (
              <label key={num} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tiffinCount.includes(num)}
                  onChange={() => handleCheckboxChange(num)}
                  className="w-5 h-5"
                />
                <span className="text-base font-medium">{num}</span>
              </label>
            ))}
          </div>

          {tiffinCount.length > 0 && (
            <DialogFooter>
              <Button
                onClick={confirmPreviousTiffin}
                className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white"
              >
                ✅ Confirm Previous Empty Tiffin
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent className="rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Transfer Order
            </DialogTitle>
          </DialogHeader>

          <p className="text-gray-600">Nearest available delivery man:</p>

          <div className="p-3 rounded-xl bg-gray-100 font-semibold mt-2 border">
            {nearestDeliveryMan}
          </div>

          <DialogFooter>
            <Button
              onClick={confirmTransfer}
              className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 text-white"
            >
              ✅ Confirm Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
