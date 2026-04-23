


//"use client"

//import { useEffect, useState } from "react"
//import {
//    LayoutDashboard, Calendar, MessageSquare, Video,
//    Users, StickyNote, BarChart3, Megaphone,
//    Briefcase, TrendingUp, CheckCircle2,
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Badge } from "@/components/ui/badge"
//import { Progress } from "@/components/ui/progress"
//import {
//    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//} from "recharts"

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/hr", icon: LayoutDashboard },
//    { label: "Calendar", href: "/dashboard/hr/calendar", icon: Calendar },
//    { label: "AI Chat", href: "/dashboard/hr/chat", icon: MessageSquare },
//    { label: "Employees Management", href: "/dashboard/hr/employees", icon: Users },
//    { label: "Meetings", href: "/dashboard/hr/meetings", icon: Video },
//    { label: "Tasks", href: "/dashboard/hr/tasks", icon: CheckCircle2 },
//    { label: "Team", href: "/dashboard/hr/team", icon: Users },
//    { label: "Notes", href: "/dashboard/hr/notes", icon: StickyNote },
//    { label: "Announcements", href: "/dashboard/hr/announcements", icon: Megaphone },
//    { label: "Analytics", href: "/dashboard/hr/analytics", icon: BarChart3 },
//]

//export default function ProfessionalDashboard() {

//    const [meetings, setMeetings] = useState<any[]>([])
//    const [tasks, setTasks] = useState<any[]>([])
//    const [announcements, setAnnouncements] = useState<any[]>([])
//    const [chartData, setChartData] = useState<any[]>([])

//    useEffect(() => {
//        fetchDashboardData()
//    }, [])

//    async function safeJson(res: Response) {
//        if (!res.ok) return []
//        const text = await res.text()
//        if (!text) return []
//        try {
//            return JSON.parse(text)
//        } catch {
//            return []
//        }
//    }

//    async function fetchDashboardData() {
//        const token = localStorage.getItem("token")

//        try {
//            const [meetingRes, taskRes, announcementRes] = await Promise.all([
//                fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Meeting/my-meetings", {
//                    headers: { Authorization: `Bearer ${token}` }
//                }),
//                fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks", {
//                    headers: { Authorization: `Bearer ${token}` }
//                }),
//                fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Announcement", {
//                    headers: { Authorization: `Bearer ${token}` }
//                })
//            ])

//            const meetingData = await safeJson(meetingRes)
//            const taskData = await safeJson(taskRes)
//            const announcementData = await safeJson(announcementRes)

//            setMeetings(Array.isArray(meetingData) ? meetingData : [])
//            setTasks(Array.isArray(taskData) ? taskData : [])
//            setAnnouncements(Array.isArray(announcementData) ? announcementData : [])

//            const completed = taskData.filter((t: any) => t.status === "Completed").length
//            const pending = taskData.length - completed

//            setChartData([
//                { name: "Completed", value: completed },
//                { name: "Pending", value: pending }
//            ])

//        } catch (error) {
//            console.error("Dashboard error:", error)
//        }
//    }

//    return (
//        <DashboardShell navItems={navItems} role="hr" title="Dashboard">

//            {/* Stats */}
//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                <StatCard icon={Video} title="Meetings" value={meetings.length.toString()} />
//                <StatCard icon={Briefcase} title="Tasks" value={tasks.length.toString()} />
//                <StatCard icon={Megaphone} title="Announcements" value={announcements.length.toString()} />
//                <StatCard
//                    icon={TrendingUp}
//                    title="Completed Tasks"
//                    value={tasks.filter(t => t.status === "Completed").length.toString()}
//                />
//            </div>

//            {/* MAIN GRID */}
//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* 🔹 Meetings */}
//                <div className="rounded-xl border p-6 shadow-sm h-[320px] flex flex-col">
//                    <h3 className="text-lg font-semibold mb-4">Meetings</h3>

//                    <div className="flex-1 overflow-y-auto pr-2">
//                        {meetings.length === 0 ? (
//                            <p className="text-sm text-gray-500">No meetings</p>
//                        ) : (
//                            meetings.map((m: any) => (
//                                <div
//                                    key={m.id}
//                                    className="flex items-center justify-between mb-3 bg-muted/50 p-4 rounded-lg hover:shadow transition"
//                                >
//                                    <div className="flex items-center gap-4">
//                                        <div className="text-center min-w-[60px]">
//                                            <p className="text-sm font-semibold text-primary">
//                                                {new Date(m.startTime).toLocaleTimeString([], {
//                                                    hour: "2-digit",
//                                                    minute: "2-digit"
//                                                })}
//                                            </p>
//                                            <p className="text-xs text-muted-foreground">
//                                                {new Date(m.startTime).toLocaleDateString()}
//                                            </p>
//                                        </div>

//                                        <div>
//                                            <p className="font-medium">
//                                                {m.meetingTitle || m.title || "Meeting"}
//                                            </p>
//                                        </div>
//                                    </div>

//                                    <Badge variant="secondary">Meeting</Badge>
//                                </div>
//                            ))
//                        )}
//                    </div>
//                </div>

//                {/* 🔹 Tasks */}
//                <div className="rounded-xl border p-6 shadow-sm h-[320px] flex flex-col">
//                    <div className="flex justify-between items-center mb-4">
//                        <h3 className="text-lg font-semibold">Tasks</h3>
//                        <span className="text-xs text-muted-foreground">
//                            {tasks.length} total
//                        </span>
//                    </div>

//                    <div className="flex-1 overflow-y-auto pr-2">
//                        {tasks.length === 0 ? (
//                            <p className="text-sm text-gray-500">No tasks</p>
//                        ) : (
//                            <div className="flex flex-col gap-4">
//                                {tasks.map((task: any) => {

//                                    const progress =
//                                        task.status === "Completed"
//                                            ? 100
//                                            : task.status === "In Progress"
//                                                ? 60
//                                                : 20

//                                    return (
//                                        <div key={task.id} className="p-4 rounded-lg border bg-muted/40 hover:shadow-sm transition">

//                                            <div className="flex justify-between items-center">
//                                                <p className="font-medium">{task.title}</p>

//                                                <Badge
//                                                    variant={
//                                                        task.priority === "High"
//                                                            ? "destructive"
//                                                            : task.priority === "Medium"
//                                                                ? "secondary"
//                                                                : "outline"
//                                                    }
//                                                >
//                                                    {task.priority}
//                                                </Badge>
//                                            </div>

//                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
//                                                {task.description || "No description"}
//                                            </p>

//                                            <div className="mt-3">
//                                                <div className="flex justify-between text-xs mb-1">
//                                                    <span>{task.status}</span>
//                                                    <span>{progress}%</span>
//                                                </div>
//                                                <Progress value={progress} className="h-2" />
//                                            </div>

//                                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
//                                                <span>📅 {task.deadline || "No deadline"}</span>
//                                                {task.assignedUserName && (
//                                                    <span>👤 {task.assignedUserName}</span>
//                                                )}
//                                            </div>

//                                        </div>
//                                    )
//                                })}
//                            </div>
//                        )}
//                    </div>
//                </div>

//                {/* 🔹 Announcements */}
//                <div className="rounded-xl border p-6 shadow-sm h-[320px] flex flex-col">
//                    <h3 className="text-lg font-semibold mb-4">Announcements</h3>

//                    <div className="flex-1 overflow-y-auto pr-2">
//                        {announcements.length === 0 ? (
//                            <p className="text-sm text-gray-500">No announcements</p>
//                        ) : (
//                            announcements.map((a: any) => (
//                                <div key={a.id} className="mb-3 p-3 bg-muted/50 rounded-lg">
//                                    <div className="flex gap-2 items-center">
//                                        <p className="font-medium">{a.title}</p>
//                                        <Badge variant="outline">{a.audience}</Badge>
//                                    </div>
//                                    <p className="text-xs text-muted-foreground">{a.content}</p>
//                                </div>
//                            ))
//                        )}
//                    </div>
//                </div>

//                {/* 🔹 Productivity */}
//                <div className="rounded-xl border p-6 shadow-sm h-[320px] flex flex-col">
//                    <h3 className="text-lg font-semibold mb-4">Productivity</h3>

//                    <div className="flex-1">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <AreaChart data={chartData}>
//                                <CartesianGrid strokeDasharray="3 3" />
//                                <XAxis dataKey="name" />
//                                <YAxis />
//                                <Tooltip />
//                                <Area type="monotone" dataKey="value" />
//                            </AreaChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>

//            </div>
//        </DashboardShell>
//    )
//}

"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
    LayoutDashboard,
    Calendar,
    MessageSquare,
    Video,
    Users,
    StickyNote,
    BarChart3,
    Megaphone,
    Briefcase,
    TrendingUp,
    CheckCircle2,
    RefreshCw,
    AlertTriangle,
    ArrowRight,
    Inbox,
    Clock3,
} from "lucide-react"
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const navItems = [
    { label: "Dashboard", href: "/dashboard/hr", icon: LayoutDashboard },
    { label: "Calendar", href: "/dashboard/hr/calendar", icon: Calendar },
    { label: "AI Chat", href: "/dashboard/hr/chat", icon: MessageSquare },
    { label: "Employees Management", href: "/dashboard/hr/employees", icon: Users },
    { label: "Meetings", href: "/dashboard/hr/meetings", icon: Video },
    { label: "Tasks", href: "/dashboard/hr/tasks", icon: CheckCircle2 },
    { label: "Team", href: "/dashboard/hr/team", icon: Users },
    { label: "Notes", href: "/dashboard/hr/notes", icon: StickyNote },
    { label: "Announcements", href: "/dashboard/hr/announcements", icon: Megaphone },
    { label: "Analytics", href: "/dashboard/hr/analytics", icon: BarChart3 },
]

const API_BASE = "https://steadfast-warmth-production-64c8.up.railway.app"
const PANEL_HEIGHT = "h-[420px]"

type MeetingItem = {
    id: string | number
    title?: string
    meetingTitle?: string
    startTime: string
    endTime?: string
}

type TaskItem = {
    id: string
    title: string
    description?: string
    priority: "Low" | "Medium" | "High"
    status: "Todo" | "In Progress" | "Completed"
    deadline?: string
    assignedUserName?: string
}

type AnnouncementItem = {
    id: number
    title: string
    content: string
    audience: string
    status?: string
    createdAt: string
}

function isOverdue(deadline?: string, status?: string) {
    if (!deadline || status === "Completed") return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(deadline)
    due.setHours(0, 0, 0, 0)
    return due.getTime() < today.getTime()
}

function isToday(dateValue?: string) {
    if (!dateValue) return false
    const value = new Date(dateValue)
    return value.toDateString() === new Date().toDateString()
}

function getPriorityOrder(priority: string) {
    switch (priority) {
        case "High":
            return 0
        case "Medium":
            return 1
        default:
            return 2
    }
}

function getPriorityClasses(priority: string) {
    switch (priority) {
        case "High":
            return "border-red-300 bg-red-500/10 text-red-700"
        case "Medium":
            return "border-amber-300 bg-amber-500/10 text-amber-700"
        default:
            return "border-emerald-300 bg-emerald-500/10 text-emerald-700"
    }
}

function getStatusClasses(status?: string) {
    switch ((status || "").toLowerCase()) {
        case "published":
        case "active":
        case "completed":
            return "border-emerald-300 bg-emerald-500/10 text-emerald-700"
        case "pending":
        case "draft":
            return "border-amber-300 bg-amber-500/10 text-amber-700"
        default:
            return "border-slate-300 bg-slate-500/10 text-slate-700"
    }
}

function getTaskProgress(status: string) {
    switch (status) {
        case "Completed":
            return 100
        case "In Progress":
            return 60
        default:
            return 20
    }
}

async function safeJson(res: Response) {
    if (!res.ok) return []
    const text = await res.text()
    if (!text) return []
    try {
        return JSON.parse(text)
    } catch {
        return []
    }
}

function SectionCard({
    title,
    action,
    children,
    className = "",
}: {
    title: string
    action?: React.ReactNode
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={`flex ${PANEL_HEIGHT} min-h-0 flex-col rounded-2xl border bg-card p-6 shadow-sm ${className}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{title}</h3>
                {action}
            </div>
            <div className="min-h-0 flex-1">{children}</div>
        </div>
    )
}

export default function ProfessionalDashboard() {
    const router = useRouter()

    const [meetings, setMeetings] = useState<MeetingItem[]>([])
    const [tasks, setTasks] = useState<TaskItem[]>([])
    const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState("")
    const [lastUpdated, setLastUpdated] = useState("")

    useEffect(() => {
        fetchDashboardData()

        const interval = setInterval(() => {
            fetchDashboardData(true)
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    async function fetchDashboardData(isRefresh = false) {
        const token = localStorage.getItem("token")
        if (!token) return

        try {
            if (isRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            setError("")

            const [meetingRes, taskRes, announcementRes] = await Promise.all([
                fetch(`${API_BASE}/api/Meeting/my-meetings`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${API_BASE}/api/Tasks`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${API_BASE}/api/Announcement`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ])

            const [meetingData, taskData, announcementData] = await Promise.all([
                safeJson(meetingRes),
                safeJson(taskRes),
                safeJson(announcementRes),
            ])

            const normalizedMeetings = Array.isArray(meetingData) ? meetingData : []
            const normalizedTasks = Array.isArray(taskData)
                ? taskData.map((task: any) => ({
                    ...task,
                    deadline: task.deadline ? task.deadline.split("T")[0] : "",
                }))
                : []
            const normalizedAnnouncements = Array.isArray(announcementData)
                ? announcementData
                    .filter((item: any) => item)
                    .sort(
                        (a: AnnouncementItem, b: AnnouncementItem) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                : []

            setMeetings(normalizedMeetings)
            setTasks(normalizedTasks)
            setAnnouncements(normalizedAnnouncements)
            setLastUpdated(
                new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            )
        } catch (err) {
            console.error("Dashboard error:", err)
            setError("Unable to load dashboard data right now.")
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const upcomingMeetings = useMemo(() => {
        const now = new Date()
        return [...meetings]
            .filter((meeting) => new Date(meeting.startTime) >= now)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .slice(0, 5)
    }, [meetings])

    const priorityTasks = useMemo(() => {
        return [...tasks]
            .filter((task) => task.status !== "Completed")
            .sort((a, b) => {
                const overdueA = isOverdue(a.deadline, a.status) ? 1 : 0
                const overdueB = isOverdue(b.deadline, b.status) ? 1 : 0
                if (overdueA !== overdueB) return overdueB - overdueA

                const priorityDiff = getPriorityOrder(a.priority) - getPriorityOrder(b.priority)
                if (priorityDiff !== 0) return priorityDiff

                if (!a.deadline) return 1
                if (!b.deadline) return -1

                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            })
            .slice(0, 5)
    }, [tasks])

    const latestAnnouncements = useMemo(() => announcements.slice(0, 5), [announcements])

    const completedTasks = tasks.filter((task) => task.status === "Completed").length
    const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length
    const todoTasks = tasks.filter((task) => task.status === "Todo").length
    const overdueTasks = tasks.filter((task) => isOverdue(task.deadline, task.status)).length
    const todayMeetings = meetings.filter((meeting) => isToday(meeting.startTime)).length
    const productivity = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0

    const productivityData = [
        { name: "Completed", value: completedTasks, color: "#22c55e" },
        { name: "In Progress", value: inProgressTasks, color: "#3b82f6" },
        { name: "Todo", value: todoTasks, color: "#94a3b8" },
    ]

    const taskStatusBars = [
        { name: "Todo", value: todoTasks, color: "#94a3b8" },
        { name: "Progress", value: inProgressTasks, color: "#3b82f6" },
        { name: "Done", value: completedTasks, color: "#22c55e" },
    ]

    if (loading) {
        return (
            <DashboardShell navItems={navItems} role="hr" title="Dashboard">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="rounded-2xl border bg-card p-6">
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 w-28 rounded bg-muted" />
                                <div className="h-8 w-20 rounded bg-muted" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className={`${PANEL_HEIGHT} rounded-2xl border bg-card p-6`}>
                            <div className="animate-pulse space-y-4">
                                <div className="h-5 w-40 rounded bg-muted" />
                                <div className="h-72 rounded bg-muted" />
                            </div>
                        </div>
                    ))}
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell navItems={navItems} role="hr" title="Dashboard">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">HR Dashboard</h2>
                        <p className="text-sm text-muted-foreground">
                            Track urgent work, team activity, and next actions in one place.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                            Last updated: {lastUpdated || "Just now"}
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => fetchDashboardData(true)}
                            disabled={refreshing}
                        >
                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                    <StatCard icon={Video} title="Meetings" value={String(meetings.length)} />
                    <StatCard icon={Briefcase} title="Tasks" value={String(tasks.length)} />
                    <StatCard icon={Megaphone} title="Announcements" value={String(announcements.length)} />
                    <StatCard icon={TrendingUp} title="Completed Tasks" value={String(completedTasks)} />
                    <StatCard icon={AlertTriangle} title="Overdue Tasks" value={String(overdueTasks)} />
                    <StatCard icon={Calendar} title="Today's Meetings" value={String(todayMeetings)} />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Needs Attention</p>
                        <h3 className="mt-1 text-lg font-semibold">{overdueTasks} overdue tasks need action</h3>
                    </div>

                    <div className="rounded-2xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Today</p>
                        <h3 className="mt-1 text-lg font-semibold">{todayMeetings} meetings scheduled today</h3>
                    </div>

                    <div className="rounded-2xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Completion Rate</p>
                        <h3 className="mt-1 text-lg font-semibold">{productivity}% task completion</h3>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <Button className="justify-between rounded-xl" onClick={() => router.push("/dashboard/hr/tasks")}>
                        Create Task
                        <ArrowRight className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        className="justify-between rounded-xl"
                        onClick={() => router.push("/dashboard/hr/meetings")}
                    >
                        Schedule Meeting
                        <ArrowRight className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        className="justify-between rounded-xl"
                        onClick={() => router.push("/dashboard/hr/announcements")}
                    >
                        Add Announcement
                        <ArrowRight className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        className="justify-between rounded-xl"
                        onClick={() => router.push("/dashboard/hr/analytics")}
                    >
                        View Analytics
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <SectionCard
                        title="Upcoming Meetings"
                        action={
                            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/hr/meetings")}>
                                View all
                            </Button>
                        }
                    >
                        <div className="h-full overflow-y-auto pr-1">
                            {upcomingMeetings.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                                    <Video className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">No upcoming meetings</p>
                                    <Button size="sm" onClick={() => router.push("/dashboard/hr/meetings")}>
                                        Schedule meeting
                                    </Button>
                                </div>
                            ) : (
                                upcomingMeetings.map((meeting) => (
                                    <div key={meeting.id} className="mb-3 rounded-xl bg-muted/50 p-4 transition hover:shadow-sm">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-4">
                                                <div className="min-w-[72px] text-center">
                                                    <p className="text-sm font-semibold text-primary">
                                                        {new Date(meeting.startTime).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(meeting.startTime).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-medium">
                                                        {meeting.meetingTitle || meeting.title || "Meeting"}
                                                    </p>
                                                </div>
                                            </div>

                                            <Badge variant="secondary">Upcoming</Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Priority Tasks"
                        action={
                            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/hr/tasks")}>
                                View all
                            </Button>
                        }
                    >
                        <div className="h-full overflow-y-auto pr-1">
                            {priorityTasks.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                                    <Briefcase className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">No active tasks</p>
                                    <Button size="sm" onClick={() => router.push("/dashboard/hr/tasks")}>
                                        Create task
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {priorityTasks.map((task) => {
                                        const progress = getTaskProgress(task.status)
                                        const overdue = isOverdue(task.deadline, task.status)

                                        return (
                                            <div
                                                key={task.id}
                                                className={`rounded-xl border p-4 transition hover:shadow-sm ${overdue ? "border-red-300 bg-red-500/5" : "bg-muted/40"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="line-clamp-1 font-medium">{task.title}</p>
                                                    <Badge className={getPriorityClasses(task.priority)}>
                                                        {task.priority}
                                                    </Badge>
                                                </div>

                                                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                                    {task.description || "No description"}
                                                </p>

                                                <div className="mt-3">
                                                    <div className="mb-1 flex justify-between text-xs">
                                                        <span>{task.status}</span>
                                                        <span>{progress}%</span>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-muted">
                                                        <div
                                                            className={`h-2 rounded-full ${overdue ? "bg-red-500" : "bg-primary"
                                                                }`}
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                                                    <span className="truncate">{task.deadline || "No deadline"}</span>
                                                    {task.assignedUserName && (
                                                        <span className="truncate">{task.assignedUserName}</span>
                                                    )}
                                                </div>

                                                {overdue && (
                                                    <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        Overdue task
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Latest Announcements"
                        action={
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push("/dashboard/hr/announcements")}
                            >
                                View all
                            </Button>
                        }
                    >
                        <div className="h-full overflow-y-auto pr-1">
                            {latestAnnouncements.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                                    <Megaphone className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">No announcements</p>
                                    <Button size="sm" onClick={() => router.push("/dashboard/hr/announcements")}>
                                        Add announcement
                                    </Button>
                                </div>
                            ) : (
                                latestAnnouncements.map((announcement) => (
                                    <div key={announcement.id} className="mb-3 rounded-xl bg-muted/50 p-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-medium">{announcement.title}</p>
                                            <Badge variant="outline">{announcement.audience}</Badge>
                                            {announcement.status && (
                                                <Badge className={getStatusClasses(announcement.status)}>
                                                    {announcement.status}
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                                            {announcement.content}
                                        </p>

                                        <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                                            <Clock3 className="h-3 w-3" />
                                            {new Date(announcement.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Productivity Overview"
                        action={<Badge variant="secondary">{productivity}% complete</Badge>}
                    >
                        {tasks.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                                <Inbox className="h-8 w-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">No task analytics yet</p>
                                <Button size="sm" onClick={() => router.push("/dashboard/hr/tasks")}>
                                    Create task
                                </Button>
                            </div>
                        ) : (
                            <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
                                <div className="flex min-h-0 flex-col rounded-xl bg-muted/30 p-3">
                                    <div className="h-[180px] w-full shrink-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={productivityData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    innerRadius={48}
                                                    outerRadius={76}
                                                    paddingAngle={4}
                                                >
                                                    {productivityData.map((item, index) => (
                                                        <Cell key={index} fill={item.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
                                        <div className="grid gap-2">
                                            {productivityData.map((item) => (
                                                <div
                                                    key={item.name}
                                                    className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-xs"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="h-2.5 w-2.5 rounded-full"
                                                            style={{ backgroundColor: item.color }}
                                                        />
                                                        <span>{item.name}</span>
                                                    </div>
                                                    <span className="font-medium">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="min-h-0 rounded-xl bg-muted/30 p-3">
                                    <div className="mb-2">
                                        <p className="text-sm font-medium">Task Status Breakdown</p>
                                        <p className="text-xs text-muted-foreground">
                                            Clear view of pending vs active vs completed work
                                        </p>
                                    </div>

                                    <div className="h-[280px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={taskStatusBars} barCategoryGap={24}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                                <YAxis
                                                    allowDecimals={false}
                                                    width={28}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <Tooltip />
                                                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={42}>
                                                    {taskStatusBars.map((item, index) => (
                                                        <Cell key={index} fill={item.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        )}
                    </SectionCard>
                </div>
            </div>
        </DashboardShell>
    )
}
