import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const CTAsection = () => {
  return (
    <section className="relative py-20 bg-navy overflow-hidden">

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <motion.div
        className="max-w-4xl mx-auto px-4 relative z-10 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        {/* Eyebrow tag */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6"
        >
          <span className="w-2 h-2 bg-amber rounded-full animate-ping"></span>
          <span className="text-white/70 text-sm-caption">Join 50,000+ learners today</span>
        </motion.div>

        <motion.h2 variants={itemVariants} className="text-h1 text-white mb-4 tracking-tight">
          Your future starts
          <br />
          <span className="text-amber">
            with one click.
          </span>
        </motion.h2>

        <motion.p variants={itemVariants} className="text-white/60 mb-8 text-base max-w-md mx-auto">
          No credit card. No commitment. Just growth — at your own pace.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/signup"
            className="group relative inline-flex items-center gap-2 bg-amber hover:opacity-90 text-navy font-semibold px-8 py-3.5 rounded-btn text-base transition-all duration-300 hover:shadow-[0_0_40px_rgba(249,171,0,0.5)] hover:-translate-y-0.5"
          >
            Create a Free Account
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white px-8 py-3.5 rounded-btn text-base transition group"
          >
            Explore courses
            <span className="text-white/40 group-hover:text-amber transition">↗</span>
          </Link>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-white/40 text-sm-caption"
        >
          <span>✓ Free forever plan</span>
          <span>✓ Cancel anytime</span>
          <span>✓ 4.9/5 rating</span>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default CTAsection