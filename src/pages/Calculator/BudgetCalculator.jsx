import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Type, Layout, Code, Share, ChevronRight, Check, Mail, Phone, User, Package, Megaphone } from 'lucide-react';

const colorPalettes = {
    professional: [
        { name: 'Corporate Blue', colors: ['#1a365d', '#2c5282', '#90cdf4'], price: 2000, preview: '#2c5282' },
        { name: 'Executive Gray', colors: ['#1a202c', '#4a5568', '#e2e8f0'], price: 2000, preview: '#4a5568' },
        { name: 'Forest Green', colors: ['#22543d', '#48bb78', '#c6f6d5'], price: 2000, preview: '#48bb78' },
    ],
    playful: [
        { name: 'Sunset Orange', colors: ['#dd6b20', '#ed8936', '#fbd38d'], price: 2000, preview: '#ed8936' },
        { name: 'Berry Purple', colors: ['#553c9a', '#805ad5', '#e9d8fd'], price: 2000, preview: '#805ad5' },
        { name: 'Ocean Breeze', colors: ['#2c5282', '#4299e1', '#bee3f8'], price: 2000, preview: '#4299e1' },
    ],
    minimal: [
        { name: 'Monochrome', colors: ['#000000', '#666666', '#ffffff'], price: 2000, preview: '#666666' },
        { name: 'Clean Slate', colors: ['#1a202c', '#cbd5e0', '#ffffff'], price: 2000, preview: '#cbd5e0' },
        { name: 'Soft Neutrals', colors: ['#4a5568', '#a0aec0', '#f7fafc'], price: 2000, preview: '#a0aec0' },
    ]
};

const fontPairings = {
    professional: [
        { name: 'Poppins & Open Sans', price: 2000, preview: 'Modern and Clean' },
        { name: 'Montserrat & Roboto', price: 2000, preview: 'Professional and Sharp' },
        { name: 'Inter & Source Sans Pro', price: 2000, preview: 'Clear and Elegant' }
    ],
    modern: [
        { name: 'Playfair Display & Lato', price: 2000, preview: 'Stylish and Contemporary' },
        { name: 'Raleway & Source Sans Pro', price: 2000, preview: 'Modern and Sleek' },
        { name: 'Work Sans & Nunito', price: 2000, preview: 'Fresh and Dynamic' }
    ],
    creative: [
        { name: 'Quicksand & Roboto', price: 2000, preview: 'Creative and Playful' },
        { name: 'Ubuntu & Open Sans', price: 2000, preview: 'Unique and Bold' },
        { name: 'Abril Fatface & Poppins', price: 2000, preview: 'Artistic and Expressive' }
    ]
};

const basicFeatures = [
    { id: 'responsive', name: 'Responsive Design', price: 2000, default: true, icon: Layout },
    { id: 'seo', name: 'Basic SEO Setup', price: 2000, default: false, icon: Share },
    { id: 'whatsapp', name: 'WhatsApp Integration', price: 1000, default: false, icon: Phone },
    { id: 'email', name: 'Email Integration', price: 1000, default: false, icon: Mail },
    { id: 'social', name: 'Social Media Integration', price: 1000, default: false, icon: Share },
    { id: 'animation', name: 'Page Animations', price: 2500, default: false, icon: Package }
];

const advancedFeatures = [
    { id: 'backend', name: 'Custom Backend Development', description: 'Scalable server-side solutions', price: 15000, icon: Code },
    { id: 'database', name: 'Database Integration', description: 'Secure data storage and management', price: 8000, icon: Package },
    { id: 'api', name: 'REST API Development', description: 'Custom API endpoints', price: 10000, icon: Share },
    { id: 'auth', name: 'User Authentication', description: 'Secure login system', price: 6000, icon: User },
    { id: 'payment', name: 'Payment Gateway Integration', description: 'Secure payment processing', price: 7000, icon: Package },
    { id: 'admin', name: 'Admin Dashboard', description: 'Complete management system', price: 12000, icon: Layout }
];

const maintenanceFeatures = [
    { id: 'hosting', name: 'Premium Hosting (Annual)', description: 'High-performance cloud hosting', price: 12000, icon: Package },
    { id: 'hostingfree', name: 'Hosting Dynamic (Annual)', description: 'High-performance cloud hosting', price: 0, icon: Package },
    { id: 'maintenance', name: 'Monthly Maintenance', description: 'Regular updates and support', price: 5000, icon: Code },
    { id: 'backup', name: 'Daily Backup System', description: 'Automated data backup', price: 3000, icon: Package },
    { id: 'analytics', name: 'Advanced Analytics', description: 'Detailed visitor insights', price: 4000, icon: Share },
    { id: 'marketing', name: 'Social Media Marketing', description: 'Comprehensive marketing strategy', price: 15000, icon: Megaphone },
    { id: 'seo_advanced', name: 'Advanced SEO Management', description: 'Enhanced search optimization', price: 8000, icon: Share }
];

const WebsiteBudgetCalculator = () => {
    const [formData, setFormData] = useState({
        colorScheme: '',
        colorPalette: '',
        fontStyle: '',
        fontPairing: '',
        basicFeatures: basicFeatures.filter(f => f.default).map(f => f.id),
        advancedFeatures: [],
        maintenanceFeatures: [],
        name: '',
        phone: '',
        email: '',
    });

    const [activeSection, setActiveSection] = useState('colors');
    const [totalPrice, setTotalPrice] = useState(12000); // Starting price is 12000

    useEffect(() => {
        calculatePrice();
    }, [formData]);

    const calculatePrice = () => {
        let price = 9000; // Base price

        // Add basic features
        formData.basicFeatures.forEach(featureId => {
            const feature = basicFeatures.find(f => f.id === featureId);
            if (feature) price += feature.price;
        });

        // Add advanced features
        formData.advancedFeatures.forEach(featureId => {
            const feature = advancedFeatures.find(f => f.id === featureId);
            if (feature) price += feature.price;
        });

        // Add maintenance features
        formData.maintenanceFeatures.forEach(featureId => {
            const feature = maintenanceFeatures.find(f => f.id === featureId);
            if (feature) price += feature.price;
        });

        setTotalPrice(price);
    };

    const renderFeatureCard = (feature, isSelected, onChange) => {
        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}
            >
                <label className="flex items-start gap-4 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onChange}
                        className="mt-1 w-4 h-4 text-orange-500"
                    />
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <feature.icon className="w-5 h-5 text-orange-500" />
                            <span className="font-medium">{feature.name}</span>
                        </div>
                        {feature.description && (
                            <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                        )}
                        <p className="text-sm text-orange-600 mt-1">₹{feature.price.toLocaleString()}</p>
                    </div>
                </label>
            </motion.div>
        );
    };

    const renderSection = () => {
        const fadeInUp = {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 }
        };

        switch (activeSection) {
            case 'colors': return (
                <motion.div {...fadeInUp} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Palette className="w-6 h-6 text-orange-500" />
                        <h2 className="text-2xl font-semibold">Choose Your Color Scheme</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(colorPalettes).map(([scheme, palettes]) => (
                            <div key={scheme} className="space-y-4">
                                <h3 className="text-lg font-medium capitalize">{scheme}</h3>
                                <div className="space-y-3">
                                    {palettes.map((palette) => (
                                        <motion.label
                                            key={palette.name}
                                            whileHover={{ scale: 1.02 }}
                                            className={`block p-4 rounded-xl border-2 cursor-pointer transition-all
                                                    ${formData.colorPalette === palette.name
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-6 h-6 rounded-full"
                                                        style={{ backgroundColor: palette.preview }}
                                                    />
                                                    <span className="font-medium">{palette.name}</span>
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="colorPalette"
                                                    value={palette.name}
                                                    checked={formData.colorPalette === palette.name}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        colorScheme: scheme,
                                                        colorPalette: e.target.value
                                                    })}
                                                    className="w-4 h-4 text-orange-500"
                                                />
                                            </div>
                                            <div className="mt-2 flex gap-2">
                                                {palette.colors.map((color, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-8 h-8 rounded-lg"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </motion.label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            );
            // ... Previous colors section code remains the same ...

            case 'typography': return (
                <motion.div {...fadeInUp} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Type className="w-6 h-6 text-orange-500" />
                        <h2 className="text-2xl font-semibold">Select Typography</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(fontPairings).map(([style, fonts]) => (
                            <div key={style} className="space-y-4">
                                <h3 className="text-lg font-medium capitalize">{style}</h3>
                                <div className="space-y-3">
                                    {fonts.map((font) => (
                                        <motion.label
                                            key={font.name}
                                            whileHover={{ scale: 1.02 }}
                                            className={`block p-4 rounded-xl border-2 cursor-pointer transition-all
                                            ${formData.fontPairing === font.name
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="font-medium">{font.name}</span>
                                                    <p className="text-sm text-gray-600 mt-1">{font.preview}</p>
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="fontPairing"
                                                    value={font.name}
                                                    checked={formData.fontPairing === font.name}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        fontStyle: style,
                                                        fontPairing: e.target.value
                                                    })}
                                                    className="w-4 h-4 text-orange-500"
                                                />
                                            </div>
                                        </motion.label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            );
            // ... Previous typography section code remains the same ...

            case 'basic':
                return (
                    <motion.div {...fadeInUp} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Package className="w-6 h-6 text-orange-500" />
                            <h2 className="text-2xl font-semibold">Basic Features</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {basicFeatures.map((feature) => (
                                renderFeatureCard(
                                    feature,
                                    formData.basicFeatures.includes(feature.id),
                                    () => {
                                        const newFeatures = formData.basicFeatures.includes(feature.id)
                                            ? formData.basicFeatures.filter(id => id !== feature.id)
                                            : [...formData.basicFeatures, feature.id];
                                        setFormData({ ...formData, basicFeatures: newFeatures });
                                    }
                                )
                            ))}
                        </div>
                    </motion.div>
                );

            case 'advanced':
                return (
                    <motion.div {...fadeInUp} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Code className="w-6 h-6 text-orange-500" />
                            <h2 className="text-2xl font-semibold">Advanced Features</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {advancedFeatures.map((feature) => (
                                renderFeatureCard(
                                    feature,
                                    formData.advancedFeatures.includes(feature.id),
                                    () => {
                                        const newFeatures = formData.advancedFeatures.includes(feature.id)
                                            ? formData.advancedFeatures.filter(id => id !== feature.id)
                                            : [...formData.advancedFeatures, feature.id];
                                        setFormData({ ...formData, advancedFeatures: newFeatures });
                                    }
                                )
                            ))}
                        </div>
                    </motion.div>
                );

            case 'maintenance':
                return (
                    <motion.div {...fadeInUp} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Megaphone className="w-6 h-6 text-orange-500" />
                            <h2 className="text-2xl font-semibold">Maintenance & Marketing</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {maintenanceFeatures.map((feature) => (
                                renderFeatureCard(
                                    feature,
                                    formData.maintenanceFeatures.includes(feature.id),
                                    () => {
                                        const newFeatures = formData.maintenanceFeatures.includes(feature.id)
                                            ? formData.maintenanceFeatures.filter(id => id !== feature.id)
                                            : [...formData.maintenanceFeatures, feature.id];
                                        setFormData({ ...formData, maintenanceFeatures: newFeatures });
                                    }
                                )
                            ))}
                        </div>
                    </motion.div>
                );

            case 'contact':
                return (
                    <motion.div {...fadeInUp} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="w-6 h-6 text-orange-500" />
                            <h2 className="text-2xl font-semibold">Contact Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 border rounded-lg"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full p-3 border rounded-lg"
                                    placeholder="Your Phone Number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-3 border rounded-lg"
                                    placeholder="Your Email"
                                />
                            </div>
                        </div>
                    </motion.div>
                );
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.phone || !formData.email) {
            alert('Please fill in all contact details');
            return;
        }

        const message = `
🌟 New Website Inquiry from ${formData.name}

💰 Project Budget: ₹${totalPrice.toLocaleString()}

🎨 Design Preferences:
- Color Scheme: ${formData.colorScheme}
- Color Palette: ${formData.colorPalette}
- Font Style: ${formData.fontStyle}
- Font Pairing: ${formData.fontPairing}

✨ Basic Features:
${formData.basicFeatures.map(id => `- ${basicFeatures.find(f => f.id === id)?.name}`).join('\n')}

⚙️ Advanced Features:
${formData.advancedFeatures.map(id => `- ${advancedFeatures.find(f => f.id === id)?.name}`).join('\n')}

🚀 Maintenance & Marketing:
${formData.maintenanceFeatures.map(id => `- ${maintenanceFeatures.find(f => f.id === id)?.name}`).join('\n')}

📞 Contact Details:
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=8668722207&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const sections = [
        { id: 'colors', name: 'Colors', icon: Palette },
        { id: 'typography', name: 'Typography', icon: Type },
        { id: 'basic', name: 'Basic Features', icon: Package },
        { id: 'advanced', name: 'Advanced Features', icon: Code },
        { id: 'maintenance', name: 'Maintenance', icon: Megaphone },
        { id: 'contact', name: 'Contact', icon: User },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Website Budget Calculator</h1>
                    <p className="text-gray-600">Build your custom website package</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-3/4">
                        <AnimatePresence mode="wait">
                            {renderSection()}
                        </AnimatePresence>
                    </div>

                    <div className="lg:w-1/4">
                        <div className="sticky top-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-lg p-6"
                            >
                                <h3 className="text-xl font-semibold mb-4">Progress</h3>
                                <div className="space-y-3">
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${activeSection === section.id
                                                ? 'bg-orange-50 text-orange-500'
                                                : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <section.icon className="w-5 h-5" />
                                            <span className="flex-1 text-left">{section.name}</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-medium">Total Estimate:</span>
                                        <span className="text-2xl font-bold text-orange-500">
                                            ₹{totalPrice.toLocaleString()}
                                        </span>
                                    </div>

                                    {activeSection === 'contact' ? (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSubmit}
                                            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                                        >
                                            Send Inquiry
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                const currentIndex = sections.findIndex(s => s.id === activeSection);
                                                if (currentIndex < sections.length - 1) {
                                                    setActiveSection(sections[currentIndex + 1].id);
                                                }
                                            }}
                                            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                                        >
                                            Next Step
                                        </motion.button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebsiteBudgetCalculator;