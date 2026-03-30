"use client"

import {
    LayoutDashboard, Users, Shield, Briefcase, BarChart3, Megaphone,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import AdminAnalyticsView from "@/components/dashboard/admin-analytics-view"

const navItems = [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
    //{ label: "Access Control", href: "/dashboard/admin/access", icon: Briefcase },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
    //{ label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
]

export default function AdminAnalyticsPage() {
    return (
        <DashboardShell navItems={navItems} role="Admin" title="Analytics">
            <AdminAnalyticsView />
        </DashboardShell>
    )
}