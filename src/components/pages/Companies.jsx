import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import CompanyRow from "@/components/organisms/CompanyRow";
import CompanyModal from "@/components/organisms/CompanyModal";
import CompanyFormModal from "@/components/organisms/CompanyFormModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import companyService from "@/services/api/companyService";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchQuery]);

  const loadCompanies = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError(err.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = [...companies];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (company) =>
          company.name_c?.toLowerCase().includes(query) ||
          company.industry_c?.toLowerCase().includes(query) ||
          company.city_c?.toLowerCase().includes(query) ||
          company.state_c?.toLowerCase().includes(query) ||
          company.Name?.toLowerCase().includes(query)
      );
    }

    setFilteredCompanies(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleViewCompany = (company) => {
    setSelectedCompany(company);
    setShowCompanyModal(true);
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setShowFormModal(true);
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await companyService.delete(companyId);
        setCompanies((prev) => prev.filter((c) => c.Id !== companyId));
        toast.success("Company deleted successfully");
      } catch (error) {
        toast.error("Failed to delete company");
      }
    }
  };

  const handleSaveCompany = () => {
    loadCompanies();
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">
            Manage your business accounts
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCompany(null);
            setShowFormModal(true);
          }}
          variant="primary"
        >
          <ApperIcon name="Building2" size={20} />
          New Company
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search companies by name, industry, or location..."
            />
          </div>
        </div>

        {filteredCompanies.length === 0 ? (
          <Empty
            icon="Building2"
            title={searchQuery ? "No companies found" : "No companies yet"}
            description={
              searchQuery
                ? "Try adjusting your search"
                : "Start building your portfolio by adding your first company"
            }
            actionLabel={!searchQuery ? "Add Company" : undefined}
            onAction={
              !searchQuery
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
            {filteredCompanies.map((company) => (
              <CompanyRow
                key={company.Id}
                company={company}
                onClick={handleViewCompany}
                onEdit={handleEditCompany}
                onDelete={handleDeleteCompany}
              />
            ))}
          </motion.div>
        )}
      </div>

      {showCompanyModal && selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => {
            setShowCompanyModal(false);
            setSelectedCompany(null);
          }}
        />
      )}

      {showFormModal && (
        <CompanyFormModal
          company={editingCompany}
          onClose={() => {
            setShowFormModal(false);
            setEditingCompany(null);
          }}
          onSave={handleSaveCompany}
        />
      )}
    </div>
  );
};

export default Companies;