import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";

const DealModal = ({ deal, onClose, onSave }) => {
const [formData, setFormData] = useState({
    title_c: "",
    contact_id_c: "",
    value_c: "",
    stage_c: "lead",
    probability_c: 20,
    expected_close_c: "",
    notes_c: ""
  });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadContacts();
    if (deal) {
setFormData({
        title_c: deal.title_c || "",
        contact_id_c: deal.contact_id_c?.Id || deal.contact_id_c || "",
        value_c: deal.value_c || "",
        stage_c: deal.stage_c || "lead",
        probability_c: deal.probability_c || 20,
        expected_close_c: deal.expected_close_c || "",
        notes_c: deal.notes_c || ""
      });
    }
  }, [deal]);

  const loadContacts = async () => {
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      toast.error("Failed to load contacts");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.contactId) newErrors.contactId = "Contact is required";
    if (!formData.value || formData.value <= 0) newErrors.value = "Value must be greater than 0";
    if (!formData.expectedClose) newErrors.expectedClose = "Expected close date is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
const dealData = {
        ...formData,
        contact_id_c: parseInt(formData.contact_id_c),
        value_c: parseFloat(formData.value_c),
        probability_c: parseInt(formData.probability_c)
      };

      if (deal) {
        await dealService.update(deal.Id, dealData);
        toast.success("Deal updated successfully");
      } else {
        await dealService.create(dealData);
        toast.success("Deal created successfully");
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save deal");
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    { value: "lead", label: "Lead" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed-won", label: "Closed Won" },
    { value: "closed-lost", label: "Closed Lost" }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <ApperIcon name="TrendingUp" size={24} />
                </div>
                <h2 className="text-2xl font-bold">
                  {deal ? "Edit Deal" : "New Deal"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="space-y-4">
              <FormField
                label="Deal Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                placeholder="Enter deal title"
                required
              />

              <FormField
                label="Contact"
                name="contactId"
                type="select"
                value={formData.contactId}
                onChange={handleChange}
                error={errors.contactId}
                required
                options={[
                  { value: "", label: "Select a contact" },
                  ...contacts.map((c) => ({
value: c.Id,
                    label: `${c.Name} - ${c.company_c}`
                  }))
                ]}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Deal Value"
                  name="value"
                  type="number"
                  value={formData.value}
                  onChange={handleChange}
                  error={errors.value}
                  placeholder="0"
                  required
                />

                <FormField
                  label="Stage"
                  name="stage"
                  type="select"
                  value={formData.stage}
                  onChange={handleChange}
                  required
                  options={stages}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Probability (%)"
                  name="probability"
                  type="number"
                  value={formData.probability}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                />

                <FormField
                  label="Expected Close Date"
                  name="expectedClose"
                  type="date"
                  value={formData.expectedClose}
                  onChange={handleChange}
                  error={errors.expectedClose}
                  required
                />
              </div>

              <FormField
                label="Notes"
                name="notes"
                type="textarea"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any relevant notes..."
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Check" size={18} />
                    {deal ? "Update Deal" : "Create Deal"}
                  </>
                )}
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DealModal;