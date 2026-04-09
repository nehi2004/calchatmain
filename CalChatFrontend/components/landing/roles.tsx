//import Link from "next/link"
//import { GraduationCap, User, Briefcase, Shield, ArrowRight } from "lucide-react"
//import { Button } from "@/components/ui/button"

//const roles = [
//  {
//    icon: GraduationCap,
//    title: "Student",
//    description: "Track assignments, study sessions, group projects, and manage your academic calendar with AI assistance.",
//    color: "bg-chart-1/10 text-chart-1",
//  },
//  {
//    icon: User,
//    title: "Personal User",
//    description: "Organize your daily life with habit tracking, personal goals, reminders, and a smart daily planner.",
//    color: "bg-chart-2/10 text-chart-2",
//  },
//  {
//    icon: Briefcase,
//    title: "Working Professional",
//    description: "Manage meetings, team collaboration, work tasks, and track your professional productivity.",
//    color: "bg-chart-3/10 text-chart-3",
//  },
//  {
//    icon: Shield,
//    title: "Admin",
//    description: "Manage users, roles, access control, system analytics, and platform-wide announcements.",
//    color: "bg-chart-4/10 text-chart-4",
//  },
//]

//export function Roles() {
//  return (
//    <section id="roles" className="bg-muted/50 px-4 py-20 lg:px-8">
//      <div className="mx-auto max-w-7xl">
//        <div className="mx-auto mb-16 max-w-2xl text-center">
//          <h2 className="font-heading text-balance text-3xl font-bold text-foreground sm:text-4xl">
//            Built for everyone
//          </h2>
//          <p className="mt-4 text-pretty text-lg text-muted-foreground">
//            Choose your role and get a personalized experience tailored to your needs.
//          </p>
//        </div>
//        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//          {roles.map((role) => (
//            <div
//              key={role.title}
//              className="group flex flex-col rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
//            >
//              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${role.color}`}>
//                <role.icon className="h-6 w-6" />
//              </div>
//              <h3 className="font-heading text-lg font-semibold text-card-foreground">{role.title}</h3>
//              <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">{role.description}</p>

//            </div>
//          ))}
//        </div>
//      </div>
//    </section>
//  )
//}


//"use client"

//import Link from "next/link"
//import { GraduationCap, User, Briefcase, Shield, ArrowRight } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { motion } from "framer-motion"

//const roles = [
//    {
//        icon: GraduationCap,
//        title: "Student",
//        description: "Track assignments, study sessions, group projects, and manage your academic calendar with AI assistance.",
//        color: "from-blue-500 to-indigo-500",
//    },
//    {
//        icon: User,
//        title: "Personal User",
//        description: "Organize your daily life with habit tracking, personal goals, reminders, and a smart daily planner.",
//        color: "from-purple-500 to-pink-500",
//    },

//    {
//        icon: Shield,
//        title: "HR",
//        description: "Manage Employee, access control of employee, system analytics, and platform-wide announcements,Manage meetings, team collaboration, work tasks, and track your professional productivity.",
//        color: "from-orange-500 to-red-500",
//    },
//    {
//        icon: Briefcase,
//        title: "Working Professional",
//        description: "Attend meetings, work tasks,Notes see share by HR, show announcement which share by HR and track your professional productivity.",
//        color: "from-green-500 to-emerald-500",
//    },
//    {
//        icon: Shield,
//        title: "Admin",
//        description: "Manage users, roles, access control, system analytics, and platform-wide announcements.",
//        color: "from-orange-500 to-red-500",
//    },
//]

//export function Roles() {
//    return (
//        <section id="roles" className="relative px-4 py-20 lg:px-8 overflow-hidden">

//            {/* 🔥 BACKGROUND GLOW */}
//            <div className="absolute inset-0 pointer-events-none">
//                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
//            </div>

//            <div className="relative mx-auto max-w-7xl">

//                {/* 🔹 HEADING */}
//                <motion.div
//                    initial={{ opacity: 0, y: 40 }}
//                    whileInView={{ opacity: 1, y: 0 }}
//                    transition={{ duration: 0.7 }}
//                    className="mx-auto mb-16 max-w-2xl text-center"
//                >
//                    <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
//                        Built for everyone
//                    </h2>
//                    <p className="mt-4 text-lg text-muted-foreground">
//                        Choose your role and get a personalized experience tailored to your needs.
//                    </p>
//                </motion.div>

//                {/* 🔥 CARDS */}
//                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//                    {roles.map((role, i) => (
//                        <motion.div
//                            key={role.title}
//                            initial={{ opacity: 0, y: 50 }}
//                            whileInView={{ opacity: 1, y: 0 }}
//                            transition={{ delay: i * 0.2, duration: 0.6 }}
//                            whileHover={{ y: -10 }}
//                            className="group relative flex flex-col rounded-2xl border border-white/10 
//              bg-white/70 dark:bg-white/5 backdrop-blur-xl 
//              p-6 shadow-md hover:shadow-xl transition-all overflow-hidden"
//                        >

//                            {/* 🔥 HOVER GLOW */}
//                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition 
//              bg-gradient-to-br ${role.color}`} />

//                            {/* ICON */}
//                            <div className={`relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl 
//              bg-gradient-to-br ${role.color} text-white shadow-md`}>
//                                <role.icon className="h-6 w-6" />
//                            </div>

//                            {/* TITLE */}
//                            <h3 className="relative text-lg font-semibold text-foreground">
//                                {role.title}
//                            </h3>

//                            {/* DESC */}
//                            <p className="relative mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
//                                {role.description}
//                            </p>

//                            {/* CTA */}
//                            {/*<div className="relative mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition">*/}
//                            {/*    Explore <ArrowRight className="ml-1 h-4 w-4" />*/}
//                            {/*</div>*/}

//                        </motion.div>
//                    ))}
//                </div>
//            </div>
//        </section>
//    )
//}


//"use client"

//import { GraduationCap, User, Briefcase, Shield } from "lucide-react"
//import { motion } from "framer-motion"

//const roles = [
//    {
//        icon: GraduationCap,
//        title: "Student",
//        description:
//            "Track assignments, study sessions, and manage your academic calendar with AI assistance.",
//        color: "from-blue-500 to-indigo-500",
//    },
//    {
//        icon: User,
//        title: "Personal User",
//        description:
//            "Organize your daily life with habits, goals, reminders, and a smart planner.",
//        color: "from-purple-500 to-pink-500",
//    },
//    {
//        icon: Shield,
//        title: "HR",
//        description:
//            "Manage employees, meetings, analytics, and announcements with full control.",
//        color: "from-orange-500 to-red-500",
//    },
//    {
//        icon: Briefcase,
//        title: "Working Professional",
//        description:
//            "Handle meetings, tasks, HR notes, and boost your work productivity.",
//        color: "from-green-500 to-emerald-500",
//    },
//    {
//        icon: Shield,
//        title: "Admin",
//        description:
//            "Control users, roles, analytics, and system-wide operations.",
//        color: "from-cyan-500 to-blue-500",
//    },
//]

//export function Roles() {
//    return (
//        <section id="roles" className="relative px-4 py-20 lg:px-8 overflow-hidden">

//            {/* 🔥 BACKGROUND GLOW */}
//            <div className="absolute inset-0 pointer-events-none">
//                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
//            </div>

//            <div className="relative mx-auto max-w-7xl">

//                {/* 🔹 HEADING */}
//                <motion.div
//                    initial={{ opacity: 0, y: 40 }}
//                    whileInView={{ opacity: 1, y: 0 }}
//                    transition={{ duration: 0.6 }}
//                    className="mx-auto mb-16 max-w-2xl text-center"
//                >
//                    <h2 className="text-3xl font-bold sm:text-4xl">
//                        Built for everyone
//                    </h2>
//                    <p className="mt-4 text-lg text-muted-foreground">
//                        Choose your role and get a personalized experience.
//                    </p>
//                </motion.div>

//                {/* 🔥 GRID FIXED */}
//                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

//                    {roles.map((role, i) => (
//                        <motion.div
//                            key={role.title}
//                            initial={{ opacity: 0, y: 50 }}
//                            whileInView={{ opacity: 1, y: 0 }}
//                            transition={{ delay: i * 0.15 }}
//                            whileHover={{ y: -8 }}
//                            className="group relative flex flex-col rounded-2xl 
//              border border-white/10 bg-white/70 dark:bg-white/5 
//              backdrop-blur-xl p-6 shadow-md hover:shadow-xl 
//              transition-all overflow-hidden"
//                        >

//                            {/* 🔥 HOVER GLOW */}
//                            <div
//                                className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition 
//                bg-gradient-to-br ${role.color}`}
//                            />

//                            {/* ICON */}
//                            <div
//                                className={`relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl 
//                bg-gradient-to-br ${role.color} text-white shadow-md`}
//                            >
//                                <role.icon className="h-6 w-6" />
//                            </div>

//                            {/* TITLE */}
//                            <h3 className="relative text-lg font-semibold">
//                                {role.title}
//                            </h3>

//                            {/* DESC */}
//                            <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">
//                                {role.description}
//                            </p>

//                        </motion.div>
//                    ))}
//                </div>
//            </div>
//        </section>
//    )
//}


"use client"

import { GraduationCap, User, Briefcase, Shield } from "lucide-react"
import { motion } from "framer-motion"

const roles = [
    {
        icon: GraduationCap,
        title: "Student",
        description:
            "Track assignments, study sessions, and manage your academic calendar with AI assistance.",
        color: "from-blue-500 to-indigo-500",
    },
    {
        icon: User,
        title: "Personal User",
        description:
            "Organize your daily life with habits, goals, reminders, and a smart planner.",
        color: "from-purple-500 to-pink-500",
    },
    {
        icon: Shield,
        title: "HR",
        description:
            "Manage employees, meetings, analytics, and announcements with full control.",
        color: "from-orange-500 to-red-500",
    },
    {
        icon: Briefcase,
        title: "Working Professional",
        description:
            "Handle meetings, tasks, HR notes, and boost your work productivity.",
        color: "from-green-500 to-emerald-500",
    },
    {
        icon: Shield,
        title: "Admin",
        description:
            "Control users, roles, analytics, and system-wide operations.",
        color: "from-cyan-500 to-blue-500",
    },
]

export function Roles() {
    return (
        <section id="roles" className="relative px-4 py-20 lg:px-8 overflow-hidden">

            {/* BACKGROUND */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full" />
            </div>

            <div className="relative mx-auto max-w-7xl">

                {/* HEADING */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto mb-16 max-w-2xl text-center"
                >
                    <h2 className="text-3xl font-bold sm:text-4xl">
                        Built for everyone
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Choose your role and get a personalized experience.
                    </p>
                </motion.div>

                {/* ✅ PERFECT GRID (5 cards centered) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">

                    {roles.map((role, i) => {
                        // center last 2 cards
                        let extraClass = ""
                        if (i === 3) extraClass = "lg:col-start-2"
                        if (i === 4) extraClass = "lg:col-start-4"

                        return (
                            <motion.div
                                key={role.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.12 }}
                                whileHover={{ y: -6 }}
                                className={`group relative flex flex-col justify-between h-full col-span-1 sm:col-span-1 lg:col-span-2 ${extraClass}
                rounded-2xl border border-white/10 bg-white/70 dark:bg-white/5 
                backdrop-blur-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}
                            >

                                {/* Hover Glow */}
                                <div
                                    className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition duration-300
                  bg-gradient-to-br ${role.color}`}
                                />

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div
                                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl
                    bg-gradient-to-br ${role.color} text-white shadow-md`}
                                    >
                                        <role.icon className="h-6 w-6" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold">
                                        {role.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                        {role.description}
                                    </p>
                                </div>

                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
