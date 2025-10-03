import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <div className="bg-gradient-to-br from-error/10 to-error/5 rounded-full p-6 mb-6">
        <ApperIcon name="AlertCircle" size={48} className="text-error" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops!</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RefreshCw" size={18} />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;