"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import * as signalR from "@microsoft/signalr"
import {
    Plus,
    Send,
    Paperclip,
    Smile,
    Phone,
    User,
    Users,
    Sparkles,
    Video,
    ChevronDown,
} from "lucide-react"
import EmojiPicker from "emoji-picker-react"
import { useCall, type CallType } from "@/context/CallContext"

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

interface ApiMessage {
    id: string
    senderId: string
    senderName: string
    message?: string
    text?: string
    Text?: string
    fileUrl?: string
    time: string
    status?: "sent" | "delivered" | "read"
    isCall?: boolean
}

const API_BASE = "https://steadfast-warmth-production-64c8.up.railway.app"

const avatarColors = [
    "bg-sky-500",
    "bg-blue-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-rose-500",
]

const getAvatarColor = (name?: string) => {
    if (!name) {
        return avatarColors[0]
    }

    return avatarColors[name.charCodeAt(0) % avatarColors.length]
}

const cn = (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(" ")

const safeFetch = async <T,>(url: string): Promise<T> => {
    const token = localStorage.getItem("token")

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            UserId: localStorage.getItem("userId") || "",
        },
    })

    if (!response.ok) {
        throw new Error("API error")
    }

    const text = await response.text()
    return text ? (JSON.parse(text) as T) : ([] as T)
}

const mapMessage = (item: ApiMessage): Message => ({
    id: item.id,
    senderId: item.senderId,
    senderName: item.senderName,
    message: item.message || item.text || item.Text || "",
    fileUrl: item.fileUrl,
    time: item.time,
    isCall: item.isCall || false,
    status: item.status || "read",
})

export function GroupStudyView() {
    const { connection, startOutgoingCall, clearCallState, isCallReady } = useCall()

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
    const [showCallMenu, setShowCallMenu] = useState(false)

    const currentUserId = useMemo(
        () => (typeof window !== "undefined" ? localStorage.getItem("userId") ?? "" : ""),
        []
    )

    const bottomRef = useRef<HTMLDivElement>(null)

    const fetchSentRequests = async () => {
        try {
            const response = await safeFetch<string[]>(`${API_BASE}/api/notifications/sent/${currentUserId}`)
            setSentRequests(response)
        } catch {
            setSentRequests([])
        }
    }

    const refreshMessages = async (chatId = activeChat) => {
        if (!chatId) {
            return
        }

        const response = await fetch(`${API_BASE}/api/messages/${chatId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })

        const payload = (await response.json()) as ApiMessage[]
        setMessages(payload.map(mapMessage))
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

        await connection?.invoke("MessageRead", String(chatId)).catch(() => undefined)
        window.dispatchEvent(new Event("chat-updated"))
        await refreshMessages(chatId)
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

        setSentRequests((prev: string[]) => [...prev, studentId])
        await fetchSentRequests()
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

            setIsBlocked((prev: boolean) => !prev)
        } catch {
            alert("Error updating block status")
        } finally {
            setBlockLoading(false)
        }
    }

    const resolveCallParticipants = async () => {
        if (!activeChat) {
            return [] as string[]
        }

        const currentChat = chats.find(item => item.id === activeChat)
        if (!currentChat) {
            return [] as string[]
        }

        if (currentChat.type === "personal") {
            return (currentChat.members || []).filter(
                member => String(member) !== String(currentUserId)
            )
        }

        if (currentChat.members?.length) {
            return currentChat.members.filter(
                member => String(member) !== String(currentUserId)
            )
        }

        try {
            const response = await fetch(`${API_BASE}/api/groups/${activeChat}`)
            const group = (await response.json()) as { members?: Student[] }

            return (group.members || [])
                .map((member: Student) => String(member.id))
                .filter((memberId: string) => memberId !== String(currentUserId))
        } catch {
            return [] as string[]
        }
    }

    const startCall = async (callType: CallType) => {
        setShowCallMenu(false)

        if (!activeChat) {
            alert("Please select a chat first.")
            return
        }

        if (!connection || !isCallReady) {
            alert("Call service is connecting. Please wait a moment.")
            return
        }

        const participantIds = await resolveCallParticipants()
        if (participantIds.length === 0) {
            alert("No valid participants found for this call.")
            return
        }

        const isGroup = activeTab === "group"

        startOutgoingCall({
            chatId: String(activeChat),
            chatName: activeChatName || "Call",
            participantIds,
            isGroup,
            callType,
        })

        try {
            await connection.invoke("StartCall", {
                chatId: String(activeChat),
                chatName: activeChatName || "Call",
                callType,
                isGroup,
                participantIds,
            })
        } catch (error: unknown) {
            console.error("StartCall failed:", error)
            clearCallState()
            alert("Unable to start call right now.")
        }
    }

    const createGroup = async () => {
        const response = await fetch(`${API_BASE}/api/groups`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: groupName,
                members: [...selectedStudents, currentUserId],
            }),
        })

        const data = (await response.json()) as { chatId: string }

        setActiveChat(String(data.chatId))
        setActiveChatName(groupName)
        setShowCreateGroup(false)
        setGroupName("")
        setSelectedStudents([])
        setActiveTab("group")

        const updatedChats = await safeFetch<Chat[]>(`${API_BASE}/api/chat/group/${currentUserId}`)
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
                        headers: { "Content-Type": "application/json" },
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

            const response = await fetch(`${API_BASE}/api/groups/${activeChat}`)
            const data = (await response.json()) as { members?: Student[] }
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

        const response = await fetch(`${API_BASE}/api/messages`, {
            method: "POST",
            headers: {
                UserId: currentUserId,
            },
            body: formData,
        })

        const savedMessage = (await response.json()) as ApiMessage

        setMessages((prev: Message[]) => [
            ...prev,
            {
                id: savedMessage.id,
                senderId: savedMessage.senderId,
                senderName: savedMessage.senderName,
                message: savedMessage.message || savedMessage.text || savedMessage.Text || "",
                fileUrl: savedMessage.fileUrl,
                time: savedMessage.time,
                status: "sent",
                isCall: savedMessage.isCall || false,
            },
        ])

        await connection?.invoke("SendMessage", savedMessage).catch(() => undefined)
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
            const response = await fetch(`${API_BASE}/api/chat/mute/${activeChat}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    UserId: currentUserId,
                },
            })

            const data = (await response.json()) as { isMuted: boolean }
            setIsChatMuted(data.isMuted)
            window.dispatchEvent(new Event("chat-updated"))
            alert(data.isMuted ? "Chat muted" : "Chat unmuted")
        } catch {
            alert("Mute failed")
        }
    }

    const addEmoji = (emoji: { emoji: string }) => {
        setMessage((prev: string) => prev + emoji.emoji)
    }

    useEffect(() => {
        if (!activeChat || !connection) {
            return
        }

        if (connection.state !== signalR.HubConnectionState.Connected) {
            return
        }

        connection.invoke("JoinChat", String(activeChat)).catch((error: unknown) => {
            console.error("JoinChat failed:", error)
        })
    }, [activeChat, connection])

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
            .then(response => response.json() as Promise<{ isMuted: boolean }>)
            .then(data => setIsChatMuted(data.isMuted))
            .catch(() => setIsChatMuted(false))
    }, [activeChat, currentUserId])

    useEffect(() => {
        const refreshChats = async () => {
            try {
                const data = await safeFetch<Chat[]>(`${API_BASE}/api/chat/personal/${currentUserId}`)
                setChats(data)
                await fetchSentRequests()
            } catch {
                setChats([])
            }
        }

        window.addEventListener("chat-updated", refreshChats)
        return () => window.removeEventListener("chat-updated", refreshChats)
    }, [currentUserId])

    useEffect(() => {
        void fetchSentRequests()
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

        void loadChats()
    }, [activeTab, currentUserId])

    useEffect(() => {
        if (!activeChat) {
            return
        }

        void markReadAndRefresh(activeChat)
    }, [activeChat])

    useEffect(() => {
        if (!activeChat) {
            return
        }

        const interval = setInterval(async () => {
            try {
                const response = await fetch(`${API_BASE}/api/chat/typing/${activeChat}`)
                const user = await response.text()
                setTypingUser(user)
            } catch {
                setTypingUser(null)
            }
        }, 1500)

        return () => clearInterval(interval)
    }, [activeChat])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
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
            } catch (error: unknown) {
                console.error("Polling error:", error)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [activeTab, currentUserId])

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!connection) {
            return
        }

        const handleReceiveMessage = (payload: ApiMessage) => {
            if (!payload) {
                return
            }

            const nextMessage = mapMessage(payload)

            setMessages((prev: Message[]) => {
                if (prev.some(item => String(item.id) === String(nextMessage.id))) {
                    return prev
                }

                return [...prev, nextMessage]
            })
        }

        const handleMessageRead = () => {
            setMessages((prev: Message[]) =>
                prev.map(item =>
                    item.senderId === currentUserId ? { ...item, status: "read" } : item
                )
            )
        }

        connection.on("ReceiveMessage", handleReceiveMessage)
        connection.on("MessageRead", handleMessageRead)

        return () => {
            connection.off("ReceiveMessage", handleReceiveMessage)
            connection.off("MessageRead", handleMessageRead)
        }
    }, [connection, currentUserId])

    if (!mounted) {
        return null
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-[30px] border border-sky-100 bg-white shadow-[0_24px_70px_-36px_rgba(14,165,233,0.25)]">
            {showCreateGroup && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/35 backdrop-blur-sm">
                    <div className="w-[420px] rounded-[28px] border border-sky-100 bg-white p-6 shadow-2xl">
                        <div className="mb-5">
                            <h2 className="text-xl font-semibold text-slate-900">
                                {activeChat ? "Add Members" : "Create Study Group"}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Build a focused room for notes, discussion, and secure calling.
                            </p>
                        </div>

                        <input
                            placeholder="Group Name"
                            value={groupName}
                            onChange={event => setGroupName(event.target.value)}
                            className="mb-4 h-11 w-full rounded-xl border border-sky-100 px-3 outline-none ring-0"
                        />

                        <div className="max-h-56 overflow-y-auto rounded-2xl border border-sky-100 bg-sky-50/50 p-3">
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
                                                setSelectedStudents((prev: string[]) =>
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
                                            <p className="text-sm font-medium text-slate-900">{student.name}</p>
                                            <p className="text-xs text-slate-500">{student.email || "Student"}</p>
                                        </div>
                                    </label>
                                ))}
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                className="rounded-xl border border-sky-100 px-4 py-2 text-slate-700"
                                onClick={() => setShowCreateGroup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={activeChat ? addMembersToGroup : createGroup}
                                disabled={selectedStudents.length === 0}
                                className="rounded-xl bg-sky-600 px-4 py-2 text-white disabled:opacity-50"
                            >
                                {activeChat ? "Add Members" : "Create Group"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-80 border-r border-sky-100 bg-sky-50/50">
                <div className="border-b border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Group Study</p>
                            <h2 className="mt-1 text-2xl font-semibold text-slate-900">Chats</h2>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                            <Sparkles className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="flex rounded-2xl bg-white p-1 shadow-sm">
                        <button
                            className={cn(
                                "flex-1 rounded-xl px-3 py-2 text-sm font-medium transition",
                                activeTab === "personal" ? "bg-sky-600 text-white shadow-sm" : "text-slate-600"
                            )}
                            onClick={() => setActiveTab("personal")}
                        >
                            Personal
                        </button>
                        <button
                            className={cn(
                                "flex-1 rounded-xl px-3 py-2 text-sm font-medium transition",
                                activeTab === "group" ? "bg-sky-600 text-white shadow-sm" : "text-slate-600"
                            )}
                            onClick={() => setActiveTab("group")}
                        >
                            Groups
                        </button>
                    </div>

                    {activeTab === "group" && (
                        <button
                            className="mt-4 flex h-11 w-full items-center justify-center rounded-2xl bg-sky-600 text-white hover:bg-sky-700"
                            onClick={() => setShowCreateGroup(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Study Group
                        </button>
                    )}
                </div>

                <div className="h-[calc(100%-220px)] overflow-y-auto p-3">
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
                                    setActiveChatName(chatTitle || "Chat")
                                }}
                                className={cn(
                                    "mb-2 w-full rounded-2xl border px-3 py-3 text-left transition",
                                    isActive
                                        ? "border-sky-200 bg-white shadow-md"
                                        : "border-transparent bg-white/70 hover:border-sky-100 hover:bg-white"
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
                                            <p className="truncate text-sm font-semibold text-slate-900">{chatTitle}</p>
                                            <p className="truncate text-xs text-slate-500">
                                                {chat.type === "group" ? "Group discussion" : "Direct chat"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {chat.isMuted && <span className="text-xs text-slate-400">🔕</span>}
                                        {(chat.unreadCount ?? 0) > 0 && (
                                            <div className="flex min-w-[24px] items-center justify-center rounded-full bg-sky-600 px-2 py-1 text-xs font-semibold text-white">
                                                {chat.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>

                {activeTab === "personal" && (
                    <div className="border-t border-sky-100 bg-white p-3">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Students</p>

                        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                            {students
                                .filter(student => student.id !== currentUserId)
                                .map(student => (
                                    <div
                                        key={student.id}
                                        className="flex items-center justify-between rounded-2xl border border-sky-100 bg-sky-50/40 px-3 py-2"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-900">{student.name}</p>
                                            <p className="truncate text-xs text-slate-500">{student.email || "Student"}</p>
                                        </div>

                                        {!sentRequests.includes(student.id) &&
                                            !chats.some(chat =>
                                                chat.members?.includes(student.id) &&
                                                chat.members?.includes(currentUserId)
                                            ) && (
                                                <button
                                                    className="rounded-xl bg-sky-600 px-3 py-2 text-sm text-white"
                                                    onClick={() => sendRequest(student.id)}
                                                >
                                                    Request
                                                </button>
                                            )}
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col bg-gradient-to-b from-white to-sky-50/30">
                <div className="border-b border-sky-100 bg-white/90 p-4 backdrop-blur">
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
                                                    .then(response => response.json() as Promise<{ blocked: boolean }>)
                                                    .then(data => setIsBlocked(data.blocked))
                                                    .catch(() => setIsBlocked(false))
                                            }
                                        }

                                        if (activeTab === "group" && activeChat) {
                                            fetch(`${API_BASE}/api/groups/${activeChat}`)
                                                .then(response => response.text())
                                                .then(text => (text ? JSON.parse(text) : {}))
                                                .then((data: { members?: Student[]; description?: string; adminId?: string }) => {
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
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm ${getAvatarColor(activeChatName)}`}>
                                        {activeTab === "group"
                                            ? <Users className="h-5 w-5" />
                                            : activeChatName.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="min-w-0 text-left">
                                        <h3 className="truncate text-base font-semibold text-slate-900">{activeChatName}</h3>
                                        <p className="truncate text-sm text-slate-500">
                                            {activeTab === "group" ? "Study room details" : "Tap to view profile"}
                                        </p>
                                    </div>
                                </button>
                            ) : (
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">Select a chat</h3>
                                    <p className="text-sm text-slate-500">Pick a conversation to start messaging.</p>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowCallMenu((prev: boolean) => !prev)}
                                disabled={!activeChat}
                                className="flex h-11 items-center gap-2 rounded-2xl border border-sky-100 bg-white px-4 text-slate-700 disabled:opacity-50"
                            >
                                <Phone className="h-4 w-4" />
                                <span className="text-sm font-medium">Call</span>
                                <ChevronDown className="h-4 w-4" />
                            </button>

                            {showCallMenu && activeChat && (
                                <div className="absolute right-0 top-14 z-40 w-72 rounded-[24px] border border-sky-100 bg-white p-4 shadow-2xl">
                                    <div className="mb-4">
                                        <p className="text-base font-semibold text-slate-900">{activeChatName}</p>
                                        <p className="text-sm text-slate-500">
                                            {activeTab === "group" ? "Start a group call" : "Choose call type"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => void startCall("voice")}
                                            className="flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 font-medium text-white"
                                        >
                                            <Phone className="h-4 w-4" />
                                            Voice
                                        </button>
                                        <button
                                            onClick={() => void startCall("video")}
                                            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white"
                                        >
                                            <Video className="h-4 w-4" />
                                            Video
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {!activeChat && (
                        <div className="flex h-full items-center justify-center">
                            <div className="max-w-md text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[24px] bg-sky-600 text-white">
                                    <Users className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900">Choose a conversation</h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Open a direct chat for messages and calls, or jump into a study group.
                                </p>
                            </div>
                        </div>
                    )}

                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={cn(
                                "mb-3 flex",
                                String(msg.senderId) === String(currentUserId) ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[72%] rounded-[22px] px-4 py-3 shadow-sm",
                                    String(msg.senderId) === String(currentUserId)
                                        ? "bg-sky-600 text-white"
                                        : "border border-sky-100 bg-white text-slate-900"
                                )}
                            >
                                {activeTab === "group" &&
                                    String(msg.senderId) !== String(currentUserId) && (
                                        <p className="mb-1 text-xs font-semibold text-sky-600">
                                            {students.find(student => String(student.id) === String(msg.senderId))?.name || "Student"}
                                        </p>
                                    )}

                                {msg.isCall ? (
                                    <p className="text-center text-xs font-medium text-slate-500">{msg.message}</p>
                                ) : (
                                    <p className="text-sm leading-6">{msg.message}</p>
                                )}

                                {msg.fileUrl && (
                                    msg.fileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                                        <img
                                            src={`${API_BASE}${msg.fileUrl}`}
                                            alt="chat-image"
                                            className="mt-3 max-h-60 cursor-pointer rounded-2xl"
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
                                            {msg.status === "read" && <span className="text-blue-200">✓✓</span>}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div ref={bottomRef} />
                </div>

                {typingUser && typingUser !== currentUserId && (
                    <p className="animate-pulse px-4 pb-1 text-xs text-slate-500">
                        {activeTab === "group"
                            ? `${students.find(student => student.id === typingUser)?.name || "Student"} typing...`
                            : "typing..."}
                    </p>
                )}

                <div className="border-t border-sky-100 bg-white p-3">
                    {showEmoji && (
                        <div className="absolute bottom-20 z-30">
                            <EmojiPicker onEmojiClick={addEmoji} />
                        </div>
                    )}

                    {file && (
                        <div className="mb-3 flex items-center justify-between rounded-2xl bg-sky-50 px-3 py-2 text-xs text-slate-600">
                            <span className="truncate">{file.name}</span>
                            <button onClick={() => setFile(null)} className="text-rose-500">
                                Remove
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-2 rounded-[24px] border border-sky-100 bg-sky-50/40 px-2 py-2 shadow-sm">
                        <button
                            onClick={() => setShowEmoji((prev: boolean) => !prev)}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-600"
                        >
                            <Smile className="h-5 w-5" />
                        </button>

                        <label className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl text-slate-500 transition hover:bg-white">
                            <input
                                type="file"
                                hidden
                                onChange={event => setFile(event.target.files?.[0] || null)}
                            />
                            <Paperclip className="h-5 w-5" />
                        </label>

                        <input
                            value={message}
                            onChange={event => {
                                setMessage(event.target.value)

                                if (activeChat) {
                                    fetch(`${API_BASE}/api/chat/typing`, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            chatId: Number(activeChat),
                                            userId: currentUserId,
                                        }),
                                    }).catch((error: unknown) => console.error("Typing error:", error))
                                }

                                setTimeout(() => setTypingUser(null), 2000)
                            }}
                            onKeyDown={event => {
                                if (event.key === "Enter") {
                                    event.preventDefault()
                                    void sendMessage()
                                }
                            }}
                            placeholder={activeChat ? "Type a message..." : "Select a chat first"}
                            disabled={!activeChat}
                            className="h-11 flex-1 rounded-2xl border-0 bg-transparent px-3 shadow-none outline-none"
                        />

                        <button
                            onClick={() => void sendMessage()}
                            disabled={!activeChat}
                            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white disabled:opacity-50"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
