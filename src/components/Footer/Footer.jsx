import React from 'react';
import { Github, Twitter, Youtube, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-600 border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="webreich" />
              </div>
              <span className="text-gray-900 font-bold text-xl">WebReich Technologies</span>
            </div>
            
            <p className="text-sm leading-relaxed">
              Empowering businesses with intelligent software solutions. We create custom enterprise applications, workflow automation tools, and AI-powered business systems that transform how companies operate.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="hover:text-orange-600 transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-orange-600 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-orange-600 transition-colors" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-orange-600 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-orange-600 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Solutions</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">
                  Enterprise Software
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">
                  Workflow Automation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">
                  AI & Machine Learning
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">
                  Business Intelligence
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">
                  Cloud Integration
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">
                  Resources
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <p className="text-sm">
                <span className="text-orange-600 font-medium">Headquarters:</span><br />
                444-00-4<br />
                Akola, Maharashtra India
              </p>
              <p className="text-sm">
                <span className="text-orange-600 font-medium">Contact:</span><br />
                <a href="tel:+1-555-123-4567" className="hover:text-orange-600 transition-colors">
                  +91 86687 22207 / 98341 53020
                </a>
                <br />
                <a href="mailto:contact@techflow.com" className="hover:text-orange-600 transition-colors">
                  contact webreichcommunity@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © 2024 WebReich Technologies. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-orange-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-orange-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-orange-600 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;