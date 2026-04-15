"use client"

import { useEffect, useRef } from "react"
import * as signalR from "@microsoft/signalr"
import { useCall } from "@/context/CallContext"

export default function CallManager() {

    const { setIncomingCall, setConnection } = useCall()
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

        // 📞 INCOMING CALL
        connection.on("IncomingCall", (data) => {

            console.log("📞 Incoming Call:", data)

            // 🔥 STORE chatId
            localStorage.setItem("chatId", data.chatId)

            setIncomingCall({
                fromUserId: data.fromUserId,
                fromUserName: data.fromUserName || "User",
                callType: data.callType || "voice"
            })

            // 🔊 PLAY RINGTONE (SAFE + CLEAN)
            try {
                const audio = new Audio("/sounds/ringtone.mp3")
                audio.loop = true

                audio.play()
                    .then(() => {
                        console.log("🔊 Ringtone playing")
                    })
                    .catch(err => {
                        console.log("🔇 Autoplay blocked:", err)
                    })

                    // 🔥 SAFE STORE GLOBAL
                    ; (window as any).ringtone = audio

            } catch (err) {
                console.log("Ringtone error:", err)
            }
        })

        // 📴 CALL ENDED
        connection.on("CallEnded", () => {

            console.log("📴 Call Ended")

            setIncomingCall(null)

            // 🔕 STOP RINGTONE (SAFE)
            const ringtone = (window as any).ringtone

            if (ringtone && typeof ringtone.pause === "function") {
                ringtone.pause()
                ringtone.currentTime = 0
                    ; (window as any).ringtone = null
            }
        })

        connectionRef.current = connection

    }, [])

    return null
}