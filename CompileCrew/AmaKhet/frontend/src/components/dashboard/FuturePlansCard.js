import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaLeaf, FaChartLine, FaCog, FaGlobe, FaMobile } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import './DashboardCard.css';

const FuturePlansCard = () => {
  const { t } = useLanguage();

  const futureFeatures = [
    {
      icon: '🧱',
      title: 'Farm Asset Management',
      description: 'Help farmers manage farm equipment inventory, schedule maintenance, and track usage.',
      status: 'Coming Soon'
    },
    {
      icon: '📱',
      title: 'Farmer Community Forum',
      description: 'Enable farmers to ask questions, share insights, and discuss local agricultural practices.',
      status: 'In Development'
    },
    {
      icon: '🧱',
      title: 'Farm Financial Management',
      description: 'Track costs, revenues, loans, and suggest optimal budgeting based on predicted yields and market prices.',
      status: 'Planned'
    },
    {
      icon: '🛰',
      title: 'Land Use & Field Mapping',
      description: 'Allow farmers to map fields, calculate area, monitor land usage, and visualize crop rotation plans.',
      status: 'In Progress'
    },
    {
      icon: '📊',
      title: 'Historical Yield Analytics Dashboard',
      description: 'Visualize trends of past yields, compare performance by field, crop, or season, and help in decision-making.',
      status: 'Planned'
    },
    {
      icon: '🛡',
      title: 'Crop Insurance Integration',
      description: 'Automatically calculate insurance coverage needs and provide claims support based on yield prediction and damage reports.',
      status: 'Coming Soon'
    },
    {
      icon: '🌱',
      title: 'Farmer Lifestyle & Holistic Welfare',
      description: 'Healthcare Tie-ups → Mobile health camps & insurance guidance. Education Support for Children → Scholarships & digital learning for farmers\' kids. Pension & Old-Age Security Integration → Awareness & enrollment for social security schemes.',
      status: 'In Development'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Coming Soon':
        return '#0ca976';
      case 'In Development':
        return '#f59e0b';
      case 'In Progress':
        return '#3b82f6';
      case 'Planned':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  return (
    <motion.div
      className="dashboard-card future-plans-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <div className="card-title">
          <FaRocket className="card-icon" />
          <h3>Future Plans</h3>
        </div>
      </div>

      <div className="card-content">
        <div className="future-plans-content">
          <p className="plans-description">
            Discover our upcoming features and development roadmap for AgriShakti
          </p>

          <div className="features-list">
            {futureFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="feature-header">
                  <div className="feature-icon-container emoji-icon">
                    {feature.icon}
                  </div>
                  <div className="feature-info">
                    <h4 className="feature-title">{feature.title}</h4>
                    <span 
                      className="feature-status"
                      style={{ color: getStatusColor(feature.status) }}
                    >
                      {feature.status}
                    </span>
                  </div>
                </div>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="roadmap-footer">
            <p className="roadmap-note">
              Stay tuned for regular updates and new feature releases!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FuturePlansCard;
