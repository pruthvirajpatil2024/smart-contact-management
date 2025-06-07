import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, Search, Edit, Trash2, MoreHorizontal, X } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import ContactForm from './ContactForm';
import { useContacts } from '../../context/ContactContext';
import { useNotifications } from '../../context/NotificationContext';
import { Contact } from '../../types';

const ContactsPage: React.FC = () => {
  const { contacts, deleteContact, filterContacts } = useContacts();
  const { addNotification } = useNotifications();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const filteredContacts = filterContacts(searchTerm, filters);
  
  const openEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };
  
  const openDeleteModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDeleteModalOpen(true);
  };
  
  const handleDelete = () => {
    if (selectedContact) {
      deleteContact(selectedContact.id);
      addNotification({
        title: 'Contact Deleted',
        message: `${selectedContact.firstName} ${selectedContact.lastName} has been deleted`,
        type: 'success'
      });
      setIsDeleteModalOpen(false);
    }
  };
  
  const addFilter = (type: string, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    if (!activeFilters.includes(`${type}:${value}`)) {
      setActiveFilters(prev => [...prev, `${type}:${value}`]);
    }
  };
  
  const removeFilter = (filterKey: string) => {
    const [type, value] = filterKey.split(':');
    const newFilters = { ...filters };
    delete newFilters[type];
    setFilters(newFilters);
    setActiveFilters(prev => prev.filter(f => f !== filterKey));
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div 
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            View and manage your contacts
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            icon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
        </div>
      </motion.div>
      
      {/* Search and Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search contacts..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              icon={<Filter className="w-4 h-4" />}
            >
              Filter
            </Button>
          </div>
        </div>
        
        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <div 
                key={filter}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-100 dark:bg-secondary-800 text-sm"
              >
                {filter}
                <button onClick={() => removeFilter(filter)}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Contacts Table */}
      <motion.div 
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-100 dark:bg-secondary-800">
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Tags</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Updated</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
              {filteredContacts.map((contact, index) => (
                <motion.tr 
                  key={contact.id}
                  className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={contact.avatar} 
                        alt={`${contact.firstName} ${contact.lastName}`}
                        className="w-8 h-8 rounded-full" 
                      />
                      <div>
                        <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">{contact.jobTitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{contact.email}</td>
                  <td className="px-4 py-3 text-sm">{contact.phone}</td>
                  <td className="px-4 py-3 text-sm">{contact.company}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="badge badge-primary cursor-pointer"
                          onClick={() => addFilter('tag', tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(contact.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-1.5 rounded-lg text-secondary-500 hover:text-primary-600 hover:bg-secondary-100 dark:hover:bg-secondary-800"
                        onClick={() => openEditModal(contact)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 rounded-lg text-secondary-500 hover:text-error-600 hover:bg-secondary-100 dark:hover:bg-secondary-800"
                        onClick={() => openDeleteModal(contact)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-800">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredContacts.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-secondary-500 dark:text-secondary-400">No contacts found</p>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Edit Contact Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Contact"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit"  variant="primary">
              Save Changes
            </Button>
          </>
        }
      >
        {selectedContact && (
          <ContactForm 
            id="edit-contact-form"
            contact={selectedContact}
            onSuccess={() => {
              setIsEditModalOpen(false);
              addNotification({
                title: 'Contact Updated',
                message: 'The contact has been updated successfully',
                type: 'success'
              });
            }}
          />
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Contact"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="error" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        {selectedContact && (
          <div className="text-center">
            <p className="mb-4">
              Are you sure you want to delete {selectedContact.firstName} {selectedContact.lastName}?
            </p>
            <p className="text-error-500">This action cannot be undone.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContactsPage;