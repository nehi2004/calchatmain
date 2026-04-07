"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ResetSuccessPage() {
    const router = useRouter()

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
                    <span className="text-3xl">🔑</span>
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold text-gray-800">
                    Password Reset Successfully
                </h1>

                {/* Description */}
                <p className="text-sm text-gray-500">
                    Your password has been updated. You can now login with your new credentials.
                </p>

                {/* Button */}
                <button
                    onClick={() => router.push("/login")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition duration-200 shadow-md"
                >
                    Go to Login →
                </button>

                {/* Note */}
                <p className="text-xs text-gray-400">
                    Redirecting you to login...
                </p>

            </div>

        </div>
    )
}