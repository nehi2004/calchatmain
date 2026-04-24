"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Mic, MicOff, PhoneOff, Users, Video, VideoOff } from "lucide-react"
import { useCall, type ActiveCallData } from "@/context/CallContext"

type RemoteParticipant = {
    userId: string
    userName: string
    stream: MediaStream | null
}

type ParticipantJoinedPayload = {
    chatId: string
    userId: string
    userName: string
}

type OfferPayload = {
    chatId: string
    fromUserId: string
    fromUserName: string
    offer: string
    callType: "voice" | "video"
}

type AnswerPayload = {
    chatId: string
    fromUserId: string
    answer: string
}

type IcePayload = {
    chatId: string
    fromUserId: string
    candidate: string
}

const peerConfig: RTCConfiguration = {
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
}

const getCurrentUser = () => ({
    id: typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "",
    name: typeof window !== "undefined" ? localStorage.getItem("name") || "You" : "You",
})

function RemoteMedia({
    participant,
    isVideo,
}: {
    participant: RemoteParticipant
    isVideo: boolean
}) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        if (!participant.stream) {
            return
        }

        if (isVideo && videoRef.current) {
            videoRef.current.srcObject = participant.stream
            videoRef.current.play().catch(() => undefined)
        }

        if (!isVideo && audioRef.current) {
            audioRef.current.srcObject = participant.stream
            audioRef.current.play().catch(() => undefined)
        }
    }, [isVideo, participant.stream])

    if (isVideo) {
        return (
            <div className="relative aspect-video overflow-hidden rounded-[28px] bg-slate-950/10">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="h-full w-full object-cover"
                />
                <div className="absolute bottom-3 left-3 rounded-full bg-slate-950/60 px-3 py-1 text-xs text-white">
                    {participant.userName}
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-44 items-center justify-center rounded-[28px] bg-sky-50">
            <audio ref={audioRef} autoPlay playsInline />
            <div className="text-center text-slate-900">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-3xl font-semibold text-sky-700">
                    {participant.userName.charAt(0).toUpperCase()}
                </div>
                <p className="mt-4 text-lg font-medium">{participant.userName}</p>
            </div>
        </div>
    )
}

export default function GlobalCallUI() {
    const {
        connection,
        activeCall,
        setActiveCall,
        clearCallState,
        setLastEndedCall,
    } = useCall()

    const currentUser = useMemo(() => getCurrentUser(), [])
    const [isMuted, setIsMuted] = useState(false)
    const [isCameraOff, setIsCameraOff] = useState(false)
    const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([])

    const peerMapRef = useRef<Map<string, RTCPeerConnection>>(new Map())
    const localStreamRef = useRef<MediaStream | null>(null)
    const localVideoRef = useRef<HTMLVideoElement>(null)
    const isVideo = activeCall?.callType === "video"

    const stopLocalMedia = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop())
            localStreamRef.current = null
        }

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null
        }
    }

    const disposePeer = (userId: string) => {
        const peer = peerMapRef.current.get(userId)
        if (!peer) {
            return
        }

        peer.onicecandidate = null
        peer.ontrack = null
        peer.close()
        peerMapRef.current.delete(userId)
    }

    const resetTransport = () => {
        Array.from(peerMapRef.current.keys()).forEach(userId => disposePeer(userId))
        setRemoteParticipants([])
        stopLocalMedia()
        setIsMuted(false)
        setIsCameraOff(false)
    }

    const ensureLocalMedia = async () => {
        if (localStreamRef.current) {
            return localStreamRef.current
        }

        if (!activeCall) {
            return null
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: activeCall.callType === "video",
            })

            localStreamRef.current = stream

            if (activeCall.callType === "video" && localVideoRef.current) {
                localVideoRef.current.srcObject = stream
                localVideoRef.current.play().catch(() => undefined)
            }

            return stream
        } catch (error: unknown) {
            console.error("getUserMedia failed:", error)
            return null
        }
    }

    const getOrCreatePeer = (targetUserId: string, targetUserName: string) => {
        const existing = peerMapRef.current.get(targetUserId)
        if (existing) {
            return existing
        }

        const peer = new RTCPeerConnection(peerConfig)

        peer.onicecandidate = event => {
            if (!event.candidate || !connection || !activeCall) {
                return
            }

            connection
                .invoke("SendIceCandidate", activeCall.chatId, targetUserId, JSON.stringify(event.candidate))
                .catch((error: unknown) => console.error("SendIceCandidate failed:", error))
        }

        peer.ontrack = event => {
            setRemoteParticipants((prev: RemoteParticipant[]) => {
                const stream = event.streams[0]
                const exists = prev.some(item => item.userId === targetUserId)

                if (exists) {
                    return prev.map(item =>
                        item.userId === targetUserId
                            ? { ...item, stream }
                            : item
                    )
                }

                return [...prev, { userId: targetUserId, userName: targetUserName, stream }]
            })
        }

        peer.onconnectionstatechange = () => {
            if (["failed", "closed", "disconnected"].includes(peer.connectionState)) {
                disposePeer(targetUserId)
                setRemoteParticipants((prev: RemoteParticipant[]) =>
                    prev.filter(item => item.userId !== targetUserId)
                )
            }
        }

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                peer.addTrack(track, localStreamRef.current as MediaStream)
            })
        }

        peerMapRef.current.set(targetUserId, peer)
        return peer
    }

    useEffect(() => {
        if (!activeCall) {
            resetTransport()
            return
        }

        void ensureLocalMedia()

        return () => {
            resetTransport()
        }
    }, [activeCall?.chatId, activeCall?.callType])

    useEffect(() => {
        if (!connection || !activeCall) {
            return
        }

        const handleParticipantJoined = async (payload: ParticipantJoinedPayload) => {
            if (payload.chatId !== activeCall.chatId) {
                return
            }

            setActiveCall((prev: ActiveCallData | null) =>
                prev && prev.chatId === payload.chatId
                    ? { ...prev, state: "connected" }
                    : prev
            )

            if (payload.userId === currentUser.id) {
                return
            }

            const stream = await ensureLocalMedia()
            if (!stream) {
                return
            }

            const peer = getOrCreatePeer(payload.userId, payload.userName)
            const offer = await peer.createOffer()
            await peer.setLocalDescription(offer)

            await connection.invoke(
                "SendOffer",
                activeCall.chatId,
                payload.userId,
                JSON.stringify(offer)
            )
        }

        const handleOffer = async (payload: OfferPayload) => {
            if (payload.chatId !== activeCall.chatId) {
                return
            }

            const stream = await ensureLocalMedia()
            if (!stream) {
                return
            }

            const peer = getOrCreatePeer(payload.fromUserId, payload.fromUserName)

            if (!peer.currentRemoteDescription) {
                await peer.setRemoteDescription(
                    new RTCSessionDescription(JSON.parse(payload.offer))
                )
            }

            const answer = await peer.createAnswer()
            await peer.setLocalDescription(answer)

            await connection.invoke(
                "SendAnswer",
                activeCall.chatId,
                payload.fromUserId,
                JSON.stringify(answer)
            )

            setActiveCall((prev: ActiveCallData | null) =>
                prev && prev.chatId === activeCall.chatId
                    ? { ...prev, state: "connected" }
                    : prev
            )
        }

        const handleAnswer = async (payload: AnswerPayload) => {
            if (payload.chatId !== activeCall.chatId) {
                return
            }

            const peer = peerMapRef.current.get(payload.fromUserId)
            if (!peer) {
                return
            }

            await peer.setRemoteDescription(
                new RTCSessionDescription(JSON.parse(payload.answer))
            )

            setActiveCall((prev: ActiveCallData | null) =>
                prev && prev.chatId === activeCall.chatId
                    ? { ...prev, state: "connected" }
                    : prev
            )
        }

        const handleIce = async (payload: IcePayload) => {
            if (payload.chatId !== activeCall.chatId) {
                return
            }

            const peer = peerMapRef.current.get(payload.fromUserId)
            if (!peer) {
                return
            }

            await peer.addIceCandidate(
                new RTCIceCandidate(JSON.parse(payload.candidate))
            )
        }

        const handleLeft = (payload: ParticipantJoinedPayload) => {
            if (payload.chatId !== activeCall.chatId) {
                return
            }

            disposePeer(payload.userId)
            setRemoteParticipants((prev: RemoteParticipant[]) =>
                prev.filter(item => item.userId !== payload.userId)
            )
        }

        const handleEnded = (payload: { chatId: string; chatName?: string; endedBy?: string }) => {
            if (payload.chatId !== activeCall.chatId) {
                return
            }

            resetTransport()
            clearCallState()
            setLastEndedCall({
                chatId: payload.chatId,
                chatName: payload.chatName || activeCall.chatName,
                endedBy: payload.endedBy,
            })
        }

        connection.on("ParticipantJoinedCall", handleParticipantJoined)
        connection.on("ReceiveOffer", handleOffer)
        connection.on("ReceiveAnswer", handleAnswer)
        connection.on("ReceiveIceCandidate", handleIce)
        connection.on("ParticipantLeftCall", handleLeft)
        connection.on("CallEnded", handleEnded)

        return () => {
            connection.off("ParticipantJoinedCall", handleParticipantJoined)
            connection.off("ReceiveOffer", handleOffer)
            connection.off("ReceiveAnswer", handleAnswer)
            connection.off("ReceiveIceCandidate", handleIce)
            connection.off("ParticipantLeftCall", handleLeft)
            connection.off("CallEnded", handleEnded)
        }
    }, [activeCall, clearCallState, connection, currentUser.id, setActiveCall, setLastEndedCall])

    const toggleMute = () => {
        const audioTrack = localStreamRef.current?.getAudioTracks()?.[0]
        if (!audioTrack) {
            return
        }

        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
    }

    const toggleCamera = () => {
        const videoTrack = localStreamRef.current?.getVideoTracks()?.[0]
        if (!videoTrack) {
            return
        }

        videoTrack.enabled = !videoTrack.enabled
        setIsCameraOff(!videoTrack.enabled)
    }

    const handleLeaveCall = async () => {
        if (!connection || !activeCall) {
            resetTransport()
            clearCallState()
            return
        }

        try {
            await connection.invoke("LeaveCall", activeCall.chatId)
        } catch (error: unknown) {
            console.error("LeaveCall failed:", error)
        }

        resetTransport()
        clearCallState()
        setLastEndedCall({
            chatId: activeCall.chatId,
            chatName: activeCall.chatName,
            endedBy: currentUser.name,
        })
    }

    if (!activeCall) {
        return null
    }

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/45 backdrop-blur-md">
            <div className="w-[min(1180px,95vw)] overflow-hidden rounded-[32px] border border-sky-100 bg-white text-slate-900 shadow-[0_35px_120px_-40px_rgba(15,23,42,0.35)]">
                <div className="flex items-center justify-between border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                            {activeCall.isGroup ? <Users className="h-5 w-5" /> : isVideo ? <Video className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Secure call</p>
                            <h2 className="text-lg font-semibold">{activeCall.chatName}</h2>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500">
                        {activeCall.state === "calling" && "Calling..."}
                        {activeCall.state === "ringing" && "Ringing..."}
                        {activeCall.state === "connected" && "Connected"}
                        {activeCall.state === "ended" && "Call ended"}
                    </p>
                </div>

                <div className="grid gap-6 p-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-[28px] bg-gradient-to-br from-sky-50 via-white to-blue-50 p-6">
                        {remoteParticipants.length > 0 ? (
                            <div className={remoteParticipants.length > 1 ? "grid gap-4 md:grid-cols-2" : "grid gap-4"}>
                                {remoteParticipants.map(participant => (
                                    <RemoteMedia
                                        key={participant.userId}
                                        participant={participant}
                                        isVideo={Boolean(isVideo)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[420px] items-center justify-center text-center">
                                <div>
                                    <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-sky-100 text-5xl font-semibold text-sky-700">
                                        {activeCall.chatName.charAt(0).toUpperCase()}
                                    </div>
                                    <h3 className="mt-8 text-4xl font-semibold">{activeCall.chatName}</h3>
                                    <p className="mt-3 text-xl text-slate-500">
                                        {activeCall.state === "connected"
                                            ? "Waiting for media..."
                                            : activeCall.state === "ringing"
                                                ? "Ringing..."
                                                : "Calling..."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 rounded-[28px] bg-slate-50 p-5">
                        {isVideo ? (
                            <div className="relative aspect-video overflow-hidden rounded-[24px] bg-slate-100">
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute bottom-3 left-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs text-white">
                                    You
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-52 items-center justify-center rounded-[24px] bg-white text-center">
                                <div>
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-3xl font-semibold text-sky-700">
                                        {currentUser.name.charAt(0).toUpperCase()}
                                    </div>
                                    <p className="mt-4 text-lg font-medium">You</p>
                                </div>
                            </div>
                        )}

                        <div className="rounded-[24px] bg-white p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Participants</p>
                            <p className="mt-3 text-sm text-slate-700">
                                {activeCall.isGroup
                                    ? `${remoteParticipants.length + 1} in call`
                                    : remoteParticipants.length > 0
                                        ? "Both connected"
                                        : "Waiting for other side"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 border-t border-sky-100 px-6 py-5">
                    <button
                        onClick={toggleMute}
                        className={`flex h-14 w-14 items-center justify-center rounded-full transition ${isMuted ? "bg-rose-500 text-white" : "bg-sky-100 text-sky-700 hover:bg-sky-200"}`}
                    >
                        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>

                    {isVideo && (
                        <button
                            onClick={toggleCamera}
                            className={`flex h-14 w-14 items-center justify-center rounded-full transition ${isCameraOff ? "bg-rose-500 text-white" : "bg-sky-100 text-sky-700 hover:bg-sky-200"}`}
                        >
                            {isCameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                        </button>
                    )}

                    <button
                        onClick={handleLeaveCall}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600"
                    >
                        <PhoneOff className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    )
}
