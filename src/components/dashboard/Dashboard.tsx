import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, HelpCircle } from 'lucide-react';
import KpiCard from '../ui/KpiCard';
import Button from '../ui/Button';
import { useContacts } from '../../context/ContactContext';
import { useNotifications } from '../../context/NotificationContext';
import { kpiCardsData, contactsOverTimeData, contactsByTagData } from '../../data/mockData';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const { contacts } = useContacts();
  const { addNotification } = useNotifications();
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleSync = () => {
    setIsSyncing(true);
    
    // Simulate sync delay
    setTimeout(() => {
      setIsSyncing(false);
      addNotification({
        title: 'Sync Completed',
        message: 'All your contacts have been synchronized successfully',
        type: 'success'
      });
    }, 2000);
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div 
        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Your contact management overview
          </p>
        </div>
        
        <Button 
          variant="primary" 
          icon={<RefreshCcw className="w-4 h-4" />}
          loading={isSyncing}
          onClick={handleSync}
        >
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </motion.div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCardsData.map((card, index) => (
          <KpiCard key={index} card={card} />
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts Over Time */}
        <motion.div 
          className="glass-card p-6 col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Contacts Over Time</h2>
            <button className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200">
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          
          <div className="h-80">
            <Line 
              data={contactsOverTimeData}
              options={chartOptions}
            />
          </div>
        </motion.div>
        
        {/* Contacts by Tag */}
        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Contacts by Tag</h2>
            <button className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200">
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          
          <div className="h-72 flex items-center justify-center">
            <Doughnut 
              data={contactsByTagData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Recent Activity */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {contacts.slice(0, 5).map((contact) => (
            <div 
              key={contact.id} 
              className="flex items-center p-3 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              <img 
                src={contact.avatar} 
                alt={`${contact.firstName} ${contact.lastName}`}
                className="w-10 h-10 rounded-full mr-4" 
              />
              <div className="flex-1">
                <h3 className="font-medium">{contact.firstName} {contact.lastName}</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">{contact.email}</p>
              </div>
              <div className="text-sm text-secondary-500 dark:text-secondary-400">
                {new Date(contact.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;