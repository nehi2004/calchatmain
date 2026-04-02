//"use client"

//import { useState } from "react"
//import {
//    LayoutDashboard, Users, Shield, Briefcase, BarChart3, Megaphone,
//    Plus, Send, Clock, Trash2,
//    Calendar,
//    CheckCircle2,
//    MessageSquare,
//    StickyNote,
//    Video,
//} from "lucide-react"
//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"
//import { Textarea } from "@/components/ui/textarea"
//import { Badge } from "@/components/ui/badge"
//import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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

//interface Announcement {
//    id: string
//    title: string
//    content: string
//    audience: string
//    date: string
//    status: string
//}

//const INITIAL_ANNOUNCEMENTS: Announcement[] = [
//    { id: "1", title: "System Maintenance Scheduled", content: "CalChat+ will undergo scheduled maintenance on Feb 15, 2026 from 2:00 AM to 4:00 AM UTC. During this time, the platform may be temporarily unavailable.", audience: "All Users", date: "Feb 9, 2026", status: "Published" },
//    { id: "2", title: "New AI Chat Features Released", content: "We've added several new capabilities to the AI Chat assistant including calendar integration, smart task creation, and productivity insights.", audience: "All Users", date: "Feb 7, 2026", status: "Published" },
//    { id: "3", title: "Professional Plan Updates", content: "New features for professional users: Advanced team analytics, custom report builder, and meeting recording integration.", audience: "Professional", date: "Feb 5, 2026", status: "Published" },
//    { id: "4", title: "Student Exam Season Resources", content: "Special focus mode presets and study planning tools are now available for the upcoming exam season.", audience: "Student", date: "Feb 3, 2026", status: "Draft" },
//    { id: "5", title: "Security Update", content: "We've enhanced our security measures with two-factor authentication support and improved session management.", audience: "All Users", date: "Jan 30, 2026", status: "Published" },
//]

//export default function AdminAnnouncementsPage() {
//    const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS)
//    const [dialogOpen, setDialogOpen] = useState(false)
//    const [newAnnouncement, setNewAnnouncement] = useState({
//        title: "", content: "", audience: "All Users",
//    })

//    function handlePublish() {
//        if (!newAnnouncement.title || !newAnnouncement.content) return
//        const announcement: Announcement = {
//            id: Date.now().toString(),
//            title: newAnnouncement.title,
//            content: newAnnouncement.content,
//            audience: newAnnouncement.audience,
//            date: "Just now",
//            status: "Published",
//        }
//        setAnnouncements([announcement, ...announcements])
//        setNewAnnouncement({ title: "", content: "", audience: "All Users" })
//        setDialogOpen(false)
//    }

//    function handleDelete(id: string) {
//        setAnnouncements(announcements.filter((a) => a.id !== id))
//    }

//    return (
//        <DashboardShell navItems={navItems} role="Admin" title="Announcements">
//            <div className="flex flex-col gap-6">
//                <div className="flex items-center justify-between">
//                    <div>
//                        <h2 className="font-heading text-xl font-bold text-foreground">Announcements</h2>
//                        <p className="mt-1 text-sm text-muted-foreground">Create and manage platform announcements</p>
//                    </div>
//                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                        <DialogTrigger asChild>
//                            <Button className="gap-2">
//                                <Plus className="h-4 w-4" /> New Announcement
//                            </Button>
//                        </DialogTrigger>
//                        <DialogContent>
//                            <DialogHeader>
//                                <DialogTitle>Create Announcement</DialogTitle>
//                            </DialogHeader>
//                            <div className="flex flex-col gap-4 pt-4">
//                                <div className="flex flex-col gap-2">
//                                    <Label>Title</Label>
//                                    <Input
//                                        placeholder="Announcement title"
//                                        value={newAnnouncement.title}
//                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
//                                    />
//                                </div>
//                                <div className="flex flex-col gap-2">
//                                    <Label>Content</Label>
//                                    <Textarea
//                                        placeholder="Write your announcement..."
//                                        value={newAnnouncement.content}
//                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
//                                        rows={4}
//                                    />
//                                </div>
//                                <div className="flex flex-col gap-2">
//                                    <Label>Target Audience</Label>
//                                    <Select value={newAnnouncement.audience} onValueChange={(v) => setNewAnnouncement({ ...newAnnouncement, audience: v })}>
//                                        <SelectTrigger><SelectValue /></SelectTrigger>
//                                        <SelectContent>
//                                            <SelectItem value="All Users">All Users</SelectItem>
//                                            <SelectItem value="Student">Students Only</SelectItem>
//                                            <SelectItem value="Personal">Personal Users Only</SelectItem>
//                                            <SelectItem value="Professional">Professionals Only</SelectItem>
//                                        </SelectContent>
//                                    </Select>
//                                </div>
//                                <Button onClick={handlePublish} className="gap-2">
//                                    <Send className="h-4 w-4" /> Publish
//                                </Button>
//                            </div>
//                        </DialogContent>
//                    </Dialog>
//                </div>

//                <div className="flex flex-col gap-4">
//                    {announcements.map((announcement) => (
//                        <div key={announcement.id} className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md">
//                            <div className="flex items-start justify-between">
//                                <div className="flex-1">
//                                    <div className="flex items-center gap-3">
//                                        <h3 className="font-heading text-base font-semibold text-card-foreground">{announcement.title}</h3>
//                                        <Badge variant={announcement.status === "Published" ? "default" : "secondary"}>{announcement.status}</Badge>
//                                        <Badge variant="outline" className="bg-transparent">{announcement.audience}</Badge>
//                                    </div>
//                                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{announcement.content}</p>
//                                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
//                                        <Clock className="h-3 w-3" /> {announcement.date}
//                                    </div>
//                                </div>
//                                <Button
//                                    variant="ghost"
//                                    size="icon"
//                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
//                                    onClick={() => handleDelete(announcement.id)}
//                                >
//                                    <Trash2 className="h-4 w-4" />
//                                </Button>
//                            </div>
//                        </div>
//                    ))}
//                </div>
//            </div>
//        </DashboardShell>
//    )
//}


//"use client"

//import { useState, useEffect } from "react"
//import {
//    LayoutDashboard, Users, BarChart3, Megaphone,
//    Plus, Send, Clock, Trash2,
//    Calendar, CheckCircle2, MessageSquare,
//    StickyNote, Video,
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"
//import { Textarea } from "@/components/ui/textarea"
//import { Badge } from "@/components/ui/badge"
//import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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

//interface Announcement {
//    id: number
//    title: string
//    content: string
//    audience: string
//    status: string
//    createdAt: string
//}

//export default function AdminAnnouncementsPage() {
//    const [announcements, setAnnouncements] = useState<Announcement[]>([])
//    const [dialogOpen, setDialogOpen] = useState(false)

//    const [newAnnouncement, setNewAnnouncement] = useState({
//        title: "",
//        content: "",
//        audience: "All Users",
//    })

//    // ✅ Fetch announcements on load
//    useEffect(() => {
//        fetchAnnouncements()
//    }, [])

//    async function fetchAnnouncements() {
//        const token = localStorage.getItem("token")

//        const res = await fetch("https://calchat-backend.onrender.com//api/Announcement", {
//            headers: {
//                Authorization: `Bearer ${token}`,
//            },
//        })

//        if (res.ok) {
//            const data = await res.json()
//            setAnnouncements(data)
//        }
//    }

//    // ✅ Create announcement (API)
//    async function handlePublish() {
//        if (!newAnnouncement.title || !newAnnouncement.content) return

//        const token = localStorage.getItem("token")

//        const res = await fetch("https://calchat-backend.onrender.com//api/Announcement/create", {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`,
//            },
//            body: JSON.stringify({
//                title: newAnnouncement.title,
//                content: newAnnouncement.content,
//                audience: newAnnouncement.audience,
//            }),
//        })

//        if (res.ok) {
//            const data = await res.json()

//            // ✅ Add instantly in UI
//            setAnnouncements([data.data ?? data, ...announcements])

//            setNewAnnouncement({ title: "", content: "", audience: "All Users" })
//            setDialogOpen(false)
//        } else {
//            alert("Failed to create announcement")
//        }
//    }

//    // ✅ Delete (API optional)
//    async function handleDelete(id: number) {
//        const token = localStorage.getItem("token")

//        await fetch(`https://calchat-backend.onrender.com//api/Announcement/${id}`, {
//            method: "DELETE",
//            headers: {
//                Authorization: `Bearer ${token}`,
//            },
//        })

//        setAnnouncements(announcements.filter((a) => a.id !== id))
//    }

//    return (
//        <DashboardShell navItems={navItems} role="Admin" title="Announcements">
//            <div className="flex flex-col gap-6">

//                {/* Header */}
//                <div className="flex items-center justify-between">
//                    <div>
//                        <h2 className="text-xl font-bold">Announcements</h2>
//                        <p className="text-sm text-muted-foreground">
//                            Create and manage announcements
//                        </p>
//                    </div>

//                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                        <DialogTrigger asChild>
//                            <Button className="gap-2">
//                                <Plus className="h-4 w-4" /> New
//                            </Button>
//                        </DialogTrigger>

//                        <DialogContent>
//                            <DialogHeader>
//                                <DialogTitle>Create Announcement</DialogTitle>
//                            </DialogHeader>

//                            <div className="flex flex-col gap-4 pt-4">
//                                <div>
//                                    <Label>Title</Label>
//                                    <Input
//                                        value={newAnnouncement.title}
//                                        onChange={(e) =>
//                                            setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
//                                        }
//                                    />
//                                </div>

//                                <div>
//                                    <Label>Content</Label>
//                                    <Textarea
//                                        value={newAnnouncement.content}
//                                        onChange={(e) =>
//                                            setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
//                                        }
//                                    />
//                                </div>

//                                <div>
//                                    <Label>Audience</Label>
//                                    <Select
//                                        value={newAnnouncement.audience}
//                                        onValueChange={(v) =>
//                                            setNewAnnouncement({ ...newAnnouncement, audience: v })
//                                        }
//                                    >
//                                        <SelectTrigger><SelectValue /></SelectTrigger>
//                                        <SelectContent>
//                                            <SelectItem value="All Users">All Users</SelectItem>
//                                            <SelectItem value="Student">Student</SelectItem>
//                                            <SelectItem value="Personal">Personal</SelectItem>
//                                            <SelectItem value="Professional">Professional</SelectItem>
//                                        </SelectContent>
//                                    </Select>
//                                </div>

//                                <Button onClick={handlePublish}>
//                                    <Send className="h-4 w-4 mr-2" /> Publish
//                                </Button>
//                            </div>
//                        </DialogContent>
//                    </Dialog>
//                </div>

//                {/* List */}
//                <div className="flex flex-col gap-4">
//                    {announcements.map((a) => (
//                        <div key={a.id} className="p-5 border rounded-lg">
//                            <div className="flex justify-between">
//                                <div>
//                                    <div className="flex gap-2 items-center">
//                                        <h3 className="font-semibold">{a.title}</h3>
//                                        <Badge>{a.status}</Badge>
//                                        <Badge variant="outline">{a.audience}</Badge>
//                                    </div>

//                                    <p className="text-sm text-gray-500 mt-2">
//                                        {a.content}
//                                    </p>

//                                    <div className="flex items-center gap-1 text-xs mt-2">
//                                        <Clock className="h-3 w-3" />
//                                        {new Date(a.createdAt).toLocaleString()}
//                                    </div>
//                                </div>

//                                <Button
//                                    variant="ghost"
//                                    onClick={() => handleDelete(a.id)}
//                                >
//                                    <Trash2 className="h-4 w-4" />
//                                </Button>
//                            </div>
//                        </div>
//                    ))}
//                </div>

//            </div>
//        </DashboardShell>
//    )
//}

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

        const res = await fetch("https://calchat-backend.onrender.com//api/Announcement", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (res.ok) {
            const data = await res.json()
            setAnnouncements(data)
        }
    }

    // ✅ Create announcement (ONLY PROFESSIONAL)
    async function handlePublish() {
        if (!newAnnouncement.title || !newAnnouncement.content) return

        const token = localStorage.getItem("token")

        const res = await fetch("https://calchat-backend.onrender.com//api/Announcement/create", {
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

            setAnnouncements([data, ...announcements])

            setNewAnnouncement({ title: "", content: "" })
            setDialogOpen(false)
        } else {
            alert("Failed to create announcement")
        }
    }

    // ✅ Delete
    async function handleDelete(id: number) {
        const token = localStorage.getItem("token")

        await fetch(`https://calchat-backend.onrender.com//api/Announcement/${id}`, {
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