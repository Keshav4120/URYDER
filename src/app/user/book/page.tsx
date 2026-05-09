'use client'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Bike, Car, Truck, Bus, MapPin, Search, Navigation, Clock, Shield, Star, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const VEHICLE_TYPES = [
  { id: 'bike', title: 'Bike', icon: Bike, desc: 'Quick & Solo', price: '₹10/km' },
  { id: 'car', title: 'Car', icon: Car, desc: 'Comfortable', price: '₹25/km' },
  { id: 'auto', title: 'Auto', icon: Navigation, desc: 'Affordable', price: '₹15/km' },
  { id: 'truck', title: 'Truck', icon: Truck, desc: 'Heavy Loads', price: '₹50/km' },
]

export default function BookPage() {
  const [pickup, setPickup] = useState('')
  const [drop, setDrop] = useState('')
  const [selectedType, setSelectedType] = useState('car')
  const router = useRouter()
  const [loadingLocation, setLoadingLocation] = useState(false)

  const getCurrentLocation = () => {
    setLoadingLocation(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data.display_name) {
            setPickup(data.display_name);
          } else {
            setPickup(`${latitude},${longitude}`);
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          setPickup(`${latitude},${longitude}`);
        }
        setLoadingLocation(false);
      }, (error) => {
        console.error("Error getting location:", error);
        setLoadingLocation(false);
        alert("Could not get your location. Please check permissions.");
      });
    } else {
      setLoadingLocation(false);
      alert("Geolocation is not supported by your browser.");
    }
  }

  const handleSearch = () => {
    if (pickup && drop) {
      router.push(`/user/search?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}&type=${selectedType}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="grid md:grid-cols-5 h-full">
            {/* Left Side: Form */}
            <div className="md:col-span-2 p-8 border-r border-gray-100">
              <h1 className="text-2xl font-black text-gray-900 mb-6">Plan Your Trip</h1>
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pickup Location</label>
                    <button 
                      onClick={getCurrentLocation}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-1"
                    >
                      {loadingLocation ? 'Locating...' : 'Current Location'}
                    </button>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Enter pickup address"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black transition-all"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">Drop Location</label>
                  <div className="relative">
                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Enter destination"
                      value={drop}
                      onChange={(e) => setDrop(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3 block">Vehicle Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {VEHICLE_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left ${
                        selectedType === type.id
                          ? 'border-black bg-black text-white shadow-lg scale-[1.02]'
                          : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                      }`}
                    >
                      <type.icon size={20} className={selectedType === type.id ? 'text-white' : 'text-gray-400'} />
                      <p className="font-bold text-sm mt-2">{type.title}</p>
                      <p className={`text-[10px] ${selectedType === type.id ? 'text-gray-400' : 'text-gray-400'}`}>{type.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={!pickup || !drop}
                className="w-full mt-8 py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all"
              >
                <Search size={18} />
                Search Available Vehicles
              </button>
            </div>

            {/* Right Side: Map */}
            <div className="hidden md:col-span-3 bg-gray-50 relative overflow-hidden group">
               {(pickup || drop) ? (
                 <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps?q=${encodeURIComponent((pickup || '') + (drop ? ' to ' + drop : ''))}&output=embed`}
                    className="grayscale opacity-50 contrast-125"
                  ></iframe>
               ) : (
                 <>
                   <div className="absolute inset-0 bg-[url('https://www.google.com/maps/about/images/home/home-map.jpg')] bg-cover bg-center opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent" />
                 </>
               )}
               
               <div className="relative z-10 p-12 h-full flex flex-col justify-between pointer-events-none">
                  <div>
                    <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold uppercase tracking-widest text-black shadow-sm border border-gray-100">Smart Booking</span>
                    <h2 className="text-4xl font-black text-gray-900 mt-4 leading-tight">
                      Move Anything,<br />Anywhere in Seconds.
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
                      <Clock className="text-black mb-3" size={24} />
                      <h3 className="font-bold text-sm">Instant Match</h3>
                      <p className="text-[10px] text-gray-500 mt-1">Get connected to nearby partners instantly.</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
                      <Shield className="text-black mb-3" size={24} />
                      <h3 className="font-bold text-sm">Secure Rides</h3>
                      <p className="text-[10px] text-gray-500 mt-1">Every trip is insured and monitored.</p>
                    </div>
                  </div>
               </div>

               {/* Animated Element */}
               <motion.div
                 animate={{ 
                   x: [0, 100, 0],
                   y: [0, -50, 0],
                   rotate: [0, 10, 0]
                 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute bottom-20 right-20 opacity-10 pointer-events-none"
               >
                 <Car size={300} strokeWidth={1} />
               </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section: Recent/Recommended */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                <Star size={24} />
              </div>
              <div>
                <p className="font-black text-lg">4.9/5</p>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">User Rating</p>
              </div>
           </div>
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                <Navigation size={24} />
              </div>
              <div>
                <p className="font-black text-lg">10M+</p>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Km Covered</p>
              </div>
           </div>
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
                <Shield size={24} />
              </div>
              <div>
                <p className="font-black text-lg">Verified</p>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Safe Platform</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
