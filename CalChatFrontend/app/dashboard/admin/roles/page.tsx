

"use client"

import { useEffect, useState } from "react"
import {
    LayoutDashboard, Users, Shield, Briefcase, BarChart3, Megaphone,
    GraduationCap, User, CheckCircle2, X
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Switch } from "@/components/ui/switch"

/* ================= NAV ================= */

const navItems = [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
    //{ label: "Access Control", href: "/dashboard/admin/access", icon: Briefcase },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
    //{ label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
]

/* ================= ROLE ICON ================= */

const ROLE_ICONS: any = {
    Student: GraduationCap,
    Personal: User,
    Professional: Briefcase,
    Admin: Shield,
    HR: Users,
}

/* ================= ALL FEATURES (MASTER LIST) ================= */

const ALL_FEATURES = [
    "Calendar",
    "AI Chat",
    "Tasks",
    "Focus Mode",
    "Group Study",
    "Events",
    "Meetings",
    "Team",
    "Team Management",
    "Employees",
    "Notes",
    "Announcements",
    "Analytics",
    "Admin Panel"
]

export default function AdminRolesPage() {

    const [roles, setRoles] = useState<any>({
        Student: ALL_FEATURES.map(f => ({ name: f, enabled: true })),
        Personal: ALL_FEATURES.map(f => ({ name: f, enabled: false })),
        Professional: ALL_FEATURES.map(f => ({ name: f, enabled: true })),
        Admin: ALL_FEATURES.map(f => ({ name: f, enabled: true })),
        HR: ALL_FEATURES.map(f => ({ name: f, enabled: false })),
    })

    //useEffect(() => {
    //    fetchPermissions()
    //}, [])


    useEffect(() => {
        const savedRoles = localStorage.getItem("roles")

        if (savedRoles) {
            setRoles(JSON.parse(savedRoles))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("roles", JSON.stringify(roles))
    }, [roles])

    /* ================= FETCH ================= */

    async function fetchPermissions() {
        try {
            const token = localStorage.getItem("token")

            console.log("TOKEN:", token)

            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/RolePermission", {
                headers: { Authorization: `Bearer ${token}` }
            })

            console.log("STATUS:", res.status)

            if (!res.ok) {
                console.error("API FAILED")
                return
            }

            const data = await res.json()

            console.log("DATA:", data)

            if (!data || data.length === 0) {
                console.warn("No role permissions found")
            }

            const grouped: any = {}

            data.forEach((item: any) => {
                if (!grouped[item.role]) {
                    grouped[item.role] = {}
                }
                grouped[item.role][item.feature] = item.isEnabled
            })

            const finalRoles: any = {}

            Object.keys(grouped).forEach(role => {
                finalRoles[role] = ALL_FEATURES.map(feature => ({
                    name: feature,
                    enabled: grouped[role][feature] ?? false
                }))
            })

            setRoles(finalRoles)

        } catch (err) {
            console.error("FETCH ERROR:", err)
        }
    }
    /* ================= TOGGLE ================= */

    async function togglePermission(role: string, feature: string, value: boolean) {

        const token = localStorage.getItem("token")

        //await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/RolePermission", {
        //    method: "PUT",
        //    headers: {
        //        "Content-Type": "application/json",
        //        Authorization: `Bearer ${token}`
        //    },
        //    body: JSON.stringify({
        //        role,
        //        feature,
        //        isEnabled: value
        //    })
        //})

        // UI update
        setRoles((prev: any) => ({
            ...prev,
            [role]: prev[role].map((p: any) =>
                p.name === feature ? { ...p, enabled: value } : p
            )
        }))
    }

    /* ================= UI ================= */

    return (
        <DashboardShell navItems={navItems} role="Admin" title="Role Management">

            <div className="flex flex-col gap-6">

                <div>
                    <h2 className="text-xl font-bold">Role Management</h2>
                    <p className="text-sm text-muted-foreground">
                        Control feature access for each role
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">

                    {Object.keys(roles).map((role) => {

                        const Icon = ROLE_ICONS[role] || Shield

                        return (
                            <div key={role} className="rounded-xl border p-6 bg-card">

                                {/* HEADER */}
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-semibold">{role}</h3>
                                </div>

                                {/* PERMISSIONS */}
                                <div className="mt-5 flex flex-col gap-3">

                                    {roles[role].map((perm: any) => (

                                        <div
                                            key={perm.name}
                                            className="flex items-center justify-between p-3 rounded-lg bg-muted/40"
                                        >
                                            <span className="text-sm">{perm.name}</span>

                                            <div className="flex items-center gap-2">

                                                {perm.enabled ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <X className="h-4 w-4 text-gray-400" />
                                                )}

                                                <Switch
                                                    checked={perm.enabled}
                                                    onCheckedChange={(val) =>
                                                        togglePermission(role, perm.name, val)
                                                    }
                                                />

                                            </div>
                                        </div>

                                    ))}

                                </div>

                            </div>
                        )
                    })}

                </div>

            </div>

        </DashboardShell>
    )
}