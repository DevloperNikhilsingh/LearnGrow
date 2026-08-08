import React, { useState, useRef, useEffect } from 'react'
import { HelpCircle as HelpCircleIcon, Headset, X, Send, CheckCircle2 } from 'lucide-react';

const HelpCircle = () => {

  const [isopen, setIsopen] = useState(false);
  const [issue, setIssue] = useState("");
  const [issueSubject, setIssueSubject] = useState("");
  const [isSent, setIsSent] = useState(false);

  // Drag ke liye state
  const [top, setTop] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight - 80 : 400
  );
  const dragging = useRef(false);
  const offsetY = useRef(0);
  const moved = useRef(false);

  const clampTop = (value) => {
    const maxTop = window.innerHeight - 60;
    if (value < 0) return 0;
    if (value > maxTop) return maxTop;
    return value;
  };

  // Mouse handlers
  const handleMouseDown = (e) => {
    dragging.current = true;
    moved.current = false;
    offsetY.current = e.clientY - top;
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    moved.current = true;
    setTop(clampTop(e.clientY - offsetY.current));
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  // Touch handlers (mobile drag support)
  const handleTouchStart = (e) => {
    dragging.current = true;
    moved.current = false;
    offsetY.current = e.touches[0].clientY - top;
  };

  const handleTouchMove = (e) => {
    if (!dragging.current) return;
    moved.current = true;
    setTop(clampTop(e.touches[0].clientY - offsetY.current));
  };

  const handleTouchEnd = () => {
    dragging.current = false;
  };

  useEffect(() => {
    const handleResize = () => {
      setTop((prev) => clampTop(prev));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    };
  }, [top]);

  const handlesendIssue = () => {
    if (!issue.trim() || !issueSubject.trim()) return;

    setIsSent(true);

    setTimeout(() => {
      setIsopen(false);
      setIssue("");
      setIssueSubject("");
      setIsSent(false);
    }, 1500);
  };

  // Modal position — screen ke andar hi rahe, button ke paas
  const modalHeight = 420;
  const modalTop = Math.min(
    Math.max(top - 100, 16),
    (typeof window !== 'undefined' ? window.innerHeight : 800) - modalHeight - 16
  );

  return (
    <div>
      {/* Floating Help Button — draggable, left se fixed */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={() => {
          if (!moved.current) setIsopen(true);
        }}
        aria-label="Need help? Contact us"
        style={{ top: `${top}px`, left: '10px', touchAction: 'none' }}
        className='fixed z-50 pl-2 pr-3 py-1 rounded-full select-none
       cursor-grab active:cursor-grabbing bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center gap-2 transition-colors'>
        <span>👋</span>
        <span className='text-sm font-semibold whitespace-nowrap'>Need help?</span>
      </div>

      {isopen && (
        <div
          id='overlayModal'
          style={{ top: `${modalTop}px`, left: '20px' }}
          className='fixed z-50'
        >
          <div className='w-[400px] max-w-[90vw] bg-white border-white shadow-2xl rounded-lg p-4'>

            {!isSent ? (
              <>
                <div className='w-full flex justify-between items-center'>
                  <div className='flex items-center gap-2'>
                    <div>
                      <Headset size={20} className='w-10 h-10 bg-navy rounded-full text-white p-2' />
                    </div>
                    <div>
                      <h2 className='text-black leading-relaxed text-[17px]'>Contact us</h2>
                      <p className='text-sm text-black leading-relaxed'>We usually reply within 1 hour</p>
                    </div>
                  </div>
                  <X size={25} className='cursor-pointer' onClick={() => setIsopen(false)} />
                </div>

                <div className='w-full bg-black inline-flex border border-black'></div>

                <div className='w-full flex flex-col mt-4'>
                  <label className='mb-2 text-black leading-relaxed font-semibold'>Subject</label>
                  <input
                    value={issueSubject}
                    onChange={(e) => setIssueSubject(e.target.value)}
                    type="text"
                    placeholder='e.g. Unable to access my course'
                    className='p-2 border shadow-sm rounded-md'
                  />
                </div>

                <div className='w-full flex flex-col mt-4'>
                  <label className='mb-2 text-black leading-relaxed font-semibold'>Your issue</label>
                  <textarea
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    className='p-2 border h-20 shadow-sm rounded-md'
                    name="issue"
                    id="issue"
                    placeholder='Describe your issue here....'
                  ></textarea>
                </div>

                <button
                  onClick={handlesendIssue}
                  className='w-full rounded-md p-2 mt-5 bg-blue-500 text-white leading-4 font-bold flex justify-center items-center gap-2 hover:bg-blue-600 transition-colors'>
                  <Send size={17} /> Send
                </button>
              </>
            ) : (
              <div className='flex flex-col items-center justify-center py-8 text-center'>
                <CheckCircle2 size={48} className='text-green-500 mb-3' />
                <h2 className='text-black text-[17px] font-semibold mb-1'>Message sent</h2>
                <p className='text-sm text-black/70'>We'll get back to you within 1 hour.</p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

export default HelpCircle