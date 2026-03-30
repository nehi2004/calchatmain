"use client"

import {
  LayoutDashboard, Calendar, MessageSquare, CheckCircle2, Focus, BarChart3,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { FocusView } from "@/components/dashboard/focus-view"

const navItems = [
  { label: "Dashboard", href: "/dashboard/personal", icon: LayoutDashboard },
  { label: "Calendar", href: "/dashboard/personal/calendar", icon: Calendar },
  { label: "AI Chat", href: "/dashboard/personal/chat", icon: MessageSquare },
  { label: "Tasks", href: "/dashboard/personal/tasks", icon: CheckCircle2 },
  { label: "Focus Mode", href: "/dashboard/personal/focus", icon: Focus },
  { label: "Analytics", href: "/dashboard/personal/analytics", icon: BarChart3 },
]

export default function PersonalFocusPage() {
  return (
    <DashboardShell navItems={navItems} role="Personal" title="Focus Mode">
      <FocusView />
    </DashboardShell>
  )
}
