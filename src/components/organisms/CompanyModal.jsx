import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const CompanyModal = ({ company, onClose }) => {
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
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {company.name_c?.charAt(0).toUpperCase() || 'C'}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{company.name_c}</h2>
                  <p className="text-white/90">{company.industry_c}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {company.phone_c && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Phone
                    </label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <ApperIcon name="Phone" size={16} className="text-primary" />
                      <span>{company.phone_c}</span>
                    </div>
                  </div>
                )}
                {company.website_c && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Website
                    </label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <ApperIcon name="Globe" size={16} className="text-primary" />
                      <a 
                        href={company.website_c}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {company.website_c}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {company.address_c && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Address
                  </label>
                  <p className="text-gray-900">{company.address_c}</p>
                </div>
              )}

              {(company.city_c || company.state_c || company.zip_code_c) && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Location
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <ApperIcon name="MapPin" size={16} className="text-primary" />
                    <span>
                      {[company.city_c, company.state_c, company.zip_code_c]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {company.Tags && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {company.Tags.split(',').map((tag) => (
                      <Badge key={tag} variant="primary">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {company.CreatedOn && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Created On
                  </label>
                  <span className="text-gray-900">
                    {format(new Date(company.CreatedOn), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 p-4 flex justify-end">
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompanyModal;