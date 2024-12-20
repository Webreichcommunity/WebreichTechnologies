import React, { useState } from "react";
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
  Sparkles,
  CheckCircle,
  DollarSign,
  Zap,
  Clock,
  Shield,
  Star,
  Menu,
  X
} from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO, TechCorp",
    content: "The quality of work delivered was exceptional, and the cost savings were remarkable.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Founder, StartupX",
    content: "Their team consistently delivers high-quality solutions while maintaining competitive rates.",
    rating: 5
  },
  {
    name: "Emma Williams",
    role: "Product Manager, InnovateCo",
    content: "Outstanding service and technical expertise at a fraction of the market cost.",
    rating: 5
  }
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className="bg-gradient-to-b from-orange-50 via-white to-orange-50">
      {/* Navigation */}


      {/* Fixed Header Banner */}
      {/* <div className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 px-4 fixed left-0 z-40">
        <div className="container mx-auto flex items-center justify-center text-sm font-medium">
          <Zap className="w-4 h-4 mr-2 animate-pulse" />
          Premium Quality at 40% Below Market Rates
        </div>
      </div> */}

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-start md:justify-center px-4 pt-0 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center max-w-4xl mx-auto"
        >
          <div className="mb-8 flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-purple-500 opacity-20 absolute blur-3xl"
            />
          </div>

          {/* Hero Content */}
          <HeroContent />

          {/* Testimonials Carousel */}
          <div className="mt-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonials[activeTestimonial].content}"</p>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{testimonials[activeTestimonial].name}</p>
                  <p className="text-gray-500">{testimonials[activeTestimonial].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${index === activeTestimonial ? 'bg-orange-600' : 'bg-orange-200'
                    }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-orange-400" />
        </motion.div>

        {/* Stats Section */}
        <StatsSection />
      </div>

      {/* Services Section */}
      <ServicesSection />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

const HeroContent = () => (
  <>

    <span className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-6">
      Next-Gen Tech Solutions at Affordable Rates
    </span>

    <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-orange-600 text-transparent bg-clip-text leading-tight md:leading-tight mb-2">
      WebReich <span className="text-gray-800 text-3xl"> Technologies</span> <br />
    </h1>
    {/* <span className="text-sm text-gray-800 font-normal mb-6">Make Your Online Prsenece Without Premium Prices</span> */}

    {/* <Features /> */}

    <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
      We deliver premium software solutions at rates 40% below market average,
      without compromising on quality or technology.
    </p>

    <CTAButtons />
    <PriceComparison />
  </>
);

const ValueProp = ({ icon: Icon, text, color }) => (
  <span className={`inline-flex items-center px-3 py-1 bg-${color}-100 text-${color}-700 rounded-full text-sm font-medium`}>
    <Icon className="w-4 h-4 mr-1" /> {text}
  </span>
);

const Features = () => (
  <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
    <Feature icon={DollarSign} text="40% Below Market Rates" color="green" />
    <Divider />
    <Feature icon={Zap} text="Latest Technologies" color="blue" />
    <Divider />
    <Feature icon={CheckCircle} text="Premium Quality" color="purple" />
  </div>
);

const Feature = ({ icon: Icon, text, color }) => (
  <div className="flex items-center gap-2 text-gray-600">
    <Icon className={`w-5 h-5 text-${color}-600`} />
    <span>{text}</span>
  </div>
);

const Divider = () => (
  <div className="hidden md:block w-1.5 h-1.5 bg-gray-300 rounded-full" />
);

const CTAButtons = () => (
  <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
    <PrimaryButton text="Let's Start a Project" icon={ArrowRight} />
    <SecondaryButton text="View Our Work" icon={ArrowUpRight} />
  </div>
);

const PrimaryButton = ({ text, icon: Icon }) => (
  <button className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-full font-medium hover:from-orange-700 hover:to-orange-600 transition-all flex items-center gap-2 justify-center group shadow-lg hover:shadow-xl">
    {text}
    <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </button>
);

const SecondaryButton = ({ text, icon: Icon }) => (
  <button className="px-8 py-4 border-2 border-orange-200 rounded-full font-medium hover:border-orange-600 transition-all flex items-center gap-2 justify-center group">
    {text}
    <Icon className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
  </button>
);

const PriceComparison = () => (
  <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-md mx-auto">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Price Comparison</h3>
    <div className="space-y-3">
      <PriceRow label="Market Average" price="$100/hour" isStrikethrough />
      <PriceRow label="Our Rate" price="$60/hour" isHighlighted />
      <div className="text-sm text-green-600 font-medium text-center pt-2 border-t">
        Save 40% without compromising quality
      </div>
    </div>
  </div>
);

const PriceRow = ({ label, price, isStrikethrough, isHighlighted }) => (
  <div className={`flex justify-between items-center ${isHighlighted ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
    <span>{label}</span>
    <span className={isStrikethrough ? 'text-gray-400 line-through' : ''}>{price}</span>
  </div>
);

const StatsSection = () => (
  <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-orange-100">
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <StatItem icon={<Star className="w-5 h-5 text-yellow-500" />} number="150+" label="Projects Delivered" />
        <StatItem icon={<DollarSign className="w-5 h-5 text-green-500" />} number="40%" label="Cost Savings" />
        <StatItem icon={<Users className="w-5 h-5 text-blue-500" />} number="98%" label="Client Satisfaction" />
        <StatItem icon={<Clock className="w-5 h-5 text-purple-500" />} number="24/7" label="Support Available" />
      </div>
    </div>
  </div>
);

const StatItem = ({ icon, number, label }) => (
  <div className="text-center transform hover:scale-105 transition-transform">
    <div className="flex justify-center mb-2">{icon}</div>
    <div className="text-2xl md:text-3xl font-bold text-orange-600">{number}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

const ServicesSection = () => (
  <div className="py-20 relative" id="services">
    <div className="absolute inset-0 bg-orange-50 transform -skew-y-3" />
    <div className="container mx-auto px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
          What We Offer
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
          Our Premium Services
        </h2>
        <p className="mt-4 text-gray-600">
          High-quality solutions at industry-leading prices
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <ServiceCard
          icon={<Code className="w-8 h-8" />}
          title="Custom Software"
          description="Tailored solutions designed specifically for your business needs and growth objectives"
          price="From ₹1,000/hour"
          marketPrice="Market rate: ₹3,500/hour"
          image="https://images.pexels.com/photos/3761137/pexels-photo-3761137.jpeg?auto=compress&cs=tinysrgb&w=600"
          features={["Custom Development", "API Integration", "Legacy System Updates"]}
        />
        <ServiceCard
          icon={<Brain className="w-8 h-8" />}
          title="AI Integration"
          description="Harness the power of artificial intelligence to automate and optimize your operations"
          price="From ₹1,000/hour"
          marketPrice="Market rate: ₹4000/hour"
          image="https://images.pexels.com/photos/17484970/pexels-photo-17484970/free-photo-of-an-artist-s-illustration-of-artificial-intelligence-ai-this-image-represents-how-technology-can-help-humans-learn-and-predict-patterns-in-biology-it-was-created-by-khyati-trehan-as-par.png?auto=compress&cs=tinysrgb&w=600"
          features={["ML Models", "Data Analytics", "Process Automation"]}
        />
        <ServiceCard
          icon={<Globe className="w-8 h-8" />}
          title="Web Development"
          description="Modern, responsive websites that deliver exceptional user experiences"
          price="From ₹900/hour"
          marketPrice="Market rate: ₹2,500/hour"
          image="https://images.pexels.com/photos/16129877/pexels-photo-16129877/free-photo-of-open-laptop-web-design-development-on-bed.jpeg?auto=compress&cs=tinysrgb&w=600"
          features={["Responsive Design", "SEO Optimization", "Performance Tuning"]}
        />
      </div>
    </div>
  </div>
);

const ServiceCard = ({ icon, title, description, price, marketPrice, features, image }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
      <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2">
        {icon}
      </div>
    </div>
    <div className="p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="pt-4 border-t">
        <div className="text-green-600 font-semibold">{price}</div>
        <div className="text-sm text-gray-400 line-through">{marketPrice}</div>
      </div>
    </div>
  </motion.div>
);

const WhyChooseUsSection = () => (
  <div className="py-20" id="about">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
        <div>
          <span className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Premium Quality, <br />Affordable Prices
          </h2>
          <p className="text-gray-600 mb-8">
            We combine technical expertise with strategic thinking to deliver solutions that drive real business value.
            Our approach is collaborative, transparent, and focused on your success.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Quality Guaranteed"
              description="Premium quality with every project"
            />
            <FeatureCard
              icon={<Laptop className="w-6 h-6" />}
              title="Modern Tech"
              description="Latest technologies and frameworks"
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Fast Delivery"
              description="Quick turnaround on all projects"
            />
            <FeatureCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Best Rates"
              description="40% below market average"
            />
          </div>
        </div>
        <ProcessShowcase />
      </motion.div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const ProcessShowcase = () => (
  <div className="relative">
    <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-purple-500 rounded-2xl opacity-20 blur-xl" />
    <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
      <img
        src="/logo.png"
        alt="Team at work"
        className="w-full h-auto"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
        <div className="text-white">
          <h3 className="text-2xl font-bold mb-2">Our Process</h3>
          <p className="text-white/80">See how we bring your ideas to life</p>
          <button className="mt-4 px-6 py-2 bg-white text-orange-600 rounded-full text-sm font-medium hover:bg-orange-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CTASection = () => (
  <div className="py-20 bg-gradient-to-r from-orange-600 to-orange-500" id="contact">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-white"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto mb-8">
          Join hundreds of satisfied clients who have transformed their businesses with our premium solutions at industry-leading prices.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-orange-600 rounded-full font-medium hover:bg-orange-50 transition-colors flex items-center gap-2 justify-center group">
            Schedule a Free Consultation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors">
            View Case Studies
          </button>
        </div>
      </motion.div>
    </div>
  </div>
);
