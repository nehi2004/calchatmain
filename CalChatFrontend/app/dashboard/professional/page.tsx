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




"use client"

import { useEffect, useState, useMemo } from "react"
import {
    LayoutDashboard, Calendar, MessageSquare, Video, Users,
    StickyNote, BarChart3, Briefcase, TrendingUp, CheckCircle2, Megaphone,
    Flame, Zap, Leaf, Clock
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"

/* ================= NAV ================= */

const navItems = [
    { label: "Dashboard", href: "/dashboard/professional", icon: LayoutDashboard },
    { label: "Calendar", href: "/dashboard/professional/calendar", icon: Calendar },
    { label: "AI Chat", href: "/dashboard/professional/chat", icon: MessageSquare },
    { label: "Meetings", href: "/dashboard/professional/meetings", icon: Video },
    { label: "Tasks", href: "/dashboard/professional/tasks", icon: CheckCircle2 },
    { label: "Team", href: "/dashboard/professional/team", icon: Users },
    { label: "Notes", href: "/dashboard/professional/notes", icon: StickyNote },
    { label: "Announcements", href: "/dashboard/professional/announcements", icon: Megaphone },
    { label: "Analytics", href: "/dashboard/professional/analytics", icon: BarChart3 },
]

/* ================= TYPES ================= */

interface Meeting {
    id: string
    meetingTitle?: string
    title?: string
    startTime: string
}

interface Task {
    id: string
    title: string
    priority: string
    status: string
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

/* ================= COMPONENT ================= */

export default function ProfessionalDashboard() {

    const [meetings, setMeetings] = useState<Meeting[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)

    const userRole = "Professional"

    useEffect(() => {
        fetchAll()
    }, [])

    const getHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`
    })

    async function safeJson(res: Response) {
        if (!res.ok) return []
        const text = await res.text()
        if (!text) return []
        try { return JSON.parse(text) } catch { return [] }
    }

    async function fetchAll() {
        try {
            const [mRes, tRes, aRes] = await Promise.all([
                fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Meeting/my-meetings", { headers: getHeaders() }),
                fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks", { headers: getHeaders() }),
                fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Announcement", { headers: getHeaders() })
            ])

            const aData = await safeJson(aRes)

            setMeetings(await safeJson(mRes))
            setTasks(await safeJson(tRes))

            const filtered = aData.filter((a: Announcement) =>
                a.audience === "All Users" || a.audience === userRole
            )

            setAnnouncements(filtered)

        } finally {
            setLoading(false)
        }
    }

    /* ================= STATS ================= */

    const completedTasks = tasks.filter(t => t.status === "Completed").length
    const productivity = tasks.length
        ? Math.round((completedTasks / tasks.length) * 100)
        : 0

    /* ================= WEEKLY GRAPH ================= */

    const weeklyData = useMemo(() => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const result: any = {}

        days.forEach(d => {
            result[d] = { day: d, tasks: 0 }
        })

        tasks.forEach(t => {
            if (!t.deadline) return
            const day = days[new Date(t.deadline).getDay()]
            result[day].tasks++
        })

        meetings.forEach(m => {
            const day = days[new Date(m.startTime).getDay()]
            result[day].tasks++
        })

        return Object.values(result)
    }, [tasks, meetings])

    /* ================= BADGES ================= */

    function PriorityBadge({ priority }: { priority: string }) {
        if (priority === "High") {
            return (
                <Badge className="bg-red-500/10 text-red-600 border border-red-300 flex gap-1 items-center">
                    <Flame className="h-3 w-3" /> High
                </Badge>
            )
        }
        if (priority === "Medium") {
            return (
                <Badge className="bg-yellow-500/10 text-yellow-600 border border-yellow-300 flex gap-1 items-center">
                    <Zap className="h-3 w-3" /> Medium
                </Badge>
            )
        }
        return (
            <Badge className="bg-green-500/10 text-green-600 border border-green-300 flex gap-1 items-center">
                <Leaf className="h-3 w-3" /> Low
            </Badge>
        )
    }

    function StatusBadge({ status }: { status: string }) {
        return (
            <Badge className="bg-blue-500/10 text-blue-600 border border-blue-300">
                {status}
            </Badge>
        )
    }

    if (loading) return <p className="p-6 text-center">Loading...</p>

    return (
        <DashboardShell navItems={navItems} role="Professional" title="Dashboard">

            {/* STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Video} title="Meetings" value={String(meetings.length)} />
                <StatCard icon={Briefcase} title="Tasks" value={String(tasks.length)} />
                <StatCard icon={CheckCircle2} title="Completed" value={String(completedTasks)} />
                <StatCard icon={TrendingUp} title="Productivity" value={`${productivity}%`} />
            </div>

            {/* CONTENT */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">

                {/* MEETINGS */}
                <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-6 shadow-sm hover:shadow-xl transition">
                    <h3 className="text-lg font-semibold">Upcoming Meetings</h3>

                    <div className="mt-4 flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2">

                        {meetings.map(m => (
                            <div key={m.id} className="flex justify-between items-center p-3 rounded-xl bg-muted/40 hover:scale-[1.02] transition">

                                <div className="flex gap-4 items-center">

                                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">
                                        {new Date(m.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </div>

                                    <p className="font-medium">
                                        {m.meetingTitle || m.title}
                                    </p>
                                </div>

                                <StatusBadge status="Meeting" />
                            </div>
                        ))}

                    </div>
                </div>

                {/* TASKS */}
                <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-6 shadow-sm hover:shadow-xl transition">
                    <h3 className="text-lg font-semibold">Tasks</h3>

                    <div className="mt-4 flex flex-col gap-4 max-h-[250px] overflow-y-auto pr-2">

                        {tasks.map(t => {

                            const progress =
                                t.status === "Completed" ? 100 :
                                    t.status === "In Progress" ? 60 : 20

                            return (
                                <div key={t.id} className="p-4 rounded-xl bg-muted/40 hover:scale-[1.01] transition">

                                    <div className="flex justify-between items-center">
                                        <p className="font-medium">{t.title}</p>
                                        <PriorityBadge priority={t.priority} />
                                    </div>

                                    <div className="mt-3">
                                        <Progress value={progress} className="h-2" />
                                    </div>

                                </div>
                            )
                        })}

                    </div>
                </div>

                {/* GRAPH */}
                <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-6 shadow-sm hover:shadow-xl transition">
                    <h3 className="text-lg font-semibold">Weekly Activity</h3>

                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="tasks" stroke="#3b82f6" fill="#93c5fd" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ANNOUNCEMENTS */}
                <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-6 shadow-sm hover:shadow-xl transition max-h-[350px] overflow-y-auto pr-2">
                    <h3 className="text-lg font-semibold">Announcements</h3>

                    <div className="mt-4 flex flex-col gap-4">

                        {announcements.map(a => (
                            <div key={a.id} className="p-4 rounded-xl bg-muted/40 hover:scale-[1.01] transition">

                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-medium">{a.title}</h4>

                                    <StatusBadge status={a.status} />

                                    <Badge variant="outline">
                                        {a.audience}
                                    </Badge>
                                </div>

                                <p className="text-sm text-muted-foreground mt-2">
                                    {a.content}
                                </p>

                                <div className="flex items-center gap-1 text-xs mt-3 text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {new Date(a.createdAt).toLocaleString()}
                                </div>

                            </div>
                        ))}

                    </div>
                </div>

            </div>

        </DashboardShell>
    )
}