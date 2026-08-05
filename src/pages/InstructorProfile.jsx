/**
 * pages/InstructorProfile.jsx
 */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { Star, Users, PlayCircle, Linkedin, Twitter, Globe } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CourseCard from '../components/course/CourseCard';
import { getInstructors } from '../api/adminService';
import { getCourses } from '../api/courseService';

export default function InstructorProfile() {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getInstructors(), getCourses()]).then(([instructors, allCourses]) => {
      const found = instructors.find(i => i.id.toString() === id);
      if (found) {
        setInstructor(found);
        setInstructorCourses(allCourses.filter(c => found.courses.includes(c.id)));
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <h2>Instructor not found.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Helmet><title>{instructor.name} | Instructor Profile</title></Helmet>
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Profile Card */}
        <div className="bg-white rounded-card shadow-sm border border-border p-8 mb-12 lg:flex gap-12">
          <div className="flex-shrink-0 text-center lg:text-left mb-8 lg:mb-0">
            <img 
              src={instructor.photo} 
              alt={instructor.name} 
              className="w-48 h-48 rounded-full object-cover border-4 border-surface shadow-md mx-auto lg:mx-0"
            />
            <div className="mt-6 flex justify-center lg:justify-start gap-4">
              <a href={instructor.social.linkedin} className="text-muted hover:text-[#0A66C2]"><Linkedin size={20}/></a>
              <a href={instructor.social.twitter} className="text-muted hover:text-[#1DA1F2]"><Twitter size={20}/></a>
              <a href={instructor.social.website} className="text-muted hover:text-[#1F1F1F]"><Globe size={20}/></a>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold text-[#1F1F1F]">{instructor.name}</h1>
            <h2 className="text-lg font-medium text-primary">{instructor.title}</h2>
            
            <div className="flex gap-6 py-4 border-y border-border">
              <div>
                <p className="text-xs text-muted uppercase font-bold tracking-wider">Total Students</p>
                <p className="text-xl font-bold text-[#1F1F1F]">{instructor.studentsTaught.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase font-bold tracking-wider">Reviews</p>
                <p className="text-xl font-bold text-[#1F1F1F]">{instructor.reviewCount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase font-bold tracking-wider">Rating</p>
                <p className="text-xl font-bold text-[#1F1F1F] flex items-center gap-1">
                  <Star size={18} className="fill-amber text-amber"/> {instructor.rating.toFixed(1)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#1F1F1F] mb-2">About Me</h3>
              <p className="text-[#1F1F1F] leading-relaxed text-sm whitespace-pre-line">{instructor.bio}</p>
            </div>
          </div>
        </div>

        {/* Instructor's Courses */}
        <div>
          <h3 className="text-2xl font-bold text-[#1F1F1F] mb-6">Courses by {instructor.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructorCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
