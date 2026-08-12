import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

const faqs = [
  {
    id: 1,
    q: 'Is LearnGrow free for learners?',
    a: 'LearnGrow offers a mix of free and paid courses. You can browse and enroll in free courses instantly, while premium courses give you lifetime access, downloadable resources, and career support.',
  },
  {
    id: 2,
    q: 'Do I get a certificate after completing a course?',
    a: 'Yes, every course on LearnGrow comes with a certificate of completion once you finish all the modules and assessments. You can download and share it directly from your dashboard.',
  },
  {
    id: 3,
    q: 'Can I access courses on my mobile device?',
    a: 'Absolutely. LearnGrow is fully responsive, so you can learn on your phone, tablet, or laptop — your progress syncs automatically across devices.',
  },
  {
    id: 4,
    q: 'What is your refund policy?',
    a: "If you're not satisfied with a paid course, you can request a refund within 7 days of purchase, as long as you haven't completed more than 20% of the content.",
  },
  {
    id: 5,
    q: 'How long do I have access to a purchased course?',
    a: 'Once you purchase a course, you get lifetime access — including all future updates to that course content, at no extra cost.',
  },
  {
    id: 6,
    q: 'Do you offer placement or career assistance?',
    a: 'Yes, select courses come with placement assistance including resume reviews, mock interviews, and referrals to our hiring partners.',
  },
];

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const Faq = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <section className="max-w-5xl mx-auto px-4 pb-28 mt-8">
      {/* Heading - simple scroll reveal */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <span className="inline-flex text-sm font-semibold text-white bg-navy px-4 py-1.5 rounded-full">
          FAQ
        </span>
        <h2 className="text-2xl sm:text-3xl text-[#1F1F1F] mt-4 font-bold">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-muted mt-2">
          Find answers to common questions about using LearnGrow
        </p>
      </motion.div>

      {/* FAQ list - subtle stagger entrance on scroll */}
      <motion.div
        className="space-y-4"
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {faqs.map((faq) => {
          const isOpen = openFaq === faq.id;
          return (
            <motion.div
              key={faq.id}
              variants={itemVariants}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex justify-between items-center text-left p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base text-[#1F1F1F] font-semibold pr-4">
                  {faq.q}
                </span>
                <span
                  className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center border transition-colors ${
                    isOpen ? 'bg-navy border-navy text-white' : 'bg-white border-gray-300 text-[#1F1F1F]'
                  }`}
                >
                  {/* Framer: smooth icon rotate/crossfade between plus and minus */}
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="flex items-center justify-center"
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </motion.span>
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-sm text-muted leading-relaxed border-t border-gray-100 px-4 sm:px-5 pt-4 pb-5">
                    {faq.a}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Faq;