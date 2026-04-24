
//"use client"

//import { useEffect, useState, useMemo } from "react"
//import {
//    LayoutDashboard, Users, Shield, Briefcase, BarChart3, Megaphone,
//    UserPlus, Activity, PieChart as PieIcon
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Badge } from "@/components/ui/badge"

//import {
//    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
//    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
//} from "recharts"

//const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"]

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
//    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
//    { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
//    // { label: "Access Control", href: "/dashboard/admin/access", icon: Briefcase },
//    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
//    // { label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
//]

//interface User {
//    id: string
//    fullName: string
//    email: string
//    role: string
//    createdAt: string
//    isActive?: boolean
//}

//export default function AdminDashboard() {

//    const [users, setUsers] = useState<User[]>([])
//    const [loading, setLoading] = useState(true)
//    // ✅ DATE FORMAT FUNCTION (ADD THIS ABOVE RETURN)
//    function formatDate(date: string) {
//        if (!date) return "-"

//        const d = new Date(date)

//        if (isNaN(d.getTime())) return "-"

//        return d.toLocaleDateString("en-IN", {
//            day: "2-digit",
//            month: "short",
//            year: "numeric",
//        })
//    }

//    useEffect(() => {
//        fetchUsers()
//    }, [])

//    async function fetchUsers() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/account/users", {
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            if (!res.ok) return

//            const data = await res.json()
//            setUsers(data)

//        } catch (err) {
//            console.error(err)
//        } finally {
//            setLoading(false)
//        }
//    }

//    const totalUsers = users.length

//    const newThisWeek = users.filter(u => {
//        const created = new Date(u.createdAt)
//        const now = new Date()
//        const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
//        return diff <= 7
//    }).length

//    const roleData = useMemo(() => {
//        const roleCount: any = {}

//        users.forEach(u => {
//            const role = u.role || "Unknown"
//            roleCount[role] = (roleCount[role] || 0) + 1
//        })

//        return Object.keys(roleCount).map((role, index) => ({
//            name: role,
//            value: roleCount[role],
//            color: COLORS[index % COLORS.length]
//        }))
//    }, [users])

//    const registrationData = useMemo(() => {
//        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

//        const result = months.map(m => ({ month: m, users: 0 }))

//        users.forEach(u => {
//            const d = new Date(u.createdAt)
//            result[d.getMonth()].users++
//        })

//        return result
//    }, [users])

//    /* ================= ACTIVITY LOGIC ================= */

//    const lastCreatedUser = [...users]
//        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

//    const lastDeactivatedUser = users
//        .filter(u => !u.isActive)
//        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

//    const lastActiveUser = users
//        .filter(u => u.isActive)
//        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

//    const recentUsers = [...users]
//        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

//    if (loading) {
//        return <p className="p-6 text-center">Loading dashboard...</p>
//    }

//    return (
//        <DashboardShell navItems={navItems} role="Admin" title="Dashboard">

//            {/* STATS */}
//            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
//                <StatCard icon={Users} title="Total Users In System" value={String(totalUsers)} />

//                <StatCard
//                    icon={UserPlus}
//                    title="New Registrations "
//                    value={String(newThisWeek)}
//                    description="This week "
//                />

//                <StatCard
//                    icon={Activity}
//                    title="Active Users"
//                    value={String(totalUsers)}
//                />

//                <StatCard
//                    icon={PieIcon}
//                    title="Total Roles"
//                    value={String(roleData.length)}
//                />
//            </div>

//            {/* CHARTS */}
//            <div className="mt-4 grid gap-3 lg:grid-cols-2">

//                {/* ROLE CHART */}
//                <div className="rounded-xl border bg-card p-4 shadow-sm hover:scale-105 transition-transform duration-300">
//                    <h3 className="text-lg font-semibold">Role Distribution</h3>
//                    <div className="mt-2 h-64">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <PieChart>
//                                <Pie data={roleData} dataKey="value" outerRadius={90} label>
//                                    {roleData.map((entry, index) => (
//                                        <Cell key={index} fill={entry.color} />
//                                    ))}
//                                </Pie>
//                                <Tooltip />
//                                <Legend />
//                            </PieChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>

//                {/* REGISTRATION */}
//                <div className="rounded-xl border bg-card p-4 shadow-sm hover:scale-105 transition-transform duration-300">
//                    <h3 className="text-lg font-semibold">Registration Trends</h3>
//                    <div className="mt-4 h-64">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <BarChart data={registrationData}>
//                                <CartesianGrid strokeDasharray="3 3" />
//                                <XAxis dataKey="month" />
//                                <YAxis />
//                                <Tooltip />
//                                <Bar dataKey="users" radius={[8, 8, 0, 0]} fill="#6366F1" />
//                            </BarChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>

              
//                {/* RECENT USERS */}
//                <div className="rounded-xl border bg-card p-4 shadow-sm hover:scale-105 transition-transform duration-300">
//                    <h3 className="text-lg font-semibold">Recently Loged In Users</h3>

//                    <div className="mt-4 flex flex-col gap-3 max-h-[320px] overflow-y-auto">
//                        {recentUsers.map(user => (
//                            <div
//                                key={user.id}
//                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition"
//                            >
//                                {/* LEFT */}
//                                <div className="flex items-center gap-3">
//                                    <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
//                                        {user.fullName.charAt(0)}
//                                    </div>

//                                    <div>
//                                        <p className="font-medium">{user.fullName}</p>
//                                        <p className="text-xs text-muted-foreground">{user.email}</p>
//                                    </div>
//                                </div>

//                                {/* CENTER (JOIN DATE) */}
//                                <div className="text-xs text-muted-foreground whitespace-nowrap">
//                                    {formatDate(user.createdAt)}
//                                </div>

//                                {/* RIGHT */}
//                                <Badge variant="secondary">
//                                    {user.role}
//                                </Badge>
//                            </div>
//                        ))}
//                    </div>
//                </div>
//            {/*    */}{/* ACTIVITY */}


//                {/* ACTIVITY */}

//                <div className="rounded-xl border bg-card p-4 shadow-sm hover:scale-105 transition-transform duration-300">
//                    <h3 className="text-lg font-semibold mb-4">System Activity</h3>

//                    <div className="flex flex-col gap-3 text-sm">

//                        {/* 🆕 Recently Joined (NEW) */}
//                        <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 transition">
//                            <div className="w-9 h-9 flex items-center justify-center rounded-full text-white">
//                                📅
//                            </div>
//                            <div>
//                                {lastCreatedUser ? (
//                                    <>
//                                        <p className="font-medium text-purple-400">
//                                            {lastCreatedUser.fullName}
//                                        </p>
//                                        <p className="text-muted-foreground text-xs">
//                                            Joined on {formatDate(lastCreatedUser.createdAt)}
//                                        </p>
//                                    </>
//                                ) : (
//                                    <p className="text-muted-foreground text-xs">
//                                        No recent joinings
//                                    </p>
//                                )}
//                            </div>
//                        </div>

//                        {/* 🟢 Last Registered */}
//                        <div className="flex items-start gap-3 p-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 transition">
//                            <div className="w-9 h-9 flex items-center justify-center rounded-full text-white">
//                                🆕
//                            </div>
//                            <div>
//                                {lastCreatedUser ? (
//                                    <>
//                                        <p className="font-medium text-green-400">
//                                            {lastCreatedUser.fullName}
//                                        </p>
//                                        <p className="text-muted-foreground text-xs">
//                                            Recently registered successfully
//                                        </p>
//                                    </>
//                                ) : (
//                                    <p className="text-muted-foreground text-xs">
//                                        No recent registrations
//                                    </p>
//                                )}
//                            </div>
//                        </div>

//                        {/* 🔴 Last Deactivated */}
//                        <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition">
//                            <div className="w-9 h-9 flex items-center justify-center rounded-full text-white">
//                                ❌
//                            </div>
//                            <div>
//                                {lastDeactivatedUser ? (
//                                    <>
//                                        <p className="font-medium text-red-400">
//                                            {lastDeactivatedUser.fullName}
//                                        </p>
//                                        <p className="text-muted-foreground text-xs">
//                                            User account was deactivated
//                                        </p>
//                                    </>
//                                ) : (
//                                    <p className="text-muted-foreground text-xs">
//                                        No deactivated users
//                                    </p>
//                                )}
//                            </div>
//                        </div>

//                        {/* 🔵 Last Active */}
//                        <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition">
//                            <div className="w-9 h-9 flex items-center justify-center rounded-full text-white">
//                                ✅
//                            </div>
//                            <div>
//                                {lastActiveUser ? (
//                                    <>
//                                        <p className="font-medium text-blue-400">
//                                            {lastActiveUser.fullName}
//                                        </p>
//                                        <p className="text-muted-foreground text-xs">
//                                            Currently active in the system
//                                        </p>
//                                    </>
//                                ) : (
//                                    <p className="text-muted-foreground text-xs">
//                                        No active users
//                                    </p>
//                                )}
//                            </div>
//                        </div>

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
    Users,
    Shield,
    BarChart3,
    UserPlus,
    Activity,
    PieChart as PieIcon,
    RefreshCw,
    UserCheck,
    UserX,
    Calendar,
    Inbox,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts"

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#8B5CF6"]

const navItems = [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
]

interface User {
    id: string
    fullName: string
    email: string
    role: string
    createdAt: string
    isActive?: boolean
}

const USERS_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/account/users"

function InfoStat({
    icon: Icon,
    title,
    value,
    valueClassName = "",
}: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    value: string | number
    valueClassName?: string
}) {
    return (
        <Card className="rounded-2xl border shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
                <div>
                    <p className="text-xs text-muted-foreground">{title}</p>
                    <h2 className={`mt-1 text-2xl font-bold ${valueClassName}`}>{value}</h2>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
            </CardContent>
        </Card>
    )
}

function formatDate(date: string) {
    if (!date) return "-"
    const d = new Date(date)
    if (isNaN(d.getTime())) return "-"
    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers(isRefresh = false) {
        try {
            if (isRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            setError("")
            const token = localStorage.getItem("token")

            const res = await fetch(USERS_API, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                throw new Error(`Failed with status ${res.status}`)
            }

            const data = await res.json()
            setUsers(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error(err)
            setError("Unable to load dashboard analytics right now.")
            setUsers([])
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.isActive).length
    const inactiveUsers = users.filter((u) => !u.isActive).length
    const totalRoles = new Set(users.map((u) => u.role || "Unknown")).size

    const newThisWeek = users.filter((u) => {
        const created = new Date(u.createdAt)
        const now = new Date()
        const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
        return diff <= 7
    }).length

    const activeRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0

    const roleData = useMemo(() => {
        const roleCount: Record<string, number> = {}

        users.forEach((u) => {
            const role = u.role || "Unknown"
            roleCount[role] = (roleCount[role] || 0) + 1
        })

        return Object.keys(roleCount).map((role, index) => ({
            name: role,
            value: roleCount[role],
            color: COLORS[index % COLORS.length],
        }))
    }, [users])

    const registrationData = useMemo(() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const currentYear = new Date().getFullYear()

        const result = months.map((month) => ({
            month,
            users: 0,
        }))

        users.forEach((u) => {
            const d = new Date(u.createdAt)
            if (d.getFullYear() !== currentYear) return
            result[d.getMonth()].users++
        })

        return result
    }, [users])

    const recentUsers = useMemo(() => {
        return [...users]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 6)
    }, [users])

    const lastCreatedUser = recentUsers[0]
    const lastDeactivatedUser = [...users]
        .filter((u) => !u.isActive)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

    const lastActiveUser = [...users]
        .filter((u) => u.isActive)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

    if (loading) {
        return (
            <DashboardShell navItems={navItems} role="Admin" title="Dashboard">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Card key={index} className="rounded-2xl border">
                            <CardContent className="p-5">
                                <div className="animate-pulse space-y-3">
                                    <div className="h-4 w-24 rounded bg-muted" />
                                    <div className="h-8 w-20 rounded bg-muted" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Card key={index} className="rounded-2xl border p-4">
                            <div className="animate-pulse space-y-4">
                                <div className="h-5 w-40 rounded bg-muted" />
                                <div className="h-[300px] rounded bg-muted" />
                            </div>
                        </Card>
                    ))}
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell navItems={navItems} role="Admin" title="Dashboard">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Monitor user growth, role distribution, and system activity.
                        </p>
                    </div>

                    <Button variant="outline" onClick={() => fetchUsers(true)} disabled={refreshing}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <StatCard icon={Users} title="Total Users" value={String(totalUsers)} />
                    <StatCard icon={UserPlus} title="New This Week" value={String(newThisWeek)} description="Last 7 days" />
                    <StatCard icon={UserCheck} title="Active Users" value={String(activeUsers)} />
                    <StatCard icon={UserX} title="Inactive Users" value={String(inactiveUsers)} />
                    <StatCard icon={Shield} title="Total Roles" value={String(totalRoles)} />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <InfoStat icon={Activity} title="Active Rate" value={`${activeRate}%`} />
                    <InfoStat icon={Calendar} title="Latest Join" value={lastCreatedUser ? formatDate(lastCreatedUser.createdAt) : "-"} />
                    <InfoStat icon={PieIcon} title="Tracked Roles" value={roleData.length} />
                </div>

                {users.length === 0 ? (
                    <Card className="rounded-2xl border">
                        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                            <Inbox className="h-10 w-10 text-muted-foreground" />
                            <div>
                                <p className="font-medium">No users found</p>
                                <p className="text-sm text-muted-foreground">
                                    User analytics will appear here once accounts exist.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md">
                            <p className="mb-3 text-lg font-semibold">Role Distribution</p>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={roleData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={95}
                                        innerRadius={55}
                                        paddingAngle={3}
                                    >
                                        {roleData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>

                        <Card className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md">
                            <p className="mb-3 text-lg font-semibold">Registration Trends</p>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={registrationData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="users" radius={[8, 8, 0, 0]} fill="#6366F1" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>

                        <Card className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md">
                            <p className="mb-4 text-lg font-semibold">Recent Registrations</p>

                            <div className="flex max-h-[320px] flex-col gap-3 overflow-y-auto pr-1">
                                {recentUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex flex-col gap-3 rounded-xl border p-3 transition hover:bg-muted/30 md:flex-row md:items-center md:justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-bold text-white">
                                                {user.fullName?.charAt(0) || "U"}
                                            </div>

                                            <div>
                                                <p className="font-medium">{user.fullName}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>

                                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                                            Joined: {formatDate(user.createdAt)}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{user.role}</Badge>
                                            <Badge variant={user.isActive ? "default" : "destructive"}>
                                                {user.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md">
                            <p className="mb-4 text-lg font-semibold">System Activity</p>

                            <div className="flex flex-col gap-3 text-sm">
                                <div className="flex items-start gap-3 rounded-xl bg-purple-500/10 p-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500 text-white">
                                        📅
                                    </div>
                                    <div>
                                        {lastCreatedUser ? (
                                            <>
                                                <p className="font-medium text-purple-700">{lastCreatedUser.fullName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Joined on {formatDate(lastCreatedUser.createdAt)}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">No recent joinings</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-xl bg-green-500/10 p-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white">
                                        🆕
                                    </div>
                                    <div>
                                        {lastCreatedUser ? (
                                            <>
                                                <p className="font-medium text-green-700">{lastCreatedUser.fullName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Recently registered successfully
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">No recent registrations</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-xl bg-red-500/10 p-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white">
                                        ❌
                                    </div>
                                    <div>
                                        {lastDeactivatedUser ? (
                                            <>
                                                <p className="font-medium text-red-700">{lastDeactivatedUser.fullName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    User account is inactive
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">No inactive users found</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-xl bg-blue-500/10 p-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white">
                                        ✅
                                    </div>
                                    <div>
                                        {lastActiveUser ? (
                                            <>
                                                <p className="font-medium text-blue-700">{lastActiveUser.fullName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Currently active in the system
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">No active users found</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </DashboardShell>
    )
}

