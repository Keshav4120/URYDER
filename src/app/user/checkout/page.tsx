'use client'
import React, { Suspense, useState } from 'react'
import { motion } from 'motion/react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { getSocket } from '@/lib/socket'
import Image from 'next/image'
import { ArrowLeft, Banknote, CheckCircle2, ChevronRight, Clock, CreditCard, IndianRupee, ShieldCheck } from 'lucide-react'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [bookingStatus, setBookingStatus] = useState('idle') // idle, loading, success

  const vehicleId = searchParams.get('vehicleId')
  const pickup = searchParams.get('pickup')
  const drop = searchParams.get('drop')
  const fare = Number(searchParams.get('fare')) || 450

  const handleConfirm = async () => {
    setBookingStatus('loading')

    if (paymentMethod === 'online') {
      // Load Razorpay Script
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!res) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setBookingStatus('idle');
        return;
      }

      // Fetch current user info for prefill
      let userData = { name: 'Customer', email: 'customer@uryder.com', mobile: '' };
      try {
        const { data: userRes } = await axios.get('/api/user/me');
        if (userRes.success) {
          userData = {
            name: userRes.user.name,
            email: userRes.user.email,
            mobile: userRes.user.mobileNumber || ''
          };
        }
      } catch (err) {
        console.warn("Could not fetch user details for prefill", err);
      }

      // Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_placeholder", 
        amount: fare * 100, // Amount in paise
        currency: "INR",
        name: "URYDER",
        description: `Ride from ${pickup?.split(',')[0]} to ${drop?.split(',')[0]}`,
        image: "/logo.png",
        handler: function (response: any) {
          // On Success
          console.log("Payment Successful:", response.razorpay_payment_id);
          processBooking();
        },
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: userData.mobile,
        },
        notes: {
          address: pickup,
          destination: drop,
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } else {
      // Cash Flow
      processBooking();
    }
  }

  const processBooking = async () => {
    try {
      const { data } = await axios.post('/api/user/booking/create', {
        pickup: { address: pickup },
        drop: { address: drop },
        vehicleType: searchParams.get('type') || 'car',
        fare,
        paymentMethod
      });

      if (data.success) {
        const socket = getSocket();
        socket.emit('new-booking', {
          booking: data.booking,
          vehicleId
        });

        setBookingStatus('success');
        // Redirect to the real-time map page
        setTimeout(() => router.push(`/user/booking/${data.booking._id}?pickup=${encodeURIComponent(pickup || '')}&drop=${encodeURIComponent(drop || '')}&vehicleId=${vehicleId}`), 2000);
      }
    } catch (err) {
      console.error("Booking creation failed:", err);
      alert("Failed to create booking. Please try again.");
      setBookingStatus('idle');
    }
  }

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  if (bookingStatus === 'success') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-green-100"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 max-w-xs mx-auto">Your ride request has been sent to nearby partners. You'll be notified once someone accepts.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-xl mx-auto">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm font-bold uppercase tracking-widest">Review Booking</span>
        </button>

        <div className="space-y-6">
          {/* Trip Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Trip Details</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-black" />
                  <div className="w-0.5 h-10 bg-gray-100 my-1" />
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-black bg-white" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pickup</p>
                    <p className="text-sm font-bold text-gray-900">{pickup || 'Location not set'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Destination</p>
                    <p className="text-sm font-bold text-gray-900">{drop || 'Destination not set'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Clock size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Est. Time: 15 mins</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Insured Trip</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Payment Method</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'cash' ? 'border-black bg-black text-white' : 'border-gray-50 bg-gray-50 text-gray-600'
                  }`}
              >
                <Banknote size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Cash</span>
              </button>
              <button
                onClick={() => setPaymentMethod('online')}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'online' ? 'border-black bg-black text-white' : 'border-gray-50 bg-gray-50 text-gray-600'
                  }`}
              >
                <CreditCard size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Online</span>
              </button>
            </div>
          </motion.div>

          {/* Price Summary & Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Fare</p>
                <h3 className="text-4xl font-black text-black flex items-center gap-1">
                  <IndianRupee size={28} />
                  {fare}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Taxes Incl.</p>
                <p className="text-xs font-bold text-green-600">Best Price Guaranteed</p>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={bookingStatus === 'loading'}
              className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:bg-gray-900 transition-all disabled:bg-gray-200"
            >
              {bookingStatus === 'loading' ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock size={20} />
                  </motion.div>
                  Processing...
                </>
              ) : (
                <>
                  Confirm Booking
                  <ChevronRight size={20} />
                </>
              )}
            </button>
            <p className="mt-4 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              By confirming, you agree to our terms & conditions.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-white font-bold tracking-widest uppercase text-gray-400">Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
