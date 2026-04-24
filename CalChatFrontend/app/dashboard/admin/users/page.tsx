
//"use client"

//import { useState, useEffect } from "react"
//import {
//    LayoutDashboard, Users, Shield, BarChart3,
//    Search, MoreHorizontal, UserX, Edit2, Mail,
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Badge } from "@/components/ui/badge"
//import {
//    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"
//import {
//    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
//} from "@/components/ui/select"
//import Swal from "sweetalert2"


//const navItems = [
//    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
//    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
//    { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
//    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
//]

//export default function AdminUsersPage() {

//    const [users, setUsers] = useState<any[]>([])
//    const [loading, setLoading] = useState(true)
//    const [search, setSearch] = useState("")
//    const [roleFilter, setRoleFilter] = useState("all")

//    // ✅ PAGINATION
//    const [currentPage, setCurrentPage] = useState(1)
//    const usersPerPage = 8

//    useEffect(() => {
//        fetchUsers()
//    }, [])

//    // reset page when filter/search changes
//    useEffect(() => {
//        setCurrentPage(1)
//    }, [search, roleFilter])

//    async function fetchUsers() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/account/users", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            if (!res.ok) {
//                console.error("Error:", res.status)
//                return
//            }

//            const text = await res.text()
//            const data = text ? JSON.parse(text) : []
//            setUsers(data)

//        } catch (err) {
//            console.error(err)
//        } finally {
//            setLoading(false)
//        }
//    }  async function handleEdit(user: any) {

//        const { value: newName } = await Swal.fire({
//            title: "Edit User Name",
//            input: "text",
//            inputValue: user.fullName,
//            showCancelButton: true,
//            confirmButtonText: "Update",
//            inputValidator: (value) => {
//                if (!value) return "Name is required!"
//            }
//        })

//        if (!newName) return

//        const token = localStorage.getItem("token")

//        try {
//            Swal.fire({
//                title: "Updating...",
//                allowOutsideClick: false,
//                didOpen: () => Swal.showLoading()
//            })

//            const res = await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/account/users/${user.id}`,
//                {
//                    method: "PUT",
//                    headers: {
//                        "Content-Type": "application/json",
//                        Authorization: `Bearer ${token}`
//                    },
//                    body: JSON.stringify({ fullName: newName })
//                }
//            )

//            if (!res.ok) throw new Error()

//            Swal.fire({
//                title: "Updated!",
//                icon: "success",
//                timer: 1500,
//                showConfirmButton: false
//            })

//            fetchUsers()

//        } catch {
//            Swal.fire("Error", "Update failed", "error")
//        }
//    }
//async function handleToggleStatus(user: any) {

//        const isDeactivating = user.isActive

//        const result = await Swal.fire({
//            title: "Are you sure?",
//            text: isDeactivating
//                ? "This user will be deactivated!"
//                : "This user will be activated!",
//            icon: "warning",
//            showCancelButton: true,
//            confirmButtonColor: isDeactivating ? "#ef4444" : "#22c55e",
//            confirmButtonText: isDeactivating ? "Yes, deactivate!" : "Yes, activate!"
//        })

//        if (!result.isConfirmed) return

//        const token = localStorage.getItem("token")

//        try {
//            Swal.fire({
//                title: "Processing...",
//                allowOutsideClick: false,
//                didOpen: () => Swal.showLoading()
//            })

//            const endpoint = isDeactivating
//                ? `/deactivate`
//                : `/activate`   // 🔥 IMPORTANT (backend me hona chahiye)

//            const res = await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/account/users/${user.id}${endpoint}`,
//                {
//                    method: "PUT",
//                    headers: { Authorization: `Bearer ${token}` }
//                }
//            )

//            if (!res.ok) throw new Error()

//            Swal.fire({
//                title: isDeactivating ? "Deactivated!" : "Activated!",
//                icon: "success",
//                timer: 1500,
//                showConfirmButton: false
//            })

//            fetchUsers()

//        } catch {
//            Swal.fire("Error", "Action failed", "error")
//        }
//    }  async function handleEmail(user: any) {

//        const { value: message } = await Swal.fire({
//            title: "Send Email",
//            input: "textarea",
//            inputLabel: `To: ${user.email}`,
//            inputPlaceholder: "Enter your message...",
//            showCancelButton: true,
//            confirmButtonText: "Send",
//            inputValidator: (value) => {
//                if (!value) return "Message cannot be empty!"
//            }
//        })

//        if (!message) return

//        const token = localStorage.getItem("token")

//        try {
//            Swal.fire({
//                title: "Sending...",
//                allowOutsideClick: false,
//                didOpen: () => Swal.showLoading()
//            })

//            const res = await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/account/send-email`,
//                {
//                    method: "POST",
//                    headers: {
//                        "Content-Type": "application/json",
//                        Authorization: `Bearer ${token}`
//                    },
//                    body: JSON.stringify({
//                        to: user.email,
//                        subject: "Admin Message",
//                        message
//                    })
//                }
//            )

//            if (!res.ok) throw new Error()

//            Swal.fire({
//                title: "Email Sent!",
//                icon: "success",
//                timer: 1500,
//                showConfirmButton: false
//            })

//        } catch {
//            Swal.fire("Error", "Email failed to send", "error")
//        }
//    }
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

//    function getRoleVariant(role: string) {
//        switch (role?.toLowerCase()) {
//            case "admin": return "destructive"
//            case "hr": return "default"
//            case "professional": return "secondary"
//            case "student": return "outline"
//            default: return "outline"
//        }
//    }

//    // ✅ FILTER
//    const filteredUsers = users.filter((u) => {
//        const role = u.role?.toLowerCase()

//        const matchesSearch =
//            u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
//            u.email?.toLowerCase().includes(search.toLowerCase())

//        const matchesRole =
//            roleFilter === "all" || role === roleFilter

//        return matchesSearch && matchesRole
//    })

//    // ✅ PAGINATION LOGIC
//    const indexOfLastUser = currentPage * usersPerPage
//    const indexOfFirstUser = indexOfLastUser - usersPerPage
//    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
//    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

//    return (
//        <DashboardShell navItems={navItems} role="Admin" title="Manage Users">

//            <div className="flex flex-col gap-1">

//                {/* SEARCH + FILTER */}
//                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//                    <div className="relative flex-1 max-w-md">
//                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                        <Input
//                            placeholder="Search users..."
//                            value={search}
//                            onChange={(e) => setSearch(e.target.value)}
//                            className="pl-10"
//                        />
//                    </div>

//                    <Select value={roleFilter} onValueChange={setRoleFilter}>
//                        <SelectTrigger className="w-40">
//                            <SelectValue placeholder="Filter by role" />
//                        </SelectTrigger>
//                        <SelectContent>
//                            <SelectItem value="all">All Roles</SelectItem>
//                            <SelectItem value="student">Student</SelectItem>
//                            <SelectItem value="personal">Personal</SelectItem>
//                            <SelectItem value="hr">HR</SelectItem>
//                            <SelectItem value="professional">Professional</SelectItem>
//                        </SelectContent>
//                    </Select>

//                </div>

//                {/* TABLE */}
//                <div className="rounded-xl border bg-card">

//                    {loading ? (
//                        <p className="p-6 text-center">Loading users...</p>
//                    ) : (
//                        <table className="w-full">

//                            <thead className="bg-muted/30">
//                                <tr>
//                                    <th className="px-4 py-3 text-left text-xs">User</th>
//                                    <th className="px-4 py-3 text-left text-xs">Role</th>
//                                    <th className="px-4 py-3 text-left text-xs">Status</th>
//                                    <th className="px-4 py-3 text-left text-xs">Joined</th>
//                                    <th className="px-4 py-3 text-right text-xs">Actions</th>
//                                </tr>
//                            </thead>

//                            <tbody>
//                                {currentUsers.map((user) => (
//                                    <tr key={user.id} className="border-b hover:bg-muted/20">

//                                        <td className="px-4 py-3">
//                                            <div className="flex items-center gap-3">
//                                                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 text-xs font-semibold">
//                                                    {user.fullName?.[0] || "U"}
//                                                </div>
//                                                <div>
//                                                    <p className="text-sm font-medium">{user.fullName}</p>
//                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
//                                                </div>
//                                            </div>
//                                        </td>

//                                        <td className="px-4 py-3">
//                                            <Badge variant={getRoleVariant(user.role)}>
//                                                {user.role}
//                                            </Badge>
//                                        </td>

//                                        <td className="px-4 py-3">
//                                            <Badge variant={user.isActive ? "default" : "destructive"}>
//                                                {user.isActive ? "Active" : "Inactive"}
//                                            </Badge>
//                                        </td>

//                                        <td className="px-4 py-3 text-sm text-muted-foreground">
//                                            {formatDate(user.createdAt)}
//                                        </td>

//                                        <td className="px-4 py-3 text-right">
//                                            <DropdownMenu>
//                                                <DropdownMenuTrigger asChild>
//                                                    <Button variant="ghost" size="icon">
//                                                        <MoreHorizontal className="h-4 w-4" />
//                                                    </Button>
//                                                </DropdownMenuTrigger>

//                                                <DropdownMenuContent align="end">
//                                                    <DropdownMenuItem onClick={() => handleEdit(user)}>
//                                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
//                                                    </DropdownMenuItem>

//                                                    <DropdownMenuItem onClick={() => handleEmail(user)}>
//                                                        <Mail className="mr-2 h-4 w-4" /> Email
//                                                    </DropdownMenuItem>

//                                                    <DropdownMenuItem
//                                                        className="text-destructive"
//                                                        onClick={() => handleToggleStatus(user)}
//                                                    >
//                                                        <UserX className="mr-2 h-4 w-4" />
//                                                        {user.isActive ? "Deactivate" : "Activate"}
//                                                    </DropdownMenuItem>
//                                                </DropdownMenuContent>
//                                            </DropdownMenu>
//                                        </td>

//                                    </tr>
//                                ))}
//                            </tbody>

//                        </table>
//                    )}
//                </div>

//                {/* 🔢 NUMBER PAGINATION */}
//                <div className="flex justify-center gap-2">

//                    {Array.from({ length: totalPages }, (_, i) => (
//                        <Button
//                            key={i}
//                            size="sm"
//                            variant={currentPage === i + 1 ? "default" : "outline"}
//                            onClick={() => setCurrentPage(i + 1)}
//                        >
//                            {i + 1}
//                        </Button>
//                    ))}

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
    Search,
    MoreHorizontal,
    UserX,
    Edit2,
    Mail,
    RefreshCw,
    UserCheck,
    UserMinus,
    Inbox,
} from "lucide-react"
import Swal from "sweetalert2"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const navItems = [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
]

const USERS_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/account/users"
const EMAIL_API = "https://steadfast-warmth-production-64c8.up.railway.app/api/account/send-email"

type UserItem = {
    id: string
    fullName: string
    email: string
    role: string
    isActive: boolean
    createdAt: string
}

function MiniStat({
    icon: Icon,
    title,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    value: string | number
}) {
    return (
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{title}</p>
                <Icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    )
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserItem[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortBy, setSortBy] = useState("newest")
    const [currentPage, setCurrentPage] = useState(1)

    const usersPerPage = 8

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        setCurrentPage(1)
    }, [search, roleFilter, statusFilter, sortBy])

    function getHeaders() {
        const token = localStorage.getItem("token")
        return {
            Authorization: `Bearer ${token}`,
        }
    }

    async function fetchUsers(isRefresh = false) {
        try {
            if (isRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            setError("")

            const res = await fetch(USERS_API, {
                headers: getHeaders(),
            })

            if (!res.ok) {
                throw new Error(`Failed with status ${res.status}`)
            }

            const text = await res.text()
            const data = text ? JSON.parse(text) : []
            setUsers(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error(err)
            setError("Unable to load users right now.")
            setUsers([])
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    async function handleEdit(user: UserItem) {
        const { value: newName } = await Swal.fire({
            title: "Edit User Name",
            input: "text",
            inputValue: user.fullName,
            showCancelButton: true,
            confirmButtonText: "Update",
            inputValidator: (value) => {
                if (!value?.trim()) return "Name is required!"
            },
        })

        if (!newName) return

        try {
            Swal.fire({
                title: "Updating...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            })

            const res = await fetch(`${USERS_API}/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...getHeaders(),
                },
                body: JSON.stringify({ fullName: newName.trim() }),
            })

            if (!res.ok) throw new Error()

            await Swal.fire({
                title: "Updated!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            })

            fetchUsers(true)
        } catch {
            Swal.fire("Error", "Update failed", "error")
        }
    }

    async function handleToggleStatus(user: UserItem) {
        const isDeactivating = user.isActive

        const result = await Swal.fire({
            title: "Are you sure?",
            text: isDeactivating
                ? "This user will be deactivated!"
                : "This user will be activated!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: isDeactivating ? "#ef4444" : "#22c55e",
            confirmButtonText: isDeactivating ? "Yes, deactivate!" : "Yes, activate!",
        })

        if (!result.isConfirmed) return

        try {
            Swal.fire({
                title: "Processing...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            })

            const endpoint = isDeactivating ? "/deactivate" : "/activate"

            const res = await fetch(`${USERS_API}/${user.id}${endpoint}`, {
                method: "PUT",
                headers: getHeaders(),
            })

            if (!res.ok) throw new Error()

            await Swal.fire({
                title: isDeactivating ? "Deactivated!" : "Activated!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            })

            fetchUsers(true)
        } catch {
            Swal.fire("Error", "Action failed", "error")
        }
    }

    async function handleEmail(user: UserItem) {
        const { value: formValues } = await Swal.fire({
            title: "Send Email",
            html: `
                <input id="swal-subject" class="swal2-input" placeholder="Subject" value="Admin Message" />
                <textarea id="swal-message" class="swal2-textarea" placeholder="Enter your message..."></textarea>
            `,
            showCancelButton: true,
            confirmButtonText: "Send",
            focusConfirm: false,
            preConfirm: () => {
                const subject = (document.getElementById("swal-subject") as HTMLInputElement)?.value
                const message = (document.getElementById("swal-message") as HTMLTextAreaElement)?.value

                if (!subject?.trim() || !message?.trim()) {
                    Swal.showValidationMessage("Subject and message are required!")
                    return
                }

                return { subject: subject.trim(), message: message.trim() }
            },
        })

        if (!formValues) return

        try {
            Swal.fire({
                title: "Sending...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            })

            const res = await fetch(EMAIL_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getHeaders(),
                },
                body: JSON.stringify({
                    to: user.email,
                    subject: formValues.subject,
                    message: formValues.message,
                }),
            })

            if (!res.ok) throw new Error()

            Swal.fire({
                title: "Email Sent!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            })
        } catch {
            Swal.fire("Error", "Email failed to send", "error")
        }
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

    function getRoleVariant(role: string) {
        switch (role?.toLowerCase()) {
            case "admin":
                return "destructive" as const
            case "hr":
                return "default" as const
            case "professional":
                return "secondary" as const
            case "student":
            case "personal":
                return "outline" as const
            default:
                return "outline" as const
        }
    }

    const filteredUsers = useMemo(() => {
        let result = [...users]

        result = result.filter((u) => {
            const role = u.role?.toLowerCase()
            const matchesSearch =
                u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                u.email?.toLowerCase().includes(search.toLowerCase())

            const matchesRole = roleFilter === "all" || role === roleFilter
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && u.isActive) ||
                (statusFilter === "inactive" && !u.isActive)

            return matchesSearch && matchesRole && matchesStatus
        })

        result.sort((a, b) => {
            switch (sortBy) {
                case "name-asc":
                    return a.fullName.localeCompare(b.fullName)
                case "name-desc":
                    return b.fullName.localeCompare(a.fullName)
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                case "role":
                    return a.role.localeCompare(b.role)
                case "newest":
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
        })

        return result
    }, [users, search, roleFilter, statusFilter, sortBy])

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage))
    const safeCurrentPage = Math.min(currentPage, totalPages)
    const indexOfLastUser = safeCurrentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.isActive).length
    const inactiveUsers = users.filter((u) => !u.isActive).length
    const admins = users.filter((u) => u.role?.toLowerCase() === "admin").length

    return (
        <DashboardShell navItems={navItems} role="Admin" title="Manage Users">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">Manage Users</h2>
                        <p className="text-sm text-muted-foreground">
                            Search, filter, and manage platform users
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

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <MiniStat icon={Users} title="Total Users" value={totalUsers} />
                    <MiniStat icon={UserCheck} title="Active Users" value={activeUsers} />
                    <MiniStat icon={UserMinus} title="Inactive Users" value={inactiveUsers} />
                    <MiniStat icon={Shield} title="Admins" value={admins} />
                </div>

                <div className="grid gap-3 lg:grid-cols-[1fr_160px_160px_180px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="hr">HR</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="name-asc">Name A-Z</SelectItem>
                            <SelectItem value="name-desc">Name Z-A</SelectItem>
                            <SelectItem value="role">Role</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                    {loading ? (
                        <div className="p-10 text-center text-sm text-muted-foreground">
                            Loading users...
                        </div>
                    ) : currentUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
                            <Inbox className="h-10 w-10 text-muted-foreground" />
                            <div>
                                <p className="font-medium">No users found</p>
                                <p className="text-sm text-muted-foreground">
                                    Try changing your search or filters.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px]">
                                <thead className="bg-muted/40">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            User
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Role
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Joined
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentUsers.map((user) => (
                                        <tr key={user.id} className="border-t hover:bg-muted/20">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                                        {user.fullName?.[0] || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{user.fullName}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <Badge variant={getRoleVariant(user.role)}>
                                                    {user.role}
                                                </Badge>
                                            </td>

                                            <td className="px-4 py-4">
                                                <Badge variant={user.isActive ? "default" : "destructive"}>
                                                    {user.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </td>

                                            <td className="px-4 py-4 text-sm text-muted-foreground">
                                                {formatDate(user.createdAt)}
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                                                            <Edit2 className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem onClick={() => handleEmail(user)}>
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            Email
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => handleToggleStatus(user)}
                                                        >
                                                            <UserX className="mr-2 h-4 w-4" />
                                                            {user.isActive ? "Deactivate" : "Activate"}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <p className="text-sm text-muted-foreground">
                        Showing {filteredUsers.length === 0 ? 0 : indexOfFirstUser + 1}-
                        {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={safeCurrentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        >
                            Previous
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <Button
                                key={i}
                                size="sm"
                                variant={safeCurrentPage === i + 1 ? "default" : "outline"}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </Button>
                        ))}

                        <Button
                            size="sm"
                            variant="outline"
                            disabled={safeCurrentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardShell>
    )
}


