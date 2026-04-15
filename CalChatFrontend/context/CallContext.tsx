"use client"

import { createContext, useContext, useRef, useState } from "react"
import * as signalR from "@microsoft/signalr"

export interface CallData {
    fromUserId: string
    fromUserName: string
    callType: "voice" | "video"
}

interface CallContextType {
    incomingCall: CallData | null
    setIncomingCall: (call: CallData | null) => void

    acceptCall: () => Promise<void>
    rejectCall: () => Promise<void>
    endCall: () => void

    connection: signalR.HubConnection | null
    setConnection: (conn: signalR.HubConnection) => void

    callType: "voice" | null
    remoteAudioRef: React.RefObject<HTMLAudioElement | null>
}

const CallContext = createContext<CallContextType | null>(null)

export const CallProvider = ({ children }: { children: React.ReactNode }) => {

    const [incomingCall, setIncomingCall] = useState<CallData | null>(null)
    const [callType, setCallType] = useState<"voice" | null>(null)

    const connectionRef = useRef<signalR.HubConnection | null>(null)

    const peerRef = useRef<RTCPeerConnection | null>(null)
    const localStream = useRef<MediaStream | null>(null)
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null)

    const setConnection = (conn: signalR.HubConnection) => {
        connectionRef.current = conn
    }

    // ✅ CREATE PEER
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
            if (event.candidate && incomingCall) {
                connectionRef.current?.invoke(
                    "SendIceCandidate",
                    JSON.stringify(event.candidate),
                    incomingCall.fromUserId
                )
            }
        }

        peerRef.current = pc
    }



    // ✅ ACCEPT CALL
    const acceptCall = async () => {

        // 🔕 STOP RINGTONE (SAFE FIX)
        const ringtone = (window as any).ringtone

        if (ringtone && typeof ringtone.pause === "function") {
            ringtone.pause()
            ringtone.currentTime = 0
        }

        if (!incomingCall || !connectionRef.current) return

        try {
            // 🔥 STORE chatId BEFORE ACCEPT
            localStorage.setItem("chatId", (incomingCall as any).chatId || "")

            await connectionRef.current.invoke(
                "AcceptCall",
                incomingCall.fromUserId
            )

            // 🔥 UI OPEN TRIGGER (IMPORTANT)
            window.dispatchEvent(new Event("start-call"))

            setCallType("voice")
            setIncomingCall(null)

        } catch (err) {
            console.error("Accept error:", err)
        }
    }

    // ❌ REJECT CALL
    const rejectCall = async () => {

        // 🔕 STOP RINGTONE (SAFE FIX)
        const ringtone = (window as any).ringtone

        if (ringtone && typeof ringtone.pause === "function") {
            ringtone.pause()
            ringtone.currentTime = 0
        }

        if (!incomingCall || !connectionRef.current) return

        await connectionRef.current.invoke(
            "RejectCall",
            incomingCall.fromUserId
        )

        setIncomingCall(null)

        // 🔥 CLOSE UI EVERYWHERE
        window.dispatchEvent(new Event("call-ended"))
    }

    // 🔴 END CALL
    const endCall = () => {

        localStream.current?.getTracks().forEach(track => track.stop())
        localStream.current = null

        setCallType(null)
    }

    return (
        <CallContext.Provider
            value={{
                incomingCall,
                setIncomingCall,
                acceptCall,
                rejectCall,
                endCall,
                connection: connectionRef.current,
                setConnection,
                callType,
                remoteAudioRef
            }}
        >
            {children}
        </CallContext.Provider>
    )
}

export const useCall = () => {
    const context = useContext(CallContext)
    if (!context) throw new Error("useCall must be used inside CallProvider")
    return context
}