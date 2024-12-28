import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { caseStudies } from '../../data/caseStudies';
import CaseStudyCard from '../../components/CaseStudyCard/CaseStudyCard';

const CaseStudyPage = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  
  const industries = useMemo(() => {
    const uniqueIndustries = [...new Set(Object.values(caseStudies).map(study => study.industry))];
    return ['All Industries', ...uniqueIndustries];
  }, []);

  const filteredStudies = useMemo(() => {
    const studies = Object.values(caseStudies);
    return selectedIndustry === 'All Industries'
      ? studies
      : studies.filter(study => study.industry === selectedIndustry);
  }, [selectedIndustry]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-50 min-h-screen"
    >
      <motion.div
        className="bg-gradient-to-b from-orange-50 to-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Customer Success Stories
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Discover how we help enterprises transform their operations with innovative solutions.
          </motion.p>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="flex flex-wrap gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {industries.map((industry, index) => (
            <motion.button
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedIndustry === industry
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-orange-50'
              }`}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {industry}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CaseStudyCard study={study} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center bg-white rounded-2xl p-12 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join successful enterprises that have achieved their digital transformation goals.
          </p>
          <motion.button
            className="px-8 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Schedule a Consultation
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CaseStudyPage;