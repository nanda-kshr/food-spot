'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiSmartphone, FiClock, FiDollarSign, FiPieChart, FiBarChart2, FiUsers, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

// Current system information

const CURRENT_DATE_TIME = "2025-05-11 01:36:00 IST"; // Using the provided date
interface Partner {
  id: string;
  shop_name?: string;
  location?: string;
  phone?: string;
  email?: string;
  role?: string;
}

const HomePage = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/v1/partner');
        
        if (!response.ok) {
          throw new Error('Failed to fetch partners');
        }
        
        const data = await response.json();
        // Filter partners where role is "partner"
        const filteredPartners = data.partners.filter((p: Partner) => p.role === 'partner');
        setPartners(filteredPartners);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPartners();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-orange-500 to-amber-600 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] bg-repeat bg-center"></div>
        </div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="w-full md:w-1/2 space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Transform Your Restaurant Menu With QR Code Magic
                  </h1>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <p className="text-xl md:text-2xl font-light">
                    Modern, contactless digital menus that boost sales and enhance the dining experience
                  </p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link href="/login" className="px-8 py-4 bg-white text-orange-600 rounded-full font-bold hover:bg-orange-50 transition-all shadow-lg">
                    Get Started
                  </Link>
                  <button 
                    onClick={() => scrollToSection('how-it-works')}
                    className="px-8 py-4 bg-transparent border-2 border-white rounded-full font-bold hover:bg-white/10 transition-all"
                  >
                    Learn More
                  </button>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-4 text-sm"
                >
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-orange-300">
                      <Image src="/hero.png" alt="User" width={32} height={32} />
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-orange-300 -ml-2">
                      <Image src="/hero.png" alt="User" width={32} height={32} />
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-orange-300 -ml-2">
                      <Image src="/hero.png" alt="User" width={32} height={32} />
                    </div>
                  </div>
                  <span>Trusted by 100+ restaurant owners</span>
                </motion.div>
              </div>
              <div className="w-full md:w-1/2">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="relative"
                >
                  <div className="relative z-10 shadow-2xl rounded-2xl overflow-hidden border-8 border-white">
                    <Image
                      src="/hero.png" 
                      alt="QR Menu Demo"
                      width={540}
                      height={800}
                      className="object-cover w-full h-auto"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 z-20 bg-white p-4 rounded-xl shadow-xl">
                    <Image
                      src="/hero.png" 
                      alt="QR Code Sample"
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute -top-4 -left-4 z-0 w-full h-full bg-orange-300 rounded-2xl"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ transform: 'translateY(1px)' }}>
          <svg preserveAspectRatio="none" width="100%" height="50" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18.17 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z" opacity=".25" fill="white" />
            <path d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28 75.93-35.37 142.65-40.26 223.56-4.65v-78z" opacity=".25" fill="white" />
            <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" fill="white" />
          </svg>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="py-20 bg-white" id="benefits">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Restaurant Owners Love Our QR Menu System</h2>
              <p className="text-xl text-gray-600">Discover how our digital menu solution is changing the restaurant industry</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FiClock className="w-8 h-8 text-orange-500" />,
                title: "Save Time & Money",
                description: "No more printing costs or waiting for menu reprints. Update your menu instantly without hassle."
              },
              {
                icon: <FiBarChart2 className="w-8 h-8 text-orange-500" />,
                title: "Increase Average Order",
                description: "Eye-catching photos and highlighted specials have been proven to increase order sizes by up to 30%."
              },
              {
                icon: <FiSmartphone className="w-8 h-8 text-orange-500" />,
                title: "Contactless Experience",
                description: "Provide a modern, hygienic dining experience that customers expect in today's world."
              },
              {
                icon: <FiPieChart className="w-8 h-8 text-orange-500" />,
                title: "Valuable Insights",
                description: "Gain insights into your most popular items and optimize your menu based on real data."
              },
              {
                icon: <FiDollarSign className="w-8 h-8 text-orange-500" />,
                title: "Boost Your Revenue",
                description: "Direct WhatsApp ordering increases conversion rates and customer satisfaction."
              },
              {
                icon: <FiUsers className="w-8 h-8 text-orange-500" />,
                title: "Enhance Customer Experience",
                description: "Interactive, visually appealing menus that delight your guests and keep them coming back."
              }
            ].map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before vs After Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Traditional Menus vs. QR Code Menus</h2>
              <p className="text-xl text-gray-600">See how our solution compares to traditional paper menus</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Traditional Paper Menus</h3>
              <ul className="space-y-4">
                {[
                  "High printing costs for each update",
                  "Limited visual appeal with few or no images",
                  "Menu changes require complete reprints",
                  "Worn, stained menus create poor impressions",
                  "No way to highlight promotions dynamically",
                  "Hygiene concerns with multiple handling",
                  "No analytics on popular items",
                  "Fixed layouts with space constraints",
                  "Environmental impact from paper waste"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1 text-red-500">✖</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6">QR Code Digital Menus</h3>
              <ul className="space-y-4">
                {[
                  "Zero printing costs, unlimited updates",
                  "Rich visual experience with high-quality images",
                  "Instant menu updates at any time",
                  "Always fresh and professional appearance",
                  "Dynamic promotions and \"Must Try\" highlights",
                  "Completely contactless and hygienic",
                  "Detailed analytics on customer preferences",
                  "Flexible layouts that work on any device",
                  "Eco-friendly with zero paper waste"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600">Simple steps to transform your restaurant experience</p>
            </motion.div>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-orange-200 transform -translate-y-1/2 z-0"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {[
                {
                  step: "1",
                  title: "Sign Up & Upload Menu",
                  description: "Create an account and upload your menu items with descriptions, prices, and images."
                },
                {
                  step: "2",
                  title: "Get Your QR Codes",
                  description: "We generate unique QR codes for your tables that link directly to your digital menu."
                },
                {
                  step: "3",
                  title: "Receive Orders via WhatsApp",
                  description: "Customers scan, browse, and send orders directly to your WhatsApp. No special hardware needed!"
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold mb-4 shadow-lg">
                    {item.step}
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg text-center w-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* ROI Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">See Your ROI</h2>
              <p className="text-white/80">Calculate how much you could save with our QR menu system</p>
            </div>
            <div className="p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">With Traditional Paper Menus:</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Printing costs per menu:</span>
                      <span className="font-medium">₹150-300</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Number of reprints per year:</span>
                      <span className="font-medium">4-6 times</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Average menus per restaurant:</span>
                      <span className="font-medium">20-30</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Total annual cost:</span>
                      <span className="font-bold text-red-500">₹12,000-54,000</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">With Our QR Menu System:</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Annual subscription:</span>
                      <span className="font-medium">₹9,999</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Menu updates:</span>
                      <span className="font-medium">Unlimited</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">QR code printing (one-time):</span>
                      <span className="font-medium">₹1,000-2,000</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Total first-year cost:</span>
                      <span className="font-bold text-green-500">₹10,999-11,999</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-green-800">Your First-Year Savings:</h3>
                    <span className="text-xl font-bold text-green-600">₹1,000-42,000</span>
                  </div>
                  <p className="text-sm text-green-700 mt-2">Plus the additional revenue from increased order values!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Restaurant Owners Say</h2>
              <p className="text-xl text-gray-600">Don&apos;t just take our word for it</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Since switching to QR menus, we've reduced printing costs by 80% and increased our average order value by 15%. The ROI is incredible.",
                name: "Priya Sharma",
                role: "Owner, Spice Garden",
                image: "/testimonial1.jpg"
              },
              {
                quote: "Customers love the interactive experience. Our staff spends less time explaining menu items and more time enhancing the dining experience.",
                name: "Rajesh Verma",
                role: "Manager, Taste of India",
                image: "/testimonial2.jpg"
              },
              {
                quote: "The WhatsApp integration is brilliant. We can confirm orders quickly and it's reduced miscommunications by at least 60%.",
                name: "Ananya Patel",
                role: "Owner, Ocean Delight",
                image: "/testimonial3.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-orange-500 font-medium">Testimonial</div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                    <Image 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      width={40} 
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Restaurant Partners</h2>
              <p className="text-xl text-gray-600">Join these successful restaurants that have already made the switch</p>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-center max-w-lg mx-auto">
              <p className="text-red-600">{error}</p>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No partners to display yet. Be the first to join!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partners.map((partner, index) => (
                <motion.div 
                  key={partner.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="h-40 bg-gradient-to-br from-orange-500 to-amber-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl font-bold text-white opacity-80">
                        {partner.shop_name?.charAt(0) || 'R'}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                      <h3 className="text-xl font-bold text-white">{partner.shop_name || 'Restaurant Partner'}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="space-y-2">
                      {partner.location && (
                        <div className="flex items-start text-sm">
                          <FiMapPin className="w-4 h-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-600 line-clamp-2">{partner.location}</span>
                        </div>
                      )}
                      {partner.phone && (
                        <div className="flex items-center text-sm">
                          <FiPhone className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">{partner.phone}</span>
                        </div>
                      )}
                      {partner.email && (
                        <div className="flex items-center text-sm">
                          <FiMail className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">{partner.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <Link 
                        href={`/qrcode/${partner.id}`}
                        className="text-orange-500 font-medium hover:text-orange-600 flex items-center text-sm"
                      >
                        View Digital Menu
                        <svg className="ml-1 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                      <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                        Partner
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Restaurant Experience?</h2>
              <p className="text-xl mb-8">Join hundreds of restaurant owners who have already made the smart switch to QR code menus.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/https://wa.me/918848188679?text=I would like to create a menu for my restaurant" className="px-8 py-4 bg-white text-orange-600 rounded-full font-bold hover:bg-orange-50 transition-all shadow-lg">
                  Get Started Today
                </Link>
                <Link href="https://wa.me/918848188679?text=I would like to create a menu for my restaurant" className="px-8 py-4 bg-transparent border-2 border-white rounded-full font-bold hover:bg-white/10 transition-all">
                  Contact Sales
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <p className="text-xl text-gray-600">Everything you need to know about our QR menu solution</p>
              </motion.div>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "How much does the QR menu system cost?",
                  answer: "Our pricing starts at ₹299 per month, which includes unlimited menu updates, QR code generation, and WhatsApp order integration. This is significantly less than what most restaurants spend on paper menus in a single year."
                },
                {
                  question: "Do I need special equipment to use the QR code system?",
                  answer: "No special equipment is needed. Orders come directly to your existing WhatsApp account. Customers use their own smartphones to scan QR codes that are printed on table cards or displayed in your venue."
                },
                {
                  question: "How do customers place orders?",
                  answer: "Customers scan the QR code with their phone camera, browse your digital menu, select items, and send their order directly to your WhatsApp with a single tap. You can then confirm the order and process it as normal."
                },
                {
                  question: "Can I update my menu whenever I want?",
                  answer: "Yes! You can update your menu as frequently as needed at no additional cost. Add new items, update prices, or mark items as sold out in real-time. Changes appear instantly on your digital menu."
                },
              ].map((faq, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-start">
                    <span className="text-orange-500 mr-2">Q:</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-gray-600 ml-6">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <Image src="/logo.png" alt="Food Spot Logo" width={40} height={40} className="mr-2" />
                <h3 className="text-xl font-bold">Food Spot</h3>
              </div>
              <p className="text-gray-400 mb-6">Revolutionizing the restaurant industry with smart, interactive QR code menu systems that increase revenue and enhance the dining experience.</p>
              <div className="text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Food Spot. All rights reserved.</p>
                <p>Last updated: {CURRENT_DATE_TIME}</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Testimonials</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <FiMapPin className="w-4 h-4 mr-2 text-orange-500" />
                  <span className="text-gray-400">Poonamalle, Chennai, India</span>
                </li>
                <li className="flex items-center">
                  <FiPhone className="w-4 h-4 mr-2 text-orange-500" />
                  <span className="text-gray-400">+91 8848188679</span>
                </li>
                <li className="flex items-center">
                  <FiMail className="w-4 h-4 mr-2 text-orange-500" />
                  <span className="text-gray-400">nandakishorep2121@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;