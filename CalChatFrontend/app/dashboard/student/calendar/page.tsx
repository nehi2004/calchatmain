"use client"

import {
  LayoutDashboard, Calendar, MessageSquare, CheckCircle2, Focus, CalendarDays, Users, BarChart3,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CalendarView } from "@/components/dashboard/calendar-view"

const navItems = [
  { label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
  { label: "Calendar", href: "/dashboard/student/calendar", icon: Calendar },
  { label: "AI Chat", href: "/dashboard/student/chat", icon: MessageSquare },
  { label: "Tasks", href: "/dashboard/student/tasks", icon: CheckCircle2 },
  { label: "Focus Mode", href: "/dashboard/student/focus", icon: Focus },
  { label: "Events", href: "/dashboard/student/events", icon: CalendarDays },
  { label: "Group Study", href: "/dashboard/student/group", icon: Users },
  { label: "Analytics", href: "/dashboard/student/analytics", icon: BarChart3 },
]

export default function StudentCalendarPage() {
  return (
    <DashboardShell navItems={navItems} role="Student" title="Calendar">
      <CalendarView />
    </DashboardShell>
  )
}
