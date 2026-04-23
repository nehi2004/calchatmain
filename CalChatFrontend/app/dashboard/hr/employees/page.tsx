


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
//    Dialog, DialogContent, DialogTitle, DialogDescription
//} from "@/components/ui/dialog"
//import { Label } from "@/components/ui/label"
//import { useToast } from "@/components/ui/use-toast"
//import Swal from "sweetalert2"

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
//    const [creating, setCreating] = useState(false)

//    const [isRefreshing, setIsRefreshing] = useState(false) // ✅ background refresh
//    // ✅ PAGINATION STATE
//    const [currentPage, setCurrentPage] = useState(1)
//    const usersPerPage = 6

//    const { toast } = useToast()

//    const [newEmployee, setNewEmployee] = useState({
//        name: "",
//        email: "",
//        department: "",
//    })


//    // ✅ RESET PAGE
//    useEffect(() => {
//        setCurrentPage(1)
//    }, [search])


//    useEffect(() => {
//        fetchEmployees()

//        // ✅ Auto refresh every 5 seconds
//        const interval = setInterval(() => {
//            fetchEmployees()
//        }, 5000)

//        return () => clearInterval(interval) // cleanup
//    }, [])

//    async function fetchEmployees(isAuto = false) {
//        if (isAuto) {
//            setIsRefreshing(true) // background refresh
//        } else {
//            setLoading(true) // only first load
//        }

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/hr/employees", {
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            const data = await res.json()

//            setEmployees(prev => {
//                // ✅ prevent unnecessary re-render
//                const newData = data.map((emp: any) => ({
//                    id: emp.id,
//                    name: emp.name,
//                    email: emp.email,
//                    department: emp.department || "N/A",
//                    status: emp.status
//                }))

//                return JSON.stringify(prev) !== JSON.stringify(newData)
//                    ? newData
//                    : prev
//            })

//        } catch (err) {
//            console.error(err)
//        }

//        setLoading(false)
//        setIsRefreshing(false)
//    }
//    function resetForm() {
//        setNewEmployee({
//            name: "",
//            email: "",
//            department: "",
//        })

//        setIsEdit(false)
//        setEditId(null)
//        setOpen(false)
//    }

//    // ================= CRUD SAME =================
//    async function handleAddEmployee() {
//        if (!newEmployee.name || !newEmployee.email) {
//            toast({ title: "Error ❌", description: "Name and Email required", variant: "destructive" })
//            return
//        }

//        setCreating(true) // ✅ start loading

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/hr/add-employee", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`,
//                },
//                body: JSON.stringify(newEmployee),
//            })

//            const text = await res.text()

//            let data
//            try {
//                data = JSON.parse(text)
//            } catch {
//                data = { message: text }
//            }
//            if (!res.ok) {
//                toast({ title: "Error ❌", description: data.message || "Failed" })
//                return
//            }

//            console.log("RESPONSE:", data) // 🔥 DEBUG

//            //if (!res.ok) {
//            //    toast({ title: "Error ❌", description: data })
//            //    return
//            //}

//            toast({ title: "Success ✅", description: "Employee created & email sent" })

//            await fetchEmployees()
//            resetForm()  // ✅ now it will close modal

//        } catch (err) {
//            console.error(err)
//            toast({ title: "Error ❌", description: "Something went wrong" })
//        }

//        setCreating(false) // ✅ stop loading
//    }
//    async function handleEdit() {
//        if (!editId) return

//        const token = localStorage.getItem("token")

//        await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/hr/update-employee/${editId}`, {
//            method: "PUT",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`
//            },
//            body: JSON.stringify(newEmployee)
//        })

//        toast({ title: "Updated" })
//        await fetchEmployees()
//        resetForm()
//    }
//    async function handleDelete(id: string) {

//        const result = await Swal.fire({
//            title: "Are you sure?",
//            text: "This employee will be removed permanently!",
//            icon: "warning",
//            showCancelButton: true,
//            confirmButtonColor: "#4f46e5", // indigo
//            cancelButtonColor: "#ef4444", // red
//            confirmButtonText: "Yes, delete it",
//            cancelButtonText: "Cancel",
//            backdrop: true,
//            customClass: {
//                popup: "rounded-2xl",
//                confirmButton: "px-4 py-2 rounded-lg",
//                cancelButton: "px-4 py-2 rounded-lg"
//            }
//        })

//        if (!result.isConfirmed) return

//        try {
//            const token = localStorage.getItem("token")

//            await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/hr/delete-employee/${id}`, {
//                method: "DELETE",
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            // ✅ SUCCESS POPUP
//            await Swal.fire({
//                title: "Deleted!",
//                text: "Employee has been removed.",
//                icon: "success",
//                confirmButtonColor: "#4f46e5"
//            })

//            toast({ title: "Deleted" })
//            await fetchEmployees()

//        } catch (err) {
//            console.error(err)

//            // ❌ ERROR POPUP
//            Swal.fire({
//                title: "Error!",
//                text: "Something went wrong",
//                icon: "error"
//            })
//        }
//    }

//    async function handleResend(id: string) {
//        const confirmResend = confirm("Resend invitation email?");
//        if (!confirmResend) return;

//        try {
//            const token = localStorage.getItem("token");

//            const res = await fetch(
//                `https://steadfast-warmth-production-64c8.up.railway.app/api/hr/resend-invite/${id}`,
//                {
//                    method: "POST",
//                    headers: {
//                        Authorization: `Bearer ${token}`,
//                    },
//                }
//            );

//            const data = await res.json();

//            if (!res.ok) {
//                toast({
//                    title: "Error ❌",
//                    description: data.message || "Failed to resend",
//                    variant: "destructive",
//                });
//                return;
//            }

//            toast({
//                title: "Success ✅",
//                description: "Invitation email resent successfully",
//            });

//        } catch (err) {
//            console.error(err);
//            toast({
//                title: "Error ❌",
//                description: "Something went wrong",
//            });
//        }
//    }

//    // ================= FILTER =================
//    const filteredEmployees = employees.filter(emp =>
//        emp.name.toLowerCase().includes(search.toLowerCase()) ||
//        emp.email.toLowerCase().includes(search.toLowerCase())
//    )

//    // ================= PAGINATION LOGIC =================
//    const indexOfLast = currentPage * usersPerPage
//    const indexOfFirst = indexOfLast - usersPerPage
//    const currentEmployees = filteredEmployees.slice(indexOfFirst, indexOfLast)
//    const totalPages = Math.ceil(filteredEmployees.length / usersPerPage)

//    return (
//        <DashboardShell navItems={navItems} role="hr" title="Employees Management">

//            <div className="flex flex-col gap-6">

//                {/* SEARCH */}
//                <div className="flex justify-between">
//                    <div className="relative max-w-md w-full">
//                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                        <Input
//                            placeholder="Search employees..."
//                            value={search}
//                            onChange={(e) => setSearch(e.target.value)}
//                            className="pl-10"
//                        />
//                    </div>

//                    <Button onClick={() => setOpen(true)}>Add Employee</Button>
//                </div>

//                {/* TABLE */}
//                <div className="rounded-xl border bg-card">

//                    {loading && employees.length === 0 ? (
//                        <p className="text-center p-6">Loading...</p>
//                    ) : (

//                        <table className="w-full">

//                            <thead className="bg-muted/30">
//                                <tr>
//                                    <th className="px-4 py-3 text-left text-xs">Employee</th>
//                                    <th className="px-4 py-3 text-left text-xs">Department</th>
//                                    <th className="px-4 py-3 text-left text-xs">Status</th>
//                                    <th className="px-4 py-3 text-right text-xs">Actions</th>
//                                </tr>
//                            </thead>

//                            <tbody>
//                                {currentEmployees.map(emp => (
//                                    <tr key={emp.id} className="border-b hover:bg-muted/20">

//                                        <td className="px-4 py-3">
//                                            <p className="font-medium">{emp.name}</p>
//                                            <p className="text-xs text-muted-foreground">{emp.email}</p>
//                                        </td>

//                                        <td className="px-4 py-3">
//                                            <Badge variant="secondary">{emp.department}</Badge>
//                                        </td>

//                                        <td className="px-4 py-3">
//                                            <Badge variant="outline">{emp.status}</Badge>
//                                        </td>

//                                        <td className="px-4 py-3 text-right">
//                                            <DropdownMenu>
//                                                <DropdownMenuTrigger asChild>
//                                                    <Button variant="ghost" size="icon">
//                                                        <MoreHorizontal className="h-4 w-4" />
//                                                    </Button>
//                                                </DropdownMenuTrigger>

//                                                <DropdownMenuContent align="end">
//                                                    <DropdownMenuItem onClick={() => {
//                                                        setNewEmployee(emp)
//                                                        setEditId(emp.id)
//                                                        setIsEdit(true)
//                                                        setOpen(true)
//                                                    }}>
//                                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
//                                                    </DropdownMenuItem>
//                                                    {emp.status === "Invited" && (
//                                                        <DropdownMenuItem onClick={() => handleResend(emp.id)}>
//                                                            <Mail className="mr-2 h-4 w-4" /> Resend Invite
//                                                        </DropdownMenuItem>
//                                                    )}
//                                                    <DropdownMenuItem
//                                                        className="text-destructive"
//                                                        onClick={() => handleDelete(emp.id)}
//                                                    >
//                                                        <UserX className="mr-2 h-4 w-4" /> Remove
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

//                {/* 🔢 PAGINATION */}
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

//                            {/*<Button*/}
//                            {/*    onClick={isEdit ? handleEdit : handleAddEmployee}*/}
//                            {/*    disabled={creating}*/}
//                            {/*>*/}
//                            {/*    {creating*/}
//                            {/*        ? "Processing..."*/}
//                            {/*        : isEdit*/}
//                            {/*            ? "Update Employee ✏️"*/}
//                            {/*            : "Create Employee 🚀"}*/}
//                            {/*</Button>*/}
//                            <Button
//                                onClick={isEdit ? handleEdit : handleAddEmployee}
//                                disabled={creating}
//                                className={`w-full h-11 rounded-xl font-medium transition-all duration-300 
//    ${isEdit
//                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30"
//                                        : "bg-gradient-to-r from-emerald-500 to-green-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/30"
//                                    }`}
//                            >
//                                <span className="flex items-center justify-center gap-2">
//                                    {creating ? (
//                                        <>
//                                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
//                                            Processing...
//                                        </>
//                                    ) : isEdit ? (
//                                        <>
//                                            <Edit2 className="h-4 w-4" />
//                                            Save Changes
//                                        </>
//                                    ) : (
//                                        <>
//                                            <Users className="h-4 w-4" />
//                                            Create Employee
//                                        </>
//                                    )}
//                                </span>
//                            </Button>
//                        </div>
//                    </DialogContent>
//                </Dialog>

//            </div>
//        </DashboardShell>
//    )
//}

"use client"

import { useEffect, useMemo, useState } from "react"
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Megaphone,
    Search,
    MoreHorizontal,
    UserX,
    Edit2,
    Mail,
    Calendar,
    MessageSquare,
    Video,
    CheckCircle2,
    StickyNote,
    Building2,
    UserCheck,
    UserPlus,
    RefreshCw,
    Inbox,
} from "lucide-react"

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
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import Swal from "sweetalert2"

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

const API_BASE = "https://steadfast-warmth-production-64c8.up.railway.app"

type EmployeeStatus = "Active" | "Invited" | "Inactive" | "Unknown"

interface EmployeeItem {
    id: string
    name: string
    email: string
    department: string
    status: EmployeeStatus
}

function getStatusClasses(status: string) {
    switch ((status || "").toLowerCase()) {
        case "active":
            return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
        case "invited":
            return "border-amber-500/20 bg-amber-500/10 text-amber-700"
        case "inactive":
            return "border-rose-500/20 bg-rose-500/10 text-rose-700"
        default:
            return "border-slate-500/20 bg-slate-500/10 text-slate-700"
    }
}

function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email)
}

export default function EmployeeManagementPage() {
    const [search, setSearch] = useState("")
    const [departmentFilter, setDepartmentFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")

    const [open, setOpen] = useState(false)
    const [employees, setEmployees] = useState<EmployeeItem[]>([])
    const [isEdit, setIsEdit] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 6

    const { toast } = useToast()

    const [newEmployee, setNewEmployee] = useState({
        name: "",
        email: "",
        department: "",
    })

    useEffect(() => {
        setCurrentPage(1)
    }, [search, departmentFilter, statusFilter])

    useEffect(() => {
        fetchEmployees()

        const interval = setInterval(() => {
            fetchEmployees(true)
        }, 30000)

        const onFocus = () => fetchEmployees(true)
        window.addEventListener("focus", onFocus)

        return () => {
            clearInterval(interval)
            window.removeEventListener("focus", onFocus)
        }
    }, [])

    async function fetchEmployees(isAuto = false) {
        if (isAuto) {
            setIsRefreshing(true)
        } else {
            setLoading(true)
        }

        try {
            const token = localStorage.getItem("token")

            const res = await fetch(`${API_BASE}/api/hr/employees`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                throw new Error("Failed to fetch employees")
            }

            const data = await res.json()

            const mapped: EmployeeItem[] = data.map((emp: any) => ({
                id: emp.id,
                name: emp.name || "Unknown",
                email: emp.email || "",
                department: emp.department || "N/A",
                status: (emp.status || "Unknown") as EmployeeStatus,
            }))

            setEmployees(mapped)
        } catch (err) {
            console.error(err)
            if (!isAuto) {
                toast({
                    title: "Error",
                    description: "Unable to load employees",
                    variant: "destructive",
                })
            }
        } finally {
            setLoading(false)
            setIsRefreshing(false)
        }
    }

    function resetForm() {
        setNewEmployee({
            name: "",
            email: "",
            department: "",
        })
        setIsEdit(false)
        setEditId(null)
    }

    function openCreateModal() {
        resetForm()
        setOpen(true)
    }

    function normalizeForm() {
        return {
            name: newEmployee.name.trim(),
            email: newEmployee.email.trim(),
            department: newEmployee.department.trim(),
        }
    }

    function validateForm() {
        const cleaned = normalizeForm()

        if (cleaned.name.length < 2) {
            toast({
                title: "Error",
                description: "Name must be at least 2 characters",
                variant: "destructive",
            })
            return false
        }

        if (!isValidEmail(cleaned.email)) {
            toast({
                title: "Error",
                description: "Enter a valid email address",
                variant: "destructive",
            })
            return false
        }

        return true
    }

    async function handleAddEmployee() {
        if (!validateForm()) return

        setSubmitting(true)

        try {
            const token = localStorage.getItem("token")
            const payload = normalizeForm()

            const res = await fetch(`${API_BASE}/api/hr/add-employee`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            const text = await res.text()
            let data: any
            try {
                data = JSON.parse(text)
            } catch {
                data = { message: text }
            }

            if (!res.ok) {
                toast({
                    title: "Error",
                    description: data.message || "Failed to create employee",
                    variant: "destructive",
                })
                return
            }

            toast({
                title: "Success",
                description: "Employee created and invitation sent",
            })

            await fetchEmployees(true)
            resetForm()
            setOpen(false)
        } catch (err) {
            console.error(err)
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    async function handleEdit() {
        if (!editId) return
        if (!validateForm()) return

        setSubmitting(true)

        try {
            const token = localStorage.getItem("token")
            const payload = normalizeForm()

            const res = await fetch(`${API_BASE}/api/hr/update-employee/${editId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            const text = await res.text()
            let data: any
            try {
                data = JSON.parse(text)
            } catch {
                data = { message: text }
            }

            if (!res.ok) {
                toast({
                    title: "Error",
                    description: data.message || "Failed to update employee",
                    variant: "destructive",
                })
                return
            }

            toast({
                title: "Updated",
                description: "Employee updated successfully",
            })

            await fetchEmployees(true)
            resetForm()
            setOpen(false)
        } catch (err) {
            console.error(err)
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id: string) {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This employee will be removed permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            backdrop: true,
            customClass: {
                popup: "rounded-2xl",
                confirmButton: "px-4 py-2 rounded-lg",
                cancelButton: "px-4 py-2 rounded-lg",
            },
        })

        if (!result.isConfirmed) return

        try {
            const token = localStorage.getItem("token")

            const res = await fetch(`${API_BASE}/api/hr/delete-employee/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                throw new Error("Delete failed")
            }

            await Swal.fire({
                title: "Deleted!",
                text: "Employee has been removed.",
                icon: "success",
                confirmButtonColor: "#2563eb",
            })

            toast({ title: "Deleted" })
            await fetchEmployees(true)
        } catch (err) {
            console.error(err)
            Swal.fire({
                title: "Error!",
                text: "Something went wrong",
                icon: "error",
            })
        }
    }

    async function handleResend(id: string) {
        const result = await Swal.fire({
            title: "Resend invitation?",
            text: "A new invitation email will be sent to this employee.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "Resend",
            cancelButtonText: "Cancel",
            customClass: {
                popup: "rounded-2xl",
            },
        })

        if (!result.isConfirmed) return

        try {
            const token = localStorage.getItem("token")

            const res = await fetch(`${API_BASE}/api/hr/resend-invite/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await res.json().catch(() => ({}))

            if (!res.ok) {
                toast({
                    title: "Error",
                    description: data.message || "Failed to resend invitation",
                    variant: "destructive",
                })
                return
            }

            toast({
                title: "Success",
                description: "Invitation email resent successfully",
            })
        } catch (err) {
            console.error(err)
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            })
        }
    }

    const departmentOptions = useMemo(() => {
        return Array.from(
            new Set(
                employees
                    .map((emp) => emp.department)
                    .filter((dep) => dep && dep !== "N/A")
            )
        ).sort()
    }, [employees])

    const filteredEmployees = useMemo(() => {
        return employees.filter((emp) => {
            const matchesSearch =
                emp.name.toLowerCase().includes(search.toLowerCase()) ||
                emp.email.toLowerCase().includes(search.toLowerCase())

            const matchesDepartment =
                departmentFilter === "all" || emp.department === departmentFilter

            const matchesStatus =
                statusFilter === "all" || emp.status.toLowerCase() === statusFilter.toLowerCase()

            return matchesSearch && matchesDepartment && matchesStatus
        })
    }, [employees, search, departmentFilter, statusFilter])

    const indexOfLast = currentPage * usersPerPage
    const indexOfFirst = indexOfLast - usersPerPage
    const currentEmployees = filteredEmployees.slice(indexOfFirst, indexOfLast)
    const totalPages = Math.ceil(filteredEmployees.length / usersPerPage)

    const totalEmployees = employees.length
    const activeEmployees = employees.filter((emp) => emp.status.toLowerCase() === "active").length
    const invitedEmployees = employees.filter((emp) => emp.status.toLowerCase() === "invited").length
    const departmentCount = departmentOptions.length

    return (
        <DashboardShell navItems={navItems} role="hr" title="Employees Management">
            <div className="flex flex-col gap-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        { label: "Total Employees", value: totalEmployees, icon: Users },
                        { label: "Active", value: activeEmployees, icon: UserCheck },
                        { label: "Invited", value: invitedEmployees, icon: UserPlus },
                        { label: "Departments", value: departmentCount, icon: Building2 },
                    ].map((item, index) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={index}
                                className="rounded-2xl border bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-4"
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">{item.label}</p>
                                    <Icon className="h-4 w-4 text-blue-600" />
                                </div>
                                <p className="text-2xl font-bold">{item.value}</p>
                            </div>
                        )
                    })}
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="grid w-full gap-3 md:grid-cols-[1fr_180px_180px] lg:max-w-4xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search employees..."
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
                            {departmentOptions.map((dep) => (
                                <option key={dep} value={dep}>
                                    {dep}
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

                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => fetchEmployees(true)} disabled={isRefreshing}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                        <Button onClick={openCreateModal}>Add Employee</Button>
                    </div>
                </div>

                <div className="rounded-2xl border bg-card">
                    {loading && employees.length === 0 ? (
                        <div className="p-6">
                            <p className="text-center text-sm text-muted-foreground">Loading employees...</p>
                        </div>
                    ) : filteredEmployees.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                            <Inbox className="h-10 w-10 text-muted-foreground" />
                            <div>
                                <p className="font-medium">No employees found</p>
                                <p className="text-sm text-muted-foreground">
                                    Try a different search or add a new employee.
                                </p>
                            </div>
                            <Button onClick={openCreateModal}>Add Employee</Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
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
                                    {currentEmployees.map((emp) => (
                                        <tr key={emp.id} className="border-b transition hover:bg-muted/20">
                                            <td className="px-4 py-4">
                                                <p className="font-medium">{emp.name}</p>
                                                <p className="text-xs text-muted-foreground">{emp.email}</p>
                                            </td>

                                            <td className="px-4 py-4">
                                                <Badge variant="secondary">{emp.department}</Badge>
                                            </td>

                                            <td className="px-4 py-4">
                                                <Badge className={getStatusClasses(emp.status)}>{emp.status}</Badge>
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setNewEmployee({
                                                                    name: emp.name,
                                                                    email: emp.email,
                                                                    department: emp.department === "N/A" ? "" : emp.department,
                                                                })
                                                                setEditId(emp.id)
                                                                setIsEdit(true)
                                                                setOpen(true)
                                                            }}
                                                        >
                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>

                                                        {emp.status === "Invited" && (
                                                            <DropdownMenuItem onClick={() => handleResend(emp.id)}>
                                                                <Mail className="mr-2 h-4 w-4" /> Resend Invite
                                                            </DropdownMenuItem>
                                                        )}

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
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
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
                )}

                <Dialog
                    open={open}
                    onOpenChange={(value) => {
                        setOpen(value)
                        if (!value) resetForm()
                    }}
                >
                    <DialogContent className="max-w-md overflow-hidden rounded-2xl p-0">
                        <div className="bg-gradient-to-r from-primary/90 to-primary p-5 text-white">
                            <DialogTitle className="text-lg font-semibold">
                                {isEdit ? "Edit Employee" : "Add Employee"}
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-white/80">
                                Manage employee details efficiently
                            </DialogDescription>
                        </div>

                        <div className="space-y-5 p-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Full Name</Label>
                                <Input
                                    placeholder="Enter full name..."
                                    value={newEmployee.name}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, name: e.target.value })
                                    }
                                    className="h-10 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Email Address</Label>
                                <Input
                                    type="email"
                                    placeholder="Enter email..."
                                    value={newEmployee.email}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, email: e.target.value })
                                    }
                                    className="h-10 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Department</Label>
                                <Input
                                    placeholder="e.g. HR, IT, Sales..."
                                    value={newEmployee.department}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, department: e.target.value })
                                    }
                                    className="h-10 rounded-xl"
                                />
                            </div>

                            <Button
                                onClick={isEdit ? handleEdit : handleAddEmployee}
                                disabled={submitting}
                                className={`h-11 w-full rounded-xl font-medium transition-all duration-300 ${isEdit
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30"
                                        : "bg-gradient-to-r from-emerald-500 to-green-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/30"
                                    }`}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {submitting ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Processing...
                                        </>
                                    ) : isEdit ? (
                                        <>
                                            <Edit2 className="h-4 w-4" />
                                            Save Changes
                                        </>
                                    ) : (
                                        <>
                                            <Users className="h-4 w-4" />
                                            Create Employee
                                        </>
                                    )}
                                </span>
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardShell>
    )
}

