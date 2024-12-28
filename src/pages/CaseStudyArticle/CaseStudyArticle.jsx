import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Share2, Download, ArrowLeft, User2 } from 'lucide-react';
import { caseStudies } from '../../data/caseStudies';

const CaseStudyArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [study, setStudy] = useState(null);
  const [showShareError, setShowShareError] = useState(false);

  useEffect(() => {
    // Simulate loading state
    setIsLoading(true);
    setTimeout(() => {
      const foundStudy = caseStudies[slug];
      setStudy(foundStudy);
      setIsLoading(false);
    }, 500);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!study) {
    navigate('/case-studies');
    return null;
  }

  const shareStudy = async () => {
    if (!navigator.share) {
      setShowShareError(true);
      setTimeout(() => setShowShareError(false), 3000);
      return;
    }

    try {
      await navigator.share({
        title: study.title,
        text: study.summary,
        url: window.location.href,
      });
    } catch (error) {
      console.log('Sharing failed:', error);
      setShowShareError(true);
      setTimeout(() => setShowShareError(false), 3000);
    }
  };

  const handleDownload = () => {
    // Create a PDF or formatted version of the case study
    const content = `
      ${study.title}
      
      Summary: ${study.summary}
      
      Challenge: ${study.fullContent.challenge}
      
      Solution: ${study.fullContent.solution}
      
      Results:
      ${study.fullContent.results.join('\n')}
      
      Testimonial:
      "${study.fullContent.testimonial.quote}"
      - ${study.fullContent.testimonial.author}, ${study.fullContent.testimonial.position}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${study.slug}-case-study.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/case-studies">
          <motion.div
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-8"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Case Studies
          </motion.div>
        </Link>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="aspect-video relative">
            <img
              src={study.imageUrl}
              alt={study.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                {study.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-orange-50 text-orange-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={shareStudy}
                  className="p-2 rounded-full bg-gray-100 hover:bg-orange-50"
                  title="Share case study"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={handleDownload}
                  className="p-2 rounded-full bg-gray-100 hover:bg-orange-50"
                  title="Download case study"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">{study.title}</h1>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Challenge</h2>
                <p className="text-gray-600">{study.fullContent.challenge}</p>
              </div>
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Solution</h2>
                <p className="text-gray-600">{study.fullContent.solution}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>
              <ul className="space-y-3">
                {study.fullContent.results.map((result, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-orange-600" />
                    <span className="text-gray-600">{result}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-50 p-6 rounded-xl"
            >
              <blockquote className="text-lg text-gray-800 italic mb-4">
                "{study.fullContent.testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <User2 className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {study.fullContent.testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600">
                    {study.fullContent.testimonial.position}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showShareError && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg shadow-lg"
          >
            Unable to share. Try copying the URL instead.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CaseStudyArticle;