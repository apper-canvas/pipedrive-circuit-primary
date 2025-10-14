import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import quoteService from "@/services/api/quoteService";
import dealService from "@/services/api/dealService";
import companyService from "@/services/api/companyService";
import contactService from "@/services/api/contactService";

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [deals, setDeals] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("CreatedDate");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [showModal, setShowModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
title_c: "",
    deal_id_c: "",
    contact_id_c: "",
    quote_amount_c: "",
    status_c: "Draft",
    issue_date_c: "",
    expiry_date_c: "",
    notes_c: ""
  });

  useEffect(() => {
    fetchQuotes();
    fetchReferenceData();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await quoteService.getAll();
      setQuotes(data);
    } catch (err) {
      setError("Failed to load quotes");
      toast.error("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  const fetchReferenceData = async () => {
    try {
      const [dealsData, companiesData, contactsData] = await Promise.all([
        dealService.getAll(),
        companyService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setCompanies(companiesData);
      setContacts(contactsData);
    } catch (err) {
      console.error("Error fetching reference data:", err);
    }
  };

  const handleOpenModal = (quote = null) => {
    if (quote) {
      setEditingQuote(quote);
      setFormData({
Name: quote.Name || "",
        title_c: quote.title_c || "",
        deal_id_c: quote.deal_id_c?.Id || "",
        contact_id_c: quote.contact_id_c?.Id || "",
        quote_amount_c: quote.quote_amount_c || "",
        status_c: quote.status_c || "Draft",
        issue_date_c: quote.issue_date_c || "",
        expiry_date_c: quote.expiry_date_c || "",
        notes_c: quote.notes_c || ""
      });
    } else {
      setEditingQuote(null);
      setFormData({
        Name: "",
title_c: "",
        deal_id_c: "",
        contact_id_c: "",
        quote_amount_c: "",
        status_c: "Draft",
        issue_date_c: "",
        expiry_date_c: "",
        notes_c: ""
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingQuote(null);
    setFormData({
Name: "",
      title_c: "",
      deal_id_c: "",
      contact_id_c: "",
      quote_amount_c: "",
      status_c: "Draft",
      issue_date_c: "",
      expiry_date_c: "",
      notes_c: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
if (!formData.Name || !formData.quote_amount_c || !formData.status_c) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      if (editingQuote) {
        const result = await quoteService.update(editingQuote.Id, formData);
        if (result.success) {
          toast.success("Quote updated successfully");
          handleCloseModal();
          fetchQuotes();
        } else {
          toast.error(result.message || "Failed to update quote");
        }
      } else {
        const result = await quoteService.create(formData);
        if (result.success) {
          toast.success("Quote created successfully");
          handleCloseModal();
          fetchQuotes();
        } else {
          toast.error(result.message || "Failed to create quote");
        }
      }
    } catch (err) {
      toast.error(editingQuote ? "Error updating quote" : "Error creating quote");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this quote?")) {
      return;
    }

    setLoading(true);
    try {
      const result = await quoteService.delete([id]);
      if (result.success) {
        toast.success("Quote deleted successfully");
        fetchQuotes();
      } else {
        toast.error(result.message || "Failed to delete quote");
      }
    } catch (err) {
      toast.error("Error deleting quote");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Draft: "bg-gray-100 text-gray-800",
      Sent: "bg-blue-100 text-blue-800",
      Accepted: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredQuotes = quotes
    .filter(quote => {
      const matchesSearch = 
quote.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.title_c?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || quote.Status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let compareValue = 0;
if (sortBy === "Name") {
        compareValue = (a.Name || "").localeCompare(b.Name || "");
      } else if (sortBy === "quote_amount_c") {
        compareValue = (a.quote_amount_c || 0) - (b.quote_amount_c || 0);
      } else if (sortBy === "expiry_date_c") {
        compareValue = new Date(a.expiry_date_c || 0) - new Date(b.expiry_date_c || 0);
      } else {
        compareValue = new Date(a.CreatedOn || 0) - new Date(b.CreatedOn || 0);
      }
      return sortOrder === "ASC" ? compareValue : -compareValue;
    });

  if (loading && quotes.length === 0) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">Quotes</h1>
            <p className="text-secondary-light">Manage your quotes and proposals</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <ApperIcon name="Plus" size={20} />
            Add Quote
          </Button>
        </div>

        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Search</label>
              <Input
                type="text"
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Status</label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Sort By</label>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="CreatedDate">Created Date</option>
<option value="Name">Name</option>
                <option value="quote_amount_c">Amount</option>
                <option value="expiry_date_c">Expiry Date</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Order</label>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="DESC">Descending</option>
                <option value="ASC">Ascending</option>
              </Select>
            </div>
          </div>
        </Card>

        {filteredQuotes.length === 0 ? (
          <Empty 
            message="No quotes found" 
            action={
              <Button onClick={() => handleOpenModal()}>
                <ApperIcon name="Plus" size={20} />
                Create First Quote
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <Card className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
<th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Number
                    </th>
<th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Amount
                    </th>
<th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Valid Until
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQuotes.map((quote) => (
                    <motion.tr
                      key={quote.Id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
<div className="text-sm font-medium text-secondary">{quote.Name}</div>
                        {quote.deal_id_c?.Name && (
                          <div className="text-xs text-secondary-light">Deal: {quote.deal_id_c.Name}</div>
                        )}
                      </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                        {quote.title_c || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
<div className="text-sm text-secondary">{quote.contact_id_c?.Name || '-'}</div>
                      </td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary">
                        ${(quote.quote_amount_c || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
<Badge className={getStatusColor(quote.status_c)}>
                          {quote.status_c}
                        </Badge>
                      </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                        {quote.expiry_date_c ? new Date(quote.expiry_date_c).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenModal(quote)}
                          className="mr-2"
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(quote.Id)}
                          className="text-error hover:text-error"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-secondary">
                  {editingQuote ? "Edit Quote" : "Create Quote"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-secondary-light hover:text-secondary transition-colors"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Quote Name <span className="text-error">*</span>
                    </label>
                    <Input
                      name="Name"
                      value={formData.Name}
                      onChange={handleInputChange}
                      placeholder="Enter quote name"
                      required
                    />
                  </div>
<div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Title
                    </label>
                    <Input
                      name="title_c"
                      value={formData.title_c}
                      onChange={handleInputChange}
                      placeholder="Quote title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Deal
                    </label>
                    <Select
name="deal_id_c"
                      value={formData.deal_id_c}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Deal</option>
                      {deals.map(deal => (
                        <option key={deal.Id} value={deal.Id}>
                          {deal.Name}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Company
</label>
                    <Select
                      name="CompanyId_c"
                      value={formData.CompanyId_c}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Company</option>
                      {companies.map(company => (
                        <option key={company.Id} value={company.Id}>
                          {company.Name}
                        </option>
                      ))}
                    </Select>
                  </div>

<div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Contact
                    </label>
                    <Select
                      name="contact_id_c"
                      value={formData.contact_id_c}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Contact</option>
                      {contacts.map(contact => (
                        <option key={contact.Id} value={contact.Id}>
                          {contact.first_name_c} {contact.last_name_c}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Amount <span className="text-error">*</span>
                    </label>
                    <Input
                      type="number"
name="quote_amount_c"
                      value={formData.quote_amount_c}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Status <span className="text-error">*</span>
                    </label>
                    <Select
name="status_c"
                      value={formData.status_c}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Valid Until
                    </label>
                    <Input
type="date"
                      name="expiry_date_c"
                      value={formData.ValidUntil}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Terms & Conditions
                  </label>
                  <textarea
name="issue_date_c"
                    value={formData.issue_date_c}
                    onChange={handleInputChange}
                    placeholder="Enter terms and conditions"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Notes
                  </label>
<textarea
                    name="notes_c"
                    value={formData.notes_c}
                    onChange={handleInputChange}
                    placeholder="Additional notes"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : editingQuote ? "Update Quote" : "Create Quote"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quotes;