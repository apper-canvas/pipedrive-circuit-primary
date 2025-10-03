import contactsData from "@/services/mockData/contacts.json";

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

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

    // Sync to ClickSend SMS
    try {
      const result = await apperClient.functions.invoke(
        import.meta.env.VITE_CREATE_CLICKSEND_CONTACT,
        {
          body: JSON.stringify({
            phoneNumber: newContact.phone,
            email: newContact.email,
            firstName: newContact.firstName,
            lastName: newContact.lastName
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const responseData = await result.json();

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
      contact.firstName.toLowerCase().includes(lowerQuery) ||
      contact.lastName.toLowerCase().includes(lowerQuery) ||
      contact.email.toLowerCase().includes(lowerQuery) ||
      contact.company.toLowerCase().includes(lowerQuery)
    );
  }
};

export default contactService;