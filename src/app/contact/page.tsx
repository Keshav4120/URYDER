'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Globe,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronDown
} from 'lucide-react'
import { TwitterIcon, InstagramIcon, LinkedinIcon, FacebookIcon, YoutubeIcon } from '@/components/Icons'

const ContactInfo = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'support@uryder.com',
    description: 'Our team typically responds within 2 hours.',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: '+91 1800-URYDER',
    description: 'Available Mon-Sat, 9am - 6pm IST.',
    color: 'bg-green-50 text-green-600'
  },
  {
    icon: Clock,
    label: 'Support Hours',
    value: '24/7 Priority Support',
    description: 'For active rides and emergencies.',
    color: 'bg-purple-50 text-purple-600'
  }
]

const FAQs = [
  {
    question: "How do I become a URYDER partner?",
    answer: "You can sign up through our Partner Portal. You'll need a valid commercial license, vehicle registration documents, and to complete our verification process."
  },
  {
    question: "What cities is URYDER available in?",
    answer: "We are currently operating in Mumbai, Bangalore, and New Delhi, with plans to expand to 10 more cities by the end of the year."
  },
  {
    question: "How long does verification take?",
    answer: "Document verification typically takes 24-48 hours. Once approved, you can start accepting rides immediately."
  }
]

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-neutral-50 to-white -z-10" />
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-blue-100/40 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute top-40 left-[10%] w-72 h-72 bg-purple-100/40 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
              Get In Touch
            </span>
            <h1 className="mt-8 text-5xl md:text-7xl font-black text-neutral-900 tracking-tight leading-[1.1]">
              Let's build the future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 via-neutral-600 to-black">
                mobility together.
              </span>
            </h1>
            <p className="mt-8 text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Whether you're a rider with a question or a driver looking to partner,
              we're here to help you move forward.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-start">

            {/* Left: Info & Socials */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-8">
                {ContactInfo.map((info, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group flex gap-6 p-6 rounded-3xl hover:bg-neutral-50 transition-all duration-300 border border-transparent hover:border-neutral-100"
                  >
                    <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${info.color} shadow-sm group-hover:scale-110 transition-transform`}>
                      <info.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-1">{info.label}</h3>
                      <p className="text-xl font-bold text-neutral-900 mb-2">{info.value}</p>
                      <p className="text-neutral-500 text-sm leading-relaxed">{info.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-8 bg-neutral-900 rounded-[40px] text-white">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8">Connect With Us</h3>
                <div className="flex flex-wrap gap-4">
                  {[TwitterIcon, InstagramIcon, LinkedinIcon, FacebookIcon, YoutubeIcon, Globe].map((Icon, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ y: -4, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all border border-white/10 shadow-lg shadow-black/20"
                    >
                      <Icon size={22} />
                    </motion.button>
                  ))}
                </div>
                <div className="mt-12 pt-12 border-t border-white/10">
                  <p className="text-neutral-400 text-sm">Official Corporate HQ:</p>
                  <p className="text-white font-bold mt-2">
                    Level 12, Cyber City Tower B,<br />
                    DLF Phase 3, Gurugram, India 122002
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[48px] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-neutral-100 relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <h2 className="text-3xl font-black text-neutral-900 mb-2">Send a Message</h2>
                      <p className="text-neutral-500 mb-10">Fill out the form below and we'll get back to you.</p>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">Full Name</label>
                            <input
                              required
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="e.g. Rahul Sharma"
                              className="w-full px-8 py-5 bg-neutral-50 border border-neutral-100 rounded-3xl focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-neutral-900 transition-all outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">Email Address</label>
                            <input
                              required
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="rahul@example.com"
                              className="w-full px-8 py-5 bg-neutral-50 border border-neutral-100 rounded-3xl focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-neutral-900 transition-all outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">How can we help?</label>
                          <div className="relative">
                            <select
                              value={formData.subject}
                              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                              className="w-full px-8 py-5 bg-neutral-50 border border-neutral-100 rounded-3xl focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-neutral-900 transition-all outline-none appearance-none"
                            >
                              <option>General Inquiry</option>
                              <option>Partner Onboarding</option>
                              <option>Technical Support</option>
                              <option>Media & Press</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={20} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-4">Your Message</label>
                          <textarea
                            required
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Tell us what's on your mind..."
                            className="w-full px-8 py-5 bg-neutral-50 border border-neutral-100 rounded-3xl focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-neutral-900 transition-all outline-none resize-none"
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-6 bg-black text-white rounded-3xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all shadow-xl shadow-black/20 group"
                        >
                          Send Message
                          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-20"
                    >
                      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={48} />
                      </div>
                      <h2 className="text-4xl font-black text-neutral-900 mb-4">Message Sent!</h2>
                      <p className="text-neutral-500 text-lg mb-10 max-w-sm mx-auto">
                        Thanks for reaching out, {formData.name.split(' ')[0]}. We'll review your inquiry and get back to you shortly.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-10 py-4 bg-neutral-100 text-black rounded-2xl font-bold hover:bg-neutral-200 transition-all"
                      >
                        Send Another
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-neutral-50 py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-neutral-900 mb-4">Common Questions</h2>
            <p className="text-neutral-500">Quick answers to frequently asked questions.</p>
          </div>

          <div className="space-y-4">
            {FAQs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-neutral-200 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-neutral-50 transition-all"
                >
                  <span className="font-bold text-neutral-900">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`text-neutral-400 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 text-neutral-500 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-4xl font-black text-neutral-900 mb-4">Our Hubs</h2>
              <p className="text-neutral-500 text-lg">Operating across major metropolitan cities in India.</p>
            </div>
            <button className="flex items-center gap-3 text-black font-black uppercase tracking-widest text-sm hover:gap-5 transition-all">
              View All Locations <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { city: 'Mumbai', code: 'BOM', address: 'BKC Business District, Bandra East', color: 'bg-orange-500' },
              { city: 'Bangalore', code: 'BLR', address: 'HSR Layout Sector 2, Start-up Hub', color: 'bg-green-500' },
              { city: 'New Delhi', code: 'DEL', address: 'Cyber City, Phase II, Gurugram', color: 'bg-blue-500' },
            ].map((hub, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group p-10 bg-white border border-neutral-100 rounded-[48px] hover:shadow-2xl hover:shadow-neutral-200/50 transition-all duration-500"
              >
                <div className={`w-12 h-1 w-24 mb-10 ${hub.color} rounded-full`} />
                <span className="text-[10px] font-black text-neutral-300 tracking-[0.4em] uppercase">{hub.code}</span>
                <h3 className="text-3xl font-black text-neutral-900 mt-2 mb-6">{hub.city}</h3>
                <div className="flex items-start gap-3 text-neutral-500">
                  <MapPin size={20} className="shrink-0 mt-1" />
                  <p className="leading-relaxed">{hub.address}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto bg-black rounded-[64px] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
            Ready to ride with <br />the best?
          </h2>
          <p className="text-neutral-400 text-lg mb-12 max-w-xl mx-auto">
            Join thousands of satisfied riders and partners who trust URYDER for their daily commute.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-10 py-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-all">
              Book a Ride
            </button>
            <button className="px-10 py-6 bg-neutral-800 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-neutral-700 transition-all border border-neutral-700">
              Become a Partner
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
