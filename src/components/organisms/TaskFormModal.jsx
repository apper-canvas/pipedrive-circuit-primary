import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import taskService from "@/services/api/taskService";

const TaskFormModal = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name_c: "",
    description_c: "",
    status_c: "Open",
    due_date_c: "",
    priority_c: "Medium",
    Tags: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        name_c: task.name_c || "",
        description_c: task.description_c || "",
        status_c: task.status_c || "Open",
        due_date_c: task.due_date_c || "",
        priority_c: task.priority_c || "Medium",
        Tags: task.Tags || ""
      });
    }
  }, [task]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name_c.trim()) {
      toast.error("Task name is required");
      return;
    }

    if (!formData.status_c) {
      toast.error("Status is required");
      return;
    }

    if (!formData.priority_c) {
      toast.error("Priority is required");
      return;
    }

    setLoading(true);
    try {
      if (task) {
        await taskService.update(task.Id, formData);
        toast.success("Task updated successfully");
      } else {
        await taskService.create(formData);
        toast.success("Task created successfully");
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.message || `Failed to ${task ? "update" : "create"} task`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {task ? "Edit Task" : "New Task"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Name <span className="text-error">*</span>
                </label>
                <Input
                  name="name_c"
                  value={formData.name_c}
                  onChange={handleChange}
                  placeholder="Enter task name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description_c"
                  value={formData.description_c}
                  onChange={handleChange}
                  placeholder="Enter task description"
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-error">*</span>
                  </label>
                  <select
                    name="status_c"
                    value={formData.status_c}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                  >
                    <option value="Open">Open</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority <span className="text-error">*</span>
                  </label>
                  <select
                    name="priority_c"
                    value={formData.priority_c}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <Input
                  type="date"
                  name="due_date_c"
                  value={formData.due_date_c}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <Input
                  name="Tags"
                  value={formData.Tags}
                  onChange={handleChange}
                  placeholder="Enter tags (comma-separated)"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" size={20} className="animate-spin" />
                    {task ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name="Check" size={20} />
                    {task ? "Update Task" : "Create Task"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskFormModal;