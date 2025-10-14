import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import TaskRow from "@/components/organisms/TaskRow";
import TaskFormModal from "@/components/organisms/TaskFormModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import taskService from "@/services/api/taskService";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.name_c?.toLowerCase().includes(query) ||
          task.description_c?.toLowerCase().includes(query) ||
          task.Name?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status_c === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority_c === priorityFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handlePriorityFilterChange = (e) => {
    setPriorityFilter(e.target.value);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowFormModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(taskId);
        setTasks((prev) => prev.filter((t) => t.Id !== taskId));
        toast.success("Task deleted successfully");
      } catch (error) {
        toast.error(error.message || "Failed to delete task");
      }
    }
  };

  const handleSaveTask = () => {
    loadTasks();
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">
            Manage your tasks and to-dos
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingTask(null);
            setShowFormModal(true);
          }}
          variant="primary"
        >
          <ApperIcon name="Plus" size={20} />
          New Task
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search tasks by name or description..."
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
          <div className="w-full sm:w-48">
            <select
              value={priorityFilter}
              onChange={handlePriorityFilterChange}
              className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <Empty
            icon="CheckSquare"
            title={searchQuery || statusFilter !== "all" || priorityFilter !== "all" ? "No tasks found" : "No tasks yet"}
            description={
              searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start organizing your work by adding your first task"
            }
            actionLabel={!searchQuery && statusFilter === "all" && priorityFilter === "all" ? "Add Task" : undefined}
            onAction={
              !searchQuery && statusFilter === "all" && priorityFilter === "all"
                ? () => setShowFormModal(true)
                : undefined
            }
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {filteredTasks.map((task) => (
              <TaskRow
                key={task.Id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </motion.div>
        )}
      </div>

      {showFormModal && (
        <TaskFormModal
          task={editingTask}
          onClose={() => {
            setShowFormModal(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default Tasks;