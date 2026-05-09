'use client'
import React, { Suspense, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin, Navigation, Filter, Star, Info, ChevronRight, ArrowLeft, Loader2, IndianRupee, MapIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import { getSocket } from '@/lib/socket'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null)
  
  const pickup = searchParams.get('pickup') || 'Current Location'
  const drop = searchParams.get('drop') || 'Destination'
  const type = searchParams.get('type') || 'car'

  useEffect(() => {
    // 1. Get user location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserCoords(coords)
        fetchNearbyVehicles(coords)
      },
      (err) => {
        console.error(err)
        setLoading(false)
      }
    )

    // 2. Setup socket for real-time updates
    const socket = getSocket()
    socket.on('partner-location-updated', (data) => {
       // Update vehicle position in real-time if it's already in our list
       setVehicles(prev => prev.map(v => {
         if (v.owner._id === data.partnerId) {
           return { ...v, owner: { ...v.owner, currentLocation: { coordinates: [data.lng, data.lat] } } }
         }
         return v
       }))
    })

    return () => {
      socket.off('partner-location-updated')
    }
  }, [])

  const fetchNearbyVehicles = async (coords: {lat: number, lng: number}) => {
    try {
      const { data } = await axios.post('/api/user/vehicles/nearby', {
        lng: coords.lng,
        lat: coords.lat,
        type: type,
        radius: 20000 // 20km as requested
      })
      if (data.success) {
        setVehicles(data.vehicles)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Left Sidebar: Results */}
      <div className="w-full md:w-[450px] h-full flex flex-col border-r border-gray-100 z-20 bg-white">
        <div className="p-6 border-b border-gray-100">
          <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Back</span>
          </button>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-black" />
                <div className="w-0.5 h-10 bg-gray-200 my-1" />
                <div className="w-2.5 h-2.5 rounded-full border-2 border-black bg-white" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pickup</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{pickup}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Drop</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{drop}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900">Available {type}s</h2>
            <button className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-black transition-colors">
              <Filter size={18} />
            </button>
          </div>

          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-sm font-bold uppercase tracking-widest">Finding nearby vehicles...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.length > 0 ? (
                vehicles.map((v, idx) => (
                  <motion.div
                    key={v._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => router.push(`/user/checkout?vehicleId=${v._id}&pickup=${pickup}&drop=${drop}&fare=${v.baseFare}&type=${type}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden">
                        {v.imageUrl ? (
                          <img src={v.imageUrl} alt={v.vechicleModel} className="w-full h-full object-cover" />
                        ) : (
                          <Navigation className="text-gray-300 -rotate-45" size={32} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-900">{v.vechicleModel}</h3>
                          <p className="text-lg font-black text-black flex items-center">
                            <IndianRupee size={16} />
                            {v.baseFare}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-orange-500">
                            <Star size={12} fill="currentColor" />
                            <span className="text-[10px] font-bold">4.8</span>
                          </div>
                          <span className="text-gray-300">|</span>
                          <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{v.owner.name}</p>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-300 group-hover:text-black transition-colors" size={20} />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                   <p className="text-gray-400 font-bold">No vehicles found for this type.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Content: Map */}
      <div className="flex-1 bg-gray-100 relative overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?q=${encodeURIComponent(pickup + ' to ' + drop)}&output=embed`}
          className="grayscale opacity-80"
        ></iframe>
        
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/20 to-transparent" />
        
        {/* Floating Overlay for Map Stats */}
        <div className="absolute top-8 right-8 z-30 space-y-4">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40 flex items-center gap-4"
           >
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                <Navigation size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Trip Distance</p>
                <p className="text-lg font-black text-black leading-none">12.4 km</p>
              </div>
           </motion.div>
        </div>

        {/* User Location Marker Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500 rounded-full"
              />
              <div className="w-4 h-4 bg-blue-600 border-2 border-white rounded-full relative z-10 shadow-lg" />
           </div>
        </div>

        {/* Info Card */}
        <div className="absolute bottom-8 right-8 z-30 max-w-xs">
           <div className="bg-black text-white p-6 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Info size={20} className="text-gray-400" />
                <h3 className="font-bold text-sm uppercase tracking-widest">Traffic Info</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Expect minor delays near your destination due to construction. Estimated arrival is still on time.
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-white font-bold tracking-widest uppercase text-gray-400">Loading Map...</div>}>
      <SearchContent />
    </Suspense>
  )
}
