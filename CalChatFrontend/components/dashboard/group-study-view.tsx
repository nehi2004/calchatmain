

"use client"

import { useEffect, useRef, useState } from "react"
import * as signalR from "@microsoft/signalr"
import { Plus, Send, Phone, Video, Paperclip, Smile, PhoneOff, Bell, User, Users } from "lucide-react"
import EmojiPicker from "emoji-picker-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Student {
    id: string        // userId
    name: string
    email?: string    // ⭐ ADD THIS
}

interface Chat {
    id: string
    name: string
    type: "personal" | "group"
    members?: string[]
    unreadCount?: number
    isMuted?: boolean   // ✅ ADD THIS
}

interface Message {
    id: string
    senderId: string
    senderName: string
    message: string
    fileUrl?: string
    time: string
    status?: "sent" | "delivered" | "read"
    isCall?: boolean
}

interface Notification {
    id: number
    fromUserId: string
    fromUserName: string
    toUserId: string
    content: string
    status: string
    isRead: boolean
}

const avatarColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-indigo-500"
]

const getAvatarColor = (name?: string) => {

    if (!name || name.length === 0) {
        return avatarColors[0]   // default color
    }

    const index = name.charCodeAt(0) % avatarColors.length
    return avatarColors[index]

}

const safeFetch = async <T,>(url: string): Promise<T> => {

    const token = localStorage.getItem("token")

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            UserId: localStorage.getItem("userId") || ""
        }
    })


    if (!res.ok) throw new Error("API Error")

    const text = await res.text()

    return text ? JSON.parse(text) : ([] as T)
}

export function GroupStudyView() {

    /* ---------------- STATES ---------------- */

    const [students, setStudents] = useState<Student[]>([])
    const [chats, setChats] = useState<Chat[]>([])
    const [messages, setMessages] = useState<Message[]>([])

    const [activeTab, setActiveTab] = useState<"personal" | "group">("personal")
    const [activeChat, setActiveChat] = useState<string | null>(null)
    const [activeChatName, setActiveChatName] = useState("")

    const [message, setMessage] = useState("")
    const [file, setFile] = useState<File | null>(null)

    const [showEmoji, setShowEmoji] = useState(false)

    const [showCreateGroup, setShowCreateGroup] = useState(false)
    const [groupName, setGroupName] = useState("")
    const [selectedStudents, setSelectedStudents] = useState<string[]>([])

    const [callType, setCallType] = useState<"voice" | null>(null)
    const [outgoingCallType, setOutgoingCallType] = useState<"voice" | null>(null)
    const [isAccepting, setIsAccepting] = useState(false)

    const [incomingCall, setIncomingCall] = useState<{
        fromUserId: string
        fromUserName: string
        callType: "voice" | "video"
    } | null>(null)


    const [showProfile, setShowProfile] = useState(false)
    const [profileName, setProfileName] = useState("")
    const [profileId, setProfileId] = useState("")
    const [isBlocked, setIsBlocked] = useState(false)
    const [blockLoading, setBlockLoading] = useState(false)
    const [groupMembers, setGroupMembers] = useState<Student[]>([])
    const [groupDescription, setGroupDescription] = useState("")
    const [groupAdminId, setGroupAdminId] = useState("")


    const localStream = useRef<MediaStream | null>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const connectionRef = useRef<signalR.HubConnection | null>(null)
    const [isMuted, setIsMuted] = useState(false)


    const peerRef = useRef<RTCPeerConnection | null>(null)
    const remoteAudioRef = useRef<HTMLAudioElement>(null)
    const ringtoneRef = useRef<HTMLAudioElement | null>(null)



    const [callUserId, setCallUserId] = useState<string | null>(null)

    const [isCalling, setIsCalling] = useState(false)


    useEffect(() => {

        const joinChat = async () => {

            if (!activeChat || !connectionRef.current) return

            if (connectionRef.current.state !== signalR.HubConnectionState.Connected) {
                console.log("⏳ Waiting for connection...")
                return
            }

            try {
                await connectionRef.current.invoke("JoinChat", String(activeChat))
            } catch (err) {
                console.error("JoinChat Error:", err)
            }
        }

        joinChat()

    }, [activeChat])

    useEffect(() => {
        if (!activeChat) return

        fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/chat/mute/${activeChat}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                UserId: currentUserId
            }
        })
            .then(res => res.json())
            .then(data => setIsMuted(data.isMuted))
            .catch(() => setIsMuted(false))

    }, [activeChat])

    const [typingUser, setTypingUser] = useState<string | null>(null)

    const currentUserId =
        typeof window !== "undefined"
            ? localStorage.getItem("userId") ?? ""
            : ""

    /* ---------------- NOTIFICATIONS ---------------- */
    const [sentRequests, setSentRequests] = useState<string[]>([])

    useEffect(() => {

        const refreshChats = async () => {

            try {
                const data = await safeFetch<Chat[]>(
                    `https://steadfast-warmth-production-64c8.up.railway.app/api/chat/personal/${currentUserId}`
                )

                setChats(data)

                // 🔥 IMPORTANT ADD THIS
                await fetchSentRequests()

            } catch {
                setChats([])
            }
        }

        window.addEventListener("chat-updated", refreshChats)

        return () => {
            window.removeEventListener("chat-updated", refreshChats)
        }

    }, [currentUserId])

    useEffect(() => {

        fetchSentRequests()

    }, [])

    const fetchSentRequests = async () => {

        try {

            const res = await safeFetch<string[]>(
                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/sent/${currentUserId}`
            )

            setSentRequests(res)

        } catch {

            setSentRequests([])

        }

    }

    const handleRequest = async (notifId: number, status: string) => {

        await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/${notifId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(status)
        })

        const chats = await safeFetch<Chat[]>(
            `https://steadfast-warmth-production-64c8.up.railway.app/api/chat/personal/${currentUserId}`
        )
        setChats(chats)

        fetchSentRequests()

        // 🔥 ADD THIS LINE
        window.dispatchEvent(new Event("chat-updated"))
    }


    const sendRequest = async (studentId: string) => {

        if (studentId === currentUserId) return

        if (sentRequests.includes(studentId)) {
            alert("Request already sent")
            return
        }

        let userName = localStorage.getItem("name")

        if (!userName) {
            const currentUser = students.find(s => s.id === currentUserId)
            userName = currentUser?.name || "Unknown User"
        }

        await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fromUserId: currentUserId,
                fromUserName: userName,
                toUserId: studentId,
                content: "sent you a chat request"
            })
        })

        setSentRequests(prev => [...prev, studentId])
        fetchSentRequests()

        // 🔥 ADD THIS LINE
        window.dispatchEvent(new Event("chat-updated"))

        alert("Request Sent")
    }

    const toggleBlockUser = async () => {

        if (!profileId) return

        setBlockLoading(true)

        try {

            const url = isBlocked
                ? `https://steadfast-warmth-production-64c8.up.railway.app/api/users/unblock/${profileId}`
                : `https://steadfast-warmth-production-64c8.up.railway.app/api/users/block/${profileId}`

            const method = isBlocked ? "DELETE" : "POST"

            await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }

            })

            setIsBlocked(!isBlocked)

        } catch {

            alert("Error updating block status")

        }

        setBlockLoading(false)

    }
    /* ---------------- STUDENTS ---------------- */

    useEffect(() => {

        safeFetch<Student[]>("https://steadfast-warmth-production-64c8.up.railway.app/api/users/students")
            .then(setStudents)
            .catch(() => setStudents([]))

    }, [])



    /* ---------------- CHATS ---------------- */

    useEffect(() => {

        // ⭐ RESET OLD CHAT WHEN TAB CHANGES
        setActiveChat(null)
        setMessages([])
        setActiveChatName("")

        const loadChats = async () => {

            try {

                if (activeTab === "personal") {

                    const data = await safeFetch<Chat[]>(`https://steadfast-warmth-production-64c8.up.railway.app/api/chat/personal/${currentUserId}`)
                    setChats(data)

                } else {

                    const data = await safeFetch<Chat[]>(`https://steadfast-warmth-production-64c8.up.railway.app/api/chat/group/${currentUserId}`)
                    setChats(data)

                }

            } catch {

                setChats([])

            }

        }

        loadChats()

    }, [activeTab])

    /* ---------------- MESSAGES ---------------- */



    useEffect(() => {

        if (!activeChat) return

        const markReadAndRefresh = async () => {

            await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/messages/read/${activeChat}`, {
                method: "POST",
                headers: {
                    UserId: currentUserId,
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            connectionRef.current?.invoke("MessageRead", String(activeChat))

            const res = await fetch(
                `https://steadfast-warmth-production-64c8.up.railway.app/api/messages/${activeChat}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })


            const msgs = await res.json()

            setMessages(
                msgs.map((m: any) => ({
                    id: m.id,
                    senderId: m.senderId,
                    senderName: m.senderName,
                    message: m.message || m.text || m.Text || "",
                    fileUrl: m.fileUrl,
                    time: m.time,
                    isCall: m.isCall || false,
                    status: m.status || "read"
                }))
            )

        }

        markReadAndRefresh()



    }, [activeChat])


    const createPeer = () => {

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" }
            ]
        })

        pc.ontrack = (event) => {
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = event.streams[0]
            }
        }

        pc.onicecandidate = (event) => {
            if (event.candidate && callUserId) {
                connectionRef.current?.invoke(
                    "SendIceCandidate",
                    JSON.stringify(event.candidate),
                    callUserId
                )
            }
        }

        peerRef.current = pc
    }


    // ✅ MIC TOGGLE
    const toggleMute = () => {
        if (!localStream.current) return

        const audioTrack = localStream.current.getAudioTracks()[0]

        if (!audioTrack) return

        if (audioTrack.enabled) {
            audioTrack.enabled = false   // 🔴 mute
            console.log("🔇 Mic OFF")
        } else {
            audioTrack.enabled = true    // 🟢 unmute
            console.log("🎤 Mic ON")
        }

        setIsMuted(!audioTrack.enabled)
    }


    /* ---------------- CALL ---------------- */
    const startCall = async () => {

        // 🔥 OPEN UI FOR CALLER
        window.dispatchEvent(new Event("start-call"))

        if (!activeChat || !connectionRef.current) return

        setIsCalling(true)

        if (connectionRef.current.state !== signalR.HubConnectionState.Connected) {
            console.log("❌ SignalR not connected yet")
            return
        }

        const chat = chats.find(c => c.id === activeChat)
        if (!chat || chat.type === "group") return

        const otherUserId = chat.members?.find(
            m => String(m) !== String(currentUserId)
        )

        if (!otherUserId) return

        setCallUserId(otherUserId)

        // 🔥 STORE chatId BEFORE CALL (ADD THIS LINE)
        localStorage.setItem("chatId", String(activeChat))

        await connectionRef.current.invoke(
            "CallUser",
            otherUserId,
            String(activeChat)
        )

        createPeer()

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        })

        console.log("🎤 Local Audio Tracks (startCall):", stream.getAudioTracks())

        localStream.current = stream


        const audioTrack = stream.getAudioTracks()[0]

        if (audioTrack) {
            peerRef.current?.addTrack(audioTrack, stream)
        }

        const offer = await peerRef.current!.createOffer()
        await peerRef.current!.setLocalDescription(offer)

        await connectionRef.current.invoke(
            "SendOffer",
            JSON.stringify(offer),
            otherUserId
        )

        setCallType("voice")
    }



    const endCall = () => {

        console.log("Ending call")

        // 🔥 stop media
        localStream.current?.getTracks().forEach(track => track.stop())
        localStream.current = null

        setCallType(null)
        setOutgoingCallType(null)
        setIncomingCall(null)

        setIsCalling(false)   // ✅ ADD HERE
    }

    const handleEndCall = async () => {

        console.log("🔴 End Call button clicked")

        try {

            if (!connectionRef.current) return

            const chat = chats.find(c => c.id === activeChat)
            if (!chat || !chat.members) return

            const otherUserId = chat.members.find(
                m => String(m) !== String(currentUserId)
            )

            if (otherUserId) {

                const chatId = activeChat || localStorage.getItem("chatId")

                await connectionRef.current.invoke(
                    "EndCall",
                    String(otherUserId),
                    String(chatId)
                )

            }

        } catch (err) {

            console.error("EndCall SignalR error:", err)

        }

        // 🔥 CLEANUP
        endCall()
        setIsCalling(false)

        // ✅ 🔥 FORCE REFRESH AFTER CALL (VERY IMPORTANT)
        setTimeout(() => {
            if (activeChat) {
                markReadAndRefresh()
            }
        }, 500)
    }
    /* ---------------- CREATE GROUP ---------------- */

    const createGroup = async () => {

        const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/groups", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: groupName,
                members: [...selectedStudents, currentUserId]
            })
        })

        const data = await res.json()

        const newGroupId = data.chatId   // ✅ IMPORTANT

        setActiveChat(String(newGroupId))
        setActiveChatName(groupName)// ✅ SET ACTIVE CHAT

        setShowCreateGroup(false)
        setGroupName("")
        setSelectedStudents([])
        setActiveTab("group")

        const chats = await safeFetch<Chat[]>(`https://steadfast-warmth-production-64c8.up.railway.app/api/chat/group/${currentUserId}`)
        setChats(chats)
    }

    /* ---------------- SEND MESSAGE ---------------- */
    const sendMessage = async () => {

        if (isBlocked) {
            alert("You blocked this user")
            return
        }

        if ((!message && !file) || !activeChat) return

        const formData = new FormData()

        formData.append("chatId", String(activeChat))
        formData.append("message", message || "")

        if (file) {
            formData.append("file", file)
        }

        const res = await fetch(
            "https://steadfast-warmth-production-64c8.up.railway.app/api/messages",
            {
                method: "POST",
                headers: {
                    UserId: currentUserId
                },
                body: formData
            }
        )

        const savedMessage = await res.json()

        // ✅ 1. INSTANT UI UPDATE (sender)
        // ✅ INSTANT UI UPDATE (VERY IMPORTANT)
        setMessages(prev => [
            ...prev,
            {
                id: savedMessage.id,
                senderId: savedMessage.senderId,
                senderName: savedMessage.senderName,
                message: savedMessage.message || savedMessage.text || savedMessage.Text || "",// make sure correct field
                fileUrl: savedMessage.fileUrl,
                time: savedMessage.time,
                status: "sent"
            }
        ])

        // ✅ 2. SEND FULL MESSAGE VIA SIGNALR
        connectionRef.current?.invoke(
            "SendMessage",
            savedMessage   // 🔥 SEND FULL OBJECT (IMPORTANT)
        )

        setMessage("")
        setFile(null)
    }


    const addEmoji = (emoji: any) => setMessage(prev => prev + emoji.emoji)

    useEffect(() => {

        if (!activeChat) return

        const interval = setInterval(async () => {

            const res = await fetch(
                `https://steadfast-warmth-production-64c8.up.railway.app/api/chat/typing/${activeChat}`
            )

            const user = await res.text()

            setTypingUser(user)

        }, 1500)

        return () => clearInterval(interval)

    }, [activeChat])

    /* ---------------- MOUNT FIX ---------------- */

    const [mounted, setMounted] = useState(false)
    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end"
        })

    }, [messages])

    const markReadAndRefresh = async () => {
        await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/messages/read/${activeChat}`, {
            method: "POST",
            headers: {
                UserId: currentUserId,
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        connectionRef.current?.invoke("MessageRead", String(activeChat))

        // ✅ ADD THIS (IMPORTANT)
        window.dispatchEvent(new Event("chat-updated"))

        const res = await fetch(
            `https://steadfast-warmth-production-64c8.up.railway.app/api/messages/${activeChat}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        const msgs = await res.json()

        setMessages(
            msgs.map((m: any) => ({
                id: m.id,
                senderId: m.senderId,
                senderName: m.senderName,
                message: m.message || m.text || m.Text || "",
                fileUrl: m.fileUrl,
                time: m.time,
                isCall: m.isCall || false,   // ✅ IMPORTANT
                status: m.status || "read"
            }))
        )
    }
    const addMembersToGroup = async () => {

        if (!activeChat || selectedStudents.length === 0) return

        try {

            await Promise.all(
                selectedStudents.map(studentId =>
                    fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/groups/add-member", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            groupId: Number(activeChat),
                            userId: studentId
                        })
                    })
                )
            )

            alert("Members Added Successfully")

            setSelectedStudents([])
            setShowCreateGroup(false)

            // 🔥 REFRESH GROUP DATA
            const res = await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/groups/${activeChat}`)
            const data = await res.json()

            setGroupMembers(data.members || [])

        } catch {
            alert("Error adding members")
        }
    }
    useEffect(() => {

        const interval = setInterval(async () => {

            try {

                const url =
                    activeTab === "personal"
                        ? `https://steadfast-warmth-production-64c8.up.railway.app/api/chat/personal/${currentUserId}`
                        : `https://steadfast-warmth-production-64c8.up.railway.app/api/chat/group/${currentUserId}`

                const updatedChats = await safeFetch<Chat[]>(url)

                setChats(updatedChats)

            } catch (err) {
                console.error("Polling error:", err)
            }

        }, 5000)

        return () => clearInterval(interval)

    }, [activeTab, currentUserId])

    const pendingOfferRef = useRef<any>(null)

    useEffect(() => {

        setMounted(true)

        if (connectionRef.current) return // ✅ PREVENT DUPLICATE

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://steadfast-warmth-production-64c8.up.railway.app/chatHub", {
                accessTokenFactory: () => localStorage.getItem("token") || "",
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build()

        connection.start()
            .then(() => {
                console.log("✅ SignalR Connected")
            })
            .catch(err => console.error("❌ Connection error:", err))

        // ===============================
        // ✅ 🔥 ADD ALL LISTENERS HERE
        // ===============================
        connection.on("IncomingCall", (data) => {
            console.log("📞 Incoming Call:", data)

            // 🔥 STORE chatId HERE (VERY IMPORTANT)
            localStorage.setItem("chatId", data.chatId)

            let name = data.fromUserName

            if (!name) {
                const user = students.find(
                    s => String(s.id) === String(data.fromUserId)
                )
                name = user?.name || "User"
            }

            setIncomingCall({
                ...data,
                fromUserName: name
            })
        })

        connection.on("ReceiveOffer", async (data) => {
            console.log("📩 Offer received (waiting for accept)")

            // 🔥 STORE OFFER ONLY (DO NOT START CALL)
            pendingOfferRef.current = data

            setCallUserId(data.fromUserId)
        })

        connection.on("ReceiveAnswer", async (data) => {
            console.log("✅ Answer received")

            await peerRef.current?.setRemoteDescription(
                new RTCSessionDescription(JSON.parse(data.answer))
            )
        })


        connection.on("CallAccepted", () => {
            console.log("📞 Call accepted")

            setOutgoingCallType(null)
            setCallType("voice")
        })

        connection.on("ReceiveIceCandidate", async (data) => {
            console.log("🧊 ICE received")

            if (data.candidate) {
                await peerRef.current?.addIceCandidate(
                    new RTCIceCandidate(JSON.parse(data.candidate))
                )
            }
        })

        connection.on("CallEnded", () => {
            console.log("Call ended by other user")

            endCall()
            setIncomingCall(null)
            setOutgoingCallType(null)
        })

        connection.on("CallRejected", () => {

            console.log("❌ Call rejected by user")

            endCall()
            setOutgoingCallType(null)
            setCallType(null)
            setIsCalling(false)
        })

        connection.on("ReceiveMessage", (msg: any) => {

            if (!msg) return

            const newMessage = {
                id: msg.id,
                senderId: msg.senderId,
                senderName: msg.senderName,
                message: msg.message || msg.text || msg.Text || "",
                fileUrl: msg.fileUrl,
                time: msg.time,
                isCall: msg.isCall || false,
                status: msg.status || "delivered"
            }

            setMessages(prev => {
                // جلوگیری از duplicate
                if (prev.some(m => String(m.id) === String(newMessage.id))) {
                    return prev
                }

                return [...prev, newMessage]
            })
        })

        connection.on("MessageRead", () => {
            setMessages(prev =>
                prev.map(m =>
                    m.senderId === currentUserId
                        ? { ...m, status: "read" }
                        : m
                )
            )
        })

        connectionRef.current = connection

    }, [])

    if (!mounted) return null

    const acceptCall = async () => {

        if (isAccepting) return
        setIsAccepting(true)

        if (ringtoneRef.current) {
            ringtoneRef.current.pause()
            ringtoneRef.current.currentTime = 0
        }

        try {

            if (!incomingCall || !connectionRef.current) return

            console.log("✅ Accepting call")

            const fromUserId = incomingCall.fromUserId
            setCallUserId(fromUserId)

            const data = pendingOfferRef.current
            if (!data) return

            // 🔥 SHOW UI FIRST (IMPORTANT)
            setCallType("voice")

            const chatId = localStorage.getItem("chatId") // 🔥 ADD

            await connectionRef.current.invoke("AcceptCall", fromUserId)

            // cleanup
            localStream.current?.getTracks().forEach(track => track.stop())
            localStream.current = null

            createPeer()

            let stream: MediaStream

            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: true
                })
            } catch (err) {
                console.error("Mic error:", err)
                alert("Mic permission required")
                setIsAccepting(false)
                return
            }

            console.log("🎤 Local Audio Tracks (acceptCall):", stream.getAudioTracks())

            localStream.current = stream


            const audioTrack = stream.getAudioTracks()[0]

            if (audioTrack) {
                peerRef.current?.addTrack(audioTrack, stream)
            }

            console.log("🎥 Video Tracks:", stream.getVideoTracks())

            await peerRef.current?.setRemoteDescription(
                new RTCSessionDescription(JSON.parse(data.offer))
            )

            const answer = await peerRef.current!.createAnswer()
            await peerRef.current!.setLocalDescription(answer)

            await connectionRef.current.invoke(
                "SendAnswer",
                JSON.stringify(answer),
                fromUserId
            )

            setIncomingCall(null)

        } catch (err) {
            console.error("❌ getUserMedia error:", err)
            alert("Mic permission required")
        }

        setIsAccepting(false)
    }


    const rejectCall = async () => {

        // 🔕 STOP RINGTONE
        if (ringtoneRef.current) {
            ringtoneRef.current.pause()
            ringtoneRef.current.currentTime = 0
        }

        if (!incomingCall || !connectionRef.current) return

        await connectionRef.current.invoke(
            "RejectCall",
            incomingCall.fromUserId
        )

        setIncomingCall(null)
        setCallType(null)
    }

    // ✅ CLEAR CHAT
    const clearChat = async () => {
        if (!activeChat) return

        try {
            await fetch(
                `https://steadfast-warmth-production-64c8.up.railway.app/api/messages/clear/${activeChat}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        UserId: currentUserId
                    }
                }
            )

            setMessages([])
            alert("Chat cleared")

        } catch {
            alert("Clear chat failed")
        }
    }


    // ✅ MUTE / UNMUTE CHAT
    const toggleMuteChat = async () => {
        if (!activeChat) return

        try {
            const res = await fetch(
                `https://steadfast-warmth-production-64c8.up.railway.app/api/chat/mute/${activeChat}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        UserId: currentUserId
                    }
                }
            )

            const data = await res.json()

            setIsMuted(data.isMuted)

            window.dispatchEvent(new Event("chat-updated"))

            alert(data.isMuted ? "Chat muted 🔕" : "Chat unmuted 🔔")

        } catch {
            alert("Mute failed")
        }
    }



    /* ---------------- UI ---------------- */

    return (



        <div className="flex h-[calc(100vh-8rem)] rounded-xl border overflow-hidden">
            {showCreateGroup && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[99999]">

                    <div className="bg-white rounded-xl w-[380px] p-6">

                        <h2 className="text-lg font-semibold mb-4">
                            {activeChat ? "Add Members" : "Create Group"}
                        </h2>

                        {/* GROUP NAME */}
                        <Input
                            placeholder="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="mb-4"
                        />

                        {/* STUDENTS LIST */}
                        <div className="max-h-40 overflow-y-auto border rounded p-2 mb-4">

                            {students
                                .filter(student => {
                                    // 🔥 GROUP MODE → remove already added members
                                    if (activeTab === "group") {
                                        return !groupMembers.some(m => m.id === student.id)
                                    }

                                    // 🔥 CREATE MODE → remove current user only
                                    return student.id !== currentUserId
                                })
                                .map(student => (

                                    <label
                                        key={student.id}
                                        className="flex items-center gap-2 mb-1 cursor-pointer"
                                    >

                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(student.id)}
                                            onChange={() => {

                                                setSelectedStudents(prev =>
                                                    prev.includes(student.id)
                                                        ? prev.filter(id => id !== student.id)
                                                        : [...prev, student.id]
                                                )

                                            }}
                                        />

                                        <span>{student.email || student.name}</span>

                                    </label>

                                ))}

                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-2">

                            <Button
                                variant="outline"
                                onClick={() => setShowCreateGroup(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={activeChat ? addMembersToGroup : createGroup}
                                disabled={selectedStudents.length === 0}
                            >
                                {activeChat ? "Add Members" : "Create"}
                            </Button>

                        </div>

                    </div>

                </div>

            )}

            {/* LEFT SIDEBAR */}

            <div className="w-72 border-r flex flex-col">

                <div className="flex border-b">

                    <button
                        className={cn("flex-1 p-3", activeTab === "personal" && "bg-muted")}
                        onClick={() => setActiveTab("personal")}
                    >
                        Personal Chat
                    </button>

                    <button
                        className={cn("flex-1 p-3", activeTab === "group" && "bg-muted")}
                        onClick={() => setActiveTab("group")}
                    >
                        Group Chat
                    </button>

                </div>

                {activeTab === "group" && (

                    <div className="p-3">

                        <Button
                            className="w-full"
                            onClick={() => setShowCreateGroup(true)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Group
                        </Button>

                    </div>

                )}

                <ScrollArea className="flex-1">

                    {chats.map(chat => {

                        let chatTitle = chat.name?.trim()

                        if (chat.type === "group") {
                            chatTitle = chat.name || "Unnamed Group"
                        }
                        else if (chat.type === "personal" && chat.members) {

                            const otherUserId = chat.members.find(
                                m => String(m) !== String(currentUserId)
                            )

                            const otherUser = students.find(
                                s => String(s.id) === String(otherUserId)
                            )

                            if (otherUser) {
                                chatTitle = otherUser.name
                            } else {
                                chatTitle = "Unknown User"
                            }
                        }

                        return (
                            <button
                                key={chat.id}
                                onClick={() => {
                                    setActiveChat(chat.id)
                                    setActiveChatName(chatTitle)
                                }}
                                className="w-full flex items-center justify-between p-3 hover:bg-muted"
                            >

                                <div className="flex items-center gap-3">

                                    {/* AVATAR */}
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getAvatarColor(chatTitle)}`}>
                                        {chat.type === "group"
                                            ? <Users className="h-4 w-4" />
                                            : (chatTitle || "").charAt(0).toUpperCase()
                                        }
                                    </div>

                                    <span>{chatTitle}</span>
                                </div>

                                {/* 🔥 UNREAD COUNT BADGE */}
                                <div className="flex items-center gap-2">

                                    {/* 🔕 MUTE ICON */}
                                    {chat.isMuted && (
                                        <span className="text-gray-400 text-sm">🔕</span>
                                    )}

                                    {/* 🟢 UNREAD COUNT */}
                                    {(chat.unreadCount ?? 0) > 0 && (
                                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                                            {chat.unreadCount}
                                        </div>
                                    )}

                                </div>

                            </button>

                        )

                    })}

                </ScrollArea>

                {activeTab === "personal" && (

                    <div className="border-t p-3">

                        <p className="text-xs text-muted-foreground mb-2">
                            Students
                        </p>

                        {students
                            .filter(student => student.id !== currentUserId)
                            .map(student => (

                                <div key={student.id} className="flex justify-between mb-2">

                                    <span>{student.name}</span>

                                    {!sentRequests.includes(student.id) &&
                                        !sentRequests.includes(student.id) &&
                                        !chats.some(c =>
                                            c.members?.includes(student.id) &&
                                            c.members?.includes(currentUserId)
                                        ) && (
                                            <Button size="sm" onClick={() => sendRequest(student.id)}>
                                                Request
                                            </Button>
                                        )}

                                </div>

                            ))}

                    </div>

                )}

            </div>

            {/* CHAT AREA */}

            <div className="flex flex-1 flex-col">

                <div className="flex items-center justify-between border-b p-3">

                    <div className="flex items-center gap-3">

                        {activeChatName && (

                            <div
                                className="relative cursor-pointer"
                                onClick={() => {

                                    setProfileName(activeChatName)

                                    if (activeTab === "personal") {

                                        const chat = chats.find(c => c.id === activeChat)

                                        const otherUserId = chat?.members?.find(
                                            m => String(m) !== String(currentUserId)
                                        )

                                        const id = otherUserId || ""

                                        setProfileId(id)

                                        if (id) {

                                            fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/users/is-blocked/${id}`, {
                                                headers: {
                                                    Authorization: `Bearer ${localStorage.getItem("token")}`
                                                }
                                            })

                                                .then(res => res.json())
                                                .then(data => {

                                                    setIsBlocked(data.blocked)

                                                })
                                                .catch(() => setIsBlocked(false))

                                        }

                                    }

                                    if (activeTab === "group" && activeChat) {

                                        fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/groups/${activeChat}`)
                                            .then(async (res) => {

                                                const text = await res.text()

                                                if (!text) return {}

                                                return JSON.parse(text)

                                            })
                                            .then(data => {

                                                setGroupMembers(data.members || [])
                                                setGroupDescription(data.description || "")
                                                setGroupAdminId(data.adminId || "")

                                            })
                                            .catch(() => {

                                                setGroupMembers([])
                                                setGroupDescription("")
                                                setGroupAdminId("")

                                            })

                                    }

                                    setShowProfile(true)

                                }}
                            >

                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(activeChatName)}`}>

                                    {activeTab === "group"
                                        ? <Users className="h-4 w-4" />
                                        : activeChatName.charAt(0).toUpperCase()
                                    }

                                </div>

                                {activeTab === "personal" && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                )}

                            </div>

                        )}

                        <h3 className="font-semibold">
                            {activeChatName || "Select Chat"}
                        </h3>

                    </div>

                    <div className="flex gap-2 items-center relative">




                        <Button
                            size="icon"
                            variant="outline"
                            onClick={startCall}
                            disabled={isCalling}
                        >
                            {isCalling ? "..." : <Phone className="h-4 w-4" />}
                        </Button>



                    </div>

                </div>

                {/* INCOMING CALL POPUP */}

                {/* WHATSAPP STYLE TOP INCOMING CALL */}
                {incomingCall && (
                    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] w-[95%] max-w-md">

                        <div className="bg-gray-900 text-white rounded-xl shadow-2xl p-4 flex items-center justify-between">

                            {/* LEFT SIDE */}
                            <div className="flex items-center gap-3">

                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                                    {incomingCall.fromUserName?.trim()
                                        ? incomingCall.fromUserName.trim()[0].toUpperCase()
                                        : "U"}
                                </div>

                                {/* Name + Text */}
                                <div>
                                    <p className="font-semibold text-sm">
                                        {incomingCall.fromUserName || "Unknown User"}
                                    </p>
                                    <p className="text-xs text-gray-300">
                                        Incoming voice call
                                    </p>
                                </div>

                            </div>

                            {/* RIGHT SIDE BUTTONS */}
                            <div className="flex items-center gap-2">

                                {/* Reject */}
                                <button
                                    onClick={rejectCall}
                                    className="bg-red-500 px-3 py-1 rounded-full text-xs"
                                >
                                    DECLINE
                                </button>

                                {/* Accept */}
                                <button
                                    onClick={acceptCall}
                                    disabled={isAccepting}
                                    className="bg-green-500 px-3 py-1 rounded-full text-xs"
                                >
                                    {isAccepting ? "..." : "ANSWER"}
                                </button>

                            </div>

                        </div>

                    </div>
                )}


                {/* WHATSAPP STYLE CALL MODAL */}
                {callType && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm">

                        {/* CALL BOX */}
                        <div className="w-[380px] h-[520px] bg-[#0b141a] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                            {/* TOP BAR */}
                            <div className="flex justify-between items-center p-4 text-gray-300 text-sm border-b border-gray-700">
                                <span>{activeChatName}</span>
                                <span>End-to-end encrypted</span>
                            </div>

                            {/* CENTER */}
                            <div className="flex-1 relative flex items-center justify-center">

                                <div className="w-32 h-32 rounded-full bg-gray-500 flex items-center justify-center text-4xl text-white">
                                    {activeChatName?.charAt(0) || "U"}
                                </div>

                                <div className="absolute bottom-6 text-center w-full">
                                    <h2 className="text-white text-lg font-semibold">
                                        {activeChatName}
                                    </h2>

                                    <p className="text-gray-300 text-sm">
                                        {peerRef.current ? "Connected" : "Calling..."}
                                    </p>
                                </div>

                            </div>

                            {/* ✅ CONTROLS INSIDE */}
                            <div className="flex justify-between items-center px-6 pb-6">

                                <div className="flex gap-3">



                                    <button
                                        onClick={toggleMute}
                                        className={`p-3 rounded-full ${isMuted ? "bg-red-500" : "bg-gray-800"}`}
                                    >
                                        {isMuted ? "🔇" : "🎤"}
                                    </button>

                                </div>

                                <button
                                    onClick={handleEndCall}
                                    className="bg-red-500 p-4 rounded-full"
                                >
                                    <PhoneOff className="h-5 w-5 text-white" />
                                </button>

                            </div>

                        </div>
                    </div>
                )}


                {/* PROFILE MODAL */}

                {showProfile && (

                    <div
                        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
                        onClick={() => setShowProfile(false)}
                    >

                        <div
                            className="bg-white dark:bg-gray-900 rounded-xl w-[360px] max-h-[90vh] overflow-y-auto text-black dark:text-white shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >

                            {/* HEADER */}

                            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-4">

                                <h2 className="font-semibold text-lg">
                                    {activeTab === "group" ? "Group Profile" : "Profile"}
                                </h2>

                                <button
                                    onClick={() => setShowProfile(false)}
                                    className="text-xl"
                                >
                                    ✕
                                </button>

                            </div>


                            {/* AVATAR */}

                            <div className="text-center p-6">

                                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold ${getAvatarColor(profileName)}`}>
                                    {profileName.charAt(0).toUpperCase()}
                                </div>

                                <h2 className="mt-4 font-semibold text-lg">
                                    {profileName}
                                </h2>

                                {activeTab === "group" && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Group • {groupMembers.length} Members
                                    </p>
                                )}

                            </div>


                            {/* PERSONAL PROFILE */}

                            {activeTab === "personal" && (

                                <div className="px-6 pb-6 space-y-4">

                                    <div className="flex justify-around text-sm">

                                        <span onClick={startCall}
                                            className="flex items-center gap-1 text-green-500 cursor-pointer">
                                            <Phone className="h-4 w-4" /> Voice
                                        </span>


                                        <span
                                            className="flex items-center gap-1 text-purple-500 cursor-pointer"
                                            onClick={async () => {

                                                if (!activeChat) return

                                                try {

                                                    const res = await fetch(
                                                        `https://steadfast-warmth-production-64c8.up.railway.app/api/messages/export/${activeChat}`,
                                                        {
                                                            headers: {
                                                                Authorization: `Bearer ${localStorage.getItem("token")}`
                                                            }
                                                        }
                                                    )

                                                    if (!res.ok) throw new Error()

                                                    const blob = await res.blob()

                                                    const url = window.URL.createObjectURL(blob)

                                                    const a = document.createElement("a")
                                                    a.href = url
                                                    a.download = `chat-${activeChat}.txt`
                                                    a.click()

                                                    window.URL.revokeObjectURL(url)

                                                } catch {
                                                    alert("Export failed")
                                                }

                                            }}
                                        >
                                            📤 Export
                                        </span>

                                        <span
                                            onClick={() => {
                                                alert(`User Info\n\nName: ${profileName}\nID: ${profileId}`)
                                            }}
                                            className="flex items-center gap-1 text-gray-500 dark:text-gray-400 cursor-pointer"
                                        >
                                            <User className="h-4 w-4" /> Info
                                        </span>

                                    </div>


                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm">

                                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                                            Student ID
                                        </p>

                                        <p className="font-medium break-all">
                                            {profileId}
                                        </p>

                                    </div>


                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg divide-y divide-gray-200 dark:divide-gray-700 text-sm">

                                        <button onClick={clearChat} className="w-full p-3 text-left">
                                            🧹 Clear Chat
                                        </button>

                                        <button onClick={toggleMuteChat} className="w-full p-3 text-left">
                                            {isMuted ? "🔔 Unmute Chat" : "🔕 Mute Chat"}
                                        </button>

                                        <button
                                            onClick={toggleBlockUser}
                                            className={cn(
                                                "w-full p-3 text-left flex items-center gap-2",
                                                isBlocked
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-red-500 dark:text-red-400"
                                            )}
                                        >
                                            {isBlocked ? "🔓 Unblock User" : "🚫 Block User"}
                                        </button>

                                    </div>

                                </div>

                            )}


                            {/* GROUP PROFILE */}

                            {activeTab === "group" && (

                                <div className="px-6 pb-6 space-y-4">

                                    <div className="flex justify-around text-sm">

                                        <span className="flex items-center gap-1 text-green-500 cursor-pointer">
                                            <Phone className="h-4 w-4" /> Voice
                                        </span>



                                        <span
                                            onClick={() => {
                                                setShowProfile(false)
                                                setSelectedStudents([])
                                                setShowCreateGroup(true)
                                            }}
                                            className="flex items-center gap-1 text-purple-500 cursor-pointer"
                                        >
                                            <Plus className="h-4 w-4" /> Add
                                        </span>

                                        <span
                                            onClick={() => {
                                                alert(`Group Info\n\nName: ${profileName}\nMembers: ${groupMembers.length}`)
                                            }}
                                            className="flex items-center gap-1 text-gray-500 dark:text-gray-400 cursor-pointer"
                                        >
                                            <User className="h-4 w-4" /> Info
                                        </span>

                                    </div>


                                    <Input
                                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
                                        placeholder="Search messages..."
                                    />


                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm">

                                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                                            Group Description
                                        </p>

                                        <p>
                                            {groupDescription || "Add group description"}
                                        </p>

                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            Created by {profileId}
                                        </p>

                                    </div>


                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">

                                        <p className="font-semibold mb-2">
                                            Members ({groupMembers.length})
                                        </p>

                                        {groupMembers.map(member => (
                                            <div key={member.id}
                                                className="flex justify-between text-sm py-1">

                                                <span>{member.name}</span>

                                                {member.id === groupAdminId && (
                                                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                                                        Admin
                                                    </span>
                                                )}

                                            </div>
                                        ))}

                                    </div>


                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg divide-y divide-gray-200 dark:divide-gray-700 text-sm">

                                        <button onClick={clearChat} className="w-full p-3 text-left">
                                            🧹 Clear Chat
                                        </button>

                                        <button onClick={toggleMuteChat} className="w-full p-3 text-left">
                                            🔔 Mute / Unmute
                                        </button>

                                        <button
                                            className="w-full p-3 text-left text-red-500 dark:text-red-400"
                                            onClick={async () => {

                                                if (!activeChat) return

                                                try {

                                                    await fetch(
                                                        `https://steadfast-warmth-production-64c8.up.railway.app/api/groups/exit/${activeChat}`,
                                                        {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                                UserId: currentUserId,
                                                                Authorization: `Bearer ${localStorage.getItem("token")}`
                                                            }
                                                        }
                                                    )

                                                    alert("Exited group")

                                                    setActiveChat(null)
                                                    setMessages([])

                                                    const updatedChats = await safeFetch<Chat[]>(
                                                        `https://steadfast-warmth-production-64c8.up.railway.app/api/chat/group/${currentUserId}`
                                                    )

                                                    setChats(updatedChats)

                                                } catch {
                                                    alert("Exit failed")
                                                }

                                            }}
                                        >
                                            🚪 Exit Group
                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                )}
                {/* MESSAGES */}

                <ScrollArea className="flex-1 p-4">

                    {messages.map(msg => (

                        <div
                            key={msg.id}
                            className={cn(
                                "mb-3 flex",
                                String(msg.senderId) === String(currentUserId)
                                    ? "justify-end"
                                    : "justify-start"
                            )}
                        >

                            <div
                                className={cn(
                                    "px-4 py-2 rounded-xl max-w-[70%]",
                                    String(msg.senderId) === String(currentUserId)
                                        ? "bg-primary text-white"
                                        : "bg-muted"
                                )}
                            >



                                {
                                    activeTab === "group" &&
                                    String(msg.senderId) !== String(currentUserId) && (
                                        <p className="text-xs text-blue-500 font-semibold">
                                            {students.find(s => String(s.id) === String(msg.senderId))?.name || "Student"}
                                        </p>
                                    )
                                }

                                {msg.isCall ? (
                                    <p className="text-center text-gray-500 text-xs font-medium">
                                        {msg.message}
                                    </p>
                                ) : (
                                    <p>{msg.message}</p>
                                )}

                                {msg.fileUrl && (

                                    msg.fileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (

                                        <img
                                            src={`https://steadfast-warmth-production-64c8.up.railway.app${msg.fileUrl}`}
                                            alt="chat-image"
                                            className="rounded-lg mt-2 max-h-60 cursor-pointer"
                                            onClick={() => window.open(`https://steadfast-warmth-production-64c8.up.railway.app${msg.fileUrl}`, "_blank")}
                                        />

                                    ) : (

                                        <a
                                            href={`https://steadfast-warmth-production-64c8.up.railway.app${msg.fileUrl}`}
                                            download
                                            target="_blank"
                                            className="text-xs underline"
                                        >
                                            Download File
                                        </a>

                                    )

                                )}



                                <div className="flex items-center justify-end gap-1 text-[10px] opacity-60">

                                    <span>
                                        {
                                            msg.time
                                                ? new Date(msg.time).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })
                                                : ""
                                        }
                                    </span>

                                    {String(msg.senderId) === String(currentUserId) && (

                                        <span>

                                            {msg.status === "sent" && "✓"}

                                            {msg.status === "delivered" && "✓✓"}

                                            {msg.status === "read" && (
                                                <span className="text-green-500">✓✓</span>
                                            )}

                                        </span>

                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                    <div ref={bottomRef}></div>

                </ScrollArea>

                {typingUser && typingUser !== currentUserId && (

                    <p className="text-xs text-muted-foreground px-4 pb-1 animate-pulse">

                        {activeTab === "group"
                            ? `${students.find(s => s.id === typingUser)?.name || "Student"} typing...`
                            : "typing..."}

                    </p>

                )}

                {/* INPUT */}

                <div className="border-t p-3 relative">

                    {showEmoji && (
                        <div className="absolute bottom-16">
                            <EmojiPicker onEmojiClick={addEmoji} />
                        </div>
                    )}

                    <div className="flex gap-2 items-center">

                        {file && (
                            <div className="text-xs mb-2 text-muted-foreground flex justify-between">
                                <span>{file.name}</span>
                                <button
                                    onClick={() => setFile(null)}
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                        )}

                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setShowEmoji(!showEmoji)}
                        >
                            <Smile className="h-5 w-5" />
                        </Button>

                        <label>

                            <input
                                type="file"
                                hidden
                                onChange={(e) =>
                                    setFile(e.target.files?.[0] || null)
                                }
                            />

                            <Paperclip className="h-5 w-5 cursor-pointer" />

                        </label>

                        <Input
                            value={message}
                            onChange={(e) => {

                                setMessage(e.target.value)

                                if (connectionRef.current && activeChat) {

                                    fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/chat/typing", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            chatId: Number(activeChat),
                                            userId: currentUserId
                                        })
                                    }).catch(err => console.error("Typing error:", err))

                                }

                                setTimeout(() => setTypingUser(null), 2000)

                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    sendMessage()
                                }
                            }}
                            placeholder="Type message..."
                            className="flex-1"
                        />

                        <Button size="icon" onClick={sendMessage}>
                            <Send className="h-4 w-4" />
                        </Button>

                        <audio ref={remoteAudioRef} autoPlay playsInline />
                        <audio ref={ringtoneRef} src="/sounds/ringtone.mp3" loop />

                    </div>

                </div>

            </div>


        </div>

    )
}
