'use client'
import axios from 'axios'
import { CheckCircle2, Clock, Truck, User, Users, Video, XCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import KPI from './KPI'
import TabButton from './TabButton'
import { motion, AnimatePresence } from 'motion/react'
import ContentList from './ContentList'

type Stats = {
    totalApprovedPartner: number
    totalPartner: number
    totalPendingPartner: number
    totalRejectedPartner: number
}
type Tab = "kyc" | "partner" | "vehicle"

function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [active, setActiveTab] = useState<Tab>("partner")
    const [partnerReviews, setPartnerReviews] = useState<any>()
    const [kycReviews, setKycReviews] = useState<any>()
    const [vehicleReviews, setVehicleReviews] = useState<any>()
    const handleGetData = async () => {
        try {
            const { data } = await axios.get("/api/admin/dashboard")
            setStats(data.stats)
            setPartnerReviews(data.pendingPartnerReviews)
        } catch (error) {
            console.log(error)
        }

    }
    useEffect(() => {
        handleGetData()
    }, [])

    return (
        <div className='min-h-screen bg-linear-to-br from-gray-100 to-gray-200'>
            <div className='sticky top-0 bg-white/80  backdrop-blur-lg border-b z-40'>
                <div className='max-w-7xl mx-auto h-16 px-6 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-2 cursor-pointer'>
                            <Link href={"/"}><Image src={"/logo.png"} alt='logo' width={44} height={44} priority /></Link>
                        </div>

                    </div>
                    <div className='flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-green-100 text-green-700'>
                        <User size={16} />
                        <span className='font-bold text-lg tracking-wide'>Admin</span>
                    </div>

                </div>

            </div>

            <main className='max-w-7xl mx-auto px-6 py-12 space-y-16'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                    <KPI label='Total Partners' value={stats?.totalPartner || 0} icon={<Users size={20} />} variant={"totalPartners"} />
                    <KPI label='Approved Partners' value={stats?.totalApprovedPartner || 0} icon={<CheckCircle2 size={20} />} variant={"approved"} />
                    <KPI label='Pending Partners' value={stats?.totalPendingPartner || 0} icon={<Clock size={20} />} variant={"pending"} />
                    <KPI label='Rejected Partners' value={stats?.totalRejectedPartner || 0} icon={<XCircle size={20} />} variant={"rejected"} />

                </div>


                <div className='bg-white rounded-2xl p-2 border border-gray-100 flex flex-wrap gap-2'>
                    <TabButton
                        active={active == "partner"}
                        count={partnerReviews?.length ?? 0}
                        icon={<Users size={15} />}
                        onClick={() => setActiveTab("partner")
                        }
                    >Pending Partners Reviews</TabButton>
                    <TabButton
                        active={active == "kyc"}
                        count={kycReviews?.length ?? 0}
                        icon={<Video size={15} />}
                        onClick={() => setActiveTab("kyc")
                        }
                    >Pending KYC Verification</TabButton>
                    <TabButton
                        active={active == "vehicle"}
                        count={vehicleReviews?.length ?? 0}
                        icon={<Truck size={15} />}
                        onClick={() => setActiveTab("vehicle")
                        }
                    >Pending Vehicle Documents</TabButton>

                </div>

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className='space-y-3'
                    >

                        {active == "partner" && <ContentList data={partnerReviews ?? []} type={"partner"} />}
                        {active == "kyc" && <ContentList data={kycReviews ?? []} type={"kyc"} />}
                        {active == "vehicle" && <ContentList data={vehicleReviews ?? []} type={"vehicle"} />}
                    </motion.div>
                </AnimatePresence>

            </main >

        </div >
    )
}

export default AdminDashboard