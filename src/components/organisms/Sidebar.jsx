import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext } from 'react';
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from '../../App';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
const navItems = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Pipeline", path: "/pipeline", icon: "TrendingUp" },
    { name: "Contacts", path: "/contacts", icon: "Users" },
    { name: "Companies", path: "/companies", icon: "Building2" },
    { name: "Settings", path: "/settings", icon: "Settings" }
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-gradient-to-b from-gray-900 to-gray-800 h-screen sticky top-0">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary to-primary-light rounded-lg p-2">
            <ApperIcon name="Zap" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">PipeDrive</h1>
            <p className="text-xs text-gray-400">Sales CRM</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex items-center gap-3 w-full"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.name}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-3 border-t border-gray-700">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ApperIcon name="Sparkles" size={20} className="text-primary" />
            <div>
              <p className="text-sm font-medium text-white mb-1">Pro Tip</p>
              <p className="text-xs text-gray-300">
                Drag deals between stages to update your pipeline
              </p>
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={logout}
        >
          <ApperIcon name="LogOut" size={20} />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;