"use client"

import {
    createContext,
    useContext,
    useMemo,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from "react"
import * as signalR from "@microsoft/signalr"

export type CallType = "voice" | "video"

export interface CallInviteData {
    chatId: string
    chatName: string
    callerId: string
    callerName: string
    participantIds: string[]
    isGroup: boolean
    callType: CallType
}

export interface ActiveCallData {
    chatId: string
    chatName: string
    initiatorId: string
    initiatorName: string
    participantIds: string[]
    isGroup: boolean
    callType: CallType
    state: "calling" | "ringing" | "connected" | "ended"
}

export interface EndedCallData {
    chatId: string
    chatName: string
    endedBy?: string
}

interface StartOutgoingCallPayload {
    chatId: string
    chatName: string
    participantIds: string[]
    isGroup: boolean
    callType: CallType
}

interface CallContextType {
    connection: signalR.HubConnection | null
    setConnection: (conn: signalR.HubConnection | null) => void
    isCallReady: boolean
    incomingCall: CallInviteData | null
    setIncomingCall: Dispatch<SetStateAction<CallInviteData | null>>
    activeCall: ActiveCallData | null
    setActiveCall: Dispatch<SetStateAction<ActiveCallData | null>>
    lastEndedCall: EndedCallData | null
    setLastEndedCall: Dispatch<SetStateAction<EndedCallData | null>>
    startOutgoingCall: (data: StartOutgoingCallPayload) => void
    acceptCall: () => Promise<void>
    rejectCall: () => Promise<void>
    clearCallState: () => void
}

const CallContext = createContext<CallContextType | null>(null)

const getCurrentUser = () => ({
    id: typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "",
    name: typeof window !== "undefined" ? localStorage.getItem("name") || "You" : "You",
})

export function CallProvider({ children }: { children: ReactNode }) {
    const [connection, setConnectionState] = useState<signalR.HubConnection | null>(null)
    const [incomingCall, setIncomingCall] = useState<CallInviteData | null>(null)
    const [activeCall, setActiveCall] = useState<ActiveCallData | null>(null)
    const [lastEndedCall, setLastEndedCall] = useState<EndedCallData | null>(null)

    const setConnection = (conn: signalR.HubConnection | null) => {
        setConnectionState(conn)
    }

    const clearCallState = () => {
        setIncomingCall(null)
        setActiveCall(null)
    }

    const startOutgoingCall = (data: StartOutgoingCallPayload) => {
        const currentUser = getCurrentUser()

        localStorage.setItem("chatId", data.chatId)
        setLastEndedCall(null)
        setIncomingCall(null)
        setActiveCall({
            chatId: data.chatId,
            chatName: data.chatName,
            initiatorId: currentUser.id,
            initiatorName: currentUser.name,
            participantIds: data.participantIds,
            isGroup: data.isGroup,
            callType: data.callType,
            state: "calling",
        })
    }

    const acceptCall = async () => {
        if (!incomingCall || !connection) {
            return
        }

        try {
            localStorage.setItem("chatId", incomingCall.chatId)
            setLastEndedCall(null)
            setActiveCall({
                chatId: incomingCall.chatId,
                chatName: incomingCall.chatName,
                initiatorId: incomingCall.callerId,
                initiatorName: incomingCall.callerName,
                participantIds: incomingCall.participantIds,
                isGroup: incomingCall.isGroup,
                callType: incomingCall.callType,
                state: "ringing",
            })

            await connection.invoke("AcceptCall", incomingCall.chatId)
            setIncomingCall(null)
        } catch (error: unknown) {
            console.error("AcceptCall failed:", error)
            setActiveCall(null)
        }
    }

    const rejectCall = async () => {
        if (!incomingCall || !connection) {
            setIncomingCall(null)
            return
        }

        try {
            await connection.invoke("RejectCall", incomingCall.chatId)
        } catch (error: unknown) {
            console.error("RejectCall failed:", error)
        }

        setIncomingCall(null)
    }

    const isCallReady =
        !!connection &&
        connection.state === signalR.HubConnectionState.Connected

    const value = useMemo<CallContextType>(
        () => ({
            connection,
            setConnection,
            isCallReady,
            incomingCall,
            setIncomingCall,
            activeCall,
            setActiveCall,
            lastEndedCall,
            setLastEndedCall,
            startOutgoingCall,
            acceptCall,
            rejectCall,
            clearCallState,
        }),
        [connection, isCallReady, incomingCall, activeCall, lastEndedCall]
    )

    return <CallContext.Provider value={value}>{children}</CallContext.Provider>
}

export function useCall() {
    const context = useContext(CallContext)

    if (!context) {
        throw new Error("useCall must be used inside CallProvider")
    }

    return context
}
