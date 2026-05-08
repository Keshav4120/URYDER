'use client'
import { motion } from 'motion/react'
import React from 'react'


const KPI_Config: Record<string, {
    iconBg: string,
    iconColor: string,
    cardHover: string
}> = {
    totalPartners: {
        iconBg: "bg-purple-50",
        iconColor: "text-purple-700",
        cardHover: "hover:shadow-purple-100/60"
    },
    approved: {
        iconBg: "bg-blue-50",
        iconColor: "text-blue-700",
        cardHover: "hover:shadow-blue-100/60"
    },
    pending: {
        iconBg: "bg-amber-50",
        iconColor: "text-amber-800",
        cardHover: "hover:shadow-amber-100/60"
    },
    rejected: {
        iconBg: "bg-red-50",
        iconColor: "text-red-800",
        cardHover: "hover:shadow-red-100/60"
    }
}
function KPI({ label, value, icon, variant }: any) {
    const style = KPI_Config[variant]
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`bg-white rounded-2xl p-5 border-gray-100 shadow-sm cursor-default relative overflow-hidden group ${style.cardHover}`}>
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity 
                duration-300
                rounded-2xl ${style.iconBg}`} style={{ zIndex: 0 }} />
            <div className='relative z-10'>
                <motion.div
                    whileHover={{
                        scale: 1.1,
                        rotate: -6
                    }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${style.iconBg} ${style.iconColor}`}
                >
                    {icon}
                </motion.div>
                <p className='text-gray-400 text-xs font-semibold uppercase mb-1'>{label}</p>

                <motion.div
                    className='text-3xl font-extrabold text-gray-950 leading-tight'
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    {value}
                </motion.div>

            </div>

        </motion.div>
    )
}

export default KPI