'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/store';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Mic, MicOff, ShieldCheck, Video, VideoOff, XCircle } from 'lucide-react';
import axios from 'axios';
import { AnimatePresence, motion } from 'motion/react';
import { useParams, useRouter } from 'next/navigation';

function page() {
    const { roomId } = useParams<{ roomId: string }>()
    const router = useRouter()
    const { userData } = useSelector((state: RootState) => state.user)
    const containerRef = useRef<HTMLDivElement>(null)
    const [joined, setJoined] = useState(false)
    const previewRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [camOn, setCamOn] = useState(true)
    const [micOn, setMicOn] = useState(true)
    const [isJoining, setIsJoining] = useState(false)

    // Admin review state
    const [showApproveModal, setShowApproveModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')
    const [reviewDone, setReviewDone] = useState(false)
    const [reviewResult, setReviewResult] = useState<'approved' | 'rejected' | null>(null)
    const [panelDismissed, setPanelDismissed] = useState(false)

    useEffect(() => {
        if (joined) return;
        let localStream: MediaStream
        const init = async () => {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                setStream(localStream)
                if (previewRef.current) {
                    previewRef.current.srcObject = localStream
                }
            } catch (error) {
                console.error("Camera access denied:", error)
            }
        }
        init()
        return () => {
            localStream?.getTracks().forEach(track => track.stop())
        }
    }, [joined])

    const toggleCam = () => {
        if (!stream) return;
        stream.getVideoTracks().forEach(t => { t.enabled = !t.enabled })
        setCamOn(prev => !prev)
    }

    const toggleMic = () => {
        if (!stream) return;
        stream.getAudioTracks().forEach(t => { t.enabled = !t.enabled })
        setMicOn(prev => !prev)
    }

    const startCall = async () => {
        if (!containerRef.current) return;
        setIsJoining(true);
        try {
            const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
            const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appId, serverSecret!, roomId, userData?._id.toString()!, userData?.name ?? "User"
            )
            const zp = ZegoUIKitPrebuilt.create(kitToken)
            zp.joinRoom({
                container: containerRef.current,
                scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
                showPreJoinView: false,
                turnOnCameraWhenJoining: camOn,
                turnOnMicrophoneWhenJoining: micOn,
            });
            setJoined(true)
        } catch (error) {
            console.log(error)
            setIsJoining(false)
        }
    }

    const handleApprove = async () => {
        try {
            await axios.post('/api/admin/video-kyc/review', { roomId, status: 'approved' })
            setReviewResult('approved')
            setReviewDone(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handleReject = async () => {
        if (!rejectionReason.trim()) return;
        try {
            await axios.post('/api/admin/video-kyc/review', { roomId, status: 'rejected', reason: rejectionReason })
            setReviewResult('rejected')
            setReviewDone(true)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='min-h-screen bg-black text-white flex flex-col'>

            {/* Navbar */}
            <div className='px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 flex justify-between items-center shrink-0'>
                <div className='flex items-center gap-2 sm:gap-3'>
                    <Link href={"/"}><Image src={"/logo.png"} alt='logo' width={36} height={36} priority /></Link>
                    <div>
                        <p className='text-sm font-semibold leading-none'>URYDER</p>
                        <p className='text-[11px] text-gray-500 mt-0.5'>
                            {userData?.role === "admin" ? "Admin Verification" : "Video KYC"}
                        </p>
                    </div>
                </div>
                <span className='flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-400 font-medium'>
                    <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
                    Secure Session
                </span>
            </div>

            {/* Pre-join lobby */}
            <div className='flex-1 flex items-center justify-center px-4 py-8 sm:py-10'>
                {!joined && (
                    <div className='w-full max-w-5xl flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>

                        {/* ── Camera Preview ── */}
                        <div className='relative w-full'>
                            <div className='absolute -inset-1 rounded-3xl bg-gradient-to-br from-white/10 to-white/0 blur-xl pointer-events-none' />
                            <div className='relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl'>
                                <video
                                    ref={previewRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className='w-full h-[160px] sm:h-[260px] md:h-[320px] object-cover'
                                />

                                {/* cam-off overlay */}
                                {!camOn && (
                                    <div className='absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center gap-2'>
                                        <VideoOff size={36} className='text-white/40' />
                                        <p className='text-xs text-white/40'>Camera is off</p>
                                    </div>
                                )}

                                {/* top badge */}
                                <div className='absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 text-[11px] font-medium'>
                                    <span className={`w-1.5 h-1.5 rounded-full ${camOn ? 'bg-red-500 animate-pulse' : 'bg-white/30'}`} />
                                    {camOn ? 'Camera Preview' : 'Camera Off'}
                                </div>

                                {/* Toggle buttons */}
                                <div className='absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-2.5'>
                                    <button
                                        onClick={toggleCam}
                                        title={camOn ? "Turn off camera" : "Turn on camera"}
                                        className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-95
                                            ${camOn
                                                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                                                : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'}`}
                                    >
                                        {camOn ? <Video size={15} /> : <VideoOff size={15} />}
                                        <span className='hidden sm:inline'>{camOn ? 'Camera' : 'Camera Off'}</span>
                                    </button>

                                    <button
                                        onClick={toggleMic}
                                        title={micOn ? "Mute microphone" : "Unmute microphone"}
                                        className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-95
                                            ${micOn
                                                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                                                : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'}`}
                                    >
                                        {micOn ? <Mic size={15} /> : <MicOff size={15} />}
                                        <span className='hidden sm:inline'>{micOn ? 'Mic' : 'Mic Off'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ── Info & Join ── */}
                        <div className='flex flex-col gap-5 w-full'>
                            <div>
                                <p className='text-[11px] uppercase tracking-widest text-gray-500 mb-2'>
                                    {userData?.role === "admin" ? "Partner Verification" : "Identity Verification"}
                                </p>
                                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight'>
                                    Ready to join<br className='hidden sm:block' /> the call?
                                </h1>
                                <p className='text-gray-400 text-xs sm:text-sm mt-3 leading-relaxed'>
                                    {userData?.role === "admin"
                                        ? "You are about to start a Video KYC session with the partner. Ensure your camera and microphone are working."
                                        : "An URYDER admin will verify your identity. Make sure you're in a well-lit area with your ID ready."}
                                </p>
                            </div>

                            {/* Status indicators */}
                            <div className='flex flex-wrap gap-2 sm:gap-3'>
                                <div className={`flex items-center gap-2 border rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm transition-colors
                                    ${camOn ? 'bg-white/5 border-white/10 text-white' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                    <span className={`w-2 h-2 rounded-full ${camOn ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                    {camOn ? 'Camera on' : 'Camera off'}
                                </div>
                                <div className={`flex items-center gap-2 border rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm transition-colors
                                    ${micOn ? 'bg-white/5 border-white/10 text-white' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                    <span className={`w-2 h-2 rounded-full ${micOn ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                    {micOn ? 'Mic on' : 'Mic off'}
                                </div>
                            </div>

                            <button
                                onClick={startCall}
                                disabled={isJoining}
                                className='w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-semibold rounded-2xl hover:bg-gray-100 active:scale-95 transition-all text-sm sm:text-base disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2'
                            >
                                {isJoining ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    'Join Call →'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Call container — always mounted so containerRef.current is never null */}
                <div ref={containerRef} className={`fixed inset-0 w-full h-full z-40 ${joined ? 'block' : 'hidden'}`} />

                {/* ── Admin Review Panel (floats over the call) ── */}
                {joined && userData?.role === 'admin' && !reviewDone && !panelDismissed && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-center gap-3 shadow-2xl w-[calc(100%-2rem)] max-w-sm sm:max-w-md'
                    >
                        <div className='flex items-center gap-2 text-white text-sm font-semibold flex-1'>
                            <ShieldCheck size={16} className='text-emerald-400 shrink-0' />
                            Verify the partner's identity
                        </div>
                        <div className='flex gap-2 w-full sm:w-auto'>
                            <button
                                onClick={() => setShowApproveModal(true)}
                                className='flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-all active:scale-95'
                            >
                                <CheckCircle size={14} />
                                Approve
                            </button>
                            <button
                                onClick={() => setShowRejectModal(true)}
                                className='flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-400 text-white text-sm font-semibold rounded-xl transition-all active:scale-95'
                            >
                                <XCircle size={14} />
                                Reject
                            </button>
                            {/* Dismiss button */}
                            <button
                                onClick={() => setPanelDismissed(true)}
                                title='Dismiss panel'
                                className='flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all active:scale-95 shrink-0'
                            >
                                <XCircle size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Restore pill — shows when panel is dismissed */}
                {joined && userData?.role === 'admin' && !reviewDone && panelDismissed && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setPanelDismissed(false)}
                        className='fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2.5 text-white text-xs font-semibold shadow-2xl hover:bg-white/20 transition-all'
                    >
                        <ShieldCheck size={14} className='text-emerald-400' />
                        Review
                    </motion.button>
                )}

                {/* Review done banner */}
                {joined && userData?.role === 'admin' && reviewDone && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-2xl'
                    >
                        {reviewResult === 'approved'
                            ? <CheckCircle size={18} className='text-emerald-400' />
                            : <XCircle size={18} className='text-red-400' />
                        }
                        <span className='text-sm font-semibold text-white'>
                            KYC {reviewResult === 'approved' ? 'Approved' : 'Rejected'} — partner has been notified.
                        </span>
                        <button onClick={() => router.back()} className='ml-2 text-xs underline text-white/60 hover:text-white'>
                            Go back
                        </button>
                    </motion.div>
                )}
            </div>

            {/* ── Approve Modal ── */}
            <AnimatePresence>
                {showApproveModal && (
                    <motion.div
                        className='fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4'
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className='bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl'
                        >
                            <div className='flex items-center gap-2 font-bold text-lg text-gray-900'>
                                <CheckCircle size={20} className='text-emerald-500' />
                                Approve Video KYC?
                            </div>
                            <p className='text-sm text-gray-500 mt-2 leading-relaxed'>
                                The partner's identity has been verified. They will be moved to the next onboarding step.
                            </p>
                            <div className='flex gap-3 mt-6'>
                                <button
                                    className='flex-1 py-2.5 rounded-xl border text-sm font-medium text-gray-900 hover:bg-gray-50 transition'
                                    onClick={() => setShowApproveModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className='flex-1 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition'
                                    onClick={() => { handleApprove(); setShowApproveModal(false) }}
                                >
                                    Approve
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Reject Modal ── */}
            <AnimatePresence>
                {showRejectModal && (
                    <motion.div
                        className='fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4'
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className='bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl'
                        >
                            <div className='flex items-center gap-2 font-bold text-lg text-gray-900'>
                                <XCircle size={20} className='text-red-500' />
                                Reject Video KYC?
                            </div>
                            <p className='text-sm text-gray-500 mt-2'>
                                Provide a reason — the partner will see this on their dashboard.
                            </p>
                            <textarea
                                placeholder='Enter rejection reason (required)'
                                className='w-full mt-3 border rounded-xl p-3 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-black'
                                rows={3}
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                            />
                            <div className='flex gap-3 mt-4'>
                                <button
                                    className='flex-1 py-2.5 rounded-xl border text-sm font-medium text-gray-900 hover:bg-gray-50 transition'
                                    onClick={() => { setShowRejectModal(false); setRejectionReason('') }}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={!rejectionReason.trim()}
                                    className='flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-50 disabled:pointer-events-none'
                                    onClick={() => { handleReject(); setShowRejectModal(false) }}
                                >
                                    Reject
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}

export default page