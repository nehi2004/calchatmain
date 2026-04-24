"use client"

import { useEffect, useRef, useState } from "react"
import * as signalR from "@microsoft/signalr"
import { Plus, Send, Paperclip, Smile, Phone, User, Users, Search, Sparkles } from "lucide-react"
import EmojiPicker from "emoji-picker-react"

import { useCall } from "@/context/CallContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Student {
    id: string
    name: string
    email?: string
}

interface Chat {
    id: string
    name: string
    type: "personal" | "group"
    members?: string[]
    unreadCount?: number
    isMuted?: boolean
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

const API_BASE = "https://steadfast-warmth-production-64c8.up.railway.app"

const avatarColors = [
    "bg-rose-500",
    "bg-sky-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-fuchsia-500",
    "bg-indigo-500",
    "bg-cyan-500",
]

const getAvatarColor = (name?: string) => {
    if (!name || name.length === 0) {
        return avatarColors[0]
    }

    const index = name.charCodeAt(0) % avatarColors.length
    return avatarColors[index]
}

const safeFetch = async <T,>(url: string): Promise<T> => {
    const token = localStorage.getItem("token")

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            UserId: localStorage.getItem("userId") || "",
        },
    })

    if (!res.ok) {
        throw new Error("API Error")
    }

    const text = await res.text()
    return text ? JSON.parse(text) : ([] as T)
}

export function GroupStudyView() {
    const { connection: callConnection, startOutgoingCall, clearOutgoingCall } = useCall()

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

    const [showProfile, setShowProfile] = useState(false)
    const [profileName, setProfileName] = useState("")
    const [profileId, setProfileId] = useState("")
    const [isBlocked, setIsBlocked] = useState(false)
    const [blockLoading, setBlockLoading] = useState(false)
    const [groupMembers, setGroupMembers] = useState<Student[]>([])
    const [groupDescription, setGroupDescription] = useState("")
    const [groupAdminId, setGroupAdminId] = useState("")
    const [isChatMuted, setIsChatMuted] = useState(false)
    const [typingUser, setTypingUser] = useState<string | null>(null)
    const [sentRequests, setSentRequests] = useState<string[]>([])
    const [mounted, setMounted] = useState(false)

    const currentUserId =
        typeof window !== "undefined"
            ? localStorage.getItem("userId") ?? ""
            : ""

    const bottomRef = useRef<HTMLDivElement>(null)
    const connectionRef = useRef<signalR.HubConnection | null>(null)

    const fetchSentRequests = async () => {
        try {
            const res = await safeFetch<string[]>(
                `${API_BASE}/api/notifications/sent/${currentUserId}`
            )
            setSentRequests(res)
        } catch {
            setSentRequests([])
        }
    }

    const markReadAndRefresh = async (chatId = activeChat) => {
        if (!chatId) {
            return
        }

        await fetch(`${API_BASE}/api/messages/read/${chatId}`, {
            method: "POST",
            headers: {
                UserId: currentUserId,
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })

        connectionRef.current?.invoke("MessageRead", String(chatId))
        window.dispatchEvent(new Event("chat-updated"))

        const res = await fetch(`${API_BASE}/api/messages/${chatId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
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
                status: m.status || "read",
            }))
        )
    }

    const sendRequest = async (studentId: string) => {
        if (studentId === currentUserId) {
            return
        }

        if (sentRequests.includes(studentId)) {
            alert("Request already sent")
            return
        }

        let userName = localStorage.getItem("name")

        if (!userName) {
            const currentUser = students.find(student => student.id === currentUserId)
            userName = currentUser?.name || "Unknown User"
        }

        await fetch(`${API_BASE}/api/notifications/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fromUserId: currentUserId,
                fromUserName: userName,
                toUserId: studentId,
                content: "sent you a chat request",
            }),
        })

        setSentRequests(prev => [...prev, studentId])
        fetchSentRequests()
        window.dispatchEvent(new Event("chat-updated"))

        alert("Request Sent")
    }

    const toggleBlockUser = async () => {
        if (!profileId) {
            return
        }

        setBlockLoading(true)

        try {
            const url = isBlocked
                ? `${API_BASE}/api/users/unblock/${profileId}`
                : `${API_BASE}/api/users/block/${profileId}`

            const method = isBlocked ? "DELETE" : "POST"

            await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            setIsBlocked(prev => !prev)
        } catch {
            alert("Error updating block status")
        }

        setBlockLoading(false)
    }

    const startCall = async () => {
        if (!activeChat || activeTab !== "personal") {
            return
        }

        if (!callConnection) {
            alert("Call service is not ready yet.")
            return
        }

        if (callConnection.state !== signalR.HubConnectionState.Connected) {
            alert("Call service is connecting. Please try again.")
            return
        }

        const chat = chats.find(item => item.id === activeChat)
        if (!chat || chat.type !== "personal") {
            return
        }

        const otherUserId = chat.members?.find(member => String(member) !== String(currentUserId))
        if (!otherUserId) {
            return
        }

        const otherUser =
            students.find(student => String(student.id) === String(otherUserId))?.name ||
            activeChatName ||
            "User"

        localStorage.setItem("chatId", String(activeChat))
        setShowProfile(false)

        startOutgoingCall({
            userId: otherUserId,
            userName: otherUser,
            chatId: String(activeChat),
            callType: "voice",
        })

        try {
            await callConnection.invoke("CallUser", otherUserId, String(activeChat))
        } catch (err) {
            console.error("CallUser invoke failed:", err)
            clearOutgoingCall()
            alert("Unable to start call right now.")
        }
    }

    const createGroup = async () => {
        const res = await fetch(`${API_BASE}/api/groups`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: groupName,
                members: [...selectedStudents, currentUserId],
            }),
        })

        const data = await res.json()
        const newGroupId = data.chatId

        setActiveChat(String(newGroupId))
        setActiveChatName(groupName)
        setShowCreateGroup(false)
        setGroupName("")
        setSelectedStudents([])
        setActiveTab("group")

        const updatedChats = await safeFetch<Chat[]>(
            `${API_BASE}/api/chat/group/${currentUserId}`
        )
        setChats(updatedChats)
    }

    const addMembersToGroup = async () => {
        if (!activeChat || selectedStudents.length === 0) {
            return
        }

        try {
            await Promise.all(
                selectedStudents.map(studentId =>
                    fetch(`${API_BASE}/api/groups/add-member`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            groupId: Number(activeChat),
                            userId: studentId,
                        }),
                    })
                )
            )

            alert("Members Added Successfully")
            setSelectedStudents([])
            setShowCreateGroup(false)

            const res = await fetch(`${API_BASE}/api/groups/${activeChat}`)
            const data = await res.json()

            setGroupMembers(data.members || [])
        } catch {
            alert("Error adding members")
        }
    }

    const sendMessage = async () => {
        if (isBlocked) {
            alert("You blocked this user")
            return
        }

        if ((!message && !file) || !activeChat) {
            return
        }

        const formData = new FormData()
        formData.append("chatId", String(activeChat))
        formData.append("message", message || "")

        if (file) {
            formData.append("file", file)
        }

        const res = await fetch(`${API_BASE}/api/messages`, {
            method: "POST",
            headers: {
                UserId: currentUserId,
            },
            body: formData,
        })

        const savedMessage = await res.json()

        setMessages(prev => [
            ...prev,
            {
                id: savedMessage.id,
                senderId: savedMessage.senderId,
                senderName: savedMessage.senderName,
                message: savedMessage.message || savedMessage.text || savedMessage.Text || "",
                fileUrl: savedMessage.fileUrl,
                time: savedMessage.time,
                status: "sent",
            },
        ])

        connectionRef.current?.invoke("SendMessage", savedMessage)

        setMessage("")
        setFile(null)
        setShowEmoji(false)
    }

    const clearChat = async () => {
        if (!activeChat) {
            return
        }

        try {
            await fetch(`${API_BASE}/api/messages/clear/${activeChat}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    UserId: currentUserId,
                },
            })

            setMessages([])
            alert("Chat cleared")
        } catch {
            alert("Clear chat failed")
        }
    }

    const toggleMuteChat = async () => {
        if (!activeChat) {
            return
        }

        try {
            const res = await fetch(`${API_BASE}/api/chat/mute/${activeChat}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    UserId: currentUserId,
                },
            })

            const data = await res.json()
            setIsChatMuted(data.isMuted)
            window.dispatchEvent(new Event("chat-updated"))

            alert(data.isMuted ? "Chat muted" : "Chat unmuted")
        } catch {
            alert("Mute failed")
        }
    }

    const addEmoji = (emoji: { emoji: string }) => {
        setMessage(prev => prev + emoji.emoji)
    }

    useEffect(() => {
        const joinChat = async () => {
            if (!activeChat || !connectionRef.current) {
                return
            }

            if (connectionRef.current.state !== signalR.HubConnectionState.Connected) {
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
        if (!activeChat) {
            return
        }

        fetch(`${API_BASE}/api/chat/mute/${activeChat}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                UserId: currentUserId,
            },
        })
            .then(res => res.json())
            .then(data => setIsChatMuted(data.isMuted))
            .catch(() => setIsChatMuted(false))
    }, [activeChat, currentUserId])

    useEffect(() => {
        const refreshChats = async () => {
            try {
                const data = await safeFetch<Chat[]>(
                    `${API_BASE}/api/chat/personal/${currentUserId}`
                )

                setChats(data)
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

    useEffect(() => {
        safeFetch<Student[]>(`${API_BASE}/api/users/students`)
            .then(setStudents)
            .catch(() => setStudents([]))
    }, [])

    useEffect(() => {
        setActiveChat(null)
        setMessages([])
        setActiveChatName("")

        const loadChats = async () => {
            try {
                const url =
                    activeTab === "personal"
                        ? `${API_BASE}/api/chat/personal/${currentUserId}`
                        : `${API_BASE}/api/chat/group/${currentUserId}`

                const data = await safeFetch<Chat[]>(url)
                setChats(data)
            } catch {
                setChats([])
            }
        }

        loadChats()
    }, [activeTab, currentUserId])

    useEffect(() => {
        if (!activeChat) {
            return
        }

        markReadAndRefresh(activeChat)
    }, [activeChat])

    useEffect(() => {
        if (!activeChat) {
            return
        }

        const interval = setInterval(async () => {
            const res = await fetch(`${API_BASE}/api/chat/typing/${activeChat}`)
            const user = await res.text()
            setTypingUser(user)
        }, 1500)

        return () => clearInterval(interval)
    }, [activeChat])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        })
    }, [messages])

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const url =
                    activeTab === "personal"
                        ? `${API_BASE}/api/chat/personal/${currentUserId}`
                        : `${API_BASE}/api/chat/group/${currentUserId}`

                const updatedChats = await safeFetch<Chat[]>(url)
                setChats(updatedChats)
            } catch (err) {
                console.error("Polling error:", err)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [activeTab, currentUserId])

    useEffect(() => {
        setMounted(true)

        if (connectionRef.current) {
            return
        }

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${API_BASE}/chatHub`, {
                accessTokenFactory: () => localStorage.getItem("token") || "",
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .build()

        connection.start()
            .then(() => {
                console.log("SignalR connected")
            })
            .catch(err => console.error("Connection error:", err))

        connection.on("ReceiveMessage", (msg: any) => {
            if (!msg) {
                return
            }

            const newMessage = {
                id: msg.id,
                senderId: msg.senderId,
                senderName: msg.senderName,
                message: msg.message || msg.text || msg.Text || "",
                fileUrl: msg.fileUrl,
                time: msg.time,
                isCall: msg.isCall || false,
                status: msg.status || "delivered",
            }

            setMessages(prev => {
                if (prev.some(item => String(item.id) === String(newMessage.id))) {
                    return prev
                }

                return [...prev, newMessage]
            })
        })

        connection.on("MessageRead", () => {
            setMessages(prev =>
                prev.map(item =>
                    item.senderId === currentUserId
                        ? { ...item, status: "read" }
                        : item
                )
            )
        })

        connectionRef.current = connection
    }, [currentUserId])

    if (!mounted) {
        return null
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.45)]">
            {showCreateGroup && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
                    <div className="w-[420px] rounded-[26px] border border-slate-200 bg-white p-6 shadow-2xl">
                        <div className="mb-5 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    {activeChat ? "Add Members" : "Create Study Group"}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Build a focused room for notes, discussion, and quick calls.
                                </p>
                            </div>
                        </div>

                        <Input
                            placeholder="Group Name"
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                            className="mb-4 h-11 rounded-xl"
                        />

                        <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            {students
                                .filter(student => {
                                    if (activeTab === "group") {
                                        return !groupMembers.some(member => member.id === student.id)
                                    }

                                    return student.id !== currentUserId
                                })
                                .map(student => (
                                    <label
                                        key={student.id}
                                        className="mb-2 flex cursor-pointer items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm last:mb-0"
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
                                        <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(student.name)}`}>
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                {student.name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {student.email || "Student"}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowCreateGroup(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={activeChat ? addMembersToGroup : createGroup}
                                disabled={selectedStudents.length === 0}
                                className="rounded-xl"
                            >
                                {activeChat ? "Add Members" : "Create Group"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-80 border-r border-slate-200 bg-slate-50/80">
                <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#eff6ff_100%)] p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                Group Study
                            </p>
                            <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                                Chats
                            </h2>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-amber-500 shadow-sm">
                            <Sparkles className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="flex rounded-2xl bg-white p-1 shadow-sm">
                        <button
                            className={cn(
                                "flex-1 rounded-xl px-3 py-2 text-sm font-medium transition",
                                activeTab === "personal"
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-600"
                            )}
                            onClick={() => setActiveTab("personal")}
                        >
                            Personal
                        </button>
                        <button
                            className={cn(
                                "flex-1 rounded-xl px-3 py-2 text-sm font-medium transition",
                                activeTab === "group"
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-600"
                            )}
                            onClick={() => setActiveTab("group")}
                        >
                            Groups
                        </button>
                    </div>

                    {activeTab === "group" && (
                        <Button
                            className="mt-4 h-11 w-full rounded-2xl bg-slate-900 text-white hover:bg-slate-800"
                            onClick={() => setShowCreateGroup(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Study Group
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[calc(100%-220px)]">
                    <div className="p-3">
                        {chats.map(chat => {
                            let chatTitle = chat.name?.trim()

                            if (chat.type === "group") {
                                chatTitle = chat.name || "Unnamed Group"
                            } else if (chat.type === "personal" && chat.members) {
                                const otherUserId = chat.members.find(member => String(member) !== String(currentUserId))
                                const otherUser = students.find(student => String(student.id) === String(otherUserId))
                                chatTitle = otherUser?.name || "Unknown User"
                            }

                            const isActive = activeChat === chat.id

                            return (
                                <button
                                    key={chat.id}
                                    onClick={() => {
                                        setActiveChat(chat.id)
                                        setActiveChatName(chatTitle)
                                    }}
                                    className={cn(
                                        "mb-2 w-full rounded-2xl border px-3 py-3 text-left transition",
                                        isActive
                                            ? "border-slate-900 bg-white shadow-md"
                                            : "border-transparent bg-white/70 hover:border-slate-200 hover:bg-white"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold text-white ${getAvatarColor(chatTitle)}`}>
                                                {chat.type === "group"
                                                    ? <Users className="h-4 w-4" />
                                                    : (chatTitle || "").charAt(0).toUpperCase()}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {chatTitle}
                                                </p>
                                                <p className="truncate text-xs text-slate-500">
                                                    {chat.type === "group" ? "Group discussion" : "Direct chat"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {chat.isMuted && (
                                                <span className="text-xs text-slate-400">🔕</span>
                                            )}

                                            {(chat.unreadCount ?? 0) > 0 && (
                                                <div className="flex min-w-[24px] items-center justify-center rounded-full bg-emerald-500 px-2 py-1 text-xs font-semibold text-white">
                                                    {chat.unreadCount}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </ScrollArea>

                {activeTab === "personal" && (
                    <div className="border-t border-slate-200 bg-white p-3">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Students
                        </p>

                        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                            {students
                                .filter(student => student.id !== currentUserId)
                                .map(student => (
                                    <div
                                        key={student.id}
                                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-900">
                                                {student.name}
                                            </p>
                                            <p className="truncate text-xs text-slate-500">
                                                {student.email || "Student"}
                                            </p>
                                        </div>

                                        {!sentRequests.includes(student.id) &&
                                            !chats.some(chat =>
                                                chat.members?.includes(student.id) &&
                                                chat.members?.includes(currentUserId)
                                            ) && (
                                                <Button
                                                    size="sm"
                                                    className="rounded-xl"
                                                    onClick={() => sendRequest(student.id)}
                                                >
                                                    Request
                                                </Button>
                                            )}
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
                <div className="border-b border-slate-200 bg-white/80 p-4 backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            {activeChatName ? (
                                <button
                                    className="flex items-center gap-3"
                                    onClick={() => {
                                        setProfileName(activeChatName)

                                        if (activeTab === "personal") {
                                            const chat = chats.find(item => item.id === activeChat)
                                            const otherUserId = chat?.members?.find(
                                                member => String(member) !== String(currentUserId)
                                            )

                                            const id = otherUserId || ""
                                            setProfileId(id)

                                            if (id) {
                                                fetch(`${API_BASE}/api/users/is-blocked/${id}`, {
                                                    headers: {
                                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                                    },
                                                })
                                                    .then(res => res.json())
                                                    .then(data => setIsBlocked(data.blocked))
                                                    .catch(() => setIsBlocked(false))
                                            }
                                        }

                                        if (activeTab === "group" && activeChat) {
                                            fetch(`${API_BASE}/api/groups/${activeChat}`)
                                                .then(async res => {
                                                    const text = await res.text()
                                                    return text ? JSON.parse(text) : {}
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
                                    <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm ${getAvatarColor(activeChatName)}`}>
                                        {activeTab === "group"
                                            ? <Users className="h-5 w-5" />
                                            : activeChatName.charAt(0).toUpperCase()}

                                        {activeTab === "personal" && (
                                            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                                        )}
                                    </div>

                                    <div className="min-w-0 text-left">
                                        <h3 className="truncate text-base font-semibold text-slate-900">
                                            {activeChatName}
                                        </h3>
                                        <p className="truncate text-sm text-slate-500">
                                            {activeTab === "group" ? "Study room details" : "Tap to view profile"}
                                        </p>
                                    </div>
                                </button>
                            ) : (
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">
                                        Select a chat
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Pick a conversation to start messaging.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={startCall}
                                disabled={!activeChat || activeTab !== "personal"}
                                className="h-11 w-11 rounded-2xl border-slate-200 bg-white"
                            >
                                <Phone className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {showProfile && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 backdrop-blur-sm"
                        onClick={() => setShowProfile(false)}
                    >
                        <div
                            className="max-h-[90vh] w-[380px] overflow-y-auto rounded-[26px] border border-slate-200 bg-white text-slate-900 shadow-2xl"
                            onClick={event => event.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b border-slate-200 p-5">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {activeTab === "group" ? "Group Profile" : "Profile"}
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        {activeTab === "group" ? "Group settings and members" : "Chat actions and details"}
                                    </p>
                                </div>

                                <button onClick={() => setShowProfile(false)} className="text-xl text-slate-500">
                                    ×
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="text-center">
                                    <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] text-3xl font-bold text-white shadow-lg ${getAvatarColor(profileName)}`}>
                                        {profileName.charAt(0).toUpperCase()}
                                    </div>

                                    <h2 className="mt-4 text-xl font-semibold">{profileName}</h2>

                                    {activeTab === "group" && (
                                        <p className="mt-1 text-sm text-slate-500">
                                            Group • {groupMembers.length} members
                                        </p>
                                    )}
                                </div>

                                {activeTab === "personal" && (
                                    <div className="mt-6 space-y-4">
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <button
                                                onClick={startCall}
                                                className="rounded-2xl bg-emerald-50 px-3 py-3 text-emerald-700"
                                            >
                                                <Phone className="mx-auto mb-1 h-4 w-4" />
                                                Voice
                                            </button>

                                            <button
                                                className="rounded-2xl bg-violet-50 px-3 py-3 text-violet-700"
                                                onClick={async () => {
                                                    if (!activeChat) {
                                                        return
                                                    }

                                                    try {
                                                        const res = await fetch(`${API_BASE}/api/messages/export/${activeChat}`, {
                                                            headers: {
                                                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                                                            },
                                                        })

                                                        if (!res.ok) {
                                                            throw new Error()
                                                        }

                                                        const blob = await res.blob()
                                                        const url = window.URL.createObjectURL(blob)
                                                        const anchor = document.createElement("a")
                                                        anchor.href = url
                                                        anchor.download = `chat-${activeChat}.txt`
                                                        anchor.click()
                                                        window.URL.revokeObjectURL(url)
                                                    } catch {
                                                        alert("Export failed")
                                                    }
                                                }}
                                            >
                                                <Search className="mx-auto mb-1 h-4 w-4" />
                                                Export
                                            </button>

                                            <button
                                                onClick={() => {
                                                    alert(`User Info\n\nName: ${profileName}\nID: ${profileId}`)
                                                }}
                                                className="rounded-2xl bg-slate-100 px-3 py-3 text-slate-700"
                                            >
                                                <User className="mx-auto mb-1 h-4 w-4" />
                                                Info
                                            </button>
                                        </div>

                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                                                Student ID
                                            </p>
                                            <p className="mt-2 break-all text-sm font-medium text-slate-900">
                                                {profileId}
                                            </p>
                                        </div>

                                        <div className="overflow-hidden rounded-2xl border border-slate-200">
                                            <button onClick={clearChat} className="w-full border-b border-slate-200 px-4 py-3 text-left text-sm">
                                                Clear Chat
                                            </button>
                                            <button onClick={toggleMuteChat} className="w-full border-b border-slate-200 px-4 py-3 text-left text-sm">
                                                {isChatMuted ? "Unmute Chat" : "Mute Chat"}
                                            </button>
                                            <button
                                                onClick={toggleBlockUser}
                                                disabled={blockLoading}
                                                className={cn(
                                                    "w-full px-4 py-3 text-left text-sm",
                                                    isBlocked ? "text-emerald-600" : "text-rose-600"
                                                )}
                                            >
                                                {isBlocked ? "Unblock User" : "Block User"}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "group" && (
                                    <div className="mt-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <button
                                                onClick={() => {
                                                    setShowProfile(false)
                                                    setSelectedStudents([])
                                                    setShowCreateGroup(true)
                                                }}
                                                className="rounded-2xl bg-violet-50 px-3 py-3 text-violet-700"
                                            >
                                                <Plus className="mx-auto mb-1 h-4 w-4" />
                                                Add Members
                                            </button>

                                            <button
                                                onClick={() => {
                                                    alert(`Group Info\n\nName: ${profileName}\nMembers: ${groupMembers.length}`)
                                                }}
                                                className="rounded-2xl bg-slate-100 px-3 py-3 text-slate-700"
                                            >
                                                <User className="mx-auto mb-1 h-4 w-4" />
                                                Info
                                            </button>
                                        </div>

                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                                                Group Description
                                            </p>
                                            <p className="mt-2 text-sm text-slate-700">
                                                {groupDescription || "Add group description"}
                                            </p>
                                            <p className="mt-3 text-xs text-slate-500">
                                                Created by {groupAdminId || "Admin"}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="mb-3 text-sm font-semibold text-slate-900">
                                                Members ({groupMembers.length})
                                            </p>

                                            <div className="space-y-2">
                                                {groupMembers.map(member => (
                                                    <div
                                                        key={member.id}
                                                        className="flex items-center justify-between rounded-xl bg-white px-3 py-2"
                                                    >
                                                        <span className="text-sm text-slate-700">
                                                            {member.name}
                                                        </span>
                                                        {member.id === groupAdminId && (
                                                            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-medium text-white">
                                                                Admin
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="overflow-hidden rounded-2xl border border-slate-200">
                                            <button onClick={clearChat} className="w-full border-b border-slate-200 px-4 py-3 text-left text-sm">
                                                Clear Chat
                                            </button>
                                            <button onClick={toggleMuteChat} className="w-full border-b border-slate-200 px-4 py-3 text-left text-sm">
                                                {isChatMuted ? "Unmute Group" : "Mute Group"}
                                            </button>
                                            <button
                                                className="w-full px-4 py-3 text-left text-sm text-rose-600"
                                                onClick={async () => {
                                                    if (!activeChat) {
                                                        return
                                                    }

                                                    try {
                                                        await fetch(`${API_BASE}/api/groups/exit/${activeChat}`, {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                                UserId: currentUserId,
                                                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                                                            },
                                                        })

                                                        alert("Exited group")
                                                        setActiveChat(null)
                                                        setMessages([])

                                                        const updatedChats = await safeFetch<Chat[]>(
                                                            `${API_BASE}/api/chat/group/${currentUserId}`
                                                        )
                                                        setChats(updatedChats)
                                                    } catch {
                                                        alert("Exit failed")
                                                    }
                                                }}
                                            >
                                                Exit Group
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <ScrollArea className="flex-1 p-4">
                    {!activeChat && (
                        <div className="flex h-full items-center justify-center">
                            <div className="max-w-md text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[24px] bg-slate-900 text-white">
                                    <Users className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900">
                                    Choose a conversation
                                </h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Open a direct chat for messages and voice calls, or jump into a study group.
                                </p>
                            </div>
                        </div>
                    )}

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
                                    "max-w-[72%] rounded-[22px] px-4 py-3 shadow-sm",
                                    String(msg.senderId) === String(currentUserId)
                                        ? "bg-slate-900 text-white"
                                        : "border border-slate-200 bg-white text-slate-900"
                                )}
                            >
                                {activeTab === "group" &&
                                    String(msg.senderId) !== String(currentUserId) && (
                                        <p className="mb-1 text-xs font-semibold text-sky-600">
                                            {students.find(student => String(student.id) === String(msg.senderId))?.name || "Student"}
                                        </p>
                                    )}

                                {msg.isCall ? (
                                    <p className="text-center text-xs font-medium text-slate-500">
                                        {msg.message}
                                    </p>
                                ) : (
                                    <p className="text-sm leading-6">{msg.message}</p>
                                )}

                                {msg.fileUrl && (
                                    msg.fileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                                        <img
                                            src={`${API_BASE}${msg.fileUrl}`}
                                            alt="chat-image"
                                            className="mt-3 max-h-60 rounded-2xl cursor-pointer"
                                            onClick={() => window.open(`${API_BASE}${msg.fileUrl}`, "_blank")}
                                        />
                                    ) : (
                                        <a
                                            href={`${API_BASE}${msg.fileUrl}`}
                                            download
                                            target="_blank"
                                            className="mt-3 inline-block text-xs underline"
                                            rel="noreferrer"
                                        >
                                            Download File
                                        </a>
                                    )
                                )}

                                <div className="mt-2 flex items-center justify-end gap-1 text-[10px] opacity-70">
                                    <span>
                                        {msg.time
                                            ? new Date(msg.time).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : ""}
                                    </span>

                                    {String(msg.senderId) === String(currentUserId) && (
                                        <span>
                                            {msg.status === "sent" && "✓"}
                                            {msg.status === "delivered" && "✓✓"}
                                            {msg.status === "read" && (
                                                <span className="text-emerald-400">✓✓</span>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div ref={bottomRef} />
                </ScrollArea>

                {typingUser && typingUser !== currentUserId && (
                    <p className="px-4 pb-1 text-xs text-slate-500 animate-pulse">
                        {activeTab === "group"
                            ? `${students.find(student => student.id === typingUser)?.name || "Student"} typing...`
                            : "typing..."}
                    </p>
                )}

                <div className="border-t border-slate-200 bg-white p-3">
                    {showEmoji && (
                        <div className="absolute bottom-20 z-30">
                            <EmojiPicker onEmojiClick={addEmoji} />
                        </div>
                    )}

                    {file && (
                        <div className="mb-3 flex items-center justify-between rounded-2xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
                            <span className="truncate">{file.name}</span>
                            <button onClick={() => setFile(null)} className="text-rose-500">
                                Remove
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-2 rounded-[24px] border border-slate-200 bg-slate-50 px-2 py-2 shadow-sm">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setShowEmoji(prev => !prev)}
                            className="rounded-2xl"
                        >
                            <Smile className="h-5 w-5" />
                        </Button>

                        <label className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl text-slate-500 transition hover:bg-white">
                            <input
                                type="file"
                                hidden
                                onChange={event => setFile(event.target.files?.[0] || null)}
                            />
                            <Paperclip className="h-5 w-5" />
                        </label>

                        <Input
                            value={message}
                            onChange={event => {
                                setMessage(event.target.value)

                                if (connectionRef.current && activeChat) {
                                    fetch(`${API_BASE}/api/chat/typing`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            chatId: Number(activeChat),
                                            userId: currentUserId,
                                        }),
                                    }).catch(err => console.error("Typing error:", err))
                                }

                                setTimeout(() => setTypingUser(null), 2000)
                            }}
                            onKeyDown={event => {
                                if (event.key === "Enter") {
                                    event.preventDefault()
                                    sendMessage()
                                }
                            }}
                            placeholder={activeChat ? "Type a message..." : "Select a chat first"}
                            disabled={!activeChat}
                            className="h-11 flex-1 rounded-2xl border-0 bg-transparent shadow-none focus-visible:ring-0"
                        />

                        <Button
                            size="icon"
                            onClick={sendMessage}
                            disabled={!activeChat}
                            className="h-11 w-11 rounded-2xl"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
