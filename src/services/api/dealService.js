import dealsData from "@/services/mockData/deals.json";

let deals = [...dealsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const dealService = {
  getAll: async () => {
    await delay(300);
    return [...deals];
  },

  getById: async (id) => {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  },

  getByContactId: async (contactId) => {
    await delay(250);
    return deals.filter(d => d.contactId === parseInt(contactId));
  },

  create: async (dealData) => {
    await delay(400);
    const maxId = deals.length > 0 ? Math.max(...deals.map(d => d.Id)) : 0;
    const newDeal = {
      Id: maxId + 1,
      ...dealData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  update: async (id, dealData) => {
    await delay(400);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    deals[index] = {
      ...deals[index],
      ...dealData,
      Id: deals[index].Id,
      updatedAt: Date.now()
    };
    return { ...deals[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    deals.splice(index, 1);
    return { success: true };
  },

  updateStage: async (id, newStage) => {
    await delay(350);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    deals[index] = {
      ...deals[index],
      stage: newStage,
      updatedAt: Date.now()
    };
    return { ...deals[index] };
  }
};

export default dealService;