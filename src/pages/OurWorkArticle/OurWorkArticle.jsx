import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Share2, Download, ArrowLeft, User2, ExternalLink, Calendar, Code, Target, Globe, Github } from 'lucide-react';
import { ourwork } from '../../data/ourwork';

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

const OurWorkArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [work, setWork] = useState(null);
  const [showShareError, setShowShareError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const foundWork = ourwork[slug];
      setWork(foundWork);
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
          Loading Project...
        </motion.div>
      </div>
    );
  }

  if (!work) {
    navigate('/ourwork');
    return null;
  }

  // Provide default values for potentially undefined properties
  const tags = work.tags || [];
  const technologies = work.technologies || [];
  const keyFeatures = work.keyFeatures || [];
  const results = work.fullContent?.results || [];
  const testimonial = work.fullContent?.testimonial || null;

  const shareWork = async () => {
    if (!navigator.share) {
      setShowShareError(true);
      setTimeout(() => setShowShareError(false), 3000);
      return;
    }

    try {
      await navigator.share({
        title: work.title,
        text: work.summary,
        url: window.location.href,
      });
    } catch (error) {
      setShowShareError(true);
      setTimeout(() => setShowShareError(false), 3000);
    }
  };

  const handleDownload = () => {
    const content = `
      ${work.title}
      ${work.summary}
      Challenge: ${work.fullContent.challenge}
      Solution: ${work.fullContent.solution}
      Results: ${results.join('\n')}
      Testimonial: "${testimonial?.quote || 'N/A'}"
      - ${testimonial?.author || 'N/A'}, ${testimonial?.position || 'N/A'}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${work.slug}-project-details.txt`;
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
          <Link to="/ourwork">
            <motion.div
              whileHover={{ x: -5 }}
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Projects</span>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div {...fadeInUp} className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <motion.div
              className="aspect-video relative bg-gray-50 p-8"
              {...scaleIn}
            >
              <img
                src={work.imageUrl}
                alt={work.title}
                className="w-full h-full object-contain rounded-lg"
              />
            </motion.div>

            <div className="p-8">
              <motion.div
                className="flex flex-wrap gap-2 mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 text-sm font-medium bg-orange-100 text-orange-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              <motion.h1
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-6"
                {...scaleIn}
              >
                {work.title}
              </motion.h1>

              <motion.p
                className="text-lg text-gray-600 mb-8"
                {...fadeInUp}
              >
                {work.summary}
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                {...fadeInUp}
              >
                <a
                  href={work.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  View Live Project
                </a>
                {work.githubUrl && (
                  <a
                    href={work.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    View Source
                  </a>
                )}
                <button
                  onClick={shareWork}
                  className="p-3 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 transition-colors"
                  title="Share project"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-3 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 transition-colors"
                  title="Download project details"
                >
                  <Download className="w-5 h-5" />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          {...fadeInUp}
        >
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Calendar className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Project Timeline</h3>
            <p className="text-gray-600">{work.timeline}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Code className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <span key={index} className="text-sm text-gray-600">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Target className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Key Features</h3>
            <ul className="text-gray-600 list-disc list-inside">
              {keyFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-12 mb-16"
          {...fadeInUp}
        >
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">The Challenge</h2>
            <p className="text-gray-600 leading-relaxed">{work.fullContent.challenge}</p>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Our Solution</h2>
            <p className="text-gray-600 leading-relaxed">{work.fullContent.solution}</p>
          </div>
        </motion.div>

        <motion.div
          className="mb-16"
          {...fadeInUp}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Project Outcomes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => (
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

        {testimonial && (
          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            {...scaleIn}
          >
            <div className="bg-orange-600 p-8">
              <h2 className="text-2xl font-bold text-white mb-4">What Our Client Says</h2>
              <p className="text-white italic mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <User2 className="w-8 h-8 text-orange-300" />
                <div>
                  <h4 className="text-lg text-white font-semibold">{testimonial.author}</h4>
                  <p className="text-orange-200 text-sm">{testimonial.position}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {showShareError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-4 right-4 bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          Sharing not supported on this device.
        </motion.div>
      )}
    </div>
  );
};

export default OurWorkArticle;
