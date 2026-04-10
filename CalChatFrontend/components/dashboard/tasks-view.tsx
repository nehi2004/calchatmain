


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Plus,
    Trash2,
    CheckCircle2,
    Clock,
    Circle,
    Calendar as CalendarIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks"

export function TasksView() {

    const router = useRouter()

    type Task = {
        id: string
        title: string
        description: string
        priority: string
        status: "Todo" | "In Progress" | "Completed"
        deadline?: string
        category?: string
        userId?: string

        // 🔥 ADD THIS
        assignedUserName?: string
        assignedByName?: string
    }

    const [tasks, setTasks] = useState<Task[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)

    // ✅ HR FEATURES
    const [users, setUsers] = useState<any[]>([])
    const [selectedUser, setSelectedUser] = useState("")
    const [role, setRole] = useState("")

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "",
        deadline: "",
        category: "Work",
    })

    // ================= INIT =================
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) return router.push("/login")

        const payload = JSON.parse(atob(token.split(".")[1]))
        const userRole =
            payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]

        setRole(userRole)

        fetchTasks()
        if (userRole === "hr") {
            fetchUsers()
        }
    }, [])

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) return router.push("/login")

        const payload = JSON.parse(atob(token.split(".")[1]))
        const userRole =
            payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]

        setRole(userRole)

        fetchTasks()

        if (userRole === "hr") {
            fetchUsers()
        }

        // 🔥 AUTO REFRESH EVERY 3 SEC
        const interval = setInterval(() => {
            fetchTasks()
        }, 3000)

        return () => clearInterval(interval)

    }, [])
    // ================= USERS =================
    async function fetchUsers() {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/meeting/users", {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                console.error("Users API failed:", res.status)
                return
            }

            const text = await res.text()

            if (!text) {
                console.warn("Empty users response")
                return
            }

            const data = JSON.parse(text)

            const valid = data.filter(
                (u: any) => u && u.id && u.fullName && u.fullName.trim() !== ""
            )

            setUsers(valid)
        } catch (err) {
            console.error("fetchUsers error:", err)
        }
    }

    // ================= TASKS =================
    async function fetchTasks() {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                console.error("Tasks API failed:", res.status)
                return
            }

            const text = await res.text()

            if (!text) {
                console.warn("Empty tasks response")
                return
            }

            const data = JSON.parse(text)

            //setTasks(
            //    data.map((t: any) => ({
            //        ...t,
            //        deadline: t.deadline?.split("T")[0],
            //    }))
            //)
            const formatted = data.map((t: any) => ({
                ...t,
                deadline: t.deadline?.split("T")[0],
            }))

            // ✅ SORT BY DATE (ASCENDING)
            formatted.sort((a: any, b: any) => {
                if (!a.deadline) return 1
                if (!b.deadline) return -1

                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            })

            setTasks(formatted)
        } catch (err) {
            console.error("fetchTasks error:", err)
        }
    }

    // ================= ADD =================
    async function handleAddTask() {
        if (!newTask.title || !newTask.priority) {
            alert("Fill required fields")
            return
        }

        const token = localStorage.getItem("token")

        const body: any = {
            ...newTask,
            status: "Todo",
            deadline: newTask.deadline
                ? new Date(newTask.deadline).toISOString()
                : null,
        }

        // ✅ HR ASSIGN
        if (role === "hr") {
            if (!selectedUser) {
                alert("Select employee")
                return
            }
            body.userId = selectedUser  // backend single user support
        }

        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })

        // ✅ AFTER TASK CREATED → SEND NOTIFICATION TO EMPLOYEE
        if (role === "hr" && selectedUser) {

            const token = localStorage.getItem("token")

            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`   // ✅ FIX ADDED
                },
                body: JSON.stringify({
                    fromUserId: localStorage.getItem("userId"),
                    toUserId: selectedUser,
                    fromUserName: localStorage.getItem("name"), // ✅ ADD
                    content: `assigned you a new task: ${newTask.title}`,
                    type: "task",   // ✅ VERY IMPORTANT
                    status: "pending"
                })
            })

            if (!res.ok) {
                console.error("❌ Notification failed", await res.text())
            } else {
                console.log("✅ Notification sent")
            }
        }

        setDialogOpen(false)
        setNewTask({
            title: "",
            description: "",
            priority: "",
            deadline: "",
            category: "Work",
        })
        setSelectedUser("")

        fetchTasks()
    }

    // ================= DELETE =================
    async function handleDeleteTask(id: string) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                const errText = await res.text()
                console.error("Delete failed:", errText)
                alert("Delete failed ❌")
                return
            }

            console.log("Deleted successfully ✅")
            fetchTasks()

        } catch (err) {
            console.error("Delete error:", err)
        }
    }

    // ================= TOGGLE =================
    async function handleToggleStatus(task: {
        id: string
        status: "Todo" | "In Progress" | "Completed"
    }) {
        const token = localStorage.getItem("token")

        const next: Record<"Todo" | "In Progress" | "Completed", "Todo" | "In Progress" | "Completed"> = {
            Todo: "In Progress",
            "In Progress": "Completed",
            Completed: "Todo",
        }
        await fetch(`${API_URL}/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...task,
                status: next[task.status],
            }),
        })

        fetchTasks()
    }
    async function updateTaskStatus(task: Task, newStatus: "Todo" | "In Progress" | "Completed") {
        const token = localStorage.getItem("token")

        await fetch(`${API_URL}/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...task, // 🔥 FULL TASK SEND
                status: newStatus,
            }),
        })



        fetchTasks()
    }

    // ================= STATS =================
    const completed = tasks.filter(t => t.status === "Completed").length
    const progress = tasks.filter(t => t.status === "In Progress").length
    const todo = tasks.filter(t => t.status === "Todo").length

    const percent = tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0

    // ================= UI =================


    function renderTasks(list: any[], tab: "all" | "todo" | "progress" | "completed") {
        if (!list.length) {
            return <p className="text-center text-muted-foreground py-6">No tasks</p>
        }

        return (
            <div className="flex flex-col gap-4">
                {list.map(task => (
                    <div
                        key={task.id}
                        className="flex items-center gap-4 rounded-2xl border bg-background/60 backdrop-blur-md p-4 shadow-sm hover:shadow-xl transition-all"
                    >


                        <div className="flex-1">
                            <div className="flex gap-2 items-center flex-wrap">

                                <p className={cn(
                                    "font-medium",
                                    task.status === "Completed" && "line-through opacity-60"
                                )}>
                                    {task.title}
                                </p>

                                <Badge
                                    variant="outline"
                                    className={
                                        task.priority === "High"
                                            ? "text-red-600 border-red-300"
                                            : task.priority === "Medium"
                                                ? "text-yellow-600 border-yellow-300"
                                                : "text-green-600 border-green-300"
                                    }
                                >
                                    {task.priority}
                                </Badge>

                                {task.category && (
                                    <Badge variant="secondary" className="text-xs">
                                        {task.category}
                                    </Badge>
                                )}

                                {/* ✅ SHOW ASSIGNED EMPLOYEE */}
                                {/* ✅ SHOW ASSIGNED EMPLOYEES */}
                                {(task.userIds || task.userId) && (
                                    <div className="flex flex-wrap gap-1">



                                        <div className="flex flex-wrap gap-1">

                                            {task.userId && (
                                                <div className="flex flex-wrap gap-2 mt-1">

                                                    {/* ✅ HR VIEW → Show Employee only */}
                                                    {role === "hr" && task.assignedUserName && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            👤 {task.assignedUserName}
                                                        </Badge>
                                                    )}

                                                    {/* ✅ EMPLOYEE VIEW → Show HR only */}
                                                    {role !== "hr" && task.assignedByName && (
                                                        <Badge variant="outline" className="text-xs">
                                                            🧑‍💼 {task.assignedByName}
                                                        </Badge>
                                                    )}

                                                </div>
                                            )}
                                        </div>



                                    </div>
                                )}
                            </div>
                            {/* DESCRIPTION */}
                            <p className="text-sm text-muted-foreground mt-1">
                                {task.description}
                            </p>

                            {/* ✅ BUTTONS BELOW DESCRIPTION (CENTERED & CLEAN) */}
                            {/* ✅ BUTTONS BELOW DESCRIPTION (MODERN UI) */}


                            <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    {task.deadline || "No deadline"}
                                </span>
                            </div>
                        </div>

                        {/* ✅ RIGHT SIDE ACTIONS (BEST UI) */}
                        <div className="flex items-center gap-2">

                            {tab !== "all" && (
                                <>
                                    {/* TODO */}
                                    {task.status === "Todo" && (
                                        <Button
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                                            onClick={() => updateTaskStatus(task, "In Progress")}
                                        >
                                            Start 🚀
                                        </Button>
                                    )}

                                    {/* IN PROGRESS */}
                                    {task.status === "In Progress" && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="px-3"
                                                onClick={() => updateTaskStatus(task, "Todo")}
                                            >
                                                Reset 🔁
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="px-3"
                                                onClick={() => updateTaskStatus(task, "Completed")}
                                            >
                                                Done ✅
                                            </Button>
                                        </>
                                    )}

                                    {/* COMPLETED */}
                                    {task.status === "Completed" && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="px-3"
                                            onClick={() => updateTaskStatus(task, "In Progress")}
                                        >
                                            Reopen 🔁
                                        </Button>
                                    )}
                                </>
                            )}

                            {/* DELETE */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTask(task.id)}
                            >
                                <Trash2 />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Task Manager</h2>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 shadow-lg">
                            <Plus /> Add Task
                        </Button>
                    </DialogTrigger>

                    <DialogContent
                        className="max-w-md p-0 overflow-hidden rounded-2xl border border-white/10
    bg-white dark:bg-[#020617] text-gray-900 dark:text-white shadow-xl"
                    >

                        {/* HEADER */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-white">
                            <DialogTitle className="text-base font-semibold flex items-center gap-2">
                                📝 Create Task
                            </DialogTitle>
                            <DialogDescription className="text-xs text-blue-100 mt-1">
                                Add and assign tasks quickly
                            </DialogDescription>
                        </div>

                        {/* BODY */}
                        <div className="p-4 space-y-4">

                            {/* TITLE */}
                            <div className="space-y-1">
                                <Label className="text-xs">Title</Label>
                                <Input
                                    placeholder="e.g. Design Dashboard UI"
                                    value={newTask.title}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, title: e.target.value })
                                    }
                                    className="h-9 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg"
                                />
                            </div>

                            {/* DESCRIPTION */}
                            <div className="space-y-1">
                                <Label className="text-xs">Description</Label>
                                <textarea
                                    placeholder="Task details..."
                                    value={newTask.description}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, description: e.target.value })
                                    }
                                    className="w-full rounded-lg border border-gray-200 dark:border-white/10 
                bg-gray-50 dark:bg-white/5 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                />
                            </div>

                            {/* PRIORITY + CATEGORY */}
                            <div className="grid grid-cols-2 gap-2">

                                <div className="space-y-1">
                                    <Label className="text-xs">Priority</Label>
                                    <Select
                                        value={newTask.priority}
                                        onValueChange={(val) =>
                                            setNewTask({ ...newTask, priority: val })
                                        }
                                    >
                                        <SelectTrigger className="h-9 text-xs bg-gray-50 dark:bg-white/5">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="High">🔥 High</SelectItem>
                                            <SelectItem value="Medium">⚡ Medium</SelectItem>
                                            <SelectItem value="Low">🌿 Low</SelectItem>
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
                                        <SelectTrigger className="h-9 text-xs bg-gray-50 dark:bg-white/5">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Work">💼 Work</SelectItem>
                                            <SelectItem value="Personal">🏠 Personal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                            </div>

                            {/* DEADLINE */}
                            <div className="space-y-1">
                                <Label className="text-xs">Deadline</Label>
                                <Input
                                    type="date"
                                    value={newTask.deadline}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, deadline: e.target.value })
                                    }
                                    className="h-9 text-xs bg-gray-50 dark:bg-white/5"
                                />
                            </div>

                            {/* ✅ HR DROPDOWN */}
                            {role === "hr" && (
                                <div className="space-y-1">
                                    <Label className="text-xs">Assign Employee</Label>

                                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                                        <SelectTrigger className="h-9 text-xs bg-gray-50 dark:bg-white/5">
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

                            {/* CREATE BUTTON (FULL WIDTH) */}
                            <Button
                                onClick={handleAddTask}
                                className="w-full h-10 text-sm rounded-lg 
            bg-gradient-to-r from-blue-500 to-indigo-500 
            hover:opacity-90 transition shadow-md"
                            >
                                🚀 Create Task
                            </Button>

                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Total" value={tasks.length} />
                <StatCard label="Todo" value={todo} />
                <StatCard label="Progress" value={progress} />
                <StatCard label="Done" value={completed} />
            </div>

            <Progress value={percent} />

            {/* TABS */}
            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="todo">Todo</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="completed">Done</TabsTrigger>
                </TabsList>

                <TabsContent value="all">{renderTasks(tasks, "all")}</TabsContent>
                <TabsContent value="todo">{renderTasks(tasks.filter(t => t.status === "Todo"), "todo")}</TabsContent>
                <TabsContent value="progress">{renderTasks(tasks.filter(t => t.status === "In Progress"), "progress")}</TabsContent>
                <TabsContent value="completed">{renderTasks(tasks.filter(t => t.status === "Completed"), "completed")}</TabsContent>
            </Tabs>

        </div>
    )
}

function StatCard({ label, value }: any) {
    return (
        <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-4 text-center shadow-sm hover:shadow-md transition">
            <p className="text-sm text-muted-foreground">{label}</p>
            <h3 className="text-xl font-bold">{value}</h3>
        </div>
    )
}