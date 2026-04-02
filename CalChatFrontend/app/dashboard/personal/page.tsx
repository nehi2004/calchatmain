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

//const TASK_API = "https://calchat-backend.onrender.com//api/Tasks"
//const CALENDAR_API = "https://calchat-backend.onrender.com//api/CalendarEvents"
//const EVENTS_API = "https://calchat-backend.onrender.com//api/Events"

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

//const TASK_API = "https://calchat-backend.onrender.com//api/Tasks"
//const CALENDAR_API = "https://calchat-backend.onrender.com//api/CalendarEvents"

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

//const TASK_API = "https://calchat-backend.onrender.com//api/Tasks"
//const CALENDAR_API = "https://calchat-backend.onrender.com//api/CalendarEvents"

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








"use client"

import { useEffect, useState } from "react"
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
    Leaf
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
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
    priority: string
}

const navItems = [
    { label: "Dashboard", href: "/dashboard/personal", icon: LayoutDashboard },
    { label: "Calendar", href: "/dashboard/personal/calendar", icon: Calendar },
    { label: "AI Chat", href: "/dashboard/personal/chat", icon: MessageSquare },
    { label: "Tasks", href: "/dashboard/personal/tasks", icon: CheckCircle2 },
    { label: "Focus Mode", href: "/dashboard/personal/focus", icon: Focus },
    { label: "Analytics", href: "/dashboard/personal/analytics", icon: BarChart3 },
]

const TASK_API = "https://calchat-backend.onrender.com//api/Tasks"
const CALENDAR_API = "https://calchat-backend.onrender.com//api/CalendarEvents"

function formatDate(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
    ).padStart(2, "0")}`
}

export default function PersonalDashboard() {

    const [tasks, setTasks] = useState<Task[]>([])
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])

    const today = formatDate(new Date())

    useEffect(() => {
        fetchTasks()
        fetchCalendarEvents()
    }, [])

    async function fetchTasks() {
        const token = localStorage.getItem("token")

        const res = await fetch(TASK_API, {
            headers: { Authorization: `Bearer ${token}` }
        })

        const data = await res.json()

        setTasks(
            data.map((t: any) => ({
                ...t,
                deadline: t.deadline?.split("T")[0]
            }))
        )
    }

    async function fetchCalendarEvents() {
        const token = localStorage.getItem("token")

        const res = await fetch(CALENDAR_API, {
            headers: { Authorization: `Bearer ${token}` }
        })

        const data = await res.json()

        setCalendarEvents(
            data.map((e: any) => ({
                ...e,
                date: e.date.split("T")[0]
            }))
        )
    }

    /* ================= STATS ================= */

    const completed = tasks.filter(t => t.status === "Completed").length
    const todo = tasks.filter(t => t.status === "Todo").length
    const progress = tasks.filter(t => t.status === "In Progress").length

    const progressPercent =
        tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

    /* ================= TODAY ================= */

    const todayEvents = calendarEvents
        .filter(e => e.date === today)
        .sort((a, b) => a.time.localeCompare(b.time))

    /* ================= UPCOMING ================= */

    const upcomingTasks = tasks
        .filter(t => t.status !== "Completed" && t.deadline)
        .sort((a, b) => (a.deadline || "").localeCompare(b.deadline || ""))

    /* ================= PRODUCTIVITY ================= */

    const productivityData = [
        { day: "Mon", score: 70 },
        { day: "Tue", score: 82 },
        { day: "Wed", score: 65 },
        { day: "Thu", score: 91 },
        { day: "Fri", score: 78 },
        { day: "Sat", score: 55 },
        { day: "Sun", score: 60 }
    ]

    /* 🔥 PRIORITY UI FUNCTION */
    function PriorityBadge({ priority }: { priority: string }) {
        if (priority === "High") {
            return (
                <Badge className="bg-red-500/10 text-red-600 border border-red-300 flex items-center gap-1">
                    <Flame className="h-3 w-3" /> High
                </Badge>
            )
        }
        if (priority === "Medium") {
            return (
                <Badge className="bg-yellow-500/10 text-yellow-600 border border-yellow-300 flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Medium
                </Badge>
            )
        }
        return (
            <Badge className="bg-green-500/10 text-green-600 border border-green-300 flex items-center gap-1">
                <Leaf className="h-3 w-3" /> Low
            </Badge>
        )
    }

    return (
        <DashboardShell navItems={navItems} role="Personal" title="Dashboard">

            {/* TOP */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={CalendarDays} title="Today's Tasks" value={todayEvents.length.toString()} />
                <StatCard icon={CheckCircle2} title="Completed Tasks" value={completed.toString()} />
                <StatCard icon={TrendingUp} title="Productivity" value={`${progressPercent}%`} />
                <StatCard icon={Bell} title="Upcoming Tasks" value={upcomingTasks.length.toString()} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">

                {/* TODAY */}
                <div className="rounded-xl border bg-card p-6">
                    <h3 className="font-semibold text-lg">Today's Schedule</h3>

                    <div className="mt-4 flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2">
                        {todayEvents.map(e => (
                            <div key={e.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:shadow-md transition">
                                <span className="w-14 text-sm font-medium text-primary">{e.time}</span>
                                <p className="flex-1 text-sm font-medium">{e.title}</p>
                                <PriorityBadge priority={e.priority} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* PROGRESS */}
                <div className="rounded-xl border bg-card p-6">
                    <h3 className="font-semibold text-lg">Task Progress</h3>

                    <div className="mt-4">
                        <Progress value={progressPercent} />
                        <div className="flex gap-4 text-sm mt-3 text-muted-foreground">
                            <span>Todo: {todo}</span>
                            <span>Progress: {progress}</span>
                            <span>Done: {completed}</span>
                        </div>
                    </div>
                </div>

                {/* PRODUCTIVITY */}
                <div className="rounded-xl border bg-card p-6">
                    <h3 className="font-semibold text-lg">Weekly Productivity</h3>

                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={productivityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* UPCOMING */}
                <div className="rounded-xl border bg-card p-6">
                    <h3 className="font-semibold text-lg">Upcoming Tasks</h3>

                    <div className="mt-4 flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2">
                        {upcomingTasks.map(task => (
                            <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:shadow-md transition">

                                <div className="flex-1">
                                    <p className="text-sm font-medium">{task.title}</p>
                                    <p className="text-xs text-muted-foreground">{task.deadline}</p>
                                </div>

                                <PriorityBadge priority={task.priority} />
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </DashboardShell>
    )
}