import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const contactService = {
  getAll: async () => {
    await delay(300);
    return [...contacts];
  },

  getById: async (id) => {
    await delay(200);
    const contact = contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  },

  create: async (contactData) => {
    await delay(400);
    const maxId = contacts.length > 0 ? Math.max(...contacts.map(c => c.Id)) : 0;
    const newContact = {
      Id: maxId + 1,
      ...contactData,
      createdAt: Date.now(),
      lastContact: Date.now()
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  update: async (id, contactData) => {
    await delay(400);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    contacts[index] = {
      ...contacts[index],
      ...contactData,
      Id: contacts[index].Id
    };
    return { ...contacts[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    contacts.splice(index, 1);
    return { success: true };
  },

  search: async (query) => {
    await delay(250);
    const lowerQuery = query.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(lowerQuery) ||
      contact.email.toLowerCase().includes(lowerQuery) ||
      contact.company.toLowerCase().includes(lowerQuery)
    );
  }
};

export default contactService;