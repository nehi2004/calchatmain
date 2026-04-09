//import { Calendar, MessageSquare, CheckCircle2, LayoutDashboard, BarChart3, Users } from "lucide-react"

//const features = [
//  {
//    icon: Calendar,
//    title: "Smart Calendar Management",
//    description: "Organize your schedule with intelligent event management, reminders, and seamless integrations.",
//  },
//  {
//    icon: MessageSquare,
//    title: "AI Chat Assistant",
//    description: "Get instant, context-aware help from our AI assistant to boost your productivity.",
//  },
//  {
//    icon: CheckCircle2,
//    title: "Task & Focus Management",
//    description: "Stay on track with prioritized tasks, focus mode, and deadline tracking.",
//  },
//  {
//    icon: LayoutDashboard,
//    title: "Role Based Dashboards",
//    description: "Personalized dashboards tailored for students, professionals, and personal use.",
//  },
//  {
//    icon: BarChart3,
//    title: "Productivity Analytics",
//    description: "Track your performance with insightful charts and detailed progress reports.",
//  },
//  {
//    icon: Users,
//    title: "Team Collaboration",
//    description: "Work together seamlessly with group chats, shared calendars, and team management.",
//  },
//]

//export function Features() {
//  return (
//    <section id="features" className="px-4 py-20 lg:px-8">
//      <div className="mx-auto max-w-7xl">
//        <div className="mx-auto mb-16 max-w-2xl text-center">
//          <h2 className="font-heading text-balance text-3xl font-bold text-foreground sm:text-4xl">
//            Everything you need to stay productive
//          </h2>
//          <p className="mt-4 text-pretty text-lg text-muted-foreground">
//            Powerful features designed to help you manage your time, tasks, and team effectively.
//          </p>
//        </div>
//        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//          {features.map((feature) => (
//            <div
//              key={feature.title}
//              className="group rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
//            >
//              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
//                <feature.icon className="h-6 w-6" />
//              </div>
//              <h3 className="font-heading text-lg font-semibold text-card-foreground">{feature.title}</h3>
//              <p className="mt-2 leading-relaxed text-muted-foreground">{feature.description}</p>
//            </div>
//          ))}
//        </div>
//      </div>
//    </section>
//  )
//}


"use client"

import { Calendar, MessageSquare, CheckCircle2, LayoutDashboard, BarChart3, Users } from "lucide-react"
import { motion } from "framer-motion"

const features = [
    {
        icon: Calendar,
        title: "Smart Calendar Management",
        description: "Organize your schedule with intelligent reminders and seamless integrations.",
        color: "from-blue-500 to-indigo-500",
    },
    {
        icon: MessageSquare,
        title: "AI Chat Assistant",
        description: "Get instant, context-aware help from our AI assistant.",
        color: "from-purple-500 to-pink-500",
    },
    {
        icon: CheckCircle2,
        title: "Task & Focus Management",
        description: "Stay on track with smart task prioritization and focus mode.",
        color: "from-green-500 to-emerald-500",
    },
    {
        icon: LayoutDashboard,
        title: "Role Based Dashboards",
        description: "Personalized dashboards for students, professionals, and users.",
        color: "from-orange-500 to-red-500",
    },
    {
        icon: BarChart3,
        title: "Productivity Analytics",
        description: "Track progress with insightful charts and reports.",
        color: "from-cyan-500 to-blue-500",
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description: "Collaborate with group chats and shared calendars.",
        color: "from-indigo-500 to-purple-500",
    },
]

export function Features() {
    return (
        <section id="features" className="relative px-4 py-20 lg:px-8 overflow-hidden">

            {/* 🔥 BACKGROUND GLOW */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative mx-auto max-w-7xl">

                {/* 🔹 HEADING */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="mx-auto mb-16 max-w-2xl text-center"
                >
                    <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                        Everything you need to stay productive
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Powerful features designed to help you manage your time, tasks, and team effectively.
                    </p>
                </motion.div>

                {/* 🔥 FEATURE CARDS */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15, duration: 0.6 }}
                            whileHover={{ y: -10 }}
                            className="group relative rounded-2xl border border-white/10 
              bg-white/70 dark:bg-white/5 backdrop-blur-xl 
              p-6 shadow-md hover:shadow-xl transition-all overflow-hidden"
                        >

                            {/* 🔥 HOVER GRADIENT */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition 
              bg-gradient-to-br ${feature.color}`} />

                            {/* ICON */}
                            <div className={`relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl 
              bg-gradient-to-br ${feature.color} text-white shadow-md`}>
                                <feature.icon className="h-6 w-6" />
                            </div>

                            {/* TITLE */}
                            <h3 className="relative text-lg font-semibold text-foreground">
                                {feature.title}
                            </h3>

                            {/* DESC */}
                            <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>

                            {/* CTA */}
                            {/*<div className="relative mt-4 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition">*/}
                            {/*    Learn more →*/}
                            {/*</div>*/}

                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    )
}