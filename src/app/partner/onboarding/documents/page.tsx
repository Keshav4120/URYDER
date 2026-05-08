'use client'
import React, { useState } from 'react'
import { motion } from "motion/react"
import { useRouter } from 'next/navigation'
import { ArrowLeft, FileCheck, Loader, UploadCloud } from 'lucide-react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { setUserData } from '@/redux/userSlice'
import { useEffect } from 'react'

type docsType = "aadhar" | "licence" | "rc"

function page() {
    const router = useRouter()
    const [docs, setDocs] = useState<Record<docsType, File | null>>({
        aadhar: null,
        licence: null,
        rc: null
    })
    const { userData } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if (userData && userData.partnerOnboardingStep < 1) {
            router.push('/partner/onboarding/vehicle')
        }
    }, [userData, router])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const handleDocs = async () => {
        setError("")
        setLoading(true)
        try {
            const fromData = new FormData();
            if (!docs.aadhar || !docs.licence || !docs.rc) {
                setError("Please upload all documents")

                setError("Please upload all documents")
                setLoading(false)
                return null
            }
            fromData.append("aadhar", docs.aadhar)
            fromData.append("licence", docs.licence)
            fromData.append("rc", docs.rc)
            const { data } = await axios.post("/api/partner/onboarding/documents", fromData)
            
            const userRes = await axios.get('/api/user/me')
            dispatch(setUserData(userRes.data))
            
            setLoading(false)
            router.push('/partner/onboarding/bank')
        } catch (error: any) {
            setError(error?.response?.data?.message ?? "Something went wrong")
            console.log(error)
            setLoading(false)
        }
    }
    const handleImage = (doc: docsType, file: File | null) => {
        if (!file) return

        setDocs(prev => ({ ...prev, [doc]: file }))
    }
    const isCompleted = docs.aadhar && docs.licence && docs.rc
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

                    <p className='text-xs text-gray-500 font-medium'>Step 2 of 3</p>
                    <h1 className='text-2xl font-bold mt-1'>Vehicle Documents</h1>
                    <p className='text-sm text-gray-500 mt-2'>Upload your documents</p>


                </div>

                <div className='mt-8 space-y-5'>
                    <motion.label
                        whileHover={{ scale: 1.02 }}
                        className='flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition'
                    >
                        <div>
                            <p className='text-sm font-semibold'>Aadhar / ID Proof</p>
                            <p className='text-xs text-gray-500'>Goverment issued ID</p>

                        </div>

                        <div className='flex items-center gap-4'>
                            {docs.aadhar ? <span className='text-xs text-green-500'>✓{docs.aadhar?.name}</span> : <span className='text-xs text-gray-400'>Upload</span>}
                            <div className="w-10 h-10 border rounded-full bg-black text-white flex items-center justify-center">
                                <UploadCloud size={18} />
                            </div>


                        </div>
                        <input type="file" hidden accept='image/*,.pdf' onChange={(e) => handleImage("aadhar", e.target.files?.[0] || null)} />

                    </motion.label>

                    <motion.label
                        whileHover={{ scale: 1.02 }}
                        className='flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition'
                    >
                        <div>
                            <p className='text-sm font-semibold'>Driving Licence</p>
                            <p className='text-xs text-gray-500'>Valid driving licence</p>

                        </div>

                        <div className='flex items-center gap-4'>
                            {docs.licence ? <span className='text-xs text-green-500'>✓{docs.licence?.name}</span> : <span className='text-xs text-gray-400'>Upload</span>}
                            <div className="w-10 h-10 border rounded-full bg-black text-white flex items-center justify-center">
                                <UploadCloud size={18} />
                            </div>


                        </div>
                        <input type="file" hidden accept='image/*,.pdf' onChange={(e) => handleImage("licence", e.target.files?.[0] || null)} />

                    </motion.label>


                    <motion.label
                        whileHover={{ scale: 1.02 }}
                        className='flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition'
                    >
                        <div>
                            <p className='text-sm font-semibold'>Vehicle RC</p>
                            <p className='text-xs text-gray-500'>Registration Certificate</p>

                        </div>

                        <div className='flex items-center gap-4'>
                            {docs.rc ? <span className='text-xs text-green-500'>✓{docs.rc?.name}</span> : <span className='text-xs text-gray-400'>Upload</span>}
                            <div className="w-10 h-10 border rounded-full bg-black text-white flex items-center justify-center">
                                <UploadCloud size={18} />
                            </div>
                            <input type="file" hidden accept='image/*,.pdf' onChange={(e) => handleImage("rc", e.target.files?.[0] || null)} />


                        </div>

                    </motion.label>
                </div>
                <div className='mt-6 flex items-start gap-3 text-xs text-gray-500'>
                    <FileCheck size={16} />
                    <p>Documents are securely stored and manually verified by our team.</p>
                </div>
                {error && <div className='mt-6 text-red-500 text-sm text-center'>{error}</div>}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDocs}
                    disabled={loading || !isCompleted}
                    className='mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition'
                >
                    {
                        loading ? <Loader className='text-white animate-spin' /> :
                            "Continue"
                    }
                </motion.button>
            </motion.div>


        </div>
    )
}

export default page
