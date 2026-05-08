"use client"
import AnimatedCard from '@/components/AnimatedCard'
import DocPreview from '@/components/DocPreview'
import { IPartnerBank } from '@/models/partnerBank.model'
import { IPartnerDocs } from '@/models/partnerDocs.model'
import type { IUser } from '@/models/user.model'
import type { IVehicle } from '@/models/vehicle.model'
import axios from 'axios'
import { ArrowLeft, Car, CheckCircle, Clock, FileText, Landmark, ShieldCheck, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"

function page() {
    const { id } = useParams()
    const [data, setData] = useState<IUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [vehicle, setVehicle] = useState<IVehicle | null>(null)
    const [documents, setDocuments] = useState<IPartnerDocs | null>(null)
    const [bankProof, setBankProof] = useState<IPartnerBank | null>(null)
    const [showApproved, setShowApprove] = useState(false)
    const [showRejected, setShowReject] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")
    const router = useRouter()
    const handleGetPartner = async () => {
        try {
            const { data } = await axios.get(`/api/admin/reviews/partner/${id}`)
            setData(data.partner)
            setVehicle(data.vehicle)
            setDocuments(data.documents)
            setBankProof(data.bankProof)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        handleGetPartner()
    }, [])

    if (loading) {
        return (
            <div
                className='min-h-screen grid place-items-center text-gray-500'
            >
                Loading Partner...
            </div>
        )
    }
    const handleApprove = async () => {
        try {
            const { data } = await axios.get(`/api/admin/reviews/partner/${id}/approve`)
            console.log(data)
            handleGetPartner()
        } catch (error) {
            console.log(error)
        }
    }
    const handleReject = async () => {
        try {
            const { data } = await axios.post(`/api/admin/reviews/partner/${id}/reject`, { rejectionReason })
            console.log(rejectionReason)
            console.log(data)
            handleGetPartner()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='min-h-screen bg-linear-to-br from-gray-100 to-gray-200'>
            <div className='sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b'>
                <div className='max-w-7xl mx-auto px-4 h-16 flex items-center gap-4'>
                    <button onClick={() => router.back()} className='w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition'>
                        <ArrowLeft size={18} />
                    </button>
                    <div className='flex-1'>
                        <div className='font-semibold text-lg'>{data?.name}</div>
                        <div className='text-xs text-gray-600' >{data?.email}</div>
                    </div>
                    {
                        data?.partnerStatus === "approved" ? (
                            <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-green-100 text-green-700'>
                                <CheckCircle size={14} />
                                Approved
                            </div>
                        ) : data?.partnerStatus === "rejected" ? (
                            <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-red-100 text-red-700'>
                                <XCircle size={14} />
                                Rejected
                            </div>
                        ) : (
                            <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-yellow-100 text-yellow-700'>
                                <Clock size={14} />
                                Pending
                            </div>
                        )}
                </div>

            </div>

            <main className='max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10'>
                <div className='lg:col-span-2 space-y-8'>
                    <AnimatedCard title="Vehicle Details" icon={<Car size={18} />}>
                        <div className='space-y-4'>
                            <div className='flex justify-between text-sm'>
                                <span className='text-gray-500'>Vehicle Type</span>
                                <span className='font-semibold'>{vehicle?.type || "-"}</span>
                            </div>

                            <div className='flex justify-between text-sm'>
                                <span className='text-gray-500'>Registration Number</span>
                                <span className='font-semibold'>{vehicle?.number || "-"}</span>
                            </div>
                            <div className='flex justify-between text-sm'>
                                <span className='text-gray-500'>Model</span>
                                <span className='font-semibold'>{vehicle?.vechicleModel || "-"}</span>
                            </div>
                        </div>
                    </AnimatedCard>
                    <AnimatedCard title="Vehicle Documents" icon={<FileText size={18} />}>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                            <DocPreview label={"Aadhar"} url={documents?.aadharUrl || ""} />
                            <DocPreview label={"RC"} url={documents?.rcUrl || ""} />
                            <DocPreview label={"License"} url={documents?.licenseUrl || ""} />
                        </div>
                    </AnimatedCard>
                </div>

                <div className='space-y-8'>
                    <AnimatedCard title="Bank Details" icon={<Landmark size={18} />}>
                        <div className='space-y-4'>
                            <div className='flex justify-between text-sm'>
                                <span className='text-gray-500'>Account Holder</span>
                                <span className='font-semibold'>{bankProof?.accountHolder || "-"}</span>
                            </div>

                            <div className='flex justify-between text-sm'>
                                <span className='text-gray-500'>Account Number</span>
                                <span className='font-semibold'>{bankProof?.accountNumber || "-"}</span>
                            </div>
                            <div className='flex justify-between text-sm'>
                                <span className='text-gray-500'>IFSC Code</span>
                                <span className='font-semibold'>{bankProof?.ifsc || "-"}</span>
                            </div>
                            <div className='flex justify-between text-sm'>
                                <span className='text-gray-500'>UPI ID</span>
                                <span className='font-semibold'>{bankProof?.upiId || "-"}</span>
                            </div>
                        </div>
                    </AnimatedCard>
                    {data?.partnerStatus === "pending" && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='bg-white p-6 rounded-[32px] p-8 shadow-xl space-y-6'>
                            <div className='flex items-center gap-2 font-semibold'>
                                <ShieldCheck size={18} className='text-orange-500' />
                                Admin Check
                            </div>
                            <p className='text-sm text-gray-500'>
                                Verify all documents carefully before approving.
                            </p>
                            <div className='flex flex-col gap-4'>

                                <button className='py-3 rounded-2xl bg-linear-to-r from-black to-gray-800  text-white font-semibold  hover:opacity-90 transition'
                                    onClick={() => { setShowApprove(true) }}>Approve</button>
                                <button className=' py-3  border font-semibold rounded-2xl  hover:bg-gray-100 transition' onClick={() => { setShowReject(true) }}>Reject</button>
                            </div>
                        </motion.div>
                    )}
                </div>

            </main>

            <AnimatePresence>
                {
                    showApproved && (
                        <motion.div
                            className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className='bg-white rounded-3xl p-6 w-full max-w-sm'
                            >
                                <h2 className='font-bold text-lg'>Approve Partner?</h2>
                                <p className='text-sm text-gray-500 mt-2'>Confirm all information before approving.</p>
                                <div className='flex gap-3 mt-6'>
                                    <button className='flex-1 py-2 rounded-xl  border' onClick={() => setShowApprove(false)}>Cancel</button>
                                    <button className='flex-1 py-2 rounded-xl  bg-black text-white ' onClick={() => { handleApprove(); setShowApprove(false) }}>Approve</button>
                                </div>

                            </motion.div>

                        </motion.div>
                    )
                }
            </AnimatePresence>

            <AnimatePresence>
                {
                    showRejected && (
                        <motion.div
                            className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className='bg-white rounded-3xl p-6 w-full max-w-sm'
                            >
                                <h2 className='font-bold text-lg'>Reject Partner?</h2>
                                <p className='text-sm text-gray-500 mt-2'>

                                    <textarea
                                        placeholder='Enter rejection reason (required)'
                                        className='w-full mt-3 border rounded-xl p-3 text-sm'
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        value={rejectionReason}
                                    />
                                </p>
                                <div className='flex gap-3 mt-6'>
                                    <button className='flex-1 py-2 rounded-xl  border' onClick={() => setShowReject(false)}>Cancel</button>
                                    <button className='flex-1 py-2 rounded-xl  bg-black text-white ' onClick={() => { handleReject(); setShowReject(false) }}>Reject</button>
                                </div>

                            </motion.div>

                        </motion.div>
                    )
                }
            </AnimatePresence>

        </div>
    )
}

export default page
