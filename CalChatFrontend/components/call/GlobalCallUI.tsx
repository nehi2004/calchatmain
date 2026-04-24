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
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
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

        if (!outgoingCall) return

        callUserIdRef.current = outgoingCall.userId
        setCallUserName(outgoingCall.userName)
        setCallType("voice")
        setCallStatus("calling")
        setIsMuted(false)
    }, [outgoingCall])

    useEffect(() => {
        if (!connection) return

        connection.on("CallAccepted", async data => {
            if (!outgoingCallRef.current) return

            stopMedia()

            callUserIdRef.current = data.fromUserId
            setCallUserName(outgoingCallRef.current.userName || data.fromUserName || "User")
            setCallType("voice")
            setCallStatus("calling")

            createPeer()

            const stream = await getMicStream()
            if (!stream) return

            stream.getTracks().forEach(track => {
                peerRef.current?.addTrack(track, stream)
            })

            const offer = await peerRef.current!.createOffer()
            await peerRef.current!.setLocalDescription(offer)

            await connection.invoke("SendOffer", JSON.stringify(offer), data.fromUserId)
        })

        connection.on("ReceiveAnswer", async data => {
            if (!peerRef.current) return
            await peerRef.current.setRemoteDescription(
                new RTCSessionDescription(JSON.parse(data.answer))
            )
            setCallStatus("connected")
        })

        connection.on("ReceiveIceCandidate", async data => {
            if (data.candidate && peerRef.current) {
                await peerRef.current.addIceCandidate(
                    new RTCIceCandidate(JSON.parse(data.candidate))
                )
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
            if (!data || !connection) return

            stopMedia()

            callUserIdRef.current = data.fromUserId
            setCallUserName(data.fromUserName || "User")
            setCallType("voice")
            setCallStatus("connected")

            createPeer()

            const stream = await getMicStream()
            if (!stream) return

            stream.getTracks().forEach(track => {
                peerRef.current?.addTrack(track, stream)
            })

            await peerRef.current!.setRemoteDescription(
                new RTCSessionDescription(JSON.parse(data.offer))
            )

            const answer = await peerRef.current!.createAnswer()
            await peerRef.current!.setLocalDescription(answer)

            await connection.invoke("SendAnswer", JSON.stringify(answer), data.fromUserId)

            pendingOfferData.current = null
        }

        window.addEventListener("start-call", handler)
        return () => window.removeEventListener("start-call", handler)
    }, [connection, pendingOfferData])

    const toggleMute = () => {
        if (!localStream.current) return
        const audioTrack = localStream.current.getAudioTracks()[0]
        if (!audioTrack) return

        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
    }

    const handleEndCall = async () => {
        if (connection && callUserIdRef.current) {
            const chatId = localStorage.getItem("chatId")
            await connection.invoke("EndCall", callUserIdRef.current, chatId)
        }
        cleanupCall()
    }

    if (!callType) return null

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/65 backdrop-blur-md">
            <div className="relative w-[390px] overflow-hidden rounded-[32px] border border-white/15 bg-[radial-gradient(circle_at_top,#1e293b_0%,#0f172a_45%,#020617_100%)] p-6 shadow-[0_30px_80px_-28px_rgba(2,6,23,0.85)]">
                <div className="relative text-center">
                    <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Voice Call</p>
                    <div className="relative mx-auto mt-8 mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-white/10 ring-8 ring-white/5">
                        <span className="relative text-5xl font-semibold text-white">
                            {callUserName?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                    </div>

                    <h2 className="text-3xl font-semibold tracking-tight text-white">{callUserName}</h2>
                    <p className="mt-2 text-sm text-slate-300">
                        {callStatus === "calling" ? "Calling..." : "Connected"}
                    </p>

                    {isMuted && (
                        <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-center text-xs font-medium text-rose-200">
                            Your microphone is muted
                        </div>
                    )}

                    <div className="mt-10 flex items-center justify-center gap-4">
                        <button
                            onClick={toggleMute}
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl transition ${isMuted ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-white/15"}`}
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