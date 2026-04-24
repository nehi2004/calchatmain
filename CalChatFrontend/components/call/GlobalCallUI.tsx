"use client"

import { useEffect, useRef, useState } from "react"
import { Mic, MicOff, PhoneOff } from "lucide-react"
import { useCall } from "@/context/CallContext"

type ActivePeer = {
    userId: string
    userName: string
    status: "calling" | "connected"
} | null

export default function GlobalCallUI() {
    const {
        connection,
        pendingOfferData,
        outgoingCall,
        clearOutgoingCall,
        acceptedIncomingCall,
        setAcceptedIncomingCall,
        endCall,
    } = useCall()

    const [activePeer, setActivePeer] = useState<ActivePeer>(null)
    const [isMuted, setIsMuted] = useState(false)

    const outgoingCallRef = useRef(outgoingCall)
    const activePeerRef = useRef<ActivePeer>(null)
    const peerRef = useRef<RTCPeerConnection | null>(null)
    const localStreamRef = useRef<MediaStream | null>(null)
    const remoteAudioRef = useRef<HTMLAudioElement>(null)

    const syncActivePeer = (peer: ActivePeer) => {
        activePeerRef.current = peer
        setActivePeer(peer)
    }

    const stopMedia = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop())
            localStreamRef.current = null
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
        syncActivePeer(null)
        setIsMuted(false)
        clearOutgoingCall()
        setAcceptedIncomingCall(false)
        pendingOfferData.current = null
        endCall()
    }

    const createPeer = () => {
        if (peerRef.current) {
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
            const targetUserId = activePeerRef.current?.userId
            if (event.candidate && targetUserId) {
                connection?.invoke("SendIceCandidate", JSON.stringify(event.candidate), targetUserId)
            }
        }

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
                cleanupCall()
            }
        }

        peerRef.current = pc
    }

    const getMicStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            localStreamRef.current = stream
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

        syncActivePeer({
            userId: outgoingCall.userId,
            userName: outgoingCall.userName,
            status: "calling",
        })
        setIsMuted(false)
    }, [outgoingCall])

    useEffect(() => {
        if (!connection) {
            return
        }

        const onAccepted = async (data: { fromUserId: string; fromUserName?: string }) => {
            if (!outgoingCallRef.current) {
                return
            }

            stopMedia()

            syncActivePeer({
                userId: data.fromUserId,
                userName: outgoingCallRef.current.userName || data.fromUserName || "User",
                status: "calling",
            })
            setIsMuted(false)

            createPeer()

            const stream = await getMicStream()
            if (!stream || !peerRef.current) {
                return
            }

            stream.getTracks().forEach(track => {
                peerRef.current?.addTrack(track, stream)
            })

            const offer = await peerRef.current.createOffer()
            await peerRef.current.setLocalDescription(offer)
            await connection.invoke("SendOffer", JSON.stringify(offer), data.fromUserId)
        }

        const onAnswer = async (data: { answer: string }) => {
            if (!peerRef.current) {
                return
            }

            await peerRef.current.setRemoteDescription(
                new RTCSessionDescription(JSON.parse(data.answer))
            )

            syncActivePeer(
                activePeerRef.current
                    ? { ...activePeerRef.current, status: "connected" }
                    : activePeerRef.current
            )
        }

        const onIce = async (data: { candidate?: string }) => {
            if (data.candidate && peerRef.current) {
                await peerRef.current.addIceCandidate(
                    new RTCIceCandidate(JSON.parse(data.candidate))
                )
            }
        }

        connection.on("CallAccepted", onAccepted)
        connection.on("ReceiveAnswer", onAnswer)
        connection.on("ReceiveIceCandidate", onIce)
        connection.on("CallEnded", cleanupCall)
        connection.on("CallRejected", cleanupCall)

        return () => {
            connection.off("CallAccepted", onAccepted)
            connection.off("ReceiveAnswer", onAnswer)
            connection.off("ReceiveIceCandidate", onIce)
            connection.off("CallEnded", cleanupCall)
            connection.off("CallRejected", cleanupCall)
        }
    }, [connection, clearOutgoingCall, endCall, pendingOfferData, setAcceptedIncomingCall])

    useEffect(() => {
        const processIncomingOffer = async () => {
            const data = pendingOfferData.current
            if (!data || !connection || !acceptedIncomingCall) {
                return
            }

            stopMedia()

            syncActivePeer({
                userId: data.fromUserId,
                userName: data.fromUserName || "User",
                status: "connected",
            })
            setIsMuted(false)

            createPeer()

            const stream = await getMicStream()
            if (!stream || !peerRef.current) {
                return
            }

            stream.getTracks().forEach(track => {
                peerRef.current?.addTrack(track, stream)
            })

            await peerRef.current.setRemoteDescription(
                new RTCSessionDescription(JSON.parse(data.offer))
            )

            const answer = await peerRef.current.createAnswer()
            await peerRef.current.setLocalDescription(answer)
            await connection.invoke("SendAnswer", JSON.stringify(answer), data.fromUserId)

            pendingOfferData.current = null
        }

        void processIncomingOffer()
    }, [acceptedIncomingCall, connection, pendingOfferData])

    const toggleMute = () => {
        const track = localStreamRef.current?.getAudioTracks()[0]
        if (!track) {
            return
        }

        track.enabled = !track.enabled
        setIsMuted(!track.enabled)
    }

    const handleEndCall = async () => {
        if (connection && activePeerRef.current?.userId) {
            const chatId = localStorage.getItem("chatId")
            try {
                await connection.invoke("EndCall", activePeerRef.current.userId, chatId)
            } catch (err) {
                console.error("EndCall error:", err)
            }
        }

        cleanupCall()
    }

    if (!activePeer) {
        return null
    }

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/65 backdrop-blur-md">
            <div className="relative w-[390px] overflow-hidden rounded-[32px] border border-white/15 bg-[radial-gradient(circle_at_top,#1e293b_0%,#0f172a_45%,#020617_100%)] p-6 shadow-[0_30px_80px_-28px_rgba(2,6,23,0.85)]">
                <div className="relative text-center">
                    <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Voice Call</p>

                    <div className="relative mb-8 mt-8 flex h-36 w-36 items-center justify-center rounded-full bg-white/10 ring-8 ring-white/5 mx-auto">
                        <span className="relative text-5xl font-semibold text-white">
                            {activePeer.userName?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                    </div>

                    <h2 className="text-3xl font-semibold tracking-tight text-white">
                        {activePeer.userName}
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">
                        {activePeer.status === "calling" ? "Calling..." : "Connected"}
                    </p>

                    {isMuted && (
                        <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-center text-xs font-medium text-rose-200">
                            Your microphone is muted
                        </div>
                    )}

                    <div className="mt-10 flex items-center justify-center gap-4">
                        <button
                            onClick={toggleMute}
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl transition ${isMuted ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-white/15"
                                }`}
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