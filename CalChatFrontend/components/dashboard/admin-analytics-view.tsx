

//"use client"

//import { useEffect, useState } from "react"
//import {
//    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//    PieChart, Pie, Cell, Legend
//} from "recharts"
//import { Card, CardContent } from "@/components/ui/card"
//import { Users, Activity, Layers, UserCheck, UserX, Calendar } from "lucide-react"

//interface User {
//    id: string
//    fullName: string
//    email: string
//    role: string
//    createdAt: string
//    isActive?: boolean
//}

//const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"]

//export default function AdminAnalyticsView() {

//    const [users, setUsers] = useState<User[]>([])
//    const [loading, setLoading] = useState(true)

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

//            const data = await res.json()
//            setUsers(data)

//        } catch (err) {
//            console.error(err)
//        } finally {
//            setLoading(false)
//        }
//    }

//    // ✅ DATE FORMAT
//    function formatDate(date: string) {
//        const d = new Date(date)
//        return d.toLocaleDateString("en-IN", {
//            day: "2-digit",
//            month: "short",
//            year: "numeric",
//        })
//    }

//    const totalUsers = users.length

//    // ✅ ACTIVE / INACTIVE
//    const activeUsers = users.filter(u => u.isActive).length
//    const inactiveUsers = users.filter(u => !u.isActive).length

//    // ✅ TODAY JOINED
//    const today = new Date().toDateString()
//    const todayJoined = users.filter(
//        u => new Date(u.createdAt).toDateString() === today
//    ).length

//    // ✅ THIS MONTH JOINED
//    const currentMonth = new Date().getMonth()
//    const thisMonthJoined = users.filter(
//        u => new Date(u.createdAt).getMonth() === currentMonth
//    ).length

//    // ✅ ROLE COUNT
//    const roleCount: any = {}
//    users.forEach((u) => {
//        const role = u.role || "Unknown"
//        roleCount[role] = (roleCount[role] || 0) + 1
//    })

//    const roleData = Object.keys(roleCount).map((role) => ({
//        name: role,
//        value: roleCount[role]
//    }))

//    // ✅ USERS PER MONTH
//    const monthCount: any = {}
//    users.forEach((u) => {
//        const date = new Date(u.createdAt)
//        const month = date.toLocaleString("default", { month: "short" })
//        monthCount[month] = (monthCount[month] || 0) + 1
//    })

//    const monthData = Object.keys(monthCount).map((month) => ({
//        month,
//        users: monthCount[month]
//    }))

//    // ✅ RECENT USERS
//    const recentUsers = [...users]
//        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//        .slice(0, 5)

//    if (loading) {
//        return <p className="text-center p-6">Loading analytics...</p>
//    }

//    return (
//        <div className="flex flex-col gap-6">

//            {/* 🔥 STATS */}
//            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

//                <Card><CardContent className="p-4 flex justify-between">
//                    <div>
//                        <p className="text-xs text-muted-foreground">Total</p>
//                        <h2 className="text-xl font-bold">{totalUsers}</h2>
//                    </div>
//                    <Users />
//                </CardContent></Card>

//                <Card><CardContent className="p-4 flex justify-between">
//                    <div>
//                        <p className="text-xs text-muted-foreground">Active</p>
//                        <h2 className="text-xl font-bold text-green-500">{activeUsers}</h2>
//                    </div>
//                    <UserCheck />
//                </CardContent></Card>

//                <Card><CardContent className="p-4 flex justify-between">
//                    <div>
//                        <p className="text-xs text-muted-foreground">Inactive</p>
//                        <h2 className="text-xl font-bold text-red-500">{inactiveUsers}</h2>
//                    </div>
//                    <UserX />
//                </CardContent></Card>

//                <Card><CardContent className="p-4 flex justify-between">
//                    <div>
//                        <p className="text-xs text-muted-foreground">Today</p>
//                        <h2 className="text-xl font-bold">{todayJoined}</h2>
//                    </div>
//                    <Activity />
//                </CardContent></Card>

//                <Card><CardContent className="p-4 flex justify-between">
//                    <div>
//                        <p className="text-xs text-muted-foreground">This Month</p>
//                        <h2 className="text-xl font-bold">{thisMonthJoined}</h2>
//                    </div>
//                    <Calendar />
//                </CardContent></Card>

//                <Card><CardContent className="p-4 flex justify-between">
//                    <div>
//                        <p className="text-xs text-muted-foreground">Roles</p>
//                        <h2 className="text-xl font-bold">{roleData.length}</h2>
//                    </div>
//                    <Layers />
//                </CardContent></Card>

//            </div>

//            {/* 📊 CHARTS */}
//            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//                {/* BAR */}
//                <Card className="p-4">
//                    <p className="mb-2 font-semibold">Users Joined Per Month</p>
//                    <ResponsiveContainer width="100%" height={300}>
//                        <BarChart data={monthData}>
//                            <XAxis dataKey="month" />
//                            <YAxis />
//                            <Tooltip />
//                            <Bar dataKey="users" radius={[6, 6, 0, 0]} fill="#6366F1" />
//                        </BarChart>
//                    </ResponsiveContainer>
//                </Card>

//                {/* PIE */}
//                <Card className="p-4">
//                    <p className="mb-2 font-semibold">Users by Role</p>
//                    <ResponsiveContainer width="100%" height={300}>
//                        <PieChart>
//                            <Pie data={roleData} dataKey="value" nameKey="name" outerRadius={100} label>
//                                {roleData.map((_, index) => (
//                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                                ))}
//                            </Pie>
//                            <Tooltip />
//                            <Legend />
//                        </PieChart>
//                    </ResponsiveContainer>
//                </Card>

//            </div>
//            {/* 🆕 RECENT USERS */}
//            <Card className="p-4">
//                <p className="mb-4 font-semibold">Recent Users</p>

//                {/* ✅ SCROLL AFTER 4 USERS */}
//                <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">

//                    {recentUsers.map((u) => (
//                        <div
//                            key={u.id}
//                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition"
//                        >
//                            {/* LEFT */}
//                            <div className="flex items-center gap-3">
//                                <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
//                                    {u.fullName.charAt(0)}
//                                </div>

//                                <div>
//                                    <p className="font-medium">{u.fullName}</p>
//                                    <p className="text-xs text-muted-foreground">{u.email}</p>
//                                </div>
//                            </div>

//                            {/* ✅ MIDDLE (JOIN DATE) */}
//                            <div className="text-xs text-muted-foreground whitespace-nowrap">
//                                Joined Date: {formatDate(u.createdAt)}
//                            </div>

//                            {/* RIGHT */}
//                            <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-600">
//                                {u.role}
//                            </span>
//                        </div>
//                    ))}

//                </div>
//            </Card>

//        </div>
//    )
//}



"use client"

import { useEffect, useMemo, useState } from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    CartesianGrid,
} from "recharts"
import {
    Users,
    Activity,
    Layers,
    UserCheck,
    UserX,
    Calendar,
    RefreshCw,
    Percent,
    Inbox,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface User {
    id: string
    fullName: string
    email: string
    role: string
    createdAt: string
    isActive?: boolean
}

const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/account/users"
const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#8B5CF6"]

function StatBox({
    title,
    value,
    icon: Icon,
    valueClassName = "",
}: {
    title: string
    value: string | number
    icon: React.ComponentType<{ className?: string }>
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

export default function AdminAnalyticsView() {
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

            const res = await fetch(API_URL, {
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
            setError("Unable to load analytics right now.")
            setUsers([])
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    function formatDate(date: string) {
        const d = new Date(date)
        if (isNaN(d.getTime())) return "-"
        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.isActive).length
    const inactiveUsers = users.filter((u) => !u.isActive).length

    const today = new Date().toDateString()
    const todayJoined = users.filter(
        (u) => new Date(u.createdAt).toDateString() === today
    ).length

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const thisMonthJoined = users.filter((u) => {
        const created = new Date(u.createdAt)
        return (
            created.getMonth() === currentMonth &&
            created.getFullYear() === currentYear
        )
    }).length

    const activeRate =
        totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0

    const roleData = useMemo(() => {
        const roleCount: Record<string, number> = {}

        users.forEach((u) => {
            const role = u.role || "Unknown"
            roleCount[role] = (roleCount[role] || 0) + 1
        })

        return Object.keys(roleCount).map((role) => ({
            name: role,
            value: roleCount[role],
        }))
    }, [users])

    const monthData = useMemo(() => {
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const monthCount: Record<string, number> = {}

        monthOrder.forEach((month) => {
            monthCount[month] = 0
        })

        users.forEach((u) => {
            const date = new Date(u.createdAt)
            if (date.getFullYear() !== currentYear) return
            const month = date.toLocaleString("default", { month: "short" })
            monthCount[month] = (monthCount[month] || 0) + 1
        })

        return monthOrder.map((month) => ({
            month,
            users: monthCount[month],
        }))
    }, [users, currentYear])

    const recentUsers = useMemo(() => {
        return [...users]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 6)
    }, [users])

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="rounded-2xl border">
                            <CardContent className="p-5">
                                <div className="animate-pulse space-y-3">
                                    <div className="h-4 w-20 rounded bg-muted" />
                                    <div className="h-8 w-16 rounded bg-muted" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <Card key={index} className="rounded-2xl border p-4">
                            <div className="animate-pulse space-y-4">
                                <div className="h-5 w-40 rounded bg-muted" />
                                <div className="h-[300px] rounded bg-muted" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Admin Analytics</h2>
                    <p className="text-sm text-muted-foreground">
                        Track user growth, role distribution, and account activity
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

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                <StatBox title="Total Users" value={totalUsers} icon={Users} />
                <StatBox title="Active" value={activeUsers} icon={UserCheck} valueClassName="text-green-600" />
                <StatBox title="Inactive" value={inactiveUsers} icon={UserX} valueClassName="text-red-600" />
                <StatBox title="Today Joined" value={todayJoined} icon={Activity} />
                <StatBox title="This Month" value={thisMonthJoined} icon={Calendar} />
                <StatBox title="Active Rate" value={`${activeRate}%`} icon={Percent} />
            </div>

            {users.length === 0 ? (
                <Card className="rounded-2xl border">
                    <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <Inbox className="h-10 w-10 text-muted-foreground" />
                        <div>
                            <p className="font-medium">No analytics data available</p>
                            <p className="text-sm text-muted-foreground">
                                User analytics will appear here once users are added.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card className="rounded-2xl border p-4 shadow-sm">
                            <p className="mb-3 text-base font-semibold">Users Joined Per Month</p>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="users" radius={[8, 8, 0, 0]} fill="#4F46E5" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>

                        <Card className="rounded-2xl border p-4 shadow-sm">
                            <p className="mb-3 text-base font-semibold">Users by Role</p>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={roleData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={100}
                                        innerRadius={55}
                                        paddingAngle={3}
                                    >
                                        {roleData.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>

                    <Card className="rounded-2xl border p-4 shadow-sm">
                        <p className="mb-4 text-base font-semibold">Recent Users</p>

                        <div className="flex flex-col gap-3">
                            {recentUsers.map((u) => (
                                <div
                                    key={u.id}
                                    className="flex flex-col gap-3 rounded-xl border p-4 transition hover:bg-muted/30 md:flex-row md:items-center md:justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
                                            {u.fullName?.charAt(0) || "U"}
                                        </div>

                                        <div>
                                            <p className="font-medium">{u.fullName}</p>
                                            <p className="text-xs text-muted-foreground">{u.email}</p>
                                        </div>
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        Joined: {formatDate(u.createdAt)}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-700">
                                            {u.role}
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs ${u.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {u.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </>
            )}
        </div>
    )
}
