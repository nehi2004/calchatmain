"use client"

import { useEffect, useRef } from "react"
import * as signalR from "@microsoft/signalr"
import { useCall } from "@/context/CallContext"

const API_BASE = "https://steadfast-warmth-production-64c8.up.railway.app"

export default function CallManager() {
    const {
        setIncomingCall,
        setConnection,
        pendingOfferData,
        startOutgoingCall,
        clearOutgoingCall,
        setAcceptedIncomingCall,
        endCall,
    } = useCall()

    const connectionRef = useRef<signalR.HubConnection | null>(null)
    const isConnectingRef = useRef(false)
    const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        let disposed = false

        const clearRetry = () => {
            if (retryRef.current) {
                clearTimeout(retryRef.current)
                retryRef.current = null
            }
        }

        const stopRingtone = () => {
            const ringtone = (window as any).ringtone
            if (ringtone?.pause) {
                ringtone.pause()
                ringtone.currentTime = 0
                    ; (window as any).ringtone = null
            }
        }

        const scheduleRetry = () => {
            clearRetry()
            retryRef.current = setTimeout(() => {
                void ensureConnected()
            }, 1500)
        }

        const attachEvents = (connection: signalR.HubConnection) => {
            connection.on("OutgoingCall", data => {
                startOutgoingCall({
                    userId: data.toUserId,
                    userName: data.fromUserId === data.toUserId ? "User" : data.toUserName || "User",
                    chatId: data.chatId,
                    callType: "voice",
                })
            })

            connection.on("IncomingCall", data => {
                localStorage.setItem("chatId", data.chatId)

                setAcceptedIncomingCall(false)
                setIncomingCall({
                    fromUserId: data.fromUserId,
                    fromUserName: data.fromUserName || "User",
                    callType: data.callType || "voice",
                    chatId: data.chatId,
                })

                try {
                    const audio = new Audio("/sounds/ringtone.mp3")
                    audio.loop = true
                    audio.play().catch(() => undefined)
                        ; (window as any).ringtone = audio
                } catch {
                    console.error("Ringtone playback failed")
                }
            })

            connection.on("ReceiveOffer", data => {
                pendingOfferData.current = data
            })

            connection.on("CallEnded", () => {
                stopRingtone()
                endCall()
            })

            connection.on("CallRejected", () => {
                stopRingtone()
                endCall()
                clearOutgoingCall()
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
                isConnectingRef.current = false

                if (!disposed) {
                    scheduleRetry()
                }
            })
        }

        const ensureConnected = async () => {
            if (disposed || isConnectingRef.current) {
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

            isConnectingRef.current = true

            const connection = new signalR.HubConnectionBuilder()
                .withUrl(`${API_BASE}/chatHub`, {
                    accessTokenFactory: () => localStorage.getItem("token") || "",
                    transport: signalR.HttpTransportType.WebSockets,
                })
                .withAutomaticReconnect()
                .build()

            connectionRef.current = connection
            attachEvents(connection)

            try {
                await connection.start()

                if (disposed) {
                    await connection.stop()
                    return
                }

                console.log("Global SignalR connected")
                setConnection(connection)
            } catch (err) {
                console.error("Global SignalR connection failed:", err)
                connectionRef.current = null

                if (!disposed) {
                    scheduleRetry()
                }
            } finally {
                isConnectingRef.current = false
            }
        }

        void ensureConnected()

        return () => {
            disposed = true
            clearRetry()
        }
    }, [
        clearOutgoingCall,
        endCall,
        pendingOfferData,
        setAcceptedIncomingCall,
        setConnection,
        setIncomingCall,
        startOutgoingCall,
    ])

    return null
}