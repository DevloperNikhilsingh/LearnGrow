import { Mail, X } from 'lucide-react'
import React, { useState } from 'react'
import { useEffect } from 'react';

const StudentEmailModal = ({ student, onClose }) => {

  const [sendemail, setSendemail] = useState('');
  const [sendmessage, setSendmessage] = useState('');
  const [sending, setSending] = useState(null);

  useEffect(() => {
    if (student) setSendemail(student.email);
  }, [student]);

  const handleSendEmail = async () => {
    setSending(true);
    try {
      alert('Email sent successfully!');
      onClose();
    } catch (err) {
      alert('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex justify-center items-center'>
      <div className='bg-white shadow-lg rounded-card max-w-md p-4'>
        <div className='w-full flex justify-between items-center p-1 mb-8'>
          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 bg-primary flex justify-center items-center rounded-full'>
            <Mail size={20} className='text-white'/>
            </div>
            <h1 className='text-xl font-semibold text-black'>Send Email to {student?.name}</h1>
          </div>
          <X onClick={(e) => onClose()} size={20} />
        </div>

        <form action="">
          <label htmlFor='to' className='text-sm font-semibold text-muted mb-4'>To</label>
          <input
            value={sendemail}
            onChange={(e) => setSendemail(e.target.value)}
            type='email' name='Semail' className='w-full border border-border px-3 py-2 rounded-md text-sm bg-gray-100 mb-4 focus:ring-blue-400' />

          <label htmlFor="subject" className='text-sm font-semibold text-muted'>Subject</label>
          <input type="text" name="Ssubject" className='w-full border border-border rounded-md px-3 py-2 text-sm bg-gray-100 mb-4' />

          <label htmlFor="Smessage" className='text-sm font-semibold text-muted'>Message</label>
          <textarea
            value={sendmessage}
            onChange={(e) => setSendmessage(e.target.value)}
            name="Smessage" id="Message" className='w-full border border-border rounded-md px-3 py-2 text-sm bg-gray-100 mb-4'></textarea>

          <div className='w-full flex justify-end items-center gap-4'>
            <button type='button' onClick={onClose} className='px-4 py-2 border border-border shadow-md text-black rounded-md'>Cancel</button>
            <button type='button' onClick={handleSendEmail} className='px-4 py-2 border border-border shadow-md bg-primary text-white rounded-md'>Send Email</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentEmailModal
