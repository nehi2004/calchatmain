"use client"

import {
    LayoutDashboard, Calendar, MessageSquare, Video, CalendarDays, Users, StickyNote, BarChart3, CheckCircle2, Megaphone
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { NotesView } from "@/components/dashboard/notes-view"

const navItems = [
  { label: "Dashboard", href: "/dashboard/professional", icon: LayoutDashboard },
  { label: "Calendar", href: "/dashboard/professional/calendar", icon: Calendar },
  { label: "AI Chat", href: "/dashboard/professional/chat", icon: MessageSquare },
  { label: "Meetings", href: "/dashboard/professional/meetings", icon: Video },
    { label: "Tasks", href: "/dashboard/professional/tasks", icon: CheckCircle2 },
  //{ label: "Team", href: "/dashboard/professional/team", icon: Users },
    { label: "Notes", href: "/dashboard/professional/notes", icon: StickyNote },
    { label: "Announcements", href: "/dashboard/professional/announcements", icon: Megaphone },
  { label: "Analytics", href: "/dashboard/professional/analytics", icon: BarChart3 },
]

export default function ProfessionalNotesPage() {
  return (
    <DashboardShell navItems={navItems} role="Professional" title="Notes">
      <NotesView />
    </DashboardShell>
  )
}
