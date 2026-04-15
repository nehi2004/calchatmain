"use client"

import { useEffect, useRef, useState } from "react"
import { PhoneOff, Mic, MicOff } from "lucide-react"
import { useCall } from "@/context/CallContext"

export default function GlobalCallUI() {

    const { connection, pendingOfferData } = useCall()

    const [callType, setCallType] = useState<"voice" | null>(null)
    const [callUserName, setCallUserName] = useState("User")
    const [callStatus, setCallStatus] = useState<"calling" | "connected">("calling")
    const [isMuted, setIsMuted] = useState(false)

    const callUserIdRef = useRef<string | null>(null)
    const peerRef = useRef<RTCPeerConnection | null>(null)
    const localStream = useRef<MediaStream | null>(null)
    const remoteAudioRef = useRef<HTMLAudioElement>(null)

    // ✅ KEY FIX: isMuted ref mirrors state — so closures always read latest value
    const isMutedRef = useRef(false)

    /* ================= CLEANUP (called before every new call too) ================= */
    const cleanupCall = () => {
        // Stop ALL local tracks — this is what actually silences mic
        if (localStream.current) {
            localStream.current.getTracks().forEach(t => {
                t.enabled = true   // re-enable before stop so browser releases mic
                t.stop()
            })
            localStream.current = null
        }

        // Close peer connection fully
        if (peerRef.current) {
            peerRef.current.ontrack = null
            peerRef.current.onicecandidate = null
            peerRef.current.close()
            peerRef.current = null
        }

        // Clear remote audio
        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = null
        }

        callUserIdRef.current = null
        isMutedRef.current = false
        setIsMuted(false)
        setCallType(null)
        setCallStatus("calling")
    }

    /* ================= CREATE PEER ================= */
    const createPeer = () => {

        // ✅ Always cleanup old peer first before creating new one
        if (peerRef.current) {
            peerRef.current.ontrack = null
            peerRef.current.onicecandidate = null
            peerRef.current.close()
            peerRef.current = null
        }

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },

                // 🔥 TURN SERVER (REQUIRED FOR PRODUCTION)
                {
                    urls: "turn:openrelay.metered.ca:80",
                    username: "openrelayproject",
                    credential: "openrelayproject"
                },
                {
                    urls: "turn:openrelay.metered.ca:443",
                    username: "openrelayproject",
                    credential: "openrelayproject"
                }
            ]
        })

        pc.ontrack = (event) => {
            console.log("🔊 Remote stream received")
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = event.streams[0]
                remoteAudioRef.current.play().catch(() => { })
            }
        }

        pc.onicecandidate = (event) => {
            if (event.candidate && callUserIdRef.current) {
                connection?.invoke(
                    "SendIceCandidate",
                    JSON.stringify(event.candidate),
                    callUserIdRef.current
                )
            }
        }

        pc.onconnectionstatechange = () => {
            console.log("🔗 Peer connection state:", pc.connectionState)
            if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
                cleanupCall()
            }
        }

        peerRef.current = pc
    }

    /* ================= GET MIC STREAM ================= */
    const getMicStream = async (): Promise<MediaStream | null> => {

        // ✅ Stop old stream first if any
        if (localStream.current) {
            localStream.current.getTracks().forEach(t => t.stop())
            localStream.current = null
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            })

            // ✅ Always start with mic ENABLED
            stream.getAudioTracks().forEach(track => {
                track.enabled = true
                console.log("🎤 Track created, enabled:", track.enabled, "| label:", track.label)
            })

            localStream.current = stream
            return stream

        } catch (err) {
            console.error("❌ Mic access failed:", err)
            return null
        }
    }

    /* ================= SIGNALR ================= */
    useEffect(() => {

        if (!connection) return

        // ✅ CALLER FLOW: CallAccepted → get mic → create offer
        connection.on("CallAccepted", async (data) => {

            console.log("📞 Call accepted by receiver — caller starts WebRTC")

            cleanupCall()   // ✅ clean any leftover state from previous call

            const targetId = data.fromUserId
            callUserIdRef.current = targetId
            setCallUserName(data.fromUserName || "User")
            setCallType("voice")
            setCallStatus("calling")
            isMutedRef.current = false
            setIsMuted(false)

            createPeer()

            const stream = await getMicStream()
            if (!stream) return

            stream.getTracks().forEach(track => {
                peerRef.current?.addTrack(track, stream)
            })

            try {
                const offer = await peerRef.current!.createOffer()
                await peerRef.current!.setLocalDescription(offer)

                await connection.invoke(
                    "SendOffer",
                    JSON.stringify(offer),
                    targetId
                )
                console.log("📤 Offer sent to", targetId)

            } catch (err) {
                console.error("❌ Offer creation failed:", err)
            }
        })

        // ✅ CALLER: answer received → fully connected
        connection.on("ReceiveAnswer", async (data) => {

            console.log("✅ Answer received — caller connected")
            if (!peerRef.current) return

            try {
                await peerRef.current.setRemoteDescription(
                    new RTCSessionDescription(JSON.parse(data.answer))
                )
                setCallStatus("connected")
            } catch (err) {
                console.error("❌ setRemoteDescription failed:", err)
            }
        })

        connection.on("ReceiveIceCandidate", async (data) => {
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

        // ✅ Use ref-based endCall so it always has latest refs
        connection.on("CallEnded", () => {
            console.log("📴 CallEnded received")
            cleanupCall()
        })

        connection.on("CallRejected", () => {
            console.log("❌ CallRejected received")
            cleanupCall()
        })

        return () => {
            connection.off("CallAccepted")
            connection.off("ReceiveAnswer")
            connection.off("ReceiveIceCandidate")
            connection.off("CallEnded")
            connection.off("CallRejected")
        }

    }, [connection])

    /* ================= RECEIVER FLOW ================= */
    useEffect(() => {

        const handler = async () => {

            const data = pendingOfferData.current
            if (!data || !connection) return

            console.log("📞 Receiver: processing accepted call")

            cleanupCall()   // ✅ clean any leftover state

            const targetId = data.fromUserId
            callUserIdRef.current = targetId
            setCallUserName(data.fromUserName || "User")
            setCallType("voice")
            setCallStatus("connected")   // receiver is connected immediately
            isMutedRef.current = false
            setIsMuted(false)

            createPeer()

            const stream = await getMicStream()
            if (!stream) return

            stream.getTracks().forEach(track => {
                peerRef.current?.addTrack(track, stream)
            })

            try {
                await peerRef.current!.setRemoteDescription(
                    new RTCSessionDescription(JSON.parse(data.offer))
                )

                const answer = await peerRef.current!.createAnswer()
                await peerRef.current!.setLocalDescription(answer)

                await connection.invoke(
                    "SendAnswer",
                    JSON.stringify(answer),
                    targetId
                )
                console.log("📤 Answer sent to", targetId)

            } catch (err) {
                console.error("❌ Answer creation failed:", err)
            }

            // ✅ Clear offer so it can't be reused accidentally
            pendingOfferData.current = null
        }

        window.addEventListener("start-call", handler)
        return () => window.removeEventListener("start-call", handler)

    }, [connection])

    /* ================= MUTE ================= */
    const toggleMute = async () => {

        if (!peerRef.current) return

        const sender = peerRef.current
            .getSenders()
            .find(s => s.track?.kind === "audio")

        if (!sender) {
            console.warn("⚠️ No audio sender found")
            return
        }

        const newMuted = !isMuted

        if (newMuted) {
            // 🔴 MUTE → remove track completely
            await sender.replaceTrack(null)
            console.log("🔇 Audio track removed")
        } else {
            // 🟢 UNMUTE → add fresh mic track
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const newTrack = stream.getAudioTracks()[0]

            await sender.replaceTrack(newTrack)

            localStream.current = stream

            console.log("🎤 Audio track restored")
        }

        setIsMuted(newMuted)
    }

    /* ================= END CALL (button) ================= */
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

    /* ================= UI ================= */
    if (!callType) return null

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60">

            <div className="w-[380px] h-[520px] bg-[#0b141a] rounded-2xl flex flex-col">

                <div className="p-4 text-gray-300 border-b border-gray-700">
                    Voice Call
                </div>

                <div className="flex-1 relative flex items-center justify-center">

                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-full bg-gray-500 flex items-center justify-center text-4xl text-white">
                        {callUserName?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    {/* Name + Status */}
                    <div className="absolute bottom-6 text-center w-full">
                        <h2 className="text-white text-lg font-semibold">
                            {callUserName}
                        </h2>
                        <p className="text-gray-300 text-sm">
                            {callStatus === "calling" ? "Calling..." : "Connected"}
                        </p>
                    </div>

                </div>

                {/* Mute indicator */}
                {isMuted && (
                    <div className="text-center text-red-400 text-xs pb-1">
                        Your microphone is off
                    </div>
                )}

                <div className="flex justify-between items-center p-6">

                    {/* Mute button */}
                    <button
                        onClick={toggleMute}
                        className={`p-3 rounded-full transition-colors ${isMuted
                            ? "bg-red-500 ring-2 ring-red-300"   // muted = red
                            : "bg-gray-700"                       // active = gray
                            }`}
                        title={isMuted ? "Tap to unmute" : "Tap to mute"}
                    >
                        {isMuted
                            ? <MicOff className="h-5 w-5 text-white" />
                            : <Mic className="h-5 w-5 text-white" />
                        }
                    </button>

                    {/* End call */}
                    <button
                        onClick={handleEndCall}
                        className="bg-red-500 p-4 rounded-full hover:bg-red-600 transition-colors"
                    >
                        <PhoneOff className="h-5 w-5 text-white" />
                    </button>

                </div>
            </div>

            <audio ref={remoteAudioRef} autoPlay playsInline />
        </div>
    )
}