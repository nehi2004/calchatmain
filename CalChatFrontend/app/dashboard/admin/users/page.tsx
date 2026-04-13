
"use client"

import { useState, useEffect } from "react"
import {
    LayoutDashboard, Users, Shield, BarChart3,
    Search, MoreHorizontal, UserX, Edit2, Mail,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import Swal from "sweetalert2"


const navItems = [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
]

export default function AdminUsersPage() {

    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")

    // ✅ PAGINATION
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 8

    useEffect(() => {
        fetchUsers()
    }, [])

    // reset page when filter/search changes
    useEffect(() => {
        setCurrentPage(1)
    }, [search, roleFilter])

    async function fetchUsers() {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/account/users", {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (!res.ok) {
                console.error("Error:", res.status)
                return
            }

            const text = await res.text()
            const data = text ? JSON.parse(text) : []
            setUsers(data)

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    //async function handleEdit(user: any) {
    //    const newName = prompt("Enter new name", user.fullName)
    //    if (!newName) return

    //    const token = localStorage.getItem("token")

    //    await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/account/users/${user.id}`, {
    //        method: "PUT",
    //        headers: {
    //            "Content-Type": "application/json",
    //            Authorization: `Bearer ${token}`
    //        },
    //        body: JSON.stringify({ fullName: newName })
    //    })

    //    fetchUsers()
    //}

    async function handleEdit(user: any) {

        const { value: newName } = await Swal.fire({
            title: "Edit User Name",
            input: "text",
            inputValue: user.fullName,
            showCancelButton: true,
            confirmButtonText: "Update",
            inputValidator: (value) => {
                if (!value) return "Name is required!"
            }
        })

        if (!newName) return

        const token = localStorage.getItem("token")

        try {
            Swal.fire({
                title: "Updating...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            })

            const res = await fetch(
                `https://steadfast-warmth-production-64c8.up.railway.app/api/account/users/${user.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ fullName: newName })
                }
            )

            if (!res.ok) throw new Error()

            Swal.fire({
                title: "Updated!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            })

            fetchUsers()

        } catch {
            Swal.fire("Error", "Update failed", "error")
        }
    }
    //async function handleDeactivate(userId: string) {
    //    if (!confirm("Are you sure?")) return

    //    const token = localStorage.getItem("token")

    //    await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/account/users/${userId}/deactivate`, {
    //        method: "PUT",
    //        headers: { Authorization: `Bearer ${token}` }
    //    })

    //    fetchUsers()
    //}


    //async function handleDeactivate(userId: string) {

    //    const result = await Swal.fire({
    //        title: "Are you sure?",
    //        text: "This user will be deactivated!",
    //        icon: "warning",
    //        showCancelButton: true,
    //        confirmButtonColor: "#ef4444",
    //        cancelButtonColor: "#6b7280",
    //        confirmButtonText: "Yes, deactivate!",
    //        cancelButtonText: "Cancel"
    //    })

    //    if (!result.isConfirmed) return

    //    const token = localStorage.getItem("token")

    //    try {
    //        Swal.fire({
    //            title: "Processing...",
    //            allowOutsideClick: false,
    //            didOpen: () => Swal.showLoading()
    //        })

    //        const res = await fetch(
    //            `https://steadfast-warmth-production-64c8.up.railway.app/api/account/users/${userId}/deactivate`,
    //            {
    //                method: "PUT",
    //                headers: { Authorization: `Bearer ${token}` }
    //            }
    //        )

    //        if (!res.ok) throw new Error("Failed")

    //        Swal.fire({
    //            title: "Deactivated!",
    //            text: "User has been deactivated.",
    //            icon: "success",
    //            timer: 1500,
    //            showConfirmButton: false
    //        })

    //        fetchUsers()

    //    } catch (err) {
    //        Swal.fire({
    //            title: "Error!",
    //            text: "Something went wrong.",
    //            icon: "error"
    //        })
    //    }
    //}



    async function handleToggleStatus(user: any) {

        const isDeactivating = user.isActive

        const result = await Swal.fire({
            title: "Are you sure?",
            text: isDeactivating
                ? "This user will be deactivated!"
                : "This user will be activated!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: isDeactivating ? "#ef4444" : "#22c55e",
            confirmButtonText: isDeactivating ? "Yes, deactivate!" : "Yes, activate!"
        })

        if (!result.isConfirmed) return

        const token = localStorage.getItem("token")

        try {
            Swal.fire({
                title: "Processing...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            })

            const endpoint = isDeactivating
                ? `/deactivate`
                : `/activate`   // 🔥 IMPORTANT (backend me hona chahiye)

            const res = await fetch(
                `https://steadfast-warmth-production-64c8.up.railway.app/api/account/users/${user.id}${endpoint}`,
                {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            if (!res.ok) throw new Error()

            Swal.fire({
                title: isDeactivating ? "Deactivated!" : "Activated!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            })

            fetchUsers()

        } catch {
            Swal.fire("Error", "Action failed", "error")
        }
    }


    //async function handleEmail(user: any) {
    //    const message = prompt("Enter message")
    //    if (!message) return

    //    const token = localStorage.getItem("token")

    //    await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/account/send-email`, {
    //        method: "POST",
    //        headers: {
    //            "Content-Type": "application/json",
    //            Authorization: `Bearer ${token}`
    //        },
    //        body: JSON.stringify({
    //            to: user.email,
    //            subject: "Admin Message",
    //            message
    //        })
    //    })

    //    alert("Email sent ✅")
    //}
    async function handleEmail(user: any) {

        const { value: message } = await Swal.fire({
            title: "Send Email",
            input: "textarea",
            inputLabel: `To: ${user.email}`,
            inputPlaceholder: "Enter your message...",
            showCancelButton: true,
            confirmButtonText: "Send",
            inputValidator: (value) => {
                if (!value) return "Message cannot be empty!"
            }
        })

        if (!message) return

        const token = localStorage.getItem("token")

        try {
            Swal.fire({
                title: "Sending...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            })

            const res = await fetch(
                `https://steadfast-warmth-production-64c8.up.railway.app/api/account/send-email`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        to: user.email,
                        subject: "Admin Message",
                        message
                    })
                }
            )

            if (!res.ok) throw new Error()

            Swal.fire({
                title: "Email Sent!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
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
            case "admin": return "destructive"
            case "hr": return "default"
            case "professional": return "secondary"
            case "student": return "outline"
            default: return "outline"
        }
    }

    // ✅ FILTER
    const filteredUsers = users.filter((u) => {
        const role = u.role?.toLowerCase()

        const matchesSearch =
            u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())

        const matchesRole =
            roleFilter === "all" || role === roleFilter

        return matchesSearch && matchesRole
    })

    // ✅ PAGINATION LOGIC
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

    return (
        <DashboardShell navItems={navItems} role="Admin" title="Manage Users">

            <div className="flex flex-col gap-1">

                {/* SEARCH + FILTER */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="hr">HR</SelectItem>
                        </SelectContent>
                    </Select>

                </div>

                {/* TABLE */}
                <div className="rounded-xl border bg-card">

                    {loading ? (
                        <p className="p-6 text-center">Loading users...</p>
                    ) : (
                        <table className="w-full">

                            <thead className="bg-muted/30">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs">User</th>
                                    <th className="px-4 py-3 text-left text-xs">Role</th>
                                    <th className="px-4 py-3 text-left text-xs">Status</th>
                                    <th className="px-4 py-3 text-left text-xs">Joined</th>
                                    <th className="px-4 py-3 text-right text-xs">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user.id} className="border-b hover:bg-muted/20">

                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 text-xs font-semibold">
                                                    {user.fullName?.[0] || "U"}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{user.fullName}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <Badge variant={getRoleVariant(user.role)}>
                                                {user.role}
                                            </Badge>
                                        </td>

                                        <td className="px-4 py-3">
                                            <Badge variant={user.isActive ? "default" : "destructive"}>
                                                {user.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {formatDate(user.createdAt)}
                                        </td>

                                        <td className="px-4 py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(user)}>
                                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem onClick={() => handleEmail(user)}>
                                                        <Mail className="mr-2 h-4 w-4" /> Email
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
                    )}
                </div>

                {/* 🔢 NUMBER PAGINATION */}
                <div className="flex justify-center gap-2">

                    {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                            key={i}
                            size="sm"
                            variant={currentPage === i + 1 ? "default" : "outline"}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </Button>
                    ))}

                </div>

            </div>

        </DashboardShell>
    )
}