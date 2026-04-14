
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

        const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Tasks", {
            headers: { Authorization: `Bearer ${token}` }
        })

        const data = await res.json()
        setTasks(data)
    }

    // ================= FETCH EMPLOYEES =================
    async function fetchEmployees() {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/hr/employees", {
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