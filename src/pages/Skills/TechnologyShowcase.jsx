import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TechnologyShowcase = () => {
  const technologies = [
    {
      name: "HTML5",
      description: "The backbone of web structure.",
      logo: "https://cdn-icons-png.flaticon.com/512/732/732212.png", // Replace with local path or CDN URL
    },
    {
      name: "CSS3",
      description: "Style and layout customization.",
      logo: "https://cdn-icons-png.flaticon.com/512/732/732190.png",
    },
    {
      name: "JavaScript",
      description: "Interactive and dynamic web experiences.",
      logo: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
    },
    {
      name: "React",
      description: "Modern library for UI development.",
      logo: "https://cdn-icons-png.flaticon.com/512/1126/1126012.png",
    },
    {
      name: "Node.js",
      description: "Backend runtime for JavaScript.",
      logo: "https://cdn-icons-png.flaticon.com/512/5968/5968322.png",
    },
    {
      name: "Tailwind CSS",
      description: "Utility-first CSS framework.",
      logo: "https://cdn-icons-png.flaticon.com/512/732/732084.png",
    },
    {
      name: "MongoDB",
      description: "NoSQL database for scalable apps.",
      logo: "https://cdn-icons-png.flaticon.com/512/5968/5968364.png",
    },
    {
      name: "Express",
      description: "Minimalist backend framework.",
      logo: "https://cdn-icons-png.flaticon.com/512/919/919825.png",
    },
    {
      name: "Vite",
      description: "Faster build tool for modern projects.",
      logo: "https://vitejs.dev/logo.svg", // Use Vite logo
    },
    {
      name: "AWS",
      description: "Cloud infrastructure for scalable deployments",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/768px-Amazon_Web_Services_Logo.svg.png?20170912170050"
    },
    {
      name: "Python",
      description: "Versatile programming for web and data applications",
      logo: "https://cdn-icons-png.flaticon.com/128/5968/5968350.png"
    },

  ];

  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mt-16 mb-6">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Technologies We Use
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          We leverage cutting-edge technologies to build robust and scalable solutions
        </p>

        {/* Navigation Buttons */}
        <div className="hidden md:block">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg hover:bg-orange-50 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg hover:bg-orange-50 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Technology Cards Container */}
        <div
          ref={scrollContainerRef}
          className="relative overflow-x-auto hide-scrollbar"
        >
          <motion.div
            className="flex gap-6 py-6 px-4 md:px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-[280px] bg-white rounded-xl p-6 shadow-lg transition-all hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-orange-100 rounded-lg transform -rotate-6 group-hover:rotate-6 transition-transform duration-300" />
                  <div className="relative bg-white rounded-lg p-4 transform transition-transform duration-300 group-hover:translate-y-1">
                    <img
                      src={tech.logo}
                      alt={`${tech.name} logo`}
                      className="w-16 h-16 mx-auto mb-4 object-contain"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{tech.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{tech.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-6 gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-200" />
          <div className="w-2 h-2 rounded-full bg-orange-400" />
          <div className="w-2 h-2 rounded-full bg-orange-200" />
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TechnologyShowcase;