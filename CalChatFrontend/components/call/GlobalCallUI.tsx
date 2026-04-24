"use client"

import { useEffect, useRef, useState } from "react"
import { Mic, MicOff, PhoneOff, PhoneOutgoing } from "lucide-react"
import { useCall } from "@/context/CallContext"

export default function GlobalCallUI() {
    const { connection, pendingOfferData, outgoingCall, clearOutgoingCall } = useCall()

    const [callType, setCallType] = useState<"voice" | null>(null)
    const [callUserName, setCallUserName] = useState("User")
    const [callStatus, setCallStatus] = useState<"calling" | "connected">("calling")
    const [isMuted, setIsMuted] = useState(false)

    const callUserIdRef = useRef<string | null>(null)
    const outgoingCallRef = useRef(outgoingCall)
    const peerRef = useRef<RTCPeerConnection | null>(null)
    const localStream = useRef<MediaStream | null>(null)
    const remoteAudioRef = useRef<HTMLAudioElement>(null)

    const stopMedia = () => {
        if (localStream.current) {
            localStream.current.getTracks().forEach(track => {
                track.enabled = true
                track.stop()
            })
            localStream.current = null
        }

        if (peerRef.current) {
            peerRef.current.ontrack = null
            peerRef.current.onicecandidate = null
            peerRef.current.close()
            peerRef.current = null
        }

        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = null
        }
    }

    const cleanupCall = () => {
        stopMedia()
        callUserIdRef.current = null
        setIsMuted(false)
        setCallType(null)
        setCallStatus("calling")
        clearOutgoingCall()
    }

    const createPeer = () => {
        if (peerRef.current) {
            peerRef.current.ontrack = null
            peerRef.current.onicecandidate = null
            peerRef.current.close()
            peerRef.current = null
        }

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                {
                    urls: "turn:openrelay.metered.ca:80",
                    username: "openrelayproject",
                    credential: "openrelayproject",
                },
                {
                    urls: "turn:openrelay.metered.ca:443",
                    username: "openrelayproject",
                    credential: "openrelayproject",
                },
            ],
        })

        pc.ontrack = event => {
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = event.streams[0]
                remoteAudioRef.current.play().catch(() => undefined)
            }
        }

        pc.onicecandidate = event => {
            if (event.candidate && callUserIdRef.current) {
                connection?.invoke(
                    "SendIceCandidate",
                    JSON.stringify(event.candidate),
                    callUserIdRef.current
                )
            }
        }

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
                cleanupCall()
            }
        }

        peerRef.current = pc
    }

    const getMicStream = async (): Promise<MediaStream | null> => {
        if (localStream.current) {
            localStream.current.getTracks().forEach(track => track.stop())
            localStream.current = null
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                },
            })

            stream.getAudioTracks().forEach(track => {
                track.enabled = true
            })

            localStream.current = stream
            return stream
        } catch (err) {
            console.error("Mic access failed:", err)
            return null
        }
    }

    useEffect(() => {
        outgoingCallRef.current = outgoingCall

        if (!outgoingCall) {
            return
        }

        callUserIdRef.current = outgoingCall.userId
        setCallUserName(outgoingCall.userName)
        setCallType("voice")
        setCallStatus("calling")
        setIsMuted(false)
    }, [outgoingCall])

    useEffect(() => {
        if (!connection) {
            return
        }

        connection.on("CallAccepted", async data => {
            if (!outgoingCallRef.current) {
                return
            }

            stopMedia()

            const targetId = data.fromUserId
            callUserIdRef.current = targetId
            localStorage.setItem("chatId", data.chatId || localStorage.getItem("chatId") || "")
            setCallUserName(outgoingCallRef.current.userName || data.fromUserName || "User")
            setCallType("voice")
            setCallStatus("calling")
            setIsMuted(false)

            createPeer()

            const stream = await getMicStream()
            if (!stream) {
                return
            }

            stream.getTracks().forEach(track => {
                peerRef.current?.addTrack(track, stream)
            })

            try {
                const offer = await peerRef.current!.createOffer()
                await peerRef.current!.setLocalDescription(offer)

                await connection.invoke("SendOffer", JSON.stringify(offer), targetId)
            } catch (err) {
                console.error("Offer creation failed:", err)
            }
        })

        connection.on("ReceiveAnswer", async data => {
            if (!peerRef.current) {
                return
            }

            try {
                await peerRef.current.setRemoteDescription(
                    new RTCSessionDescription(JSON.parse(data.answer))
                )
                setCallStatus("connected")
            } catch (err) {
                console.error("setRemoteDescription failed:", err)
            }
        })

        connection.on("ReceiveIceCandidate", async data => {
            if (data.candidate && peerRef.current) {
                try {
                    await peerRef.current.addIceCandidate(
                        new RTCIceCandidate(JSON.parse(data.candidate))
                    )
                } catch (err) {
                    console.warn("ICE candidate error:", err)
                }
            }
        })

        connection.on("CallEnded", cleanupCall)
        connection.on("CallRejected", cleanupCall)

        return () => {
            connection.off("CallAccepted")
            connection.off("ReceiveAnswer")
            connection.off("ReceiveIceCandidate")
            connection.off("CallEnded")
            connection.off("CallRejected")
        }
    }, [connection, clearOutgoingCall])

    useEffect(() => {
        const handler = async () => {
            const data = pendingOfferData.current
            if (!data || !connection) {
                return
            }

            stopMedia()

            const targetId = data.fromUserId
            callUserIdRef.current = targetId
            setCallUserName(data.fromUserName || "User")
            setCallType("voice")
            setCallStatus("connected")
            setIsMuted(false)

            createPeer()

            const stream = await getMicStream()
            if (!stream) {
                return
            }

            stream.getTracks().forEach(track => {
                peerRef.current?.addTrack(track, stream)
            })

            try {
                await peerRef.current!.setRemoteDescription(
                    new RTCSessionDescription(JSON.parse(data.offer))
                )

                const answer = await peerRef.current!.createAnswer()
                await peerRef.current!.setLocalDescription(answer)

                await connection.invoke("SendAnswer", JSON.stringify(answer), targetId)
            } catch (err) {
                console.error("Answer creation failed:", err)
            }

            pendingOfferData.current = null
        }

        window.addEventListener("start-call", handler)
        return () => window.removeEventListener("start-call", handler)
    }, [connection, pendingOfferData])

    const toggleMute = async () => {
        if (!peerRef.current) {
            return
        }

        const sender = peerRef.current.getSenders().find(item => item.track?.kind === "audio")
        if (!sender) {
            return
        }

        const newMuted = !isMuted

        if (newMuted) {
            localStream.current?.getTracks().forEach(track => track.stop())
            localStream.current = null
            await sender.replaceTrack(null)
        } else {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const newTrack = stream.getAudioTracks()[0]
            await sender.replaceTrack(newTrack)
            localStream.current = stream
        }

        setIsMuted(newMuted)
    }

    const handleEndCall = async () => {
        if (connection && callUserIdRef.current) {
            const chatId = localStorage.getItem("chatId")

            try {
                await connection.invoke("EndCall", callUserIdRef.current, chatId)
            } catch (err) {
                console.error("EndCall invoke error:", err)
            }
        }

        cleanupCall()
    }

    if (!callType) {
        return null
    }

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/60 backdrop-blur-md">
            <div className="relative w-[390px] overflow-hidden rounded-[32px] border border-white/15 bg-[radial-gradient(circle_at_top,#1e293b_0%,#0f172a_45%,#020617_100%)] p-6 shadow-[0_30px_80px_-28px_rgba(2,6,23,0.85)]">
                <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.22),transparent_65%)]" />

                <div className="relative">
                    <div className="mb-10 flex items-center justify-between text-slate-300">
                        <div>
                            <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
                                Voice Call
                            </p>
                            <p className="mt-2 text-sm text-slate-300">
                                {callStatus === "calling" ? "Connecting study partner" : "Live conversation"}
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                            <PhoneOutgoing className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="relative mx-auto mb-10 flex h-36 w-36 items-center justify-center rounded-full bg-white/10 ring-8 ring-white/5">
                        <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-400/10" />
                        <span className="relative text-5xl font-semibold text-white">
                            {callUserName?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                    </div>

                    <div className="text-center">
                        <h2 className="text-3xl font-semibold tracking-tight text-white">
                            {callUserName}
                        </h2>
                        <p className="mt-2 text-sm text-slate-300">
                            {callStatus === "calling" ? "Ringing..." : "Connected"}
                        </p>
                    </div>

                    {isMuted && (
                        <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-center text-xs font-medium text-rose-200">
                            Your microphone is muted
                        </div>
                    )}

                    <div className="mt-10 flex items-center justify-center gap-4">
                        <button
                            onClick={toggleMute}
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl transition ${isMuted ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-white/15"}`}
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </button>

                        <button
                            onClick={handleEndCall}
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600"
                        >
                            <PhoneOff className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            <audio ref={remoteAudioRef} autoPlay playsInline />
        </div>
    )
}