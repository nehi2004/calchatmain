//"use client"

//import { TrendingUp, Clock, CheckCircle2, Target } from "lucide-react"
//import { StatCard } from "./stat-card"
//import {
//  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
//  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
//  PolarGrid, PolarAngleAxis, Radar,
//} from "recharts"

//const productivityData = [
//  { day: "Mon", score: 72, tasks: 8, hours: 6.5 },
//  { day: "Tue", score: 85, tasks: 12, hours: 7.2 },
//  { day: "Wed", score: 68, tasks: 6, hours: 5.8 },
//  { day: "Thu", score: 91, tasks: 14, hours: 8.1 },
//  { day: "Fri", score: 79, tasks: 10, hours: 6.9 },
//  { day: "Sat", score: 55, tasks: 4, hours: 3.2 },
//  { day: "Sun", score: 60, tasks: 5, hours: 3.8 },
//]

//const timeUsageData = [
//  { name: "Meetings", value: 25, color: "hsl(var(--chart-1))" },
//  { name: "Deep Work", value: 35, color: "hsl(var(--chart-2))" },
//  { name: "Communication", value: 15, color: "hsl(var(--chart-3))" },
//  { name: "Planning", value: 10, color: "hsl(var(--chart-4))" },
//  { name: "Break", value: 15, color: "hsl(var(--chart-5))" },
//]

//const weeklyPerformance = [
//  { week: "W1", completed: 18, total: 22 },
//  { week: "W2", completed: 24, total: 28 },
//  { week: "W3", completed: 15, total: 20 },
//  { week: "W4", completed: 28, total: 30 },
//  { week: "W5", completed: 22, total: 25 },
//  { week: "W6", completed: 30, total: 32 },
//]

//const taskCompletionData = [
//  { month: "Sep", rate: 72 },
//  { month: "Oct", rate: 78 },
//  { month: "Nov", rate: 82 },
//  { month: "Dec", rate: 75 },
//  { month: "Jan", rate: 88 },
//  { month: "Feb", rate: 92 },
//]

//const skillsData = [
//  { subject: "Focus", A: 85 },
//  { subject: "Speed", A: 72 },
//  { subject: "Quality", A: 90 },
//  { subject: "Teamwork", A: 78 },
//  { subject: "Planning", A: 82 },
//  { subject: "Creativity", A: 68 },
//]

//const tooltipStyle = {
//  backgroundColor: 'hsl(var(--card))',
//  border: '1px solid hsl(var(--border))',
//  borderRadius: '8px',
//  color: 'hsl(var(--card-foreground))',
//}

//export function AnalyticsView() {
//  return (
//    <div className="flex flex-col gap-6">
//      {/* Stats */}
//      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//        <StatCard icon={TrendingUp} title="Productivity Score" value="85%" trend="+7% vs last month" />
//        <StatCard icon={Clock} title="Avg. Focus Time" value="5.8h" description="Per day" trend="+0.5h" />
//        <StatCard icon={CheckCircle2} title="Task Completion" value="92%" trend="+4% this week" />
//        <StatCard icon={Target} title="Weekly Goal" value="28/30" description="Tasks completed" />
//      </div>

//      {/* Charts */}
//      <div className="grid gap-6 lg:grid-cols-2">
//        {/* Productivity Score */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Productivity Score</h3>
//          <p className="mt-1 text-sm text-muted-foreground">Daily productivity score this week</p>
//          <div className="mt-4 h-64">
//            <ResponsiveContainer width="100%" height="100%">
//              <AreaChart data={productivityData}>
//                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
//                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
//                <Tooltip contentStyle={tooltipStyle} />
//                <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.15)" strokeWidth={2} />
//              </AreaChart>
//            </ResponsiveContainer>
//          </div>
//        </div>

//        {/* Time Usage */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Time Usage Graph</h3>
//          <p className="mt-1 text-sm text-muted-foreground">How your time is distributed</p>
//          <div className="mt-4 flex items-center gap-6">
//            <div className="h-56 flex-1">
//              <ResponsiveContainer width="100%" height="100%">
//                <PieChart>
//                  <Pie
//                    data={timeUsageData}
//                    cx="50%"
//                    cy="50%"
//                    innerRadius={50}
//                    outerRadius={80}
//                    paddingAngle={4}
//                    dataKey="value"
//                  >
//                    {timeUsageData.map((entry, index) => (
//                      <Cell key={`cell-${index}`} fill={entry.color} />
//                    ))}
//                  </Pie>
//                  <Tooltip contentStyle={tooltipStyle} />
//                </PieChart>
//              </ResponsiveContainer>
//            </div>
//            <div className="flex flex-col gap-3">
//              {timeUsageData.map((item) => (
//                <div key={item.name} className="flex items-center gap-3">
//                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
//                  <div>
//                    <p className="text-sm font-medium text-card-foreground">{item.name}</p>
//                    <p className="text-xs text-muted-foreground">{item.value}%</p>
//                  </div>
//                </div>
//              ))}
//            </div>
//          </div>
//        </div>

//        {/* Task Completion Rate */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Task Completion Rate</h3>
//          <p className="mt-1 text-sm text-muted-foreground">Monthly task completion trend</p>
//          <div className="mt-4 h-64">
//            <ResponsiveContainer width="100%" height="100%">
//              <LineChart data={taskCompletionData}>
//                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
//                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
//                <Tooltip contentStyle={tooltipStyle} />
//                <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
//              </LineChart>
//            </ResponsiveContainer>
//          </div>
//        </div>

//        {/* Weekly Performance */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Weekly Performance Summary</h3>
//          <p className="mt-1 text-sm text-muted-foreground">Completed vs total tasks each week</p>
//          <div className="mt-4 h-64">
//            <ResponsiveContainer width="100%" height="100%">
//              <BarChart data={weeklyPerformance}>
//                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
//                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
//                <Tooltip contentStyle={tooltipStyle} />
//                <Bar dataKey="total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Total" />
//                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Completed" />
//              </BarChart>
//            </ResponsiveContainer>
//          </div>
//        </div>
//      </div>
//    </div>
//  )
//}


//"use client"

//import { useEffect, useState, useMemo } from "react"
//import { TrendingUp, Clock, CheckCircle2, Target } from "lucide-react"
//import { StatCard } from "./stat-card"

//import {
//    AreaChart,
//    Area,
//    BarChart,
//    Bar,
//    LineChart,
//    Line,
//    PieChart,
//    Pie,
//    Cell,
//    XAxis,
//    YAxis,
//    CartesianGrid,
//    Tooltip,
//    ResponsiveContainer
//} from "recharts"

//interface CalendarEvent {
//    id: string
//    title: string
//    date: string
//    time: string
//    type: string
//    priority: "Low" | "Medium" | "High"
//    color?: string
//}

//const API_URL = "https://calchatmain-production-75c1.up.railway.app/api/CalendarEvents"

//function getAuthHeaders() {
//    const token = localStorage.getItem("token")
//    return {
//        "Content-Type": "application/json",
//        Authorization: `Bearer ${token}`
//    }
//}

//export function AnalyticsView() {

//    const [events, setEvents] = useState<CalendarEvent[]>([])

//    useEffect(() => {
//        fetchEvents()
//    }, [])

//    async function fetchEvents() {

//        const res = await fetch(API_URL, {
//            headers: getAuthHeaders()
//        })

//        const data = await res.json()

//        const formatted = data.map((e: any) => ({
//            ...e,
//            date: e.date.split("T")[0]
//        }))

//        setEvents(formatted)
//    }

//    /* DAILY TASK GRAPH */

//    const dailyTasks = useMemo(() => {

//        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

//        const result: any = {}

//        days.forEach(d => {
//            result[d] = { day: d, tasks: 0 }
//        })

//        events.forEach(e => {

//            const dayIndex = new Date(e.date).getDay()
//            const day = days[dayIndex]

//            result[day].tasks++
//        })

//        return Object.values(result)

//    }, [events])

//    /* PRIORITY PIE GRAPH */

//    const priorityData = useMemo(() => {

//        const counts = {
//            Low: 0,
//            Medium: 0,
//            High: 0
//        }

//        events.forEach(e => {
//            counts[e.priority]++
//        })

//        return [
//            { name: "Low", value: counts.Low, color: "#22c55e" },
//            { name: "Medium", value: counts.Medium, color: "#f59e0b" },
//            { name: "High", value: counts.High, color: "#ef4444" }
//        ]

//    }, [events])

//    /* MONTHLY GRAPH */

//    const monthlyTasks = useMemo(() => {

//        const months = [
//            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//        ]

//        const result = months.map(m => ({
//            month: m,
//            tasks: 0
//        }))

//        events.forEach(e => {

//            const monthIndex = new Date(e.date).getMonth()

//            result[monthIndex].tasks++

//        })

//        return result

//    }, [events])

//    /* WEEKLY PERFORMANCE */

//    const weeklyPerformance = useMemo(() => {

//        const weeks = [
//            { week: "W1", tasks: 0 },
//            { week: "W2", tasks: 0 },
//            { week: "W3", tasks: 0 },
//            { week: "W4", tasks: 0 }
//        ]

//        events.forEach(e => {

//            const day = new Date(e.date).getDate()

//            const weekIndex = Math.floor((day - 1) / 7)

//            if (weeks[weekIndex]) weeks[weekIndex].tasks++

//        })

//        return weeks

//    }, [events])

//    const tooltipStyle = {
//        backgroundColor: "#fff",
//        borderRadius: "8px"
//    }

//    /* STATS */

//    const totalTasks = events.length

//    const highPriority = events.filter(e => e.priority === "High").length

//    const today = new Date().toISOString().split("T")[0]

//    const todayTasks = events.filter(e => e.date === today).length

//    const productivity = totalTasks > 0
//        ? Math.round((todayTasks / totalTasks) * 100)
//        : 0

//    return (

//        <div className="flex flex-col gap-6">

//            {/* STATS */}

//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

//                <StatCard
//                    icon={TrendingUp}
//                    title="Productivity Score"
//                    value={`${productivity}%`}
//                    description="Based on today's tasks"
//                />

//                <StatCard
//                    icon={Clock}
//                    title="Total Tasks"
//                    value={String(totalTasks)}
//                    description="All calendar events"
//                />

//                <StatCard
//                    icon={CheckCircle2}
//                    title="Today's Tasks"
//                    value={String(todayTasks)}
//                />

//                <StatCard
//                    icon={Target}
//                    title="High Priority"
//                    value={String(highPriority)}
//                />

//            </div>

//            {/* GRAPHS */}

//            <div className="grid gap-6 lg:grid-cols-2">

//                {/* DAILY GRAPH */}

//                <div className="rounded-xl border bg-card p-6">

//                    <h3 className="font-semibold text-lg">
//                        Tasks This Week
//                    </h3>

//                    <div className="h-64 mt-4">

//                        <ResponsiveContainer width="100%" height="100%">

//                            <AreaChart data={dailyTasks}>

//                                <CartesianGrid strokeDasharray="3 3" />

//                                <XAxis dataKey="day" />

//                                <YAxis />

//                                <Tooltip contentStyle={tooltipStyle} />

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

//                {/* PRIORITY PIE */}

//                <div className="rounded-xl border bg-card p-6">

//                    <h3 className="font-semibold text-lg">
//                        Task Priority Distribution
//                    </h3>

//                    <div className="h-64 mt-4">

//                        <ResponsiveContainer width="100%" height="100%">

//                            <PieChart>

//                                <Pie
//                                    data={priorityData}
//                                    dataKey="value"
//                                    nameKey="name"
//                                    cx="50%"
//                                    cy="50%"
//                                    outerRadius={90}
//                                    label
//                                >

//                                    {priorityData.map((entry, index) => (
//                                        <Cell key={index} fill={entry.color} />
//                                    ))}

//                                </Pie>

//                                <Tooltip contentStyle={tooltipStyle} />

//                            </PieChart>

//                        </ResponsiveContainer>

//                    </div>

//                </div>

//                {/* MONTHLY */}

//                <div className="rounded-xl border bg-card p-6">

//                    <h3 className="font-semibold text-lg">
//                        Monthly Tasks
//                    </h3>

//                    <div className="h-64 mt-4">

//                        <ResponsiveContainer width="100%" height="100%">

//                            <LineChart data={monthlyTasks}>

//                                <CartesianGrid strokeDasharray="3 3" />

//                                <XAxis dataKey="month" />

//                                <YAxis />

//                                <Tooltip contentStyle={tooltipStyle} />

//                                <Line
//                                    type="monotone"
//                                    dataKey="tasks"
//                                    stroke="#6366f1"
//                                    strokeWidth={3}
//                                />

//                            </LineChart>

//                        </ResponsiveContainer>

//                    </div>

//                </div>

//                {/* WEEKLY */}

//                <div className="rounded-xl border bg-card p-6">

//                    <h3 className="font-semibold text-lg">
//                        Weekly Tasks
//                    </h3>

//                    <div className="h-64 mt-4">

//                        <ResponsiveContainer width="100%" height="100%">

//                            <BarChart data={weeklyPerformance}>

//                                <CartesianGrid strokeDasharray="3 3" />

//                                <XAxis dataKey="week" />

//                                <YAxis />

//                                <Tooltip contentStyle={tooltipStyle} />

//                                <Bar
//                                    dataKey="tasks"
//                                    fill="#22c55e"
//                                    radius={[4, 4, 0, 0]}
//                                />

//                            </BarChart>

//                        </ResponsiveContainer>

//                    </div>

//                </div>

//            </div>

//        </div>
//    )
//}


"use client"

import { useEffect, useState, useMemo } from "react"
import { TrendingUp, Clock, CheckCircle2, Target } from "lucide-react"
import { StatCard } from "./stat-card"

import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

/* ================= TYPES ================= */

interface CalendarEvent {
    id: string
    title: string
    date: string
    priority: "Low" | "Medium" | "High"
}

interface Task {
    id: string
    title: string
    priority: "Low" | "Medium" | "High"
    status: "Todo" | "In Progress" | "Completed"
    deadline: string
}

/* ================= API ================= */

const EVENTS_API = "https://calchatmain-production-75c1.up.railway.app/api/CalendarEvents"
const TASKS_API = "https://calchatmain-production-75c1.up.railway.app/api/Tasks"

function getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
        Authorization: `Bearer ${token}`
    }
}

export function AnalyticsView() {

    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        fetchEvents()
        fetchTasks()
    }, [])

    /* ================= FETCH EVENTS ================= */

    async function fetchEvents() {

        const res = await fetch(EVENTS_API, {
            headers: getAuthHeaders()
        })

        const data = await res.json()

        const formatted = data.map((e: any) => ({
            ...e,
            date: e.date.split("T")[0]
        }))

        setEvents(formatted)
    }

    /* ================= FETCH TASKS ================= */

    async function fetchTasks() {

        const res = await fetch(TASKS_API, {
            headers: getAuthHeaders()
        })

        const data = await res.json()

        const formatted = data.map((t: any) => ({
            ...t,
            deadline: t.deadline ? t.deadline.split("T")[0] : ""
        }))

        setTasks(formatted)
    }

    /* ================= MERGED DATA ================= */

    const allItems = useMemo(() => {

        const eventsMapped = events.map(e => ({
            date: e.date,
            priority: e.priority
        }))

        const tasksMapped = tasks.map(t => ({
            date: t.deadline,
            priority: t.priority
        }))

        return [...eventsMapped, ...tasksMapped]

    }, [events, tasks])

    /* ================= DAILY GRAPH ================= */

    const dailyActivity = useMemo(() => {

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

        const result: any = {}

        days.forEach(d => {
            result[d] = { day: d, tasks: 0 }
        })

        allItems.forEach(item => {

            if (!item.date) return

            const dayIndex = new Date(item.date).getDay()
            const day = days[dayIndex]

            result[day].tasks++

        })

        return Object.values(result)

    }, [allItems])

    /* ================= PRIORITY GRAPH ================= */

    const priorityData = useMemo(() => {

        const counts = {
            Low: 0,
            Medium: 0,
            High: 0
        }

        allItems.forEach(i => {
            counts[i.priority]++
        })

        return [
            { name: "Low", value: counts.Low, color: "#22c55e" },
            { name: "Medium", value: counts.Medium, color: "#f59e0b" },
            { name: "High", value: counts.High, color: "#ef4444" }
        ]

    }, [allItems])

    /* ================= MONTHLY GRAPH ================= */

    const monthlyData = useMemo(() => {

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]

        const result = months.map(m => ({
            month: m,
            tasks: 0
        }))

        allItems.forEach(item => {

            if (!item.date) return

            const index = new Date(item.date).getMonth()

            result[index].tasks++

        })

        return result

    }, [allItems])

    /* ================= TASK STATUS ================= */

    const taskStatusData = useMemo(() => {

        const todo = tasks.filter(t => t.status === "Todo").length
        const progress = tasks.filter(t => t.status === "In Progress").length
        const completed = tasks.filter(t => t.status === "Completed").length

        return [
            { name: "Todo", value: todo, color: "#64748b" },
            { name: "In Progress", value: progress, color: "#3b82f6" },
            { name: "Completed", value: completed, color: "#22c55e" }
        ]

    }, [tasks])

    /* ================= STATS ================= */

    const totalEvents = events.length
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === "Completed").length

    const productivity =
        totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0

    const tooltipStyle = {
        backgroundColor: "#fff",
        borderRadius: "8px"
    }

    return (

        <div className="flex flex-col gap-6">

            {/* ================= STATS ================= */}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                <StatCard
                    icon={TrendingUp}
                    title="Productivity"
                    value={`${productivity}%`}
                    description="Completed tasks"
                />

                <StatCard
                    icon={Clock}
                    title="Calendar Events"
                    value={String(totalEvents)}
                />

                <StatCard
                    icon={Target}
                    title="Total Tasks"
                    value={String(totalTasks)}
                />

                <StatCard
                    icon={CheckCircle2}
                    title="Completed Tasks"
                    value={String(completedTasks)}
                />

            </div>

            {/* ================= GRAPHS ================= */}

            <div className="grid gap-6 lg:grid-cols-2">

                {/* WEEKLY */}

                <div className="rounded-xl border bg-card p-6">

                    <h3 className="font-semibold text-lg">
                        Task Flow (Weekly)
                    </h3>

                    <div className="h-64 mt-4">

                        <ResponsiveContainer width="100%" height="100%">

                            <AreaChart data={dailyActivity}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="day" />

                                <YAxis />

                                <Tooltip contentStyle={tooltipStyle} />

                                <Area
                                    type="monotone"
                                    dataKey="tasks"
                                    stroke="#3b82f6"
                                    fill="#93c5fd"
                                />

                            </AreaChart>

                        </ResponsiveContainer>

                    </div>

                </div>

                {/* PRIORITY */}

                <div className="rounded-xl border bg-card p-6">

                    <h3 className="font-semibold text-lg">
                        Task Priority Breakdown
                    </h3>

                    <div className="h-64 mt-4">

                        <ResponsiveContainer width="100%" height="100%">

                            <PieChart>

                                <Pie
                                    data={priorityData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={90}
                                    label
                                >

                                    {priorityData.map((e, i) => (
                                        <Cell key={i} fill={e.color} />
                                    ))}

                                </Pie>

                                <Tooltip contentStyle={tooltipStyle} />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>

                {/* MONTHLY */}

                <div className="rounded-xl border bg-card p-6">

                    <h3 className="font-semibold text-lg">
                        Monthly Activity
                    </h3>

                    <div className="h-64 mt-4">

                        <ResponsiveContainer width="100%" height="100%">

                            <LineChart data={monthlyData}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="month" />

                                <YAxis />

                                <Tooltip contentStyle={tooltipStyle} />

                                <Line
                                    type="monotone"
                                    dataKey="tasks"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </div>

                {/* TASK STATUS */}

                <div className="rounded-xl border bg-card p-6">

                    <h3 className="font-semibold text-lg">
                        Task Progress Overview
                    </h3>

                    <div className="h-64 mt-4">

                        <ResponsiveContainer width="100%" height="100%">

                            <BarChart data={taskStatusData}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="name" />

                                <YAxis />

                                <Tooltip contentStyle={tooltipStyle} />

                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {taskStatusData.map((e, i) => (
                                        <Cell key={i} fill={e.color} />
                                    ))}
                                </Bar>

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </div>

        </div>
    )
}

