import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from '../ui/Toast';
import { useNotifications } from '../../context/NotificationContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { notifications } = useNotifications();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-secondary-50 dark:bg-secondary-950">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
        {notifications.map(notification => (
          <Toast 
            key={notification.id}
            notification={notification} 
          />
        ))}
      </div>
    </div>
  );
};

export default Layout;