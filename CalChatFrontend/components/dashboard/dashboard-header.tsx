"use client"

import Link from "next/link"
import { Bell, Menu, User, Video, ArrowLeft, LogOut, CheckCheck, Calendar, MessageSquare, Clock } from "lucide-react"
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
import { useEffect, useState, useRef } from "react"

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
    createdAt?: string
    type: string
}

interface Meeting {
    id: string
    title: string
    startTime: string
    meetingLink: string
    createdByName?: string
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
    const notifPanelRef = useRef<HTMLDivElement>(null)

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

    // Close panel on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (notifPanelRef.current && !notifPanelRef.current.contains(e.target as Node)) {
                setShowNotifications(false)
            }
        }
        if (showNotifications) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [showNotifications])

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
                    content: `📅 New meeting: ${cleanTitle || cleanContent}`,
                    meetingLink: data.meetingLink || data.link || null,
                    status: "info",
                    type: "meeting",
                    isRead: false,
                    createdAt: new Date().toISOString()
                } as any,
                ...prev
            ])
        })

        return () => { connection.stop() }
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
                    localStorage.removeItem("token")
                    window.location.href = "/"
                    return
                }
                if (!res.ok) return

                const data = await res.json()
                const finalName = data.name || data.fullName || localStorage.getItem("name") || ""
                setName(finalName)
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
            const filtered = role === "employee"
                ? data
                : data.filter((n: Notification) => n.type !== "announcement")

            const readIds = getReadIds()
            const removeUUID = (text: string) =>
                (text || "").replace(/^[0-9a-fA-F-]{36}\s*/, "").trim()

            const cleanUUID = (text: string) =>
                (text || "").replace(/^[0-9a-fA-F-]{36}\s*/, "").trim()

            const buildMessage = (n: Notification) => {
                const cleanContent = removeUUID(n.content)
                const cleanName = cleanUUID(n.fromUserName)

                // remove duplicate UUID if still inside content
                const finalContent = cleanContent.replace(cleanName, "").trim()

                return `${cleanName} ${finalContent}`
            }

            setChatNotifs(
                filtered.map((n: Notification) => ({
                    ...n,
                    fromUserName: cleanUUID(n.fromUserName), // 🔥 FIX HERE
                    content: buildMessage(n),               // 🔥 FIX HERE
                    createdAt: n.createdAt || new Date().toISOString(),
                    isRead: readIds.includes(n.id) ? true : n.isRead
                }))
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
            const upcoming = data.filter((m: Meeting) => new Date(m.startTime) > now)
            const readIds = getMeetingReadIds()

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

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime()
            const data = JSON.parse(localStorage.getItem("globalNotifications") || "[]")
            const updated = data.map((n: any) => {
                if (n.triggerTime && !n.triggered && now >= n.triggerTime) {
                    return { ...n, triggered: true }
                }
                return n
            })
            localStorage.setItem("globalNotifications", JSON.stringify(updated))
            setCalendarNotifs(updated)
        }, 30000)
        return () => clearInterval(interval)
    }, [])

    /* ================= POLLING ================= */

    useEffect(() => {
        if (!currentUserId) return
        fetchNotifications()
        fetchMeetings()
        const interval = setInterval(() => {
            fetchNotifications()
            fetchMeetings()
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
        const filtered = data.filter((n: any) => n.userId === currentUser)
        setCalendarNotifs(filtered)
    }

    useEffect(() => {
        loadGlobalNotifications()
        const handler = () => loadGlobalNotifications()
        window.addEventListener("new-notification", handler)
        return () => window.removeEventListener("new-notification", handler)
    }, [])

    const saveReadIds = (ids: number[]) => {
        const userId = localStorage.getItem("userId")
        // localStorage.setItem(`readNotifications_${userId}`, JSON.stringify(ids))
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId: notifId })
            })
            window.dispatchEvent(new Event("chat-updated"))
        }

        setChatNotifs(prev => prev.filter(n => n.id !== notifId))
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
                body: JSON.stringify({ name, nickname, gender, country, mobile, profileImage: image })
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
    const totalCount = unreadChatCount + unreadMeetingCount + unreadCalendarCount

    /* ================= NOTIFICATION GROUPING HELPER ================= */

    const buildGroupedNotifs = () => {
        let allNotifs = [
            ...calendarNotifs.filter(n => n.triggered),
            ...chatNotifs,
            ...meetingNotifs.map(m => ({
                ...m,
                type: "meeting",
                content: `📅 Meeting: ${m.title}`,
                createdAt: m.createdAt || m.startTime
            }))
        ].sort((a: any, b: any) => {
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        })

        if (!expandedNotifications) {
            allNotifs = allNotifs.slice(0, 5)
        }

        const today = new Date()
        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)

        const getGroupLabel = (dateStr: string) => {
            const d = new Date(dateStr)
            if (d.toDateString() === today.toDateString()) return "Today"
            if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
            return formatDateOnly(dateStr)
        }

        const grouped: Record<string, any[]> = {}
        allNotifs.forEach((n: any) => {
            const label = getGroupLabel(n.createdAt)
            if (!grouped[label]) grouped[label] = []
            grouped[label].push(n)
        })

        return grouped
    }

    const getNotifIcon = (n: any) => {
        if (n.eventDate || n.type === "calendar") return "⏰"
        if (n.type === "meeting" || (n.content || "").includes("📅")) return "📅"
        return "💬"
    }

    const getNotifAccent = (n: any) => {
        if (n.type === "meeting" || (n.content || "").includes("📅")) return "blue"
        if (n.eventDate) return "amber"
        return "green"
    }

    const markAllRead = async () => {
        try {
            await fetch(
                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/mark-read/${currentUserId}`,
                { method: "PUT" }
            )
            setChatNotifs(prev => prev.map(n => ({ ...n, isRead: true })))
            setMeetingNotifs(prev => prev.map(m => ({ ...m, isRead: true })))
            const meetingIds = meetingNotifs.map(m => m.id)
            saveMeetingReadIds(meetingIds)
            const updatedCalendar = calendarNotifs.map(n => ({ ...n, isRead: true }))
            setCalendarNotifs(updatedCalendar)
            localStorage.setItem("globalNotifications", JSON.stringify(updatedCalendar))
            const allIds = chatNotifs.map(n => n.id)
            saveReadIds(allIds)
        } catch (err) {
            console.error("Mark read error:", err)
        }
    }

    /* ================= UI ================= */
    if (!mounted) return null

    const grouped = buildGroupedNotifs()
    const hasNotifications = chatNotifs.length > 0 || meetingNotifs.length > 0 || calendarNotifs.filter(n => n.triggered).length > 0

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
                    <div className="relative" ref={notifPanelRef}>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                            onClick={async () => {
                                const opening = !showNotifications
                                setShowNotifications(opening)
                                if (opening) await markAllRead()
                            }}
                        >
                            <Bell className="h-4 w-4" />
                            {totalCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold px-1 rounded-full flex items-center justify-center leading-none">
                                    {totalCount > 99 ? "99+" : totalCount}
                                </span>
                            )}
                        </Button>

                        {/* ===================== NOTIFICATION PANEL ===================== */}
                        {showNotifications && (
                            <div className="
                                absolute right-0 top-[calc(100%+8px)] 
                                w-[400px] 
                                bg-white dark:bg-[#0d1117]
                                border border-gray-200 dark:border-white/10 
                                rounded-2xl shadow-2xl z-50 
                                flex flex-col
                                overflow-hidden
                                max-h-[85vh]
                            "
                                style={{
                                    boxShadow: "0 20px 60px -10px rgba(0,0,0,0.18), 0 4px 16px -4px rgba(0,0,0,0.12)"
                                }}
                            >

                                {/* ── PANEL HEADER ── */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/8 bg-white dark:bg-[#0d1117]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
                                            <Bell className="h-3.5 w-3.5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">
                                                Notifications
                                            </h4>
                                            {totalCount > 0 && (
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">
                                                    {totalCount} unread
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={markAllRead}
                                        className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                                    >
                                        <CheckCheck className="h-3 w-3" />
                                        Mark all read
                                    </button>
                                </div>

                                {/* ── SCROLLABLE BODY ── */}
                                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">

                                    {hasNotifications ? (
                                        Object.keys(grouped).length > 0 ? (
                                            Object.keys(grouped).map((group, gIdx) => (
                                                <div key={gIdx}>

                                                    {/* GROUP DATE LABEL */}
                                                    <div className="flex items-center gap-3 px-5 pt-4 pb-2">
                                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                                            {group}
                                                        </span>
                                                        <div className="flex-1 h-px bg-gray-100 dark:bg-white/6" />
                                                    </div>

                                                    {/* NOTIFICATION ITEMS */}
                                                    {grouped[group].map((n: any, i: number) => {
                                                        const isUnread = !n.isRead
                                                        const accent = getNotifAccent(n)
                                                        const icon = getNotifIcon(n)
                                                        const isMeeting = n.type === "meeting" || (n.content || "").includes("📅")
                                                        const isCalendar = !!n.eventDate

                                                        const accentMap: Record<string, string> = {
                                                            blue: "bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400",
                                                            amber: "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400",
                                                            green: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                                                        }

                                                        const dotMap: Record<string, string> = {
                                                            blue: "bg-blue-500",
                                                            amber: "bg-amber-500",
                                                            green: "bg-emerald-500",
                                                        }

                                                        // Clean the sender name from content if present
                                                        const rawContent: string = n.content || ""
                                                        const cleanUUID = (text: string) =>
                                                            (text || "").replace(/^[0-9a-fA-F-]{36}\s*/, "").trim()

                                                        const senderName = cleanUUID(n.fromUserName || n.createdByName || "")

                                                        return (
                                                            <div
                                                                key={i}
                                                                className={`
                                                                    group relative mx-3 mb-1 rounded-xl px-3 py-3 cursor-pointer
                                                                    transition-all duration-150
                                                                    ${isUnread
                                                                        ? "bg-indigo-50/70 dark:bg-indigo-500/8 hover:bg-indigo-50 dark:hover:bg-indigo-500/12"
                                                                        : "hover:bg-gray-50 dark:hover:bg-white/4"
                                                                    }
                                                                `}
                                                            >
                                                                <div className="flex gap-3">

                                                                    {/* ICON AVATAR */}
                                                                    <div className="flex-shrink-0 mt-0.5">
                                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-sm ${accentMap[accent]}`}>
                                                                            {icon}
                                                                        </div>
                                                                    </div>

                                                                    {/* CONTENT */}
                                                                    <div className="flex-1 min-w-0">

                                                                        {/* SENDER + UNREAD DOT */}
                                                                        <div className="flex items-center justify-between gap-2 mb-0.5">
                                                                            {senderName ? (
                                                                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
                                                                                    {senderName}
                                                                                </span>
                                                                            ) : (
                                                                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
                                                                                    {isMeeting ? "Meeting" : isCalendar ? "Reminder" : "Notification"}
                                                                                </span>
                                                                            )}

                                                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                                                <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                                                                    {formatTimeOnly(n.createdAt)}
                                                                                </span>
                                                                                {isUnread && (
                                                                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotMap[accent]}`} />
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {/* MESSAGE CONTENT */}
                                                                        <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-snug line-clamp-2">
                                                                            {rawContent}
                                                                        </p>

                                                                        {/* META ROW */}
                                                                        <div className="flex items-center justify-between mt-1.5 gap-2">
                                                                            <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                                                                                <Clock className="h-2.5 w-2.5" />
                                                                                {isCalendar
                                                                                    ? `${formatDateOnly(n.eventDate)} • ${formatTimeOnly(n.eventDate)}`
                                                                                    : formatDateOnly(n.createdAt)
                                                                                }
                                                                            </div>

                                                                            {/* JOIN MEETING BUTTON */}
                                                                            {(isMeeting || n.meetingLink) && n.meetingLink && (
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation()
                                                                                        window.open(n.meetingLink, "_blank")
                                                                                    }}
                                                                                    className="
                                                                                        flex items-center gap-1 text-[11px] font-semibold
                                                                                        bg-blue-600 hover:bg-blue-700 text-white 
                                                                                        px-2.5 py-1 rounded-lg transition-colors
                                                                                        shadow-sm
                                                                                    "
                                                                                >
                                                                                    <Video className="h-2.5 w-2.5" />
                                                                                    Join
                                                                                </button>
                                                                            )}
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ))
                                        ) : (
                                            /* No notifs after slicing */
                                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center mb-3">
                                                    <Bell className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                                                </div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">All caught up!</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">No new notifications</p>
                                            </div>
                                        )
                                    ) : (
                                        /* Empty state */
                                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center mb-3">
                                                <Bell className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">All caught up!</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">No new notifications right now</p>
                                        </div>
                                    )}

                                    {/* Bottom padding */}
                                    <div className="h-2" />
                                </div>

                                {/* ── PANEL FOOTER ── */}
                                <div className="border-t border-gray-100 dark:border-white/8 bg-white dark:bg-[#0d1117] sticky bottom-0">
                                    <button
                                        onClick={() => setExpandedNotifications(prev => !prev)}
                                        className="
                                            w-full px-5 py-3 text-[12px] font-semibold
                                            text-indigo-600 dark:text-indigo-400
                                            hover:bg-indigo-50 dark:hover:bg-indigo-500/8
                                            transition-colors text-center
                                            flex items-center justify-center gap-1.5
                                        "
                                    >
                                        {expandedNotifications ? (
                                            <>
                                                <span>Show less</span>
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
                                            </>
                                        ) : (
                                            <>
                                                <span>View all notifications</span>
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                            </>
                                        )}
                                    </button>
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

                    <div className="flex items-center justify-between px-6 py-4 border-b 
        bg-gray-100 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 
        border-border dark:border-white/10">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpenProfile(false)}
                                className="hover:bg-black/10 dark:hover:bg-white/20"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h2 className="text-lg font-semibold tracking-wide">Profile Settings</h2>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <Label>Full Name</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10 focus-visible:ring-indigo-500"
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
                                    className="bg-gray-200 dark:bg-white/10 border-border dark:border-white/10 text-gray-500 dark:text-gray-400"
                                />
                            </div>
                        </div>
                    </div>

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

            {/* ================= LOGOUT MODAL ================= */}
            <Dialog open={openLogout} onOpenChange={setOpenLogout}>
                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border border-border shadow-2xl">
                    <div className="flex flex-col items-center justify-center px-6 pt-6 pb-4 
    bg-gradient-to-b from-blue-50 to-white 
    dark:from-blue-900/20 dark:to-[#020617]">
                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
                            <LogOut className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
                            Log out of your account?
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
                            You'll need to sign in again to access your dashboard.
                        </p>
                    </div>
                    <div className="flex gap-3 px-6 py-5 bg-white dark:bg-[#020617]">
                        <button
                            onClick={() => setOpenLogout(false)}
                            className="w-1/2 py-2.5 rounded-lg text-sm font-medium 
        bg-gray-100 hover:bg-gray-200 
        dark:bg-white/10 dark:hover:bg-white/20 transition"
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