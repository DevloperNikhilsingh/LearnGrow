import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const Faq = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <section className="max-w-5xl mx-auto px-4 pb-28 mt-8">
      <div className="text-center mb-10">
        <span className="inline-flex text-sm font-semibold text-white bg-navy px-4 py-1.5 rounded-full">
          FAQ
        </span>
        <h2 className="text-2xl sm:text-3xl text-[#1F1F1F] mt-4 font-bold">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-muted mt-2">
          Find answers to common questions about using LearnGrow
        </p>
      </div>

      <div className="space-y-4">
        {/* FAQ - 1 */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-colors">
          <button
            onClick={() => toggleFaq(1)}
            className="w-full flex justify-between items-center text-left p-4 sm:p-5 hover:bg-gray-50 transition-colors"
            aria-expanded={openFaq === 1}
          >
            <span className="text-sm sm:text-base text-[#1F1F1F] font-semibold pr-4">
              Is LearnGrow free for learners?
            </span>
            <span
              className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center border transition-colors ${
                openFaq === 1 ? 'bg-navy border-navy text-white' : 'bg-white border-gray-300 text-[#1F1F1F]'
              }`}
            >
              {openFaq === 1 ? <Minus size={16} /> : <Plus size={16} />}
            </span>
          </button>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openFaq === 1 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-sm text-muted leading-relaxed border-t border-gray-100 px-4 sm:px-5 pt-4 pb-5">
                LearnGrow offers a mix of free and paid courses. You can browse and enroll in free courses instantly, while premium courses give you lifetime access, downloadable resources, and career support.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ - 2 */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-colors">
          <button
            onClick={() => toggleFaq(2)}
            className="w-full flex justify-between items-center text-left p-4 sm:p-5 hover:bg-gray-50 transition-colors"
            aria-expanded={openFaq === 2}
          >
            <span className="text-sm sm:text-base text-[#1F1F1F] font-semibold pr-4">
              Do I get a certificate after completing a course?
            </span>
            <span
              className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center border transition-colors ${
                openFaq === 2 ? 'bg-navy border-navy text-white' : 'bg-white border-gray-300 text-[#1F1F1F]'
              }`}
            >
              {openFaq === 2 ? <Minus size={16} /> : <Plus size={16} />}
            </span>
          </button>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openFaq === 2 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-sm text-muted leading-relaxed border-t border-gray-100 px-4 sm:px-5 pt-4 pb-5">
                Yes, every course on LearnGrow comes with a certificate of completion once you finish all the modules and assessments. You can download and share it directly from your dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ - 3 */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-colors">
          <button
            onClick={() => toggleFaq(3)}
            className="w-full flex justify-between items-center text-left p-4 sm:p-5 hover:bg-gray-50 transition-colors"
            aria-expanded={openFaq === 3}
          >
            <span className="text-sm sm:text-base text-[#1F1F1F] font-semibold pr-4">
              Can I access courses on my mobile device?
            </span>
            <span
              className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center border transition-colors ${
                openFaq === 3 ? 'bg-navy border-navy text-white' : 'bg-white border-gray-300 text-[#1F1F1F]'
              }`}
            >
              {openFaq === 3 ? <Minus size={16} /> : <Plus size={16} />}
            </span>
          </button>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openFaq === 3 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-sm text-muted leading-relaxed border-t border-gray-100 px-4 sm:px-5 pt-4 pb-5">
                Absolutely. LearnGrow is fully responsive, so you can learn on your phone, tablet, or laptop — your progress syncs automatically across devices.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ - 4 */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-colors">
          <button
            onClick={() => toggleFaq(4)}
            className="w-full flex justify-between items-center text-left p-4 sm:p-5 hover:bg-gray-50 transition-colors"
            aria-expanded={openFaq === 4}
          >
            <span className="text-sm sm:text-base text-[#1F1F1F] font-semibold pr-4">
              What is your refund policy?
            </span>
            <span
              className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center border transition-colors ${
                openFaq === 4 ? 'bg-navy border-navy text-white' : 'bg-white border-gray-300 text-[#1F1F1F]'
              }`}
            >
              {openFaq === 4 ? <Minus size={16} /> : <Plus size={16} />}
            </span>
          </button>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openFaq === 4 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-sm text-muted leading-relaxed border-t border-gray-100 px-4 sm:px-5 pt-4 pb-5">
                If you're not satisfied with a paid course, you can request a refund within 7 days of purchase, as long as you haven't completed more than 20% of the content.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ - 5 */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-colors">
          <button
            onClick={() => toggleFaq(5)}
            className="w-full flex justify-between items-center text-left p-4 sm:p-5 hover:bg-gray-50 transition-colors"
            aria-expanded={openFaq === 5}
          >
            <span className="text-sm sm:text-base text-[#1F1F1F] font-semibold pr-4">
              How long do I have access to a purchased course?
            </span>
            <span
              className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center border transition-colors ${
                openFaq === 5 ? 'bg-navy border-navy text-white' : 'bg-white border-gray-300 text-[#1F1F1F]'
              }`}
            >
              {openFaq === 5 ? <Minus size={16} /> : <Plus size={16} />}
            </span>
          </button>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openFaq === 5 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-sm text-muted leading-relaxed border-t border-gray-100 px-4 sm:px-5 pt-4 pb-5">
                Once you purchase a course, you get lifetime access — including all future updates to that course content, at no extra cost.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ - 6 */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-colors">
          <button
            onClick={() => toggleFaq(6)}
            className="w-full flex justify-between items-center text-left p-4 sm:p-5 hover:bg-gray-50 transition-colors"
            aria-expanded={openFaq === 6}
          >
            <span className="text-sm sm:text-base text-[#1F1F1F] font-semibold pr-4">
              Do you offer placement or career assistance?
            </span>
            <span
              className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center border transition-colors ${
                openFaq === 6 ? 'bg-navy border-navy text-white' : 'bg-white border-gray-300 text-[#1F1F1F]'
              }`}
            >
              {openFaq === 6 ? <Minus size={16} /> : <Plus size={16} />}
            </span>
          </button>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openFaq === 6 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-sm text-muted leading-relaxed border-t border-gray-100 px-4 sm:px-5 pt-4 pb-5">
                Yes, select courses come with placement assistance including resume reviews, mock interviews, and referrals to our hiring partners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;