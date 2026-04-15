"use client"

import { useEffect, useRef } from "react"
import * as signalR from "@microsoft/signalr"
import { useCall } from "@/context/CallContext"

export default function CallManager() {

    const { setIncomingCall, setConnection, pendingOfferData } = useCall()
    const connectionRef = useRef<signalR.HubConnection | null>(null)

    useEffect(() => {

        if (connectionRef.current) return

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://steadfast-warmth-production-64c8.up.railway.app/chatHub", {
                accessTokenFactory: () => localStorage.getItem("token") || "",
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build()

        connection.start()
            .then(() => {
                console.log("✅ Global SignalR Connected")
                setConnection(connection)
            })
            .catch(err => console.error(err))

        connection.on("IncomingCall", (data) => {
            console.log("📞 Incoming Call:", data)
            localStorage.setItem("chatId", data.chatId)
            setIncomingCall({
                fromUserId: data.fromUserId,
                fromUserName: data.fromUserName || "User",
                callType: data.callType || "voice",
                chatId: data.chatId   // pass through
            } as any)

            try {
                const audio = new Audio("/sounds/ringtone.mp3")
                audio.loop = true
                audio.play().catch(() => { })
                    ; (window as any).ringtone = audio
            } catch { }
        })

        // ✅ Store offer in shared ref so GlobalCallUI can use it
        connection.on("ReceiveOffer", (data) => {
            console.log("📩 Offer received, storing in ref")
            pendingOfferData.current = data
        })

        connection.on("CallEnded", () => {
            console.log("📴 Call Ended")
            setIncomingCall(null)
            const ringtone = (window as any).ringtone
            if (ringtone?.pause) {
                ringtone.pause()
                ringtone.currentTime = 0
                    ; (window as any).ringtone = null
            }
        })

        connectionRef.current = connection

    }, [])

    return null
}