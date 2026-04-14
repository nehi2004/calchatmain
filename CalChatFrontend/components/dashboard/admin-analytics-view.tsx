

"use client"

import { useEffect, useState } from "react"
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Activity, Layers, UserCheck, UserX, Calendar } from "lucide-react"

interface User {
    id: string
    fullName: string
    email: string
    role: string
    createdAt: string
    isActive?: boolean
}

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"]

export default function AdminAnalyticsView() {

    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

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

            const data = await res.json()
            setUsers(data)

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // ✅ DATE FORMAT
    function formatDate(date: string) {
        const d = new Date(date)
        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    const totalUsers = users.length

    // ✅ ACTIVE / INACTIVE
    const activeUsers = users.filter(u => u.isActive).length
    const inactiveUsers = users.filter(u => !u.isActive).length

    // ✅ TODAY JOINED
    const today = new Date().toDateString()
    const todayJoined = users.filter(
        u => new Date(u.createdAt).toDateString() === today
    ).length

    // ✅ THIS MONTH JOINED
    const currentMonth = new Date().getMonth()
    const thisMonthJoined = users.filter(
        u => new Date(u.createdAt).getMonth() === currentMonth
    ).length

    // ✅ ROLE COUNT
    const roleCount: any = {}
    users.forEach((u) => {
        const role = u.role || "Unknown"
        roleCount[role] = (roleCount[role] || 0) + 1
    })

    const roleData = Object.keys(roleCount).map((role) => ({
        name: role,
        value: roleCount[role]
    }))

    // ✅ USERS PER MONTH
    const monthCount: any = {}
    users.forEach((u) => {
        const date = new Date(u.createdAt)
        const month = date.toLocaleString("default", { month: "short" })
        monthCount[month] = (monthCount[month] || 0) + 1
    })

    const monthData = Object.keys(monthCount).map((month) => ({
        month,
        users: monthCount[month]
    }))

    // ✅ RECENT USERS
    const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

    if (loading) {
        return <p className="text-center p-6">Loading analytics...</p>
    }

    return (
        <div className="flex flex-col gap-6">

            {/* 🔥 STATS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

                <Card><CardContent className="p-4 flex justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <h2 className="text-xl font-bold">{totalUsers}</h2>
                    </div>
                    <Users />
                </CardContent></Card>

                <Card><CardContent className="p-4 flex justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">Active</p>
                        <h2 className="text-xl font-bold text-green-500">{activeUsers}</h2>
                    </div>
                    <UserCheck />
                </CardContent></Card>

                <Card><CardContent className="p-4 flex justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">Inactive</p>
                        <h2 className="text-xl font-bold text-red-500">{inactiveUsers}</h2>
                    </div>
                    <UserX />
                </CardContent></Card>

                <Card><CardContent className="p-4 flex justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">Today</p>
                        <h2 className="text-xl font-bold">{todayJoined}</h2>
                    </div>
                    <Activity />
                </CardContent></Card>

                <Card><CardContent className="p-4 flex justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">This Month</p>
                        <h2 className="text-xl font-bold">{thisMonthJoined}</h2>
                    </div>
                    <Calendar />
                </CardContent></Card>

                <Card><CardContent className="p-4 flex justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">Roles</p>
                        <h2 className="text-xl font-bold">{roleData.length}</h2>
                    </div>
                    <Layers />
                </CardContent></Card>

            </div>

            {/* 📊 CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* BAR */}
                <Card className="p-4">
                    <p className="mb-2 font-semibold">Users Joined Per Month</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="users" radius={[6, 6, 0, 0]} fill="#6366F1" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* PIE */}
                <Card className="p-4">
                    <p className="mb-2 font-semibold">Users by Role</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={roleData} dataKey="value" nameKey="name" outerRadius={100} label>
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
            {/* 🆕 RECENT USERS */}
            <Card className="p-4">
                <p className="mb-4 font-semibold">Recent Users</p>

                {/* ✅ SCROLL AFTER 4 USERS */}
                <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">

                    {recentUsers.map((u) => (
                        <div
                            key={u.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition"
                        >
                            {/* LEFT */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                                    {u.fullName.charAt(0)}
                                </div>

                                <div>
                                    <p className="font-medium">{u.fullName}</p>
                                    <p className="text-xs text-muted-foreground">{u.email}</p>
                                </div>
                            </div>

                            {/* ✅ MIDDLE (JOIN DATE) */}
                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                                Joined Date: {formatDate(u.createdAt)}
                            </div>

                            {/* RIGHT */}
                            <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-600">
                                {u.role}
                            </span>
                        </div>
                    ))}

                </div>
            </Card>

        </div>
    )
}