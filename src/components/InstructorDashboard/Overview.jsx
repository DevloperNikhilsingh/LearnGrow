import React from 'react'
import { BookOpen, ChevronRight, IndianRupee, Star } from 'lucide-react'
import StatCard from '../ui/StatCard'
import { Book, Users } from 'lucide-react'
import RecentCourseActivity from './RecentCourseActivity'
import CoursesGraph from './CoursesGraph'
import RecentActivities from './RecentActivities'
import dummyActivities from '../../data/InstructorDummyActivity'
import QuickActions from './QuickAction'


const Overview = ({ user, InstructorCourses = [], totalProgress = 0, setActiveTab, stats = {} }) => {

  return (
    <>
      <div className='hidden lg:block w-full bg-white lg:bg-navy  flex justify-between items-center p-4 mt-10 lg:mt-0'>
        <h1 className='text-xl lg:text-2xl text-black lg:text-white font-semibold'>Overview</h1>
      </div>
      <div className='space-y-6 fade-in p-4'>
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-navy to-[#1a3a6b] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden mt-14 sm:mt-12 md:mt-10 lg:mt-6">
          <div className="absolute right-0 bottom-0 opacity-10">
            <BookOpen size={160} />
          </div>
          <div className="relative z-10">
            <p className="text-white/60 text-sm font-medium">Welcome back,</p>
            <h2 className="text-xl sm:text-2xl font-bold mt-0.5">{user?.name || 'Instructor'} 👋</h2>
            <p className="text-white/70 text-sm mt-2">
              Manage your courses, track performance and grow your teaching impact
            </p>
            <button
              aria-label='view my courses'
              onClick={() => setActiveTab('courses')}
              className="mt-4 bg-amber text-navy text-sm font-semibold px-5 py-2 rounded-lg hover:brightness-110 transition-all flex items-center gap-2"
            >
              View My Courses <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              icon={Book}
              label="Total Courses"
              value={InstructorCourses.length}
              color="text-primary"
              bgColor="bg-blue-50"
            />
            <StatCard
              icon={Users}
              label="Total Students"
              value={(stats?.totalStudents ?? 0).toLocaleString()}
              color="text-amber"
              bgColor="bg-amber/10"
            />
            <StatCard
              icon={IndianRupee}
              label="Revenue"
              value={`₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`}
              color="text-success"
              bgColor="bg-success/10"
            />
            <StatCard
              icon={Star}
              label="Avg. Rating"
              value={(stats?.totalRating ?? 0).toLocaleString()}
              color="text-success"
              bgColor="bg-purple-100"
            />
          </div>

          {/* Course Status Overview and Recent Course Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
            <CoursesGraph courses={InstructorCourses} />
            <RecentCourseActivity
              courses={InstructorCourses}
              onViewAll={() => setActiveTab('courses')}
            />
          </div>

          {/* My courses */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
            <RecentActivities activities={dummyActivities} />
            <QuickActions />
          </div>
        </div>
      </div>
    </>
  )
}

export default Overview