"use client"

import { createContext, useContext, useRef, useState } from "react"
import * as signalR from "@microsoft/signalr"

export interface CallData {
    fromUserId: string
    fromUserName: string
    callType: "voice" | "video"
    chatId?: string
}

export interface OutgoingCallData {
    userId: string
    userName: string
    callType: "voice"
    chatId: string
}

interface PendingOfferData {
    offer: string
    fromUserId: string
    fromUserName?: string
}

interface CallContextType {
    incomingCall: CallData | null
    setIncomingCall: (call: CallData | null) => void
    acceptCall: () => Promise<void>
    rejectCall: () => Promise<void>
    endCall: () => void
    connection: signalR.HubConnection | null
    setConnection: (conn: signalR.HubConnection | null) => void
    callType: "voice" | null
    remoteAudioRef: React.RefObject<HTMLAudioElement | null>
    pendingOfferData: React.MutableRefObject<PendingOfferData | null>
    outgoingCall: OutgoingCallData | null
    startOutgoingCall: (call: OutgoingCallData) => void
    clearOutgoingCall: () => void
}

const CallContext = createContext<CallContextType | null>(null)

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
    const [incomingCall, setIncomingCall] = useState<CallData | null>(null)
    const [callType, setCallType] = useState<"voice" | null>(null)
    const [connection, setConnectionState] = useState<signalR.HubConnection | null>(null)
    const [outgoingCall, setOutgoingCall] = useState<OutgoingCallData | null>(null)

    const remoteAudioRef = useRef<HTMLAudioElement | null>(null)
    const pendingOfferData = useRef<PendingOfferData | null>(null)

    const setConnection = (conn: signalR.HubConnection | null) => {
        setConnectionState(conn)
    }

    const startOutgoingCall = (call: OutgoingCallData) => {
        localStorage.setItem("chatId", call.chatId)
        setCallType("voice")
        setOutgoingCall(call)
    }

    const clearOutgoingCall = () => {
        setOutgoingCall(null)
        setCallType(null)
    }

    const acceptCall = async () => {
        const ringtone = (window as any).ringtone
        if (ringtone?.pause) {
            ringtone.pause()
            ringtone.currentTime = 0
        }

        if (!incomingCall || !connection) {
            return
        }

        try {
            localStorage.setItem("chatId", incomingCall.chatId || "")
            await connection.invoke("AcceptCall", incomingCall.fromUserId, incomingCall.chatId || "")
            window.dispatchEvent(new Event("start-call"))
            setCallType("voice")
            setIncomingCall(null)
        } catch (err) {
            console.error("Accept error:", err)
        }
    }

    const rejectCall = async () => {
        const ringtone = (window as any).ringtone
        if (ringtone?.pause) {
            ringtone.pause()
            ringtone.currentTime = 0
        }

        if (!incomingCall || !connection) {
            return
        }

        await connection.invoke("RejectCall", incomingCall.fromUserId, incomingCall.chatId || "")
        setIncomingCall(null)
        setCallType(null)
        setOutgoingCall(null)
        window.dispatchEvent(new Event("call-ended"))
    }

    const endCall = () => {
        setCallType(null)
        setOutgoingCall(null)
    }

    return (
        <CallContext.Provider
            value={{
                incomingCall,
                setIncomingCall,
                acceptCall,
                rejectCall,
                endCall,
                connection,
                setConnection,
                callType,
                remoteAudioRef,
                pendingOfferData,
                outgoingCall,
                startOutgoingCall,
                clearOutgoingCall,
            }}
        >
            {children}
        </CallContext.Provider>
    )
}

export const useCall = () => {
    const context = useContext(CallContext)

    if (!context) {
        throw new Error("useCall must be used inside CallProvider")
    }

    return context
}