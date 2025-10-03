import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const CompanyRow = ({ company, onClick, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "rgba(37, 99, 235, 0.05)" }}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
      onClick={() => onClick(company)}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-lg">
            {company.name_c?.charAt(0).toUpperCase() || 'C'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{company.name_c}</h3>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-600">
            {company.industry_c && (
              <div className="flex items-center gap-1">
                <ApperIcon name="Briefcase" size={14} />
                <span className="truncate">{company.industry_c}</span>
              </div>
            )}
            {(company.city_c || company.state_c) && (
              <div className="flex items-center gap-1">
                <ApperIcon name="MapPin" size={14} />
                <span className="truncate">
                  {[company.city_c, company.state_c].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {company.phone_c && (
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <ApperIcon name="Phone" size={14} />
            <span>{company.phone_c}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(company);
            }}
            className="text-gray-400 hover:text-primary transition-colors p-2"
          >
            <ApperIcon name="Edit2" size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(company.Id);
            }}
            className="text-gray-400 hover:text-error transition-colors p-2"
          >
            <ApperIcon name="Trash2" size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyRow;