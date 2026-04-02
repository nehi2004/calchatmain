//"use client"

//import { useState } from "react"
//import {
//    LayoutDashboard, Users, Shield, Briefcase, BarChart3, Megaphone,
//    Search, MoreHorizontal, UserX, Edit2, Mail, Calendar, MessageSquare, Video, CheckCircle2, StickyNote
//} from "lucide-react"
//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Badge } from "@/components/ui/badge"
//import {
//    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/hr", icon: LayoutDashboard },
//    { label: "Calendar", href: "/dashboard/hr/calendar", icon: Calendar },
//    { label: "AI Chat", href: "/dashboard/hr/chat", icon: MessageSquare },
//    { label: "Employees Management", href: "/dashboard/hr/employees", icon: Users },
//    { label: "Meetings", href: "/dashboard/hr/meetings", icon: Video },
//    { label: "Tasks", href: "/dashboard/hr/tasks", icon: CheckCircle2 },
//    { label: "Team", href: "/dashboard/hr/team", icon: Users },
//    { label: "Notes", href: "/dashboard/hr/notes", icon: StickyNote },
//    { label: "Announcements", href: "/dashboard/hr/announcements", icon: Megaphone },
//    { label: "Analytics", href: "/dashboard/hr/analytics", icon: BarChart3 },
//]

//const USERS = [
//    { id: "1", name: "Sarah Miller", email: "sarah@example.com", role: "Student", status: "Active", joined: "Jan 15, 2026" },
//    { id: "2", name: "James Wilson", email: "james@example.com", role: "Professional", status: "Active", joined: "Jan 20, 2026" },
//    { id: "3", name: "Emily Brown", email: "emily@example.com", role: "Personal", status: "Active", joined: "Feb 1, 2026" },
//    { id: "4", name: "Michael Chen", email: "michael@example.com", role: "Student", status: "Inactive", joined: "Dec 10, 2025" },
//    { id: "5", name: "Anna Lopez", email: "anna@example.com", role: "Professional", status: "Active", joined: "Feb 5, 2026" },
//    { id: "6", name: "David Kim", email: "david@example.com", role: "Student", status: "Active", joined: "Jan 28, 2026" },
//    { id: "7", name: "Jessica Lee", email: "jessica@example.com", role: "Personal", status: "Suspended", joined: "Nov 15, 2025" },
//    { id: "8", name: "Robert Taylor", email: "robert@example.com", role: "Admin", status: "Active", joined: "Oct 1, 2025" },
//]

//const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
//    Active: "default",
//    Inactive: "secondary",
//    Suspended: "destructive",
//}

//export default function AdminUsersPage() {
//    const [search, setSearch] = useState("")
//    const [roleFilter, setRoleFilter] = useState("all")

//    const filteredUsers = USERS.filter((u) => {
//        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
//        const matchesRole = roleFilter === "all" || u.role === roleFilter
//        return matchesSearch && matchesRole
//    })

//    return (
//        <DashboardShell navItems={navItems} role="Admin" title="Manage Users">
//            <div className="flex flex-col gap-6">
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

//                            <SelectItem value="Professional">Professional</SelectItem>

//                        </SelectContent>
//                    </Select>
//                </div>

//                <div className="rounded-xl border border-border bg-card overflow-hidden">
//                    <div className="overflow-x-auto">
//                        <table className="w-full">
//                            <thead>
//                                <tr className="border-b border-border bg-muted/30">
//                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">User</th>
//                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Role</th>
//                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
//                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Joined</th>
//                                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
//                                </tr>
//                            </thead>
//                            <tbody>
//                                {filteredUsers.map((user) => (
//                                    <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
//                                        <td className="px-4 py-3">
//                                            <div className="flex items-center gap-3">
//                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
//                                                    {user.name.split(" ").map(n => n[0]).join("")}
//                                                </div>
//                                                <div>
//                                                    <p className="text-sm font-medium text-card-foreground">{user.name}</p>
//                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
//                                                </div>
//                                            </div>
//                                        </td>
//                                        <td className="px-4 py-3">
//                                            <Badge variant="secondary">{user.role}</Badge>
//                                        </td>
//                                        <td className="px-4 py-3">
//                                            <Badge variant={STATUS_VARIANTS[user.status]}>{user.status}</Badge>
//                                        </td>
//                                        <td className="px-4 py-3 text-sm text-muted-foreground">{user.joined}</td>
//                                        <td className="px-4 py-3 text-right">
//                                            <DropdownMenu>
//                                                <DropdownMenuTrigger asChild>
//                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
//                                                        <MoreHorizontal className="h-4 w-4" />
//                                                    </Button>
//                                                </DropdownMenuTrigger>
//                                                <DropdownMenuContent align="end">
//                                                    <DropdownMenuItem><Edit2 className="mr-2 h-4 w-4" /> Edit User</DropdownMenuItem>
//                                                    <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> Send Email</DropdownMenuItem>
//                                                    <DropdownMenuItem className="text-destructive"><UserX className="mr-2 h-4 w-4" /> Deactivate</DropdownMenuItem>
//                                                </DropdownMenuContent>
//                                            </DropdownMenu>
//                                        </td>
//                                    </tr>
//                                ))}
//                            </tbody>
//                        </table>
//                    </div>
//                </div>

//                <p className="text-center text-sm text-muted-foreground">Showing {filteredUsers.length} of {USERS.length} users</p>
//            </div>
//        </DashboardShell>
//    )
////}
//"use client"

//import { useState, useEffect } from "react"
//import {
//    LayoutDashboard, Users, BarChart3, Megaphone,
//    Search, MoreHorizontal, UserX, Edit2, Mail,
//    Calendar, MessageSquare, Video, CheckCircle2, StickyNote
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Badge } from "@/components/ui/badge"
//import {
//    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"
//import {
//    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
//} from "@/components/ui/dialog"
//import { Label } from "@/components/ui/label"

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/hr", icon: LayoutDashboard },
//    { label: "Calendar", href: "/dashboard/hr/calendar", icon: Calendar },
//    { label: "AI Chat", href: "/dashboard/hr/chat", icon: MessageSquare },
//    { label: "Employees Management", href: "/dashboard/hr/employees", icon: Users },
//    { label: "Meetings", href: "/dashboard/hr/meetings", icon: Video },
//    { label: "Tasks", href: "/dashboard/hr/tasks", icon: CheckCircle2 },
//    { label: "Team", href: "/dashboard/hr/team", icon: Users },
//    { label: "Notes", href: "/dashboard/hr/notes", icon: StickyNote },
//    { label: "Announcements", href: "/dashboard/hr/announcements", icon: Megaphone },
//    { label: "Analytics", href: "/dashboard/hr/analytics", icon: BarChart3 },
//]

//export default function EmployeeManagementPage() {

//    const [search, setSearch] = useState("")
//    const [open, setOpen] = useState(false)
//    const [employees, setEmployees] = useState<any[]>([])

//    const [newEmployee, setNewEmployee] = useState({
//        name: "",
//        email: "",
//        department: "",
//    })

//    // ================= FETCH EMPLOYEES =================
//    useEffect(() => {
//        fetchEmployees()
//    }, [])

//    async function fetchEmployees() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchatmain-production-75c1.up.railway.app/api/hr/employees", {
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            if (!res.ok) {
//                console.error("Failed to fetch employees")
//                return
//            }

//            const data = await res.json()

//            setEmployees(
//                data.map((emp: any) => ({
//                    id: emp.id,
//                    name: emp.name,
//                    email: emp.email,
//                    department: emp.department || "N/A",
//                    status: "Active"
//                }))
//            )

//        } catch (err) {
//            console.error(err)
//        }
//    }

//    // ================= ADD EMPLOYEE =================
//    async function handleAddEmployee() {
//        if (!newEmployee.name || !newEmployee.email) {
//            alert("Name and Email required ❌")
//            return
//        }

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchatmain-production-75c1.up.railway.app/api/hr/add-employee", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`,
//                },
//                body: JSON.stringify(newEmployee),
//            })

//            if (!res.ok) {
//                const err = await res.text()
//                alert(err)
//                return
//            }

//            alert("Employee created & invite sent ✅")

//            // ✅ IMPORTANT: reload employees
//            await fetchEmployees()

//            setOpen(false)
//            setNewEmployee({ name: "", email: "", department: "" })

//        } catch (err) {
//            console.error(err)
//        }
//    }

//    // ================= FILTER =================
//    const filteredEmployees = employees.filter(emp =>
//        emp.name.toLowerCase().includes(search.toLowerCase()) ||
//        emp.email.toLowerCase().includes(search.toLowerCase())
//    )

//    return (
//        <DashboardShell navItems={navItems} role="hr" title="Employees Management">
//            <div className="flex flex-col gap-6">

//                {/* TOP BAR */}
//                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//                    <div className="relative flex-1 max-w-md">
//                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                        <Input
//                            placeholder="Search employees..."
//                            value={search}
//                            onChange={(e) => setSearch(e.target.value)}
//                            className="pl-10"
//                        />
//                    </div>

//                    <Button onClick={() => setOpen(true)}>
//                        Add Employee
//                    </Button>
//                </div>

//                {/* TABLE */}
//                <div className="rounded-xl border bg-card overflow-hidden">
//                    <div className="overflow-x-auto">
//                        <table className="w-full">
//                            <thead>
//                                <tr className="border-b bg-muted/30">
//                                    <th className="px-4 py-3 text-left text-xs">Employee</th>
//                                    <th className="px-4 py-3 text-left text-xs">Department</th>
//                                    <th className="px-4 py-3 text-left text-xs">Status</th>
//                                    <th className="px-4 py-3 text-right text-xs">Actions</th>
//                                </tr>
//                            </thead>

//                            <tbody>
//                                {filteredEmployees.length === 0 ? (
//                                    <tr>
//                                        <td colSpan={4} className="text-center py-6 text-sm text-muted-foreground">
//                                            No employees yet
//                                        </td>
//                                    </tr>
//                                ) : (
//                                    filteredEmployees.map((emp) => (
//                                        <tr key={emp.id} className="border-b hover:bg-muted/20">
//                                            <td className="px-4 py-3">
//                                                <p className="font-medium">{emp.name}</p>
//                                                <p className="text-xs text-muted-foreground">{emp.email}</p>
//                                            </td>

//                                            <td className="px-4 py-3">
//                                                <Badge variant="secondary">{emp.department}</Badge>
//                                            </td>

//                                            <td className="px-4 py-3">
//                                                <Badge variant="outline">{emp.status}</Badge>
//                                            </td>

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
//                                                            <UserX className="mr-2 h-4 w-4" /> Remove
//                                                        </DropdownMenuItem>
//                                                    </DropdownMenuContent>
//                                                </DropdownMenu>
//                                            </td>
//                                        </tr>
//                                    ))
//                                )}
//                            </tbody>
//                        </table>
//                    </div>
//                </div>

//                {/* MODAL */}
//                <Dialog open={open} onOpenChange={setOpen}>
//                    <DialogContent>
//                        <DialogHeader>
//                            <DialogTitle>Add Employee</DialogTitle>
//                            <DialogDescription>
//                                HR can invite employee via email
//                            </DialogDescription>
//                        </DialogHeader>

//                        <div className="flex flex-col gap-4 mt-4">

//                            <div>
//                                <Label>Name</Label>
//                                <Input
//                                    value={newEmployee.name}
//                                    onChange={(e) =>
//                                        setNewEmployee({ ...newEmployee, name: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <div>
//                                <Label>Email</Label>
//                                <Input
//                                    value={newEmployee.email}
//                                    onChange={(e) =>
//                                        setNewEmployee({ ...newEmployee, email: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <div>
//                                <Label>Department</Label>
//                                <Input
//                                    value={newEmployee.department}
//                                    onChange={(e) =>
//                                        setNewEmployee({ ...newEmployee, department: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <Button onClick={handleAddEmployee}>
//                                Create Employee
//                            </Button>
//                        </div>
//                    </DialogContent>
//                </Dialog>

//            </div>
//        </DashboardShell>
//    )
//}



//"use client"

//import { useState, useEffect } from "react"
//import {
//    LayoutDashboard, Users, BarChart3, Megaphone,
//    Search, MoreHorizontal, UserX, Edit2, Mail,
//    Calendar, MessageSquare, Video, CheckCircle2, StickyNote
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Badge } from "@/components/ui/badge"
//import {
//    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"
//import {
//    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
//} from "@/components/ui/dialog"
//import { Label } from "@/components/ui/label"

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/hr", icon: LayoutDashboard },
//    { label: "Calendar", href: "/dashboard/hr/calendar", icon: Calendar },
//    { label: "AI Chat", href: "/dashboard/hr/chat", icon: MessageSquare },
//    { label: "Employees Management", href: "/dashboard/hr/employees", icon: Users },
//    { label: "Meetings", href: "/dashboard/hr/meetings", icon: Video },
//    { label: "Tasks", href: "/dashboard/hr/tasks", icon: CheckCircle2 },
//    { label: "Team", href: "/dashboard/hr/team", icon: Users },
//    { label: "Notes", href: "/dashboard/hr/notes", icon: StickyNote },
//    { label: "Announcements", href: "/dashboard/hr/announcements", icon: Megaphone },
//    { label: "Analytics", href: "/dashboard/hr/analytics", icon: BarChart3 },
//]

//export default function EmployeeManagementPage() {

//    const [search, setSearch] = useState("")
//    const [open, setOpen] = useState(false)
//    const [employees, setEmployees] = useState<any[]>([])
//    const [isEdit, setIsEdit] = useState(false)
//    const [editId, setEditId] = useState<string | null>(null)

//    const [newEmployee, setNewEmployee] = useState({
//        name: "",
//        email: "",
//        department: "",
//    })

//    // ================= FETCH =================
//    useEffect(() => {
//        fetchEmployees()
//    }, [])

//    async function fetchEmployees() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchatmain-production-75c1.up.railway.app/api/hr/employees", {
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            const data = await res.json()

//            setEmployees(
//                data.map((emp: any) => ({
//                    id: emp.id,
//                    name: emp.name,
//                    email: emp.email,
//                    department: emp.department || "N/A",
//                    status: "Active"
//                }))
//            )
//        } catch (err) {
//            console.error(err)
//        }
//    }

//    // ================= ADD =================
//    async function handleAddEmployee() {
//        if (!newEmployee.name || !newEmployee.email) {
//            alert("Name and Email required ❌")
//            return
//        }

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchatmain-production-75c1.up.railway.app/api/hr/add-employee", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`,
//                },
//                body: JSON.stringify(newEmployee),
//            })

//            if (!res.ok) {
//                const err = await res.text()
//                alert(err)
//                return
//            }

//            alert("Employee created & invite sent ✅")
//            await fetchEmployees()
//            resetForm()

//        } catch (err) {
//            console.error(err)
//        }
//    }

//    // ================= DELETE =================
//    async function handleDelete(id: string) {
//        if (!confirm("Are you sure?")) return

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(`https://calchatmain-production-75c1.up.railway.app/api/hr/delete-employee/${id}`, {
//                method: "DELETE",
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            if (!res.ok) return alert("Delete failed ❌")

//            alert("Deleted successfully ✅")
//            await fetchEmployees()

//        } catch (err) {
//            console.error(err)
//        }
//    }

//    // ================= EDIT =================
//    async function handleEdit() {
//        if (!editId) return

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(`https://calchatmain-production-75c1.up.railway.app/api/hr/update-employee/${editId}`, {
//                method: "PUT",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },
//                body: JSON.stringify(newEmployee)
//            })

//            if (!res.ok) return alert("Update failed ❌")

//            alert("Updated successfully ✅")
//            await fetchEmployees()
//            resetForm()

//        } catch (err) {
//            console.error(err)
//        }
//    }

//    function resetForm() {
//        setOpen(false)
//        setIsEdit(false)
//        setEditId(null)
//        setNewEmployee({ name: "", email: "", department: "" })
//    }

//    // ================= FILTER =================
//    const filteredEmployees = employees.filter(emp =>
//        emp.name.toLowerCase().includes(search.toLowerCase()) ||
//        emp.email.toLowerCase().includes(search.toLowerCase())
//    )

//    return (
//        <DashboardShell navItems={navItems} role="hr" title="Employees Management">
//            <div className="flex flex-col gap-6">

//                {/* TOP BAR */}
//                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//                    <div className="relative flex-1 max-w-md">
//                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                        <Input
//                            placeholder="Search employees..."
//                            value={search}
//                            onChange={(e) => setSearch(e.target.value)}
//                            className="pl-10"
//                        />
//                    </div>

//                    <Button onClick={() => setOpen(true)}>
//                        Add Employee
//                    </Button>
//                </div>

//                {/* TABLE */}
//                <div className="rounded-xl border bg-card overflow-hidden">
//                    <div className="overflow-x-auto">
//                        <table className="w-full">
//                            <thead>
//                                <tr className="border-b bg-muted/30">
//                                    <th className="px-4 py-3 text-left text-xs">Employee</th>
//                                    <th className="px-4 py-3 text-left text-xs">Department</th>
//                                    <th className="px-4 py-3 text-left text-xs">Status</th>
//                                    <th className="px-4 py-3 text-right text-xs">Actions</th>
//                                </tr>
//                            </thead>

//                            <tbody>
//                                {filteredEmployees.length === 0 ? (
//                                    <tr>
//                                        <td colSpan={4} className="text-center py-6 text-sm text-muted-foreground">
//                                            No employees yet
//                                        </td>
//                                    </tr>
//                                ) : (
//                                    filteredEmployees.map((emp) => (
//                                        <tr key={emp.id} className="border-b hover:bg-muted/20">
//                                            <td className="px-4 py-3">
//                                                <p className="font-medium">{emp.name}</p>
//                                                <p className="text-xs text-muted-foreground">{emp.email}</p>
//                                            </td>

//                                            <td className="px-4 py-3">
//                                                <Badge variant="secondary">{emp.department}</Badge>
//                                            </td>

//                                            <td className="px-4 py-3">
//                                                <Badge variant="outline">{emp.status}</Badge>
//                                            </td>

//                                            <td className="px-4 py-3 text-right">
//                                                <DropdownMenu>
//                                                    <DropdownMenuTrigger asChild>
//                                                        <Button variant="ghost" size="icon">
//                                                            <MoreHorizontal className="h-4 w-4" />
//                                                        </Button>
//                                                    </DropdownMenuTrigger>

//                                                    <DropdownMenuContent align="end">

//                                                        {/* EDIT */}
//                                                        <DropdownMenuItem
//                                                            onClick={() => {
//                                                                setNewEmployee(emp)
//                                                                setEditId(emp.id)
//                                                                setIsEdit(true)
//                                                                setOpen(true)
//                                                            }}
//                                                        >
//                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
//                                                        </DropdownMenuItem>

//                                                        <DropdownMenuItem>
//                                                            <Mail className="mr-2 h-4 w-4" /> Email
//                                                        </DropdownMenuItem>

//                                                        {/* DELETE */}
//                                                        <DropdownMenuItem
//                                                            className="text-destructive"
//                                                            onClick={() => handleDelete(emp.id)}
//                                                        >
//                                                            <UserX className="mr-2 h-4 w-4" /> Remove
//                                                        </DropdownMenuItem>

//                                                    </DropdownMenuContent>
//                                                </DropdownMenu>
//                                            </td>
//                                        </tr>
//                                    ))
//                                )}
//                            </tbody>
//                        </table>
//                    </div>
//                </div>

//                {/* MODAL */}
//                <Dialog open={open} onOpenChange={setOpen}>
//                    <DialogContent>
//                        <DialogHeader>
//                            <DialogTitle>
//                                {isEdit ? "Edit Employee" : "Add Employee"}
//                            </DialogTitle>
//                            <DialogDescription>
//                                HR can manage employee details
//                            </DialogDescription>
//                        </DialogHeader>

//                        <div className="flex flex-col gap-4 mt-4">

//                            <div>
//                                <Label>Name</Label>
//                                <Input
//                                    value={newEmployee.name}
//                                    onChange={(e) =>
//                                        setNewEmployee({ ...newEmployee, name: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <div>
//                                <Label>Email</Label>
//                                <Input
//                                    value={newEmployee.email}
//                                    onChange={(e) =>
//                                        setNewEmployee({ ...newEmployee, email: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <div>
//                                <Label>Department</Label>
//                                <Input
//                                    value={newEmployee.department}
//                                    onChange={(e) =>
//                                        setNewEmployee({ ...newEmployee, department: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <Button onClick={isEdit ? handleEdit : handleAddEmployee}>
//                                {isEdit ? "Update Employee" : "Create Employee"}
//                            </Button>

//                        </div>
//                    </DialogContent>
//                </Dialog>

//            </div>
//        </DashboardShell>
//    )
//}


//"use client"

//import { useState, useEffect } from "react"
//import {
//    LayoutDashboard, Users, BarChart3, Megaphone,
//    Search, MoreHorizontal, UserX, Edit2, Mail,
//    Calendar, MessageSquare, Video, CheckCircle2, StickyNote
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Badge } from "@/components/ui/badge"
//import {
//    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"
//import {
//    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
//} from "@/components/ui/dialog"
//import { Label } from "@/components/ui/label"

//// ✅ TOAST IMPORT
//import { useToast } from "@/components/ui/use-toast"

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/hr", icon: LayoutDashboard },
//    { label: "Calendar", href: "/dashboard/hr/calendar", icon: Calendar },
//    { label: "AI Chat", href: "/dashboard/hr/chat", icon: MessageSquare },
//    { label: "Employees Management", href: "/dashboard/hr/employees", icon: Users },
//    { label: "Meetings", href: "/dashboard/hr/meetings", icon: Video },
//    { label: "Tasks", href: "/dashboard/hr/tasks", icon: CheckCircle2 },
//    { label: "Team", href: "/dashboard/hr/team", icon: Users },
//    { label: "Notes", href: "/dashboard/hr/notes", icon: StickyNote },
//    { label: "Announcements", href: "/dashboard/hr/announcements", icon: Megaphone },
//    { label: "Analytics", href: "/dashboard/hr/analytics", icon: BarChart3 },
//]

//export default function EmployeeManagementPage() {

//    const [search, setSearch] = useState("")
//    const [open, setOpen] = useState(false)
//    const [employees, setEmployees] = useState<any[]>([])
//    const [isEdit, setIsEdit] = useState(false)
//    const [editId, setEditId] = useState<string | null>(null)
//    const [loading, setLoading] = useState(false)

//    const { toast } = useToast() // ✅ TOAST HOOK

//    const [newEmployee, setNewEmployee] = useState({
//        name: "",
//        email: "",
//        department: "",
//    })

//    // ================= FETCH =================
//    useEffect(() => {
//        fetchEmployees()
//    }, [])

//    async function fetchEmployees() {
//        setLoading(true) // ✅ START LOADING

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchatmain-production-75c1.up.railway.app/api/hr/employees", {
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            const data = await res.json()

//            setEmployees(
//                data.map((emp: any) => ({
//                    id: emp.id,
//                    name: emp.name,
//                    email: emp.email,
//                    department: emp.department || "N/A",
//                    status: emp.status // ✅ REAL STATUS
//                }))
//            )

//        } catch (err) {
//            console.error(err)
//        }

//        setLoading(false) // ✅ STOP LOADING
//    }

//    // ================= ADD =================
//    async function handleAddEmployee() {
//        if (!newEmployee.name || !newEmployee.email) {
//            toast({
//                title: "Error ❌",
//                description: "Name and Email required",
//                variant: "destructive"
//            })
//            return
//        }

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchatmain-production-75c1.up.railway.app/api/hr/add-employee", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`,
//                },
//                body: JSON.stringify(newEmployee),
//            })

//            if (!res.ok) {
//                toast({
//                    title: "Error ❌",
//                    description: "Failed to create employee",
//                    variant: "destructive"
//                })
//                return
//            }

//            toast({
//                title: "Success ✅",
//                description: "Employee created & invite sent"
//            })

//            await fetchEmployees()
//            resetForm()

//        } catch (err) {
//            console.error(err)
//        }
//    }

//    // ================= DELETE =================
//    async function handleDelete(id: string) {
//        if (!confirm("Are you sure?")) return

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(`https://calchatmain-production-75c1.up.railway.app/api/hr/delete-employee/${id}`, {
//                method: "DELETE",
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            if (!res.ok) {
//                toast({
//                    title: "Error ❌",
//                    description: "Delete failed",
//                    variant: "destructive"
//                })
//                return
//            }

//            toast({
//                title: "Deleted",
//                description: "Employee removed successfully"
//            })

//            await fetchEmployees()

//        } catch (err) {
//            console.error(err)
//        }
//    }

//    // ================= EDIT =================
//    async function handleEdit() {
//        if (!editId) return

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(`https://calchatmain-production-75c1.up.railway.app/api/hr/update-employee/${editId}`, {
//                method: "PUT",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },
//                body: JSON.stringify(newEmployee)
//            })

//            if (!res.ok) {
//                toast({
//                    title: "Error ❌",
//                    description: "Update failed",
//                    variant: "destructive"
//                })
//                return
//            }

//            toast({
//                title: "Updated",
//                description: "Employee updated successfully"
//            })

//            await fetchEmployees()
//            resetForm()

//        } catch (err) {
//            console.error(err)
//        }
//    }

//    function resetForm() {
//        setOpen(false)
//        setIsEdit(false)
//        setEditId(null)
//        setNewEmployee({ name: "", email: "", department: "" })
//    }

//    // ================= FILTER =================
//    const filteredEmployees = employees.filter(emp =>
//        emp.name.toLowerCase().includes(search.toLowerCase()) ||
//        emp.email.toLowerCase().includes(search.toLowerCase())
//    )

//    return (
//        <DashboardShell navItems={navItems} role="hr" title="Employees Management">
//            <div className="flex flex-col gap-6">

//                {/* TOP BAR */}
//                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//                    <div className="relative flex-1 max-w-md">
//                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                        <Input
//                            placeholder="Search employees..."
//                            value={search}
//                            onChange={(e) => setSearch(e.target.value)}
//                            className="pl-10"
//                        />
//                    </div>

//                    <Button onClick={() => setOpen(true)}>
//                        Add Employee
//                    </Button>
//                </div>

//                {/* TABLE */}
//                <div className="rounded-xl border bg-card overflow-hidden">
//                    <div className="overflow-x-auto">

//                        {loading ? (
//                            <p className="text-center py-6">Loading...</p>
//                        ) : (
//                            <table className="w-full">
//                                <thead>
//                                    <tr className="border-b bg-muted/30">
//                                        <th className="px-4 py-3 text-left text-xs">Employee</th>
//                                        <th className="px-4 py-3 text-left text-xs">Department</th>
//                                        <th className="px-4 py-3 text-left text-xs">Status</th>
//                                        <th className="px-4 py-3 text-right text-xs">Actions</th>
//                                    </tr>
//                                </thead>

//                                <tbody>
//                                    {filteredEmployees.length === 0 ? (
//                                        <tr>
//                                            <td colSpan={4} className="text-center py-6 text-sm text-muted-foreground">
//                                                No employees yet
//                                            </td>
//                                        </tr>
//                                    ) : (
//                                        filteredEmployees.map((emp) => (
//                                            <tr key={emp.id} className="border-b hover:bg-muted/20">
//                                                <td className="px-4 py-3">
//                                                    <p className="font-medium">{emp.name}</p>
//                                                    <p className="text-xs text-muted-foreground">{emp.email}</p>
//                                                </td>

//                                                <td className="px-4 py-3">
//                                                    <Badge variant="secondary">{emp.department}</Badge>
//                                                </td>

//                                                <td className="px-4 py-3">
//                                                    <Badge variant="outline">{emp.status}</Badge>
//                                                </td>

//                                                <td className="px-4 py-3 text-right">
//                                                    <DropdownMenu>
//                                                        <DropdownMenuTrigger asChild>
//                                                            <Button variant="ghost" size="icon">
//                                                                <MoreHorizontal className="h-4 w-4" />
//                                                            </Button>
//                                                        </DropdownMenuTrigger>

//                                                        <DropdownMenuContent align="end">

//                                                            <DropdownMenuItem
//                                                                onClick={() => {
//                                                                    setNewEmployee(emp)
//                                                                    setEditId(emp.id)
//                                                                    setIsEdit(true)
//                                                                    setOpen(true)
//                                                                }}
//                                                            >
//                                                                <Edit2 className="mr-2 h-4 w-4" /> Edit
//                                                            </DropdownMenuItem>

//                                                            <DropdownMenuItem
//                                                                className="text-destructive"
//                                                                onClick={() => handleDelete(emp.id)}
//                                                            >
//                                                                <UserX className="mr-2 h-4 w-4" /> Remove
//                                                            </DropdownMenuItem>

//                                                        </DropdownMenuContent>
//                                                    </DropdownMenu>
//                                                </td>
//                                            </tr>
//                                        ))
//                                    )}
//                                </tbody>
//                            </table>
//                        )}

//                    </div>
//                </div>

//                {/* MODAL */}
//                <Dialog open={open} onOpenChange={setOpen}>
//                    <DialogContent>
//                        <DialogHeader>
//                            <DialogTitle>
//                                {isEdit ? "Edit Employee" : "Add Employee"}
//                            </DialogTitle>
//                            <DialogDescription>
//                                HR can manage employee details
//                            </DialogDescription>
//                        </DialogHeader>

//                        <div className="flex flex-col gap-4 mt-4">

//                            <div>
//                                <Label>Name</Label>
//                                <Input
//                                    value={newEmployee.name}
//                                    onChange={(e) =>
//                                        setNewEmployee({ ...newEmployee, name: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <div>
//                                <Label>Email</Label>
//                                <Input
//                                    value={newEmployee.email}
//                                    onChange={(e) =>
//                                        setNewEmployee({ ...newEmployee, email: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <div>
//                                <Label>Department</Label>
//                                <Input
//                                    value={newEmployee.department}
//                                    onChange={(e) =>
//                                        setNewEmployee({ ...newEmployee, department: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <Button onClick={isEdit ? handleEdit : handleAddEmployee}>
//                                {isEdit ? "Update Employee" : "Create Employee"}
//                            </Button>

//                        </div>
//                    </DialogContent>
//                </Dialog>

//            </div>
//        </DashboardShell>
//    )
//}



//"use client"

//import { useState, useEffect } from "react"
//import {
//    LayoutDashboard, Users, BarChart3, Megaphone,
//    Search, MoreHorizontal, UserX, Edit2, Mail,
//    Calendar, MessageSquare, Video, CheckCircle2, StickyNote
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Badge } from "@/components/ui/badge"
//import {
//    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"
//import {
//    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
//} from "@/components/ui/dialog"
//import { Label } from "@/components/ui/label"
//import { useToast } from "@/components/ui/use-toast"

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/hr", icon: LayoutDashboard },
//    { label: "Calendar", href: "/dashboard/hr/calendar", icon: Calendar },
//    { label: "AI Chat", href: "/dashboard/hr/chat", icon: MessageSquare },
//    { label: "Employees Management", href: "/dashboard/hr/employees", icon: Users },
//    { label: "Meetings", href: "/dashboard/hr/meetings", icon: Video },
//    { label: "Tasks", href: "/dashboard/hr/tasks", icon: CheckCircle2 },
//    { label: "Team", href: "/dashboard/hr/team", icon: Users },
//    { label: "Notes", href: "/dashboard/hr/notes", icon: StickyNote },
//    { label: "Announcements", href: "/dashboard/hr/announcements", icon: Megaphone },
//    { label: "Analytics", href: "/dashboard/hr/analytics", icon: BarChart3 },
//]

//export default function EmployeeManagementPage() {

//    const [search, setSearch] = useState("")
//    const [open, setOpen] = useState(false)
//    const [employees, setEmployees] = useState<any[]>([])
//    const [isEdit, setIsEdit] = useState(false)
//    const [editId, setEditId] = useState<string | null>(null)
//    const [loading, setLoading] = useState(false)

//    const { toast } = useToast()

//    const [newEmployee, setNewEmployee] = useState({
//        name: "",
//        email: "",
//        department: "",
//    })

//    // ================= FETCH =================
//    useEffect(() => {
//        fetchEmployees()
//    }, [])

//    async function fetchEmployees() {
//        setLoading(true)

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchatmain-production-75c1.up.railway.app/api/hr/employees", {
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            const data = await res.json()

//            setEmployees(
//                data.map((emp: any) => ({
//                    id: emp.id,
//                    name: emp.name,
//                    email: emp.email,
//                    department: emp.department || "N/A",
//                    status: emp.status
//                }))
//            )

//        } catch (err) {
//            console.error(err)
//        }

//        setLoading(false)
//    }

//    // ================= ADD =================
//    async function handleAddEmployee() {
//        if (!newEmployee.name || !newEmployee.email) {
//            toast({
//                title: "Error ❌",
//                description: "Name and Email required",
//                variant: "destructive"
//            })
//            return
//        }

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchatmain-production-75c1.up.railway.app/api/hr/add-employee", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`,
//                },
//                body: JSON.stringify(newEmployee),
//            })
//            if (!res.ok) {
//                const errText = await res.text()

//                console.error("Add employee error:", res.status, errText)

//                toast({
//                    title: "Error ❌",
//                    description: errText || "Failed to create employee",
//                    variant: "destructive"
//                })
//                return
//            }

//            toast({
//                title: "Success ✅",
//                description: "Employee created & invite sent"
//            })

//            await fetchEmployees()
//            resetForm()

//        } catch (err) {
//            console.error(err)
//        }
//    }

//    const resendInvite = async (userId: string) => {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(`https://calchatmain-production-75c1.up.railway.app/api/hr/resend-invite/${userId}`, {
//                method: "POST",
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            if (!res.ok) {
//                toast({
//                    title: "Error ❌",
//                    description: "Failed to resend invite",
//                    variant: "destructive"
//                })
//                return
//            }

//            toast({
//                title: "Success ✅",
//                description: "Invite resent successfully"
//            })

//        } catch (err) {
//            console.error(err)
//        }
//    }
//    // ================= DELETE =================
//    async function handleDelete(id: string) {
//        if (!confirm("Are you sure?")) return

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(`https://calchatmain-production-75c1.up.railway.app/api/hr/delete-employee/${id}`, {
//                method: "DELETE",
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            if (!res.ok) {
//                toast({
//                    title: "Error ❌",
//                    description: "Delete failed",
//                    variant: "destructive"
//                })
//                return
//            }

//            toast({
//                title: "Deleted",
//                description: "Employee removed successfully"
//            })

//            await fetchEmployees()

//        } catch (err) {
//            console.error(err)
//        }
//    }

//    // ================= EDIT =================
//    async function handleEdit() {
//        if (!editId) return

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(`https://calchatmain-production-75c1.up.railway.app/api/hr/update-employee/${editId}`, {
//                method: "PUT",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },
//                body: JSON.stringify(newEmployee)
//            })

//            if (!res.ok) {
//                toast({
//                    title: "Error ❌",
//                    description: "Update failed",
//                    variant: "destructive"
//                })
//                return
//            }

//            toast({
//                title: "Updated",
//                description: "Employee updated successfully"
//            })

//            await fetchEmployees()
//            resetForm()

//        } catch (err) {
//            console.error(err)
//        }
//    }

//    function resetForm() {
//        setOpen(false)
//        setIsEdit(false)
//        setEditId(null)
//        setNewEmployee({ name: "", email: "", department: "" })
//    }

//    const filteredEmployees = employees.filter(emp =>
//        emp.name.toLowerCase().includes(search.toLowerCase()) ||
//        emp.email.toLowerCase().includes(search.toLowerCase())
//    )

//    return (
//        <DashboardShell navItems={navItems} role="hr" title="Employees Management">
//            <div className="flex flex-col gap-6">

//                {/* TOP BAR */}
//                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                    <div className="relative flex-1 max-w-md">
//                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                        <Input
//                            placeholder="Search employees..."
//                            value={search}
//                            onChange={(e) => setSearch(e.target.value)}
//                            className="pl-10"
//                        />
//                    </div>

//                    <Button onClick={() => setOpen(true)}>
//                        Add Employee
//                    </Button>
//                </div>

//                {/* TABLE */}
//                <div className="rounded-xl border bg-card overflow-hidden">
//                    <div className="overflow-x-auto">

//                        {loading ? (
//                            <p className="text-center py-6">Loading...</p>
//                        ) : (
//                            <table className="w-full">
//                                <thead>
//                                    <tr className="border-b bg-muted/30">
//                                        <th className="px-4 py-3 text-left text-xs">Employee</th>
//                                        <th className="px-4 py-3 text-left text-xs">Department</th>
//                                        <th className="px-4 py-3 text-left text-xs">Status</th>
//                                        <th className="px-4 py-3 text-right text-xs">Actions</th>
//                                    </tr>
//                                </thead>

//                                <tbody>
//                                    {filteredEmployees.map((emp) => (
//                                        <tr key={emp.id} className="border-b hover:bg-muted/20">
//                                            <td className="px-4 py-3">
//                                                <p className="font-medium">{emp.name}</p>
//                                                <p className="text-xs text-muted-foreground">{emp.email}</p>
//                                            </td>

//                                            <td className="px-4 py-3">
//                                                <Badge variant="secondary">{emp.department}</Badge>
//                                            </td>

//                                            <td className="px-4 py-3">
//                                                <Badge variant="outline">{emp.status}</Badge>
//                                            </td>

//                                            <td className="px-4 py-3 text-right">
//                                                <DropdownMenu>
//                                                    <DropdownMenuTrigger asChild>
//                                                        <Button variant="ghost" size="icon">
//                                                            <MoreHorizontal className="h-4 w-4" />
//                                                        </Button>
//                                                    </DropdownMenuTrigger>

//                                                    <DropdownMenuContent align="end">

//                                                        <DropdownMenuItem
//                                                            onClick={() => {
//                                                                setNewEmployee(emp)
//                                                                setEditId(emp.id)
//                                                                setIsEdit(true)
//                                                                setOpen(true)
//                                                            }}
//                                                        >
//                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
//                                                        </DropdownMenuItem>

//                                                        <DropdownMenuItem
//                                                            onClick={() => resendInvite(emp.id)}
//                                                        >
//                                                            <Mail className="mr-2 h-4 w-4" /> Resend Invite
//                                                        </DropdownMenuItem>

//                                                        <DropdownMenuItem
//                                                            className="text-destructive"
//                                                            onClick={() => handleDelete(emp.id)}
//                                                        >
//                                                            <UserX className="mr-2 h-4 w-4" /> Remove
//                                                        </DropdownMenuItem>

//                                                    </DropdownMenuContent>
//                                                </DropdownMenu>
//                                            </td>
//                                        </tr>
//                                    ))}
//                                </tbody>
//                            </table>
//                        )}

//                    </div>
//                </div>

//                {/* MODAL */}
//                <Dialog open={open} onOpenChange={setOpen}>
//                    <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">

//                        {/* HEADER */}
//                        <div className="bg-gradient-to-r from-primary/90 to-primary p-5 text-white">
//                            <DialogTitle className="text-lg font-semibold">
//                                {isEdit ? "✏️ Edit Employee" : "👤 Add Employee"}
//                            </DialogTitle>
//                            <DialogDescription className="text-white opacity-80 mt-1">
//                                Manage employee details efficiently
//                            </DialogDescription>
//                        </div>

//                        {/* BODY */}
//                        <div className="p-5 space-y-5">

//                            {/* NAME */}
//                            <div className="space-y-2">
//                                <Label className="text-sm font-medium">Full Name</Label>
//                                <Input
//                                    placeholder="Enter full name..."
//                                    value={newEmployee.name}
//                                    onChange={(e) =>
//                                        setNewEmployee({ ...newEmployee, name: e.target.value })
//                                    }
//                                    className="rounded-xl h-10"
//                                />
//                            </div>

//                            {/* EMAIL */}
//                            <div className="space-y-2">
//                                <Label className="text-sm font-medium">Email Address</Label>
//                                <Input
//                                    type="email"
//                                    placeholder="Enter email..."
//                                    value={newEmployee.email}
//                                    onChange={(e) =>
//                                        setNewEmployee({ ...newEmployee, email: e.target.value })
//                                    }
//                                    className="rounded-xl h-10"
//                                />
//                            </div>

//                            {/* DEPARTMENT */}
//                            <div className="space-y-2">
//                                <Label className="text-sm font-medium">Department</Label>
//                                <Input
//                                    placeholder="e.g. HR, IT, Sales..."
//                                    value={newEmployee.department}
//                                    onChange={(e) =>
//                                        setNewEmployee({ ...newEmployee, department: e.target.value })
//                                    }
//                                    className="rounded-xl h-10"
//                                />
//                            </div>

//                            {/* ACTION BUTTON */}
//                            <Button
//                                onClick={isEdit ? handleEdit : handleAddEmployee}
//                                className="w-full h-11 rounded-xl text-sm font-medium shadow-lg hover:scale-[1.02] transition-all"
//                            >
//                                {isEdit ? "Update Employee ✏️" : "Create Employee 🚀"}
//                            </Button>

//                        </div>
//                    </DialogContent>
//                </Dialog>

//            </div>
//        </DashboardShell>
//    )
//}



"use client"

import { useState, useEffect } from "react"
import {
    LayoutDashboard, Users, BarChart3, Megaphone,
    Search, MoreHorizontal, UserX, Edit2, Mail,
    Calendar, MessageSquare, Video, CheckCircle2, StickyNote
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog, DialogContent, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

const navItems = [
    { label: "Dashboard", href: "/dashboard/hr", icon: LayoutDashboard },
    { label: "Calendar", href: "/dashboard/hr/calendar", icon: Calendar },
    { label: "AI Chat", href: "/dashboard/hr/chat", icon: MessageSquare },
    { label: "Employees Management", href: "/dashboard/hr/employees", icon: Users },
    { label: "Meetings", href: "/dashboard/hr/meetings", icon: Video },
    { label: "Tasks", href: "/dashboard/hr/tasks", icon: CheckCircle2 },
    { label: "Team", href: "/dashboard/hr/team", icon: Users },
    { label: "Notes", href: "/dashboard/hr/notes", icon: StickyNote },
    { label: "Announcements", href: "/dashboard/hr/announcements", icon: Megaphone },
    { label: "Analytics", href: "/dashboard/hr/analytics", icon: BarChart3 },
]

export default function EmployeeManagementPage() {

    const [search, setSearch] = useState("")
    const [open, setOpen] = useState(false)
    const [employees, setEmployees] = useState<any[]>([])
    const [isEdit, setIsEdit] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [creating, setCreating] = useState(false)
    // ✅ PAGINATION STATE
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 6

    const { toast } = useToast()

    const [newEmployee, setNewEmployee] = useState({
        name: "",
        email: "",
        department: "",
    })

    useEffect(() => {
        fetchEmployees()
    }, [])

    // ✅ RESET PAGE
    useEffect(() => {
        setCurrentPage(1)
    }, [search])


    useEffect(() => {
        fetchEmployees()

        // ✅ Auto refresh every 5 seconds
        const interval = setInterval(() => {
            fetchEmployees()
        }, 5000)

        return () => clearInterval(interval) // cleanup
    }, [])

    async function fetchEmployees() {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")

            const res = await fetch("https://calchatmain-production-75c1.up.railway.app/api/hr/employees", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()

            setEmployees(
                data.map((emp: any) => ({
                    id: emp.id,
                    name: emp.name,
                    email: emp.email,
                    department: emp.department || "N/A",
                    status: emp.status
                }))
            )

        } catch (err) {
            console.error(err)
        }
        setLoading(false)
    }

    // ================= CRUD SAME =================
    async function handleAddEmployee() {
        if (!newEmployee.name || !newEmployee.email) {
            toast({ title: "Error ❌", description: "Name and Email required", variant: "destructive" })
            return
        }

        setCreating(true) // ✅ start loading

        try {
            const token = localStorage.getItem("token")

            const res = await fetch("https://calchatmain-production-75c1.up.railway.app/api/hr/add-employee", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newEmployee),
            })

            const data = await res.json()

            console.log("RESPONSE:", data) // 🔥 DEBUG

            if (!res.ok) {
                toast({ title: "Error ❌", description: data })
                return
            }

            toast({ title: "Success ✅", description: "Employee created & email sent" })

            await fetchEmployees()
            resetForm()  // ✅ now it will close modal

        } catch (err) {
            console.error(err)
            toast({ title: "Error ❌", description: "Something went wrong" })
        }

        setCreating(false) // ✅ stop loading
    }
    async function handleEdit() {
        if (!editId) return

        const token = localStorage.getItem("token")

        await fetch(`https://calchatmain-production-75c1.up.railway.app/api/hr/update-employee/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(newEmployee)
        })

        toast({ title: "Updated" })
        await fetchEmployees()
        resetForm()
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure?")) return

        const token = localStorage.getItem("token")

        await fetch(`https://calchatmain-production-75c1.up.railway.app/api/hr/delete-employee/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })

        toast({ title: "Deleted" })
        await fetchEmployees()
    }

    function resetForm() {
        setOpen(false)
        setIsEdit(false)
        setEditId(null)
        setNewEmployee({ name: "", email: "", department: "" })
    }

    // ================= FILTER =================
    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase())
    )

    // ================= PAGINATION LOGIC =================
    const indexOfLast = currentPage * usersPerPage
    const indexOfFirst = indexOfLast - usersPerPage
    const currentEmployees = filteredEmployees.slice(indexOfFirst, indexOfLast)
    const totalPages = Math.ceil(filteredEmployees.length / usersPerPage)

    return (
        <DashboardShell navItems={navItems} role="hr" title="Employees Management">

            <div className="flex flex-col gap-6">

                {/* SEARCH */}
                <div className="flex justify-between">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search employees..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Button onClick={() => setOpen(true)}>Add Employee</Button>
                </div>

                {/* TABLE */}
                <div className="rounded-xl border bg-card">

                    {loading ? (
                        <p className="text-center p-6">Loading...</p>
                    ) : (
                        <table className="w-full">

                            <thead className="bg-muted/30">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs">Employee</th>
                                    <th className="px-4 py-3 text-left text-xs">Department</th>
                                    <th className="px-4 py-3 text-left text-xs">Status</th>
                                    <th className="px-4 py-3 text-right text-xs">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentEmployees.map(emp => (
                                    <tr key={emp.id} className="border-b hover:bg-muted/20">

                                        <td className="px-4 py-3">
                                            <p className="font-medium">{emp.name}</p>
                                            <p className="text-xs text-muted-foreground">{emp.email}</p>
                                        </td>

                                        <td className="px-4 py-3">
                                            <Badge variant="secondary">{emp.department}</Badge>
                                        </td>

                                        <td className="px-4 py-3">
                                            <Badge variant="outline">{emp.status}</Badge>
                                        </td>

                                        <td className="px-4 py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => {
                                                        setNewEmployee(emp)
                                                        setEditId(emp.id)
                                                        setIsEdit(true)
                                                        setOpen(true)
                                                    }}>
                                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleDelete(emp.id)}
                                                    >
                                                        <UserX className="mr-2 h-4 w-4" /> Remove
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

                {/* 🔢 PAGINATION */}
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
                {/* MODAL */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">

                        {/* HEADER */}
                        <div className="bg-gradient-to-r from-primary/90 to-primary p-5 text-white">
                            <DialogTitle className="text-lg font-semibold">
                                {isEdit ? "✏️ Edit Employee" : "👤 Add Employee"}
                            </DialogTitle>
                            <DialogDescription className="text-white opacity-80 mt-1">
                                Manage employee details efficiently
                            </DialogDescription>
                        </div>

                        {/* BODY */}
                        <div className="p-5 space-y-5">

                            {/* NAME */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Full Name</Label>
                                <Input
                                    placeholder="Enter full name..."
                                    value={newEmployee.name}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, name: e.target.value })
                                    }
                                    className="rounded-xl h-10"
                                />
                            </div>

                            {/* EMAIL */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Email Address</Label>
                                <Input
                                    type="email"
                                    placeholder="Enter email..."
                                    value={newEmployee.email}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, email: e.target.value })
                                    }
                                    className="rounded-xl h-10"
                                />
                            </div>

                            {/* DEPARTMENT */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Department</Label>
                                <Input
                                    placeholder="e.g. HR, IT, Sales..."
                                    value={newEmployee.department}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, department: e.target.value })
                                    }
                                    className="rounded-xl h-10"
                                />
                            </div>

                            {/* ACTION BUTTON */}
                            <Button disabled={creating}>
                                {creating ? "Creating..." : "Create Employee 🚀"}
                            </Button>

                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardShell>
    )
}

