import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useContacts } from '../../context/ContactContext';
import { Contact } from '../../types';

interface ContactFormProps {
  id: string;
  contact?: Contact;
  onSuccess: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ id, contact, onSuccess }) => {
  const { addContact, updateContact } = useContacts();
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState<Partial<Contact>>(
    contact || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      tags: [],
      notes: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
    }
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return value.trim() ? '' : 'This field is required';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address';
      case 'phone':
        return /^[\d\s+()-]+$/.test(value) ? '' : 'Enter a valid phone number';
      default:
        return '';
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Validate
    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  };
  
  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim().toLowerCase())) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...(prev.tags || []), tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };
  
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    const newErrors: Record<string, string> = {};
    newErrors.firstName = validateField('firstName', formData.firstName || '');
    newErrors.lastName = validateField('lastName', formData.lastName || '');
    newErrors.email = validateField('email', formData.email || '');
    newErrors.phone = validateField('phone', formData.phone || '');
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error);
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    // Generate a random avatar if it's a new contact
    if (!contact) {
      const newContact = {
        ...formData,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        tags: formData.tags || [],
        avatar: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random&color=fff`,
      };
      
      addContact(newContact);
    } else {
      updateContact(contact.id, formData);
    }
    
    onSuccess();
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            First Name <span className="text-error-500">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName || ''}
            onChange={handleChange}
            className={`input-field ${errors.firstName ? 'border-error-500 focus:ring-error-500' : ''}`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-error-500">{errors.firstName}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            Last Name <span className="text-error-500">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName || ''}
            onChange={handleChange}
            className={`input-field ${errors.lastName ? 'border-error-500 focus:ring-error-500' : ''}`}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-error-500">{errors.lastName}</p>
          )}
        </div>
      </div>
      
      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email <span className="text-error-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            className={`input-field ${errors.email ? 'border-error-500 focus:ring-error-500' : ''}`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error-500">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone <span className="text-error-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone || ''}
            onChange={handleChange}
            className={`input-field ${errors.phone ? 'border-error-500 focus:ring-error-500' : ''}`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-error-500">{errors.phone}</p>
          )}
        </div>
      </div>
      
      {/* Work Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-1">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company || ''}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium mb-1">
            Job Title
          </label>
          <input
            id="jobTitle"
            name="jobTitle"
            type="text"
            value={formData.jobTitle || ''}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>
      
      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          Tags
        </label>
        <div className="flex items-center gap-2">
          <input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="input-field flex-1"
            placeholder="Add a tag and press Enter"
          />
          <button
            type="button"
            onClick={addTag}
            className="p-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        {formData.tags && formData.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 text-sm"
              >
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Address */}
      <div>
        <h3 className="text-md font-medium mb-3">Address</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="address.street" className="block text-sm font-medium mb-1">
              Street
            </label>
            <input
              id="address.street"
              name="address.street"
              type="text"
              value={formData.address?.street || ''}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="address.city" className="block text-sm font-medium mb-1">
                City
              </label>
              <input
                id="address.city"
                name="address.city"
                type="text"
                value={formData.address?.city || ''}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            
            <div>
              <label htmlFor="address.state" className="block text-sm font-medium mb-1">
                State/Province
              </label>
              <input
                id="address.state"
                name="address.state"
                type="text"
                value={formData.address?.state || ''}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="address.zip" className="block text-sm font-medium mb-1">
                ZIP/Postal Code
              </label>
              <input
                id="address.zip"
                name="address.zip"
                type="text"
                value={formData.address?.zip || ''}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            
            <div>
              <label htmlFor="address.country" className="block text-sm font-medium mb-1">
                Country
              </label>
              <input
                id="address.country"
                name="address.country"
                type="text"
                value={formData.address?.country || ''}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes || ''}
          onChange={handleChange}
          className="input-field"
        />
      </div>
    </form>
  );
};

export default ContactForm;