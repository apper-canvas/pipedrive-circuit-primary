const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const taskService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords("tasks_c", params);

      if (!response?.success) {
        console.error(response?.message || "Failed to fetch tasks");
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } }
        ]
      };

      const response = await apperClient.getRecordById("tasks_c", id, params);

      if (!response?.success) {
        console.error(response?.message || "Failed to fetch task");
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.message || error);
      return null;
    }
  },

  async getByContactId(contactId) {
    try {
      // Note: This requires a contact lookup field in tasks_c table
      // Currently prepared for future implementation when relationship field added
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } }
        ],
        where: [],
        orderBy: [{ fieldName: "due_date_c", sorttype: "ASC" }],
        pagingInfo: { limit: 50, offset: 0 }
      };

      const response = await apperClient.fetchRecords("tasks_c", params);

      if (!response?.success) {
        console.error(response?.message || "Failed to fetch contact tasks");
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching tasks for contact ${contactId}:`, error?.message || error);
      return [];
    }
  },

  async create(taskData) {
    try {
      const params = {
        records: [
          {
            name_c: taskData.name_c,
            description_c: taskData.description_c || "",
            status_c: taskData.status_c,
            due_date_c: taskData.due_date_c,
            priority_c: taskData.priority_c,
            Tags: taskData.Tags || ""
          }
        ]
      };

      const response = await apperClient.createRecord("tasks_c", params);

      if (!response?.success) {
        console.error(response?.message || "Failed to create task");
        throw new Error(response?.message || "Failed to create task");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          const failedRecords = failed.map(r => ({
            message: r.message,
            errors: r.errors
          }));
          console.error(`Failed to create task: ${JSON.stringify(failedRecords)}`);
          
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(error.message || error);
              });
            }
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating task:", error?.message || error);
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            name_c: taskData.name_c,
            description_c: taskData.description_c || "",
            status_c: taskData.status_c,
            due_date_c: taskData.due_date_c,
            priority_c: taskData.priority_c,
            Tags: taskData.Tags || ""
          }
        ]
      };

      const response = await apperClient.updateRecord("tasks_c", params);

      if (!response?.success) {
        console.error(response?.message || "Failed to update task");
        throw new Error(response?.message || "Failed to update task");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          const failedRecords = failed.map(r => ({
            message: r.message,
            errors: r.errors
          }));
          console.error(`Failed to update task: ${JSON.stringify(failedRecords)}`);
          
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(error.message || error);
              });
            }
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating task:", error?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("tasks_c", params);

      if (!response?.success) {
        console.error(response?.message || "Failed to delete task");
        throw new Error(response?.message || "Failed to delete task");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          const failedRecords = failed.map(r => ({ message: r.message }));
          console.error(`Failed to delete task: ${JSON.stringify(failedRecords)}`);
          
          failed.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting task:", error?.message || error);
      throw error;
    }
  }
};

export default taskService;