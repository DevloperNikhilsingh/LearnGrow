/**
 * pages/AdminDashboard.jsx
 */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Book, DollarSign, Video, TrendingUp } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import StatCard from '../components/ui/StatCard';
import { getAdminStats } from '../services/adminService';
import Navbar from '../components/layout/Navbar'; // Reuse mobile navbar conceptually if needed

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminStats().then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-surface flex">
      <Helmet>
        <title>Admin Dashboard | LearnGrow</title>
      </Helmet>

      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Simple top bar for mobile/desktop spacing */}
        <div className="bg-white border-b border-border h-16 flex items-center pl-16 pr-8 lg:px-8 shadow-sm">
          <h1 className="text-xl font-bold text-[#1F1F1F]">Dashboard Overview</h1>
        </div>

        <div className="p-8 max-w-6xl mx-auto space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              icon={Book} 
              label="Total Courses" 
              value={stats.totalCourses} 
              color="text-primary" 
              bgColor="bg-blue-50" 
            />
            <StatCard 
              icon={Users} 
              label="Total Students" 
              value={stats.totalStudents.toLocaleString()} 
              color="text-amber" 
              bgColor="bg-amber/10" 
            />
            <StatCard 
              icon={DollarSign} 
              label="Revenue" 
              value={`₹${(stats.totalRevenue/100000).toFixed(1)}L`} 
              color="text-success" 
              bgColor="bg-success/10" 
            />
            <StatCard 
              icon={Video} 
              label="Active Live Classes" 
              value={stats.activeLiveClasses} 
              color="text-red-500" 
              bgColor="bg-red-50" 
            />
          </div>

          {/* Charts/Placeholder section */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-card shadow-sm border border-border h-80 flex flex-col">
              <h2 className="text-lg font-bold text-[#1F1F1F] mb-4 flex items-center gap-2"><TrendingUp size={20}/> Enrollment Trends</h2>
              <div className="flex-1 bg-surface rounded flex items-center justify-center border border-dashed border-gray-300">
                <span className="text-muted font-medium">Chart visualization placeholder</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-card shadow-sm border border-border h-80 flex flex-col">
              <h2 className="text-lg font-bold text-[#1F1F1F] mb-4">Recent Activity</h2>
              <ul className="space-y-4 flex-1 overflow-y-auto pr-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="flex gap-4 items-start text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-[#1F1F1F]">New student enrolled in <strong>Digital Marketing Mastery</strong></p>
                      <p className="text-muted text-xs">{i * 2} hours ago</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
