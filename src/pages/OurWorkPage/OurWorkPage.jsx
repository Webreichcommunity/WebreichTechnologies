import React from 'react';
import { motion } from 'framer-motion';

const OurWorkPage = () => {
  const works = [
    {
      id: 1,
      title: "E-Commerce Website",
      description: "A robust e-commerce platform with seamless user experience and payment integration.",
      imageUrl: "https://via.placeholder.com/600x400",
      technologies: ["React", "Tailwind CSS", "Node.js"],
      link: "#"
    },
    {
      id: 2,
      title: "Inventory Management System",
      description: "Streamline your inventory operations with our efficient software solution.",
      imageUrl: "https://via.placeholder.com/600x400",
      technologies: ["React", "Express", "MongoDB"],
      link: "#"
    },
    {
      id: 3,
      title: "Corporate Portfolio Website",
      description: "Showcase your company with a professional and modern portfolio website.",
      imageUrl: "https://via.placeholder.com/600x400",
      technologies: ["Vite", "React", "Tailwind CSS"],
      link: "#"
    },
    {
      id: 4,
      title: "CRM Application",
      description: "Enhance customer relationship management with our all-in-one CRM tool.",
      imageUrl: "https://via.placeholder.com/600x400",
      technologies: ["React", "Tailwind CSS", "Firebase"],
      link: "#"
    }
  ];

  const pageTransition = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="bg-orange-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-orange-600 text-white py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={pageTransition}
          className="container mx-auto px-4 text-center"
        >
          <h1 className="text-4xl font-bold mb-4">Our Work</h1>
          <p className="text-lg">
            Explore our portfolio of innovative software solutions and websites crafted for various businesses.
          </p>
        </motion.div>
      </div>

      {/* Work Grid */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={pageTransition}
        >
          {works.map((work) => (
            <motion.div
              key={work.id}
              className="border rounded-lg overflow-hidden bg-white shadow hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={work.imageUrl}
                alt={work.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {work.title}
                </h2>
                <p className="text-gray-600 mb-4">{work.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {work.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm bg-orange-100 text-orange-600 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={work.link}
                  className="inline-block text-orange-600 hover:text-orange-700 font-medium"
                >
                  View Details
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial="hidden"
          animate="visible"
          variants={pageTransition}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Create Your Next Big Idea?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Partner with us to transform your vision into reality. Let's craft solutions that drive success.
          </p>
          <button
            className="inline-block px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            Contact Us
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OurWorkPage;
