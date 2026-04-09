//export default function PrivacyPage() {
//    return (
//        <div className="px-6 py-20 max-w-4xl mx-auto">

//            <h1 className="text-4xl font-bold">Privacy Policy</h1>

//            <p className="mt-6 text-muted-foreground">
//                We respect your privacy and are committed to protecting your data.
//            </p>

//            <ul className="mt-6 space-y-4 text-muted-foreground">
//                <li>• We do not sell your personal data</li>
//                <li>• Your data is securely stored</li>
//                <li>• You control your information</li>
//            </ul>

//        </div>
//    )
//}


"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Lock, Eye } from "lucide-react"

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5 },
    }),
}

export default function PrivacyPage() {
    return (
        <div className="relative bg-background overflow-hidden px-6 py-20">

            {/* 🔥 BACKGROUND GLOW */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-500/10 blur-[160px] rounded-full" />
            </div>

            <div className="mx-auto max-w-4xl">

                {/* 🔥 HEADER */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold tracking-tight">
                        Privacy <span className="text-primary">Policy</span>
                    </h1>

                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        Your privacy matters. Here's how we handle and protect your data.
                    </p>
                </motion.div>

                {/* 🔥 CONTENT CARD */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="mt-12 rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/30 to-indigo-500/30"
                >
                    <div className="rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 shadow-xl space-y-8">

                        {/* SECTION 1 */}
                        <div className="flex gap-4">
                            <ShieldCheck className="h-6 w-6 text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-lg">
                                    Data Protection
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                    We prioritize the security of your personal data and use
                                    industry-standard encryption and protection measures to keep it safe.
                                </p>
                            </div>
                        </div>

                        {/* SECTION 2 */}
                        <div className="flex gap-4">
                            <Lock className="h-6 w-6 text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-lg">
                                    No Data Selling
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                    We do not sell, rent, or share your personal data with third parties
                                    for marketing or advertising purposes.
                                </p>
                            </div>
                        </div>

                        {/* SECTION 3 */}
                        <div className="flex gap-4">
                            <Eye className="h-6 w-6 text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-lg">
                                    Your Control
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                    You have full control over your data. You can update, manage,
                                    or delete your information anytime from your account.
                                </p>
                            </div>
                        </div>

                    </div>
                </motion.div>

                {/* 🔥 FOOT NOTE */}
                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="mt-8 text-center text-sm text-muted-foreground"
                >
                    Last updated:  &copy; {new Date().getFullYear()}
                </motion.p>

            </div>

        </div>
    )
}