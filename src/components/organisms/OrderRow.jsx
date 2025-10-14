import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import OrderModal from "./OrderModal";

const OrderRow = ({ order, onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      draft: "gray",
      confirmed: "blue",
      shipped: "yellow",
      delivered: "green",
      cancelled: "red"
    };
    return colors[status] || "gray";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      onDelete(order.Id);
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {order.order_number_c || "N/A"}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {order.deal_id_c?.Name || "N/A"}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {order.contact_id_c?.Name || "N/A"}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {formatDate(order.order_date_c)}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <Badge variant={getStatusColor(order.status_c)}>
            {order.status_c || "N/A"}
          </Badge>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-semibold text-gray-900">
            {formatCurrency(order.total_amount_c)}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowModal(true)}
              title="View Details"
            >
              <ApperIcon name="Eye" size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(order)}
              title="Edit Order"
            >
              <ApperIcon name="Edit" size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              title="Delete Order"
              className="text-red-600 hover:text-red-700"
            >
              <ApperIcon name="Trash2" size={18} />
            </Button>
          </div>
        </td>
      </tr>

      {showModal && (
        <OrderModal
          order={order}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default OrderRow;