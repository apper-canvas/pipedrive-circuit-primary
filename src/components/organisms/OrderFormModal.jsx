import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import orderService from "@/services/api/orderService";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const OrderFormModal = ({ order, onClose, onSuccess }) => {
  const isEditMode = !!order;
  
  const [formData, setFormData] = useState({
    order_number_c: "",
    deal_id_c: "",
    contact_id_c: "",
    order_date_c: "",
    status_c: "draft",
    total_amount_c: "",
    notes_c: ""
  });
  
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (order) {
      setFormData({
        order_number_c: order.order_number_c || "",
        deal_id_c: order.deal_id_c?.Id || order.deal_id_c || "",
        contact_id_c: order.contact_id_c?.Id || order.contact_id_c || "",
        order_date_c: order.order_date_c || "",
        status_c: order.status_c || "draft",
        total_amount_c: order.total_amount_c || "",
        notes_c: order.notes_c || ""
      });
    }
  }, [order]);

  const loadInitialData = async () => {
    setLoadingData(true);
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      toast.error("Failed to load form data");
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.order_number_c || !formData.deal_id_c || !formData.contact_id_c || !formData.order_date_c) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await orderService.update(order.Id, formData);
        toast.success("Order updated successfully");
      } else {
        await orderService.create(formData);
        toast.success("Order created successfully");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.message || `Failed to ${isEditMode ? "update" : "create"} order`);
    } finally {
      setLoading(false);
    }
  };

  const dealOptions = [
    { value: "", label: "Select Deal" },
    ...deals.map(deal => ({
      value: deal.Id.toString(),
      label: deal.title_c || deal.Name || `Deal #${deal.Id}`
    }))
  ];

  const contactOptions = [
    { value: "", label: "Select Contact" },
    ...contacts.map(contact => ({
      value: contact.Id.toString(),
      label: contact.Name || `Contact #${contact.Id}`
    }))
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? "Edit Order" : "Create Order"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        {loadingData ? (
          <div className="p-12 flex items-center justify-center">
            <div className="animate-spin">
              <ApperIcon name="Loader2" size={32} />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Number <span className="text-red-500">*</span>
              </label>
              <Input
                name="order_number_c"
                value={formData.order_number_c}
                onChange={handleChange}
                placeholder="e.g., ORD-2024-001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal <span className="text-red-500">*</span>
              </label>
              <Select
                name="deal_id_c"
                value={formData.deal_id_c}
                onChange={handleChange}
                options={dealOptions}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact <span className="text-red-500">*</span>
              </label>
              <Select
                name="contact_id_c"
                value={formData.contact_id_c}
                onChange={handleChange}
                options={contactOptions}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="order_date_c"
                value={formData.order_date_c}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <Select
                name="status_c"
                value={formData.status_c}
                onChange={handleChange}
                options={statusOptions}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                name="total_amount_c"
                value={formData.total_amount_c}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes_c"
                value={formData.notes_c}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Add any additional notes..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" size={20} className="animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name="Check" size={20} />
                    {isEditMode ? "Update Order" : "Create Order"}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrderFormModal;