

//"use client"

//import { useEffect, useState } from "react"
//import {
//    LayoutDashboard, Users, Shield, Briefcase, BarChart3, Megaphone,
//    GraduationCap, User, CheckCircle2, X
//} from "lucide-react"

//import { DashboardShell } from "@/components/dashboard/dashboard-shell"
//import { Switch } from "@/components/ui/switch"

///* ================= NAV ================= */

//const navItems = [
//    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
//    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
//    { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
//    //{ label: "Access Control", href: "/dashboard/admin/access", icon: Briefcase },
//    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
//    //{ label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
//]

///* ================= ROLE ICON ================= */

//const ROLE_ICONS: any = {
//    Student: GraduationCap,
//    Personal: User,
//    Professional: Briefcase,
//    Admin: Shield,
//    HR: Users,
//}

///* ================= ALL FEATURES (MASTER LIST) ================= */

//const ALL_FEATURES = [
//    "Calendar",
//    "AI Chat",
//    "Tasks",
//    "Focus Mode",
//    "Group Study",
//    "Events",
//    "Meetings",
//    "Team",
//    "Team Management",
//    "Employees",
//    "Notes",
//    "Announcements",
//    "Analytics",
//    "Admin Panel"
//]

//export default function AdminRolesPage() {

//    const [roles, setRoles] = useState<any>({
//        Student: ALL_FEATURES.map(f => ({ name: f, enabled: true })),
//        Personal: ALL_FEATURES.map(f => ({ name: f, enabled: false })),
//        Professional: ALL_FEATURES.map(f => ({ name: f, enabled: true })),
//        Admin: ALL_FEATURES.map(f => ({ name: f, enabled: true })),
//        HR: ALL_FEATURES.map(f => ({ name: f, enabled: false })),
//    })

//    //useEffect(() => {
//    //    fetchPermissions()
//    //}, [])


//    useEffect(() => {
//        const savedRoles = localStorage.getItem("roles")

//        if (savedRoles) {
//            setRoles(JSON.parse(savedRoles))
//        }
//    }, [])

//    useEffect(() => {
//        localStorage.setItem("roles", JSON.stringify(roles))
//    }, [roles])

//    /* ================= FETCH ================= */

//    async function fetchPermissions() {
//        try {
//            const token = localStorage.getItem("token")

//            console.log("TOKEN:", token)

//            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/RolePermission", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            console.log("STATUS:", res.status)

//            if (!res.ok) {
//                console.error("API FAILED")
//                return
//            }

//            const data = await res.json()

//            console.log("DATA:", data)

//            if (!data || data.length === 0) {
//                console.warn("No role permissions found")
//            }

//            const grouped: any = {}

//            data.forEach((item: any) => {
//                if (!grouped[item.role]) {
//                    grouped[item.role] = {}
//                }
//                grouped[item.role][item.feature] = item.isEnabled
//            })

//            const finalRoles: any = {}

//            Object.keys(grouped).forEach(role => {
//                finalRoles[role] = ALL_FEATURES.map(feature => ({
//                    name: feature,
//                    enabled: grouped[role][feature] ?? false
//                }))
//            })

//            setRoles(finalRoles)

//        } catch (err) {
//            console.error("FETCH ERROR:", err)
//        }
//    }
//    /* ================= TOGGLE ================= */

//    async function togglePermission(role: string, feature: string, value: boolean) {

//        const token = localStorage.getItem("token")

//        //await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/RolePermission", {
//        //    method: "PUT",
//        //    headers: {
//        //        "Content-Type": "application/json",
//        //        Authorization: `Bearer ${token}`
//        //    },
//        //    body: JSON.stringify({
//        //        role,
//        //        feature,
//        //        isEnabled: value
//        //    })
//        //})

//        // UI update
//        setRoles((prev: any) => ({
//            ...prev,
//            [role]: prev[role].map((p: any) =>
//                p.name === feature ? { ...p, enabled: value } : p
//            )
//        }))
//    }

//    /* ================= UI ================= */

//    return (
//        <DashboardShell navItems={navItems} role="Admin" title="Role Management">

//            <div className="flex flex-col gap-6">

//                <div>
//                    <h2 className="text-xl font-bold">Role Management</h2>
//                    <p className="text-sm text-muted-foreground">
//                        Control feature access for each role
//                    </p>
//                </div>

//                <div className="grid gap-6 lg:grid-cols-2">

//                    {Object.keys(roles).map((role) => {

//                        const Icon = ROLE_ICONS[role] || Shield

//                        return (
//                            <div key={role} className="rounded-xl border p-6 bg-card">

//                                {/* HEADER */}
//                                <div className="flex items-center gap-3">
//                                    <div className="p-2 bg-primary/10 rounded-lg">
//                                        <Icon className="h-5 w-5 text-primary" />
//                                    </div>
//                                    <h3 className="font-semibold">{role}</h3>
//                                </div>

//                                {/* PERMISSIONS */}
//                                <div className="mt-5 flex flex-col gap-3">

//                                    {roles[role].map((perm: any) => (

//                                        <div
//                                            key={perm.name}
//                                            className="flex items-center justify-between p-3 rounded-lg bg-muted/40"
//                                        >
//                                            <span className="text-sm">{perm.name}</span>

//                                            <div className="flex items-center gap-2">

//                                                {perm.enabled ? (
//                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
//                                                ) : (
//                                                    <X className="h-4 w-4 text-gray-400" />
//                                                )}

//                                                <Switch
//                                                    checked={perm.enabled}
//                                                    onCheckedChange={(val) =>
//                                                        togglePermission(role, perm.name, val)
//                                                    }
//                                                />

//                                            </div>
//                                        </div>

//                                    ))}

//                                </div>

//                            </div>
//                        )
//                    })}

//                </div>

//            </div>

//        </DashboardShell>
//    )
//}

"use client"

import { useEffect, useMemo, useState } from "react"
import {
    LayoutDashboard,
    Users,
    Shield,
    Briefcase,
    BarChart3,
    GraduationCap,
    User,
    CheckCircle2,
    X,
    RefreshCw,
    Search,
    RotateCcw,
} from "lucide-react"
import Swal from "sweetalert2"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const navItems = [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
]

const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/RolePermission"

const ROLE_ICONS: Record<string, any> = {
    Student: GraduationCap,
    Personal: User,
    Professional: Briefcase,
    Admin: Shield,
    HR: Users,
}

const DEFAULT_ROLES = ["Student", "Personal", "Professional", "Admin", "HR"]

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
    "Admin Panel",
]

type RolePermissionItem = {
    name: string
    enabled: boolean
}

type RolesState = Record<string, RolePermissionItem[]>

type RolePermissionDto = {
    role: string
    feature: string
    isEnabled: boolean
}

function buildDefaultRoles(): RolesState {
    return DEFAULT_ROLES.reduce((acc, role) => {
        acc[role] = ALL_FEATURES.map((feature) => ({
            name: feature,
            enabled: role === "Admin" || role === "Professional" || role === "Student",
        }))
        return acc
    }, {} as RolesState)
}

function mergeApiDataWithDefaults(data: any[]): RolesState {
    const base = buildDefaultRoles()

    data.forEach((item) => {
        if (!base[item.role]) {
            base[item.role] = ALL_FEATURES.map((feature) => ({
                name: feature,
                enabled: false,
            }))
        }

        const existing = base[item.role].find((p) => p.name === item.feature)
        if (existing) {
            existing.enabled = item.isEnabled
        } else {
            base[item.role].push({
                name: item.feature,
                enabled: item.isEnabled,
            })
        }
    })

    Object.keys(base).forEach((role) => {
        base[role] = [...base[role]].sort((a, b) => a.name.localeCompare(b.name))
    })

    return base
}

export default function AdminRolesPage() {
    const [roles, setRoles] = useState<RolesState>(buildDefaultRoles())
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [savingKey, setSavingKey] = useState("")
    const [error, setError] = useState("")
    const [featureSearch, setFeatureSearch] = useState("")

    useEffect(() => {
        fetchPermissions()
    }, [])

    function getHeaders() {
        const token = localStorage.getItem("token")
        return {
            Authorization: `Bearer ${token}`,
        }
    }

    async function fetchPermissions(isRefresh = false) {
        try {
            if (isRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            setError("")

            const res = await fetch(API_URL, {
                headers: getHeaders(),
            })

            if (!res.ok) {
                throw new Error("Failed to fetch permissions")
            }

            const data = await res.json()
            const finalRoles = mergeApiDataWithDefaults(Array.isArray(data) ? data : [])
            setRoles(finalRoles)
        } catch (err) {
            console.error("FETCH ERROR:", err)
            setError("Unable to load role permissions right now.")
            setRoles(buildDefaultRoles())
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    async function togglePermission(role: string, feature: string, value: boolean) {
        const previous = roles
        const savingId = `${role}-${feature}`

        setSavingKey(savingId)
        setRoles((prev) => ({
            ...prev,
            [role]: prev[role].map((p) =>
                p.name === feature ? { ...p, enabled: value } : p
            ),
        }))

        try {
            const payload: RolePermissionDto = {
                role,
                feature,
                isEnabled: value,
            }

            const res = await fetch(API_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...getHeaders(),
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                throw new Error("Failed to save permission")
            }
        } catch (err) {
            console.error("SAVE ERROR:", err)
            setRoles(previous)
            Swal.fire("Error", "Permission update failed", "error")
        } finally {
            setSavingKey("")
        }
    }

    async function resetRole(role: string) {
        const result = await Swal.fire({
            title: `Reset ${role} permissions?`,
            text: "This will turn off all features for this role.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Reset",
        })

        if (!result.isConfirmed) return

        const updated = roles[role].map((item) => ({
            ...item,
            enabled: false,
        }))

        setRoles((prev) => ({
            ...prev,
            [role]: updated,
        }))

        try {
            await Promise.all(
                updated.map((item) =>
                    fetch(API_URL, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            ...getHeaders(),
                        },
                        body: JSON.stringify({
                            role,
                            feature: item.name,
                            isEnabled: false,
                        }),
                    })
                )
            )

            Swal.fire("Reset", `${role} permissions updated`, "success")
        } catch {
            Swal.fire("Error", "Failed to reset role permissions", "error")
            fetchPermissions(true)
        }
    }

    async function resetAllRoles() {
        const result = await Swal.fire({
            title: "Reset all permissions?",
            text: "This will turn off all features for all roles.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Reset All",
        })

        if (!result.isConfirmed) return

        try {
            const updates: Promise<Response>[] = []

            Object.keys(roles).forEach((role) => {
                roles[role].forEach((item) => {
                    updates.push(
                        fetch(API_URL, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                ...getHeaders(),
                            },
                            body: JSON.stringify({
                                role,
                                feature: item.name,
                                isEnabled: false,
                            }),
                        })
                    )
                })
            })

            await Promise.all(updates)
            await fetchPermissions(true)

            Swal.fire("Reset", "All role permissions updated", "success")
        } catch {
            Swal.fire("Error", "Failed to reset all permissions", "error")
        }
    }

    const filteredRoles = useMemo(() => {
        const query = featureSearch.toLowerCase().trim()

        if (!query) return roles

        const next: RolesState = {}
        Object.keys(roles).forEach((role) => {
            next[role] = roles[role].filter((perm) =>
                perm.name.toLowerCase().includes(query)
            )
        })

        return next
    }, [roles, featureSearch])

    const totalEnabled = Object.values(roles)
        .flat()
        .filter((p) => p.enabled).length

    const totalPermissions = Object.values(roles).flat().length

    return (
        <DashboardShell navItems={navItems} role="Admin" title="Role Management">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Role Management</h2>
                        <p className="text-sm text-muted-foreground">
                            Control feature access for each role
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => fetchPermissions(true)}
                            disabled={refreshing}
                        >
                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>

                        <Button variant="outline" onClick={resetAllRoles}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset All
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Roles</p>
                        <h3 className="mt-1 text-2xl font-semibold">{Object.keys(roles).length}</h3>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Enabled Permissions</p>
                        <h3 className="mt-1 text-2xl font-semibold">{totalEnabled}</h3>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Total Permissions</p>
                        <h3 className="mt-1 text-2xl font-semibold">{totalPermissions}</h3>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search features..."
                        value={featureSearch}
                        onChange={(e) => setFeatureSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {loading ? (
                    <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
                        Loading permissions...
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {Object.keys(filteredRoles).map((role) => {
                            const Icon = ROLE_ICONS[role] || Shield
                            const permissions = filteredRoles[role]
                            const enabledCount = roles[role]?.filter((p) => p.enabled).length || 0
                            const totalCount = roles[role]?.length || 0

                            return (
                                <div key={role} className="rounded-xl border bg-card p-6 shadow-sm">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-primary/10 p-2">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{role}</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {enabledCount}/{totalCount} enabled
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => resetRole(role)}
                                        >
                                            Reset
                                        </Button>
                                    </div>

                                    <div className="mt-5 flex flex-col gap-3">
                                        {permissions.length === 0 ? (
                                            <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                                                No matching features
                                            </div>
                                        ) : (
                                            permissions.map((perm) => {
                                                const toggleId = `${role}-${perm.name}`
                                                const isSaving = savingKey === toggleId

                                                return (
                                                    <div
                                                        key={perm.name}
                                                        className="flex items-center justify-between rounded-lg bg-muted/40 p-3"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {perm.enabled ? (
                                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                            ) : (
                                                                <X className="h-4 w-4 text-gray-400" />
                                                            )}
                                                            <span className="text-sm">{perm.name}</span>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            {isSaving && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    Saving...
                                                                </span>
                                                            )}
                                                            <Switch
                                                                checked={perm.enabled}
                                                                onCheckedChange={(val) =>
                                                                    togglePermission(role, perm.name, val)
                                                                }
                                                                disabled={isSaving}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </DashboardShell>
    )
}
