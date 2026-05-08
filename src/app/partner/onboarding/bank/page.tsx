'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { useRouter } from 'next/navigation'
import { ArrowLeft, BadgeCheck, CheckCircle, CreditCard, FileCheck, Landmark, Loader, Phone, UploadCloud } from 'lucide-react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { setUserData } from '@/redux/userSlice'
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
function page() {
    const router = useRouter()
    const [accountHolder, setAccountHolder] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [ifsc, setIfsc] = useState("")
    const [upiId, setUpiId] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    
    const { userData } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if (userData) {
            if (userData.partnerOnboardingStep < 1) {
                router.push('/partner/onboarding/vehicle')
            } else if (userData.partnerOnboardingStep < 2) {
                router.push('/partner/onboarding/documents')
            }
        }
    }, [userData, router])

    const sanitizedIFSC = ifsc.trim().toUpperCase()

    const isNameValid = accountHolder.trim().length >= 3
    const isAccountNumberValid = accountNumber.trim().length >= 9
    const isIfscValid = IFSC_REGEX.test(sanitizedIFSC)
    const isMobileNumberValid = mobileNumber.trim().length === 10


    const canSubmit = isNameValid && isAccountNumberValid && isIfscValid && isMobileNumberValid
    const handleBank = async () => {
        setLoading(true)
        setError("")
        if (!accountHolder || !accountNumber || !ifsc || !mobileNumber) {
            setError("All fields are required")
            setLoading(false)
            return
        }
        try {
            const { data } = await axios.post('/api/partner/onboarding/bank', {
                accountHolder,
                accountNumber,
                ifsc: sanitizedIFSC,
                upiId,
                mobileNumber,
            })
            
            const userRes = await axios.get('/api/user/me')
            dispatch(setUserData(userRes.data))
            
            setLoading(false)
            router.push('/')
        } catch (error: any) {
            setError(error.response.data.message ?? "Internal Server Error")
            setLoading(false)
        }


    }

    useEffect(() => {
        const handlefetch = async () => {
            try {
                const { data } = await axios.get('/api/partner/onboarding/bank')
                setAccountHolder(data.partnerBank.accountHolder)
                setAccountNumber(data.partnerBank.accountNumber)
                setIfsc(data.partnerBank.ifsc)
                setUpiId(data.partnerBank.upiId)
                setMobileNumber(data.mobileNumber)
            } catch (error: any) {
                console.log(error)

            }
        }
        handlefetch()
    }, [])
    return (
        <div className='min-h-screen bg-white flex items-center justify-center px-4'>
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8'
            >
                <div className='relative text-center'
                >

                    <button className='absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition' onClick={() => { router.back() }}>
                        <ArrowLeft size={18} />
                    </button>

                    <p className='text-xs text-gray-500 font-medium'>Step 3 of 3</p>
                    <h1 className='text-2xl font-bold mt-1'>Bank & Payment Setup</h1>
                    <p className='text-sm text-gray-500 mt-2'>Used for partner payouts</p>


                </div>


                <div className='mt-8 space-y-6'>
                    <div>
                        <label htmlFor="ahn" className='text-xs font-semibold text-gray-500'>Account holder name</label>
                        <div className='flex items-center gap-2 mt-2 '>
                            <div className='text-gray-400'><BadgeCheck size={18} /></div>
                            <input type="text" id='ahn' placeholder='As per bank records' className={`flex-1 border-b pb-2 text-sm focus:outline-none 
                            ${!isNameValid && accountHolder.trim().length > 0 ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-black"} `}
                                onChange={(e) => setAccountHolder(e.target.value)} value={accountHolder} />
                        </div>
                        {!isNameValid && accountHolder.trim().length > 0 && <p className="text-xs text-red-500 mt-1">Minimum 3 characters required</p>}
                    </div>
                    <div>
                        <label htmlFor="acn" className='text-xs font-semibold text-gray-500'>Bank account number</label>
                        <div className='flex items-center gap-2 mt-2 '>
                            <div className='text-gray-400'><CreditCard size={18} /></div>
                            <input type="text" id='acn' placeholder='Enter account number' className={`flex-1 border-b pb-2 text-sm focus:outline-none ${!isAccountNumberValid && accountNumber.length > 0 ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-black"}`} onChange={(e) => setAccountNumber(e.target.value)} value={accountNumber} />
                        </div>
                        {!isAccountNumberValid && accountNumber.length > 0 && <p className="text-xs text-red-500 mt-1">Minimum 9 characters required</p>}
                    </div>
                    <div>
                        <label htmlFor="ifsc" className='text-xs font-semibold text-gray-500'>IFSC code</label>
                        <div className='flex items-center gap-2 mt-2 '>
                            <div className='text-gray-400'><Landmark size={18} /></div>
                            <input type="text" id='ifsc' placeholder='HDFC0001234' className={`flex-1 border-b pb-2 text-sm focus:outline-none ${!isIfscValid && sanitizedIFSC.length > 0 ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-black"}`} onChange={(e) => setIfsc(e.target.value)} value={ifsc.toUpperCase()} />
                        </div>
                        {!isIfscValid && sanitizedIFSC.length > 0 && <p className="text-xs text-red-500 mt-1">Enter Valid 11 digit IFSC code</p>}
                    </div>
                    <div>
                        <label htmlFor="mn" className='text-xs font-semibold text-gray-500'>Mobile number</label>
                        <div className='flex items-center gap-2 mt-2 '>
                            <div className='text-gray-400'><Phone size={18} /></div>
                            <input type="text" id='mn' placeholder='Mobile Number' className={`flex-1 border-b pb-2 text-sm focus:outline-none ${!isMobileNumberValid && mobileNumber.length > 0 ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-black"}`} onChange={(e) => setMobileNumber(e.target.value)} value={mobileNumber} />
                        </div>
                        {!isMobileNumberValid && mobileNumber.length > 0 && <p className="text-xs text-red-500 mt-1">Enter Valid 10 digit Mobile Number</p>}
                    </div>
                    <div>
                        <label htmlFor="upi" className='text-xs font-semibold text-gray-500'>UPI ID (optional)</label>
                        <div className='flex items-center gap-2 mt-2 '>
                            <input type="text" id='upi' placeholder='UPI ID' className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black' onChange={(e) => setUpiId(e.target.value)} value={upiId} />
                        </div>
                    </div>
                </div>
                <div className='mt-6 flex items-start gap-3 text-xs text-gray-500'>
                    <CheckCircle size={16} className='mt-0.5' />
                    <p>Bank dettails are verified before first payout .
                        This usually takes 1-2 business days.
                    </p>
                </div>

                {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className='mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition'
                    disabled={loading || !canSubmit}
                    onClick={handleBank}
                >
                    {loading ? <Loader size={16} className='animate-spin' /> : "Continue"}
                </motion.button>
            </motion.div>


        </div>
    )
}

export default page