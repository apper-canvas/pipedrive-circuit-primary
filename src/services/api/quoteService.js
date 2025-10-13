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
          { field: { Name: "QuoteNumber" } },
          { field: { Name: "Amount" } },
          { field: { Name: "Status" } },
          { field: { Name: "ValidUntil" } },
          { field: { Name: "Terms" } },
          { field: { Name: "Notes" } },
          { field: { Name: "CreatedDate" } },
          { field: { Name: "ModifiedDate" } },
          // Lookup fields return as objects with Id and Name
          { field: { name: "DealId_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { name: "CompanyId_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { name: "ContactId_c" }, referenceField: { field: { Name: "FirstName" } } }
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
                { fieldName: "QuoteNumber", operator: "Contains", values: [filters.search] }
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
          { field: { Name: "QuoteNumber" } },
          { field: { Name: "Amount" } },
          { field: { Name: "Status" } },
          { field: { Name: "ValidUntil" } },
          { field: { Name: "Terms" } },
          { field: { Name: "Notes" } },
          { field: { Name: "CreatedDate" } },
          { field: { Name: "ModifiedDate" } },
          { field: { name: "DealId_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { name: "CompanyId_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { name: "ContactId_c" }, referenceField: { field: { Name: "FirstName" } } }
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
      if (quoteData.QuoteNumber) record.QuoteNumber = quoteData.QuoteNumber;
      
      // Lookup fields - send only ID as integer
      if (quoteData.DealId_c) {
        record.DealId_c = parseInt(quoteData.DealId_c?.Id || quoteData.DealId_c);
      }
      if (quoteData.CompanyId_c) {
        record.CompanyId_c = parseInt(quoteData.CompanyId_c?.Id || quoteData.CompanyId_c);
      }
      if (quoteData.ContactId_c) {
        record.ContactId_c = parseInt(quoteData.ContactId_c?.Id || quoteData.ContactId_c);
      }
      
      // Currency field
      if (quoteData.Amount !== undefined && quoteData.Amount !== null && quoteData.Amount !== '') {
        record.Amount = parseFloat(quoteData.Amount);
      }
      
      // Picklist field
      if (quoteData.Status) record.Status = quoteData.Status;
      
      // Date field - ISO format YYYY-MM-DD
      if (quoteData.ValidUntil) record.ValidUntil = quoteData.ValidUntil;
      
      // MultilineText fields
      if (quoteData.Terms) record.Terms = quoteData.Terms;
      if (quoteData.Notes) record.Notes = quoteData.Notes;

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
      if (quoteData.QuoteNumber) record.QuoteNumber = quoteData.QuoteNumber;
      
      // Lookup fields - send only ID as integer
      if (quoteData.DealId_c !== undefined) {
        record.DealId_c = quoteData.DealId_c ? parseInt(quoteData.DealId_c?.Id || quoteData.DealId_c) : null;
      }
      if (quoteData.CompanyId_c !== undefined) {
        record.CompanyId_c = quoteData.CompanyId_c ? parseInt(quoteData.CompanyId_c?.Id || quoteData.CompanyId_c) : null;
      }
      if (quoteData.ContactId_c !== undefined) {
        record.ContactId_c = quoteData.ContactId_c ? parseInt(quoteData.ContactId_c?.Id || quoteData.ContactId_c) : null;
      }
      
      // Currency field
      if (quoteData.Amount !== undefined && quoteData.Amount !== null && quoteData.Amount !== '') {
        record.Amount = parseFloat(quoteData.Amount);
      }
      
      // Picklist field
      if (quoteData.Status) record.Status = quoteData.Status;
      
      // Date field
      if (quoteData.ValidUntil) record.ValidUntil = quoteData.ValidUntil;
      
      // MultilineText fields
      if (quoteData.Terms !== undefined) record.Terms = quoteData.Terms;
      if (quoteData.Notes !== undefined) record.Notes = quoteData.Notes;

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