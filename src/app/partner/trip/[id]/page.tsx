'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { MapPin, Navigation, Phone, Check, Clock, Shield, Bell, Navigation2, CheckCircle2, MoreVertical, IndianRupee, ShieldCheck, Star, ShieldCheckIcon, ArrowLeft, XCircle } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { getSocket } from '@/lib/socket'
import axios from 'axios'

export default function PartnerTripPage() {
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    fetchTripDetails()
    const socket = getSocket()

    // Join a room for this booking to receive private updates
    socket.emit('join', { userId: id, role: 'partner' });

    socket.on('booking-status-changed', (data) => {
      if (data.status === 'cancelled') {
        setStatus('cancelled');
        fetchTripDetails();
      }
    });

    return () => {
      socket.off('booking-status-changed')
    }
  }, [id])

  const fetchTripDetails = async () => {
    try {
      const { data } = await axios.get(`/api/user/booking/${id}`)
      if (data.success) {
        setBooking(data.booking)
        setStatus(data.booking.status)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch('/api/partner/booking/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id, status: newStatus })
      })
      const data = await res.json()

      if (data.success) {
        setStatus(newStatus)
        // Notify user via socket
        const socket = getSocket()
        socket.emit('update-booking-status', {
          bookingId: id,
          userId: booking.user._id || booking.user,
          status: newStatus
        })

        if (newStatus === 'completed') {
          setTimeout(() => router.push('/partner/dashboard'), 2000)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-white font-bold tracking-widest uppercase text-gray-400">
      Loading Trip Details...
    </div>
  )

  if (status === 'cancelled') {
    return (
      <div className="h-screen w-screen bg-white flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-8 border-4 border-red-100">
          <XCircle size={48} />
        </div>
        <h1 className="text-4xl font-black text-neutral-900 tracking-tighter mb-4">Trip Cancelled</h1>
        <div className="bg-neutral-50 px-6 py-4 rounded-2xl mb-10 border border-neutral-100">
          <p className="text-neutral-400 text-[10px] font-black uppercase tracking-widest mb-1">Reason from User</p>
          <p className="text-neutral-900 font-bold">{booking?.cancelReason || "No reason specified"}</p>
        </div>
        <button
          onClick={() => router.push('/partner/dashboard')}
          className="px-12 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-black/20"
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-white font-bold tracking-widest uppercase text-gray-400">
      Loading Trip Details...
    </div>
  )

  if (!booking) return (
    <div className="h-screen w-screen flex items-center justify-center bg-white font-bold tracking-widest uppercase text-gray-400">
      Trip not found
    </div>
  )

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center text-neutral-900 hover:scale-105 transition-transform"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Active Mission</h1>
              <p className="text-neutral-400 text-[11px] font-bold uppercase tracking-[0.2em]">ID: #{id?.toString().slice(-6).toUpperCase()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-neutral-100">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-neutral-600">On Duty</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Navigation Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-neutral-100 aspect-[16/10] relative group">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?saddr=${encodeURIComponent(booking.pickup.address)}&daddr=${encodeURIComponent(booking.drop.address)}&output=embed`}
                className="grayscale opacity-80 contrast-125 brightness-90 group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
              <div className="absolute top-6 left-6 flex gap-3">
                <div className="px-5 py-2.5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                  <Navigation2 size={14} className="animate-bounce" />
                  Live Route
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-10 shadow-xl border border-neutral-100">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-400">Trip Sequence</h3>
                <div className="px-4 py-1.5 bg-neutral-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                  Next Stop: {status === 'accepted' ? 'Pickup' : 'Drop-off'}
                </div>
              </div>

              <div className="relative pl-16 space-y-12">
                <div className="absolute left-[23px] top-2 bottom-2 w-1 bg-gradient-to-b from-black via-neutral-200 to-neutral-100 rounded-full" />

                <div className="relative">
                  <div className={`absolute -left-[45px] top-0 w-12 h-12 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center transition-all duration-500 ${status === 'accepted' || status === 'in_progress' || status === 'completed' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-base font-black text-neutral-900">Pickup Location</p>
                    <p className="text-[11px] font-bold text-neutral-400 mt-1 max-w-md">{booking.pickup.address}</p>
                  </div>
                </div>

                <div className="relative">
                  <div className={`absolute -left-[45px] top-0 w-12 h-12 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center transition-all duration-500 ${status === 'in_progress' || status === 'completed' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                    <Navigation size={20} />
                  </div>
                  <div>
                    <p className="text-base font-black text-neutral-900">Drop-off Destination</p>
                    <p className="text-[11px] font-bold text-neutral-400 mt-1 max-w-md">{booking.drop.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Action Side */}
          <div className="space-y-8">
            <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-neutral-100">
              <div className="text-center mb-10">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-neutral-900 rounded-[32px] flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                    {booking.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center text-white border-4 border-white">
                    <ShieldCheckIcon size={20} />
                  </div>
                </div>
                <h4 className="text-2xl font-black text-neutral-900 tracking-tight">{booking.user?.name || 'Customer'}</h4>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mt-1">Passenger Info</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-neutral-50 p-5 rounded-[28px] border border-neutral-100">
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-2">Earning</p>
                  <p className="text-2xl font-black text-neutral-900 flex items-center gap-1">
                    <IndianRupee size={20} />
                    {booking.fare}
                  </p>
                </div>
                <div className="bg-neutral-50 p-5 rounded-[28px] border border-neutral-100 text-center">
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-2">Method</p>
                  <div className="px-3 py-1 bg-white rounded-full border border-neutral-200 inline-block">
                    <p className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">{booking.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {status === 'accepted' && (
                  <button
                    onClick={() => updateStatus('in_progress')}
                    className="w-full py-6 bg-black text-white rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-neutral-800 shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all active:scale-[0.98]"
                  >
                    <Navigation size={18} />
                    Start Mission
                  </button>
                )}

                {status === 'in_progress' && (
                  <button
                    onClick={() => updateStatus('completed')}
                    className="w-full py-6 bg-green-500 text-white rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-green-600 shadow-[0_20px_40px_rgba(34,197,94,0.2)] transition-all active:scale-[0.98]"
                  >
                    <CheckCircle2 size={18} />
                    Complete Mission
                  </button>
                )}

                {status === 'completed' && (
                  <div className="p-6 bg-green-50 border border-green-100 rounded-[28px] flex flex-col items-center gap-2 text-green-700 text-center">
                    <CheckCircle2 size={32} className="mb-2" />
                    <span className="font-black text-sm uppercase tracking-widest">Task Completed!</span>
                    <p className="text-[10px] font-medium opacity-70">Redirecting to home base...</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <button className="py-4 bg-neutral-100 text-neutral-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-colors">
                    Support
                  </button>
                  <button className="py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-colors">
                    SOS
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 text-white rounded-[40px] p-10 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-orange-400">
                    <Star size={20} fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-widest">Top Rated</h4>
                    <p className="text-[10px] text-neutral-500 font-bold">Maintenance active</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Your safety performance is exceptional. Keep following traffic rules to earn 2x bonus points this week.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <Navigation size={200} className="rotate-45" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
