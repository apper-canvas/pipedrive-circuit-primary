import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ContactRow from "@/components/organisms/ContactRow";
import ContactModal from "@/components/organisms/ContactModal";
import ContactFormModal from "@/components/organisms/ContactFormModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import contactService from "@/services/api/contactService";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchQuery, statusFilter]);

  const loadContacts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError(err.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = [...contacts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (contact) =>
contact.first_name_c?.toLowerCase().includes(query) ||
          contact.last_name_c?.toLowerCase().includes(query) ||
          contact.email_c?.toLowerCase().includes(query) ||
          contact.company_c?.toLowerCase().includes(query) ||
          contact.Name?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
filtered = filtered.filter((contact) => contact.status_c === statusFilter);
    }

    setFilteredContacts(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowFormModal(true);
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await contactService.delete(contactId);
        setContacts((prev) => prev.filter((c) => c.Id !== contactId));
        toast.success("Contact deleted successfully");
      } catch (error) {
        toast.error("Failed to delete contact");
      }
    }
  };

  const handleSaveContact = () => {
    loadContacts();
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">
            Manage your customer relationships
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingContact(null);
            setShowFormModal(true);
          }}
          variant="primary"
        >
          <ApperIcon name="UserPlus" size={20} />
          New Contact
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search contacts by name, email, or company..."
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="lead">Leads</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {filteredContacts.length === 0 ? (
          <Empty
            icon="Users"
            title={searchQuery || statusFilter !== "all" ? "No contacts found" : "No contacts yet"}
            description={
              searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start building your network by adding your first contact"
            }
            actionLabel={!searchQuery && statusFilter === "all" ? "Add Contact" : undefined}
            onAction={
              !searchQuery && statusFilter === "all"
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
            {filteredContacts.map((contact) => (
              <ContactRow
                key={contact.Id}
                contact={contact}
                onClick={handleViewContact}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
              />
            ))}
          </motion.div>
        )}
      </div>

      {showContactModal && selectedContact && (
        <ContactModal
          contact={selectedContact}
          onClose={() => {
            setShowContactModal(false);
            setSelectedContact(null);
          }}
        />
      )}

      {showFormModal && (
        <ContactFormModal
          contact={editingContact}
          onClose={() => {
            setShowFormModal(false);
            setEditingContact(null);
          }}
          onSave={handleSaveContact}
        />
      )}
    </div>
  );
};

export default Contacts;