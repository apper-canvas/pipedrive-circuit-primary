import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import dealService from "@/services/api/dealService";
import activityService from "@/services/api/activityService";
import Loading from "@/components/ui/Loading";

const ContactModal = ({ contact, onClose }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContactData();
  }, [contact.Id]);

  const loadContactData = async () => {
    setLoading(true);
    try {
      const [dealsData, activitiesData] = await Promise.all([
        dealService.getByContactId(contact.Id),
        activityService.getByContactId(contact.Id)
      ]);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error("Error loading contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "info", label: "Information", icon: "User" },
    { id: "deals", label: "Deals", icon: "TrendingUp" },
    { id: "activity", label: "Activity", icon: "Activity" }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(value);
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-2xl font-bold">
{contact.Name?.charAt(0).toUpperCase() || 'C'}
                  </span>
                </div>
                <div>
<h2 className="text-2xl font-bold">{contact.Name}</h2>
                  <p className="text-white/90">{contact.company_c}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>

            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white/20 backdrop-blur-sm"
                      : "hover:bg-white/10"
                  }`}
                >
                  <ApperIcon name={tab.icon} size={16} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {loading ? (
              <Loading />
            ) : (
              <>
                {activeTab === "info" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                          Email
                        </label>
                        <div className="flex items-center gap-2 text-gray-900">
                          <ApperIcon name="Mail" size={16} className="text-primary" />
<span>{contact.email_c}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                          Phone
                        </label>
                        <div className="flex items-center gap-2 text-gray-900">
                          <ApperIcon name="Phone" size={16} className="text-primary" />
<span>{contact.phone_c}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                          Status
                        </label>
<Badge variant="success">{contact.status_c}</Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                          Last Contact
                        </label>
                        <span className="text-gray-900">
{format(new Date(contact.last_contact_c), "MMM d, yyyy")}
                        </span>
                      </div>
</div>

                    {/* Professional Information */}
{(contact.job_title_c || contact.city_c || contact.state_c || contact.pin_code_c || contact.linkedin_url_c) && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                          Professional Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {contact.job_title_c && (
                            <div className="flex items-start space-x-3">
                              <ApperIcon name="Building2" size={18} className="text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500">Job Title</p>
                                <p className="text-sm text-gray-900">{contact.job_title_c}</p>
                              </div>
                            </div>
                          )}
                          {(contact.city_c || contact.state_c) && (
                            <div className="flex items-start space-x-3">
                              <ApperIcon name="MapPin" size={18} className="text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500">Location</p>
                                <p className="text-sm text-gray-900">
                                  {[contact.city_c, contact.state_c].filter(Boolean).join(', ')}
                                </p>
                              </div>
                            </div>
                          )}
                          {contact.pin_code_c && (
                            <div className="flex items-start space-x-3">
                              <ApperIcon name="Hash" size={18} className="text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500">Pin Code</p>
                                <p className="text-sm text-gray-900">{contact.pin_code_c}</p>
                              </div>
                            </div>
                          )}
                          {contact.linkedin_url_c && (
                            <div className="flex items-start space-x-3">
                              <ApperIcon name="Linkedin" size={18} className="text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500">LinkedIn</p>
                                <a 
                                  href={contact.linkedin_url_c}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline"
                                >
                                  View Profile
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-1">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
{contact.tags_c && contact.tags_c.split(',').map((tag) => (
                          <Badge key={tag} variant="primary">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>

{contact.notes_c && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                          Notes
                        </label>
                        <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                          {contact.notes_c}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "deals" && (
                  <div className="space-y-3">
                    {deals.length > 0 ? (
                      deals.map((deal) => (
                        <div
key={deal.Id}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{deal.title_c}</h4>
                            <Badge variant="primary">{deal.stage_c}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-xl font-bold text-primary">
                              {formatCurrency(deal.value_c)}
                            </span>
                            <span className="text-gray-600">
                              {deal.probability_c}% probability
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No deals associated with this contact
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "activity" && (
                  <div className="space-y-3">
                    {activities.length > 0 ? (
                      activities.map((activity) => (
<div
                          key={activity.Id}
                          className="flex gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                            <ApperIcon
                              name={getActivityIcon(activity.type_c)}
                              size={20}
                              className="text-primary"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {activity.description_c}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(activity.timestamp_c), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No activity recorded for this contact
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="border-t border-gray-200 p-4 flex justify-end">
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContactModal;