import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Target, Lightbulb, Users, Shield, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhyChooseUs from '../components/HomePageComponent/WhyChooseUs';
import CountUp from '../components/CountUp';
import TeamCarousel from '../components/AboutComponent/TeamCarousel';
import { useEffect } from 'react';
import Timeline from '../components/AboutComponent/Timeline'
import instructors from '../data/instructors'; // ⚠️ adjust this path to match where instructors.js actually lives in your project

export default function About() {

  const values = [
    { icon: Target, title: 'Excellence', desc: 'We deliver top-tier, industry-relevant content curated by experts.' },
    { icon: Lightbulb, title: 'Innovation', desc: 'Constantly evolving our platform with cutting-edge learning tools.' },
    { icon: Users, title: 'Community', desc: 'Fostering a global network of learners and mentors.' },
    { icon: Shield, title: 'Integrity', desc: 'Transparent, honest, and committed to your success.' },
  ];

  // team ab real instructors.js se generate ho raha hai, taaki slug hamesha match kare
  const team = instructors.map(inst => ({
    name: inst.name,
    role: inst.title,
    slug: inst.slug,
    img: inst.photo || '', // abhi empty hai, jab real photo instructors.js me add karoge tab yahan se aa jayegi
  }));

  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) {
        // chhota delay taaki page ka content pehle render ho jaaye, phir scroll ho
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0); // normal visit pe top pe hi rahe
    }
  }, [location]);
  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans ">
      <Helmet>
        <title>About Us | LearnGrow</title>
        <meta name="description" content="Learn about our mission to empower learners worldwide." />
      </Helmet>

      <Navbar />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="bg-navy py-14 sm:py-16 md:py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber rounded-full blur-[100px]"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-1">
              Empowering the World to <span className="text-amber">Learn</span> & <span className="text-primary">Grow</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto px-1">
              We are on a mission to democratize education by providing accessible, high-quality, and industry-relevant courses for everyone, everywhere.
            </p>
          </div>
        </section>

        {/* Our Story & Mission */}
        <section className="py-14 sm:py-16 md:py-20 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl transform -rotate-3 scale-105 -z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Team working together"
                className="rounded-2xl sm:rounded-3xl shadow-2xl object-cover w-full h-auto aspect-video lg:aspect-[4/3]"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-5 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy">Our Story</h2>
              <p className="text-muted leading-relaxed text-base sm:text-lg">
                Founded in 1999, LearnGrow started with a simple belief: traditional education isn't adapting fast enough to the modern world. We saw a gap between what is taught and what employers actually need.
              </p>
              <p className="text-muted leading-relaxed text-base sm:text-lg">
                Today, we partner with industry leaders to craft practical, hands-on courses that bridge that gap. Whether you're pivoting your career or upskilling for a promotion, we are here to guide you every step of the way.
              </p>
              <div className="pt-2 sm:pt-4 grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-white p-2.5 sm:p-4 rounded-xl border border-border shadow-sm text-center">
                  <div className="text-lg sm:text-2xl md:text-3xl font-bold text-primary mb-0.5 sm:mb-1">
                    <CountUp end={25000} suffix="+" />
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm font-medium text-navy leading-tight">Active Learners</div>
                </div>
                <div className="bg-white p-2.5 sm:p-4 rounded-xl border border-border shadow-sm text-center">
                  <div className="text-lg sm:text-2xl md:text-3xl font-bold text-primary mb-0.5 sm:mb-1">
                    <CountUp end={110} suffix="+" />
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm font-medium text-navy leading-tight">Expert Courses</div>
                </div>
                <div className="bg-white p-2.5 sm:p-4 rounded-xl border border-border shadow-sm text-center">
                  <div className="text-lg sm:text-2xl md:text-3xl font-bold text-primary mb-0.5 sm:mb-1">
                    <CountUp end={1500} suffix="+" />
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm font-medium text-navy leading-tight">Success Stories</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="bg-white py-14 sm:py-16 md:py-20 px-4 border-y border-border">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy mb-3 sm:mb-4">Our Core Values</h2>
              <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto px-2">The principles that guide everything we do and build.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
              {values.map((val, idx) => (
                <div key={idx} className="bg-surface p-5 sm:p-6 md:p-8 rounded-card border border-border hover:shadow-card-hover transition-all duration-300 group">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                    <val.icon size={24} className="sm:hidden" />
                    <val.icon size={28} className="hidden sm:block" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-navy mb-2 sm:mb-3">{val.title}</h3>
                  <p className="text-sm sm:text-base text-muted leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Timeline />

        {/* Team Section */}

        <section id='ourteam' className="py-8 sm:py-10 md:py-18 px-4 max-w-7xl mx-auto text-center">
          <TeamCarousel team={team} />
        </section>

        {/* CTA */}
        <section className="bg-navy py-14 sm:py-16 md:py-20 px-4 text-center border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 px-1">Ready to transform your career?</h2>
            <p className="text-base sm:text-lg text-white/80 mb-8 sm:mb-10 max-w-2xl mx-auto px-1">
              Join thousands of students who have already accelerated their careers with LearnGrow. Your journey starts today.
            </p>
            <Link to="/courses" className="inline-flex items-center gap-2 bg-amber hover:bg-white text-navy px-6 sm:px-8 py-3 sm:py-4 rounded-btn font-bold transition-colors shadow-lg text-sm sm:text-base">
              Explore Our Courses <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}