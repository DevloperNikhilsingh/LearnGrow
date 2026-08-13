import React from 'react'
import { Gift, CheckCircle, Star, Copy, Clock} from 'lucide-react'
import { BsWhatsapp } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { MdOtherHouses } from 'react-icons/md'

const Referal = () => {
  return (
    <div className='fade-in max-w-3xl lg:max-w-7xl'>

      {/* Header Banner */}
      <div className='w-full rounded-2xl p-6 mb-8 text-white relative overflow-hidden' style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)' }}>
        <div className='absolute top-0 right-0 w-56 h-56 rounded-full opacity-10' style={{ background: 'radial-gradient(circle, #f97316, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className='absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10' style={{ background: 'radial-gradient(circle, #22c55e, transparent)', transform: 'translate(-30%, 30%)' }} />
        <div className='relative z-10 flex justify-between items-center'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Gift size={20} className='text-orange-400' />
              <span className='text-orange-400 text-sm font-semibold uppercase tracking-wider'>Referral Program</span>
            </div>
            <h1 className='text-2xl font-black text-white mb-1'>Refer & Earn Rewards</h1>
            <p className='text-white/60 text-sm'>Invite your friends and earn 200 Point for every successful referral</p>
          </div>
          <div className='hidden sm:flex flex-col items-center bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm'>
            <span className='text-3xl font-black text-orange-400'>2,200 Point</span>
            <span className='text-white/60 text-xs mt-1'>Total Earned</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='w-full grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
        <div className='rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-3' style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' }}>
            <Gift size={18} className='text-blue-600' />
          </div>
          <p className='text-3xl font-black text-[#1a1a2e]'>18</p>
          <p className='text-sm text-gray-500 mt-0.5'>Total Invites</p>
        </div>
        <div className='rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-3' style={{ background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' }}>
            <CheckCircle size={18} className='text-green-600' />
          </div>
          <p className='text-3xl font-black text-[#1a1a2e]'>11</p>
          <p className='text-sm text-gray-500 mt-0.5'>Successful</p>
        </div>
        <div className='col-span-2 md:col-span-1 rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-3' style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
            <Star size={18} className='text-amber-500' />
          </div>
          <p className='text-3xl font-black text-[#1a1a2e]'>1,200</p>
          <p className='text-sm text-gray-500 mt-0.5'>Total Points</p>
        </div>
      </div>

      {/* Referral Link Card */}
      <div className='p-6 bg-white border border-gray-100 shadow-sm rounded-2xl mb-8'>
        <h3 className='text-base font-bold text-[#1a1a2e] mb-1'>Your Referral Link</h3>
        <p className='text-xs text-gray-400 mb-4'>Share this link with your friends to start earning</p>

        <div className='w-full flex gap-2'>
          <div className='flex-1 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3'>
            <span className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
            <span className='w-[110px] sm:w-auto text-sm text-gray-600 font-mono truncate'>myapp.com/ref/rahul90</span>
          </div>
          <button aria-label='copy' className='flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-90 active:scale-95 flex-shrink-0' style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            <Copy size={15} />
            Copy
          </button>
        </div>

        <div className='w-full mt-4 grid grid-cols-3 gap-3'>
          <button aria-label='whatsapp' className='flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-semibold text-[#1a1a2e]'>
            <BsWhatsapp size={16} className='text-green-500' />
            WhatsApp
          </button>
          <button aria-label='email' className='flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-semibold text-[#1a1a2e]'>
            <MdEmail size={16} className='text-red-500' />
            Email
          </button>
          <button aria-label='other option' className='flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-semibold text-[#1a1a2e]'>
            <MdOtherHouses size={16} className='text-purple-500' />
            More
          </button>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className='bg-white border border-gray-100 shadow-sm rounded-2xl p-6'>
        <div className='flex items-center justify-between mb-5'>
          <div>
            <h3 className='text-base font-bold text-[#1a1a2e]'>Recent Referrals</h3>
            <p className='text-xs text-gray-400 mt-0.5'>Track who joined using your link</p>
          </div>
          <span className='text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full'>5 Referrals</span>
        </div>

        <div className='space-y-3'>

          <div className='flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0'
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                PS
              </div>
              <div>
                <p className='text-sm font-semibold text-[#1a1a2e]'>Priya Sharma</p>
                <p className='text-xs text-gray-400'>Joined on 25 Jul 2026</p>
              </div>
            </div>
            <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-green-700 bg-green-100'>
              <CheckCircle size={12} />200 point Earned
            </span>
          </div>

          <div className='flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0'
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                RY
              </div>
              <div>
                <p className='text-sm font-semibold text-[#1a1a2e]'>Rohan Yadav</p>
                <p className='text-xs text-gray-400'>Joined on 23 Jul 2026</p>
              </div>
            </div>
            <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-green-700 bg-green-100'>
              <CheckCircle size={12} />200 point Earned
            </span>
          </div>

          <div className='flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0'
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                AB
              </div>
              <div>
                <p className='text-sm font-semibold text-[#1a1a2e]'>Akhilesh Bhardwaj</p>
                <p className='text-xs text-gray-400'>Joined on 20 Jul 2026</p>
              </div>
            </div>
            <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-100'>
              <Clock size={12} />Pending
            </span>
          </div>

          <div className='flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0'
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                AK
              </div>
              <div>
                <p className='text-sm font-semibold text-[#1a1a2e]'>Amit Kumar</p>
                <p className='text-xs text-gray-400'>Joined on 18 Jul 2026</p>
              </div>
            </div>
            <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-green-700 bg-green-100'>
              <CheckCircle size={12} />200 Point Earned
            </span>
          </div>

          <div className='flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0'
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                SV
              </div>
              <div>
                <p className='text-sm font-semibold text-[#1a1a2e]'>Sneha Verma</p>
                <p className='text-xs text-gray-400'>Joined on 16 Jul 2026</p>
              </div>
            </div>
            <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-100'>
              <Clock size={12} />Pending
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Referal
