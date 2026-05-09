'use client'

import React from 'react'
import { motion } from 'motion/react'
import {
  Code2,
  Cpu,
  Globe2,
  Zap,
  Mail,
  ExternalLink,
  ChevronRight,
  Database,
  Terminal,
  Layers
} from 'lucide-react'
import Image from 'next/image'

const TechnicalStack = [
  { name: 'Next.js 15', icon: Globe2, description: 'Cutting-edge frontend performance' },
  { name: 'Node.js', icon: Terminal, description: 'Scalable backend infrastructure' },
  { name: 'Socket.io', icon: Zap, description: 'Real-time state synchronization' },
  { name: 'MongoDB', icon: Database, description: 'Flexible & robust data modeling' },
  { name: 'Zustand', icon: Layers, description: 'Modern state management' },
  { name: 'Tailwind CSS', icon: Code2, description: 'Premium UI/UX development' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900">
      {/* Immersive Founder Hero */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent animate-pulse" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 inline-block border border-blue-500/20">
              The Founder's Vision
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-8">
              Keshav <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Jindal.</span>
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-medium">
              Software Engineer & Creator of URYDER. Graduating 2027 from Chitkara University,
              obsessed with building real-time ecosystems that move the world forward.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-[80px] p-1 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-neutral-900 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Cpu size={120} className="text-blue-500/20 mb-4 animate-pulse" />
                  <p className="text-blue-400 font-black text-6xl tracking-tighter">KJ</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Story / Summary */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-10">Summary</h2>
          <p className="text-3xl md:text-5xl font-black text-neutral-900 leading-[1.2] mb-12">
            "I build scalable platforms using Next.js, Node.js, and WebSockets,
            integrating everything from IoT telemetry to AI-powered assistants."
          </p>
          <div className="h-1 w-20 bg-neutral-100 mx-auto rounded-full" />
        </div>
      </section>

      {/* Experience & Engineering */}
      <section className="py-32 bg-neutral-50 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Experience</span>
              <h3 className="text-4xl font-black text-neutral-900 mt-4 mb-6 tracking-tight">60+ End-to-End Systems.</h3>
              <p className="text-neutral-500 text-lg leading-relaxed">
                As a freelance developer, I've engineered real-time control workflows using ESP32,
                Arduino, and cloud integrations. From IoT automation to enterprise-style control dashboards,
                my focus is on high-performance communication layers and robust API workflows.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-white rounded-[32px] border border-neutral-200/50 shadow-sm">
                <p className="text-3xl font-black text-neutral-900 mb-1">URYDER</p>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Ride Sharing</p>
              </div>
              <div className="p-8 bg-white rounded-[32px] border border-neutral-200/50 shadow-sm">
                <p className="text-3xl font-black text-neutral-900 mb-1">RTC</p>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Real-Time Chat</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {TechnicalStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-white rounded-[40px] border border-neutral-200/60 shadow-sm hover:shadow-xl transition-all group"
              >
                <tech.icon size={32} className="text-neutral-300 group-hover:text-blue-500 transition-colors mb-6" />
                <h4 className="font-black text-lg text-neutral-900 mb-2">{tech.name}</h4>
                <p className="text-xs font-medium text-neutral-400 leading-relaxed">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-black rounded-[64px] p-12 md:p-24 text-white relative overflow-hidden">
          <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8">
                Chitkara <br /><span className="text-blue-500">University.</span>
              </h2>
              <p className="text-neutral-400 text-lg font-medium max-w-md">
                B.E. in Computer Science and Engineering (2023 - 2027).
                Deep diving into Data Structures, Algorithms, and System Design.
              </p>
            </div>
            <div className="space-y-6">
              {[
                'Object Oriented Programming',
                'Database Management Systems',
                'Operating Systems',
                'Advanced Data Structures'
              ].map((course, i) => (
                <div key={i} className="flex items-center gap-4 py-4 border-b border-white/10">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="font-bold text-lg">{course}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-neutral-400 mb-10">Get In Touch</h2>
          <p className="text-4xl md:text-6xl font-black text-neutral-900 mb-12 tracking-tight">
            Let's build something that matters.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="mailto:08keshavjindal10@gmail.com" className="px-10 py-5 bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-2xl shadow-blue-500/20 hover:scale-105 transition-all">
              <Mail size={18} /> Send Email
            </a>
            <button className="px-10 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-2xl shadow-black/20 hover:scale-105 transition-all">
              View Full Portfolio <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
