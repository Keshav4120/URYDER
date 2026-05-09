'use client'
import React, { useEffect, useState } from 'react'
import { RootState } from '@/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '@/redux/userSlice';
import { motion } from 'motion/react'
import { Check, CheckCheck, Clock, Clock1, Lock, Video } from 'lucide-react'
import { useRouter } from 'next/navigation';
import RejectionCard from './RejectionCard';
import StatusCard from './StatusCard';
import ActionCard from './ActionCard';
import axios from 'axios';
import PricingModel from './PricingModel';
import { IVehicle } from '@/models/vehicle.model';

type Step = {
    id: number;
    title: string;
    route?: string;
};
const STEPS: Step[] = [
    { id: 1, title: "Vehicle", route: "/partner/onboarding/vehicle" },
    { id: 2, title: "Documents", route: "/partner/onboarding/documents" },
    { id: 3, title: "Bank Details", route: "/partner/onboarding/bank" },
    { id: 4, title: "Review" },
    { id: 5, title: "Video KYC" },
    { id: 6, title: "Pricing" },
    { id: 7, title: "Final Review" },
    { id: 8, title: "Live" }

];
const TOTAL_STEPS = STEPS.length;
const PartnerDashboard = () => {
    const router = useRouter();
    const dispatch = useDispatch()
    const [activeStep, setActiveStep] = useState(0);
    const { userData } = useSelector((state: RootState) => state.user)
    const [showPricing, setShowPricing] = useState(false)
    const [vehicleData, setVehicleData] = useState<IVehicle | null>(null)
    useEffect(() => {
        if (userData) {
            setActiveStep(userData.partnerOnboardingStep)
        }
    }, [userData])

    const handleGetPricing = async () => {
        try {
            const { data } = await axios.get("/api/partner/onboarding/pricing")
            setVehicleData(data.vehicle)
        } catch (error: any) {
            console.log(error)
            setVehicleData(null)
        }
    }

    const refreshPartnerData = async () => {
        try {
            const [{ data: user }, { data: pricing }] = await Promise.all([
                axios.get("/api/user/me"),
                axios.get("/api/partner/onboarding/pricing")
            ])
            dispatch(setUserData(user))
            setVehicleData(pricing.vehicle)
        } catch (error: any) {
            console.log("Partner dashboard refresh error:", error)
            await handleGetPricing()
        }
    }

    useEffect(() => {
        refreshPartnerData()
    }, [])

    useEffect(() => {
        const interval = window.setInterval(() => {
            refreshPartnerData()
        }, 10000)

        return () => window.clearInterval(interval)
    }, [])

    useEffect(() => {
        const handleFocus = () => {
            refreshPartnerData()
        }
        window.addEventListener("focus", handleFocus)
        return () => window.removeEventListener("focus", handleFocus)
    }, [])

    const handleStepClick = (step: Step, locked: boolean) => {
        if (step.id === 6 && userData?.videoKycStatus === "approved") {
            setShowPricing(true)
            return
        }
        if (step.route && !locked) {
            router.push(step.route);
        }
    };

    const currentStep = Math.min(Math.max(0, activeStep), TOTAL_STEPS - 1)
    const effectiveStep = vehicleData?.status === "approved" ? TOTAL_STEPS - 1 : currentStep
    const progressPercentage = (effectiveStep / (TOTAL_STEPS - 1)) * 100;
    return (
        <div className='min-h-screen bg-linear-to-br from-gray-100 to-gray-200 px-4 pt-28 pb-20'>
            <div className='max-w-7xl mx-auto space-y-12'>
                <div>
                    <h1 className='text-4xl font-bold'>Partner Dashboard</h1>
                    <p className='text-gray-600 mt-2'>Complete all steps to activate your account</p>
                </div>

                <div className='bg-white rounded-3xl p-10 shadow-xl border overflow-x-auto'>
                    <div className='relative min-w-[800px] w-full'>
                        <div className="absolute top-7 left-0 w-full h-[3px] bg-gray-200 bg-gray-200 rounded-full" />

                        <motion.div
                            animate={{
                                width: `${progressPercentage}%`,
                            }}
                            transition={{
                                duration: 0.6
                            }}
                            className="absolute top-7 left-0 h-[3px] bg-black rounded-full"
                        />

                        <div className='relative flex justify-between'>
                            {STEPS.map((s, index) => {
                                const completed = index < effectiveStep;
                                const active = index === effectiveStep;
                                const locked = index > effectiveStep;
                                return (
                                    <motion.div
                                        key={s.id}
                                        whileHover={!locked ? { scale: 1.1 } : {}}
                                        onClick={() => handleStepClick(s, locked)}
                                        className='flex flex-col items-center z-10 cursor-pointer'

                                    >

                                        <div
                                            className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all font-bold text-lg
                                        ${completed ? 'border-black bg-black text-white' :
                                                    active ? 'border-black bg-white text-black' : 'border-gray-300 text-gray-400 bg-white'
                                                }`}>
                                            {
                                                completed ? (
                                                    <Check size={20} />

                                                ) : locked ? (
                                                    <Lock size={20} />

                                                ) : (
                                                    s.id
                                                )}

                                        </div>

                                        <p className='mt-3 text-sm font-semibold text-center'>{s.title}</p>

                                    </motion.div>
                                )
                            })}

                        </div>
                    </div>

                </div>

                {
                    activeStep == 3 && userData?.partnerStatus === "rejected" && (
                        <RejectionCard
                            title="Partner Rejected"
                            reason={userData.rejectionReason}
                            actionLabel={`Review and Update`}
                            onAction={() => {
                                router.push('/partner/onboarding/vehicle')
                            }}
                        />
                    )
                }

                {
                    activeStep == 3 && userData?.partnerStatus === "pending" && (
                        <StatusCard
                            icon={<Clock size={18} />}
                            title={'Documents under review'}
                            desc={"Admin is verifying your documents."}
                        />
                    )
                }


                {
                    activeStep >= 4 && userData?.videoKycStatus === "rejected" ? (
                        <RejectionCard
                            title="Video Kyc Rejected"
                            reason={userData?.videoKycRejectionReason}
                            actionLabel="Request Re-KYC"
                            onAction={async () => {
                                await axios.post('/api/partner/video-kyc/request')
                                window.location.reload()
                            }}
                        />
                    ) : userData?.videoKycStatus === "re_requested" ? (
                        <StatusCard
                            icon={<Clock size={18} />}
                            title="Re-KYC Requested"
                            desc="Your request has been sent. Admin will schedule a new session shortly."
                        />
                    ) : activeStep == 4 && userData?.videoKycStatus === "approved" ? (
                        <StatusCard
                            icon={<Check size={18} />}
                            title={'Video Kyc Approved'}
                            desc={"You can now proceed to pricing."}
                        />
                    ) : activeStep == 4 && userData?.videoKycStatus === "in_progress" && userData.videoKycRoomId ? (
                        <ActionCard
                            icon={<Video size={18} />}
                            title={'Admin Started Video Kyc'}
                            desc={"You Can Join the Call To Complete Your Video Kyc."}
                            actionLabel="Join Call"
                            onAction={() => {
                                router.push(`/video-kyc/${userData?.videoKycRoomId}`)
                            }}
                        />
                    ) : activeStep == 4 ? (
                        <StatusCard
                            icon={<Clock size={18} />}
                            title={'Video Kyc Pending'}
                            desc={"Admin is verifying your video kyc."}
                        />
                    ) : null
                }
                {activeStep == 6 && vehicleData?.status === "pending" && (
                    <StatusCard
                        icon={<Clock size={18} />}
                        title={'Pricing Under Review'}
                        desc={"Admin is reviewing your pricing."}
                    />
                )}
                {activeStep == 6 && vehicleData?.status === "rejected" && (
                    <RejectionCard
                        title={"Vehicle Rejected"}
                        reason={vehicleData?.rejectionReason}
                        actionLabel="Edit Vehicle Information"
                        onAction={() => {
                            setShowPricing(true)
                        }}
                    />
                )}
                {activeStep == 6 && vehicleData?.status === "approved" && vehicleData?.isActive !== true && (
                    <StatusCard
                        icon={<CheckCheck size={18} />}
                        title={'All Checks Completed'}
                        desc={"Your application is in final review. We will notify you once it's live."}
                    />
                )}

                {effectiveStep >= 7 && vehicleData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='space-y-8'
                    >
                        <div className='bg-green-50 border border-green-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm'>
                            <div className='w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-200'>
                                <CheckCheck size={24} />
                            </div>
                            <div>
                                <h3 className='text-lg font-bold text-green-900'>You are Live!</h3>
                                <p className='text-green-700 text-sm'>Your vehicle is now active on the URYDER platform and ready to accept bookings.</p>
                            </div>
                        </div>

                        <div className='grid lg:grid-cols-2 gap-8'>
                            <div className='bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100'>
                                <div className='aspect-video relative'>
                                    {vehicleData.imageUrl ? (
                                        <img src={vehicleData.imageUrl} alt={vehicleData.vechicleModel} className='w-full h-full object-cover' />
                                    ) : (
                                        <div className='w-full h-full bg-gray-100 flex items-center justify-center text-gray-400'>No Image</div>
                                    )}
                                    <div className='absolute top-4 left-4'>
                                        <span className='px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm'>
                                            {vehicleData.type}
                                        </span>
                                    </div>
                                </div>
                                <div className='p-8 space-y-4'>
                                    <div className='flex justify-between items-end'>
                                        <div>
                                            <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Active Vehicle</p>
                                            <h2 className='text-2xl font-bold text-gray-900'>{vehicleData.vechicleModel}</h2>
                                        </div>
                                        <div className='px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold tracking-wider text-sm'>
                                            {vehicleData.number}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-6'>
                                <div className='bg-white rounded-[32px] p-8 shadow-xl border border-gray-100'>
                                    <h3 className='text-lg font-bold mb-6 flex items-center gap-2'>
                                        <CheckCheck size={18} className='text-green-500' />
                                        Pricing Configuration
                                    </h3>
                                    <div className='space-y-4'>
                                        <div className='flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-100'>
                                            <span className='text-gray-500 font-medium'>Base Fare</span>
                                            <span className='font-bold text-lg'>₹{vehicleData.baseFare}</span>
                                        </div>
                                        <div className='flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-100'>
                                            <span className='text-gray-500 font-medium'>Price Per KM</span>
                                            <span className='font-bold text-lg'>₹{vehicleData.pricePerKm}</span>
                                        </div>
                                        <div className='flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-100'>
                                            <span className='text-gray-500 font-medium'>Waiting Charge</span>
                                            <span className='font-bold text-lg'>₹{vehicleData.waitingCharge}<span className='text-xs font-normal text-gray-400 ml-1'>/min</span></span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    className='w-full py-5 rounded-[24px] bg-black text-white font-bold hover:bg-neutral-800 transition-all shadow-xl shadow-black/10'
                                    onClick={() => setShowPricing(true)}
                                >
                                    Update Pricing or Info
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>


            <PricingModel
                open={showPricing}
                onClose={() => setShowPricing(false)}
                onSave={handleGetPricing}
                data={vehicleData}
            />
        </div>
    )
}

export default PartnerDashboard