import React, { createContext, useContext, useState, useEffect } from 'react';
import { Contact } from '../types';
import { contactsApi } from '../services/api';
import { useNotifications } from './NotificationContext';

interface ContactContextType {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  getContact: (id: string) => Contact | undefined;
  filterContacts: (searchTerm: string, filters: Record<string, string>) => Contact[];
  searchContacts: (query: string) => Promise<void>;
  exportContacts: () => Promise<void>;
  importContacts: (file: File) => Promise<void>;
  syncContacts: () => Promise<void>;
  isSyncing: boolean;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactsApi.getAll();
      setContacts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch contacts');
      addNotification({
        title: 'Error',
        message: 'Failed to fetch contacts',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newContact = await contactsApi.create(contact);
      setContacts(prev => [...prev, newContact]);
      addNotification({
        title: 'Success',
        message: 'Contact added successfully',
        type: 'success'
      });
    } catch (err) {
      addNotification({
        title: 'Error',
        message: 'Failed to add contact',
        type: 'error'
      });
      throw err;
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const updatedContact = await contactsApi.update(id, updates);
      setContacts(prev => 
        prev.map(contact => contact.id === id ? updatedContact : contact)
      );
      addNotification({
        title: 'Success',
        message: 'Contact updated successfully',
        type: 'success'
      });
    } catch (err) {
      addNotification({
        title: 'Error',
        message: 'Failed to update contact',
        type: 'error'
      });
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await contactsApi.delete(id);
      setContacts(prev => prev.filter(contact => contact.id !== id));
      addNotification({
        title: 'Success',
        message: 'Contact deleted successfully',
        type: 'success'
      });
    } catch (err) {
      addNotification({
        title: 'Error',
        message: 'Failed to delete contact',
        type: 'error'
      });
      throw err;
    }
  };

  const getContact = (id: string) => {
    return contacts.find(contact => contact.id === id);
  };

  const searchContacts = async (query: string) => {
    try {
      setLoading(true);
      const data = await contactsApi.search(query);
      setContacts(data);
      setError(null);
    } catch (err) {
      setError('Search failed');
      addNotification({
        title: 'Error',
        message: 'Failed to search contacts',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = (searchTerm: string, filters: Record<string, string>) => {
    return contacts.filter(contact => {
      if (searchTerm && !contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !contact.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !contact.phone.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          if (key === 'tag' && !contact.tags.includes(value)) {
            return false;
          }
        }
      }
      
      return true;
    });
  };

  const exportContacts = async () => {
    try {
      await contactsApi.export();
      addNotification({
        title: 'Success',
        message: 'Contacts exported successfully',
        type: 'success'
      });
    } catch (err) {
      addNotification({
        title: 'Error',
        message: 'Failed to export contacts',
        type: 'error'
      });
    }
  };

  const importContacts = async (file: File) => {
    try {
      await contactsApi.import(file);
      await fetchContacts();
      addNotification({
        title: 'Success',
        message: 'Contacts imported successfully',
        type: 'success'
      });
    } catch (err) {
      addNotification({
        title: 'Error',
        message: 'Failed to import contacts',
        type: 'error'
      });
      throw err;
    }
  };

  const syncContacts = async () => {
    try {
      setIsSyncing(true);
      await contactsApi.sync();
      await fetchContacts();
      addNotification({
        title: 'Success',
        message: 'Contacts synchronized successfully',
        type: 'success'
      });
    } catch (err) {
      addNotification({
        title: 'Error',
        message: 'Failed to synchronize contacts',
        type: 'error'
      });
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <ContactContext.Provider 
      value={{ 
        contacts, 
        loading, 
        error, 
        addContact, 
        updateContact, 
        deleteContact, 
        getContact,
        filterContacts,
        searchContacts,
        exportContacts,
        importContacts,
        syncContacts,
        isSyncing
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = (): ContactContextType => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
};