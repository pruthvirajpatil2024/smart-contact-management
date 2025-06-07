import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Upload, 
  RefreshCcw, 
  BarChart2, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const sidebarItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="sidebar-icon" /> },
    { path: '/contacts', label: 'Contacts', icon: <Users className="sidebar-icon" /> },
    { path: '/add-contact', label: 'Add Contact', icon: <UserPlus className="sidebar-icon" /> },
    { path: '/import', label: 'Import', icon: <Upload className="sidebar-icon" /> },
    { path: '/sync-logs', label: 'Sync Logs', icon: <RefreshCcw className="sidebar-icon" /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart2 className="sidebar-icon" /> },
  ];

  const sidebarVariants = {
    open: { width: '240px', transition: { duration: 0.3, ease: 'easeOut' } },
    closed: { width: '72px', transition: { duration: 0.3, ease: 'easeOut' } }
  };

  return (
    <motion.aside 
      className="glass border-r border-secondary-200 dark:border-secondary-800 z-20 h-screen overflow-y-auto flex flex-col"
      initial={isOpen ? 'open' : 'closed'}
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-lg p-1.5 text-white">
            <Phone className="w-5 h-5" />
          </div>
          {isOpen && (
            <motion.h1 
              className="text-lg font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Smart Contacts
            </motion.h1>
          )}
        </Link>
        
        <button 
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-6 px-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="relative">
                    {item.icon}
                    {isActive && (
                      <motion.div 
                        className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400"
                        layoutId="activeIndicator"
                      />
                    )}
                  </div>
                  
                  {isOpen && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-secondary-200 dark:border-secondary-800 p-4">
        <ul className="space-y-1">
          <li>
            <Link to="/settings" className="sidebar-item">
              <Settings className="sidebar-icon" />
              {isOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Settings
                </motion.span>
              )}
            </Link>
          </li>
          <li>
            <button className="sidebar-item w-full text-left">
              <LogOut className="sidebar-icon" />
              {isOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Logout
                </motion.span>
              )}
            </button>
          </li>
        </ul>
      </div>
    </motion.aside>
  );
};

export default Sidebar;