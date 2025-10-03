import { format } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const ContactRow = ({ contact, onClick, onEdit, onDelete }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "lead":
        return "warning";
      case "inactive":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "rgba(37, 99, 235, 0.05)" }}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
      onClick={() => onClick(contact)}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-lg">
{contact.first_name_c?.charAt(0).toUpperCase() || 'C'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
<h3 className="font-semibold text-gray-900 truncate">{contact.Name}</h3>
            <Badge variant={getStatusVariant(contact.status_c)}>
              {contact.status}
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <ApperIcon name="Mail" size={14} />
<span className="truncate">{contact.email_c}</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Building2" size={14} />
              <span className="truncate">{contact.company_c}</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <ApperIcon name="Clock" size={14} />
<span>{format(new Date(contact.last_contact_c), "MMM d, yyyy")}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(contact);
            }}
            className="text-gray-400 hover:text-primary transition-colors p-2"
          >
            <ApperIcon name="Edit2" size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(contact.Id);
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

export default ContactRow;