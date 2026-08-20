import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { LayoutGrid, BookOpen, Users, Settings, Menu, Video } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InstructorSidebar from '../components/InstructorDashboard/InstructorSidebar'
import instructorCourses from '../data/InstructorCourses'
import { getCurrentUser, logout } from '../services/authService'
import Overview from '../components/InstructorDashboard/Overview'
import courses from '../data/courses'
import InstructoreMyCoursesPage from '../components/InstructorDashboard/InstructoreMyCoursesPage'
import InstructorStudents from '../components/InstructorDashboard/InstructorStudents'
import InstructorLiveClass from '../components/InstructorDashboard/InstructorLiveClass'
import InstructorSettings from '../components/InstructorDashboard/InstructorSetting'

const TAB_TITLES = {
  overview: "Dashboard Overview",
  courses: "My Courses",
  students: "Students",
  settings: "Settings",
}


const NAV_ITEMS = [
  { id: 'overview', name: 'Overview', icon: LayoutGrid },
  { id: 'courses', name: 'My Courses', icon: BookOpen },
  { id: 'students', name: 'Students', icon: Users },
  { id: 'liveclass', name: 'LiveClass', icon: Video },
  { id: 'settings', name: 'Settings', icon: Settings },
  
]

const InstructorDashboard = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const totalProgress = 0 // instructor ke liye 'learning progress' apply nahi hota — baad me isko kisi aur metric se replace kar dena, jaise avg course completion rate

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="h-screen flex flex-col bg-surface font-sans overflow-hidden">
      <Helmet>
        <title>Instructor Dashboard | LearnGrow</title>
      </Helmet>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile top bar — only visible below lg, this is what was missing */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-navy flex items-center justify-between px-4 py-3">
          <span className="text-white font-bold text-base">LearnGrow</span>
          <button
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="text-white"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Desktop sidebar — hidden below lg via its own className */}
        <InstructorSidebar
          user={user}
          InstructorCourses={instructorCourses}
          totalProgress={totalProgress}
          NAV_ITEMS={NAV_ITEMS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          handleLogout={handleLogout}
        />

        {/* Mobile sidebar — only mounted when opened via the menu button above */}
        {sidebarOpen && (
          <InstructorSidebar
            mobile
            user={user}
            InstructorCourses={instructorCourses}
            totalProgress={totalProgress}
            NAV_ITEMS={NAV_ITEMS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            handleLogout={handleLogout}
          />
        )}

        {/* Main content area — pt-20 on mobile so content clears the fixed top bar */}
        <main className="flex-1 overflow-y-auto  pt-[76] ">
          
          <div className="pb-20">

            {activeTab === 'overview' && (
              <Overview
                user={user}
                InstructorCourses={instructorCourses}
                totalProgress={totalProgress}
                setActiveTab={setActiveTab}
                stats={{ totalStudents: 230, totalRevenue: 80000, totalRating: 4.5 }}
              />
            )}

            {activeTab === 'courses' && (
              <InstructoreMyCoursesPage />
            )}
            {activeTab === 'students' && (
              <InstructorStudents  />
            )}
            {activeTab === 'liveclass' && (
              <InstructorLiveClass />
            )}
            {activeTab === 'settings' && (
              <InstructorSettings />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default InstructorDashboard