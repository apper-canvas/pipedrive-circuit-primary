// quoteService.js - Service for quote_c table operations
// Handles CRUD operations for quotes with proper field visibility and lookup handling

const quoteService = {
  // Fetch all quotes with filtering and lookup fields
  async getAll(filters = {}) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
{ field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "quote_amount_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "issue_date_c" } },
          { field: { Name: "expiry_date_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
          // Lookup fields return as objects with Id and Name
          { field: { name: "deal_id_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { name: "contact_id_c" }, referenceField: { field: { Name: "Name" } } }
        ],
        where: [],
        orderBy: [{ fieldName: "CreatedDate", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      // Add filters if provided
      if (filters.search) {
        params.whereGroups = [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                { fieldName: "Name", operator: "Contains", values: [filters.search] }
              ]
            },
            {
              conditions: [
{ fieldName: "title_c", operator: "Contains", values: [filters.search] }
              ]
            }
          ]
        }];
      }

      if (filters.status && filters.status !== "All") {
        params.where.push({
          FieldName: "Status",
          Operator: "EqualTo",
          Values: [filters.status]
        });
      }

      const response = await apperClient.fetchRecords('quote_c', params);

      if (!response?.success) {
        console.error(response?.message || "Failed to fetch quotes");
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching quotes:", error?.message || error);
      return [];
    }
  },

  // Get single quote by ID
  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
{ field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "quote_amount_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "issue_date_c" } },
          { field: { Name: "expiry_date_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
          { field: { name: "deal_id_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { name: "contact_id_c" }, referenceField: { field: { Name: "Name" } } }
        ]
      };

      const response = await apperClient.getRecordById('quote_c', id, params);

      if (!response?.success) {
        console.error(response?.message || `Failed to fetch quote ${id}`);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching quote ${id}:`, error?.message || error);
      return null;
    }
  },

  // Create new quote (only Updateable fields)
  async create(quoteData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Prepare record with only Updateable fields and proper formatting
const record = {};
      
      // Text fields
      if (quoteData.Name) record.Name = quoteData.Name;
      if (quoteData.title_c) record.title_c = quoteData.title_c;
      // Lookup fields - send only ID as integer
if (quoteData.deal_id_c) {
        record.deal_id_c = parseInt(quoteData.deal_id_c?.Id || quoteData.deal_id_c);
      }
      if (quoteData.contact_id_c) {
        record.contact_id_c = parseInt(quoteData.contact_id_c?.Id || quoteData.contact_id_c);
      }
      
      // Currency field
if (quoteData.quote_amount_c !== undefined && quoteData.quote_amount_c !== null && quoteData.quote_amount_c !== '') {
        record.quote_amount_c = parseFloat(quoteData.quote_amount_c);
      }
      
      // Picklist field
if (quoteData.status_c) record.status_c = quoteData.status_c;
      
      // Date field - ISO format YYYY-MM-DD
if (quoteData.issue_date_c) record.issue_date_c = quoteData.issue_date_c;
      if (quoteData.expiry_date_c) record.expiry_date_c = quoteData.expiry_date_c;
      
      // MultilineText fields
if (quoteData.notes_c) record.notes_c = quoteData.notes_c;

      const params = {
        records: [record]
      };

      const response = await apperClient.createRecord('quote_c', params);

      if (!response?.success) {
        console.error(response?.message || "Failed to create quote");
        return { success: false, message: response?.message || "Failed to create quote" };
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create quote: ${JSON.stringify(failed)}`);
          return { 
            success: false, 
            message: failed[0].message || "Failed to create quote",
            errors: failed[0].errors 
          };
        }
        return { success: true, data: response.results[0].data };
      }

      return { success: true };
    } catch (error) {
      console.error("Error creating quote:", error?.message || error);
      return { success: false, message: error?.message || "Error creating quote" };
    }
  },

  // Update existing quote (only Updateable fields + Id)
  async update(id, quoteData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Prepare record with only Updateable fields and proper formatting
      const record = { Id: parseInt(id) };
      
      // Text fields
if (quoteData.Name) record.Name = quoteData.Name;
      if (quoteData.title_c) record.title_c = quoteData.title_c;
      
      // Lookup fields - send only ID as integer
if (quoteData.deal_id_c !== undefined) {
        record.deal_id_c = quoteData.deal_id_c ? parseInt(quoteData.deal_id_c?.Id || quoteData.deal_id_c) : null;
      }
      if (quoteData.contact_id_c !== undefined) {
        record.contact_id_c = quoteData.contact_id_c ? parseInt(quoteData.contact_id_c?.Id || quoteData.contact_id_c) : null;
      }
      
      // Currency field
if (quoteData.quote_amount_c !== undefined && quoteData.quote_amount_c !== null && quoteData.quote_amount_c !== '') {
        record.quote_amount_c = parseFloat(quoteData.quote_amount_c);
      }
      
      // Picklist field
if (quoteData.status_c) record.status_c = quoteData.status_c;
      
      // Date field
if (quoteData.issue_date_c) record.issue_date_c = quoteData.issue_date_c;
      if (quoteData.expiry_date_c) record.expiry_date_c = quoteData.expiry_date_c;
      
      // MultilineText fields
if (quoteData.notes_c !== undefined) record.notes_c = quoteData.notes_c;

      const params = {
        records: [record]
      };

      const response = await apperClient.updateRecord('quote_c', params);

      if (!response?.success) {
        console.error(response?.message || "Failed to update quote");
        return { success: false, message: response?.message || "Failed to update quote" };
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update quote: ${JSON.stringify(failed)}`);
          return { 
            success: false, 
            message: failed[0].message || "Failed to update quote",
            errors: failed[0].errors 
          };
        }
        return { success: true, data: response.results[0].data };
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating quote:", error?.message || error);
      return { success: false, message: error?.message || "Error updating quote" };
    }
  },

  // Delete quote by ID
  async delete(ids) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: Array.isArray(ids) ? ids : [ids]
      };

      const response = await apperClient.deleteRecord('quote_c', params);

      if (!response?.success) {
        console.error(response?.message || "Failed to delete quote");
        return { success: false, message: response?.message || "Failed to delete quote" };
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete quotes: ${JSON.stringify(failed)}`);
          return { 
            success: false, 
            message: failed[0].message || "Failed to delete quote" 
          };
        }
        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting quote:", error?.message || error);
      return { success: false, message: error?.message || "Error deleting quote" };
    }
  }
};

export default quoteService;