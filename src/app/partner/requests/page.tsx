'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin, Navigation, IndianRupee, Phone, Check, X, Clock, Shield, Bell, Navigation2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getSocket } from '@/lib/socket'
import Image from 'next/image'

export default function PartnerRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchRequests()
    
    const socket = getSocket()
    socket.on('new-booking-received', (data) => {
       console.log('New booking received via socket:', data);
       // Check if the booking is for this partner's vehicle type or area
       // For now, we'll just add it to the list
       setRequests(prev => {
         // Prevent duplicates
         if (prev.find(r => r._id === data.booking._id)) return prev;
         return [data.booking, ...prev];
       })
       // Play a notification sound
       try {
         const audio = new Audio('/notification.mp3')
         audio.play().catch(err => console.log("Audio play failed:", err))
       } catch (e) {}
    })

    return () => {
      socket.off('new-booking-received')
    }
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/partner/requests/pending')
      const data = await res.json()
      if (data.success) {
        setRequests(data.requests)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (booking: any, action: 'accepted' | 'rejected') => {
    if (action === 'rejected') {
      setRequests(prev => prev.filter(r => r._id !== booking._id))
      return
    }

    try {
      const res = await fetch('/api/partner/booking/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking._id })
      })
      const data = await res.json()
      
      if (data.success) {
        // Emit socket event to notify user
        const socket = getSocket()
        socket.emit('accept-booking', {
          bookingId: booking._id,
          userId: booking.user._id || booking.user,
          partner: data.booking.partner,
          vehicle: data.booking.vehicle
        })

        // Redirect to trip page
        router.push(`/partner/trip/${booking._id}`)
      } else {
        alert(data.message || "Failed to accept booking")
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Incoming Requests</h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Accept rides to start earning</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Active Now</span>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest">
            Scanning for requests...
          </div>
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {requests.map((req, idx) => (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-bold">
                          {req.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{req.user?.name || 'Customer'}</h3>
                          <div className="flex items-center gap-2 text-gray-400">
                             <Clock size={12} />
                             <span className="text-[10px] font-bold uppercase tracking-widest">Requested Just Now</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-black flex items-center justify-end">
                          <IndianRupee size={20} />
                          {req.fare}
                        </p>
                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Cash Trip</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl mb-8 space-y-4 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
                          <Navigation2 size={128} className="rotate-45" />
                       </div>
                       
                       <div className="flex items-start gap-4">
                         <div className="w-2.5 h-2.5 rounded-full bg-black mt-1" />
                         <div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pickup</p>
                           <p className="text-sm font-bold text-gray-900">{req.pickup.address}</p>
                         </div>
                       </div>
                       <div className="flex items-start gap-4">
                         <div className="w-2.5 h-2.5 rounded-full border-2 border-black bg-white mt-1" />
                         <div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Destination</p>
                           <p className="text-sm font-bold text-gray-900">{req.drop.address}</p>
                         </div>
                       </div>
                    </div>

                    <div className="flex gap-4">
                       <button
                         onClick={() => handleAction(req, 'rejected')}
                         className="flex-1 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 transition-all"
                       >
                         <X size={18} />
                         Ignore
                       </button>
                       <button
                         onClick={() => handleAction(req, 'accepted')}
                         className="flex-[2] py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 shadow-lg shadow-gray-200 transition-all"
                       >
                         <Check size={18} />
                         Accept Ride
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Bell size={32} />
             </div>
             <h3 className="font-bold text-gray-900">No active requests</h3>
             <p className="text-gray-500 text-sm mt-2">We'll notify you when a trip is available nearby.</p>
          </div>
        )}
      </div>
    </div>
  )
}
