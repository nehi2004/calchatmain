//"use client"

//import {
//  LayoutDashboard, Calendar, MessageSquare, CheckCircle2, Focus, BarChart3,
//  Sun, Target, TrendingUp, Bell
//} from "lucide-react"
//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Progress } from "@/components/ui/progress"
//import { Badge } from "@/components/ui/badge"
//import {
//  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//} from "recharts"

//const navItems = [
//  { label: "Dashboard", href: "/dashboard/personal", icon: LayoutDashboard },
//  { label: "Calendar", href: "/dashboard/personal/calendar", icon: Calendar },
//  { label: "AI Chat", href: "/dashboard/personal/chat", icon: MessageSquare },
//  { label: "Tasks", href: "/dashboard/personal/tasks", icon: CheckCircle2 },
//  { label: "Focus Mode", href: "/dashboard/personal/focus", icon: Focus },
//  { label: "Analytics", href: "/dashboard/personal/analytics", icon: BarChart3 },
//]

//const dailyPlan = [
//  { time: "06:30", title: "Morning Exercise", category: "Health" },
//  { time: "08:00", title: "Breakfast & Journal", category: "Wellness" },
//  { time: "10:00", title: "Grocery Shopping", category: "Errand" },
//  { time: "14:00", title: "Read 30 pages", category: "Learning" },
//  { time: "17:00", title: "Cook Dinner", category: "Health" },
//]

//const habits = [
//  { name: "Meditation", streak: 14, completed: true },
//  { name: "Exercise", streak: 7, completed: true },
//  { name: "Reading", streak: 21, completed: false },
//  { name: "Journaling", streak: 10, completed: false },
//  { name: "Hydration", streak: 30, completed: true },
//]

//const productivityData = [
//  { day: "Mon", score: 72 },
//  { day: "Tue", score: 85 },
//  { day: "Wed", score: 68 },
//  { day: "Thu", score: 91 },
//  { day: "Fri", score: 79 },
//  { day: "Sat", score: 55 },
//  { day: "Sun", score: 60 },
//]

//const reminders = [
//  { title: "Dentist Appointment", date: "Feb 11, 2:00 PM", priority: "High" },
//  { title: "Pay Electricity Bill", date: "Feb 14", priority: "Medium" },
//  { title: "Call Mom", date: "Feb 10, 6:00 PM", priority: "Low" },
//  { title: "Renew Gym Membership", date: "Feb 16", priority: "Medium" },
//]

//export default function PersonalDashboard() {
//  return (
//    <DashboardShell navItems={navItems} role="Personal" title="Dashboard">
//      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//        <StatCard icon={Sun} title="Daily Tasks" value="6/9" description="On track" trend="+2 ahead" />
//        <StatCard icon={Target} title="Habits Streak" value="14 days" description="Longest: 30 days" />
//        <StatCard icon={TrendingUp} title="Productivity Score" value="82%" trend="+5% vs last week" />
//        <StatCard icon={Bell} title="Reminders" value="4" description="2 today" />
//      </div>

//      <div className="mt-6 grid gap-6 lg:grid-cols-2">
//        {/* Daily Planner */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Daily Planner</h3>
//          <div className="mt-4 flex flex-col gap-3">
//            {dailyPlan.map((item) => (
//              <div key={item.time} className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
//                <span className="w-14 text-sm font-medium text-primary">{item.time}</span>
//                <div className="flex-1">
//                  <p className="text-sm font-medium text-card-foreground">{item.title}</p>
//                </div>
//                <Badge variant="secondary">{item.category}</Badge>
//              </div>
//            ))}
//          </div>
//        </div>

//        {/* Habit Tracker */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Habit Tracker</h3>
//          <div className="mt-4 flex flex-col gap-3">
//            {habits.map((habit) => (
//              <div key={habit.name} className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
//                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${habit.completed ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
//                  <CheckCircle2 className="h-4 w-4" />
//                </div>
//                <div className="flex-1">
//                  <p className="text-sm font-medium text-card-foreground">{habit.name}</p>
//                  <p className="text-xs text-muted-foreground">{habit.streak} day streak</p>
//                </div>
//                <Badge variant={habit.completed ? "default" : "secondary"}>
//                  {habit.completed ? "Done" : "Pending"}
//                </Badge>
//              </div>
//            ))}
//          </div>
//        </div>

//        {/* Productivity Score */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Productivity Score</h3>
//          <div className="mt-4 h-64">
//            <ResponsiveContainer width="100%" height="100%">
//              <LineChart data={productivityData}>
//                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
//                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
//                <Tooltip
//                  contentStyle={{
//                    backgroundColor: 'hsl(var(--card))',
//                    border: '1px solid hsl(var(--border))',
//                    borderRadius: '8px',
//                    color: 'hsl(var(--card-foreground))',
//                  }}
//                />
//                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
//              </LineChart>
//            </ResponsiveContainer>
//          </div>
//        </div>

//        {/* Upcoming Reminders */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Upcoming Reminders</h3>
//          <div className="mt-4 flex flex-col gap-3">
//            {reminders.map((reminder) => (
//              <div key={reminder.title} className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
//                <div className="flex-1">
//                  <p className="text-sm font-medium text-card-foreground">{reminder.title}</p>
//                  <p className="text-xs text-muted-foreground">{reminder.date}</p>
//                </div>
//                <Badge variant={reminder.priority === "High" ? "destructive" : "secondary"}>
//                  {reminder.priority}
//                </Badge>
//              </div>
//            ))}
//          </div>
//        </div>
//      </div>
//    </DashboardShell>
//  )
//}















//"use client"

//import { useEffect, useState } from "react"
//import {
//    LayoutDashboard,
//    Calendar,
//    MessageSquare,
//    CheckCircle2,
//    Focus,
//    BarChart3,
//    TrendingUp,
//    Bell,
//    CalendarDays
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Progress } from "@/components/ui/progress"
//import { Badge } from "@/components/ui/badge"


//import {
//    LineChart,
//    Line,
//    XAxis,
//    YAxis,
//    CartesianGrid,
//    Tooltip,
//    ResponsiveContainer
//} from "recharts"

//type Task = {
//    id: string
//    title: string
//    status: "Todo" | "In Progress" | "Completed"
//    priority: "High" | "Medium" | "Low"
//    deadline?: string
//}

//type CalendarEvent = {
//    id: string
//    title: string
//    date: string
//    time: string
//    priority: string
//}

//type EventItem = {
//    id: string
//    title: string
//    date: string
//    time: string
//    location: string
//}

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/personal", icon: LayoutDashboard },
//    { label: "Calendar", href: "/dashboard/personal/calendar", icon: Calendar },
//    { label: "AI Chat", href: "/dashboard/personal/chat", icon: MessageSquare },
//    { label: "Tasks", href: "/dashboard/personal/tasks", icon: CheckCircle2 },
//    { label: "Focus Mode", href: "/dashboard/personal/focus", icon: Focus },
//    { label: "Analytics", href: "/dashboard/personal/analytics", icon: BarChart3 },
//]

//const TASK_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks"
//const CALENDAR_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/CalendarEvents"
//const EVENTS_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/Events"

//function formatDate(date: Date) {
//    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
//        date.getDate()
//    ).padStart(2, "0")}`
//}

//export default function PersonalDashboard() {

//    const [tasks, setTasks] = useState<Task[]>([])
//    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
//    const [events, setEvents] = useState<EventItem[]>([])

//    const today = formatDate(new Date())

//    useEffect(() => {
//        fetchTasks()
//        fetchCalendarEvents()
//        fetchEvents()
//    }, [])

//    async function fetchTasks() {

//        const token = localStorage.getItem("token")

//        const res = await fetch(TASK_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        const formatted = data.map((t: any) => ({
//            ...t,
//            deadline: t.deadline?.split("T")[0]
//        }))

//        setTasks(formatted)
//    }

//    async function fetchCalendarEvents() {

//        const token = localStorage.getItem("token")

//        const res = await fetch(CALENDAR_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        const formatted = data.map((e: any) => ({
//            ...e,
//            date: e.date.split("T")[0]
//        }))

//        setCalendarEvents(formatted)
//    }

//    async function fetchEvents() {

//        const token = localStorage.getItem("token")

//        const res = await fetch(EVENTS_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        const formatted = data.map((e: any) => ({
//            ...e,
//            date: e.date.split("T")[0]
//        }))

//        setEvents(formatted)
//    }

//    /* ================= TASK STATS ================= */

//    const completed = tasks.filter(t => t.status === "Completed").length
//    const todo = tasks.filter(t => t.status === "Todo").length
//    const progress = tasks.filter(t => t.status === "In Progress").length

//    const progressPercent =
//        tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

//    /* ================= TODAY CALENDAR ================= */

//    const todayEvents = calendarEvents
//        .filter(e => e.date === today)
//        .sort((a, b) => a.time.localeCompare(b.time))
//        .slice(0, 4)

//    /* ================= UPCOMING EVENTS ================= */

//    const upcomingEvents = events
//        .sort((a, b) => a.date.localeCompare(b.date))
//        .slice(0, 4)

//    /* ================= PRODUCTIVITY CHART ================= */

//    const productivityData = [
//        { day: "Mon", score: 70 },
//        { day: "Tue", score: 82 },
//        { day: "Wed", score: 65 },
//        { day: "Thu", score: 91 },
//        { day: "Fri", score: 78 },
//        { day: "Sat", score: 55 },
//        { day: "Sun", score: 60 }
//    ]

//    return (

//        <DashboardShell navItems={navItems} role="Personal" title="Dashboard">

//            {/* TOP STATS */}

//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

//                <StatCard
//                    icon={CalendarDays}
//                    title="Today's Tasks"
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
//                    icon={TrendingUp}
//                    title="Productivity"
//                    value={`${progressPercent}%`}
//                    description="Weekly efficiency"
//                />

//                <StatCard
//                    icon={Bell}
//                    title="Upcoming Tasks"
//                    value={upcomingEvents.length.toString()}
//                    description="Next reminders"
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

//                {/* PRODUCTIVITY CHART */}

//                <div className="rounded-xl border bg-card p-6">

//                    <h3 className="font-semibold text-lg">
//                        Weekly Productivity
//                    </h3>

//                    <div className="mt-4 h-64">

//                        <ResponsiveContainer width="100%" height="100%">

//                            <LineChart data={productivityData}>

//                                <CartesianGrid strokeDasharray="3 3" />

//                                <XAxis dataKey="day" />

//                                <YAxis />

//                                <Tooltip />

//                                <Line
//                                    type="monotone"
//                                    dataKey="score"
//                                    stroke="hsl(var(--primary))"
//                                    strokeWidth={2}
//                                />

//                            </LineChart>

//                        </ResponsiveContainer>

//                    </div>

//                </div>

//                {/* UPCOMING EVENTS */}

//                <div className="rounded-xl border bg-card p-6">

//                    <h3 className="font-semibold text-lg">
//                        Upcoming Events
//                    </h3>

//                    <div className="mt-4 flex flex-col gap-3">

//                        {upcomingEvents.map((event) => (

//                            <div
//                                key={event.id}
//                                className="flex items-center gap-4 rounded-lg bg-muted/50 p-3"
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
//                                    {event.location}
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

//import { useEffect, useState } from "react"
//import {
//    LayoutDashboard,
//    Calendar,
//    MessageSquare,
//    CheckCircle2,
//    Focus,
//    BarChart3,
//    TrendingUp,
//    Bell,
//    CalendarDays
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Progress } from "@/components/ui/progress"
//import { Badge } from "@/components/ui/badge"

//import {
//    LineChart,
//    Line,
//    XAxis,
//    YAxis,
//    CartesianGrid,
//    Tooltip,
//    ResponsiveContainer
//} from "recharts"

//type Task = {
//    id: string
//    title: string
//    status: "Todo" | "In Progress" | "Completed"
//    priority: "High" | "Medium" | "Low"
//    deadline?: string
//}

//type CalendarEvent = {
//    id: string
//    title: string
//    date: string
//    time: string
//    priority: string
//}

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/personal", icon: LayoutDashboard },
//    { label: "Calendar", href: "/dashboard/personal/calendar", icon: Calendar },
//    { label: "AI Chat", href: "/dashboard/personal/chat", icon: MessageSquare },
//    { label: "Tasks", href: "/dashboard/personal/tasks", icon: CheckCircle2 },
//    { label: "Focus Mode", href: "/dashboard/personal/focus", icon: Focus },
//    { label: "Analytics", href: "/dashboard/personal/analytics", icon: BarChart3 },
//]

//const TASK_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks"
//const CALENDAR_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/CalendarEvents"

//function formatDate(date: Date) {
//    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
//        date.getDate()
//    ).padStart(2, "0")}`
//}

//export default function PersonalDashboard() {

//    const [tasks, setTasks] = useState<Task[]>([])
//    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])

//    const today = formatDate(new Date())

//    useEffect(() => {
//        fetchTasks()
//        fetchCalendarEvents()
//    }, [])

//    async function fetchTasks() {
//        const token = localStorage.getItem("token")

//        const res = await fetch(TASK_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        const formatted = data.map((t: any) => ({
//            ...t,
//            deadline: t.deadline?.split("T")[0]
//        }))

//        setTasks(formatted)
//    }

//    async function fetchCalendarEvents() {
//        const token = localStorage.getItem("token")

//        const res = await fetch(CALENDAR_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        const formatted = data.map((e: any) => ({
//            ...e,
//            date: e.date.split("T")[0]
//        }))

//        setCalendarEvents(formatted)
//    }

//    /* ================= TASK STATS ================= */

//    const completed = tasks.filter(t => t.status === "Completed").length
//    const todo = tasks.filter(t => t.status === "Todo").length
//    const progress = tasks.filter(t => t.status === "In Progress").length

//    const progressPercent =
//        tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

//    /* ================= TODAY CALENDAR ================= */

//    const todayEvents = calendarEvents
//        .filter(e => e.date === today)
//        .sort((a, b) => a.time.localeCompare(b.time))
//        .slice(0, 4)

//    /* ================= 🔥 UPCOMING TASKS ================= */

//    const upcomingTasks = tasks
//        .filter(t => t.status !== "Completed" && t.deadline)
//        .sort((a, b) => (a.deadline || "").localeCompare(b.deadline || ""))
//        .slice(0, 4)

//    /* ================= PRODUCTIVITY CHART ================= */

//    const productivityData = [
//        { day: "Mon", score: 70 },
//        { day: "Tue", score: 82 },
//        { day: "Wed", score: 65 },
//        { day: "Thu", score: 91 },
//        { day: "Fri", score: 78 },
//        { day: "Sat", score: 55 },
//        { day: "Sun", score: 60 }
//    ]

//    return (

//        <DashboardShell navItems={navItems} role="Personal" title="Dashboard">

//            {/* TOP STATS */}

//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

//                <StatCard
//                    icon={CalendarDays}
//                    title="Today's Tasks"
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
//                    icon={TrendingUp}
//                    title="Productivity"
//                    value={`${progressPercent}%`}
//                    description="Weekly efficiency"
//                />

//                <StatCard
//                    icon={Bell}
//                    title="Upcoming Tasks"
//                    value={upcomingTasks.length.toString()}
//                    description="Pending deadlines"
//                />

//            </div>

//            {/* MAIN GRID */}

//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* TODAY SCHEDULE */}

//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="font-semibold text-lg">Today's Schedule</h3>

//                    {/* 🔥 SCROLL ENABLE */}
//                    <div className="mt-4 flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-2 custom-scroll">

//                        {todayEvents.length === 0 && (
//                            <p className="text-sm text-muted-foreground">
//                                No events today
//                            </p>
//                        )}

//                        {todayEvents.map((e) => (
//                            <div
//                                key={e.id}
//                                className="flex items-center gap-4 rounded-lg bg-muted/50 p-3 hover:shadow-md transition"
//                            >

//                                <span className="w-14 text-sm font-medium text-primary">
//                                    {e.time}
//                                </span>

//                                <div className="flex-1">
//                                    <p className="text-sm font-medium">{e.title}</p>
//                                </div>

//                                <Badge variant="secondary">{e.priority}</Badge>

//                            </div>
//                        ))}

//                    </div>
//                </div>

//                {/* TASK PROGRESS */}

//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="font-semibold text-lg">Task Progress</h3>

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

//                {/* PRODUCTIVITY */}

//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="font-semibold text-lg">Weekly Productivity</h3>

//                    <div className="mt-4 h-64">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <LineChart data={productivityData}>
//                                <CartesianGrid strokeDasharray="3 3" />
//                                <XAxis dataKey="day" />
//                                <YAxis />
//                                <Tooltip />
//                                <Line
//                                    type="monotone"
//                                    dataKey="score"
//                                    stroke="hsl(var(--primary))"
//                                    strokeWidth={2}
//                                />
//                            </LineChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>

//                {/* 🔥 UPCOMING TASKS CARD */}

//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="font-semibold text-lg">Upcoming Tasks</h3>

//                    <div className="mt-4 flex flex-col gap-3">

//                        {upcomingTasks.length === 0 && (
//                            <p className="text-sm text-muted-foreground">
//                                No upcoming tasks
//                            </p>
//                        )}

//                        {upcomingTasks.map((task) => (

//                            <div
//                                key={task.id}
//                                className="flex items-center gap-4 rounded-lg bg-muted/50 p-3 hover:shadow-md transition"
//                            >

//                                <div className="flex-1">
//                                    <p className="text-sm font-medium">
//                                        {task.title}
//                                    </p>

//                                    <p className="text-xs text-muted-foreground">
//                                        {task.deadline}
//                                    </p>
//                                </div>

//                                {/* 🔥 PRIORITY BADGE */}
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

//            </div>

//        </DashboardShell>
//    )
//}




//"use client"

//import { useEffect, useState } from "react"
//import {
//    LayoutDashboard,
//    Calendar,
//    MessageSquare,
//    CheckCircle2,
//    Focus,
//    BarChart3,
//    TrendingUp,
//    Bell,
//    CalendarDays
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Progress } from "@/components/ui/progress"
//import { Badge } from "@/components/ui/badge"

//import {
//    LineChart,
//    Line,
//    XAxis,
//    YAxis,
//    CartesianGrid,
//    Tooltip,
//    ResponsiveContainer
//} from "recharts"

//type Task = {
//    id: string
//    title: string
//    status: "Todo" | "In Progress" | "Completed"
//    priority: "High" | "Medium" | "Low"
//    deadline?: string
//}

//type CalendarEvent = {
//    id: string
//    title: string
//    date: string
//    time: string
//    priority: string
//}

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/personal", icon: LayoutDashboard },
//    { label: "Calendar", href: "/dashboard/personal/calendar", icon: Calendar },
//    { label: "AI Chat", href: "/dashboard/personal/chat", icon: MessageSquare },
//    { label: "Tasks", href: "/dashboard/personal/tasks", icon: CheckCircle2 },
//    { label: "Focus Mode", href: "/dashboard/personal/focus", icon: Focus },
//    { label: "Analytics", href: "/dashboard/personal/analytics", icon: BarChart3 },
//]

//const TASK_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks"
//const CALENDAR_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/CalendarEvents"

//function formatDate(date: Date) {
//    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
//        date.getDate()
//    ).padStart(2, "0")}`
//}

//export default function PersonalDashboard() {

//    const [tasks, setTasks] = useState<Task[]>([])
//    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])

//    const today = formatDate(new Date())

//    useEffect(() => {
//        fetchTasks()
//        fetchCalendarEvents()
//    }, [])

//    async function fetchTasks() {
//        const token = localStorage.getItem("token")

//        const res = await fetch(TASK_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        setTasks(
//            data.map((t: any) => ({
//                ...t,
//                deadline: t.deadline?.split("T")[0]
//            }))
//        )
//    }

//    async function fetchCalendarEvents() {
//        const token = localStorage.getItem("token")

//        const res = await fetch(CALENDAR_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        setCalendarEvents(
//            data.map((e: any) => ({
//                ...e,
//                date: e.date.split("T")[0]
//            }))
//        )
//    }

//    /* ================= STATS ================= */

//    const completed = tasks.filter(t => t.status === "Completed").length
//    const todo = tasks.filter(t => t.status === "Todo").length
//    const progress = tasks.filter(t => t.status === "In Progress").length

//    const progressPercent =
//        tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

//    /* ================= TODAY ================= */

//    const todayEvents = calendarEvents
//        .filter(e => e.date === today)
//        .sort((a, b) => a.time.localeCompare(b.time))

//    /* ================= UPCOMING ================= */

//    const upcomingTasks = tasks
//        .filter(t => t.status !== "Completed" && t.deadline)
//        .sort((a, b) => (a.deadline || "").localeCompare(b.deadline || ""))

//    /* ================= PRODUCTIVITY ================= */

//    const productivityData = [
//        { day: "Mon", score: 70 },
//        { day: "Tue", score: 82 },
//        { day: "Wed", score: 65 },
//        { day: "Thu", score: 91 },
//        { day: "Fri", score: 78 },
//        { day: "Sat", score: 55 },
//        { day: "Sun", score: 60 }
//    ]

//    return (
//        <DashboardShell navItems={navItems} role="Personal" title="Dashboard">

//            {/* 🔥 TOP STATS */}
//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

//                <StatCard
//                    icon={CalendarDays}
//                    title="Today's Tasks"
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
//                    icon={TrendingUp}
//                    title="Productivity"
//                    value={`${progressPercent}%`}
//                    description="Weekly efficiency"
//                />

//                <StatCard
//                    icon={Bell}
//                    title="Upcoming Tasks"
//                    value={upcomingTasks.length.toString()}
//                    description="Pending deadlines"
//                />

//            </div>

//            {/* 🔥 MAIN GRID */}
//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* TODAY */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="font-semibold text-lg">Today's Schedule</h3>

//                    <div className="mt-4 flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2">

//                        {todayEvents.length === 0 && (
//                            <p className="text-sm text-muted-foreground">
//                                No events today
//                            </p>
//                        )}

//                        {todayEvents.map(e => (
//                            <div
//                                key={e.id}
//                                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:shadow-md transition"
//                            >
//                                <span className="w-14 text-sm font-medium text-primary">
//                                    {e.time}
//                                </span>

//                                <p className="flex-1 text-sm font-medium">
//                                    {e.title}
//                                </p>

//                                <Badge variant="secondary">{e.priority}</Badge>
//                            </div>
//                        ))}

//                    </div>
//                </div>

//                {/* TASK PROGRESS */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="font-semibold text-lg">Task Progress</h3>

//                    <div className="mt-4">
//                        <Progress value={progressPercent} />

//                        <div className="flex gap-4 text-sm mt-3 text-muted-foreground">
//                            <span>Todo: {todo}</span>
//                            <span>Progress: {progress}</span>
//                            <span>Done: {completed}</span>
//                        </div>
//                    </div>
//                </div>

//                {/* 🔥 PRODUCTIVITY CHART (ADDED) */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="font-semibold text-lg">Weekly Productivity</h3>

//                    <div className="mt-4 h-64">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <LineChart data={productivityData}>
//                                <CartesianGrid strokeDasharray="3 3" />
//                                <XAxis dataKey="day" />
//                                <YAxis />
//                                <Tooltip />
//                                <Line
//                                    type="monotone"
//                                    dataKey="score"
//                                    stroke="hsl(var(--primary))"
//                                    strokeWidth={2}
//                                />
//                            </LineChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>

//                {/* UPCOMING TASKS */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="font-semibold text-lg">Upcoming Tasks</h3>

//                    <div className="mt-4 flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2">

//                        {upcomingTasks.length === 0 && (
//                            <p className="text-sm text-muted-foreground">
//                                No upcoming tasks
//                            </p>
//                        )}

//                        {upcomingTasks.map(task => (
//                            <div
//                                key={task.id}
//                                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:shadow-md transition"
//                            >
//                                <div className="flex-1">
//                                    <p className="text-sm font-medium">{task.title}</p>
//                                    <p className="text-xs text-muted-foreground">{task.deadline}</p>
//                                </div>

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

//            </div>

//        </DashboardShell>
//    )
//}








//"use client"

//import { useEffect, useState } from "react"
//import {
//    LayoutDashboard,
//    Calendar,
//    MessageSquare,
//    CheckCircle2,
//    Focus,
//    BarChart3,
//    TrendingUp,
//    Bell,
//    CalendarDays,
//    Flame,
//    Zap,
//    Leaf
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Progress } from "@/components/ui/progress"
//import { Badge } from "@/components/ui/badge"

//import {
//    LineChart,
//    Line,
//    XAxis,
//    YAxis,
//    CartesianGrid,
//    Tooltip,
//    ResponsiveContainer
//} from "recharts"

//type Task = {
//    id: string
//    title: string
//    status: "Todo" | "In Progress" | "Completed"
//    priority: "High" | "Medium" | "Low"
//    deadline?: string
//}

//type CalendarEvent = {
//    id: string
//    title: string
//    date: string
//    time: string
//    priority: string
//}

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/personal", icon: LayoutDashboard },
//    { label: "Calendar", href: "/dashboard/personal/calendar", icon: Calendar },
//    { label: "AI Chat", href: "/dashboard/personal/chat", icon: MessageSquare },
//    { label: "Tasks", href: "/dashboard/personal/tasks", icon: CheckCircle2 },
//    { label: "Focus Mode", href: "/dashboard/personal/focus", icon: Focus },
//    { label: "Analytics", href: "/dashboard/personal/analytics", icon: BarChart3 },
//]

//const TASK_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks"
//const CALENDAR_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/CalendarEvents"

//function formatDate(date: Date) {
//    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
//        date.getDate()
//    ).padStart(2, "0")}`
//}

//export default function PersonalDashboard() {

//    const [tasks, setTasks] = useState<Task[]>([])
//    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])

//    const today = formatDate(new Date())

//    const todayTasks = tasks.filter(t => t.deadline === today)

//    useEffect(() => {
//        fetchTasks()
//        fetchCalendarEvents()
//    }, [])

//    async function fetchTasks() {
//        const token = localStorage.getItem("token")

//        const res = await fetch(TASK_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        setTasks(
//            data.map((t: any) => ({
//                ...t,
//                deadline: t.deadline?.split("T")[0]
//            }))
//        )
//    }

//    async function fetchCalendarEvents() {
//        const token = localStorage.getItem("token")

//        const res = await fetch(CALENDAR_API, {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        setCalendarEvents(
//            data.map((e: any) => ({
//                ...e,
//                date: e.date.split("T")[0]
//            }))
//        )
//    }

//    /* ================= STATS ================= */

//    const completed = tasks.filter(t => t.status === "Completed").length
//    const todo = tasks.filter(t => t.status === "Todo").length
//    const progress = tasks.filter(t => t.status === "In Progress").length

//    const progressPercent =
//        tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

//    /* ================= TODAY ================= */

//    const todayEvents = calendarEvents
//        .filter(e => e.date === today)
//        .sort((a, b) => a.time.localeCompare(b.time))

//    /* ================= UPCOMING ================= */

//    const upcomingTasks = tasks
//        .filter(t => t.status !== "Completed" && t.deadline)
//        .sort((a, b) => (a.deadline || "").localeCompare(b.deadline || ""))

//    /* ================= PRODUCTIVITY ================= */

//    const productivityData = [
//        { day: "Mon", score: 70 },
//        { day: "Tue", score: 82 },
//        { day: "Wed", score: 65 },
//        { day: "Thu", score: 91 },
//        { day: "Fri", score: 78 },
//        { day: "Sat", score: 55 },
//        { day: "Sun", score: 60 }
//    ]

//    /* 🔥 PRIORITY UI FUNCTION */
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

//    return (
//        <DashboardShell navItems={navItems} role="Personal" title="Dashboard">

//            {/* TOP */}
//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                <StatCard icon={CalendarDays} title="Today's Tasks" value={todayEvents.length.toString()} />
//                <StatCard icon={CheckCircle2} title="Completed Tasks" value={completed.toString()} />
//                <StatCard icon={TrendingUp} title="Productivity" value={`${progressPercent}%`} />
//                <StatCard icon={Bell} title="Upcoming Tasks" value={upcomingTasks.length.toString()} />
//            </div>

//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* TODAY */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="font-semibold text-lg">Today's Schedule</h3>

//                    <div className="mt-4 flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2">
//                        {todayEvents.map(e => (
//                            <div key={e.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:shadow-md transition">
//                                <span className="w-14 text-sm font-medium text-primary">{e.time}</span>
//                                <p className="flex-1 text-sm font-medium">{e.title}</p>
//                                <PriorityBadge priority={e.priority} />
//                            </div>
//                        ))}
//                    </div>
//                </div>

//                {/* PROGRESS */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="font-semibold text-lg">Task Progress</h3>

//                    <div className="mt-4">
//                        <Progress value={progressPercent} />
//                        <div className="flex gap-4 text-sm mt-3 text-muted-foreground">
//                            <span>Todo: {todo}</span>
//                            <span>Progress: {progress}</span>
//                            <span>Done: {completed}</span>
//                        </div>


//                        {/* 🔥 TODAY TASKS LIST */}
//                        <div className="mt-5 flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-2">

//                            {todayTasks.length === 0 && (
//                                <p className="text-sm text-muted-foreground text-center">
//                                    No tasks for today
//                                </p>
//                            )}

//                            {todayTasks.map(task => (
//                                <div
//                                    key={task.id}
//                                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:shadow-md transition"
//                                >

//                                    {/* STATUS DOT */}
//                                    <div className={`h-2 w-2 rounded-full ${task.status === "Completed"
//                                        ? "bg-green-500"
//                                        : task.status === "In Progress"
//                                            ? "bg-blue-500"
//                                            : "bg-gray-400"
//                                        }`} />

//                                    {/* TITLE */}
//                                    <p className="flex-1 text-sm font-medium">
//                                        {task.title}
//                                    </p>

//                                    {/* PRIORITY */}
//                                    <PriorityBadge priority={task.priority} />

//                                </div>
//                            ))}

//                        </div>
//                    </div>
//                </div>


//                {/* PRODUCTIVITY */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="font-semibold text-lg">Weekly Productivity</h3>

//                    <div className="mt-4 h-64">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <LineChart data={productivityData}>
//                                <CartesianGrid strokeDasharray="3 3" />
//                                <XAxis dataKey="day" />
//                                <YAxis />
//                                <Tooltip />
//                                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
//                            </LineChart>
//                        </ResponsiveContainer>
//                    </div>

//                </div>

//                {/* UPCOMING */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="font-semibold text-lg">Upcoming Tasks</h3>

//                    <div className="mt-4 flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2">
//                        {upcomingTasks.map(task => (
//                            <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:shadow-md transition">

//                                <div className="flex-1">
//                                    <p className="text-sm font-medium">{task.title}</p>
//                                    <p className="text-xs text-muted-foreground">{task.deadline}</p>
//                                </div>

//                                <PriorityBadge priority={task.priority} />
//                            </div>
//                        ))}
//                    </div>
//                </div>

//            </div>

//        </DashboardShell>
//    )
//}




"use client"

import { useEffect, useMemo, useState } from "react"
import {
    LayoutDashboard,
    Calendar,
    MessageSquare,
    CheckCircle2,
    Focus,
    BarChart3,
    TrendingUp,
    Bell,
    CalendarDays,
    Flame,
    Zap,
    Leaf,
    RefreshCw,
    AlertTriangle,
    Inbox,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

type Task = {
    id: string
    title: string
    status: "Todo" | "In Progress" | "Completed"
    priority: "High" | "Medium" | "Low"
    deadline?: string
}

type CalendarEvent = {
    id: string
    title: string
    date: string
    time: string
    priority: "High" | "Medium" | "Low"
}

const navItems = [
    { label: "Dashboard", href: "/dashboard/personal", icon: LayoutDashboard },
    { label: "Calendar", href: "/dashboard/personal/calendar", icon: Calendar },
    { label: "AI Chat", href: "/dashboard/personal/chat", icon: MessageSquare },
    { label: "Tasks", href: "/dashboard/personal/tasks", icon: CheckCircle2 },
    { label: "Focus Mode", href: "/dashboard/personal/focus", icon: Focus },
    { label: "Analytics", href: "/dashboard/personal/analytics", icon: BarChart3 },
]

const TASK_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks"
const CALENDAR_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/CalendarEvents"
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

function getPriorityRank(priority?: string) {
    switch (priority) {
        case "High":
            return 0
        case "Medium":
            return 1
        default:
            return 2
    }
}

function PriorityBadge({ priority }: { priority: string }) {
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
            <Badge className="flex items-center gap-1 border border-yellow-300 bg-yellow-500/10 text-yellow-700">
                <Zap className="h-3 w-3" />
                Medium
            </Badge>
        )
    }

    return (
        <Badge className="flex items-center gap-1 border border-green-300 bg-green-500/10 text-green-700">
            <Leaf className="h-3 w-3" />
            Low
        </Badge>
    )
}

function PersonalPanel({
    title,
    subtitle,
    children,
}: {
    title: string
    subtitle?: string
    children: React.ReactNode
}) {
    return (
        <div className={`flex ${PANEL_HEIGHT} min-h-0 flex-col rounded-3xl border bg-card p-6 shadow-sm`}>
            <div className="mb-4">
                <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="min-h-0 flex-1">{children}</div>
        </div>
    )
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed text-center">
            <Inbox className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{text}</p>
        </div>
    )
}

export default function PersonalDashboard() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState("")

    const today = formatDate(new Date())

    useEffect(() => {
        fetchAll()
    }, [])

    function getHeaders() {
        const token = localStorage.getItem("token")
        return {
            Authorization: `Bearer ${token}`,
        }
    }

    async function fetchJson(url: string) {
        const res = await fetch(url, {
            headers: getHeaders(),
        })
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

            const [taskData, calendarData] = await Promise.all([
                fetchJson(TASK_API),
                fetchJson(CALENDAR_API),
            ])

            const normalizedTasks: Task[] = (Array.isArray(taskData) ? taskData : []).map((t: any) => ({
                id: t.id,
                title: t.title,
                status: t.status,
                priority: t.priority || "Low",
                deadline: t.deadline?.split("T")[0],
            }))

            const normalizedEvents: CalendarEvent[] = (Array.isArray(calendarData) ? calendarData : []).map((e: any) => ({
                id: e.id,
                title: e.title,
                date: e.date?.split("T")[0],
                time: e.time || "",
                priority: e.priority || "Low",
            }))

            setTasks(normalizedTasks)
            setCalendarEvents(normalizedEvents)
        } catch (err) {
            console.error("Personal dashboard error:", err)
            setError("Unable to load dashboard data right now.")
            setTasks([])
            setCalendarEvents([])
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const completed = tasks.filter((t) => t.status === "Completed").length
    const todo = tasks.filter((t) => t.status === "Todo").length
    const progress = tasks.filter((t) => t.status === "In Progress").length
    const overdue = tasks.filter((t) => isOverdue(t.deadline, t.status)).length

    const progressPercent = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

    const todayTasks = useMemo(() => {
        return tasks.filter((t) => t.deadline === today)
    }, [tasks, today])

    const todayEvents = useMemo(() => {
        return calendarEvents
            .filter((e) => e.date === today)
            .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
    }, [calendarEvents, today])

    const upcomingTasks = useMemo(() => {
        return tasks
            .filter((t) => t.status !== "Completed" && t.deadline)
            .sort((a, b) => {
                const overdueA = isOverdue(a.deadline, a.status) ? 1 : 0
                const overdueB = isOverdue(b.deadline, b.status) ? 1 : 0
                if (overdueA !== overdueB) return overdueB - overdueA

                const dateDiff = (a.deadline || "").localeCompare(b.deadline || "")
                if (dateDiff !== 0) return dateDiff

                return getPriorityRank(a.priority) - getPriorityRank(b.priority)
            })
            .slice(0, 6)
    }, [tasks])

    const weeklyProductivityData = useMemo(() => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const result: Record<string, { day: string; score: number }> = {}

        days.forEach((day) => {
            result[day] = { day, score: 0 }
        })

        tasks.forEach((task) => {
            if (!task.deadline) return
            const day = days[new Date(task.deadline).getDay()]
            if (task.status === "Completed") result[day].score += 3
            else if (task.status === "In Progress") result[day].score += 2
            else result[day].score += 1
        })

        calendarEvents.forEach((event) => {
            if (!event.date) return
            const day = days[new Date(event.date).getDay()]
            result[day].score += 1
        })

        return Object.values(result)
    }, [tasks, calendarEvents])

    if (loading) {
        return (
            <DashboardShell navItems={navItems} role="Personal" title="Dashboard">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
        <DashboardShell navItems={navItems} role="Personal" title="Dashboard">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight">Personal Dashboard</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage your day with tasks, events, and productivity insights.
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
                    <StatCard icon={CalendarDays} title="Today's Events" value={String(todayEvents.length)} />
                    <StatCard icon={CheckCircle2} title="Completed Tasks" value={String(completed)} />
                    <StatCard icon={TrendingUp} title="Productivity" value={`${progressPercent}%`} />
                    <StatCard icon={Bell} title="Upcoming Tasks" value={String(upcomingTasks.length)} />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-3xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">Today</p>
                        <h3 className="mt-1 text-lg font-semibold">{todayTasks.length} tasks due today</h3>
                    </div>

                    <div className="rounded-3xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">In Progress</p>
                        <h3 className="mt-1 text-lg font-semibold">{progress} tasks in progress</h3>
                    </div>

                    <div className="rounded-3xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">Needs Attention</p>
                        <h3 className="mt-1 text-lg font-semibold">{overdue} overdue tasks</h3>
                    </div>
                </div>

                <div className="mt-2 grid gap-6 lg:grid-cols-2">
                    <PersonalPanel
                        title="Today's Schedule"
                        subtitle="Your calendar events planned for today"
                    >
                        <div className="flex h-full flex-col gap-3 overflow-y-auto pr-1">
                            {todayEvents.length === 0 ? (
                                <EmptyState text="No events scheduled for today" />
                            ) : (
                                todayEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-center gap-3 rounded-2xl border border-transparent bg-muted/40 p-4 transition hover:border-border hover:bg-muted/60"
                                    >
                                        <div className="w-16 shrink-0 rounded-xl bg-primary/10 px-2 py-2 text-center text-sm font-semibold text-primary">
                                            {event.time || "--:--"}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{event.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatPrettyDate(event.date)}
                                            </p>
                                        </div>

                                        <PriorityBadge priority={event.priority} />
                                    </div>
                                ))
                            )}
                        </div>
                    </PersonalPanel>

                    <PersonalPanel
                        title="Task Progress"
                        subtitle="Your tasks due today with current completion state"
                    >
                        <div className="mb-4 rounded-2xl bg-muted/30 p-4">
                            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                                <span>Overall completion</span>
                                <span>{progressPercent}%</span>
                            </div>
                            <Progress value={progressPercent} />
                            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                                <span>Todo: {todo}</span>
                                <span>Progress: {progress}</span>
                                <span>Done: {completed}</span>
                            </div>
                        </div>

                        <div className="flex h-full flex-col gap-3 overflow-y-auto pr-1">
                            {todayTasks.length === 0 ? (
                                <EmptyState text="No tasks due today" />
                            ) : (
                                todayTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-3 rounded-2xl border border-transparent bg-muted/40 p-4 transition hover:border-border hover:bg-muted/60"
                                    >
                                        <div
                                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${task.status === "Completed"
                                                    ? "bg-green-500"
                                                    : task.status === "In Progress"
                                                        ? "bg-blue-500"
                                                        : "bg-gray-400"
                                                }`}
                                        />

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{task.title}</p>
                                            <p className="text-xs text-muted-foreground">{task.status}</p>
                                        </div>

                                        <PriorityBadge priority={task.priority} />
                                    </div>
                                ))
                            )}
                        </div>
                    </PersonalPanel>

                    <PersonalPanel
                        title="Weekly Productivity"
                        subtitle="A simple view of your task and event activity this week"
                    >
                        <div className="h-full rounded-2xl bg-muted/20 p-3">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weeklyProductivityData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </PersonalPanel>

                    <PersonalPanel
                        title="Upcoming Tasks"
                        subtitle="Your next pending tasks sorted by urgency and date"
                    >
                        <div className="flex h-full flex-col gap-3 overflow-y-auto pr-1">
                            {upcomingTasks.length === 0 ? (
                                <EmptyState text="No upcoming tasks" />
                            ) : (
                                upcomingTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-4 rounded-2xl border border-transparent bg-muted/40 p-4 transition hover:border-border hover:bg-muted/60"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{task.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {task.deadline ? formatPrettyDate(task.deadline) : "No deadline"}
                                            </p>
                                        </div>

                                        <PriorityBadge priority={task.priority} />
                                    </div>
                                ))
                            )}
                        </div>
                    </PersonalPanel>
                </div>
            </div>
        </DashboardShell>
    )
}
