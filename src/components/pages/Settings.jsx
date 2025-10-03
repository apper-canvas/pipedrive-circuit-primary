import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const Settings = () => {
  const settingsSections = [
    {
      title: "Pipeline Stages",
      description: "Customize your sales pipeline stages and workflow",
      icon: "TrendingUp",
      color: "from-primary to-primary-light"
    },
    {
      title: "Team Management",
      description: "Manage team members and their permissions",
      icon: "Users",
      color: "from-success to-green-600"
    },
    {
      title: "Notifications",
      description: "Configure email and in-app notification preferences",
      icon: "Bell",
      color: "from-accent to-accent-dark"
    },
    {
      title: "Data Export",
      description: "Export your contacts and deals data",
      icon: "Download",
      color: "from-info to-blue-600"
    },
    {
      title: "Integration",
      description: "Connect with third-party tools and services",
      icon: "Zap",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Account Settings",
      description: "Update your account information and preferences",
      icon: "Settings",
      color: "from-gray-600 to-gray-700"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your CRM preferences and configurations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card hover className="p-6 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className={`bg-gradient-to-br ${section.color} rounded-lg p-3`}>
                  <ApperIcon name={section.icon} size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{section.title}</h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
                <ApperIcon name="ChevronRight" size={20} className="text-gray-400" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-warning to-yellow-600 rounded-lg p-3">
            <ApperIcon name="AlertTriangle" size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Danger Zone</h3>
            <p className="text-sm text-gray-600 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button className="px-4 py-2 bg-error text-white rounded-lg hover:bg-red-600 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;