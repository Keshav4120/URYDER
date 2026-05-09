'use client'
import react, { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { ArrowLeft, CheckCircle, Clock, ImageIcon, Truck, XCircle, ShieldCheck, Banknote, FileText } from 'lucide-react'
import { IUser } from '@/models/user.model'
import { vechicleType } from '@/models/vehicle.model'
import { motion, AnimatePresence } from 'motion/react'
import AnimatedCard from '@/components/AnimatedCard'
import DocPreview from '@/components/DocPreview'

interface IVehicle {
    _id: string;
    owner: IUser;
    type: vechicleType;
    vechicleModel: string;
    number: string;
    imageUrl?: string;
    rcUrl?: string;
    baseFare?: number;
    pricePerKm?: number;
    waitingCharge?: number;
    status: "approved" | "pending" | "rejected";
    rejectionReason?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function VehicleReviewPage() {
    const { id } = useParams()
    const router = useRouter()
    const [data, setData] = useState<IVehicle | null>(null)
    const [loading, setLoading] = useState(true)
    const [showApprove, setShowApprove] = useState(false)
    const [showReject, setShowReject] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")

    const loadVehicle = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`/api/admin/reviews/vehicle/${id}`)
            setData(res.data)
        } catch (error) {
            console.error("Error loading vehicle:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadVehicle()
    }, [id])

    const handleApprove = async () => {
        try {
            await axios.get(`/api/admin/reviews/vehicle/${id}/approve`)
            loadVehicle()
            setShowApprove(false)
        } catch (error) {
            console.error("Error approving vehicle:", error)
        }
    }

    const handleReject = async () => {
        try {
            await axios.post(`/api/admin/reviews/vehicle/${id}/reject`, { rejectionReason })
            loadVehicle()
            setShowReject(false)
        } catch (error) {
            console.error("Error rejecting vehicle:", error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading vehicle details...</p>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="min-h-screen grid place-items-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-500 text-lg mb-4">Vehicle not found</p>
                    <button onClick={() => router.back()} className="px-6 py-2 bg-black text-white rounded-xl">Go Back</button>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b'>
                <div className='max-w-7xl mx-auto px-4 h-16 flex items-center gap-4'>
                    <button onClick={() => router.back()} className='w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition'>
                        <ArrowLeft size={18} />
                    </button>
                    <div className='flex-1'>
                        <div className='font-semibold text-lg'>{data.owner.name}</div>
                        <div className='text-xs text-gray-600' >{data.owner.email}</div>
                    </div>
                    {data.status === "approved" ? (
                        <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-green-100 text-green-700'>
                            <CheckCircle size={14} />
                            Approved
                        </div>
                    ) : data.status === "rejected" ? (
                        <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-red-100 text-red-700'>
                            <XCircle size={14} />
                            Rejected
                        </div>
                    ) : (
                        <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-yellow-100 text-yellow-700'>
                            <Clock size={14} />
                            Pending Review
                        </div>
                    )}
                </div>
            </div>

            <main className='max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8'>
                {/* Left Column: Image and Details */}
                <div className='lg:col-span-2 space-y-8'>
                    {/* Vehicle Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='rounded-[32px] overflow-hidden shadow-xl bg-white border aspect-video relative'
                    >
                        {data.imageUrl ? (
                            <img src={data.imageUrl} alt={data.vechicleModel} className='w-full h-full object-cover' />
                        ) : (
                            <div className='w-full h-full grid place-items-center text-gray-300 bg-gray-100'>
                                <div className="flex flex-col items-center gap-2">
                                    <ImageIcon size={48} />
                                    <p className="text-sm">No image uploaded</p>
                                </div>
                            </div>
                        )}
                        <div className="absolute top-4 left-4">
                            <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-xs font-bold uppercase tracking-wider">
                                {data.type}
                            </div>
                        </div>
                    </motion.div>

                    {/* Vehicle Details Card */}
                    <AnimatedCard title={"Vehicle Information"} icon={<Truck size={18} />}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-4'>
                                <div className='flex justify-between items-center pb-2 border-b border-gray-50'>
                                    <span className='text-gray-500 text-sm'>Type</span>
                                    <span className='font-semibold capitalize'>{data.type}</span>
                                </div>
                                <div className='flex justify-between items-center pb-2 border-b border-gray-50'>
                                    <span className='text-gray-500 text-sm'>Model</span>
                                    <span className='font-semibold'>{data.vechicleModel}</span>
                                </div>
                                <div className='flex justify-between items-center pb-2 border-b border-gray-50'>
                                    <span className='text-gray-500 text-sm'>Plate Number</span>
                                    <span className='font-semibold text-blue-600 tracking-wider'>{data.number}</span>
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <div className='flex justify-between items-center pb-2 border-b border-gray-50'>
                                    <span className='text-gray-500 text-sm'>Registration Date</span>
                                    <span className='font-semibold'>{new Date(data.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className='flex justify-between items-center pb-2 border-b border-gray-50'>
                                    <span className='text-gray-500 text-sm'>Status</span>
                                    <span className={`font-semibold capitalize ${data.status === 'approved' ? 'text-green-600' : data.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                                        {data.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </AnimatedCard>

                    {/* Documents Card */}
                    {data.rcUrl && (
                        <AnimatedCard title="Vehicle Documents" icon={<FileText size={18} />}>
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                                <DocPreview label={"RC (Registration Certificate)"} url={data.rcUrl} />
                            </div>
                        </AnimatedCard>
                    )}

                    {/* Rejection Reason if any */}
                    {data.status === "rejected" && data.rejectionReason && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 rounded-[24px] bg-red-50 border border-red-100"
                        >
                            <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                                <XCircle size={18} />
                                Rejection Reason
                            </div>
                            <p className="text-red-600 text-sm leading-relaxed">
                                {data.rejectionReason}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Right Column: Fares and Actions */}
                <div className='space-y-8'>
                    {/* Fares Card */}
                    <AnimatedCard title={"Pricing Details"} icon={<Banknote size={18} />}>
                        <div className='space-y-5'>
                            <div className='flex justify-between items-center p-3 rounded-2xl bg-gray-50'>
                                <span className='text-gray-500 text-sm'>Base Fare</span>
                                <span className='font-bold text-lg'>₹{data.baseFare || 0}</span>
                            </div>
                            <div className='flex justify-between items-center p-3 rounded-2xl bg-gray-50'>
                                <span className='text-gray-500 text-sm'>Price Per KM</span>
                                <span className='font-bold text-lg'>₹{data.pricePerKm || 0}</span>
                            </div>
                            <div className='flex justify-between items-center p-3 rounded-2xl bg-gray-50'>
                                <span className='text-gray-500 text-sm'>Waiting Charge</span>
                                <span className='font-bold text-lg'>₹{data.waitingCharge || 0}<span className="text-xs font-normal text-gray-400 ml-1">/min</span></span>
                            </div>
                        </div>
                    </AnimatedCard>

                    {/* Admin Actions */}
                    {data.status === "pending" && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 space-y-6'
                        >
                            <div className='flex items-center gap-2 font-bold text-gray-900'>
                                <ShieldCheck size={20} className='text-orange-500' />
                                Admin Review
                            </div>
                            <p className='text-sm text-gray-500 leading-relaxed'>
                                Please verify the vehicle details and image before making a decision. Once approved, the vehicle will be active on the platform.
                            </p>
                            <div className='flex flex-col gap-3'>
                                <button
                                    className='w-full py-4 rounded-2xl bg-black text-white font-bold hover:bg-gray-900 transition-all shadow-lg shadow-black/10'
                                    onClick={() => setShowApprove(true)}
                                >
                                    Approve Vehicle
                                </button>
                                <button
                                    className='w-full py-4 rounded-2xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all'
                                    onClick={() => setShowReject(true)}
                                >
                                    Reject Application
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Modals */}
            <AnimatePresence>
                {showApprove && (
                    <motion.div
                        className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className='bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl'
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                                <CheckCircle size={32} />
                            </div>
                            <h2 className='font-bold text-2xl text-gray-900'>Approve Vehicle?</h2>
                            <p className='text-gray-500 mt-3'>
                                This will make the vehicle visible to users and ready for bookings.
                            </p>
                            <div className='flex gap-4 mt-8'>
                                <button
                                    className='flex-1 py-3 rounded-xl border font-semibold text-gray-600 hover:bg-gray-50 transition'
                                    onClick={() => setShowApprove(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className='flex-1 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition shadow-lg shadow-black/10'
                                    onClick={handleApprove}
                                >
                                    Yes, Approve
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {showReject && (
                    <motion.div
                        className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className='bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl'
                        >
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
                                <XCircle size={32} />
                            </div>
                            <h2 className='font-bold text-2xl text-gray-900'>Reject Application?</h2>
                            <div className='mt-6'>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for rejection</label>
                                <textarea
                                    placeholder='e.g. Image is not clear, invalid number plate...'
                                    className='w-full border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all'
                                    rows={4}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    value={rejectionReason}
                                />
                            </div>
                            <div className='flex gap-4 mt-8'>
                                <button
                                    className='flex-1 py-3 rounded-xl border font-semibold text-gray-600 hover:bg-gray-50 transition'
                                    onClick={() => setShowReject(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className='flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50'
                                    onClick={handleReject}
                                    disabled={!rejectionReason.trim()}
                                >
                                    Confirm Reject
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}