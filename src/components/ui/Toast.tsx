import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { NotificationType } from '../../types';
import { useNotifications } from '../../context/NotificationContext';

interface ToastProps {
  notification: NotificationType;
}

const Toast: React.FC<ToastProps> = ({ notification }) => {
  const { removeNotification } = useNotifications();
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevProgress - 1;
      });
    }, 50);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  useEffect(() => {
    if (progress === 0) {
      removeNotification(notification.id);
    }
  }, [progress, notification.id, removeNotification]);
  
  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-success-500';
      case 'warning':
        return 'bg-warning-500';
      case 'error':
        return 'bg-error-500';
      default:
        return 'bg-primary-500';
    }
  };
  
  return (
    <motion.div
      className="glass p-4 rounded-lg shadow-lg max-w-md"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`w-2 h-2 rounded-full mt-1.5 ${getBgColor()}`} />
          <div>
            <h4 className="font-medium">{notification.title}</h4>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
              {notification.message}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => removeNotification(notification.id)}
          className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="h-1 mt-3 rounded-full bg-secondary-200 dark:bg-secondary-700 overflow-hidden">
        <div 
          className={`h-full ${getBgColor()}`}
          style={{ width: `${progress}%`, transition: 'width 50ms linear' }}
        />
      </div>
    </motion.div>
  );
};

export default Toast;