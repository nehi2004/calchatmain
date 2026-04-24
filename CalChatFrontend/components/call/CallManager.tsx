"use client"

import { useEffect, useRef } from "react"
import * as signalR from "@microsoft/signalr"
import { useCall } from "@/context/CallContext"

const API_BASE = "https://steadfast-warmth-production-64c8.up.railway.app"

export default function CallManager() {
    const { setIncomingCall, setConnection, pendingOfferData } = useCall()

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
            connection.on("IncomingCall", data => {
                localStorage.setItem("chatId", data.chatId)

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
                setIncomingCall(null)
                stopRingtone()
            })

            connection.on("CallRejected", () => {
                setIncomingCall(null)
                stopRingtone()
            })

            connection.onreconnecting(error => {
                console.warn("Call hub reconnecting:", error)
                setConnection(null)
            })

            connection.onreconnected(() => {
                console.log("Call hub reconnected")
                setConnection(connection)
            })

            connection.onclose(error => {
                console.warn("Call hub closed:", error)
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

                if (existing.state === signalR.HubConnectionState.Connecting ||
                    existing.state === signalR.HubConnectionState.Reconnecting) {
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

                connection.off("IncomingCall")
                connection.off("ReceiveOffer")
                connection.off("CallEnded")
                connection.off("CallRejected")

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
    }, [pendingOfferData, setConnection, setIncomingCall])

    return null
}