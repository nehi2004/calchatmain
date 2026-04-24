//"use client"

//import {
//    LayoutDashboard, Calendar, MessageSquare, Video, CalendarDays, Users, StickyNote, BarChart3,
//    Briefcase, Clock, TrendingUp, CheckCircle2, Megaphone
//} from "lucide-react"
//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Badge } from "@/components/ui/badge"
//import { Progress } from "@/components/ui/progress"
//import {
//  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//} from "recharts"

//const navItems = [




//"use client"

//import { useEffect, useState, useMemo } from "react"
//import {
//    LayoutDashboard, Calendar, MessageSquare, Video, Users,
//    StickyNote, BarChart3, Briefcase, TrendingUp, CheckCircle2, Megaphone,
//    Flame, Zap, Leaf, Clock
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Badge } from "@/components/ui/badge"
//import { Progress } from "@/components/ui/progress"

//import {
//    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
//} from "recharts"

///* ================= NAV ================= */

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/professional", icon: LayoutDashboard },
//    { label: "Calendar", href: "/dashboard/professional/calendar", icon: Calendar },
//    { label: "AI Chat", href: "/dashboard/professional/chat", icon: MessageSquare },
//    { label: "Meetings", href: "/dashboard/professional/meetings", icon: Video },
//    { label: "Tasks", href: "/dashboard/professional/tasks", icon: CheckCircle2 },
//    { label: "Team", href: "/dashboard/professional/team", icon: Users },
//    { label: "Notes", href: "/dashboard/professional/notes", icon: StickyNote },
//    { label: "Announcements", href: "/dashboard/professional/announcements", icon: Megaphone },
//    { label: "Analytics", href: "/dashboard/professional/analytics", icon: BarChart3 },
//]

///* ================= TYPES ================= */

//interface Meeting {
//    id: string
//    meetingTitle?: string
//    title?: string
//    startTime: string
//}

//interface Task {
//    id: string
//    title: string
//    priority: string
//    status: string
//    description?: string
//    deadline?: string
//}

//interface Announcement {
//    id: number
//    title: string
//    content: string
//    audience: string
//    status: string
//    createdAt: string
//}

///* ================= COMPONENT ================= */

//export default function ProfessionalDashboard() {

//    const [meetings, setMeetings] = useState<Meeting[]>([])
//    const [tasks, setTasks] = useState<Task[]>([])
//    const [announcements, setAnnouncements] = useState<Announcement[]>([])
//    const [loading, setLoading] = useState(true)

//    const userRole = "Professional"

//    useEffect(() => {
//        fetchAll()
//    }, [])

//    const getHeaders = () => ({
//        Authorization: `Bearer ${localStorage.getItem("token")}`
//    })

//    async function safeJson(res: Response) {
//        if (!res.ok) return []
//        const text = await res.text()
//        if (!text) return []
//        try { return JSON.parse(text) } catch { return [] }
//    }

//    async function fetchAll() {
//        try {
//            const [mRes, tRes, aRes] = await Promise.all([
//                fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Meeting/my-meetings", { headers: getHeaders() }),
//                fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks", { headers: getHeaders() }),
//                fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Announcement", { headers: getHeaders() })
//            ])

//            const aData = await safeJson(aRes)

//            setMeetings(await safeJson(mRes))
//            setTasks(await safeJson(tRes))

//            const filtered = aData.filter((a: Announcement) =>
//                a.audience === "All Users" || a.audience === userRole
//            )

//            setAnnouncements(filtered)

//        } finally {
//            setLoading(false)
//        }
//    }

//    /* ================= STATS ================= */

//    const completedTasks = tasks.filter(t => t.status === "Completed").length
//    const productivity = tasks.length
//        ? Math.round((completedTasks / tasks.length) * 100)
//        : 0

//    /* ================= WEEKLY GRAPH ================= */

//    const weeklyData = useMemo(() => {
//        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
//        const result: any = {}

//        days.forEach(d => {
//            result[d] = { day: d, tasks: 0 }
//        })

//        tasks.forEach(t => {
//            if (!t.deadline) return
//            const day = days[new Date(t.deadline).getDay()]
//            result[day].tasks++
//        })

//        meetings.forEach(m => {
//            const day = days[new Date(m.startTime).getDay()]
//            result[day].tasks++
//        })

//        return Object.values(result)
//    }, [tasks, meetings])

//    /* ================= BADGES ================= */

//    function PriorityBadge({ priority }: { priority: string }) {
//        if (priority === "High") {
//            return (
//                <Badge className="bg-red-500/10 text-red-600 border border-red-300 flex gap-1 items-center">
//                    <Flame className="h-3 w-3" /> High
//                </Badge>
//            )
//        }
//        if (priority === "Medium") {
//            return (
//                <Badge className="bg-yellow-500/10 text-yellow-600 border border-yellow-300 flex gap-1 items-center">
//                    <Zap className="h-3 w-3" /> Medium
//                </Badge>
//            )
//        }
//        return (
//            <Badge className="bg-green-500/10 text-green-600 border border-green-300 flex gap-1 items-center">
//                <Leaf className="h-3 w-3" /> Low
//            </Badge>
//        )
//    }

//    function StatusBadge({ status }: { status: string }) {
//        return (
//            <Badge className="bg-blue-500/10 text-blue-600 border border-blue-300">
//                {status}
//            </Badge>
//        )
//    }

//    if (loading) return <p className="p-6 text-center">Loading...</p>

//    return (
//        <DashboardShell navItems={navItems} role="Professional" title="Dashboard">

//            {/* STATS */}
//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                <StatCard icon={Video} title="Meetings" value={String(meetings.length)} />
//                <StatCard icon={Briefcase} title="Tasks" value={String(tasks.length)} />
//                <StatCard icon={CheckCircle2} title="Completed" value={String(completedTasks)} />
//                <StatCard icon={TrendingUp} title="Productivity" value={`${productivity}%`} />
//            </div>

//            {/* CONTENT */}
//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* MEETINGS */}
//                <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-6 shadow-sm hover:shadow-xl transition">
//                    <h3 className="text-lg font-semibold">Upcoming Meetings</h3>

//                    <div className="mt-4 flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2">

//                        {meetings.map(m => (
//                            <div key={m.id} className="flex justify-between items-center p-3 rounded-xl bg-muted/40 hover:scale-[1.02] transition">

//                                <div className="flex gap-4 items-center">

//                                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">
//                                        {new Date(m.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                                    </div>

//                                    <p className="font-medium">
//                                        {m.meetingTitle || m.title}
//                                    </p>
//                                </div>

//                                <StatusBadge status="Meeting" />
//                            </div>
//                        ))}

//                    </div>
//                </div>

//                {/* TASKS */}
//                <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-6 shadow-sm hover:shadow-xl transition">
//                    <h3 className="text-lg font-semibold">Tasks</h3>

//                    <div className="mt-4 flex flex-col gap-4 max-h-[250px] overflow-y-auto pr-2">

//                        {tasks.map(t => {

//                            const progress =
//                                t.status === "Completed" ? 100 :
//                                    t.status === "In Progress" ? 60 : 20

//                            return (
//                                <div key={t.id} className="p-4 rounded-xl bg-muted/40 hover:scale-[1.01] transition">

//                                    <div className="flex justify-between items-center">
//                                        <p className="font-medium">{t.title}</p>
//                                        <PriorityBadge priority={t.priority} />
//                                    </div>

//                                    <div className="mt-3">
//                                        <Progress value={progress} className="h-2" />
//                                    </div>

//                                </div>
//                            )
//                        })}

//                    </div>
//                </div>

//                {/* GRAPH */}
//                <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-6 shadow-sm hover:shadow-xl transition">
//                    <h3 className="text-lg font-semibold">Weekly Activity</h3>

//                    <div className="h-64 mt-4">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <AreaChart data={weeklyData}>
//                                <CartesianGrid strokeDasharray="3 3" />
//                                <XAxis dataKey="day" />
//                                <YAxis />
//                                <Tooltip />
//                                <Area type="monotone" dataKey="tasks" stroke="#3b82f6" fill="#93c5fd" />
//                            </AreaChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>

//                {/* ANNOUNCEMENTS */}
//                <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-6 shadow-sm hover:shadow-xl transition max-h-[350px] overflow-y-auto pr-2">
//                    <h3 className="text-lg font-semibold">Announcements</h3>

//                    <div className="mt-4 flex flex-col gap-4">

//                        {announcements.map(a => (
//                            <div key={a.id} className="p-4 rounded-xl bg-muted/40 hover:scale-[1.01] transition">

//                                <div className="flex items-center gap-2 flex-wrap">
//                                    <h4 className="font-medium">{a.title}</h4>

//                                    <StatusBadge status={a.status} />

//                                    <Badge variant="outline">
//                                        {a.audience}
//                                    </Badge>
//                                </div>

//                                <p className="text-sm text-muted-foreground mt-2">
//                                    {a.content}
//                                </p>

//                                <div className="flex items-center gap-1 text-xs mt-3 text-muted-foreground">
//                                    <Clock className="h-3 w-3" />
//                                    {new Date(a.createdAt).toLocaleString()}
//                                </div>

//                            </div>
//                        ))}

//                    </div>
//                </div>

//            </div>

//        </DashboardShell>
//    )
//}

//"use client"

//import { useEffect, useMemo, useState } from "react"
//import { useRouter } from "next/navigation"
//import {
//    LayoutDashboard,
//    Calendar,
//    MessageSquare,
//    Video,
//    Users,
//    StickyNote,
//    BarChart3,
//    Briefcase,
//    TrendingUp,
//    CheckCircle2,
//    Megaphone,
//    Flame,
//    Zap,
//    Leaf,
//    Clock,
//    RefreshCw,
//    AlertTriangle,
//    ArrowRight,
//    Inbox,
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Badge } from "@/components/ui/badge"
//import { Progress } from "@/components/ui/progress"
//import { Button } from "@/components/ui/button"

//import {
//    AreaChart,
//    Area,
//    XAxis,
//    YAxis,
//    CartesianGrid,
//    Tooltip,
//    ResponsiveContainer,
//} from "recharts"

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/professional", icon: LayoutDashboard },
//    { label: "Calendar", href: "/dashboard/professional/calendar", icon: Calendar },
//    { label: "AI Chat", href: "/dashboard/professional/chat", icon: MessageSquare },
//    { label: "Meetings", href: "/dashboard/professional/meetings", icon: Video },
//    { label: "Tasks", href: "/dashboard/professional/tasks", icon: CheckCircle2 },
//    //{ label: "Team", href: "/dashboard/professional/team", icon: Users },
//    { label: "Notes", href: "/dashboard/professional/notes", icon: StickyNote },
//    { label: "Announcements", href: "/dashboard/professional/announcements", icon: Megaphone },
//    { label: "Analytics", href: "/dashboard/professional/analytics", icon: BarChart3 },
//]

//const API_BASE = "https://steadfast-warmth-production-64c8.up.railway.app"
//const PANEL_HEIGHT = "h-[420px]"

//interface Meeting {
//    id: string
//    meetingTitle?: string
//    title?: string
//    startTime: string
//}

//interface Task {
//    id: string
//    title: string
//    priority: "Low" | "Medium" | "High"
//    status: "Todo" | "In Progress" | "Completed"
//    description?: string
//    deadline?: string
//}

//interface Announcement {
//    id: number
//    title: string
//    content: string
//    audience: string
//    status: string
//    createdAt: string
//}

//function isOverdue(deadline?: string, status?: string) {
//    if (!deadline || status === "Completed") return false
//    const today = new Date()
//    today.setHours(0, 0, 0, 0)
//    const due = new Date(deadline)
//    due.setHours(0, 0, 0, 0)
//    return due.getTime() < today.getTime()
//}

//function isToday(dateValue?: string) {
//    if (!dateValue) return false
//    return new Date(dateValue).toDateString() === new Date().toDateString()
//}

//function getPriorityOrder(priority: string) {
//    switch (priority) {
//        case "High":
//            return 0
//        case "Medium":
//            return 1
//        default:
//            return 2
//    }
//}

//function getTaskProgress(status: Task["status"]) {
//    switch (status) {
//        case "Completed":
//            return 100
//        case "In Progress":
//            return 60
//        default:
//            return 20
//    }
//}

//function formatShortDate(date: Date) {
//    return date.toLocaleDateString(undefined, {
//        month: "short",
//        day: "numeric",
//    })
//}

//async function safeJson(res: Response) {
//    if (!res.ok) return []
//    const text = await res.text()
//    if (!text) return []
//    try {
//        return JSON.parse(text)
//    } catch {
//        return []
//    }
//}

//function PriorityBadge({ priority }: { priority: Task["priority"] }) {
//    if (priority === "High") {
//        return (
//            <Badge className="flex items-center gap-1 border border-red-300 bg-red-500/10 text-red-600">
//                <Flame className="h-3 w-3" />
//                High
//            </Badge>
//        )
//    }

//    if (priority === "Medium") {
//        return (
//            <Badge className="flex items-center gap-1 border border-yellow-300 bg-yellow-500/10 text-yellow-600">
//                <Zap className="h-3 w-3" />
//                Medium
//            </Badge>
//        )
//    }

//    return (
//        <Badge className="flex items-center gap-1 border border-green-300 bg-green-500/10 text-green-600">
//            <Leaf className="h-3 w-3" />
//            Low
//        </Badge>
//    )
//}

//function StatusBadge({ status }: { status: string }) {
//    return (
//        <Badge className="border border-blue-300 bg-blue-500/10 text-blue-600">
//            {status}
//        </Badge>
//    )
//}

//function SectionCard({
//    title,
//    action,
//    children,
//}: {
//    title: string
//    action?: React.ReactNode
//    children: React.ReactNode
//}) {
//    return (
//        <div className={`flex min-h-0 ${PANEL_HEIGHT} flex-col rounded-2xl border bg-background/60 p-6 shadow-sm backdrop-blur-md`}>
//            <div className="mb-4 flex items-center justify-between gap-3">
//                <h3 className="text-lg font-semibold">{title}</h3>
//                {action}
//            </div>
//            <div className="min-h-0 flex-1">{children}</div>
//        </div>
//    )
//}

//export default function ProfessionalDashboard() {
//    const router = useRouter()

//    const [meetings, setMeetings] = useState<Meeting[]>([])
//    const [tasks, setTasks] = useState<Task[]>([])
//    const [announcements, setAnnouncements] = useState<Announcement[]>([])
//    const [loading, setLoading] = useState(true)
//    const [refreshing, setRefreshing] = useState(false)
//    const [error, setError] = useState("")
//    const [lastUpdated, setLastUpdated] = useState("")

//    const userRole = "Professional"

//    useEffect(() => {
//        fetchAll()

//        const interval = setInterval(() => {
//            fetchAll(true)
//        }, 30000)

//        return () => clearInterval(interval)
//    }, [])

//    const getHeaders = () => ({
//        Authorization: `Bearer ${localStorage.getItem("token")}`,
//    })

//    async function fetchAll(isRefresh = false) {
//        try {
//            if (isRefresh) {
//                setRefreshing(true)
//            } else {
//                setLoading(true)
//            }

//            setError("")

//            const [mRes, tRes, aRes] = await Promise.all([
//                fetch(`${API_BASE}/api/Meeting/my-meetings`, { headers: getHeaders() }),
//                fetch(`${API_BASE}/api/Tasks`, { headers: getHeaders() }),
//                fetch(`${API_BASE}/api/Announcement`, { headers: getHeaders() }),
//            ])

//            const [meetingData, taskData, announcementData] = await Promise.all([
//                safeJson(mRes),
//                safeJson(tRes),
//                safeJson(aRes),
//            ])

//            const normalizedMeetings = Array.isArray(meetingData) ? meetingData : []
//            const normalizedTasks = Array.isArray(taskData)
//                ? taskData.map((task: any) => ({
//                    ...task,
//                    deadline: task.deadline ? task.deadline.split("T")[0] : "",
//                }))
//                : []
//            const normalizedAnnouncements = Array.isArray(announcementData)
//                ? announcementData
//                    .filter(
//                        (a: Announcement) =>
//                            a.audience === "All Users" || a.audience === userRole
//                    )
//                    .sort(
//                        (a: Announcement, b: Announcement) =>
//                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//                    )
//                : []

//            setMeetings(normalizedMeetings)
//            setTasks(normalizedTasks)
//            setAnnouncements(normalizedAnnouncements)
//            setLastUpdated(
//                new Date().toLocaleTimeString([], {
//                    hour: "2-digit",
//                    minute: "2-digit",
//                })
//            )
//        } catch (err) {
//            console.error("Professional dashboard error:", err)
//            setError("Unable to load dashboard data right now.")
//        } finally {
//            setLoading(false)
//            setRefreshing(false)
//        }
//    }

//    const upcomingMeetings = useMemo(() => {
//        const now = new Date()
//        return [...meetings]
//            .filter((meeting) => new Date(meeting.startTime) >= now)
//            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
//            .slice(0, 5)
//    }, [meetings])

//    const priorityTasks = useMemo(() => {
//        return [...tasks]
//            .sort((a, b) => {
//                const overdueA = isOverdue(a.deadline, a.status) ? 1 : 0
//                const overdueB = isOverdue(b.deadline, b.status) ? 1 : 0
//                if (overdueA !== overdueB) return overdueB - overdueA

//                if (a.status !== b.status) {
//                    if (a.status === "In Progress") return -1
//                    if (b.status === "In Progress") return 1
//                }

//                const priorityDiff = getPriorityOrder(a.priority) - getPriorityOrder(b.priority)
//                if (priorityDiff !== 0) return priorityDiff

//                if (!a.deadline) return 1
//                if (!b.deadline) return -1

//                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
//            })
//            .slice(0, 5)
//    }, [tasks])

//    const latestAnnouncements = useMemo(() => announcements.slice(0, 5), [announcements])

//    const completedTasks = tasks.filter((t) => t.status === "Completed").length
//    const todayMeetings = meetings.filter((m) => isToday(m.startTime)).length
//    const overdueTasks = tasks.filter((t) => isOverdue(t.deadline, t.status)).length
//    const productivity = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0

//    const last7DaysActivity = useMemo(() => {
//        const today = new Date()
//        today.setHours(0, 0, 0, 0)

//        const days = Array.from({ length: 7 }, (_, i) => {
//            const date = new Date(today)
//            date.setDate(today.getDate() - (6 - i))
//            return {
//                key: date.toISOString().split("T")[0],
//                day: formatShortDate(date),
//                activity: 0,
//            }
//        })

//        const map = new Map(days.map((d) => [d.key, d]))

//        tasks.forEach((task) => {
//            if (!task.deadline) return
//            const item = map.get(task.deadline)
//            if (item) item.activity += 1
//        })

//        meetings.forEach((meeting) => {
//            const key = new Date(meeting.startTime).toISOString().split("T")[0]
//            const item = map.get(key)
//            if (item) item.activity += 1
//        })

//        return days
//    }, [tasks, meetings])

//    if (loading) {
//        return (
//            <DashboardShell navItems={navItems} role="Professional" title="Dashboard">
//                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                    {Array.from({ length: 4 }).map((_, index) => (
//                        <div key={index} className="rounded-2xl border bg-card p-6">
//                            <div className="animate-pulse space-y-3">
//                                <div className="h-4 w-28 rounded bg-muted" />
//                                <div className="h-8 w-20 rounded bg-muted" />
//                            </div>
//                        </div>
//                    ))}
//                </div>

//                <div className="mt-6 grid gap-6 lg:grid-cols-2">
//                    {Array.from({ length: 4 }).map((_, index) => (
//                        <div key={index} className={`${PANEL_HEIGHT} rounded-2xl border bg-card p-6`}>
//                            <div className="animate-pulse space-y-4">
//                                <div className="h-5 w-40 rounded bg-muted" />
//                                <div className="h-72 rounded bg-muted" />
//                            </div>
//                        </div>
//                    ))}
//                </div>
//            </DashboardShell>
//        )
//    }

//    return (
//        <DashboardShell navItems={navItems} role="Professional" title="Dashboard">
//            <div className="flex flex-col gap-6">
//                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                    <div>
//                        <h2 className="text-2xl font-semibold">Professional Dashboard</h2>
//                        <p className="text-sm text-muted-foreground">
//                            Stay on top of your meetings, tasks, updates, and weekly activity.
//                        </p>
//                    </div>

//                    <div className="flex items-center gap-2">
//                        <p className="text-xs text-muted-foreground">
//                            Last updated: {lastUpdated || "Just now"}
//                        </p>
//                        <Button variant="outline" onClick={() => fetchAll(true)} disabled={refreshing}>
//                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
//                            Refresh
//                        </Button>
//                    </div>
//                </div>

//                {error && (
//                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                        {error}
//                    </div>
//                )}

//                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                    <StatCard icon={Video} title="Meetings" value={String(meetings.length)} />
//                    <StatCard icon={Briefcase} title="Tasks" value={String(tasks.length)} />
//                    <StatCard icon={CheckCircle2} title="Completed" value={String(completedTasks)} />
//                    <StatCard icon={TrendingUp} title="Productivity" value={`${productivity}%`} />
//                </div>

//                <div className="grid gap-4 lg:grid-cols-3">
//                    <div className="rounded-2xl border bg-card p-5">
//                        <p className="text-sm text-muted-foreground">Today</p>
//                        <h3 className="mt-1 text-lg font-semibold">{todayMeetings} meetings scheduled today</h3>
//                    </div>

//                    <div className="rounded-2xl border bg-card p-5">
//                        <p className="text-sm text-muted-foreground">Needs Attention</p>
//                        <h3 className="mt-1 text-lg font-semibold">{overdueTasks} overdue tasks</h3>
//                    </div>

//                    <div className="rounded-2xl border bg-card p-5">
//                        <p className="text-sm text-muted-foreground">Focus Score</p>
//                        <h3 className="mt-1 text-lg font-semibold">{productivity}% completion rate</h3>
//                    </div>
//                </div>

//                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
//                    <Button className="justify-between rounded-xl" onClick={() => router.push("/dashboard/professional/tasks")}>
//                        Open Tasks
//                        <ArrowRight className="h-4 w-4" />
//                    </Button>

//                    <Button
//                        variant="outline"
//                        className="justify-between rounded-xl"
//                        onClick={() => router.push("/dashboard/professional/meetings")}
//                    >
//                        Open Meetings
//                        <ArrowRight className="h-4 w-4" />
//                    </Button>

//                    <Button
//                        variant="outline"
//                        className="justify-between rounded-xl"
//                        onClick={() => router.push("/dashboard/professional/announcements")}
//                    >
//                        View Announcements
//                        <ArrowRight className="h-4 w-4" />
//                    </Button>

//                    <Button
//                        variant="outline"
//                        className="justify-between rounded-xl"
//                        onClick={() => router.push("/dashboard/professional/analytics")}
//                    >
//                        View Analytics
//                        <ArrowRight className="h-4 w-4" />
//                    </Button>
//                </div>

//                <div className="grid gap-6 lg:grid-cols-2">
//                    <SectionCard
//                        title="Upcoming Meetings"
//                        action={
//                            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/professional/meetings")}>
//                                View all
//                            </Button>
//                        }
//                    >
//                        <div className="h-full overflow-y-auto pr-1">
//                            {upcomingMeetings.length === 0 ? (
//                                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
//                                    <Video className="h-8 w-8 text-muted-foreground" />
//                                    <p className="text-sm text-muted-foreground">No upcoming meetings</p>
//                                    <Button size="sm" onClick={() => router.push("/dashboard/professional/meetings")}>
//                                        Open meetings
//                                    </Button>
//                                </div>
//                            ) : (
//                                upcomingMeetings.map((meeting) => (
//                                    <div key={meeting.id} className="mb-3 rounded-xl bg-muted/40 p-4 transition hover:shadow-sm">
//                                        <div className="flex items-center justify-between gap-3">
//                                            <div className="flex items-center gap-4">
//                                                <div className="rounded-lg bg-primary/10 px-3 py-2 text-center text-sm text-primary">
//                                                    {new Date(meeting.startTime).toLocaleTimeString([], {
//                                                        hour: "2-digit",
//                                                        minute: "2-digit",
//                                                    })}
//                                                </div>

//                                                <div className="min-w-0">
//                                                    <p className="truncate font-medium">
//                                                        {meeting.meetingTitle || meeting.title || "Meeting"}
//                                                    </p>
//                                                    <p className="text-xs text-muted-foreground">
//                                                        {new Date(meeting.startTime).toLocaleDateString()}
//                                                    </p>
//                                                </div>
//                                            </div>

//                                            <StatusBadge status="Meeting" />
//                                        </div>
//                                    </div>
//                                ))
//                            )}
//                        </div>
//                    </SectionCard>

//                    <SectionCard
//                        title="Priority Tasks"
//                        action={
//                            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/professional/tasks")}>
//                                View all
//                            </Button>
//                        }
//                    >
//                        <div className="h-full overflow-y-auto pr-1">
//                            {priorityTasks.length === 0 ? (
//                                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
//                                    <Briefcase className="h-8 w-8 text-muted-foreground" />
//                                    <p className="text-sm text-muted-foreground">No tasks available</p>
//                                    <Button size="sm" onClick={() => router.push("/dashboard/professional/tasks")}>
//                                        Open tasks
//                                    </Button>
//                                </div>
//                            ) : (
//                                <div className="flex flex-col gap-4">
//                                    {priorityTasks.map((task) => {
//                                        const progress = getTaskProgress(task.status)
//                                        const overdue = isOverdue(task.deadline, task.status)

//                                        return (
//                                            <div
//                                                key={task.id}
//                                                className={`rounded-xl border p-4 transition hover:shadow-sm ${overdue ? "border-red-300 bg-red-500/5" : "bg-muted/40"
//                                                    }`}
//                                            >
//                                                <div className="flex items-center justify-between gap-3">
//                                                    <p className="line-clamp-1 font-medium">{task.title}</p>
//                                                    <PriorityBadge priority={task.priority} />
//                                                </div>

//                                                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
//                                                    {task.description || "No description"}
//                                                </p>

//                                                <div className="mt-3">
//                                                    <div className="mb-1 flex justify-between text-xs">
//                                                        <span>{task.status}</span>
//                                                        <span>{progress}%</span>
//                                                    </div>
//                                                    <Progress value={progress} className="h-2" />
//                                                </div>

//                                                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
//                                                    <span className="truncate">{task.deadline || "No deadline"}</span>
//                                                    {overdue && (
//                                                        <span className="flex items-center gap-1 text-red-600">
//                                                            <AlertTriangle className="h-3 w-3" />
//                                                            Overdue
//                                                        </span>
//                                                    )}
//                                                </div>
//                                            </div>
//                                        )
//                                    })}
//                                </div>
//                            )}
//                        </div>
//                    </SectionCard>

//                    <SectionCard title="Weekly Activity">
//                        <div className="h-full rounded-xl bg-muted/20 p-2">
//                            <ResponsiveContainer width="100%" height="100%">
//                                <AreaChart data={last7DaysActivity}>
//                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
//                                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
//                                    <Tooltip />
//                                    <Area
//                                        type="monotone"
//                                        dataKey="activity"
//                                        stroke="#3b82f6"
//                                        fill="#93c5fd"
//                                        strokeWidth={2}
//                                    />
//                                </AreaChart>
//                            </ResponsiveContainer>
//                        </div>
//                    </SectionCard>

//                    <SectionCard
//                        title="Announcements"
//                        action={
//                            <Button
//                                variant="ghost"
//                                size="sm"
//                                onClick={() => router.push("/dashboard/professional/announcements")}
//                            >
//                                View all
//                            </Button>
//                        }
//                    >
//                        <div className="h-full overflow-y-auto pr-1">
//                            {latestAnnouncements.length === 0 ? (
//                                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
//                                    <Inbox className="h-8 w-8 text-muted-foreground" />
//                                    <p className="text-sm text-muted-foreground">No announcements available</p>
//                                </div>
//                            ) : (
//                                <div className="flex flex-col gap-4">
//                                    {latestAnnouncements.map((announcement) => (
//                                        <div key={announcement.id} className="rounded-xl bg-muted/40 p-4 transition hover:shadow-sm">
//                                            <div className="flex flex-wrap items-center gap-2">
//                                                <h4 className="font-medium">{announcement.title}</h4>
//                                                <StatusBadge status={announcement.status} />
//                                                <Badge variant="outline">{announcement.audience}</Badge>
//                                            </div>

//                                            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
//                                                {announcement.content}
//                                            </p>

//                                            <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
//                                                <Clock className="h-3 w-3" />
//                                                {new Date(announcement.createdAt).toLocaleString()}
//                                            </div>
//                                        </div>
//                                    ))}
//                                </div>
//                            )}
//                        </div>
//                    </SectionCard>
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
    StickyNote,
    BarChart3,
    Briefcase,
    TrendingUp,
    CheckCircle2,
    Megaphone,
    Flame,
    Zap,
    Leaf,
    Clock,
    RefreshCw,
    AlertTriangle,
    ArrowRight,
    Inbox,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

const navItems = [
    { label: "Dashboard", href: "/dashboard/professional", icon: LayoutDashboard },
    { label: "Calendar", href: "/dashboard/professional/calendar", icon: Calendar },
    { label: "AI Chat", href: "/dashboard/professional/chat", icon: MessageSquare },
    { label: "Meetings", href: "/dashboard/professional/meetings", icon: Video },
    { label: "Tasks", href: "/dashboard/professional/tasks", icon: CheckCircle2 },
    { label: "Notes", href: "/dashboard/professional/notes", icon: StickyNote },
    { label: "Announcements", href: "/dashboard/professional/announcements", icon: Megaphone },
    { label: "Analytics", href: "/dashboard/professional/analytics", icon: BarChart3 },
]

const API_BASE = "https://steadfast-warmth-production-64c8.up.railway.app"
const PANEL_HEIGHT = "h-[420px]"

interface Meeting {
    id: string
    meetingTitle?: string
    title?: string
    startTime: string
}

interface Task {
    id: string
    title: string
    priority: "Low" | "Medium" | "High"
    status: "Todo" | "In Progress" | "Completed"
    description?: string
    deadline?: string
}

interface Announcement {
    id: number
    title: string
    content: string
    audience: string
    status: string
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
    return new Date(dateValue).toDateString() === new Date().toDateString()
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

function getTaskProgress(status: Task["status"]) {
    switch (status) {
        case "Completed":
            return 100
        case "In Progress":
            return 60
        default:
            return 20
    }
}

function formatShortDate(date: Date) {
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    })
}

function toLocalDateKey(input: string | Date) {
    const date = new Date(input)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
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

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
    if (priority === "High") {
        return (
            <Badge className="flex items-center gap-1 border border-red-300 bg-red-500/10 text-red-600">
                <Flame className="h-3 w-3" />
                High
            </Badge>
        )
    }

    if (priority === "Medium") {
        return (
            <Badge className="flex items-center gap-1 border border-yellow-300 bg-yellow-500/10 text-yellow-600">
                <Zap className="h-3 w-3" />
                Medium
            </Badge>
        )
    }

    return (
        <Badge className="flex items-center gap-1 border border-green-300 bg-green-500/10 text-green-600">
            <Leaf className="h-3 w-3" />
            Low
        </Badge>
    )
}

function StatusBadge({ status }: { status: string }) {
    return (
        <Badge className="border border-blue-300 bg-blue-500/10 text-blue-600">
            {status}
        </Badge>
    )
}

function SectionCard({
    title,
    action,
    children,
}: {
    title: string
    action?: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <div className={`flex min-h-0 ${PANEL_HEIGHT} flex-col rounded-2xl border bg-background/60 p-6 shadow-sm backdrop-blur-md`}>
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

    const [meetings, setMeetings] = useState<Meeting[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState("")
    const [lastUpdated, setLastUpdated] = useState("")

    const userRole = "professional"

    useEffect(() => {
        fetchAll()

        const interval = setInterval(() => {
            fetchAll(true)
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    const getHeaders = () => {
        const token = localStorage.getItem("token")
        return token ? { Authorization: `Bearer ${token}` } : {}
    }

    async function fetchAll(isRefresh = false) {
        const token = localStorage.getItem("token")

        if (!token) {
            setError("Authentication token not found.")
            setLoading(false)
            setRefreshing(false)
            return
        }

        try {
            if (isRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            setError("")

            const [mRes, tRes, aRes] = await Promise.all([
                fetch(`${API_BASE}/api/Meeting/my-meetings`, { headers: getHeaders() }),
                fetch(`${API_BASE}/api/Tasks`, { headers: getHeaders() }),
                fetch(`${API_BASE}/api/Announcement`, { headers: getHeaders() }),
            ])

            const [meetingData, taskData, announcementData] = await Promise.all([
                safeJson(mRes),
                safeJson(tRes),
                safeJson(aRes),
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
                    .filter((a: Announcement) => {
                        const audience = (a.audience || "").toLowerCase().trim()
                        return audience === "all users" || audience === userRole
                    })
                    .sort(
                        (a: Announcement, b: Announcement) =>
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
            console.error("Professional dashboard error:", err)
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

    const actionableTasks = useMemo(() => {
        return tasks.filter((task) => task.status !== "Completed")
    }, [tasks])

    const priorityTasks = useMemo(() => {
        return [...actionableTasks]
            .sort((a, b) => {
                const overdueA = isOverdue(a.deadline, a.status) ? 1 : 0
                const overdueB = isOverdue(b.deadline, b.status) ? 1 : 0
                if (overdueA !== overdueB) return overdueB - overdueA

                if (a.status !== b.status) {
                    if (a.status === "In Progress") return -1
                    if (b.status === "In Progress") return 1
                }

                const priorityDiff = getPriorityOrder(a.priority) - getPriorityOrder(b.priority)
                if (priorityDiff !== 0) return priorityDiff

                if (!a.deadline) return 1
                if (!b.deadline) return -1

                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            })
            .slice(0, 5)
    }, [actionableTasks])

    const latestAnnouncements = useMemo(() => announcements.slice(0, 5), [announcements])

    const completedTasks = tasks.filter((t) => t.status === "Completed").length
    const todayMeetings = meetings.filter((m) => isToday(m.startTime)).length
    const overdueTasks = tasks.filter((t) => isOverdue(t.deadline, t.status)).length
    const productivity = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0

    const last7DaysActivity = useMemo(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today)
            date.setDate(today.getDate() - (6 - i))
            return {
                key: toLocalDateKey(date),
                day: formatShortDate(date),
                activity: 0,
            }
        })

        const map = new Map(days.map((d) => [d.key, d]))

        tasks.forEach((task) => {
            if (!task.deadline) return
            const item = map.get(task.deadline)
            if (item) item.activity += 1
        })

        meetings.forEach((meeting) => {
            const key = toLocalDateKey(meeting.startTime)
            const item = map.get(key)
            if (item) item.activity += 1
        })

        return days
    }, [tasks, meetings])

    const stats = [
        { icon: Video, title: "Upcoming Meetings", value: String(upcomingMeetings.length) },
        { icon: Briefcase, title: "Active Tasks", value: String(actionableTasks.length) },
        { icon: AlertTriangle, title: "Overdue Tasks", value: String(overdueTasks) },
        { icon: TrendingUp, title: "Productivity", value: `${productivity}%` },
    ]

    if (loading) {
        return (
            <DashboardShell navItems={navItems} role="Professional" title="Dashboard">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
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
        <DashboardShell navItems={navItems} role="Professional" title="Dashboard">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">Professional Dashboard</h2>
                        <p className="text-sm text-muted-foreground">
                            Stay on top of your meetings, tasks, updates, and weekly activity.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                            Last updated: {lastUpdated || "Just now"}
                        </p>
                        <Button variant="outline" onClick={() => fetchAll(true)} disabled={refreshing}>
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

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.title} icon={stat.icon} title={stat.title} value={stat.value} />
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Today</p>
                        <h3 className="mt-1 text-lg font-semibold">{todayMeetings} meetings scheduled today</h3>
                    </div>

                    <div className="rounded-2xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Needs Attention</p>
                        <h3 className="mt-1 text-lg font-semibold">{overdueTasks} overdue tasks</h3>
                    </div>

                    <div className="rounded-2xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Completion Rate</p>
                        <h3 className="mt-1 text-lg font-semibold">{productivity}% completion rate</h3>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <Button className="justify-between rounded-xl" onClick={() => router.push("/dashboard/professional/tasks")}>
                        Open Tasks
                        <ArrowRight className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        className="justify-between rounded-xl"
                        onClick={() => router.push("/dashboard/professional/meetings")}
                    >
                        Open Meetings
                        <ArrowRight className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        className="justify-between rounded-xl"
                        onClick={() => router.push("/dashboard/professional/calendar")}
                    >
                        Open Calendar
                        <ArrowRight className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        className="justify-between rounded-xl"
                        onClick={() => router.push("/dashboard/professional/analytics")}
                    >
                        View Analytics
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <SectionCard
                        title="Upcoming Meetings"
                        action={
                            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/professional/meetings")}>
                                View all
                            </Button>
                        }
                    >
                        <div className="h-full overflow-y-auto pr-1">
                            {upcomingMeetings.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                                    <Video className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">No upcoming meetings</p>
                                    <Button size="sm" onClick={() => router.push("/dashboard/professional/meetings")}>
                                        Open meetings
                                    </Button>
                                </div>
                            ) : (
                                upcomingMeetings.map((meeting) => (
                                    <div key={meeting.id} className="mb-3 rounded-xl bg-muted/40 p-4 transition hover:shadow-sm">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-4">
                                                <div className="rounded-lg bg-primary/10 px-3 py-2 text-center text-sm text-primary">
                                                    {new Date(meeting.startTime).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-medium">
                                                        {meeting.meetingTitle || meeting.title || "Meeting"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(meeting.startTime).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <StatusBadge status="Meeting" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Priority Tasks"
                        action={
                            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/professional/tasks")}>
                                View all
                            </Button>
                        }
                    >
                        <div className="h-full overflow-y-auto pr-1">
                            {priorityTasks.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                                    <Briefcase className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">No active tasks available</p>
                                    <Button size="sm" onClick={() => router.push("/dashboard/professional/tasks")}>
                                        Open tasks
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
                                                    <PriorityBadge priority={task.priority} />
                                                </div>

                                                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                                    {task.description || "No description"}
                                                </p>

                                                <div className="mt-3">
                                                    <div className="mb-1 flex justify-between text-xs">
                                                        <span>{task.status}</span>
                                                        <span>{progress}%</span>
                                                    </div>
                                                    <Progress value={progress} className="h-2" />
                                                </div>

                                                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                                                    <span className="truncate">{task.deadline || "No deadline"}</span>
                                                    {overdue && (
                                                        <span className="flex items-center gap-1 text-red-600">
                                                            <AlertTriangle className="h-3 w-3" />
                                                            Overdue
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </SectionCard>

                    <SectionCard title="Weekly Activity">
                        <div className="h-full rounded-xl bg-muted/20 p-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={last7DaysActivity}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="activity"
                                        stroke="#3b82f6"
                                        fill="#93c5fd"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Announcements"
                        action={
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push("/dashboard/professional/announcements")}
                            >
                                View all
                            </Button>
                        }
                    >
                        <div className="h-full overflow-y-auto pr-1">
                            {latestAnnouncements.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                                    <Inbox className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">No announcements available</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {latestAnnouncements.map((announcement) => (
                                        <div key={announcement.id} className="rounded-xl bg-muted/40 p-4 transition hover:shadow-sm">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="font-medium">{announcement.title}</h4>
                                                <StatusBadge status={announcement.status} />
                                                <Badge variant="outline">{announcement.audience}</Badge>
                                            </div>

                                            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                                                {announcement.content}
                                            </p>

                                            <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {new Date(announcement.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </SectionCard>
                </div>
            </div>
        </DashboardShell>
    )
}
