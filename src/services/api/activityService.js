const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const activityService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "deal_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      return [];
    }
  },

  getByDealId: async (dealId) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "deal_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [{"FieldName": "deal_id_c", "Operator": "EqualTo", "Values": [parseInt(dealId)]}],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by deal:", error?.response?.data?.message || error);
      return [];
    }
  },

  getByContactId: async (contactId) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "deal_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [{"FieldName": "contact_id_c", "Operator": "EqualTo", "Values": [parseInt(contactId)]}],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by contact:", error?.response?.data?.message || error);
      return [];
    }
  },

  create: async (activityData) => {
    try {
      const params = {
        records: [
          {
            Name: activityData.Name || activityData.description_c || 'Activity',
            type_c: activityData.type_c,
            description_c: activityData.description_c,
            timestamp_c: activityData.timestamp_c || new Date().toISOString(),
            deal_id_c: activityData.deal_id_c ? parseInt(activityData.deal_id_c) : undefined,
            contact_id_c: activityData.contact_id_c ? parseInt(activityData.contact_id_c) : undefined
          }
        ]
      };
      
      const response = await apperClient.createRecord('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activities: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      throw error;
    }
  }
};

export default activityService;