


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

export default function EmployeeManagementPage() {

    const [search, setSearch] = useState("")
    const [open, setOpen] = useState(false)
    const [employees, setEmployees] = useState<any[]>([])
    const [isEdit, setIsEdit] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [creating, setCreating] = useState(false)

    const [isRefreshing, setIsRefreshing] = useState(false) // ✅ background refresh
    // ✅ PAGINATION STATE
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 6

    const { toast } = useToast()

    const [newEmployee, setNewEmployee] = useState({
        name: "",
        email: "",
        department: "",
    })


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

    async function fetchEmployees(isAuto = false) {
        if (isAuto) {
            setIsRefreshing(true) // background refresh
        } else {
            setLoading(true) // only first load
        }

        try {
            const token = localStorage.getItem("token")

            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/hr/employees", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()

            setEmployees(prev => {
                // ✅ prevent unnecessary re-render
                const newData = data.map((emp: any) => ({
                    id: emp.id,
                    name: emp.name,
                    email: emp.email,
                    department: emp.department || "N/A",
                    status: emp.status
                }))

                return JSON.stringify(prev) !== JSON.stringify(newData)
                    ? newData
                    : prev
            })

        } catch (err) {
            console.error(err)
        }

        setLoading(false)
        setIsRefreshing(false)
    }
    function resetForm() {
        setNewEmployee({
            name: "",
            email: "",
            department: "",
        })

        setIsEdit(false)
        setEditId(null)
        setOpen(false)
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

            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/hr/add-employee", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newEmployee),
            })

            const text = await res.text()

            let data
            try {
                data = JSON.parse(text)
            } catch {
                data = { message: text }
            }
            if (!res.ok) {
                toast({ title: "Error ❌", description: data.message || "Failed" })
                return
            }

            console.log("RESPONSE:", data) // 🔥 DEBUG

            //if (!res.ok) {
            //    toast({ title: "Error ❌", description: data })
            //    return
            //}

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

        await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/hr/update-employee/${editId}`, {
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

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This employee will be removed permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#4f46e5", // indigo
            cancelButtonColor: "#ef4444", // red
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            backdrop: true,
            customClass: {
                popup: "rounded-2xl",
                confirmButton: "px-4 py-2 rounded-lg",
                cancelButton: "px-4 py-2 rounded-lg"
            }
        })

        if (!result.isConfirmed) return

        try {
            const token = localStorage.getItem("token")

            await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/hr/delete-employee/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })

            // ✅ SUCCESS POPUP
            await Swal.fire({
                title: "Deleted!",
                text: "Employee has been removed.",
                icon: "success",
                confirmButtonColor: "#4f46e5"
            })

            toast({ title: "Deleted" })
            await fetchEmployees()

        } catch (err) {
            console.error(err)

            // ❌ ERROR POPUP
            Swal.fire({
                title: "Error!",
                text: "Something went wrong",
                icon: "error"
            })
        }
    }

    async function handleResend(id: string) {
        const confirmResend = confirm("Resend invitation email?");
        if (!confirmResend) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `https://steadfast-warmth-production-64c8.up.railway.app/api/hr/resend-invite/${id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                toast({
                    title: "Error ❌",
                    description: data.message || "Failed to resend",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Success ✅",
                description: "Invitation email resent successfully",
            });

        } catch (err) {
            console.error(err);
            toast({
                title: "Error ❌",
                description: "Something went wrong",
            });
        }
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

                    {loading && employees.length === 0 ? (
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

                            {/*<Button*/}
                            {/*    onClick={isEdit ? handleEdit : handleAddEmployee}*/}
                            {/*    disabled={creating}*/}
                            {/*>*/}
                            {/*    {creating*/}
                            {/*        ? "Processing..."*/}
                            {/*        : isEdit*/}
                            {/*            ? "Update Employee ✏️"*/}
                            {/*            : "Create Employee 🚀"}*/}
                            {/*</Button>*/}
                            <Button
                                onClick={isEdit ? handleEdit : handleAddEmployee}
                                disabled={creating}
                                className={`w-full h-11 rounded-xl font-medium transition-all duration-300 
    ${isEdit
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30"
                                        : "bg-gradient-to-r from-emerald-500 to-green-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/30"
                                    }`}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {creating ? (
                                        <>
                                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
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

