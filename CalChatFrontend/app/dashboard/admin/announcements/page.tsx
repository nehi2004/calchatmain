"use client"

import { useState } from "react"
import {
  LayoutDashboard, Users, Shield, Briefcase, BarChart3, Megaphone,
  Plus, Send, Clock, Trash2,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const navItems = [
  { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
  { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
  { label: "Access Control", href: "/dashboard/admin/access", icon: Briefcase },
  { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
  { label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
]

interface Announcement {
  id: string
  title: string
  content: string
  audience: string
  date: string
  status: string
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: "1", title: "System Maintenance Scheduled", content: "CalChat+ will undergo scheduled maintenance on Feb 15, 2026 from 2:00 AM to 4:00 AM UTC. During this time, the platform may be temporarily unavailable.", audience: "All Users", date: "Feb 9, 2026", status: "Published" },
  { id: "2", title: "New AI Chat Features Released", content: "We've added several new capabilities to the AI Chat assistant including calendar integration, smart task creation, and productivity insights.", audience: "All Users", date: "Feb 7, 2026", status: "Published" },
  { id: "3", title: "Professional Plan Updates", content: "New features for professional users: Advanced team analytics, custom report builder, and meeting recording integration.", audience: "Professional", date: "Feb 5, 2026", status: "Published" },
  { id: "4", title: "Student Exam Season Resources", content: "Special focus mode presets and study planning tools are now available for the upcoming exam season.", audience: "Student", date: "Feb 3, 2026", status: "Draft" },
  { id: "5", title: "Security Update", content: "We've enhanced our security measures with two-factor authentication support and improved session management.", audience: "All Users", date: "Jan 30, 2026", status: "Published" },
]

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "", content: "", audience: "All Users",
  })

  function handlePublish() {
    if (!newAnnouncement.title || !newAnnouncement.content) return
    const announcement: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      audience: newAnnouncement.audience,
      date: "Just now",
      status: "Published",
    }
    setAnnouncements([announcement, ...announcements])
    setNewAnnouncement({ title: "", content: "", audience: "All Users" })
    setDialogOpen(false)
  }

  function handleDelete(id: string) {
    setAnnouncements(announcements.filter((a) => a.id !== id))
  }

  return (
    <DashboardShell navItems={navItems} role="Admin" title="Announcements">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">Announcements</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create and manage platform announcements</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex flex-col gap-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Announcement title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Content</Label>
                  <Textarea
                    placeholder="Write your announcement..."
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Target Audience</Label>
                  <Select value={newAnnouncement.audience} onValueChange={(v) => setNewAnnouncement({ ...newAnnouncement, audience: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Users">All Users</SelectItem>
                      <SelectItem value="Student">Students Only</SelectItem>
                      <SelectItem value="Personal">Personal Users Only</SelectItem>
                      <SelectItem value="Professional">Professionals Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handlePublish} className="gap-2">
                  <Send className="h-4 w-4" /> Publish
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col gap-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-heading text-base font-semibold text-card-foreground">{announcement.title}</h3>
                    <Badge variant={announcement.status === "Published" ? "default" : "secondary"}>{announcement.status}</Badge>
                    <Badge variant="outline" className="bg-transparent">{announcement.audience}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{announcement.content}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {announcement.date}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(announcement.id)}
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
