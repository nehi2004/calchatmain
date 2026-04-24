"use client"

import { useEffect, useRef } from "react"
import * as signalR from "@microsoft/signalr"
import {
    useCall,
    type ActiveCallData,
    type CallInviteData,
} from "@/context/CallContext"

const API_BASE = "https://steadfast-warmth-production-64c8.up.railway.app"

export default function CallManager() {
    const {
        setIncomingCall,
        setConnection,
        clearCallState,
        setActiveCall,
        setLastEndedCall,
    } = useCall()

    const connectionRef = useRef<signalR.HubConnection | null>(null)
    const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const connectingRef = useRef(false)

    useEffect(() => {
        let disposed = false

        const clearRetry = () => {
            if (retryRef.current) {
                clearTimeout(retryRef.current)
                retryRef.current = null
            }
        }

        const stopRingtone = () => {
            const ringtone = (window as Window & { ringtone?: HTMLAudioElement }).ringtone
            if (!ringtone) {
                return
            }

            ringtone.pause()
            ringtone.currentTime = 0
            delete (window as Window & { ringtone?: HTMLAudioElement }).ringtone
        }

        const playRingtone = () => {
            try {
                const audio = new Audio("/sounds/ringtone.mp3")
                audio.loop = true
                audio.play().catch(() => undefined)
                    ; (window as Window & { ringtone?: HTMLAudioElement }).ringtone = audio
            } catch (error: unknown) {
                console.error("Ringtone failed:", error)
            }
        }

        const scheduleRetry = () => {
            clearRetry()
            retryRef.current = setTimeout(() => {
                void ensureConnected()
            }, 1500)
        }

        const bindEvents = (connection: signalR.HubConnection) => {
            connection.on("IncomingCall", (payload: CallInviteData) => {
                stopRingtone()
                playRingtone()
                localStorage.setItem("chatId", payload.chatId)
                setIncomingCall(payload)
            })

            connection.on("CallRejected", (payload: { chatId: string; endedBy?: string }) => {
                stopRingtone()
                clearCallState()
                setLastEndedCall({
                    chatId: payload.chatId,
                    chatName: "Call",
                    endedBy: payload.endedBy,
                })
            })

            connection.on("CallEnded", (payload: { chatId: string; chatName?: string; endedBy?: string }) => {
                stopRingtone()
                clearCallState()
                setLastEndedCall({
                    chatId: payload.chatId,
                    chatName: payload.chatName || "Call",
                    endedBy: payload.endedBy,
                })
            })

            connection.on("ParticipantJoinedCall", (payload: { chatId: string }) => {
                setActiveCall((prev: ActiveCallData | null) =>
                    prev && prev.chatId === payload.chatId
                        ? { ...prev, state: "connected" }
                        : prev
                )
                stopRingtone()
            })

            connection.onreconnecting(() => {
                setConnection(null)
            })

            connection.onreconnected(() => {
                setConnection(connection)
            })

            connection.onclose(() => {
                setConnection(null)
                connectionRef.current = null
                connectingRef.current = false

                if (!disposed) {
                    scheduleRetry()
                }
            })
        }

        const ensureConnected = async () => {
            if (disposed || connectingRef.current) {
                return
            }

            const existing = connectionRef.current
            if (existing) {
                if (existing.state === signalR.HubConnectionState.Connected) {
                    setConnection(existing)
                    return
                }

                if (
                    existing.state === signalR.HubConnectionState.Connecting ||
                    existing.state === signalR.HubConnectionState.Reconnecting
                ) {
                    return
                }
            }

            const token = localStorage.getItem("token")
            if (!token) {
                scheduleRetry()
                return
            }

            connectingRef.current = true

            const connection = new signalR.HubConnectionBuilder()
                .withUrl(`${API_BASE}/chatHub`, {
                    accessTokenFactory: () => localStorage.getItem("token") || "",
                    transport: signalR.HttpTransportType.WebSockets,
                })
                .withAutomaticReconnect()
                .build()

            bindEvents(connection)
            connectionRef.current = connection

            try {
                await connection.start()

                if (disposed) {
                    await connection.stop()
                    return
                }

                setConnection(connection)
            } catch (error: unknown) {
                console.error("SignalR connect failed:", error)
                connectionRef.current = null

                if (!disposed) {
                    scheduleRetry()
                }
            } finally {
                connectingRef.current = false
            }
        }

        void ensureConnected()

        return () => {
            disposed = true
            clearRetry()
        }
    }, [clearCallState, setActiveCall, setConnection, setIncomingCall, setLastEndedCall])

    return null
}
