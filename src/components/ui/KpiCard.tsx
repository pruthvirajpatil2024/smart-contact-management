import React from 'react';
import { motion } from 'framer-motion';
import { KpiCard as KpiCardType } from '../../types';

interface KpiCardProps {
  card: KpiCardType;
}

const KpiCard: React.FC<KpiCardProps> = ({ card }) => {
  const getColorClass = () => {
    switch (card.color) {
      case 'primary':
        return 'from-primary-600 to-primary-700 text-white';
      case 'secondary':
        return 'from-secondary-600 to-secondary-700 text-white';
      case 'accent':
        return 'from-accent-600 to-accent-700 text-white';
      case 'success':
        return 'from-success-600 to-success-700 text-white';
      case 'warning':
        return 'from-warning-600 to-warning-700 text-white';
      case 'error':
        return 'from-error-600 to-error-700 text-white';
      default:
        return 'from-primary-600 to-primary-700 text-white';
    }
  };
  
  const getChangeColor = () => {
    if (!card.change) return '';
    
    switch (card.change.type) {
      case 'increase':
        return 'text-success-400';
      case 'decrease':
        return 'text-error-400';
      case 'neutral':
        return 'text-secondary-400';
      default:
        return 'text-secondary-400';
    }
  };
  
  const getChangeIcon = () => {
    if (!card.change) return null;
    
    switch (card.change.type) {
      case 'increase':
        return '↑';
      case 'decrease':
        return '↓';
      case 'neutral':
        return '→';
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="glass-card overflow-hidden"
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        transition: { duration: 0.2 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-secondary-600 dark:text-secondary-300">
              {card.title}
            </h3>
            <div className="mt-6 flex items-baseline">
              <motion.p 
                className="text-3xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {card.value}
              </motion.p>
              
              {card.change && (
                <p className={`ml-2 text-sm ${getChangeColor()}`}>
                  <span>{getChangeIcon()}</span> {card.change.value}%
                </p>
              )}
            </div>
          </div>
          
          <div className={`rounded-lg p-3 bg-gradient-to-br ${getColorClass()}`}>
            {card.icon}
          </div>
        </div>
      </div>
      
      {/* Bottom gradient bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${getColorClass()}`}></div>
    </motion.div>
  );
};

export default KpiCard;