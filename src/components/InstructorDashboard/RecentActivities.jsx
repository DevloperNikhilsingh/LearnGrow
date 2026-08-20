import React from 'react'
import dummyActivities from '../../data/InstructorDummyActivity'
import { UserPlus, Star, MessageCircle, FileUp, X, Banknote } from 'lucide-react';

const iconMap = {
    UserPlus,
    Star,
    MessageCircle,
    FileUp,
    X,
    Banknote,
};

const RecentActivities = ({ activities = dummyActivities }) => {

    return (
        <div className='w-full border border-border bg-white shadow-sm rounded-md p-4'>
            <div className='w-full mb-4'>
                <h1 className='text-xl md:text-2rem text-black font-semibold leading-tight'>Recent Activity</h1>
            </div>

            {activities.map((data, index) => {
                const Icon = iconMap[data.icon]
                return (
                    <div key={index} className='w-full border border-border p-3 flex items-start sm:items-center gap-3'>
                        {Icon && <Icon size={18} color={data.color} className='mt-0.5 sm:mt-0 shrink-0' />}
                        <div className='w-full flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 sm:justify-between'>
                            <p className='text-[15px] leading-relaxed text-black font-normal'>{data.text}</p>
                            <p className='text-xs leading-relaxed text-gray-400 font-normal whitespace-nowrap'>{data.time}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default RecentActivities