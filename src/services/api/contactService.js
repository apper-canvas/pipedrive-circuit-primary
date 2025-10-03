const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const contactService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "pin_code_c"}},
          {"field": {"Name": "linkedin_url_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_contact_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "pin_code_c"}},
          {"field": {"Name": "linkedin_url_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_contact_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('contact_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Contact not found");
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching contact by id:", error?.response?.data?.message || error);
      throw error;
    }
  },

  create: async (contactData) => {
    try {
      const tagsString = Array.isArray(contactData.tags_c) 
        ? contactData.tags_c.join(',') 
        : contactData.tags_c || '';
      
      const params = {
        records: [
          {
            Name: `${contactData.first_name_c || ''} ${contactData.last_name_c || ''}`.trim(),
            first_name_c: contactData.first_name_c,
            last_name_c: contactData.last_name_c,
            email_c: contactData.email_c,
            phone_c: contactData.phone_c,
            company_c: contactData.company_c,
            job_title_c: contactData.job_title_c || '',
            city_c: contactData.city_c || '',
            state_c: contactData.state_c || '',
            pin_code_c: contactData.pin_code_c || '',
            linkedin_url_c: contactData.linkedin_url_c || '',
            status_c: contactData.status_c,
            tags_c: tagsString,
            notes_c: contactData.notes_c || ''
          }
        ]
      };
      
      const response = await apperClient.createRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      let newContact = null;
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        newContact = successful.length > 0 ? successful[0].data : null;
      }
      
      if (!newContact) {
        throw new Error("Failed to create contact");
      }

      try {
        const result = await apperClient.functions.invoke(
          import.meta.env.VITE_CREATE_CLICKSEND_CONTACT,
          {
            body: JSON.stringify({
              phoneNumber: contactData.phone_c,
              email: contactData.email_c,
              firstName: contactData.first_name_c,
              lastName: contactData.last_name_c
            }),
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

const responseData = result;

        if (responseData.success === false) {
          console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_CREATE_CLICKSEND_CONTACT}. The response body is: ${JSON.stringify(responseData)}.`);
          return { ...newContact, clicksendSynced: false };
        }

        console.info(`apper_info: Successfully synced contact to ClickSend. Contact ID: ${responseData.clicksendContactId}`);
        return { ...newContact, clicksendSynced: true, clicksendContactId: responseData.clicksendContactId };
      } catch (error) {
        console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_CREATE_CLICKSEND_CONTACT}. The error is: ${error.message}`);
        return { ...newContact, clicksendSynced: false };
      }
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  update: async (id, contactData) => {
    try {
      const updateFields = {
        Id: parseInt(id)
      };
      
      if (contactData.first_name_c !== undefined) {
        updateFields.first_name_c = contactData.first_name_c;
        const lastName = contactData.last_name_c !== undefined ? contactData.last_name_c : '';
        updateFields.Name = `${contactData.first_name_c} ${lastName}`.trim();
      }
      if (contactData.last_name_c !== undefined) {
        updateFields.last_name_c = contactData.last_name_c;
        if (!updateFields.Name) {
          const firstName = contactData.first_name_c || '';
          updateFields.Name = `${firstName} ${contactData.last_name_c}`.trim();
        }
      }
      if (contactData.email_c !== undefined) updateFields.email_c = contactData.email_c;
      if (contactData.phone_c !== undefined) updateFields.phone_c = contactData.phone_c;
      if (contactData.company_c !== undefined) updateFields.company_c = contactData.company_c;
      if (contactData.job_title_c !== undefined) updateFields.job_title_c = contactData.job_title_c;
      if (contactData.city_c !== undefined) updateFields.city_c = contactData.city_c;
      if (contactData.state_c !== undefined) updateFields.state_c = contactData.state_c;
      if (contactData.pin_code_c !== undefined) updateFields.pin_code_c = contactData.pin_code_c;
      if (contactData.linkedin_url_c !== undefined) updateFields.linkedin_url_c = contactData.linkedin_url_c;
      if (contactData.status_c !== undefined) updateFields.status_c = contactData.status_c;
      if (contactData.tags_c !== undefined) {
        updateFields.tags_c = Array.isArray(contactData.tags_c) 
          ? contactData.tags_c.join(',') 
          : contactData.tags_c;
      }
      if (contactData.notes_c !== undefined) updateFields.notes_c = contactData.notes_c;
      
      const params = {
        records: [updateFields]
      };
      
      const response = await apperClient.updateRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
          throw new Error("Failed to delete contact");
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_contact_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {"fieldName": "first_name_c", "operator": "Contains", "values": [lowerQuery]}
              ],
              operator: ""
            },
            {
              conditions: [
                {"fieldName": "last_name_c", "operator": "Contains", "values": [lowerQuery]}
              ],
              operator: ""
            },
            {
              conditions: [
                {"fieldName": "email_c", "operator": "Contains", "values": [lowerQuery]}
              ],
              operator: ""
            },
            {
              conditions: [
                {"fieldName": "company_c", "operator": "Contains", "values": [lowerQuery]}
              ],
              operator: ""
            }
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching contacts:", error?.response?.data?.message || error);
      return [];
    }
  }
};

export default contactService;