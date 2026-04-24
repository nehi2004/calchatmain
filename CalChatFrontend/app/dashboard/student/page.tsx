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

//const TASK_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks"
//const EVENT_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/CalendarEvents"

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

//const TASK_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks"
//const EVENT_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/CalendarEvents"

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

//const TASK_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks"
//const EVENT_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/CalendarEvents"
//const CUSTOM_EVENT_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/Events"

///* ================= UTIL ================= */

//function formatDate(date: Date) {
//    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
//        date.getDate()
//    ).padStart(2, "0")}`
//}

//export default function StudentDashboard() {

//    const [tasks, setTasks] = useState<Task[]>([])
//    const [events, setEvents] = useState<EventType[]>([])
//    const [customEvents, setCustomEvents] = useState<any[]>([])

//    const today = formatDate(new Date())

//    useEffect(() => {
//        fetchTasks()
//        fetchEvents()
//        fetchCustomEvents()
//    }, [])


//    useEffect(() => {

//        const handleEventUpdate = () => {
//            fetchCustomEvents()
//        }

//        window.addEventListener("event-added", handleEventUpdate)

//        return () => {
//            window.removeEventListener("event-added", handleEventUpdate)
//        }

//    }, [])

//    async function fetchTasks() {
//        const token = localStorage.getItem("token")

//        const res = await fetch(TASK_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        setTasks(data.map((t: any) => ({
//            ...t,
//            deadline: t.deadline?.split("T")[0]
//        })))
//    }

//    async function fetchEvents() {
//        const token = localStorage.getItem("token")

//        const res = await fetch(EVENT_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        setEvents(data.map((e: any) => ({
//            ...e,
//            date: e.date.split("T")[0]
//        })))
//    }

//    async function fetchCustomEvents() {
//        const token = localStorage.getItem("token")

//        const res = await fetch(CUSTOM_EVENT_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()
//        setCustomEvents(
//            data.map((e: any) => {

//                // 🔥 SMART PRIORITY L

//                //if (e.status === "Upcoming") priority = "High"
//                //else if (e.type?.toLowerCase().includes("exam")) priority = "High"
//                //else if (e.type?.toLowerCase().includes("meeting")) priority = "Medium"
//                //else if (e.type?.toLowerCase().includes("study")) priority = "Low"

//                return {
//                    id: e.id,
//                    title: e.title,
//                    date: e.date?.split("T")[0],
//                    time: e.time || "",
//                    type: e.type || "General",        // ✅ ADD THIS
//                    location: e.location || "",       // ✅ ADD THIS (optional)
//                }
//            })
//        )
//    }
//    const allEvents = useMemo(() => {
//        return [...events, ...customEvents]
//    }, [events, customEvents])
//    /* ================= STATS ================= */

//    const completed = tasks.filter(t => t.status === "Completed").length
//    const todo = tasks.filter(t => t.status === "Todo").length
//    const progress = tasks.filter(t => t.status === "In Progress").length

//    const progressPercent =
//        tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

//    /* ================= FILTERS ================= */

//    const todayEvents = useMemo(() =>
//        allEvents.filter(e => e.date === today)
//        , [allEvents, today])

//    const todayTasks = useMemo(() =>
//        tasks.filter(t => t.deadline === today)
//        , [tasks, today])

//    const upcomingEvents = useMemo(() =>
//        allEvents
//            .filter(e => e.date > today)
//            .sort((a, b) => a.date.localeCompare(b.date))
//            .slice(0, 5)
//        , [allEvents, today])

//    /* ================= ANALYTICS ================= */

//    const weeklyData = useMemo(() => {

//        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
//        const result: any = {}

//        days.forEach(d => result[d] = { day: d, count: 0 })

//            ;[...tasks, ...events].forEach((item: any) => {
//                const date = item.deadline || item.date
//                if (!date) return
//                const day = days[new Date(date).getDay()]
//                result[day].count++
//            })

//        return Object.values(result)

//    }, [tasks, events])

//    return (

//        <DashboardShell navItems={navItems} role="Student" title="Dashboard">

//            {/* STATS */}
//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                <StatCard icon={Calendar} title="Today's Tasks" value={String(todayEvents.length)} />
//                <StatCard icon={CheckCircle2} title="Completed Tasks" value={String(completed)} />
//                <StatCard icon={Clock} title="In Progress" value={String(progress)} />
//                <StatCard icon={FileText} title="Pending Tasks" value={String(todo)} />
//            </div>

//            {/* MAIN */}
//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* TODAY EVENTS */}
//                <Card title="Today's Schedule" items={todayEvents} type="event" />

//                {/* TODAY TASKS */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="font-semibold text-lg">Today's Tasks</h3>

//                    <div className="mt-4">
//                        <Progress value={progressPercent} />
//                    </div>

//                    <CardList items={todayTasks} type="task" />
//                </div>

//                {/* ANALYTICS */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="font-semibold text-lg">Weekly Activity</h3>

//                    <div className="h-64 mt-4">
//                        <ResponsiveContainer>
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
//                <Card
//                    title="Upcoming Events"
//                    items={upcomingEvents}
//                    type="event"
//                    hidePriority={true}   // ✅ ADD THIS
//                />

//            </div>
//        </DashboardShell>
//    )
//}

///* ================= REUSABLE UI ================= */

//function Card({ title, items, type, hidePriority }: any) {
//    return (
//        <div className="rounded-xl border bg-card p-6">
//            <h3 className="font-semibold text-lg">{title}</h3>
//            <CardList items={items} type={type} hidePriority={hidePriority} />
//        </div>
//    )
//}

//function CardList({ items, type, hidePriority }: any) {

//    return (
//        <div className={`mt-4 flex flex-col gap-3 pr-2 ${items.length > 3 ? "max-h-60 overflow-y-auto scrollbar-thin" : ""}`}>

//            {items.length === 0 && (
//                <p className="text-sm text-muted-foreground text-center py-6">
//                    No data available
//                </p>
//            )}

//            {items.map((item: any) => (
//                <div
//                    key={item.id}
//                    className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 hover:bg-muted transition-all duration-200 hover:scale-[1.01]"
//                >

//                    {/* LEFT */}
//                    {type === "event" ? (
//                        <span className="w-14 text-sm font-semibold text-primary">
//                            {item.time}
//                        </span>
//                    ) : (
//                        <div className={`h-2 w-2 rounded-full ${item.status === "Completed"
//                                ? "bg-green-500"
//                                : item.status === "In Progress"
//                                    ? "bg-blue-500"
//                                    : "bg-gray-400"
//                            }`} />
//                    )}

//                    {/* CENTER */}
//                    <div className="flex-1">
//                        <p className="text-sm font-medium">
//                            {item.title}
//                        </p>
//                        {type === "event" && (
//                            <>
//                                <p className="text-xs text-muted-foreground">
//                                    {item.date}
//                                </p>
//                                <p className="text-xs text-purple-500">
//                                    {item.type || "General"}
//                                </p>
//                            </>
//                        )}
//                    </div>

//                    {/* RIGHT */}
//                    {/* RIGHT */}
//                    {!hidePriority ? (
//                        <Badge
//                            variant="outline"
//                            className={
//                                item.priority === "High"
//                                    ? "text-red-600 border-red-300"
//                                    : item.priority === "Medium"
//                                        ? "text-yellow-600 border-yellow-300"
//                                        : "text-green-600 border-green-300"
//                            }
//                        >
//                            {item.priority}
//                        </Badge>
//                    ) : (
//                        <span className="text-xs text-blue-500 font-medium">
//                            {item.location || item.type}
//                        </span>
//                    )}

//                </div>
//            ))}

//        </div>
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
    FileText,
    RefreshCw,
    AlertTriangle,
    Inbox,
    Sparkles,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts"

type Task = {
    id: string
    title: string
    status: "Todo" | "In Progress" | "Completed"
    priority: "Low" | "Medium" | "High"
    deadline?: string
    description?: string
}

type EventType = {
    id: string
    title: string
    date: string
    time: string
    priority?: "Low" | "Medium" | "High"
    type?: string
    location?: string
    source?: "calendar" | "custom"
}

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

const TASK_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks"
const EVENT_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/CalendarEvents"
const CUSTOM_EVENT_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/Events"
const PANEL_HEIGHT = "h-[360px]"

function formatDate(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
    ).padStart(2, "0")}`
}

function formatPrettyDate(value?: string) {
    if (!value) return "No date"
    return new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

function isOverdue(deadline?: string, status?: string) {
    if (!deadline || status === "Completed") return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(deadline)
    due.setHours(0, 0, 0, 0)
    return due.getTime() < today.getTime()
}

function getTaskPriorityClasses(priority?: string) {
    switch (priority) {
        case "High":
            return "border-red-300 bg-red-50 text-red-600"
        case "Medium":
            return "border-yellow-300 bg-yellow-50 text-yellow-700"
        default:
            return "border-green-300 bg-green-50 text-green-700"
    }
}

function getEventAccent(event: EventType) {
    if (event.location) return event.location
    if (event.type) return event.type
    return event.source === "custom" ? "Custom" : "Calendar"
}

function StudentDashboardPanel({
    title,
    subtitle,
    children,
    className = "",
}: {
    title: string
    subtitle?: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <div
            className={`flex ${PANEL_HEIGHT} min-h-0 flex-col rounded-3xl border border-border/60 bg-card/95 p-6 shadow-sm transition hover:shadow-md ${className}`}
        >
            <div className="mb-4">
                <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="min-h-0 flex-1">{children}</div>
        </div>
    )
}

function StudentCardList({
    items,
    type,
    hidePriority,
}: {
    items: any[]
    type: "event" | "task"
    hidePriority?: boolean
}) {
    return (
        <div className="flex h-full flex-col gap-3 overflow-y-auto pr-1">
            {items.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed text-center">
                    <Inbox className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No data available</p>
                </div>
            )}

            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-transparent bg-muted/40 p-4 transition-all duration-200 hover:border-border hover:bg-muted/60"
                >
                    {type === "event" ? (
                        <div className="w-16 shrink-0 rounded-xl bg-primary/10 px-2 py-2 text-center text-sm font-semibold text-primary">
                            {item.time || "--:--"}
                        </div>
                    ) : (
                        <div
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.status === "Completed"
                                    ? "bg-green-500"
                                    : item.status === "In Progress"
                                        ? "bg-blue-500"
                                        : "bg-gray-400"
                                }`}
                        />
                    )}

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.title}</p>

                        {type === "event" ? (
                            <>
                                <p className="text-xs text-muted-foreground">{formatPrettyDate(item.date)}</p>
                                <p className="text-xs text-violet-600">{item.type || "General"}</p>
                            </>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                {item.deadline ? formatPrettyDate(item.deadline) : "No deadline"}
                            </p>
                        )}
                    </div>

                    {!hidePriority && type === "task" ? (
                        <Badge variant="outline" className={getTaskPriorityClasses(item.priority)}>
                            {item.priority}
                        </Badge>
                    ) : (
                        <span className="max-w-[110px] truncate text-xs font-medium text-blue-600">
                            {getEventAccent(item)}
                        </span>
                    )}
                </div>
            ))}
        </div>
    )
}

export default function StudentDashboard() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [events, setEvents] = useState<EventType[]>([])
    const [customEvents, setCustomEvents] = useState<EventType[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState("")

    const today = formatDate(new Date())

    useEffect(() => {
        fetchAll()
    }, [])

    useEffect(() => {
        const handleEventUpdate = () => {
            fetchCustomEvents(true)
        }

        window.addEventListener("event-added", handleEventUpdate)
        return () => window.removeEventListener("event-added", handleEventUpdate)
    }, [])

    function getHeaders() {
        const token = localStorage.getItem("token")
        return {
            Authorization: `Bearer ${token}`,
        }
    }

    async function fetchJson(url: string) {
        const res = await fetch(url, { headers: getHeaders() })
        if (!res.ok) throw new Error(`Failed to fetch ${url}`)
        return res.json()
    }

    async function fetchAll(isRefresh = false) {
        try {
            if (isRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            setError("")

            const [taskData, eventData, customEventData] = await Promise.all([
                fetchJson(TASK_API),
                fetchJson(EVENT_API),
                fetchJson(CUSTOM_EVENT_API),
            ])

            const normalizedTasks: Task[] = (Array.isArray(taskData) ? taskData : []).map((t: any) => ({
                id: t.id,
                title: t.title,
                status: t.status,
                priority: t.priority || "Low",
                deadline: t.deadline?.split("T")[0],
                description: t.description || "",
            }))

            const normalizedEvents: EventType[] = (Array.isArray(eventData) ? eventData : []).map((e: any) => ({
                id: e.id,
                title: e.title,
                date: e.date?.split("T")[0],
                time: e.time || "",
                priority: e.priority || "Medium",
                type: e.type || "Calendar",
                location: e.location || "",
                source: "calendar",
            }))

            const normalizedCustomEvents: EventType[] = (Array.isArray(customEventData) ? customEventData : []).map((e: any) => ({
                id: e.id,
                title: e.title,
                date: e.date?.split("T")[0],
                time: e.time || "",
                priority: e.priority || "Medium",
                type: e.type || "General",
                location: e.location || "",
                source: "custom",
            }))

            setTasks(normalizedTasks)
            setEvents(normalizedEvents)
            setCustomEvents(normalizedCustomEvents)
        } catch (err) {
            console.error("Student dashboard error:", err)
            setError("Unable to load dashboard data right now.")
            setTasks([])
            setEvents([])
            setCustomEvents([])
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    async function fetchCustomEvents(isRefresh = false) {
        try {
            if (isRefresh) setRefreshing(true)

            const data = await fetchJson(CUSTOM_EVENT_API)

            const normalizedCustomEvents: EventType[] = (Array.isArray(data) ? data : []).map((e: any) => ({
                id: e.id,
                title: e.title,
                date: e.date?.split("T")[0],
                time: e.time || "",
                priority: e.priority || "Medium",
                type: e.type || "General",
                location: e.location || "",
                source: "custom",
            }))

            setCustomEvents(normalizedCustomEvents)
        } catch (err) {
            console.error("fetchCustomEvents error:", err)
        } finally {
            setRefreshing(false)
        }
    }

    const allEvents = useMemo(() => [...events, ...customEvents], [events, customEvents])

    const completed = tasks.filter((t) => t.status === "Completed").length
    const todo = tasks.filter((t) => t.status === "Todo").length
    const progress = tasks.filter((t) => t.status === "In Progress").length
    const overdueTasks = tasks.filter((t) => isOverdue(t.deadline, t.status)).length

    const progressPercent = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

    const todayEvents = useMemo(() => allEvents.filter((e) => e.date === today), [allEvents, today])
    const todayTasks = useMemo(() => tasks.filter((t) => t.deadline === today), [tasks, today])

    const upcomingEvents = useMemo(() => {
        return allEvents
            .filter((e) => e.date > today)
            .sort((a, b) => {
                const dateDiff = a.date.localeCompare(b.date)
                if (dateDiff !== 0) return dateDiff
                return (a.time || "").localeCompare(b.time || "")
            })
            .slice(0, 6)
    }, [allEvents, today])

    const weeklyData = useMemo(() => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const result: Record<string, { day: string; count: number }> = {}

        days.forEach((d) => {
            result[d] = { day: d, count: 0 }
        })

            ;[...tasks, ...allEvents].forEach((item: any) => {
                const rawDate = item.deadline || item.date
                if (!rawDate) return
                const day = days[new Date(rawDate).getDay()]
                result[day].count++
            })

        return Object.values(result)
    }, [tasks, allEvents])

    if (loading) {
        return (
            <DashboardShell navItems={navItems} role="Student" title="Dashboard">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="rounded-3xl border bg-card p-6">
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 w-28 rounded bg-muted" />
                                <div className="h-8 w-20 rounded bg-muted" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-[360px] rounded-3xl border bg-card p-6">
                            <div className="animate-pulse space-y-4">
                                <div className="h-5 w-40 rounded bg-muted" />
                                <div className="h-64 rounded bg-muted" />
                            </div>
                        </div>
                    ))}
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell navItems={navItems} role="Student" title="Dashboard">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                            <Sparkles className="h-3.5 w-3.5" />
                            Student Overview
                        </div>
                        <h2 className="text-3xl font-semibold tracking-tight">Student Dashboard</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Track tasks, events, and weekly academic activity in one place.
                        </p>
                    </div>

                    <Button variant="outline" onClick={() => fetchAll(true)} disabled={refreshing}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard icon={Calendar} title="Today's Events" value={String(todayEvents.length)} />
                    <StatCard icon={CheckCircle2} title="Completed Tasks" value={String(completed)} />
                    <StatCard icon={Clock} title="In Progress" value={String(progress)} />
                    <StatCard icon={AlertTriangle} title="Overdue Tasks" value={String(overdueTasks)} />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-3xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">Today’s Focus</p>
                        <h3 className="mt-1 text-lg font-semibold">{todayTasks.length} tasks due today</h3>
                    </div>

                    <div className="rounded-3xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">Upcoming Plan</p>
                        <h3 className="mt-1 text-lg font-semibold">{upcomingEvents.length} upcoming events</h3>
                    </div>

                    <div className="rounded-3xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">Completion Rate</p>
                        <h3 className="mt-1 text-lg font-semibold">{progressPercent}% completed</h3>
                    </div>
                </div>

                <div className="mt-2 grid gap-6 lg:grid-cols-2">
                    <StudentDashboardPanel
                        title="Today's Schedule"
                        subtitle="Events and planned items scheduled for today"
                    >
                        <StudentCardList items={todayEvents} type="event" />
                    </StudentDashboardPanel>

                    <StudentDashboardPanel
                        title="Today's Tasks"
                        subtitle="Tasks with deadlines due today"
                    >
                        <div className="mb-4 rounded-2xl bg-muted/30 p-4">
                            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                                <span>Overall completion</span>
                                <span>{progressPercent}%</span>
                            </div>
                            <Progress value={progressPercent} />
                        </div>
                        <StudentCardList items={todayTasks} type="task" />
                    </StudentDashboardPanel>

                    <StudentDashboardPanel
                        title="Weekly Activity"
                        subtitle="Combined task and event activity across the week"
                    >
                        <div className="h-full rounded-2xl bg-muted/20 p-3">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </StudentDashboardPanel>

                    <StudentDashboardPanel
                        title="Upcoming Events"
                        subtitle="Your next scheduled calendar and personal events"
                    >
                        <StudentCardList items={upcomingEvents} type="event" hidePriority />
                    </StudentDashboardPanel>
                </div>
            </div>
        </DashboardShell>
    )
}
