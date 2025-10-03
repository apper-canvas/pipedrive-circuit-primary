import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const activityService = {
  getAll: async () => {
    await delay(250);
    return [...activities].sort((a, b) => b.timestamp - a.timestamp);
  },

  getByDealId: async (dealId) => {
    await delay(200);
    return activities
      .filter(a => a.dealId === parseInt(dealId))
      .sort((a, b) => b.timestamp - a.timestamp);
  },

  getByContactId: async (contactId) => {
    await delay(200);
    return activities
      .filter(a => a.contactId === parseInt(contactId))
      .sort((a, b) => b.timestamp - a.timestamp);
  },

  create: async (activityData) => {
    await delay(300);
    const maxId = activities.length > 0 ? Math.max(...activities.map(a => a.Id)) : 0;
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      timestamp: Date.now()
    };
    activities.push(newActivity);
    return { ...newActivity };
  }
};

export default activityService;