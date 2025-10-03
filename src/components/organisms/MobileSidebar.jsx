import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const MobileSidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Pipeline", path: "/pipeline", icon: "TrendingUp" },
    { name: "Contacts", path: "/contacts", icon: "Users" },
    { name: "Settings", path: "/settings", icon: "Settings" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 z-50 lg:hidden"
          >
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary to-primary-light rounded-lg p-2">
                  <ApperIcon name="Zap" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">PipeDrive</h1>
                  <p className="text-xs text-gray-400">Sales CRM</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <ApperIcon name="X" size={24} />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-700"
                    }`
                  }
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;