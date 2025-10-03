import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import companyService from "@/services/api/companyService";

const CompanyFormModal = ({ company, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name_c: "",
    industry_c: "",
    address_c: "",
    city_c: "",
    state_c: "",
    zip_code_c: "",
    phone_c: "",
    website_c: "",
    Tags: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (company) {
      setFormData({
        name_c: company.name_c || "",
        industry_c: company.industry_c || "",
        address_c: company.address_c || "",
        city_c: company.city_c || "",
        state_c: company.state_c || "",
        zip_code_c: company.zip_code_c || "",
        phone_c: company.phone_c || "",
        website_c: company.website_c || "",
        Tags: company.Tags || ""
      });
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name_c.trim()) newErrors.name_c = "Company name is required";
    if (formData.website_c && !/^https?:\/\/.+/.test(formData.website_c)) {
      newErrors.website_c = "Please enter a valid URL (include http:// or https://)";
    }
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
      const companyData = {
        ...formData
      };

      if (company) {
        await companyService.update(company.Id, companyData);
        toast.success("Company updated successfully");
      } else {
        await companyService.create(companyData);
        toast.success("Company created successfully");
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save company");
    } finally {
      setLoading(false);
    }
  };

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
                  <ApperIcon name="Building2" size={24} />
                </div>
                <h2 className="text-2xl font-bold">
                  {company ? "Edit Company" : "New Company"}
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
                label="Company Name"
                name="name_c"
                value={formData.name_c}
                onChange={handleChange}
                error={errors.name_c}
                placeholder="Acme Corporation"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Industry"
                  name="industry_c"
                  value={formData.industry_c}
                  onChange={handleChange}
                  placeholder="Technology"
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
                label="Website"
                name="website_c"
                type="url"
                value={formData.website_c}
                onChange={handleChange}
                error={errors.website_c}
                placeholder="https://example.com"
              />

              <FormField
                label="Address"
                name="address_c"
                type="textarea"
                value={formData.address_c}
                onChange={handleChange}
                placeholder="123 Main Street, Suite 100"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  label="City"
                  name="city_c"
                  value={formData.city_c}
                  onChange={handleChange}
                  placeholder="San Francisco"
                />

                <FormField
                  label="State"
                  name="state_c"
                  value={formData.state_c}
                  onChange={handleChange}
                  placeholder="CA"
                />

                <FormField
                  label="Zip Code"
                  name="zip_code_c"
                  value={formData.zip_code_c}
                  onChange={handleChange}
                  placeholder="94102"
                />
              </div>

              <FormField
                label="Tags"
                name="Tags"
                value={formData.Tags}
                onChange={handleChange}
                placeholder="enterprise, saas, b2b (comma-separated)"
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
                    {company ? "Update Company" : "Create Company"}
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

export default CompanyFormModal;