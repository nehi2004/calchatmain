import Link from "next/link"
import { GraduationCap, User, Briefcase, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const roles = [
  {
    icon: GraduationCap,
    title: "Student",
    description: "Track assignments, study sessions, group projects, and manage your academic calendar with AI assistance.",
    color: "bg-chart-1/10 text-chart-1",
  },
  {
    icon: User,
    title: "Personal User",
    description: "Organize your daily life with habit tracking, personal goals, reminders, and a smart daily planner.",
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    icon: Briefcase,
    title: "Working Professional",
    description: "Manage meetings, team collaboration, work tasks, and track your professional productivity.",
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    icon: Shield,
    title: "Admin",
    description: "Manage users, roles, access control, system analytics, and platform-wide announcements.",
    color: "bg-chart-4/10 text-chart-4",
  },
]

export function Roles() {
  return (
    <section id="roles" className="bg-muted/50 px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-heading text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Built for everyone
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Choose your role and get a personalized experience tailored to your needs.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => (
            <div
              key={role.title}
              className="group flex flex-col rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${role.color}`}>
                <role.icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-card-foreground">{role.title}</h3>
              <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">{role.description}</p>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
