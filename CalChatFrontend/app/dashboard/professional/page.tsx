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
//  { label: "Dashboard", href: "/dashboard/professional", icon: LayoutDashboard },
//  { label: "Calendar", href: "/dashboard/professional/calendar", icon: Calendar },
//  { label: "AI Chat", href: "/dashboard/professional/chat", icon: MessageSquare },
//  { label: "Meetings", href: "/dashboard/professional/meetings", icon: Video },
//    { label: "Tasks", href: "/dashboard/professional/tasks", icon: CheckCircle2 },
//  { label: "Team", href: "/dashboard/professional/team", icon: Users },
//    { label: "Notes", href: "/dashboard/professional/notes", icon: StickyNote },
//    { label: "Announcements", href: "/dashboard/professional/announcements", icon: Megaphone },
//  { label: "Analytics", href: "/dashboard/professional/analytics", icon: BarChart3 },
//]

//const meetings = [
//  { time: "09:00", title: "Sprint Planning", attendees: 8, type: "Team" },
//  { time: "11:30", title: "Client Presentation", attendees: 4, type: "Client" },
//  { time: "14:00", title: "1-on-1 with Manager", attendees: 2, type: "Personal" },
//  { time: "16:00", title: "Design Review", attendees: 5, type: "Team" },
//]

//const teamActivity = [
//  { name: "Alice Johnson", task: "Completed API integration", time: "2h ago", avatar: "AJ" },
//  { name: "Bob Smith", task: "Submitted PR for auth module", time: "3h ago", avatar: "BS" },
//  { name: "Carol White", task: "Updated design mockups", time: "5h ago", avatar: "CW" },
//  { name: "David Lee", task: "Fixed critical bug #342", time: "6h ago", avatar: "DL" },
//]

//const workTasks = [
//  { title: "Finalize Q1 Report", priority: "High", progress: 85 },
//  { title: "Review Marketing Strategy", priority: "Medium", progress: 60 },
//  { title: "Update Documentation", priority: "Low", progress: 30 },
//  { title: "Prepare Team Demo", priority: "High", progress: 45 },
//]

//const productivityData = [
//  { week: "W1", hours: 38, tasks: 12 },
//  { week: "W2", hours: 42, tasks: 15 },
//  { week: "W3", hours: 35, tasks: 10 },
//  { week: "W4", hours: 45, tasks: 18 },
//  { week: "W5", hours: 40, tasks: 14 },
//  { week: "W6", hours: 43, tasks: 16 },
//]

//export default function ProfessionalDashboard() {
//  return (
//    <DashboardShell navItems={navItems} role="Professional" title="Dashboard">
//      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//        <StatCard icon={Video} title="Meetings Today" value="4" description="Next: 9:00 AM" />
//        <StatCard icon={Briefcase} title="Active Projects" value="6" trend="+1 new" />
//        <StatCard icon={Clock} title="Hours This Week" value="32h" description="Target: 40h" />
//        <StatCard icon={TrendingUp} title="Productivity" value="92%" trend="+8% vs last week" />
//      </div>

//      <div className="mt-6 grid gap-6 lg:grid-cols-2">
//        {/* Meeting Schedule */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Meeting Schedule</h3>
//          <div className="mt-4 flex flex-col gap-3">
//            {meetings.map((item) => (
//              <div key={item.time} className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
//                <span className="w-14 text-sm font-medium text-primary">{item.time}</span>
//                <div className="flex-1">
//                  <p className="text-sm font-medium text-card-foreground">{item.title}</p>
//                  <p className="text-xs text-muted-foreground">{item.attendees} attendees</p>
//                </div>
//                <Badge variant="secondary">{item.type}</Badge>
//              </div>
//            ))}
//          </div>
//        </div>

//        {/* Team Activity */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Team Activity</h3>
//          <div className="mt-4 flex flex-col gap-3">
//            {teamActivity.map((member) => (
//              <div key={member.name} className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
//                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
//                  {member.avatar}
//                </div>
//                <div className="flex-1">
//                  <p className="text-sm font-medium text-card-foreground">{member.name}</p>
//                  <p className="text-xs text-muted-foreground">{member.task}</p>
//                </div>
//                <span className="text-xs text-muted-foreground">{member.time}</span>
//              </div>
//            ))}
//          </div>
//        </div>

//        {/* Work Tasks */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Work Tasks</h3>
//          <div className="mt-4 flex flex-col gap-4">
//            {workTasks.map((task) => (
//              <div key={task.title}>
//                <div className="mb-2 flex items-center justify-between">
//                  <span className="text-sm font-medium text-card-foreground">{task.title}</span>
//                  <Badge variant={task.priority === "High" ? "destructive" : "secondary"}>{task.priority}</Badge>
//                </div>
//                <div className="flex items-center gap-3">
//                  <Progress value={task.progress} className="h-2 flex-1" />
//                  <span className="text-xs font-medium text-primary">{task.progress}%</span>
//                </div>
//              </div>
//            ))}
//          </div>
//        </div>

//        {/* Productivity Analytics Graph */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Productivity Analytics</h3>
//          <div className="mt-4 h-64">
//            <ResponsiveContainer width="100%" height="100%">
//              <AreaChart data={productivityData}>
//                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
//                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
//                <Tooltip
//                  contentStyle={{
//                    backgroundColor: 'hsl(var(--card))',
//                    border: '1px solid hsl(var(--border))',
//                    borderRadius: '8px',
//                    color: 'hsl(var(--card-foreground))',
//                  }}
//                />
//                <Area type="monotone" dataKey="hours" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.15)" strokeWidth={2} />
//                <Area type="monotone" dataKey="tasks" stroke="hsl(var(--accent))" fill="hsl(var(--accent)/0.15)" strokeWidth={2} />
//              </AreaChart>
//            </ResponsiveContainer>
//          </div>
//        </div>
//      </div>
//    </DashboardShell>
//  )
//}


//"use client"

//import { useEffect, useState, useMemo } from "react"
//import {
//    LayoutDashboard, Calendar, MessageSquare, Video, Users,
//    StickyNote, BarChart3, Briefcase, Clock, TrendingUp, CheckCircle2, Megaphone
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Badge } from "@/components/ui/badge"
//import { Progress } from "@/components/ui/progress"

//import {
//    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
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
//    title: string
//    time: string
//    attendees: number
//}

//interface Task {
//    id: string
//    title: string
//    priority: string
//    status: string
//    progress: number
//}

//export default function ProfessionalDashboard() {

//    const [meetings, setMeetings] = useState<Meeting[]>([])
//    const [tasks, setTasks] = useState<Task[]>([])

//    /* ================= FETCH ================= */

//    useEffect(() => {
//        fetchMeetings()
//        fetchTasks()
//    }, [])

//    const getAuthHeaders = () => ({
//        Authorization: `Bearer ${localStorage.getItem("token")}`
//    })

//    async function fetchMeetings() {
//        try {
//            const res = await fetch("https://calchatmain-production-75c1.up.railway.app/api/Meeting/my-meetings", {
//                headers: getAuthHeaders()
//            })
//            const data = await res.json()
//            setMeetings(data)
//        } catch (err) {
//            console.error(err)
//        }
//    }

//    async function fetchTasks() {
//        try {
//            const res = await fetch("https://calchatmain-production-75c1.up.railway.app/api/tasks", {
//                headers: getAuthHeaders()
//            })
//            const data = await res.json()
//            setTasks(data)
//        } catch (err) {
//            console.error(err)
//        }
//    }

//    /* ================= CALCULATIONS ================= */

//    const totalMeetings = meetings.length
//    const totalTasks = tasks.length

//    const completedTasks = tasks.filter(t => t.status === "Completed").length

//    const productivity =
//        totalTasks > 0
//            ? Math.round((completedTasks / totalTasks) * 100)
//            : 0

//    /* ================= GRAPH ================= */

//    const productivityData = useMemo(() => {

//        const result: any = {}

//        tasks.forEach(t => {
//            const date = new Date().toLocaleDateString() // simple grouping

//            if (!result[date]) {
//                result[date] = { day: date, tasks: 0 }
//            }

//            result[date].tasks++
//        })

//        return Object.values(result)

//    }, [tasks])

//    /* ================= UI ================= */

//    return (
//        <DashboardShell navItems={navItems} role="Professional" title="Dashboard">

//            {/* STATS */}
//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

//                <StatCard
//                    icon={Video}
//                    title="Meetings"
//                    value={String(totalMeetings)}
//                />

//                <StatCard
//                    icon={Briefcase}
//                    title="Tasks"
//                    value={String(totalTasks)}
//                />

//                <StatCard
//                    icon={CheckCircle2}
//                    title="Completed"
//                    value={String(completedTasks)}
//                />

//                <StatCard
//                    icon={TrendingUp}
//                    title="Productivity"
//                    value={`${productivity}%`}
//                />

//            </div>

//            {/* CONTENT */}
//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* MEETINGS */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="text-lg font-semibold">Meetings</h3>

//                    <div className="mt-4 flex flex-col gap-3">
//                        {meetings.slice(0, 5).map((m) => (
//                            <div key={m.id} className="flex justify-between text-sm">
//                                <span>{m.title}</span>
//                                <span className="text-muted-foreground">{m.time}</span>
//                            </div>
//                        ))}
//                    </div>
//                </div>

//                {/* TASKS */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="text-lg font-semibold">Tasks</h3>

//                    <div className="mt-4 flex flex-col gap-4">
//                        {tasks.slice(0, 5).map((t) => (
//                            <div key={t.id}>
//                                <div className="flex justify-between">
//                                    <span>{t.title}</span>
//                                    <Badge>{t.priority}</Badge>
//                                </div>

//                                <Progress value={t.progress || 50} className="mt-2" />
//                            </div>
//                        ))}
//                    </div>
//                </div>

//                {/* GRAPH */}
//                <div className="rounded-xl border bg-card p-6 col-span-2">
//                    <h3 className="text-lg font-semibold">Productivity Graph</h3>

//                    <div className="h-64 mt-4">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <AreaChart data={productivityData}>
//                                <CartesianGrid strokeDasharray="3 3" />
//                                <XAxis dataKey="day" />
//                                <YAxis />
//                                <Tooltip />
//                                <Area type="monotone" dataKey="tasks" />
//                            </AreaChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>

//            </div>

//        </DashboardShell>
//    )
//}















//"use client"

//import { useEffect, useState, useMemo } from "react"
//import {
//    LayoutDashboard, Calendar, MessageSquare, Video, Users,
//    StickyNote, BarChart3, Briefcase, TrendingUp, CheckCircle2, Megaphone
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Badge } from "@/components/ui/badge"
//import { Progress } from "@/components/ui/progress"

//import {
//    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
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

///* ================= COLORS ================= */

//const PRIMARY = "#6366F1"

///* ================= COMPONENT ================= */

//export default function ProfessionalDashboard() {

//    const [meetings, setMeetings] = useState<Meeting[]>([])
//    const [tasks, setTasks] = useState<Task[]>([])
//    const [loading, setLoading] = useState(true)

//    /* ================= FETCH ================= */

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
//            const [mRes, tRes] = await Promise.all([
//                fetch("https://calchatmain-production-75c1.up.railway.app/api/Meeting/my-meetings", { headers: getHeaders() }),
//                fetch("https://calchatmain-production-75c1.up.railway.app/api/Tasks", { headers: getHeaders() })
//            ])

//            const mData = await safeJson(mRes)
//            const tData = await safeJson(tRes)

//            setMeetings(Array.isArray(mData) ? mData : [])
//            setTasks(Array.isArray(tData) ? tData : [])

//        } catch (err) {
//            console.error(err)
//        } finally {
//            setLoading(false)
//        }
//    }

//    /* ================= CALCULATIONS ================= */

//    const totalMeetings = meetings.length
//    const totalTasks = tasks.length

//    const completedTasks = tasks.filter(t => t.status === "Completed").length

//    const productivity = totalTasks > 0
//        ? Math.round((completedTasks / totalTasks) * 100)
//        : 0

//    /* ================= GRAPH ================= */

//    const productivityData = useMemo(() => {
//        const result: any = {}

//        tasks.forEach(t => {
//            const date = new Date().toLocaleDateString()
//            if (!result[date]) result[date] = { day: date, tasks: 0 }
//            result[date].tasks++
//        })

//        return Object.values(result)
//    }, [tasks])

//    /* ================= LOADING ================= */

//    if (loading) {
//        return <p className="p-6 text-center">Loading dashboard...</p>
//    }

//    return (
//        <DashboardShell navItems={navItems} role="Professional" title="Dashboard">

//            {/* STATS */}
//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

//                <StatCard icon={Video} title="Meetings" value={String(totalMeetings)} />

//                <StatCard icon={Briefcase} title="Tasks" value={String(totalTasks)} />

//                <StatCard icon={CheckCircle2} title="Completed" value={String(completedTasks)} />

//                <StatCard icon={TrendingUp} title="Productivity" value={`${productivity}%`} />

//            </div>

//            {/* CONTENT */}
//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* MEETINGS */}
//                <div className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition">
//                    <h3 className="text-lg font-semibold">Upcoming Meetings</h3>

//                    <div className="mt-4 flex flex-col gap-3">
//                        {meetings.slice(0, 5).map((m) => (
//                            <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition">

//                                <div className="flex items-center gap-3">

//                                    <div className="text-center">
//                                        <p className="text-sm font-semibold text-primary">
//                                            {new Date(m.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                                        </p>
//                                        <p className="text-xs text-muted-foreground">
//                                            {new Date(m.startTime).toLocaleDateString()}
//                                        </p>
//                                    </div>

//                                    <div>
//                                        <p className="font-medium">{m.meetingTitle || m.title || "Meeting"}</p>
//                                    </div>

//                                </div>

//                                <Badge variant="secondary">Meeting</Badge>

//                            </div>
//                        ))}
//                    </div>
//                </div>

//                {/* TASKS */}
//                <div className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition">
//                    <h3 className="text-lg font-semibold">Tasks</h3>

//                    <div className="mt-4 flex flex-col gap-4">
//                        {tasks.slice(0, 5).map((t) => {

//                            const progress =
//                                t.status === "Completed" ? 100 :
//                                    t.status === "In Progress" ? 60 : 20

//                            return (
//                                <div key={t.id} className="p-4 rounded-lg border bg-muted/40 hover:shadow-sm transition">

//                                    <div className="flex justify-between items-center">
//                                        <p className="font-medium">{t.title}</p>
//                                        <Badge variant={
//                                            t.priority === "High" ? "destructive" :
//                                                t.priority === "Medium" ? "secondary" : "outline"
//                                        }>
//                                            {t.priority}
//                                        </Badge>
//                                    </div>

//                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
//                                        {t.description || "No description"}
//                                    </p>

//                                    <div className="mt-3">
//                                        <div className="flex justify-between text-xs mb-1">
//                                            <span>{t.status}</span>
//                                            <span>{progress}%</span>
//                                        </div>
//                                        <Progress value={progress} className="h-2" />
//                                    </div>

//                                </div>
//                            )
//                        })}
//                    </div>
//                </div>

//                {/* GRAPH */}
//                <div className="rounded-xl border bg-card p-6 col-span-2 shadow-sm hover:shadow-lg transition">
//                    <h3 className="text-lg font-semibold">Productivity Trend</h3>

//                    <div className="h-64 mt-4">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <AreaChart data={productivityData}>
//                                <CartesianGrid strokeDasharray="3 3" />
//                                <XAxis dataKey="day" />
//                                <YAxis />
//                                <Tooltip />
//                                <Legend />
//                                <Area type="monotone" dataKey="tasks" stroke={PRIMARY} fill={PRIMARY} />
//                            </AreaChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>

//            </div>

//        </DashboardShell>
//    )
//}








//"use client"

//import { useEffect, useState, useMemo } from "react"
//import {
//    LayoutDashboard, Calendar, MessageSquare, Video, Users,
//    StickyNote, BarChart3, Briefcase, TrendingUp, CheckCircle2, Megaphone,
//    Flame, Zap, Leaf
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Badge } from "@/components/ui/badge"
//import { Progress } from "@/components/ui/progress"

//import {
//    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
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

///* ================= COMPONENT ================= */

//export default function ProfessionalDashboard() {

//    const [meetings, setMeetings] = useState<Meeting[]>([])
//    const [tasks, setTasks] = useState<Task[]>([])
//    const [loading, setLoading] = useState(true)

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
//            const [mRes, tRes] = await Promise.all([
//                fetch("https://calchatmain-production-75c1.up.railway.app/api/Meeting/my-meetings", { headers: getHeaders() }),
//                fetch("https://calchatmain-production-75c1.up.railway.app/api/Tasks", { headers: getHeaders() })
//            ])

//            setMeetings(await safeJson(mRes))
//            setTasks(await safeJson(tRes))

//        } finally {
//            setLoading(false)
//        }
//    }

//    /* ================= STATS ================= */

//    const completedTasks = tasks.filter(t => t.status === "Completed").length
//    const productivity = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0

//    /* ================= GRAPH ================= */

//    const productivityData = useMemo(() => {
//        return tasks.map((t, i) => ({
//            day: `Day ${i + 1}`,
//            tasks: i + 1
//        }))
//    }, [tasks])

//    /* ================= PRIORITY BADGE ================= */

//    function PriorityBadge({ priority }: { priority: string }) {
//        if (priority === "High") {
//            return (
//                <Badge className="bg-red-500/10 text-red-600 border border-red-300 flex items-center gap-1">
//                    <Flame className="h-3 w-3" /> High
//                </Badge>
//            )
//        }
//        if (priority === "Medium") {
//            return (
//                <Badge className="bg-yellow-500/10 text-yellow-600 border border-yellow-300 flex items-center gap-1">
//                    <Zap className="h-3 w-3" /> Medium
//                </Badge>
//            )
//        }
//        return (
//            <Badge className="bg-green-500/10 text-green-600 border border-green-300 flex items-center gap-1">
//                <Leaf className="h-3 w-3" /> Low
//            </Badge>
//        )
//    }

//    if (loading) {
//        return <p className="p-6 text-center">Loading dashboard...</p>
//    }

//    return (
//        <DashboardShell navItems={navItems} role="Professional" title="Dashboard">

//            {/* 🔥 STATS */}
//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

//                <StatCard icon={Video} title="Meetings" value={String(meetings.length)} />
//                <StatCard icon={Briefcase} title="Tasks" value={String(tasks.length)} />
//                <StatCard icon={CheckCircle2} title="Completed" value={String(completedTasks)} />
//                <StatCard icon={TrendingUp} title="Productivity" value={`${productivity}%`} />

//            </div>

//            {/* 🔥 CONTENT */}
//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* ================= MEETINGS ================= */}
//                <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-6 shadow-sm hover:shadow-xl transition">
//                    <h3 className="text-lg font-semibold">Upcoming Meetings</h3>

//                    <div className="mt-4 flex flex-col gap-3">

//                        {meetings.slice(0, 5).map(m => (
//                            <div
//                                key={m.id}
//                                className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:scale-[1.02] transition"
//                            >

//                                <div className="flex items-center gap-4">

//                                    {/* TIME BLOCK */}
//                                    <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-center">
//                                        <p className="text-sm font-semibold">
//                                            {new Date(m.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                                        </p>
//                                        <p className="text-xs">
//                                            {new Date(m.startTime).toLocaleDateString()}
//                                        </p>
//                                    </div>

//                                    <p className="font-medium">
//                                        {m.meetingTitle || m.title || "Meeting"}
//                                    </p>

//                                </div>

//                                <Badge variant="secondary">Meeting</Badge>

//                            </div>
//                        ))}

//                    </div>
//                </div>

//                {/* ================= TASKS ================= */}
//                <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-6 shadow-sm hover:shadow-xl transition">
//                    <h3 className="text-lg font-semibold">Tasks</h3>

//                    <div className="mt-4 flex flex-col gap-4">

//                        {tasks.slice(0, 5).map(t => {

//                            const progress =
//                                t.status === "Completed" ? 100 :
//                                    t.status === "In Progress" ? 60 : 20

//                            return (
//                                <div
//                                    key={t.id}
//                                    className="p-4 rounded-xl bg-muted/40 hover:shadow-md hover:scale-[1.01] transition"
//                                >

//                                    <div className="flex justify-between items-center">
//                                        <p className="font-medium">{t.title}</p>
//                                        <PriorityBadge priority={t.priority} />
//                                    </div>

//                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
//                                        {t.description || "No description"}
//                                    </p>

//                                    <div className="mt-3">
//                                        <div className="flex justify-between text-xs mb-1">
//                                            <span>{t.status}</span>
//                                            <span>{progress}%</span>
//                                        </div>

//                                        <Progress value={progress} className="h-2" />
//                                    </div>

//                                </div>
//                            )
//                        })}

//                    </div>
//                </div>

//                {/* ================= GRAPH ================= */}
//                <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-6 col-span-2 shadow-sm hover:shadow-xl transition">
//                    <h3 className="text-lg font-semibold">Productivity Trend</h3>

//                    <div className="h-64 mt-4">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <AreaChart data={productivityData}>
//                                <CartesianGrid strokeDasharray="3 3" />
//                                <XAxis dataKey="day" />
//                                <YAxis />
//                                <Tooltip />
//                                <Legend />
//                                <Area type="monotone" dataKey="tasks" stroke="#6366F1" fill="#6366F1" />
//                            </AreaChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>

//            </div>

//        </DashboardShell>
//    )
//}





//"use client"

//import { useEffect, useState, useMemo } from "react"
//import {
//    LayoutDashboard, Calendar, MessageSquare, Video, Users,
//    StickyNote, BarChart3, Briefcase, TrendingUp, CheckCircle2, Megaphone,
//    Flame, Zap, Leaf
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

///* ================= COMPONENT ================= */

//export default function ProfessionalDashboard() {

//    const [meetings, setMeetings] = useState<Meeting[]>([])
//    const [tasks, setTasks] = useState<Task[]>([])
//    const [loading, setLoading] = useState(true)

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
//            const [mRes, tRes] = await Promise.all([
//                fetch("https://calchatmain-production-75c1.up.railway.app/api/Meeting/my-meetings", { headers: getHeaders() }),
//                fetch("https://calchatmain-production-75c1.up.railway.app/api/Tasks", { headers: getHeaders() })
//            ])

//            setMeetings(await safeJson(mRes))
//            setTasks(await safeJson(tRes))

//        } finally {
//            setLoading(false)
//        }
//    }

//    /* ================= STATS ================= */

//    const completedTasks = tasks.filter(t => t.status === "Completed").length
//    const productivity = tasks.length
//        ? Math.round((completedTasks / tasks.length) * 100)
//        : 0

//    /* ================= WEEKLY ACTIVITY GRAPH ================= */

//    const weeklyData = useMemo(() => {

//        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

//        const result: any = {}

//        days.forEach(d => {
//            result[d] = { day: d, tasks: 0 }
//        })

//        // count tasks
//        tasks.forEach(t => {
//            if (!t.deadline) return
//            const day = days[new Date(t.deadline).getDay()]
//            result[day].tasks++
//        })

//        // count meetings
//        meetings.forEach(m => {
//            const day = days[new Date(m.startTime).getDay()]
//            result[day].tasks++
//        })

//        return Object.values(result)

//    }, [tasks, meetings])

//    /* ================= PRIORITY BADGE ================= */

//    function PriorityBadge({ priority }: { priority: string }) {
//        if (priority === "High") {
//            return (
//                <Badge className="bg-red-500/10 text-red-600 border border-red-300 flex items-center gap-1">
//                    <Flame className="h-3 w-3" /> High
//                </Badge>
//            )
//        }
//        if (priority === "Medium") {
//            return (
//                <Badge className="bg-yellow-500/10 text-yellow-600 border border-yellow-300 flex items-center gap-1">
//                    <Zap className="h-3 w-3" /> Medium
//                </Badge>
//            )
//        }
//        return (
//            <Badge className="bg-green-500/10 text-green-600 border border-green-300 flex items-center gap-1">
//                <Leaf className="h-3 w-3" /> Low
//            </Badge>
//        )
//    }

//    if (loading) {
//        return <p className="p-6 text-center">Loading dashboard...</p>
//    }

//    return (
//        <DashboardShell navItems={navItems} role="Professional" title="Dashboard">

//            {/* 🔥 STATS */}
//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                <StatCard icon={Video} title="Meetings" value={String(meetings.length)} />
//                <StatCard icon={Briefcase} title="Tasks" value={String(tasks.length)} />
//                <StatCard icon={CheckCircle2} title="Completed" value={String(completedTasks)} />
//                <StatCard icon={TrendingUp} title="Productivity" value={`${productivity}%`} />
//            </div>

//            {/* 🔥 CONTENT */}
//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* MEETINGS */}
//                <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-6 shadow-sm">
//                    <h3 className="text-lg font-semibold">Upcoming Meetings</h3>

//                    <div className="mt-4 flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2">
//                        {meetings.map(m => (
//                            <div key={m.id} className="flex justify-between p-3 rounded-xl bg-muted/40">

//                                <div className="flex gap-4 items-center">
//                                    <div className="text-primary text-sm">
//                                        {new Date(m.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                                    </div>
//                                    <p>{m.meetingTitle || m.title}</p>
//                                </div>

//                                <Badge>Meeting</Badge>
//                            </div>
//                        ))}
//                    </div>
//                </div>

//                {/* TASKS */}
//                <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-6 shadow-sm">
//                    <h3 className="text-lg font-semibold">Tasks</h3>

//                    <div className="mt-4 flex flex-col gap-4 max-h-[250px] overflow-y-auto pr-2">

//                        {tasks.map(t => {

//                            const progress =
//                                t.status === "Completed" ? 100 :
//                                    t.status === "In Progress" ? 60 : 20

//                            return (
//                                <div key={t.id} className="p-4 rounded-xl bg-muted/40">

//                                    <div className="flex justify-between">
//                                        <p>{t.title}</p>
//                                        <PriorityBadge priority={t.priority} />
//                                    </div>

//                                    <div className="mt-3">
//                                        <Progress value={progress} />
//                                    </div>

//                                </div>
//                            )
//                        })}

//                    </div>
//                </div>

//                {/* ✅ WEEKLY ACTIVITY GRAPH (REPLACED) */}
//                <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-6 col-span-2 shadow-sm">
//                    <h3 className="text-lg font-semibold">Weekly Activity</h3>

//                    <div className="h-64 mt-4">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <AreaChart data={weeklyData}>
//                                <CartesianGrid strokeDasharray="3 3" />
//                                <XAxis dataKey="day" />
//                                <YAxis />
//                                <Tooltip />
//                                <Area
//                                    type="monotone"
//                                    dataKey="tasks"
//                                    stroke="#3b82f6"
//                                    fill="#93c5fd"
//                                />
//                            </AreaChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>

//            </div>

//        </DashboardShell>
//    )
//}



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
//                fetch("https://calchatmain-production-75c1.up.railway.app/api/Meeting/my-meetings", { headers: getHeaders() }),
//                fetch("https://calchatmain-production-75c1.up.railway.app/api/Tasks", { headers: getHeaders() }),
//                fetch("https://calchatmain-production-75c1.up.railway.app/api/Announcement", { headers: getHeaders() })
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

//    /* ================= PRIORITY BADGE ================= */

//    function PriorityBadge({ priority }: { priority: string }) {
//        if (priority === "High") {
//            return (
//                <Badge className="text-red-600 border-red-300 flex items-center gap-1">
//                    <Flame className="h-3 w-3" /> High
//                </Badge>
//            )
//        }
//        if (priority === "Medium") {
//            return (
//                <Badge className="text-yellow-600 border-yellow-300 flex items-center gap-1">
//                    <Zap className="h-3 w-3" /> Medium
//                </Badge>
//            )
//        }
//        return (
//            <Badge className="text-green-600 border-green-300 flex items-center gap-1">
//                <Leaf className="h-3 w-3" /> Low
//            </Badge>
//        )
//    }

//    if (loading) {
//        return <p className="p-6 text-center">Loading dashboard...</p>
//    }

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
//                <div className="rounded-2xl border bg-card p-6">
//                    <h3 className="text-lg font-semibold">Upcoming Meetings</h3>

//                    <div className="mt-4 flex flex-col gap-3 max-h-[250px] overflow-y-auto">
//                        {meetings.map(m => (
//                            <div key={m.id} className="flex justify-between p-3 rounded-xl bg-muted/40">
//                                <div className="flex gap-4 items-center">
//                                    <div className="text-primary text-sm">
//                                        {new Date(m.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                                    </div>
//                                    <p>{m.meetingTitle || m.title}</p>
//                                </div>
//                                <Badge>Meeting</Badge>
//                            </div>
//                        ))}
//                    </div>
//                </div>

//                {/* TASKS */}
//                <div className="rounded-2xl border bg-card p-6">
//                    <h3 className="text-lg font-semibold">Tasks</h3>

//                    <div className="mt-4 flex flex-col gap-4 max-h-[250px] overflow-y-auto">

//                        {tasks.map(t => {

//                            const progress =
//                                t.status === "Completed" ? 100 :
//                                    t.status === "In Progress" ? 60 : 20

//                            return (
//                                <div key={t.id} className="p-4 rounded-xl bg-muted/40">

//                                    <div className="flex justify-between">
//                                        <p>{t.title}</p>
//                                        <PriorityBadge priority={t.priority} />
//                                    </div>

//                                    <div className="mt-3">
//                                        <Progress value={progress} />
//                                    </div>

//                                </div>
//                            )
//                        })}

//                    </div>
//                </div>

//                {/* GRAPH */}
//                <div className="rounded-2xl border bg-card p-6 shadow-sm">
//                    <h3 className="text-lg font-semibold">Weekly Activity</h3>

//                    <div className="h-64 mt-4">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <AreaChart data={weeklyData}>
//                                <CartesianGrid strokeDasharray="3 3" />
//                                <XAxis dataKey="day" />
//                                <YAxis />
//                                <Tooltip />
//                                <Area
//                                    type="monotone"
//                                    dataKey="tasks"
//                                    stroke="#3b82f6"
//                                    fill="#93c5fd"
//                                />
//                            </AreaChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>

//                {/* ✅ ANNOUNCEMENTS (NEW) */}
//                <div className="rounded-2xl border bg-card p-6 shadow-sm max-h-[350px] overflow-y-auto">
//                    <h3 className="text-lg font-semibold">Announcements</h3>

//                    <div className="mt-4 flex flex-col gap-4">

//                        {announcements.length === 0 && (
//                            <p className="text-sm text-muted-foreground">
//                                No announcements available
//                            </p>
//                        )}

//                        {announcements.map(a => (
//                            <div key={a.id} className="p-4 rounded-xl bg-muted/40">

//                                <div className="flex items-center gap-2">
//                                    <h4 className="font-medium">{a.title}</h4>

//                                    <Badge>{a.status}</Badge>

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
                fetch("https://calchatmain-production-75c1.up.railway.app/api/Meeting/my-meetings", { headers: getHeaders() }),
                fetch("https://calchatmain-production-75c1.up.railway.app/api/Tasks", { headers: getHeaders() }),
                fetch("https://calchatmain-production-75c1.up.railway.app/api/Announcement", { headers: getHeaders() })
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