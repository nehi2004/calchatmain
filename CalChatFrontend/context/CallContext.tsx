"use client"

import { createContext, useContext, useMemo, useRef, useState } from "react"
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
    pendingOfferData: React.MutableRefObject<PendingOfferData | null>
    outgoingCall: OutgoingCallData | null
    startOutgoingCall: (call: OutgoingCallData) => void
    clearOutgoingCall: () => void
    isCallReady: boolean
    acceptedIncomingCall: boolean
    setAcceptedIncomingCall: (value: boolean) => void
}

const CallContext = createContext<CallContextType | null>(null)

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
    const [incomingCall, setIncomingCall] = useState<CallData | null>(null)
    const [connection, setConnectionState] = useState<signalR.HubConnection | null>(null)
    const [outgoingCall, setOutgoingCall] = useState<OutgoingCallData | null>(null)
    const [acceptedIncomingCall, setAcceptedIncomingCall] = useState(false)

    const pendingOfferData = useRef<PendingOfferData | null>(null)

    const setConnection = (conn: signalR.HubConnection | null) => {
        setConnectionState(conn)
    }

    const startOutgoingCall = (call: OutgoingCallData) => {
        localStorage.setItem("chatId", call.chatId)
        setAcceptedIncomingCall(false)
        setOutgoingCall(call)
    }

    const clearOutgoingCall = () => {
        setOutgoingCall(null)
    }

    const stopRingtone = () => {
        const ringtone = (window as any).ringtone
        if (ringtone?.pause) {
            ringtone.pause()
            ringtone.currentTime = 0
                ; (window as any).ringtone = null
        }
    }

    const acceptCall = async () => {
        if (!incomingCall || !connection) {
            return
        }

        stopRingtone()

        try {
            localStorage.setItem("chatId", incomingCall.chatId || "")
            setAcceptedIncomingCall(true)
            await connection.invoke("AcceptCall", incomingCall.fromUserId, incomingCall.chatId || "")
            setIncomingCall(null)
        } catch (err) {
            console.error("Accept error:", err)
            setAcceptedIncomingCall(false)
        }
    }

    const rejectCall = async () => {
        if (!incomingCall || !connection) {
            return
        }

        stopRingtone()

        try {
            await connection.invoke("RejectCall", incomingCall.fromUserId, incomingCall.chatId || "")
        } catch (err) {
            console.error("Reject error:", err)
        }

        setIncomingCall(null)
        setOutgoingCall(null)
        setAcceptedIncomingCall(false)
        pendingOfferData.current = null
    }

    const endCall = () => {
        setIncomingCall(null)
        setOutgoingCall(null)
        setAcceptedIncomingCall(false)
        pendingOfferData.current = null
    }

    const isCallReady =
        !!connection &&
        connection.state === signalR.HubConnectionState.Connected

    const value = useMemo(
        () => ({
            incomingCall,
            setIncomingCall,
            acceptCall,
            rejectCall,
            endCall,
            connection,
            setConnection,
            pendingOfferData,
            outgoingCall,
            startOutgoingCall,
            clearOutgoingCall,
            isCallReady,
            acceptedIncomingCall,
            setAcceptedIncomingCall,
        }),
        [incomingCall, connection, outgoingCall, isCallReady, acceptedIncomingCall]
    )

    return <CallContext.Provider value={value}>{children}</CallContext.Provider>
}

export const useCall = () => {
    const context = useContext(CallContext)
    if (!context) {
        throw new Error("useCall must be used inside CallProvider")
    }
    return context
}