import React from 'react'
import { Link } from 'react-router-dom'

const CTAsection = () => {
  return (
    <section className="relative py-20 bg-navy overflow-hidden">

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            {/* Eyebrow tag */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-amber rounded-full animate-ping"></span>
              <span className="text-white/70 text-sm-caption">Join 50,000+ learners today</span>
            </div>

            <h2 className="text-h1 text-white mb-4 tracking-tight">
              Your future starts
              <br />
              <span className="text-amber">
                with one click.
              </span>
            </h2>

            <p className="text-white/60 mb-8 text-base max-w-md mx-auto">
              No credit card. No commitment. Just growth — at your own pace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
            </div>

            {/* Trust strip */}
            <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-white/40 text-sm-caption">
              <span>✓ Free forever plan</span>
              <span>✓ Cancel anytime</span>
              <span>✓ 4.9/5 rating</span>
            </div>
          </div>
        </section>
  )
}

export default CTAsection
