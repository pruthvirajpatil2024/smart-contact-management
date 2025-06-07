import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Users, Building, Tag } from 'lucide-react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useContacts } from '../../context/ContactContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsPage: React.FC = () => {
  const { contacts } = useContacts();
  const [chartData, setChartData] = useState<any>({});
  const [hoveredChart, setHoveredChart] = useState<string | null>(null);

  useEffect(() => {
    if (contacts.length > 0) {
      generateChartData();
    }
  }, [contacts]);

  const generateChartData = () => {
    // Tags Distribution
    const tagCounts: Record<string, number> = {};
    contacts.forEach(contact => {
      contact.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const tagLabels = Object.keys(tagCounts);
    const tagValues = Object.values(tagCounts);

    // Company Distribution
    const companyCounts: Record<string, number> = {};
    contacts.forEach(contact => {
      const company = contact.company || 'No Company';
      companyCounts[company] = (companyCounts[company] || 0) + 1;
    });

    const topCompanies = Object.entries(companyCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    // Contacts Over Time (simulated monthly data)
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(2024, i, 1);
      return contacts.filter(contact => {
        const contactMonth = new Date(contact.createdAt).getMonth();
        return contactMonth <= i;
      }).length;
    });

    setChartData({
      tags: {
        labels: tagLabels,
        datasets: [{
          data: tagValues,
          backgroundColor: [
            'rgba(79, 70, 229, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(107, 114, 128, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)',
          ],
          borderWidth: 2,
          borderColor: '#fff',
        }]
      },
      companies: {
        labels: topCompanies.map(([company]) => company),
        datasets: [{
          label: 'Contacts',
          data: topCompanies.map(([, count]) => count),
          backgroundColor: 'rgba(79, 70, 229, 0.8)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 1,
        }]
      },
      timeline: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Total Contacts',
          data: monthlyData,
          borderColor: 'rgba(79, 70, 229, 1)',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        }]
      }
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(79, 70, 229, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(79, 70, 229, 0.5)',
        borderWidth: 1,
      },
    },
    cutout: '60%',
  };

  const getAnalyticsStats = () => {
    const totalContacts = contacts.length;
    const companiesCount = new Set(contacts.map(c => c.company).filter(Boolean)).size;
    const tagsCount = new Set(contacts.flatMap(c => c.tags)).size;
    const recentContacts = contacts.filter(c => {
      const daysDiff = (Date.now() - new Date(c.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    }).length;

    return { totalContacts, companiesCount, tagsCount, recentContacts };
  };

  const stats = getAnalyticsStats();

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
            <BarChart3 className="w-7 h-7 text-primary-600" />
            Analytics
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Insights and trends from your contact data
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Contacts', value: stats.totalContacts, icon: Users, color: 'primary' },
          { title: 'Companies', value: stats.companiesCount, icon: Building, color: 'accent' },
          { title: 'Tags', value: stats.tagsCount, icon: Tag, color: 'success' },
          { title: 'Recent Updates', value: stats.recentContacts, icon: TrendingUp, color: 'warning' },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tags Distribution */}
        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onHoverStart={() => setHoveredChart('tags')}
          onHoverEnd={() => setHoveredChart(null)}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary-600" />
              Contact Tags Distribution
            </h3>
            {hoveredChart === 'tags' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm text-secondary-600 dark:text-secondary-400"
              >
                Click legend to toggle
              </motion.div>
            )}
          </div>
          
          <div className="h-80">
            {chartData.tags && (
              <Doughnut 
                data={chartData.tags}
                options={doughnutOptions}
              />
            )}
          </div>
        </motion.div>

        {/* Company Distribution */}
        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          onHoverStart={() => setHoveredChart('companies')}
          onHoverEnd={() => setHoveredChart(null)}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building className="w-5 h-5 text-accent-600" />
              Top Companies
            </h3>
            {hoveredChart === 'companies' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm text-secondary-600 dark:text-secondary-400"
              >
                Hover for details
              </motion.div>
            )}
          </div>
          
          <div className="h-80">
            {chartData.companies && (
              <Bar 
                data={chartData.companies}
                options={chartOptions}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Timeline Chart */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        onHoverStart={() => setHoveredChart('timeline')}
        onHoverEnd={() => setHoveredChart(null)}
        whileHover={{ scale: 1.005 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success-600" />
            Contact Growth Timeline
          </h3>
          {hoveredChart === 'timeline' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm text-secondary-600 dark:text-secondary-400"
            >
              Cumulative growth over time
            </motion.div>
          )}
        </div>
        
        <div className="h-80">
          {chartData.timeline && (
            <Line 
              data={chartData.timeline}
              options={chartOptions}
            />
          )}
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <h4 className="font-medium text-primary-700 dark:text-primary-300 mb-2">
              Most Active Tag
            </h4>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              {chartData.tags?.labels?.[0] || 'No tags yet'} is your most used tag
            </p>
          </div>
          
          <div className="p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
            <h4 className="font-medium text-success-700 dark:text-success-300 mb-2">
              Growth Rate
            </h4>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              {stats.recentContacts} contacts updated in the last 30 days
            </p>
          </div>
          
          <div className="p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
            <h4 className="font-medium text-warning-700 dark:text-warning-300 mb-2">
              Diversity
            </h4>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Contacts span across {stats.companiesCount} different companies
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;