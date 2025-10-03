const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const dealService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('deal_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Deal not found");
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching deal by id:", error?.response?.data?.message || error);
      throw error;
    }
  },

  getByContactId: async (contactId) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "contact_id_c", "Operator": "EqualTo", "Values": [parseInt(contactId)]}]
      };
      
      const response = await apperClient.fetchRecords('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals by contact:", error?.response?.data?.message || error);
      return [];
    }
  },

  create: async (dealData) => {
    try {
      const params = {
        records: [
          {
            Name: dealData.title_c || dealData.Name,
            title_c: dealData.title_c,
            contact_id_c: parseInt(dealData.contact_id_c),
            value_c: parseFloat(dealData.value_c),
            stage_c: dealData.stage_c,
            probability_c: parseInt(dealData.probability_c),
            expected_close_c: dealData.expected_close_c,
            notes_c: dealData.notes_c || ''
          }
        ]
      };
      
      const response = await apperClient.createRecord('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deals: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      throw error;
    }
  },

  update: async (id, dealData) => {
    try {
      const updateFields = {
        Id: parseInt(id)
      };
      
      if (dealData.title_c !== undefined) updateFields.title_c = dealData.title_c;
      if (dealData.contact_id_c !== undefined) updateFields.contact_id_c = parseInt(dealData.contact_id_c);
      if (dealData.value_c !== undefined) updateFields.value_c = parseFloat(dealData.value_c);
      if (dealData.stage_c !== undefined) updateFields.stage_c = dealData.stage_c;
      if (dealData.probability_c !== undefined) updateFields.probability_c = parseInt(dealData.probability_c);
      if (dealData.expected_close_c !== undefined) updateFields.expected_close_c = dealData.expected_close_c;
      if (dealData.notes_c !== undefined) updateFields.notes_c = dealData.notes_c;
      if (dealData.Name !== undefined) updateFields.Name = dealData.Name;
      
      const params = {
        records: [updateFields]
      };
      
      const response = await apperClient.updateRecord('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} deals: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
          throw new Error("Failed to delete deal");
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      throw error;
    }
  },

  updateStage: async (id, newStage) => {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            stage_c: newStage
          }
        ]
      };
      
      const response = await apperClient.updateRecord('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update stage for ${failed.length} deals: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating deal stage:", error?.response?.data?.message || error);
      throw error;
    }
  }
};

export default dealService;