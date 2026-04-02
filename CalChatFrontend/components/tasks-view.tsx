
//"use client"

//import { useState, useEffect } from "react"
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

//interface Task {
//    id: string
//    title: string
//    description: string
//    priority: "High" | "Medium" | "Low"
//    status: "Todo" | "In Progress" | "Completed"
//    deadline: string
//    category: string
//}

//const API_URL = "https://calchatmain-production-75c1.up.railway.app//api/Tasks"

//const PRIORITY_COLORS: Record<string, any> = {
//    High: "destructive",
//    Medium: "secondary",
//    Low: "outline",
//}

//export function TasksView() {
//    const [tasks, setTasks] = useState<Task[]>([])
//    const [dialogOpen, setDialogOpen] = useState(false)

//    const [newTask, setNewTask] = useState({
//        title: "",
//        description: "",
//        priority: "Medium" as Task["priority"],
//        deadline: "",
//        category: "Work",
//    })

//    // ✅ LOAD TASKS
//    useEffect(() => {
//        fetchTasks()
//    }, [])

//    async function fetchTasks() {
//        try {
//            const res = await fetch(API_URL)
//            const data = await res.json()

//            const formatted = data.map((t: any) => ({
//                ...t,
//                deadline: t.deadline ? t.deadline.split("T")[0] : "",
//            }))

//            setTasks(formatted)
//        } catch (error) {
//            console.error("Error fetching tasks:", error)
//        }
//    }

//    // ✅ ADD TASK
//    async function handleAddTask() {
//        if (!newTask.title) return

//        const taskData = {
//            title: newTask.title,
//            description: newTask.description,
//            priority: newTask.priority,
//            status: "Todo",
//            deadline: newTask.deadline
//                ? new Date(newTask.deadline).toISOString()
//                : null,
//            category: newTask.category,
//        }

//        await fetch(API_URL, {
//            method: "POST",
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify(taskData),
//        })

//        await fetchTasks()

//        setNewTask({
//            title: "",
//            description: "",
//            priority: "Medium",
//            deadline: "",
//            category: "Work",
//        })

//        setDialogOpen(false)
//    }

//    // ✅ DELETE
//    async function handleDeleteTask(id: string) {
//        await fetch(`${API_URL}/${id}`, {
//            method: "DELETE",
//        })
//        await fetchTasks()
//    }

//    // ✅ TOGGLE STATUS
//    async function handleToggleStatus(task: Task) {
//        const nextStatus: Record<string, Task["status"]> = {
//            "Todo": "In Progress",
//            "In Progress": "Completed",
//            "Completed": "Todo",
//        }

//        const updated = {
//            ...task,
//            status: nextStatus[task.status],
//            deadline: task.deadline
//                ? new Date(task.deadline).toISOString()
//                : null,
//        }

//        await fetch(`${API_URL}/${task.id}`, {
//            method: "PUT",
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify(updated),
//        })

//        await fetchTasks()
//    }

//    const completedCount = tasks.filter(t => t.status === "Completed").length
//    const inProgressCount = tasks.filter(t => t.status === "In Progress").length
//    const todoCount = tasks.filter(t => t.status === "Todo").length
//    const progressPercent =
//        tasks.length > 0
//            ? Math.round((completedCount / tasks.length) * 100)
//            : 0

//    function getStatusIcon(status: string) {
//        switch (status) {
//            case "Completed":
//                return <CheckCircle2 className="h-4 w-4 text-primary" />
//            case "In Progress":
//                return <Clock className="h-4 w-4 text-accent" />
//            default:
//                return <Circle className="h-4 w-4 text-muted-foreground" />
//        }
//    }

//    function renderTaskList(filteredTasks: Task[]) {
//        if (filteredTasks.length === 0) {
//            return (
//                <p className="py-8 text-center text-sm text-muted-foreground">
//                    No tasks found
//                </p>
//            )
//        }

//        return (
//            <div className="flex flex-col gap-3">
//                {filteredTasks.map(task => (
//                    <div
//                        key={task.id}
//                        className={cn(
//                            "flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md",
//                            task.status === "Completed" && "opacity-70"
//                        )}
//                    >
//                        <button onClick={() => handleToggleStatus(task)}>
//                            {getStatusIcon(task.status)}
//                        </button>

//                        <div className="flex-1 min-w-0">
//                            <div className="flex items-center gap-2">
//                                <p
//                                    className={cn(
//                                        "text-sm font-medium",
//                                        task.status === "Completed" && "line-through"
//                                    )}
//                                >
//                                    {task.title}
//                                </p>

//                                <Badge variant={PRIORITY_COLORS[task.priority]} className="text-xs">
//                                    {task.priority}
//                                </Badge>
//                            </div>

//                            <p className="mt-1 text-xs text-muted-foreground truncate">
//                                {task.description}
//                            </p>

//                            <div className="mt-2 flex items-center gap-3">
//                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
//                                    <CalendarIcon className="h-3 w-3" />
//                                    {task.deadline || "No deadline"}
//                                </span>
//                                <Badge variant="outline" className="text-xs bg-transparent">
//                                    {task.category}
//                                </Badge>
//                            </div>
//                        </div>

//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            onClick={() => handleDeleteTask(task.id)}
//                        >
//                            <Trash2 className="h-4 w-4" />
//                        </Button>
//                    </div>
//                ))}
//            </div>
//        )
//    }

//    return (
//        <div className="flex flex-col gap-6">

//            {/* Dashboard Cards */}
//            <div className="grid gap-4 sm:grid-cols-4">
//                <div className="rounded-xl border bg-card p-4">
//                    <p className="text-sm text-muted-foreground">Total Tasks</p>
//                    <p className="mt-1 text-2xl font-bold">{tasks.length}</p>
//                </div>
//                <div className="rounded-xl border bg-card p-4">
//                    <p className="text-sm text-muted-foreground">To Do</p>
//                    <p className="mt-1 text-2xl font-bold">{todoCount}</p>
//                </div>
//                <div className="rounded-xl border bg-card p-4">
//                    <p className="text-sm text-muted-foreground">In Progress</p>
//                    <p className="mt-1 text-2xl font-bold text-accent">{inProgressCount}</p>
//                </div>
//                <div className="rounded-xl border bg-card p-4">
//                    <p className="text-sm text-muted-foreground">Completed</p>
//                    <p className="mt-1 text-2xl font-bold text-primary">{completedCount}</p>
//                </div>
//            </div>

//            {/* Progress */}
//            <div className="rounded-xl border bg-card p-4">
//                <div className="flex justify-between mb-2">
//                    <span className="text-sm font-medium">Overall Progress</span>
//                    <span className="text-sm font-bold">{progressPercent}%</span>
//                </div>
//                <Progress value={progressPercent} />
//            </div>

//            {/* Add Task Dialog */}
//            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                <DialogTrigger asChild>
//                    <Button className="gap-2 w-fit">
//                        <Plus className="h-4 w-4" />
//                        Add Task
//                    </Button>
//                </DialogTrigger>

//                <DialogContent>
//                    <DialogHeader>
//                        <DialogTitle>Add New Task</DialogTitle>
//                        <DialogDescription>
//                            Create a new task for your dashboard.
//                        </DialogDescription>
//                    </DialogHeader>

//                    <div className="flex flex-col gap-4 pt-4">
//                        <div>
//                            <Label>Title</Label>
//                            <Input
//                                value={newTask.title}
//                                onChange={e =>
//                                    setNewTask({ ...newTask, title: e.target.value })
//                                }
//                            />
//                        </div>

//                        <div>
//                            <Label>Description</Label>
//                            <Input
//                                value={newTask.description}
//                                onChange={e =>
//                                    setNewTask({ ...newTask, description: e.target.value })
//                                }
//                            />
//                        </div>

//                        <div className="grid grid-cols-2 gap-4">
//                            <div>
//                                <Label>Priority</Label>
//                                <Select
//                                    value={newTask.priority}
//                                    onValueChange={v =>
//                                        setNewTask({ ...newTask, priority: v as Task["priority"] })
//                                    }
//                                >
//                                    <SelectTrigger>
//                                        <SelectValue />
//                                    </SelectTrigger>
//                                    <SelectContent>
//                                        <SelectItem value="High">High</SelectItem>
//                                        <SelectItem value="Medium">Medium</SelectItem>
//                                        <SelectItem value="Low">Low</SelectItem>
//                                    </SelectContent>
//                                </Select>
//                            </div>

//                            <div>
//                                <Label>Deadline</Label>
//                                <Input
//                                    type="date"
//                                    value={newTask.deadline}
//                                    onChange={e =>
//                                        setNewTask({ ...newTask, deadline: e.target.value })
//                                    }
//                                />
//                            </div>
//                        </div>

//                        <div>
//                            <Label>Category</Label>
//                            <Select
//                                value={newTask.category}
//                                onValueChange={v =>
//                                    setNewTask({ ...newTask, category: v })
//                                }
//                            >
//                                <SelectTrigger>
//                                    <SelectValue />
//                                </SelectTrigger>
//                                <SelectContent>
//                                    <SelectItem value="Work">Work</SelectItem>
//                                    <SelectItem value="Development">Development</SelectItem>
//                                    <SelectItem value="Design">Design</SelectItem>
//                                    <SelectItem value="Presentation">Presentation</SelectItem>
//                                    <SelectItem value="Personal">Personal</SelectItem>
//                                    <SelectItem value="Social">Social</SelectItem>
//                                </SelectContent>
//                            </Select>
//                        </div>

//                        <Button onClick={handleAddTask}>Add Task</Button>
//                    </div>
//                </DialogContent>
//            </Dialog>

//            {/* Tabs */}
//            <Tabs defaultValue="all">
//                <TabsList>
//                    <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
//                    <TabsTrigger value="todo">To Do ({todoCount})</TabsTrigger>
//                    <TabsTrigger value="progress">In Progress ({inProgressCount})</TabsTrigger>
//                    <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
//                </TabsList>

//                <TabsContent value="all" className="mt-4">
//                    {renderTaskList(tasks)}
//                </TabsContent>
//                <TabsContent value="todo" className="mt-4">
//                    {renderTaskList(tasks.filter(t => t.status === "Todo"))}
//                </TabsContent>
//                <TabsContent value="progress" className="mt-4">
//                    {renderTaskList(tasks.filter(t => t.status === "In Progress"))}
//                </TabsContent>
//                <TabsContent value="completed" className="mt-4">
//                    {renderTaskList(tasks.filter(t => t.status === "Completed"))}
//                </TabsContent>
//            </Tabs>
//        </div>
//    )
//}



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

//interface Task {
//    id: string
//    title: string
//    description: string
//    priority: "High" | "Medium" | "Low"
//    status: "Todo" | "In Progress" | "Completed"
//    deadline: string
//    category: string
//}

//const API_URL = "https://calchatmain-production-75c1.up.railway.app//api/Tasks"

//const PRIORITY_COLORS: Record<string, any> = {
//    High: "destructive",
//    Medium: "secondary",
//    Low: "outline",
//}

//export function TasksView() {
//    const router = useRouter()
//    const [tasks, setTasks] = useState<Task[]>([])
//    const [dialogOpen, setDialogOpen] = useState(false)

//    const [newTask, setNewTask] = useState({
//        title: "",
//        description: "",
//        priority: "Medium" as Task["priority"],
//        deadline: "",
//        category: "Work",
//    })

//    // ================= AUTH CHECK =================
//    useEffect(() => {
//        const token = localStorage.getItem("token")

//        if (!token) {
//            router.push("/login")
//            return
//        }

//        fetchTasks()
//    }, [])

//    // ================= FETCH TASKS =================
//    async function fetchTasks() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(API_URL, {
//                headers: {
//                    "Authorization": `Bearer ${token}`
//                }
//            })

//            if (res.status === 401) {
//                localStorage.removeItem("token")
//                router.push("/login")
//                return
//            }

//            const data = await res.json()

//            const formatted = data.map((t: any) => ({
//                ...t,
//                deadline: t.deadline ? t.deadline.split("T")[0] : "",
//            }))

//            setTasks(formatted)
//        } catch (error) {
//            console.error("Error fetching tasks:", error)
//        }
//    }

//    // ================= ADD TASK =================
//    async function handleAddTask() {
//        if (!newTask.title) return

//        const token = localStorage.getItem("token")

//        const taskData = {
//            title: newTask.title,
//            description: newTask.description,
//            priority: newTask.priority,
//            status: "Todo",
//            deadline: newTask.deadline
//                ? new Date(newTask.deadline).toISOString()
//                : null,
//            category: newTask.category,
//        }

//        const res = await fetch(API_URL, {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                "Authorization": `Bearer ${token}`
//            },
//            body: JSON.stringify(taskData),
//        })

//        if (res.status === 401) {
//            localStorage.removeItem("token")
//            router.push("/login")
//            return
//        }

//        await fetchTasks()

//        setNewTask({
//            title: "",
//            description: "",
//            priority: "Medium",
//            deadline: "",
//            category: "Work",
//        })

//        setDialogOpen(false)
//    }

//    // ================= DELETE =================
//    async function handleDeleteTask(id: string) {
//        const token = localStorage.getItem("token")

//        await fetch(`${API_URL}/${id}`, {
//            method: "DELETE",
//            headers: {
//                "Authorization": `Bearer ${token}`
//            }
//        })

//        await fetchTasks()
//    }

//    // ================= TOGGLE STATUS =================
//    async function handleToggleStatus(task: Task) {
//        const token = localStorage.getItem("token")

//        const nextStatus: Record<string, Task["status"]> = {
//            "Todo": "In Progress",
//            "In Progress": "Completed",
//            "Completed": "Todo",
//        }

//        const updated = {
//            ...task,
//            status: nextStatus[task.status],
//            deadline: task.deadline
//                ? new Date(task.deadline).toISOString()
//                : null,
//        }

//        await fetch(`${API_URL}/${task.id}`, {
//            method: "PUT",
//            headers: {
//                "Content-Type": "application/json",
//                "Authorization": `Bearer ${token}`
//            },
//            body: JSON.stringify(updated),
//        })

//        await fetchTasks()
//    }

//    // ================= DASHBOARD STATS =================
//    const completedCount = tasks.filter(t => t.status === "Completed").length
//    const inProgressCount = tasks.filter(t => t.status === "In Progress").length
//    const todoCount = tasks.filter(t => t.status === "Todo").length

//    const progressPercent =
//        tasks.length > 0
//            ? Math.round((completedCount / tasks.length) * 100)
//            : 0

//    function getStatusIcon(status: string) {
//        switch (status) {
//            case "Completed":
//                return <CheckCircle2 className="h-4 w-4 text-primary" />
//            case "In Progress":
//                return <Clock className="h-4 w-4 text-accent" />
//            default:
//                return <Circle className="h-4 w-4 text-muted-foreground" />
//        }
//    }

//    function renderTaskList(filteredTasks: Task[]) {
//        if (filteredTasks.length === 0) {
//            return (
//                <p className="py-8 text-center text-sm text-muted-foreground">
//                    No tasks found
//                </p>
//            )
//        }

//        return (
//            <div className="flex flex-col gap-3">
//                {filteredTasks.map(task => (
//                    <div
//                        key={task.id}
//                        className={cn(
//                            "flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md",
//                            task.status === "Completed" && "opacity-70"
//                        )}
//                    >
//                        <button onClick={() => handleToggleStatus(task)}>
//                            {getStatusIcon(task.status)}
//                        </button>

//                        <div className="flex-1 min-w-0">
//                            <div className="flex items-center gap-2">
//                                <p
//                                    className={cn(
//                                        "text-sm font-medium",
//                                        task.status === "Completed" && "line-through"
//                                    )}
//                                >
//                                    {task.title}
//                                </p>

//                                <Badge variant={PRIORITY_COLORS[task.priority]} className="text-xs">
//                                    {task.priority}
//                                </Badge>
//                            </div>

//                            <p className="mt-1 text-xs text-muted-foreground truncate">
//                                {task.description}
//                            </p>

//                            <div className="mt-2 flex items-center gap-3">
//                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
//                                    <CalendarIcon className="h-3 w-3" />
//                                    {task.deadline || "No deadline"}
//                                </span>
//                                <Badge variant="outline" className="text-xs bg-transparent">
//                                    {task.category}
//                                </Badge>
//                            </div>
//                        </div>

//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            onClick={() => handleDeleteTask(task.id)}
//                        >
//                            <Trash2 className="h-4 w-4" />
//                        </Button>
//                    </div>
//                ))}
//            </div>
//        )
//    }

//    return (
//        <div className="flex flex-col gap-6">

//            {/* Dashboard Cards */}
//            <div className="grid gap-4 sm:grid-cols-4">
//                <div className="rounded-xl border bg-card p-4">
//                    <p className="text-sm text-muted-foreground">Total Tasks</p>
//                    <p className="mt-1 text-2xl font-bold">{tasks.length}</p>
//                </div>
//                <div className="rounded-xl border bg-card p-4">
//                    <p className="text-sm text-muted-foreground">To Do</p>
//                    <p className="mt-1 text-2xl font-bold">{todoCount}</p>
//                </div>
//                <div className="rounded-xl border bg-card p-4">
//                    <p className="text-sm text-muted-foreground">In Progress</p>
//                    <p className="mt-1 text-2xl font-bold text-accent">{inProgressCount}</p>
//                </div>
//                <div className="rounded-xl border bg-card p-4">
//                    <p className="text-sm text-muted-foreground">Completed</p>
//                    <p className="mt-1 text-2xl font-bold text-primary">{completedCount}</p>
//                </div>
//            </div>

//            {/* Progress */}
//            <div className="rounded-xl border bg-card p-4">
//                <div className="flex justify-between mb-2">
//                    <span className="text-sm font-medium">Overall Progress</span>
//                    <span className="text-sm font-bold">{progressPercent}%</span>
//                </div>
//                <Progress value={progressPercent} />
//            </div>

//            {/* Rest of UI remains same (Tabs & Dialog) */}
//            {/* I kept your original UI untouched below */}

//            {/* Tabs */}
//            <Tabs defaultValue="all">
//                <TabsList>
//                    <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
//                    <TabsTrigger value="todo">To Do ({todoCount})</TabsTrigger>
//                    <TabsTrigger value="progress">In Progress ({inProgressCount})</TabsTrigger>
//                    <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
//                </TabsList>

//                <TabsContent value="all" className="mt-4">
//                    {renderTaskList(tasks)}
//                </TabsContent>
//                <TabsContent value="todo" className="mt-4">
//                    {renderTaskList(tasks.filter(t => t.status === "Todo"))}
//                </TabsContent>
//                <TabsContent value="progress" className="mt-4">
//                    {renderTaskList(tasks.filter(t => t.status === "In Progress"))}
//                </TabsContent>
//                <TabsContent value="completed" className="mt-4">
//                    {renderTaskList(tasks.filter(t => t.status === "Completed"))}
//                </TabsContent>
//            </Tabs>
//        </div>
//    )
//}




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


//interface Task {
//    id: string
//    title: string
//    description: string
//    priority: "High" | "Medium" | "Low"
//    status: "Todo" | "In Progress" | "Completed"
//    deadline: string
//    category: string
//}

//const API_URL = "https://calchatmain-production-75c1.up.railway.app//api/Tasks"

//const PRIORITY_COLORS: Record<string, any> = {
//    High: "destructive",
//    Medium: "secondary",
//    Low: "outline",
//}

//export function TasksView() {
//    const router = useRouter()
//    const [tasks, setTasks] = useState<Task[]>([])
//    const [dialogOpen, setDialogOpen] = useState(false)

//    const [newTask, setNewTask] = useState({
//        title: "",
//        description: "",
//        priority: "Medium" as Task["priority"],
//        deadline: "",
//        category: "Work",
//    })

//    // ================= AUTH CHECK =================
//    useEffect(() => {
//        const token = localStorage.getItem("token")
//        if (!token) {
//            router.push("/login")
//            return
//        }
//        fetchTasks()
//    }, [])

//    // ================= FETCH TASKS =================
//    async function fetchTasks() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(API_URL, {
//                headers: {
//                    Authorization: `Bearer ${token}`,
//                },
//            })

//            if (res.status === 401) {
//                localStorage.removeItem("token")
//                router.push("/login")
//                return
//            }

//            const data = await res.json()

//            const formatted = data.map((t: any) => ({
//                ...t,
//                deadline: t.deadline ? t.deadline.split("T")[0] : "",
//            }))

//            setTasks(formatted)
//        } catch (error) {
//            console.error("Fetch error:", error)
//        }
//    }

//    // ================= ADD TASK =================
//    async function handleAddTask() {
//        if (!newTask.title.trim()) return

//        try {
//            const token = localStorage.getItem("token")

//            const taskData = {
//                title: newTask.title,
//                description: newTask.description,
//                priority: newTask.priority,
//                status: "Todo",
//                deadline: newTask.deadline
//                    ? new Date(newTask.deadline).toISOString()
//                    : null,
//                category: newTask.category,
//            }

//            const res = await fetch(API_URL, {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`,
//                },
//                body: JSON.stringify(taskData),
//            })

//            if (res.status === 401) {
//                localStorage.removeItem("token")
//                router.push("/login")
//                return
//            }

//            await fetchTasks()

//            setNewTask({
//                title: "",
//                description: "",
//                priority: "Medium",
//                deadline: "",
//                category: "Work",
//            })

//            setDialogOpen(false)
//        } catch (error) {
//            console.error("Add error:", error)
//        }
//    }

//    // ================= DELETE =================
//    async function handleDeleteTask(id: string) {
//        try {
//            const token = localStorage.getItem("token")

//            await fetch(`${API_URL}/${id}`, {
//                method: "DELETE",
//                headers: {
//                    Authorization: `Bearer ${token}`,
//                },
//            })

//            await fetchTasks()
//        } catch (error) {
//            console.error("Delete error:", error)
//        }
//    }

//    // ================= TOGGLE STATUS =================
//    async function handleToggleStatus(task: Task) {
//        try {
//            const token = localStorage.getItem("token")

//            const nextStatus: Record<string, Task["status"]> = {
//                Todo: "In Progress",
//                "In Progress": "Completed",
//                Completed: "Todo",
//            }

//            const updated = {
//                ...task,
//                status: nextStatus[task.status],
//                deadline: task.deadline
//                    ? new Date(task.deadline).toISOString()
//                    : null,
//            }

//            await fetch(`${API_URL}/${task.id}`, {
//                method: "PUT",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`,
//                },
//                body: JSON.stringify(updated),
//            })

//            await fetchTasks()
//        } catch (error) {
//            console.error("Update error:", error)
//        }
//    }

//    // ================= STATS =================
//    const completedCount = tasks.filter(t => t.status === "Completed").length
//    const inProgressCount = tasks.filter(t => t.status === "In Progress").length
//    const todoCount = tasks.filter(t => t.status === "Todo").length

//    const progressPercent =
//        tasks.length > 0
//            ? Math.round((completedCount / tasks.length) * 100)
//            : 0

//    function getStatusIcon(status: string) {
//        switch (status) {
//            case "Completed":
//                return <CheckCircle2 className="h-4 w-4 text-primary" />
//            case "In Progress":
//                return <Clock className="h-4 w-4 text-accent" />
//            default:
//                return <Circle className="h-4 w-4 text-muted-foreground" />
//        }
//    }

//    function renderTaskList(filteredTasks: Task[]) {
//        if (filteredTasks.length === 0) {
//            return (
//                <p className="py-8 text-center text-sm text-muted-foreground">
//                    No tasks found
//                </p>
//            )
//        }

//        return (
//            <div className="flex flex-col gap-3">
//                {filteredTasks.map(task => (
//                    <div
//                        key={task.id}
//                        className={cn(
//                            "flex items-center gap-4 rounded-xl border bg-card p-4 hover:shadow-md",
//                            task.status === "Completed" && "opacity-70"
//                        )}
//                    >
//                        <button onClick={() => handleToggleStatus(task)}>
//                            {getStatusIcon(task.status)}
//                        </button>

//                        <div className="flex-1">
//                            <div className="flex items-center gap-2">
//                                <p
//                                    className={cn(
//                                        "text-sm font-medium",
//                                        task.status === "Completed" && "line-through"
//                                    )}
//                                >
//                                    {task.title}
//                                </p>

//                                <Badge variant={PRIORITY_COLORS[task.priority]} className="text-xs">
//                                    {task.priority}
//                                </Badge>
//                            </div>

//                            <p className="mt-1 text-xs text-muted-foreground">
//                                {task.description}
//                            </p>

//                            <div className="mt-2 flex items-center gap-3">
//                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
//                                    <CalendarIcon className="h-3 w-3" />
//                                    {task.deadline || "No deadline"}
//                                </span>
//                                <Badge variant="outline" className="text-xs">
//                                    {task.category}
//                                </Badge>
//                            </div>
//                        </div>

//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            onClick={() => handleDeleteTask(task.id)}
//                        >
//                            <Trash2 className="h-4 w-4" />
//                        </Button>
//                    </div>
//                ))}
//            </div>
//        )
//    }

//    return (
//        <div className="flex flex-col gap-6">

//            {/* Add Task Button */}
//            <div className="flex justify-end">
//                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                    <DialogTrigger asChild>
//                        <Button>
//                            <Plus className="mr-2 h-4 w-4" />
//                            Add Task
//                        </Button>
//                    </DialogTrigger>

//                    <DialogContent>
//                        <DialogHeader>
//                            <DialogTitle>Add New Task</DialogTitle>
//                            <DialogDescription>
//                                Create a new task
//                            </DialogDescription>
//                        </DialogHeader>

//                        <div className="flex flex-col gap-4 mt-4">
//                            <div>
//                                <Label>Title</Label>
//                                <Input
//                                    value={newTask.title}
//                                    onChange={(e) =>
//                                        setNewTask({ ...newTask, title: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <div>
//                                <Label>Description</Label>
//                                <Input
//                                    value={newTask.description}
//                                    onChange={(e) =>
//                                        setNewTask({ ...newTask, description: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <div>
//                                <Label>Priority</Label>
//                                <Select
//                                    value={newTask.priority}
//                                    onValueChange={(value) =>
//                                        setNewTask({ ...newTask, priority: value as any })
//                                    }
//                                >
//                                    <SelectTrigger>
//                                        <SelectValue />
//                                    </SelectTrigger>
//                                    <SelectContent>
//                                        <SelectItem value="High">High</SelectItem>
//                                        <SelectItem value="Medium">Medium</SelectItem>
//                                        <SelectItem value="Low">Low</SelectItem>
//                                    </SelectContent>
//                                </Select>
//                            </div>

//                            <div>
//                                <Label>Deadline</Label>
//                                <Input
//                                    type="date"
//                                    value={newTask.deadline}
//                                    onChange={(e) =>
//                                        setNewTask({ ...newTask, deadline: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <Button onClick={handleAddTask}>
//                                Create Task
//                            </Button>
//                        </div>
//                    </DialogContent>
//                </Dialog>
//            </div>

//            {/* Dashboard */}
//            <div className="grid gap-4 sm:grid-cols-4">
//                <div className="rounded-xl border bg-card p-4">
//                    <p className="text-sm text-muted-foreground">Total</p>
//                    <p className="text-2xl font-bold">{tasks.length}</p>
//                </div>
//                <div className="rounded-xl border bg-card p-4">
//                    <p className="text-sm text-muted-foreground">To Do</p>
//                    <p className="text-2xl font-bold">{todoCount}</p>
//                </div>
//                <div className="rounded-xl border bg-card p-4">
//                    <p className="text-sm text-muted-foreground">In Progress</p>
//                    <p className="text-2xl font-bold">{inProgressCount}</p>
//                </div>
//                <div className="rounded-xl border bg-card p-4">
//                    <p className="text-sm text-muted-foreground">Completed</p>
//                    <p className="text-2xl font-bold">{completedCount}</p>
//                </div>
//            </div>

//            <div className="rounded-xl border bg-card p-4">
//                <div className="flex justify-between mb-2">
//                    <span>Overall Progress</span>
//                    <span>{progressPercent}%</span>
//                </div>
//                <Progress value={progressPercent} />
//            </div>

//            {/* Tabs */}
//            <Tabs defaultValue="all">
//                <TabsList>
//                    <TabsTrigger value="all">All</TabsTrigger>
//                    <TabsTrigger value="todo">To Do</TabsTrigger>
//                    <TabsTrigger value="progress">In Progress</TabsTrigger>
//                    <TabsTrigger value="completed">Completed</TabsTrigger>
//                </TabsList>

//                <TabsContent value="all">{renderTaskList(tasks)}</TabsContent>
//                <TabsContent value="todo">{renderTaskList(tasks.filter(t => t.status === "Todo"))}</TabsContent>
//                <TabsContent value="progress">{renderTaskList(tasks.filter(t => t.status === "In Progress"))}</TabsContent>
//                <TabsContent value="completed">{renderTaskList(tasks.filter(t => t.status === "Completed"))}</TabsContent>
//            </Tabs>
//        </div>
//    )
//}


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


interface Task {
    id: string
    title: string
    description: string
    priority: "High" | "Medium" | "Low"
    status: "Todo" | "In Progress" | "Completed"
    deadline: string
    category: string

    // ✅ ADD THIS
    assignedUserName?: string
    assignedByName?: string
}

const API_URL = "https://calchatmain-production-75c1.up.railway.app//api/Tasks"

const PRIORITY_COLORS: Record<string, any> = {
    High: "destructive",
    Medium: "secondary",
    Low: "outline",
}

export function TasksView() {
    const router = useRouter()
    const [tasks, setTasks] = useState<Task[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "Medium" as Task["priority"],
        deadline: "",
        category: "Work",
    })
    const [role, setRole] = useState<string | null>(null)
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/login")
            return
        }

        const userRole = getUserRole()
        setRole(userRole)

        fetchTasks()
    }, [])
    // ================= AUTH CHECK =================
 

    // ================= FETCH TASKS =================
    async function fetchTasks() {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (res.status === 401) {
                localStorage.removeItem("token")
                router.push("/login")
                return
            }

            const data = await res.json()
            const formatted = data.map((t: any) => ({
                ...t,
                deadline: t.deadline ? t.deadline.split("T")[0] : "",
                assignedUserName: t.assignedUserName,
                assignedByName: t.assignedByName
            }))

            setTasks(formatted)
        } catch (error) {
            console.error("Fetch error:", error)
        }
    }

    // ================= ADD TASK =================
    async function handleAddTask() {
        if (!newTask.title.trim()) return

        try {
            const token = localStorage.getItem("token")

            const taskData = {
                title: newTask.title,
                description: newTask.description,
                priority: newTask.priority,
                status: "Todo",
                deadline: newTask.deadline
                    ? new Date(newTask.deadline).toISOString()
                    : null,
                category: newTask.category,
            }

            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(taskData),
            })

            if (res.status === 401) {
                localStorage.removeItem("token")
                router.push("/login")
                return
            }

            await fetchTasks()

            setNewTask({
                title: "",
                description: "",
                priority: "Medium",
                deadline: "",
                category: "Work",
            })

            setDialogOpen(false)
        } catch (error) {
            console.error("Add error:", error)
        }
    }

    // ================= DELETE =================
    async function handleDeleteTask(id: string) {
        try {
            const token = localStorage.getItem("token")

            await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            await fetchTasks()
        } catch (error) {
            console.error("Delete error:", error)
        }
    }

    // ================= TOGGLE STATUS =================
    async function handleToggleStatus(task: Task) {
        try {
            const token = localStorage.getItem("token")

            const nextStatus: Record<string, Task["status"]> = {
                Todo: "In Progress",
                "In Progress": "Completed",
                Completed: "Todo",
            }

            const updated = {
                ...task,
                status: nextStatus[task.status],
                deadline: task.deadline
                    ? new Date(task.deadline).toISOString()
                    : null,
            }

            await fetch(`${API_URL}/${task.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updated),
            })

            await fetchTasks()
        } catch (error) {
            console.error("Update error:", error)
        }
    }

    // ================= STATS =================
    const completedCount = tasks.filter(t => t.status === "Completed").length
    const inProgressCount = tasks.filter(t => t.status === "In Progress").length
    const todoCount = tasks.filter(t => t.status === "Todo").length

    const progressPercent =
        tasks.length > 0
            ? Math.round((completedCount / tasks.length) * 100)
            : 0

    function getStatusIcon(status: string) {
        switch (status) {
            case "Completed":
                return <CheckCircle2 className="h-4 w-4 text-primary" />
            case "In Progress":
                return <Clock className="h-4 w-4 text-accent" />
            default:
                return <Circle className="h-4 w-4 text-muted-foreground" />
        }
    }
    function getUserRole() {
        const token = localStorage.getItem("token")
        if (!token) return null

        try {
            const payload = JSON.parse(atob(token.split(".")[1]))

            const role =
                payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                payload["role"]

            return role ? role.toLowerCase() : null   // ✅ FIX
        } catch {
            return null
        }
    }
    function renderTaskList(filteredTasks: Task[]) {
        if (filteredTasks.length === 0) {
            return (
                <p className="py-8 text-center text-sm text-muted-foreground">
                    No tasks found
                </p>
            )
        }

      

        return (
            <div className="flex flex-col gap-3">
                {filteredTasks.map(task => (
                    <div
                        key={task.id}
                        className={cn(
                            "flex items-center gap-4 rounded-xl border bg-card p-4 hover:shadow-md",
                            task.status === "Completed" && "opacity-70"
                        )}
                    >
                        <button onClick={() => handleToggleStatus(task)}>
                            {getStatusIcon(task.status)}
                        </button>

                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p
                                    className={cn(
                                        "text-sm font-medium",
                                        task.status === "Completed" && "line-through"
                                    )}
                                >
                                    {task.title}
                                </p>

                                <Badge variant={PRIORITY_COLORS[task.priority]} className="text-xs">
                                    {task.priority}
                                </Badge>
                            </div>

                            <p className="mt-1 text-xs text-muted-foreground">
                                {task.description}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">

                                <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    {task.deadline || "No deadline"}
                                </span>

                                <Badge variant="outline" className="text-xs">
                                    {task.category}
                                </Badge>

                                {role?.toLowerCase() === "hr" ? (
                                    task.assignedUserName && task.assignedUserName !== task.assignedByName && (
                                        <span>👤 Assigned to: {task.assignedUserName}</span>
                                    )
                                ) : (
                                    task.assignedByName && task.assignedUserName !== task.assignedByName && (
                                        <span>🧑‍💼 Assigned by: {task.assignedByName}</span>
                                    )
                                )}
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTask(task.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        )
    }
    if (!role) {
        return <p className="text-center text-sm text-muted-foreground">Loading...</p>
    }

    return (
        <div className="flex flex-col gap-6">

            {/* Add Task Button */}
            <div className="flex justify-end">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Task
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Task</DialogTitle>
                            <DialogDescription>
                                Create a new task
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-4 mt-4">
                            <div>
                                <Label>Title</Label>
                                <Input
                                    value={newTask.title}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, title: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Input
                                    value={newTask.description}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, description: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Priority</Label>
                                <Select
                                    value={newTask.priority}
                                    onValueChange={(value) =>
                                        setNewTask({ ...newTask, priority: value as any })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Deadline</Label>
                                <Input
                                    type="date"
                                    value={newTask.deadline}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, deadline: e.target.value })
                                    }
                                />
                            </div>

                            <Button onClick={handleAddTask}>
                                Create Task
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Dashboard */}
            <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{tasks.length}</p>
                </div>
                <div className="rounded-xl border bg-card p-4">
                    <p className="text-sm text-muted-foreground">To Do</p>
                    <p className="text-2xl font-bold">{todoCount}</p>
                </div>
                <div className="rounded-xl border bg-card p-4">
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold">{inProgressCount}</p>
                </div>
                <div className="rounded-xl border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{completedCount}</p>
                </div>
            </div>

            <div className="rounded-xl border bg-card p-4">
                <div className="flex justify-between mb-2">
                    <span>Overall Progress</span>
                    <span>{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="todo">To Do</TabsTrigger>
                    <TabsTrigger value="progress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="all">{renderTaskList(tasks)}</TabsContent>
                <TabsContent value="todo">{renderTaskList(tasks.filter(t => t.status === "Todo"))}</TabsContent>
                <TabsContent value="progress">{renderTaskList(tasks.filter(t => t.status === "In Progress"))}</TabsContent>
                <TabsContent value="completed">{renderTaskList(tasks.filter(t => t.status === "Completed"))}</TabsContent>
            </Tabs>
        </div>
    )
}