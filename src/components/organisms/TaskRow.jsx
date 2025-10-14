import { format, isPast } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const TaskRow = ({ task, onEdit, onDelete }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "InProgress":
        return "warning";
      case "Blocked":
        return "error";
      case "Open":
      default:
        return "info";
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
      default:
        return "default";
    }
  };

  const isOverdue = task.due_date_c && isPast(new Date(task.due_date_c)) && task.status_c !== "Completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "rgba(37, 99, 235, 0.05)" }}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <ApperIcon name="CheckSquare" size={20} className="text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 truncate">{task.name_c || task.Name}</h3>
            <Badge variant={getStatusVariant(task.status_c)}>
              {task.status_c}
            </Badge>
            <Badge variant={getPriorityVariant(task.priority_c)}>
              {task.priority_c}
            </Badge>
          </div>
          {task.description_c && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {task.description_c}
            </p>
          )}
          {task.due_date_c && (
            <div className="flex items-center gap-1 text-sm">
              <ApperIcon name="Calendar" size={14} className={isOverdue ? "text-error" : "text-gray-500"} />
              <span className={isOverdue ? "text-error font-medium" : "text-gray-500"}>
                Due: {format(new Date(task.due_date_c), "MMM d, yyyy")}
                {isOverdue && " (Overdue)"}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="text-gray-400 hover:text-primary transition-colors p-2"
          >
            <ApperIcon name="Edit2" size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.Id);
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

export default TaskRow;