/**
 * pages/Checkout.jsx
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, CreditCard, Smartphone, Landmark, ShieldCheck, Infinity, ChevronLeft, CheckCircle2, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {clearCart} = useCart();

  const [activeTab, setActiveTab] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const stateCourses = location.state?.courses;
  const stateCourse = location.state?.course;

  const initialCourses = stateCourses
    ? stateCourses
    : stateCourse
      ? [stateCourse]
      : [];

  const [courses, setCourses] = useState(initialCourses);
  const [loading, setLoading] = useState(initialCourses.length === 0);

  useEffect(() => {
    if (courses.length === 0) {
      setLoading(false);
    }
  }, [courses, courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-24">
          <p className="text-muted text-sm">Loading course details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-24">
          <p className="text-muted text-sm">Course not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const totalPrice = courses.reduce((sum, c) => sum + (c.price ?? 0) * (c.quantity ?? 1), 0);
  const totalOriginalPrice = courses.reduce(
    (sum, c) => sum + (c.originalPrice ?? c.price ?? 0) * (c.quantity ?? 1),
    0
  );
  const totalDiscount = totalOriginalPrice - totalPrice;

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // TEMP simulated flow — replace this whole block with Razorpay integration
    await new Promise((r) => setTimeout(r, 1200));
    setProcessing(false);
    clearCart();
    setShowSuccess(true);
  };

  const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank'];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 bg-surface py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy mb-6 transition-colors">
            <ChevronLeft size={16} /> Back to cart
          </Link>

          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} className="text-muted" />
            <span className="text-sm text-muted">Secure checkout</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Payment Form */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-[#1F1F1F] mb-5">Payment method</h2>

              <div className="flex gap-2 mb-6">
                <TabButton active={activeTab === 'card'} onClick={() => setActiveTab('card')} icon={<CreditCard size={16} />} label="Card" />
                <TabButton active={activeTab === 'upi'} onClick={() => setActiveTab('upi')} icon={<Smartphone size={16} />} label="UPI" />
                <TabButton active={activeTab === 'netbanking'} onClick={() => setActiveTab('netbanking')} icon={<Landmark size={16} />} label="Netbanking" />
              </div>

              <form onSubmit={handlePay}>
                {activeTab === 'card' && <CardPaymentForm cardData={cardData} setCardData={setCardData} />}
                {activeTab === 'upi' && <UpiPaymentForm upiId={upiId} setUpiId={setUpiId} />}
                {activeTab === 'netbanking' && <NetbankingForm banks={banks} selectedBank={selectedBank} setSelectedBank={setSelectedBank} />}

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full mt-6 bg-amber text-[#1F1F1F] font-semibold py-3.5 rounded-xl hover:brightness-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {processing ? 'Processing...' : `Pay ₹${totalPrice.toLocaleString('en-IN')}`}
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <ShieldCheck size={14} className="text-muted" />
                  <span className="text-xs text-muted">256-bit encrypted payment</span>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-surface rounded-2xl p-6 sticky top-24">
                <h2 className="text-lg font-bold text-[#1F1F1F] mb-5">Order summary</h2>

                <div className="space-y-4 mb-5">
                  {courses.map((c) => (
                    <div key={c.slug ?? c.id} className="flex gap-3">
                      <div className="w-16 h-12 rounded-lg bg-navy flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {c.thumbnail ? (
                          <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-amber text-lg">🎯</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[#1F1F1F] truncate">{c.title}</p>
                        <p className="text-xs text-muted mt-0.5">{c.instructor}{c.level ? ` • ${c.level}` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Original price</span>
                    <span className="text-gray-400 line-through">₹{totalOriginalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Discount</span>
                    <span className="text-emerald-600">- ₹{totalDiscount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-baseline">
                  <span className="font-semibold text-sm text-[#1F1F1F]">Total</span>
                  <span className="font-bold text-xl text-[#1F1F1F]">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>

                <div className="mt-4 bg-emerald-50 rounded-lg px-3 py-2.5 flex items-center gap-2">
                  <Infinity size={16} className="text-emerald-600 flex-shrink-0" />
                  <span className="text-xs text-emerald-700">Lifetime access included</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {/* ── Success Modal ────────────────────────────────────────────── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" />

          {/* Modal Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center fade-in">
            <button
              onClick={() => navigate('/dashboard')}
              className="absolute top-4 right-4 text-muted hover:text-[#1F1F1F] transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Success Icon */}
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={44} className="text-emerald-600" />
            </div>

            <h2 className="text-2xl font-bold text-[#1F1F1F] mb-2">Payment Successful! 🎉</h2>
            <p className="text-muted text-sm mb-6">
              You now have lifetime access to {courses.length > 1 ? `${courses.length} courses` : `"${courses[0]?.title}"`}.
            </p>

            {/* Order mini-summary */}
            <div className="bg-surface rounded-xl p-4 mb-6 text-left">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted">Courses purchased</span>
                <span className="font-semibold text-[#1F1F1F]">{courses.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Amount paid</span>
                <span className="font-bold text-[#1F1F1F]">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-amber text-[#1F1F1F] font-semibold py-3 rounded-xl hover:brightness-95 transition-all"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="w-full border border-gray-300 text-[#1F1F1F] font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Browse More Courses
              </button>
            </div>

            <p className="text-xs text-muted mt-5">
              A confirmation email has been sent to your registered email address.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
        active ? 'bg-navy text-white border-navy' : 'bg-white text-[#1F1F1F] border-gray-300 hover:bg-gray-50'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function CardPaymentForm({ cardData, setCardData }) {
  const update = (field) => (e) => setCardData((prev) => ({ ...prev, [field]: e.target.value }));
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">Card number</label>
        <input type="text" value={cardData.number} onChange={update('number')} placeholder="1234 1234 1234 1234" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-shadow" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">Expiry</label>
          <input type="text" value={cardData.expiry} onChange={update('expiry')} placeholder="MM / YY" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-shadow" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">CVV</label>
          <input type="text" value={cardData.cvv} onChange={update('cvv')} placeholder="123" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-shadow" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">Name on card</label>
        <input type="text" value={cardData.name} onChange={update('name')} placeholder="Full name" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-shadow" />
      </div>
    </div>
  );
}

function UpiPaymentForm({ upiId, setUpiId }) {
  const quickApps = [
    { name: 'GPay', icon: '📱' },
    { name: 'PhonePe', icon: '📲' },
    { name: 'Paytm', icon: '💳' },
  ];
  return (
    <div>
      <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">UPI ID</label>
      <div className="flex gap-2 mb-4">
        <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@okhdfcbank" className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-shadow" />
        <button type="button" className="px-4 py-2.5 rounded-lg bg-amber text-[#1F1F1F] text-sm font-semibold hover:brightness-95 transition-all whitespace-nowrap">Verify</button>
      </div>
      <p className="text-xs text-muted mb-3">or pay using</p>
      <div className="grid grid-cols-3 gap-3">
        {quickApps.map((app) => (
          <button type="button" key={app.name} className="border border-gray-300 rounded-lg py-3 text-center hover:bg-gray-50 transition-colors">
            <div className="text-xl mb-1">{app.icon}</div>
            <p className="text-xs text-muted">{app.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function NetbankingForm({ banks, selectedBank, setSelectedBank }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">Select your bank</label>
      <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-shadow">
        <option value="">Choose a bank</option>
        {banks.map((bank) => (
          <option key={bank} value={bank}>{bank}</option>
        ))}
      </select>
    </div>
  );
}