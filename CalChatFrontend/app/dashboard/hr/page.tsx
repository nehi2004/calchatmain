//"use client"

//import {
//    LayoutDashboard, Calendar, MessageSquare, Video, CalendarDays, Users, StickyNote, BarChart3, Megaphone,
//    Briefcase, Clock, TrendingUp, CheckCircle2,
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

//const meetings = [
//    { time: "09:00", title: "Sprint Planning", attendees: 8, type: "Team" },
//    { time: "11:30", title: "Client Presentation", attendees: 4, type: "Client" },
//    { time: "14:00", title: "1-on-1 with Manager", attendees: 2, type: "Personal" },
//    { time: "16:00", title: "Design Review", attendees: 5, type: "Team" },
//]

//const teamActivity = [
//    { name: "Alice Johnson", task: "Completed API integration", time: "2h ago", avatar: "AJ" },
//    { name: "Bob Smith", task: "Submitted PR for auth module", time: "3h ago", avatar: "BS" },
//    { name: "Carol White", task: "Updated design mockups", time: "5h ago", avatar: "CW" },
//    { name: "David Lee", task: "Fixed critical bug #342", time: "6h ago", avatar: "DL" },
//]

//const workTasks = [
//    { title: "Finalize Q1 Report", priority: "High", progress: 85 },
//    { title: "Review Marketing Strategy", priority: "Medium", progress: 60 },
//    { title: "Update Documentation", priority: "Low", progress: 30 },
//    { title: "Prepare Team Demo", priority: "High", progress: 45 },
//]

//const productivityData = [
//    { week: "W1", hours: 38, tasks: 12 },
//    { week: "W2", hours: 42, tasks: 15 },
//    { week: "W3", hours: 35, tasks: 10 },
//    { week: "W4", hours: 45, tasks: 18 },
//    { week: "W5", hours: 40, tasks: 14 },
//    { week: "W6", hours: 43, tasks: 16 },
//]

//export default function ProfessionalDashboard() {
//    return (
//        <DashboardShell navItems={navItems} role="hr" title="Dashboard">
//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                <StatCard icon={Video} title="Meetings Today" value="4" description="Next: 9:00 AM" />
//                <StatCard icon={Briefcase} title="Active Projects" value="6" trend="+1 new" />
//                <StatCard icon={Clock} title="Hours This Week" value="32h" description="Target: 40h" />
//                <StatCard icon={TrendingUp} title="Productivity" value="92%" trend="+8% vs last week" />
//            </div>

//            <div className="mt-6 grid gap-6 lg:grid-cols-2">
//                {/* Meeting Schedule */}
//                <div className="rounded-xl border border-border bg-card p-6">
//                    <h3 className="font-heading text-lg font-semibold text-card-foreground">Meeting Schedule</h3>
//                    <div className="mt-4 flex flex-col gap-3">
//                        {meetings.map((item) => (
//                            <div key={item.time} className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
//                                <span className="w-14 text-sm font-medium text-primary">{item.time}</span>
//                                <div className="flex-1">
//                                    <p className="text-sm font-medium text-card-foreground">{item.title}</p>
//                                    <p className="text-xs text-muted-foreground">{item.attendees} attendees</p>
//                                </div>
//                                <Badge variant="secondary">{item.type}</Badge>
//                            </div>
//                        ))}
//                    </div>
//                </div>

//                {/* Team Activity */}
//                <div className="rounded-xl border border-border bg-card p-6">
//                    <h3 className="font-heading text-lg font-semibold text-card-foreground">Team Activity</h3>
//                    <div className="mt-4 flex flex-col gap-3">
//                        {teamActivity.map((member) => (
//                            <div key={member.name} className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
//                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
//                                    {member.avatar}
//                                </div>
//                                <div className="flex-1">
//                                    <p className="text-sm font-medium text-card-foreground">{member.name}</p>
//                                    <p className="text-xs text-muted-foreground">{member.task}</p>
//                                </div>
//                                <span className="text-xs text-muted-foreground">{member.time}</span>
//                            </div>
//                        ))}
//                    </div>
//                </div>

//                {/* Work Tasks */}
//                <div className="rounded-xl border border-border bg-card p-6">
//                    <h3 className="font-heading text-lg font-semibold text-card-foreground">Work Tasks</h3>
//                    <div className="mt-4 flex flex-col gap-4">
//                        {workTasks.map((task) => (
//                            <div key={task.title}>
//                                <div className="mb-2 flex items-center justify-between">
//                                    <span className="text-sm font-medium text-card-foreground">{task.title}</span>
//                                    <Badge variant={task.priority === "High" ? "destructive" : "secondary"}>{task.priority}</Badge>
//                                </div>
//                                <div className="flex items-center gap-3">
//                                    <Progress value={task.progress} className="h-2 flex-1" />
//                                    <span className="text-xs font-medium text-primary">{task.progress}%</span>
//                                </div>
//                            </div>
//                        ))}
//                    </div>
//                </div>

//                {/* Productivity Analytics Graph */}
//                <div className="rounded-xl border border-border bg-card p-6">
//                    <h3 className="font-heading text-lg font-semibold text-card-foreground">Productivity Analytics</h3>
//                    <div className="mt-4 h-64">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <AreaChart data={productivityData}>
//                                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                                <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
//                                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
//                                <Tooltip
//                                    contentStyle={{
//                                        backgroundColor: 'hsl(var(--card))',
//                                        border: '1px solid hsl(var(--border))',
//                                        borderRadius: '8px',
//                                        color: 'hsl(var(--card-foreground))',
//                                    }}
//                                />
//                                <Area type="monotone" dataKey="hours" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.15)" strokeWidth={2} />
//                                <Area type="monotone" dataKey="tasks" stroke="hsl(var(--accent))" fill="hsl(var(--accent)/0.15)" strokeWidth={2} />
//                            </AreaChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>
//            </div>
//        </DashboardShell>
//    )
//}


//"use client"

//import { useEffect, useState } from "react"
//import {
//    LayoutDashboard, Calendar, MessageSquare, Video,
//    Users, StickyNote, BarChart3, Megaphone,
//    Briefcase, Clock, TrendingUp, CheckCircle2,
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

//    useEffect(() => {
//        fetchDashboardData()
//    }, [])

//    async function fetchDashboardData() {
//        const token = localStorage.getItem("token")

//        try {
//            const [meetingRes, taskRes, announcementRes] = await Promise.all([
//                fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Meeting", {
//                    headers: { Authorization: `Bearer ${token}` }
//                }),
//                fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Task", {
//                    headers: { Authorization: `Bearer ${token}` }
//                }),
//                fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Announcement", {
//                    headers: { Authorization: `Bearer ${token}` }
//                })
//            ])

//            const meetingData = await meetingRes.json()
//            const taskData = await taskRes.json()
//            const announcementData = await announcementRes.json()

//            setMeetings(meetingData || [])
//            setTasks(taskData || [])
//            setAnnouncements(announcementData || [])

//        } catch (error) {
//            console.error("Dashboard error:", error)
//        }
//    }

//    return (
//        <DashboardShell navItems={navItems} role="hr" title="Dashboard">

//            {/* 🔥 Stats */}
//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                <StatCard icon={Video} title="Meetings" value={meetings.length.toString()} />
//                <StatCard icon={Briefcase} title="Tasks" value={tasks.length.toString()} />
//                <StatCard icon={Megaphone} title="Announcements" value={announcements.length.toString()} />
//                <StatCard icon={TrendingUp} title="Productivity" value="--" />
//            </div>

//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* 🔹 Meetings */}
//                <div className="rounded-xl border p-6">
//                    <h3 className="text-lg font-semibold">Meetings</h3>

//                    <div className="mt-4 flex flex-col gap-3">
//                        {meetings.length === 0 ? (
//                            <p className="text-sm text-gray-500">No meetings</p>
//                        ) : (
//                            meetings.map((m: any) => (
//                                <div key={m.id} className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg">
//                                    <span className="w-14 text-sm font-medium text-primary">
//                                        {m.time || "N/A"}
//                                    </span>
//                                    <div className="flex-1">
//                                        <p className="text-sm font-medium">{m.title}</p>
//                                        <p className="text-xs text-muted-foreground">
//                                            {m.attendees?.length || 0} attendees
//                                        </p>
//                                    </div>
//                                    <Badge>{m.type || "Meeting"}</Badge>
//                                </div>
//                            ))
//                        )}
//                    </div>
//                </div>

//                {/* 🔹 Tasks */}
//                <div className="rounded-xl border p-6">
//                    <h3 className="text-lg font-semibold">Tasks</h3>

//                    <div className="mt-4 flex flex-col gap-4">
//                        {tasks.length === 0 ? (
//                            <p className="text-sm text-gray-500">No tasks</p>
//                        ) : (
//                            tasks.map((task: any) => (
//                                <div key={task.id}>
//                                    <div className="mb-2 flex justify-between">
//                                        <span className="text-sm font-medium">{task.title}</span>
//                                        <Badge>{task.priority || "Medium"}</Badge>
//                                    </div>
//                                    <div className="flex items-center gap-3">
//                                        <Progress value={task.progress || 0} className="h-2 flex-1" />
//                                        <span className="text-xs">{task.progress || 0}%</span>
//                                    </div>
//                                </div>
//                            ))
//                        )}
//                    </div>
//                </div>

//                {/* 🔹 Announcements */}
//                <div className="rounded-xl border p-6 lg:col-span-2">
//                    <h3 className="text-lg font-semibold">Latest Announcements</h3>

//                    <div className="mt-4 flex flex-col gap-3">
//                        {announcements.length === 0 ? (
//                            <p className="text-sm text-gray-500">No announcements</p>
//                        ) : (
//                            announcements.slice(0, 5).map((a: any) => (
//                                <div key={a.id} className="p-3 rounded-lg bg-muted/50">
//                                    <div className="flex gap-2 items-center">
//                                        <p className="text-sm font-medium">{a.title}</p>
//                                        <Badge variant="outline">{a.audience}</Badge>
//                                    </div>
//                                    <p className="text-xs text-muted-foreground mt-1">
//                                        {a.content}
//                                    </p>
//                                </div>
//                            ))
//                        )}
//                    </div>
//                </div>

//                {/* 🔹 Graph (optional static for now) */}
//                <div className="rounded-xl border p-6 lg:col-span-2">
//                    <h3 className="text-lg font-semibold">Productivity</h3>

//                    <div className="mt-4 h-64">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <AreaChart data={[]}>
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

//    useEffect(() => {
//        fetchDashboardData()
//    }, [])

//    // ✅ SAFE JSON HANDLER (MAIN FIX)
//    async function safeJson(res: Response) {
//        console.log("API Status:", res.url, res.status)

//        if (!res.ok) return []

//        const text = await res.text()
//        if (!text) return []

//        try {
//            return JSON.parse(text)
//        } catch (err) {
//            console.error("JSON Error:", err)
//            return []
//        }
//    }

//    async function fetchDashboardData() {
//        const token = localStorage.getItem("token")

//        try {
//            const [meetingRes, taskRes, announcementRes] = await Promise.all([
//                fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Meeting/my-meetings", {
//                    headers: { Authorization: `Bearer ${token}` }
//                }),
//                fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Tasks", {
//                    headers: { Authorization: `Bearer ${token}` }
//                }),
//                fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Announcement", {
//                    headers: { Authorization: `Bearer ${token}` }
//                })
//            ])

//            const meetingData = await safeJson(meetingRes)
//            const taskData = await safeJson(taskRes)
//            const announcementData = await safeJson(announcementRes)

//            setMeetings(Array.isArray(meetingData) ? meetingData : [])
//            setTasks(Array.isArray(taskData) ? taskData : [])
//            setAnnouncements(Array.isArray(announcementData) ? announcementData : [])

//        } catch (error) {
//            console.error("Dashboard error:", error)
//        }
//    }

//    return (
//        <DashboardShell navItems={navItems} role="hr" title="Dashboard">

//            {/* 🔥 Stats */}
//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                <StatCard icon={Video} title="Meetings" value={meetings.length.toString()} />
//                <StatCard icon={Briefcase} title="Tasks" value={tasks.length.toString()} />
//                <StatCard icon={Megaphone} title="Announcements" value={announcements.length.toString()} />
//                <StatCard icon={TrendingUp} title="Productivity" value="--" />
//            </div>

//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* 🔹 Meetings */}
//                <div className="rounded-xl border p-6">
//                    <h3 className="text-lg font-semibold">Meetings</h3>

//                    <div className="mt-4 flex flex-col gap-3">
//                        {meetings.length === 0 ? (
//                            <p className="text-sm text-gray-500">No meetings</p>
//                        ) : (
//                            meetings.map((m: any) => (
//                                <div key={m.id} className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg">
//                                    <span className="w-14 text-sm font-medium text-primary">
//                                        {new Date(m.startTime || m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                    </span>
//                                    <div className="flex-1">
//                                        <p className="text-sm font-medium"><p>{m.title || m.meetingTitle || "Meeting"}</p></p>
//                                        <p className="text-xs text-muted-foreground">
//                                            {m.attendees?.length || 0} attendees
//                                        </p>
//                                    </div>
//                                    <Badge>{m.type || "Meeting"}</Badge>
//                                </div>
//                            ))
//                        )}
//                    </div>
//                </div>

//                {/* 🔹 Tasks */}
//                <div className="rounded-xl border p-6">
//                    <h3 className="text-lg font-semibold">Tasks</h3>

//                    <div className="mt-4 flex flex-col gap-4">
//                        {tasks.length === 0 ? (
//                            <p className="text-sm text-gray-500">No tasks</p>
//                        ) : (
//                            tasks.map((task: any) => (
//                                <div key={task.id}>
//                                    <div className="mb-2 flex justify-between">
//                                        <span className="text-sm font-medium">{task.title}</span>
//                                        <Badge>{task.priority || "Medium"}</Badge>
//                                    </div>
//                                    <div className="flex items-center gap-3">
//                                        <Progress value={task.progress || 0} className="h-2 flex-1" />
//                                        <span className="text-xs">{task.progress || 0}%</span>
//                                    </div>
//                                </div>
//                            ))
//                        )}
//                    </div>
//                </div>

//                {/* 🔹 Announcements */}
//                <div className="rounded-xl border p-6 lg:col-span-2">
//                    <h3 className="text-lg font-semibold">Latest Announcements</h3>

//                    <div className="mt-4 flex flex-col gap-3">
//                        {announcements.length === 0 ? (
//                            <p className="text-sm text-gray-500">No announcements</p>
//                        ) : (
//                            announcements.slice(0, 5).map((a: any) => (
//                                <div key={a.id} className="p-3 rounded-lg bg-muted/50">
//                                    <div className="flex gap-2 items-center">
//                                        <p className="text-sm font-medium">{a.title}</p>
//                                        <Badge variant="outline">{a.audience}</Badge>
//                                    </div>
//                                    <p className="text-xs text-muted-foreground mt-1">
//                                        {a.content}
//                                    </p>
//                                </div>
//                            ))
//                        )}
//                    </div>
//                </div>

//                {/* 🔹 Graph */}
//                <div className="rounded-xl border p-6 lg:col-span-2">
//                    <h3 className="text-lg font-semibold">Productivity</h3>

//                    <div className="mt-4 h-64">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <AreaChart data={[]}>
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
//                fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Meeting/my-meetings", {
//                    headers: { Authorization: `Bearer ${token}` }
//                }),
//                fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Tasks", {
//                    headers: { Authorization: `Bearer ${token}` }
//                }),
//                fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Announcement", {
//                    headers: { Authorization: `Bearer ${token}` }
//                })
//            ])

//            const meetingData = await safeJson(meetingRes)
//            const taskData = await safeJson(taskRes)
//            const announcementData = await safeJson(announcementRes)

//            setMeetings(Array.isArray(meetingData) ? meetingData : [])
//            setTasks(Array.isArray(taskData) ? taskData : [])
//            setAnnouncements(Array.isArray(announcementData) ? announcementData : [])

//            // 🔥 GRAPH DATA GENERATE
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

//            {/* 🔥 Stats */}
//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                <StatCard icon={Video} title="Meetings" value={meetings.length.toString()} />
//                <StatCard icon={Briefcase} title="Tasks" value={tasks.length.toString()} />
//                <StatCard icon={Megaphone} title="Announcements" value={announcements.length.toString()} />
//                <StatCard icon={TrendingUp} title="Completed Tasks"
//                    value={tasks.filter(t => t.status === "Completed").length.toString()} />
//            </div>

//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* 🔹 Meetings */}
//                <div className="rounded-xl border p-6 shadow-sm">
//                    <h3 className="text-lg font-semibold mb-4">Meetings</h3>

//                    {meetings.length === 0 ? (
//                        <p className="text-sm text-gray-500">No meetings</p>
//                    ) : (
//                        meetings.map((m: any) => (
//                            <div
//                                key={m.id}
//                                className="flex items-center justify-between mb-3 bg-muted/50 p-4 rounded-lg hover:shadow transition"
//                            >
//                                {/* LEFT */}
//                                <div className="flex items-center gap-4">

//                                    {/* TIME */}
//                                    <div className="text-center min-w-[60px]">
//                                        <p className="text-sm font-semibold text-primary">
//                                            {new Date(m.startTime).toLocaleTimeString([], {
//                                                hour: "2-digit",
//                                                minute: "2-digit"
//                                            })}
//                                        </p>

//                                        <p className="text-xs text-muted-foreground">
//                                            {new Date(m.startTime).toLocaleDateString()}
//                                        </p>
//                                    </div>

//                                    {/* DETAILS */}
//                                    <div>
//                                        <p className="font-medium">
//                                            {m.meetingTitle || m.title || "Meeting"}
//                                        </p>

//                                        <p className="text-xs text-muted-foreground">
//                                            {new Date(m.startTime).toLocaleDateString()}
//                                        </p>
//                                    </div>

//                                </div>

//                                {/* RIGHT */}
//                                <Badge variant="secondary">
//                                    Meeting
//                                </Badge>
//                            </div>
//                        ))
//                    )}
//                </div>

//                {/* 🔹 Tasks */}
//                <div className="rounded-xl border p-6 shadow-sm">
//                    <div className="flex justify-between items-center mb-4">
//                        <h3 className="text-lg font-semibold">Tasks</h3>
//                        <span className="text-xs text-muted-foreground">
//                            {tasks.length} total
//                        </span>
//                    </div>

//                    {tasks.length === 0 ? (
//                        <p className="text-sm text-gray-500">No tasks</p>
//                    ) : (
//                        <div className="flex flex-col gap-4">
//                            {tasks.slice(0, 5).map((task: any) => {

//                                const progress =
//                                    task.status === "Completed"
//                                        ? 100
//                                        : task.status === "In Progress"
//                                            ? 60
//                                            : 20

//                                return (
//                                    <div key={task.id} className="p-4 rounded-lg border bg-muted/40 hover:shadow-sm transition">

//                                        {/* TOP */}
//                                        <div className="flex justify-between items-center">
//                                            <p className="font-medium">{task.title}</p>

//                                            <Badge
//                                                variant={
//                                                    task.priority === "High"
//                                                        ? "destructive"
//                                                        : task.priority === "Medium"
//                                                            ? "secondary"
//                                                            : "outline"
//                                                }
//                                            >
//                                                {task.priority}
//                                            </Badge>
//                                        </div>

//                                        {/* DESC */}
//                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
//                                            {task.description || "No description"}
//                                        </p>

//                                        {/* PROGRESS */}
//                                        <div className="mt-3">
//                                            <div className="flex justify-between text-xs mb-1">
//                                                <span>{task.status}</span>
//                                                <span>{progress}%</span>
//                                            </div>
//                                            <Progress value={progress} className="h-2" />
//                                        </div>

//                                        {/* FOOTER */}
//                                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
//                                            <span>
//                                                📅 {task.deadline || "No deadline"}
//                                            </span>

//                                            {task.assignedUserName && (
//                                                <span>👤 {task.assignedUserName}</span>
//                                            )}
//                                        </div>

//                                    </div>
//                                )
//                            })}
//                        </div>
//                    )}
//                </div>

//                {/* 🔹 Announcements */}
//                <div className="rounded-xl border p-6 lg:col-span-2 shadow-sm">
//                    <h3 className="text-lg font-semibold mb-3">Announcements</h3>

//                    {announcements.slice(0, 5).map((a: any) => (
//                        <div key={a.id} className="mb-3 p-3 bg-muted/50 rounded-lg">
//                            <div className="flex gap-2 items-center">
//                                <p className="font-medium">{a.title}</p>
//                                <Badge variant="outline">{a.audience}</Badge>
//                            </div>
//                            <p className="text-xs text-muted-foreground">{a.content}</p>
//                        </div>
//                    ))}
//                </div>

//                {/* 🔹 Graph */}
//                <div className="rounded-xl border p-6 lg:col-span-2 shadow-sm">
//                    <h3 className="text-lg font-semibold mb-3">Productivity</h3>

//                    <div className="h-64">
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
                fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Meeting/my-meetings", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Tasks", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Announcement", {
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