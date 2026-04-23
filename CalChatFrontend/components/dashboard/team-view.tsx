
//"use client"

//import { Mail } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { Badge } from "@/components/ui/badge"
//import { Progress } from "@/components/ui/progress"
//import { useState, useEffect } from "react"

//const STATUS_COLORS: Record<string, string> = {
//    Online: "bg-green-500",
//    Away: "bg-yellow-500",
//    Offline: "bg-gray-400",
//}

//export function TeamView() {

//    const [members, setMembers] = useState<any[]>([])
//    const [loading, setLoading] = useState(true)
//    const [tasks, setTasks] = useState<any[]>([])

//    // ================= INIT =================
//    useEffect(() => {
//        async function loadData() {
//            await fetchTasks()
//            await fetchEmployees()
//        }
//        loadData()
//    }, [])

//    // ================= FETCH TASKS =================
//    async function fetchTasks() {
//        const token = localStorage.getItem("token")

//        const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks", {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()
//        setTasks(data)
//    }

//    // ================= FETCH EMPLOYEES =================
//    async function fetchEmployees() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/hr/employees", {
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            const data = await res.json()

//            const formatted = data.map((emp: any) => ({
//                id: emp.id,
//                fullName: emp.name,
//                email: emp.email,
//                role: emp.department || "Employee",
//                status: emp.status || "Offline",
//            }))

//            setMembers(formatted)

//        } catch (err) {
//            console.error(err)
//        }

//        setLoading(false)
//    }

//    return (
//        <div className="flex flex-col gap-6">

//            {/* HEADER */}
//            <div>
//                <h2 className="text-xl font-bold">Team</h2>
//                <p className="text-sm text-muted-foreground">
//                    {members.length} members in your team
//                </p>
//            </div>

//            {/* LOADING */}
//            {loading ? (
//                <p className="text-center">Loading...</p>
//            ) : (

//                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                    {members.map((member) => {

//                        // ✅ CALCULATE TASKS PER USER (REAL TIME)
//                        const userTasks = tasks.filter((t: any) =>
//                            t.userId?.toString() === member.id.toString() ||
//                            (t.userIds && t.userIds.map((id: any) => id.toString()).includes(member.id.toString()))
//                        )

//                        const completedTasks = userTasks.filter(
//                            (t: any) => t.status === "Completed"
//                        )

//                        const total = userTasks.length
//                        const completed = completedTasks.length

//                        return (
//                            <div
//                                key={member.id}
//                                className="rounded-xl border bg-card p-6 hover:shadow-lg transition-all"
//                            >

//                                {/* USER */}
//                                <div className="flex items-center gap-4">
//                                    <div className="relative">
//                                        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
//                                            {member.fullName
//                                                ?.split(" ")
//                                                .map((n: string) => n[0])
//                                                .join("")}
//                                        </div>

//                                        <span
//                                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${STATUS_COLORS[member.status]}`}
//                                        />
//                                    </div>

//                                    <div>
//                                        <h3 className="font-semibold text-sm">
//                                            {member.fullName}
//                                        </h3>

//                                        <p className="text-xs text-muted-foreground">
//                                            {member.role}
//                                        </p>

//                                        <Badge variant="secondary" className="mt-1 text-xs">
//                                            {member.status}
//                                        </Badge>
//                                    </div>
//                                </div>

//                                {/* PROGRESS */}
//                                <div className="mt-4">
//                                    <div className="flex justify-between text-xs">
//                                        <span>Tasks</span>
//                                        <span>{completed}/{total}</span>
//                                    </div>

//                                    <Progress
//                                        value={total ? (completed / total) * 100 : 0}
//                                        className="mt-2 h-1.5"
//                                    />
//                                </div>

//                                {/* EMAIL */}
//                                <div className="mt-4">
//                                    <Button
//                                        variant="outline"
//                                        size="sm"
//                                        className="w-full gap-2"
//                                        onClick={() => {
//                                            window.location.href = `mailto:${member.email}`
//                                        }}
//                                    >
//                                        <Mail className="h-4 w-4" />
//                                        Send Email
//                                    </Button>
//                                </div>

//                            </div>
//                        )
//                    })}
//                </div>
//            )}

//        </div>
//    )
//}


"use client"

import { useEffect, useMemo, useState } from "react"
import {
    Mail,
    Search,
    RefreshCw,
    Users,
    UserCheck,
    ListTodo,
    CheckCircle2,
    AlertTriangle,
    Building2,
    Inbox,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

const TASKS_API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks"
const EMPLOYEES_API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/hr/employees"

const STATUS_COLORS: Record<string, string> = {
    Active: "bg-green-500",
    Invited: "bg-amber-500",
    Inactive: "bg-gray-400",
    Unknown: "bg-slate-400",
}

type TeamMember = {
    id: string
    fullName: string
    email: string
    role: string
    status: string
}

type TaskItem = {
    id: string
    userId?: string
    userIds?: string[]
    status?: string
    deadline?: string
}

function getInitials(name: string) {
    if (!name) return "NA"
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("")
}

function isOverdue(deadline?: string, status?: string) {
    if (!deadline || status === "Completed") return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(deadline)
    due.setHours(0, 0, 0, 0)
    return due.getTime() < today.getTime()
}

function getProgressColor(percent: number) {
    if (percent >= 80) return "bg-emerald-500"
    if (percent >= 50) return "bg-blue-500"
    if (percent >= 25) return "bg-amber-500"
    return "bg-rose-500"
}

function StatCard({
    label,
    value,
    icon: Icon,
}: {
    label: string
    value: string | number
    icon: React.ComponentType<{ className?: string }>
}) {
    return (
        <div className="rounded-2xl border bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-4">
            <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <Icon className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    )
}

export function TeamView() {
    const [members, setMembers] = useState<TeamMember[]>([])
    const [tasks, setTasks] = useState<TaskItem[]>([])
    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const [search, setSearch] = useState("")
    const [departmentFilter, setDepartmentFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")

    useEffect(() => {
        loadData()

        const interval = setInterval(() => {
            loadData(true)
        }, 30000)

        const onFocus = () => loadData(true)
        window.addEventListener("focus", onFocus)

        return () => {
            clearInterval(interval)
            window.removeEventListener("focus", onFocus)
        }
    }, [])

    async function loadData(isAuto = false) {
        if (isAuto) {
            setIsRefreshing(true)
        } else {
            setLoading(true)
        }

        try {
            await Promise.all([fetchTasks(), fetchEmployees()])
        } finally {
            setLoading(false)
            setIsRefreshing(false)
        }
    }

    async function fetchTasks() {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch(TASKS_API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                console.error("Tasks fetch failed:", res.status)
                return
            }

            const data = await res.json()
            setTasks(data)
        } catch (err) {
            console.error("fetchTasks error:", err)
        }
    }

    async function fetchEmployees() {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch(EMPLOYEES_API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                console.error("Employees fetch failed:", res.status)
                return
            }

            const data = await res.json()

            const formatted = data.map((emp: any) => ({
                id: emp.id,
                fullName: emp.name || "Unknown",
                email: emp.email || "",
                role: emp.department || "Employee",
                status: emp.status || "Unknown",
            }))

            setMembers(formatted)
        } catch (err) {
            console.error("fetchEmployees error:", err)
        }
    }

    const departmentOptions = useMemo(() => {
        return Array.from(new Set(members.map((member) => member.role).filter(Boolean))).sort()
    }, [members])

    const filteredMembers = useMemo(() => {
        return members.filter((member) => {
            const matchesSearch =
                member.fullName.toLowerCase().includes(search.toLowerCase()) ||
                member.email.toLowerCase().includes(search.toLowerCase())

            const matchesDepartment =
                departmentFilter === "all" || member.role === departmentFilter

            const matchesStatus =
                statusFilter === "all" || member.status === statusFilter

            return matchesSearch && matchesDepartment && matchesStatus
        })
    }, [members, search, departmentFilter, statusFilter])

    const memberTaskStats = useMemo(() => {
        const statsMap = new Map<
            string,
            {
                total: number
                completed: number
                todo: number
                inProgress: number
                overdue: number
                percent: number
            }
        >()

        for (const member of members) {
            const userTasks = tasks.filter((task) => {
                const singleMatch = task.userId?.toString() === member.id.toString()
                const multiMatch =
                    task.userIds &&
                    task.userIds.map((id) => id.toString()).includes(member.id.toString())

                return singleMatch || multiMatch
            })

            const completed = userTasks.filter((task) => task.status === "Completed").length
            const todo = userTasks.filter((task) => task.status === "Todo").length
            const inProgress = userTasks.filter((task) => task.status === "In Progress").length
            const overdue = userTasks.filter((task) => isOverdue(task.deadline, task.status)).length
            const total = userTasks.length
            const percent = total ? Math.round((completed / total) * 100) : 0

            statsMap.set(member.id, {
                total,
                completed,
                todo,
                inProgress,
                overdue,
                percent,
            })
        }

        return statsMap
    }, [members, tasks])

    const totalMembers = members.length
    const activeMembers = members.filter((member) => member.status === "Active").length
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.status === "Completed").length
    const averageCompletion = totalMembers
        ? Math.round(
            Array.from(memberTaskStats.values()).reduce((sum, item) => sum + item.percent, 0) /
            totalMembers
        )
        : 0

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-xl font-bold">Team</h2>
                    <p className="text-sm text-muted-foreground">
                        {filteredMembers.length} members in your team
                    </p>
                </div>

                <Button variant="outline" onClick={() => loadData(true)} disabled={isRefreshing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard label="Total Members" value={totalMembers} icon={Users} />
                <StatCard label="Active Members" value={activeMembers} icon={UserCheck} />
                <StatCard label="Total Tasks" value={totalTasks} icon={ListTodo} />
                <StatCard label="Completed Tasks" value={completedTasks} icon={CheckCircle2} />
                <StatCard label="Avg. Completion" value={`${averageCompletion}%`} icon={Building2} />
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search team members..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                >
                    <option value="all">All Departments</option>
                    {departmentOptions.map((department) => (
                        <option key={department} value={department}>
                            {department}
                        </option>
                    ))}
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Invited">Invited</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Unknown">Unknown</option>
                </select>
            </div>

            {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="rounded-xl border bg-card p-6">
                            <div className="animate-pulse space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-muted" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-28 rounded bg-muted" />
                                        <div className="h-3 w-20 rounded bg-muted" />
                                    </div>
                                </div>
                                <div className="h-3 w-full rounded bg-muted" />
                                <div className="h-9 w-full rounded bg-muted" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-12 text-center">
                    <Inbox className="h-10 w-10 text-muted-foreground" />
                    <div>
                        <p className="font-medium">No team members found</p>
                        <p className="text-sm text-muted-foreground">
                            Try a different search or filter.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredMembers.map((member) => {
                        const stats = memberTaskStats.get(member.id) || {
                            total: 0,
                            completed: 0,
                            todo: 0,
                            inProgress: 0,
                            overdue: 0,
                            percent: 0,
                        }

                        return (
                            <div
                                key={member.id}
                                className="rounded-2xl border bg-card p-6 transition-all hover:shadow-lg"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="relative">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 font-semibold text-blue-600">
                                            {getInitials(member.fullName)}
                                        </div>

                                        <span
                                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${STATUS_COLORS[member.status] || STATUS_COLORS.Unknown
                                                }`}
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-sm font-semibold">{member.fullName}</h3>
                                        <p className="text-xs text-muted-foreground">{member.role}</p>

                                        <Badge variant="secondary" className="mt-2 text-xs">
                                            {member.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <div className="mb-2 flex items-center justify-between text-xs">
                                        <span>Task Completion</span>
                                        <span>
                                            {stats.completed}/{stats.total}
                                        </span>
                                    </div>

                                    <Progress
                                        value={stats.percent}
                                        className={cn("mt-2 h-2", getProgressColor(stats.percent))}
                                    />
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="text-xs">
                                        {stats.todo} Todo
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {stats.inProgress} In Progress
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {stats.completed} Done
                                    </Badge>

                                    {stats.overdue > 0 && (
                                        <Badge className="border-red-300 bg-red-500/10 text-xs text-red-700">
                                            <AlertTriangle className="mr-1 h-3 w-3" />
                                            {stats.overdue} Overdue
                                        </Badge>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-2"
                                        onClick={() => {
                                            window.location.href = `mailto:${member.email}`
                                        }}
                                    >
                                        <Mail className="h-4 w-4" />
                                        Send Email
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ")
}
