'use client'
import React from "react";
import { motion } from "motion/react";
import { TwitterIcon, FacebookIcon, InstagramIcon, LinkedinIcon } from "./Icons";

function Footer() {
    return (
        <div className="w-full bg-black text-white">
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto px-6 py-16"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-12">
                    <div>
                        <h2 className="text-2xl font-bold tracking-wide">URYDER</h2>
                        <p className="mt-4 text-gray-400 text-sm leading-relaxed">Book any vehicle for your daily commute or long-distance travel with ease and comfort. Uryder provides reliable and affordable rides for everyone.</p>


                        <div className="flex gap-4 mt-6">
                            {[FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    whileHover={{ y: -3 }}
                                    href="#"
                                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20  hover:bg-white hover:text-black transition"
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center text-gray-500 text-xs gap-4">
                    <p>© {new Date().getFullYear()} Uryder. All rights reserved.</p>
                </div>
            </motion.div>

        </div>
    )
}

export default Footer