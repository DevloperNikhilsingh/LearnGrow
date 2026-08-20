import React from 'react'
import { Plus, Mail, Wallet, BarChart3 } from 'lucide-react'

const quickActions = [
  {
    icon: Plus,
    label: 'Add new course',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    badge: null,
    tab: 'addCourse',
  },
  {
    icon: Mail,
    label: 'Messages',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    badge: 3,
    tab: 'messages',
  },
  {
    icon: Wallet,
    label: 'Withdraw payout',
    color: 'text-success',
    bgColor: 'bg-success/10',
    badge: null,
    tab: 'payouts',
  },
  {
    icon: BarChart3,
    label: 'Earnings report',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    badge: null,
    tab: 'earnings',
  },
]

const QuickActions = ({ actions = quickActions, setActiveTab }) => {
  return (
    <div className='w-full border border-border bg-white shadow-sm rounded-md p-4'>
      <h1 className='text-xl md:text-2rem text-black font-semibold leading-tight mb-4'>Quick Actions</h1>

      <div className='grid grid-cols-2 gap-3'>
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <button
              key={index}
              onClick={() => setActiveTab && setActiveTab(action.tab)}
              className='relative flex flex-col items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border border-border hover:border-gray-300 hover:shadow-sm transition-all text-left'
            >
              <div className={`${action.bgColor} p-2 sm:p-2.5 rounded-lg`}>
                <Icon size={18} className={`${action.color} sm:w-5 sm:h-5`} />
              </div>
              <span className='text-xs sm:text-sm font-medium text-black leading-snug'>{action.label}</span>

              {action.badge && (
                <span className='absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-100 text-red-600 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center'>
                  {action.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions