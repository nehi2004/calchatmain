//"use client"

//import {
//  LayoutDashboard, Calendar, MessageSquare, CheckCircle2, Focus, CalendarDays, Users, BarChart3,
//  BookOpen, FileText, Clock
//} from "lucide-react"
//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Progress } from "@/components/ui/progress"
//import { Badge } from "@/components/ui/badge"
//import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

//const navItems = [
//  { label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
//  { label: "Calendar", href: "/dashboard/student/calendar", icon: Calendar },
//  { label: "AI Chat", href: "/dashboard/student/chat", icon: MessageSquare },
//  { label: "Tasks", href: "/dashboard/student/tasks", icon: CheckCircle2 },
//  { label: "Focus Mode", href: "/dashboard/student/focus", icon: Focus },
//  { label: "Events", href: "/dashboard/student/events", icon: CalendarDays },
//  { label: "Group Study", href: "/dashboard/student/group", icon: Users },
//  { label: "Analytics", href: "/dashboard/student/analytics", icon: BarChart3 },
//]

//const schedule = [
//  { time: "09:00", title: "Data Structures Lecture", type: "Class" },
//  { time: "11:00", title: "Team Project Meeting", type: "Meeting" },
//  { time: "14:00", title: "Physics Lab", type: "Lab" },
//  { time: "16:00", title: "Study Group - Math", type: "Study" },
//]

//const assignments = [
//  { title: "Algorithm Analysis Report", due: "Feb 12", status: "In Progress" },
//  { title: "Database Design Project", due: "Feb 15", status: "Not Started" },
//  { title: "Physics Problem Set 5", due: "Feb 10", status: "Completed" },
//]

//const studyData = [
//  { day: "Mon", hours: 4 },
//  { day: "Tue", hours: 6 },
//  { day: "Wed", hours: 3 },
//  { day: "Thu", hours: 5 },
//  { day: "Fri", hours: 7 },
//  { day: "Sat", hours: 2 },
//  { day: "Sun", hours: 4 },
//]

//export default function StudentDashboard() {
//  return (
//    <DashboardShell navItems={navItems} role="Student" title="Dashboard">
//      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//        <StatCard icon={BookOpen} title="Classes Today" value="4" description="Next: Data Structures" />
//        <StatCard icon={FileText} title="Pending Assignments" value="5" trend="-2 this week" />
//        <StatCard icon={Clock} title="Study Hours" value="31h" description="This week" trend="+12%" />
//        <StatCard icon={CheckCircle2} title="Task Completion" value="78%" description="7 of 9 done" />
//      </div>

//      <div className="mt-6 grid gap-6 lg:grid-cols-2">
//        {/* Today's Schedule */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">{"Today's Schedule"}</h3>
//          <div className="mt-4 flex flex-col gap-3">
//            {schedule.map((item) => (
//              <div key={item.time} className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
//                <span className="w-14 text-sm font-medium text-primary">{item.time}</span>
//                <div className="flex-1">
//                  <p className="text-sm font-medium text-card-foreground">{item.title}</p>
//                </div>
//                <Badge variant="secondary">{item.type}</Badge>
//              </div>
//            ))}
//          </div>
//        </div>

//        {/* Upcoming Assignments */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Upcoming Assignments</h3>
//          <div className="mt-4 flex flex-col gap-3">
//            {assignments.map((item) => (
//              <div key={item.title} className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
//                <div className="flex-1">
//                  <p className="text-sm font-medium text-card-foreground">{item.title}</p>
//                  <p className="text-xs text-muted-foreground">Due: {item.due}</p>
//                </div>
//                <Badge variant={item.status === "Completed" ? "default" : "secondary"}>
//                  {item.status}
//                </Badge>
//              </div>
//            ))}
//          </div>
//        </div>

//        {/* Study Progress Chart */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Study Progress</h3>
//          <div className="mt-4 h-64">
//            <ResponsiveContainer width="100%" height="100%">
//              <BarChart data={studyData}>
//                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                <XAxis dataKey="day" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
//                <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
//                <Tooltip
//                  contentStyle={{
//                    backgroundColor: 'hsl(var(--card))',
//                    border: '1px solid hsl(var(--border))',
//                    borderRadius: '8px',
//                    color: 'hsl(var(--card-foreground))',
//                  }}
//                />
//                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
//              </BarChart>
//            </ResponsiveContainer>
//          </div>
//        </div>

//        {/* Task Completion Status */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Task Completion Status</h3>
//          <div className="mt-6 flex flex-col gap-5">
//            {[
//              { label: "Assignments", value: 75 },
//              { label: "Projects", value: 60 },
//              { label: "Reading", value: 90 },
//              { label: "Lab Reports", value: 45 },
//            ].map((task) => (
//              <div key={task.label}>
//                <div className="mb-2 flex items-center justify-between text-sm">
//                  <span className="text-card-foreground">{task.label}</span>
//                  <span className="font-medium text-primary">{task.value}%</span>
//                </div>
//                <Progress value={task.value} className="h-2" />
//              </div>
//            ))}
//          </div>
//        </div>
//      </div>
//    </DashboardShell>
//  )
//}












//"use client"

//import { useState, useEffect } from "react"
//import {
//    LayoutDashboard,
//    Calendar,
//    MessageSquare,
//    CheckCircle2,
//    Focus,
//    CalendarDays,
//    Users,
//    BarChart3,
//    Clock,
//    FileText
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Progress } from "@/components/ui/progress"
//import { Badge } from "@/components/ui/badge"

//import {
//    BarChart,
//    Bar,
//    XAxis,
//    YAxis,
//    Tooltip,
//    CartesianGrid,
//    ResponsiveContainer
//} from "recharts"

///* ================= TYPES ================= */

//type Task = {
//    id: string
//    title: string
//    status: string
//    priority: string
//    deadline?: string
//}

//type EventType = {
//    id: string
//    title: string
//    date: string
//    time: string
//    priority: string
//}

///* ================= NAV ================= */

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
//    { label: "Calendar", href: "/dashboard/student/calendar", icon: Calendar },
//    { label: "AI Chat", href: "/dashboard/student/chat", icon: MessageSquare },
//    { label: "Tasks", href: "/dashboard/student/tasks", icon: CheckCircle2 },
//    { label: "Focus Mode", href: "/dashboard/student/focus", icon: Focus },
//    { label: "Events", href: "/dashboard/student/events", icon: CalendarDays },
//    { label: "Group Study", href: "/dashboard/student/group", icon: Users },
//    { label: "Analytics", href: "/dashboard/student/analytics", icon: BarChart3 },
//]

//const TASK_API = "https://steadfast-warmth-production-31cc.up.railway.app/api/Tasks"
//const EVENT_API = "https://steadfast-warmth-production-31cc.up.railway.app/api/CalendarEvents"

///* ================= UTIL ================= */

//function formatDate(date: Date) {
//    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
//        date.getDate()
//    ).padStart(2, "0")}`
//}

//export default function StudentDashboard() {

//    const [tasks, setTasks] = useState<Task[]>([])
//    const [events, setEvents] = useState<EventType[]>([])

//    const today = formatDate(new Date())

//    useEffect(() => {
//        fetchTasks()
//        fetchEvents()
//    }, [])

//    /* ================= FETCH TASKS ================= */

//    async function fetchTasks() {

//        const token = localStorage.getItem("token")

//        const res = await fetch(TASK_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        const formatted: Task[] = data.map((t: any) => ({
//            id: String(t.id),
//            title: t.title,
//            status: t.status,
//            priority: t.priority,
//            deadline: t.deadline?.split("T")[0]
//        }))

//        setTasks(formatted)
//    }

//    /* ================= FETCH EVENTS ================= */

//    async function fetchEvents() {

//        const token = localStorage.getItem("token")

//        const res = await fetch(EVENT_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        const formatted: EventType[] = data.map((e: any) => ({
//            id: String(e.id),
//            title: e.title,
//            date: e.date.split("T")[0],
//            time: e.time,
//            priority: e.priority
//        }))

//        setEvents(formatted)
//    }

//    /* ================= TASK STATS ================= */

//    const completed = tasks.filter(t => t.status === "Completed").length
//    const todo = tasks.filter(t => t.status === "Todo").length
//    const progress = tasks.filter(t => t.status === "In Progress").length

//    const progressPercent =
//        tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

//    /* ================= TODAY EVENTS ================= */

//    const todayEvents = events
//        .filter(e => e.date === today)
//        .sort((a, b) => a.time.localeCompare(b.time))
//        .slice(0, 4)

//    /* ================= CHART ================= */

//    const weekChart = [
//        { day: "Mon", hours: 3 },
//        { day: "Tue", hours: 5 },
//        { day: "Wed", hours: 2 },
//        { day: "Thu", hours: 4 },
//        { day: "Fri", hours: 6 },
//        { day: "Sat", hours: 2 },
//        { day: "Sun", hours: 3 }
//    ]

//    return (

//        <DashboardShell navItems={navItems} role="Student" title="Dashboard">

//            {/* STATS */}

//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

//                <StatCard
//                    icon={Calendar}
//                    title="Today's Events"
//                    value={todayEvents.length.toString()}
//                    description="Scheduled today"
//                />

//                <StatCard
//                    icon={CheckCircle2}
//                    title="Completed Tasks"
//                    value={completed.toString()}
//                    description="Tasks done"
//                />

//                <StatCard
//                    icon={Clock}
//                    title="In Progress"
//                    value={progress.toString()}
//                    description="Active tasks"
//                />

//                <StatCard
//                    icon={FileText}
//                    title="Pending Tasks"
//                    value={todo.toString()}
//                    description="Need attention"
//                />

//            </div>

//            {/* MAIN GRID */}

//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* TODAY SCHEDULE */}

//                <div className="rounded-xl border bg-card p-6">

//                    <h3 className="font-semibold text-lg">
//                        Today's Schedule
//                    </h3>

//                    <div className="mt-4 flex flex-col gap-3">

//                        {todayEvents.length === 0 && (
//                            <p className="text-sm text-muted-foreground">
//                                No events today
//                            </p>
//                        )}

//                        {todayEvents.map((e) => (

//                            <div
//                                key={e.id}
//                                className="flex items-center gap-4 rounded-lg bg-muted/50 p-3"
//                            >

//                                <span className="w-14 text-sm font-medium text-primary">
//                                    {e.time}
//                                </span>

//                                <div className="flex-1">
//                                    <p className="text-sm font-medium">
//                                        {e.title}
//                                    </p>
//                                </div>

//                                <Badge variant="secondary">
//                                    {e.priority}
//                                </Badge>

//                            </div>

//                        ))}

//                    </div>

//                </div>

//                {/* TASK PROGRESS */}

//                <div className="rounded-xl border bg-card p-6">

//                    <h3 className="font-semibold text-lg">
//                        Task Progress
//                    </h3>

//                    <div className="mt-6 flex flex-col gap-5">

//                        <div>

//                            <div className="flex justify-between text-sm">
//                                <span>Completed</span>
//                                <span>{completed}</span>
//                            </div>

//                            <Progress value={progressPercent} className="h-2 mt-2" />

//                        </div>

//                        <div className="flex gap-6 text-sm text-muted-foreground">

//                            <span>Todo: {todo}</span>
//                            <span>Progress: {progress}</span>
//                            <span>Done: {completed}</span>

//                        </div>

//                    </div>

//                </div>

//                {/* CHART */}

//                <div className="rounded-xl border bg-card p-6">

//                    <h3 className="font-semibold text-lg">
//                        Weekly Study Hours
//                    </h3>

//                    <div className="mt-4 h-64">

//                        <ResponsiveContainer width="100%" height="100%">

//                            <BarChart data={weekChart}>

//                                <CartesianGrid strokeDasharray="3 3" />

//                                <XAxis dataKey="day" />

//                                <YAxis />

//                                <Tooltip />

//                                <Bar
//                                    dataKey="hours"
//                                    fill="hsl(var(--primary))"
//                                    radius={[4, 4, 0, 0]}
//                                />

//                            </BarChart>

//                        </ResponsiveContainer>

//                    </div>

//                </div>

//                {/* UPCOMING TASKS */}

//                <div className="rounded-xl border bg-card p-6">

//                    <h3 className="font-semibold text-lg">
//                        Upcoming Tasks
//                    </h3>

//                    <div className="mt-4 flex flex-col gap-3">

//                        {tasks.slice(0, 4).map(task => (

//                            <div
//                                key={task.id}
//                                className="flex items-center gap-4 rounded-lg bg-muted/50 p-3"
//                            >

//                                <div className="flex-1">

//                                    <p className="text-sm font-medium">
//                                        {task.title}
//                                    </p>

//                                    <p className="text-xs text-muted-foreground">
//                                        Deadline: {task.deadline || "No date"}
//                                    </p>

//                                </div>

//                                <Badge variant="outline">
//                                    {task.priority}
//                                </Badge>

//                            </div>

//                        ))}

//                    </div>

//                </div>

//            </div>

//        </DashboardShell>

//    )
//}












//"use client"

//import { useState, useEffect, useMemo } from "react"
//import {
//    LayoutDashboard,
//    Calendar,
//    MessageSquare,
//    CheckCircle2,
//    Focus,
//    CalendarDays,
//    Users,
//    BarChart3,
//    Clock,
//    FileText
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Progress } from "@/components/ui/progress"
//import { Badge } from "@/components/ui/badge"

//import {
//    BarChart,
//    Bar,
//    XAxis,
//    YAxis,
//    Tooltip,
//    CartesianGrid,
//    ResponsiveContainer
//} from "recharts"

///* ================= TYPES ================= */

//type Task = {
//    id: string
//    title: string
//    status: string
//    priority: string
//    deadline?: string
//}

//type EventType = {
//    id: string
//    title: string
//    date: string
//    time: string
//    priority: string
//}

///* ================= NAV ================= */

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
//    { label: "Calendar", href: "/dashboard/student/calendar", icon: Calendar },
//    { label: "AI Chat", href: "/dashboard/student/chat", icon: MessageSquare },
//    { label: "Tasks", href: "/dashboard/student/tasks", icon: CheckCircle2 },
//    { label: "Focus Mode", href: "/dashboard/student/focus", icon: Focus },
//    { label: "Events", href: "/dashboard/student/events", icon: CalendarDays },
//    { label: "Group Study", href: "/dashboard/student/group", icon: Users },
//    { label: "Analytics", href: "/dashboard/student/analytics", icon: BarChart3 },
//]

//const TASK_API = "https://steadfast-warmth-production-31cc.up.railway.app/api/Tasks"
//const EVENT_API = "https://steadfast-warmth-production-31cc.up.railway.app/api/CalendarEvents"

///* ================= UTIL ================= */

//function formatDate(date: Date) {
//    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
//        date.getDate()
//    ).padStart(2, "0")}`
//}

//export default function StudentDashboard() {

//    const [tasks, setTasks] = useState<Task[]>([])
//    const [events, setEvents] = useState<EventType[]>([])

//    const today = formatDate(new Date())

//    useEffect(() => {
//        fetchTasks()
//        fetchEvents()
//    }, [])

//    async function fetchTasks() {
//        const token = localStorage.getItem("token")

//        const res = await fetch(TASK_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        const formatted = data.map((t: any) => ({
//            id: String(t.id),
//            title: t.title,
//            status: t.status,
//            priority: t.priority,
//            deadline: t.deadline?.split("T")[0]
//        }))

//        setTasks(formatted)
//    }

//    async function fetchEvents() {
//        const token = localStorage.getItem("token")

//        const res = await fetch(EVENT_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        const formatted = data.map((e: any) => ({
//            id: String(e.id),
//            title: e.title,
//            date: e.date.split("T")[0],
//            time: e.time,
//            priority: e.priority
//        }))

//        setEvents(formatted)
//    }

//    /* ================= TASK STATS ================= */

//    const completed = tasks.filter(t => t.status === "Completed").length
//    const todo = tasks.filter(t => t.status === "Todo").length
//    const progress = tasks.filter(t => t.status === "In Progress").length

//    const progressPercent =
//        tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

//    /* ================= TODAY EVENTS ================= */

//    const todayEvents = useMemo(() => {
//        return events
//            .filter(e => e.date === today)
//            .sort((a, b) => a.time.localeCompare(b.time))
//    }, [events, today])

//    const todayTasks = useMemo(() => {
//        return tasks.filter(t => t.deadline === today)
//    }, [tasks, today])

//    /* ================= UPCOMING EVENTS ================= */

//    const upcomingEvents = useMemo(() => {
//        return events
//            .filter(e => e.date > today)
//            .sort((a, b) => a.date.localeCompare(b.date))
//            .slice(0, 5)
//    }, [events, today])

//    /* ================= REAL ANALYTICS ================= */

//    const weeklyData = useMemo(() => {

//        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

//        const result: any = {}

//        days.forEach(d => {
//            result[d] = { day: d, count: 0 }
//        })

//        const all = [
//            ...tasks.map(t => t.deadline),
//            ...events.map(e => e.date)
//        ]

//        all.forEach(date => {
//            if (!date) return
//            const day = days[new Date(date).getDay()]
//            result[day].count++
//        })

//        return Object.values(result)

//    }, [tasks, events])

//    return (

//        <DashboardShell navItems={navItems} role="Student" title="Dashboard">

//            {/* ================= STATS ================= */}

//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

//                <StatCard
//                    icon={Calendar}
//                    title="Today's Events"
//                    value={todayEvents.length.toString()}
//                />

//                <StatCard
//                    icon={CheckCircle2}
//                    title="Completed Tasks"
//                    value={completed.toString()}
//                />

//                <StatCard
//                    icon={Clock}
//                    title="In Progress"
//                    value={progress.toString()}
//                />

//                <StatCard
//                    icon={FileText}
//                    title="Pending Tasks"
//                    value={todo.toString()}
//                />

//            </div>

//            {/* ================= MAIN ================= */}

//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* TODAY SCHEDULE (SCROLL ADDED) */}

//                {/* TODAY SCHEDULE (CONDITIONAL SCROLL) */}

                //<div className="rounded-xl border bg-card p-6">

                //    <h3 className="font-semibold text-lg">
                //        Today's Schedule
                //    </h3>

                //    <div
                //        className={`mt-4 flex flex-col gap-3 pr-2 transition-all ${todayEvents.length > 3
                //                ? "max-h-64 overflow-y-auto scrollbar-thin"
                //                : ""
                //            }`}
                //    >

                //        {todayEvents.length === 0 && (
                //            <p className="text-sm text-muted-foreground text-center py-6">
                //                No events today 🎉
                //            </p>
                //        )}

                //        {todayEvents.map((e) => (
                //            <div
                //                key={e.id}
                //                className="flex items-center gap-4 rounded-lg bg-muted/50 p-3 hover:bg-muted transition-all duration-200 hover:scale-[1.01]"
                //            >
                //                <span className="w-14 text-sm font-semibold text-primary">
                //                    {e.time}
                //                </span>

                //                <div className="flex-1">
                //                    <p className="text-sm font-medium">
                //                        {e.title}
                //                    </p>
                //                </div>

                //                {/* 🔥 Dynamic Priority Color */}
                //                <Badge
                //                    variant="secondary"
                //                    className={
                //                        e.priority === "High"
                //                            ? "bg-red-100 text-red-600"
                //                            : e.priority === "Medium"
                //                                ? "bg-yellow-100 text-yellow-700"
                //                                : "bg-green-100 text-green-600"
                //                    }
                //                >
                //                    {e.priority}
                //                </Badge>
                //            </div>
                //        ))}

                //    </div>

                //</div>

//                {/* TASK PROGRESS */}

//                {/* TASK PROGRESS + TODAY TASKS */}

//                <div className="rounded-xl border bg-card p-6">

//                    <h3 className="font-semibold text-lg">
//                        Today's Tasks
//                    </h3>

//                    {/* Progress Bar */}
//                    <div className="mt-4">
//                        <Progress value={progressPercent} />
//                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
//                            <span>Todo: {todo}</span>
//                            <span>Progress: {progress}</span>
//                            <span>Done: {completed}</span>
//                        </div>
//                    </div>

//                    {/* Task List */}
//                    <div
//                        className={`mt-4 flex flex-col gap-3 pr-2 ${todayTasks.length > 3 ? "max-h-56 overflow-y-auto scrollbar-thin" : ""
//                            }`}
//                    >

//                        {todayTasks.length === 0 && (
//                            <p className="text-sm text-muted-foreground text-center py-6">
//                                No tasks for today 🚀
//                            </p>
//                        )}

//                        {todayTasks.map(task => (

//                            <div
//                                key={task.id}
//                                className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 hover:bg-muted transition"
//                            >

//                                {/* STATUS DOT */}
//                                <div
//                                    className={`h-2 w-2 rounded-full ${task.status === "Completed"
//                                            ? "bg-green-500"
//                                            : task.status === "In Progress"
//                                                ? "bg-blue-500"
//                                                : "bg-gray-400"
//                                        }`}
//                                />

//                                <div className="flex-1">
//                                    <p className="text-sm font-medium">
//                                        {task.title}
//                                    </p>
//                                </div>

//                                {/* PRIORITY */}
//                                <Badge
//                                    variant="outline"
//                                    className={
//                                        task.priority === "High"
//                                            ? "text-red-600 border-red-300"
//                                            : task.priority === "Medium"
//                                                ? "text-yellow-600 border-yellow-300"
//                                                : "text-green-600 border-green-300"
//                                    }
//                                >
//                                    {task.priority}
//                                </Badge>

//                            </div>

//                        ))}

//                    </div>

//                </div>

//                {/* REAL ANALYTICS */}

//                <div className="rounded-xl border bg-card p-6">

//                    <h3 className="font-semibold text-lg">
//                        Weekly Activity
//                    </h3>

//                    <div className="mt-4 h-64">

//                        <ResponsiveContainer width="100%" height="100%">
//                            <BarChart data={weeklyData}>
//                                <CartesianGrid strokeDasharray="3 3" />
//                                <XAxis dataKey="day" />
//                                <YAxis />
//                                <Tooltip />
//                                <Bar dataKey="count" fill="hsl(var(--primary))" />
//                            </BarChart>
//                        </ResponsiveContainer>

//                    </div>

//                </div>

//                {/* UPCOMING EVENTS */}

//                <div className="rounded-xl border bg-card p-6">

//                    <h3 className="font-semibold text-lg">
//                        Upcoming Events
//                    </h3>

//                    <div className="mt-4 flex flex-col gap-3">

//                        {upcomingEvents.map(event => (

//                            <div
//                                key={event.id}
//                                className="flex items-center gap-4 rounded-lg bg-muted/50 p-3 hover:bg-muted transition"
//                            >

//                                <div className="flex-1">
//                                    <p className="text-sm font-medium">
//                                        {event.title}
//                                    </p>

//                                    <p className="text-xs text-muted-foreground">
//                                        {event.date} • {event.time}
//                                    </p>
//                                </div>

//                                <Badge variant="outline">
//                                    {event.priority}
//                                </Badge>

//                            </div>

//                        ))}

//                    </div>

//                </div>

//            </div>

//        </DashboardShell>
//    )
//}









"use client"

import { useState, useEffect, useMemo } from "react"
import {
    LayoutDashboard,
    Calendar,
    MessageSquare,
    CheckCircle2,
    Focus,
    CalendarDays,
    Users,
    BarChart3,
    Clock,
    FileText
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts"

/* ================= TYPES ================= */

type Task = {
    id: string
    title: string
    status: string
    priority: string
    deadline?: string
}

type EventType = {
    id: string
    title: string
    date: string
    time: string
    priority: string
}

/* ================= NAV ================= */

const navItems = [
    { label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
    { label: "Calendar", href: "/dashboard/student/calendar", icon: Calendar },
    { label: "AI Chat", href: "/dashboard/student/chat", icon: MessageSquare },
    { label: "Tasks", href: "/dashboard/student/tasks", icon: CheckCircle2 },
    { label: "Focus Mode", href: "/dashboard/student/focus", icon: Focus },
    { label: "Events", href: "/dashboard/student/events", icon: CalendarDays },
    { label: "Group Study", href: "/dashboard/student/group", icon: Users },
    { label: "Analytics", href: "/dashboard/student/analytics", icon: BarChart3 },
]

const TASK_API = "https://steadfast-warmth-production-31cc.up.railway.app/api/Tasks"
const EVENT_API = "https://steadfast-warmth-production-31cc.up.railway.app/api/CalendarEvents"
const CUSTOM_EVENT_API = "https://steadfast-warmth-production-31cc.up.railway.app/api/Events"

/* ================= UTIL ================= */

function formatDate(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
    ).padStart(2, "0")}`
}

export default function StudentDashboard() {

    const [tasks, setTasks] = useState<Task[]>([])
    const [events, setEvents] = useState<EventType[]>([])
    const [customEvents, setCustomEvents] = useState<any[]>([])

    const today = formatDate(new Date())

    useEffect(() => {
        fetchTasks()
        fetchEvents()
        fetchCustomEvents()
    }, [])


    useEffect(() => {

        const handleEventUpdate = () => {
            fetchCustomEvents()
        }

        window.addEventListener("event-added", handleEventUpdate)

        return () => {
            window.removeEventListener("event-added", handleEventUpdate)
        }

    }, [])

    async function fetchTasks() {
        const token = localStorage.getItem("token")

        const res = await fetch(TASK_API, {
            headers: { Authorization: `Bearer ${token}` }
        })

        const data = await res.json()

        setTasks(data.map((t: any) => ({
            ...t,
            deadline: t.deadline?.split("T")[0]
        })))
    }

    async function fetchEvents() {
        const token = localStorage.getItem("token")

        const res = await fetch(EVENT_API, {
            headers: { Authorization: `Bearer ${token}` }
        })

        const data = await res.json()

        setEvents(data.map((e: any) => ({
            ...e,
            date: e.date.split("T")[0]
        })))
    }

    async function fetchCustomEvents() {
        const token = localStorage.getItem("token")

        const res = await fetch(CUSTOM_EVENT_API, {
            headers: { Authorization: `Bearer ${token}` }
        })

        const data = await res.json()

        setCustomEvents(
            data.map((e: any) => ({
                id: e.id,
                title: e.title,
                date: e.date?.split("T")[0],
                time: e.time || "",
                priority: "Medium",
            }))
        )
    }
    const allEvents = useMemo(() => {
        return [...events, ...customEvents]
    }, [events, customEvents])
    /* ================= STATS ================= */

    const completed = tasks.filter(t => t.status === "Completed").length
    const todo = tasks.filter(t => t.status === "Todo").length
    const progress = tasks.filter(t => t.status === "In Progress").length

    const progressPercent =
        tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

    /* ================= FILTERS ================= */

    const todayEvents = useMemo(() =>
        allEvents.filter(e => e.date === today)
        , [allEvents, today])

    const todayTasks = useMemo(() =>
        tasks.filter(t => t.deadline === today)
        , [tasks, today])

    const upcomingEvents = useMemo(() =>
        allEvents
            .filter(e => e.date > today)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 5)
        , [allEvents, today])

    /* ================= ANALYTICS ================= */

    const weeklyData = useMemo(() => {

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const result: any = {}

        days.forEach(d => result[d] = { day: d, count: 0 })

            ;[...tasks, ...events].forEach((item: any) => {
                const date = item.deadline || item.date
                if (!date) return
                const day = days[new Date(date).getDay()]
                result[day].count++
            })

        return Object.values(result)

    }, [tasks, events])

    return (

        <DashboardShell navItems={navItems} role="Student" title="Dashboard">

            {/* STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Calendar} title="Today's Tasks" value={String(todayEvents.length)} />
                <StatCard icon={CheckCircle2} title="Completed Tasks" value={String(completed)} />
                <StatCard icon={Clock} title="In Progress" value={String(progress)} />
                <StatCard icon={FileText} title="Pending Tasks" value={String(todo)} />
            </div>

            {/* MAIN */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">

                {/* TODAY EVENTS */}
                <Card title="Today's Schedule" items={todayEvents} type="event" />

                {/* TODAY TASKS */}
                <div className="rounded-xl border bg-card p-6">
                    <h3 className="font-semibold text-lg">Today's Tasks</h3>

                    <div className="mt-4">
                        <Progress value={progressPercent} />
                    </div>

                    <CardList items={todayTasks} type="task" />
                </div>

                {/* ANALYTICS */}
                <div className="rounded-xl border bg-card p-6">
                    <h3 className="font-semibold text-lg">Weekly Activity</h3>

                    <div className="h-64 mt-4">
                        <ResponsiveContainer>
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="hsl(var(--primary))" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* UPCOMING EVENTS */}
                <Card title="Upcoming Events" items={upcomingEvents} type="event" />

            </div>
        </DashboardShell>
    )
}

/* ================= REUSABLE UI ================= */

function Card({ title, items, type }: any) {
    return (
        <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold text-lg">{title}</h3>
            <CardList items={items} type={type} />
        </div>
    )
}

function CardList({ items, type }: any) {

    return (
        <div className={`mt-4 flex flex-col gap-3 pr-2 ${items.length > 3 ? "max-h-60 overflow-y-auto scrollbar-thin" : ""}`}>

            {items.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">
                    No data available
                </p>
            )}

            {items.map((item: any) => (
                <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 hover:bg-muted transition-all duration-200 hover:scale-[1.01]"
                >

                    {/* LEFT */}
                    {type === "event" ? (
                        <span className="w-14 text-sm font-semibold text-primary">
                            {item.time}
                        </span>
                    ) : (
                        <div className={`h-2 w-2 rounded-full ${item.status === "Completed"
                                ? "bg-green-500"
                                : item.status === "In Progress"
                                    ? "bg-blue-500"
                                    : "bg-gray-400"
                            }`} />
                    )}

                    {/* CENTER */}
                    <div className="flex-1">
                        <p className="text-sm font-medium">
                            {item.title}
                        </p>
                        {type === "event" && (
                            <p className="text-xs text-muted-foreground">
                                {item.date}
                            </p>
                        )}
                    </div>

                    {/* RIGHT */}
                    <Badge
                        variant="outline"
                        className={
                            item.priority === "High"
                                ? "text-red-600 border-red-300"
                                : item.priority === "Medium"
                                    ? "text-yellow-600 border-yellow-300"
                                    : "text-green-600 border-green-300"
                        }
                    >
                        {item.priority}
                    </Badge>

                </div>
            ))}

        </div>
    )
}