"use client"

import { useEffect, useRef } from "react"
import * as signalR from "@microsoft/signalr"
import { useCall } from "@/context/CallContext"

const API_BASE = "https://steadfast-warmth-production-64c8.up.railway.app"

export default function CallManager() {
    const { setIncomingCall, setConnection, pendingOfferData } = useCall()
    const connectionRef = useRef<signalR.HubConnection | null>(null)
    const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        let cancelled = false

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

        const registerEvents = (connection: signalR.HubConnection) => {
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

            connection.onclose(() => {
                if (cancelled) {
                    return
                }

                console.warn("CallManager disconnected. Retrying...")
                setConnection(null)
                connectionRef.current = null
                scheduleRetry()
            })
        }

        const scheduleRetry = () => {
            clearRetry()

            retryRef.current = setTimeout(() => {
                void connect()
            }, 1200)
        }

        const connect = async () => {
            if (cancelled || connectionRef.current) {
                return
            }

            const token = localStorage.getItem("token")

            if (!token) {
                scheduleRetry()
                return
            }

            const connection = new signalR.HubConnectionBuilder()
                .withUrl(`${API_BASE}/chatHub`, {
                    accessTokenFactory: () => localStorage.getItem("token") || "",
                    transport: signalR.HttpTransportType.WebSockets,
                })
                .withAutomaticReconnect()
                .build()

            registerEvents(connection)

            try {
                await connection.start()
                if (cancelled) {
                    await connection.stop()
                    return
                }

                console.log("Global SignalR connected")
                connectionRef.current = connection
                setConnection(connection)
            } catch (err) {
                console.error("Global SignalR connection failed:", err)
                connection.off("IncomingCall")
                connection.off("ReceiveOffer")
                connection.off("CallEnded")
                connection.off("CallRejected")
                scheduleRetry()
            }
        }

        void connect()

        return () => {
            cancelled = true
            clearRetry()

            const connection = connectionRef.current
            if (connection) {
                connection.off("IncomingCall")
                connection.off("ReceiveOffer")
                connection.off("CallEnded")
                connection.off("CallRejected")
                void connection.stop()
                connectionRef.current = null
            }

            setConnection(null)
        }
    }, [pendingOfferData, setConnection, setIncomingCall])

    return null
}