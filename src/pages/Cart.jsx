/**
 * pages/Cart.jsx
 */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItem, removeFromCart, cartTotal } = useCart();
  const [coupon, setCoupon] = useState('');

  const handleRemove = (slug) => {
    removeFromCart(slug);
  };

  const totalOriginalPrice = cartItem.reduce(
    (acc, item) => acc + (item.originalPrice ?? item.price) * item.quantity,
    0
  );
  const totalPrice = cartTotal;
  const totalDiscount = totalOriginalPrice - totalPrice;
  const discountPercent = totalOriginalPrice > 0
    ? Math.round((totalDiscount / totalOriginalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Helmet>
        <title>Shopping Cart | LearnGrow</title>
      </Helmet>

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted hover:text-primary transition-colors mb-4 text-sm font-medium"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#1F1F1F] mb-8">Cart</h1>

        {cartItem.length === 0 ? (
          <div className="bg-white rounded-card shadow-sm border border-border p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted mb-8">Keep shopping to find a course you'll love.</p>
            <Link to="/courses" className="btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-4">
              <p className="font-semibold text-[#1F1F1F] mb-2">{cartItem.length} Course(s) in Cart</p>

              <div className="bg-white rounded-card shadow-sm border border-border divide-y divide-border">
                {cartItem.map((item) => (
                  <div key={item.slug} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                    <img src={item.thumbnail} alt={item.title} className="w-full sm:w-32 aspect-video object-cover rounded-md" />

                    <div className="flex-1 min-w-0">
                      <Link to={`/course/${item.slug}`} className="font-bold text-[#1F1F1F] text-base xs:text-lg hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </Link>
                      <p className="text-sm text-muted mt-1">By {item.instructor}</p>

                      <div className="mt-4 flex items-center gap-4">
                        <button
                          onClick={() => handleRemove(item.slug)}
                          className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex flex-row sm:flex-col items-center justify-between sm:items-end">
                      <p className="font-bold text-base xs:text-lg text-primary">₹{(item.price * item.quantity).toLocaleString()}</p>
                      {item.originalPrice && (
                        <p className="text-xs xs:text-sm text-muted line-through">₹{(item.originalPrice * item.quantity).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-white rounded-card shadow-sm border border-border p-4 xs:p-6 sticky top-24">
                <h3 className="text-lg font-bold text-[#1F1F1F] mb-4">Total:</h3>
                <div className="text-3xl xs:text-4xl font-bold text-[#1F1F1F] mb-2">₹{totalPrice.toLocaleString()}</div>
                {totalOriginalPrice > totalPrice && (
                  <>
                    <div className="text-muted text-sm line-through mb-1">₹{totalOriginalPrice.toLocaleString()}</div>
                    <div className="text-success text-sm font-medium mb-6">{discountPercent}% off</div>
                  </>
                )}

                <Button variant="primary" onClick={() => navigate("/checkout", { state: { courses: cartItem } })} className="w-full py-4 text-lg mb-6">
                  Checkout
                </Button>

                <hr className="border-border mb-6" />

                <h4 className="font-semibold text-sm mb-3 text-[#1F1F1F]">Promotions</h4>
                <div className="flex flex-col xs:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 min-w-0 border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  <Button variant="secondary" size="sm" className="px-4 w-full xs:w-auto">Apply</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}