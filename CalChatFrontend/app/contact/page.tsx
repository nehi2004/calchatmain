

"use client"

import { motion } from "framer-motion"
import { Mail, User, MessageSquare } from "lucide-react"

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5 },
    }),
}

export default function ContactPage() {
    return (
        <div className="relative bg-background overflow-hidden px-6 py-20">

            {/* 🔥 BACKGROUND GLOW */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-500/10 blur-[160px] rounded-full" />
            </div>

            <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-12 items-center">

                {/* 🔥 LEFT CONTENT */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                >
                    <h1 className="text-4xl font-bold tracking-tight">
                        Contact <span className="text-primary">CalChat+</span>
                    </h1>

                    <p className="mt-4 text-muted-foreground leading-relaxed">
                        Have questions, feedback, or ideas? We'd love to hear from you.
                        Our team is here to help you.
                    </p>

                    <div className="mt-6 space-y-4 text-sm text-muted-foreground">

                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-blue-600" />
                            calchat26@gmail.com
                        </div>

                        <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-blue-600" />
                            Available for All Users 
                        </div>

                    </div>
                </motion.div>

                {/* 🔥 FORM CARD */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 to-indigo-500/40"
                >
                    <div className="rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 shadow-xl">

                        <form className="space-y-5">

                            {/* NAME */}
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>

                            {/* EMAIL */}
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>

                            {/* MESSAGE */}
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                <textarea
                                    placeholder="Your Message"
                                    rows={4}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                                />
                            </div>

                            {/* BUTTON */}
                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
                            >
                                Send Message
                            </button>

                        </form>

                    </div>
                </motion.div>

            </div>

        </div>
    )
}