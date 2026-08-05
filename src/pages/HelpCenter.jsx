/**
 * pages/HelpCenter.jsx
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function HelpCenter() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Helmet><title>Help Center | LearnGrow</title></Helmet>
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-16 w-full">
        <h1 className="text-3xl font-bold text-navy mb-8 text-center">How can we help?</h1>
        <div className="bg-white p-8 rounded-card shadow-sm border border-border">
          <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <details className="group border-b border-border pb-4 cursor-pointer">
              <summary className="font-semibold text-[#1F1F1F]">How long do I have access to a course?</summary>
              <p className="text-muted mt-2 text-sm leading-relaxed">Once you enroll in a course, you have lifetime access to the content across all devices.</p>
            </details>
            <details className="group border-b border-border pb-4 cursor-pointer">
              <summary className="font-semibold text-[#1F1F1F]">Do you offer refunds?</summary>
              <p className="text-muted mt-2 text-sm leading-relaxed">Yes, we offer a 30-day money-back guarantee for all individual course purchases.</p>
            </details>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
