//"use client"

//import { useParams } from "next/navigation"
//import { useEffect, useState, useRef } from "react"
//import { Input } from "@/components/ui/input"
//import { Button } from "@/components/ui/button"

//export default function PersonalChatPage() {
//    const { userId } = useParams()

//    const [messages, setMessages] = useState<any[]>([])
//    const [input, setInput] = useState("")
//    const scrollRef = useRef<HTMLDivElement>(null)

//    // ✅ Fetch messages
//    useEffect(() => {
//        if (!userId) return
//        fetchMessages()
//    }, [userId])

//    const fetchMessages = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/chat/personal/${userId}`,
//                {
//                    headers: {
//                        Authorization: `Bearer ${token}`
//                    }
//                }
//            )

//            const data = await res.json()
//            setMessages(data)
//        } catch (err) {
//            console.error(err)
//        }
//    }

//    // ✅ Auto scroll
//    useEffect(() => {
//        scrollRef.current?.scrollTo({
//            top: scrollRef.current.scrollHeight,
//            behavior: "smooth"
//        })
//    }, [messages])

//    // ✅ Send message
//    const handleSend = async () => {
//        if (!input.trim()) return

//        try {
//            const token = localStorage.getItem("token")

//            await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/messages", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },
//                body: JSON.stringify({
//                    receiverId: userId,
//                    content: input
//                })
//            })

//            setInput("")
//            fetchMessages()

//        } catch (err) {
//            console.error(err)
//        }
//    }

//    return (
//        <div className="flex flex-col h-[90vh] p-4">

//            <h2 className="text-xl font-bold mb-4">
//                Personal Chat
//            </h2>

//            {/* CHAT BOX */}
//            <div
//                ref={scrollRef}
//                className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-3 bg-muted"
//            >
//                {messages.map((msg, index) => (
//                    <div
//                        key={index}
//                        className={`flex ${msg.isMine ? "justify-end" : "justify-start"
//                            }`}
//                    >
//                        <div
//                            className={`px-4 py-2 rounded-lg text-sm ${msg.isMine
//                                    ? "bg-primary text-white"
//                                    : "bg-white"
//                                }`}
//                        >
//                            {msg.content}
//                        </div>
//                    </div>
//                ))}
//            </div>

//            {/* INPUT */}
//            <div className="flex gap-2 mt-4">
//                <Input
//                    value={input}
//                    onChange={(e) => setInput(e.target.value)}
//                    placeholder="Type message..."
//                />

//                <Button onClick={handleSend}>
//                    Send
//                </Button>
//            </div>

//        </div>
//    )
//}


//"use client"

//import { useParams } from "next/navigation"
//import { useEffect, useState, useRef } from "react"
//import { Input } from "@/components/ui/input"
//import { Button } from "@/components/ui/button"
//import { Avatar, AvatarFallback } from "@/components/ui/avatar"
//import { Send } from "lucide-react"

//export default function PersonalChatPage() {
//    const { userId } = useParams()

//    const [messages, setMessages] = useState<any[]>([])
//    const [input, setInput] = useState("")
//    const scrollRef = useRef<HTMLDivElement>(null)

//    const currentUserId =
//        typeof window !== "undefined"
//            ? localStorage.getItem("userId")
//            : ""

//    // ✅ Fetch messages
//    useEffect(() => {
//        if (!userId) return
//        fetchMessages()

//        const interval = setInterval(fetchMessages, 3000) // auto refresh
//        return () => clearInterval(interval)
//    }, [userId])

//    const fetchMessages = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/chat/personal/${userId}`,
//                {
//                    headers: {
//                        Authorization: `Bearer ${token}`
//                    }
//                }
//            )

//            const data = await res.json()

//            // map for UI
//            const formatted = data.map((msg: any) => ({
//                ...msg,
//                isMine: String(msg.senderId) === String(currentUserId)
//            }))

//            setMessages(formatted)
//        } catch (err) {
//            console.error(err)
//        }
//    }

//    // ✅ Auto scroll
//    useEffect(() => {
//        scrollRef.current?.scrollTo({
//            top: scrollRef.current.scrollHeight,
//            behavior: "smooth"
//        })
//    }, [messages])

//    // ✅ Send message
//    const handleSend = async () => {
//        if (!input.trim()) return

//        try {
//            const token = localStorage.getItem("token")

//            await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/messages", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },
//                body: JSON.stringify({
//                    receiverId: userId,
//                    content: input
//                })
//            })

//            setInput("")
//            fetchMessages()
//        } catch (err) {
//            console.error(err)
//        }
//    }

//    return (
//        <div className="flex h-[calc(100vh-6rem)] bg-background">

//            {/* CHAT AREA */}
//            <div className="flex flex-1 flex-col border rounded-xl overflow-hidden">

//                {/* HEADER */}
//                <div className="flex items-center gap-3 border-b p-4">
//                    <Avatar>
//                        <AvatarFallback>
//                            U
//                        </AvatarFallback>
//                    </Avatar>

//                    <div>
//                        <h2 className="font-semibold">Personal Chat</h2>
//                        <p className="text-xs text-muted-foreground">
//                            Chat with employee
//                        </p>
//                    </div>
//                </div>

//                {/* MESSAGES */}
//                <div
//                    ref={scrollRef}
//                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/40"
//                >
//                    {messages.map((msg, index) => (
//                        <div
//                            key={index}
//                            className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
//                        >
//                            <div className="flex gap-2 max-w-[70%]">

//                                {!msg.isMine && (
//                                    <Avatar className="h-8 w-8">
//                                        <AvatarFallback>
//                                            U
//                                        </AvatarFallback>
//                                    </Avatar>
//                                )}

//                                <div>
//                                    <div
//                                        className={`px-4 py-2 rounded-xl text-sm ${msg.isMine
//                                            ? "bg-primary text-white"
//                                            : "bg-white"
//                                            }`}
//                                    >
//                                        {msg.content}
//                                    </div>

//                                    <p className="text-[10px] text-muted-foreground mt-1">
//                                        {msg.timestamp
//                                            ? new Date(msg.timestamp).toLocaleTimeString([], {
//                                                hour: "2-digit",
//                                                minute: "2-digit"
//                                            })
//                                            : ""}
//                                    </p>
//                                </div>

//                            </div>
//                        </div>
//                    ))}
//                </div>

//                {/* INPUT */}
//                <div className="border-t p-3">
//                    <div className="flex gap-2">
//                        <Input
//                            value={input}
//                            onChange={(e) => setInput(e.target.value)}
//                            onKeyDown={(e) => {
//                                if (e.key === "Enter") {
//                                    e.preventDefault()
//                                    handleSend()
//                                }
//                            }}
//                            placeholder="Type message..."
//                        />

//                        <Button onClick={handleSend}>
//                            <Send className="h-4 w-4" />
//                        </Button>
//                    </div>
//                </div>

//            </div>

//        </div>
//    )
//}


//"use client"

//import { useEffect, useState, useRef } from "react"
//import { Input } from "@/components/ui/input"
//import { Button } from "@/components/ui/button"
//import { Avatar, AvatarFallback } from "@/components/ui/avatar"
//import { Send } from "lucide-react"

//interface User {
//    id: string
//    name: string
//}

//export default function PersonalChatPage() {

//    const [users, setUsers] = useState<User[]>([])
//    const [activeUser, setActiveUser] = useState<User | null>(null)

//    const [messages, setMessages] = useState<any[]>([])
//    const [input, setInput] = useState("")
//    const scrollRef = useRef<HTMLDivElement>(null)

//    const currentUserId =
//        typeof window !== "undefined"
//            ? localStorage.getItem("userId")
//            : ""

//    /* ---------------- USERS LIST ---------------- */

//    useEffect(() => {
//        fetchUsers()
//    }, [])

//    const fetchUsers = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/users/students", {
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            const data = await res.json()
//            setUsers(data)

//        } catch {
//            setUsers([])
//        }
//    }

//    /* ---------------- FETCH MESSAGES ---------------- */

//    useEffect(() => {
//        if (!activeUser) return

//        fetchMessages()

//        const interval = setInterval(fetchMessages, 3000)
//        return () => clearInterval(interval)

//    }, [activeUser])

//    const fetchMessages = async () => {
//        if (!activeUser) return

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/chat/personal/${activeUser.id}`,
//                {
//                    headers: {
//                        Authorization: `Bearer ${token}`
//                    }
//                }
//            )

//            const data = await res.json()

//            const formatted = data.map((msg: any) => ({
//                ...msg,
//                isMine: String(msg.senderId) === String(currentUserId)
//            }))

//            setMessages(formatted)

//        } catch (err) {
//            console.error(err)
//        }
//    }

//    /* ---------------- AUTO SCROLL ---------------- */

//    useEffect(() => {
//        scrollRef.current?.scrollTo({
//            top: scrollRef.current.scrollHeight,
//            behavior: "smooth"
//        })
//    }, [messages])

//    /* ---------------- SEND MESSAGE ---------------- */

//    const handleSend = async () => {
//        if (!input.trim() || !activeUser) return

//        try {
//            const token = localStorage.getItem("token")

//            await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/messages", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },
//                body: JSON.stringify({
//                    receiverId: activeUser.id,
//                    content: input
//                })
//            })

//            setInput("")
//            fetchMessages()

//        } catch (err) {
//            console.error(err)
//        }
//    }

//    /* ---------------- UI ---------------- */

//    return (
//        <div className="flex h-[calc(100vh-6rem)]">

//            {/* LEFT SIDEBAR */}
//            <div className="w-80 border-r bg-background">

//                <div className="p-4 font-semibold text-lg border-b">
//                    Chats
//                </div>

//                <div className="overflow-y-auto h-full">

//                    {users.map(user => (
//                        <div
//                            key={user.id}
//                            onClick={() => setActiveUser(user)}
//                            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted ${activeUser?.id === user.id && "bg-muted"
//                                }`}
//                        >
//                            <Avatar>
//                                <AvatarFallback>
//                                    {user.name?.charAt(0).toUpperCase()}
//                                </AvatarFallback>
//                            </Avatar>

//                            <div>
//                                <p className="font-medium">{user.name}</p>
//                                <p className="text-xs text-muted-foreground">
//                                    Click to chat
//                                </p>
//                            </div>
//                        </div>
//                    ))}

//                </div>
//            </div>

//            {/* RIGHT CHAT AREA */}
//            <div className="flex flex-1 flex-col">

//                {/* HEADER */}
//                {activeUser ? (
//                    <>
//                        <div className="flex items-center gap-3 border-b p-4 bg-background">
//                            <Avatar>
//                                <AvatarFallback>
//                                    {activeUser.name.charAt(0)}
//                                </AvatarFallback>
//                            </Avatar>

//                            <div>
//                                <h2 className="font-semibold">
//                                    {activeUser.name}
//                                </h2>
//                                <p className="text-xs text-muted-foreground">
//                                    Online
//                                </p>
//                            </div>
//                        </div>

//                        {/* MESSAGES */}
//                        <div
//                            ref={scrollRef}
//                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/40"
//                        >
//                            {messages.map((msg, index) => (
//                                <div
//                                    key={index}
//                                    className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
//                                >
//                                    <div className="max-w-[70%]">

//                                        <div
//                                            className={`px-4 py-2 rounded-xl text-sm ${msg.isMine
//                                                ? "bg-primary text-white"
//                                                : "bg-white"
//                                                }`}
//                                        >
//                                            {msg.content}
//                                        </div>

//                                        <p className="text-[10px] text-muted-foreground mt-1 text-right">
//                                            {msg.timestamp
//                                                ? new Date(msg.timestamp).toLocaleTimeString([], {
//                                                    hour: "2-digit",
//                                                    minute: "2-digit"
//                                                })
//                                                : ""}
//                                        </p>
//                                    </div>
//                                </div>
//                            ))}
//                        </div>

//                        {/* INPUT */}
//                        <div className="border-t p-3 bg-background">
//                            <div className="flex gap-2">

//                                <Input
//                                    value={input}
//                                    onChange={(e) => setInput(e.target.value)}
//                                    onKeyDown={(e) => {
//                                        if (e.key === "Enter") {
//                                            e.preventDefault()
//                                            handleSend()
//                                        }
//                                    }}
//                                    placeholder="Type a message"
//                                />

//                                <Button onClick={handleSend}>
//                                    <Send className="h-4 w-4" />
//                                </Button>

//                            </div>
//                        </div>

//                    </>
//                ) : (

//                    <div className="flex flex-1 items-center justify-center text-muted-foreground">
//                        Select a chat to start messaging
//                    </div>

//                )}

//            </div>
//        </div>
//    )
//}



"use client"

import { useParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send } from "lucide-react"

interface User {
    id: string
    name: string
}

export default function PersonalChatPage() {

    const { userId } = useParams()

    const [users, setUsers] = useState<User[]>([])
    const [activeUser, setActiveUser] = useState<User | null>(null)

    const [messages, setMessages] = useState<any[]>([])
    const [input, setInput] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    const currentUserId =
        typeof window !== "undefined"
            ? localStorage.getItem("userId")
            : ""

    /* ---------------- FETCH USERS ---------------- */

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/users/students", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()
            setUsers(data)

            // ✅ AUTO SELECT USER FROM URL
            if (userId) {
                const found = data.find((u: User) => String(u.id) === String(userId))
                if (found) setActiveUser(found)
            }

        } catch {
            setUsers([])
        }
    }

    /* ---------------- FETCH MESSAGES ---------------- */

    useEffect(() => {
        if (!activeUser) return

        fetchMessages()

        const interval = setInterval(fetchMessages, 3000)
        return () => clearInterval(interval)

    }, [activeUser])

    const fetchMessages = async () => {
        if (!activeUser) return

        try {
            const token = localStorage.getItem("token")

            const res = await fetch(
                `https://steadfast-warmth-production-64c8.up.railway.app/api/chat/personal/${activeUser.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await res.json()

            const formatted = data.map((msg: any) => ({
                ...msg,
                isMine: String(msg.senderId) === String(currentUserId)
            }))

            setMessages(formatted)

        } catch (err) {
            console.error(err)
        }
    }

    /* ---------------- AUTO SCROLL ---------------- */

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth"
        })
    }, [messages])

    /* ---------------- SEND MESSAGE ---------------- */

    const handleSend = async () => {
        if (!input.trim() || !activeUser) return

        try {
            const token = localStorage.getItem("token")

            await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiverId: activeUser.id,
                    content: input
                })
            })

            setInput("")
            fetchMessages()

        } catch (err) {
            console.error(err)
        }
    }

    /* ---------------- UI ---------------- */

    return (
        <div className="flex h-[calc(100vh-6rem)]">

            {/* LEFT SIDEBAR */}
            <div className="w-80 border-r bg-background">

                <div className="p-4 font-semibold text-lg border-b">
                    Chats
                </div>

                <div className="overflow-y-auto h-full">

                    {users.map(user => (
                        <div
                            key={user.id}
                            onClick={() => setActiveUser(user)}
                            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted ${activeUser?.id === user.id ? "bg-muted" : ""
                                }`}
                        >
                            <Avatar>
                                <AvatarFallback>
                                    {user.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    Click to chat
                                </p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            {/* RIGHT CHAT AREA */}
            <div className="flex flex-1 flex-col">

                {activeUser ? (
                    <>
                        {/* HEADER */}
                        <div className="flex items-center gap-3 border-b p-4 bg-background">
                            <Avatar>
                                <AvatarFallback>
                                    {activeUser.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <h2 className="font-semibold">
                                    {activeUser.name}
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Online
                                </p>
                            </div>
                        </div>

                        {/* MESSAGES */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/40"
                        >
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.isMine ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div className="max-w-[70%]">

                                        <div
                                            className={`px-4 py-2 rounded-xl text-sm ${msg.isMine
                                                    ? "bg-primary text-white"
                                                    : "bg-white"
                                                }`}
                                        >
                                            {msg.content}
                                        </div>

                                        <p className="text-[10px] text-muted-foreground mt-1 text-right">
                                            {msg.timestamp
                                                ? new Date(msg.timestamp).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })
                                                : ""}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* INPUT */}
                        <div className="border-t p-3 bg-background">
                            <div className="flex gap-2">

                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            handleSend()
                                        }
                                    }}
                                    placeholder="Type a message"
                                />

                                <Button onClick={handleSend}>
                                    <Send className="h-4 w-4" />
                                </Button>

                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-1 items-center justify-center text-muted-foreground">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    )
}