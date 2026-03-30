"use client"

import {
    LayoutDashboard, Calendar, MessageSquare, Video, CalendarDays, Users, StickyNote, BarChart3, Megaphone,
    Briefcase, Clock, TrendingUp, CheckCircle2,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { TeamView } from "@/components/dashboard/team-view"
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

export default function HrTeamPage() {
    return (
        <DashboardShell navItems={navItems} role="Hr" title="Team">
            <TeamView />
        </DashboardShell>
    )
}
