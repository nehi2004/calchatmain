"use client"

import { useEffect, useRef, useState } from "react"
import { PhoneOff } from "lucide-react"
import * as signalR from "@microsoft/signalr"
import { useCall } from "@/context/CallContext"

export default function GlobalCallUI() {

    const { connection } = useCall()

    const [callType, setCallType] = useState<"voice" | null>(null)
    const [callUserName, setCallUserName] = useState("User")
    const [callUserId, setCallUserId] = useState<string | null>(null)
    const [isMuted, setIsMuted] = useState(false)

    const peerRef = useRef<RTCPeerConnection | null>(null)
    const localStream = useRef<MediaStream | null>(null)
    const remoteAudioRef = useRef<HTMLAudioElement>(null)
    const ringtoneRef = useRef<HTMLAudioElement | null>(null)

    const pendingOfferRef = useRef<any>(null)

    /* ================= CREATE PEER ================= */
    const createPeer = () => {

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        })

        pc.ontrack = (event) => {
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = event.streams[0]
            }
        }

        pc.onicecandidate = (event) => {
            if (event.candidate && callUserId) {
                connection?.invoke(
                    "SendIceCandidate",
                    JSON.stringify(event.candidate),
                    callUserId
                )
            }
        }

        peerRef.current = pc
    }

    useEffect(() => {

        const handler = () => endCall()

        window.addEventListener("call-ended", handler)

        return () => window.removeEventListener("call-ended", handler)

    }, [])

    /* ================= 🔥 START CALL EVENT ================= */
    useEffect(() => {

        const startCallHandler = async (e: any) => {

            const data = pendingOfferRef.current
            if (!data || !connection) return

            // 🔥 Ensure peer exists
            if (!peerRef.current) {
                createPeer()
            }

            setCallUserId(data.fromUserId)
            setCallUserName(data.fromUserName || "User")

            setCallType("voice")

            createPeer()

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            })

            localStream.current = stream

            const audioTrack = stream.getAudioTracks()[0]
            if (audioTrack) {
                peerRef.current?.addTrack(audioTrack, stream)
            }

            await peerRef.current?.setRemoteDescription(
                new RTCSessionDescription(JSON.parse(data.offer))
            )

            const answer = await peerRef.current!.createAnswer()
            await peerRef.current!.setLocalDescription(answer)

            await connection.invoke(
                "SendAnswer",
                JSON.stringify(answer),
                data.fromUserId
            )
        }

        window.addEventListener("start-call", startCallHandler)

        return () => {
            window.removeEventListener("start-call", startCallHandler)
        }

    }, [connection])

    /* ================= SIGNALR ================= */
    useEffect(() => {

        if (!connection) return

        connection.on("ReceiveOffer", (data) => {
            console.log("📩 Offer received GLOBAL")

            pendingOfferRef.current = data
        })

        connection.on("ReceiveAnswer", async (data) => {
            await peerRef.current?.setRemoteDescription(
                new RTCSessionDescription(JSON.parse(data.answer))
            )
        })

        connection.on("ReceiveIceCandidate", async (data) => {
            if (data.candidate) {
                await peerRef.current?.addIceCandidate(
                    new RTCIceCandidate(JSON.parse(data.candidate))
                )
            }
        })

        connection.on("CallAccepted", (data) => {
            console.log("✅ Call Accepted")

            setCallUserId(data.toUserId || data.fromUserId)
            setCallUserName("User")

            setCallType("voice")

            window.dispatchEvent(new Event("start-call"))
        })

        connection.on("CallEnded", () => {

            const ringtone = (window as any).ringtone

            if (ringtone && typeof ringtone.pause === "function") {
                ringtone.pause()
                ringtone.currentTime = 0
            }
            endCall()
        })

        connection.on("CallRejected", () => {
            endCall()
        })

    }, [connection])

    /* ================= CONTROLS ================= */

    const toggleMute = async () => {

        if (!localStream.current) return

        const track = localStream.current.getAudioTracks()[0]
        if (!track) return

        // 🔁 TOGGLE MIC
        track.enabled = !track.enabled

        const muted = !track.enabled
        setIsMuted(muted)

        console.log("🎤 Mic:", track.enabled ? "ON" : "OFF")

        // 🔥 SEND TO OTHER USER
        if (connection && callUserId) {
            await connection.invoke("ToggleMute", callUserId, muted)
        }
    }

    const endCall = () => {

        localStream.current?.getTracks().forEach(t => t.stop())
        localStream.current = null

        peerRef.current?.close()
        peerRef.current = null

        setCallType(null)
    }

    const handleEndCall = async () => {

        if (connection && callUserId) {

            const chatId = localStorage.getItem("chatId") // 🔥 IMPORTANT

            await connection.invoke("EndCall", callUserId, chatId)
        }

        endCall()
    }

    /* ================= UI ================= */

    if (!callType) return null

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm">

            <div className="w-[380px] h-[520px] bg-[#0b141a] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                <div className="flex justify-between items-center p-4 text-gray-300 text-sm border-b border-gray-700">
                    <span>{callUserName}</span>
                    <span>End-to-end encrypted</span>
                </div>

                <div className="flex-1 relative flex items-center justify-center">

                    <div className="w-32 h-32 rounded-full bg-gray-500 flex items-center justify-center text-4xl text-white">
                        {callUserName?.charAt(0) || "U"}
                    </div>

                    <div className="absolute bottom-6 text-center w-full">
                        <h2 className="text-white text-lg font-semibold">
                            {callUserName}
                        </h2>

                        <p className="text-gray-300 text-sm">
                            {peerRef.current ? "Connected" : "Calling..."}
                        </p>
                    </div>

                </div>

                <div className="flex justify-between items-center px-6 pb-6">

                    <button
                        onClick={toggleMute}
                        className={`p-3 rounded-full ${isMuted ? "bg-red-500" : "bg-gray-800"}`}
                    >
                        {isMuted ? "🔇" : "🎤"}
                    </button>

                    <button
                        onClick={handleEndCall}
                        className="bg-red-500 p-4 rounded-full"
                    >
                        <PhoneOff className="h-5 w-5 text-white" />
                    </button>

                </div>

            </div>

            <audio ref={remoteAudioRef} autoPlay playsInline />
        </div>
    )
}