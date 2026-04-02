//"use client"

//import { LayoutDashboard, Users, Shield, Briefcase, BarChart3, Megaphone, UserPlus, Activity, PiIcon as PieIcon } from "lucide-react"
//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { StatCard } from "@/components/dashboard/stat-card"
//import { Badge } from "@/components/ui/badge"
//import {
//  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
//  BarChart, Bar, XAxis, YAxis, CartesianGrid,
//} from "recharts"

//const navItems = [
//  { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
//  { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
//  { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
//  { label: "Access Control", href: "/dashboard/admin/access", icon: Briefcase },
//  { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
//  { label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
//]

//const roleData = [
//  { name: "Students", value: 2450, color: "hsl(var(--chart-1))" },
//  { name: "Personal", value: 1280, color: "hsl(var(--chart-2))" },
//  { name: "Professional", value: 890, color: "hsl(var(--chart-3))" },
//  { name: "Admin", value: 12, color: "hsl(var(--chart-4))" },
//]

//const recentRegistrations = [
//  { name: "Sarah Miller", email: "sarah@example.com", role: "Student", date: "Feb 9, 2026" },
//  { name: "James Wilson", email: "james@example.com", role: "Professional", date: "Feb 9, 2026" },
//  { name: "Emily Brown", email: "emily@example.com", role: "Personal", date: "Feb 8, 2026" },
//  { name: "Michael Chen", email: "michael@example.com", role: "Student", date: "Feb 8, 2026" },
//  { name: "Anna Lopez", email: "anna@example.com", role: "Professional", date: "Feb 7, 2026" },
//]

//const activityLogs = [
//  { action: "User role updated", details: "james@example.com -> Admin", time: "10 min ago", type: "Role" },
//  { action: "New announcement posted", details: "System maintenance scheduled", time: "1h ago", type: "System" },
//  { action: "User deactivated", details: "inactive_user@test.com", time: "2h ago", type: "User" },
//  { action: "Bulk import completed", details: "45 new users added", time: "3h ago", type: "User" },
//  { action: "Access policy changed", details: "Professional tier updated", time: "5h ago", type: "Policy" },
//]

//const registrationData = [
//  { month: "Sep", users: 320 },
//  { month: "Oct", users: 450 },
//  { month: "Nov", users: 380 },
//  { month: "Dec", users: 520 },
//  { month: "Jan", users: 610 },
//  { month: "Feb", users: 480 },
//]

//export default function AdminDashboard() {
//  return (
//    <DashboardShell navItems={navItems} role="Admin" title="Dashboard">
//      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//        <StatCard icon={Users} title="Total Users" value="4,632" trend="+128 this month" />
//        <StatCard icon={UserPlus} title="New Registrations" value="48" description="This week" trend="+12%" />
//        <StatCard icon={Activity} title="Active Sessions" value="312" description="Right now" />
//        <StatCard icon={PieIcon} title="System Uptime" value="99.9%" description="Last 30 days" />
//      </div>

//      <div className="mt-6 grid gap-6 lg:grid-cols-2">
//        {/* Role Distribution Chart */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Role Distribution</h3>
//          <div className="mt-4 flex items-center gap-6">
//            <div className="h-56 flex-1">
//              <ResponsiveContainer width="100%" height="100%">
//                <PieChart>
//                  <Pie
//                    data={roleData}
//                    cx="50%"
//                    cy="50%"
//                    innerRadius={50}
//                    outerRadius={80}
//                    paddingAngle={4}
//                    dataKey="value"
//                  >
//                    {roleData.map((entry, index) => (
//                      <Cell key={`cell-${index}`} fill={entry.color} />
//                    ))}
//                  </Pie>
//                  <Tooltip
//                    contentStyle={{
//                      backgroundColor: 'hsl(var(--card))',
//                      border: '1px solid hsl(var(--border))',
//                      borderRadius: '8px',
//                      color: 'hsl(var(--card-foreground))',
//                    }}
//                  />
//                </PieChart>
//              </ResponsiveContainer>
//            </div>
//            <div className="flex flex-col gap-3">
//              {roleData.map((role) => (
//                <div key={role.name} className="flex items-center gap-3">
//                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: role.color }} />
//                  <div>
//                    <p className="text-sm font-medium text-card-foreground">{role.name}</p>
//                    <p className="text-xs text-muted-foreground">{role.value.toLocaleString()}</p>
//                  </div>
//                </div>
//              ))}
//            </div>
//          </div>
//        </div>

//        {/* Registration Trends */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Registration Trends</h3>
//          <div className="mt-4 h-56">
//            <ResponsiveContainer width="100%" height="100%">
//              <BarChart data={registrationData}>
//                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
//                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
//                <Tooltip
//                  contentStyle={{
//                    backgroundColor: 'hsl(var(--card))',
//                    border: '1px solid hsl(var(--border))',
//                    borderRadius: '8px',
//                    color: 'hsl(var(--card-foreground))',
//                  }}
//                />
//                <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
//              </BarChart>
//            </ResponsiveContainer>
//          </div>
//        </div>

//        {/* Recent Registrations */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">Recent Registrations</h3>
//          <div className="mt-4 flex flex-col gap-3">
//            {recentRegistrations.map((user) => (
//              <div key={user.email} className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
//                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
//                  {user.name.split(" ").map(n => n[0]).join("")}
//                </div>
//                <div className="flex-1">
//                  <p className="text-sm font-medium text-card-foreground">{user.name}</p>
//                  <p className="text-xs text-muted-foreground">{user.email}</p>
//                </div>
//                <div className="text-right">
//                  <Badge variant="secondary">{user.role}</Badge>
//                  <p className="mt-1 text-xs text-muted-foreground">{user.date}</p>
//                </div>
//              </div>
//            ))}
//          </div>
//        </div>

//        {/* System Activity Logs */}
//        <div className="rounded-xl border border-border bg-card p-6">
//          <h3 className="font-heading text-lg font-semibold text-card-foreground">System Activity Logs</h3>
//          <div className="mt-4 flex flex-col gap-3">
//            {activityLogs.map((log, i) => (
//              <div key={i} className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
//                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
//                  <Activity className="h-4 w-4 text-accent" />
//                </div>
//                <div className="flex-1">
//                  <p className="text-sm font-medium text-card-foreground">{log.action}</p>
//                  <p className="text-xs text-muted-foreground">{log.details}</p>
//                </div>
//                <div className="text-right">
//                  <Badge variant="outline">{log.type}</Badge>
//                  <p className="mt-1 text-xs text-muted-foreground">{log.time}</p>
//                </div>
//              </div>
//            ))}
//          </div>
//        </div>
//      </div>
//    </DashboardShell>
//  )
//}

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
//    BarChart, Bar, XAxis, YAxis, CartesianGrid,
//} from "recharts"

///* ================= NAV ================= */

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
//    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
//    { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
//    { label: "Access Control", href: "/dashboard/admin/access", icon: Briefcase },
//    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
//    { label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
//]

///* ================= TYPES ================= */

//interface User {
//    id: string
//    fullName: string
//    email: string
//    role: string
//    createdAt: string
//}

///* ================= COMPONENT ================= */

//export default function AdminDashboard() {

//    const [users, setUsers] = useState<User[]>([])
//    const [loading, setLoading] = useState(true)

//    useEffect(() => {
//        fetchUsers()
//    }, [])

//    async function fetchUsers() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchat-backend.onrender.com//api/account/users", {
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

//    /* ================= STATS ================= */

//    const totalUsers = users.length

//    const newThisWeek = users.filter(u => {
//        const created = new Date(u.createdAt)
//        const now = new Date()
//        const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
//        return diff <= 7
//    }).length

//    /* ================= ROLE DATA ================= */

//    const roleData = useMemo(() => {
//        const roleCount: any = {}

//        users.forEach(u => {
//            const role = u.role || "Unknown"
//            roleCount[role] = (roleCount[role] || 0) + 1
//        })

//        return Object.keys(roleCount).map((role, index) => ({
//            name: role,
//            value: roleCount[role],
//            color: `hsl(var(--chart-${index + 1}))`
//        }))
//    }, [users])

//    /* ================= MONTHLY REG ================= */

//    const registrationData = useMemo(() => {

//        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

//        const result = months.map(m => ({
//            month: m,
//            users: 0
//        }))

//        users.forEach(u => {
//            const d = new Date(u.createdAt)
//            const index = d.getMonth()
//            result[index].users++
//        })

//        return result

//    }, [users])

//    /* ================= RECENT USERS ================= */

//    const recentUsers = [...users]
//        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//        .slice(0, 5)

//    /* ================= LOADING ================= */

//    if (loading) {
//        return <p className="p-6 text-center">Loading dashboard...</p>
//    }

//    return (
//        <DashboardShell navItems={navItems} role="Admin" title="Dashboard">

//            {/* STATS */}
//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

//                <StatCard icon={Users} title="Total Users" value={String(totalUsers)} />

//                <StatCard
//                    icon={UserPlus}
//                    title="New Registrations"
//                    value={String(newThisWeek)}
//                    description="This week"
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
//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* ROLE CHART */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="text-lg font-semibold">Role Distribution</h3>

//                    <div className="mt-4 h-56">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <PieChart>
//                                <Pie data={roleData} dataKey="value" outerRadius={80}>
//                                    {roleData.map((entry, index) => (
//                                        <Cell key={index} fill={entry.color} />
//                                    ))}
//                                </Pie>
//                                <Tooltip />
//                            </PieChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>

//                {/* REGISTRATION */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="text-lg font-semibold">Registration Trends</h3>

//                    <div className="mt-4 h-56">
//                        <ResponsiveContainer width="100%" height="100%">
//                            <BarChart data={registrationData}>
//                                <CartesianGrid strokeDasharray="3 3" />
//                                <XAxis dataKey="month" />
//                                <YAxis />
//                                <Tooltip />
//                                <Bar dataKey="users" />
//                            </BarChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>

//                {/* RECENT USERS */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="text-lg font-semibold">Recent Users</h3>

//                    <div className="mt-4 flex flex-col gap-3">
//                        {recentUsers.map(user => (
//                            <div key={user.id} className="flex justify-between text-sm">
//                                <span>{user.fullName}</span>
//                                <span className="text-muted-foreground">{user.role}</span>
//                            </div>
//                        ))}
//                    </div>
//                </div>

//                {/* ACTIVITY (STATIC OK) */}
//                <div className="rounded-xl border bg-card p-6">
//                    <h3 className="text-lg font-semibold">System Activity</h3>

//                    <p className="text-sm text-muted-foreground mt-2">
//                        Activity logs feature coming soon...
//                    </p>
//                </div>

//            </div>

//        </DashboardShell>
//    )
//}






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
//    //{ label: "Access Control", href: "/dashboard/admin/access", icon: Briefcase },
//    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
////    { label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
//]

//interface User {
//    id: string
//    fullName: string
//    email: string
//    role: string
//    createdAt: string
//}

//export default function AdminDashboard() {

//    const [users, setUsers] = useState<User[]>([])
//    const [loading, setLoading] = useState(true)

//    useEffect(() => {
//        fetchUsers()
//    }, [])

//    async function fetchUsers() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchat-backend.onrender.com//api/account/users", {
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

//    const recentUsers = [...users]
//        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//        .slice(0, 5)

//    if (loading) {
//        return <p className="p-6 text-center">Loading dashboard...</p>
//    }

//    return (
//        <DashboardShell navItems={navItems} role="Admin" title="Dashboard">

//            {/* STATS */}
//            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

//                <StatCard icon={Users} title="Total Users" value={String(totalUsers)} />

//                <StatCard
//                    icon={UserPlus}
//                    title="New Registrations"
//                    value={String(newThisWeek)}
//                    description="This week"
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
//            <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                {/* ROLE CHART */}
//                <div className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition">
//                    <h3 className="text-lg font-semibold">Role Distribution</h3>

//                    <div className="mt-4 h-64">
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
//                <div className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition">
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
//                <div className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition">
//                    <h3 className="text-lg font-semibold">Recent Users</h3>

//                    <div className="mt-4 flex flex-col gap-3">
//                        {recentUsers.map(user => (
//                            <div
//                                key={user.id}
//                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition"
//                            >
//                                <div className="flex items-center gap-3">

//                                    <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
//                                        {user.fullName.charAt(0)}
//                                    </div>

//                                    <div>
//                                        <p className="font-medium">{user.fullName}</p>
//                                        <p className="text-xs text-muted-foreground">{user.email}</p>
//                                    </div>

//                                </div>

//                                <Badge variant="secondary">{user.role}</Badge>
//                            </div>
//                        ))}
//                    </div>
//                </div>

//                {/* ACTIVITY */}
//                <div className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition">
//                    <h3 className="text-lg font-semibold">System Activity</h3>

//                    <div className="mt-4 space-y-3 text-sm">
//                        <p className="text-muted-foreground">✔ New users registered</p>
//                        <p className="text-muted-foreground">✔ Roles updated</p>
//                        <p className="text-muted-foreground">✔ System running smoothly</p>
//                    </div>
//                </div>

//            </div>

//        </DashboardShell>
//    )
//}




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

            const res = await fetch("https://calchat-backend.onrender.com//api/account/users", {
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
                {/*<div className="rounded-xl border bg-card p-4 shadow-sm hover:scale-105 transition-transform duration-300">*/}
                {/*    <h3 className="text-lg font-semibold">Recent Users</h3>*/}
                {/*    <div className="mt-4 flex flex-col gap-3 max-h-[320px] overflow-y-auto">*/}
                {/*        {recentUsers.map(user => (*/}
                {/*            <div*/}
                {/*                key={user.id}*/}
                {/*                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition"*/}
                {/*            >*/}
                {/*                <div className="flex items-center gap-3">*/}
                {/*                    <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">*/}
                {/*                        {user.fullName.charAt(0)}*/}
                {/*                    </div>*/}
                {/*                    <div>*/}
                {/*                        <p className="font-medium">{user.fullName}</p>*/}
                {/*                        <p className="text-xs text-muted-foreground">{user.email}</p>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <Badge variant="secondary">{user.role}</Badge>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</div>*/}
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

            {/*    <div className="rounded-xl border bg-card p-4 shadow-sm hover:scale-105 transition-transform duration-300">*/}
            {/*        <h3 className="text-lg font-semibold mb-4">System Activity</h3>*/}

            {/*        <div className="flex flex-col gap-3 text-sm">*/}

            {/*            */}{/* 🟢 Last Registered */}
            {/*            <div className="flex items-start gap-3 p-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 transition">*/}
            {/*                <div className="w-9 h-9 flex items-center justify-center rounded-full  text-white">*/}
            {/*                    🆕*/}
            {/*                </div>*/}
            {/*                <div>*/}
            {/*                    {lastCreatedUser ? (*/}
            {/*                        <>*/}
            {/*                            <p className="font-medium text-green-400">*/}
            {/*                                {lastCreatedUser.fullName}*/}
            {/*                            </p>*/}
            {/*                            <p className="text-muted-foreground text-xs">*/}
            {/*                                Recently registered successfully*/}
            {/*                            </p>*/}
            {/*                        </>*/}
            {/*                    ) : (*/}
            {/*                        <p className="text-muted-foreground text-xs">*/}
            {/*                            No recent registrations*/}
            {/*                        </p>*/}
            {/*                    )}*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*            */}{/* 🔴 Last Deactivated */}
            {/*            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition">*/}
            {/*                <div className="w-9 h-9 flex items-center justify-center rounded-full text-white">*/}
            {/*                    ❌*/}
            {/*                </div>*/}
            {/*                <div>*/}
            {/*                    {lastDeactivatedUser ? (*/}
            {/*                        <>*/}
            {/*                            <p className="font-medium text-red-400">*/}
            {/*                                {lastDeactivatedUser.fullName}*/}
            {/*                            </p>*/}
            {/*                            <p className="text-muted-foreground text-xs">*/}
            {/*                                User account was deactivated*/}
            {/*                            </p>*/}
            {/*                        </>*/}
            {/*                    ) : (*/}
            {/*                        <p className="text-muted-foreground text-xs">*/}
            {/*                            No deactivated users*/}
            {/*                        </p>*/}
            {/*                    )}*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*            */}{/* 🟢 Last Active */}
            {/*            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition">*/}
            {/*                <div className="w-9 h-9 flex items-center justify-center rounded-full  text-white">*/}
            {/*                    ✅*/}
            {/*                </div>*/}
            {/*                <div>*/}
            {/*                    {lastActiveUser ? (*/}
            {/*                        <>*/}
            {/*                            <p className="font-medium text-blue-400">*/}
            {/*                                {lastActiveUser.fullName}*/}
            {/*                            </p>*/}
            {/*                            <p className="text-muted-foreground text-xs">*/}
            {/*                                Currently active in the system*/}
            {/*                            </p>*/}
            {/*                        </>*/}
            {/*                    ) : (*/}
            {/*                        <p className="text-muted-foreground text-xs">*/}
            {/*                            No active users*/}
            {/*                        </p>*/}
            {/*                    )}*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*        </div>*/}
            {/*    </div>*/}

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






//"use client"

//import { useEffect, useState, useMemo } from "react"
//import {
//    LayoutDashboard, Users, Shield, BarChart3,
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
//    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
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

//    useEffect(() => {
//        fetchUsers()
//    }, [])

//    async function fetchUsers() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchat-backend.onrender.com//api/account/users", {
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

//    /* ================= STATS ================= */

//    const totalUsers = users.length

//    const newThisWeek = users.filter(u => {
//        const diff = (Date.now() - new Date(u.createdAt).getTime()) / (1000 * 60 * 60 * 24)
//        return diff <= 7
//    }).length

//    /* ================= CHART DATA ================= */

//    const roleData = useMemo(() => {
//        const roleCount: any = {}

//        users.forEach(u => {
//            const role = u.role || "Unknown"
//            roleCount[role] = (roleCount[role] || 0) + 1
//        })

//        return Object.keys(roleCount).map((role, i) => ({
//            name: role,
//            value: roleCount[role],
//            color: COLORS[i % COLORS.length]
//        }))
//    }, [users])

//    const registrationData = useMemo(() => {
//        const months = Array.from({ length: 12 }, (_, i) => ({
//            month: new Date(0, i).toLocaleString("default", { month: "short" }),
//            users: 0
//        }))

//        users.forEach(u => {
//            months[new Date(u.createdAt).getMonth()].users++
//        })

//        return months
//    }, [users])

//    /* ================= ACTIVITY ================= */

//    const lastCreatedUser = [...users].sort(
//        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
//    )[0]

//    const lastDeactivatedUser = users
//        .filter(u => !u.isActive)
//        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0]

//    const lastActiveUser = users
//        .filter(u => u.isActive)
//        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0]

//    const recentUsers = [...users].sort(
//        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
//    )

//    if (loading) {
//        return <p className="p-4 text-center text-sm">Loading dashboard...</p>
//    }

//    return (
//        <DashboardShell navItems={navItems} role="Admin" title="Dashboard">

//            {/* 🔹 STATS (ULTRA COMPACT) */}
//            <div className="grid gap-1.5 md:grid-cols-2 lg:grid-cols-4">
//                <StatCard icon={Users} title="Users" value={String(totalUsers)} />
//                <StatCard icon={UserPlus} title="New" value={String(newThisWeek)} />
//                <StatCard icon={Activity} title="Active" value={String(totalUsers)} />
//                <StatCard icon={PieIcon} title="Roles" value={String(roleData.length)} />
//            </div>

//            {/* 🔹 MAIN GRID */}
//            <div className="mt-2 grid gap-2 lg:grid-cols-2">

//                {/* 🔸 ROLE CHART */}
//                <div className="rounded-md border p-2 shadow-sm">
//                    <h3 className="text-xs font-semibold mb-1">Role Distribution</h3>

//                    <div className="h-[200px]">
//                        <ResponsiveContainer>
//                            <PieChart>
//                                <Pie
//                                    data={roleData}
//                                    dataKey="value"
//                                    outerRadius={70}
//                                    innerRadius={35}
//                                    paddingAngle={2}
//                                >
//                                    {roleData.map((e, i) => (
//                                        <Cell key={i} fill={e.color} />
//                                    ))}
//                                </Pie>
//                                <Tooltip />
//                                <Legend wrapperStyle={{ fontSize: "10px" }} />
//                            </PieChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>

//                {/* 🔸 REGISTRATION */}
//                <div className="rounded-md border p-2 shadow-sm">
//                    <h3 className="text-xs font-semibold mb-1">Registrations</h3>

//                    <div className="h-[200px]">
//                        <ResponsiveContainer>
//                            <BarChart data={registrationData} margin={{ right: 5, left: -10 }}>
//                                <CartesianGrid strokeDasharray="3 3" />
//                                <XAxis dataKey="month" tick={{ fontSize: 9 }} />
//                                <YAxis tick={{ fontSize: 9 }} />
//                                <Tooltip />
//                                <Bar dataKey="users" radius={[5, 5, 0, 0]} fill="#6366F1" />
//                            </BarChart>
//                        </ResponsiveContainer>
//                    </div>
//                </div>

//                {/* 🔸 RECENT USERS */}
//                <div className="rounded-md border p-2 shadow-sm">
//                    <h3 className="text-xs font-semibold mb-1">Recent Users</h3>

//                    <div className="max-h-[200px] overflow-y-auto space-y-1">
//                        {recentUsers.map(user => (
//                            <div
//                                key={user.id}
//                                className="flex justify-between items-center p-1.5 rounded-md hover:bg-muted"
//                            >
//                                <div className="flex gap-2 items-center">
//                                    <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
//                                        {user.fullName[0]}
//                                    </div>
//                                    <div>
//                                        <p className="text-[11px] font-medium">{user.fullName}</p>
//                                        <p className="text-[9px] text-muted-foreground">{user.email}</p>
//                                    </div>
//                                </div>
//                                <Badge className="text-[9px] px-1 py-0">{user.role}</Badge>
//                            </div>
//                        ))}
//                    </div>
//                </div>

//                {/* 🔸 ACTIVITY */}
//                {/* 🔸 ACTIVITY (COMPACT + DETAILED) */}
//                <div className="rounded-md border p-2 shadow-sm">
//                    <h3 className="text-xs font-semibold mb-2">System Activity</h3>

//                    <div className="space-y-2 text-[11px]">

//                        {/* 🟢 Last Registered */}
//                        <div className="flex items-center gap-2 p-1.5 rounded-md bg-green-500/10 hover:bg-green-500/20 transition">
//                            <div className="w-6 h-6 flex items-center justify-center rounded-full text-[12px]">
//                                🆕
//                            </div>
//                            <div className="leading-tight">
//                                <p className="font-medium text-green-400 text-[11px]">
//                                    {lastCreatedUser?.fullName || "No new user"}
//                                </p>
//                                <p className="text-[9px] text-muted-foreground">
//                                    Registered recently
//                                </p>
//                            </div>
//                        </div>

//                        {/* 🔴 Last Deactivated */}
//                        <div className="flex items-center gap-2 p-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 transition">
//                            <div className="w-6 h-6 flex items-center justify-center rounded-full text-[12px]">
//                                ❌
//                            </div>
//                            <div className="leading-tight">
//                                <p className="font-medium text-red-400 text-[11px]">
//                                    {lastDeactivatedUser?.fullName || "No deactivation"}
//                                </p>
//                                <p className="text-[9px] text-muted-foreground">
//                                    Account deactivated
//                                </p>
//                            </div>
//                        </div>

//                        {/* 🔵 Last Active */}
//                        <div className="flex items-center gap-2 p-1.5 rounded-md bg-blue-500/10 hover:bg-blue-500/20 transition">
//                            <div className="w-6 h-6 flex items-center justify-center rounded-full text-[12px]">
//                                ✅
//                            </div>
//                            <div className="leading-tight">
//                                <p className="font-medium text-blue-400 text-[11px]">
//                                    {lastActiveUser?.fullName || "No active user"}
//                                </p>
//                                <p className="text-[9px] text-muted-foreground">
//                                    Currently active
//                                </p>
//                            </div>
//                        </div>

//                    </div>
//                </div>

//            </div>

//        </DashboardShell>
//    )
//}