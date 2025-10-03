import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ title, value, icon, trend, gradient }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`p-6 bg-gradient-to-br ${gradient} border-0`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white">{value}</h3>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <ApperIcon 
                  name={trend.direction === "up" ? "TrendingUp" : "TrendingDown"} 
                  size={16} 
                  className="text-white/90" 
                />
                <span className="text-sm text-white/90">{trend.value}</span>
              </div>
            )}
          </div>
          <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
            <ApperIcon name={icon} size={24} className="text-white" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;