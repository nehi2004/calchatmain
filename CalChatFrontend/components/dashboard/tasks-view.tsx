


//"use client"

//import { useState, useEffect } from "react"
//import { useRouter } from "next/navigation"
//import {
//    Plus,
//    Trash2,
//    CheckCircle2,
//    Clock,
//    Circle,
//    Calendar as CalendarIcon,
//} from "lucide-react"

//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"
//import { Badge } from "@/components/ui/badge"
//import { Progress } from "@/components/ui/progress"
//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle,
//    DialogTrigger,
//    DialogDescription,
//} from "@/components/ui/dialog"
//import {
//    Select,
//    SelectContent,
//    SelectItem,
//    SelectTrigger,
//    SelectValue,
//} from "@/components/ui/select"
//import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
//import { cn } from "@/lib/utils"

//const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks"

//export function TasksView() {

//    const router = useRouter()

//    type Task = {
//        id: string
//        title: string
//        description: string
//        priority: string
//        status: "Todo" | "In Progress" | "Completed"
//        deadline?: string
//        category?: string
//        userId?: string

//        // 🔥 ADD THIS
//        assignedUserName?: string
//        assignedByName?: string
//    }

//    const [tasks, setTasks] = useState<Task[]>([])
//    const [dialogOpen, setDialogOpen] = useState(false)

//    // ✅ HR FEATURES
//    const [users, setUsers] = useState<any[]>([])
//    const [selectedUser, setSelectedUser] = useState("")
//    const [role, setRole] = useState("")

//    const [newTask, setNewTask] = useState({
//        title: "",
//        description: "",
//        priority: "",
//        deadline: "",
//        category: "Work",
//    })

//    // ================= INIT =================
//    useEffect(() => {
//        const token = localStorage.getItem("token")
//        if (!token) return router.push("/login")

//        const payload = JSON.parse(atob(token.split(".")[1]))
//        const userRole =
//            payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]

//        setRole(userRole)

//        fetchTasks()
//        if (userRole === "hr") {
//            fetchUsers()
//        }
//    }, [])

//    useEffect(() => {
//        const token = localStorage.getItem("token")
//        if (!token) return router.push("/login")

//        const payload = JSON.parse(atob(token.split(".")[1]))
//        const userRole =
//            payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]

//        setRole(userRole)

//        fetchTasks()

//        if (userRole === "hr") {
//            fetchUsers()
//        }

//        // 🔥 AUTO REFRESH EVERY 3 SEC
//        const interval = setInterval(() => {
//            fetchTasks()
//        }, 3000)

//        return () => clearInterval(interval)

//    }, [])
//    // ================= USERS =================
//    async function fetchUsers() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/meeting/users", {
//                headers: { Authorization: `Bearer ${token}` },
//            })

//            if (!res.ok) {
//                console.error("Users API failed:", res.status)
//                return
//            }

//            const text = await res.text()

//            if (!text) {
//                console.warn("Empty users response")
//                return
//            }

//            const data = JSON.parse(text)

//            const valid = data.filter(
//                (u: any) => u && u.id && u.fullName && u.fullName.trim() !== ""
//            )

//            setUsers(valid)
//        } catch (err) {
//            console.error("fetchUsers error:", err)
//        }
//    }

//    // ================= TASKS =================
//    async function fetchTasks() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(API_URL, {
//                headers: { Authorization: `Bearer ${token}` },
//            })

//            if (!res.ok) {
//                console.error("Tasks API failed:", res.status)
//                return
//            }

//            const text = await res.text()

//            if (!text) {
//                console.warn("Empty tasks response")
//                return
//            }

//            const data = JSON.parse(text)

//            //setTasks(
//            //    data.map((t: any) => ({
//            //        ...t,
//            //        deadline: t.deadline?.split("T")[0],
//            //    }))
//            //)
//            const formatted = data.map((t: any) => ({
//                ...t,
//                deadline: t.deadline?.split("T")[0],
//            }))

//            // ✅ SORT BY DATE (ASCENDING)
//            formatted.sort((a: any, b: any) => {
//                if (!a.deadline) return 1
//                if (!b.deadline) return -1

//                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
//            })

//            setTasks(formatted)
//        } catch (err) {
//            console.error("fetchTasks error:", err)
//        }
//    }

//    // ================= ADD =================
//    async function handleAddTask() {
//        if (!newTask.title || !newTask.priority) {
//            alert("Fill required fields")
//            return
//        }

//        const token = localStorage.getItem("token")

//        const body: any = {
//            ...newTask,
//            status: "Todo",
//            deadline: newTask.deadline
//                ? new Date(newTask.deadline).toISOString()
//                : null,
//        }

//        // ✅ HR ASSIGN
//        if (role === "hr") {
//            if (!selectedUser) {
//                alert("Select employee")
//                return
//            }
//            body.userId = selectedUser  // backend single user support
//        }

//        await fetch(API_URL, {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`,
//            },
//            body: JSON.stringify(body),
//        })

//        // ✅ AFTER TASK CREATED → SEND NOTIFICATION TO EMPLOYEE
//        if (role === "hr" && selectedUser) {

//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/notifications", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`   // ✅ FIX ADDED
//                },
//                body: JSON.stringify({
//                    fromUserId: localStorage.getItem("userId"),
//                    toUserId: selectedUser,
//                    fromUserName: localStorage.getItem("name"), // ✅ ADD
//                    content: `assigned you a new task: ${newTask.title}`,
//                    type: "task",   // ✅ VERY IMPORTANT
//                    status: "pending"
//                })
//            })

//            if (!res.ok) {
//                console.error("❌ Notification failed", await res.text())
//            } else {
//                console.log("✅ Notification sent")
//            }
//        }

//        setDialogOpen(false)
//        setNewTask({
//            title: "",
//            description: "",
//            priority: "",
//            deadline: "",
//            category: "Work",
//        })
//        setSelectedUser("")

//        fetchTasks()
//    }

//    // ================= DELETE =================
//    async function handleDeleteTask(id: string) {
//        const token = localStorage.getItem("token")

//        try {
//            const res = await fetch(`${API_URL}/${id}`, {
//                method: "DELETE",
//                headers: {
//                    Authorization: `Bearer ${token}`,
//                },
//            })

//            if (!res.ok) {
//                const errText = await res.text()
//                console.error("Delete failed:", errText)
//                alert("Delete failed ❌")
//                return
//            }

//            console.log("Deleted successfully ✅")
//            fetchTasks()

//        } catch (err) {
//            console.error("Delete error:", err)
//        }
//    }

//    // ================= TOGGLE =================
//    async function handleToggleStatus(task: {
//        id: string
//        status: "Todo" | "In Progress" | "Completed"
//    }) {
//        const token = localStorage.getItem("token")

//        const next: Record<"Todo" | "In Progress" | "Completed", "Todo" | "In Progress" | "Completed"> = {
//            Todo: "In Progress",
//            "In Progress": "Completed",
//            Completed: "Todo",
//        }
//        await fetch(`${API_URL}/${task.id}`, {
//            method: "PUT",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`,
//            },
//            body: JSON.stringify({
//                ...task,
//                status: next[task.status],
//            }),
//        })

//        fetchTasks()
//    }
//    async function updateTaskStatus(task: Task, newStatus: "Todo" | "In Progress" | "Completed") {
//        const token = localStorage.getItem("token")

//        await fetch(`${API_URL}/${task.id}`, {
//            method: "PUT",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`,
//            },
//            body: JSON.stringify({
//                ...task, // 🔥 FULL TASK SEND
//                status: newStatus,
//            }),
//        })



//        fetchTasks()
//    }

//    // ================= STATS =================
//    const completed = tasks.filter(t => t.status === "Completed").length
//    const progress = tasks.filter(t => t.status === "In Progress").length
//    const todo = tasks.filter(t => t.status === "Todo").length

//    const percent = tasks.length
//        ? Math.round((completed / tasks.length) * 100)
//        : 0

//    // ================= UI =================


//    function renderTasks(list: any[], tab: "all" | "todo" | "progress" | "completed") {
//        if (!list.length) {
//            return <p className="text-center text-muted-foreground py-6">No tasks</p>
//        }

//        return (
//            <div className="flex flex-col gap-4">
//                {list.map(task => (
//                    <div
//                        key={task.id}
//                        className="flex items-center gap-4 rounded-2xl border bg-background/60 backdrop-blur-md p-4 shadow-sm hover:shadow-xl transition-all"
//                    >


//                        <div className="flex-1">
//                            <div className="flex gap-2 items-center flex-wrap">

//                                <p className={cn(
//                                    "font-medium",
//                                    task.status === "Completed" && "line-through opacity-60"
//                                )}>
//                                    {task.title}
//                                </p>

//                                <Badge
//                                    variant="outline"
//                                    className={
//                                        task.priority === "High"
//                                            ? "text-red-600 border-red-300"
//                                            : task.priority === "Medium"
//                                                ? "text-yellow-600 border-yellow-300"
//                                                : "text-green-600 border-green-300"
//                                    }
//                                >
//                                    {task.priority}
//                                </Badge>

//                                {task.category && (
//                                    <Badge variant="secondary" className="text-xs">
//                                        {task.category}
//                                    </Badge>
//                                )}

//                                {/* ✅ SHOW ASSIGNED EMPLOYEE */}
//                                {/* ✅ SHOW ASSIGNED EMPLOYEES */}
//                                {(task.userIds || task.userId) && (
//                                    <div className="flex flex-wrap gap-1">



//                                        <div className="flex flex-wrap gap-1">

//                                            {task.userId && (
//                                                <div className="flex flex-wrap gap-2 mt-1">

//                                                    {/* ✅ HR VIEW → Show Employee only */}
//                                                    {role === "hr" && task.assignedUserName && (
//                                                        <Badge variant="secondary" className="text-xs">
//                                                            👤 {task.assignedUserName}
//                                                        </Badge>
//                                                    )}

//                                                    {/* ✅ EMPLOYEE VIEW → Show HR only */}
//                                                    {role !== "hr" && task.assignedByName && (
//                                                        <Badge variant="outline" className="text-xs">
//                                                            🧑‍💼 {task.assignedByName}
//                                                        </Badge>
//                                                    )}

//                                                </div>
//                                            )}
//                                        </div>



//                                    </div>
//                                )}
//                            </div>
//                            {/* DESCRIPTION */}
//                            <p className="text-sm text-muted-foreground mt-1">
//                                {task.description}
//                            </p>

//                            {/* ✅ BUTTONS BELOW DESCRIPTION (CENTERED & CLEAN) */}
//                            {/* ✅ BUTTONS BELOW DESCRIPTION (MODERN UI) */}


//                            <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
//                                <span className="flex items-center gap-1">
//                                    <CalendarIcon className="h-3 w-3" />
//                                    {task.deadline || "No deadline"}
//                                </span>
//                            </div>
//                        </div>

//                        {/* ✅ RIGHT SIDE ACTIONS (BEST UI) */}
//                        <div className="flex items-center gap-2">

//                            {tab !== "all" && (
//                                <>
//                                    {/* TODO */}
//                                    {task.status === "Todo" && (
//                                        <Button
//                                            size="sm"
//                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3"
//                                            onClick={() => updateTaskStatus(task, "In Progress")}
//                                        >
//                                            Start 🚀
//                                        </Button>
//                                    )}

//                                    {/* IN PROGRESS */}
//                                    {task.status === "In Progress" && (
//                                        <>
//                                            <Button
//                                                size="sm"
//                                                variant="outline"
//                                                className="px-3"
//                                                onClick={() => updateTaskStatus(task, "Todo")}
//                                            >
//                                                Reset 🔁
//                                            </Button>

//                                            <Button
//                                                size="sm"
//                                                variant="outline"
//                                                className="px-3"
//                                                onClick={() => updateTaskStatus(task, "Completed")}
//                                            >
//                                                Done ✅
//                                            </Button>
//                                        </>
//                                    )}

//                                    {/* COMPLETED */}
//                                    {task.status === "Completed" && (
//                                        <Button
//                                            size="sm"
//                                            variant="outline"
//                                            className="px-3"
//                                            onClick={() => updateTaskStatus(task, "In Progress")}
//                                        >
//                                            Reopen 🔁
//                                        </Button>
//                                    )}
//                                </>
//                            )}

//                            {/* DELETE */}
//                            <Button
//                                variant="ghost"
//                                size="icon"
//                                onClick={() => handleDeleteTask(task.id)}
//                            >
//                                <Trash2 />
//                            </Button>
//                        </div>
//                    </div>
//                ))}
//            </div>
//        )
//    }

//    return (
//        <div className="flex flex-col gap-6">

//            {/* HEADER */}
//            <div className="flex justify-between items-center">
//                <h2 className="text-2xl font-semibold">Task Manager</h2>

//                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                    <DialogTrigger asChild>
//                        <Button className="gap-2 shadow-lg">
//                            <Plus /> Add Task
//                        </Button>
//                    </DialogTrigger>

//                    <DialogContent
//                        className="max-w-md p-0 overflow-hidden rounded-2xl border border-white/10
//    bg-white dark:bg-[#020617] text-gray-900 dark:text-white shadow-xl"
//                    >

//                        {/* HEADER */}
//                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-white">
//                            <DialogTitle className="text-base font-semibold flex items-center gap-2">
//                                📝 Create Task
//                            </DialogTitle>
//                            <DialogDescription className="text-xs text-blue-100 mt-1">
//                                Add and assign tasks quickly
//                            </DialogDescription>
//                        </div>

//                        {/* BODY */}
//                        <div className="p-4 space-y-4">

//                            {/* TITLE */}
//                            <div className="space-y-1">
//                                <Label className="text-xs">Title</Label>
//                                <Input
//                                    placeholder="e.g. Design Dashboard UI"
//                                    value={newTask.title}
//                                    onChange={(e) =>
//                                        setNewTask({ ...newTask, title: e.target.value })
//                                    }
//                                    className="h-9 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg"
//                                />
//                            </div>

//                            {/* DESCRIPTION */}
//                            <div className="space-y-1">
//                                <Label className="text-xs">Description</Label>
//                                <textarea
//                                    placeholder="Task details..."
//                                    value={newTask.description}
//                                    onChange={(e) =>
//                                        setNewTask({ ...newTask, description: e.target.value })
//                                    }
//                                    className="w-full rounded-lg border border-gray-200 dark:border-white/10 
//                bg-gray-50 dark:bg-white/5 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                    rows={3}
//                                />
//                            </div>

//                            {/* PRIORITY + CATEGORY */}
//                            <div className="grid grid-cols-2 gap-2">

//                                <div className="space-y-1">
//                                    <Label className="text-xs">Priority</Label>
//                                    <Select
//                                        value={newTask.priority}
//                                        onValueChange={(val) =>
//                                            setNewTask({ ...newTask, priority: val })
//                                        }
//                                    >
//                                        <SelectTrigger className="h-9 text-xs bg-gray-50 dark:bg-white/5">
//                                            <SelectValue placeholder="Select" />
//                                        </SelectTrigger>
//                                        <SelectContent>
//                                            <SelectItem value="High">🔥 High</SelectItem>
//                                            <SelectItem value="Medium">⚡ Medium</SelectItem>
//                                            <SelectItem value="Low">🌿 Low</SelectItem>
//                                        </SelectContent>
//                                    </Select>
//                                </div>

//                                <div className="space-y-1">
//                                    <Label className="text-xs">Category</Label>
//                                    <Select
//                                        value={newTask.category}
//                                        onValueChange={(val) =>
//                                            setNewTask({ ...newTask, category: val })
//                                        }
//                                    >
//                                        <SelectTrigger className="h-9 text-xs bg-gray-50 dark:bg-white/5">
//                                            <SelectValue placeholder="Select" />
//                                        </SelectTrigger>
//                                        <SelectContent>
//                                            <SelectItem value="Work">💼 Work</SelectItem>
//                                            <SelectItem value="Personal">🏠 Personal</SelectItem>
//                                        </SelectContent>
//                                    </Select>
//                                </div>

//                            </div>

//                            {/* DEADLINE */}
//                            <div className="space-y-1">
//                                <Label className="text-xs">Deadline</Label>
//                                <Input
//                                    type="date"
//                                    value={newTask.deadline}
//                                    onChange={(e) =>
//                                        setNewTask({ ...newTask, deadline: e.target.value })
//                                    }
//                                    className="h-9 text-xs bg-gray-50 dark:bg-white/5"
//                                />
//                            </div>

//                            {/* ✅ HR DROPDOWN */}
//                            {role === "hr" && (
//                                <div className="space-y-1">
//                                    <Label className="text-xs">Assign Employee</Label>

//                                    <Select value={selectedUser} onValueChange={setSelectedUser}>
//                                        <SelectTrigger className="h-9 text-xs bg-gray-50 dark:bg-white/5">
//                                            <SelectValue placeholder="Select Employee" />
//                                        </SelectTrigger>

//                                        <SelectContent>
//                                            {users.map((u) => (
//                                                <SelectItem key={u.id} value={u.id}>
//                                                    {u.fullName}
//                                                </SelectItem>
//                                            ))}
//                                        </SelectContent>
//                                    </Select>
//                                </div>
//                            )}

//                            {/* CREATE BUTTON (FULL WIDTH) */}
//                            <Button
//                                onClick={handleAddTask}
//                                className="w-full h-10 text-sm rounded-lg 
//            bg-gradient-to-r from-blue-500 to-indigo-500 
//            hover:opacity-90 transition shadow-md"
//                            >
//                                🚀 Create Task
//                            </Button>

//                        </div>
//                    </DialogContent>
//                </Dialog>
//            </div>

//            {/* STATS */}
//            <div className="grid grid-cols-4 gap-4">
//                <StatCard label="Total" value={tasks.length} />
//                <StatCard label="Todo" value={todo} />
//                <StatCard label="Progress" value={progress} />
//                <StatCard label="Done" value={completed} />
//            </div>

//            <Progress value={percent} />

//            {/* TABS */}
//            <Tabs defaultValue="all">
//                <TabsList>
//                    <TabsTrigger value="all">All</TabsTrigger>
//                    <TabsTrigger value="todo">Todo</TabsTrigger>
//                    <TabsTrigger value="progress">Progress</TabsTrigger>
//                    <TabsTrigger value="completed">Done</TabsTrigger>
//                </TabsList>

//                <TabsContent value="all">{renderTasks(tasks, "all")}</TabsContent>
//                <TabsContent value="todo">{renderTasks(tasks.filter(t => t.status === "Todo"), "todo")}</TabsContent>
//                <TabsContent value="progress">{renderTasks(tasks.filter(t => t.status === "In Progress"), "progress")}</TabsContent>
//                <TabsContent value="completed">{renderTasks(tasks.filter(t => t.status === "Completed"), "completed")}</TabsContent>
//            </Tabs>

//        </div>
//    )
//}

//function StatCard({ label, value }: any) {
//    return (
//        <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-4 text-center shadow-sm hover:shadow-md transition">
//            <p className="text-sm text-muted-foreground">{label}</p>
//            <h3 className="text-xl font-bold">{value}</h3>
//        </div>
//    )
//}













//"use client"

//import { useEffect, useMemo, useState } from "react"
//import { useRouter } from "next/navigation"
//import Swal from "sweetalert2"
//import {
//    Plus,
//    Trash2,
//    Calendar as CalendarIcon,
//    RefreshCw,
//    Search,
//    Filter,
//    AlertTriangle,
//    CheckCircle2,
//    Clock3,
//    ListTodo,
//    User2,
//} from "lucide-react"

//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"
//import { Badge } from "@/components/ui/badge"
//import { Progress } from "@/components/ui/progress"
//import {
//    Dialog,
//    DialogContent,
//    DialogDescription,
//    DialogTitle,
//    DialogTrigger,
//} from "@/components/ui/dialog"
//import {
//    Select,
//    SelectContent,
//    SelectItem,
//    SelectTrigger,
//    SelectValue,
//} from "@/components/ui/select"
//import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
//import { cn } from "@/lib/utils"

//const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks"
//const USERS_API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/meeting/users"
//const NOTIFICATION_API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/notifications"

//type TaskStatus = "Todo" | "In Progress" | "Completed"

//type Task = {
//    id: string
//    title: string
//    description: string
//    priority: string
//    status: TaskStatus
//    deadline?: string
//    category?: string
//    userId?: string
//    assignedUserName?: string
//    assignedByName?: string
//}

//type UserItem = {
//    id: string
//    fullName: string
//}

//function getPriorityClasses(priority: string) {
//    switch (priority) {
//        case "High":
//            return "border-red-300 bg-red-500/10 text-red-700"
//        case "Medium":
//            return "border-amber-300 bg-amber-500/10 text-amber-700"
//        default:
//            return "border-emerald-300 bg-emerald-500/10 text-emerald-700"
//    }
//}

//function getStatusClasses(status: TaskStatus) {
//    switch (status) {
//        case "Todo":
//            return "border-slate-300 bg-slate-500/10 text-slate-700"
//        case "In Progress":
//            return "border-blue-300 bg-blue-500/10 text-blue-700"
//        case "Completed":
//            return "border-emerald-300 bg-emerald-500/10 text-emerald-700"
//        default:
//            return "border-slate-300 bg-slate-500/10 text-slate-700"
//    }
//}

//function getStatusAccent(status: TaskStatus) {
//    switch (status) {
//        case "Todo":
//            return "bg-slate-400"
//        case "In Progress":
//            return "bg-blue-500"
//        case "Completed":
//            return "bg-emerald-500"
//        default:
//            return "bg-slate-400"
//    }
//}

//function isOverdue(deadline?: string, status?: TaskStatus) {
//    if (!deadline || status === "Completed") return false
//    const today = new Date()
//    today.setHours(0, 0, 0, 0)
//    const due = new Date(deadline)
//    due.setHours(0, 0, 0, 0)
//    return due.getTime() < today.getTime()
//}

//function isDueToday(deadline?: string, status?: TaskStatus) {
//    if (!deadline || status === "Completed") return false
//    const today = new Date()
//    const due = new Date(deadline)
//    return today.toDateString() === due.toDateString()
//}

//function StatCard({
//    label,
//    value,
//    icon: Icon,
//}: {
//    label: string
//    value: number
//    icon: React.ComponentType<{ className?: string }>
//}) {
//    return (
//        <div className="rounded-2xl border bg-background/60 p-4 text-center shadow-sm transition hover:shadow-md">
//            <div className="mb-2 flex items-center justify-center">
//                <div className="rounded-full bg-blue-500/10 p-2">
//                    <Icon className="h-4 w-4 text-blue-600" />
//                </div>
//            </div>
//            <p className="text-sm text-muted-foreground">{label}</p>
//            <h3 className="text-xl font-bold">{value}</h3>
//        </div>
//    )
//}

//export function TasksView() {
//    const router = useRouter()

//    const [tasks, setTasks] = useState<Task[]>([])
//    const [users, setUsers] = useState<UserItem[]>([])
//    const [selectedUser, setSelectedUser] = useState("")
//    const [role, setRole] = useState("")
//    const [dialogOpen, setDialogOpen] = useState(false)

//    const [loading, setLoading] = useState(true)
//    const [isRefreshing, setIsRefreshing] = useState(false)
//    const [submitting, setSubmitting] = useState(false)

//    const [search, setSearch] = useState("")
//    const [priorityFilter, setPriorityFilter] = useState("all")
//    const [categoryFilter, setCategoryFilter] = useState("all")
//    const [assignedFilter, setAssignedFilter] = useState("all")

//    const [newTask, setNewTask] = useState({
//        title: "",
//        description: "",
//        priority: "",
//        deadline: "",
//        category: "Work",
//    })

//    useEffect(() => {
//        const token = localStorage.getItem("token")
//        if (!token) {
//            router.push("/login")
//            return
//        }

//        try {
//            const payload = JSON.parse(atob(token.split(".")[1]))
//            const userRole =
//                payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || ""
//            setRole(userRole)

//            initialize(userRole)

//            const interval = setInterval(() => {
//                initialize(userRole, true)
//            }, 15000)

//            return () => clearInterval(interval)
//        } catch {
//            router.push("/login")
//        }
//    }, [router])

//    async function initialize(currentRole: string, isAuto = false) {
//        await Promise.all([
//            fetchTasks(isAuto),
//            currentRole === "hr" ? fetchUsers() : Promise.resolve(),
//        ])
//    }

//    function resetForm() {
//        setNewTask({
//            title: "",
//            description: "",
//            priority: "",
//            deadline: "",
//            category: "Work",
//        })
//        setSelectedUser("")
//        setDialogOpen(false)
//    }

//    async function fetchUsers() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(USERS_API_URL, {
//                headers: { Authorization: `Bearer ${token}` },
//            })

//            if (!res.ok) return

//            const text = await res.text()
//            if (!text) return

//            const data = JSON.parse(text)
//            const valid = data.filter(
//                (u: any) => u && u.id && u.fullName && u.fullName.trim() !== ""
//            )

//            setUsers(valid)
//        } catch (err) {
//            console.error("fetchUsers error:", err)
//        }
//    }

//    async function fetchTasks(isAuto = false) {
//        try {
//            if (isAuto) {
//                setIsRefreshing(true)
//            } else {
//                setLoading(true)
//            }

//            const token = localStorage.getItem("token")

//            const res = await fetch(API_URL, {
//                headers: { Authorization: `Bearer ${token}` },
//            })

//            if (!res.ok) {
//                console.error("Tasks API failed:", res.status)
//                return
//            }

//            const text = await res.text()
//            if (!text) return

//            const data = JSON.parse(text)

//            const formatted = data.map((t: any) => ({
//                ...t,
//                deadline: t.deadline?.split("T")[0],
//            }))

//            formatted.sort((a: Task, b: Task) => {
//                if (!a.deadline) return 1
//                if (!b.deadline) return -1
//                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
//            })

//            setTasks(formatted)
//        } catch (err) {
//            console.error("fetchTasks error:", err)
//        } finally {
//            setLoading(false)
//            setIsRefreshing(false)
//        }
//    }

//    async function handleAddTask() {
//        const title = newTask.title.trim()
//        const description = newTask.description.trim()

//        if (!title || !newTask.priority) {
//            Swal.fire({
//                icon: "warning",
//                title: "Required fields missing",
//                text: "Title and priority are required.",
//                confirmButtonColor: "#2563eb",
//            })
//            return
//        }

//        if (role === "hr" && !selectedUser) {
//            Swal.fire({
//                icon: "warning",
//                title: "Select employee",
//                text: "Please assign this task to an employee.",
//                confirmButtonColor: "#2563eb",
//            })
//            return
//        }

//        setSubmitting(true)

//        try {
//            const token = localStorage.getItem("token")

//            const body: any = {
//                title,
//                description,
//                priority: newTask.priority,
//                category: newTask.category,
//                status: "Todo",
//                deadline: newTask.deadline ? new Date(newTask.deadline).toISOString() : null,
//            }

//            if (role === "hr") {
//                body.userId = selectedUser
//            }

//            const taskRes = await fetch(API_URL, {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`,
//                },
//                body: JSON.stringify(body),
//            })

//            if (!taskRes.ok) {
//                const errText = await taskRes.text()
//                console.error("Task create failed:", errText)
//                Swal.fire({
//                    icon: "error",
//                    title: "Task creation failed",
//                    text: "Unable to create task right now.",
//                    confirmButtonColor: "#2563eb",
//                })
//                return
//            }

//            if (role === "hr" && selectedUser) {
//                const notificationRes = await fetch(NOTIFICATION_API_URL, {
//                    method: "POST",
//                    headers: {
//                        "Content-Type": "application/json",
//                        Authorization: `Bearer ${token}`,
//                    },
//                    body: JSON.stringify({
//                        fromUserId: localStorage.getItem("userId"),
//                        toUserId: selectedUser,
//                        fromUserName: localStorage.getItem("name"),
//                        content: `assigned you a new task: ${title}`,
//                        type: "task",
//                        status: "pending",
//                    }),
//                })

//                if (!notificationRes.ok) {
//                    console.error("Notification failed:", await notificationRes.text())
//                }
//            }

//            resetForm()
//            await fetchTasks()
//            Swal.fire({
//                icon: "success",
//                title: "Task created",
//                text: "Task has been created successfully.",
//                confirmButtonColor: "#2563eb",
//            })
//        } catch (err) {
//            console.error("handleAddTask error:", err)
//            Swal.fire({
//                icon: "error",
//                title: "Something went wrong",
//                text: "Please try again.",
//                confirmButtonColor: "#2563eb",
//            })
//        } finally {
//            setSubmitting(false)
//        }
//    }

//    async function handleDeleteTask(id: string) {
//        const result = await Swal.fire({
//            title: "Delete task?",
//            text: "This task will be removed permanently.",
//            icon: "warning",
//            showCancelButton: true,
//            confirmButtonColor: "#2563eb",
//            cancelButtonColor: "#ef4444",
//            confirmButtonText: "Yes, delete",
//            cancelButtonText: "Cancel",
//        })

//        if (!result.isConfirmed) return

//        const token = localStorage.getItem("token")

//        try {
//            const res = await fetch(`${API_URL}/${id}`, {
//                method: "DELETE",
//                headers: {
//                    Authorization: `Bearer ${token}`,
//                },
//            })

//            if (!res.ok) {
//                const errText = await res.text()
//                console.error("Delete failed:", errText)
//                Swal.fire({
//                    icon: "error",
//                    title: "Delete failed",
//                    text: "Unable to delete task.",
//                    confirmButtonColor: "#2563eb",
//                })
//                return
//            }

//            await fetchTasks()

//            Swal.fire({
//                icon: "success",
//                title: "Deleted",
//                text: "Task removed successfully.",
//                confirmButtonColor: "#2563eb",
//            })
//        } catch (err) {
//            console.error("Delete error:", err)
//        }
//    }

//    async function updateTaskStatus(task: Task, newStatus: TaskStatus) {
//        const token = localStorage.getItem("token")

//        try {
//            const res = await fetch(`${API_URL}/${task.id}`, {
//                method: "PUT",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`,
//                },
//                body: JSON.stringify({
//                    ...task,
//                    status: newStatus,
//                    deadline: task.deadline ? new Date(task.deadline).toISOString() : null,
//                }),
//            })

//            if (!res.ok) {
//                const errText = await res.text()
//                console.error("Status update failed:", errText)
//                return
//            }

//            fetchTasks(true)
//        } catch (err) {
//            console.error("Status update error:", err)
//        }
//    }

//    const categories = useMemo(() => {
//        return Array.from(
//            new Set(tasks.map((task) => task.category).filter(Boolean))
//        ) as string[]
//    }, [tasks])

//    const filteredTasks = useMemo(() => {
//        return tasks.filter((task) => {
//            const matchesSearch =
//                task.title.toLowerCase().includes(search.toLowerCase()) ||
//                task.description.toLowerCase().includes(search.toLowerCase())

//            const matchesPriority =
//                priorityFilter === "all" || task.priority === priorityFilter

//            const matchesCategory =
//                categoryFilter === "all" || task.category === categoryFilter

//            const matchesAssigned =
//                assignedFilter === "all" ||
//                task.userId === assignedFilter ||
//                task.assignedUserName === assignedFilter

//            return matchesSearch && matchesPriority && matchesCategory && matchesAssigned
//        })
//    }, [tasks, search, priorityFilter, categoryFilter, assignedFilter])

//    const completed = filteredTasks.filter((t) => t.status === "Completed").length
//    const progress = filteredTasks.filter((t) => t.status === "In Progress").length
//    const todo = filteredTasks.filter((t) => t.status === "Todo").length
//    const overdue = filteredTasks.filter((t) => isOverdue(t.deadline, t.status)).length

//    const percent = filteredTasks.length
//        ? Math.round((completed / filteredTasks.length) * 100)
//        : 0

//    function renderStatusActions(task: Task) {
//        return (
//            <div className="flex flex-wrap items-center gap-2">
//                {task.status === "Todo" && (
//                    <Button
//                        size="sm"
//                        className="bg-blue-600 px-3 text-white hover:bg-blue-700"
//                        onClick={() => updateTaskStatus(task, "In Progress")}
//                    >
//                        Start
//                    </Button>
//                )}

//                {task.status === "In Progress" && (
//                    <>
//                        <Button
//                            size="sm"
//                            variant="outline"
//                            className="px-3"
//                            onClick={() => updateTaskStatus(task, "Todo")}
//                        >
//                            Reset
//                        </Button>
//                        <Button
//                            size="sm"
//                            variant="outline"
//                            className="px-3"
//                            onClick={() => updateTaskStatus(task, "Completed")}
//                        >
//                            Done
//                        </Button>
//                    </>
//                )}

//                {task.status === "Completed" && (
//                    <Button
//                        size="sm"
//                        variant="outline"
//                        className="px-3"
//                        onClick={() => updateTaskStatus(task, "In Progress")}
//                    >
//                        Reopen
//                    </Button>
//                )}

//                <Button
//                    variant="ghost"
//                    size="icon"
//                    onClick={() => handleDeleteTask(task.id)}
//                >
//                    <Trash2 className="h-4 w-4" />
//                </Button>
//            </div>
//        )
//    }

//    function renderTasks(list: Task[]) {
//        if (!list.length) {
//            return (
//                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-12 text-center">
//                    <ListTodo className="h-10 w-10 text-muted-foreground" />
//                    <div>
//                        <p className="font-medium">No tasks found</p>
//                        <p className="text-sm text-muted-foreground">
//                            Create a task or change filters to see more results.
//                        </p>
//                    </div>
//                </div>
//            )
//        }

//        return (
//            <div className="flex flex-col gap-4">
//                {list.map((task) => {
//                    const overdueTask = isOverdue(task.deadline, task.status)
//                    const todayTask = isDueToday(task.deadline, task.status)

//                    return (
//                        <div
//                            key={task.id}
//                            className={cn(
//                                "relative overflow-hidden rounded-2xl border bg-background/60 p-4 shadow-sm transition-all hover:shadow-xl",
//                                overdueTask && "border-red-300 bg-red-500/5"
//                            )}
//                        >
//                            <div className={cn("absolute inset-y-0 left-0 w-1", getStatusAccent(task.status))} />

//                            <div className="flex flex-col gap-4 pl-2 lg:flex-row lg:items-start lg:justify-between">
//                                <div className="flex-1">
//                                    <div className="flex flex-wrap items-center gap-2">
//                                        <p
//                                            className={cn(
//                                                "font-medium",
//                                                task.status === "Completed" && "line-through opacity-60"
//                                            )}
//                                        >
//                                            {task.title}
//                                        </p>

//                                        <Badge variant="outline" className={getPriorityClasses(task.priority)}>
//                                            {task.priority}
//                                        </Badge>

//                                        <Badge variant="outline" className={getStatusClasses(task.status)}>
//                                            {task.status}
//                                        </Badge>

//                                        {task.category && (
//                                            <Badge variant="secondary" className="text-xs">
//                                                {task.category}
//                                            </Badge>
//                                        )}

//                                        {overdueTask && (
//                                            <Badge className="border-red-300 bg-red-500/10 text-red-700">
//                                                Overdue
//                                            </Badge>
//                                        )}

//                                        {todayTask && (
//                                            <Badge className="border-amber-300 bg-amber-500/10 text-amber-700">
//                                                Due Today
//                                            </Badge>
//                                        )}
//                                    </div>

//                                    <p className="mt-2 text-sm text-muted-foreground">
//                                        {task.description || "No description"}
//                                    </p>

//                                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
//                                        <span className="flex items-center gap-1">
//                                            <CalendarIcon className="h-3 w-3" />
//                                            {task.deadline || "No deadline"}
//                                        </span>

//                                        {role === "hr" && task.assignedUserName && (
//                                            <span className="flex items-center gap-1">
//                                                <User2 className="h-3 w-3" />
//                                                {task.assignedUserName}
//                                            </span>
//                                        )}

//                                        {role !== "hr" && task.assignedByName && (
//                                            <span className="flex items-center gap-1">
//                                                <User2 className="h-3 w-3" />
//                                                {task.assignedByName}
//                                            </span>
//                                        )}
//                                    </div>
//                                </div>

//                                <div className="flex items-center gap-2">
//                                    {renderStatusActions(task)}
//                                </div>
//                            </div>
//                        </div>
//                    )
//                })}
//            </div>
//        )
//    }

//    return (
//        <div className="flex flex-col gap-6">
//            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                <div>
//                    <h2 className="text-2xl font-semibold">Task Manager</h2>
//                    <p className="text-sm text-muted-foreground">
//                        Create, assign, track, and complete tasks with clarity.
//                    </p>
//                </div>

//                <div className="flex items-center gap-2">
//                    <Button variant="outline" onClick={() => fetchTasks(true)} disabled={isRefreshing}>
//                        <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
//                        Refresh
//                    </Button>

//                    <Dialog
//                        open={dialogOpen}
//                        onOpenChange={(open) => {
//                            setDialogOpen(open)
//                            if (!open) resetForm()
//                        }}
//                    >
//                        <DialogTrigger asChild>
//                            <Button className="gap-2 shadow-lg">
//                                <Plus className="h-4 w-4" /> Add Task
//                            </Button>
//                        </DialogTrigger>

//                        <DialogContent className="max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white p-0 text-gray-900 shadow-xl dark:bg-[#020617] dark:text-white">
//                            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-white">
//                                <DialogTitle className="flex items-center gap-2 text-base font-semibold">
//                                    Create Task
//                                </DialogTitle>
//                                <DialogDescription className="mt-1 text-xs text-blue-100">
//                                    Add and assign tasks quickly
//                                </DialogDescription>
//                            </div>

//                            <div className="space-y-4 p-4">
//                                <div className="space-y-1">
//                                    <Label className="text-xs">Title</Label>
//                                    <Input
//                                        placeholder="e.g. Design Dashboard UI"
//                                        value={newTask.title}
//                                        onChange={(e) =>
//                                            setNewTask({ ...newTask, title: e.target.value })
//                                        }
//                                        className="h-9 rounded-lg border border-gray-200 bg-gray-50 text-sm dark:border-white/10 dark:bg-white/5"
//                                    />
//                                </div>

//                                <div className="space-y-1">
//                                    <Label className="text-xs">Description</Label>
//                                    <textarea
//                                        placeholder="Task details..."
//                                        value={newTask.description}
//                                        onChange={(e) =>
//                                            setNewTask({ ...newTask, description: e.target.value })
//                                        }
//                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5"
//                                        rows={3}
//                                    />
//                                </div>

//                                <div className="grid grid-cols-2 gap-2">
//                                    <div className="space-y-1">
//                                        <Label className="text-xs">Priority</Label>
//                                        <Select
//                                            value={newTask.priority}
//                                            onValueChange={(val) =>
//                                                setNewTask({ ...newTask, priority: val })
//                                            }
//                                        >
//                                            <SelectTrigger className="h-9 bg-gray-50 text-xs dark:bg-white/5">
//                                                <SelectValue placeholder="Select" />
//                                            </SelectTrigger>
//                                            <SelectContent>
//                                                <SelectItem value="High">High</SelectItem>
//                                                <SelectItem value="Medium">Medium</SelectItem>
//                                                <SelectItem value="Low">Low</SelectItem>
//                                            </SelectContent>
//                                        </Select>
//                                    </div>

//                                    <div className="space-y-1">
//                                        <Label className="text-xs">Category</Label>
//                                        <Select
//                                            value={newTask.category}
//                                            onValueChange={(val) =>
//                                                setNewTask({ ...newTask, category: val })
//                                            }
//                                        >
//                                            <SelectTrigger className="h-9 bg-gray-50 text-xs dark:bg-white/5">
//                                                <SelectValue placeholder="Select" />
//                                            </SelectTrigger>
//                                            <SelectContent>
//                                                <SelectItem value="Work">Work</SelectItem>
//                                                <SelectItem value="Personal">Personal</SelectItem>
//                                            </SelectContent>
//                                        </Select>
//                                    </div>
//                                </div>

//                                <div className="space-y-1">
//                                    <Label className="text-xs">Deadline</Label>
//                                    <Input
//                                        type="date"
//                                        value={newTask.deadline}
//                                        onChange={(e) =>
//                                            setNewTask({ ...newTask, deadline: e.target.value })
//                                        }
//                                        className="h-9 bg-gray-50 text-xs dark:bg-white/5"
//                                    />
//                                </div>

//                                {role === "hr" && (
//                                    <div className="space-y-1">
//                                        <Label className="text-xs">Assign Employee</Label>
//                                        <Select value={selectedUser} onValueChange={setSelectedUser}>
//                                            <SelectTrigger className="h-9 bg-gray-50 text-xs dark:bg-white/5">
//                                                <SelectValue placeholder="Select Employee" />
//                                            </SelectTrigger>
//                                            <SelectContent>
//                                                {users.map((u) => (
//                                                    <SelectItem key={u.id} value={u.id}>
//                                                        {u.fullName}
//                                                    </SelectItem>
//                                                ))}
//                                            </SelectContent>
//                                        </Select>
//                                    </div>
//                                )}

//                                <Button
//                                    onClick={handleAddTask}
//                                    disabled={submitting}
//                                    className="h-10 w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-sm shadow-md transition hover:opacity-90"
//                                >
//                                    {submitting ? "Creating..." : "Create Task"}
//                                </Button>
//                            </div>
//                        </DialogContent>
//                    </Dialog>
//                </div>
//            </div>

//            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
//                <StatCard label="Total" value={filteredTasks.length} icon={ListTodo} />
//                <StatCard label="Todo" value={todo} icon={Clock3} />
//                <StatCard label="Progress" value={progress} icon={RefreshCw} />
//                <StatCard label="Done" value={completed} icon={CheckCircle2} />
//                <StatCard label="Overdue" value={overdue} icon={AlertTriangle} />
//            </div>

//            <Progress value={percent} />

//            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
//                <div className="relative">
//                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                    <Input
//                        placeholder="Search tasks..."
//                        value={search}
//                        onChange={(e) => setSearch(e.target.value)}
//                        className="pl-10"
//                    />
//                </div>

//                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
//                    <SelectTrigger>
//                        <SelectValue placeholder="Priority" />
//                    </SelectTrigger>
//                    <SelectContent>
//                        <SelectItem value="all">All Priorities</SelectItem>
//                        <SelectItem value="High">High</SelectItem>
//                        <SelectItem value="Medium">Medium</SelectItem>
//                        <SelectItem value="Low">Low</SelectItem>
//                    </SelectContent>
//                </Select>

//                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//                    <SelectTrigger>
//                        <SelectValue placeholder="Category" />
//                    </SelectTrigger>
//                    <SelectContent>
//                        <SelectItem value="all">All Categories</SelectItem>
//                        {categories.map((category) => (
//                            <SelectItem key={category} value={category}>
//                                {category}
//                            </SelectItem>
//                        ))}
//                    </SelectContent>
//                </Select>

//                {role === "hr" ? (
//                    <Select value={assignedFilter} onValueChange={setAssignedFilter}>
//                        <SelectTrigger>
//                            <SelectValue placeholder="Employee" />
//                        </SelectTrigger>
//                        <SelectContent>
//                            <SelectItem value="all">All Employees</SelectItem>
//                            {users.map((user) => (
//                                <SelectItem key={user.id} value={user.id}>
//                                    {user.fullName}
//                                </SelectItem>
//                            ))}
//                        </SelectContent>
//                    </Select>
//                ) : (
//                    <div className="flex items-center rounded-md border px-3 text-sm text-muted-foreground">
//                        <Filter className="mr-2 h-4 w-4" />
//                        Smart Filters
//                    </div>
//                )}
//            </div>

//            <Tabs defaultValue="all">
//                <TabsList>
//                    <TabsTrigger value="all">All</TabsTrigger>
//                    <TabsTrigger value="todo">Todo</TabsTrigger>
//                    <TabsTrigger value="progress">Progress</TabsTrigger>
//                    <TabsTrigger value="completed">Done</TabsTrigger>
//                </TabsList>

//                <TabsContent value="all">{renderTasks(filteredTasks)}</TabsContent>
//                <TabsContent value="todo">
//                    {renderTasks(filteredTasks.filter((t) => t.status === "Todo"))}
//                </TabsContent>
//                <TabsContent value="progress">
//                    {renderTasks(filteredTasks.filter((t) => t.status === "In Progress"))}
//                </TabsContent>
//                <TabsContent value="completed">
//                    {renderTasks(filteredTasks.filter((t) => t.status === "Completed"))}
//                </TabsContent>
//            </Tabs>
//        </div>
//    )
//}

















"use client"

import { useEffect, useMemo, useState, type ComponentType } from "react"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import {
    Plus,
    Trash2,
    Calendar as CalendarIcon,
    RefreshCw,
    Search,
    Filter,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    ListTodo,
    User2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks"
const USERS_API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/meeting/users"
const NOTIFICATION_API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/notifications"

type TaskStatus = "Todo" | "In Progress" | "Completed"

type Task = {
    id: string
    title: string
    description: string
    priority: string
    status: TaskStatus
    deadline?: string
    category?: string
    userId?: string
    assignedUserName?: string
    assignedByName?: string
    createdById?: string
}

type UserItem = {
    id: string
    fullName: string
}

type TaskNotificationType =
    | "task_created"
    | "task_updated"
    | "task_deleted"
    | "task_status_updated"

type StoredTaskNotification = {
    id: string
    userId: string
    type: string
    isRead: boolean
    createdAt: string
    eventId?: string
    eventTitle?: string
    message?: string
    fromUserName?: string
    priority?: string
    statusLabel?: string
}

function parseStoredNotifications(): StoredTaskNotification[] {
    try {
        return JSON.parse(localStorage.getItem("globalNotifications") || "[]")
    } catch {
        return []
    }
}

function writeStoredNotifications(items: StoredTaskNotification[]) {
    localStorage.setItem("globalNotifications", JSON.stringify(items))
    window.dispatchEvent(new Event("new-notification"))
}

function buildTaskNotificationContent(
    type: TaskNotificationType,
    actorName: string,
    taskTitle: string,
    priority?: string,
    status?: TaskStatus
) {
    const priorityText = priority ? ` (${priority})` : ""

    switch (type) {
        case "task_created":
            return `${actorName} assigned task "${taskTitle}"${priorityText}`
        case "task_updated":
            return `${actorName} updated task "${taskTitle}"${priorityText}`
        case "task_deleted":
            return `${actorName} deleted task "${taskTitle}"`
        case "task_status_updated":
            return `${actorName} changed task status for "${taskTitle}" to ${status || "Updated"}`
        default:
            return taskTitle
    }
}

async function sendTaskNotification(
    type: TaskNotificationType,
    {
        recipientId,
        actorId,
        actorName,
        taskId,
        taskTitle,
        priority,
        status,
    }: {
        recipientId: string
        actorId: string
        actorName: string
        taskId: string
        taskTitle: string
        priority?: string
        status?: TaskStatus
    }
) {
    if (!recipientId || recipientId === actorId) return

    await fetch(NOTIFICATION_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
            fromUserId: actorId,
            toUserId: recipientId,
            fromUserName: actorName,
            content: buildTaskNotificationContent(type, actorName, taskTitle, priority, status),
            type,
            status: "info",
            isRead: false,
            title: taskTitle,
            createdAt: new Date().toISOString(),
        }),
    }).catch((error) => {
        console.error("Task notification failed:", error)
    })
}

function upsertLocalTaskNotification(
    type: TaskNotificationType,
    {
        userId,
        actorName,
        taskId,
        taskTitle,
        priority,
        status,
    }: {
        userId: string
        actorName: string
        taskId: string
        taskTitle: string
        priority?: string
        status?: TaskStatus
    }
) {
    if (!userId) return

    const existing = parseStoredNotifications()
    const filtered = existing.filter(
        (item) => !(item.userId === userId && item.eventId === taskId && item.type.startsWith("task_"))
    )

    filtered.unshift({
        id: `${type}-${taskId}-${userId}`,
        userId,
        type,
        isRead: false,
        createdAt: new Date().toISOString(),
        eventId: taskId,
        eventTitle: taskTitle,
        message: buildTaskNotificationContent(type, actorName, taskTitle, priority, status),
        fromUserName: actorName,
        priority,
        statusLabel: status,
    })

    writeStoredNotifications(filtered)
}

function getPriorityClasses(priority: string) {
    switch (priority) {
        case "High":
            return "border-red-300 bg-red-500/10 text-red-700"
        case "Medium":
            return "border-amber-300 bg-amber-500/10 text-amber-700"
        default:
            return "border-emerald-300 bg-emerald-500/10 text-emerald-700"
    }
}

function getStatusClasses(status: TaskStatus) {
    switch (status) {
        case "Todo":
            return "border-slate-300 bg-slate-500/10 text-slate-700"
        case "In Progress":
            return "border-blue-300 bg-blue-500/10 text-blue-700"
        case "Completed":
            return "border-emerald-300 bg-emerald-500/10 text-emerald-700"
        default:
            return "border-slate-300 bg-slate-500/10 text-slate-700"
    }
}

function getStatusAccent(status: TaskStatus) {
    switch (status) {
        case "Todo":
            return "bg-slate-400"
        case "In Progress":
            return "bg-blue-500"
        case "Completed":
            return "bg-emerald-500"
        default:
            return "bg-slate-400"
    }
}

function isOverdue(deadline?: string, status?: TaskStatus) {
    if (!deadline || status === "Completed") return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(deadline)
    due.setHours(0, 0, 0, 0)
    return due.getTime() < today.getTime()
}

function isDueToday(deadline?: string, status?: TaskStatus) {
    if (!deadline || status === "Completed") return false
    const today = new Date()
    const due = new Date(deadline)
    return today.toDateString() === due.toDateString()
}

function StatCard({
    label,
    value,
    icon: Icon,
}: {
    label: string
    value: number
    icon: ComponentType<{ className?: string }>
}) {
    return (
        <div className="rounded-2xl border bg-background/60 p-4 text-center shadow-sm transition hover:shadow-md">
            <div className="mb-2 flex items-center justify-center">
                <div className="rounded-full bg-blue-500/10 p-2">
                    <Icon className="h-4 w-4 text-blue-600" />
                </div>
            </div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <h3 className="text-xl font-bold">{value}</h3>
        </div>
    )
}

export function TasksView() {
    const router = useRouter()

    const [tasks, setTasks] = useState<Task[]>([])
    const [users, setUsers] = useState<UserItem[]>([])
    const [selectedUser, setSelectedUser] = useState("")
    const [role, setRole] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)

    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const [search, setSearch] = useState("")
    const [priorityFilter, setPriorityFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [assignedFilter, setAssignedFilter] = useState("all")

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "",
        deadline: "",
        category: "Work",
    })

    const currentUserId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : ""
    const currentUserName = typeof window !== "undefined" ? localStorage.getItem("name") || "User" : "User"

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/login")
            return
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]))
            const userRole =
                payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || ""
            setRole(userRole)

            void initialize(userRole)

            const interval = setInterval(() => {
                void initialize(userRole, true)
            }, 15000)

            return () => clearInterval(interval)
        } catch {
            router.push("/login")
        }
    }, [router])

    async function initialize(currentRole: string, isAuto = false) {
        await Promise.all([
            fetchTasks(isAuto),
            currentRole === "hr" ? fetchUsers() : Promise.resolve(),
        ])
    }

    function resetForm() {
        setNewTask({
            title: "",
            description: "",
            priority: "",
            deadline: "",
            category: "Work",
        })
        setSelectedUser("")
        setDialogOpen(false)
    }

    async function fetchUsers() {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch(USERS_API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) return

            const text = await res.text()
            if (!text) return

            const data = JSON.parse(text)
            const valid = data.filter(
                (u: any) => u && u.id && u.fullName && u.fullName.trim() !== ""
            )

            setUsers(valid)
        } catch (err) {
            console.error("fetchUsers error:", err)
        }
    }

    async function fetchTasks(isAuto = false) {
        try {
            if (isAuto) {
                setIsRefreshing(true)
            } else {
                setLoading(true)
            }

            const token = localStorage.getItem("token")

            const res = await fetch(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                console.error("Tasks API failed:", res.status)
                return
            }

            const text = await res.text()
            if (!text) return

            const data = JSON.parse(text)

            const formatted = data.map((t: any) => ({
                ...t,
                deadline: t.deadline?.split("T")[0],
            }))

            formatted.sort((a: Task, b: Task) => {
                if (!a.deadline) return 1
                if (!b.deadline) return -1
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            })

            setTasks(formatted)
        } catch (err) {
            console.error("fetchTasks error:", err)
        } finally {
            setLoading(false)
            setIsRefreshing(false)
        }
    }

    async function handleAddTask() {
        const title = newTask.title.trim()
        const description = newTask.description.trim()

        if (!title || !newTask.priority) {
            await Swal.fire({
                icon: "warning",
                title: "Required fields missing",
                text: "Title and priority are required.",
                confirmButtonColor: "#2563eb",
            })
            return
        }

        if (role === "hr" && !selectedUser) {
            await Swal.fire({
                icon: "warning",
                title: "Select employee",
                text: "Please assign this task to an employee.",
                confirmButtonColor: "#2563eb",
            })
            return
        }

        setSubmitting(true)

        try {
            const token = localStorage.getItem("token")

            const body: any = {
                title,
                description,
                priority: newTask.priority,
                category: newTask.category,
                status: "Todo",
                deadline: newTask.deadline ? new Date(newTask.deadline).toISOString() : null,
            }

            if (role === "hr") {
                body.userId = selectedUser
            }

            const taskRes = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            })

            if (!taskRes.ok) {
                const errText = await taskRes.text()
                console.error("Task create failed:", errText)
                await Swal.fire({
                    icon: "error",
                    title: "Task creation failed",
                    text: "Unable to create task right now.",
                    confirmButtonColor: "#2563eb",
                })
                return
            }

            const taskPayload = await taskRes.json().catch(() => null)
            const createdTaskId = taskPayload?.id || crypto.randomUUID()

            if (role === "hr" && selectedUser) {
                await sendTaskNotification("task_created", {
                    recipientId: selectedUser,
                    actorId: currentUserId,
                    actorName: currentUserName,
                    taskId: createdTaskId,
                    taskTitle: title,
                    priority: newTask.priority,
                    status: "Todo",
                })
            }

            upsertLocalTaskNotification("task_created", {
                userId: currentUserId,
                actorName: currentUserName,
                taskId: createdTaskId,
                taskTitle: title,
                priority: newTask.priority,
                status: "Todo",
            })

            resetForm()
            await fetchTasks()
            await Swal.fire({
                icon: "success",
                title: "Task created",
                text: "Task has been created successfully.",
                confirmButtonColor: "#2563eb",
            })
        } catch (err) {
            console.error("handleAddTask error:", err)
            await Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: "Please try again.",
                confirmButtonColor: "#2563eb",
            })
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDeleteTask(task: Task) {
        const result = await Swal.fire({
            title: "Delete task?",
            text: "This task will be removed permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        })

        if (!result.isConfirmed) return

        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/${task.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                const errText = await res.text()
                console.error("Delete failed:", errText)
                await Swal.fire({
                    icon: "error",
                    title: "Delete failed",
                    text: "Unable to delete task.",
                    confirmButtonColor: "#2563eb",
                })
                return
            }

            const recipientId =
                role === "hr"
                    ? task.userId || ""
                    : task.createdById || ""

            if (recipientId) {
                await sendTaskNotification("task_deleted", {
                    recipientId,
                    actorId: currentUserId,
                    actorName: currentUserName,
                    taskId: task.id,
                    taskTitle: task.title,
                    priority: task.priority,
                    status: task.status,
                })
            }

            upsertLocalTaskNotification("task_deleted", {
                userId: currentUserId,
                actorName: currentUserName,
                taskId: task.id,
                taskTitle: task.title,
                priority: task.priority,
                status: task.status,
            })

            await fetchTasks()

            await Swal.fire({
                icon: "success",
                title: "Deleted",
                text: "Task removed successfully.",
                confirmButtonColor: "#2563eb",
            })
        } catch (err) {
            console.error("Delete error:", err)
        }
    }

    async function updateTaskStatus(task: Task, newStatus: TaskStatus) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/${task.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...task,
                    status: newStatus,
                    deadline: task.deadline ? new Date(task.deadline).toISOString() : null,
                }),
            })

            if (!res.ok) {
                const errText = await res.text()
                console.error("Status update failed:", errText)
                return
            }

            const recipientId =
                role === "hr"
                    ? task.userId || ""
                    : task.createdById || ""

            if (recipientId) {
                await sendTaskNotification("task_status_updated", {
                    recipientId,
                    actorId: currentUserId,
                    actorName: currentUserName,
                    taskId: task.id,
                    taskTitle: task.title,
                    priority: task.priority,
                    status: newStatus,
                })
            }

            upsertLocalTaskNotification("task_status_updated", {
                userId: currentUserId,
                actorName: currentUserName,
                taskId: task.id,
                taskTitle: task.title,
                priority: task.priority,
                status: newStatus,
            })

            await fetchTasks(true)
        } catch (err) {
            console.error("Status update error:", err)
        }
    }

    const categories = useMemo(() => {
        return Array.from(
            new Set(tasks.map((task) => task.category).filter(Boolean))
        ) as string[]
    }, [tasks])

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch =
                task.title.toLowerCase().includes(search.toLowerCase()) ||
                task.description.toLowerCase().includes(search.toLowerCase())

            const matchesPriority =
                priorityFilter === "all" || task.priority === priorityFilter

            const matchesCategory =
                categoryFilter === "all" || task.category === categoryFilter

            const matchesAssigned =
                assignedFilter === "all" ||
                task.userId === assignedFilter ||
                task.assignedUserName === assignedFilter

            return matchesSearch && matchesPriority && matchesCategory && matchesAssigned
        })
    }, [tasks, search, priorityFilter, categoryFilter, assignedFilter])

    const completed = filteredTasks.filter((t) => t.status === "Completed").length
    const progress = filteredTasks.filter((t) => t.status === "In Progress").length
    const todo = filteredTasks.filter((t) => t.status === "Todo").length
    const overdue = filteredTasks.filter((t) => isOverdue(t.deadline, t.status)).length

    const percent = filteredTasks.length
        ? Math.round((completed / filteredTasks.length) * 100)
        : 0

    function renderStatusActions(task: Task) {
        return (
            <div className="flex flex-wrap items-center gap-2">
                {task.status === "Todo" && (
                    <Button
                        size="sm"
                        className="bg-blue-600 px-3 text-white hover:bg-blue-700"
                        onClick={() => void updateTaskStatus(task, "In Progress")}
                    >
                        Start
                    </Button>
                )}

                {task.status === "In Progress" && (
                    <>
                        <Button
                            size="sm"
                            variant="outline"
                            className="px-3"
                            onClick={() => void updateTaskStatus(task, "Todo")}
                        >
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="px-3"
                            onClick={() => void updateTaskStatus(task, "Completed")}
                        >
                            Done
                        </Button>
                    </>
                )}

                {task.status === "Completed" && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="px-3"
                        onClick={() => void updateTaskStatus(task, "In Progress")}
                    >
                        Reopen
                    </Button>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => void handleDeleteTask(task)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    function renderTasks(list: Task[]) {
        if (!list.length) {
            return (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-12 text-center">
                    <ListTodo className="h-10 w-10 text-muted-foreground" />
                    <div>
                        <p className="font-medium">No tasks found</p>
                        <p className="text-sm text-muted-foreground">
                            Create a task or change filters to see more results.
                        </p>
                    </div>
                </div>
            )
        }

        return (
            <div className="flex flex-col gap-4">
                {list.map((task) => {
                    const overdueTask = isOverdue(task.deadline, task.status)
                    const todayTask = isDueToday(task.deadline, task.status)

                    return (
                        <div
                            key={task.id}
                            className={cn(
                                "relative overflow-hidden rounded-2xl border bg-background/60 p-4 shadow-sm transition-all hover:shadow-xl",
                                overdueTask && "border-red-300 bg-red-500/5"
                            )}
                        >
                            <div className={cn("absolute inset-y-0 left-0 w-1", getStatusAccent(task.status))} />

                            <div className="flex flex-col gap-4 pl-2 lg:flex-row lg:items-start lg:justify-between">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p
                                            className={cn(
                                                "font-medium",
                                                task.status === "Completed" && "line-through opacity-60"
                                            )}
                                        >
                                            {task.title}
                                        </p>

                                        <Badge variant="outline" className={getPriorityClasses(task.priority)}>
                                            {task.priority}
                                        </Badge>

                                        <Badge variant="outline" className={getStatusClasses(task.status)}>
                                            {task.status}
                                        </Badge>

                                        {task.category && (
                                            <Badge variant="secondary" className="text-xs">
                                                {task.category}
                                            </Badge>
                                        )}

                                        {overdueTask && (
                                            <Badge className="border-red-300 bg-red-500/10 text-red-700">
                                                Overdue
                                            </Badge>
                                        )}

                                        {todayTask && (
                                            <Badge className="border-amber-300 bg-amber-500/10 text-amber-700">
                                                Due Today
                                            </Badge>
                                        )}
                                    </div>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {task.description || "No description"}
                                    </p>

                                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <CalendarIcon className="h-3 w-3" />
                                            {task.deadline || "No deadline"}
                                        </span>

                                        {role === "hr" && task.assignedUserName && (
                                            <span className="flex items-center gap-1">
                                                <User2 className="h-3 w-3" />
                                                {task.assignedUserName}
                                            </span>
                                        )}

                                        {role !== "hr" && task.assignedByName && (
                                            <span className="flex items-center gap-1">
                                                <User2 className="h-3 w-3" />
                                                {task.assignedByName}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {renderStatusActions(task)}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Task Manager</h2>
                    <p className="text-sm text-muted-foreground">
                        Create, assign, track, and complete tasks with clarity.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => void fetchTasks(true)} disabled={isRefreshing}>
                        <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
                        Refresh
                    </Button>

                    <Dialog
                        open={dialogOpen}
                        onOpenChange={(open) => {
                            setDialogOpen(open)
                            if (!open) resetForm()
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button className="gap-2 shadow-lg">
                                <Plus className="h-4 w-4" /> Add Task
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white p-0 text-gray-900 shadow-xl dark:bg-[#020617] dark:text-white">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-white">
                                <DialogTitle className="flex items-center gap-2 text-base font-semibold">
                                    Create Task
                                </DialogTitle>
                                <DialogDescription className="mt-1 text-xs text-blue-100">
                                    Add and assign tasks quickly
                                </DialogDescription>
                            </div>

                            <div className="space-y-4 p-4">
                                <div className="space-y-1">
                                    <Label className="text-xs">Title</Label>
                                    <Input
                                        placeholder="e.g. Design Dashboard UI"
                                        value={newTask.title}
                                        onChange={(e) =>
                                            setNewTask({ ...newTask, title: e.target.value })
                                        }
                                        className="h-9 rounded-lg border border-gray-200 bg-gray-50 text-sm dark:border-white/10 dark:bg-white/5"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Description</Label>
                                    <textarea
                                        placeholder="Task details..."
                                        value={newTask.description}
                                        onChange={(e) =>
                                            setNewTask({ ...newTask, description: e.target.value })
                                        }
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Priority</Label>
                                        <Select
                                            value={newTask.priority}
                                            onValueChange={(val) =>
                                                setNewTask({ ...newTask, priority: val })
                                            }
                                        >
                                            <SelectTrigger className="h-9 bg-gray-50 text-xs dark:bg-white/5">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs">Category</Label>
                                        <Select
                                            value={newTask.category}
                                            onValueChange={(val) =>
                                                setNewTask({ ...newTask, category: val })
                                            }
                                        >
                                            <SelectTrigger className="h-9 bg-gray-50 text-xs dark:bg-white/5">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Work">Work</SelectItem>
                                                <SelectItem value="Personal">Personal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Deadline</Label>
                                    <Input
                                        type="date"
                                        value={newTask.deadline}
                                        onChange={(e) =>
                                            setNewTask({ ...newTask, deadline: e.target.value })
                                        }
                                        className="h-9 bg-gray-50 text-xs dark:bg-white/5"
                                    />
                                </div>

                                {role === "hr" && (
                                    <div className="space-y-1">
                                        <Label className="text-xs">Assign Employee</Label>
                                        <Select value={selectedUser} onValueChange={setSelectedUser}>
                                            <SelectTrigger className="h-9 bg-gray-50 text-xs dark:bg-white/5">
                                                <SelectValue placeholder="Select Employee" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map((u) => (
                                                    <SelectItem key={u.id} value={u.id}>
                                                        {u.fullName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <Button
                                    onClick={() => void handleAddTask()}
                                    disabled={submitting}
                                    className="h-10 w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-sm shadow-md transition hover:opacity-90"
                                >
                                    {submitting ? "Creating..." : "Create Task"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard label="Total" value={filteredTasks.length} icon={ListTodo} />
                <StatCard label="Todo" value={todo} icon={Clock3} />
                <StatCard label="Progress" value={progress} icon={RefreshCw} />
                <StatCard label="Done" value={completed} icon={CheckCircle2} />
                <StatCard label="Overdue" value={overdue} icon={AlertTriangle} />
            </div>

            <Progress value={percent} />

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {role === "hr" ? (
                    <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Employee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Employees</SelectItem>
                            {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                    {user.fullName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <div className="flex items-center rounded-md border px-3 text-sm text-muted-foreground">
                        <Filter className="mr-2 h-4 w-4" />
                        Smart Filters
                    </div>
                )}
            </div>

            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="todo">Todo</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="completed">Done</TabsTrigger>
                </TabsList>

                <TabsContent value="all">{renderTasks(filteredTasks)}</TabsContent>
                <TabsContent value="todo">
                    {renderTasks(filteredTasks.filter((t) => t.status === "Todo"))}
                </TabsContent>
                <TabsContent value="progress">
                    {renderTasks(filteredTasks.filter((t) => t.status === "In Progress"))}
                </TabsContent>
                <TabsContent value="completed">
                    {renderTasks(filteredTasks.filter((t) => t.status === "Completed"))}
                </TabsContent>
            </Tabs>
        </div>
    )
}
