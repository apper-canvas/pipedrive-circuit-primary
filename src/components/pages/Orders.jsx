import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import orderService from "@/services/api/orderService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import OrderRow from "@/components/organisms/OrderRow";
import OrderFormModal from "@/components/organisms/OrderFormModal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

if (searchTerm) {
      filtered = filtered.filter(order => 
        order.order_number_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.contact_id_c?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.deal_id_c?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.quote_id_c?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status_c === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setIsFormModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsFormModalOpen(true);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      await orderService.delete(orderId);
      toast.success("Order deleted successfully");
      loadOrders();
    } catch (err) {
      toast.error("Failed to delete order");
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setSelectedOrder(null);
    loadOrders();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-gray-600 mt-1">Manage your sales orders</p>
        </div>
        <Button onClick={handleCreateOrder}>
          <ApperIcon name="Plus" size={20} />
          Create Order
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by order number, contact, or deal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<ApperIcon name="Search" size={18} />}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Empty 
          message={searchTerm || statusFilter !== "all" ? "No orders match your filters" : "No orders yet"}
          action={!searchTerm && statusFilter === "all" ? {
            label: "Create First Order",
            onClick: handleCreateOrder
          } : undefined}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Deal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <OrderRow
                    key={order.Id}
                    order={order}
                    onEdit={handleEditOrder}
                    onDelete={handleDeleteOrder}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isFormModalOpen && (
        <OrderFormModal
          order={selectedOrder}
          onClose={() => setIsFormModalOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default Orders;