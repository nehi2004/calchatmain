

"use client"

import { useState, useEffect } from "react"
import {
    LayoutDashboard, Users, BarChart3, Megaphone,
    Plus, Send, Clock, Trash2,
    Calendar, CheckCircle2, MessageSquare,
    StickyNote, Video,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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

interface Announcement {
    id: number
    title: string
    content: string
    audience: string
    status: string
    createdAt: string
}

export default function AdminAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: "",
    })

    // ✅ Fetch announcements
    useEffect(() => {
        fetchAnnouncements()
    }, [])
    async function fetchAnnouncements() {
        const token = localStorage.getItem("token")

        const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Announcement", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        console.log("STATUS:", res.status)

        if (!res.ok) {
            console.log("ERROR FETCH")
            setAnnouncements([])
            return
        }

        const data = await res.json() // ✅ ONLY ONCE
        console.log("DATA:", data)

        const filtered = data.filter(
            (a: Announcement) =>
                a.audience?.toLowerCase() === "professional"
        )

        setAnnouncements(filtered)
    }
    // ✅ Create announcement (ONLY PROFESSIONAL)
    async function handlePublish() {
        if (!newAnnouncement.title || !newAnnouncement.content) return

        const token = localStorage.getItem("token")

        const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Announcement/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: newAnnouncement.title,
                content: newAnnouncement.content,
                audience: "Professional", // 🔥 FIXED HERE
            }),
        })

        if (res.ok) {
            const data = await res.json()

            await fetchAnnouncements()

            setNewAnnouncement({ title: "", content: "" })
            setDialogOpen(false)
        } else {
            alert("Failed to create announcement")
        }
    }

    // ✅ Delete
    async function handleDelete(id: number) {
        const token = localStorage.getItem("token")

        await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/Announcement/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        setAnnouncements(announcements.filter((a) => a.id !== id))
    }

    return (
        <DashboardShell navItems={navItems} role="Admin" title="Announcements">
            <div className="flex flex-col gap-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Announcements</h2>
                        <p className="text-sm text-muted-foreground">
                            Create announcements (Only for Professional Users)
                        </p>
                    </div>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" /> New
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">

                            {/* HEADER */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white">
                                <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                                    📢 Create Announcement
                                </DialogTitle>
                                <p className="text-xs opacity-80 mt-1">
                                    Share important updates with your team instantly
                                </p>
                            </div>

                            {/* BODY */}
                            <div className="p-5 space-y-5">

                                {/* TITLE */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Title</Label>
                                    <Input
                                        placeholder="Enter announcement title..."
                                        value={newAnnouncement.title}
                                        onChange={(e) =>
                                            setNewAnnouncement({
                                                ...newAnnouncement,
                                                title: e.target.value
                                            })
                                        }
                                        className="rounded-xl"
                                    />
                                </div>

                                {/* CONTENT */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Content</Label>
                                    <Textarea
                                        placeholder="Write your announcement..."
                                        rows={5}
                                        value={newAnnouncement.content}
                                        onChange={(e) =>
                                            setNewAnnouncement({
                                                ...newAnnouncement,
                                                content: e.target.value
                                            })
                                        }
                                        className="rounded-xl resize-none"
                                    />
                                </div>

                                {/* INFO BOX */}
                                <div className="flex items-start gap-2 p-3 rounded-xl bg-muted border text-xs text-muted-foreground">
                                    <span className="text-base">ℹ️</span>
                                    <p>
                                        This announcement will be visible only to <span className="font-medium text-primary">Professional users</span>.
                                    </p>
                                </div>

                                {/* ACTION BUTTON */}
                                <Button
                                    onClick={handlePublish}
                                    className="w-full h-11 rounded-xl font-medium shadow-lg hover:scale-[1.02] transition"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Publish Announcement 🚀
                                </Button>

                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* List */}
                <div className="flex flex-col gap-4">
                    {announcements.map((a) => (
                        <div key={a.id} className="p-5 border rounded-lg">
                            <div className="flex justify-between">
                                <div>
                                    <div className="flex gap-2 items-center">
                                        <h3 className="font-semibold">{a.title}</h3>
                                        <Badge>{a.status}</Badge>
                                        <Badge variant="outline">{a.audience}</Badge>
                                    </div>

                                    <p className="text-sm text-gray-500 mt-2">
                                        {a.content}
                                    </p>

                                    <div className="flex items-center gap-1 text-xs mt-2">
                                        <Clock className="h-3 w-3" />
                                        {new Date(a.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    onClick={() => handleDelete(a.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </DashboardShell>
    )
}