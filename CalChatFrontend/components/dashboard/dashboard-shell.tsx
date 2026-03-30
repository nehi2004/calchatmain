"use client"

import React from "react"

import { useState } from "react"
import { DashboardSidebar, type NavItem } from "./dashboard-sidebar"
import { DashboardHeader } from "./dashboard-header"

interface DashboardShellProps {
  children: React.ReactNode
  navItems: NavItem[]
  role: string
  title: string
}

export function DashboardShell({ children, navItems, role, title }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar
        items={navItems}
        role={role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
