import React from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeadset, FaClock, FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import './DashboardCard.css';

const ContactSupportCard = () => {
  const { t } = useLanguage();

  const contactInfo = [
    {
      icon: <FaPhone className="contact-icon" />,
      title: 'Phone',
      value: '+918028385476',
      action: 'tel:+918028385476',
      description: 'Call us for immediate assistance'
    },
    {
      icon: <FaEnvelope className="contact-icon" />,
      title: 'Email',
      value: 'kishanHelp@gmail.com',
      action: 'mailto:kishanHelp@gmail.com',
      description: 'Send us your queries via email'
    },
    {
      icon: <FaMapMarkerAlt className="contact-icon" />,
      title: 'Location',
      value: 'New Delhi Farm Concern Center',
      action: null,
      description: 'Visit our support center'
    }
  ];

  const supportHours = [
    { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', time: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', time: 'Emergency Support Only' }
  ];

  const handleContactAction = (action) => {
    if (action) {
      window.open(action, '_self');
    }
  };

  return (
    <motion.div
      className="dashboard-card contact-support-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <div className="card-title">
          <FaHeadset className="card-icon" />
          <h3>Contact Us</h3>
        </div>
      </div>

      <div className="card-content">
        <div className="contact-support-content">
          <p className="contact-description">
            Get in touch with our support team for any assistance or queries
          </p>

          <div className="contact-info-grid">
            {contactInfo.map((contact, index) => (
              <motion.div
                key={index}
                className={`contact-item ${contact.action ? 'clickable' : ''}`}
                onClick={() => handleContactAction(contact.action)}
                whileHover={contact.action ? { scale: 1.02 } : {}}
                whileTap={contact.action ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="contact-icon-container">
                  {contact.icon}
                </div>
                <div className="contact-details">
                  <h4 className="contact-title">{contact.title}</h4>
                  <p className="contact-value">{contact.value}</p>
                  <p className="contact-description-text">{contact.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="support-hours">
            <h4 className="hours-title">
              <FaClock className="hours-icon" />
              Support Hours
            </h4>
            <div className="hours-list">
              {supportHours.map((schedule, index) => (
                <div key={index} className="hours-item">
                  <span className="hours-day">{schedule.day}</span>
                  <span className="hours-time">{schedule.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-actions">
            <h4 className="actions-title">Quick Actions</h4>
            <div className="action-buttons">
              <motion.button
                className="action-button whatsapp-button"
                onClick={() => window.open('https://wa.me/918028385476', '_blank')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaWhatsapp className="action-icon" />
                WhatsApp Support
              </motion.button>
              <motion.button
                className="action-button email-button"
                onClick={() => window.open('mailto:kishanHelp@gmail.com', '_self')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEnvelope className="action-icon" />
                Send Email
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactSupportCard;
