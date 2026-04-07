//export default function SuccessPage() {
//    return (
//        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">

//            <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-4">
//                <h1 className="text-2xl font-bold text-green-600">
//                    ✅ Password Set Successfully
//                </h1>

//                <p className="text-muted-foreground">
//                    Your account is now active. You can login now.
//                </p>

//                <a
//                    href="/login"
//                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg"
//                >
//                    Go to Login
//                </a>
//            </div>

//        </div>
//    )
//}


//export default function SuccessPage() {
//    return (
//        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">

//            <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center space-y-6 border">

//                {/* Icon */}
//                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
//                    <span className="text-3xl">✅</span>
//                </div>

//                {/* Heading */}
//                <h1 className="text-2xl font-bold text-gray-800">
//                    Password Set Successfully
//                </h1>

//                {/* Description */}
//                <p className="text-sm text-gray-500">
//                    Your account is now active. You can securely login and start using the platform.
//                </p>

//                {/* Button */}
//                <a
//                    href="/login"
//                    className="inline-block w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-medium transition duration-200 shadow-md"
//                >
//                    Go to Login →
//                </a>

//                {/* Extra note */}
//                <p className="text-xs text-gray-400">
//                    You will be redirected automatically in a few seconds
//                </p>

//            </div>

//        </div>
//    )
//}


"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SuccessPage() {
    const router = useRouter()

    // 🔁 Auto redirect after 3 sec
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/login")
        }, 5000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">

            <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center space-y-6 border">

                {/* Icon */}
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-100">
                    <span className="text-3xl">🔒</span>
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold text-gray-800">
                    Password Set Successfully
                </h1>

                {/* Description */}
                <p className="text-sm text-gray-500">
                    Your account is now active. You can securely login and continue.
                </p>

                {/* Button */}
                <button
                    onClick={() => router.push("/login")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition duration-200 shadow-md"
                >
                    Go to Login →
                </button>

                {/* Extra note */}
                <p className="text-xs text-gray-400">
                    Redirecting you to login in a few seconds...
                </p>

            </div>

        </div>
    )
}

