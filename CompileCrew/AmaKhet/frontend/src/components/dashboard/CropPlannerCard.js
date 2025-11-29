import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaSeedling, FaThermometerHalf, FaTint, FaLeaf, FaCalculator, FaFlask, FaChartLine, FaPlus, FaVolumeUp } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import './DashboardCard.css';

const CropPlannerCard = () => {
  const { t, language } = useLanguage();
  const stateDistricts = {
    Odisha: ['Khordha (Bhubaneswar)', 'Cuttack', 'Puri', 'Ganjam', 'Sambalpur'],
    Jharkhand: ['Ranchi', 'Dhanbad', 'Jamshedpur (East Singhbhum)', 'Hazaribagh', 'Bokaro'],
    'West Bengal': ['Kolkata', 'Howrah', 'North 24 Parganas', 'Darjeeling', 'Hooghly'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur Nagar', 'Varanasi', 'Agra', 'Prayagraj'],
    Punjab: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Mohali (SAS Nagar)'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada (Krishna)', 'Guntur', 'Tirupati', 'Kurnool'],
    Kerala: ['Thiruvananthapuram', 'Ernakulam (Kochi)', 'Kozhikode', 'Thrissur', 'Kollam']
  };

  // Yield Prediction State
  const [yieldData, setYieldData] = useState({
    state: '',
    district: '',
    season: '',
    crop: '',
    area: ''
  });

  // Fertilizer Recommendation State
  const [fertilizerData, setFertilizerData] = useState({
    nitrogen: '',
    phosphorous: '',
    potassium: '',
    temperature: '',
    humidity: '',
    moisture: '',
    soilType: '',
    cropType: ''
  });

  // Crop Recommendation State
  const [cropData, setCropData] = useState({
    nitrogen: '',
    phosphorous: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });

  const [activeCard, setActiveCard] = useState('yield');
  const [modalContent, setModalContent] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(null);
  const loadingTimeoutRef = useRef(null);
  const availableDistricts = yieldData.state ? stateDistricts[yieldData.state] || [] : [];

  const handleYieldChange = (e) => {
    const { name, value } = e.target;
    setYieldData((prev) => {
      if (name === 'state') {
        return { ...prev, state: value, district: '' };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleFertilizerChange = (e) => {
    setFertilizerData({
      ...fertilizerData,
      [e.target.name]: e.target.value
    });
  };

  const handleCropChange = (e) => {
    setCropData({
      ...cropData,
      [e.target.name]: e.target.value
    });
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on current language selection
      const languageMap = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'or': 'or-IN',
        'pa': 'pa-IN',
        'bn': 'bn-IN',
        'ta': 'ta-IN',
        'te': 'te-IN',
        'kn': 'kn-IN'
      };
      
      utterance.lang = languageMap[language] || 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const calculateYield = () => {
    // Simulate yield calculation
    const baseYield = 2.5; // tons per hectare
    const area = parseFloat(yieldData.area) || 0;
    const seasonMultiplier = yieldData.season === 'Kharif' ? 1.2 : 1.0;
    const cropMultiplier = yieldData.crop === 'Wheat' ? 1.1 : 1.0;
    
    return (baseYield * area * seasonMultiplier * cropMultiplier).toFixed(2);
  };

  const getFertilizerRecommendation = () => {
    // Simulate fertilizer recommendation
    const n = parseFloat(fertilizerData.nitrogen) || 0;
    const p = parseFloat(fertilizerData.phosphorous) || 0;
    const k = parseFloat(fertilizerData.potassium) || 0;
    
    if (n < 50 && p < 30 && k < 20) return 'NPK 20:20:20';
    if (n < 50) return 'Urea (46-0-0)';
    if (p < 30) return 'DAP (18-46-0)';
    if (k < 20) return 'MOP (0-0-60)';
    return 'Balanced NPK 15:15:15';
  };

  const getCropRecommendation = () => {
    // Simulate crop recommendation
    const ph = parseFloat(cropData.ph) || 7;
    const temp = parseFloat(cropData.temperature) || 25;
    const rainfall = parseFloat(cropData.rainfall) || 50;
    
    if (ph < 6.5 && temp > 20 && rainfall > 60) return 'Rice, Maize';
    if (ph > 6.5 && ph < 7.5 && temp > 15 && rainfall > 40) return 'Wheat, Chickpea';
    if (ph > 7.0 && temp > 25 && rainfall < 50) return 'Cotton, Groundnut';
    return 'Wheat, Rice, Maize';
  };

  const internalCards = [
    {
      id: 'yield',
      title: t('planner.yieldPrediction'),
      icon: <FaCalculator />,
      color: 'var(--primary-green)'
    },
    {
      id: 'fertilizer',
      title: t('planner.fertilizerRecommendation'),
      icon: <FaFlask />,
      color: 'var(--accent-blue)'
    },
    {
      id: 'crop',
      title: t('planner.cropRecommendation'),
      icon: <FaChartLine />,
      color: 'var(--accent-yellow)'
    },
    {
      id: 'future',
      title: t('planner.futureExpansion'),
      icon: <FaPlus />,
      color: 'var(--accent-purple)'
    }
  ];

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const openModal = (title, fields, result) => {
    setModalContent({ title, fields, result });
  };

  const handleSummaryOpen = (id, payloadBuilder) => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setSummaryLoading(id);
    loadingTimeoutRef.current = setTimeout(() => {
      setSummaryLoading(null);
      payloadBuilder();
    }, 4000);
  };

  const closeModal = () => setModalContent(null);

  const renderYieldCard = () => (
    <div className="internal-card-content">
      <div className="form-section">
        <h4>{t('planner.inputParameters')}</h4>
        <div className="form-grid">
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.state')}</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.state'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.state')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <select name="state" value={yieldData.state} onChange={handleYieldChange}>
              <option value="">{t('planner.selectState')}</option>
              {Object.keys(stateDistricts).map((state) => (
                <option value={state} key={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.district')}</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.district'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.district')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <select
              name="district"
              value={yieldData.district}
              onChange={handleYieldChange}
              disabled={!yieldData.state}
            >
              <option value="">
                {yieldData.state ? t('planner.selectDistrict') : 'Select a state first'}
              </option>
              {availableDistricts.map((district) => (
                <option value={district} key={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.season')}</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.season'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.season')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <select name="season" value={yieldData.season} onChange={handleYieldChange}>
              <option value="">{t('planner.selectSeason')}</option>
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
              <option value="Zaid">Zaid</option>
            </select>
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.crop')}</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.crop'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.crop')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <select name="crop" value={yieldData.crop} onChange={handleYieldChange}>
              <option value="">{t('planner.selectCrop')}</option>
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice</option>
              <option value="Maize">Maize</option>
              <option value="Cotton">Cotton</option>
            </select>
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.area')} ({t('planner.hectares')})</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.area'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.area')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <input
              type="number"
              name="area"
              value={yieldData.area}
              onChange={handleYieldChange}
              placeholder={t('planner.enterArea')}
            />
          </div>
        </div>
      </div>

      <div className="summary-action">
        <motion.button
          className="summary-button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() =>
            handleSummaryOpen('yield', () =>
              openModal(t('planner.yieldPrediction'), [
              { label: t('planner.state'), value: yieldData.state || '—' },
              { label: t('planner.district'), value: yieldData.district || '—' },
              { label: t('planner.season'), value: yieldData.season || '—' },
              { label: t('planner.crop'), value: yieldData.crop || '—' },
              { label: `${t('planner.area')} (${t('planner.hectares')})`, value: yieldData.area || '—' }
            ], {
              label: t('planner.productionPrediction'),
              value: `${calculateYield()} Tons`
              })
            )
          }
          disabled={summaryLoading === 'yield'}
          data-loading={summaryLoading === 'yield'}
        >
          {summaryLoading === 'yield' ? 'Predicting…' : 'View Summary'}
        </motion.button>
      </div>
    </div>
  );

  const renderFertilizerCard = () => (
    <div className="internal-card-content">
      <div className="form-section">
        <h4>{t('planner.soilEnvironmentalParameters')}</h4>
        <div className="form-grid">
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.nitrogen')} (N)</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.nitrogen'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.nitrogen')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <input
              type="number"
              name="nitrogen"
              value={fertilizerData.nitrogen}
              onChange={handleFertilizerChange}
              placeholder={t('planner.kgHa')}
            />
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.phosphorous')} (P)</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.phosphorous'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.phosphorous')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <input
              type="number"
              name="phosphorous"
              value={fertilizerData.phosphorous}
              onChange={handleFertilizerChange}
              placeholder={t('planner.kgHa')}
            />
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.potassium')} (K)</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.potassium'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.potassium')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <input
              type="number"
              name="potassium"
              value={fertilizerData.potassium}
              onChange={handleFertilizerChange}
              placeholder={t('planner.kgHa')}
            />
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.temperature')} (°C)</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.temperature'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.temperature')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <input
              type="number"
              name="temperature"
              value={fertilizerData.temperature}
              onChange={handleFertilizerChange}
              placeholder="°C"
            />
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.humidity')} (%)</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.humidity'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.humidity')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <input
              type="number"
              name="humidity"
              value={fertilizerData.humidity}
              onChange={handleFertilizerChange}
              placeholder="%"
            />
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.moisture')} (%)</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.moisture'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.moisture')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <input
              type="number"
              name="moisture"
              value={fertilizerData.moisture}
              onChange={handleFertilizerChange}
              placeholder="%"
            />
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.soilType')}</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.soilType'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.soilType')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <select name="soilType" value={fertilizerData.soilType} onChange={handleFertilizerChange}>
              <option value="">{t('planner.selectSoilType')}</option>
              <option value="Loamy">Loamy</option>
              <option value="Clay">Clay</option>
              <option value="Sandy">Sandy</option>
              <option value="Red">Red</option>
            </select>
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.cropType')}</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.cropType'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.cropType')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <select name="cropType" value={fertilizerData.cropType} onChange={handleFertilizerChange}>
              <option value="">{t('planner.selectCrop')}</option>
              <option value="Cereal">Cereal</option>
              <option value="Pulse">Pulse</option>
              <option value="Oilseed">Oilseed</option>
              <option value="Vegetable">Vegetable</option>
            </select>
          </div>
        </div>
      </div>

      <div className="summary-action">
        <motion.button
          className="summary-button accent"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() =>
            handleSummaryOpen('fertilizer', () =>
              openModal(t('planner.fertilizerRecommendation'), [
              { label: `${t('planner.nitrogen')} (N)`, value: fertilizerData.nitrogen || '—' },
              { label: `${t('planner.phosphorous')} (P)`, value: fertilizerData.phosphorous || '—' },
              { label: `${t('planner.potassium')} (K)`, value: fertilizerData.potassium || '—' },
              { label: `${t('planner.temperature')} (°C)`, value: fertilizerData.temperature || '—' },
              { label: `${t('planner.humidity')} (%)`, value: fertilizerData.humidity || '—' },
              { label: `${t('planner.moisture')} (%)`, value: fertilizerData.moisture || '—' },
              { label: t('planner.soilType'), value: fertilizerData.soilType || '—' },
              { label: t('planner.cropType'), value: fertilizerData.cropType || '—' }
            ], {
              label: t('planner.recommendedFertilizer'),
              value: getFertilizerRecommendation()
              })
            )
          }
          disabled={summaryLoading === 'fertilizer'}
          data-loading={summaryLoading === 'fertilizer'}
        >
          {summaryLoading === 'fertilizer' ? 'Predicting…' : 'View Summary'}
        </motion.button>
      </div>
    </div>
  );

  const renderCropCard = () => (
    <div className="internal-card-content">
      <div className="form-section">
        <h4>{t('planner.environmentalParameters')}</h4>
        <div className="form-grid">
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.nitrogen')} (N)</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.nitrogen'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.nitrogen')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <input
              type="number"
              name="nitrogen"
              value={cropData.nitrogen}
              onChange={handleCropChange}
              placeholder={t('planner.kgHa')}
            />
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.phosphorous')} (P)</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.phosphorous'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.phosphorous')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <input
              type="number"
              name="phosphorous"
              value={cropData.phosphorous}
              onChange={handleCropChange}
              placeholder={t('planner.kgHa')}
            />
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.potassium')} (K)</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.potassium'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.potassium')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <input
              type="number"
              name="potassium"
              value={cropData.potassium}
              onChange={handleCropChange}
              placeholder={t('planner.kgHa')}
            />
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.temperature')} (°C)</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.temperature'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.temperature')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <input
              type="number"
              name="temperature"
              value={cropData.temperature}
              onChange={handleCropChange}
              placeholder="°C"
            />
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.humidity')} (%)</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.humidity'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.humidity')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <input
              type="number"
              name="humidity"
              value={cropData.humidity}
              onChange={handleCropChange}
              placeholder="%"
            />
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.phLevel')}</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.phLevel'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.phLevel')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <input
              type="number"
              name="ph"
              value={cropData.ph}
              onChange={handleCropChange}
              placeholder="pH"
              step="0.1"
            />
          </div>
          <div className="form-group">
            <div className="label-with-tts">
              <label>{t('planner.rainfall')} (%)</label>
              <motion.button
                className="tts-button-label"
                onClick={() => speakText(t('planner.rainfall'))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${t('planner.rainfall')}`}
              >
                <FaVolumeUp />
              </motion.button>
            </div>
            <input
              type="number"
              name="rainfall"
              value={cropData.rainfall}
              onChange={handleCropChange}
              placeholder="%"
            />
          </div>
        </div>
      </div>

      <div className="summary-action">
        <motion.button
          className="summary-button warning"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() =>
            handleSummaryOpen('crop', () =>
              openModal(t('planner.cropRecommendation'), [
              { label: `${t('planner.nitrogen')} (N)`, value: cropData.nitrogen || '—' },
              { label: `${t('planner.phosphorous')} (P)`, value: cropData.phosphorous || '—' },
              { label: `${t('planner.potassium')} (K)`, value: cropData.potassium || '—' },
              { label: `${t('planner.temperature')} (°C)`, value: cropData.temperature || '—' },
              { label: `${t('planner.humidity')} (%)`, value: cropData.humidity || '—' },
              { label: t('planner.phLevel'), value: cropData.ph || '—' },
              { label: `${t('planner.rainfall')} (%)`, value: cropData.rainfall || '—' }
            ], {
              label: t('planner.recommendedCrops'),
              value: getCropRecommendation()
              })
            )
          }
          disabled={summaryLoading === 'crop'}
          data-loading={summaryLoading === 'crop'}
        >
          {summaryLoading === 'crop' ? 'Predicting…' : 'View Summary'}
        </motion.button>
      </div>
    </div>
  );

  const renderFutureCard = () => (
    <div className="internal-card-content">
      <div className="future-placeholder">
        <FaPlus className="placeholder-icon" />
        <h4>Future Expansion</h4>
        <p>Additional crop planning features will be added here</p>
        <div className="placeholder-features">
          <div className="feature-item">• Pest Management</div>
          <div className="feature-item">• Irrigation Planning</div>
          <div className="feature-item">• Market Analysis</div>
          <div className="feature-item">• Cost Optimization</div>
        </div>
        <div className="summary-action">
          <motion.button
            className="summary-button neutral"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              handleSummaryOpen('future', () =>
                openModal('Future Expansion Roadmap', [
                { label: 'Pest Management', value: 'Integrated pest alerts & control recommendations' },
                { label: 'Irrigation Planning', value: 'Dynamic irrigation schedules with water budgeting' },
                { label: 'Market Analysis', value: 'Real-time mandi trends & price forecasting' },
                { label: 'Cost Optimization', value: 'Input cost tracking & ROI suggestions' }
                ])
              )
            }
            disabled={summaryLoading === 'future'}
            data-loading={summaryLoading === 'future'}
          >
            {summaryLoading === 'future' ? 'Loading…' : 'View Summary'}
          </motion.button>
        </div>
      </div>
    </div>
  );

  const renderActiveCard = () => {
    switch (activeCard) {
      case 'yield':
        return renderYieldCard();
      case 'fertilizer':
        return renderFertilizerCard();
      case 'crop':
        return renderCropCard();
      case 'future':
        return renderFutureCard();
      default:
        return renderYieldCard();
    }
  };

  return (
    
    <motion.div
      className="dashboard-card crop-planner-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <div className="card-title">
          <FaCalendarAlt className="card-icon" />
          <h1>{t('cards.cropPlanner')}</h1>
        </div>
      </div>

      <div className="card-content">

        
        {/* Internal Cards Navigation */}
        <div className="internal-cards-nav">
          {internalCards.map((card) => (
            <motion.button
              key={card.id}
              className={`internal-card-nav ${activeCard === card.id ? 'active' : ''}`}
              onClick={() => setActiveCard(card.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ '--card-color': card.color }}
            >
              <div className="nav-icon">{card.icon}</div>
              <span className="nav-title">{card.title}</span>
              <motion.button
                className="integrated-tts-button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(card.title);
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                title={`Speak: ${card.title}`}
              >
                🔊
              </motion.button>
            </motion.button>
          ))}
        </div>

        {/* Active Card Content */}
        <div className="internal-card-container">
          {renderActiveCard()}
        </div>
      </div>
      {modalContent && (
        <div className="planner-modal-overlay" onClick={closeModal}>
          <motion.div
            className="planner-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="modal-header">
              <h3>{modalContent.title}</h3>
              <button className="modal-close" onClick={closeModal} aria-label="Close summary">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-fields">
                {modalContent.fields?.map((field) => (
                  <div className="modal-field" key={field.label}>
                    <span className="field-label">{field.label}</span>
                    <span className="field-value">{field.value || '—'}</span>
                  </div>
                ))}
              </div>
              {modalContent.result && (
                <div className="modal-result">
                  <p className="result-label">{modalContent.result.label}</p>
                  <p className="result-value">{modalContent.result.value}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CropPlannerCard;
