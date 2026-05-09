'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  MapPin,
  Navigation,
  Phone,
  MessageSquare,
  Star,
  Shield,
  Clock,
  ChevronUp,
  IndianRupee,
  X,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react'
import axios from 'axios'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { getSocket } from '@/lib/socket'

function BookingStatusContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState('searching') // searching, accepted, arriving, in_trip, completed, cancelled
  const [driver, setDriver] = useState<any>(null)
  const [booking, setBooking] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(true)
  const [arrivalProgress, setArrivalProgress] = useState(0)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const pickup = searchParams.get('pickup') || 'Pickup Location'
  const drop = searchParams.get('drop') || 'Destination'
  const vehicleId = searchParams.get('vehicleId')

  useEffect(() => {
    const socket = getSocket()

    const fetchInitialStatus = async () => {
      try {
        const { data } = await axios.get(`/api/user/booking/${params.id}`);
        if (data.success && data.booking) {
          setBooking(data.booking);
          // Join socket room for private updates
          socket.emit('join', { userId: data.booking.user._id || data.booking.user, role: 'user' });

          if (data.booking.status === 'cancelled') {
            setStatus('cancelled');
            setCancelReason(data.booking.cancelReason || '');
          } else if (data.booking.status !== 'pending') {
            setDriver({
              id: data.booking.partner?._id,
              name: data.booking.partner?.name,
              rating: 4.8,
              vehicle: data.booking.vehicle?.vechicleModel,
              number: data.booking.vehicle?.number,
              image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop'
            });
            setStatus(data.booking.status === 'accepted' ? 'accepted' : 'in_progress');
          }
        }
      } catch (err) {
        console.error("Failed to fetch initial booking status:", err);
      }
    };

    fetchInitialStatus();

    socket.on('booking-accepted', (data) => {
      setDriver({
        id: data.partner._id,
        name: data.partner.name,
        rating: 4.8,
        vehicle: data.vehicle.vechicleModel,
        number: data.vehicle.number,
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop'
      });
      setStatus('accepted');
    });

    socket.on('booking-status-changed', (data) => {
      setStatus(data.status);
      if (data.status === 'completed') {
        router.push('/');
      }
    });

    return () => {
      socket.off('booking-accepted')
      socket.off('booking-status-changed')
    }
  }, [params.id, router])

  const handleCancel = async (reason: string) => {
    try {
      const { data } = await axios.post(`/api/user/booking/${params.id}/cancel`, {
        reason
      });
      if (data.success) {
        setCancelReason(reason);
        setStatus('cancelled');
        setShowCancelModal(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to cancel ride");
    }
  }

  if (status === 'cancelled') {
    return (
      <div className="h-screen w-screen bg-white flex flex-col items-center justify-center p-8 text-center font-sans">
         <motion.div 
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-8 border-4 border-red-100"
         >
            <X size={48} />
         </motion.div>
         <h1 className="text-4xl font-black text-neutral-900 tracking-tighter mb-4">Ride Cancelled</h1>
         <div className="bg-neutral-50 px-6 py-4 rounded-2xl mb-10 border border-neutral-100">
           <p className="text-neutral-400 text-[10px] font-black uppercase tracking-widest mb-1">Reason for cancellation</p>
           <p className="text-neutral-900 font-bold">{cancelReason || "No reason specified"}</p>
         </div>
         <button 
           onClick={() => router.push('/')}
           className="px-12 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-black/20"
         >
           Back to Home
         </button>
      </div>
    )
  }

  return (
    <div className="h-screen w-full bg-neutral-900 relative overflow-hidden font-sans">
      {/* Premium Interactive Map View Placeholder */}
      <div className="absolute inset-0 bg-[#e5e7eb]">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?saddr=${encodeURIComponent(booking?.pickup?.address || pickup)}&daddr=${encodeURIComponent(booking?.drop?.address || drop)}&output=embed`}
          className="grayscale opacity-60 contrast-125"
        ></iframe>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 via-transparent to-neutral-900/20 pointer-events-none" />
      </div>

      {/* Dynamic Header */}
      <div className="absolute top-10 inset-x-6 z-30 flex items-center justify-between pointer-events-none">
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => router.push('/')}
          className="p-4 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 pointer-events-auto hover:scale-105 active:scale-95 transition-all"
        >
          <X size={20} className="text-neutral-900" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/80 backdrop-blur-xl text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 pointer-events-auto"
        >
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping absolute inset-0" />
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full relative" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-green-400">Live Security Active</span>
        </motion.div>
      </div>

      {/* Bottom Interface Container */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="absolute inset-x-0 bottom-0 z-40"
          >
            {/* Glossy Overlay */}
            <div className="h-12 bg-gradient-to-t from-white to-transparent opacity-50" />

            <div className="bg-white rounded-t-[48px] shadow-[0_-20px_80px_rgba(0,0,0,0.15)] overflow-hidden">
              <div className="w-16 h-1.5 bg-neutral-100 rounded-full mx-auto mt-6" />

              <div className="px-8 pt-6 pb-10">
                {status === 'searching' ? (
                  <div className="text-center py-10">
                    <div className="relative inline-block mb-8">
                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0.1, 0.3],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -inset-6 border border-black rounded-full"
                      />
                      <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white relative z-10 shadow-xl">
                        <Loader2 size={32} className="animate-spin" />
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowCancelModal(true)}
                      className="mt-8 px-6 py-2 bg-neutral-100 text-neutral-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      Cancel Search
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Compact Status Ribbon */}
                    <div className="flex items-center justify-between border-b border-neutral-50 pb-6">
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-green-100">
                          {status === 'accepted' ? 'Arriving' : 'In Progress'}
                        </span>
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tighter">
                          {status === 'accepted' ? '2.4 km away' : 'On the way'}
                        </h2>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">ETA: 3 mins</p>
                      </div>
                    </div>

                    {/* Compact Driver Info */}
                    <div className="flex items-center justify-between p-6 bg-neutral-50 rounded-[32px] border border-neutral-100">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <img
                            src={driver.image}
                            className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white"
                            alt="Driver"
                          />
                          <div className="absolute -bottom-2 -right-2 bg-white text-neutral-900 px-2 py-0.5 rounded-full text-[9px] font-black shadow border border-neutral-100 flex items-center gap-1">
                            <Star size={10} className="fill-orange-400 text-orange-400" />
                            {driver.rating}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-neutral-900 leading-none mb-1">{driver.name}</h3>
                          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{driver.vehicle}</p>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-black text-white rounded-xl font-black text-sm tracking-widest">
                        {driver.number}
                      </div>
                    </div>

                    {/* Simplified Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="flex-1 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-red-100 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <X size={16} />
                        Cancel Ride
                      </button>
                      <button
                        onClick={() => router.push('/')}
                        className="flex-1 py-4 bg-neutral-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-black transition-all"
                      >
                        <CheckCircle2 size={16} />
                        I Have Reached
                      </button>
                    </div>

                    {/* Minimal Trip Summary */}
                    <div className="p-6 bg-neutral-900 rounded-[32px] text-white relative overflow-hidden">
                      <div className="flex items-center justify-between relative z-10">
                        <div>
                          <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">Total Amount</p>
                          <p className="text-2xl font-black tracking-tighter">₹{booking?.fare || '0'}.00</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">Security Pin</p>
                          <p className="text-xl font-black tracking-[0.2em]">8821</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[40px] p-10 relative z-10 shadow-2xl"
            >
              <h3 className="text-2xl font-black text-neutral-900 tracking-tight mb-2">Cancel Ride?</h3>
              <p className="text-neutral-400 text-xs font-medium mb-8">Please tell us why you want to cancel. This helps us improve our service.</p>
              
              <div className="space-y-3 mb-8">
                {['Driver too far', 'Changed my mind', 'Found another ride', 'Driver asked to cancel'].map((reason) => (
                   <button
                     key={reason}
                     onClick={() => handleCancel(reason)}
                     className="w-full py-4 px-6 rounded-2xl text-left text-[11px] font-black uppercase tracking-widest transition-all bg-neutral-50 text-neutral-400 hover:bg-black hover:text-white"
                   >
                     {reason}
                   </button>
                ))}
              </div>

              <button 
                onClick={() => setShowCancelModal(false)}
                className="w-full py-4 text-[11px] font-black uppercase tracking-widest text-neutral-400"
              >
                Go Back
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function BookingStatusPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-white font-bold tracking-widest uppercase text-gray-400">Loading Trip...</div>}>
      <BookingStatusContent />
    </Suspense>
  )
}
