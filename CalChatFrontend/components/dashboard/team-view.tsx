//"use client"

//import { Mail, MessageSquare, MoreHorizontal, UserPlus } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { Badge } from "@/components/ui/badge"
//import { Progress } from "@/components/ui/progress"

//const TEAM_MEMBERS = [
//  { id: "1", name: "Alice Johnson", role: "Frontend Lead", email: "alice@company.com", avatar: "AJ", status: "Online", tasks: 8, completed: 6 },
//  { id: "2", name: "Bob Smith", role: "Backend Developer", email: "bob@company.com", avatar: "BS", status: "Online", tasks: 10, completed: 7 },
//  { id: "3", name: "Carol White", role: "UX Designer", email: "carol@company.com", avatar: "CW", status: "Away", tasks: 6, completed: 5 },
//  { id: "4", name: "David Lee", role: "Full Stack Developer", email: "david@company.com", avatar: "DL", status: "Online", tasks: 9, completed: 8 },
//  { id: "5", name: "Eve Martinez", role: "QA Engineer", email: "eve@company.com", avatar: "EM", status: "Offline", tasks: 7, completed: 4 },
//  { id: "6", name: "Frank Wilson", role: "DevOps Engineer", email: "frank@company.com", avatar: "FW", status: "Online", tasks: 5, completed: 5 },
//  { id: "7", name: "Grace Kim", role: "Product Manager", email: "grace@company.com", avatar: "GK", status: "Away", tasks: 12, completed: 10 },
//  { id: "8", name: "Henry Taylor", role: "Data Analyst", email: "henry@company.com", avatar: "HT", status: "Online", tasks: 8, completed: 6 },
//]

//const STATUS_COLORS: Record<string, string> = {
//  Online: "bg-primary",
//  Away: "bg-chart-4",
//  Offline: "bg-muted-foreground",
//}

//export function TeamView() {
//  return (
//    <div className="flex flex-col gap-6">
//      <div className="flex items-center justify-between">
//        <div>
//          <h2 className="font-heading text-xl font-bold text-foreground">Team</h2>
//          <p className="mt-1 text-sm text-muted-foreground">{TEAM_MEMBERS.length} members in your team</p>
//        </div>
//        <Button className="gap-2">
//          <UserPlus className="h-4 w-4" /> Invite Member
//        </Button>
//      </div>

//      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//        {TEAM_MEMBERS.map((member) => (
//          <div key={member.id} className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md">
//            <div className="flex items-start gap-4">
//              <div className="relative">
//                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
//                  {member.avatar}
//                </div>
//                <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${STATUS_COLORS[member.status]}`} />
//              </div>
//              <div className="flex-1">
//                <h3 className="font-heading text-sm font-semibold text-card-foreground">{member.name}</h3>
//                <p className="text-xs text-muted-foreground">{member.role}</p>
//                <Badge variant="secondary" className="mt-1 text-xs">{member.status}</Badge>
//              </div>
//            </div>
//            <div className="mt-4">
//              <div className="flex items-center justify-between text-xs">
//                <span className="text-muted-foreground">Tasks Progress</span>
//                <span className="font-medium text-primary">{member.completed}/{member.tasks}</span>
//              </div>
//              <Progress value={(member.completed / member.tasks) * 100} className="mt-2 h-1.5" />
//            </div>
//            <div className="mt-4 flex items-center gap-2">
//              <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
//                <MessageSquare className="h-3.5 w-3.5" /> Chat
//              </Button>
//              <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
//                <Mail className="h-3.5 w-3.5" /> Email
//              </Button>
//            </div>
//          </div>
//        ))}
//      </div>
//    </div>
//  )
//}


//"use client"

//import { Mail, MessageSquare, UserPlus } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { Badge } from "@/components/ui/badge"
//import { Progress } from "@/components/ui/progress"
//import { useState, useEffect } from "react"
//import { useRouter } from "next/navigation"

//const STATUS_COLORS: Record<string, string> = {
//    Online: "bg-primary",
//    Away: "bg-chart-4",
//    Offline: "bg-muted-foreground",
//}
////const router = useRouter()

//export function TeamView() {
//    const router = useRouter()
//    const [members, setMembers] = useState<any[]>([])
//    const [loading, setLoading] = useState(true)

//    useEffect(() => {
//        fetchEmployees()
//    }, [])

//    async function fetchEmployees() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchat-backend.onrender.com//api/hr/employees", {
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            if (!res.ok) {
//                console.error("API Error:", res.status)
//                return
//            }

//            const data = await res.json()

//            // 👇 IMPORTANT mapping (same as your employee page)
//            const formatted = data.map((emp: any) => ({
//                id: emp.id,
//                fullName: emp.name,
//                email: emp.email,
//                role: emp.department || "Employee",
//                status: emp.status || "Offline",
//                tasks: 0,        // optional (until you connect tasks API)
//                completed: 0
//            }))

//            setMembers(formatted)

//        } catch (err) {
//            console.error("Fetch error:", err)
//        }

//        setLoading(false)
//    }

//    return (
//        <div className="flex flex-col gap-6">

//            {/* HEADER */}
//            <div className="flex items-center justify-between">
//                <div>
//                    <h2 className="font-heading text-xl font-bold text-foreground">Team</h2>
//                    <p className="mt-1 text-sm text-muted-foreground">
//                        {members.length} members in your team
//                    </p>
//                </div>

//            {/*    <Button className="gap-2">*/}
//            {/*        <UserPlus className="h-4 w-4" /> Invite Member*/}
//            {/*    </Button>*/}
//            </div>

//            {/* LOADING */}
//            {loading ? (
//                <p className="text-center">Loading...</p>
//            ) : (

//                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                    {members.map((member) => (

//                        <div
//                            key={member.id}
//                            className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md"
//                        >

//                            {/* USER INFO */}
//                            <div className="flex items-start gap-4">
//                                <div className="relative">
//                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
//                                        {member.fullName
//                                            ?.split(" ")
//                                            .map((n: string) => n[0])
//                                            .join("")}
//                                    </div>

//                                    <span
//                                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${STATUS_COLORS[member.status] || "bg-gray-400"
//                                            }`}
//                                    />
//                                </div>

//                                <div className="flex-1">
//                                    <h3 className="font-heading text-sm font-semibold text-card-foreground">
//                                        {member.fullName}
//                                    </h3>

//                                    <p className="text-xs text-muted-foreground">
//                                        {member.role}
//                                    </p>

//                                    <Badge variant="secondary" className="mt-1 text-xs">
//                                        {member.status}
//                                    </Badge>
//                                </div>
//                            </div>

//                            {/* TASK PROGRESS */}
//                            <div className="mt-4">
//                                <div className="flex items-center justify-between text-xs">
//                                    <span className="text-muted-foreground">Tasks Progress</span>
//                                    <span className="font-medium text-primary">
//                                        {member.completed}/{member.tasks}
//                                    </span>
//                                </div>

//                                <Progress
//                                    value={(member.completed / member.tasks) * 100 || 0}
//                                    className="mt-2 h-1.5"
//                                />
//                            </div>

//                            {/* ACTION BUTTONS */}
//                            <div className="mt-4 flex items-center gap-2">

//                                {/* CHAT */}
//                                {/*<Button*/}
//                                {/*    variant="outline"*/}
//                                {/*    size="sm"*/}
//                                {/*    className="flex-1 gap-2 bg-transparent"*/}
//                                {/*    onClick={() => {*/}
//                                {/*        router.push(`/dashboard/hr/personal-chat/${member.id}`)*/}
//                                {/*    }}*/}
//                                {/*>*/}
//                                {/*    <MessageSquare className="h-3.5 w-3.5" /> Chat*/}
//                                {/*</Button>*/}

//                                {/* EMAIL */}
//                                <Button
//                                    variant="outline"
//                                    size="sm"
//                                    className="flex-1 gap-2 bg-transparent"
//                                    onClick={() => {
//                                        router.push(`/dashboard/hr/personal-chat/${member.id}`)
//                                    }}
//                                >
//                                    <Mail className="h-3.5 w-3.5" /> Email
//                                </Button>

//                            </div>

//                        </div>
//                    ))}
//                </div>
//            )}

//        </div>
//    )
//}









//"use client"

//import { Mail } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { Badge } from "@/components/ui/badge"
//import { Progress } from "@/components/ui/progress"
//import { useState, useEffect } from "react"

//const STATUS_COLORS: Record<string, string> = {
//    Online: "bg-green-500",
//    Away: "bg-yellow-500",
//    Offline: "bg-gray-400",
//}

//export function TeamView() {

//    const [members, setMembers] = useState<any[]>([])
//    const [loading, setLoading] = useState(true)
//    const [tasks, setTasks] = useState<any[]>([])
//    useEffect(() => {
//        async function loadData() {
//            await fetchTasks()
//            await fetchEmployees()
//        }

//        loadData()
//    }, [])

//    useEffect(() => {
//        if (members.length === 0 || tasks.length === 0) return

//        const updatedMembers = members.map(member => {
//            const userTasks = tasks.filter((t: any) =>
//                t.userId === member.id ||
//                (t.userIds && t.userIds.includes(member.id))
//            )

//            const completedTasks = userTasks.filter(
//                (t: any) => t.status === "Completed"
//            )

//            return {
//                ...member,
//                tasks: userTasks.length,
//                completed: completedTasks.length
//            }
//        })

//        setMembers(updatedMembers)

//    }, [tasks, members])



//    async function fetchTasks() {
//        const token = localStorage.getItem("token")

//        const res = await fetch("https://calchat-backend.onrender.com//api/Tasks", {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()
//        setTasks(data)
//    }

//    async function fetchEmployees() {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchat-backend.onrender.com//api/hr/employees", {
//                headers: {
//                    Authorization: `Bearer ${token}`
//                }
//            })

//            const data = await res.json()

//            const formatted = data.map((emp: any) => ({
//                id: emp.id,
//                fullName: emp.name,
//                email: emp.email,
//                role: emp.department || "Employee",
//                status: emp.status || "Offline",

//                // initially zero
//                tasks: 0,
//                completed: 0
//            }))

//            setMembers(formatted)

//        } catch (err) {
//            console.error(err)
//        }

//        setLoading(false)
//    }

//    return (
//        <div className="flex flex-col gap-6">

//            {/* HEADER */}
//            <div>
//                <h2 className="text-xl font-bold">Team</h2>
//                <p className="text-sm text-muted-foreground">
//                    {members.length} members in your team
//                </p>
//            </div>

//            {/* LOADING */}
//            {loading ? (
//                <p className="text-center">Loading...</p>
//            ) : (

//                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                    {members.map((member) => (

//                        <div
//                            key={member.id}
//                            className="rounded-xl border bg-card p-6 hover:shadow-lg transition-all"
//                        >

//                            {/* USER */}
//                            <div className="flex items-center gap-4">
//                                <div className="relative">
//                                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
//                                        {member.fullName
//                                            ?.split(" ")
//                                            .map((n: string) => n[0])
//                                            .join("")}
//                                    </div>

//                                    <span
//                                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${STATUS_COLORS[member.status]}`}
//                                    />
//                                </div>

//                                <div>
//                                    <h3 className="font-semibold text-sm">
//                                        {member.fullName}
//                                    </h3>

//                                    <p className="text-xs text-muted-foreground">
//                                        {member.role}
//                                    </p>

//                                    <Badge variant="secondary" className="mt-1 text-xs">
//                                        {member.status}
//                                    </Badge>
//                                </div>
//                            </div>

//                            {/* PROGRESS */}
//                            <div className="mt-4">
//                                <div className="flex justify-between text-xs">
//                                    <span>Tasks</span>
//                                    <span>{member.completed}/{member.tasks}</span>
//                                </div>

//                                <Progress
//                                    value={member.tasks ? (member.completed / member.tasks) * 100 : 0}
//                                    className="mt-2 h-1.5"
//                                />
//                            </div>

//                            {/* ✅ EMAIL BUTTON (FIXED) */}
//                            <div className="mt-4">
//                                <Button
//                                    variant="outline"
//                                    size="sm"
//                                    className="w-full gap-2"
//                                    onClick={() => {
//                                        window.location.href = `mailto:${member.email}`
//                                    }}
//                                >
//                                    <Mail className="h-4 w-4" />
//                                    Send Email
//                                </Button>
//                            </div>

//                        </div>
//                    ))}
//                </div>
//            )}

//        </div>
//    )
//}


"use client"

import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"

const STATUS_COLORS: Record<string, string> = {
    Online: "bg-green-500",
    Away: "bg-yellow-500",
    Offline: "bg-gray-400",
}

export function TeamView() {

    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [tasks, setTasks] = useState<any[]>([])

    // ================= INIT =================
    useEffect(() => {
        async function loadData() {
            await fetchTasks()
            await fetchEmployees()
        }
        loadData()
    }, [])

    // ================= FETCH TASKS =================
    async function fetchTasks() {
        const token = localStorage.getItem("token")

        const res = await fetch("https://calchat-backend.onrender.com//api/Tasks", {
            headers: { Authorization: `Bearer ${token}` }
        })

        const data = await res.json()
        setTasks(data)
    }

    // ================= FETCH EMPLOYEES =================
    async function fetchEmployees() {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch("https://calchat-backend.onrender.com//api/hr/employees", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()

            const formatted = data.map((emp: any) => ({
                id: emp.id,
                fullName: emp.name,
                email: emp.email,
                role: emp.department || "Employee",
                status: emp.status || "Offline",
            }))

            setMembers(formatted)

        } catch (err) {
            console.error(err)
        }

        setLoading(false)
    }

    return (
        <div className="flex flex-col gap-6">

            {/* HEADER */}
            <div>
                <h2 className="text-xl font-bold">Team</h2>
                <p className="text-sm text-muted-foreground">
                    {members.length} members in your team
                </p>
            </div>

            {/* LOADING */}
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {members.map((member) => {

                        // ✅ CALCULATE TASKS PER USER (REAL TIME)
                        const userTasks = tasks.filter((t: any) =>
                            t.userId?.toString() === member.id.toString() ||
                            (t.userIds && t.userIds.map((id: any) => id.toString()).includes(member.id.toString()))
                        )

                        const completedTasks = userTasks.filter(
                            (t: any) => t.status === "Completed"
                        )

                        const total = userTasks.length
                        const completed = completedTasks.length

                        return (
                            <div
                                key={member.id}
                                className="rounded-xl border bg-card p-6 hover:shadow-lg transition-all"
                            >

                                {/* USER */}
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                            {member.fullName
                                                ?.split(" ")
                                                .map((n: string) => n[0])
                                                .join("")}
                                        </div>

                                        <span
                                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${STATUS_COLORS[member.status]}`}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-sm">
                                            {member.fullName}
                                        </h3>

                                        <p className="text-xs text-muted-foreground">
                                            {member.role}
                                        </p>

                                        <Badge variant="secondary" className="mt-1 text-xs">
                                            {member.status}
                                        </Badge>
                                    </div>
                                </div>

                                {/* PROGRESS */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs">
                                        <span>Tasks</span>
                                        <span>{completed}/{total}</span>
                                    </div>

                                    <Progress
                                        value={total ? (completed / total) * 100 : 0}
                                        className="mt-2 h-1.5"
                                    />
                                </div>

                                {/* EMAIL */}
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-2"
                                        onClick={() => {
                                            window.location.href = `mailto:${member.email}`
                                        }}
                                    >
                                        <Mail className="h-4 w-4" />
                                        Send Email
                                    </Button>
                                </div>

                            </div>
                        )
                    })}
                </div>
            )}

        </div>
    )
}