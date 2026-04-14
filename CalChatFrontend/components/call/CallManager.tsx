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

            // 🔥 STORE chatId HERE
            localStorage.setItem("chatId", data.chatId)

            setIncomingCall({
                fromUserId: data.fromUserId,
                fromUserName: data.fromUserName || "User",
                callType: data.callType || "voice"
            })
        })

        connection.on("CallEnded", () => {
            setIncomingCall(null)
        })

        connectionRef.current = connection

    }, [])

    return null
}