
"use client"

import { useEffect, useState, useMemo } from "react"
import {
    LayoutDashboard, Users, Shield, Briefcase, BarChart3, Megaphone,
    UserPlus, Activity, PieChart as PieIcon
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Badge } from "@/components/ui/badge"

import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts"

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"]

const navItems = [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
    // { label: "Access Control", href: "/dashboard/admin/access", icon: Briefcase },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
    // { label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
]

interface User {
    id: string
    fullName: string
    email: string
    role: string
    createdAt: string
    isActive?: boolean
}

export default function AdminDashboard() {

    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    // ✅ DATE FORMAT FUNCTION (ADD THIS ABOVE RETURN)
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

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/account/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!res.ok) return

            const data = await res.json()
            setUsers(data)

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const totalUsers = users.length

    const newThisWeek = users.filter(u => {
        const created = new Date(u.createdAt)
        const now = new Date()
        const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
        return diff <= 7
    }).length

    const roleData = useMemo(() => {
        const roleCount: any = {}

        users.forEach(u => {
            const role = u.role || "Unknown"
            roleCount[role] = (roleCount[role] || 0) + 1
        })

        return Object.keys(roleCount).map((role, index) => ({
            name: role,
            value: roleCount[role],
            color: COLORS[index % COLORS.length]
        }))
    }, [users])

    const registrationData = useMemo(() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        const result = months.map(m => ({ month: m, users: 0 }))

        users.forEach(u => {
            const d = new Date(u.createdAt)
            result[d.getMonth()].users++
        })

        return result
    }, [users])

    /* ================= ACTIVITY LOGIC ================= */

    const lastCreatedUser = [...users]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

    const lastDeactivatedUser = users
        .filter(u => !u.isActive)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

    const lastActiveUser = users
        .filter(u => u.isActive)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

    const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    if (loading) {
        return <p className="p-6 text-center">Loading dashboard...</p>
    }

    return (
        <DashboardShell navItems={navItems} role="Admin" title="Dashboard">

            {/* STATS */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Users} title="Total Users In System" value={String(totalUsers)} />

                <StatCard
                    icon={UserPlus}
                    title="New Registrations "
                    value={String(newThisWeek)}
                    description="This week "
                />

                <StatCard
                    icon={Activity}
                    title="Active Users"
                    value={String(totalUsers)}
                />

                <StatCard
                    icon={PieIcon}
                    title="Total Roles"
                    value={String(roleData.length)}
                />
            </div>

            {/* CHARTS */}
            <div className="mt-4 grid gap-3 lg:grid-cols-2">

                {/* ROLE CHART */}
                <div className="rounded-xl border bg-card p-4 shadow-sm hover:scale-105 transition-transform duration-300">
                    <h3 className="text-lg font-semibold">Role Distribution</h3>
                    <div className="mt-2 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={roleData} dataKey="value" outerRadius={90} label>
                                    {roleData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* REGISTRATION */}
                <div className="rounded-xl border bg-card p-4 shadow-sm hover:scale-105 transition-transform duration-300">
                    <h3 className="text-lg font-semibold">Registration Trends</h3>
                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={registrationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="users" radius={[8, 8, 0, 0]} fill="#6366F1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

              
                {/* RECENT USERS */}
                <div className="rounded-xl border bg-card p-4 shadow-sm hover:scale-105 transition-transform duration-300">
                    <h3 className="text-lg font-semibold">Recently Loged In Users</h3>

                    <div className="mt-4 flex flex-col gap-3 max-h-[320px] overflow-y-auto">
                        {recentUsers.map(user => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition"
                            >
                                {/* LEFT */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                                        {user.fullName.charAt(0)}
                                    </div>

                                    <div>
                                        <p className="font-medium">{user.fullName}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>

                                {/* CENTER (JOIN DATE) */}
                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                    {formatDate(user.createdAt)}
                                </div>

                                {/* RIGHT */}
                                <Badge variant="secondary">
                                    {user.role}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            {/*    */}{/* ACTIVITY */}


                {/* ACTIVITY */}

                <div className="rounded-xl border bg-card p-4 shadow-sm hover:scale-105 transition-transform duration-300">
                    <h3 className="text-lg font-semibold mb-4">System Activity</h3>

                    <div className="flex flex-col gap-3 text-sm">

                        {/* 🆕 Recently Joined (NEW) */}
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 transition">
                            <div className="w-9 h-9 flex items-center justify-center rounded-full text-white">
                                📅
                            </div>
                            <div>
                                {lastCreatedUser ? (
                                    <>
                                        <p className="font-medium text-purple-400">
                                            {lastCreatedUser.fullName}
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            Joined on {formatDate(lastCreatedUser.createdAt)}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground text-xs">
                                        No recent joinings
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 🟢 Last Registered */}
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 transition">
                            <div className="w-9 h-9 flex items-center justify-center rounded-full text-white">
                                🆕
                            </div>
                            <div>
                                {lastCreatedUser ? (
                                    <>
                                        <p className="font-medium text-green-400">
                                            {lastCreatedUser.fullName}
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            Recently registered successfully
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground text-xs">
                                        No recent registrations
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 🔴 Last Deactivated */}
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition">
                            <div className="w-9 h-9 flex items-center justify-center rounded-full text-white">
                                ❌
                            </div>
                            <div>
                                {lastDeactivatedUser ? (
                                    <>
                                        <p className="font-medium text-red-400">
                                            {lastDeactivatedUser.fullName}
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            User account was deactivated
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground text-xs">
                                        No deactivated users
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 🔵 Last Active */}
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition">
                            <div className="w-9 h-9 flex items-center justify-center rounded-full text-white">
                                ✅
                            </div>
                            <div>
                                {lastActiveUser ? (
                                    <>
                                        <p className="font-medium text-blue-400">
                                            {lastActiveUser.fullName}
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            Currently active in the system
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground text-xs">
                                        No active users
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </DashboardShell>
    )
}


