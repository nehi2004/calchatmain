import { Calendar, MessageSquare, CheckCircle2, LayoutDashboard, BarChart3, Users } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Smart Calendar Management",
    description: "Organize your schedule with intelligent event management, reminders, and seamless integrations.",
  },
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description: "Get instant, context-aware help from our AI assistant to boost your productivity.",
  },
  {
    icon: CheckCircle2,
    title: "Task & Focus Management",
    description: "Stay on track with prioritized tasks, focus mode, and deadline tracking.",
  },
  {
    icon: LayoutDashboard,
    title: "Role Based Dashboards",
    description: "Personalized dashboards tailored for students, professionals, and personal use.",
  },
  {
    icon: BarChart3,
    title: "Productivity Analytics",
    description: "Track your performance with insightful charts and detailed progress reports.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with group chats, shared calendars, and team management.",
  },
]

export function Features() {
  return (
    <section id="features" className="px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-heading text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need to stay productive
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Powerful features designed to help you manage your time, tasks, and team effectively.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-card-foreground">{feature.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
