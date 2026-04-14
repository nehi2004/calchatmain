


"use client"

import { useEffect, useState } from "react"
import {
    LayoutDashboard, Calendar, MessageSquare, Video,
    Users, StickyNote, BarChart3, Megaphone,
    Briefcase, TrendingUp, CheckCircle2,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"

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

export default function ProfessionalDashboard() {

    const [meetings, setMeetings] = useState<any[]>([])
    const [tasks, setTasks] = useState<any[]>([])
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [chartData, setChartData] = useState<any[]>([])

    useEffect(() => {
        fetchDashboardData()
    }, [])

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

    async function fetchDashboardData() {
        const token = localStorage.getItem("token")

        try {
            const [meetingRes, taskRes, announcementRes] = await Promise.all([
                fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Meeting/my-meetings", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Announcement", {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ])

            const meetingData = await safeJson(meetingRes)
            const taskData = await safeJson(taskRes)
            const announcementData = await safeJson(announcementRes)

            setMeetings(Array.isArray(meetingData) ? meetingData : [])
            setTasks(Array.isArray(taskData) ? taskData : [])
            setAnnouncements(Array.isArray(announcementData) ? announcementData : [])

            const completed = taskData.filter((t: any) => t.status === "Completed").length
            const pending = taskData.length - completed

            setChartData([
                { name: "Completed", value: completed },
                { name: "Pending", value: pending }
            ])

        } catch (error) {
            console.error("Dashboard error:", error)
        }
    }

    return (
        <DashboardShell navItems={navItems} role="hr" title="Dashboard">

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Video} title="Meetings" value={meetings.length.toString()} />
                <StatCard icon={Briefcase} title="Tasks" value={tasks.length.toString()} />
                <StatCard icon={Megaphone} title="Announcements" value={announcements.length.toString()} />
                <StatCard
                    icon={TrendingUp}
                    title="Completed Tasks"
                    value={tasks.filter(t => t.status === "Completed").length.toString()}
                />
            </div>

            {/* MAIN GRID */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">

                {/* 🔹 Meetings */}
                <div className="rounded-xl border p-6 shadow-sm h-[320px] flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Meetings</h3>

                    <div className="flex-1 overflow-y-auto pr-2">
                        {meetings.length === 0 ? (
                            <p className="text-sm text-gray-500">No meetings</p>
                        ) : (
                            meetings.map((m: any) => (
                                <div
                                    key={m.id}
                                    className="flex items-center justify-between mb-3 bg-muted/50 p-4 rounded-lg hover:shadow transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-center min-w-[60px]">
                                            <p className="text-sm font-semibold text-primary">
                                                {new Date(m.startTime).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(m.startTime).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="font-medium">
                                                {m.meetingTitle || m.title || "Meeting"}
                                            </p>
                                        </div>
                                    </div>

                                    <Badge variant="secondary">Meeting</Badge>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 🔹 Tasks */}
                <div className="rounded-xl border p-6 shadow-sm h-[320px] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Tasks</h3>
                        <span className="text-xs text-muted-foreground">
                            {tasks.length} total
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2">
                        {tasks.length === 0 ? (
                            <p className="text-sm text-gray-500">No tasks</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {tasks.map((task: any) => {

                                    const progress =
                                        task.status === "Completed"
                                            ? 100
                                            : task.status === "In Progress"
                                                ? 60
                                                : 20

                                    return (
                                        <div key={task.id} className="p-4 rounded-lg border bg-muted/40 hover:shadow-sm transition">

                                            <div className="flex justify-between items-center">
                                                <p className="font-medium">{task.title}</p>

                                                <Badge
                                                    variant={
                                                        task.priority === "High"
                                                            ? "destructive"
                                                            : task.priority === "Medium"
                                                                ? "secondary"
                                                                : "outline"
                                                    }
                                                >
                                                    {task.priority}
                                                </Badge>
                                            </div>

                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                {task.description || "No description"}
                                            </p>

                                            <div className="mt-3">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span>{task.status}</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <Progress value={progress} className="h-2" />
                                            </div>

                                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                                <span>📅 {task.deadline || "No deadline"}</span>
                                                {task.assignedUserName && (
                                                    <span>👤 {task.assignedUserName}</span>
                                                )}
                                            </div>

                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* 🔹 Announcements */}
                <div className="rounded-xl border p-6 shadow-sm h-[320px] flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Announcements</h3>

                    <div className="flex-1 overflow-y-auto pr-2">
                        {announcements.length === 0 ? (
                            <p className="text-sm text-gray-500">No announcements</p>
                        ) : (
                            announcements.map((a: any) => (
                                <div key={a.id} className="mb-3 p-3 bg-muted/50 rounded-lg">
                                    <div className="flex gap-2 items-center">
                                        <p className="font-medium">{a.title}</p>
                                        <Badge variant="outline">{a.audience}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{a.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 🔹 Productivity */}
                <div className="rounded-xl border p-6 shadow-sm h-[320px] flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Productivity</h3>

                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </DashboardShell>
    )
}