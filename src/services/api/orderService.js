const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const orderService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "order_number_c"}},
          {"field": {"Name": "deal_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_amount_c"}},
{"field": {"Name": "notes_c"}},
          {"field": {"Name": "issue_date_c"}},
          {"field": {"Name": "shipping_date_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "shipping_address_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching orders:", error?.response?.data?.message || error);
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
          {"field": {"Name": "Owner"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "order_number_c"}},
          {"field": {"Name": "deal_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_amount_c"}},
{"field": {"Name": "notes_c"}},
          {"field": {"Name": "issue_date_c"}},
          {"field": {"Name": "shipping_date_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "shipping_address_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('order_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Order not found");
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching order by id:", error?.response?.data?.message || error);
      throw error;
    }
  },

  create: async (orderData) => {
    try {
      const params = {
        records: [
          {
            Name: orderData.order_number_c || `Order-${Date.now()}`,
            order_number_c: orderData.order_number_c,
            deal_id_c: parseInt(orderData.deal_id_c),
            contact_id_c: parseInt(orderData.contact_id_c),
            order_date_c: orderData.order_date_c,
            status_c: orderData.status_c,
            total_amount_c: parseFloat(orderData.total_amount_c),
notes_c: orderData.notes_c || '',
            issue_date_c: orderData.issue_date_c || '',
            shipping_date_c: orderData.shipping_date_c || '',
            billing_address_c: orderData.billing_address_c || '',
            shipping_address_c: orderData.shipping_address_c || ''
          }
        ]
      };
      
      const response = await apperClient.createRecord('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} orders: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating order:", error?.response?.data?.message || error);
      throw error;
    }
  },

  update: async (id, orderData) => {
    try {
      const updateFields = {
        Id: parseInt(id)
      };
      
      if (orderData.order_number_c !== undefined) updateFields.order_number_c = orderData.order_number_c;
      if (orderData.deal_id_c !== undefined) updateFields.deal_id_c = parseInt(orderData.deal_id_c);
      if (orderData.contact_id_c !== undefined) updateFields.contact_id_c = parseInt(orderData.contact_id_c);
      if (orderData.order_date_c !== undefined) updateFields.order_date_c = orderData.order_date_c;
      if (orderData.status_c !== undefined) updateFields.status_c = orderData.status_c;
      if (orderData.total_amount_c !== undefined) updateFields.total_amount_c = parseFloat(orderData.total_amount_c);
      if (orderData.notes_c !== undefined) updateFields.notes_c = orderData.notes_c;
if (orderData.Name !== undefined) updateFields.Name = orderData.Name;
      if (orderData.issue_date_c !== undefined) updateFields.issue_date_c = orderData.issue_date_c;
      if (orderData.shipping_date_c !== undefined) updateFields.shipping_date_c = orderData.shipping_date_c;
      if (orderData.billing_address_c !== undefined) updateFields.billing_address_c = orderData.billing_address_c;
      if (orderData.shipping_address_c !== undefined) updateFields.shipping_address_c = orderData.shipping_address_c;
      const params = {
        records: [updateFields]
      };
      
      const response = await apperClient.updateRecord('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} orders: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating order:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} orders: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
          throw new Error("Failed to delete order");
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting order:", error?.response?.data?.message || error);
      throw error;
    }
  }
};

export default orderService;