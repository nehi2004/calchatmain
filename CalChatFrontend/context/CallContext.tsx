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
    pendingOfferData: React.MutableRefObject<any>   // ← NEW
}

const CallContext = createContext<CallContextType | null>(null)

export const CallProvider = ({ children }: { children: React.ReactNode }) => {

    const [incomingCall, setIncomingCall] = useState<CallData | null>(null)
    const [callType, setCallType] = useState<"voice" | null>(null)

    const connectionRef = useRef<signalR.HubConnection | null>(null)
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null)
    const pendingOfferData = useRef<any>(null)   // ← NEW

    const setConnection = (conn: signalR.HubConnection) => {
        connectionRef.current = conn
    }

    const acceptCall = async () => {
        const ringtone = (window as any).ringtone
        if (ringtone?.pause) { ringtone.pause(); ringtone.currentTime = 0 }

        if (!incomingCall || !connectionRef.current) return

        try {
            localStorage.setItem("chatId", (incomingCall as any).chatId || "")
            await connectionRef.current.invoke("AcceptCall", incomingCall.fromUserId)
            window.dispatchEvent(new Event("start-call"))
            setCallType("voice")
            setIncomingCall(null)
        } catch (err) {
            console.error("Accept error:", err)
        }
    }

    const rejectCall = async () => {
        const ringtone = (window as any).ringtone
        if (ringtone?.pause) { ringtone.pause(); ringtone.currentTime = 0 }

        if (!incomingCall || !connectionRef.current) return

        await connectionRef.current.invoke("RejectCall", incomingCall.fromUserId)
        setIncomingCall(null)
        window.dispatchEvent(new Event("call-ended"))
    }

    const endCall = () => {
        setCallType(null)
    }

    return (
        <CallContext.Provider value={{
            incomingCall, setIncomingCall,
            acceptCall, rejectCall, endCall,
            connection: connectionRef.current,
            setConnection,
            callType,
            remoteAudioRef,
            pendingOfferData   // ← NEW
        }}>
            {children}
        </CallContext.Provider>
    )
}

export const useCall = () => {
    const context = useContext(CallContext)
    if (!context) throw new Error("useCall must be used inside CallProvider")
    return context
}