'use client'
import React, { useEffect, useState } from 'react'
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react'
import { Check, CheckCheck, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation';

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
    const [activeStep, setActiveStep] = useState(0);
    const { userData } = useSelector((state: RootState) => state.user)
    useEffect(() => {
        if (userData) {
            setActiveStep(userData.partnerOnboardingStep)
        }
    }, [userData])

    const handleStepClick = (step: Step, locked: boolean) => {
        if (step.route && !locked) {
            router.push(step.route);
        }
    };

    const progressPercentage = (Math.max(0, activeStep) / (TOTAL_STEPS - 1)) * 100;
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
                                const completed = index < activeStep;
                                const active = index === activeStep;
                                const locked = index > activeStep;
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


            </div>
        </div>
    )
}

export default PartnerDashboard