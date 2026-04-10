     

"use client"

import Link from "next/link"
import { Bell, Menu, User, Video, ArrowLeft, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as signalR from "@microsoft/signalr"


/* ---------------- TYPES ---------------- */

interface DashboardHeaderProps {
    onMenuClick: () => void
    title: string
}

interface Notification {
    id: number
    fromUserId: string
    fromUserName: string
    toUserId: string
    content: string
    status: string
    isRead: boolean
    createdAt?: string   // ✅ ADD THIS
    type: string
}

//interface Meeting {
//    id: string
//    title: string
//    startTime: string
//    meetingLink: string
//    isRead?: boolean   // ✅ ADD THIS
//    createdAt?: string
//}

interface Meeting {
    id: string
    title: string
    startTime: string
    meetingLink: string
    createdByName?: string   // ✅ ADD THIS
    isRead?: boolean
    createdAt?: string
}

/* ---------------- COMPONENT ---------------- */

export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {

    /* ================= PROFILE STATE ================= */

    const [name, setName] = useState("")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const storedName = localStorage.getItem("name") || ""
        setName(storedName)
    }, [])
    const [email, setEmail] = useState("")
    const [nickname, setNickname] = useState("")
    const [mobile, setMobile] = useState("")
    const [country, setCountry] = useState("")
    const [gender, setGender] = useState("")
    const [image, setImage] = useState<string | null>(null)
    const [openProfile, setOpenProfile] = useState(false)

    /* ================= NOTIFICATION STATE ================= */

    const [chatNotifs, setChatNotifs] = useState<Notification[]>([])
    const [meetingNotifs, setMeetingNotifs] = useState<Meeting[]>([])
    const [calendarNotifs, setCalendarNotifs] = useState<any[]>([])
    const [showNotifications, setShowNotifications] = useState(false)
    const [expandedNotifications, setExpandedNotifications] = useState(false)

    const [currentUserId, setCurrentUserId] = useState("")
    const [openLogout, setOpenLogout] = useState(false)

    const [userRole, setUserRole] = useState("")
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null


    const getMeetingReadIds = () => {
        const userId = localStorage.getItem("userId")
        return JSON.parse(localStorage.getItem(`readMeetings_${userId}`) || "[]")
    }

    const saveMeetingReadIds = (ids: string[]) => {
        const userId = localStorage.getItem("userId")
        localStorage.setItem(`readMeetings_${userId}`, JSON.stringify(ids))
    }

    const formatTime = (dateString?: string) => {
        if (!dateString) return ""

        const date = new Date(dateString)

        return date.toLocaleString([], {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    // ✅ ADD THIS BELOW 👇
    const formatDateOnly = (dateString?: string) => {
        if (!dateString) return ""

        const date = new Date(dateString)

        return date.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    const formatTimeOnly = (dateString?: string) => {
        if (!dateString) return ""

        const date = new Date(dateString)

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    useEffect(() => {
        const role = localStorage.getItem("role") || ""
        setUserRole(role)
    }, [])

    useEffect(() => {
        const id = localStorage.getItem("userId") || ""
        setCurrentUserId(id)
    }, [])


    useEffect(() => {

        const role = localStorage.getItem("role")

        // 🚫 STOP CONNECTION FOR NON-EMPLOYEE
        if (role !== "employee") return

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://steadfast-warmth-production-64c8.up.railway.app/chatHub", {
                accessTokenFactory: () => localStorage.getItem("token") || ""
            })
            .withAutomaticReconnect()
            .build()

        connection.start().catch(err => console.error("SignalR Error:", err))

        connection.on("ReceiveNotification", (data) => {

            const removeUUID = (text: string) => {
                return (text || "").replace(/^[0-9a-fA-F-]{36}\s*/, "").trim()
            }

            const cleanTitle = removeUUID(data.title)
            const cleanContent = removeUUID(data.content)

            setChatNotifs(prev => [
                {
                    id: Date.now(),
                    fromUserId: "system",
                    fromUserName: "HR",
                    toUserId: currentUserId,

                    // ✅ SINGLE MESSAGE
                    content: `📅 New meeting: ${cleanTitle || cleanContent}`,

                    // ✅ IMPORTANT
                    meetingLink: data.meetingLink || data.link || null,

                    status: "info",
                    type: "meeting",
                    isRead: false,
                    createdAt: new Date().toISOString()
                },
                ...prev
            ])
        })

        // ✅ CLEANUP (VERY IMPORTANT)
        return () => {
            connection.stop()
        }

    }, [currentUserId])
    /* ================= LOAD PROFILE ================= */

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) return

                const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Account/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (res.status === 401) {
                    console.error("Unauthorized ❌")
                    localStorage.removeItem("token")
                    window.location.href = "/"
                    return
                }

                if (!res.ok) {
                    console.error("Profile API failed:", res.status)
                    return
                }

                const data = await res.json()

                const finalName = data.name || data.fullName || localStorage.getItem("name") || ""

                setName(finalName)

                // 🔥 IMPORTANT: sync localStorage
                localStorage.setItem("name", finalName)
                setEmail(data.email || "")
                setNickname(data.nickname || "")
                setMobile(data.mobile || "")
                setCountry(data.country || "")
                setGender(data.gender || "")
                setImage(data.profileImage || null)

            } catch (err) {
                console.error("Profile load error:", err)
            }
        }

        loadProfile()
    }, [])

    /* ================= CHAT NOTIFICATIONS ================= */

    const fetchNotifications = async () => {
        try {
            const res = await fetch(
                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/${currentUserId}`
            )

            const data = await res.json()

            const role = localStorage.getItem("role")

            // 🚫 FINAL UI FILTER (EXTRA SAFETY)
            const filtered =
                role === "employee"
                    ? data
                    : data.filter((n: Notification) => n.type !== "announcement")

            const readIds = getReadIds()

            // 🔥 UUID remove function
            const removeUUID = (text: string) => {
                return (text || "").replace(
                    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g,
                    ""
                ).trim()
            }

            setChatNotifs(
                filtered.map((n: Notification) => {

                    const removeUUID = (text: string) => {
                        return (text || "").replace(
                            /^[0-9a-fA-F-]{36}\s*/,   // ✅ REMOVE UUID ONLY FROM START
                            ""
                        ).trim()
                    }

                    return {
                        ...n,

                        // ✅ CLEAN CONTENT (REMOVE ID)
                        content: removeUUID(n.content),

                        createdAt: n.createdAt || new Date().toISOString(),
                        isRead: readIds.includes(n.id) ? true : n.isRead
                    }
                })
            )

        } catch {
            setChatNotifs([])
        }
    }
    /* ================= MEETING NOTIFICATIONS ================= */

    const fetchMeetings = async () => {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/meeting/my-meetings", {
                headers: { Authorization: `Bearer ${token}` }
            })

            const data = await res.json()
            const now = new Date()

            const upcoming = data.filter(
                (m: Meeting) => new Date(m.startTime) > now
            )

            const readIds = getMeetingReadIds()

            // ❌ HR ko meeting notification nahi
            if (userRole === "hr") {
                setMeetingNotifs([])
                return
            }

            setMeetingNotifs(
                upcoming.map((m: Meeting) => ({
                    ...m,
                    isRead: readIds.includes(m.id),
                    createdAt: m.createdAt || m.startTime
                }))
            )

        } catch {
            setMeetingNotifs([])
        }
    }

    // ✅ AUTO TRIGGER EVENT REMINDERS
    useEffect(() => {

        const interval = setInterval(() => {

            const now = new Date().getTime()

            const data = JSON.parse(localStorage.getItem("globalNotifications") || "[]")

            const updated = data.map((n: any) => {

                if (n.triggerTime && !n.triggered) {

                    const diff = Math.abs(now - n.triggerTime)

                    // ⏰ 1 min window
                    if (now >= n.triggerTime && !n.triggered) {

                        return {
                            ...n,
                            triggered: true   // ✅ mark triggered
                        }
                    }
                }

                return n
            })

            localStorage.setItem("globalNotifications", JSON.stringify(updated))
            setCalendarNotifs(updated)

        }, 30000) // check every 30 sec

        return () => clearInterval(interval)

    }, [])

    /* ================= POLLING ================= */

    useEffect(() => {
        if (!currentUserId) return

        fetchNotifications()
        fetchMeetings()   // ✅ ADD THIS

        const interval = setInterval(() => {
            fetchNotifications()
            fetchMeetings()   // ✅ ADD THIS
        }, 3000)

        return () => clearInterval(interval)

    }, [currentUserId])



    const getReadIds = () => {
        if (typeof window === "undefined") return []

        const userId = localStorage.getItem("userId")
        return JSON.parse(localStorage.getItem(`readNotifications_${userId}`) || "[]")
    }

    const loadGlobalNotifications = () => {

        const currentUser = localStorage.getItem("userId")

        const data = JSON.parse(localStorage.getItem("globalNotifications") || "[]")

        // ✅ FILTER ONLY CURRENT USER
        const filtered = data.filter((n: any) => n.userId === currentUser)

        setCalendarNotifs(filtered)
    }

    useEffect(() => {

        loadGlobalNotifications()

        const handler = () => loadGlobalNotifications()

        window.addEventListener("new-notification", handler)

        return () => {
            window.removeEventListener("new-notification", handler)
        }

    }, [])

    const saveReadIds = (ids: number[]) => {
        const userId = localStorage.getItem("userId")
        localStorage.setItem(`readNotifications_${userId}`, JSON.stringify(ids))
    }

    /* ================= REQUEST HANDLER ================= */

    const handleRequest = async (notifId: number, status: string) => {

        await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/${notifId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(status)
        })

        if (status === "accepted") {
            await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/chat/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    notificationId: notifId
                })
            })

            window.dispatchEvent(new Event("chat-updated"))
        }

        // ✅ REMOVE FROM UI (IMPORTANT)
        setChatNotifs(prev =>
            prev.filter(n => n.id !== notifId)
        )

        fetchNotifications()
    }

    /* ================= PROFILE SAVE ================= */

    const saveProfile = async () => {
        try {
            const token = localStorage.getItem("token")

            await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Account/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    nickname,
                    gender,
                    country,
                    mobile,
                    profileImage: image
                })
            })

            setOpenProfile(false)

        } catch (err) {
            console.error("Profile save error:", err)
        }
    }

    /* ================= IMAGE UPLOAD ================= */

    const handleImageUpload = (e: any) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => setImage(reader.result as string)
        reader.readAsDataURL(file)
    }

    const initials = name
        ? name.split(" ").map(n => n[0]).join("").toUpperCase()
        : "U"

    const unreadChatCount = chatNotifs.filter(n => !n.isRead).length
    const unreadMeetingCount = meetingNotifs.filter(m => !m.isRead).length

    const unreadCalendarCount = calendarNotifs.filter(n => !n.isRead).length

    //const totalCount =
    //    unreadChatCount +
    //    unreadMeetingCount +
    //    unreadCalendarCount

    const totalCount =
        showNotifications
            ? 0
            : unreadChatCount + unreadMeetingCount + unreadCalendarCount

    /* ================= UI ================= */
    if (!mounted) return null

    return (
        <>
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="font-semibold">{title}</h1>
                </div>

                <div className="flex items-center gap-2">

                    <ThemeToggle />

                    {/* 🔔 NOTIFICATIONS */}
                    <div className="relative">

                        {/*<Button*/}
                        {/*    variant="ghost"*/}
                        {/*    size="icon"*/}
                        {/*    onClick={async () => {*/}

                        {/*        const opening = !showNotifications*/}
                        {/*        setShowNotifications(opening)*/}

                        {/*        if (opening) {*/}
                        {/*            try {*/}
                        {/*                await fetch(*/}
                        {/*                    `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/mark-read/${currentUserId}`,*/}
                        {/*                    { method: "PUT" }*/}
                        {/*                )*/}

                        {/*                // ✅ calendar notifications read mark*/}
                        {/*                const updated = calendarNotifs.map(n => ({ ...n, isRead: true }))*/}
                        {/*                setCalendarNotifs(updated)*/}
                        {/*                localStorage.setItem("globalNotifications", JSON.stringify(updated))*/}

                        {/*                //// ✅ SAVE ALL IDs AS READ (PERSIST)*/}
                        {/*                //const allIds = chatNotifs.map(n => n.id)*/}
                        {/*                //saveReadIds(allIds)*/}

                        {/*                const existing = getReadIds()*/}
                        {/*                const newIds = chatNotifs.map(n => n.id)*/}

                        {/*                const merged = Array.from(new Set([...existing, ...newIds]))*/}
                        {/*                saveReadIds(merged)*/}

                        {/*                // ✅ UI update*/}
                        {/*                setChatNotifs(prev =>*/}
                        {/*                    prev.map(n => ({ ...n, isRead: true }))*/}
                        {/*                )*/}

                        {/*                setMeetingNotifs(prev =>*/}
                        {/*                    prev.map(m => ({ ...m, isRead: true }))*/}
                        {/*                )*/}

                        {/*            } catch (err) {*/}
                        {/*                console.error("Mark read error:", err)*/}
                        {/*            }*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <Bell className="h-4 w-4" />*/}

                        {/*    {totalCount > 0 && (*/}
                        {/*        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">*/}
                        {/*            {totalCount}*/}
                        {/*        </span>*/}
                        {/*    )}*/}
                        {/*</Button>*/}


                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={async () => {

                                const opening = !showNotifications
                                setShowNotifications(opening)

                                if (opening) {
                                    try {
                                        // ✅ BACKEND MARK READ
                                        await fetch(
                                            `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/mark-read/${currentUserId}`,
                                            { method: "PUT" }
                                        )

                                        // ✅ CHAT NOTIFS READ
                                        setChatNotifs(prev =>
                                            prev.map(n => ({ ...n, isRead: true }))
                                        )

                                        // ✅ MEETING NOTIFS READ
                                        setMeetingNotifs(prev =>
                                            prev.map(m => ({ ...m, isRead: true }))
                                        )

                                        // ✅ CALENDAR NOTIFS READ
                                        const updatedCalendar = calendarNotifs.map(n => ({
                                            ...n,
                                            isRead: true
                                        }))

                                        setCalendarNotifs(updatedCalendar)
                                        localStorage.setItem("globalNotifications", JSON.stringify(updatedCalendar))

                                        // ✅ RESET LOCAL STORAGE IDS (IMPORTANT FIX)
                                        const userId = localStorage.getItem("userId")
                                        localStorage.setItem(`readNotifications_${userId}`, JSON.stringify([]))

                                    } catch (err) {
                                        console.error("Mark read error:", err)
                                    }
                                }
                            }}
                        >
                            <Bell className="h-4 w-4" />

                            {/* ✅ SHOW ONLY WHEN UNREAD EXISTS */}
                            {totalCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                                    {totalCount}
                                </span>
                            )}
                        </Button>

                        {showNotifications && (
        //                    <div className="absolute right-0 mt-3 w-[380px] bg-white dark:bg-[#020617]
                            //border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">

                            <div className="absolute right-0 mt-3 w-[380px] 
bg-white dark:bg-[#020617]
border border-gray-200 dark:border-white/10 
rounded-xl shadow-xl z-50 

flex flex-col max-h-[80vh]">

                                {/* HEADER */}
                                <div className="flex items-center justify-between px-4 py-3 border-b">
                                    <h4 className="font-semibold text-sm">Notifications</h4>

                                    <button className="text-xs text-green-600 font-medium hover:underline">
                                        ✓ Mark all as read
                                    </button>
                                </div>

                                {/* BODY */}
                                {/*<div className={`${expandedNotifications ? "max-h-[600px]" : "max-h-[300px]"} overflow-y-auto transition-all`}>*/}
                                <div className="flex-1 overflow-y-auto">
                                    {(() => {

                                        let allNotifs = [
                                            ...calendarNotifs.filter(n => n.triggered),
                                            ...chatNotifs,
                                            ...meetingNotifs.map(m => ({
                                                ...m,
                                                type: "meeting", // 🔥 IMPORTANT
                                                content: `📅 Meeting: ${m.title}`,
                                                createdAt: m.createdAt || m.startTime
                                            }))
                                        ].sort((a: any, b: any) => {
                                            const dateA = new Date(a.createdAt || 0).getTime()
                                            const dateB = new Date(b.createdAt || 0).getTime()
                                            return dateB - dateA
                                        })

                                        // ✅ LIMIT TO 5 WHEN NOT EXPANDED
                                        if (!expandedNotifications) {
                                            allNotifs = allNotifs.slice(0, 5)
                                        }

                                        const grouped: Record<string, any[]> = {}

                                        const today = new Date()
                                        const yesterday = new Date()
                                        yesterday.setDate(today.getDate() - 1)

                                        const getLabel = (dateStr: string) => {
                                            const d = new Date(dateStr)

                                            const isToday =
                                                d.toDateString() === today.toDateString()

                                            const isYesterday =
                                                d.toDateString() === yesterday.toDateString()

                                            if (isToday) return "Today"
                                            if (isYesterday) return "Yesterday"

                                            return formatDateOnly(dateStr) // 06 Apr 2026
                                        }

                                        allNotifs.forEach((n: any) => {
                                            const dateStr = n.createdAt
                                            const label = getLabel(dateStr)

                                            if (!grouped[label]) grouped[label] = []
                                            grouped[label].push(n)
                                        })

                                        return Object.keys(grouped).map((group, idx) => (
                                            <div key={idx}>

                                                {/* GROUP TITLE */}
                                                <div className="px-4 py-2 text-xs text-gray-500 font-medium">
                                                    {group}
                                                </div>

                                                {/* ITEMS */}
                                                {grouped[group].map((n: any, i: number) => {

                                                    const isCalendar = n.eventDate
                                                    const isUnread = !n.isRead

                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`flex gap-3 px-4 py-3 border-b last:border-0 cursor-pointer transition
                                    ${isUnread
                                                                    ? "bg-green-50 dark:bg-white/5"
                                                                    : "hover:bg-gray-50 dark:hover:bg-white/5"}
                                    `}
                                                        >

                                                            {/* ICON */}
                                                            <div className="mt-1">
                                                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs">
                                                                    {isCalendar ? "⏰" : "💬"}
                                                                </div>
                                                            </div>

                                                            {/* CONTENT */}
                                                            <div className="flex-1">

                                                                <p className="text-sm font-medium leading-tight">
                                                                    {n.content}
                                                                </p>



                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {isCalendar
                                                                        ? `${formatDateOnly(n.eventDate)} • ${formatTimeOnly(n.eventDate)}`
                                                                        : "New update"}
                                                                </p>

                                                                {/* ✅ JOIN BUTTON (ONLY FOR MEETING) */}
                                                                {/*{n.type === "meeting" && n.meetingLink && (*/}
                                                                {/*    <button*/}
                                                                {/*        onClick={() => window.open(n.meetingLink, "_blank")}*/}
                                                                {/*        className="mt-2 text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"*/}
                                                                {/*    >*/}
                                                                {/*        Join*/}
                                                                {/*    </button>*/}


                                                                {/*)}*/}

                                                                {(n.type === "meeting" || n.meetingLink) && n.meetingLink && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation() // 🔥 prevent parent click
                                                                            window.open(n.meetingLink, "_blank")
                                                                        }}
                                                                        className="mt-2 text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                                                                    >
                                                                        Join Meeting
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {/* TIME */}
                                                            <div className="text-[10px] text-gray-400 whitespace-nowrap">
                                                                {formatTimeOnly(n.createdAt)}
                                                            </div>

                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ))

                                    })()}

                                    {/* EMPTY */}
                                    {chatNotifs.length === 0 &&
                                        meetingNotifs.length === 0 &&
                                        calendarNotifs.length === 0 && (
                                            <div className="text-center py-6 text-gray-500 text-sm">
                                                No notifications
                                            </div>
                                        )}
                                </div>

                                {/* FOOTER */}
                                {/*<div*/}
                                {/*    onClick={() => setExpandedNotifications(prev => !prev)}*/}
                                {/*    className="px-4 py-3 border-t text-sm text-green-600 font-medium cursor-pointer hover:underline"*/}
                                {/*>*/}

                                <div
                                    onClick={() => setExpandedNotifications(prev => !prev)}
                                    className="px-4 py-3 border-t text-sm text-green-600 font-medium 
    cursor-pointer hover:underline 

    bg-white dark:bg-[#020617] 
    sticky bottom-0 z-10"
                                >
                                    {expandedNotifications ? "Show less" : "View all notifications"}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* USER */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="gap-2">
                                <Avatar className="h-7 w-7">
                                    {image ? (
                                        <AvatarImage src={image} />
                                    ) : (
                                        <AvatarFallback>{initials}</AvatarFallback>
                                    )}
                                </Avatar>
                                {name || "User"}
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
                                <User className="mr-2 h-4 w-4" /> Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setOpenLogout(true)}>
                                <LogOut className="mr-2 h-4 w-4" /> Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </header>
            {/* ================= PROFILE MODAL ================= */}
            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl 
    border border-border 
    bg-white text-black 
    dark:bg-gradient-to-br dark:from-[#020617] dark:to-[#0f172a] dark:text-white 
    shadow-2xl">

                    {/* HEADER */}
                    <div className="flex items-center justify-between px-6 py-4 border-b 
        bg-gray-100 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 
        border-border dark:border-white/10">

                        <div className="flex items-center gap-3 ">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpenProfile(false)}
                                className="hover:bg-black/10 dark:hover:bg-white/20"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>

                            <h2 className="text-lg font-semibold tracking-wide ">
                                Profile Settings
                            </h2>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="p-6 space-y-6">

                        {/* PROFILE TOP */}
                        <div className="flex items-center gap-5">

                            <label className="cursor-pointer relative group">
                                <Avatar className="h-20 w-20 border-2 border-indigo-500 shadow-lg">
                                    {image ? (
                                        <AvatarImage src={image} />
                                    ) : (
                                        <AvatarFallback className="text-lg font-bold bg-indigo-600 text-white">
                                            {initials}
                                        </AvatarFallback>
                                    )}
                                </Avatar>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                    rounded-full flex items-center justify-center text-white text-xs font-medium transition">
                                    Change
                                </div>

                                <input type="file" className="hidden" onChange={handleImageUpload} />
                            </label>

                            <div>
                                <p className="text-lg font-semibold">{name}</p>
                                <p className="text-sm text-muted-foreground">{email}</p>
                            </div>

                        </div>

                        {/* FORM */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div className="space-y-1">
                                <Label>Full Name</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10 
                        focus-visible:ring-indigo-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label>Nick Name</Label>
                                <Input
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10"
                                />
                            </div>

                            {/* GENDER */}
                            <div className="md:col-span-2 space-y-2">
                                <Label>Gender</Label>

                                <div className="flex gap-3">
                                    {["Male", "Female", "Other"].map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setGender(g)}
                                            className={`px-4 py-2 rounded-lg border text-sm transition 
                                ${gender === g
                                                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                                                    : "bg-gray-100 dark:bg-white/5 border-border dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label>Mobile</Label>
                                <Input
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label>Country</Label>
                                <Input
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-1">
                                <Label>Email</Label>
                                <Input
                                    value={email}
                                    disabled
                                    className="bg-gray-200 dark:bg-white/10 border-border dark:border-white/10 
                        text-gray-500 dark:text-gray-400"
                                />
                            </div>

                        </div>

                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-end gap-3 px-6 py-4 border-t 
        bg-gray-100 dark:bg-white/5 border-border dark:border-white/10">

                        <Button
                            variant="outline"
                            onClick={() => setOpenProfile(false)}
                            className="hover:bg-gray-200 dark:hover:bg-white/10"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={saveProfile}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-lg"
                        >
                            Save Changes
                        </Button>

                    </div>

                </DialogContent>
            </Dialog>


            <Dialog open={openLogout} onOpenChange={setOpenLogout}>
                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border border-border shadow-2xl">

                    {/* TOP ICON SECTION */}
                    <div className="flex flex-col items-center justify-center px-6 pt-6 pb-4 
    bg-gradient-to-b from-blue-50 to-white 
    dark:from-blue-900/20 dark:to-[#020617]">

                        <div className="w-14 h-14 flex items-center justify-center rounded-full 
      bg-blue-100 dark:bg-blue-500/20">
                            <LogOut className="h-6 w-6 text-blue-600" />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
                            Log out of your account?
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
                            You’ll need to sign in again to access your dashboard.
                        </p>
                    </div>

                    {/* ACTION SECTION */}
                    <div className="flex gap-3 px-6 py-5 bg-white dark:bg-[#020617]">

                        <button
                            onClick={() => setOpenLogout(false)}
                            className="w-1/2 py-2.5 rounded-lg text-sm font-medium 
        bg-gray-100 hover:bg-gray-200 
        dark:bg-white/10 dark:hover:bg-white/20 
        transition"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => {
                                localStorage.clear()
                                window.location.href = "/"
                            }}
                            className="w-1/2 py-2.5 rounded-lg text-sm font-semibold 
        bg-blue-600 hover:bg-blue-700 text-white 
        shadow-lg hover:shadow-xl transition"
                        >
                            Log out
                        </button>

                    </div>

                </DialogContent>
            </Dialog>

        </>
    )
}