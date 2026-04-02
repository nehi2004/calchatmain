//"use client"

//import { useSearchParams } from "next/navigation"
//import { useState } from "react"

//export default function SetPasswordPage() {

//    const params = useSearchParams()
//    const token = params.get("token")

//    const [password, setPassword] = useState("")
//    const [confirmPassword, setConfirmPassword] = useState("")

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
//            const res = await fetch("https://calchatmain-production-7169.up.railway.app/api/hr/set-password", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json"
//                },
//                body: JSON.stringify({
//                    token,
//                    password
//                })
//            })

//            const text = await res.text()

//            if (!res.ok) {
//                alert(text || "Error occurred")
//                return
//            }

//            alert("Password set successfully ✅")

//        } catch (err) {
//            console.error(err)
//            alert("Something went wrong")
//        }
//    }

//    return (
//        <div style={{ padding: "40px" }}>
//            <h2>Set Password</h2>

//            <input
//                type="password"
//                placeholder="Enter password"
//                value={password}
//                onChange={(e) => setPassword(e.target.value)}
//            />

//            <br /><br />

//            <input
//                type="password"
//                placeholder="Confirm password"
//                value={confirmPassword}
//                onChange={(e) => setConfirmPassword(e.target.value)}
//            />

//            <br /><br />

//            <button onClick={handleSubmit}>
//                Set Password
//            </button>
//        </div>
//    )
//}


//"use client"

//import { useSearchParams } from "next/navigation"
//import { useState } from "react"
//import { Card, CardContent } from "@/components/ui/card"
//import { Input } from "@/components/ui/input"
//import { Button } from "@/components/ui/button"
//import { Label } from "@/components/ui/label"
//import { Lock } from "lucide-react"

//export default function SetPasswordPage() {

//    const params = useSearchParams()
//    const token = params.get("token")

//    const [password, setPassword] = useState("")
//    const [confirmPassword, setConfirmPassword] = useState("")
//    const [loading, setLoading] = useState(false)

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

//            const res = await fetch("https://calchatmain-production-7169.up.railway.app/api/hr/set-password", {
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

//            alert("Password set successfully ✅")

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

//                    {/* HEADER */}
//                    <div className="text-center space-y-2">
//                        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
//                            <Lock className="h-5 w-5 text-primary" />
//                        </div>

//                        <h2 className="text-2xl font-bold">Set Your Password</h2>
//                        <p className="text-sm text-muted-foreground">
//                            Create a secure password to access your account
//                        </p>
//                    </div>

//                    {/* FORM */}
//                    <div className="space-y-4">

//                        {/* PASSWORD */}
//                        <div className="space-y-1">
//                            <Label>Password</Label>
//                            <Input
//                                type="password"
//                                placeholder="Enter password"
//                                value={password}
//                                onChange={(e) => setPassword(e.target.value)}
//                                className="h-10"
//                            />
//                        </div>

//                        {/* CONFIRM PASSWORD */}
//                        <div className="space-y-1">
//                            <Label>Confirm Password</Label>
//                            <Input
//                                type="password"
//                                placeholder="Confirm password"
//                                value={confirmPassword}
//                                onChange={(e) => setConfirmPassword(e.target.value)}
//                                className="h-10"
//                            />
//                        </div>

//                        {/* BUTTON */}
//                        <Button
//                            onClick={handleSubmit}
//                            disabled={loading}
//                            className="w-full h-11 text-sm font-medium shadow-md hover:scale-[1.02] transition"
//                        >
//                            {loading ? "Setting Password..." : "Set Password 🔐"}
//                        </Button>

//                    </div>

//                    {/* FOOTER */}
//                    <p className="text-xs text-center text-muted-foreground">
//                        Make sure your password is strong and secure
//                    </p>

//                </CardContent>
//            </Card>

//        </div>
//    )
//}
"use client"

import { Suspense } from "react"
import SetPasswordContent from "./SetPasswordContent"

export default function SetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <SetPasswordContent />
        </Suspense>
    )
}