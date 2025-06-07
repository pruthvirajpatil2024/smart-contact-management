import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Sun, 
  Moon, 
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [searchFocused, setSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  // Handle outside clicks for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="glass sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between p-4">
        {/* Left: Mobile Menu Button & Title */}
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <h1 className="text-xl font-semibold hidden sm:block">Smart Contact Manager</h1>
        </div>
        
        {/* Center: Search */}
        <div className="flex-1 max-w-xl mx-6">
          <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-105' : 'scale-100'}`}>
            <input
              type="text"
              placeholder="Search contacts, companies..."
              className="w-full py-2 pl-10 pr-4 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white/50 dark:bg-secondary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400 transition-colors ${searchFocused ? 'text-primary-500' : ''}`} />
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          
          {/* Notifications */}
          <div className="relative" ref={notificationDropdownRef}>
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              <Bell className={`w-5 h-5 ${unreadNotifications > 0 ? 'animate-pulse-slow text-primary-500' : ''}`} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div 
                  className="absolute right-0 mt-2 w-80 glass rounded-lg shadow-lg overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-3 border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-between">
                    <h3 className="font-medium">Notifications</h3>
                    {unreadNotifications > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div>
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`p-3 border-b border-secondary-200 dark:border-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors ${!notification.read ? 'bg-secondary-50 dark:bg-secondary-900' : ''}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 ${
                                notification.type === 'info' ? 'bg-primary-500' :
                                notification.type === 'success' ? 'bg-success-500' :
                                notification.type === 'warning' ? 'bg-warning-500' :
                                'bg-error-500'
                              }`} />
                              <div className="flex-1">
                                <h4 className="text-sm font-medium">{notification.title}</h4>
                                <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-secondary-400 mt-1">
                                  {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-primary-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-secondary-500">
                        No notifications
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* User Profile */}
          <div className="relative" ref={userDropdownRef}>
            <button 
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
            </button>
            
            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div 
                  className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-lg overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-3 border-b border-secondary-200 dark:border-secondary-700">
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">john.doe@example.com</p>
                  </div>
                  
                  <div>
                    <button className="w-full text-left p-3 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
                      Profile
                    </button>
                    <button className="w-full text-left p-3 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
                      Settings
                    </button>
                    <button className="w-full text-left p-3 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors text-error-600 dark:text-error-400">
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;