import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  Headset,
  Send,
  Tag,
  MessageSquare,
  User,
  ExternalLink,
  Clock,
  ShieldCheck,
  Users,
  Star,
} from 'lucide-react';
import { MapPin } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for reaching out! We will get back to you shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const infoCards = [
    {
      icon: Mail,
      iconBg: 'bg-blue-600',
      title: 'Email Us',
      lines: ['support@learngrow.com', 'info@learngrow.com'],
    },
    {
      icon: Phone,
      iconBg: 'bg-emerald-600',
      title: 'Call Us',
      lines: ['+91 123 456 7890', 'Mon – Fri, 9AM – 6PM'],
    },
    {
      icon: MapPin,
      iconBg: 'bg-amber-500',
      title: 'Our Location',
      lines: ['LearnGrow HQ, Tech Park,', 'New Delhi, India'],
    },
    {
      icon: Headset,
      iconBg: 'bg-primary',
      title: 'Support',
      lines: ["We're here to help", 'you 24/7'],
    },
  ];

  const trustStrip = [
    { icon: Clock, title: 'Quick Response', subtitle: 'We reply within 24 hours' },
    { icon: ShieldCheck, title: 'Trusted Support', subtitle: 'Your satisfaction is our priority' },
    { icon: Users, title: 'Expert Guidance', subtitle: 'Get help from our experts' },
    { icon: Star, title: 'Always Here', subtitle: '24/7 support for you' },
  ];

  return (
    <div className="min-h-screen bg-surface font-sans">
      <Helmet>
        <title>Contact Us | LearnGrow</title>
      </Helmet>

      <Navbar />

      {/* Dark hero */}
      <section className="relative overflow-hidden bg-navy px-4 pt-14 pb-28 sm:pt-16 sm:pb-32">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber rounded-full blur-[100px]" />
        </div>

        <motion.div
          className="relative max-w-4xl mx-auto text-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Let's Connect &amp;
            <br />
            Grow <span className="text-amber">Together</span>
          </h1>
          <p className="mt-5 text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question, feedback, or just want to say hello — our team
            is here to help.
          </p>
        </motion.div>
      </section>

      {/* Overlapping content card */}
      <main className="relative -mt-20 sm:-mt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto bg-surface rounded-card shadow-card-hover border border-border p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6">
            {/* Form */}
            <div className="bg-white p-6 sm:p-8 rounded-card border border-border">
              <div className="flex items-start gap-4 mb-6">
                <span className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  <Send size={20} />
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-navy">Send us a Message</h2>
                  <p className="text-sm text-muted mt-1">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-navy mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-btn border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-surface hover:bg-white"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-navy mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-btn border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-surface hover:bg-white"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-navy mb-2">
                    Subject
                  </label>
                  <div className="relative">
                    <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-btn border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-surface hover:bg-white"
                      placeholder="What is this regarding?"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-navy mb-2">
                    Message
                  </label>
                  <div className="relative">
                    <MessageSquare size={16} className="absolute left-4 top-3.5 text-muted" />
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full pl-11 pr-4 py-3 rounded-btn border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-surface hover:bg-white resize-none"
                      placeholder="Write your query or message here..."
                    />
                  </div>
                </div>

                {/* Framer: interactive hover/tap scale on the submit button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="w-full sm:w-auto bg-primary hover:bg-navy text-white font-semibold py-3.5 px-8 rounded-btn transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send size={18} />
                  Send Message
                </motion.button>
              </form>
            </div>

            {/* Get in touch + map */}
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-navy mb-4">Get in Touch</h2>
                <div className="grid grid-cols-2 gap-4">
                  {infoCards.map(({ icon: Icon, iconBg, title, lines }) => (
                    <div
                      key={title}
                      className="bg-white p-4 sm:p-5 rounded-card border border-border text-center flex flex-col items-center transition-shadow hover:shadow-card-hover duration-300"
                    >
                      <span className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                        <Icon size={18} />
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-navy mt-3">{title}</h3>
                      <div className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
                        {lines.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}

                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-card border border-border flex-1 min-h-[260px] flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base sm:text-lg font-bold text-navy">Find Us on Map</h2>
                </div>
                <div className="w-full flex-1 rounded-btn overflow-hidden bg-surface relative min-h-[200px]">
                  {/* Framer: interactive hover/tap scale on the maps link button */}
                  <motion.a
                    href="https://maps.google.com/?q=New+Delhi,India"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 bg-white text-primary text-xs sm:text-sm font-medium px-3 py-2 rounded-btn shadow-sm hover:bg-surface transition-colors"
                  >
                    <ExternalLink size={14} />
                    Open in Google Maps
                  </motion.a>
                  <iframe
                    title="LearnGrow Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.5400494498!2d77.0688975!3d28.5272803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-6 bg-navy rounded-card p-5 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-5 sm:gap-6">
            {trustStrip.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{title}</p>
                  <p className="text-xs text-gray-300 truncate">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}