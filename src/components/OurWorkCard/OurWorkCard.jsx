import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users2, Clock, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CaseStudyCard = ({ work }) => {
  if (!work) return null;

  return (
    <motion.div
      className="group border rounded-xl overflow-hidden hover:shadow-xl transition-shadow bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <motion.img
          src={work.imageUrl}
          alt={work.title}
          className="w-full h-full object-cover p-5"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-orange-50 text-orange-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3">{work.title}</h2>
        <p className="text-gray-600 mb-6">{work.summary}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">{work.industry}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users2 className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">{work.clientSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">{work.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">{work.impact}</span>
          </div>
        </div>

        <Link to={`/ourwork/${work.slug}`}>
          <motion.div
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            whileHover={{ x: 5 }}
          >
            Read the full project
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default CaseStudyCard;