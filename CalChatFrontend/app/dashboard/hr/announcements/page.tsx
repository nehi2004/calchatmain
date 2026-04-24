

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
//    })

//    // ✅ Fetch announcements
//    useEffect(() => {
//        fetchAnnouncements()
//    }, [])
//    async function fetchAnnouncements() {
//        const token = localStorage.getItem("token")

//        const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Announcement", {
//            headers: {
//                Authorization: `Bearer ${token}`,
//            },
//        })

//        console.log("STATUS:", res.status)

//        if (!res.ok) {
//            console.log("ERROR FETCH")
//            setAnnouncements([])
//            return
//        }

//        const data = await res.json() // ✅ ONLY ONCE
//        console.log("DATA:", data)

//        const filtered = data.filter(
//            (a: Announcement) =>
//                a.audience?.toLowerCase() === "professional"
//        )

//        setAnnouncements(filtered)
//    }
//    // ✅ Create announcement (ONLY PROFESSIONAL)
//    async function handlePublish() {
//        if (!newAnnouncement.title || !newAnnouncement.content) return

//        const token = localStorage.getItem("token")

//        const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Announcement/create", {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`,
//            },
//            body: JSON.stringify({
//                title: newAnnouncement.title,
//                content: newAnnouncement.content,
//                audience: "Professional", // 🔥 FIXED HERE
//            }),
//        })

//        if (res.ok) {
//            const data = await res.json()

//            await fetchAnnouncements()

//            setNewAnnouncement({ title: "", content: "" })
//            setDialogOpen(false)
//        } else {
//            alert("Failed to create announcement")
//        }
//    }

//    // ✅ Delete
//    async function handleDelete(id: number) {
//        const token = localStorage.getItem("token")

//        await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/Announcement/${id}`, {
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
//                            Create announcements (Only for Professional Users)
//                        </p>
//                    </div>

//                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                        <DialogTrigger asChild>
//                            <Button className="gap-2">
//                                <Plus className="h-4 w-4" /> New
//                            </Button>
//                        </DialogTrigger>

//                        <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">

//                            {/* HEADER */}
//                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white">
//                                <DialogTitle className="text-lg font-semibold flex items-center gap-2">
//                                    📢 Create Announcement
//                                </DialogTitle>
//                                <p className="text-xs opacity-80 mt-1">
//                                    Share important updates with your team instantly
//                                </p>
//                            </div>

//                            {/* BODY */}
//                            <div className="p-5 space-y-5">

//                                {/* TITLE */}
//                                <div className="space-y-2">
//                                    <Label className="text-sm font-medium">Title</Label>
//                                    <Input
//                                        placeholder="Enter announcement title..."
//                                        value={newAnnouncement.title}
//                                        onChange={(e) =>
//                                            setNewAnnouncement({
//                                                ...newAnnouncement,
//                                                title: e.target.value
//                                            })
//                                        }
//                                        className="rounded-xl"
//                                    />
//                                </div>

//                                {/* CONTENT */}
//                                <div className="space-y-2">
//                                    <Label className="text-sm font-medium">Content</Label>
//                                    <Textarea
//                                        placeholder="Write your announcement..."
//                                        rows={5}
//                                        value={newAnnouncement.content}
//                                        onChange={(e) =>
//                                            setNewAnnouncement({
//                                                ...newAnnouncement,
//                                                content: e.target.value
//                                            })
//                                        }
//                                        className="rounded-xl resize-none"
//                                    />
//                                </div>

//                                {/* INFO BOX */}
//                                <div className="flex items-start gap-2 p-3 rounded-xl bg-muted border text-xs text-muted-foreground">
//                                    <span className="text-base">ℹ️</span>
//                                    <p>
//                                        This announcement will be visible only to <span className="font-medium text-primary">Professional users</span>.
//                                    </p>
//                                </div>

//                                {/* ACTION BUTTON */}
//                                <Button
//                                    onClick={handlePublish}
//                                    className="w-full h-11 rounded-xl font-medium shadow-lg hover:scale-[1.02] transition"
//                                >
//                                    <Send className="h-4 w-4 mr-2" />
//                                    Publish Announcement 🚀
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


//"use client"

//import { useEffect, useMemo, useState } from "react"
//import Swal from "sweetalert2"
//import {
//    LayoutDashboard,
//    Users,
//    BarChart3,
//    Megaphone,
//    Plus,
//    Send,
//    Clock,
//    Trash2,
//    Calendar,
//    CheckCircle2,
//    MessageSquare,
//    StickyNote,
//    Video,
//    RefreshCw,
//    Search,
//    Inbox,
//    BellRing,
//    ShieldCheck,
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"
//import { Textarea } from "@/components/ui/textarea"
//import { Badge } from "@/components/ui/badge"
//import {
//    Dialog,
//    DialogContent,
//    DialogDescription,
//    DialogTitle,
//    DialogTrigger,
//} from "@/components/ui/dialog"

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

//const API_BASE = "https://steadfast-warmth-production-64c8.up.railway.app"

//function getStatusClasses(status: string) {
//    switch ((status || "").toLowerCase()) {
//        case "published":
//        case "active":
//            return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
//        case "draft":
//        case "pending":
//            return "border-amber-500/20 bg-amber-500/10 text-amber-700"
//        case "archived":
//            return "border-slate-500/20 bg-slate-500/10 text-slate-700"
//        default:
//            return "border-blue-500/20 bg-blue-500/10 text-blue-700"
//    }
//}

//function StatCard({
//    label,
//    value,
//    icon: Icon,
//}: {
//    label: string
//    value: string | number
//    icon: React.ComponentType<{ className?: string }>
//}) {
//    return (
//        <div className="rounded-2xl border bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-4">
//            <div className="mb-2 flex items-center justify-between">
//                <p className="text-sm text-muted-foreground">{label}</p>
//                <Icon className="h-4 w-4 text-blue-600" />
//            </div>
//            <p className="text-2xl font-bold">{value}</p>
//        </div>
//    )
//}

//export default function AdminAnnouncementsPage() {
//    const [announcements, setAnnouncements] = useState<Announcement[]>([])
//    const [dialogOpen, setDialogOpen] = useState(false)
//    const [loading, setLoading] = useState(true)
//    const [refreshing, setRefreshing] = useState(false)
//    const [publishing, setPublishing] = useState(false)
//    const [search, setSearch] = useState("")
//    const [statusFilter, setStatusFilter] = useState("all")

//    const [newAnnouncement, setNewAnnouncement] = useState({
//        title: "",
//        content: "",
//    })

//    useEffect(() => {
//        fetchAnnouncements()
//    }, [])

//    function resetForm() {
//        setNewAnnouncement({
//            title: "",
//            content: "",
//        })
//    }

//    async function fetchAnnouncements(isRefresh = false) {
//        try {
//            if (isRefresh) {
//                setRefreshing(true)
//            } else {
//                setLoading(true)
//            }

//            const token = localStorage.getItem("token")

//            const res = await fetch(`${API_BASE}/api/Announcement`, {
//                headers: {
//                    Authorization: `Bearer ${token}`,
//                },
//            })

//            if (!res.ok) {
//                setAnnouncements([])
//                return
//            }

//            const data = await res.json()

//            const filtered = data
//                .filter((a: Announcement) => a.audience?.toLowerCase() === "professional")
//                .sort(
//                    (a: Announcement, b: Announcement) =>
//                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//                )

//            setAnnouncements(filtered)
//        } catch (err) {
//            console.error(err)
//            setAnnouncements([])
//        } finally {
//            setLoading(false)
//            setRefreshing(false)
//        }
//    }

//    async function handlePublish() {
//        const title = newAnnouncement.title.trim()
//        const content = newAnnouncement.content.trim()

//        if (title.length < 3) {
//            await Swal.fire({
//                icon: "warning",
//                title: "Invalid title",
//                text: "Title must be at least 3 characters long.",
//                confirmButtonColor: "#2563eb",
//            })
//            return
//        }

//        if (content.length < 10) {
//            await Swal.fire({
//                icon: "warning",
//                title: "Invalid content",
//                text: "Content must be at least 10 characters long.",
//                confirmButtonColor: "#2563eb",
//            })
//            return
//        }

//        setPublishing(true)

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(`${API_BASE}/api/Announcement/create`, {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`,
//                },
//                body: JSON.stringify({
//                    title,
//                    content,
//                    audience: "Professional",
//                }),
//            })

//            const text = await res.text()
//            let data: any = {}
//            try {
//                data = text ? JSON.parse(text) : {}
//            } catch {
//                data = { message: text }
//            }

//            if (!res.ok) {
//                await Swal.fire({
//                    icon: "error",
//                    title: "Publish failed",
//                    text: data.message || "Failed to create announcement.",
//                    confirmButtonColor: "#2563eb",
//                })
//                return
//            }

//            await fetchAnnouncements(true)
//            resetForm()
//            setDialogOpen(false)

//            await Swal.fire({
//                icon: "success",
//                title: "Published",
//                text: "Announcement published successfully.",
//                confirmButtonColor: "#2563eb",
//            })
//        } catch (err) {
//            console.error(err)
//            await Swal.fire({
//                icon: "error",
//                title: "Something went wrong",
//                text: "Please try again.",
//                confirmButtonColor: "#2563eb",
//            })
//        } finally {
//            setPublishing(false)
//        }
//    }

//    async function handleDelete(id: number) {
//        const result = await Swal.fire({
//            title: "Delete announcement?",
//            text: "This announcement will be removed permanently.",
//            icon: "warning",
//            showCancelButton: true,
//            confirmButtonColor: "#2563eb",
//            cancelButtonColor: "#ef4444",
//            confirmButtonText: "Yes, delete it",
//            cancelButtonText: "Cancel",
//        })

//        if (!result.isConfirmed) return

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(`${API_BASE}/api/Announcement/${id}`, {
//                method: "DELETE",
//                headers: {
//                    Authorization: `Bearer ${token}`,
//                },
//            })

//            if (!res.ok) {
//                throw new Error("Delete failed")
//            }

//            await fetchAnnouncements(true)

//            await Swal.fire({
//                icon: "success",
//                title: "Deleted",
//                text: "Announcement removed successfully.",
//                confirmButtonColor: "#2563eb",
//            })
//        } catch (err) {
//            console.error(err)
//            await Swal.fire({
//                icon: "error",
//                title: "Delete failed",
//                text: "Unable to delete announcement.",
//                confirmButtonColor: "#2563eb",
//            })
//        }
//    }

//    const filteredAnnouncements = useMemo(() => {
//        return announcements.filter((announcement) => {
//            const matchesSearch =
//                announcement.title.toLowerCase().includes(search.toLowerCase()) ||
//                announcement.content.toLowerCase().includes(search.toLowerCase())

//            const matchesStatus =
//                statusFilter === "all" ||
//                announcement.status?.toLowerCase() === statusFilter.toLowerCase()

//            return matchesSearch && matchesStatus
//        })
//    }, [announcements, search, statusFilter])

//    const totalAnnouncements = announcements.length
//    const publishedAnnouncements = announcements.filter((a) =>
//        ["published", "active"].includes((a.status || "").toLowerCase())
//    ).length
//    const latestPublished =
//        announcements.length > 0
//            ? new Date(announcements[0].createdAt).toLocaleDateString()
//            : "N/A"

//    return (
//        <DashboardShell navItems={navItems} role="Admin" title="Announcements">
//            <div className="flex flex-col gap-6">
//                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                    <div>
//                        <h2 className="text-xl font-bold">Announcements</h2>
//                        <p className="text-sm text-muted-foreground">
//                            Create and manage professional announcements with confidence.
//                        </p>
//                    </div>

//                    <div className="flex items-center gap-2">
//                        <Button
//                            variant="outline"
//                            onClick={() => fetchAnnouncements(true)}
//                            disabled={refreshing}
//                        >
//                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
//                            Refresh
//                        </Button>

//                        <Dialog
//                            open={dialogOpen}
//                            onOpenChange={(open) => {
//                                setDialogOpen(open)
//                                if (!open) resetForm()
//                            }}
//                        >
//                            <DialogTrigger asChild>
//                                <Button className="gap-2">
//                                    <Plus className="h-4 w-4" /> New
//                                </Button>
//                            </DialogTrigger>

//                            <DialogContent className="max-w-lg overflow-hidden rounded-2xl p-0">
//                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 text-white">
//                                    <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
//                                        Create Announcement
//                                    </DialogTitle>
//                                    <DialogDescription className="mt-1 text-xs text-blue-100">
//                                        Share important updates with professional users instantly
//                                    </DialogDescription>
//                                </div>

//                                <div className="space-y-5 p-5">
//                                    <div className="space-y-2">
//                                        <Label className="text-sm font-medium">Title</Label>
//                                        <Input
//                                            placeholder="Enter announcement title..."
//                                            value={newAnnouncement.title}
//                                            onChange={(e) =>
//                                                setNewAnnouncement({
//                                                    ...newAnnouncement,
//                                                    title: e.target.value,
//                                                })
//                                            }
//                                            className="rounded-xl"
//                                        />
//                                    </div>

//                                    <div className="space-y-2">
//                                        <Label className="text-sm font-medium">Content</Label>
//                                        <Textarea
//                                            placeholder="Write your announcement..."
//                                            rows={5}
//                                            value={newAnnouncement.content}
//                                            onChange={(e) =>
//                                                setNewAnnouncement({
//                                                    ...newAnnouncement,
//                                                    content: e.target.value,
//                                                })
//                                            }
//                                            className="resize-none rounded-xl"
//                                        />
//                                    </div>

//                                    <div className="flex items-start gap-2 rounded-xl border bg-muted p-3 text-xs text-muted-foreground">
//                                        <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-600" />
//                                        <p>
//                                            This announcement will be visible only to{" "}
//                                            <span className="font-medium text-primary">
//                                                Professional users
//                                            </span>
//                                            .
//                                        </p>
//                                    </div>

//                                    <Button
//                                        onClick={handlePublish}
//                                        disabled={publishing}
//                                        className="h-11 w-full rounded-xl font-medium shadow-lg transition hover:scale-[1.02]"
//                                    >
//                                        <Send className="mr-2 h-4 w-4" />
//                                        {publishing ? "Publishing..." : "Publish Announcement"}
//                                    </Button>
//                                </div>
//                            </DialogContent>
//                        </Dialog>
//                    </div>
//                </div>

//                {/*<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">*/}
//                {/*    <StatCard label="Total" value={totalAnnouncements} icon={Megaphone} />*/}
//                {/*    <StatCard label="Published" value={publishedAnnouncements} icon={BellRing} />*/}
//                {/*    <StatCard label="Audience" value="Professional" icon={Users} />*/}
//                {/*    <StatCard label="Latest Publish" value={latestPublished} icon={Clock} />*/}
//                {/*</div>*/}

//                <div className="grid gap-3 md:grid-cols-[1fr_180px]">
//                    <div className="relative">
//                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                        <Input
//                            placeholder="Search announcements..."
//                            value={search}
//                            onChange={(e) => setSearch(e.target.value)}
//                            className="pl-10"
//                        />
//                    </div>

//                    <select
//                        value={statusFilter}
//                        onChange={(e) => setStatusFilter(e.target.value)}
//                        className="h-10 rounded-md border bg-background px-3 text-sm"
//                    >
//                        <option value="all">All Status</option>
//                        <option value="Published">Published</option>
//                        <option value="Active">Active</option>
//                        <option value="Draft">Draft</option>
//                        <option value="Pending">Pending</option>
//                        <option value="Archived">Archived</option>
//                    </select>
//                </div>

//                {loading ? (
//                    <div className="rounded-2xl border p-8 text-center text-sm text-muted-foreground">
//                        Loading announcements...
//                    </div>
//                ) : filteredAnnouncements.length === 0 ? (
//                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-14 text-center">
//                        <Inbox className="h-10 w-10 text-muted-foreground" />
//                        <div>
//                            <p className="font-medium">
//                                {announcements.length === 0
//                                    ? "No announcements yet"
//                                    : "No matching announcements"}
//                            </p>
//                            <p className="text-sm text-muted-foreground">
//                                {announcements.length === 0
//                                    ? "Create your first professional announcement."
//                                    : "Try a different search or filter."}
//                            </p>
//                        </div>

//                        {announcements.length === 0 && (
//                            <Button onClick={() => setDialogOpen(true)}>Create Announcement</Button>
//                        )}
//                    </div>
//                ) : (
//                    <div className="flex flex-col gap-4">
//                        {filteredAnnouncements.map((announcement) => (
//                            <div
//                                key={announcement.id}
//                                className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md"
//                            >
//                                <div className="flex items-start justify-between gap-4">
//                                    <div className="min-w-0 flex-1">
//                                        <div className="flex flex-wrap items-center gap-2">
//                                            <h3 className="font-semibold">{announcement.title}</h3>
//                                            <Badge className={getStatusClasses(announcement.status)}>
//                                                {announcement.status}
//                                            </Badge>
//                                            <Badge variant="outline">{announcement.audience}</Badge>
//                                        </div>

//                                        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
//                                            {announcement.content}
//                                        </p>

//                                        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
//                                            <Clock className="h-3 w-3" />
//                                            {new Date(announcement.createdAt).toLocaleString()}
//                                        </div>
//                                    </div>

//                                    <Button
//                                        variant="ghost"
//                                        size="icon"
//                                        onClick={() => handleDelete(announcement.id)}
//                                    >
//                                        <Trash2 className="h-4 w-4" />
//                                    </Button>
//                                </div>
//                            </div>
//                        ))}
//                    </div>
//                )}
//            </div>
//        </DashboardShell>
//    )
//}














"use client"

import { useEffect, useMemo, useState, type ComponentType } from "react"
import Swal from "sweetalert2"
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Megaphone,
    Plus,
    Send,
    Clock,
    Trash2,
    Calendar,
    CheckCircle2,
    MessageSquare,
    StickyNote,
    Video,
    RefreshCw,
    Search,
    Inbox,
    ShieldCheck,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

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

interface AudienceUser {
    id: string
    fullName?: string
    name?: string
    role?: string
}

const API_BASE = "https://steadfast-warmth-production-64c8.up.railway.app"

function getStatusClasses(status: string) {
    switch ((status || "").toLowerCase()) {
        case "published":
        case "active":
            return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
        case "draft":
        case "pending":
            return "border-amber-500/20 bg-amber-500/10 text-amber-700"
        case "archived":
            return "border-slate-500/20 bg-slate-500/10 text-slate-700"
        default:
            return "border-blue-500/20 bg-blue-500/10 text-blue-700"
    }
}

function StatCard({
    label,
    value,
    icon: Icon,
}: {
    label: string
    value: string | number
    icon: ComponentType<{ className?: string }>
}) {
    return (
        <div className="rounded-2xl border bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-4">
            <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <Icon className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    )
}

export default function AdminAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [publishing, setPublishing] = useState(false)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: "",
    })

    useEffect(() => {
        void fetchAnnouncements()
    }, [])

    function resetForm() {
        setNewAnnouncement({
            title: "",
            content: "",
        })
    }

    async function fetchAnnouncements(isRefresh = false) {
        try {
            if (isRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            const token = localStorage.getItem("token")

            const res = await fetch(`${API_BASE}/api/Announcement`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                setAnnouncements([])
                return
            }

            const data = await res.json()

            const filtered = data
                .filter((a: Announcement) => a.audience?.toLowerCase() === "professional")
                .sort(
                    (a: Announcement, b: Announcement) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )

            setAnnouncements(filtered)
        } catch (err) {
            console.error(err)
            setAnnouncements([])
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    async function fetchAnnouncementRecipients() {
        const token = localStorage.getItem("token")
        const currentUserId = localStorage.getItem("userId") || ""

        const responses = await Promise.allSettled([
            fetch(`${API_BASE}/api/hr/employees`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE}/api/meeting/users`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
        ])

        const users: AudienceUser[] = []

        for (const response of responses) {
            if (response.status !== "fulfilled") continue
            if (!response.value.ok) continue

            try {
                const data = await response.value.json()
                if (Array.isArray(data)) {
                    users.push(...data)
                }
            } catch (error) {
                console.error("Recipient parse error:", error)
            }
        }

        return Array.from(
            new Map(
                users
                    .filter((user) => {
                        if (!user?.id || user.id === currentUserId) return false
                        return (user.role || "").toLowerCase() !== "hr"
                    })
                    .map((user) => [user.id, user])
            ).values()
        )
    }

    async function sendAnnouncementNotifications(title: string) {
        const recipients = await fetchAnnouncementRecipients()
        const fromUserId = localStorage.getItem("userId") || ""
        const fromUserName = localStorage.getItem("name") || "HR"
        const token = localStorage.getItem("token")

        await Promise.all(
            recipients.map((recipient) =>
                fetch(`${API_BASE}/api/notifications`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        fromUserId,
                        fromUserName,
                        toUserId: recipient.id,
                        content: `${fromUserName} shared an announcement: ${title}`,
                        type: "announcement",
                        status: "info",
                        isRead: false,
                        title,
                        createdAt: new Date().toISOString(),
                    }),
                })
            )
        ).catch((error) => {
            console.error("Announcement notifications failed:", error)
        })
    }

    async function handlePublish() {
        const title = newAnnouncement.title.trim()
        const content = newAnnouncement.content.trim()

        if (title.length < 3) {
            await Swal.fire({
                icon: "warning",
                title: "Invalid title",
                text: "Title must be at least 3 characters long.",
                confirmButtonColor: "#2563eb",
            })
            return
        }

        if (content.length < 10) {
            await Swal.fire({
                icon: "warning",
                title: "Invalid content",
                text: "Content must be at least 10 characters long.",
                confirmButtonColor: "#2563eb",
            })
            return
        }

        setPublishing(true)

        try {
            const token = localStorage.getItem("token")

            const res = await fetch(`${API_BASE}/api/Announcement/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    content,
                    audience: "Professional",
                }),
            })

            const text = await res.text()
            let data: any = {}

            try {
                data = text ? JSON.parse(text) : {}
            } catch {
                data = { message: text }
            }

            if (!res.ok) {
                await Swal.fire({
                    icon: "error",
                    title: "Publish failed",
                    text: data.message || "Failed to create announcement.",
                    confirmButtonColor: "#2563eb",
                })
                return
            }

            await sendAnnouncementNotifications(title)
            await fetchAnnouncements(true)
            resetForm()
            setDialogOpen(false)

            await Swal.fire({
                icon: "success",
                title: "Published",
                text: "Announcement published successfully.",
                confirmButtonColor: "#2563eb",
            })
        } catch (err) {
            console.error(err)
            await Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: "Please try again.",
                confirmButtonColor: "#2563eb",
            })
        } finally {
            setPublishing(false)
        }
    }

    async function handleDelete(id: number) {
        const result = await Swal.fire({
            title: "Delete announcement?",
            text: "This announcement will be removed permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
        })

        if (!result.isConfirmed) return

        try {
            const token = localStorage.getItem("token")

            const res = await fetch(`${API_BASE}/api/Announcement/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                throw new Error("Delete failed")
            }

            await fetchAnnouncements(true)

            await Swal.fire({
                icon: "success",
                title: "Deleted",
                text: "Announcement removed successfully.",
                confirmButtonColor: "#2563eb",
            })
        } catch (err) {
            console.error(err)
            await Swal.fire({
                icon: "error",
                title: "Delete failed",
                text: "Unable to delete announcement.",
                confirmButtonColor: "#2563eb",
            })
        }
    }

    const filteredAnnouncements = useMemo(() => {
        return announcements.filter((announcement) => {
            const matchesSearch =
                announcement.title.toLowerCase().includes(search.toLowerCase()) ||
                announcement.content.toLowerCase().includes(search.toLowerCase())

            const matchesStatus =
                statusFilter === "all" ||
                announcement.status?.toLowerCase() === statusFilter.toLowerCase()

            return matchesSearch && matchesStatus
        })
    }, [announcements, search, statusFilter])

    const totalAnnouncements = announcements.length
    const publishedAnnouncements = announcements.filter((a) =>
        ["published", "active"].includes((a.status || "").toLowerCase())
    ).length
    const latestPublished =
        announcements.length > 0
            ? new Date(announcements[0].createdAt).toLocaleDateString()
            : "N/A"

    return (
        <DashboardShell navItems={navItems} role="Admin" title="Announcements">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Announcements</h2>
                        <p className="text-sm text-muted-foreground">
                            Create and manage professional announcements with confidence.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => void fetchAnnouncements(true)}
                            disabled={refreshing}
                        >
                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
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
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" /> New
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-lg overflow-hidden rounded-2xl p-0">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 text-white">
                                    <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
                                        Create Announcement
                                    </DialogTitle>
                                    <DialogDescription className="mt-1 text-xs text-blue-100">
                                        Share important updates with professional users instantly
                                    </DialogDescription>
                                </div>

                                <div className="space-y-5 p-5">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Title</Label>
                                        <Input
                                            placeholder="Enter announcement title..."
                                            value={newAnnouncement.title}
                                            onChange={(e) =>
                                                setNewAnnouncement({
                                                    ...newAnnouncement,
                                                    title: e.target.value,
                                                })
                                            }
                                            className="rounded-xl"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Content</Label>
                                        <Textarea
                                            placeholder="Write your announcement..."
                                            rows={5}
                                            value={newAnnouncement.content}
                                            onChange={(e) =>
                                                setNewAnnouncement({
                                                    ...newAnnouncement,
                                                    content: e.target.value,
                                                })
                                            }
                                            className="resize-none rounded-xl"
                                        />
                                    </div>

                                    <div className="flex items-start gap-2 rounded-xl border bg-muted p-3 text-xs text-muted-foreground">
                                        <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-600" />
                                        <p>
                                            This announcement will be visible to users and will also
                                            appear in their notification panel.
                                        </p>
                                    </div>

                                    <Button
                                        onClick={() => void handlePublish()}
                                        disabled={publishing}
                                        className="h-11 w-full rounded-xl font-medium shadow-lg transition hover:scale-[1.02]"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        {publishing ? "Publishing..." : "Publish Announcement"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total" value={totalAnnouncements} icon={Megaphone} />
                    <StatCard label="Published" value={publishedAnnouncements} icon={Megaphone} />
                    <StatCard label="Audience" value="Professional" icon={Users} />
                    <StatCard label="Latest Publish" value={latestPublished} icon={Clock} />
                </div>

                <div className="grid gap-3 md:grid-cols-[1fr_180px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search announcements..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 rounded-md border bg-background px-3 text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="Published">Published</option>
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Pending">Pending</option>
                        <option value="Archived">Archived</option>
                    </select>
                </div>

                {loading ? (
                    <div className="rounded-2xl border p-8 text-center text-sm text-muted-foreground">
                        Loading announcements...
                    </div>
                ) : filteredAnnouncements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-14 text-center">
                        <Inbox className="h-10 w-10 text-muted-foreground" />
                        <div>
                            <p className="font-medium">
                                {announcements.length === 0
                                    ? "No announcements yet"
                                    : "No matching announcements"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {announcements.length === 0
                                    ? "Create your first professional announcement."
                                    : "Try a different search or filter."}
                            </p>
                        </div>

                        {announcements.length === 0 && (
                            <Button onClick={() => setDialogOpen(true)}>Create Announcement</Button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredAnnouncements.map((announcement) => (
                            <div
                                key={announcement.id}
                                className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold">{announcement.title}</h3>
                                            <Badge className={getStatusClasses(announcement.status)}>
                                                {announcement.status}
                                            </Badge>
                                            <Badge variant="outline">{announcement.audience}</Badge>
                                        </div>

                                        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                                            {announcement.content}
                                        </p>

                                        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {new Date(announcement.createdAt).toLocaleString()}
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => void handleDelete(announcement.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardShell>
    )
}
