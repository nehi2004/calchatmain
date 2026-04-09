//export default function TermsPage() {
//    return (
//        <div className="px-6 py-20 max-w-4xl mx-auto">

//            <h1 className="text-4xl font-bold">Terms & Conditions</h1>

//            <p className="mt-6 text-muted-foreground">
//                By using CalChat+, you agree to the following terms:
//            </p>

//            <ul className="mt-6 space-y-4 text-muted-foreground">
//                <li>• Use the platform responsibly</li>
//                <li>• Do not misuse services</li>
//                <li>• Respect user privacy</li>
//            </ul>

//        </div>
//    )
//}

"use client"

import { motion } from "framer-motion"

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5 },
    }),
}

export default function TermsPage() {
    return (
        <div className="relative bg-background overflow-hidden">

            {/* 🔥 BACKGROUND GLOW */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-500/10 blur-[160px] rounded-full" />
            </div>

            {/* 🔥 HERO */}
            <section className="relative px-6 pt-24 pb-16 text-center">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="mx-auto max-w-3xl"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                        Terms &{" "}
                        <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                            Conditions
                        </span>
                    </h1>

                    <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                        Please read these terms carefully before using CalChat+.
                    </p>
                </motion.div>
            </section>

            {/* 🔥 TERMS CARDS */}
            <section className="relative px-6 pb-20">
                <div className="mx-auto max-w-5xl grid gap-6">

                    {[
                        {
                            title: "Acceptable Use",
                            desc: "You agree to use CalChat+ responsibly and only for lawful purposes. Misuse or abuse of the platform is strictly prohibited.",
                        },
                        {
                            title: "User Responsibility",
                            desc: "You are responsible for maintaining the confidentiality of your account and ensuring that your activities comply with our policies.",
                        },
                        {
                            title: "Data & Privacy",
                            desc: "We respect your data and handle it securely. By using our platform, you agree to our data handling practices.",
                        },
                        {
                            title: "Service Availability",
                            desc: "We aim to provide uninterrupted service, but we do not guarantee that the platform will always be available or error-free.",
                        },
                        {
                            title: "Changes to Terms",
                            desc: "We may update these terms from time to time. Continued use of the platform means you accept the updated terms.",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            whileHover={{ y: -6, scale: 1.02 }}
                            className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500/30 via-blue-500/30 to-purple-500/30"
                        >
                            <div className="relative rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl p-6 shadow-lg transition">

                                {/* Hover Glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 blur-xl" />

                                <h3 className="text-lg font-semibold group-hover:text-indigo-600 transition">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                                    {item.desc}
                                </p>

                            </div>
                        </motion.div>
                    ))}

                </div>
            </section>

            {/* 🔥 CTA */}
            <section className="relative px-6 pb-24 text-center">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="mx-auto max-w-2xl"
                >
                    <h2 className="text-2xl font-semibold">
                        Have questions about our terms?
                    </h2>

                    <p className="mt-4 text-muted-foreground">
                        Feel free to contact us for any clarification.
                    </p>

                    <div className="mt-6 flex justify-center gap-4">

                        <a
                            href="/contact"
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            Contact Us
                        </a>

                        <a
                            href="/privacy"
                            className="px-6 py-3 rounded-xl border text-sm font-medium hover:bg-muted transition"
                        >
                            View Privacy Policy
                        </a>

                    </div>

                </motion.div>
            </section>

        </div>
    )
}