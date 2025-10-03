import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import contactService from "@/services/api/contactService";

const ContactFormModal = ({ contact, onClose, onSave }) => {
const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    city: "",
    state: "",
    pinCode: "",
    linkedinUrl: "",
    status: "lead",
    tags: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setFormData({
name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        jobTitle: contact.jobTitle || "",
        city: contact.city || "",
        state: contact.state || "",
        pinCode: contact.pinCode || "",
        linkedinUrl: contact.linkedinUrl || "",
        status: contact.status,
        tags: contact.tags.join(", "),
        notes: contact.notes || ""
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.company.trim()) newErrors.company = "Company is required";
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
      const contactData = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      };

      if (contact) {
        await contactService.update(contact.Id, contactData);
        toast.success("Contact updated successfully");
      } else {
        await contactService.create(contactData);
        toast.success("Contact created successfully");
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save contact");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: "lead", label: "Lead" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
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
                  <ApperIcon name="UserPlus" size={24} />
                </div>
                <h2 className="text-2xl font-bold">
                  {contact ? "Edit Contact" : "New Contact"}
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
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="John Doe"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="john@example.com"
                  required
                />

                <FormField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
<FormField
              label="Job Title"
              id="jobTitle"
              name="jobTitle"
              type="text"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g., Chief Technology Officer"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="City"
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g., San Francisco"
              />
              <FormField
                label="State"
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g., California"
              />
            </div>

            <FormField
              label="Pin Code"
              id="pinCode"
              name="pinCode"
              type="text"
              value={formData.pinCode}
              onChange={handleChange}
              placeholder="e.g., 94102"
              pattern="[0-9]{5}"
            />

            <FormField
              label="LinkedIn Profile URL"
              id="linkedinUrl"
              name="linkedinUrl"
              type="url"
              value={formData.linkedinUrl}
              onChange={handleChange}
              placeholder="e.g., https://linkedin.com/in/username"
            />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  error={errors.company}
                  placeholder="Company Name"
                  required
                />

                <FormField
                  label="Status"
                  name="status"
                  type="select"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  options={statusOptions}
                />
              </div>

              <FormField
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="enterprise, tech, saas (comma-separated)"
              />

              <FormField
                label="Notes"
                name="notes"
                type="textarea"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any relevant notes about this contact..."
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
                    {contact ? "Update Contact" : "Create Contact"}
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

export default ContactFormModal;