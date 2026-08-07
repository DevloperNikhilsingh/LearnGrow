/**
 * components/UserDashboard/HelpDesk.jsx
 * Fully functional with dummy data — no backend needed
 */
import React, { useState, useRef } from 'react';
import {
  CheckCircle, Clock, TimerIcon, ImagePlus, Headset, AlertCircle
} from 'lucide-react';
import { BsWhatsapp } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import { SiRapid } from 'react-icons/si';

export default function HelpDesk() {
  const [screenshot, setScreenshot] = useState(null);
  const fileInputRef = useRef(null);
  const [ticketForm, setTicketForm] = useState({
    name: '', email: '', phone: '', issuecategory: 'Paymentissue', message: ''
  });
  const [ticketErrors, setTicketErrors] = useState({});
  const [toast, setToast] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setScreenshot(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setScreenshot(file);
  };

  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({ ...prev, [name]: value }));
    if (ticketErrors[name]) {
      setTicketErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateTicketForm = () => {
    const errors = {};
    const { name, email, phone, message } = ticketForm;

    if (!name.trim()) errors.name = "Name is Required";
    else if (name.trim().length < 3) errors.name = "Name must be atleast 3 Character";

    if (!email.trim()) errors.email = "Email is Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Enter a valid email address';

    if (!phone.trim()) errors.phone = "Plz Enter your Contact Number";
    else if (!/^\+?[\d\s-]{10,15}$/.test(phone.trim())) errors.phone = 'Enter a valid phone number';

    if (!message.trim()) errors.message = "Plz Discribe Your Issue.....";
    else if (message.trim().length < 10) errors.message = "Please provide more detail (Min 10 Character)";

    return errors;
  };

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    const errors = validateTicketForm();
    setTicketErrors(errors);

    if (Object.keys(errors).length > 0) {
      showToast('error', 'Please fix the errors in the form');
      return;
    }

    showToast('success', 'Ticket submitted successfully! We\'ll get back to you soon.');
    setTicketForm({ name: '', email: '', phone: '', issuecategory: 'Paymentissue', message: '' });
    setTicketErrors({});
    setScreenshot(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className='fade-in max-w-3xl lg:max-w-7xl'>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-[100] fade-in">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border max-w-sm ${
            toast.type === 'success'
              ? 'bg-white border-green-200 text-green-700'
              : 'bg-white border-red-200 text-red-700'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              toast.type === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            </div>
            <p className="text-sm font-medium">{toast.text}</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className='w-full rounded-2xl p-6 mb-8 text-white relative overflow-hidden' style={{ background: 'linear-gradient(135deg, #0f3460 0%, #16213e 60%, #1a1a2e 100%)' }}>
        <div className='absolute top-0 right-0 w-56 h-56 rounded-full opacity-10' style={{ background: 'radial-gradient(circle, #60a5fa, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className='absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10' style={{ background: 'radial-gradient(circle, #818cf8, transparent)', transform: 'translate(-30%, 30%)' }} />
        <div className='relative z-10 flex justify-between items-center'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Headset size={20} className='text-blue-400' />
              <span className='text-blue-400 text-sm font-semibold uppercase tracking-wider'>Support Center</span>
            </div>
            <h1 className='text-2xl font-black text-white mb-1'>Help Desk</h1>
            <p className='text-white/60 text-sm'>We're here to help — raise a ticket or browse FAQs</p>
          </div>
          <div className='hidden sm:flex flex-col items-center bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm'>
            <span className='text-2xl font-black text-blue-300'>2h</span>
            <span className='text-white/60 text-xs mt-1'>Avg Response</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='w-full grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
        <div className='rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-3' style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
            <TimerIcon size={18} className='text-amber-600' />
          </div>
          <p className='text-3xl font-black text-[#1a1a2e]'>3</p>
          <p className='text-sm text-gray-500 mt-0.5'>Open Tickets</p>
        </div>
        <div className='rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-3' style={{ background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' }}>
            <CheckCircle size={18} className='text-green-600' />
          </div>
          <p className='text-3xl font-black text-[#1a1a2e]'>27</p>
          <p className='text-sm text-gray-500 mt-0.5'>Resolved</p>
        </div>
        <div className='col-span-2 md:col-span-1 rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-3' style={{ background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' }}>
            <SiRapid size={18} className='text-purple-600' />
          </div>
          <p className='text-3xl font-black text-[#1a1a2e]'>2h</p>
          <p className='text-sm text-gray-500 mt-0.5'>Avg Response</p>
        </div>
      </div>

      {/* Two-column layout: Form + Recent Tickets */}
      <div className='w-full flex flex-col xl:flex-row gap-6'>

        {/* Raise a Ticket Form */}
        <div className='flex-1 bg-white border border-gray-100 shadow-sm rounded-2xl p-6'>
          <h3 className='text-base font-bold text-[#1a1a2e] mb-1'>Raise a New Ticket</h3>
          <p className='text-xs text-gray-400 mb-5'>Fill in your details and our team will get back to you.</p>

          <form onSubmit={handleTicketSubmit} noValidate className='space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1.5'>
                <label htmlFor='name' className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Full Name</label>
                <input
                  type='text'
                  name='name'
                  value={ticketForm.name}
                  onChange={handleTicketChange}
                  placeholder='Rahul Sharma'
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 transition-all ${ticketErrors.name ? 'border-red-300 focus:ring-red-500/30 focus:border-red-400' : 'border-gray-200 focus:ring-blue-500/30 focus:border-blue-400'
                    }`}
                />
                {ticketErrors.name && <p className='text-xs text-red-500 mt-0.5'>{ticketErrors.name}</p>}
              </div>
              <div className='flex flex-col gap-1.5'>
                <label htmlFor='email' className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Email</label>
                <input
                  type='email'
                  name='email'
                  value={ticketForm.email}
                  onChange={handleTicketChange}
                  placeholder='rahul@email.com'
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 transition-all ${ticketErrors.email ? 'border-red-300 focus:ring-red-500/30 focus:border-red-400' : 'border-gray-200 focus:ring-blue-500/30 focus:border-blue-400'
                    }`}
                />
                {ticketErrors.email && <p className='text-xs text-red-500 mt-0.5'>{ticketErrors.email}</p>}
              </div>
              <div className='flex flex-col gap-1.5'>
                <label htmlFor='PhoneNumber' className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Phone Number</label>
                <input
                  type='tel'
                  name='phone'
                  value={ticketForm.phone}
                  onChange={handleTicketChange}
                  placeholder='+91 9876543210'
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 transition-all ${ticketErrors.phone ? 'border-red-300 focus:ring-red-500/30 focus:border-red-400' : 'border-gray-200 focus:ring-blue-500/30 focus:border-blue-400'
                    }`}
                />
                {ticketErrors.phone && <p className='text-xs text-red-500 mt-0.5'>{ticketErrors.phone}</p>}
              </div>
              <div className='flex flex-col gap-1.5'>
                <label htmlFor='issuecategory' className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Issue Category</label>
                <select
                  name='issuecategory'
                  id='issuecategory'
                  value={ticketForm.issuecategory}
                  onChange={handleTicketChange}
                  className='w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all'
                >
                  <option value='Paymentissue'>Payment Issue</option>
                  <option value='accountissue'>Account Issue</option>
                  <option value='classissue'>Classes Issue</option>
                  <option value='other'>Other</option>
                </select>
              </div>
            </div>

            <div className='flex flex-col gap-1.5'>
              <label htmlFor='describeyourissue' className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Describe Your Issue</label>
              <textarea
                name='message'
                id='message'
                rows={4}
                value={ticketForm.message}
                onChange={handleTicketChange}
                placeholder='Tell us what happened…'
                className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 transition-all resize-none ${ticketErrors.message ? 'border-red-300 focus:ring-red-500/30 focus:border-red-400' : 'border-gray-200 focus:ring-blue-500/30 focus:border-blue-400'
                  }`}
              />
              {ticketErrors.message && <p className='text-xs text-red-500 mt-0.5'>{ticketErrors.message}</p>}
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Attach Screenshot</label>
              <div
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrag}
                className='w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all'
              >
                <div className='w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center'>
                  <ImagePlus size={20} className='text-gray-400' />
                </div>
                <p className='text-sm font-medium text-gray-600'>
                  {screenshot ? screenshot.name : 'Click to upload or drag & drop'}
                </p>
                <p className='text-xs text-gray-400'>PNG, JPG up to 5MB</p>
                <input ref={fileInputRef} type='file' accept='image/png, image/jpeg' onChange={handleFileChange} className='hidden' />
              </div>
            </div>

            <button type='submit' className='w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:brightness-90 active:scale-95'
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              Submit Ticket
            </button>
          </form>
        </div>

        {/* Recent Tickets */}
        <div className='xl:w-[380px] bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col'>
          <div className='flex items-center justify-between mb-5'>
            <div>
              <h3 className='text-base font-bold text-[#1a1a2e]'>Recent Tickets</h3>
              <p className='text-xs text-gray-400 mt-0.5'>Your submitted support requests</p>
            </div>
            <span className='text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full'>3 Tickets</span>
          </div>

          <div className='space-y-3 flex-1'>
            {[
              { title: 'Payment Failed during checkout', id: '#1042', time: 'Today', status: 'progress' },
              { title: 'Website keeps crashing', id: '#1039', time: '2 days ago', status: 'resolved' },
              { title: 'Unable to log in', id: '#1035', time: '4 days ago', status: 'pending' },
            ].map((ticket, i) => (
              <div key={i} className='p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-[#1a1a2e] leading-snug truncate'>{ticket.title}</p>
                    <p className='text-xs text-gray-400 mt-1'>Ticket {ticket.id} · {ticket.time}</p>
                  </div>
                  {ticket.status === 'resolved' &&
                    <span className='shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-green-700 bg-green-100'>
                      <CheckCircle size={11} />Resolved
                    </span>}
                  {ticket.status === 'progress' &&
                    <span className='shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-amber-700 bg-amber-100'>
                      <Clock size={11} />In Progress
                    </span>}
                  {ticket.status === 'pending' &&
                    <span className='shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-red-700 bg-red-100'>
                      <TimerIcon size={11} />Pending
                    </span>}
                </div>
              </div>
            ))}
          </div>

          {/* Quick contact links */}
          <div className='mt-6 pt-5 border-t border-gray-100'>
            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3'>Need immediate help?</p>
            <div className='space-y-2'>
              <a href='https://wa.me/' target='_blank' rel='noreferrer'
                className='flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all'>
                <div className='w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0'>
                  <BsWhatsapp size={14} className='text-green-600' />
                </div>
                <span className='text-sm font-medium text-gray-700'>WhatsApp Support</span>
              </a>
              <a href='mailto:support@learngrow.com'
                className='flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all'>
                <div className='w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0'>
                  <MdEmail size={14} className='text-blue-600' />
                </div>
                <span className='text-sm font-medium text-gray-700'>Email Support</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}