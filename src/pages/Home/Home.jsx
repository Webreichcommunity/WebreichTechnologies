import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Code,
  Brain,
  Globe,
  ChevronDown,
  ArrowUpRight,
  Users,
  Laptop,
  CheckCircle,
  DollarSign,
  Zap,
  Clock,
  Shield,
  Star,
  Menu,
  X,
  PhoneCall,
  Mail,
  MessageCircle
} from "lucide-react";
import { BiRupee } from "react-icons/bi";
import TechnologyShowcase from "../Skills/TechnologyShowcase";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Handle scroll behavior
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      lastScrollY = currentScrollY;
      setScrollPosition(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gradient-to-b from-orange-50 via-white to-orange-50 overflow-hidden">
      {/* Floating Contact Button */}
      {/* <FloatingContactButton isVisible={isVisible} /> */}

      {/* Enhanced Hero Section */}
      <HeroSection />

      {/* Animated Stats Section */}
      <StatsSection />

      {/* Interactive Technology Showcase */}
      <TechnologyShowcase />

      {/* Enhanced Services Section */}
      <ServicesSection />

      {/* Dynamic Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* Engaging CTA Section */}
      <CTASection />

      {/* Quick Contact Section */}
      <QuickContactSection />
    </div>
  );
}

const FloatingContactButton = ({ isVisible }) => (
  <motion.div
    initial={{ x: 100 }}
    animate={{ x: isVisible ? 0 : 100 }}
    transition={{ duration: 0.3 }}
    className="fixed right-4 bottom-4 z-50 flex flex-col gap-2"
  >
    <motion.button
      whileHover={{ scale: 1.05 }}
      className="bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors"
    >
      <PhoneCall className="w-6 h-6" />
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.05 }}
      className="bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors"
    >
      <MessageCircle className="w-6 h-6" />
    </motion.button>
  </motion.div>
);

const HeroSection = () => (
  <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
    {/* Animated Background Elements */}
    <AnimatedBackground />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative text-center max-w-4xl mx-auto"
    >
      <HeroBadge />
      <HeroTitle />
      <HeroDescription />
      <CTAButtons />
      <EnhancedPriceComparison />
    </motion.div>

    {/* <ScrollIndicator /> */}
  </div>
);

const AnimatedBackground = () => (
  <>
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute w-full h-full">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-orange-300 to-purple-300 opacity-10 blur-3xl"
            animate={{
              x: [Math.random() * 100, Math.random() * -100],
              y: [Math.random() * 100, Math.random() * -100],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              width: `${200 + Math.random() * 200}px`,
              height: `${200 + Math.random() * 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  </>
);

const HeroBadge = () => (
  <motion.span
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="inline-block px-6 py-3 bg-gradient-to-r from-orange-100 to-purple-100 text-gray-900 rounded-full text-sm font-medium mb-6 shadow-md"
  >
    Next-Gen Tech Solutions at Affordable Rates
  </motion.span>
);

const HeroTitle = () => (
  <motion.h1
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="text-4xl md:text-7xl font-bold text-gray-800 leading-tight md:leading-tight mb-4"
  >
    WebReich
    <span className="bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
      {" "}Technologies
    </span>
  </motion.h1>
);
const HeroDescription = () => (
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="mt-6 text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto"
  >
    We deliver premium{" "}
    <span className="relative">
      <span className="bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent font-bold">
        Websites & software solutions
      </span>
      <motion.span
        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-300 to-purple-300 opacity-50"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 1, duration: 0.8 }}
      />
    </span>{" "}
    at rates 60% below market average, without compromising on quality.
  </motion.p>
);

const CTAButtons = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8 }}
    className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
  >
    <PrimaryButton text="Start Your Project" icon={ArrowRight} route="/start-project" />
    <SecondaryButton text="Explore Our Work" icon={ArrowUpRight} route="/our-work" />
  </motion.div>
);

const PrimaryButton = ({ text, icon: Icon, route }) => (
  <Link to="/inquire" className="group">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-purple-600 text-white rounded-full font-medium transition-all flex items-center gap-2 justify-center shadow-lg hover:shadow-xl relative overflow-hidden"
    >
      <span className="relative z-10 flex items-center gap-2">
        {text}
        <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-orange-600"
        initial={{ x: "100%" }}
        whileHover={{ x: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  </Link>
);

const SecondaryButton = ({ text, icon: Icon, route }) => (
  <Link to="/ourwork" className="group">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full px-8 py-4 border-2 border-orange-200 hover:border-orange-600 rounded-full font-medium transition-all flex items-center gap-2 justify-center bg-white/80 backdrop-blur-sm"
    >
      {text}
      <Icon className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
    </motion.button>
  </Link>
);

const EnhancedPriceComparison = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1 }}
    className="mt-16 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md mx-auto border border-orange-100"
  >
    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
      {/* <DollarSign className="w-5 h-5 text-orange-600" /> */}
      Transparent Pricing Comparison
    </h3>
    <div className="space-y-4">
      <PriceRow
        label="Market Average"
        price="₹2,500/hour"
        isStrikethrough
        icon={<ArrowUpRight className="w-4 h-4 text-red-500" />}
      />
      <PriceRow
        label="Our Premium Rate"
        price="₹900/hour"
        isHighlighted
        icon={<ArrowRight className="w-4 h-4 text-green-500" />}
      />
      <motion.div
        className="text-sm font-medium text-center pt-4 border-t mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-1 rounded-full text-xs">
          Save 60%
        </span>
        <p className="mt-2 text-gray-600">
          Premium quality at industry-leading rates
        </p>
      </motion.div>
    </div>
  </motion.div>
);

const PriceRow = ({ label, price, isStrikethrough, isHighlighted, icon }) => (
  <motion.div
    whileHover={{ x: 5 }}
    className={`flex justify-between items-center p-3 rounded-lg transition-colors ${isHighlighted ? 'bg-green-50' : 'hover:bg-gray-50'
      }`}
  >
    <div className="flex items-center gap-2">
      {icon}
      <span className={isHighlighted ? 'font-semibold text-green-600' : 'text-gray-600'}>
        {label}
      </span>
    </div>
    <span className={`${isStrikethrough ? 'text-gray-400 line-through' : 'text-gray-900 font-semibold'}`}>
      {price}
    </span>
  </motion.div>
);

const StatsSection = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="relative py-12 bg-white/80 backdrop-blur-sm border-y border-orange-100"
  >
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <AnimatedStatItem
          icon={<Star className="w-6 h-6 text-yellow-500" />}
          number="50+"
          label="Projects Delivered"
          delay={0}
        />
        <AnimatedStatItem
          icon={<BiRupee className="w-6 h-6 text-green-500" />}
          number="60%"
          label="Cost Savings"
          delay={0.2}
        />
        <AnimatedStatItem
          icon={<Users className="w-6 h-6 text-blue-500" />}
          number="98%"
          label="Client Satisfaction"
          delay={0.4}
        />
        <AnimatedStatItem
          icon={<Clock className="w-6 h-6 text-purple-500" />}
          number="24/7"
          label="Support Available"
          delay={0.6}
        />
      </div>
    </div>
  </motion.div>
);

const AnimatedStatItem = ({ icon, number, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ delay: delay + 0.2, type: "spring" }}
      className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-orange-50 to-purple-50 rounded-full flex items-center justify-center"
    >
      {icon}
    </motion.div>
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: delay + 0.4 }}
      className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent"
    >
      {number}
    </motion.div>
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: delay + 0.6 }}
      className="text-sm text-gray-600 mt-2"
    >
      {label}
    </motion.div>
  </motion.div>
);

const ServicesSection = () => (
  <div className="py-24 relative" id="services">
    <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-purple-50 transform -skew-y-3" />
    <div className="container mx-auto px-4 relative">
      <SectionHeader
        badge="Our Services"
        title="Premium Solutions for Your Success"
        description="High-quality development services at industry-leading prices"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <EnhancedServiceCard
          icon={<Globe className="w-8 h-8" />}
          title="Web Development"
          description="Modern, responsive websites that deliver exceptional user experiences"
          price="From ₹900/hour"
          marketPrice="Market rate: ₹2,500/hour"
          features={[
            "Responsive Design",
            "SEO Optimization",
            "Performance Tuning",
            "Modern UI/UX"
          ]}
          delay={0}
        />
        <EnhancedServiceCard
          icon={<Code className="w-8 h-8" />}
          title="Custom Software"
          description="Tailored solutions designed for your specific business needs"
          price="From ₹1,000/hour"
          marketPrice="Market rate: ₹3,500/hour"
          features={[
            "Custom Development",
            "API Integration",
            "Legacy System Updates",
            "Scalable Architecture"
          ]}
          delay={0.2}
        />
        <EnhancedServiceCard
          icon={<Brain className="w-8 h-8" />}
          title="AI Integration"
          description="Harness the power of AI to optimize your operations"
          price="From ₹1,000/hour"
          marketPrice="Market rate: ₹4,000/hour"
          features={[
            "ML Models",
            "Data Analytics",
            "Process Automation",
            "AI Consulting"
          ]}
          delay={0.4}
        />
      </div>
    </div>
  </div>
);

const SectionHeader = ({ badge, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="text-center max-w-2xl mx-auto"
  >
    <motion.span
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-purple-100 text-orange-700 rounded-full text-sm font-medium mb-4"
    >
      {badge}
    </motion.span>
    <motion.h2
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
    >
      {title}
    </motion.h2>
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="text-gray-600"
    >
      {description}
    </motion.p>
  </motion.div>
);

const EnhancedServiceCard = ({ icon, title, description, price, marketPrice, features, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden group"
  >
    <div className="p-8">
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring" }}
        className="w-16 h-16 bg-gradient-to-r from-orange-50 to-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
      >
        {icon}
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.4 + index * 0.1 }}
            className="flex items-center gap-2 text-gray-600"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            {feature}
          </motion.li>
        ))}
      </ul>
      <div className="pt-6 border-t">
        <div className="text-green-600 font-semibold text-lg">{price}</div>
        <div className="text-sm text-gray-400 line-through">{marketPrice}</div>
      </div>
    </div>
  </motion.div>
);

const WhyChooseUsSection = () => (
  <div className="py-24 bg-white" id="about">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-purple-100 text-orange-700 rounded-full text-sm font-medium"
          >
            Why Choose Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold text-gray-900"
          >
            Excellence at
            <br />
            <span className="bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              Affordable Rates
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-600"
          >
            We combine cutting-edge technical expertise with strategic thinking to deliver solutions that drive real business value. Our approach is collaborative, transparent, and focused on your success.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <EnhancedFeatureCard
              icon={Shield}
              title="Quality Assured"
              description="Premium quality guaranteed with every project delivery"
              delay={0.2}
            />
            <EnhancedFeatureCard
              icon={Laptop}
              title="Modern Stack"
              description="Latest technologies and frameworks for optimal performance"
              delay={0.4}
            />
            <EnhancedFeatureCard
              icon={Clock}
              title="Rapid Delivery"
              description="Quick turnaround without compromising quality"
              delay={0.6}
            />
            <EnhancedFeatureCard
              icon={DollarSign}
              title="Best Value"
              description="Premium solutions at 60% below market rates"
              delay={0.8}
            />
          </div>
        </motion.div>
        <EnhancedProcessShowcase />
      </div>
    </div>
  </div>
);

const EnhancedFeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02 }}
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-orange-100"
  >
    <div className="w-12 h-12 bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl flex items-center justify-center text-orange-600 mb-4">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const EnhancedProcessShowcase = () => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="relative"
  >
    <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-purple-500 rounded-3xl opacity-20 blur-xl" />
    <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
      <img
        src="/logo.png"
        alt="Development Process"
        className="w-full h-auto object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-8">
        <div className="text-white max-w-md">
          <h3 className="text-3xl font-bold mb-4">Our Development Process</h3>
          <p className="text-white/90 mb-6">
            Experience our streamlined development process that ensures quality, efficiency, and transparency.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white text-orange-600 rounded-full text-sm font-medium hover:bg-orange-50 transition-colors flex items-center gap-2"
          >
            Learn More
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

const CTASection = () => (
  <div className="py-24 relative overflow-hidden" id="contact">
    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-purple-600" />
    <div className="absolute inset-0 opacity-30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
    </div>
    <div className="container mx-auto px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center text-white max-w-3xl mx-auto"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl text-white/90 mb-12">
          Join hundreds of satisfied clients who have elevated their digital presence with our premium solutions at industry-leading prices.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <EnhancedCTAButton
            text="Schedule Free Consultation"
            icon={MessageCircle}
            primary
          />
          <EnhancedCTAButton
            text="View Case Studies"
            icon={ArrowUpRight}
            route="/casestudy"
          />
        </div>
      </motion.div>
    </div>
  </div>
);

const EnhancedCTAButton = ({ text, icon: Icon, primary, route }) => {
  const BaseButton = ({ children }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-8 py-4 rounded-full font-medium flex items-center gap-2 justify-center group transition-all ${primary
        ? "bg-white text-orange-600 hover:bg-orange-50"
        : "border-2 border-white text-white hover:bg-white/10"
        }`}
    >
      {children}
    </motion.button>
  );

  return route ? (
    <Link to="/case-studies">
      <BaseButton>
        {text}
        <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </BaseButton>
    </Link>
  ) : (
    <Link to="/inquire">
      <BaseButton>
        {text}
        <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </BaseButton>
    </Link>
  );
};

const QuickContactSection = () => (
  <div className="py-16 bg-gradient-to-b from-orange-50 to-white">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ContactCard
          icon={PhoneCall}
          title="Call Us"
          content="+91 8668722207 / 9834153020"
          action="Call now"
          onClick={() => window.location.href = 'tel:+918668722207'}
        />
        <ContactCard
          icon={Mail}
          title="Email Us"
          content="webreichcommunity@gmail.com"
          action="Send email"
          onClick={() => window.location.href = 'mailto:webreichcommunity@gmail.com'}
        />
        <ContactCard
          icon={MessageCircle}
          title="Live Chat"
          content="Available 24/7"
          action="Start chat"
          onClick={() => window.location.href = 'https://wa.me/918668722207?text=Hi%20WebReich%20Team,%20I%20need%20assistance.'}
        />
      </div>
    </div>
  </div>
);

const ContactCard = ({ icon: Icon, title, content, action, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-center"
  >
    <div className="w-12 h-12 bg-gradient-to-r from-orange-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className="w-6 h-6 text-orange-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{content}</p>
    <button
      className="text-orange-600 font-medium hover:text-orange-700 transition-colors"
      onClick={onClick}
    >
      {action} →
    </button>
  </motion.div>
);
