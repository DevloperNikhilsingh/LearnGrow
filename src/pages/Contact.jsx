import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder logic for form submission
    console.log('Form submitted:', formData);
    alert('Thank you for reaching out! We will get back to you shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      <Helmet>
        <title>Contact Us | LearnGrow</title>
      </Helmet>
      
      <Navbar />

      <section className="bg-navy py-20 md:py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber rounded-full blur-[100px]"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Have a question, feedback, or need assistance? Fill out the form below or use our contact details to reach our team.
          </p>
          </div>
        </section>
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:py-20">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Form Section */}
          <div className="bg-white p-6 md:p-10 rounded-card shadow-card border border-border transition-shadow hover:shadow-card-hover duration-300">
            <h2 className="text-2xl font-bold text-navy mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-navy mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-btn border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-surface hover:bg-white"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-navy mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-btn border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-surface hover:bg-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-navy mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-btn border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-surface hover:bg-white"
                  placeholder="What is this regarding?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-navy mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-btn border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-surface hover:bg-white resize-none"
                  placeholder="Write your query or message here..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary hover:bg-navy text-white font-semibold py-3.5 px-6 rounded-btn transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info & Map Section */}
          <div className="flex flex-col space-y-8">
            
            {/* Info Cards */}
            <div className="bg-white p-6 md:p-8 rounded-card shadow-card border border-border transition-shadow hover:shadow-card-hover duration-300">
              <h2 className="text-2xl font-bold text-navy mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 transition-transform hover:scale-110 duration-300">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy">Email Us</h3>
                    <p className="text-muted mt-1 hover:text-primary transition-colors cursor-pointer">support@learngrow.com</p>
                    <p className="text-muted hover:text-primary transition-colors cursor-pointer">info@learngrow.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 transition-transform hover:scale-110 duration-300">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy">Call Us</h3>
                    <p className="text-muted mt-1 hover:text-primary transition-colors cursor-pointer">+91 123 456 7890</p>
                    <p className="text-muted">Mon - Fri, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 transition-transform hover:scale-110 duration-300">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy">Our Location</h3>
                    <p className="text-muted mt-1 leading-relaxed">
                      LearnGrow Headquarters,<br />
                      Tech Park, New Delhi, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white p-3 md:p-4 rounded-card shadow-card border border-border flex-1 min-h-[300px] transition-shadow hover:shadow-card-hover duration-300 flex flex-col">
              <h2 className="text-lg font-bold text-navy mb-3 px-2">Find Us Here</h2>
              <div className="w-full flex-1 rounded-btn overflow-hidden bg-surface relative min-h-[250px]">
                {/* User will update the iframe src with their actual location */}
                <iframe 
                  title="LearnGrow Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.5400494498!2d77.0688975!3d28.5272803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
