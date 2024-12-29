import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Share2, Download, ArrowLeft, User2, ExternalLink, Clock, Building, Target } from 'lucide-react';
import { caseStudies } from '../../data/caseStudies';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const scaleIn = {
  initial: { scale: 0.95, opacity: 0 },
  whileInView: { scale: 1, opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const CaseStudyArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [study, setStudy] = useState(null);
  const [showShareError, setShowShareError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const foundStudy = caseStudies[slug];
      setStudy(foundStudy);
      setIsLoading(false);
    }, 500);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-orange-600 text-xl font-semibold"
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
    const content = `
      ${study.title}
      ${study.summary}
      Challenge: ${study.fullContent.challenge}
      Solution: ${study.fullContent.solution}
      Results: ${study.fullContent.results.join('\n')}
      Testimonial: "${study.fullContent.testimonial.quote}"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-8"
        >
          <Link to="/case-studies">
            <motion.div
              whileHover={{ x: -5 }}
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Case Studies</span>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div {...fadeInUp} className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-900"
              {...scaleIn}
            >
              {study.title}
            </motion.h1>
            <motion.div 
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 text-sm font-medium bg-orange-100 text-orange-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
            <motion.p 
              className="text-lg text-gray-600"
              {...fadeInUp}
            >
              {study.summary}
            </motion.p>
            <motion.div 
              className="flex gap-4"
              {...fadeInUp}
            >
              <a 
                href={study.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                View Live Project
              </a>
              <button
                onClick={shareStudy}
                className="p-3 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600"
                title="Share case study"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-3 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600"
                title="Download case study"
              >
                <Download className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
          <motion.div 
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            {...scaleIn}
          >
            <img
              src={study.imageUrl}
              alt={study.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          {...fadeInUp}
        >
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Clock className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Duration</h3>
            <p className="text-gray-600">{study.duration}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Building className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Industry</h3>
            <p className="text-gray-600">{study.industry}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Target className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Project Goal</h3>
            <p className="text-gray-600">{study.goal}</p>
          </div>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-12 mb-16"
          {...fadeInUp}
        >
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">The Challenge</h2>
            <p className="text-gray-600 leading-relaxed">{study.fullContent.challenge}</p>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Our Solution</h2>
            <p className="text-gray-600 leading-relaxed">{study.fullContent.solution}</p>
          </div>
        </motion.div>

        <motion.div 
          className="mb-16"
          {...fadeInUp}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Key Results</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {study.fullContent.results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <div className="w-6 h-6 rounded-full bg-orange-600" />
                </div>
                <p className="text-gray-600">{result}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          {...scaleIn}
        >
          <div className="bg-orange-600 p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Client Testimonial</h2>
            <p className="text-orange-100">Here's what our client had to say about the project</p>
          </div>
          <div className="p-8">
            <blockquote className="text-xl text-gray-800 italic mb-6">
              "{study.fullContent.testimonial.quote}"
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                <User2 className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold text-lg text-gray-900">
                  {study.fullContent.testimonial.author}
                </div>
                <div className="text-gray-600">
                  {study.fullContent.testimonial.position}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CaseStudyArticle;