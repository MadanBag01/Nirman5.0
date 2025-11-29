import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTint, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import './DashboardCard.css';

const IrrigationCard = () => {
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = useState(null);
  const [irrigationData, setIrrigationData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Weather API configuration (same as WeatherCard)
  const WEATHER_API_KEY = '4d1a7083e93d439a90f173113252308';
  const WEATHER_API_URL = 'https://api.weatherapi.com/v1/forecast.json';

  // Calculate irrigation data based on weather
  const calculateIrrigationData = (weather) => {
    if (!weather) return null;

    const currentTemp = weather.current?.temperature || 25;
    const humidity = weather.current?.humidity || 60;
    const rainChance = weather.forecast?.[0]?.rain ? 80 : 20;
    const windSpeed = weather.current?.wind_speed || 10;

    // Calculate soil moisture based on weather conditions
    let baseMoisture = 35;
    
    // Adjust moisture based on temperature
    if (currentTemp > 30) baseMoisture -= 8;
    else if (currentTemp > 25) baseMoisture -= 4;
    else if (currentTemp < 15) baseMoisture += 5;

    // Adjust moisture based on humidity
    if (humidity > 80) baseMoisture += 5;
    else if (humidity < 40) baseMoisture -= 6;

    // Adjust moisture based on rain chance
    if (rainChance > 60) baseMoisture += 8;
    else if (rainChance < 20) baseMoisture -= 3;

    // Adjust moisture based on wind speed
    if (windSpeed > 15) baseMoisture -= 3;

    const currentMoisture = Math.max(15, Math.min(60, Math.round(baseMoisture)));

    // Calculate optimal moisture range based on crop stage
    const optimalMoisture = {
      min: 25,
      max: 40
    };

    // Determine irrigation status
    const needsIrrigation = currentMoisture < optimalMoisture.min;
    const lastIrrigation = needsIrrigation ? '3 days ago' : '1 day ago';
    const nextIrrigation = needsIrrigation ? 'Today' : '2 days';

    // Generate recommendations based on weather
    const recommendations = [];
    if (needsIrrigation) {
      recommendations.push('Irrigation required - soil moisture is below optimal level');
      recommendations.push('Apply 30mm water immediately to restore soil moisture');
    } else {
      recommendations.push('No irrigation needed today - soil moisture is adequate');
    }

    if (rainChance > 60) {
      recommendations.push('Rain expected - delay irrigation to avoid overwatering');
    } else {
      recommendations.push('No rain expected - proceed with irrigation schedule');
    }

    if (currentTemp > 30) {
      recommendations.push('High temperature - increase irrigation frequency');
      recommendations.push('Best irrigation time: Early morning (5-7 AM) to avoid evaporation');
    } else {
      recommendations.push('Best irrigation time: Early morning (6-8 AM)');
    }

    // Calculate 3-day schedule based on weather forecast
    const schedule = weather.forecast?.slice(0, 3).map((day, index) => {
      let dayMoisture = currentMoisture;
      let status = 'Monitor';
      let icon = 'warning';

      // Simulate moisture decrease over days
      dayMoisture -= (index + 1) * 3;
      if (day.rain) dayMoisture += 8;

      if (dayMoisture < optimalMoisture.min) {
        status = 'Irrigate';
        icon = 'irrigate';
      } else if (dayMoisture >= optimalMoisture.min && dayMoisture <= optimalMoisture.max) {
        status = 'Optimal';
        icon = 'check';
      }

      return {
        day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : `Day ${index + 1}`,
        status,
        moisture: Math.max(10, Math.min(50, dayMoisture)),
        icon
      };
    }) || [];

    return {
      currentMoisture,
      optimalMoisture,
      lastIrrigation,
      nextIrrigation,
      soilType: 'Loamy',
      cropStage: 'Flowering',
      recommendations,
      schedule
    };
  };

  // Fetch weather data
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=Bhubaneswar&days=3&aqi=no&alerts=no`
        );
        setWeatherData(response.data);
        const irrigation = calculateIrrigationData(response.data);
        setIrrigationData(irrigation);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        // Fallback to default data
        setIrrigationData({
          currentMoisture: 32,
          optimalMoisture: { min: 25, max: 40 },
          lastIrrigation: '2 days ago',
          nextIrrigation: '2 days',
          soilType: 'Loamy',
          cropStage: 'Flowering',
          recommendations: [
            'No irrigation needed today - soil moisture is adequate',
            'Schedule irrigation in 2 days when moisture drops below 30%',
            'Apply 25mm water per irrigation cycle',
            'Best irrigation time: Early morning (6-8 AM)'
          ],
          schedule: [
            { day: 'Today', status: 'Not needed', moisture: 32, icon: 'check' },
            { day: 'Tomorrow', status: 'Monitor', moisture: 28, icon: 'warning' },
            { day: 'Day 3', status: 'Irrigate', moisture: 24, icon: 'irrigate' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const getMoistureStatus = (moisture) => {
    if (moisture >= irrigationData.optimalMoisture.min && moisture <= irrigationData.optimalMoisture.max) {
      return { status: 'Optimal', color: 'var(--primary-green)', icon: 'check' };
    } else if (moisture < irrigationData.optimalMoisture.min) {
      return { status: 'Low', color: 'var(--accent-red)', icon: 'warning' };
    } else {
      return { status: 'High', color: 'var(--accent-yellow)', icon: 'warning' };
    }
  };

  const getScheduleIcon = (iconType) => {
    switch (iconType) {
      case 'check':
        return <FaCheckCircle className="schedule-icon check" />;
      case 'warning':
        return <FaExclamationTriangle className="schedule-icon warning" />;
      case 'irrigate':
        return <FaTint className="schedule-icon irrigate" />;
      default:
        return <FaClock className="schedule-icon" />;
    }
  };

  if (loading) {
    return (
      <motion.div
        className="dashboard-card irrigation-card"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="card-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!irrigationData) {
    return (
      <motion.div
        className="dashboard-card irrigation-card"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="card-header">
          <div className="card-title">
            <FaTint className="card-icon" />
            <h1>{t('cards.smartIrrigation')}</h1>
          </div>
        </div>
        <div className="card-content">
          <div className="error-container">
            <div className="error-message">Unable to load irrigation data</div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="dashboard-card irrigation-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <div className="card-title">
          <FaTint className="card-icon" />
          <h1>{t('cards.smartIrrigation')}</h1>
        </div>
        <div className="irrigation-status">
          <span className="status-text">
            <strong>{irrigationData.currentMoisture >= irrigationData.optimalMoisture.min ? 'No Irrigation Needed' : 'Irrigation Required'}</strong>
          </span>
        </div>
      </div>

      <div className="card-content">
        {/* Current Status */}
        <div className="irrigation-status-main">
          <div className="moisture-indicator">
            <div className="moisture-circle">
              <div className="moisture-value">
                <span className="moisture-number">{irrigationData.currentMoisture}%</span>
                <span className="moisture-label">Soil Moisture</span>
              </div>
            </div>
            <div className="moisture-info">
              <div className="moisture-range">
                <span>Optimal: {irrigationData.optimalMoisture.min}-{irrigationData.optimalMoisture.max}%</span>
              </div>
              <div className="moisture-status-text" style={{ color: getMoistureStatus(irrigationData.currentMoisture).color }}>
                {getMoistureStatus(irrigationData.currentMoisture).status}
              </div>
            </div>
          </div>
        </div>

        {/* Irrigation Schedule */}
        <div className="irrigation-schedule">
          <h4>3-Day Irrigation Schedule</h4>
          <div className="schedule-grid">
            {irrigationData.schedule.map((day, index) => (
              <div key={index} className="schedule-day">
                <div className="schedule-header">
                  <span className="schedule-day-name">{day.day}</span>
                  {getScheduleIcon(day.icon)}
                </div>
                <div className="schedule-moisture">{day.moisture}%</div>
                <div className="schedule-status">{day.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Information */}
        <div className="irrigation-info">
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">{t('irrigation.lastIrrigation')}</div>
              <div className="info-value">{irrigationData.lastIrrigation}</div>
            </div>
            <div className="info-item">
              <div className="info-label">{t('irrigation.nextIrrigation')}</div>
              <div className="info-value">{irrigationData.nextIrrigation}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Soil Type</div>
              <div className="info-value">{irrigationData.soilType}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Crop Stage</div>
              <div className="info-value">{irrigationData.cropStage}</div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="irrigation-recommendations">
          <h4>{t('irrigation.recommendations')}</h4>
          <ul>
            {irrigationData.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default IrrigationCard;
