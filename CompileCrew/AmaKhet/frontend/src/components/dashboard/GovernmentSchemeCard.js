import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRupeeSign, FaFileContract, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import './GovernmentSchemeCard.css';

const GovernmentSchemeCard = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);
  const subsidies = [
    {
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      description: "Direct income support of ₹6,000/year to small and marginal farmers in 3 instalments.",
      link: "https://www.agriwelfare.gov.in/en/Major?utm_source=chatgpt.com"
    },
    {
      name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      description: "Crop insurance against natural calamities, pests, diseases etc.",
      link: "https://kshema.co/blogs/government-schemes-and-subsidies-for-farmers-in-india/?utm_source=chatgpt.com"
    },
    {
      name: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
      description: "Irrigation scheme (Per Drop More Crop) to improve water use efficiency.",
      link: "https://www.myscheme.gov.in/search/category/Agriculture%2CRural%20%26%20Environment?utm_source=chatgpt.com"
    },
    {
      name: "Soil Health Card Scheme",
      description: "Provides farmers soil health reports for better fertilizer use.",
      link: "https://kshema.co/blogs/government-schemes-and-subsidies-for-farmers-in-india/?utm_source=chatgpt.com"
    },
    {
      name: "Paramparagat Krishi Vikas Yojana (PKVY)",
      description: "Promotes organic farming through cluster-based approach.",
      link: "https://kshema.co/blogs/government-schemes-and-subsidies-for-farmers-in-india/?utm_source=chatgpt.com"
    },
    {
      name: "National Mission on Natural Farming (NMNF)",
      description: "Encourages adoption of natural farming methods.",
      link: "https://testbook.com/ias-preparation/agriculture-schemes-in-india?utm_source=chatgpt.com"
    },
    {
      name: "Pradhan Mantri Annadata Aay SanraksHan Abhiyan (PM-AASHA)",
      description: "Ensures remunerative prices and procurement support for farmers.",
      link: "https://testbook.com/ias-preparation/agriculture-schemes-in-india?utm_source=chatgpt.com"
    },
    {
      name: "E-NAM (Electronic National Agriculture Market)",
      description: "Creates unified national market for agricultural produce.",
      link: "https://testbook.com/ias-preparation/agriculture-schemes-in-india?utm_source=chatgpt.com"
    },
    {
      name: "Agriculture Infrastructure Fund (AIF)",
      description: "Supports post-harvest infrastructure, storage, processing etc.",
      link: "https://www.agriwelfare.gov.in/en/Major?utm_source=chatgpt.com"
    },
    {
      name: "Formation & Promotion of 10,000 Farmer Producer Organisations (FPOs)",
      description: "Supports FPO formation, handholding, and market access.",
      link: "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2002012&utm_source=chatgpt.com"
    },
    {
      name: "Rashtriya Krishi Vikas Yojana (RKVY)",
      description: "Improves agriculture through grants for infrastructure and modernization.",
      link: "https://mahindrafarmmachinery.com/IN/blog/government-schemes-farmers-india-how-benefit-2025?utm_source=chatgpt.com"
    },
    {
      name: "Mission Organic Value Chain Development for North Eastern Region (MOVCD-NER)",
      description: "Supports organic farming and value chain development in NE India.",
      link: "https://en.wikipedia.org/wiki/Mission_Organic_Value_Chain_Development_for_North_Eastern_Region?utm_source=chatgpt.com"
    },
    {
      name: "Gramin Bhandaran Yojana (Rural Godown Scheme)",
      description: "Provides subsidies for building/renovating rural godowns.",
      link: "https://en.wikipedia.org/wiki/Gramin_Bhandaran_Yojana?utm_source=chatgpt.com"
    }
  ];

  const schemes = [
    {
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      description: "Direct income support of ₹6,000 per year for small & marginal farmers.",
      link: "https://testbook.com/ias-preparation/agriculture-schemes-in-india"
    },
    {
      name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      description: "Crop insurance against natural calamities, pests, diseases.",
      link: "https://testbook.com/ias-preparation/agriculture-schemes-in-india"
    },
    {
      name: "Kisan Credit Card (KCC) Scheme",
      description: "Provides farmers credit for agriculture needs at low interest rates.",
      link: "https://jaankaarbharat.com/blog/government-schemes-for-farmers-in-india-empowering-agriculture-and-rural-development-cm6hgmz4x006h111u2lve0205"
    },
    {
      name: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
      description: "Improves irrigation efficiency with 'per drop more crop' initiative.",
      link: "https://jaankaarbharat.com/blog/top-10-agriculture-and-irrigation-schemes-in-india-cmc0456570000uhwsud1d2fd4"
    },
    {
      name: "Soil Health Card Scheme",
      description: "Provides farmers soil health status and fertilizer recommendations.",
      link: "https://farmonaut.com/asia/agricultural-schemes-in-india-tamil-nadu-2025-guide"
    },
    {
      name: "Paramparagat Krishi Vikas Yojana (PKVY)",
      description: "Promotes organic farming via cluster approach with input support.",
      link: "https://kshema.co/blogs/government-schemes-and-subsidies-for-farmers-in-india/"
    },
    {
      name: "Agricultural Infrastructure Fund (AIF)",
      description: "Funds post-harvest infra like storage, processing, and cold chains.",
      link: "https://jaankaarbharat.com/blog/government-schemes-for-farmers-in-india-empowering-agriculture-and-rural-development-cm6hgmz4x006h111u2lve0205"
    },
    {
      name: "National Agriculture Market (eNAM)",
      description: "Unified electronic trading platform for agricultural produce.",
      link: "https://kshema.co/blogs/government-schemes-and-subsidies-for-farmers-in-india/"
    },
    {
      name: "Rashtriya Krishi Vikas Yojana (RKVY)",
      description: "Boosts agriculture via grants, infrastructure, and technology adoption.",
      link: "https://www.moneycontrol.com/news/india/top-10-government-schemes-for-farmers-in-2025-13138263.html"
    },
    {
      name: "PM Kisan Maandhan Yojana (PM-KMY)",
      description: "Pension scheme for small & marginal farmers after 60 years of age.",
      link: "https://jaankaarbharat.com/blog/government-schemes-for-farmers-in-india-empowering-agriculture-and-rural-development-cm6hgmz4x006h111u2lve0205"
    },
    {
      name: "PM-KUSUM (Kisan Urja Suraksha Evam Utthan Mahabhiyan)",
      description: "Provides solar pumps and renewable energy support to farmers.",
      link: "https://en.wikipedia.org/wiki/Pradhan_Mantri_Kisan_Urja_Suraksha_Evam_Utthan_Mahabhiyan_Yojana"
    },
    {
      name: "National Mission for Sustainable Agriculture (NMSA)",
      description: "Encourages sustainable farming practices and climate resilience.",
      link: "https://jaankaarbharat.com/blog/top-10-agriculture-and-irrigation-schemes-in-india-cmc0456570000uhwsud1d2fd4"
    },
    {
      name: "National Food Security Mission (NFSM)",
      description: "Increases foodgrain production with improved seeds & technology.",
      link: "https://jaankaarbharat.com/blog/top-10-agriculture-and-irrigation-schemes-in-india-cmc0456570000uhwsud1d2fd4"
    }
  ];

  const insurance = [
    {
      name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      description: "Crop insurance for losses due to natural calamities, pests, disease etc.",
      link: "https://www.india.gov.in/spotlight/pradhan-mantri-fasal-bima-yojana/"
    },
    {
      name: "National Agricultural Insurance Scheme (NAIS)",
      description: "Crop failure coverage for loanee & non-loanee farmers.",
      link: "https://www.india.gov.in/national-agricultural-insurance-scheme-nais"
    },
    {
      name: "Modified National Agricultural Insurance Scheme (MNAIS)",
      description: "Improved crop insurance with additional flexibility & features over NAIS.",
      link: "https://www.gktoday.in/modified-national-agriculture-insurance-scheme/"
    },
    {
      name: "Aam Aadmi Bima Yojana (AABY)",
      description: "Group insurance for landless agricultural labourers / rural unorganised sector, covers life & accident insurance.",
      link: "https://nashik.gov.in/en/scheme/aam-aadmi-bima-yojana/"
    },
    {
      name: "Livestock Insurance under National Livestock Mission",
      description: "Protection to livestock owners against death of animals; subsidised premium.",
      link: "https://olrds.odisha.gov.in/en/livestock-insurance/"
    },
    {
      name: "Bihar Dudharu Pashu Bima Yojana",
      description: "Insurance for dairy cattle, covering diseases, with majority premium borne by the state.",
      link: "https://www.govtschemes.in/bihar-dudharu-pashu-bima-yojana"
    },
    {
      name: "Biju Krushak Kalyan Yojana (BKKY), Odisha",
      description: "Health & accident insurance for farmers.",
      link: "https://en.wikipedia.org/wiki/Biju_Krushak_Kalyan_Yojana"
    },
    {
      name: "Kisan Credit Card (KCC) – Insurance Component",
      description: "Provides accident insurance to KCC holders (death / disability cover).",
      link: "https://en.wikipedia.org/wiki/Kisan_Credit_Card"
    },
    {
      name: "Rajasthan Pashudhan Insurance Scheme",
      description: "Free insurance & vaccination for livestock in Rajasthan.",
      link: "https://www.govtschemes.in/rajasthan-pashudhan-insurance-scheme"
    },
    {
      name: "Tripura Livestock Insurance (Complete Animal Wealth Shield)",
      description: "Insurance cover for livestock against sudden death; premium shared by farmer, state & centre.",
      link: "https://timesofindia.indiatimes.com/city/guwahati/tripura-rolls-out-insurance-scheme-for-livestock-to-support-farmers/articleshow/122926082.cms"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const pointVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  if (isLoading) {
    return (
      <div className="government-scheme-card loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="government-scheme-card"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="scheme-header">
        <h2 className="scheme-title">{t('govScheme.title')}</h2>
        <p className="scheme-subtitle">{t('govScheme.subtitle')}</p>
      </div>

      <div className="scheme-sections">
        {/* Subsidies Section */}
        <motion.div className="scheme-section" variants={sectionVariants}>
          <div className="section-header">
            <FaRupeeSign className="section-icon subsidies-icon" />
            <h3 className="section-title">{t('govScheme.subsidies')}</h3>
          </div>
          <div className="section-content">
            {subsidies.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="scheme-point clickable-point"
                variants={pointVariants}
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaArrowRight className="point-arrow" />
                <div className="point-content">
                  <div className="point-title">{item.name}</div>
                  <div className="point-description">{item.description}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Schemes Section */}
        <motion.div className="scheme-section" variants={sectionVariants}>
          <div className="section-header">
            <FaFileContract className="section-icon schemes-icon" />
            <h3 className="section-title">{t('govScheme.schemes')}</h3>
          </div>
          <div className="section-content">
            {schemes.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="scheme-point clickable-point"
                variants={pointVariants}
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaArrowRight className="point-arrow" />
                <div className="point-content">
                  <div className="point-title">{item.name}</div>
                  <div className="point-description">{item.description}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Insurance Section */}
        <motion.div className="scheme-section" variants={sectionVariants}>
          <div className="section-header">
            <FaShieldAlt className="section-icon insurance-icon" />
            <h3 className="section-title">{t('govScheme.insurance')}</h3>
          </div>
          <div className="section-content">
            {insurance.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="scheme-point clickable-point"
                variants={pointVariants}
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaArrowRight className="point-arrow" />
                <div className="point-content">
                  <div className="point-title">{item.name}</div>
                  <div className="point-description">{item.description}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="scheme-footer">
        <p className="footer-note">
          {t('govScheme.footerNote')}
        </p>
      </div>
    </motion.div>
  );
};

export default GovernmentSchemeCard;
