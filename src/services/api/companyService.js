const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const companyService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "website_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('company_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching companies:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "website_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('company_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Company not found");
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching company by id:", error?.response?.data?.message || error);
      throw error;
    }
  },

  create: async (companyData) => {
    try {
      const tagsString = Array.isArray(companyData.Tags) 
        ? companyData.Tags.join(',') 
        : companyData.Tags || '';
      
      const params = {
        records: [
          {
            Name: companyData.name_c,
            Tags: tagsString,
            name_c: companyData.name_c,
            industry_c: companyData.industry_c || '',
            address_c: companyData.address_c || '',
            city_c: companyData.city_c || '',
            state_c: companyData.state_c || '',
            zip_code_c: companyData.zip_code_c || '',
            phone_c: companyData.phone_c || '',
            website_c: companyData.website_c || ''
          }
        ]
      };
      
      const response = await apperClient.createRecord('company_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} companies: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating company:", error?.response?.data?.message || error);
      throw error;
    }
  },

  update: async (id, companyData) => {
    try {
      const updateFields = {
        Id: parseInt(id)
      };
      
      if (companyData.name_c !== undefined) {
        updateFields.name_c = companyData.name_c;
        updateFields.Name = companyData.name_c;
      }
      if (companyData.Tags !== undefined) {
        updateFields.Tags = Array.isArray(companyData.Tags) 
          ? companyData.Tags.join(',') 
          : companyData.Tags;
      }
      if (companyData.industry_c !== undefined) updateFields.industry_c = companyData.industry_c;
      if (companyData.address_c !== undefined) updateFields.address_c = companyData.address_c;
      if (companyData.city_c !== undefined) updateFields.city_c = companyData.city_c;
      if (companyData.state_c !== undefined) updateFields.state_c = companyData.state_c;
      if (companyData.zip_code_c !== undefined) updateFields.zip_code_c = companyData.zip_code_c;
      if (companyData.phone_c !== undefined) updateFields.phone_c = companyData.phone_c;
      if (companyData.website_c !== undefined) updateFields.website_c = companyData.website_c;
      
      const params = {
        records: [updateFields]
      };
      
      const response = await apperClient.updateRecord('company_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} companies: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating company:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('company_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} companies: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
          throw new Error("Failed to delete company");
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting company:", error?.response?.data?.message || error);
      throw error;
    }
  },

  search: async (query) => {
    try {
      const lowerQuery = query.toLowerCase();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "website_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {"fieldName": "name_c", "operator": "Contains", "values": [lowerQuery]}
              ],
              operator: ""
            },
            {
              conditions: [
                {"fieldName": "industry_c", "operator": "Contains", "values": [lowerQuery]}
              ],
              operator: ""
            },
            {
              conditions: [
                {"fieldName": "city_c", "operator": "Contains", "values": [lowerQuery]}
              ],
              operator: ""
            },
            {
              conditions: [
                {"fieldName": "state_c", "operator": "Contains", "values": [lowerQuery]}
              ],
              operator: ""
            }
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords('company_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching companies:", error?.response?.data?.message || error);
      return [];
    }
  }
};

export default companyService;