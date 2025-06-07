import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Database, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { useContacts } from '../../context/ContactContext';
import { useNotifications } from '../../context/NotificationContext';

interface SyncMetadata {
  lastSyncTime: Date | null;
  syncDuration: number;
  totalRows: number;
  totalColumns: number;
  status: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
}

const SyncPage: React.FC = () => {
  const { syncContacts, contacts } = useContacts();
  const { addNotification } = useNotifications();
  
  const [syncMetadata, setSyncMetadata] = useState<SyncMetadata>({
    lastSyncTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    syncDuration: 1.2,
    totalRows: contacts.length,
    totalColumns: 12,
    status: 'idle'
  });

  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    setSyncMetadata(prev => ({ ...prev, totalRows: contacts.length }));
  }, [contacts.length]);

  const handleSync = async () => {
    setSyncMetadata(prev => ({ ...prev, status: 'syncing' }));
    setSyncProgress(0);

    try {
      const startTime = Date.now();

      // Simulate sync progress
      const progressSteps = [10, 25, 40, 60, 75, 90, 100];
      for (const step of progressSteps) {
        setSyncProgress(step);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      await syncContacts();

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      setSyncMetadata(prev => ({
        ...prev,
        status: 'success',
        lastSyncTime: new Date(),
        syncDuration: duration,
        totalRows: contacts.length
      }));

      addNotification({
        title: 'Sync Completed',
        message: `Successfully synchronized ${contacts.length} contacts`,
        type: 'success'
      });

    } catch (error) {
      setSyncMetadata(prev => ({
        ...prev,
        status: 'error',
        errorMessage: 'Failed to sync with regional database'
      }));

      addNotification({
        title: 'Sync Failed',
        message: 'Unable to connect to regional database',
        type: 'error'
      });
    }

    setSyncProgress(0);
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds.toFixed(1)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  };

  const getTimeSinceLastSync = () => {
    if (!syncMetadata.lastSyncTime) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - syncMetadata.lastSyncTime.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
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
            <RefreshCcw className="w-7 h-7 text-primary-600" />
            Sync Contacts
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Synchronize your contacts with the regional database
          </p>
        </div>
      </motion.div>

      {/* Sync Status Card */}
      <motion.div 
        className="glass-card p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="text-center space-y-6">
          <div className="relative">
            <motion.div
              className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                syncMetadata.status === 'syncing' ? 'bg-primary-100 dark:bg-primary-900' :
                syncMetadata.status === 'success' ? 'bg-success-100 dark:bg-success-900' :
                syncMetadata.status === 'error' ? 'bg-error-100 dark:bg-error-900' :
                'bg-secondary-100 dark:bg-secondary-800'
              }`}
              animate={syncMetadata.status === 'syncing' ? { rotate: 360 } : {}}
              transition={syncMetadata.status === 'syncing' ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
            >
              {syncMetadata.status === 'syncing' ? (
                <RefreshCcw className="w-12 h-12 text-primary-600 dark:text-primary-400" />
              ) : syncMetadata.status === 'success' ? (
                <CheckCircle className="w-12 h-12 text-success-600 dark:text-success-400" />
              ) : syncMetadata.status === 'error' ? (
                <AlertCircle className="w-12 h-12 text-error-600 dark:text-error-400" />
              ) : (
                <Database className="w-12 h-12 text-secondary-600 dark:text-secondary-400" />
              )}
            </motion.div>

            {syncMetadata.status === 'syncing' && (
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-800"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">
              {syncMetadata.status === 'syncing' ? 'Synchronizing...' :
               syncMetadata.status === 'success' ? 'Sync Complete' :
               syncMetadata.status === 'error' ? 'Sync Failed' :
               'Ready to Sync'}
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              {syncMetadata.status === 'syncing' ? 'Please wait while we sync your contacts' :
               syncMetadata.status === 'success' ? 'Your contacts are up to date' :
               syncMetadata.status === 'error' ? syncMetadata.errorMessage :
               'Click the button below to start synchronization'}
            </p>
          </div>

          {/* Sync Progress */}
          <AnimatePresence>
            {syncMetadata.status === 'syncing' && (
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{syncProgress}%</span>
                </div>
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                  <motion.div 
                    className="bg-primary-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${syncProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            variant="primary" 
            size="lg"
            icon={<RefreshCcw className="w-5 h-5" />}
            onClick={handleSync}
            disabled={syncMetadata.status === 'syncing'}
            loading={syncMetadata.status === 'syncing'}
            className="px-8"
          >
            {syncMetadata.status === 'syncing' ? 'Syncing...' : 'Start Sync'}
          </Button>
        </div>
      </motion.div>

      {/* Sync Metadata */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold mb-6">Sync Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            className="text-center p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Clock className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">
              {getTimeSinceLastSync()}
            </div>
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              Last Sync
            </div>
          </motion.div>

          <motion.div 
            className="text-center p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <RefreshCcw className="w-8 h-8 text-accent-600 dark:text-accent-400 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">
              {formatDuration(syncMetadata.syncDuration)}
            </div>
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              Duration
            </div>
          </motion.div>

          <motion.div 
            className="text-center p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Users className="w-8 h-8 text-success-600 dark:text-success-400 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">
              {syncMetadata.totalRows.toLocaleString()}
            </div>
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              Total Contacts
            </div>
          </motion.div>

          <motion.div 
            className="text-center p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Database className="w-8 h-8 text-warning-600 dark:text-warning-400 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">
              {syncMetadata.totalColumns}
            </div>
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              Data Fields
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Sync History */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold mb-4">Recent Sync Activity</h3>
        
        <div className="space-y-3">
          {syncMetadata.lastSyncTime && (
            <div className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
                <div>
                  <div className="font-medium">Successful Sync</div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">
                    {syncMetadata.lastSyncTime.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                {syncMetadata.totalRows} contacts
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
              <div>
                <div className="font-medium">Successful Sync</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              {Math.max(0, syncMetadata.totalRows - 5)} contacts
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SyncPage;