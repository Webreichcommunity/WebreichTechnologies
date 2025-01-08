import React, { useState, useEffect } from 'react';
import { Calculator, Mail, Phone, Send, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const InquirePage = () => {
    const HOURLY_RATE = 500; // ₹900 per hour
    const BASE_PRICE = 12000; // ₹12,000 minimum
    const BASE_HOURS = Math.ceil(BASE_PRICE / HOURLY_RATE);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        projectDetails: '',
    });

    const [features, setFeatures] = useState({
        pages: 5,
        authentication: false,
        ecommerce: false,
        cms: false,
        customDesign: true,
        seo: false,
    });

    const [calculatedData, setCalculatedData] = useState({
        totalPrice: BASE_PRICE,
        totalHours: BASE_HOURS,
        breakdown: {}
    });

    const featuresList = [
        {
            key: 'authentication',
            label: 'User Authentication',
            hours: 10,
            description: 'Secure login system, user profiles, and role management'
        },
        {
            key: 'ecommerce',
            label: 'E-commerce Integration',
            hours: 20,
            description: 'Complete online store with payment gateway integration'
        },
        {
            key: 'cms',
            label: 'Content Management System',
            hours: 15,
            description: 'Easy content updates with admin dashboard'
        },
        {
            key: 'customDesign',
            label: 'Premium Custom Design',
            hours: 20,
            description: 'Unique, branded design with custom animations'
        },
        {
            key: 'seo',
            label: 'SEO Optimization',
            hours: 10,
            description: 'Complete SEO setup with analytics integration'
        }
    ];

    const calculateCosts = () => {
        let totalHours = BASE_HOURS;
        let breakdown = {
            basePackage: {
                hours: BASE_HOURS,
                cost: BASE_PRICE,
                description: 'Basic Website Setup'
            }
        };

        // Add hours for additional pages
        const additionalPages = Math.max(0, features.pages - 5);
        if (additionalPages > 0) {
            const pageHours = additionalPages * 4;
            totalHours += pageHours;
            breakdown.additionalPages = {
                hours: pageHours,
                cost: pageHours * HOURLY_RATE - 3000,
                description: `${additionalPages} Additional Pages`
            };
        }

        // Add feature hours and costs
        featuresList.forEach(feature => {
            if (features[feature.key]) {
                totalHours += feature.hours;
                breakdown[feature.key] = {
                    hours: feature.hours,
                    cost: feature.hours * HOURLY_RATE - 3000,
                    description: feature.label
                };
            }
        });

        const totalPrice = totalHours * HOURLY_RATE;
        setCalculatedData({ totalPrice, totalHours, breakdown });
    };

    useEffect(() => {
        calculateCosts();
    }, [features]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const payload = {
    //         access_key: '49dfa941-0704-4a4a-9210-872f1bb719c0',
    //         ...formData,
    //         calculatedPrice: calculatedData.totalPrice,
    //         totalHours: calculatedData.totalHours,
    //         selectedFeatures: features,
    //         breakdown: calculatedData.breakdown
    //     };

    //     try {
    //         const response = await fetch('https://api.web3forms.com/submit', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(payload),
    //         });

    //         if (response.ok) {
    //             alert('Your inquiry has been sent successfully!');
    //             setFormData({ name: '', email: '', phone: '', projectDetails: '' });
    //         } else {
    //             alert('Something went wrong. Please try again.');
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         alert('An error occurred. Please try again.');
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            access_key: '49dfa941-0704-4a4a-9210-872f1bb719c0',
            ...formData,
            calculatedPrice: calculatedData.totalPrice,
            totalHours: calculatedData.totalHours,
            selectedFeatures: features,
            breakdown: calculatedData.breakdown
        };

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setFormData({ name: '', email: '', phone: '', projectDetails: '' });
                setAlert({
                    type: 'success',
                    message: 'Your inquiry has been sent successfully! We will contact you soon.',
                });
            } else {
                setAlert({
                    type: 'error',
                    message: 'Something went wrong. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setAlert({
                type: 'error',
                message: 'An error occurred. Please try again.',
            });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="gap-8"
                >
                    {/* Left Column - Contact Form */}
                    <motion.div
                        className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300 mb-10"
                        variants={containerVariants}
                    >
                        <motion.h1
                            className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent mb-2"
                            variants={itemVariants}
                        >
                            Transform Your Digital Presence
                        </motion.h1>
                        <motion.p
                            className="text-gray-600 mb-6 text-lg"
                            variants={itemVariants}
                        >
                            Let's create something extraordinary together. Our expert team delivers custom web solutions that make your business stand out.
                        </motion.p>

                        <motion.div
                            className="flex flex-col space-y-4 mb-8 bg-gradient-to-r from-orange-50 to-purple-50 p-6 rounded-lg"
                            variants={itemVariants}
                        >
                            <div className="flex items-center space-x-4 text-gray-600 hover:text-orange-600 transition-colors">
                                <Phone className="w-6 h-6 text-orange-600" />
                                <span className="text-lg">+91 8668722207 / 9834153020</span>
                            </div>
                            <div className="flex items-center space-x-4 text-gray-600 hover:text-orange-600 transition-colors">
                                <Mail className="w-6 h-6 text-orange-600" />
                                <span className="text-lg">webreichcommunity@gmail.com</span>
                            </div>
                        </motion.div>

                        <motion.form
                            className="space-y-6"
                            onSubmit={handleSubmit}
                            variants={containerVariants}
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                                        placeholder="Your Name"
                                        required
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                                    placeholder="+91 98765 43210"
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Details</label>
                                <textarea
                                    rows="4"
                                    name="projectDetails"
                                    value={formData.projectDetails}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                                    placeholder="Tell us about your vision..."
                                    required
                                />
                            </motion.div>

                            <motion.button
                                type="submit"
                                className="w-full bg-gradient-to-r from-orange-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-700 hover:to-purple-700 transition duration-200 flex items-center justify-center space-x-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Send className="w-5 h-5" />
                                <span>Send Inquiry</span>
                            </motion.button>
                        </motion.form>
                        {/* Alert Message */}
                        {alert && (
                            <div
                                className={`mt-4 p-4 rounded shadow-lg ${alert.type === 'success' ? 'bg-orange-50 border-l-4 border-orange-500 text-orange-700' : 'bg-red-50 border-l-4 border-red-500 text-red-700'
                                    }`}
                            >
                                {alert.message}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default InquirePage;