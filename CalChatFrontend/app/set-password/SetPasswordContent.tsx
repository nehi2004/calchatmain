//"use client"

//import { useSearchParams } from "next/navigation"
//import { useState } from "react"
//import { Card, CardContent } from "@/components/ui/card"
//import { Input } from "@/components/ui/input"
//import { Button } from "@/components/ui/button"
//import { Label } from "@/components/ui/label"
//import { Lock } from "lucide-react"
//import { useRouter } from "next/navigation"

//export default function SetPasswordContent() {

//    const params = useSearchParams()
//    const token = params.get("token")

//    const [password, setPassword] = useState("")
//    const [confirmPassword, setConfirmPassword] = useState("")
//    const [loading, setLoading] = useState(false)
//    const router = useRouter()
//    const handleSubmit = async () => {

//        if (!token) {
//            alert("Invalid token")
//            return
//        }

//        if (password !== confirmPassword) {
//            alert("Passwords do not match")
//            return
//        }

//        try {
//            setLoading(true)

//            const res = await fetch("https://calchat-backend.onrender.com/api/hr/set-password", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json"
//                },
//                body: JSON.stringify({ token, password })
//            })

//            const text = await res.text()

//            if (!res.ok) {
//                alert(text || "Error occurred")
//                return
//            }

//            router.push("/set-password/success")

//        } catch (err) {
//            console.error(err)
//            alert("Something went wrong")
//        } finally {
//            setLoading(false)
//        }
//    }

//    return (
//        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">

//            <Card className="w-full max-w-md shadow-xl rounded-2xl border">
//                <CardContent className="p-6 space-y-6">

//                    <div className="text-center space-y-2">
//                        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
//                            <Lock className="h-5 w-5 text-primary" />
//                        </div>

//                        <h2 className="text-2xl font-bold">Set Your Password</h2>
//                        <p className="text-sm text-muted-foreground">
//                            Create a secure password to access your account
//                        </p>
//                    </div>

//                    <div className="space-y-4">

//                        <div className="space-y-1">
//                            <Label>Password</Label>
//                            <Input
//                                type="password"
//                                placeholder="Enter password"
//                                value={password}
//                                onChange={(e) => setPassword(e.target.value)}
//                            />
//                        </div>

//                        <div className="space-y-1">
//                            <Label>Confirm Password</Label>
//                            <Input
//                                type="password"
//                                placeholder="Confirm password"
//                                value={confirmPassword}
//                                onChange={(e) => setConfirmPassword(e.target.value)}
//                            />
//                        </div>

//                        <Button
//                            onClick={handleSubmit}
//                            disabled={loading}
//                            className="w-full"
//                        >
//                            {loading ? "Setting Password..." : "Set Password 🔐"}
//                        </Button>

//                    </div>

//                    <p className="text-xs text-center text-muted-foreground">
//                        Make sure your password is strong and secure
//                    </p>

//                </CardContent>
//            </Card>

//        </div>
//    )
//}
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff } from "lucide-react"

export default function SetPasswordContent() {

    const params = useSearchParams()
    const token = params.get("token")
    const router = useRouter()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // ✅ NEW
    const [showRules, setShowRules] = useState(false)

    // ✅ Rules
    const passwordRules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    }

    const handleSubmit = async () => {

        if (!token) {
            alert("Invalid token")
            return
        }

        // ✅ Rule validation
        if (!Object.values(passwordRules).every(Boolean)) {
            alert("Please satisfy all password conditions")
            return
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match")
            return
        }

        try {
            setLoading(true)

            const res = await fetch("https://calchat-backend.onrender.com/api/hr/set-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token, password })
            })

            const text = await res.text()

            if (!res.ok) {
                alert(text || "Error occurred")
                return
            }

            router.push("/set-password/success")

        } catch (err) {
            console.error(err)
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">

            <Card className="w-full max-w-md shadow-xl rounded-2xl border">
                <CardContent className="p-6 space-y-6">

                    <div className="text-center space-y-2">
                        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
                            <Lock className="h-5 w-5 text-primary" />
                        </div>

                        <h2 className="text-2xl font-bold">Set Your Password</h2>
                        <p className="text-sm text-muted-foreground">
                            Create a secure password
                        </p>
                    </div>

                    <div className="space-y-4">

                        {/* PASSWORD */}
                        <div className="relative space-y-1">
                            <Label>Password</Label>
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                value={password}
                                onFocus={() => setShowRules(true)}
                                onBlur={() => setShowRules(false)}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* ✅ RULES */}
                        {showRules && (
                            <div className="rounded-lg border p-4 bg-gray-50">
                                <p className="text-sm font-medium mb-2 text-gray-700">
                                    Password must contain:
                                </p>

                                <ul className="space-y-1 text-sm">
                                    <li className={`${passwordRules.length ? "text-green-600" : "text-gray-400"}`}>
                                        {passwordRules.length ? "✔" : "○"} 8+ characters
                                    </li>
                                    <li className={`${passwordRules.uppercase ? "text-green-600" : "text-gray-400"}`}>
                                        {passwordRules.uppercase ? "✔" : "○"} Uppercase letter
                                    </li>
                                    <li className={`${passwordRules.lowercase ? "text-green-600" : "text-gray-400"}`}>
                                        {passwordRules.lowercase ? "✔" : "○"} Lowercase letter
                                    </li>
                                    <li className={`${passwordRules.number ? "text-green-600" : "text-gray-400"}`}>
                                        {passwordRules.number ? "✔" : "○"} Number
                                    </li>
                                    <li className={`${passwordRules.special ? "text-green-600" : "text-gray-400"}`}>
                                        {passwordRules.special ? "✔" : "○"} Special character
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* CONFIRM */}
                        <div className="relative space-y-1">
                            <Label>Confirm Password</Label>
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-9"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* BUTTON */}
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? "Setting Password..." : "Set Password 🔐"}
                        </Button>

                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                        Make sure your password is strong and secure
                    </p>

                </CardContent>
            </Card>

        </div>
    )
}