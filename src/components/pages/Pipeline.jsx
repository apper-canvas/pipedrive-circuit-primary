import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import DealCard from "@/components/organisms/DealCard";
import DealModal from "@/components/organisms/DealModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";

const Pipeline = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [showDealModal, setShowDealModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const stages = [
    { id: "lead", label: "Lead", color: "bg-gray-100" },
    { id: "qualified", label: "Qualified", color: "bg-blue-50" },
    { id: "proposal", label: "Proposal", color: "bg-amber-50" },
    { id: "negotiation", label: "Negotiation", color: "bg-primary/5" },
    { id: "closed-won", label: "Closed Won", color: "bg-success/10" }
  ];

  useEffect(() => {
    loadPipelineData();
  }, []);

const loadPipelineData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData.filter((d) => !d.stage_c?.includes("lost")));
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || "Failed to load pipeline data");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (stageId) => {
    if (!draggedDeal || draggedDeal.stage === stageId) {
      setDraggedDeal(null);
      return;
    }

    try {
await dealService.updateStage(draggedDeal.Id, stageId);
      setDeals((prev) =>
        prev.map((d) =>
          d.Id === draggedDeal.Id ? { ...d, stage_c: stageId } : d
        )
      );
      toast.success("Deal stage updated");
    } catch (error) {
      toast.error("Failed to update deal stage");
    } finally {
      setDraggedDeal(null);
    }
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setShowDealModal(true);
  };

  const handleDeleteDeal = async (dealId) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      try {
        await dealService.delete(dealId);
        setDeals((prev) => prev.filter((d) => d.Id !== dealId));
        toast.success("Deal deleted successfully");
      } catch (error) {
        toast.error("Failed to delete deal");
      }
    }
  };

  const handleSaveDeal = () => {
    loadPipelineData();
  };

  const getContactForDeal = (deal) => {
return contacts.find((c) => c.Id === deal.contact_id_c?.Id || deal.contact_id_c);
  };

  const getDealsByStage = (stageId) => {
    return deals.filter((d) => d.stage === stageId);
  };

  const getTotalValue = (stageId) => {
    const stageDeals = getDealsByStage(stageId);
    return stageDeals.reduce((sum, d) => sum + d.value, 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(value);
  };

  if (loading) return <Loading type="pipeline" />;
  if (error) return <Error message={error} onRetry={loadPipelineData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600 mt-1">
            Drag and drop deals to update their stage
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedDeal(null);
            setShowDealModal(true);
          }}
          variant="primary"
        >
          <ApperIcon name="Plus" size={20} />
          New Deal
        </Button>
      </div>

      {deals.length === 0 ? (
        <Empty
          icon="TrendingUp"
          title="No deals yet"
          description="Start building your pipeline by creating your first deal"
          actionLabel="Create Deal"
          onAction={() => setShowDealModal(true)}
        />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageDeals = getDealsByStage(stage.id);
            const totalValue = getTotalValue(stage.id);

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex-shrink-0 w-80 ${stage.color} rounded-xl p-4`}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.id)}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{stage.label}</h3>
                    <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700">
                      {stageDeals.length}
                    </span>
                  </div>
                  {totalValue > 0 && (
                    <p className="text-sm text-gray-600 font-medium">
                      {formatCurrency(totalValue)}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.Id}
                      draggable
                      onDragStart={() => handleDragStart(deal)}
                    >
                      <DealCard
                        deal={deal}
                        contact={getContactForDeal(deal)}
                        onEdit={handleEditDeal}
                        onDelete={handleDeleteDeal}
                        isDragging={draggedDeal?.Id === deal.Id}
                      />
                    </div>
                  ))}
                </div>

                {stageDeals.length === 0 && (
                  <div className="bg-white/50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-sm text-gray-500">Drop deals here</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {showDealModal && (
        <DealModal
          deal={selectedDeal}
          onClose={() => {
            setShowDealModal(false);
            setSelectedDeal(null);
          }}
          onSave={handleSaveDeal}
        />
      )}
    </div>
  );
};

export default Pipeline;