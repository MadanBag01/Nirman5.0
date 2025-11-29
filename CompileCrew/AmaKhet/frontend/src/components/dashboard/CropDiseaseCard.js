import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaLeaf, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import './DashboardCard.css';

const CropDiseaseCard = () => {
  const { t } = useLanguage();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        analyzeImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (file) => {
    setIsAnalyzing(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Make API call to backend
      const response = await axios.post('http://localhost:8000/plant_disease_detection', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const data = response.data;
      
      // Process the response
      const result = {
        disease: data.disease_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        status: data.is_healthy ? 'healthy' : 'disease',
        confidence: data.confidence,
        description: data.is_healthy 
          ? `Your crop appears to be healthy with ${(data.confidence * 100).toFixed(1)}% confidence.`
          : `Your crop shows signs of ${data.disease_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} disease with ${(data.confidence * 100).toFixed(1)}% confidence.`,
        details: [
          `Cause: ${data.disease_info.cause}`,
          `Treatment: ${data.disease_info.cure}`,
          `Confidence Level: ${(data.confidence * 100).toFixed(1)}%`
        ],
        fertilizer: {
          name: data.fertilizer_recommendation.name,
          procedure: data.fertilizer_recommendation.procedure
        }
      };
      
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      
      // Check if it's a server unavailable error
      if (error.response?.status === 503) {
        const result = {
          disease: 'ML Model Not Available',
          status: 'error',
          description: 'The AI disease detection model is currently not available. Please contact support or try again later.',
          details: [
            'The machine learning model for disease detection is not loaded.',
            'This could be due to missing dependencies or server configuration issues.',
            'Please contact our support team at kishanHelp@gmail.com for assistance.',
            'You can also try uploading your image to our support team for manual analysis.'
          ],
          fertilizer: {
            name: 'General Plant Care',
            procedure: 'For now, maintain regular watering and apply balanced NPK fertilizer (20-20-20) at 2g per liter of water, applied every 2 weeks. Contact our support team for specific disease diagnosis.'
          }
        };
        setAnalysisResult(result);
      } else {
        // Other error fallback
        const result = {
          disease: 'Analysis Failed',
          status: 'error',
          description: 'Unable to analyze the image. Please try again or contact support.',
          details: [
            'The image could not be processed by our AI model.',
            'Please ensure the image is clear and shows plant leaves or affected areas.',
            'Try uploading a different image or contact our support team.'
          ],
          fertilizer: {
            name: 'General Plant Care',
            procedure: 'Maintain regular watering and apply balanced fertilizer as per standard crop care practices.'
          }
        };
        setAnalysisResult(result);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <FaCheckCircle className="status-icon status-healthy" />;
      case 'disease':
        return <FaExclamationTriangle className="status-icon status-disease" />;
      case 'error':
        return <FaExclamationTriangle className="status-icon status-error" />;
      default:
        return <FaLeaf className="status-icon status-unknown" />;
    }
  };

  return (
    <motion.div
      className="dashboard-card crop-disease-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <div className="card-title">
          <FaLeaf className="card-icon" />
          <h3>Crop Disease Detection</h3>
        </div>
      </div>

      <div className="card-content">
        <div className="disease-detection-content">
          <p className="detection-description">
            Identify the crop disease by uploading the crop images
          </p>

          {!uploadedImage && !isAnalyzing && (
            <div className="upload-section">
              <label htmlFor="image-upload" className="upload-button">
                <FaUpload className="upload-icon" />
                Upload Crop Image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {isAnalyzing && (
            <div className="analyzing-section">
              <FaSpinner className="loading-spinner" />
              <p>Analyzing crop image...</p>
            </div>
          )}

          {uploadedImage && !isAnalyzing && analysisResult && (
            <div className="analysis-results">
              <div className="uploaded-image-preview">
                <img src={uploadedImage} alt="Uploaded crop" className="crop-image" />
              </div>

              <div className="disease-analysis">
                <div className="disease-header">
                  {getStatusIcon(analysisResult.status)}
                  <div className="disease-title-container">
                    <h4 className="disease-title">{analysisResult.disease}</h4>
                    {analysisResult.confidence && (
                      <span className="confidence-badge">
                        {(analysisResult.confidence * 100).toFixed(1)}% confidence
                      </span>
                    )}
                  </div>
                </div>

                <p className="disease-description">{analysisResult.description}</p>

                <div className="disease-details">
                  <h5>Disease Information:</h5>
                  <ul>
                    {analysisResult.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>

                <div className="fertilizer-recommendation">
                  <h5>Fertilizer Recommendation</h5>
                  <div className="fertilizer-info">
                    <p><strong>Fertilizer Name:</strong> {analysisResult.fertilizer.name}</p>
                    <p><strong>Procedure to use it:</strong> {analysisResult.fertilizer.procedure}</p>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button onClick={resetAnalysis} className="new-analysis-button">
                  Upload New Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CropDiseaseCard;
