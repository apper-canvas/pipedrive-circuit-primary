import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import contactService from "@/services/api/contactService";

const ContactFormModal = ({ contact, onClose, onSave }) => {
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    company_c: "",
    job_title_c: "",
    city_c: "",
    state_c: "",
    pin_code_c: "",
    linkedin_url_c: "",
    status_c: "lead",
    tags_c: "",
    notes_c: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

useEffect(() => {
    if (contact) {
      setFormData({
        first_name_c: contact.first_name_c || "",
        last_name_c: contact.last_name_c || "",
        email_c: contact.email_c || "",
        phone_c: contact.phone_c || "",
        company_c: contact.company_c || "",
        job_title_c: contact.job_title_c || "",
        city_c: contact.city_c || "",
        state_c: contact.state_c || "",
        pin_code_c: contact.pin_code_c || "",
        linkedin_url_c: contact.linkedin_url_c || "",
        status_c: contact.status_c || "lead",
        tags_c: contact.tags_c || "",
        notes_c: contact.notes_c || ""
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
    if (!formData.first_name_c.trim()) newErrors.first_name_c = "First name is required";
    if (!formData.last_name_c.trim()) newErrors.last_name_c = "Last name is required";
    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Email is invalid";
    }
    if (!formData.company_c.trim()) newErrors.company_c = "Company is required";
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
        ...formData
      };

      if (contact) {
        await contactService.update(contact.Id, contactData);
        toast.success("Contact updated successfully");
      } else {
        const result = await contactService.create(contactData);
        if (result.clicksendSynced) {
          toast.success("Contact created and synced to ClickSend");
        } else {
          toast.success("Contact created but ClickSend sync failed");
        }
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
<div className="grid grid-cols-2 gap-4">
                <FormField
                  label="First Name"
name="first_name_c"
                  value={formData.first_name_c}
                  onChange={handleChange}
                  error={errors.first_name_c}
                  placeholder="John"
                  required
                />
                <FormField
label="Last Name"
                  name="last_name_c"
                  value={formData.last_name_c}
                  onChange={handleChange}
                  error={errors.last_name_c}
                  placeholder="Doe"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Email"
name="email_c"
                  type="email"
                  value={formData.email_c}
                  onChange={handleChange}
                  error={errors.email_c}
                  placeholder="john@example.com"
                  required
                />

                <FormField
                  label="Phone"
name="phone_c"
                  type="tel"
                  value={formData.phone_c}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
<FormField
              label="Job Title"
              id="jobTitle"
name="job_title_c"
              type="text"
              value={formData.job_title_c}
              onChange={handleChange}
              placeholder="e.g., Chief Technology Officer"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="City"
id="city"
                name="city_c"
                type="text"
                value={formData.city_c}
                onChange={handleChange}
                placeholder="e.g., San Francisco"
              />
              <FormField
                label="State"
                id="state"
name="state_c"
                type="text"
                value={formData.state_c}
                onChange={handleChange}
                placeholder="e.g., California"
              />
            </div>

            <FormField
              label="Pin Code"
              id="pinCode"
name="pin_code_c"
              type="text"
              value={formData.pin_code_c}
              onChange={handleChange}
              placeholder="e.g., 94102"
              pattern="[0-9]{5}"
            />

            <FormField
              label="LinkedIn Profile URL"
              id="linkedinUrl"
name="linkedin_url_c"
              type="url"
              value={formData.linkedin_url_c}
              onChange={handleChange}
              placeholder="e.g., https://linkedin.com/in/username"
            />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Company"
name="company_c"
                  value={formData.company_c}
                  onChange={handleChange}
                  error={errors.company_c}
                  placeholder="Company Name"
                  required
                />

                <FormField
                  label="Status"
name="status_c"
                  type="select"
                  value={formData.status_c}
                  onChange={handleChange}
                  required
                  options={statusOptions}
                />
              </div>

              <FormField
                label="Tags"
name="tags_c"
                value={formData.tags_c}
                onChange={handleChange}
                placeholder="enterprise, tech, saas (comma-separated)"
              />

              <FormField
                label="Notes"
name="notes_c"
                type="textarea"
                value={formData.notes_c}
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