import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const OrderModal = ({ order, onClose }) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Number
              </label>
              <p className="text-gray-900">{order.order_number_c || "N/A"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
Deal
              </label>
              <p className="text-gray-900">{order.deal_id_c?.Name || "N/A"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Quote
              </label>
              <p className="text-gray-900">{order.quote_id_c?.Name || "N/A"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact
              </label>
              <p className="text-gray-900">{order.contact_id_c?.Name || "N/A"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Date
              </label>
              <p className="text-gray-900">{formatDate(order.order_date_c)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Badge variant={getStatusColor(order.status_c)}>
                {order.status_c || "N/A"}
              </Badge>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount
              </label>
              <p className="text-gray-900 font-semibold">{formatCurrency(order.total_amount_c)}</p>
            </div>
          </div>

          {order.notes_c && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <p className="text-gray-900 whitespace-pre-wrap">{order.notes_c}</p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Created On:</span>
                <span className="ml-2 text-gray-900">{formatDate(order.CreatedOn)}</span>
              </div>
              <div>
                <span className="text-gray-500">Created By:</span>
                <span className="ml-2 text-gray-900">{order.CreatedBy?.Name || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-500">Modified On:</span>
                <span className="ml-2 text-gray-900">{formatDate(order.ModifiedOn)}</span>
              </div>
              <div>
                <span className="text-gray-500">Modified By:</span>
                <span className="ml-2 text-gray-900">{order.ModifiedBy?.Name || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;