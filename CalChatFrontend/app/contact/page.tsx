

//"use client"

//import { motion } from "framer-motion"
//import { Mail, User, MessageSquare } from "lucide-react"

//const fadeUp = {
//    hidden: { opacity: 0, y: 40 },
//    show: (i = 0) => ({
//        opacity: 1,
//        y: 0,
//        transition: { delay: i * 0.1, duration: 0.5 },
//    }),
//}

//export default function ContactPage() {
//    return (
//        <div className="relative bg-background overflow-hidden px-6 py-20">

//            {/* 🔥 BACKGROUND GLOW */}
//            <div className="absolute inset-0 -z-10">
//                <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-500/10 blur-[160px] rounded-full" />
//            </div>

//            <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-12 items-center">

//                {/* 🔥 LEFT CONTENT */}
//                <motion.div
//                    variants={fadeUp}
//                    initial="hidden"
//                    animate="show"
//                >
//                    <h1 className="text-4xl font-bold tracking-tight">
//                        Contact <span className="text-primary">CalChat+</span>
//                    </h1>

//                    <p className="mt-4 text-muted-foreground leading-relaxed">
//                        Have questions, feedback, or ideas? We'd love to hear from you.
//                        Our team is here to help you.
//                    </p>

//                    <div className="mt-6 space-y-4 text-sm text-muted-foreground">

//                        <div className="flex items-center gap-3">
//                            <Mail className="h-4 w-4 text-blue-600" />
//                            calchat26@gmail.com
//                        </div>

//                        <div className="flex items-center gap-3">
//                            <User className="h-4 w-4 text-blue-600" />
//                            Available for All Users
//                        </div>

//                    </div>
//                </motion.div>

//                {/* 🔥 FORM CARD */}
//                <motion.div
//                    variants={fadeUp}
//                    initial="hidden"
//                    animate="show"
//                    className="relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 to-indigo-500/40"
//                >
//                    <div className="rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 shadow-xl">

//                        <form className="space-y-5">

//                            {/* NAME */}
//                            <div className="relative">
//                                <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
//                                <input
//                                    type="text"
//                                    placeholder="Your Name"
//                                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                                />
//                            </div>

//                            {/* EMAIL */}
//                            <div className="relative">
//                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
//                                <input
//                                    type="email"
//                                    placeholder="Your Email"
//                                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                                />
//                            </div>

//                            {/* MESSAGE */}
//                            <div className="relative">
//                                <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
//                                <textarea
//                                    placeholder="Your Message"
//                                    rows={4}
//                                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
//                                />
//                            </div>

//                            {/* BUTTON */}
//                            <button
//                                type="submit"
//                                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
//                            >
//                                Send Message
//                            </button>

//                        </form>

//                    </div>
//                </motion.div>

//            </div>

//        </div>
//    )
//}

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, User, MessageSquare } from "lucide-react"
import { useEffect } from "react"



const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5 },
    }),
}




export default function ContactPage() {
    // ✅ STATE
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    })

    const [loading, setLoading] = useState(false)
    const [popup, setPopup] = useState<{
        type: "success" | "error" | null
        message: string
    }>({
        type: null,
        message: "",
    })

    // ✅ HANDLE CHANGE
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        if (popup.type) {
            const timer = setTimeout(() => {
                setPopup({ type: null, message: "" })
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [popup])
    // ✅ HANDLE SUBMIT (CONNECTED TO YOUR .NET BACKEND)
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch(
                "https://steadfast-warmth-production-64c8.up.railway.app/api/Contact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            )

            const data = await res.json()
            if (data.success) {
                setPopup({
                    type: "success",
                    message: "Message sent successfully 🚀",
                })

                setForm({
                    name: "",
                    email: "",
                    message: "",
                })
            } else {
                setPopup({
                    type: "error",
                    message: "Failed to send message",
                })
            }
        }
        catch (error) {
            console.error(error)
            alert("Server error ❌")
        }

        setLoading(false)
    }

    return (

        <div className="relative bg-background overflow-hidden px-6 py-20">

            {/* 🔥 POPUP */}
            {popup.type && (
                <motion.div
                    initial={{ opacity: 0, y: -40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
                >
                    <div
                        className={`px-6 py-4 rounded-xl shadow-xl backdrop-blur-xl border flex items-center gap-3
            ${popup.type === "success"
                                ? "bg-green-500/10 border-green-500/30 text-green-600"
                                : "bg-red-500/10 border-red-500/30 text-red-600"
                            }`}
                    >
                        {/* ICON */}
                        <div className="text-lg">
                            {popup.type === "success" ? "✅" : "❌"}
                        </div>

                        {/* MESSAGE */}
                        <p className="text-sm font-medium">{popup.message}</p>
                    </div>
                </motion.div>
            )}
            {/* 🔥 BACKGROUND */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-500/10 blur-[160px] rounded-full" />
            </div>

            <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-12 items-center">
                {/* LEFT */}
                <motion.div variants={fadeUp} initial="hidden" animate="show">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Contact <span className="text-primary">CalChat+</span>
                    </h1>

                    <p className="mt-4 text-muted-foreground leading-relaxed">
                        Have questions, feedback, or ideas? We'd love to hear from you.
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

                {/* FORM */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 to-indigo-500/40"
                >
                    <div className="rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 shadow-xl">

                        {/* ✅ FORM CONNECTED */}
                        <form className="space-y-5" onSubmit={handleSubmit}>

                            {/* NAME */}
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* EMAIL */}
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Your Email"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* MESSAGE */}
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Your Message"
                                    rows={4}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    required
                                />
                            </div>

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>

                        </form>

                    </div>
                </motion.div>
            </div>
        </div>
    )
}