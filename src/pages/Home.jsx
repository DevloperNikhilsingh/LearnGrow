/**
 * pages/Home.jsx
 */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhyChooseUs from '../components/HomePageComponent/WhyChooseUs';
import { getCourses } from '../services/courseService';
import Faq from '../components/HomePageComponent/Faq';
import HeroSection from '../components/HomePageComponent/HeroSection';
import TrustedByCompany from '../components/HomePageComponent/TrustedByCompany';
import TopCategory from '../components/HomePageComponent/TopCategory';
import EssentialSkills from '../components/HomePageComponent/EssentialSkill';
import FeaturedCourses from '../components/HomePageComponent/FeaturedCourses';
import Testimonal from '../components/HomePageComponent/Testimonal';
import CTAsection from '../components/HomePageComponent/CTAsection';

export default function Home() {

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses().then((data) => {
      setCourses(data);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>LearnGrow | Master In-Demand Skills</title>
        <meta name="description" content="Learn from industry experts. High-quality courses in marketing, coding, design, and health." />
      </Helmet>

      <Navbar />

      <main className="flex-1">
   
        {/* Hero Section — Responsive */}
        <section id='herosection'>
        <HeroSection />
        </section>
         
        {/* Trusted By Companies Section */}
        <TrustedByCompany />

        {/* Categories Section — now a swipeable carousel so it stays compact as categories are added */}
        <TopCategory />

        {/* Learn Essential Skills */}
        <EssentialSkills />

        {/* Featured Courses */}
        <FeaturedCourses />

        {/* Testimonials Section */}
        <Testimonal />
        
        {/* WhyChooseUs Section */}
        <WhyChooseUs />

        {/* FAQs Section */}
        <section id='FAQ'>
          <Faq />
        </section>

        {/* CTA Section */}
        <CTAsection />
      </main>
      <Footer />
    </div>
  );
}