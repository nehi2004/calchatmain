



"use client"

import { useEffect, useState } from "react"
import {
    LayoutDashboard, Users, BarChart3, Megaphone,
    Clock, Calendar, CheckCircle2, MessageSquare,
    StickyNote, Video,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Badge } from "@/components/ui/badge"

const navItems = [
    { label: "Dashboard", href: "/dashboard/professional", icon: LayoutDashboard },
    { label: "Calendar", href: "/dashboard/professional/calendar", icon: Calendar },
    { label: "AI Chat", href: "/dashboard/professional/chat", icon: MessageSquare },
    { label: "Meetings", href: "/dashboard/professional/meetings", icon: Video },
    { label: "Tasks", href: "/dashboard/professional/tasks", icon: CheckCircle2 },
    { label: "Notes", href: "/dashboard/professional/notes", icon: StickyNote },
    { label: "Announcements", href: "/dashboard/professional/announcements", icon: Megaphone },
    { label: "Analytics", href: "/dashboard/professional/analytics", icon: BarChart3 },
]

interface Announcement {
    id: number
    title: string
    content: string
    audience: string
    status: string
    createdAt: string
}

export default function ProfessionalAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])

    const userRole = "Professional" // 🔥 role filter

    useEffect(() => {
        fetchAnnouncements()
    }, [])
    async function fetchAnnouncements() {
        const token = localStorage.getItem("token")

        console.log("TOKEN:", token) // 🔥 check this

        const res = await fetch(
            "https://calchat-backend.onrender.com/api/Announcement",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        console.log("STATUS:", res.status)

        if (res.status === 403) {
            console.log("❌ ACCESS DENIED - ROLE ISSUE")
            return
        }

        const data = await res.json()
        setAnnouncements(data)
    }
   
    return (
        <DashboardShell navItems={navItems} role="Professional" title="Announcements">
            <div className="flex flex-col gap-6">

                {/* Header */}
                <div>
                    <h2 className="text-xl font-bold">Announcements</h2>
                    <p className="text-sm text-muted-foreground">
                        Latest updates from HR
                    </p>
                </div>

                {/* List */}
                <div className="flex flex-col gap-4">
                    {announcements.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No announcements available
                        </p>
                    ) : (
                        announcements.map((a) => (
                            <div key={a.id} className="p-5 border rounded-xl bg-card hover:shadow-md transition">

                                <div className="flex items-start justify-between">
                                    <div className="flex-1">

                                        {/* Title + badges */}
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{a.title}</h3>

                                            <Badge>
                                                {a.status}
                                            </Badge>

                                            <Badge variant="outline">
                                                {a.audience}
                                            </Badge>
                                        </div>

                                        {/* Content */}
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {a.content}
                                        </p>

                                        {/* Date */}
                                        <div className="flex items-center gap-1 text-xs mt-3 text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {new Date(a.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))
                    )}
                </div>

            </div>
        </DashboardShell>
    )
}