import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";
import activityService from "@/services/api/activityService";

const Dashboard = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dealsData, contactsData, activitiesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        activityService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
      setActivities(activitiesData.slice(0, 5));
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
const activeDeals = deals.filter(
      (d) => !d.stage_c?.includes("closed")
    );
    const wonDeals = deals.filter((d) => d.stage_c === "closed-won");
const totalValue = activeDeals.reduce((sum, d) => sum + (d.value_c || 0), 0);
    const conversionRate = deals.length > 0
      ? ((wonDeals.length / deals.length) * 100).toFixed(1)
      : 0;

    return {
      totalDeals: activeDeals.length,
      conversionRate: `${conversionRate}%`,
      pipelineValue: totalValue,
activeContacts: contacts.filter((c) => c.status_c === "active").length
    };
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "call":
        return "Phone";
      case "email":
        return "Mail";
      case "meeting":
        return "Calendar";
      default:
        return "MessageSquare";
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const metrics = calculateMetrics();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's your sales overview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Deals"
          value={metrics.totalDeals}
          icon="TrendingUp"
          gradient="from-primary to-primary-light"
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(metrics.pipelineValue)}
          icon="DollarSign"
          gradient="from-success to-green-600"
        />
        <StatCard
          title="Conversion Rate"
          value={metrics.conversionRate}
          icon="Target"
          gradient="from-accent to-accent-dark"
        />
        <StatCard
          title="Active Contacts"
          value={metrics.activeContacts}
          icon="Users"
          gradient="from-info to-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <ApperIcon name="Activity" size={24} className="text-primary" />
          </div>

          <div className="space-y-4">
{activities.map((activity) => {
const contact = contacts.find((c) => c.Id === activity.contact_id_c?.Id || activity.contact_id_c);
              return (
                <div
                  key={activity.Id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <ApperIcon
name={getActivityIcon(activity.type_c)}
                      size={18}
                      className="text-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
{contact?.Name} • {format(new Date(activity.timestamp_c), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Pipeline Stages</h2>
            <ApperIcon name="BarChart3" size={24} className="text-primary" />
          </div>

          <div className="space-y-4">
            {[
              { stage: "lead", label: "Lead", color: "bg-gray-400" },
              { stage: "qualified", label: "Qualified", color: "bg-blue-400" },
              { stage: "proposal", label: "Proposal", color: "bg-accent" },
              { stage: "negotiation", label: "Negotiation", color: "bg-primary" },
              { stage: "closed-won", label: "Closed Won", color: "bg-success" }
            ].map(({ stage, label, color }) => {
const count = deals.filter((d) => d.stage_c === stage).length;
              const percentage = deals.length > 0 ? (count / deals.length) * 100 : 0;
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-sm text-gray-600">{count} deals</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className={`h-full ${color} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;