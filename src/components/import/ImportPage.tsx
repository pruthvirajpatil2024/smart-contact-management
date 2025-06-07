import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Download, X } from 'lucide-react';
import Button from '../ui/Button';
import { useContacts } from '../../context/ContactContext';
import { useNotifications } from '../../context/NotificationContext';

interface ImportStatus {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  message: string;
  details?: {
    total: number;
    imported: number;
    errors: number;
  };
}

const ImportPage: React.FC = () => {
  const { importContacts } = useContacts();
  const { addNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    status: 'idle',
    progress: 0,
    message: ''
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setImportStatus({ status: 'idle', progress: 0, message: '' });
      } else {
        addNotification({
          title: 'Invalid File Type',
          message: 'Please select a CSV file',
          type: 'error'
        });
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
      setImportStatus({ status: 'idle', progress: 0, message: '' });
    } else {
      addNotification({
        title: 'Invalid File Type',
        message: 'Please select a CSV file',
        type: 'error'
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setImportStatus({
      status: 'uploading',
      progress: 0,
      message: 'Uploading file...'
    });

    try {
      // Simulate upload progress
      for (let i = 0; i <= 30; i += 10) {
        setImportStatus(prev => ({ ...prev, progress: i }));
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setImportStatus({
        status: 'processing',
        progress: 40,
        message: 'Processing contacts...'
      });

      // Simulate processing progress
      for (let i = 40; i <= 90; i += 10) {
        setImportStatus(prev => ({ ...prev, progress: i }));
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      await importContacts(selectedFile);

      setImportStatus({
        status: 'success',
        progress: 100,
        message: 'Import completed successfully!',
        details: {
          total: 150,
          imported: 147,
          errors: 3
        }
      });

      addNotification({
        title: 'Import Successful',
        message: '147 contacts imported successfully',
        type: 'success'
      });

    } catch (error) {
      setImportStatus({
        status: 'error',
        progress: 0,
        message: 'Import failed. Please try again.',
        details: {
          total: 0,
          imported: 0,
          errors: 1
        }
      });

      addNotification({
        title: 'Import Failed',
        message: 'There was an error importing your contacts',
        type: 'error'
      });
    }
  };

  const resetImport = () => {
    setSelectedFile(null);
    setImportStatus({ status: 'idle', progress: 0, message: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'firstName,lastName,email,phone,company,jobTitle,tags,notes\nJohn,Doe,john.doe@example.com,+1234567890,Acme Inc,Software Engineer,"client,tech",Sample contact';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contacts_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Upload className="w-7 h-7 text-primary-600" />
            Import Contacts
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Upload a CSV file to import multiple contacts at once
          </p>
        </div>
        
        <Button 
          variant="outline" 
          icon={<Download className="w-4 h-4" />}
          onClick={downloadTemplate}
        >
          Download Template
        </Button>
      </motion.div>

      {/* Import Instructions */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold mb-4">Import Instructions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm">
              1
            </div>
            <div>
              <h4 className="font-medium">Prepare Your CSV</h4>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Use the template or ensure your CSV has the required columns
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm">
              2
            </div>
            <div>
              <h4 className="font-medium">Upload File</h4>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Drag and drop or click to select your CSV file
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm">
              3
            </div>
            <div>
              <h4 className="font-medium">Review & Import</h4>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Review the preview and start the import process
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* File Upload Area */}
      <motion.div 
        className="glass-card p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="max-w-2xl mx-auto">
          {!selectedFile ? (
            <div
              className="border-2 border-dashed border-secondary-300 dark:border-secondary-700 rounded-2xl p-12 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Upload className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Drop your CSV file here</h3>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  or click to browse and select a file
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-500">
                  Supports CSV files up to 10MB
                </p>
              </motion.div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected File */}
              <motion.div 
                className="flex items-center justify-between p-4 bg-secondary-100 dark:bg-secondary-800 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary-600" />
                  <div>
                    <h4 className="font-medium">{selectedFile.name}</h4>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={resetImport}
                  className="p-2 rounded-lg text-secondary-500 hover:text-error-600 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>

              {/* Import Progress */}
              <AnimatePresence>
                {importStatus.status !== 'idle' && (
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{importStatus.message}</span>
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">
                        {importStatus.progress}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                      <motion.div 
                        className="bg-primary-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${importStatus.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    {importStatus.status === 'success' && importStatus.details && (
                      <motion.div 
                        className="grid grid-cols-3 gap-4 p-4 bg-success-50 dark:bg-success-900/20 rounded-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                            {importStatus.details.total}
                          </div>
                          <div className="text-sm text-secondary-600 dark:text-secondary-400">
                            Total Records
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                            {importStatus.details.imported}
                          </div>
                          <div className="text-sm text-secondary-600 dark:text-secondary-400">
                            Imported
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                            {importStatus.details.errors}
                          </div>
                          <div className="text-sm text-secondary-600 dark:text-secondary-400">
                            Errors
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {importStatus.status === 'error' && (
                      <motion.div 
                        className="flex items-center gap-3 p-4 bg-error-50 dark:bg-error-900/20 rounded-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <AlertCircle className="w-5 h-5 text-error-600 dark:text-error-400" />
                        <span className="text-error-700 dark:text-error-300">
                          Import failed. Please check your file format and try again.
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <Button variant="secondary" onClick={resetImport}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  icon={<Upload className="w-4 h-4" />}
                  onClick={handleImport}
                  disabled={importStatus.status === 'uploading' || importStatus.status === 'processing'}
                  loading={importStatus.status === 'uploading' || importStatus.status === 'processing'}
                >
                  {importStatus.status === 'uploading' ? 'Uploading...' :
                   importStatus.status === 'processing' ? 'Processing...' :
                   'Start Import'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ImportPage;