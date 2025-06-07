import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import ContactForm from './ContactForm';
import { useNotifications } from '../../context/NotificationContext';

const AddContactPage: React.FC = () => {
  const { addNotification } = useNotifications();

  const handleSuccess = () => {
    addNotification({
      title: 'Contact Added',
      message: 'The contact has been added successfully',
      type: 'success'
    });
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
        <div className="flex items-center gap-4">
          <Link to="/contacts">
            <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Contacts
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <UserPlus className="w-7 h-7 text-primary-600" />
              Add New Contact
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400">
              Create a new contact entry
            </p>
          </div>
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div 
        className="glass-card p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="max-w-4xl mx-auto">
          <ContactForm 
            id="add-contact-form"
            onSuccess={handleSuccess}
          />
          
          <div className="mt-8 flex justify-end gap-4">
            <Link to="/contacts">
              <Button variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button 
              form="add-contact-form" 
              type="submit" 
              variant="primary"
              icon={<UserPlus className="w-4 h-4" />}
            >
              Add Contact
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddContactPage;