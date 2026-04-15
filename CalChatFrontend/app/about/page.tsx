"use client"

import { motion } from "framer-motion"
import { Sparkles, Layers, Rocket } from "lucide-react"

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.12, duration: 0.6 },
    }),
}

export default function AboutPage() {
    return (
        <div className="relative bg-background overflow-hidden">

            {/* 🔥 ANIMATED BACKGROUND */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[180px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-500/10 blur-[140px] rounded-full" />
            </div>

            {/* 🔥 HERO */}
            <section className="px-6 pt-24 pb-16 text-center">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="mx-auto max-w-4xl"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
                        Build smarter with{" "}
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                            CalChat+
                        </span>
                    </h1>

                    <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        A modern AI-powered productivity platform that brings your tasks,
                        calendar, and communication into one seamless experience.
                    </p>
                </motion.div>
            </section>

            {/* 🔥 FEATURE STRIP WITH ICONS */}
            <section className="px-6 pb-12">
                <div className="mx-auto max-w-5xl grid md:grid-cols-3 gap-6">

                    {[
                        { icon: Sparkles, text: "AI-powered planning" },
                        { icon: Layers, text: "All-in-one workspace" },
                        { icon: Rocket, text: "Fast & scalable system" },
                    ].map((item, i) => {
                        const Icon = item.icon
                        return (
                            <motion.div
                                key={i}
                                custom={i}
                                variants={fadeUp}
                                initial="hidden"
                                animate="show"
                                whileHover={{ y: -6, scale: 1.05 }}
                                className="group relative rounded-2xl p-[1px] bg-gradient-to-r from-blue-500/40 to-indigo-500/40"
                            >
                                <div className="rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl px-6 py-6 shadow-lg flex flex-col items-center gap-3">

                                    <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition">
                                        <Icon className="h-5 w-5 text-blue-600" />
                                    </div>

                                    <span className="text-sm font-medium">
                                        {item.text}
                                    </span>

                                </div>
                            </motion.div>
                        )
                    })}

                </div>
            </section>

            {/* 🔥 MAIN */}
            <section className="px-6 py-16">
                <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-12 items-center">

                    <motion.div variants={fadeUp} initial="hidden" animate="show">
                        <h2 className="text-2xl font-semibold">
                            Our Mission
                        </h2>

                        <p className="mt-4 text-muted-foreground leading-relaxed">
                            We help students, professionals, and teams simplify their workflow
                            using intelligent automation and modern design principles.
                        </p>

                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            CalChat+ removes complexity and gives you a single place to manage
                            everything efficiently.
                        </p>
                    </motion.div>

                    {/* CARD */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        whileHover={{ scale: 1.03 }}
                        className="relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 to-indigo-500/40"
                    >
                        <div className="rounded-2xl p-8 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl">
                            <h3 className="font-semibold text-lg">
                                Why CalChat+ exists
                            </h3>

                            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                                Switching between multiple apps wastes time. We built CalChat+
                                to bring everything into one smooth, focused workspace powered by AI.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* 🔥 PREMIUM FEATURE CARDS */}
            <section className="px-6 py-16">
                <div className="mx-auto max-w-5xl grid md:grid-cols-3 gap-8">

                    {[
                        {
                            title: "Smart Planning",
                            desc: "AI organizes your tasks automatically.",
                        },
                        {
                            title: "Unified Workspace",
                            desc: "Everything in one place.",
                        },
                        {
                            title: "Modern Experience",
                            desc: "Fast, clean and distraction-free.",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            whileHover={{ y: -10 }}
                            className="group relative rounded-2xl overflow-hidden border bg-card p-6 shadow-md hover:shadow-2xl transition-all"
                        >

                            {/* animated gradient border effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-xl" />

                            <h3 className="font-semibold text-base group-hover:text-blue-600 transition">
                                {item.title}
                            </h3>

                            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                                {item.desc}
                            </p>

                        </motion.div>
                    ))}

                </div>
            </section>

            {/* 🔥 CTA */}
            <section className="px-6 pb-24 text-center">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="mx-auto max-w-2xl"
                >
                    <h2 className="text-2xl font-semibold">
                        Get started with CalChat+
                    </h2>

                    <p className="mt-4 text-muted-foreground">
                        Experience a smarter way to manage your work.
                    </p>

                    <div className="mt-6 flex justify-center gap-4">

                        <a
                            href="/register"
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            Get Started
                        </a>

                        <a
                            href="/contact"
                            className="px-6 py-3 rounded-xl border text-sm font-medium hover:bg-muted transition"
                        >
                            Contact
                        </a>

                    </div>

                </motion.div>
            </section>

        </div>
    )
}