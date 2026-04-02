//"use client"

//import { useState } from "react"
//import {
//  LayoutDashboard, Users, Shield, Briefcase, BarChart3, Megaphone,
//  Search, MoreHorizontal, UserX, Edit2, Mail,
//} from "lucide-react"
//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Badge } from "@/components/ui/badge"
//import {
//  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

//const navItems = [
//  { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
//  { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
//  { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
//  { label: "Access Control", href: "/dashboard/admin/access", icon: Briefcase },
//  { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
//  { label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
//]

//const USERS = [
//  { id: "1", name: "Sarah Miller", email: "sarah@example.com", role: "Student", status: "Active", joined: "Jan 15, 2026" },
//  { id: "2", name: "James Wilson", email: "james@example.com", role: "Professional", status: "Active", joined: "Jan 20, 2026" },
//  { id: "3", name: "Emily Brown", email: "emily@example.com", role: "Personal", status: "Active", joined: "Feb 1, 2026" },
//  { id: "4", name: "Michael Chen", email: "michael@example.com", role: "Student", status: "Inactive", joined: "Dec 10, 2025" },
//  { id: "5", name: "Anna Lopez", email: "anna@example.com", role: "Professional", status: "Active", joined: "Feb 5, 2026" },
//  { id: "6", name: "David Kim", email: "david@example.com", role: "Student", status: "Active", joined: "Jan 28, 2026" },
//  { id: "7", name: "Jessica Lee", email: "jessica@example.com", role: "Personal", status: "Suspended", joined: "Nov 15, 2025" },
//  { id: "8", name: "Robert Taylor", email: "robert@example.com", role: "Admin", status: "Active", joined: "Oct 1, 2025" },
//]

//const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
//  Active: "default",
//  Inactive: "secondary",
//  Suspended: "destructive",
//}

//export default function AdminUsersPage() {
//  const [search, setSearch] = useState("")
//  const [roleFilter, setRoleFilter] = useState("all")

//  const filteredUsers = USERS.filter((u) => {
//    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
//    const matchesRole = roleFilter === "all" || u.role === roleFilter
//    return matchesSearch && matchesRole
//  })

//  return (
//    <DashboardShell navItems={navItems} role="Admin" title="Manage Users">
//      <div className="flex flex-col gap-6">
//        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//          <div className="relative flex-1 max-w-md">
//            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//            <Input
//              placeholder="Search users..."
//              value={search}
//              onChange={(e) => setSearch(e.target.value)}
//              className="pl-10"
//            />
//          </div>
//          <Select value={roleFilter} onValueChange={setRoleFilter}>
//            <SelectTrigger className="w-40">
//              <SelectValue placeholder="Filter by role" />
//            </SelectTrigger>
//            <SelectContent>
//              <SelectItem value="all">All Roles</SelectItem>
//              <SelectItem value="Student">Student</SelectItem>
//              <SelectItem value="Personal">Personal</SelectItem>
//              <SelectItem value="Professional">Professional</SelectItem>
//              <SelectItem value="Admin">Admin</SelectItem>
//            </SelectContent>
//          </Select>
//        </div>

//        <div className="rounded-xl border border-border bg-card overflow-hidden">
//          <div className="overflow-x-auto">
//            <table className="w-full">
//              <thead>
//                <tr className="border-b border-border bg-muted/30">
//                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">User</th>
//                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Role</th>
//                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
//                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Joined</th>
//                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
//                </tr>
//              </thead>
//              <tbody>
//                {filteredUsers.map((user) => (
//                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
//                    <td className="px-4 py-3">
//                      <div className="flex items-center gap-3">
//                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
//                          {user.name.split(" ").map(n => n[0]).join("")}
//                        </div>
//                        <div>
//                          <p className="text-sm font-medium text-card-foreground">{user.name}</p>
//                          <p className="text-xs text-muted-foreground">{user.email}</p>
//                        </div>
//                      </div>
//                    </td>
//                    <td className="px-4 py-3">
//                      <Badge variant="secondary">{user.role}</Badge>
//                    </td>
//                    <td className="px-4 py-3">
//                      <Badge variant={STATUS_VARIANTS[user.status]}>{user.status}</Badge>
//                    </td>
//                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.joined}</td>
//                    <td className="px-4 py-3 text-right">
//                      <DropdownMenu>
//                        <DropdownMenuTrigger asChild>
//                          <Button variant="ghost" size="icon" className="h-8 w-8">
//                            <MoreHorizontal className="h-4 w-4" />
//                          </Button>
//                        </DropdownMenuTrigger>
//                        <DropdownMenuContent align="end">
//                          <DropdownMenuItem><Edit2 className="mr-2 h-4 w-4" /> Edit User</DropdownMenuItem>
//                          <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> Send Email</DropdownMenuItem>
//                          <DropdownMenuItem className="text-destructive"><UserX className="mr-2 h-4 w-4" /> Deactivate</DropdownMenuItem>
//                        </DropdownMenuContent>
//                      </DropdownMenu>
//                    </td>
//                  </tr>
//                ))}
//              </tbody>
//            </table>
//          </div>
//        </div>

//        <p className="text-center text-sm text-muted-foreground">Showing {filteredUsers.length} of {USERS.length} users</p>
//      </div>
//    </DashboardShell>
//  )
//}


//"use client"

//import { useState, useEffect } from "react"
//import {
//    LayoutDashboard, Users, Shield, Briefcase, BarChart3, Megaphone,
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

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
//    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
//    { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
//    { label: "Access Control", href: "/dashboard/admin/access", icon: Briefcase },
//    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
//    { label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
//]

//export default function AdminUsersPage() {

//    const [users, setUsers] = useState<any[]>([])
//    const [loading, setLoading] = useState(true)
//    const [search, setSearch] = useState("")
//    const [roleFilter, setRoleFilter] = useState("all")

//    useEffect(() => {
//        fetchUsers()
//    }, [])

//    async function fetchUsers() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchat-backend.onrender.com//api/users", {
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            if (!res.ok) {
//                console.error(await res.text())
//                return
//            }

//            const data = await res.json()
//            setUsers(data)

//        } catch (err) {
//            console.error("Fetch error:", err)
//        } finally {
//            setLoading(false)
//        }
//    }

//    const filteredUsers = users.filter((u) => {
//        const matchesSearch =
//            u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
//            u.email?.toLowerCase().includes(search.toLowerCase())

//        const matchesRole =
//            roleFilter === "all" || u.role === roleFilter

//        return matchesSearch && matchesRole
//    })

//    return (
//        <DashboardShell navItems={navItems} role="Admin" title="Manage Users">

//            <div className="flex flex-col gap-6">

//                {/* 🔍 SEARCH + FILTER */}
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
//                            <SelectItem value="Student">Student</SelectItem>
//                            <SelectItem value="Personal">Personal</SelectItem>
//                            <SelectItem value="Professional">Professional</SelectItem>
//                            <SelectItem value="hr">HR</SelectItem>
//                            <SelectItem value="Admin">Admin</SelectItem>
//                        </SelectContent>
//                    </Select>

//                </div>

//                {/* 📊 TABLE */}
//                <div className="rounded-xl border bg-card overflow-hidden">

//                    {loading ? (
//                        <p className="p-6 text-center text-muted-foreground">Loading users...</p>
//                    ) : (
//                        <div className="overflow-x-auto">
//                            <table className="w-full">

//                                <thead>
//                                    <tr className="border-b bg-muted/30">
//                                        <th className="px-4 py-3 text-left text-xs text-muted-foreground">User</th>
//                                        <th className="px-4 py-3 text-left text-xs text-muted-foreground">Role</th>
//                                        <th className="px-4 py-3 text-left text-xs text-muted-foreground">Status</th>
//                                        <th className="px-4 py-3 text-left text-xs text-muted-foreground">Joined</th>
//                                        <th className="px-4 py-3 text-right text-xs text-muted-foreground">Actions</th>
//                                    </tr>
//                                </thead>

//                                <tbody>
//                                    {filteredUsers.map((user) => (

//                                        <tr key={user.id} className="border-b hover:bg-muted/20">

//                                            {/* USER */}
//                                            <td className="px-4 py-3">
//                                                <div className="flex items-center gap-3">

//                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
//                                                        {user.fullName?.split(" ").map((n: string) => n[0]).join("")}
//                                                    </div>

//                                                    <div>
//                                                        <p className="text-sm font-medium">{user.fullName}</p>
//                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
//                                                    </div>

//                                                </div>
//                                            </td>

//                                            {/* ROLE */}
//                                            <td className="px-4 py-3">
//                                                <Badge variant="secondary">{user.role}</Badge>
//                                            </td>

//                                            {/* STATUS */}
//                                            <td className="px-4 py-3">
//                                                <Badge variant="default">Active</Badge>
//                                            </td>

//                                            {/* DATE */}
//                                            <td className="px-4 py-3 text-sm text-muted-foreground">
//                                                {user.createdAt
//                                                    ? new Date(user.createdAt).toLocaleDateString()
//                                                    : "-"}
//                                            </td>

//                                            {/* ACTIONS */}
//                                            <td className="px-4 py-3 text-right">

//                                                <DropdownMenu>
//                                                    <DropdownMenuTrigger asChild>
//                                                        <Button variant="ghost" size="icon">
//                                                            <MoreHorizontal className="h-4 w-4" />
//                                                        </Button>
//                                                    </DropdownMenuTrigger>

//                                                    <DropdownMenuContent align="end">
//                                                        <DropdownMenuItem>
//                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
//                                                        </DropdownMenuItem>

//                                                        <DropdownMenuItem>
//                                                            <Mail className="mr-2 h-4 w-4" /> Email
//                                                        </DropdownMenuItem>

//                                                        <DropdownMenuItem className="text-destructive">
//                                                            <UserX className="mr-2 h-4 w-4" /> Deactivate
//                                                        </DropdownMenuItem>
//                                                    </DropdownMenuContent>
//                                                </DropdownMenu>

//                                            </td>

//                                        </tr>

//                                    ))}
//                                </tbody>

//                            </table>
//                        </div>
//                    )}

//                </div>

//                {/* FOOTER */}
//                <p className="text-center text-sm text-muted-foreground">
//                    Showing {filteredUsers.length} of {users.length} users
//                </p>

//            </div>

//        </DashboardShell>
//    )
//}



//"use client"

//import { useState, useEffect } from "react"
//import {
//    LayoutDashboard, Users, Shield, Briefcase, BarChart3, Megaphone,
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

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
//    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
//    { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
//    { label: "Access Control", href: "/dashboard/admin/access", icon: Briefcase },
//    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
//    { label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
//]

//export default function AdminUsersPage() {

//    const [users, setUsers] = useState<any[]>([])
//    const [loading, setLoading] = useState(true)
//    const [search, setSearch] = useState("")
//    const [roleFilter, setRoleFilter] = useState("all")

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

//            if (!res.ok) {
//                console.error(await res.text())
//                return
//            }

//            const data = await res.json()
//            setUsers(data)

//        } catch (err) {
//            console.error("Fetch error:", err)
//        } finally {
//            setLoading(false)
//        }
//    }

//    // 🎯 ROLE COLOR LOGIC
//    function getRoleVariant(role: string) {
//        switch (role?.toLowerCase()) {
//            case "admin": return "destructive"
//            case "hr": return "default"
//            case "professional": return "secondary"
//            case "student": return "outline"
//            case "personal": return "outline"
//            default: return "outline"
//        }
//    }

//    // 🎯 FILTER
//    const filteredUsers = users.filter((u) => {
//        const matchesSearch =
//            u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
//            u.email?.toLowerCase().includes(search.toLowerCase())

//        const matchesRole =
//            roleFilter === "all" || u.role?.toLowerCase() === roleFilter.toLowerCase()

//        return matchesSearch && matchesRole
//    })

//    return (
//        <DashboardShell navItems={navItems} role="Admin" title="Manage Users">

//            <div className="flex flex-col gap-6">

//                {/* 🔍 SEARCH + FILTER */}
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
//                            <SelectItem value="professional">Professional</SelectItem>
//                            <SelectItem value="hr">HR</SelectItem>
//                            <SelectItem value="admin">Admin</SelectItem>
//                        </SelectContent>
//                    </Select>

//                </div>

//                {/* 📊 TABLE */}
//                <div className="rounded-xl border bg-card overflow-hidden">

//                    {loading ? (
//                        <p className="p-6 text-center text-muted-foreground">Loading users...</p>
//                    ) : (
//                        <div className="overflow-x-auto">
//                            <table className="w-full">

//                                <thead>
//                                    <tr className="border-b bg-muted/30">
//                                        <th className="px-4 py-3 text-left text-xs text-muted-foreground">User</th>
//                                        <th className="px-4 py-3 text-left text-xs text-muted-foreground">Role</th>
//                                        <th className="px-4 py-3 text-left text-xs text-muted-foreground">Status</th>
//                                        <th className="px-4 py-3 text-left text-xs text-muted-foreground">Joined</th>
//                                        <th className="px-4 py-3 text-right text-xs text-muted-foreground">Actions</th>
//                                    </tr>
//                                </thead>

//                                <tbody>
//                                    {filteredUsers.map((user) => (

//                                        <tr key={user.id} className="border-b hover:bg-muted/20 transition">

//                                            {/* USER */}
//                                            <td className="px-4 py-3">
//                                                <div className="flex items-center gap-3">

//                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
//                                                        {user.fullName
//                                                            ? user.fullName.split(" ").map((n: string) => n[0]).join("")
//                                                            : "U"}
//                                                    </div>

//                                                    <div>
//                                                        <p className="text-sm font-medium">
//                                                            {user.fullName || "No Name"}
//                                                        </p>
//                                                        <p className="text-xs text-muted-foreground">
//                                                            {user.email}
//                                                        </p>
//                                                    </div>

//                                                </div>
//                                            </td>

//                                            {/* ROLE */}
//                                            <td className="px-4 py-3">
//                                                <Badge variant={getRoleVariant(user.role)}>
//                                                    {user.role || "No Role"}
//                                                </Badge>
//                                            </td>

//                                            {/* STATUS */}
//                                            <td className="px-4 py-3">
//                                                <Badge variant="default">Active</Badge>
//                                            </td>

//                                            {/* DATE */}
//                                            <td className="px-4 py-3 text-sm text-muted-foreground">
//                                                {user.createdAt && !isNaN(new Date(user.createdAt).getTime())
//                                                    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
//                                                        day: "2-digit",
//                                                        month: "short",
//                                                        year: "numeric",
//                                                    })
//                                                    : "-"}
//                                            </td>

//                                            {/* ACTIONS */}
//                                            <td className="px-4 py-3 text-right">

//                                                <DropdownMenu>
//                                                    <DropdownMenuTrigger asChild>
//                                                        <Button variant="ghost" size="icon">
//                                                            <MoreHorizontal className="h-4 w-4" />
//                                                        </Button>
//                                                    </DropdownMenuTrigger>

//                                                    <DropdownMenuContent align="end">
//                                                        <DropdownMenuItem>
//                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
//                                                        </DropdownMenuItem>

//                                                        <DropdownMenuItem>
//                                                            <Mail className="mr-2 h-4 w-4" /> Email
//                                                        </DropdownMenuItem>

//                                                        <DropdownMenuItem className="text-destructive">
//                                                            <UserX className="mr-2 h-4 w-4" /> Deactivate
//                                                        </DropdownMenuItem>
//                                                    </DropdownMenuContent>
//                                                </DropdownMenu>

//                                            </td>

//                                        </tr>

//                                    ))}
//                                </tbody>

//                            </table>
//                        </div>
//                    )}

//                </div>

//                {/* FOOTER */}
//                <p className="text-center text-sm text-muted-foreground">
//                    Showing {filteredUsers.length} of {users.length} users
//                </p>

//            </div>

//        </DashboardShell>
//    )
//}


//"use client"

//import { useState, useEffect } from "react"
//import {
//    LayoutDashboard, Users, Shield, Briefcase, BarChart3, Megaphone,
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

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
//    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
//    { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
//    //{ label: "Access Control", href: "/dashboard/admin/access", icon: Briefcase },
//    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
//    //{ label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
//]

//export default function AdminUsersPage() {

//    const [users, setUsers] = useState<any[]>([])
//    const [loading, setLoading] = useState(true)
//    const [search, setSearch] = useState("")
//    const [roleFilter, setRoleFilter] = useState("all")

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

//            if (!res.ok) {
//                console.error("STATUS:", res.status)

//                if (res.status === 401) {
//                    alert("Unauthorized - Please login again")
//                    return
//                }

//                if (res.status === 403) {
//                    alert("Access denied - Admin only")
//                    return
//                }

//                const text = await res.text()
//                console.error("API ERROR:", text)
//                return
//            }

//            if (!res.ok) {
//                console.error("Profile API failed", res.status)
//                return
//            }

//            const text = await res.text()

//            if (!text) {
//                console.warn("Empty response")
//                return
//            }

//            const data = JSON.parse(text)
//            console.log("USERS:", data)

//            setUsers(data)

//        } catch (err) {
//            console.error("Fetch error:", err)
//        } finally {
//            setLoading(false)
//        }
//    }
//    async function handleEdit(user: any) {
//        const newName = prompt("Enter new name", user.fullName)

//        if (!newName) return

//        const token = localStorage.getItem("token")

//        await fetch(`https://calchat-backend.onrender.com//api/account/users/${user.id}`, {
//            method: "PUT",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`
//            },
//            body: JSON.stringify({
//                fullName: newName
//            })
//        })

//        fetchUsers()
//    }
//    async function handleDeactivate(userId: string) {
//        const confirmDelete = confirm("Are you sure?")

//        if (!confirmDelete) return

//        const token = localStorage.getItem("token")

//        await fetch(`https://calchat-backend.onrender.com//api/account/users/${userId}/deactivate`, {
//            method: "PUT",
//            headers: {
//                Authorization: `Bearer ${token}`
//            }
//        })

//        fetchUsers()
//    }
//    async function handleEmail(user: any) {
//        const message = prompt("Enter message")

//        if (!message) return

//        const token = localStorage.getItem("token")

//        await fetch(`https://calchat-backend.onrender.com//api/account/send-email`, {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`
//            },
//            body: JSON.stringify({
//                to: user.email,
//                subject: "Admin Message",
//                message: message
//            })
//        })

//        alert("Email API called ✅")
//    }
//    // ✅ ROLE COLOR
//    function getRoleVariant(role: string) {
//        switch (role?.toLowerCase()) {
//            case "admin": return "destructive"
//            case "hr": return "default"
//            case "professional": return "secondary"
//            case "student": return "outline"
//            case "personal": return "outline"
//            default: return "outline"
//        }
//    }

//    // ✅ DATE FORMATTER (FIXED)
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

//    return (
//        <DashboardShell navItems={navItems} role="Admin" title="Manage Users">

//            <div className="flex flex-col gap-6">

//                {/* 🔍 SEARCH + FILTER */}
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

//                    {/* ✅ ONLY REQUIRED ROLES */}
//                    <Select value={roleFilter} onValueChange={setRoleFilter}>
//                        <SelectTrigger className="w-40">
//                            <SelectValue placeholder="Filter by role" />
//                        </SelectTrigger>
//                        <SelectContent>
//                            <SelectItem value="all">All Roles</SelectItem>
//                            <SelectItem value="student">Student</SelectItem>
//                            <SelectItem value="personal">Personal</SelectItem>
//                            <SelectItem value="hr">HR</SelectItem>
//                        </SelectContent>
//                    </Select>

//                </div>

//                {/* 📊 TABLE */}
//                <div className="rounded-xl border bg-card overflow-hidden">

//                    {loading ? (
//                        <p className="p-6 text-center text-muted-foreground">Loading users...</p>
//                    ) : (
//                        <div className="overflow-x-auto">
//                            <table className="w-full">

//                                <thead>
//                                    <tr className="border-b bg-muted/30">
//                                        <th className="px-4 py-3 text-left text-xs text-muted-foreground">User</th>
//                                        <th className="px-4 py-3 text-left text-xs text-muted-foreground">Role</th>
//                                        <th className="px-4 py-3 text-left text-xs text-muted-foreground">Status</th>
//                                        <th className="px-4 py-3 text-left text-xs text-muted-foreground">Joined</th>
//                                        <th className="px-4 py-3 text-right text-xs text-muted-foreground">Actions</th>
//                                    </tr>
//                                </thead>

//                                <tbody>
//                                    {filteredUsers.map((user) => (

//                                        <tr key={user.id} className="border-b hover:bg-muted/20 transition">

//                                            {/* USER */}
//                                            <td className="px-4 py-3">
//                                                <div className="flex items-center gap-3">

//                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
//                                                        {user.fullName
//                                                            ? user.fullName.split(" ").map((n: string) => n[0]).join("")
//                                                            : "U"}
//                                                    </div>

//                                                    <div>
//                                                        <p className="text-sm font-medium">
//                                                            {user.fullName || "No Name"}
//                                                        </p>
//                                                        <p className="text-xs text-muted-foreground">
//                                                            {user.email}
//                                                        </p>
//                                                    </div>

//                                                </div>
//                                            </td>

//                                            {/* ROLE */}
//                                            <td className="px-4 py-3">
//                                                <Badge variant={getRoleVariant(user.role)}>
//                                                    {user.role?.toUpperCase() || "NO ROLE"}
//                                                </Badge>
//                                            </td>

//                                            {/* STATUS */}
//                                            <td className="px-4 py-3">
//                                                <Badge variant={user.isActive ? "default" : "destructive"}>
//                                                    {user.isActive ? "Active" : "Inactive"}
//                                                </Badge>
//                                            </td>

//                                            {/* ✅ FIXED DATE */}
//                                            <td className="px-4 py-3 text-sm text-muted-foreground">
//                                                {formatDate(user.createdAt)}
//                                            </td>

//                                            {/* ACTIONS */}
//                                            <td className="px-4 py-3 text-right">

//                                                <DropdownMenu>
//                                                    <DropdownMenuTrigger asChild>
//                                                        <Button variant="ghost" size="icon">
//                                                            <MoreHorizontal className="h-4 w-4" />
//                                                        </Button>
//                                                    </DropdownMenuTrigger>

//                                                    <DropdownMenuContent align="end">
//                                                        <DropdownMenuItem onClick={() => handleEdit(user)}>
//                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
//                                                        </DropdownMenuItem>

//                                                        <DropdownMenuItem onClick={() => handleEmail(user)}>
//                                                            <Mail className="mr-2 h-4 w-4" /> Email
//                                                        </DropdownMenuItem>

//                                                        <DropdownMenuItem
//                                                            className="text-destructive"
//                                                            onClick={() => handleDeactivate(user.id)}
//                                                        >
//                                                            <UserX className="mr-2 h-4 w-4" /> Deactivate
//                                                        </DropdownMenuItem>
//                                                    </DropdownMenuContent>
//                                                </DropdownMenu>

//                                            </td>

//                                        </tr>

//                                    ))}
//                                </tbody>

//                            </table>
//                        </div>
//                    )}

//                </div>

//                {/* FOOTER */}
//                <p className="text-center text-sm text-muted-foreground">
//                    Showing {filteredUsers.length} of {users.length} users
//                </p>

//            </div>

//        </DashboardShell>
//    )
//}




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

//    const [currentPage, setCurrentPage] = useState(1)
//    const usersPerPage = 8

//    useEffect(() => {
//        fetchUsers()
//    }, [])

//    useEffect(() => {
//        setCurrentPage(1)
//    }, [search, roleFilter])

//    async function fetchUsers() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchat-backend.onrender.com//api/account/users", {
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            if (!res.ok) return

//            const text = await res.text()
//            const data = text ? JSON.parse(text) : []
//            setUsers(data)

//        } catch (err) {
//            console.error(err)
//        } finally {
//            setLoading(false)
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

//    const filteredUsers = users.filter((u) => {
//        const role = u.role?.toLowerCase()

//        const matchesSearch =
//            u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
//            u.email?.toLowerCase().includes(search.toLowerCase())

//        const matchesRole =
//            roleFilter === "all" || role === roleFilter

//        return matchesSearch && matchesRole
//    })

//    const indexOfLastUser = currentPage * usersPerPage
//    const indexOfFirstUser = indexOfLastUser - usersPerPage
//    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
//    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

//    return (
//        <DashboardShell navItems={navItems} role="Admin" title="Manage Users">

//            <div className="flex flex-col gap-1">

//                {/* SEARCH */}
//                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

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
//                                                    <DropdownMenuItem>
//                                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
//                                                    </DropdownMenuItem>
//                                                    <DropdownMenuItem>
//                                                        <Mail className="mr-2 h-4 w-4" /> Email
//                                                    </DropdownMenuItem>
//                                                    <DropdownMenuItem className="text-destructive">
//                                                        <UserX className="mr-2 h-4 w-4" /> Deactivate
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

//                {/* PAGINATION */}
//                <div className="flex justify-center gap-1">

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

            const res = await fetch("https://calchat-backend.onrender.com//api/account/users", {
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

    async function handleEdit(user: any) {
        const newName = prompt("Enter new name", user.fullName)
        if (!newName) return

        const token = localStorage.getItem("token")

        await fetch(`https://calchat-backend.onrender.com//api/account/users/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ fullName: newName })
        })

        fetchUsers()
    }

    async function handleDeactivate(userId: string) {
        if (!confirm("Are you sure?")) return

        const token = localStorage.getItem("token")

        await fetch(`https://calchat-backend.onrender.com//api/account/users/${userId}/deactivate`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }
        })

        fetchUsers()
    }

    async function handleEmail(user: any) {
        const message = prompt("Enter message")
        if (!message) return

        const token = localStorage.getItem("token")

        await fetch(`https://calchat-backend.onrender.com//api/account/send-email`, {
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
        })

        alert("Email sent ✅")
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
                                                        onClick={() => handleDeactivate(user.id)}
                                                    >
                                                        <UserX className="mr-2 h-4 w-4" /> Deactivate
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