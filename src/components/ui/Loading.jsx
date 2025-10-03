import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "pipeline") {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4, 5].map((stage) => (
          <div key={stage} className="flex-shrink-0 w-80">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3].map((card) => (
                <motion.div
                  key={card}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: card * 0.1 }}
                  className="bg-white rounded-lg p-4 shadow-md"
                >
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-3 animate-pulse" />
                  <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded mb-2 w-3/4 animate-pulse" />
                  <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/2 animate-pulse" />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((row) => (
          <motion.div
            key={row}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: row * 0.05 }}
            className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3 animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/4 animate-pulse" />
            </div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse" />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
        className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
      />
    </div>
  );
};

export default Loading;