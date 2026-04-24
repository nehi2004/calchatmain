//"use client"

//import Link from "next/link"
//import { Bell, Menu, User, Video, ArrowLeft, LogOut, CheckCheck, Calendar, MessageSquare, Clock, Check, X } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"

//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import { useEffect, useState, useRef } from "react"

//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"
//import * as signalR from "@microsoft/signalr"


///* ---------------- TYPES ---------------- */

//interface DashboardHeaderProps {
//    onMenuClick: () => void
//    title: string
//}

//interface Notification {
//    id: number
//    fromUserId: string
//    fromUserName: string
//    toUserId: string
//    content: string
//    status: string
//    isRead: boolean
//    createdAt?: string
//    type: string
//    meetingLink?: string | null
//    title?: string
//}


//interface Meeting {
//    id: string
//    title: string
//    startTime: string
//    meetingLink: string
//    createdByName?: string
//    isRead?: boolean
//    createdAt?: string
//}

///* ─────────────────────────────────────────
//   CALENDAR REMINDER HELPERS
//───────────────────────────────────────── */

//function calcTriggerTime(eventDateStr: string, reminderMinutes: number): number {
//    const eventMs = new Date(eventDateStr).getTime()
//    return eventMs - reminderMinutes * 60 * 1000
//}

//function reminderLabel(minutes: number): string {
//    if (minutes === 0) return "at event time"
//    return `${minutes} minute${minutes > 1 ? "s" : ""} before`
//}

///* ─────────────────────────────────────────
//   COMPONENT
//───────────────────────────────────────── */

//export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {

//    /* ── PROFILE ── */
//    const [name, setName] = useState("")
//    const [mounted, setMounted] = useState(false)
//    const [email, setEmail] = useState("")
//    const [nickname, setNickname] = useState("")
//    const [mobile, setMobile] = useState("")
//    const [country, setCountry] = useState("")
//    const [gender, setGender] = useState("")
//    const [image, setImage] = useState<string | null>(null)
//    const [openProfile, setOpenProfile] = useState(false)

//    /* ── NOTIFICATION ── */
//    const [chatNotifs, setChatNotifs] = useState<Notification[]>([])
//    const [meetingNotifs, setMeetingNotifs] = useState<Meeting[]>([])
//    const [calendarNotifs, setCalendarNotifs] = useState<any[]>([])
//    const [showNotifications, setShowNotifications] = useState(false)
//    const [expandedNotifications, setExpandedNotifications] = useState(false)
//    const notifPanelRef = useRef<HTMLDivElement>(null)

//    const [currentUserId, setCurrentUserId] = useState("")
//    const [openLogout, setOpenLogout] = useState(false)
//    const [userRole, setUserRole] = useState("")

//    /* ── REMINDER TOAST ── */
//    const [reminderToast, setReminderToast] = useState<{ title: string; body: string } | null>(null)

//    /* ── UTILS ── */
//    const getMeetingReadIds = () => {
//        const userId = localStorage.getItem("userId")
//        return JSON.parse(localStorage.getItem(`readMeetings_${userId}`) || "[]")
//    }
//    const saveMeetingReadIds = (ids: string[]) => {
//        const userId = localStorage.getItem("userId")
//        localStorage.setItem(`readMeetings_${userId}`, JSON.stringify(ids))
//    }
//    const formatDateOnly = (dateString?: string) => {
//        if (!dateString) return ""
//        return new Date(dateString).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" })
//    }
//    const formatTimeOnly = (dateString?: string) => {
//        if (!dateString) return ""
//        return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//    }

//    const formatEventText = (n: any) => {
//        const date = new Date(n.eventDate || n.createdAt)

//        const today = new Date()
//        const yesterday = new Date()
//        yesterday.setDate(today.getDate() - 1)

//        let dayLabel = date.toLocaleDateString([], {
//            day: "2-digit",
//            month: "short",
//            year: "numeric"
//        })

//        if (date.toDateString() === today.toDateString()) {
//            dayLabel = "Today"
//        } else if (date.toDateString() === yesterday.toDateString()) {
//            dayLabel = "Yesterday"
//        }

//        const time = date.toLocaleTimeString([], {
//            hour: "2-digit",
//            minute: "2-digit"
//        })

//        return `⏰ "${n.eventTitle || "Event"}" at ${time} (${dayLabel})`
//    }
//    const cleanUUID = (text: string) =>
//        (text || "").replace(/^[0-9a-fA-F-]{36}\s*/, "").trim()
//    const getReadIds = () => {
//        if (typeof window === "undefined") return []
//        const userId = localStorage.getItem("userId")
//        return JSON.parse(localStorage.getItem(`readNotifications_${userId}`) || "[]")
//    }
//    const saveReadIds = (ids: number[]) => {
//        const userId = localStorage.getItem("userId")
//        localStorage.setItem(`readNotifications_${userId}`, JSON.stringify(ids))
//    }

//    /* ── CLOSE PANEL ON OUTSIDE CLICK ── */
//    useEffect(() => {
//        const handleClickOutside = (e: MouseEvent) => {
//            if (notifPanelRef.current && !notifPanelRef.current.contains(e.target as Node))
//                setShowNotifications(false)
//        }
//        if (showNotifications) document.addEventListener("mousedown", handleClickOutside)
//        return () => document.removeEventListener("mousedown", handleClickOutside)
//    }, [showNotifications])

//    useEffect(() => { setMounted(true) }, [])
//    useEffect(() => {
//        const role = localStorage.getItem("role") || ""; setUserRole(role)
//    }, [])
//    useEffect(() => {
//        const id = localStorage.getItem("userId") || ""; setCurrentUserId(id)
//        const storedName = localStorage.getItem("name") || ""; setName(storedName)
//    }, [])

//    /* ── SIGNALR (employee only) ── */
//    useEffect(() => {
//        const role = (localStorage.getItem("role") || "").toLowerCase()
//        if (role !== "employee" && role !== "professional") return


//        const connection = new signalR.HubConnectionBuilder()
//            .withUrl("https://steadfast-warmth-production-64c8.up.railway.app/chatHub", {
//                accessTokenFactory: () => localStorage.getItem("token") || ""
//            })
//            .withAutomaticReconnect()
//            .build()

//        connection.start().catch(err => console.error("SignalR Error:", err))

//        connection.on("ReceiveNotification", (data) => {
//            const notifType = data.type || "info"

//            if (notifType === "announcement") {
//                const hrName = cleanUUID(data.createdByName || data.fromUserName || "HR")
//                const announcementTitle = cleanUUID(data.title || "Announcement")

//                setChatNotifs(prev => [
//                    {
//                        id: Date.now(),
//                        fromUserId: data.fromUserId || "system",
//                        fromUserName: hrName,
//                        toUserId: currentUserId,
//                        content: `${hrName} shared an announcement: ${announcementTitle}`,
//                        status: "info",
//                        type: "announcement",
//                        isRead: false,
//                        createdAt: data.createdAt || new Date().toISOString(),
//                        title: announcementTitle
//                    },
//                    ...prev
//                ])
//                return
//            }

//            const cleanTitle = cleanUUID(data.title || "")
//            const startTime = data.startTime || data.dateTime || null

//            const formattedDate = startTime
//                ? new Date(startTime).toLocaleDateString([], {
//                    day: "2-digit",
//                    month: "short",
//                    year: "numeric"
//                })
//                : ""

//            const formattedTime = startTime
//                ? new Date(startTime).toLocaleTimeString([], {
//                    hour: "2-digit",
//                    minute: "2-digit"
//                })
//                : ""

//            setChatNotifs(prev => [
//                {
//                    id: Date.now(),
//                    fromUserId: data.fromUserId || "system",
//                    fromUserName: data.createdByName || "HR",
//                    toUserId: currentUserId,
//                    content: `${cleanTitle} scheduled on ${formattedDate} at ${formattedTime}`,
//                    meetingLink: data.meetingLink || data.link || null,
//                    status: "info",
//                    type: "meeting",
//                    isRead: false,
//                    createdAt: data.createdAt || new Date().toISOString()
//                },
//                ...prev
//            ])
//        })


//        return () => { connection.stop() }
//    }, [currentUserId])

//    /* ── LOAD PROFILE ── */
//    useEffect(() => {
//        const loadProfile = async () => {
//            try {
//                const token = localStorage.getItem("token")
//                if (!token) return
//                const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Account/profile", {
//                    headers: { Authorization: `Bearer ${token}` }
//                })
//                if (res.status === 401) { localStorage.removeItem("token"); window.location.href = "/"; return }
//                if (!res.ok) return
//                const data = await res.json()
//                const finalName = data.name || data.fullName || localStorage.getItem("name") || ""
//                setName(finalName); localStorage.setItem("name", finalName)
//                setEmail(data.email || ""); setNickname(data.nickname || "")
//                setMobile(data.mobile || ""); setCountry(data.country || "")
//                setGender(data.gender || ""); setImage(data.profileImage || null)
//            } catch (err) { console.error("Profile load error:", err) }
//        }
//        loadProfile()
//    }, [])

//    /* ── FETCH CHAT NOTIFICATIONS ── */
//    const fetchNotifications = async () => {
//        try {
//            const res = await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/${currentUserId}`
//            )
//            const data = await res.json()
//            const role = localStorage.getItem("role")
//            const filtered = role === "employee"
//                ? data
//                : data.filter((n: Notification) => n.type !== "announcement")
//            const readIds = getReadIds()


//            const buildMessage = (n: Notification) => {
//                if (n.type === "meeting") {
//                    const date = new Date(n.createdAt || "")
//                    const formattedDate = date.toLocaleDateString([], {
//                        day: "2-digit",
//                        month: "short",
//                        year: "numeric"
//                    })
//                    const formattedTime = date.toLocaleTimeString([], {
//                        hour: "2-digit",
//                        minute: "2-digit"
//                    })

//                    return `${cleanUUID(n.content)} • ${formattedDate} at ${formattedTime}`
//                }

//                return cleanUUID(n.content)
//            }

//            setChatNotifs(
//                filtered.map((n: Notification) => ({
//                    ...n,
//                    fromUserName: cleanUUID(n.fromUserName),
//                    content: buildMessage(n),
//                    createdAt: n.createdAt || new Date().toISOString(),
//                    isRead: readIds.includes(n.id) ? true : n.isRead
//                }))
//            )
//        } catch { setChatNotifs([]) }
//    }

//    /* ── FETCH MEETINGS ── */
//    const fetchMeetings = async () => {
//        try {
//            const token = localStorage.getItem("token")
//            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/meeting/my-meetings", {
//                headers: { Authorization: `Bearer ${token}` }
//            })
//            const data = await res.json()
//            const now = new Date()
//            const upcoming = data.filter((m: Meeting) => new Date(m.startTime) > now)
//            const readIds = getMeetingReadIds()
//            if (userRole === "hr") { setMeetingNotifs([]); return }
//            setMeetingNotifs(upcoming.map((m: Meeting) => ({
//                ...m,
//                isRead: readIds.includes(m.id),
//                createdAt: m.createdAt || m.startTime,
//                createdByName: m.createdByName || "HR"
//            })))
//        } catch { setMeetingNotifs([]) }
//    }

//    /* ── POLLING ── */
//    useEffect(() => {
//        if (!currentUserId) return
//        fetchNotifications(); fetchMeetings()
//        const interval = setInterval(() => { fetchNotifications(); fetchMeetings() }, 3000)
//        return () => clearInterval(interval)
//    }, [currentUserId])

//    /* ─────────────────────────────────────────
//       CALENDAR REMINDER POLLING
//       Checks every 30 seconds whether any stored
//       calendar events should trigger now.
//    ───────────────────────────────────────── */
//    const loadGlobalNotifications = () => {
//        const currentUser = localStorage.getItem("userId")
//        const data: any[] = JSON.parse(localStorage.getItem("globalNotifications") || "[]")
//        const filtered = data.filter((n: any) => n.userId === currentUser)
//        setCalendarNotifs(filtered)
//    }

//    useEffect(() => {
//        loadGlobalNotifications()
//        const handler = () => loadGlobalNotifications()
//        window.addEventListener("new-notification", handler)
//        return () => window.removeEventListener("new-notification", handler)
//    }, [])

//    useEffect(() => {
//        const interval = setInterval(() => {
//            const now = Date.now()
//            const currentUser = localStorage.getItem("userId")
//            const data: any[] = JSON.parse(localStorage.getItem("globalNotifications") || "[]")

//            let changed = false
//            const updated = data.map((n: any) => {
//                if (n.userId !== currentUser) return n

//                // ── At-time reminder ──
//                if (!n.triggered_at && n.triggerTime_at && now >= n.triggerTime_at) {
//                    changed = true
//                    showReminderToast(n.eventTitle, `⏰ Reminder: "${n.eventTitle}" is happening now!`)
//                    return { ...n, triggered_at: true, isRead: false }
//                }
//                // ── 5-min-before reminder ──
//                if (!n.triggered_5 && n.triggerTime_5 && now >= n.triggerTime_5) {
//                    changed = true
//                    showReminderToast(n.eventTitle, `⏰ "${n.eventTitle}" starts in 5 minutes!`)
//                    return { ...n, triggered_5: true, isRead: false }
//                }
//                // ── 10-min-before reminder ──
//                if (!n.triggered_10 && n.triggerTime_10 && now >= n.triggerTime_10) {
//                    changed = true
//                    showReminderToast(n.eventTitle, `⏰ "${n.eventTitle}" starts in 10 minutes!`)
//                    return { ...n, triggered_10: true, isRead: false }
//                }

//                // ── Legacy single-trigger support ──
//                if (n.triggerTime && !n.triggered && now >= n.triggerTime) {
//                    changed = true
//                    return { ...n, triggered: true }
//                }
//                return n
//            })

//            if (changed) {
//                localStorage.setItem("globalNotifications", JSON.stringify(updated))
//                setCalendarNotifs(updated.filter((n: any) => n.userId === currentUser))
//            }
//        }, 30000) // every 30 seconds

//        return () => clearInterval(interval)
//    }, [])

//    /* ── SHOW REMINDER TOAST ── */
//    const showReminderToast = (title: string, body: string) => {
//        setReminderToast({ title, body })
//        setTimeout(() => setReminderToast(null), 6000)
//    }

//    /* ─────────────────────────────────────────
//       CHAT REQUEST ACCEPT / REJECT
//    ───────────────────────────────────────── */

//    /**
//     * Accept or reject a chat_request notification.
//     * After update, we send a "status" notification back to the requester.
//     */
//    const handleChatRequest = async (notifId: number, status: "accepted" | "rejected") => {
//        try {
//            // 1️⃣ Update the notification status on the server
//            await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/${notifId}`,
//                {
//                    method: "PUT",
//                    headers: { "Content-Type": "application/json" },
//                    body: JSON.stringify(status)
//                }
//            )

//            // 2️⃣ If accepted, create the chat room
//            if (status === "accepted") {
//                await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/chat/create", {
//                    method: "POST",
//                    headers: { "Content-Type": "application/json" },
//                    body: JSON.stringify({ notificationId: notifId })
//                })
//                window.dispatchEvent(new Event("chat-updated"))
//            }

//            // 3️⃣ Find the original notification so we know who to notify back
//            const original = chatNotifs.find(n => n.id === notifId)
//            if (original) {
//                const myName = localStorage.getItem("name") || "Someone"
//                const statusMsg =
//                    status === "accepted"
//                        ? `✅ ${myName} accepted your chat request`
//                        : `❌ ${myName} rejected your chat request`

//                // 4️⃣ Send a notification back to the requester
//                await fetch(
//                    "https://steadfast-warmth-production-64c8.up.railway.app/api/notifications",
//                    {
//                        method: "POST",
//                        headers: { "Content-Type": "application/json" },
//                        body: JSON.stringify({
//                            fromUserId: currentUserId,
//                            fromUserName: myName,
//                            toUserId: original.fromUserId,
//                            content: statusMsg,
//                            type: status === "accepted" ? "chat_accepted" : "chat_rejected",
//                            status: "info",
//                            isRead: false
//                        })
//                    }
//                )
//            }

//            // 5️⃣ Remove from local state
//            setChatNotifs(prev => prev.filter(n => n.id !== notifId))
//            fetchNotifications()
//        } catch (err) {
//            console.error("Chat request error:", err)
//        }
//    }

//    /* ── MARK ALL READ ── */
//    const markAllRead = async () => {
//        try {
//            await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/mark-read/${currentUserId}`,
//                { method: "PUT" }
//            )
//            setChatNotifs(prev => prev.map(n => ({ ...n, isRead: true })))
//            setMeetingNotifs(prev => prev.map(m => ({ ...m, isRead: true })))
//            saveMeetingReadIds(meetingNotifs.map(m => m.id))
//            const updatedCalendar = calendarNotifs.map(n => ({ ...n, isRead: true }))
//            setCalendarNotifs(updatedCalendar)
//            localStorage.setItem("globalNotifications", JSON.stringify(updatedCalendar))
//            saveReadIds(chatNotifs.map(n => n.id))
//        } catch (err) { console.error("Mark read error:", err) }
//    }

//    /* ── PROFILE SAVE ── */
//    const saveProfile = async () => {
//        try {
//            const token = localStorage.getItem("token")
//            await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Account/profile", {
//                method: "PUT",
//                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//                body: JSON.stringify({ name, nickname, gender, country, mobile, profileImage: image })
//            })
//            setOpenProfile(false)
//        } catch (err) { console.error("Profile save error:", err) }
//    }

//    const handleImageUpload = (e: any) => {
//        const file = e.target.files[0]; if (!file) return
//        const reader = new FileReader()
//        reader.onloadend = () => setImage(reader.result as string)
//        reader.readAsDataURL(file)
//    }

//    const initials = name
//        ? name.split(" ").map(n => n[0]).join("").toUpperCase()
//        : "U"

//    /* ── UNREAD COUNTS ── */
//    const unreadChatCount = chatNotifs.filter(n => !n.isRead).length
//    const unreadMeetingCount = meetingNotifs.filter(m => !m.isRead).length
//    const unreadCalendarCount = calendarNotifs.filter(n => !n.isRead).length
//    const totalCount = unreadChatCount + unreadMeetingCount + unreadCalendarCount

//    /* ── GROUPED NOTIFICATIONS ── */
//    const buildGroupedNotifs = () => {
//        let allNotifs: any[] = [
//            // Calendar reminders that have been triggered (any trigger)
//            ...calendarNotifs.filter(n => n.triggered || n.triggered_at || n.triggered_5 || n.triggered_10),
//            ...chatNotifs,
//            ...meetingNotifs.map(m => ({
//                ...m,
//                type: "meeting",
//                content: m.title,
//                createdAt: m.createdAt || m.startTime,
//                fromUserName: `HR (${m.createdByName || "HR"})`,
//                createdByName: m.createdByName || "HR",
//                meetingLink: m.meetingLink,
//                eventDate: m.startTime
//            }))
//        ].sort((a: any, b: any) =>
//            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
//        )

//        if (!expandedNotifications) allNotifs = allNotifs.slice(0, 5)

//        const today = new Date(); const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)
//        const getGroupLabel = (dateStr: string) => {
//            const d = new Date(dateStr)
//            if (d.toDateString() === today.toDateString()) return "Today"
//            if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
//            return formatDateOnly(dateStr)
//        }
//        const grouped: Record<string, any[]> = {}
//        allNotifs.forEach((n: any) => {
//            const label = getGroupLabel(n.createdAt)
//            if (!grouped[label]) grouped[label] = []
//            grouped[label].push(n)
//        })
//        return grouped
//    }

//    const getNotifIcon = (n: any) => {
//        if (n.type === "chat_request") return "💬"
//        if (n.type === "chat_accepted") return "✅"
//        if (n.type === "chat_rejected") return "❌"
//        if (n.type === "announcement") return "📢"
//        if (n.eventDate || n.type === "calendar") return "⏰"
//        if (n.type === "meeting") return "📅"
//        return "🔔"
//    }


//    const getNotifAccent = (n: any) => {
//        if (n.type === "chat_accepted") return "green"
//        if (n.type === "chat_rejected") return "red"
//        if (n.type === "chat_request") return "purple"
//        if (n.type === "announcement") return "purple"
//        if (n.type === "meeting" || (n.content || "").includes("📅")) return "blue"
//        if (n.eventDate || n.type === "calendar") return "amber"
//        return "gray"
//    }


//    const hasNotifications = chatNotifs.length > 0 || meetingNotifs.length > 0 ||
//        calendarNotifs.filter(n => n.triggered || n.triggered_at || n.triggered_5 || n.triggered_10).length > 0

//    if (!mounted) return null
//    const grouped = buildGroupedNotifs()

//    /* ─────────────────────────────────────────
//       RENDER
//    ───────────────────────────────────────── */
//    return (
//        <>
//            {/* ── REMINDER TOAST ── */}
//            {reminderToast && (
//                <div className="
//                    fixed top-5 right-5 z-[9999]
//                    bg-amber-500 text-white
//                    rounded-2xl shadow-2xl
//                    px-5 py-4 max-w-sm
//                    flex items-start gap-3
//                    animate-in slide-in-from-top-2 duration-300
//                ">
//                    <span className="text-2xl">⏰</span>
//                    <div>
//                        <p className="font-semibold text-sm">{reminderToast.title}</p>
//                        <p className="text-xs opacity-90 mt-0.5">{reminderToast.body}</p>
//                    </div>
//                    <button onClick={() => setReminderToast(null)} className="ml-auto text-white/70 hover:text-white">
//                        <X className="h-4 w-4" />
//                    </button>
//                </div>
//            )}

//            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">

//                <div className="flex items-center gap-3">
//                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
//                        <Menu className="h-5 w-5" />
//                    </Button>
//                    <h1 className="font-semibold">{title}</h1>
//                </div>

//                <div className="flex items-center gap-2">
//                    <ThemeToggle />

//                    {/* 🔔 NOTIFICATIONS */}
//                    <div className="relative" ref={notifPanelRef}>
//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            className="relative"
//                            onClick={async () => {
//                                const opening = !showNotifications
//                                setShowNotifications(opening)
//                                if (opening) await markAllRead()
//                            }}
//                        >
//                            <Bell className="h-4 w-4" />
//                            {totalCount > 0 && (
//                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold px-1 rounded-full flex items-center justify-center leading-none">
//                                    {totalCount > 99 ? "99+" : totalCount}
//                                </span>
//                            )}
//                        </Button>

//                        {/* ── NOTIFICATION PANEL ── */}
//                        {showNotifications && (
//                            <div
//                                className="
//                                    absolute right-0 top-[calc(100%+8px)]
//                                    w-[400px]
//                                    bg-white dark:bg-[#0d1117]
//                                    border border-gray-200 dark:border-white/10
//                                    rounded-2xl shadow-2xl z-50
//                                    flex flex-col overflow-hidden
//                                    max-h-[85vh]
//                                "
//                                style={{ boxShadow: "0 20px 60px -10px rgba(0,0,0,0.18), 0 4px 16px -4px rgba(0,0,0,0.12)" }}
//                            >

//                                {/* PANEL HEADER */}
//                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/8 bg-white dark:bg-[#0d1117]">
//                                    <div className="flex items-center gap-2.5">
//                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
//                                            <Bell className="h-3.5 w-3.5 text-white" />
//                                        </div>
//                                        <div>
//                                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">Notifications</h4>
//                                            {totalCount > 0 && (
//                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">{totalCount} unread</p>
//                                            )}
//                                        </div>
//                                    </div>
//                                    <button
//                                        onClick={markAllRead}
//                                        className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
//                                    >
//                                        <CheckCheck className="h-3 w-3" />
//                                        Mark all read
//                                    </button>
//                                </div>

//                                {/* SCROLLABLE BODY */}
//                                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
//                                    {hasNotifications ? (
//                                        Object.keys(grouped).length > 0 ? (
//                                            Object.keys(grouped).map((group, gIdx) => (
//                                                <div key={gIdx}>
//                                                    {/* GROUP DATE LABEL */}
//                                                    <div className="flex items-center gap-3 px-5 pt-4 pb-2">
//                                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">{group}</span>
//                                                        <div className="flex-1 h-px bg-gray-100 dark:bg-white/6" />
//                                                    </div>

//                                                    {grouped[group].map((n: any, i: number) => {
//                                                        const isUnread = !n.isRead
//                                                        const accent = getNotifAccent(n)
//                                                        const icon = getNotifIcon(n)
//                                                        const isMeeting = n.type === "meeting" || (n.content || "").includes("📅")
//                                                        const isCalendar = !!n.eventDate || n.type === "calendar"
//                                                        const isChatRequest = n.type === "chat_request" && n.status === "pending"

//                                                        const accentMap: Record<string, string> = {
//                                                            blue: "bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400",
//                                                            amber: "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400",
//                                                            green: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
//                                                            red: "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400",
//                                                            purple: "bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400",
//                                                            gray: "bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-gray-400",
//                                                        }
//                                                        const dotMap: Record<string, string> = {
//                                                            blue: "bg-blue-500", amber: "bg-amber-500", green: "bg-emerald-500",
//                                                            red: "bg-red-500", purple: "bg-purple-500", gray: "bg-gray-400",
//                                                        }

//                                                        const senderName = (() => {
//                                                            if (n.type === "meeting") {
//                                                                const actualName = cleanUUID(n.createdByName || n.fromUserName || "")

//                                                                // ❌ avoid HR (HR)
//                                                                if (!actualName || actualName.toLowerCase() === "hr") {
//                                                                    return "HR"
//                                                                }

//                                                                return `HR (${actualName})`
//                                                            }

//                                                            return cleanUUID(n.fromUserName || "")
//                                                        })()
//                                                        const rawContent: string = n.content || ""

//                                                        return (
//                                                            <div
//                                                                key={i}
//                                                                className={`
//                                                                    group relative mx-3 mb-1 rounded-xl px-3 py-3 cursor-pointer
//                                                                    transition-all duration-150
//                                                                    ${isUnread
//                                                                        ? "bg-indigo-50/70 dark:bg-indigo-500/8 hover:bg-indigo-50 dark:hover:bg-indigo-500/12"
//                                                                        : "hover:bg-gray-50 dark:hover:bg-white/4"
//                                                                    }
//                                                                `}
//                                                            >
//                                                                <div className="flex gap-3">
//                                                                    {/* ICON AVATAR */}
//                                                                    <div className="flex-shrink-0 mt-0.5">
//                                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-sm ${accentMap[accent]}`}>
//                                                                            {icon}
//                                                                        </div>
//                                                                    </div>

//                                                                    {/* CONTENT */}
//                                                                    <div className="flex-1 min-w-0">
//                                                                        {/* SENDER + UNREAD DOT */}
//                                                                        <div className="flex items-center justify-between gap-2 mb-0.5">
//                                                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
//                                                                                {senderName || (isMeeting ? "Meeting" : isCalendar ? "Reminder" : "Notification")}
//                                                                            </span>
//                                                                            <div className="flex items-center gap-1.5 flex-shrink-0">
//                                                                                <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
//                                                                                    {formatTimeOnly(n.createdAt)}
//                                                                                </span>
//                                                                                {isUnread && (
//                                                                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotMap[accent]}`} />
//                                                                                )}
//                                                                            </div>
//                                                                        </div>

//                                                                        {/* MESSAGE CONTENT */}
//                                                                        <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-snug line-clamp-2">
//                                                                            {isMeeting
//                                                                                ? `${cleanUUID(n.content).replace("📅", "").trim()} at ${formatTimeOnly(n.eventDate)} (${formatDateOnly(n.eventDate)})`
//                                                                                : isCalendar
//                                                                                    ? formatEventText(n)
//                                                                                    : rawContent
//                                                                            }
//                                                                        </p>

//                                                                        {/* META ROW */}
//                                                                        <div className="flex items-center justify-between mt-1.5 gap-2 flex-wrap">
//                                                                            <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
//                                                                                <Clock className="h-2.5 w-2.5" />
//                                                                                {isCalendar
//                                                                                    ? `${formatDateOnly(n.eventDate)} • ${formatTimeOnly(n.eventDate)}`
//                                                                                    : formatDateOnly(n.createdAt)
//                                                                                }
//                                                                            </div>

//                                                                            {/* ── CHAT REQUEST ACCEPT / REJECT ── */}
//                                                                            {isChatRequest && (
//                                                                                <div className="flex items-center gap-1.5">
//                                                                                    <button
//                                                                                        onClick={(e) => {
//                                                                                            e.stopPropagation()
//                                                                                            handleChatRequest(n.id, "accepted")
//                                                                                        }}
//                                                                                        className="
//                                                                                            flex items-center gap-1 text-[11px] font-semibold
//                                                                                            bg-emerald-500 hover:bg-emerald-600 text-white
//                                                                                            px-2.5 py-1 rounded-lg transition-colors shadow-sm
//                                                                                        "
//                                                                                    >
//                                                                                        <Check className="h-2.5 w-2.5" />
//                                                                                        Accept
//                                                                                    </button>
//                                                                                    <button
//                                                                                        onClick={(e) => {
//                                                                                            e.stopPropagation()
//                                                                                            handleChatRequest(n.id, "rejected")
//                                                                                        }}
//                                                                                        className="
//                                                                                            flex items-center gap-1 text-[11px] font-semibold
//                                                                                            bg-red-500 hover:bg-red-600 text-white
//                                                                                            px-2.5 py-1 rounded-lg transition-colors shadow-sm
//                                                                                        "
//                                                                                    >
//                                                                                        <X className="h-2.5 w-2.5" />
//                                                                                        Reject
//                                                                                    </button>
//                                                                                </div>
//                                                                            )}

//                                                                            {/* JOIN MEETING BUTTON */}
//                                                                            {(isMeeting || n.meetingLink) && n.meetingLink && (
//                                                                                <button
//                                                                                    onClick={(e) => {
//                                                                                        e.stopPropagation()
//                                                                                        window.open(n.meetingLink, "_blank")
//                                                                                    }}
//                                                                                    className="
//                                                                                        flex items-center gap-1 text-[11px] font-semibold
//                                                                                        bg-blue-600 hover:bg-blue-700 text-white
//                                                                                        px-2.5 py-1 rounded-lg transition-colors shadow-sm
//                                                                                    "
//                                                                                >
//                                                                                    <Video className="h-2.5 w-2.5" />
//                                                                                    Join
//                                                                                </button>
//                                                                            )}
//                                                                        </div>
//                                                                    </div>
//                                                                </div>
//                                                            </div>
//                                                        )
//                                                    })}
//                                                </div>
//                                            ))
//                                        ) : (
//                                            <EmptyState />
//                                        )
//                                    ) : (
//                                        <EmptyState />
//                                    )}
//                                    <div className="h-2" />
//                                </div>

//                                {/* PANEL FOOTER */}
//                                <div className="border-t border-gray-100 dark:border-white/8 bg-white dark:bg-[#0d1117] sticky bottom-0">
//                                    <button
//                                        onClick={() => setExpandedNotifications(prev => !prev)}
//                                        className="w-full px-5 py-3 text-[12px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/8 transition-colors text-center flex items-center justify-center gap-1.5"
//                                    >
//                                        {expandedNotifications ? (
//                                            <>
//                                                <span>Show less</span>
//                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
//                                            </>
//                                        ) : (
//                                            <>
//                                                <span>View all notifications</span>
//                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
//                                            </>
//                                        )}
//                                    </button>
//                                </div>
//                            </div>
//                        )}
//                    </div>

//                    {/* USER MENU */}
//                    <DropdownMenu>
//                        <DropdownMenuTrigger asChild>
//                            <Button variant="ghost" className="gap-2">
//                                <Avatar className="h-7 w-7">
//                                    {image ? <AvatarImage src={image} /> : <AvatarFallback>{initials}</AvatarFallback>}
//                                </Avatar>
//                                {name || "User"}
//                            </Button>
//                        </DropdownMenuTrigger>
//                        <DropdownMenuContent align="end">
//                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
//                                <User className="mr-2 h-4 w-4" /> Profile
//                            </DropdownMenuItem>
//                            <DropdownMenuSeparator />
//                            <DropdownMenuItem onClick={() => setOpenLogout(true)}>
//                                <LogOut className="mr-2 h-4 w-4" /> Logout
//                            </DropdownMenuItem>
//                        </DropdownMenuContent>
//                    </DropdownMenu>
//                </div>
//            </header>

//            {/* ── PROFILE MODAL ── */}
//            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
//                <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border border-border bg-white text-black dark:bg-gradient-to-br dark:from-[#020617] dark:to-[#0f172a] dark:text-white shadow-2xl">
//                    <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-100 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 border-border dark:border-white/10">
//                        <div className="flex items-center gap-3">
//                            <Button variant="ghost" size="icon" onClick={() => setOpenProfile(false)} className="hover:bg-black/10 dark:hover:bg-white/20">
//                                <ArrowLeft className="h-4 w-4" />
//                            </Button>
//                            <h2 className="text-lg font-semibold tracking-wide">Profile Settings</h2>
//                        </div>
//                    </div>
//                    <div className="p-6 space-y-6">
//                        <div className="flex items-center gap-5">
//                            <label className="cursor-pointer relative group">
//                                <Avatar className="h-20 w-20 border-2 border-indigo-500 shadow-lg">
//                                    {image
//                                        ? <AvatarImage src={image} />
//                                        : <AvatarFallback className="text-lg font-bold bg-indigo-600 text-white">{initials}</AvatarFallback>
//                                    }
//                                </Avatar>
//                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center text-white text-xs font-medium transition">Change</div>
//                                <input type="file" className="hidden" onChange={handleImageUpload} />
//                            </label>
//                            <div>
//                                <p className="text-lg font-semibold">{name}</p>
//                                <p className="text-sm text-muted-foreground">{email}</p>
//                            </div>
//                        </div>
//                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                            <div className="space-y-1">
//                                <Label>Full Name</Label>
//                                <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10 focus-visible:ring-indigo-500" />
//                            </div>
//                            <div className="space-y-1">
//                                <Label>Nick Name</Label>
//                                <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
//                            </div>
//                            <div className="md:col-span-2 space-y-2">
//                                <Label>Gender</Label>
//                                <div className="flex gap-3">
//                                    {["Male", "Female", "Other"].map(g => (
//                                        <button key={g} type="button" onClick={() => setGender(g)}
//                                            className={`px-4 py-2 rounded-lg border text-sm transition ${gender === g ? "bg-indigo-600 text-white border-indigo-500 shadow-md" : "bg-gray-100 dark:bg-white/5 border-border dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"}`}
//                                        >{g}</button>
//                                    ))}
//                                </div>
//                            </div>
//                            <div className="space-y-1">
//                                <Label>Mobile</Label>
//                                <Input value={mobile} onChange={(e) => setMobile(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
//                            </div>
//                            <div className="space-y-1">
//                                <Label>Country</Label>
//                                <Input value={country} onChange={(e) => setCountry(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
//                            </div>
//                            <div className="md:col-span-2 space-y-1">
//                                <Label>Email</Label>
//                                <Input value={email} disabled className="bg-gray-200 dark:bg-white/10 border-border dark:border-white/10 text-gray-500 dark:text-gray-400" />
//                            </div>
//                        </div>
//                    </div>
//                    <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-100 dark:bg-white/5 border-border dark:border-white/10">
//                        <Button variant="outline" onClick={() => setOpenProfile(false)} className="hover:bg-gray-200 dark:hover:bg-white/10">Cancel</Button>
//                        <Button onClick={saveProfile} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-lg">Save Changes</Button>
//                    </div>
//                </DialogContent>
//            </Dialog>

//            {/* ── LOGOUT MODAL ── */}
//            <Dialog open={openLogout} onOpenChange={setOpenLogout}>
//                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border border-border shadow-2xl">
//                    <div className="flex flex-col items-center justify-center px-6 pt-6 pb-4 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-[#020617]">
//                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
//                            <LogOut className="h-6 w-6 text-blue-600" />
//                        </div>
//                        <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">Log out of your account?</h2>
//                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">You'll need to sign in again to access your dashboard.</p>
//                    </div>
//                    <div className="flex gap-3 px-6 py-5 bg-white dark:bg-[#020617]">
//                        <button onClick={() => setOpenLogout(false)}
//                            className="w-1/2 py-2.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition">Cancel</button>
//                        <button onClick={() => { localStorage.clear(); window.location.href = "/" }}
//                            className="w-1/2 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition">Log out</button>
//                    </div>
//                </DialogContent>
//            </Dialog>
//        </>
//    )
//}

///* ─── EMPTY STATE ─── */
//function EmptyState() {
//    return (
//        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
//            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center mb-3">
//                <Bell className="h-6 w-6 text-gray-300 dark:text-gray-600" />
//            </div>
//            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">All caught up!</p>
//            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">No new notifications right now</p>
//        </div>
//    )
//}


///* ─────────────────────────────────────────────────────────────────
//   CALENDAR EVENT HELPER  (use this when SAVING a calendar event)

//   Call this function right after you save/create a CalendarEvent
//   so the reminders get registered in localStorage.

//   Parameters:
//     - eventId:       unique event ID (Guid string from backend)
//     - eventTitle:    display name of the event
//     - eventDateStr:  ISO date+time string of the event (e.g. "2025-08-01T10:30:00")
//     - reminderType:  "at" | "5" | "10" | "at+5" | "at+10" | "5+10" | "at+5+10"
//                      (pass whichever reminder mode the user selected)
//     - userId:        current user's ID

//   Example usage (in your Calendar component):
//     registerCalendarReminder(event.id, event.title, event.date + "T" + event.time, "at+5+10", userId)
//───────────────────────────────────────────────────────────────── */
//export function registerCalendarReminder(
//    eventId: string,
//    eventTitle: string,
//    eventDateStr: string,
//    reminderType: string, // "at" | "5" | "10" | "at+5" | "at+10" | "5+10" | "at+5+10"
//    userId: string
//) {
//    const existing: any[] = JSON.parse(localStorage.getItem("globalNotifications") || "[]")

//    // Remove old reminders for this event
//    const filtered = existing.filter((n: any) => n.eventId !== eventId)

//    const entry: any = {
//        eventId,
//        eventTitle,
//        userId,
//        type: "calendar",
//        createdAt: new Date().toISOString(),
//        isRead: false,
//        eventDate: eventDateStr,
//        // trigger flags — will be set true once fired
//        triggered_at: false,
//        triggered_5: false,
//        triggered_10: false,
//    }

//    const types = reminderType.split("+")

//    if (types.includes("at")) {
//        entry.triggerTime_at = calcTriggerTime(eventDateStr, 0)
//    }
//    if (types.includes("5")) {
//        entry.triggerTime_5 = calcTriggerTime(eventDateStr, 5)
//    }
//    if (types.includes("10")) {
//        entry.triggerTime_10 = calcTriggerTime(eventDateStr, 10)
//    }

//    filtered.push(entry)
//    localStorage.setItem("globalNotifications", JSON.stringify(filtered))
//    window.dispatchEvent(new Event("new-notification"))
//}

///* ─────────────────────────────────────────────────────────────────
//   LEGACY SINGLE-TRIGGER (backwards compat)
//   For older code that saves one triggerTime value.
//───────────────────────────────────────────────────────────────── */
//export function registerLegacyReminder(
//    eventId: string,
//    eventTitle: string,
//    eventDateStr: string,
//    reminderMinutes: number, // 0 = at time, 5 = 5 min before, 10 = 10 min before
//    userId: string
//) {
//    registerCalendarReminder(
//        eventId,
//        eventTitle,
//        eventDateStr,
//        reminderMinutes === 0 ? "at" : String(reminderMinutes),
//        userId
//    )
//}














//"use client"

//import { type ChangeEvent, useEffect, useRef, useState } from "react"
//import { Bell, Menu, User, Video, ArrowLeft, LogOut, CheckCheck, Clock, Check, X } from "lucide-react"
//import * as signalR from "@microsoft/signalr"

//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import {
//    Dialog,
//    DialogContent,
//} from "@/components/ui/dialog"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"

//interface DashboardHeaderProps {
//    onMenuClick: () => void
//    title: string
//}

//interface Notification {
//    id: number
//    fromUserId: string
//    fromUserName: string
//    toUserId: string
//    content: string
//    status: string
//    isRead: boolean
//    createdAt?: string
//    type: string
//    meetingLink?: string | null
//    title?: string
//}

//interface Meeting {
//    id: string
//    title: string
//    startTime: string
//    meetingLink: string
//    createdByName?: string
//    isRead?: boolean
//    createdAt?: string
//}

//interface LocalEventNotification {
//    id: string | number
//    userId: string
//    type: string
//    isRead: boolean
//    createdAt: string
//    eventId?: string
//    eventTitle?: string
//    eventDate?: string
//    eventTime?: string
//    location?: string
//    message?: string
//    text?: string
//    triggerTime?: number
//    triggered?: boolean
//    triggerTime_at?: number
//    triggerTime_5?: number
//    triggerTime_10?: number
//    triggered_at?: boolean
//    triggered_5?: boolean
//    triggered_10?: boolean
//}

//function calcTriggerTime(eventDateStr: string, reminderMinutes: number): number {
//    const eventMs = new Date(eventDateStr).getTime()
//    return eventMs - reminderMinutes * 60 * 1000
//}

//function reminderLabel(minutes: number): string {
//    if (minutes === 0) return "at event time"
//    return `${minutes} minute${minutes > 1 ? "s" : ""} before`
//}

//function parseStoredNotifications(): LocalEventNotification[] {
//    if (typeof window === "undefined") return []

//    try {
//        return JSON.parse(localStorage.getItem("globalNotifications") || "[]")
//    } catch {
//        return []
//    }
//}

//function writeStoredNotifications(items: LocalEventNotification[]) {
//    localStorage.setItem("globalNotifications", JSON.stringify(items))
//}

//function isTriggeredReminder(notification: LocalEventNotification) {
//    return Boolean(
//        notification.triggered ||
//        notification.triggered_at ||
//        notification.triggered_5 ||
//        notification.triggered_10
//    )
//}

//function isReminderNotification(notification: LocalEventNotification) {
//    return Boolean(
//        notification.type === "calendar" ||
//        notification.triggerTime ||
//        notification.triggerTime_at ||
//        notification.triggerTime_5 ||
//        notification.triggerTime_10
//    )
//}

//function isDisplayableLocalNotification(notification: LocalEventNotification) {
//    if (isReminderNotification(notification)) return isTriggeredReminder(notification)
//    return true
//}

//function formatEventDateTime(date?: string, time?: string) {
//    if (!date && !time) return ""

//    const datePart = date
//        ? new Date(date).toLocaleDateString([], {
//            day: "2-digit",
//            month: "short",
//            year: "numeric",
//        })
//        : ""

//    if (datePart && time) return `${datePart} at ${time}`
//    return datePart || time || ""
//}

//function buildEventNotificationMessage(notification: LocalEventNotification) {
//    const details = formatEventDateTime(notification.eventDate, notification.eventTime)
//    const title = notification.eventTitle || "Event"

//    if (notification.message) return notification.message
//    if (notification.text) return notification.text

//    switch (notification.type) {
//        case "event_created":
//            return `${title} has been created${details ? ` for ${details}` : ""}.`
//        case "event_updated":
//            return `${title} has been updated${details ? ` to ${details}` : ""}.`
//        case "event_deleted":
//            return `${title} has been deleted${details ? ` from ${details}` : ""}.`
//        default:
//            return title
//    }
//}

//export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {
//    const [name, setName] = useState("")
//    const [mounted, setMounted] = useState(false)
//    const [email, setEmail] = useState("")
//    const [nickname, setNickname] = useState("")
//    const [mobile, setMobile] = useState("")
//    const [country, setCountry] = useState("")
//    const [gender, setGender] = useState("")
//    const [image, setImage] = useState<string | null>(null)
//    const [openProfile, setOpenProfile] = useState(false)

//    const [chatNotifs, setChatNotifs] = useState<Notification[]>([])
//    const [meetingNotifs, setMeetingNotifs] = useState<Meeting[]>([])
//    const [localEventNotifs, setLocalEventNotifs] = useState<LocalEventNotification[]>([])
//    const [showNotifications, setShowNotifications] = useState(false)
//    const [expandedNotifications, setExpandedNotifications] = useState(false)
//    const notifPanelRef = useRef<HTMLDivElement>(null)

//    const [currentUserId, setCurrentUserId] = useState("")
//    const [openLogout, setOpenLogout] = useState(false)
//    const [userRole, setUserRole] = useState("")

//    const [reminderToast, setReminderToast] = useState<{ title: string; body: string } | null>(null)

//    const getMeetingReadIds = () => {
//        const userId = localStorage.getItem("userId")
//        return JSON.parse(localStorage.getItem(`readMeetings_${userId}`) || "[]")
//    }

//    const saveMeetingReadIds = (ids: string[]) => {
//        const userId = localStorage.getItem("userId")
//        localStorage.setItem(`readMeetings_${userId}`, JSON.stringify(ids))
//    }

//    const formatDateOnly = (dateString?: string) => {
//        if (!dateString) return ""
//        return new Date(dateString).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" })
//    }

//    const formatTimeOnly = (dateString?: string) => {
//        if (!dateString) return ""
//        return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//    }

//    const formatEventText = (n: LocalEventNotification) => {
//        const baseDate = n.eventDate || n.createdAt
//        const date = new Date(baseDate)

//        const today = new Date()
//        const yesterday = new Date()
//        yesterday.setDate(today.getDate() - 1)

//        let dayLabel = date.toLocaleDateString([], {
//            day: "2-digit",
//            month: "short",
//            year: "numeric",
//        })

//        if (date.toDateString() === today.toDateString()) {
//            dayLabel = "Today"
//        } else if (date.toDateString() === yesterday.toDateString()) {
//            dayLabel = "Yesterday"
//        }

//        const timeLabel = n.eventTime || date.toLocaleTimeString([], {
//            hour: "2-digit",
//            minute: "2-digit",
//        })

//        return `Reminder: "${n.eventTitle || "Event"}" at ${timeLabel} (${dayLabel})`
//    }

//    const cleanUUID = (text: string) =>
//        (text || "").replace(/^[0-9a-fA-F-]{36}\s*/, "").trim()

//    const getReadIds = () => {
//        if (typeof window === "undefined") return []
//        const userId = localStorage.getItem("userId")
//        return JSON.parse(localStorage.getItem(`readNotifications_${userId}`) || "[]")
//    }

//    const saveReadIds = (ids: number[]) => {
//        const userId = localStorage.getItem("userId")
//        localStorage.setItem(`readNotifications_${userId}`, JSON.stringify(ids))
//    }

//    useEffect(() => {
//        const handleClickOutside = (e: MouseEvent) => {
//            if (notifPanelRef.current && !notifPanelRef.current.contains(e.target as Node)) {
//                setShowNotifications(false)
//            }
//        }

//        if (showNotifications) document.addEventListener("mousedown", handleClickOutside)
//        return () => document.removeEventListener("mousedown", handleClickOutside)
//    }, [showNotifications])

//    useEffect(() => {
//        setMounted(true)
//    }, [])

//    useEffect(() => {
//        const role = localStorage.getItem("role") || ""
//        setUserRole(role)
//    }, [])

//    useEffect(() => {
//        const id = localStorage.getItem("userId") || ""
//        setCurrentUserId(id)
//        const storedName = localStorage.getItem("name") || ""
//        setName(storedName)
//    }, [])

//    useEffect(() => {
//        const role = (localStorage.getItem("role") || "").toLowerCase()
//        if (role !== "employee" && role !== "professional") return

//        const connection = new signalR.HubConnectionBuilder()
//            .withUrl("https://steadfast-warmth-production-64c8.up.railway.app/chatHub", {
//                accessTokenFactory: () => localStorage.getItem("token") || "",
//            })
//            .withAutomaticReconnect()
//            .build()

//        connection.start().catch((err) => console.error("SignalR Error:", err))

//        connection.on("ReceiveNotification", (data) => {
//            const notifType = data.type || "info"

//            if (notifType === "announcement") {
//                const hrName = cleanUUID(data.createdByName || data.fromUserName || "HR")
//                const announcementTitle = cleanUUID(data.title || "Announcement")

//                setChatNotifs((prev) => [
//                    {
//                        id: Date.now(),
//                        fromUserId: data.fromUserId || "system",
//                        fromUserName: hrName,
//                        toUserId: currentUserId,
//                        content: `${hrName} shared an announcement: ${announcementTitle}`,
//                        status: "info",
//                        type: "announcement",
//                        isRead: false,
//                        createdAt: data.createdAt || new Date().toISOString(),
//                        title: announcementTitle,
//                    },
//                    ...prev,
//                ])
//                return
//            }

//            const cleanTitle = cleanUUID(data.title || "")
//            const startTime = data.startTime || data.dateTime || null

//            const formattedDate = startTime
//                ? new Date(startTime).toLocaleDateString([], {
//                    day: "2-digit",
//                    month: "short",
//                    year: "numeric",
//                })
//                : ""

//            const formattedTime = startTime
//                ? new Date(startTime).toLocaleTimeString([], {
//                    hour: "2-digit",
//                    minute: "2-digit",
//                })
//                : ""

//            setChatNotifs((prev) => [
//                {
//                    id: Date.now(),
//                    fromUserId: data.fromUserId || "system",
//                    fromUserName: data.createdByName || "HR",
//                    toUserId: currentUserId,
//                    content: `${cleanTitle} scheduled on ${formattedDate} at ${formattedTime}`,
//                    meetingLink: data.meetingLink || data.link || null,
//                    status: "info",
//                    type: "meeting",
//                    isRead: false,
//                    createdAt: data.createdAt || new Date().toISOString(),
//                },
//                ...prev,
//            ])
//        })

//        return () => {
//            connection.stop()
//        }
//    }, [currentUserId])

//    useEffect(() => {
//        const loadProfile = async () => {
//            try {
//                const token = localStorage.getItem("token")
//                if (!token) return

//                const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Account/profile", {
//                    headers: { Authorization: `Bearer ${token}` },
//                })

//                if (res.status === 401) {
//                    localStorage.removeItem("token")
//                    window.location.href = "/"
//                    return
//                }

//                if (!res.ok) return

//                const data = await res.json()
//                const finalName = data.name || data.fullName || localStorage.getItem("name") || ""

//                setName(finalName)
//                localStorage.setItem("name", finalName)
//                setEmail(data.email || "")
//                setNickname(data.nickname || "")
//                setMobile(data.mobile || "")
//                setCountry(data.country || "")
//                setGender(data.gender || "")
//                setImage(data.profileImage || null)
//            } catch (err) {
//                console.error("Profile load error:", err)
//            }
//        }

//        loadProfile()
//    }, [])

//    const fetchNotifications = async () => {
//        try {
//            const res = await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/${currentUserId}`
//            )
//            const data = await res.json()
//            const role = localStorage.getItem("role")
//            const filtered = role === "employee"
//                ? data
//                : data.filter((n: Notification) => n.type !== "announcement")
//            const readIds = getReadIds()

//            const buildMessage = (n: Notification) => {
//                if (n.type === "meeting") {
//                    const date = new Date(n.createdAt || "")
//                    const formattedDate = date.toLocaleDateString([], {
//                        day: "2-digit",
//                        month: "short",
//                        year: "numeric",
//                    })
//                    const formattedTime = date.toLocaleTimeString([], {
//                        hour: "2-digit",
//                        minute: "2-digit",
//                    })

//                    return `${cleanUUID(n.content)} • ${formattedDate} at ${formattedTime}`
//                }

//                return cleanUUID(n.content)
//            }

//            setChatNotifs(
//                filtered.map((n: Notification) => ({
//                    ...n,
//                    fromUserName: cleanUUID(n.fromUserName),
//                    content: buildMessage(n),
//                    createdAt: n.createdAt || new Date().toISOString(),
//                    isRead: readIds.includes(n.id) ? true : n.isRead,
//                }))
//            )
//        } catch {
//            setChatNotifs([])
//        }
//    }

//    const fetchMeetings = async () => {
//        try {
//            const token = localStorage.getItem("token")
//            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/meeting/my-meetings", {
//                headers: { Authorization: `Bearer ${token}` },
//            })
//            const data = await res.json()
//            const now = new Date()
//            const upcoming = data.filter((m: Meeting) => new Date(m.startTime) > now)
//            const readIds = getMeetingReadIds()

//            if (userRole === "hr") {
//                setMeetingNotifs([])
//                return
//            }

//            setMeetingNotifs(upcoming.map((m: Meeting) => ({
//                ...m,
//                isRead: readIds.includes(m.id),
//                createdAt: m.createdAt || m.startTime,
//                createdByName: m.createdByName || "HR",
//            })))
//        } catch {
//            setMeetingNotifs([])
//        }
//    }

//    useEffect(() => {
//        if (!currentUserId) return

//        fetchNotifications()
//        fetchMeetings()

//        const interval = setInterval(() => {
//            fetchNotifications()
//            fetchMeetings()
//        }, 3000)

//        return () => clearInterval(interval)
//    }, [currentUserId, userRole])

//    const loadGlobalNotifications = () => {
//        const currentUser = localStorage.getItem("userId")
//        const data = parseStoredNotifications()
//        const filtered = data.filter((n) => n.userId === currentUser)
//        setLocalEventNotifs(filtered)
//    }

//    useEffect(() => {
//        loadGlobalNotifications()

//        const handler = () => loadGlobalNotifications()
//        window.addEventListener("new-notification", handler)

//        return () => window.removeEventListener("new-notification", handler)
//    }, [])

//    useEffect(() => {
//        const interval = setInterval(() => {
//            const now = Date.now()
//            const currentUser = localStorage.getItem("userId")
//            const data = parseStoredNotifications()

//            let changed = false
//            const updated = data.map((n) => {
//                if (n.userId !== currentUser) return n
//                if (!isReminderNotification(n)) return n

//                if (!n.triggered_at && n.triggerTime_at && now >= n.triggerTime_at) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", `Reminder: "${n.eventTitle || "Event"}" is happening ${reminderLabel(0)}.`)
//                    return { ...n, triggered_at: true, isRead: false }
//                }

//                if (!n.triggered_5 && n.triggerTime_5 && now >= n.triggerTime_5) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", `Reminder: "${n.eventTitle || "Event"}" starts ${reminderLabel(5)}.`)
//                    return { ...n, triggered_5: true, isRead: false }
//                }

//                if (!n.triggered_10 && n.triggerTime_10 && now >= n.triggerTime_10) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", `Reminder: "${n.eventTitle || "Event"}" starts ${reminderLabel(10)}.`)
//                    return { ...n, triggered_10: true, isRead: false }
//                }

//                if (n.triggerTime && !n.triggered && now >= n.triggerTime) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", n.text || `Reminder: "${n.eventTitle || "Event"}" is coming up.`)
//                    return { ...n, triggered: true, isRead: false }
//                }

//                return n
//            })

//            if (changed) {
//                writeStoredNotifications(updated)
//                setLocalEventNotifs(updated.filter((n) => n.userId === currentUser))
//            }
//        }, 30000)

//        return () => clearInterval(interval)
//    }, [])

//    const showReminderToast = (toastTitle: string, body: string) => {
//        setReminderToast({ title: toastTitle, body })
//        setTimeout(() => setReminderToast(null), 6000)
//    }

//    const handleChatRequest = async (notifId: number, status: "accepted" | "rejected") => {
//        try {
//            await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/${notifId}`,
//                {
//                    method: "PUT",
//                    headers: { "Content-Type": "application/json" },
//                    body: JSON.stringify(status),
//                }
//            )

//            if (status === "accepted") {
//                await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/chat/create", {
//                    method: "POST",
//                    headers: { "Content-Type": "application/json" },
//                    body: JSON.stringify({ notificationId: notifId }),
//                })
//                window.dispatchEvent(new Event("chat-updated"))
//            }

//            const original = chatNotifs.find((n) => n.id === notifId)
//            if (original) {
//                const myName = localStorage.getItem("name") || "Someone"
//                const statusMsg =
//                    status === "accepted"
//                        ? `✅ ${myName} accepted your chat request`
//                        : `❌ ${myName} rejected your chat request`

//                await fetch(
//                    "https://steadfast-warmth-production-64c8.up.railway.app/api/notifications",
//                    {
//                        method: "POST",
//                        headers: { "Content-Type": "application/json" },
//                        body: JSON.stringify({
//                            fromUserId: currentUserId,
//                            fromUserName: myName,
//                            toUserId: original.fromUserId,
//                            content: statusMsg,
//                            type: status === "accepted" ? "chat_accepted" : "chat_rejected",
//                            status: "info",
//                            isRead: false,
//                        }),
//                    }
//                )
//            }

//            setChatNotifs((prev) => prev.filter((n) => n.id !== notifId))
//            fetchNotifications()
//        } catch (err) {
//            console.error("Chat request error:", err)
//        }
//    }

//    const markAllRead = async () => {
//        try {
//            await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/mark-read/${currentUserId}`,
//                { method: "PUT" }
//            )

//            setChatNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })))
//            setMeetingNotifs((prev) => prev.map((m) => ({ ...m, isRead: true })))
//            saveMeetingReadIds(meetingNotifs.map((m) => m.id))
//            saveReadIds(chatNotifs.map((n) => n.id))

//            const currentUser = localStorage.getItem("userId")
//            const allStored = parseStoredNotifications()
//            const updatedStored = allStored.map((item) =>
//                item.userId === currentUser && isDisplayableLocalNotification(item)
//                    ? { ...item, isRead: true }
//                    : item
//            )

//            writeStoredNotifications(updatedStored)
//            setLocalEventNotifs(updatedStored.filter((item) => item.userId === currentUser))
//        } catch (err) {
//            console.error("Mark read error:", err)
//        }
//    }

//    const saveProfile = async () => {
//        try {
//            const token = localStorage.getItem("token")
//            await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Account/profile", {
//                method: "PUT",
//                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//                body: JSON.stringify({ name, nickname, gender, country, mobile, profileImage: image }),
//            })
//            setOpenProfile(false)
//        } catch (err) {
//            console.error("Profile save error:", err)
//        }
//    }

//    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
//        const file = e.target.files?.[0]
//        if (!file) return

//        const reader = new FileReader()
//        reader.onloadend = () => setImage(reader.result as string)
//        reader.readAsDataURL(file)
//    }

//    const initials = name
//        ? name.split(" ").map((part) => part[0]).join("").toUpperCase()
//        : "U"

//    const unreadChatCount = chatNotifs.filter((n) => !n.isRead).length
//    const unreadMeetingCount = meetingNotifs.filter((m) => !m.isRead).length
//    const unreadLocalEventCount = localEventNotifs.filter((n) => isDisplayableLocalNotification(n) && !n.isRead).length
//    const totalCount = unreadChatCount + unreadMeetingCount + unreadLocalEventCount

//    const buildGroupedNotifs = () => {
//        let allNotifs: any[] = [
//            ...localEventNotifs.filter(isDisplayableLocalNotification),
//            ...chatNotifs,
//            ...meetingNotifs.map((m) => ({
//                ...m,
//                type: "meeting",
//                content: m.title,
//                createdAt: m.createdAt || m.startTime,
//                fromUserName: `HR (${m.createdByName || "HR"})`,
//                createdByName: m.createdByName || "HR",
//                meetingLink: m.meetingLink,
//                eventDate: m.startTime,
//            })),
//        ].sort((a: any, b: any) =>
//            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
//        )

//        if (!expandedNotifications) allNotifs = allNotifs.slice(0, 5)

//        const today = new Date()
//        const yesterday = new Date()
//        yesterday.setDate(today.getDate() - 1)

//        const getGroupLabel = (dateStr: string) => {
//            const d = new Date(dateStr)
//            if (d.toDateString() === today.toDateString()) return "Today"
//            if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
//            return formatDateOnly(dateStr)
//        }

//        const grouped: Record<string, any[]> = {}
//        allNotifs.forEach((n: any) => {
//            const label = getGroupLabel(n.createdAt)
//            if (!grouped[label]) grouped[label] = []
//            grouped[label].push(n)
//        })

//        return grouped
//    }

//    const getNotifIcon = (n: any) => {
//        if (n.type === "chat_request") return "💬"
//        if (n.type === "chat_accepted") return "✅"
//        if (n.type === "chat_rejected") return "❌"
//        if (n.type === "announcement") return "📢"
//        if (n.type === "event_created") return "🆕"
//        if (n.type === "event_updated") return "✏️"
//        if (n.type === "event_deleted") return "🗑️"
//        if (n.eventDate || n.type === "calendar") return "⏰"
//        if (n.type === "meeting") return "📅"
//        return "🔔"
//    }

//    const getNotifAccent = (n: any) => {
//        if (n.type === "chat_accepted") return "green"
//        if (n.type === "chat_rejected") return "red"
//        if (n.type === "event_deleted") return "red"
//        if (n.type === "event_created") return "green"
//        if (n.type === "event_updated") return "blue"
//        if (n.type === "chat_request") return "purple"
//        if (n.type === "announcement") return "purple"
//        if (n.type === "meeting" || (n.content || "").includes("📅")) return "blue"
//        if (n.eventDate || n.type === "calendar") return "amber"
//        return "gray"
//    }

//    const hasNotifications = chatNotifs.length > 0 ||
//        meetingNotifs.length > 0 ||
//        localEventNotifs.some(isDisplayableLocalNotification)

//    if (!mounted) return null

//    const grouped = buildGroupedNotifs()

//    return (
//        <>
//            {reminderToast && (
//                <div
//                    className="
//                        fixed top-5 right-5 z-[9999]
//                        bg-amber-500 text-white
//                        rounded-2xl shadow-2xl
//                        px-5 py-4 max-w-sm
//                        flex items-start gap-3
//                        animate-in slide-in-from-top-2 duration-300
//                    "
//                >
//                    <span className="text-2xl">⏰</span>
//                    <div>
//                        <p className="font-semibold text-sm">{reminderToast.title}</p>
//                        <p className="text-xs opacity-90 mt-0.5">{reminderToast.body}</p>
//                    </div>
//                    <button onClick={() => setReminderToast(null)} className="ml-auto text-white/70 hover:text-white">
//                        <X className="h-4 w-4" />
//                    </button>
//                </div>
//            )}

//            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">
//                <div className="flex items-center gap-3">
//                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
//                        <Menu className="h-5 w-5" />
//                    </Button>
//                    <h1 className="font-semibold">{title}</h1>
//                </div>

//                <div className="flex items-center gap-2">
//                    <ThemeToggle />

//                    <div className="relative" ref={notifPanelRef}>
//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            className="relative"
//                            onClick={async () => {
//                                const opening = !showNotifications
//                                setShowNotifications(opening)
//                                if (opening) await markAllRead()
//                            }}
//                        >
//                            <Bell className="h-4 w-4" />
//                            {totalCount > 0 && (
//                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold px-1 rounded-full flex items-center justify-center leading-none">
//                                    {totalCount > 99 ? "99+" : totalCount}
//                                </span>
//                            )}
//                        </Button>

//                        {showNotifications && (
//                            <div
//                                className="
//                                    absolute right-0 top-[calc(100%+8px)]
//                                    w-[400px]
//                                    bg-white dark:bg-[#0d1117]
//                                    border border-gray-200 dark:border-white/10
//                                    rounded-2xl shadow-2xl z-50
//                                    flex flex-col overflow-hidden
//                                    max-h-[85vh]
//                                "
//                                style={{ boxShadow: "0 20px 60px -10px rgba(0,0,0,0.18), 0 4px 16px -4px rgba(0,0,0,0.12)" }}
//                            >
//                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/8 bg-white dark:bg-[#0d1117]">
//                                    <div className="flex items-center gap-2.5">
//                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
//                                            <Bell className="h-3.5 w-3.5 text-white" />
//                                        </div>
//                                        <div>
//                                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">Notifications</h4>
//                                            {totalCount > 0 && (
//                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">{totalCount} unread</p>
//                                            )}
//                                        </div>
//                                    </div>
//                                    <button
//                                        onClick={markAllRead}
//                                        className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
//                                    >
//                                        <CheckCheck className="h-3 w-3" />
//                                        Mark all read
//                                    </button>
//                                </div>

//                                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
//                                    {hasNotifications ? (
//                                        Object.keys(grouped).length > 0 ? (
//                                            Object.keys(grouped).map((group, gIdx) => (
//                                                <div key={gIdx}>
//                                                    <div className="flex items-center gap-3 px-5 pt-4 pb-2">
//                                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">{group}</span>
//                                                        <div className="flex-1 h-px bg-gray-100 dark:bg-white/6" />
//                                                    </div>

//                                                    {grouped[group].map((n: any, i: number) => {
//                                                        const isUnread = !n.isRead
//                                                        const accent = getNotifAccent(n)
//                                                        const icon = getNotifIcon(n)
//                                                        const isMeeting = n.type === "meeting" || (n.content || "").includes("📅")
//                                                        const isReminder = isReminderNotification(n)
//                                                        const isEventActivity = ["event_created", "event_updated", "event_deleted"].includes(n.type)
//                                                        const isChatRequest = n.type === "chat_request" && n.status === "pending"

//                                                        const accentMap: Record<string, string> = {
//                                                            blue: "bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400",
//                                                            amber: "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400",
//                                                            green: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
//                                                            red: "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400",
//                                                            purple: "bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400",
//                                                            gray: "bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-gray-400",
//                                                        }

//                                                        const dotMap: Record<string, string> = {
//                                                            blue: "bg-blue-500",
//                                                            amber: "bg-amber-500",
//                                                            green: "bg-emerald-500",
//                                                            red: "bg-red-500",
//                                                            purple: "bg-purple-500",
//                                                            gray: "bg-gray-400",
//                                                        }

//                                                        const senderName = (() => {
//                                                            if (isEventActivity || isReminder) return "Events"

//                                                            if (n.type === "meeting") {
//                                                                const actualName = cleanUUID(n.createdByName || n.fromUserName || "")
//                                                                if (!actualName || actualName.toLowerCase() === "hr") return "HR"
//                                                                return `HR (${actualName})`
//                                                            }

//                                                            return cleanUUID(n.fromUserName || "")
//                                                        })()

//                                                        const rawContent: string = n.content || ""
//                                                        const eventMessage = isReminder
//                                                            ? formatEventText(n)
//                                                            : isEventActivity
//                                                                ? buildEventNotificationMessage(n)
//                                                                : rawContent

//                                                        return (
//                                                            <div
//                                                                key={i}
//                                                                className={`
//                                                                    group relative mx-3 mb-1 rounded-xl px-3 py-3 cursor-pointer
//                                                                    transition-all duration-150
//                                                                    ${isUnread
//                                                                        ? "bg-indigo-50/70 dark:bg-indigo-500/8 hover:bg-indigo-50 dark:hover:bg-indigo-500/12"
//                                                                        : "hover:bg-gray-50 dark:hover:bg-white/4"
//                                                                    }
//                                                                `}
//                                                            >
//                                                                <div className="flex gap-3">
//                                                                    <div className="flex-shrink-0 mt-0.5">
//                                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-sm ${accentMap[accent]}`}>
//                                                                            {icon}
//                                                                        </div>
//                                                                    </div>

//                                                                    <div className="flex-1 min-w-0">
//                                                                        <div className="flex items-center justify-between gap-2 mb-0.5">
//                                                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
//                                                                                {senderName || (isMeeting ? "Meeting" : isReminder ? "Reminder" : "Notification")}
//                                                                            </span>
//                                                                            <div className="flex items-center gap-1.5 flex-shrink-0">
//                                                                                <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
//                                                                                    {formatTimeOnly(n.createdAt)}
//                                                                                </span>
//                                                                                {isUnread && (
//                                                                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotMap[accent]}`} />
//                                                                                )}
//                                                                            </div>
//                                                                        </div>

//                                                                        <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-snug line-clamp-2">
//                                                                            {isMeeting
//                                                                                ? `${cleanUUID(n.content).replace("📅", "").trim()} at ${formatTimeOnly(n.eventDate)} (${formatDateOnly(n.eventDate)})`
//                                                                                : eventMessage}
//                                                                        </p>

//                                                                        <div className="flex items-center justify-between mt-1.5 gap-2 flex-wrap">
//                                                                            <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
//                                                                                <Clock className="h-2.5 w-2.5" />
//                                                                                {isReminder || isEventActivity
//                                                                                    ? formatEventDateTime(n.eventDate, n.eventTime) || formatDateOnly(n.createdAt)
//                                                                                    : formatDateOnly(n.createdAt)}
//                                                                            </div>

//                                                                            {isChatRequest && (
//                                                                                <div className="flex items-center gap-1.5">
//                                                                                    <button
//                                                                                        onClick={(e) => {
//                                                                                            e.stopPropagation()
//                                                                                            handleChatRequest(n.id, "accepted")
//                                                                                        }}
//                                                                                        className="
//                                                                                            flex items-center gap-1 text-[11px] font-semibold
//                                                                                            bg-emerald-500 hover:bg-emerald-600 text-white
//                                                                                            px-2.5 py-1 rounded-lg transition-colors shadow-sm
//                                                                                        "
//                                                                                    >
//                                                                                        <Check className="h-2.5 w-2.5" />
//                                                                                        Accept
//                                                                                    </button>
//                                                                                    <button
//                                                                                        onClick={(e) => {
//                                                                                            e.stopPropagation()
//                                                                                            handleChatRequest(n.id, "rejected")
//                                                                                        }}
//                                                                                        className="
//                                                                                            flex items-center gap-1 text-[11px] font-semibold
//                                                                                            bg-red-500 hover:bg-red-600 text-white
//                                                                                            px-2.5 py-1 rounded-lg transition-colors shadow-sm
//                                                                                        "
//                                                                                    >
//                                                                                        <X className="h-2.5 w-2.5" />
//                                                                                        Reject
//                                                                                    </button>
//                                                                                </div>
//                                                                            )}

//                                                                            {(isMeeting || n.meetingLink) && n.meetingLink && (
//                                                                                <button
//                                                                                    onClick={(e) => {
//                                                                                        e.stopPropagation()
//                                                                                        window.open(n.meetingLink, "_blank")
//                                                                                    }}
//                                                                                    className="
//                                                                                        flex items-center gap-1 text-[11px] font-semibold
//                                                                                        bg-blue-600 hover:bg-blue-700 text-white
//                                                                                        px-2.5 py-1 rounded-lg transition-colors shadow-sm
//                                                                                    "
//                                                                                >
//                                                                                    <Video className="h-2.5 w-2.5" />
//                                                                                    Join
//                                                                                </button>
//                                                                            )}
//                                                                        </div>
//                                                                    </div>
//                                                                </div>
//                                                            </div>
//                                                        )
//                                                    })}
//                                                </div>
//                                            ))
//                                        ) : (
//                                            <EmptyState />
//                                        )
//                                    ) : (
//                                        <EmptyState />
//                                    )}
//                                    <div className="h-2" />
//                                </div>

//                                <div className="border-t border-gray-100 dark:border-white/8 bg-white dark:bg-[#0d1117] sticky bottom-0">
//                                    <button
//                                        onClick={() => setExpandedNotifications((prev) => !prev)}
//                                        className="w-full px-5 py-3 text-[12px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/8 transition-colors text-center flex items-center justify-center gap-1.5"
//                                    >
//                                        {expandedNotifications ? (
//                                            <>
//                                                <span>Show less</span>
//                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
//                                            </>
//                                        ) : (
//                                            <>
//                                                <span>View all notifications</span>
//                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
//                                            </>
//                                        )}
//                                    </button>
//                                </div>
//                            </div>
//                        )}
//                    </div>

//                    <DropdownMenu>
//                        <DropdownMenuTrigger asChild>
//                            <Button variant="ghost" className="gap-2">
//                                <Avatar className="h-7 w-7">
//                                    {image ? <AvatarImage src={image} /> : <AvatarFallback>{initials}</AvatarFallback>}
//                                </Avatar>
//                                {name || "User"}
//                            </Button>
//                        </DropdownMenuTrigger>
//                        <DropdownMenuContent align="end">
//                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
//                                <User className="mr-2 h-4 w-4" /> Profile
//                            </DropdownMenuItem>
//                            <DropdownMenuSeparator />
//                            <DropdownMenuItem onClick={() => setOpenLogout(true)}>
//                                <LogOut className="mr-2 h-4 w-4" /> Logout
//                            </DropdownMenuItem>
//                        </DropdownMenuContent>
//                    </DropdownMenu>
//                </div>
//            </header>

//            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
//                <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border border-border bg-white text-black dark:bg-gradient-to-br dark:from-[#020617] dark:to-[#0f172a] dark:text-white shadow-2xl">
//                    <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-100 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 border-border dark:border-white/10">
//                        <div className="flex items-center gap-3">
//                            <Button variant="ghost" size="icon" onClick={() => setOpenProfile(false)} className="hover:bg-black/10 dark:hover:bg-white/20">
//                                <ArrowLeft className="h-4 w-4" />
//                            </Button>
//                            <h2 className="text-lg font-semibold tracking-wide">Profile Settings</h2>
//                        </div>
//                    </div>

//                    <div className="p-6 space-y-6">
//                        <div className="flex items-center gap-5">
//                            <label className="cursor-pointer relative group">
//                                <Avatar className="h-20 w-20 border-2 border-indigo-500 shadow-lg">
//                                    {image
//                                        ? <AvatarImage src={image} />
//                                        : <AvatarFallback className="text-lg font-bold bg-indigo-600 text-white">{initials}</AvatarFallback>
//                                    }
//                                </Avatar>
//                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center text-white text-xs font-medium transition">Change</div>
//                                <input type="file" className="hidden" onChange={handleImageUpload} />
//                            </label>
//                            <div>
//                                <p className="text-lg font-semibold">{name}</p>
//                                <p className="text-sm text-muted-foreground">{email}</p>
//                            </div>
//                        </div>

//                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                            <div className="space-y-1">
//                                <Label>Full Name</Label>
//                                <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10 focus-visible:ring-indigo-500" />
//                            </div>
//                            <div className="space-y-1">
//                                <Label>Nick Name</Label>
//                                <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
//                            </div>
//                            <div className="md:col-span-2 space-y-2">
//                                <Label>Gender</Label>
//                                <div className="flex gap-3">
//                                    {["Male", "Female", "Other"].map((g) => (
//                                        <button
//                                            key={g}
//                                            type="button"
//                                            onClick={() => setGender(g)}
//                                            className={`px-4 py-2 rounded-lg border text-sm transition ${gender === g ? "bg-indigo-600 text-white border-indigo-500 shadow-md" : "bg-gray-100 dark:bg-white/5 border-border dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"}`}
//                                        >
//                                            {g}
//                                        </button>
//                                    ))}
//                                </div>
//                            </div>
//                            <div className="space-y-1">
//                                <Label>Mobile</Label>
//                                <Input value={mobile} onChange={(e) => setMobile(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
//                            </div>
//                            <div className="space-y-1">
//                                <Label>Country</Label>
//                                <Input value={country} onChange={(e) => setCountry(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
//                            </div>
//                            <div className="md:col-span-2 space-y-1">
//                                <Label>Email</Label>
//                                <Input value={email} disabled className="bg-gray-200 dark:bg-white/10 border-border dark:border-white/10 text-gray-500 dark:text-gray-400" />
//                            </div>
//                        </div>
//                    </div>

//                    <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-100 dark:bg-white/5 border-border dark:border-white/10">
//                        <Button variant="outline" onClick={() => setOpenProfile(false)} className="hover:bg-gray-200 dark:hover:bg-white/10">Cancel</Button>
//                        <Button onClick={saveProfile} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-lg">Save Changes</Button>
//                    </div>
//                </DialogContent>
//            </Dialog>

//            <Dialog open={openLogout} onOpenChange={setOpenLogout}>
//                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border border-border shadow-2xl">
//                    <div className="flex flex-col items-center justify-center px-6 pt-6 pb-4 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-[#020617]">
//                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
//                            <LogOut className="h-6 w-6 text-blue-600" />
//                        </div>
//                        <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">Log out of your account?</h2>
//                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">You&apos;ll need to sign in again to access your dashboard.</p>
//                    </div>
//                    <div className="flex gap-3 px-6 py-5 bg-white dark:bg-[#020617]">
//                        <button
//                            onClick={() => setOpenLogout(false)}
//                            className="w-1/2 py-2.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition"
//                        >
//                            Cancel
//                        </button>
//                        <button
//                            onClick={() => {
//                                localStorage.clear()
//                                window.location.href = "/"
//                            }}
//                            className="w-1/2 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition"
//                        >
//                            Log out
//                        </button>
//                    </div>
//                </DialogContent>
//            </Dialog>
//        </>
//    )
//}

//function EmptyState() {
//    return (
//        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
//            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center mb-3">
//                <Bell className="h-6 w-6 text-gray-300 dark:text-gray-600" />
//            </div>
//            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">All caught up!</p>
//            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">No new notifications right now</p>
//        </div>
//    )
//}

//export function registerCalendarReminder(
//    eventId: string,
//    eventTitle: string,
//    eventDateStr: string,
//    reminderType: string,
//    userId: string
//) {
//    const existing: LocalEventNotification[] = parseStoredNotifications()
//    const filtered = existing.filter((n) => n.eventId !== eventId || n.type !== "calendar")

//    const entry: LocalEventNotification = {
//        id: `${eventId}-calendar`,
//        eventId,
//        eventTitle,
//        userId,
//        type: "calendar",
//        createdAt: new Date().toISOString(),
//        isRead: false,
//        eventDate: eventDateStr,
//        triggered_at: false,
//        triggered_5: false,
//        triggered_10: false,
//    }

//    const types = reminderType.split("+")

//    if (types.includes("at")) {
//        entry.triggerTime_at = calcTriggerTime(eventDateStr, 0)
//    }
//    if (types.includes("5")) {
//        entry.triggerTime_5 = calcTriggerTime(eventDateStr, 5)
//    }
//    if (types.includes("10")) {
//        entry.triggerTime_10 = calcTriggerTime(eventDateStr, 10)
//    }

//    filtered.push(entry)
//    writeStoredNotifications(filtered)
//    window.dispatchEvent(new Event("new-notification"))
//}

//export function registerLegacyReminder(
//    eventId: string,
//    eventTitle: string,
//    eventDateStr: string,
//    reminderMinutes: number,
//    userId: string
//) {
//    registerCalendarReminder(
//        eventId,
//        eventTitle,
//        eventDateStr,
//        reminderMinutes === 0 ? "at" : String(reminderMinutes),
//        userId
//    )
//}








//"use client"

//import { type ChangeEvent, useEffect, useRef, useState } from "react"
//import { Bell, Menu, User, Video, ArrowLeft, LogOut, CheckCheck, Clock, Check, X } from "lucide-react"
//import * as signalR from "@microsoft/signalr"

//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import {
//    Dialog,
//    DialogContent,
//} from "@/components/ui/dialog"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"

//interface DashboardHeaderProps {
//    onMenuClick: () => void
//    title: string
//}

//interface Notification {
//    id: number
//    fromUserId: string
//    fromUserName: string
//    toUserId: string
//    content: string
//    status: string
//    isRead: boolean
//    createdAt?: string
//    type: string
//    meetingLink?: string | null
//    title?: string
//}

//interface Meeting {
//    id: string
//    title: string
//    startTime: string
//    meetingLink: string
//    createdByName?: string
//    isRead?: boolean
//    createdAt?: string
//}

//interface LocalEventNotification {
//    id: string | number
//    userId: string
//    type: string
//    isRead: boolean
//    createdAt: string
//    eventId?: string
//    eventTitle?: string
//    eventDate?: string
//    eventTime?: string
//    location?: string
//    message?: string
//    text?: string
//    triggerTime?: number
//    triggered?: boolean
//    triggerTime_at?: number
//    triggerTime_5?: number
//    triggerTime_10?: number
//    triggered_at?: boolean
//    triggered_5?: boolean
//    triggered_10?: boolean
//}

//function calcTriggerTime(eventDateStr: string, reminderMinutes: number): number {
//    const eventMs = new Date(eventDateStr).getTime()
//    return eventMs - reminderMinutes * 60 * 1000
//}

//function reminderLabel(minutes: number): string {
//    if (minutes === 0) return "at event time"
//    return `${minutes} minute${minutes > 1 ? "s" : ""} before`
//}

//function parseStoredNotifications(): LocalEventNotification[] {
//    if (typeof window === "undefined") return []

//    try {
//        return JSON.parse(localStorage.getItem("globalNotifications") || "[]")
//    } catch {
//        return []
//    }
//}

//function writeStoredNotifications(items: LocalEventNotification[]) {
//    localStorage.setItem("globalNotifications", JSON.stringify(items))
//}

//function isTriggeredReminder(notification: LocalEventNotification) {
//    return Boolean(
//        notification.triggered ||
//        notification.triggered_at ||
//        notification.triggered_5 ||
//        notification.triggered_10
//    )
//}

//function isReminderNotification(notification: LocalEventNotification) {
//    return Boolean(
//        notification.type === "calendar" ||
//        notification.triggerTime ||
//        notification.triggerTime_at ||
//        notification.triggerTime_5 ||
//        notification.triggerTime_10
//    )
//}

//function isDisplayableLocalNotification(notification: LocalEventNotification) {
//    if (isReminderNotification(notification)) return isTriggeredReminder(notification)
//    return true
//}

//function formatEventDateTime(date?: string, time?: string) {
//    if (!date && !time) return ""

//    const datePart = date
//        ? new Date(date).toLocaleDateString([], {
//            day: "2-digit",
//            month: "short",
//            year: "numeric",
//        })
//        : ""

//    if (datePart && time) return `${datePart} at ${time}`
//    return datePart || time || ""
//}

//function buildEventNotificationMessage(notification: LocalEventNotification) {
//    const details = formatEventDateTime(notification.eventDate, notification.eventTime)
//    const title = notification.eventTitle || "Event"

//    if (notification.message) return notification.message
//    if (notification.text) return notification.text

//    switch (notification.type) {
//        case "event_created":
//            return `${title} has been created${details ? ` for ${details}` : ""}.`
//        case "event_updated":
//            return `${title} has been updated${details ? ` to ${details}` : ""}.`
//        case "event_deleted":
//            return `${title} has been deleted${details ? ` from ${details}` : ""}.`
//        default:
//            return title
//    }
//}

//export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {
//    const [name, setName] = useState("")
//    const [mounted, setMounted] = useState(false)
//    const [email, setEmail] = useState("")
//    const [nickname, setNickname] = useState("")
//    const [mobile, setMobile] = useState("")
//    const [country, setCountry] = useState("")
//    const [gender, setGender] = useState("")
//    const [image, setImage] = useState<string | null>(null)
//    const [openProfile, setOpenProfile] = useState(false)

//    const [chatNotifs, setChatNotifs] = useState<Notification[]>([])
//    const [meetingNotifs, setMeetingNotifs] = useState<Meeting[]>([])
//    const [localEventNotifs, setLocalEventNotifs] = useState<LocalEventNotification[]>([])
//    const [showNotifications, setShowNotifications] = useState(false)
//    const [expandedNotifications, setExpandedNotifications] = useState(false)
//    const notifPanelRef = useRef<HTMLDivElement>(null)

//    const [currentUserId, setCurrentUserId] = useState("")
//    const [openLogout, setOpenLogout] = useState(false)
//    const [userRole, setUserRole] = useState("")

//    const [reminderToast, setReminderToast] = useState<{ title: string; body: string } | null>(null)

//    const getMeetingReadIds = () => {
//        const userId = localStorage.getItem("userId")
//        return JSON.parse(localStorage.getItem(`readMeetings_${userId}`) || "[]")
//    }

//    const saveMeetingReadIds = (ids: string[]) => {
//        const userId = localStorage.getItem("userId")
//        localStorage.setItem(`readMeetings_${userId}`, JSON.stringify(ids))
//    }

//    const formatDateOnly = (dateString?: string) => {
//        if (!dateString) return ""
//        return new Date(dateString).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" })
//    }

//    const formatTimeOnly = (dateString?: string) => {
//        if (!dateString) return ""
//        return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//    }

//    const formatEventText = (n: LocalEventNotification) => {
//        const baseDate = n.eventDate || n.createdAt
//        const date = new Date(baseDate)

//        const today = new Date()
//        const yesterday = new Date()
//        yesterday.setDate(today.getDate() - 1)

//        let dayLabel = date.toLocaleDateString([], {
//            day: "2-digit",
//            month: "short",
//            year: "numeric",
//        })

//        if (date.toDateString() === today.toDateString()) {
//            dayLabel = "Today"
//        } else if (date.toDateString() === yesterday.toDateString()) {
//            dayLabel = "Yesterday"
//        }

//        const timeLabel = n.eventTime || date.toLocaleTimeString([], {
//            hour: "2-digit",
//            minute: "2-digit",
//        })

//        return `Reminder: "${n.eventTitle || "Event"}" at ${timeLabel} (${dayLabel})`
//    }

//    const cleanUUID = (text: string) =>
//        (text || "").replace(/^[0-9a-fA-F-]{36}\s*/, "").trim()

//    const getReadIds = () => {
//        if (typeof window === "undefined") return []
//        const userId = localStorage.getItem("userId")
//        return JSON.parse(localStorage.getItem(`readNotifications_${userId}`) || "[]")
//    }

//    const saveReadIds = (ids: number[]) => {
//        const userId = localStorage.getItem("userId")
//        localStorage.setItem(`readNotifications_${userId}`, JSON.stringify(ids))
//    }

//    useEffect(() => {
//        const handleClickOutside = (e: MouseEvent) => {
//            if (notifPanelRef.current && !notifPanelRef.current.contains(e.target as Node)) {
//                setShowNotifications(false)
//            }
//        }

//        if (showNotifications) document.addEventListener("mousedown", handleClickOutside)
//        return () => document.removeEventListener("mousedown", handleClickOutside)
//    }, [showNotifications])

//    useEffect(() => {
//        setMounted(true)
//    }, [])

//    useEffect(() => {
//        const role = localStorage.getItem("role") || ""
//        setUserRole(role)
//    }, [])

//    useEffect(() => {
//        const id = localStorage.getItem("userId") || ""
//        setCurrentUserId(id)
//        const storedName = localStorage.getItem("name") || ""
//        setName(storedName)
//    }, [])

//    useEffect(() => {
//        const role = (localStorage.getItem("role") || "").toLowerCase()
//        if (role !== "employee" && role !== "professional") return

//        const connection = new signalR.HubConnectionBuilder()
//            .withUrl("https://steadfast-warmth-production-64c8.up.railway.app/chatHub", {
//                accessTokenFactory: () => localStorage.getItem("token") || "",
//            })
//            .withAutomaticReconnect()
//            .build()

//        connection.start().catch((err) => console.error("SignalR Error:", err))

//        connection.on("ReceiveNotification", (data) => {
//            const notifType = data.type || "info"

//            if (notifType === "announcement") {
//                const hrName = cleanUUID(data.createdByName || data.fromUserName || "HR")
//                const announcementTitle = cleanUUID(data.title || "Announcement")

//                setChatNotifs((prev) => [
//                    {
//                        id: Date.now(),
//                        fromUserId: data.fromUserId || "system",
//                        fromUserName: hrName,
//                        toUserId: currentUserId,
//                        content: `${hrName} shared an announcement: ${announcementTitle}`,
//                        status: "info",
//                        type: "announcement",
//                        isRead: false,
//                        createdAt: data.createdAt || new Date().toISOString(),
//                        title: announcementTitle,
//                    },
//                    ...prev,
//                ])
//                return
//            }

//            const cleanTitle = cleanUUID(data.title || "")
//            const startTime = data.startTime || data.dateTime || null

//            const formattedDate = startTime
//                ? new Date(startTime).toLocaleDateString([], {
//                    day: "2-digit",
//                    month: "short",
//                    year: "numeric",
//                })
//                : ""

//            const formattedTime = startTime
//                ? new Date(startTime).toLocaleTimeString([], {
//                    hour: "2-digit",
//                    minute: "2-digit",
//                })
//                : ""

//            setChatNotifs((prev) => [
//                {
//                    id: Date.now(),
//                    fromUserId: data.fromUserId || "system",
//                    fromUserName: data.createdByName || "HR",
//                    toUserId: currentUserId,
//                    content: `${cleanTitle} scheduled on ${formattedDate} at ${formattedTime}`,
//                    meetingLink: data.meetingLink || data.link || null,
//                    status: "info",
//                    type: "meeting",
//                    isRead: false,
//                    createdAt: data.createdAt || new Date().toISOString(),
//                },
//                ...prev,
//            ])
//        })

//        return () => {
//            connection.stop()
//        }
//    }, [currentUserId])

//    useEffect(() => {
//        const loadProfile = async () => {
//            try {
//                const token = localStorage.getItem("token")
//                if (!token) return

//                const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Account/profile", {
//                    headers: { Authorization: `Bearer ${token}` },
//                })

//                if (res.status === 401) {
//                    localStorage.removeItem("token")
//                    window.location.href = "/"
//                    return
//                }

//                if (!res.ok) return

//                const data = await res.json()
//                const finalName = data.name || data.fullName || localStorage.getItem("name") || ""

//                setName(finalName)
//                localStorage.setItem("name", finalName)
//                setEmail(data.email || "")
//                setNickname(data.nickname || "")
//                setMobile(data.mobile || "")
//                setCountry(data.country || "")
//                setGender(data.gender || "")
//                setImage(data.profileImage || null)
//            } catch (err) {
//                console.error("Profile load error:", err)
//            }
//        }

//        loadProfile()
//    }, [])

//    const fetchNotifications = async () => {
//        try {
//            const res = await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/${currentUserId}`
//            )
//            const data = await res.json()
//            const role = localStorage.getItem("role")
//            const filtered = role === "employee"
//                ? data
//                : data.filter((n: Notification) => n.type !== "announcement")
//            const readIds = getReadIds()

//            const buildMessage = (n: Notification) => {
//                if (n.type === "meeting") {
//                    const date = new Date(n.createdAt || "")
//                    const formattedDate = date.toLocaleDateString([], {
//                        day: "2-digit",
//                        month: "short",
//                        year: "numeric",
//                    })
//                    const formattedTime = date.toLocaleTimeString([], {
//                        hour: "2-digit",
//                        minute: "2-digit",
//                    })

//                    return `${cleanUUID(n.content)} • ${formattedDate} at ${formattedTime}`
//                }

//                return cleanUUID(n.content)
//            }

//            setChatNotifs(
//                filtered.map((n: Notification) => ({
//                    ...n,
//                    fromUserName: cleanUUID(n.fromUserName),
//                    content: buildMessage(n),
//                    createdAt: n.createdAt || new Date().toISOString(),
//                    isRead: readIds.includes(n.id) ? true : n.isRead,
//                }))
//            )
//        } catch {
//            setChatNotifs([])
//        }
//    }

//    const fetchMeetings = async () => {
//        try {
//            const token = localStorage.getItem("token")
//            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/meeting/my-meetings", {
//                headers: { Authorization: `Bearer ${token}` },
//            })
//            const data = await res.json()
//            const now = new Date()
//            const upcoming = data.filter((m: Meeting) => new Date(m.startTime) > now)
//            const readIds = getMeetingReadIds()

//            if (userRole === "hr") {
//                setMeetingNotifs([])
//                return
//            }

//            setMeetingNotifs(upcoming.map((m: Meeting) => ({
//                ...m,
//                isRead: readIds.includes(m.id),
//                createdAt: m.createdAt || m.startTime,
//                createdByName: m.createdByName || "HR",
//            })))
//        } catch {
//            setMeetingNotifs([])
//        }
//    }

//    useEffect(() => {
//        if (!currentUserId) return

//        fetchNotifications()
//        fetchMeetings()

//        const refresh = () => {
//            fetchNotifications()
//            fetchMeetings()
//        }

//        const interval = setInterval(() => {
//            fetchNotifications()
//            fetchMeetings()
//        }, 3000)

//        window.addEventListener("chat-updated", refresh)
//        window.addEventListener("request-updated", refresh)

//        return () => {
//            clearInterval(interval)
//            window.removeEventListener("chat-updated", refresh)
//            window.removeEventListener("request-updated", refresh)
//        }
//    }, [currentUserId, userRole])

//    const loadGlobalNotifications = () => {
//        const currentUser = localStorage.getItem("userId")
//        const data = parseStoredNotifications()
//        const filtered = data.filter((n) => n.userId === currentUser)
//        setLocalEventNotifs(filtered)
//    }

//    useEffect(() => {
//        loadGlobalNotifications()

//        const handler = () => loadGlobalNotifications()
//        window.addEventListener("new-notification", handler)

//        return () => window.removeEventListener("new-notification", handler)
//    }, [])

//    useEffect(() => {
//        const interval = setInterval(() => {
//            const now = Date.now()
//            const currentUser = localStorage.getItem("userId")
//            const data = parseStoredNotifications()

//            let changed = false
//            const updated = data.map((n) => {
//                if (n.userId !== currentUser) return n
//                if (!isReminderNotification(n)) return n

//                if (!n.triggered_at && n.triggerTime_at && now >= n.triggerTime_at) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", `Reminder: "${n.eventTitle || "Event"}" is happening ${reminderLabel(0)}.`)
//                    return { ...n, triggered_at: true, isRead: false }
//                }

//                if (!n.triggered_5 && n.triggerTime_5 && now >= n.triggerTime_5) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", `Reminder: "${n.eventTitle || "Event"}" starts ${reminderLabel(5)}.`)
//                    return { ...n, triggered_5: true, isRead: false }
//                }

//                if (!n.triggered_10 && n.triggerTime_10 && now >= n.triggerTime_10) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", `Reminder: "${n.eventTitle || "Event"}" starts ${reminderLabel(10)}.`)
//                    return { ...n, triggered_10: true, isRead: false }
//                }

//                if (n.triggerTime && !n.triggered && now >= n.triggerTime) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", n.text || `Reminder: "${n.eventTitle || "Event"}" is coming up.`)
//                    return { ...n, triggered: true, isRead: false }
//                }

//                return n
//            })

//            if (changed) {
//                writeStoredNotifications(updated)
//                setLocalEventNotifs(updated.filter((n) => n.userId === currentUser))
//            }
//        }, 30000)

//        return () => clearInterval(interval)
//    }, [])

//    const showReminderToast = (toastTitle: string, body: string) => {
//        setReminderToast({ title: toastTitle, body })
//        setTimeout(() => setReminderToast(null), 6000)
//    }

//    const handleChatRequest = async (notifId: number, status: "accepted" | "rejected") => {
//        try {
//            await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/${notifId}`,
//                {
//                    method: "PUT",
//                    headers: { "Content-Type": "application/json" },
//                    body: JSON.stringify(status),
//                }
//            )

//            if (status === "accepted") {
//                await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/chat/create", {
//                    method: "POST",
//                    headers: { "Content-Type": "application/json" },
//                    body: JSON.stringify({ notificationId: notifId }),
//                })
//                window.dispatchEvent(new Event("chat-updated"))
//            }

//            const original = chatNotifs.find((n) => n.id === notifId)
//            if (original) {
//                const myName = localStorage.getItem("name") || "Someone"
//                const statusMsg =
//                    status === "accepted"
//                        ? `${myName} accepted your chat request`
//                        : `${myName} rejected your chat request`

//                await fetch(
//                    "https://steadfast-warmth-production-64c8.up.railway.app/api/notifications",
//                    {
//                        method: "POST",
//                        headers: { "Content-Type": "application/json" },
//                        body: JSON.stringify({
//                            fromUserId: currentUserId,
//                            fromUserName: myName,
//                            toUserId: original.fromUserId,
//                            content: statusMsg,
//                            type: status === "accepted" ? "chat_accepted" : "chat_rejected",
//                            status: "info",
//                            isRead: false,
//                        }),
//                    }
//                )
//            }

//            setChatNotifs((prev) => prev.filter((n) => n.id !== notifId))
//            window.dispatchEvent(new Event("chat-updated"))
//            window.dispatchEvent(new Event("request-updated"))
//            await fetchNotifications()
//        } catch (err) {
//            console.error("Chat request error:", err)
//        }
//    }

//    const markAllRead = async () => {
//        try {
//            await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/mark-read/${currentUserId}`,
//                { method: "PUT" }
//            )

//            setChatNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })))
//            setMeetingNotifs((prev) => prev.map((m) => ({ ...m, isRead: true })))
//            saveMeetingReadIds(meetingNotifs.map((m) => m.id))
//            saveReadIds(chatNotifs.map((n) => n.id))

//            const currentUser = localStorage.getItem("userId")
//            const allStored = parseStoredNotifications()
//            const updatedStored = allStored.map((item) =>
//                item.userId === currentUser && isDisplayableLocalNotification(item)
//                    ? { ...item, isRead: true }
//                    : item
//            )

//            writeStoredNotifications(updatedStored)
//            setLocalEventNotifs(updatedStored.filter((item) => item.userId === currentUser))
//        } catch (err) {
//            console.error("Mark read error:", err)
//        }
//    }

//    const saveProfile = async () => {
//        try {
//            const token = localStorage.getItem("token")
//            await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Account/profile", {
//                method: "PUT",
//                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//                body: JSON.stringify({ name, nickname, gender, country, mobile, profileImage: image }),
//            })
//            setOpenProfile(false)
//        } catch (err) {
//            console.error("Profile save error:", err)
//        }
//    }

//    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
//        const file = e.target.files?.[0]
//        if (!file) return

//        const reader = new FileReader()
//        reader.onloadend = () => setImage(reader.result as string)
//        reader.readAsDataURL(file)
//    }

//    const initials = name
//        ? name.split(" ").map((part) => part[0]).join("").toUpperCase()
//        : "U"

//    const unreadChatCount = chatNotifs.filter((n) => !n.isRead).length
//    const unreadMeetingCount = meetingNotifs.filter((m) => !m.isRead).length
//    const unreadLocalEventCount = localEventNotifs.filter((n) => isDisplayableLocalNotification(n) && !n.isRead).length
//    const totalCount = unreadChatCount + unreadMeetingCount + unreadLocalEventCount

//    const buildGroupedNotifs = () => {
//        let allNotifs: any[] = [
//            ...localEventNotifs.filter(isDisplayableLocalNotification),
//            ...chatNotifs,
//            ...meetingNotifs.map((m) => ({
//                ...m,
//                type: "meeting",
//                content: m.title,
//                createdAt: m.createdAt || m.startTime,
//                fromUserName: `HR (${m.createdByName || "HR"})`,
//                createdByName: m.createdByName || "HR",
//                meetingLink: m.meetingLink,
//                eventDate: m.startTime,
//            })),
//        ].sort((a: any, b: any) =>
//            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
//        )

//        if (!expandedNotifications) allNotifs = allNotifs.slice(0, 5)

//        const today = new Date()
//        const yesterday = new Date()
//        yesterday.setDate(today.getDate() - 1)

//        const getGroupLabel = (dateStr: string) => {
//            const d = new Date(dateStr)
//            if (d.toDateString() === today.toDateString()) return "Today"
//            if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
//            return formatDateOnly(dateStr)
//        }

//        const grouped: Record<string, any[]> = {}
//        allNotifs.forEach((n: any) => {
//            const label = getGroupLabel(n.createdAt)
//            if (!grouped[label]) grouped[label] = []
//            grouped[label].push(n)
//        })

//        return grouped
//    }

//    const getNotifIcon = (n: any) => {
//        if (n.type === "chat_request") return "💬"
//        if (n.type === "chat_accepted") return "✅"
//        if (n.type === "chat_rejected") return "❌"
//        if (n.type === "announcement") return "📢"
//        if (n.type === "event_created") return "🆕"
//        if (n.type === "event_updated") return "✏️"
//        if (n.type === "event_deleted") return "🗑️"
//        if (n.eventDate || n.type === "calendar") return "⏰"
//        if (n.type === "meeting") return "📅"
//        return "🔔"
//    }

//    const getNotifAccent = (n: any) => {
//        if (n.type === "chat_accepted") return "green"
//        if (n.type === "chat_rejected") return "red"
//        if (n.type === "event_deleted") return "red"
//        if (n.type === "event_created") return "green"
//        if (n.type === "event_updated") return "blue"
//        if (n.type === "chat_request") return "purple"
//        if (n.type === "announcement") return "purple"
//        if (n.type === "meeting" || (n.content || "").includes("📅")) return "blue"
//        if (n.eventDate || n.type === "calendar") return "amber"
//        return "gray"
//    }

//    const hasNotifications = chatNotifs.length > 0 ||
//        meetingNotifs.length > 0 ||
//        localEventNotifs.some(isDisplayableLocalNotification)

//    if (!mounted) return null

//    const grouped = buildGroupedNotifs()

//    return (
//        <>
//            {reminderToast && (
//                <div
//                    className="
//                        fixed top-5 right-5 z-[9999]
//                        bg-amber-500 text-white
//                        rounded-2xl shadow-2xl
//                        px-5 py-4 max-w-sm
//                        flex items-start gap-3
//                        animate-in slide-in-from-top-2 duration-300
//                    "
//                >
//                    <span className="text-2xl">⏰</span>
//                    <div>
//                        <p className="font-semibold text-sm">{reminderToast.title}</p>
//                        <p className="text-xs opacity-90 mt-0.5">{reminderToast.body}</p>
//                    </div>
//                    <button onClick={() => setReminderToast(null)} className="ml-auto text-white/70 hover:text-white">
//                        <X className="h-4 w-4" />
//                    </button>
//                </div>
//            )}

//            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">
//                <div className="flex items-center gap-3">
//                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
//                        <Menu className="h-5 w-5" />
//                    </Button>
//                    <h1 className="font-semibold">{title}</h1>
//                </div>

//                <div className="flex items-center gap-2">
//                    <ThemeToggle />

//                    <div className="relative" ref={notifPanelRef}>
//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            className="relative"
//                            onClick={async () => {
//                                const opening = !showNotifications
//                                setShowNotifications(opening)
//                                if (opening) await markAllRead()
//                            }}
//                        >
//                            <Bell className="h-4 w-4" />
//                            {totalCount > 0 && (
//                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold px-1 rounded-full flex items-center justify-center leading-none">
//                                    {totalCount > 99 ? "99+" : totalCount}
//                                </span>
//                            )}
//                        </Button>

//                        {showNotifications && (
//                            <div
//                                className="
//                                    absolute right-0 top-[calc(100%+8px)]
//                                    w-[400px]
//                                    bg-white dark:bg-[#0d1117]
//                                    border border-gray-200 dark:border-white/10
//                                    rounded-2xl shadow-2xl z-50
//                                    flex flex-col overflow-hidden
//                                    max-h-[85vh]
//                                "
//                                style={{ boxShadow: "0 20px 60px -10px rgba(0,0,0,0.18), 0 4px 16px -4px rgba(0,0,0,0.12)" }}
//                            >
//                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/8 bg-white dark:bg-[#0d1117]">
//                                    <div className="flex items-center gap-2.5">
//                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
//                                            <Bell className="h-3.5 w-3.5 text-white" />
//                                        </div>
//                                        <div>
//                                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">Notifications</h4>
//                                            {totalCount > 0 && (
//                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">{totalCount} unread</p>
//                                            )}
//                                        </div>
//                                    </div>
//                                    <button
//                                        onClick={markAllRead}
//                                        className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
//                                    >
//                                        <CheckCheck className="h-3 w-3" />
//                                        Mark all read
//                                    </button>
//                                </div>

//                                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
//                                    {hasNotifications ? (
//                                        Object.keys(grouped).length > 0 ? (
//                                            Object.keys(grouped).map((group, gIdx) => (
//                                                <div key={gIdx}>
//                                                    <div className="flex items-center gap-3 px-5 pt-4 pb-2">
//                                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">{group}</span>
//                                                        <div className="flex-1 h-px bg-gray-100 dark:bg-white/6" />
//                                                    </div>

//                                                    {grouped[group].map((n: any, i: number) => {
//                                                        const isUnread = !n.isRead
//                                                        const accent = getNotifAccent(n)
//                                                        const icon = getNotifIcon(n)
//                                                        const isMeeting = n.type === "meeting" || (n.content || "").includes("📅")
//                                                        const isReminder = isReminderNotification(n)
//                                                        const isEventActivity = ["event_created", "event_updated", "event_deleted"].includes(n.type)
//                                                        const isChatRequest = n.type === "chat_request" && n.status === "pending"

//                                                        const accentMap: Record<string, string> = {
//                                                            blue: "bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400",
//                                                            amber: "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400",
//                                                            green: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
//                                                            red: "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400",
//                                                            purple: "bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400",
//                                                            gray: "bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-gray-400",
//                                                        }

//                                                        const dotMap: Record<string, string> = {
//                                                            blue: "bg-blue-500",
//                                                            amber: "bg-amber-500",
//                                                            green: "bg-emerald-500",
//                                                            red: "bg-red-500",
//                                                            purple: "bg-purple-500",
//                                                            gray: "bg-gray-400",
//                                                        }

//                                                        const senderName = (() => {
//                                                            if (isEventActivity || isReminder) return "Events"

//                                                            if (n.type === "meeting") {
//                                                                const actualName = cleanUUID(n.createdByName || n.fromUserName || "")
//                                                                if (!actualName || actualName.toLowerCase() === "hr") return "HR"
//                                                                return `HR (${actualName})`
//                                                            }

//                                                            return cleanUUID(n.fromUserName || "")
//                                                        })()

//                                                        const rawContent: string = n.content || ""
//                                                        const eventMessage = isReminder
//                                                            ? formatEventText(n)
//                                                            : isEventActivity
//                                                                ? buildEventNotificationMessage(n)
//                                                                : rawContent

//                                                        return (
//                                                            <div
//                                                                key={i}
//                                                                className={`
//                                                                    group relative mx-3 mb-1 rounded-xl px-3 py-3 cursor-pointer
//                                                                    transition-all duration-150
//                                                                    ${isUnread
//                                                                        ? "bg-indigo-50/70 dark:bg-indigo-500/8 hover:bg-indigo-50 dark:hover:bg-indigo-500/12"
//                                                                        : "hover:bg-gray-50 dark:hover:bg-white/4"
//                                                                    }
//                                                                `}
//                                                            >
//                                                                <div className="flex gap-3">
//                                                                    <div className="flex-shrink-0 mt-0.5">
//                                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-sm ${accentMap[accent]}`}>
//                                                                            {icon}
//                                                                        </div>
//                                                                    </div>

//                                                                    <div className="flex-1 min-w-0">
//                                                                        <div className="flex items-center justify-between gap-2 mb-0.5">
//                                                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
//                                                                                {senderName || (isMeeting ? "Meeting" : isReminder ? "Reminder" : "Notification")}
//                                                                            </span>
//                                                                            <div className="flex items-center gap-1.5 flex-shrink-0">
//                                                                                <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
//                                                                                    {formatTimeOnly(n.createdAt)}
//                                                                                </span>
//                                                                                {isUnread && (
//                                                                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotMap[accent]}`} />
//                                                                                )}
//                                                                            </div>
//                                                                        </div>

//                                                                        <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-snug line-clamp-2">
//                                                                            {isMeeting
//                                                                                ? `${cleanUUID(n.content).replace("📅", "").trim()} at ${formatTimeOnly(n.eventDate)} (${formatDateOnly(n.eventDate)})`
//                                                                                : eventMessage}
//                                                                        </p>

//                                                                        <div className="flex items-center justify-between mt-1.5 gap-2 flex-wrap">
//                                                                            <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
//                                                                                <Clock className="h-2.5 w-2.5" />
//                                                                                {isReminder || isEventActivity
//                                                                                    ? formatEventDateTime(n.eventDate, n.eventTime) || formatDateOnly(n.createdAt)
//                                                                                    : formatDateOnly(n.createdAt)}
//                                                                            </div>

//                                                                            {isChatRequest && (
//                                                                                <div className="flex items-center gap-1.5">
//                                                                                    <button
//                                                                                        onClick={(e) => {
//                                                                                            e.stopPropagation()
//                                                                                            handleChatRequest(n.id, "accepted")
//                                                                                        }}
//                                                                                        className="
//                                                                                            flex items-center gap-1 text-[11px] font-semibold
//                                                                                            bg-emerald-500 hover:bg-emerald-600 text-white
//                                                                                            px-2.5 py-1 rounded-lg transition-colors shadow-sm
//                                                                                        "
//                                                                                    >
//                                                                                        <Check className="h-2.5 w-2.5" />
//                                                                                        Accept
//                                                                                    </button>
//                                                                                    <button
//                                                                                        onClick={(e) => {
//                                                                                            e.stopPropagation()
//                                                                                            handleChatRequest(n.id, "rejected")
//                                                                                        }}
//                                                                                        className="
//                                                                                            flex items-center gap-1 text-[11px] font-semibold
//                                                                                            bg-red-500 hover:bg-red-600 text-white
//                                                                                            px-2.5 py-1 rounded-lg transition-colors shadow-sm
//                                                                                        "
//                                                                                    >
//                                                                                        <X className="h-2.5 w-2.5" />
//                                                                                        Reject
//                                                                                    </button>
//                                                                                </div>
//                                                                            )}

//                                                                            {(isMeeting || n.meetingLink) && n.meetingLink && (
//                                                                                <button
//                                                                                    onClick={(e) => {
//                                                                                        e.stopPropagation()
//                                                                                        window.open(n.meetingLink, "_blank")
//                                                                                    }}
//                                                                                    className="
//                                                                                        flex items-center gap-1 text-[11px] font-semibold
//                                                                                        bg-blue-600 hover:bg-blue-700 text-white
//                                                                                        px-2.5 py-1 rounded-lg transition-colors shadow-sm
//                                                                                    "
//                                                                                >
//                                                                                    <Video className="h-2.5 w-2.5" />
//                                                                                    Join
//                                                                                </button>
//                                                                            )}
//                                                                        </div>
//                                                                    </div>
//                                                                </div>
//                                                            </div>
//                                                        )
//                                                    })}
//                                                </div>
//                                            ))
//                                        ) : (
//                                            <EmptyState />
//                                        )
//                                    ) : (
//                                        <EmptyState />
//                                    )}
//                                    <div className="h-2" />
//                                </div>

//                                <div className="border-t border-gray-100 dark:border-white/8 bg-white dark:bg-[#0d1117] sticky bottom-0">
//                                    <button
//                                        onClick={() => setExpandedNotifications((prev) => !prev)}
//                                        className="w-full px-5 py-3 text-[12px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/8 transition-colors text-center flex items-center justify-center gap-1.5"
//                                    >
//                                        {expandedNotifications ? (
//                                            <>
//                                                <span>Show less</span>
//                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
//                                            </>
//                                        ) : (
//                                            <>
//                                                <span>View all notifications</span>
//                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
//                                            </>
//                                        )}
//                                    </button>
//                                </div>
//                            </div>
//                        )}
//                    </div>

//                    <DropdownMenu>
//                        <DropdownMenuTrigger asChild>
//                            <Button variant="ghost" className="gap-2">
//                                <Avatar className="h-7 w-7">
//                                    {image ? <AvatarImage src={image} /> : <AvatarFallback>{initials}</AvatarFallback>}
//                                </Avatar>
//                                {name || "User"}
//                            </Button>
//                        </DropdownMenuTrigger>
//                        <DropdownMenuContent align="end">
//                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
//                                <User className="mr-2 h-4 w-4" /> Profile
//                            </DropdownMenuItem>
//                            <DropdownMenuSeparator />
//                            <DropdownMenuItem onClick={() => setOpenLogout(true)}>
//                                <LogOut className="mr-2 h-4 w-4" /> Logout
//                            </DropdownMenuItem>
//                        </DropdownMenuContent>
//                    </DropdownMenu>
//                </div>
//            </header>

//            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
//                <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border border-border bg-white text-black dark:bg-gradient-to-br dark:from-[#020617] dark:to-[#0f172a] dark:text-white shadow-2xl">
//                    <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-100 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 border-border dark:border-white/10">
//                        <div className="flex items-center gap-3">
//                            <Button variant="ghost" size="icon" onClick={() => setOpenProfile(false)} className="hover:bg-black/10 dark:hover:bg-white/20">
//                                <ArrowLeft className="h-4 w-4" />
//                            </Button>
//                            <h2 className="text-lg font-semibold tracking-wide">Profile Settings</h2>
//                        </div>
//                    </div>

//                    <div className="p-6 space-y-6">
//                        <div className="flex items-center gap-5">
//                            <label className="cursor-pointer relative group">
//                                <Avatar className="h-20 w-20 border-2 border-indigo-500 shadow-lg">
//                                    {image
//                                        ? <AvatarImage src={image} />
//                                        : <AvatarFallback className="text-lg font-bold bg-indigo-600 text-white">{initials}</AvatarFallback>
//                                    }
//                                </Avatar>
//                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center text-white text-xs font-medium transition">Change</div>
//                                <input type="file" className="hidden" onChange={handleImageUpload} />
//                            </label>
//                            <div>
//                                <p className="text-lg font-semibold">{name}</p>
//                                <p className="text-sm text-muted-foreground">{email}</p>
//                            </div>
//                        </div>

//                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                            <div className="space-y-1">
//                                <Label>Full Name</Label>
//                                <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10 focus-visible:ring-indigo-500" />
//                            </div>
//                            <div className="space-y-1">
//                                <Label>Nick Name</Label>
//                                <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
//                            </div>
//                            <div className="md:col-span-2 space-y-2">
//                                <Label>Gender</Label>
//                                <div className="flex gap-3">
//                                    {["Male", "Female", "Other"].map((g) => (
//                                        <button
//                                            key={g}
//                                            type="button"
//                                            onClick={() => setGender(g)}
//                                            className={`px-4 py-2 rounded-lg border text-sm transition ${gender === g ? "bg-indigo-600 text-white border-indigo-500 shadow-md" : "bg-gray-100 dark:bg-white/5 border-border dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"}`}
//                                        >
//                                            {g}
//                                        </button>
//                                    ))}
//                                </div>
//                            </div>
//                            <div className="space-y-1">
//                                <Label>Mobile</Label>
//                                <Input value={mobile} onChange={(e) => setMobile(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
//                            </div>
//                            <div className="space-y-1">
//                                <Label>Country</Label>
//                                <Input value={country} onChange={(e) => setCountry(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
//                            </div>
//                            <div className="md:col-span-2 space-y-1">
//                                <Label>Email</Label>
//                                <Input value={email} disabled className="bg-gray-200 dark:bg-white/10 border-border dark:border-white/10 text-gray-500 dark:text-gray-400" />
//                            </div>
//                        </div>
//                    </div>

//                    <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-100 dark:bg-white/5 border-border dark:border-white/10">
//                        <Button variant="outline" onClick={() => setOpenProfile(false)} className="hover:bg-gray-200 dark:hover:bg-white/10">Cancel</Button>
//                        <Button onClick={saveProfile} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-lg">Save Changes</Button>
//                    </div>
//                </DialogContent>
//            </Dialog>

//            <Dialog open={openLogout} onOpenChange={setOpenLogout}>
//                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border border-border shadow-2xl">
//                    <div className="flex flex-col items-center justify-center px-6 pt-6 pb-4 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-[#020617]">
//                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
//                            <LogOut className="h-6 w-6 text-blue-600" />
//                        </div>
//                        <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">Log out of your account?</h2>
//                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">You&apos;ll need to sign in again to access your dashboard.</p>
//                    </div>
//                    <div className="flex gap-3 px-6 py-5 bg-white dark:bg-[#020617]">
//                        <button
//                            onClick={() => setOpenLogout(false)}
//                            className="w-1/2 py-2.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition"
//                        >
//                            Cancel
//                        </button>
//                        <button
//                            onClick={() => {
//                                localStorage.clear()
//                                window.location.href = "/"
//                            }}
//                            className="w-1/2 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition"
//                        >
//                            Log out
//                        </button>
//                    </div>
//                </DialogContent>
//            </Dialog>
//        </>
//    )
//}

//function EmptyState() {
//    return (
//        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
//            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center mb-3">
//                <Bell className="h-6 w-6 text-gray-300 dark:text-gray-600" />
//            </div>
//            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">All caught up!</p>
//            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">No new notifications right now</p>
//        </div>
//    )
//}

//export function registerCalendarReminder(
//    eventId: string,
//    eventTitle: string,
//    eventDateStr: string,
//    reminderType: string,
//    userId: string
//) {
//    const existing: LocalEventNotification[] = parseStoredNotifications()
//    const filtered = existing.filter((n) => n.eventId !== eventId || n.type !== "calendar")

//    const entry: LocalEventNotification = {
//        id: `${eventId}-calendar`,
//        eventId,
//        eventTitle,
//        userId,
//        type: "calendar",
//        createdAt: new Date().toISOString(),
//        isRead: false,
//        eventDate: eventDateStr,
//        triggered_at: false,
//        triggered_5: false,
//        triggered_10: false,
//    }

//    const types = reminderType.split("+")

//    if (types.includes("at")) {
//        entry.triggerTime_at = calcTriggerTime(eventDateStr, 0)
//    }
//    if (types.includes("5")) {
//        entry.triggerTime_5 = calcTriggerTime(eventDateStr, 5)
//    }
//    if (types.includes("10")) {
//        entry.triggerTime_10 = calcTriggerTime(eventDateStr, 10)
//    }

//    filtered.push(entry)
//    writeStoredNotifications(filtered)
//    window.dispatchEvent(new Event("new-notification"))
//}

//export function registerLegacyReminder(
//    eventId: string,
//    eventTitle: string,
//    eventDateStr: string,
//    reminderMinutes: number,
//    userId: string
//) {
//    registerCalendarReminder(
//        eventId,
//        eventTitle,
//        eventDateStr,
//        reminderMinutes === 0 ? "at" : String(reminderMinutes),
//        userId
//    )
//}















//"use client"

//import { type ChangeEvent, useEffect, useRef, useState } from "react"
//import { Bell, Menu, User, Video, ArrowLeft, LogOut, CheckCheck, Clock, Check, X } from "lucide-react"
//import * as signalR from "@microsoft/signalr"

//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import {
//    Dialog,
//    DialogContent,
//} from "@/components/ui/dialog"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"

//interface DashboardHeaderProps {
//    onMenuClick: () => void
//    title: string
//}

//interface Notification {
//    id: number
//    fromUserId: string
//    fromUserName: string
//    toUserId: string
//    content: string
//    status: string
//    isRead: boolean
//    createdAt?: string
//    type: string
//    meetingLink?: string | null
//    title?: string
//    eventDate?: string
//}

//interface Meeting {
//    id: string
//    title: string
//    startTime: string
//    meetingLink: string
//    createdByName?: string
//    isRead?: boolean
//    createdAt?: string
//}

//interface LocalEventNotification {
//    id: string | number
//    userId: string
//    type: string
//    isRead: boolean
//    createdAt: string
//    eventId?: string
//    eventTitle?: string
//    eventDate?: string
//    eventTime?: string
//    location?: string
//    message?: string
//    text?: string
//    triggerTime?: number
//    triggered?: boolean
//    triggerTime_at?: number
//    triggerTime_5?: number
//    triggerTime_10?: number
//    triggered_at?: boolean
//    triggered_5?: boolean
//    triggered_10?: boolean
//    meetingLink?: string
//    fromUserName?: string
//}

//function calcTriggerTime(eventDateStr: string, reminderMinutes: number): number {
//    const eventMs = new Date(eventDateStr).getTime()
//    return eventMs - reminderMinutes * 60 * 1000
//}

//function reminderLabel(minutes: number): string {
//    if (minutes === 0) return "at event time"
//    return `${minutes} minute${minutes > 1 ? "s" : ""} before`
//}

//function parseStoredNotifications(): LocalEventNotification[] {
//    if (typeof window === "undefined") return []

//    try {
//        return JSON.parse(localStorage.getItem("globalNotifications") || "[]")
//    } catch {
//        return []
//    }
//}

//function writeStoredNotifications(items: LocalEventNotification[]) {
//    localStorage.setItem("globalNotifications", JSON.stringify(items))
//}

//function isTriggeredReminder(notification: LocalEventNotification) {
//    return Boolean(
//        notification.triggered ||
//        notification.triggered_at ||
//        notification.triggered_5 ||
//        notification.triggered_10
//    )
//}

//function isReminderNotification(notification: LocalEventNotification) {
//    return Boolean(
//        notification.type === "calendar" ||
//        notification.triggerTime ||
//        notification.triggerTime_at ||
//        notification.triggerTime_5 ||
//        notification.triggerTime_10
//    )
//}

//function isDisplayableLocalNotification(notification: LocalEventNotification) {
//    if (isReminderNotification(notification)) return isTriggeredReminder(notification)
//    return true
//}

//function formatEventDateTime(date?: string, time?: string) {
//    if (!date && !time) return ""

//    const datePart = date
//        ? new Date(date).toLocaleDateString([], {
//            day: "2-digit",
//            month: "short",
//            year: "numeric",
//        })
//        : ""

//    if (datePart && time) return `${datePart} at ${time}`
//    return datePart || time || ""
//}

//function buildEventNotificationMessage(notification: LocalEventNotification) {
//    const details = formatEventDateTime(notification.eventDate, notification.eventTime)
//    const title = notification.eventTitle || "Event"

//    if (notification.message) return notification.message
//    if (notification.text) return notification.text

//    switch (notification.type) {
//        case "event_created":
//            return `${title} has been created${details ? ` for ${details}` : ""}.`
//        case "event_updated":
//            return `${title} has been updated${details ? ` to ${details}` : ""}.`
//        case "event_deleted":
//            return `${title} has been deleted${details ? ` from ${details}` : ""}.`
//        default:
//            return title
//    }
//}

//function buildMeetingNotificationMessage(notification: LocalEventNotification) {
//    const title = notification.eventTitle || "Meeting"
//    const details = formatEventDateTime(notification.eventDate, notification.eventTime)
//    const sender = notification.fromUserName || "HR"

//    if (notification.message) return notification.message
//    if (notification.text) return notification.text

//    switch (notification.type) {
//        case "meeting_created":
//            return `${sender} scheduled "${title}"${details ? ` for ${details}` : ""}.`
//        case "meeting_updated":
//            return `${sender} updated "${title}"${details ? ` to ${details}` : ""}.`
//        case "meeting_deleted":
//            return `${sender} cancelled "${title}"${details ? ` scheduled for ${details}` : ""}.`
//        default:
//            return title
//    }
//}

//export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {
//    const [name, setName] = useState("")
//    const [mounted, setMounted] = useState(false)
//    const [email, setEmail] = useState("")
//    const [nickname, setNickname] = useState("")
//    const [mobile, setMobile] = useState("")
//    const [country, setCountry] = useState("")
//    const [gender, setGender] = useState("")
//    const [image, setImage] = useState<string | null>(null)
//    const [openProfile, setOpenProfile] = useState(false)

//    const [chatNotifs, setChatNotifs] = useState<Notification[]>([])
//    const [meetingNotifs, setMeetingNotifs] = useState<Meeting[]>([])
//    const [localEventNotifs, setLocalEventNotifs] = useState<LocalEventNotification[]>([])
//    const [showNotifications, setShowNotifications] = useState(false)
//    const [expandedNotifications, setExpandedNotifications] = useState(false)
//    const notifPanelRef = useRef<HTMLDivElement>(null)

//    const [currentUserId, setCurrentUserId] = useState("")
//    const [openLogout, setOpenLogout] = useState(false)
//    const [userRole, setUserRole] = useState("")

//    const [reminderToast, setReminderToast] = useState<{ title: string; body: string } | null>(null)

//    const getMeetingReadIds = () => {
//        const userId = localStorage.getItem("userId")
//        return JSON.parse(localStorage.getItem(`readMeetings_${userId}`) || "[]")
//    }

//    const saveMeetingReadIds = (ids: string[]) => {
//        const userId = localStorage.getItem("userId")
//        localStorage.setItem(`readMeetings_${userId}`, JSON.stringify(ids))
//    }

//    const formatDateOnly = (dateString?: string) => {
//        if (!dateString) return ""
//        return new Date(dateString).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" })
//    }

//    const formatTimeOnly = (dateString?: string) => {
//        if (!dateString) return ""
//        return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//    }

//    const formatEventText = (n: LocalEventNotification) => {
//        const baseDate = n.eventDate || n.createdAt
//        const date = new Date(baseDate)

//        const today = new Date()
//        const yesterday = new Date()
//        yesterday.setDate(today.getDate() - 1)

//        let dayLabel = date.toLocaleDateString([], {
//            day: "2-digit",
//            month: "short",
//            year: "numeric",
//        })

//        if (date.toDateString() === today.toDateString()) {
//            dayLabel = "Today"
//        } else if (date.toDateString() === yesterday.toDateString()) {
//            dayLabel = "Yesterday"
//        }

//        const timeLabel = n.eventTime || date.toLocaleTimeString([], {
//            hour: "2-digit",
//            minute: "2-digit",
//        })

//        return `Reminder: "${n.eventTitle || "Event"}" at ${timeLabel} (${dayLabel})`
//    }

//    const cleanUUID = (text: string) =>
//        (text || "").replace(/^[0-9a-fA-F-]{36}\s*/, "").trim()

//    const getReadIds = () => {
//        if (typeof window === "undefined") return []
//        const userId = localStorage.getItem("userId")
//        return JSON.parse(localStorage.getItem(`readNotifications_${userId}`) || "[]")
//    }

//    const saveReadIds = (ids: number[]) => {
//        const userId = localStorage.getItem("userId")
//        localStorage.setItem(`readNotifications_${userId}`, JSON.stringify(ids))
//    }

//    useEffect(() => {
//        const handleClickOutside = (e: MouseEvent) => {
//            if (notifPanelRef.current && !notifPanelRef.current.contains(e.target as Node)) {
//                setShowNotifications(false)
//            }
//        }

//        if (showNotifications) document.addEventListener("mousedown", handleClickOutside)
//        return () => document.removeEventListener("mousedown", handleClickOutside)
//    }, [showNotifications])

//    useEffect(() => {
//        setMounted(true)
//    }, [])

//    useEffect(() => {
//        const role = localStorage.getItem("role") || ""
//        setUserRole(role)
//    }, [])

//    useEffect(() => {
//        const id = localStorage.getItem("userId") || ""
//        setCurrentUserId(id)
//        const storedName = localStorage.getItem("name") || ""
//        setName(storedName)
//    }, [])

//    useEffect(() => {
//        const role = (localStorage.getItem("role") || "").toLowerCase()
//        if (role !== "employee" && role !== "professional") return

//        const connection = new signalR.HubConnectionBuilder()
//            .withUrl("https://steadfast-warmth-production-64c8.up.railway.app/chatHub", {
//                accessTokenFactory: () => localStorage.getItem("token") || "",
//            })
//            .withAutomaticReconnect()
//            .build()

//        connection.start().catch((err) => console.error("SignalR Error:", err))

//        connection.on("ReceiveNotification", (data) => {
//            const notifType = data.type || "info"

//            if (notifType === "announcement") {
//                const hrName = cleanUUID(data.createdByName || data.fromUserName || "HR")
//                const announcementTitle = cleanUUID(data.title || "Announcement")

//                setChatNotifs((prev) => [
//                    {
//                        id: Date.now(),
//                        fromUserId: data.fromUserId || "system",
//                        fromUserName: hrName,
//                        toUserId: currentUserId,
//                        content: `${hrName} shared an announcement: ${announcementTitle}`,
//                        status: "info",
//                        type: "announcement",
//                        isRead: false,
//                        createdAt: data.createdAt || new Date().toISOString(),
//                        title: announcementTitle,
//                        eventDate: data.startTime || data.dateTime || undefined,
//                    },
//                    ...prev,
//                ])
//                return
//            }

//            const cleanTitle = cleanUUID(data.title || "")
//            const startTime = data.startTime || data.dateTime || null

//            const formattedDate = startTime
//                ? new Date(startTime).toLocaleDateString([], {
//                    day: "2-digit",
//                    month: "short",
//                    year: "numeric",
//                })
//                : ""

//            const formattedTime = startTime
//                ? new Date(startTime).toLocaleTimeString([], {
//                    hour: "2-digit",
//                    minute: "2-digit",
//                })
//                : ""

//            setChatNotifs((prev) => [
//                {
//                    id: Date.now(),
//                    fromUserId: data.fromUserId || "system",
//                    fromUserName: data.createdByName || "HR",
//                    toUserId: currentUserId,
//                    content: `${cleanTitle} scheduled on ${formattedDate} at ${formattedTime}`,
//                    meetingLink: data.meetingLink || data.link || null,
//                    status: "info",
//                    type: "meeting",
//                    isRead: false,
//                    createdAt: data.createdAt || new Date().toISOString(),
//                    eventDate: startTime || undefined,
//                },
//                ...prev,
//            ])
//        })

//        return () => {
//            connection.stop()
//        }
//    }, [currentUserId])

//    useEffect(() => {
//        const loadProfile = async () => {
//            try {
//                const token = localStorage.getItem("token")
//                if (!token) return

//                const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Account/profile", {
//                    headers: { Authorization: `Bearer ${token}` },
//                })

//                if (res.status === 401) {
//                    localStorage.removeItem("token")
//                    window.location.href = "/"
//                    return
//                }

//                if (!res.ok) return

//                const data = await res.json()
//                const finalName = data.name || data.fullName || localStorage.getItem("name") || ""

//                setName(finalName)
//                localStorage.setItem("name", finalName)
//                setEmail(data.email || "")
//                setNickname(data.nickname || "")
//                setMobile(data.mobile || "")
//                setCountry(data.country || "")
//                setGender(data.gender || "")
//                setImage(data.profileImage || null)
//            } catch (err) {
//                console.error("Profile load error:", err)
//            }
//        }

//        loadProfile()
//    }, [])

//    const fetchNotifications = async () => {
//        try {
//            const res = await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/${currentUserId}`
//            )
//            const data = await res.json()
//            const role = localStorage.getItem("role")
//            const filtered = role === "employee"
//                ? data
//                : data.filter((n: Notification) => n.type !== "announcement")
//            const readIds = getReadIds()

//            const buildMessage = (n: Notification) => {
//                if (n.type === "meeting") {
//                    const date = new Date(n.createdAt || "")
//                    const formattedDate = date.toLocaleDateString([], {
//                        day: "2-digit",
//                        month: "short",
//                        year: "numeric",
//                    })
//                    const formattedTime = date.toLocaleTimeString([], {
//                        hour: "2-digit",
//                        minute: "2-digit",
//                    })

//                    return `${cleanUUID(n.content)} • ${formattedDate} at ${formattedTime}`
//                }

//                return cleanUUID(n.content)
//            }

//            setChatNotifs(
//                filtered.map((n: Notification) => ({
//                    ...n,
//                    fromUserName: cleanUUID(n.fromUserName),
//                    content: buildMessage(n),
//                    createdAt: n.createdAt || new Date().toISOString(),
//                    eventDate: n.eventDate || (n as any).startTime || (n as any).dateTime || undefined,
//                    isRead: readIds.includes(n.id) ? true : n.isRead,
//                }))
//            )
//        } catch {
//            setChatNotifs([])
//        }
//    }

//    const fetchMeetings = async () => {
//        try {
//            const token = localStorage.getItem("token")
//            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/meeting/my-meetings", {
//                headers: { Authorization: `Bearer ${token}` },
//            })
//            const data = await res.json()
//            const now = new Date()
//            const upcoming = data.filter((m: Meeting) => new Date(m.startTime) > now)
//            const readIds = getMeetingReadIds()

//            setMeetingNotifs(upcoming.map((m: Meeting) => ({
//                ...m,
//                isRead: readIds.includes(m.id),
//                createdAt: m.createdAt || m.startTime,
//                createdByName: m.createdByName || "HR",
//            })))
//        } catch {
//            setMeetingNotifs([])
//        }
//    }

//    useEffect(() => {
//        if (!currentUserId) return

//        fetchNotifications()
//        fetchMeetings()

//        const refresh = () => {
//            fetchNotifications()
//            fetchMeetings()
//        }

//        const interval = setInterval(() => {
//            fetchNotifications()
//            fetchMeetings()
//        }, 3000)

//        window.addEventListener("chat-updated", refresh)
//        window.addEventListener("request-updated", refresh)

//        return () => {
//            clearInterval(interval)
//            window.removeEventListener("chat-updated", refresh)
//            window.removeEventListener("request-updated", refresh)
//        }
//    }, [currentUserId, userRole])

//    const loadGlobalNotifications = () => {
//        const currentUser = localStorage.getItem("userId")
//        const data = parseStoredNotifications()
//        const filtered = data.filter((n) => n.userId === currentUser)
//        setLocalEventNotifs(filtered)
//    }

//    useEffect(() => {
//        loadGlobalNotifications()

//        const handler = () => loadGlobalNotifications()
//        window.addEventListener("new-notification", handler)

//        return () => window.removeEventListener("new-notification", handler)
//    }, [])

//    useEffect(() => {
//        const interval = setInterval(() => {
//            const now = Date.now()
//            const currentUser = localStorage.getItem("userId")
//            const data = parseStoredNotifications()

//            let changed = false
//            const updated = data.map((n) => {
//                if (n.userId !== currentUser) return n
//                if (!isReminderNotification(n)) return n

//                if (!n.triggered_at && n.triggerTime_at && now >= n.triggerTime_at) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", `Reminder: "${n.eventTitle || "Event"}" is happening ${reminderLabel(0)}.`)
//                    return { ...n, triggered_at: true, isRead: false }
//                }

//                if (!n.triggered_5 && n.triggerTime_5 && now >= n.triggerTime_5) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", `Reminder: "${n.eventTitle || "Event"}" starts ${reminderLabel(5)}.`)
//                    return { ...n, triggered_5: true, isRead: false }
//                }

//                if (!n.triggered_10 && n.triggerTime_10 && now >= n.triggerTime_10) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", `Reminder: "${n.eventTitle || "Event"}" starts ${reminderLabel(10)}.`)
//                    return { ...n, triggered_10: true, isRead: false }
//                }

//                if (n.triggerTime && !n.triggered && now >= n.triggerTime) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", n.text || `Reminder: "${n.eventTitle || "Event"}" is coming up.`)
//                    return { ...n, triggered: true, isRead: false }
//                }

//                return n
//            })

//            if (changed) {
//                writeStoredNotifications(updated)
//                setLocalEventNotifs(updated.filter((n) => n.userId === currentUser))
//            }
//        }, 30000)

//        return () => clearInterval(interval)
//    }, [])

//    const showReminderToast = (toastTitle: string, body: string) => {
//        setReminderToast({ title: toastTitle, body })
//        setTimeout(() => setReminderToast(null), 6000)
//    }

//    const handleChatRequest = async (notifId: number, status: "accepted" | "rejected") => {
//        try {
//            await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/${notifId}`,
//                {
//                    method: "PUT",
//                    headers: { "Content-Type": "application/json" },
//                    body: JSON.stringify(status),
//                }
//            )

//            if (status === "accepted") {
//                await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/chat/create", {
//                    method: "POST",
//                    headers: { "Content-Type": "application/json" },
//                    body: JSON.stringify({ notificationId: notifId }),
//                })
//                window.dispatchEvent(new Event("chat-updated"))
//            }

//            const original = chatNotifs.find((n) => n.id === notifId)
//            if (original) {
//                const myName = localStorage.getItem("name") || "Someone"
//                const statusMsg =
//                    status === "accepted"
//                        ? `${myName} accepted your chat request`
//                        : `${myName} rejected your chat request`

//                await fetch(
//                    "https://steadfast-warmth-production-64c8.up.railway.app/api/notifications",
//                    {
//                        method: "POST",
//                        headers: { "Content-Type": "application/json" },
//                        body: JSON.stringify({
//                            fromUserId: currentUserId,
//                            fromUserName: myName,
//                            toUserId: original.fromUserId,
//                            content: statusMsg,
//                            type: status === "accepted" ? "chat_accepted" : "chat_rejected",
//                            status: "info",
//                            isRead: false,
//                        }),
//                    }
//                )
//            }

//            setChatNotifs((prev) => prev.filter((n) => n.id !== notifId))
//            window.dispatchEvent(new Event("chat-updated"))
//            window.dispatchEvent(new Event("request-updated"))
//            await fetchNotifications()
//        } catch (err) {
//            console.error("Chat request error:", err)
//        }
//    }

//    const markAllRead = async () => {
//        try {
//            await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/mark-read/${currentUserId}`,
//                { method: "PUT" }
//            )

//            setChatNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })))
//            setMeetingNotifs((prev) => prev.map((m) => ({ ...m, isRead: true })))
//            saveMeetingReadIds(meetingNotifs.map((m) => m.id))
//            saveReadIds(chatNotifs.map((n) => n.id))

//            const currentUser = localStorage.getItem("userId")
//            const allStored = parseStoredNotifications()
//            const updatedStored = allStored.map((item) =>
//                item.userId === currentUser && isDisplayableLocalNotification(item)
//                    ? { ...item, isRead: true }
//                    : item
//            )

//            writeStoredNotifications(updatedStored)
//            setLocalEventNotifs(updatedStored.filter((item) => item.userId === currentUser))
//        } catch (err) {
//            console.error("Mark read error:", err)
//        }
//    }

//    const saveProfile = async () => {
//        try {
//            const token = localStorage.getItem("token")
//            await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Account/profile", {
//                method: "PUT",
//                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//                body: JSON.stringify({ name, nickname, gender, country, mobile, profileImage: image }),
//            })
//            setOpenProfile(false)
//        } catch (err) {
//            console.error("Profile save error:", err)
//        }
//    }

//    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
//        const file = e.target.files?.[0]
//        if (!file) return

//        const reader = new FileReader()
//        reader.onloadend = () => setImage(reader.result as string)
//        reader.readAsDataURL(file)
//    }

//    const initials = name
//        ? name.split(" ").map((part) => part[0]).join("").toUpperCase()
//        : "U"

//    const unreadChatCount = chatNotifs.filter((n) => !n.isRead).length
//    const unreadMeetingCount = meetingNotifs.filter((m) => !m.isRead).length
//    const unreadLocalEventCount = localEventNotifs.filter((n) => isDisplayableLocalNotification(n) && !n.isRead).length
//    const totalCount = unreadChatCount + unreadMeetingCount + unreadLocalEventCount

//    const buildGroupedNotifs = () => {
//        let allNotifs: any[] = [
//            ...localEventNotifs.filter(isDisplayableLocalNotification),
//            ...chatNotifs,
//            ...meetingNotifs.map((m) => ({
//                ...m,
//                type: "meeting",
//                content: m.title,
//                createdAt: m.createdAt || m.startTime,
//                fromUserName: `HR (${m.createdByName || "HR"})`,
//                createdByName: m.createdByName || "HR",
//                meetingLink: m.meetingLink,
//                eventDate: m.startTime,
//            })),
//        ].sort((a: any, b: any) =>
//            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
//        )

//        if (!expandedNotifications) allNotifs = allNotifs.slice(0, 5)

//        const today = new Date()
//        const yesterday = new Date()
//        yesterday.setDate(today.getDate() - 1)

//        const getGroupLabel = (dateStr: string) => {
//            const d = new Date(dateStr)
//            if (d.toDateString() === today.toDateString()) return "Today"
//            if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
//            return formatDateOnly(dateStr)
//        }

//        const grouped: Record<string, any[]> = {}
//        allNotifs.forEach((n: any) => {
//            const label = getGroupLabel(n.createdAt)
//            if (!grouped[label]) grouped[label] = []
//            grouped[label].push(n)
//        })

//        return grouped
//    }

//    const getNotifIcon = (n: any) => {
//        if (n.type === "chat_request") return "💬"
//        if (n.type === "chat_accepted") return "✅"
//        if (n.type === "chat_rejected") return "❌"
//        if (n.type === "announcement") return "📢"
//        if (n.type === "meeting_created") return "📅"
//        if (n.type === "meeting_updated") return "📝"
//        if (n.type === "meeting_deleted") return "🚫"
//        if (n.type === "event_created") return "🆕"
//        if (n.type === "event_updated") return "✏️"
//        if (n.type === "event_deleted") return "🗑️"
//        if (n.eventDate || n.type === "calendar") return "⏰"
//        if (n.type === "meeting") return "📅"
//        return "🔔"
//    }

//    const getNotifAccent = (n: any) => {
//        if (n.type === "chat_accepted") return "green"
//        if (n.type === "chat_rejected") return "red"
//        if (n.type === "meeting_deleted") return "red"
//        if (n.type === "meeting_created") return "blue"
//        if (n.type === "meeting_updated") return "blue"
//        if (n.type === "event_deleted") return "red"
//        if (n.type === "event_created") return "green"
//        if (n.type === "event_updated") return "blue"
//        if (n.type === "chat_request") return "purple"
//        if (n.type === "announcement") return "purple"
//        if (n.type === "meeting" || (n.content || "").includes("📅")) return "blue"
//        if (n.eventDate || n.type === "calendar") return "amber"
//        return "gray"
//    }

//    const hasNotifications = chatNotifs.length > 0 ||
//        meetingNotifs.length > 0 ||
//        localEventNotifs.some(isDisplayableLocalNotification)

//    if (!mounted) return null

//    const grouped = buildGroupedNotifs()

//    return (
//        <>
//            {reminderToast && (
//                <div
//                    className="
//                        fixed top-5 right-5 z-[9999]
//                        bg-amber-500 text-white
//                        rounded-2xl shadow-2xl
//                        px-5 py-4 max-w-sm
//                        flex items-start gap-3
//                        animate-in slide-in-from-top-2 duration-300
//                    "
//                >
//                    <span className="text-2xl">⏰</span>
//                    <div>
//                        <p className="font-semibold text-sm">{reminderToast.title}</p>
//                        <p className="text-xs opacity-90 mt-0.5">{reminderToast.body}</p>
//                    </div>
//                    <button onClick={() => setReminderToast(null)} className="ml-auto text-white/70 hover:text-white">
//                        <X className="h-4 w-4" />
//                    </button>
//                </div>
//            )}

//            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">
//                <div className="flex items-center gap-3">
//                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
//                        <Menu className="h-5 w-5" />
//                    </Button>
//                    <h1 className="font-semibold">{title}</h1>
//                </div>

//                <div className="flex items-center gap-2">
//                    <ThemeToggle />

//                    <div className="relative" ref={notifPanelRef}>
//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            className="relative"
//                            onClick={async () => {
//                                const opening = !showNotifications
//                                setShowNotifications(opening)
//                                if (opening) await markAllRead()
//                            }}
//                        >
//                            <Bell className="h-4 w-4" />
//                            {totalCount > 0 && (
//                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold px-1 rounded-full flex items-center justify-center leading-none">
//                                    {totalCount > 99 ? "99+" : totalCount}
//                                </span>
//                            )}
//                        </Button>

//                        {showNotifications && (
//                            <div
//                                className="
//                                    absolute right-0 top-[calc(100%+8px)]
//                                    w-[400px]
//                                    bg-white dark:bg-[#0d1117]
//                                    border border-gray-200 dark:border-white/10
//                                    rounded-2xl shadow-2xl z-50
//                                    flex flex-col overflow-hidden
//                                    max-h-[85vh]
//                                "
//                                style={{ boxShadow: "0 20px 60px -10px rgba(0,0,0,0.18), 0 4px 16px -4px rgba(0,0,0,0.12)" }}
//                            >
//                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/8 bg-white dark:bg-[#0d1117]">
//                                    <div className="flex items-center gap-2.5">
//                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
//                                            <Bell className="h-3.5 w-3.5 text-white" />
//                                        </div>
//                                        <div>
//                                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">Notifications</h4>
//                                            {totalCount > 0 && (
//                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">{totalCount} unread</p>
//                                            )}
//                                        </div>
//                                    </div>
//                                    <button
//                                        onClick={markAllRead}
//                                        className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
//                                    >
//                                        <CheckCheck className="h-3 w-3" />
//                                        Mark all read
//                                    </button>
//                                </div>

//                                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
//                                    {hasNotifications ? (
//                                        Object.keys(grouped).length > 0 ? (
//                                            Object.keys(grouped).map((group, gIdx) => (
//                                                <div key={gIdx}>
//                                                    <div className="flex items-center gap-3 px-5 pt-4 pb-2">
//                                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">{group}</span>
//                                                        <div className="flex-1 h-px bg-gray-100 dark:bg-white/6" />
//                                                    </div>

//                                                    {grouped[group].map((n: any, i: number) => {
//                                                        const isUnread = !n.isRead
//                                                        const accent = getNotifAccent(n)
//                                                        const icon = getNotifIcon(n)
//                                                        const isMeeting = n.type === "meeting" || (n.content || "").includes("📅")
//                                                        const isReminder = isReminderNotification(n)
//                                                        const isMeetingActivity = ["meeting_created", "meeting_updated", "meeting_deleted"].includes(n.type)
//                                                        const isEventActivity = ["event_created", "event_updated", "event_deleted"].includes(n.type)
//                                                        const isChatRequest = n.type === "chat_request" && n.status === "pending"

//                                                        const accentMap: Record<string, string> = {
//                                                            blue: "bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400",
//                                                            amber: "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400",
//                                                            green: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
//                                                            red: "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400",
//                                                            purple: "bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400",
//                                                            gray: "bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-gray-400",
//                                                        }

//                                                        const dotMap: Record<string, string> = {
//                                                            blue: "bg-blue-500",
//                                                            amber: "bg-amber-500",
//                                                            green: "bg-emerald-500",
//                                                            red: "bg-red-500",
//                                                            purple: "bg-purple-500",
//                                                            gray: "bg-gray-400",
//                                                        }

//                                                        const senderName = (() => {
//                                                            if (isMeetingActivity) {
//                                                                return cleanUUID(n.fromUserName || n.createdByName || "HR")
//                                                            }

//                                                            if (isEventActivity || isReminder) return "Events"

//                                                            if (n.type === "meeting") {
//                                                                const actualName = cleanUUID(n.createdByName || n.fromUserName || "")
//                                                                if (!actualName || actualName.toLowerCase() === "hr") return "HR"
//                                                                return `HR (${actualName})`
//                                                            }

//                                                            return cleanUUID(n.fromUserName || "")
//                                                        })()

//                                                        const rawContent: string = n.content || ""
//                                                        const meetingDate = n.eventDate || n.startTime || n.createdAt
//                                                        const eventMessage = isMeetingActivity
//                                                            ? buildMeetingNotificationMessage(n)
//                                                            : isReminder
//                                                                ? formatEventText(n)
//                                                                : isEventActivity
//                                                                    ? buildEventNotificationMessage(n)
//                                                                    : rawContent

//                                                        return (
//                                                            <div
//                                                                key={i}
//                                                                className={`
//                                                                    group relative mx-3 mb-1 rounded-xl px-3 py-3 cursor-pointer
//                                                                    transition-all duration-150
//                                                                    ${isUnread
//                                                                        ? "bg-indigo-50/70 dark:bg-indigo-500/8 hover:bg-indigo-50 dark:hover:bg-indigo-500/12"
//                                                                        : "hover:bg-gray-50 dark:hover:bg-white/4"
//                                                                    }
//                                                                `}
//                                                            >
//                                                                <div className="flex gap-3">
//                                                                    <div className="flex-shrink-0 mt-0.5">
//                                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-sm ${accentMap[accent]}`}>
//                                                                            {icon}
//                                                                        </div>
//                                                                    </div>

//                                                                    <div className="flex-1 min-w-0">
//                                                                        <div className="flex items-center justify-between gap-2 mb-0.5">
//                                                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
//                                                                                {senderName || (isMeeting ? "Meeting" : isReminder ? "Reminder" : "Notification")}
//                                                                            </span>
//                                                                            <div className="flex items-center gap-1.5 flex-shrink-0">
//                                                                                <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
//                                                                                    {formatTimeOnly(n.createdAt)}
//                                                                                </span>
//                                                                                {isUnread && (
//                                                                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotMap[accent]}`} />
//                                                                                )}
//                                                                            </div>
//                                                                        </div>

//                                                                        <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-snug line-clamp-2">
//                                                                            {isMeeting
//                                                                                ? meetingDate
//                                                                                    ? `${cleanUUID(n.content).replace("📅", "").trim()}`
//                                                                                    : cleanUUID(n.content).replace("📅", "").trim()
//                                                                                : eventMessage}
//                                                                        </p>

//                                                                        <div className="flex items-center justify-between mt-1.5 gap-2 flex-wrap">
//                                                                            <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
//                                                                                <Clock className="h-2.5 w-2.5" />
//                                                                                {isReminder || isEventActivity || isMeetingActivity
//                                                                                    ? formatEventDateTime(n.eventDate, n.eventTime) || formatDateOnly(n.createdAt)
//                                                                                    : meetingDate
//                                                                                        ? `${formatDateOnly(meetingDate)}${formatTimeOnly(meetingDate) ? ` • ${formatTimeOnly(meetingDate)}` : ""}`
//                                                                                        : formatDateOnly(n.createdAt)}
//                                                                            </div>

//                                                                            {isChatRequest && (
//                                                                                <div className="flex items-center gap-1.5">
//                                                                                    <button
//                                                                                        onClick={(e) => {
//                                                                                            e.stopPropagation()
//                                                                                            handleChatRequest(n.id, "accepted")
//                                                                                        }}
//                                                                                        className="
//                                                                                            flex items-center gap-1 text-[11px] font-semibold
//                                                                                            bg-emerald-500 hover:bg-emerald-600 text-white
//                                                                                            px-2.5 py-1 rounded-lg transition-colors shadow-sm
//                                                                                        "
//                                                                                    >
//                                                                                        <Check className="h-2.5 w-2.5" />
//                                                                                        Accept
//                                                                                    </button>
//                                                                                    <button
//                                                                                        onClick={(e) => {
//                                                                                            e.stopPropagation()
//                                                                                            handleChatRequest(n.id, "rejected")
//                                                                                        }}
//                                                                                        className="
//                                                                                            flex items-center gap-1 text-[11px] font-semibold
//                                                                                            bg-red-500 hover:bg-red-600 text-white
//                                                                                            px-2.5 py-1 rounded-lg transition-colors shadow-sm
//                                                                                        "
//                                                                                    >
//                                                                                        <X className="h-2.5 w-2.5" />
//                                                                                        Reject
//                                                                                    </button>
//                                                                                </div>
//                                                                            )}

//                                                                            {(isMeeting || isMeetingActivity || n.meetingLink) && n.meetingLink && n.type !== "meeting_deleted" && (
//                                                                                <button
//                                                                                    onClick={(e) => {
//                                                                                        e.stopPropagation()
//                                                                                        window.open(n.meetingLink, "_blank")
//                                                                                    }}
//                                                                                    className="
//                                                                                        flex items-center gap-1 text-[11px] font-semibold
//                                                                                        bg-blue-600 hover:bg-blue-700 text-white
//                                                                                        px-2.5 py-1 rounded-lg transition-colors shadow-sm
//                                                                                    "
//                                                                                >
//                                                                                    <Video className="h-2.5 w-2.5" />
//                                                                                    Join
//                                                                                </button>
//                                                                            )}
//                                                                        </div>
//                                                                    </div>
//                                                                </div>
//                                                            </div>
//                                                        )
//                                                    })}
//                                                </div>
//                                            ))
//                                        ) : (
//                                            <EmptyState />
//                                        )
//                                    ) : (
//                                        <EmptyState />
//                                    )}
//                                    <div className="h-2" />
//                                </div>

//                                <div className="border-t border-gray-100 dark:border-white/8 bg-white dark:bg-[#0d1117] sticky bottom-0">
//                                    <button
//                                        onClick={() => setExpandedNotifications((prev) => !prev)}
//                                        className="w-full px-5 py-3 text-[12px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/8 transition-colors text-center flex items-center justify-center gap-1.5"
//                                    >
//                                        {expandedNotifications ? (
//                                            <>
//                                                <span>Show less</span>
//                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
//                                            </>
//                                        ) : (
//                                            <>
//                                                <span>View all notifications</span>
//                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
//                                            </>
//                                        )}
//                                    </button>
//                                </div>
//                            </div>
//                        )}
//                    </div>

//                    <DropdownMenu>
//                        <DropdownMenuTrigger asChild>
//                            <Button variant="ghost" className="gap-2">
//                                <Avatar className="h-7 w-7">
//                                    {image ? <AvatarImage src={image} /> : <AvatarFallback>{initials}</AvatarFallback>}
//                                </Avatar>
//                                {name || "User"}
//                            </Button>
//                        </DropdownMenuTrigger>
//                        <DropdownMenuContent align="end">
//                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
//                                <User className="mr-2 h-4 w-4" /> Profile
//                            </DropdownMenuItem>
//                            <DropdownMenuSeparator />
//                            <DropdownMenuItem onClick={() => setOpenLogout(true)}>
//                                <LogOut className="mr-2 h-4 w-4" /> Logout
//                            </DropdownMenuItem>
//                        </DropdownMenuContent>
//                    </DropdownMenu>
//                </div>
//            </header>

//            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
//                <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border border-border bg-white text-black dark:bg-gradient-to-br dark:from-[#020617] dark:to-[#0f172a] dark:text-white shadow-2xl">
//                    <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-100 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 border-border dark:border-white/10">
//                        <div className="flex items-center gap-3">
//                            <Button variant="ghost" size="icon" onClick={() => setOpenProfile(false)} className="hover:bg-black/10 dark:hover:bg-white/20">
//                                <ArrowLeft className="h-4 w-4" />
//                            </Button>
//                            <h2 className="text-lg font-semibold tracking-wide">Profile Settings</h2>
//                        </div>
//                    </div>

//                    <div className="p-6 space-y-6">
//                        <div className="flex items-center gap-5">
//                            <label className="cursor-pointer relative group">
//                                <Avatar className="h-20 w-20 border-2 border-indigo-500 shadow-lg">
//                                    {image
//                                        ? <AvatarImage src={image} />
//                                        : <AvatarFallback className="text-lg font-bold bg-indigo-600 text-white">{initials}</AvatarFallback>
//                                    }
//                                </Avatar>
//                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center text-white text-xs font-medium transition">Change</div>
//                                <input type="file" className="hidden" onChange={handleImageUpload} />
//                            </label>
//                            <div>
//                                <p className="text-lg font-semibold">{name}</p>
//                                <p className="text-sm text-muted-foreground">{email}</p>
//                            </div>
//                        </div>

//                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                            <div className="space-y-1">
//                                <Label>Full Name</Label>
//                                <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10 focus-visible:ring-indigo-500" />
//                            </div>
//                            <div className="space-y-1">
//                                <Label>Nick Name</Label>
//                                <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
//                            </div>
//                            <div className="md:col-span-2 space-y-2">
//                                <Label>Gender</Label>
//                                <div className="flex gap-3">
//                                    {["Male", "Female", "Other"].map((g) => (
//                                        <button
//                                            key={g}
//                                            type="button"
//                                            onClick={() => setGender(g)}
//                                            className={`px-4 py-2 rounded-lg border text-sm transition ${gender === g ? "bg-indigo-600 text-white border-indigo-500 shadow-md" : "bg-gray-100 dark:bg-white/5 border-border dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"}`}
//                                        >
//                                            {g}
//                                        </button>
//                                    ))}
//                                </div>
//                            </div>
//                            <div className="space-y-1">
//                                <Label>Mobile</Label>
//                                <Input value={mobile} onChange={(e) => setMobile(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
//                            </div>
//                            <div className="space-y-1">
//                                <Label>Country</Label>
//                                <Input value={country} onChange={(e) => setCountry(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
//                            </div>
//                            <div className="md:col-span-2 space-y-1">
//                                <Label>Email</Label>
//                                <Input value={email} disabled className="bg-gray-200 dark:bg-white/10 border-border dark:border-white/10 text-gray-500 dark:text-gray-400" />
//                            </div>
//                        </div>
//                    </div>

//                    <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-100 dark:bg-white/5 border-border dark:border-white/10">
//                        <Button variant="outline" onClick={() => setOpenProfile(false)} className="hover:bg-gray-200 dark:hover:bg-white/10">Cancel</Button>
//                        <Button onClick={saveProfile} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-lg">Save Changes</Button>
//                    </div>
//                </DialogContent>
//            </Dialog>

//            <Dialog open={openLogout} onOpenChange={setOpenLogout}>
//                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border border-border shadow-2xl">
//                    <div className="flex flex-col items-center justify-center px-6 pt-6 pb-4 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-[#020617]">
//                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
//                            <LogOut className="h-6 w-6 text-blue-600" />
//                        </div>
//                        <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">Log out of your account?</h2>
//                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">You&apos;ll need to sign in again to access your dashboard.</p>
//                    </div>
//                    <div className="flex gap-3 px-6 py-5 bg-white dark:bg-[#020617]">
//                        <button
//                            onClick={() => setOpenLogout(false)}
//                            className="w-1/2 py-2.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition"
//                        >
//                            Cancel
//                        </button>
//                        <button
//                            onClick={() => {
//                                localStorage.clear()
//                                window.location.href = "/"
//                            }}
//                            className="w-1/2 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition"
//                        >
//                            Log out
//                        </button>
//                    </div>
//                </DialogContent>
//            </Dialog>
//        </>
//    )
//}

//function EmptyState() {
//    return (
//        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
//            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center mb-3">
//                <Bell className="h-6 w-6 text-gray-300 dark:text-gray-600" />
//            </div>
//            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">All caught up!</p>
//            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">No new notifications right now</p>
//        </div>
//    )
//}

//export function registerCalendarReminder(
//    eventId: string,
//    eventTitle: string,
//    eventDateStr: string,
//    reminderType: string,
//    userId: string
//) {
//    const existing: LocalEventNotification[] = parseStoredNotifications()
//    const filtered = existing.filter((n) => n.eventId !== eventId || n.type !== "calendar")

//    const entry: LocalEventNotification = {
//        id: `${eventId}-calendar`,
//        eventId,
//        eventTitle,
//        userId,
//        type: "calendar",
//        createdAt: new Date().toISOString(),
//        isRead: false,
//        eventDate: eventDateStr,
//        triggered_at: false,
//        triggered_5: false,
//        triggered_10: false,
//    }

//    const types = reminderType.split("+")

//    if (types.includes("at")) {
//        entry.triggerTime_at = calcTriggerTime(eventDateStr, 0)
//    }
//    if (types.includes("5")) {
//        entry.triggerTime_5 = calcTriggerTime(eventDateStr, 5)
//    }
//    if (types.includes("10")) {
//        entry.triggerTime_10 = calcTriggerTime(eventDateStr, 10)
//    }

//    filtered.push(entry)
//    writeStoredNotifications(filtered)
//    window.dispatchEvent(new Event("new-notification"))
//}

//export function registerLegacyReminder(
//    eventId: string,
//    eventTitle: string,
//    eventDateStr: string,
//    reminderMinutes: number,
//    userId: string
//) {
//    registerCalendarReminder(
//        eventId,
//        eventTitle,
//        eventDateStr,
//        reminderMinutes === 0 ? "at" : String(reminderMinutes),
//        userId
//    )
//}
















//"use client"

//import { type ChangeEvent, useEffect, useRef, useState } from "react"
//import { Bell, Menu, User, Video, ArrowLeft, LogOut, CheckCheck, Clock, Check, X } from "lucide-react"
//import * as signalR from "@microsoft/signalr"

//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import {
//    Dialog,
//    DialogContent,
//} from "@/components/ui/dialog"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"

//interface DashboardHeaderProps {
//    onMenuClick: () => void
//    title: string
//}

//interface Notification {
//    id: number
//    fromUserId: string
//    fromUserName: string
//    toUserId: string
//    content: string
//    status: string
//    isRead: boolean
//    createdAt?: string
//    type: string
//    meetingLink?: string | null
//    title?: string
//    eventDate?: string
//}

//interface Meeting {
//    id: string
//    title: string
//    startTime: string
//    meetingLink: string
//    createdByName?: string
//    isRead?: boolean
//    createdAt?: string
//}

//interface LocalEventNotification {
//    id: string | number
//    userId: string
//    type: string
//    isRead: boolean
//    createdAt: string
//    content?: string
//    eventId?: string
//    eventTitle?: string
//    eventDate?: string
//    eventTime?: string
//    location?: string
//    message?: string
//    text?: string
//    triggerTime?: number
//    triggered?: boolean
//    triggerTime_at?: number
//    triggerTime_5?: number
//    triggerTime_10?: number
//    triggered_at?: boolean
//    triggered_5?: boolean
//    triggered_10?: boolean
//    meetingLink?: string
//    fromUserName?: string
//    category?: string
//    attachmentCount?: number
//    priority?: string
//    statusLabel?: string
//}

//function normalizeNotificationType(type?: string, content?: string) {
//    const normalizedType = (type || "").toLowerCase()
//    const normalizedContent = (content || "").toLowerCase()

//    if ([
//        "note_created",
//        "note_updated",
//        "note_deleted",
//        "task_created",
//        "task_updated",
//        "task_deleted",
//        "task_status_updated",
//    ].includes(normalizedType)) {
//        return normalizedType
//    }

//    if (normalizedType === "note") return "note_created"
//    if (normalizedContent.includes("shared note") || normalizedContent.includes("shared a note")) return "note_created"
//    if (normalizedContent.includes("updated note")) return "note_updated"
//    if (normalizedContent.includes("deleted note")) return "note_deleted"
//    if (normalizedType === "task") return "task_created"
//    if (normalizedContent.includes("assigned you a new task")) return "task_created"
//    if (normalizedContent.includes("created task")) return "task_created"
//    if (normalizedContent.includes("updated task")) return "task_updated"
//    if (normalizedContent.includes("deleted task")) return "task_deleted"
//    if (normalizedContent.includes("changed task status")) return "task_status_updated"

//    return type || "info"
//}

//function calcTriggerTime(eventDateStr: string, reminderMinutes: number): number {
//    const eventMs = new Date(eventDateStr).getTime()
//    return eventMs - reminderMinutes * 60 * 1000
//}

//function reminderLabel(minutes: number): string {
//    if (minutes === 0) return "at event time"
//    return `${minutes} minute${minutes > 1 ? "s" : ""} before`
//}

//function parseStoredNotifications(): LocalEventNotification[] {
//    if (typeof window === "undefined") return []

//    try {
//        return JSON.parse(localStorage.getItem("globalNotifications") || "[]")
//    } catch {
//        return []
//    }
//}

//function writeStoredNotifications(items: LocalEventNotification[]) {
//    localStorage.setItem("globalNotifications", JSON.stringify(items))
//}

//function isTriggeredReminder(notification: LocalEventNotification) {
//    return Boolean(
//        notification.triggered ||
//        notification.triggered_at ||
//        notification.triggered_5 ||
//        notification.triggered_10
//    )
//}

//function isReminderNotification(notification: LocalEventNotification) {
//    return Boolean(
//        notification.type === "calendar" ||
//        notification.triggerTime ||
//        notification.triggerTime_at ||
//        notification.triggerTime_5 ||
//        notification.triggerTime_10
//    )
//}

//function isDisplayableLocalNotification(notification: LocalEventNotification) {
//    if (isReminderNotification(notification)) return isTriggeredReminder(notification)
//    return true
//}

//function formatEventDateTime(date?: string, time?: string) {
//    if (!date && !time) return ""

//    const datePart = date
//        ? new Date(date).toLocaleDateString([], {
//            day: "2-digit",
//            month: "short",
//            year: "numeric",
//        })
//        : ""

//    if (datePart && time) return `${datePart} at ${time}`
//    return datePart || time || ""
//}

//function buildEventNotificationMessage(notification: LocalEventNotification) {
//    const details = formatEventDateTime(notification.eventDate, notification.eventTime)
//    const title = notification.eventTitle || "Event"

//    if (notification.message) return notification.message
//    if (notification.text) return notification.text

//    switch (notification.type) {
//        case "event_created":
//            return `${title} has been created${details ? ` for ${details}` : ""}.`
//        case "event_updated":
//            return `${title} has been updated${details ? ` to ${details}` : ""}.`
//        case "event_deleted":
//            return `${title} has been deleted${details ? ` from ${details}` : ""}.`
//        default:
//            return title
//    }
//}

//function buildMeetingNotificationMessage(notification: LocalEventNotification) {
//    const title = notification.eventTitle || "Meeting"
//    const details = formatEventDateTime(notification.eventDate, notification.eventTime)
//    const sender = notification.fromUserName || "HR"

//    if (notification.message) return notification.message
//    if (notification.text) return notification.text

//    switch (notification.type) {
//        case "meeting_created":
//            return `${sender} scheduled "${title}"${details ? ` for ${details}` : ""}.`
//        case "meeting_updated":
//            return `${sender} updated "${title}"${details ? ` to ${details}` : ""}.`
//        case "meeting_deleted":
//            return `${sender} cancelled "${title}"${details ? ` scheduled for ${details}` : ""}.`
//        default:
//            return title
//    }
//}

//function buildNoteNotificationMessage(notification: LocalEventNotification) {
//    const title = notification.eventTitle || "Note"
//    const sender = notification.fromUserName || "HR"
//    const category = notification.category ? ` in ${notification.category}` : ""
//    const attachmentText =
//        typeof notification.attachmentCount === "number" && notification.attachmentCount > 0
//            ? ` with ${notification.attachmentCount} attachment${notification.attachmentCount > 1 ? "s" : ""}`
//            : ""

//    if (notification.message) return notification.message
//    if (notification.text) return notification.text

//    switch (notification.type) {
//        case "note_created":
//            return `${sender} shared note "${title}"${category}${attachmentText}.`
//        case "note_updated":
//            return `${sender} updated note "${title}"${category}${attachmentText}.`
//        case "note_deleted":
//            return `${sender} deleted note "${title}".`
//        default:
//            return title
//    }
//}

//function buildTaskNotificationMessage(notification: LocalEventNotification) {
//    const title = notification.eventTitle || "Task"
//    const sender = notification.fromUserName || "HR"
//    const priority = notification.priority ? ` (${notification.priority})` : ""
//    const statusLabel = notification.statusLabel ? ` to ${notification.statusLabel}` : ""

//    if (notification.message) return notification.message
//    if (notification.text) return notification.text

//    switch (notification.type) {
//        case "task_created":
//            return `${sender} assigned task "${title}"${priority}.`
//        case "task_updated":
//            return `${sender} updated task "${title}"${priority}.`
//        case "task_deleted":
//            return `${sender} deleted task "${title}".`
//        case "task_status_updated":
//            return `${sender} changed task "${title}" status${statusLabel}.`
//        default:
//            return title
//    }
//}

//export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {
//    const [name, setName] = useState("")
//    const [mounted, setMounted] = useState(false)
//    const [email, setEmail] = useState("")
//    const [nickname, setNickname] = useState("")
//    const [mobile, setMobile] = useState("")
//    const [country, setCountry] = useState("")
//    const [gender, setGender] = useState("")
//    const [image, setImage] = useState<string | null>(null)
//    const [openProfile, setOpenProfile] = useState(false)

//    const [chatNotifs, setChatNotifs] = useState<Notification[]>([])
//    const [meetingNotifs, setMeetingNotifs] = useState<Meeting[]>([])
//    const [localEventNotifs, setLocalEventNotifs] = useState<LocalEventNotification[]>([])
//    const [showNotifications, setShowNotifications] = useState(false)
//    const [expandedNotifications, setExpandedNotifications] = useState(false)
//    const notifPanelRef = useRef<HTMLDivElement>(null)

//    const [currentUserId, setCurrentUserId] = useState("")
//    const [openLogout, setOpenLogout] = useState(false)
//    const [userRole, setUserRole] = useState("")

//    const [reminderToast, setReminderToast] = useState<{ title: string; body: string } | null>(null)

//    const getMeetingReadIds = () => {
//        const userId = localStorage.getItem("userId")
//        return JSON.parse(localStorage.getItem(`readMeetings_${userId}`) || "[]")
//    }

//    const saveMeetingReadIds = (ids: string[]) => {
//        const userId = localStorage.getItem("userId")
//        localStorage.setItem(`readMeetings_${userId}`, JSON.stringify(ids))
//    }

//    const formatDateOnly = (dateString?: string) => {
//        if (!dateString) return ""
//        return new Date(dateString).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" })
//    }

//    const formatTimeOnly = (dateString?: string) => {
//        if (!dateString) return ""
//        return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//    }

//    const formatEventText = (n: LocalEventNotification) => {
//        const baseDate = n.eventDate || n.createdAt
//        const date = new Date(baseDate)

//        const today = new Date()
//        const yesterday = new Date()
//        yesterday.setDate(today.getDate() - 1)

//        let dayLabel = date.toLocaleDateString([], {
//            day: "2-digit",
//            month: "short",
//            year: "numeric",
//        })

//        if (date.toDateString() === today.toDateString()) {
//            dayLabel = "Today"
//        } else if (date.toDateString() === yesterday.toDateString()) {
//            dayLabel = "Yesterday"
//        }

//        const timeLabel = n.eventTime || date.toLocaleTimeString([], {
//            hour: "2-digit",
//            minute: "2-digit",
//        })

//        return `Reminder: "${n.eventTitle || "Event"}" at ${timeLabel} (${dayLabel})`
//    }

//    const cleanUUID = (text: string) =>
//        (text || "").replace(/^[0-9a-fA-F-]{36}\s*/, "").trim()

//    const getReadIds = () => {
//        if (typeof window === "undefined") return []
//        const userId = localStorage.getItem("userId")
//        return JSON.parse(localStorage.getItem(`readNotifications_${userId}`) || "[]")
//    }

//    const saveReadIds = (ids: number[]) => {
//        const userId = localStorage.getItem("userId")
//        localStorage.setItem(`readNotifications_${userId}`, JSON.stringify(ids))
//    }

//    useEffect(() => {
//        const handleClickOutside = (e: MouseEvent) => {
//            if (notifPanelRef.current && !notifPanelRef.current.contains(e.target as Node)) {
//                setShowNotifications(false)
//            }
//        }

//        if (showNotifications) document.addEventListener("mousedown", handleClickOutside)
//        return () => document.removeEventListener("mousedown", handleClickOutside)
//    }, [showNotifications])

//    useEffect(() => {
//        setMounted(true)
//    }, [])

//    useEffect(() => {
//        const role = localStorage.getItem("role") || ""
//        setUserRole(role)
//    }, [])

//    useEffect(() => {
//        const id = localStorage.getItem("userId") || ""
//        setCurrentUserId(id)
//        const storedName = localStorage.getItem("name") || ""
//        setName(storedName)
//    }, [])

//    useEffect(() => {
//        const role = (localStorage.getItem("role") || "").toLowerCase()
//        if (role !== "employee" && role !== "professional") return

//        const connection = new signalR.HubConnectionBuilder()
//            .withUrl("https://steadfast-warmth-production-64c8.up.railway.app/chatHub", {
//                accessTokenFactory: () => localStorage.getItem("token") || "",
//            })
//            .withAutomaticReconnect()
//            .build()

//        connection.start().catch((err) => console.error("SignalR Error:", err))

//        connection.on("ReceiveNotification", (data) => {
//            const notifType = normalizeNotificationType(data.type, data.content)

//            if (notifType === "announcement") {
//                const hrName = cleanUUID(data.createdByName || data.fromUserName || "HR")
//                const announcementTitle = cleanUUID(data.title || "Announcement")

//                setChatNotifs((prev) => [
//                    {
//                        id: Date.now(),
//                        fromUserId: data.fromUserId || "system",
//                        fromUserName: hrName,
//                        toUserId: currentUserId,
//                        content: `${hrName} shared an announcement: ${announcementTitle}`,
//                        status: "info",
//                        type: "announcement",
//                        isRead: false,
//                        createdAt: data.createdAt || new Date().toISOString(),
//                        title: announcementTitle,
//                        eventDate: data.startTime || data.dateTime || undefined,
//                    },
//                    ...prev,
//                ])
//                return
//            }

//            if (["note_created", "note_updated", "note_deleted", "task_created", "task_updated", "task_deleted", "task_status_updated"].includes(notifType)) {
//                setChatNotifs((prev) => [
//                    {
//                        id: Date.now(),
//                        fromUserId: data.fromUserId || "system",
//                        fromUserName: cleanUUID(data.fromUserName || data.createdByName || "HR"),
//                        toUserId: currentUserId,
//                        content: cleanUUID(data.content || ""),
//                        status: "info",
//                        type: notifType,
//                        isRead: false,
//                        createdAt: data.createdAt || new Date().toISOString(),
//                        title: cleanUUID(data.title || (notifType.startsWith("note_") ? "Note" : "Task")),
//                    },
//                    ...prev,
//                ])
//                return
//            }

//            const cleanTitle = cleanUUID(data.title || "")
//            const startTime = data.startTime || data.dateTime || null

//            const formattedDate = startTime
//                ? new Date(startTime).toLocaleDateString([], {
//                    day: "2-digit",
//                    month: "short",
//                    year: "numeric",
//                })
//                : ""

//            const formattedTime = startTime
//                ? new Date(startTime).toLocaleTimeString([], {
//                    hour: "2-digit",
//                    minute: "2-digit",
//                })
//                : ""

//            setChatNotifs((prev) => [
//                {
//                    id: Date.now(),
//                    fromUserId: data.fromUserId || "system",
//                    fromUserName: data.createdByName || "HR",
//                    toUserId: currentUserId,
//                    content: `${cleanTitle} scheduled on ${formattedDate} at ${formattedTime}`,
//                    meetingLink: data.meetingLink || data.link || null,
//                    status: "info",
//                    type: "meeting",
//                    isRead: false,
//                    createdAt: data.createdAt || new Date().toISOString(),
//                    eventDate: startTime || undefined,
//                },
//                ...prev,
//            ])
//        })

//        return () => {
//            connection.stop()
//        }
//    }, [currentUserId])

//    useEffect(() => {
//        const loadProfile = async () => {
//            try {
//                const token = localStorage.getItem("token")
//                if (!token) return

//                const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Account/profile", {
//                    headers: { Authorization: `Bearer ${token}` },
//                })

//                if (res.status === 401) {
//                    localStorage.removeItem("token")
//                    window.location.href = "/"
//                    return
//                }

//                if (!res.ok) return

//                const data = await res.json()
//                const finalName = data.name || data.fullName || localStorage.getItem("name") || ""

//                setName(finalName)
//                localStorage.setItem("name", finalName)
//                setEmail(data.email || "")
//                setNickname(data.nickname || "")
//                setMobile(data.mobile || "")
//                setCountry(data.country || "")
//                setGender(data.gender || "")
//                setImage(data.profileImage || null)
//            } catch (err) {
//                console.error("Profile load error:", err)
//            }
//        }

//        loadProfile()
//    }, [])

//    const fetchNotifications = async () => {
//        try {
//            const res = await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/${currentUserId}`
//            )
//            const data = await res.json()
//            const role = localStorage.getItem("role")
//            const filtered = role === "employee"
//                ? data
//                : data.filter((n: Notification) => n.type !== "announcement")
//            const readIds = getReadIds()

//            const buildMessage = (n: Notification) => {
//                const normalizedType = normalizeNotificationType(n.type, n.content)

//                if (normalizedType === "meeting") {
//                    const date = new Date(n.createdAt || "")
//                    const formattedDate = date.toLocaleDateString([], {
//                        day: "2-digit",
//                        month: "short",
//                        year: "numeric",
//                    })
//                    const formattedTime = date.toLocaleTimeString([], {
//                        hour: "2-digit",
//                        minute: "2-digit",
//                    })

//                    return `${cleanUUID(n.content)} • ${formattedDate} at ${formattedTime}`
//                }

//                return cleanUUID(n.content)
//            }

//            setChatNotifs(
//                filtered.map((n: Notification) => ({
//                    ...n,
//                    type: normalizeNotificationType(n.type, n.content),
//                    fromUserName: cleanUUID(n.fromUserName),
//                    content: buildMessage(n),
//                    createdAt: n.createdAt || new Date().toISOString(),
//                    eventDate: n.eventDate || (n as any).startTime || (n as any).dateTime || undefined,
//                    isRead: readIds.includes(n.id) ? true : n.isRead,
//                }))
//            )
//        } catch {
//            setChatNotifs([])
//        }
//    }

//    const fetchMeetings = async () => {
//        try {
//            const token = localStorage.getItem("token")
//            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/meeting/my-meetings", {
//                headers: { Authorization: `Bearer ${token}` },
//            })
//            const data = await res.json()
//            const now = new Date()
//            const upcoming = data.filter((m: Meeting) => new Date(m.startTime) > now)
//            const readIds = getMeetingReadIds()

//            setMeetingNotifs(upcoming.map((m: Meeting) => ({
//                ...m,
//                isRead: readIds.includes(m.id),
//                createdAt: m.createdAt || m.startTime,
//                createdByName: m.createdByName || "HR",
//            })))
//        } catch {
//            setMeetingNotifs([])
//        }
//    }

//    useEffect(() => {
//        if (!currentUserId) return

//        fetchNotifications()
//        fetchMeetings()

//        const refresh = () => {
//            fetchNotifications()
//            fetchMeetings()
//        }

//        const interval = setInterval(() => {
//            fetchNotifications()
//            fetchMeetings()
//        }, 3000)

//        window.addEventListener("chat-updated", refresh)
//        window.addEventListener("request-updated", refresh)

//        return () => {
//            clearInterval(interval)
//            window.removeEventListener("chat-updated", refresh)
//            window.removeEventListener("request-updated", refresh)
//        }
//    }, [currentUserId, userRole])

//    const loadGlobalNotifications = () => {
//        const currentUser = localStorage.getItem("userId")
//        const data = parseStoredNotifications()
//        const filtered = data.filter((n) => n.userId === currentUser)
//        setLocalEventNotifs(filtered)
//    }

//    useEffect(() => {
//        loadGlobalNotifications()

//        const handler = () => loadGlobalNotifications()
//        window.addEventListener("new-notification", handler)

//        return () => window.removeEventListener("new-notification", handler)
//    }, [])

//    useEffect(() => {
//        const interval = setInterval(() => {
//            const now = Date.now()
//            const currentUser = localStorage.getItem("userId")
//            const data = parseStoredNotifications()

//            let changed = false
//            const updated = data.map((n) => {
//                if (n.userId !== currentUser) return n
//                if (!isReminderNotification(n)) return n

//                if (!n.triggered_at && n.triggerTime_at && now >= n.triggerTime_at) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", `Reminder: "${n.eventTitle || "Event"}" is happening ${reminderLabel(0)}.`)
//                    return { ...n, triggered_at: true, isRead: false }
//                }

//                if (!n.triggered_5 && n.triggerTime_5 && now >= n.triggerTime_5) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", `Reminder: "${n.eventTitle || "Event"}" starts ${reminderLabel(5)}.`)
//                    return { ...n, triggered_5: true, isRead: false }
//                }

//                if (!n.triggered_10 && n.triggerTime_10 && now >= n.triggerTime_10) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", `Reminder: "${n.eventTitle || "Event"}" starts ${reminderLabel(10)}.`)
//                    return { ...n, triggered_10: true, isRead: false }
//                }

//                if (n.triggerTime && !n.triggered && now >= n.triggerTime) {
//                    changed = true
//                    showReminderToast(n.eventTitle || "Event", n.text || `Reminder: "${n.eventTitle || "Event"}" is coming up.`)
//                    return { ...n, triggered: true, isRead: false }
//                }

//                return n
//            })

//            if (changed) {
//                writeStoredNotifications(updated)
//                setLocalEventNotifs(updated.filter((n) => n.userId === currentUser))
//            }
//        }, 30000)

//        return () => clearInterval(interval)
//    }, [])

//    const showReminderToast = (toastTitle: string, body: string) => {
//        setReminderToast({ title: toastTitle, body })
//        setTimeout(() => setReminderToast(null), 6000)
//    }

//    const handleChatRequest = async (notifId: number, status: "accepted" | "rejected") => {
//        try {
//            await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/${notifId}`,
//                {
//                    method: "PUT",
//                    headers: { "Content-Type": "application/json" },
//                    body: JSON.stringify(status),
//                }
//            )

//            if (status === "accepted") {
//                await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/chat/create", {
//                    method: "POST",
//                    headers: { "Content-Type": "application/json" },
//                    body: JSON.stringify({ notificationId: notifId }),
//                })
//                window.dispatchEvent(new Event("chat-updated"))
//            }

//            const original = chatNotifs.find((n) => n.id === notifId)
//            if (original) {
//                const myName = localStorage.getItem("name") || "Someone"
//                const statusMsg =
//                    status === "accepted"
//                        ? `${myName} accepted your chat request`
//                        : `${myName} rejected your chat request`

//                await fetch(
//                    "https://steadfast-warmth-production-64c8.up.railway.app/api/notifications",
//                    {
//                        method: "POST",
//                        headers: { "Content-Type": "application/json" },
//                        body: JSON.stringify({
//                            fromUserId: currentUserId,
//                            fromUserName: myName,
//                            toUserId: original.fromUserId,
//                            content: statusMsg,
//                            type: status === "accepted" ? "chat_accepted" : "chat_rejected",
//                            status: "info",
//                            isRead: false,
//                        }),
//                    }
//                )
//            }

//            setChatNotifs((prev) => prev.filter((n) => n.id !== notifId))
//            window.dispatchEvent(new Event("chat-updated"))
//            window.dispatchEvent(new Event("request-updated"))
//            await fetchNotifications()
//        } catch (err) {
//            console.error("Chat request error:", err)
//        }
//    }

//    const markAllRead = async () => {
//        try {
//            await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/mark-read/${currentUserId}`,
//                { method: "PUT" }
//            )

//            setChatNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })))
//            setMeetingNotifs((prev) => prev.map((m) => ({ ...m, isRead: true })))
//            saveMeetingReadIds(meetingNotifs.map((m) => m.id))
//            saveReadIds(chatNotifs.map((n) => n.id))

//            const currentUser = localStorage.getItem("userId")
//            const allStored = parseStoredNotifications()
//            const updatedStored = allStored.map((item) =>
//                item.userId === currentUser && isDisplayableLocalNotification(item)
//                    ? { ...item, isRead: true }
//                    : item
//            )

//            writeStoredNotifications(updatedStored)
//            setLocalEventNotifs(updatedStored.filter((item) => item.userId === currentUser))
//        } catch (err) {
//            console.error("Mark read error:", err)
//        }
//    }

//    const saveProfile = async () => {
//        try {
//            const token = localStorage.getItem("token")
//            await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Account/profile", {
//                method: "PUT",
//                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//                body: JSON.stringify({ name, nickname, gender, country, mobile, profileImage: image }),
//            })
//            setOpenProfile(false)
//        } catch (err) {
//            console.error("Profile save error:", err)
//        }
//    }

//    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
//        const file = e.target.files?.[0]
//        if (!file) return

//        const reader = new FileReader()
//        reader.onloadend = () => setImage(reader.result as string)
//        reader.readAsDataURL(file)
//    }

//    const initials = name
//        ? name.split(" ").map((part) => part[0]).join("").toUpperCase()
//        : "U"

//    const unreadChatCount = chatNotifs.filter((n) => !n.isRead).length
//    const unreadMeetingCount = meetingNotifs.filter((m) => !m.isRead).length
//    const unreadLocalEventCount = localEventNotifs.filter((n) => isDisplayableLocalNotification(n) && !n.isRead).length
//    const totalCount = unreadChatCount + unreadMeetingCount + unreadLocalEventCount

//    const buildGroupedNotifs = () => {
//        let allNotifs: any[] = [
//            ...localEventNotifs.filter(isDisplayableLocalNotification),
//            ...chatNotifs,
//            ...meetingNotifs.map((m) => ({
//                ...m,
//                type: "meeting",
//                content: m.title,
//                createdAt: m.createdAt || m.startTime,
//                fromUserName: `HR (${m.createdByName || "HR"})`,
//                createdByName: m.createdByName || "HR",
//                meetingLink: m.meetingLink,
//                eventDate: m.startTime,
//            })),
//        ].sort((a: any, b: any) =>
//            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
//        )

//        if (!expandedNotifications) allNotifs = allNotifs.slice(0, 5)

//        const today = new Date()
//        const yesterday = new Date()
//        yesterday.setDate(today.getDate() - 1)

//        const getGroupLabel = (dateStr: string) => {
//            const d = new Date(dateStr)
//            if (d.toDateString() === today.toDateString()) return "Today"
//            if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
//            return formatDateOnly(dateStr)
//        }

//        const grouped: Record<string, any[]> = {}
//        allNotifs.forEach((n: any) => {
//            const label = getGroupLabel(n.createdAt)
//            if (!grouped[label]) grouped[label] = []
//            grouped[label].push(n)
//        })

//        return grouped
//    }

//    const getNotifIcon = (n: any) => {
//        if (n.type === "chat_request") return "💬"
//        if (n.type === "chat_accepted") return "✅"
//        if (n.type === "chat_rejected") return "❌"
//        if (n.type === "announcement") return "📢"
//        if (n.type === "task_created") return "📋"
//        if (n.type === "task_updated") return "🛠️"
//        if (n.type === "task_deleted") return "🗑️"
//        if (n.type === "task_status_updated") return "✅"
//        if (n.type === "note_created") return "📝"
//        if (n.type === "note_updated") return "✍️"
//        if (n.type === "note_deleted") return "🗑️"
//        if (n.type === "meeting_created") return "📅"
//        if (n.type === "meeting_updated") return "📝"
//        if (n.type === "meeting_deleted") return "🚫"
//        if (n.type === "event_created") return "🆕"
//        if (n.type === "event_updated") return "✏️"
//        if (n.type === "event_deleted") return "🗑️"
//        if (n.eventDate || n.type === "calendar") return "⏰"
//        if (n.type === "meeting") return "📅"
//        return "🔔"
//    }

//    const getNotifAccent = (n: any) => {
//        if (n.type === "chat_accepted") return "green"
//        if (n.type === "chat_rejected") return "red"
//        if (n.type === "task_created") return "blue"
//        if (n.type === "task_updated") return "blue"
//        if (n.type === "task_deleted") return "red"
//        if (n.type === "task_status_updated") return "green"
//        if (n.type === "note_created") return "green"
//        if (n.type === "note_updated") return "blue"
//        if (n.type === "note_deleted") return "red"
//        if (n.type === "meeting_deleted") return "red"
//        if (n.type === "meeting_created") return "blue"
//        if (n.type === "meeting_updated") return "blue"
//        if (n.type === "event_deleted") return "red"
//        if (n.type === "event_created") return "green"
//        if (n.type === "event_updated") return "blue"
//        if (n.type === "chat_request") return "purple"
//        if (n.type === "announcement") return "purple"
//        if (n.type === "meeting" || (n.content || "").includes("📅")) return "blue"
//        if (n.eventDate || n.type === "calendar") return "amber"
//        return "gray"
//    }

//    const hasNotifications = chatNotifs.length > 0 ||
//        meetingNotifs.length > 0 ||
//        localEventNotifs.some(isDisplayableLocalNotification)

//    if (!mounted) return null

//    const grouped = buildGroupedNotifs()

//    return (
//        <>
//            {reminderToast && (
//                <div
//                    className="
//                        fixed top-5 right-5 z-[9999]
//                        bg-amber-500 text-white
//                        rounded-2xl shadow-2xl
//                        px-5 py-4 max-w-sm
//                        flex items-start gap-3
//                        animate-in slide-in-from-top-2 duration-300
//                    "
//                >
//                    <span className="text-2xl">⏰</span>
//                    <div>
//                        <p className="font-semibold text-sm">{reminderToast.title}</p>
//                        <p className="text-xs opacity-90 mt-0.5">{reminderToast.body}</p>
//                    </div>
//                    <button onClick={() => setReminderToast(null)} className="ml-auto text-white/70 hover:text-white">
//                        <X className="h-4 w-4" />
//                    </button>
//                </div>
//            )}

//            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">
//                <div className="flex items-center gap-3">
//                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
//                        <Menu className="h-5 w-5" />
//                    </Button>
//                    <h1 className="font-semibold">{title}</h1>
//                </div>

//                <div className="flex items-center gap-2">
//                    <ThemeToggle />

//                    <div className="relative" ref={notifPanelRef}>
//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            className="relative"
//                            onClick={async () => {
//                                const opening = !showNotifications
//                                setShowNotifications(opening)
//                                if (opening) await markAllRead()
//                            }}
//                        >
//                            <Bell className="h-4 w-4" />
//                            {totalCount > 0 && (
//                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold px-1 rounded-full flex items-center justify-center leading-none">
//                                    {totalCount > 99 ? "99+" : totalCount}
//                                </span>
//                            )}
//                        </Button>

//                        {showNotifications && (
//                            <div
//                                className="
//                                    absolute right-0 top-[calc(100%+8px)]
//                                    w-[400px]
//                                    bg-white dark:bg-[#0d1117]
//                                    border border-gray-200 dark:border-white/10
//                                    rounded-2xl shadow-2xl z-50
//                                    flex flex-col overflow-hidden
//                                    max-h-[85vh]
//                                "
//                                style={{ boxShadow: "0 20px 60px -10px rgba(0,0,0,0.18), 0 4px 16px -4px rgba(0,0,0,0.12)" }}
//                            >
//                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/8 bg-white dark:bg-[#0d1117]">
//                                    <div className="flex items-center gap-2.5">
//                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
//                                            <Bell className="h-3.5 w-3.5 text-white" />
//                                        </div>
//                                        <div>
//                                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">Notifications</h4>
//                                            {totalCount > 0 && (
//                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">{totalCount} unread</p>
//                                            )}
//                                        </div>
//                                    </div>
//                                    <button
//                                        onClick={markAllRead}
//                                        className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
//                                    >
//                                        <CheckCheck className="h-3 w-3" />
//                                        Mark all read
//                                    </button>
//                                </div>

//                                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
//                                    {hasNotifications ? (
//                                        Object.keys(grouped).length > 0 ? (
//                                            Object.keys(grouped).map((group, gIdx) => (
//                                                <div key={gIdx}>
//                                                    <div className="flex items-center gap-3 px-5 pt-4 pb-2">
//                                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">{group}</span>
//                                                        <div className="flex-1 h-px bg-gray-100 dark:bg-white/6" />
//                                                    </div>

//                                                    {grouped[group].map((n: any, i: number) => {
//                                                        const isUnread = !n.isRead
//                                                        const accent = getNotifAccent(n)
//                                                        const icon = getNotifIcon(n)
//                                                        const isMeeting = n.type === "meeting" || (n.content || "").includes("📅")
//                                                        const isReminder = isReminderNotification(n)
//                                                        const isTaskActivity = ["task_created", "task_updated", "task_deleted", "task_status_updated"].includes(n.type)
//                                                        const isNoteActivity = ["note_created", "note_updated", "note_deleted"].includes(n.type)
//                                                        const isMeetingActivity = ["meeting_created", "meeting_updated", "meeting_deleted"].includes(n.type)
//                                                        const isEventActivity = ["event_created", "event_updated", "event_deleted"].includes(n.type)
//                                                        const isChatRequest = n.type === "chat_request" && n.status === "pending"

//                                                        const accentMap: Record<string, string> = {
//                                                            blue: "bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400",
//                                                            amber: "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400",
//                                                            green: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
//                                                            red: "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400",
//                                                            purple: "bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400",
//                                                            gray: "bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-gray-400",
//                                                        }

//                                                        const dotMap: Record<string, string> = {
//                                                            blue: "bg-blue-500",
//                                                            amber: "bg-amber-500",
//                                                            green: "bg-emerald-500",
//                                                            red: "bg-red-500",
//                                                            purple: "bg-purple-500",
//                                                            gray: "bg-gray-400",
//                                                        }

//                                                        const senderName = (() => {
//                                                            if (isTaskActivity) {
//                                                                return cleanUUID(n.fromUserName || "HR")
//                                                            }

//                                                            if (isNoteActivity) {
//                                                                return cleanUUID(n.fromUserName || "HR")
//                                                            }

//                                                            if (isMeetingActivity) {
//                                                                return cleanUUID(n.fromUserName || n.createdByName || "HR")
//                                                            }

//                                                            if (isEventActivity || isReminder) return "Events"

//                                                            if (n.type === "meeting") {
//                                                                const actualName = cleanUUID(n.createdByName || n.fromUserName || "")
//                                                                if (!actualName || actualName.toLowerCase() === "hr") return "HR"
//                                                                return `HR (${actualName})`
//                                                            }

//                                                            return cleanUUID(n.fromUserName || "")
//                                                        })()

//                                                        const rawContent: string = n.content || ""
//                                                        const meetingDate = n.eventDate || n.startTime || n.createdAt
//                                                        const eventMessage = isTaskActivity
//                                                            ? rawContent || buildTaskNotificationMessage(n)
//                                                            : isNoteActivity
//                                                                ? rawContent || buildNoteNotificationMessage(n)
//                                                                : isMeetingActivity
//                                                                    ? buildMeetingNotificationMessage(n)
//                                                                    : isReminder
//                                                                        ? formatEventText(n)
//                                                                        : isEventActivity
//                                                                            ? buildEventNotificationMessage(n)
//                                                                            : rawContent

//                                                        return (
//                                                            <div
//                                                                key={i}
//                                                                className={`
//                                                                    group relative mx-3 mb-1 rounded-xl px-3 py-3 cursor-pointer
//                                                                    transition-all duration-150
//                                                                    ${isUnread
//                                                                        ? "bg-indigo-50/70 dark:bg-indigo-500/8 hover:bg-indigo-50 dark:hover:bg-indigo-500/12"
//                                                                        : "hover:bg-gray-50 dark:hover:bg-white/4"
//                                                                    }
//                                                                `}
//                                                            >
//                                                                <div className="flex gap-3">
//                                                                    <div className="flex-shrink-0 mt-0.5">
//                                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-sm ${accentMap[accent]}`}>
//                                                                            {icon}
//                                                                        </div>
//                                                                    </div>

//                                                                    <div className="flex-1 min-w-0">
//                                                                        <div className="flex items-center justify-between gap-2 mb-0.5">
//                                                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
//                                                                                {senderName || (isMeeting ? "Meeting" : isReminder ? "Reminder" : "Notification")}
//                                                                            </span>
//                                                                            <div className="flex items-center gap-1.5 flex-shrink-0">
//                                                                                <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
//                                                                                    {formatTimeOnly(n.createdAt)}
//                                                                                </span>
//                                                                                {isUnread && (
//                                                                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotMap[accent]}`} />
//                                                                                )}
//                                                                            </div>
//                                                                        </div>

//                                                                        <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-snug line-clamp-2">
//                                                                            {isMeeting
//                                                                                ? meetingDate
//                                                                                    ? `${cleanUUID(n.content).replace("📅", "").trim()}`
//                                                                                    : cleanUUID(n.content).replace("📅", "").trim()
//                                                                                : eventMessage}
//                                                                        </p>

//                                                                        <div className="flex items-center justify-between mt-1.5 gap-2 flex-wrap">
//                                                                            <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
//                                                                                <Clock className="h-2.5 w-2.5" />
//                                                                                {isReminder || isEventActivity || isMeetingActivity || isNoteActivity || isTaskActivity
//                                                                                    ? formatEventDateTime(n.eventDate, n.eventTime) || formatDateOnly(n.createdAt)
//                                                                                    : meetingDate
//                                                                                        ? `${formatDateOnly(meetingDate)}${formatTimeOnly(meetingDate) ? ` • ${formatTimeOnly(meetingDate)}` : ""}`
//                                                                                        : formatDateOnly(n.createdAt)}
//                                                                            </div>

//                                                                            {isChatRequest && (
//                                                                                <div className="flex items-center gap-1.5">
//                                                                                    <button
//                                                                                        onClick={(e) => {
//                                                                                            e.stopPropagation()
//                                                                                            handleChatRequest(n.id, "accepted")
//                                                                                        }}
//                                                                                        className="
//                                                                                            flex items-center gap-1 text-[11px] font-semibold
//                                                                                            bg-emerald-500 hover:bg-emerald-600 text-white
//                                                                                            px-2.5 py-1 rounded-lg transition-colors shadow-sm
//                                                                                        "
//                                                                                    >
//                                                                                        <Check className="h-2.5 w-2.5" />
//                                                                                        Accept
//                                                                                    </button>
//                                                                                    <button
//                                                                                        onClick={(e) => {
//                                                                                            e.stopPropagation()
//                                                                                            handleChatRequest(n.id, "rejected")
//                                                                                        }}
//                                                                                        className="
//                                                                                            flex items-center gap-1 text-[11px] font-semibold
//                                                                                            bg-red-500 hover:bg-red-600 text-white
//                                                                                            px-2.5 py-1 rounded-lg transition-colors shadow-sm
//                                                                                        "
//                                                                                    >
//                                                                                        <X className="h-2.5 w-2.5" />
//                                                                                        Reject
//                                                                                    </button>
//                                                                                </div>
//                                                                            )}

//                                                                            {(isMeeting || isMeetingActivity || n.meetingLink) && n.meetingLink && n.type !== "meeting_deleted" && (
//                                                                                <button
//                                                                                    onClick={(e) => {
//                                                                                        e.stopPropagation()
//                                                                                        window.open(n.meetingLink, "_blank")
//                                                                                    }}
//                                                                                    className="
//                                                                                        flex items-center gap-1 text-[11px] font-semibold
//                                                                                        bg-blue-600 hover:bg-blue-700 text-white
//                                                                                        px-2.5 py-1 rounded-lg transition-colors shadow-sm
//                                                                                    "
//                                                                                >
//                                                                                    <Video className="h-2.5 w-2.5" />
//                                                                                    Join
//                                                                                </button>
//                                                                            )}
//                                                                        </div>
//                                                                    </div>
//                                                                </div>
//                                                            </div>
//                                                        )
//                                                    })}
//                                                </div>
//                                            ))
//                                        ) : (
//                                            <EmptyState />
//                                        )
//                                    ) : (
//                                        <EmptyState />
//                                    )}
//                                    <div className="h-2" />
//                                </div>

//                                <div className="border-t border-gray-100 dark:border-white/8 bg-white dark:bg-[#0d1117] sticky bottom-0">
//                                    <button
//                                        onClick={() => setExpandedNotifications((prev) => !prev)}
//                                        className="w-full px-5 py-3 text-[12px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/8 transition-colors text-center flex items-center justify-center gap-1.5"
//                                    >
//                                        {expandedNotifications ? (
//                                            <>
//                                                <span>Show less</span>
//                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
//                                            </>
//                                        ) : (
//                                            <>
//                                                <span>View all notifications</span>
//                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
//                                            </>
//                                        )}
//                                    </button>
//                                </div>
//                            </div>
//                        )}
//                    </div>

//                    <DropdownMenu>
//                        <DropdownMenuTrigger asChild>
//                            <Button variant="ghost" className="gap-2">
//                                <Avatar className="h-7 w-7">
//                                    {image ? <AvatarImage src={image} /> : <AvatarFallback>{initials}</AvatarFallback>}
//                                </Avatar>
//                                {name || "User"}
//                            </Button>
//                        </DropdownMenuTrigger>
//                        <DropdownMenuContent align="end">
//                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
//                                <User className="mr-2 h-4 w-4" /> Profile
//                            </DropdownMenuItem>
//                            <DropdownMenuSeparator />
//                            <DropdownMenuItem onClick={() => setOpenLogout(true)}>
//                                <LogOut className="mr-2 h-4 w-4" /> Logout
//                            </DropdownMenuItem>
//                        </DropdownMenuContent>
//                    </DropdownMenu>
//                </div>
//            </header>

//            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
//                <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border border-border bg-white text-black dark:bg-gradient-to-br dark:from-[#020617] dark:to-[#0f172a] dark:text-white shadow-2xl">
//                    <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-100 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 border-border dark:border-white/10">
//                        <div className="flex items-center gap-3">
//                            <Button variant="ghost" size="icon" onClick={() => setOpenProfile(false)} className="hover:bg-black/10 dark:hover:bg-white/20">
//                                <ArrowLeft className="h-4 w-4" />
//                            </Button>
//                            <h2 className="text-lg font-semibold tracking-wide">Profile Settings</h2>
//                        </div>
//                    </div>

//                    <div className="p-6 space-y-6">
//                        <div className="flex items-center gap-5">
//                            <label className="cursor-pointer relative group">
//                                <Avatar className="h-20 w-20 border-2 border-indigo-500 shadow-lg">
//                                    {image
//                                        ? <AvatarImage src={image} />
//                                        : <AvatarFallback className="text-lg font-bold bg-indigo-600 text-white">{initials}</AvatarFallback>
//                                    }
//                                </Avatar>
//                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center text-white text-xs font-medium transition">Change</div>
//                                <input type="file" className="hidden" onChange={handleImageUpload} />
//                            </label>
//                            <div>
//                                <p className="text-lg font-semibold">{name}</p>
//                                <p className="text-sm text-muted-foreground">{email}</p>
//                            </div>
//                        </div>

//                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                            <div className="space-y-1">
//                                <Label>Full Name</Label>
//                                <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10 focus-visible:ring-indigo-500" />
//                            </div>
//                            <div className="space-y-1">
//                                <Label>Nick Name</Label>
//                                <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
//                            </div>
//                            <div className="md:col-span-2 space-y-2">
//                                <Label>Gender</Label>
//                                <div className="flex gap-3">
//                                    {["Male", "Female", "Other"].map((g) => (
//                                        <button
//                                            key={g}
//                                            type="button"
//                                            onClick={() => setGender(g)}
//                                            className={`px-4 py-2 rounded-lg border text-sm transition ${gender === g ? "bg-indigo-600 text-white border-indigo-500 shadow-md" : "bg-gray-100 dark:bg-white/5 border-border dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"}`}
//                                        >
//                                            {g}
//                                        </button>
//                                    ))}
//                                </div>
//                            </div>
//                            <div className="space-y-1">
//                                <Label>Mobile</Label>
//                                <Input value={mobile} onChange={(e) => setMobile(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
//                            </div>
//                            <div className="space-y-1">
//                                <Label>Country</Label>
//                                <Input value={country} onChange={(e) => setCountry(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
//                            </div>
//                            <div className="md:col-span-2 space-y-1">
//                                <Label>Email</Label>
//                                <Input value={email} disabled className="bg-gray-200 dark:bg-white/10 border-border dark:border-white/10 text-gray-500 dark:text-gray-400" />
//                            </div>
//                        </div>
//                    </div>

//                    <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-100 dark:bg-white/5 border-border dark:border-white/10">
//                        <Button variant="outline" onClick={() => setOpenProfile(false)} className="hover:bg-gray-200 dark:hover:bg-white/10">Cancel</Button>
//                        <Button onClick={saveProfile} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-lg">Save Changes</Button>
//                    </div>
//                </DialogContent>
//            </Dialog>

//            <Dialog open={openLogout} onOpenChange={setOpenLogout}>
//                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border border-border shadow-2xl">
//                    <div className="flex flex-col items-center justify-center px-6 pt-6 pb-4 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-[#020617]">
//                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
//                            <LogOut className="h-6 w-6 text-blue-600" />
//                        </div>
//                        <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">Log out of your account?</h2>
//                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">You&apos;ll need to sign in again to access your dashboard.</p>
//                    </div>
//                    <div className="flex gap-3 px-6 py-5 bg-white dark:bg-[#020617]">
//                        <button
//                            onClick={() => setOpenLogout(false)}
//                            className="w-1/2 py-2.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition"
//                        >
//                            Cancel
//                        </button>
//                        <button
//                            onClick={() => {
//                                localStorage.clear()
//                                window.location.href = "/"
//                            }}
//                            className="w-1/2 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition"
//                        >
//                            Log out
//                        </button>
//                    </div>
//                </DialogContent>
//            </Dialog>
//        </>
//    )
//}

//function EmptyState() {
//    return (
//        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
//            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center mb-3">
//                <Bell className="h-6 w-6 text-gray-300 dark:text-gray-600" />
//            </div>
//            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">All caught up!</p>
//            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">No new notifications right now</p>
//        </div>
//    )
//}

//export function registerCalendarReminder(
//    eventId: string,
//    eventTitle: string,
//    eventDateStr: string,
//    reminderType: string,
//    userId: string
//) {
//    const existing: LocalEventNotification[] = parseStoredNotifications()
//    const filtered = existing.filter((n) => n.eventId !== eventId || n.type !== "calendar")

//    const entry: LocalEventNotification = {
//        id: `${eventId}-calendar`,
//        eventId,
//        eventTitle,
//        userId,
//        type: "calendar",
//        createdAt: new Date().toISOString(),
//        isRead: false,
//        eventDate: eventDateStr,
//        triggered_at: false,
//        triggered_5: false,
//        triggered_10: false,
//    }

//    const types = reminderType.split("+")

//    if (types.includes("at")) {
//        entry.triggerTime_at = calcTriggerTime(eventDateStr, 0)
//    }
//    if (types.includes("5")) {
//        entry.triggerTime_5 = calcTriggerTime(eventDateStr, 5)
//    }
//    if (types.includes("10")) {
//        entry.triggerTime_10 = calcTriggerTime(eventDateStr, 10)
//    }

//    filtered.push(entry)
//    writeStoredNotifications(filtered)
//    window.dispatchEvent(new Event("new-notification"))
//}

//export function registerLegacyReminder(
//    eventId: string,
//    eventTitle: string,
//    eventDateStr: string,
//    reminderMinutes: number,
//    userId: string
//) {
//    registerCalendarReminder(
//        eventId,
//        eventTitle,
//        eventDateStr,
//        reminderMinutes === 0 ? "at" : String(reminderMinutes),
//        userId
//    )
//}













"use client"

import { type ChangeEvent, useEffect, useRef, useState } from "react"
import { Bell, Menu, User, Video, ArrowLeft, LogOut, CheckCheck, Clock, Check, X } from "lucide-react"
import * as signalR from "@microsoft/signalr"

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
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    meetingLink?: string | null
    title?: string
    eventDate?: string
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

interface LocalEventNotification {
    id: string | number
    userId: string
    type: string
    isRead: boolean
    createdAt: string
    content?: string
    eventId?: string
    eventTitle?: string
    eventDate?: string
    eventTime?: string
    location?: string
    message?: string
    text?: string
    triggerTime?: number
    triggered?: boolean
    triggerTime_at?: number
    triggerTime_5?: number
    triggerTime_10?: number
    triggered_at?: boolean
    triggered_5?: boolean
    triggered_10?: boolean
    meetingLink?: string
    fromUserName?: string
    category?: string
    attachmentCount?: number
    priority?: string
    statusLabel?: string
}

function normalizeNotificationType(type?: string, content?: string) {
    const normalizedType = (type || "").toLowerCase()
    const normalizedContent = (content || "").toLowerCase()

    if ([
        "note_created",
        "note_updated",
        "note_deleted",
        "task_created",
        "task_updated",
        "task_deleted",
        "task_status_updated",
        "announcement",
    ].includes(normalizedType)) {
        return normalizedType
    }

    if (normalizedType === "note") return "note_created"
    if (normalizedContent.includes("shared note") || normalizedContent.includes("shared a note")) return "note_created"
    if (normalizedContent.includes("updated note")) return "note_updated"
    if (normalizedContent.includes("deleted note")) return "note_deleted"
    if (normalizedType === "task") return "task_created"
    if (normalizedContent.includes("assigned you a new task")) return "task_created"
    if (normalizedContent.includes("created task")) return "task_created"
    if (normalizedContent.includes("updated task")) return "task_updated"
    if (normalizedContent.includes("deleted task")) return "task_deleted"
    if (normalizedContent.includes("changed task status")) return "task_status_updated"

    return type || "info"
}

function calcTriggerTime(eventDateStr: string, reminderMinutes: number): number {
    const eventMs = new Date(eventDateStr).getTime()
    return eventMs - reminderMinutes * 60 * 1000
}

function reminderLabel(minutes: number): string {
    if (minutes === 0) return "at event time"
    return `${minutes} minute${minutes > 1 ? "s" : ""} before`
}

function parseStoredNotifications(): LocalEventNotification[] {
    if (typeof window === "undefined") return []

    try {
        return JSON.parse(localStorage.getItem("globalNotifications") || "[]")
    } catch {
        return []
    }
}

function writeStoredNotifications(items: LocalEventNotification[]) {
    localStorage.setItem("globalNotifications", JSON.stringify(items))
}

function isTriggeredReminder(notification: LocalEventNotification) {
    return Boolean(
        notification.triggered ||
        notification.triggered_at ||
        notification.triggered_5 ||
        notification.triggered_10
    )
}

function isReminderNotification(notification: LocalEventNotification) {
    return Boolean(
        notification.type === "calendar" ||
        notification.triggerTime ||
        notification.triggerTime_at ||
        notification.triggerTime_5 ||
        notification.triggerTime_10
    )
}

function isDisplayableLocalNotification(notification: LocalEventNotification) {
    if (isReminderNotification(notification)) return isTriggeredReminder(notification)
    return true
}

function formatEventDateTime(date?: string, time?: string) {
    if (!date && !time) return ""

    const datePart = date
        ? new Date(date).toLocaleDateString([], {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : ""

    if (datePart && time) return `${datePart} at ${time}`
    return datePart || time || ""
}

function buildEventNotificationMessage(notification: LocalEventNotification) {
    const details = formatEventDateTime(notification.eventDate, notification.eventTime)
    const title = notification.eventTitle || "Event"

    if (notification.message) return notification.message
    if (notification.text) return notification.text

    switch (notification.type) {
        case "event_created":
            return `${title} has been created${details ? ` for ${details}` : ""}.`
        case "event_updated":
            return `${title} has been updated${details ? ` to ${details}` : ""}.`
        case "event_deleted":
            return `${title} has been deleted${details ? ` from ${details}` : ""}.`
        default:
            return title
    }
}

function buildMeetingNotificationMessage(notification: LocalEventNotification) {
    const title = notification.eventTitle || "Meeting"
    const details = formatEventDateTime(notification.eventDate, notification.eventTime)
    const sender = notification.fromUserName || "HR"

    if (notification.message) return notification.message
    if (notification.text) return notification.text

    switch (notification.type) {
        case "meeting_created":
            return `${sender} scheduled "${title}"${details ? ` for ${details}` : ""}.`
        case "meeting_updated":
            return `${sender} updated "${title}"${details ? ` to ${details}` : ""}.`
        case "meeting_deleted":
            return `${sender} cancelled "${title}"${details ? ` scheduled for ${details}` : ""}.`
        default:
            return title
    }
}

function buildNoteNotificationMessage(notification: LocalEventNotification) {
    const title = notification.eventTitle || "Note"
    const sender = notification.fromUserName || "HR"
    const category = notification.category ? ` in ${notification.category}` : ""
    const attachmentText =
        typeof notification.attachmentCount === "number" && notification.attachmentCount > 0
            ? ` with ${notification.attachmentCount} attachment${notification.attachmentCount > 1 ? "s" : ""}`
            : ""

    if (notification.message) return notification.message
    if (notification.text) return notification.text

    switch (notification.type) {
        case "note_created":
            return `${sender} shared note "${title}"${category}${attachmentText}.`
        case "note_updated":
            return `${sender} updated note "${title}"${category}${attachmentText}.`
        case "note_deleted":
            return `${sender} deleted note "${title}".`
        default:
            return title
    }
}

function buildTaskNotificationMessage(notification: LocalEventNotification) {
    const title = notification.eventTitle || "Task"
    const sender = notification.fromUserName || "HR"
    const priority = notification.priority ? ` (${notification.priority})` : ""
    const statusLabel = notification.statusLabel ? ` to ${notification.statusLabel}` : ""

    if (notification.message) return notification.message
    if (notification.text) return notification.text

    switch (notification.type) {
        case "task_created":
            return `${sender} assigned task "${title}"${priority}.`
        case "task_updated":
            return `${sender} updated task "${title}"${priority}.`
        case "task_deleted":
            return `${sender} deleted task "${title}".`
        case "task_status_updated":
            return `${sender} changed task "${title}" status${statusLabel}.`
        default:
            return title
    }
}

export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {
    const [name, setName] = useState("")
    const [mounted, setMounted] = useState(false)
    const [email, setEmail] = useState("")
    const [nickname, setNickname] = useState("")
    const [mobile, setMobile] = useState("")
    const [country, setCountry] = useState("")
    const [gender, setGender] = useState("")
    const [image, setImage] = useState<string | null>(null)
    const [openProfile, setOpenProfile] = useState(false)

    const [chatNotifs, setChatNotifs] = useState<Notification[]>([])
    const [meetingNotifs, setMeetingNotifs] = useState<Meeting[]>([])
    const [localEventNotifs, setLocalEventNotifs] = useState<LocalEventNotification[]>([])
    const [showNotifications, setShowNotifications] = useState(false)
    const [expandedNotifications, setExpandedNotifications] = useState(false)
    const notifPanelRef = useRef<HTMLDivElement>(null)

    const [currentUserId, setCurrentUserId] = useState("")
    const [openLogout, setOpenLogout] = useState(false)
    const [userRole, setUserRole] = useState("")

    const [reminderToast, setReminderToast] = useState<{ title: string; body: string } | null>(null)

    const getMeetingReadIds = () => {
        const userId = localStorage.getItem("userId")
        return JSON.parse(localStorage.getItem(`readMeetings_${userId}`) || "[]")
    }

    const saveMeetingReadIds = (ids: string[]) => {
        const userId = localStorage.getItem("userId")
        localStorage.setItem(`readMeetings_${userId}`, JSON.stringify(ids))
    }

    const formatDateOnly = (dateString?: string) => {
        if (!dateString) return ""
        return new Date(dateString).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" })
    }

    const formatTimeOnly = (dateString?: string) => {
        if (!dateString) return ""
        return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    const formatEventText = (n: LocalEventNotification) => {
        const baseDate = n.eventDate || n.createdAt
        const date = new Date(baseDate)

        const today = new Date()
        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)

        let dayLabel = date.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })

        if (date.toDateString() === today.toDateString()) {
            dayLabel = "Today"
        } else if (date.toDateString() === yesterday.toDateString()) {
            dayLabel = "Yesterday"
        }

        const timeLabel = n.eventTime || date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })

        return `Reminder: "${n.eventTitle || "Event"}" at ${timeLabel} (${dayLabel})`
    }

    const cleanUUID = (text: string) =>
        (text || "").replace(/^[0-9a-fA-F-]{36}\s*/, "").trim()

    const getReadIds = () => {
        if (typeof window === "undefined") return []
        const userId = localStorage.getItem("userId")
        return JSON.parse(localStorage.getItem(`readNotifications_${userId}`) || "[]")
    }

    const saveReadIds = (ids: number[]) => {
        const userId = localStorage.getItem("userId")
        localStorage.setItem(`readNotifications_${userId}`, JSON.stringify(ids))
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (notifPanelRef.current && !notifPanelRef.current.contains(e.target as Node)) {
                setShowNotifications(false)
            }
        }

        if (showNotifications) document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [showNotifications])

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const role = localStorage.getItem("role") || ""
        setUserRole(role)
    }, [])

    useEffect(() => {
        const id = localStorage.getItem("userId") || ""
        setCurrentUserId(id)
        const storedName = localStorage.getItem("name") || ""
        setName(storedName)
    }, [])

    useEffect(() => {
        const role = (localStorage.getItem("role") || "").toLowerCase()
        if (role !== "employee" && role !== "professional") return

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://steadfast-warmth-production-64c8.up.railway.app/chatHub", {
                accessTokenFactory: () => localStorage.getItem("token") || "",
            })
            .withAutomaticReconnect()
            .build()

        connection.start().catch((err) => console.error("SignalR Error:", err))

        connection.on("ReceiveNotification", (data) => {
            const notifType = normalizeNotificationType(data.type, data.content)

            if (notifType === "announcement") {
                const hrName = cleanUUID(data.createdByName || data.fromUserName || "HR")
                const announcementTitle = cleanUUID(data.title || "Announcement")

                setChatNotifs((prev) => [
                    {
                        id: Date.now(),
                        fromUserId: data.fromUserId || "system",
                        fromUserName: hrName,
                        toUserId: currentUserId,
                        content: `${hrName} shared an announcement: ${announcementTitle}`,
                        status: "info",
                        type: "announcement",
                        isRead: false,
                        createdAt: data.createdAt || new Date().toISOString(),
                        title: announcementTitle,
                        eventDate: data.startTime || data.dateTime || undefined,
                    },
                    ...prev,
                ])
                return
            }

            if (["note_created", "note_updated", "note_deleted", "task_created", "task_updated", "task_deleted", "task_status_updated"].includes(notifType)) {
                setChatNotifs((prev) => [
                    {
                        id: Date.now(),
                        fromUserId: data.fromUserId || "system",
                        fromUserName: cleanUUID(data.fromUserName || data.createdByName || "HR"),
                        toUserId: currentUserId,
                        content: cleanUUID(data.content || ""),
                        status: "info",
                        type: notifType,
                        isRead: false,
                        createdAt: data.createdAt || new Date().toISOString(),
                        title: cleanUUID(data.title || (notifType.startsWith("note_") ? "Note" : "Task")),
                    },
                    ...prev,
                ])
                return
            }

            const cleanTitle = cleanUUID(data.title || "")
            const startTime = data.startTime || data.dateTime || null

            const formattedDate = startTime
                ? new Date(startTime).toLocaleDateString([], {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
                : ""

            const formattedTime = startTime
                ? new Date(startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : ""

            setChatNotifs((prev) => [
                {
                    id: Date.now(),
                    fromUserId: data.fromUserId || "system",
                    fromUserName: data.createdByName || "HR",
                    toUserId: currentUserId,
                    content: `${cleanTitle} scheduled on ${formattedDate} at ${formattedTime}`,
                    meetingLink: data.meetingLink || data.link || null,
                    status: "info",
                    type: "meeting",
                    isRead: false,
                    createdAt: data.createdAt || new Date().toISOString(),
                    eventDate: startTime || undefined,
                },
                ...prev,
            ])
        })

        return () => {
            connection.stop()
        }
    }, [currentUserId])

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) return

                const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Account/profile", {
                    headers: { Authorization: `Bearer ${token}` },
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

    const fetchNotifications = async () => {
        try {
            const res = await fetch(
                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/${currentUserId}`
            )
            const data = await res.json()
            const role = (localStorage.getItem("role") || "").toLowerCase()
            const filtered = role === "employee" || role === "professional"
                ? data
                : data.filter((n: Notification) => n.type !== "announcement")
            const readIds = getReadIds()

            const buildMessage = (n: Notification) => {
                const normalizedType = normalizeNotificationType(n.type, n.content)

                if (normalizedType === "meeting") {
                    const date = new Date(n.createdAt || "")
                    const formattedDate = date.toLocaleDateString([], {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })
                    const formattedTime = date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })

                    return `${cleanUUID(n.content)} • ${formattedDate} at ${formattedTime}`
                }

                return cleanUUID(n.content)
            }

            setChatNotifs(
                filtered.map((n: Notification) => ({
                    ...n,
                    type: normalizeNotificationType(n.type, n.content),
                    fromUserName: cleanUUID(n.fromUserName),
                    content: buildMessage(n),
                    createdAt: n.createdAt || new Date().toISOString(),
                    eventDate: n.eventDate || (n as any).startTime || (n as any).dateTime || undefined,
                    isRead: readIds.includes(n.id) ? true : n.isRead,
                }))
            )
        } catch {
            setChatNotifs([])
        }
    }

    const fetchMeetings = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/meeting/my-meetings", {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            const now = new Date()
            const upcoming = data.filter((m: Meeting) => new Date(m.startTime) > now)
            const readIds = getMeetingReadIds()

            setMeetingNotifs(upcoming.map((m: Meeting) => ({
                ...m,
                isRead: readIds.includes(m.id),
                createdAt: m.createdAt || m.startTime,
                createdByName: m.createdByName || "HR",
            })))
        } catch {
            setMeetingNotifs([])
        }
    }

    useEffect(() => {
        if (!currentUserId) return

        fetchNotifications()
        fetchMeetings()

        const refresh = () => {
            fetchNotifications()
            fetchMeetings()
        }

        const interval = setInterval(() => {
            fetchNotifications()
            fetchMeetings()
        }, 3000)

        window.addEventListener("chat-updated", refresh)
        window.addEventListener("request-updated", refresh)

        return () => {
            clearInterval(interval)
            window.removeEventListener("chat-updated", refresh)
            window.removeEventListener("request-updated", refresh)
        }
    }, [currentUserId, userRole])

    const loadGlobalNotifications = () => {
        const currentUser = localStorage.getItem("userId")
        const data = parseStoredNotifications()
        const filtered = data.filter((n) => n.userId === currentUser)
        setLocalEventNotifs(filtered)
    }

    useEffect(() => {
        loadGlobalNotifications()

        const handler = () => loadGlobalNotifications()
        window.addEventListener("new-notification", handler)

        return () => window.removeEventListener("new-notification", handler)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now()
            const currentUser = localStorage.getItem("userId")
            const data = parseStoredNotifications()

            let changed = false
            const updated = data.map((n) => {
                if (n.userId !== currentUser) return n
                if (!isReminderNotification(n)) return n

                if (!n.triggered_at && n.triggerTime_at && now >= n.triggerTime_at) {
                    changed = true
                    showReminderToast(n.eventTitle || "Event", `Reminder: "${n.eventTitle || "Event"}" is happening ${reminderLabel(0)}.`)
                    return { ...n, triggered_at: true, isRead: false }
                }

                if (!n.triggered_5 && n.triggerTime_5 && now >= n.triggerTime_5) {
                    changed = true
                    showReminderToast(n.eventTitle || "Event", `Reminder: "${n.eventTitle || "Event"}" starts ${reminderLabel(5)}.`)
                    return { ...n, triggered_5: true, isRead: false }
                }

                if (!n.triggered_10 && n.triggerTime_10 && now >= n.triggerTime_10) {
                    changed = true
                    showReminderToast(n.eventTitle || "Event", `Reminder: "${n.eventTitle || "Event"}" starts ${reminderLabel(10)}.`)
                    return { ...n, triggered_10: true, isRead: false }
                }

                if (n.triggerTime && !n.triggered && now >= n.triggerTime) {
                    changed = true
                    showReminderToast(n.eventTitle || "Event", n.text || `Reminder: "${n.eventTitle || "Event"}" is coming up.`)
                    return { ...n, triggered: true, isRead: false }
                }

                return n
            })

            if (changed) {
                writeStoredNotifications(updated)
                setLocalEventNotifs(updated.filter((n) => n.userId === currentUser))
            }
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    const showReminderToast = (toastTitle: string, body: string) => {
        setReminderToast({ title: toastTitle, body })
        setTimeout(() => setReminderToast(null), 6000)
    }

    const handleChatRequest = async (notifId: number, status: "accepted" | "rejected") => {
        try {
            await fetch(
                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/${notifId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(status),
                }
            )

            if (status === "accepted") {
                await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/chat/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ notificationId: notifId }),
                })
                window.dispatchEvent(new Event("chat-updated"))
            }

            const original = chatNotifs.find((n) => n.id === notifId)
            if (original) {
                const myName = localStorage.getItem("name") || "Someone"
                const statusMsg =
                    status === "accepted"
                        ? `${myName} accepted your chat request`
                        : `${myName} rejected your chat request`

                await fetch(
                    "https://steadfast-warmth-production-64c8.up.railway.app/api/notifications",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            fromUserId: currentUserId,
                            fromUserName: myName,
                            toUserId: original.fromUserId,
                            content: statusMsg,
                            type: status === "accepted" ? "chat_accepted" : "chat_rejected",
                            status: "info",
                            isRead: false,
                        }),
                    }
                )
            }

            setChatNotifs((prev) => prev.filter((n) => n.id !== notifId))
            window.dispatchEvent(new Event("chat-updated"))
            window.dispatchEvent(new Event("request-updated"))
            await fetchNotifications()
        } catch (err) {
            console.error("Chat request error:", err)
        }
    }

    const markAllRead = async () => {
        try {
            await fetch(
                `https://steadfast-warmth-production-64c8.up.railway.app/api/notifications/mark-read/${currentUserId}`,
                { method: "PUT" }
            )

            setChatNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })))
            setMeetingNotifs((prev) => prev.map((m) => ({ ...m, isRead: true })))
            saveMeetingReadIds(meetingNotifs.map((m) => m.id))
            saveReadIds(chatNotifs.map((n) => n.id))

            const currentUser = localStorage.getItem("userId")
            const allStored = parseStoredNotifications()
            const updatedStored = allStored.map((item) =>
                item.userId === currentUser && isDisplayableLocalNotification(item)
                    ? { ...item, isRead: true }
                    : item
            )

            writeStoredNotifications(updatedStored)
            setLocalEventNotifs(updatedStored.filter((item) => item.userId === currentUser))
        } catch (err) {
            console.error("Mark read error:", err)
        }
    }

    const saveProfile = async () => {
        try {
            const token = localStorage.getItem("token")
            await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Account/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name, nickname, gender, country, mobile, profileImage: image }),
            })
            setOpenProfile(false)
        } catch (err) {
            console.error("Profile save error:", err)
        }
    }

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => setImage(reader.result as string)
        reader.readAsDataURL(file)
    }

    const initials = name
        ? name.split(" ").map((part) => part[0]).join("").toUpperCase()
        : "U"

    const unreadChatCount = chatNotifs.filter((n) => !n.isRead).length
    const unreadMeetingCount = meetingNotifs.filter((m) => !m.isRead).length
    const unreadLocalEventCount = localEventNotifs.filter((n) => isDisplayableLocalNotification(n) && !n.isRead).length
    const totalCount = unreadChatCount + unreadMeetingCount + unreadLocalEventCount

    const buildGroupedNotifs = () => {
        let allNotifs: any[] = [
            ...localEventNotifs.filter(isDisplayableLocalNotification),
            ...chatNotifs,
            ...meetingNotifs.map((m) => ({
                ...m,
                type: "meeting",
                content: m.title,
                createdAt: m.createdAt || m.startTime,
                fromUserName: `HR (${m.createdByName || "HR"})`,
                createdByName: m.createdByName || "HR",
                meetingLink: m.meetingLink,
                eventDate: m.startTime,
            })),
        ].sort((a: any, b: any) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        )

        if (!expandedNotifications) allNotifs = allNotifs.slice(0, 5)

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
        if (n.type === "chat_request") return "💬"
        if (n.type === "chat_accepted") return "✅"
        if (n.type === "chat_rejected") return "❌"
        if (n.type === "announcement") return "📢"
        if (n.type === "task_created") return "📋"
        if (n.type === "task_updated") return "🛠️"
        if (n.type === "task_deleted") return "🗑️"
        if (n.type === "task_status_updated") return "✅"
        if (n.type === "note_created") return "📝"
        if (n.type === "note_updated") return "✍️"
        if (n.type === "note_deleted") return "🗑️"
        if (n.type === "meeting_created") return "📅"
        if (n.type === "meeting_updated") return "📝"
        if (n.type === "meeting_deleted") return "🚫"
        if (n.type === "event_created") return "🆕"
        if (n.type === "event_updated") return "✏️"
        if (n.type === "event_deleted") return "🗑️"
        if (n.eventDate || n.type === "calendar") return "⏰"
        if (n.type === "meeting") return "📅"
        return "🔔"
    }

    const getNotifAccent = (n: any) => {
        if (n.type === "chat_accepted") return "green"
        if (n.type === "chat_rejected") return "red"
        if (n.type === "task_created") return "blue"
        if (n.type === "task_updated") return "blue"
        if (n.type === "task_deleted") return "red"
        if (n.type === "task_status_updated") return "green"
        if (n.type === "note_created") return "green"
        if (n.type === "note_updated") return "blue"
        if (n.type === "note_deleted") return "red"
        if (n.type === "meeting_deleted") return "red"
        if (n.type === "meeting_created") return "blue"
        if (n.type === "meeting_updated") return "blue"
        if (n.type === "event_deleted") return "red"
        if (n.type === "event_created") return "green"
        if (n.type === "event_updated") return "blue"
        if (n.type === "chat_request") return "purple"
        if (n.type === "announcement") return "purple"
        if (n.type === "meeting" || (n.content || "").includes("📅")) return "blue"
        if (n.eventDate || n.type === "calendar") return "amber"
        return "gray"
    }

    const hasNotifications = chatNotifs.length > 0 ||
        meetingNotifs.length > 0 ||
        localEventNotifs.some(isDisplayableLocalNotification)

    if (!mounted) return null

    const grouped = buildGroupedNotifs()

    return (
        <>
            {reminderToast && (
                <div
                    className="
                        fixed top-5 right-5 z-[9999]
                        bg-amber-500 text-white
                        rounded-2xl shadow-2xl
                        px-5 py-4 max-w-sm
                        flex items-start gap-3
                        animate-in slide-in-from-top-2 duration-300
                    "
                >
                    <span className="text-2xl">⏰</span>
                    <div>
                        <p className="font-semibold text-sm">{reminderToast.title}</p>
                        <p className="text-xs opacity-90 mt-0.5">{reminderToast.body}</p>
                    </div>
                    <button onClick={() => setReminderToast(null)} className="ml-auto text-white/70 hover:text-white">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="font-semibold">{title}</h1>
                </div>

                <div className="flex items-center gap-2">
                    <ThemeToggle />

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

                        {showNotifications && (
                            <div className="absolute right-0 top-[calc(100%+10px)] z-50 flex max-h-[85vh] w-[420px] flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_28px_90px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1220]/95">
                                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50 px-5 py-4 dark:border-white/10 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-blue-700 shadow-lg shadow-blue-500/20">
                                                <Bell className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    Notifications
                                                </h4>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    {totalCount > 0
                                                        ? `${totalCount} unread updates`
                                                        : userRole?.toLowerCase() === "professional"
                                                            ? "Professional activity feed"
                                                            : "You are all caught up"}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={markAllRead}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:border-white/10 dark:bg-white/5 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
                                        >
                                            <CheckCheck className="h-3 w-3" />
                                            Mark all read
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10">
                                    {hasNotifications ? (
                                        Object.keys(grouped).length > 0 ? (
                                            Object.keys(grouped).map((group, gIdx) => (
                                                <div key={gIdx} className="pb-1">
                                                    <div className="flex items-center gap-3 px-3 pb-2 pt-3">
                                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                                                            {group}
                                                        </span>
                                                        <div className="h-px flex-1 bg-slate-100 dark:bg-white/10" />
                                                    </div>

                                                    {grouped[group].map((n: any, i: number) => {
                                                        const isUnread = !n.isRead
                                                        const accent = getNotifAccent(n)
                                                        const icon = getNotifIcon(n)
                                                        const isMeeting = n.type === "meeting" || (n.content || "").includes("📅")
                                                        const isReminder = isReminderNotification(n)
                                                        const isTaskActivity = ["task_created", "task_updated", "task_deleted", "task_status_updated"].includes(n.type)
                                                        const isNoteActivity = ["note_created", "note_updated", "note_deleted"].includes(n.type)
                                                        const isMeetingActivity = ["meeting_created", "meeting_updated", "meeting_deleted"].includes(n.type)
                                                        const isEventActivity = ["event_created", "event_updated", "event_deleted"].includes(n.type)
                                                        const isChatRequest = n.type === "chat_request" && n.status === "pending"

                                                        const accentMap: Record<string, string> = {
                                                            blue: "bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400",
                                                            amber: "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400",
                                                            green: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                                                            red: "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400",
                                                            purple: "bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400",
                                                            gray: "bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-400",
                                                        }

                                                        const dotMap: Record<string, string> = {
                                                            blue: "bg-blue-500",
                                                            amber: "bg-amber-500",
                                                            green: "bg-emerald-500",
                                                            red: "bg-red-500",
                                                            purple: "bg-purple-500",
                                                            gray: "bg-slate-400",
                                                        }

                                                        const senderName = (() => {
                                                            if (isTaskActivity) return cleanUUID(n.fromUserName || "HR")
                                                            if (isNoteActivity) return cleanUUID(n.fromUserName || "HR")
                                                            if (isMeetingActivity) return cleanUUID(n.fromUserName || n.createdByName || "HR")
                                                            if (isEventActivity || isReminder) return "Events"

                                                            if (n.type === "meeting") {
                                                                const actualName = cleanUUID(n.createdByName || n.fromUserName || "")
                                                                if (!actualName || actualName.toLowerCase() === "hr") return "HR"
                                                                return `HR (${actualName})`
                                                            }

                                                            return cleanUUID(n.fromUserName || "")
                                                        })()

                                                        const rawContent: string = n.content || ""
                                                        const meetingDate = n.eventDate || n.startTime || n.createdAt
                                                        const eventMessage = isTaskActivity
                                                            ? rawContent || buildTaskNotificationMessage(n)
                                                            : isNoteActivity
                                                                ? rawContent || buildNoteNotificationMessage(n)
                                                                : isMeetingActivity
                                                                    ? buildMeetingNotificationMessage(n)
                                                                    : isReminder
                                                                        ? formatEventText(n)
                                                                        : isEventActivity
                                                                            ? buildEventNotificationMessage(n)
                                                                            : rawContent

                                                        return (
                                                            <div
                                                                key={i}
                                                                className={`mx-1.5 mb-1.5 rounded-2xl border px-3.5 py-3 transition-all duration-150 ${isUnread
                                                                        ? "border-indigo-200/80 bg-indigo-50/80 shadow-sm hover:bg-indigo-50 dark:border-indigo-500/20 dark:bg-indigo-500/8 dark:hover:bg-indigo-500/12"
                                                                        : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-white/10 dark:hover:bg-white/4"
                                                                    }`}
                                                            >
                                                                <div className="flex gap-3.5">
                                                                    <div className="mt-0.5 flex-shrink-0">
                                                                        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-base shadow-sm ${accentMap[accent]}`}>
                                                                            {icon}
                                                                        </div>
                                                                    </div>

                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="mb-1 flex items-center justify-between gap-2">
                                                                            <span className="truncate text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
                                                                                {senderName || (isMeeting ? "Meeting" : isReminder ? "Reminder" : "Notification")}
                                                                            </span>

                                                                            <div className="flex flex-shrink-0 items-center gap-1.5">
                                                                                <span className="whitespace-nowrap text-[10px] text-slate-400 dark:text-slate-500">
                                                                                    {formatTimeOnly(n.createdAt)}
                                                                                </span>
                                                                                {isUnread && (
                                                                                    <span className={`h-1.5 w-1.5 rounded-full ${dotMap[accent]}`} />
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        <p className="line-clamp-2 text-[13px] leading-6 text-slate-600 dark:text-slate-300">
                                                                            {isMeeting
                                                                                ? cleanUUID(n.content).replace("📅", "").trim()
                                                                                : eventMessage}
                                                                        </p>

                                                                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                                                                            <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                                                                                <Clock className="h-2.5 w-2.5" />
                                                                                {isReminder || isEventActivity || isMeetingActivity || isNoteActivity || isTaskActivity
                                                                                    ? formatEventDateTime(n.eventDate, n.eventTime) || formatDateOnly(n.createdAt)
                                                                                    : meetingDate
                                                                                        ? `${formatDateOnly(meetingDate)}${formatTimeOnly(meetingDate) ? ` • ${formatTimeOnly(meetingDate)}` : ""}`
                                                                                        : formatDateOnly(n.createdAt)}
                                                                            </div>

                                                                            {isChatRequest && (
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation()
                                                                                            handleChatRequest(n.id, "accepted")
                                                                                        }}
                                                                                        className="flex items-center gap-1 rounded-xl bg-emerald-500 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                                                                                    >
                                                                                        <Check className="h-2.5 w-2.5" />
                                                                                        Accept
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation()
                                                                                            handleChatRequest(n.id, "rejected")
                                                                                        }}
                                                                                        className="flex items-center gap-1 rounded-xl bg-red-500 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-red-600"
                                                                                    >
                                                                                        <X className="h-2.5 w-2.5" />
                                                                                        Reject
                                                                                    </button>
                                                                                </div>
                                                                            )}

                                                                            {(isMeeting || isMeetingActivity || n.meetingLink) && n.meetingLink && n.type !== "meeting_deleted" && (
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation()
                                                                                        window.open(n.meetingLink, "_blank")
                                                                                    }}
                                                                                    className="flex items-center gap-1 rounded-xl bg-blue-600 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-blue-700"
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
                                            <EmptyState />
                                        )
                                    ) : (
                                        <EmptyState />
                                    )}

                                    <div className="h-2" />
                                </div>

                                <div className="sticky bottom-0 border-t border-slate-100 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#0b1220]/95">
                                    <button
                                        onClick={() => setExpandedNotifications((prev) => !prev)}
                                        className="flex w-full items-center justify-center gap-1.5 px-5 py-3 text-center text-[12px] font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/8"
                                    >
                                        {expandedNotifications ? (
                                            <>
                                                <span>Show less</span>
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                                                </svg>
                                            </>
                                        ) : (
                                            <>
                                                <span>View all notifications</span>
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="gap-2">
                                <Avatar className="h-7 w-7">
                                    {image ? <AvatarImage src={image} /> : <AvatarFallback>{initials}</AvatarFallback>}
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

            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border border-border bg-white text-black dark:bg-gradient-to-br dark:from-[#020617] dark:to-[#0f172a] dark:text-white shadow-2xl">
                    <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-100 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 border-border dark:border-white/10">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={() => setOpenProfile(false)} className="hover:bg-black/10 dark:hover:bg-white/20">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h2 className="text-lg font-semibold tracking-wide">Profile Settings</h2>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-5">
                            <label className="cursor-pointer relative group">
                                <Avatar className="h-20 w-20 border-2 border-indigo-500 shadow-lg">
                                    {image
                                        ? <AvatarImage src={image} />
                                        : <AvatarFallback className="text-lg font-bold bg-indigo-600 text-white">{initials}</AvatarFallback>
                                    }
                                </Avatar>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center text-white text-xs font-medium transition">Change</div>
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
                                <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10 focus-visible:ring-indigo-500" />
                            </div>
                            <div className="space-y-1">
                                <Label>Nick Name</Label>
                                <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label>Gender</Label>
                                <div className="flex gap-3">
                                    {["Male", "Female", "Other"].map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setGender(g)}
                                            className={`px-4 py-2 rounded-lg border text-sm transition ${gender === g ? "bg-indigo-600 text-white border-indigo-500 shadow-md" : "bg-gray-100 dark:bg-white/5 border-border dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Mobile</Label>
                                <Input value={mobile} onChange={(e) => setMobile(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
                            </div>
                            <div className="space-y-1">
                                <Label>Country</Label>
                                <Input value={country} onChange={(e) => setCountry(e.target.value)} className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10" />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <Label>Email</Label>
                                <Input value={email} disabled className="bg-gray-200 dark:bg-white/10 border-border dark:border-white/10 text-gray-500 dark:text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-100 dark:bg-white/5 border-border dark:border-white/10">
                        <Button variant="outline" onClick={() => setOpenProfile(false)} className="hover:bg-gray-200 dark:hover:bg-white/10">Cancel</Button>
                        <Button onClick={saveProfile} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-lg">Save Changes</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={openLogout} onOpenChange={setOpenLogout}>
                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border border-border shadow-2xl">
                    <div className="flex flex-col items-center justify-center px-6 pt-6 pb-4 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-[#020617]">
                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
                            <LogOut className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">Log out of your account?</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">You&apos;ll need to sign in again to access your dashboard.</p>
                    </div>
                    <div className="flex gap-3 px-6 py-5 bg-white dark:bg-[#020617]">
                        <button
                            onClick={() => setOpenLogout(false)}
                            className="w-1/2 py-2.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                localStorage.clear()
                                window.location.href = "/"
                            }}
                            className="w-1/2 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition"
                        >
                            Log out
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-slate-100 to-blue-100 dark:from-white/8 dark:to-white/5">
                <Bell className="h-6 w-6 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">All caught up!</p>
            <p className="mt-1 max-w-[14rem] text-xs leading-5 text-slate-400 dark:text-slate-500">
                No new notifications right now. Fresh activity will appear here automatically.
            </p>
        </div>
    )
}

export function registerCalendarReminder(
    eventId: string,
    eventTitle: string,
    eventDateStr: string,
    reminderType: string,
    userId: string
) {
    const existing: LocalEventNotification[] = parseStoredNotifications()
    const filtered = existing.filter((n) => n.eventId !== eventId || n.type !== "calendar")

    const entry: LocalEventNotification = {
        id: `${eventId}-calendar`,
        eventId,
        eventTitle,
        userId,
        type: "calendar",
        createdAt: new Date().toISOString(),
        isRead: false,
        eventDate: eventDateStr,
        triggered_at: false,
        triggered_5: false,
        triggered_10: false,
    }

    const types = reminderType.split("+")

    if (types.includes("at")) {
        entry.triggerTime_at = calcTriggerTime(eventDateStr, 0)
    }
    if (types.includes("5")) {
        entry.triggerTime_5 = calcTriggerTime(eventDateStr, 5)
    }
    if (types.includes("10")) {
        entry.triggerTime_10 = calcTriggerTime(eventDateStr, 10)
    }

    filtered.push(entry)
    writeStoredNotifications(filtered)
    window.dispatchEvent(new Event("new-notification"))
}

export function registerLegacyReminder(
    eventId: string,
    eventTitle: string,
    eventDateStr: string,
    reminderMinutes: number,
    userId: string
) {
    registerCalendarReminder(
        eventId,
        eventTitle,
        eventDateStr,
        reminderMinutes === 0 ? "at" : String(reminderMinutes),
        userId
    )
}
