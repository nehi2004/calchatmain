



//"use client"

//import React, { useState } from "react"
//import Link from "next/link"
//import { useRouter } from "next/navigation"
//import { Calendar, Eye, EyeOff } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
//import { Checkbox } from "@/components/ui/checkbox"

//export default function RegisterPage() {
//    const router = useRouter()

//    const [role, setRole] = useState("")
//    const [agreed, setAgreed] = useState(false)

//    // 👇 NEW STATES
//    const [showPassword, setShowPassword] = useState(false)
//    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

//    async function handleSubmit(e: React.FormEvent) {
//        e.preventDefault()

//        if (!agreed) return

//        const password = (document.getElementById("password") as HTMLInputElement).value
//        const confirmPassword = (document.getElementById("confirm") as HTMLInputElement).value

//        // ✅ PASSWORD MATCH VALIDATION
//        if (password !== confirmPassword) {
//            alert("Passwords do not match")
//            return
//        }

//        const formData = {
//            name: (document.getElementById("name") as HTMLInputElement).value,
//            email: (document.getElementById("email") as HTMLInputElement).value,
//            password: password,
//            role: role
//        }

//        console.log("Sending data:", formData)

//        try {
//            const response = await fetch("https://calchat-backend.onrender.com/api/account/register", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json"
//                },
//                body: JSON.stringify(formData)
//            })

//            if (response.ok) {
//                alert("Registration successful!")
//                router.push("/login")
//            } else {
//                const error = await response.text()
//                alert(error)
//            }
//        } catch (err) {
//            console.error(err)
//            alert("Something went wrong")
//        }
//    }

//    return (
//        <div className="flex min-h-screen">

//            {/* LEFT SIDE */}
//            <div className="hidden flex-1 items-center justify-center bg-primary/5 lg:flex">
//                <div className="mx-auto max-w-md px-8 text-center">
//                    <div className="mb-8 flex justify-center">
//                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
//                            <Calendar className="h-8 w-8 text-primary-foreground" />
//                        </div>
//                    </div>
//                    <h2 className="font-heading text-3xl font-bold text-foreground">Join CalChat+</h2>
//                    <p className="mt-4 leading-relaxed text-muted-foreground">
//                        Start your journey to smarter productivity. Set up your account in seconds.
//                    </p>
//                </div>
//            </div>

//            {/* RIGHT SIDE */}
//            <div className="flex flex-1 items-center justify-center px-4 py-12">
//                <div className="w-full max-w-md">

//                    <div className="mb-8 flex items-center gap-2 lg:hidden">
//                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
//                            <Calendar className="h-5 w-5 text-primary-foreground" />
//                        </div>
//                        <span className="font-heading text-xl font-bold text-foreground">CalChat+</span>
//                    </div>

//                    <h1 className="font-heading text-2xl font-bold text-foreground">Create your account</h1>
//                    <p className="mt-2 text-muted-foreground">
//                        Already have an account?{" "}
//                        <Link href="/login" className="text-primary hover:underline">
//                            Sign in
//                        </Link>
//                    </p>

//                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">

//                        {/* NAME */}
//                        <div className="flex flex-col gap-2">
//                            <Label htmlFor="name">Full Name</Label>
//                            <Input id="name" placeholder="Enter Your Name" required />
//                        </div>

//                        {/* EMAIL */}
//                        <div className="flex flex-col gap-2">
//                            <Label htmlFor="email">Email</Label>
//                            <Input id="email" type="email" placeholder="you@example.com" required />
//                        </div>

//                        {/* PASSWORD SECTION */}
//                        <div className="grid grid-cols-2 gap-4">

//                            {/* PASSWORD */}
//                            <div className="flex flex-col gap-2 relative">
//                                <Label htmlFor="password">Password</Label>
//                                <Input
//                                    id="password"
//                                    type={showPassword ? "text" : "password"}
//                                    placeholder="Create password"
//                                    required
//                                    className="pr-10"
//                                />
//                                <button
//                                    type="button"
//                                    onClick={() => setShowPassword(!showPassword)}
//                                    className="absolute right-3 top-9 text-muted-foreground"
//                                >
//                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                </button>
//                            </div>

//                            {/* CONFIRM PASSWORD */}
//                            <div className="flex flex-col gap-2 relative">
//                                <Label htmlFor="confirm">Confirm Password</Label>
//                                <Input
//                                    id="confirm"
//                                    type={showConfirmPassword ? "text" : "password"}
//                                    placeholder="Confirm password"
//                                    required
//                                    className="pr-10"
//                                />
//                                <button
//                                    type="button"
//                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                    className="absolute right-3 top-9 text-muted-foreground"
//                                >
//                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                </button>
//                            </div>

//                        </div>

//                        {/* ROLE */}
//                        <div className="flex flex-col gap-2">
//                            <Label>Role</Label>
//                            <Select value={role} onValueChange={setRole} required>
//                                <SelectTrigger>
//                                    <SelectValue placeholder="Select your role" />
//                                </SelectTrigger>
//                                <SelectContent>
//                                    <SelectItem value="student">Student</SelectItem>
//                                    <SelectItem value="personal">Personal</SelectItem>
//                                    <SelectItem value="hr">HR</SelectItem>
//                                    <SelectItem value="admin">Admin</SelectItem>
//                                </SelectContent>
//                            </Select>
//                        </div>

//                        {/* TERMS */}
//                        <div className="flex items-center gap-3">
//                            <Checkbox
//                                id="terms"
//                                checked={agreed}
//                                onCheckedChange={(checked) => setAgreed(checked === true)}
//                            />
//                            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
//                                I agree to the{" "}
//                                <Link href="#" className="text-primary hover:underline">
//                                    Terms & Conditions
//                                </Link>{" "}
//                                and{" "}
//                                <Link href="#" className="text-primary hover:underline">
//                                    Privacy Policy
//                                </Link>
//                            </Label>
//                        </div>

//                        {/* SUBMIT */}
//                        <Button type="submit" size="lg" className="mt-2 w-full" disabled={!agreed}>
//                            Create Account
//                        </Button>

//                    </form>
//                </div>
//            </div>
//        </div>
//    )
//}





//"use client"

//import React, { useState } from "react"
//import Link from "next/link"
//import { useRouter } from "next/navigation"
//import { Calendar, Eye, EyeOff } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
//import { Checkbox } from "@/components/ui/checkbox"

//export default function RegisterPage() {
//    const router = useRouter()

//    const [role, setRole] = useState("")
//    const [agreed, setAgreed] = useState(false)

//    // 👇 NEW STATES
//    const [showPassword, setShowPassword] = useState(false)
//    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

//    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//        e.preventDefault()
//        console.log("API:", process.env.NEXT_PUBLIC_API_URL)
//        if (!agreed) return

//        const password = (document.getElementById("password") as HTMLInputElement).value
//        const confirmPassword = (document.getElementById("confirm") as HTMLInputElement).value

//        if (password !== confirmPassword) {
//            alert("Passwords do not match")
//            return
//        }

//        const formData = {
//            name: (document.getElementById("name") as HTMLInputElement).value,
//            email: (document.getElementById("email") as HTMLInputElement).value,
//            password: password,
//            role: role
//        }

//        console.log("Sending data:", formData)

//        try {
//            const response = await fetch(
//                `${process.env.NEXT_PUBLIC_API_URL}/account/register`,
//                {
//                    method: "POST",
//                    headers: {
//                        "Content-Type": "application/json"
//                    },
//                    body: JSON.stringify(formData) // ✅ FIX HERE
//                }
//            )

//            if (response.ok) {
//                alert("Registration successful!")
//                router.push("/login")
//            } else {
//                const error = await response.text()
//                alert(error)
//            }
//        } catch (err) {
//            console.error(err)
//            alert("Something went wrong")
//        }
//    }

//    return (
//        <div className="flex min-h-screen">

//            {/* LEFT SIDE */}
//            <div className="hidden flex-1 items-center justify-center bg-primary/5 lg:flex">
//                <div className="mx-auto max-w-md px-8 text-center">
//                    <div className="mb-8 flex justify-center">
//                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
//                            <Calendar className="h-8 w-8 text-primary-foreground" />
//                        </div>
//                    </div>
//                    <h2 className="font-heading text-3xl font-bold text-foreground">Join CalChat+</h2>
//                    <p className="mt-4 leading-relaxed text-muted-foreground">
//                        Start your journey to smarter productivity. Set up your account in seconds.
//                    </p>
//                </div>
//            </div>

//            {/* RIGHT SIDE */}
//            <div className="flex flex-1 items-center justify-center px-4 py-12">
//                <div className="w-full max-w-md">

//                    <div className="mb-8 flex items-center gap-2 lg:hidden">
//                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
//                            <Calendar className="h-5 w-5 text-primary-foreground" />
//                        </div>
//                        <span className="font-heading text-xl font-bold text-foreground">CalChat+</span>
//                    </div>

//                    <h1 className="font-heading text-2xl font-bold text-foreground">Create your account</h1>
//                    <p className="mt-2 text-muted-foreground">
//                        Already have an account?{" "}
//                        <Link href="/login" className="text-primary hover:underline">
//                            Sign in
//                        </Link>
//                    </p>

//                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">

//                        {/* NAME */}
//                        <div className="flex flex-col gap-2">
//                            <Label htmlFor="name">Full Name</Label>
//                            <Input id="name" placeholder="Enter Your Name" required />
//                        </div>

//                        {/* EMAIL */}
//                        <div className="flex flex-col gap-2">
//                            <Label htmlFor="email">Email</Label>
//                            <Input id="email" type="email" placeholder="you@example.com" required />
//                        </div>

//                        {/* PASSWORD SECTION */}
//                        <div className="grid grid-cols-2 gap-4">

//                            {/* PASSWORD */}
//                            <div className="flex flex-col gap-2 relative">
//                                <Label htmlFor="password">Password</Label>
//                                <Input
//                                    id="password"
//                                    type={showPassword ? "text" : "password"}
//                                    placeholder="Create password"
//                                    required
//                                    className="pr-10"
//                                />
//                                <button
//                                    type="button"
//                                    onClick={() => setShowPassword(!showPassword)}
//                                    className="absolute right-3 top-9 text-muted-foreground"
//                                >
//                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                </button>
//                            </div>

//                            {/* CONFIRM PASSWORD */}
//                            <div className="flex flex-col gap-2 relative">
//                                <Label htmlFor="confirm">Confirm Password</Label>
//                                <Input
//                                    id="confirm"
//                                    type={showConfirmPassword ? "text" : "password"}
//                                    placeholder="Confirm password"
//                                    required
//                                    className="pr-10"
//                                />
//                                <button
//                                    type="button"
//                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                    className="absolute right-3 top-9 text-muted-foreground"
//                                >
//                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                </button>
//                            </div>

//                        </div>

//                        {/* ROLE */}
//                        <div className="flex flex-col gap-2">
//                            <Label>Role</Label>
//                            <Select value={role} onValueChange={setRole} required>
//                                <SelectTrigger>
//                                    <SelectValue placeholder="Select your role" />
//                                </SelectTrigger>
//                                <SelectContent>
//                                    <SelectItem value="student">Student</SelectItem>
//                                    <SelectItem value="personal">Personal</SelectItem>
//                                    <SelectItem value="hr">HR</SelectItem>
//                                    <SelectItem value="admin">Admin</SelectItem>
//                                </SelectContent>
//                            </Select>
//                        </div>

//                        {/* TERMS */}
//                        <div className="flex items-center gap-3">
//                            <Checkbox
//                                id="terms"
//                                checked={agreed}
//                                onCheckedChange={(checked) => setAgreed(checked === true)}
//                            />
//                            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
//                                I agree to the{" "}
//                                <Link href="#" className="text-primary hover:underline">
//                                    Terms & Conditions
//                                </Link>{" "}
//                                and{" "}
//                                <Link href="#" className="text-primary hover:underline">
//                                    Privacy Policy
//                                </Link>
//                            </Label>
//                        </div>

//                        {/* SUBMIT */}
//                        <Button type="submit" size="lg" className="mt-2 w-full" disabled={!agreed}>
//                            Create Account
//                        </Button>

//                    </form>
//                </div>
//            </div>
//        </div>
//    )
//}


//"use client"

//import React, { useState } from "react"
//import Link from "next/link"
//import { useRouter } from "next/navigation"
//import { Calendar, Eye, EyeOff } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"
//import {
//    Select,
//    SelectContent,
//    SelectItem,
//    SelectTrigger,
//    SelectValue
//} from "@/components/ui/select"
//import { Checkbox } from "@/components/ui/checkbox"
//import api from "@/lib/axios" // ✅ IMPORTANT

//export default function RegisterPage() {
//    const router = useRouter()

//    const [role, setRole] = useState("")
//    const [agreed, setAgreed] = useState(false)

//    const [showPassword, setShowPassword] = useState(false)
//    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

//    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//        e.preventDefault()

//        console.log("API:", process.env.NEXT_PUBLIC_API_URL) // ✅ debug

//        if (!agreed) return

//        const password = (document.getElementById("password") as HTMLInputElement).value
//        const confirmPassword = (document.getElementById("confirm") as HTMLInputElement).value

//        if (password !== confirmPassword) {
//            alert("Passwords do not match")
//            return
//        }

//        const formData = {
//            name: (document.getElementById("name") as HTMLInputElement).value,
//            email: (document.getElementById("email") as HTMLInputElement).value,
//            password: password,
//            role: role
//        }

//        console.log("Sending data:", formData)

//        try {
//            // ✅ AXIOS CALL (FINAL FIX)
//            const response = await api.post("/account/register", formData)

//            alert("Registration successful!")
//            router.push("/login")

//        } catch (err: any) {
//            console.error(err)

//            if (err.response) {
//                alert(err.response.data)
//            } else {
//                alert("Server not reachable ❌")
//            }
//        }
//    }

//    return (
//        <div className="flex min-h-screen">

//            {/* LEFT SIDE */}
//            <div className="hidden flex-1 items-center justify-center bg-primary/5 lg:flex">
//                <div className="mx-auto max-w-md px-8 text-center">
//                    <div className="mb-8 flex justify-center">
//                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
//                            <Calendar className="h-8 w-8 text-primary-foreground" />
//                        </div>
//                    </div>
//                    <h2 className="text-3xl font-bold">Join CalChat+</h2>
//                    <p className="mt-4 text-muted-foreground">
//                        Start your journey to smarter productivity.
//                    </p>
//                </div>
//            </div>

//            {/* RIGHT SIDE */}
//            <div className="flex flex-1 items-center justify-center px-4 py-12">
//                <div className="w-full max-w-md">

//                    <h1 className="text-2xl font-bold">Create your account</h1>

//                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">

//                        <Input id="name" placeholder="Name" required />
//                        <Input id="email" type="email" placeholder="Email" required />

//                        <Input
//                            id="password"
//                            type={showPassword ? "text" : "password"}
//                            placeholder="Password"
//                            required
//                        />

//                        <Input
//                            id="confirm"
//                            type={showConfirmPassword ? "text" : "password"}
//                            placeholder="Confirm Password"
//                            required
//                        />

//                        <Select value={role} onValueChange={setRole}>
//                            <SelectTrigger>
//                                <SelectValue placeholder="Select Role" />
//                            </SelectTrigger>
//                            <SelectContent>
//                                <SelectItem value="student">Student</SelectItem>
//                                <SelectItem value="personal">Personal</SelectItem>
//                                <SelectItem value="hr">HR</SelectItem>
//                                <SelectItem value="admin">Admin</SelectItem>
//                            </SelectContent>
//                        </Select>

//                        <div className="flex items-center gap-2">
//                            <Checkbox
//                                checked={agreed}
//                                onCheckedChange={(val) => setAgreed(val === true)}
//                            />
//                            <span>I agree to terms</span>
//                        </div>

//                        <Button type="submit" disabled={!agreed}>
//                            Register
//                        </Button>

//                    </form>
//                </div>
//            </div>
//        </div>
//    )
//}


"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import api from "@/lib/axios" // ✅ ADDED

export default function RegisterPage() {
    const router = useRouter()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState("student")
    const [agreed, setAgreed] = useState(false)

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)




    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!agreed) return

        if (password !== confirmPassword) {
            alert("Passwords do not match")
            return
        }

        const formData = { name, email, password, role }

        try {
            setLoading(true)

            const response = await api.post("/account/register", formData)

            alert("Registration successful ✅")
            router.push("/login")

        } catch (err: any) {
            console.error("ERROR 👉", err.response?.data)

            if (err.response?.data) {
                alert(JSON.stringify(err.response.data))
            } else {
                alert("Server not responding ❌")
            }
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="flex min-h-screen">

            {/* LEFT SIDE */}
            <div className="hidden flex-1 items-center justify-center bg-primary/5 lg:flex">
                <div className="mx-auto max-w-md px-8 text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                            <Calendar className="h-8 w-8 text-primary-foreground" />
                        </div>
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-foreground">Join CalChat+</h2>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                        Start your journey to smarter productivity. Set up your account in seconds.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">

                    <div className="mb-8 flex items-center gap-2 lg:hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                            <Calendar className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-heading text-xl font-bold text-foreground">CalChat+</span>
                    </div>

                    <h1 className="font-heading text-2xl font-bold text-foreground">Create your account</h1>
                    <p className="mt-2 text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">

                        {/* NAME */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            {/*<Input id="name" placeholder="Enter Your Name" required />*/}
                            <Input id="name" value={name} placeholder="Enter Your Name" onChange={(e) => setName(e.target.value)} />
                        </div>

                        {/* EMAIL */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>

                            {/*<Input id="email" type="email" placeholder="you@example.com" required />*/}
                            <Input id="email" value={email} type="email" placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        {/* PASSWORD SECTION */}
                        <div className="grid grid-cols-2 gap-4">

                            {/* PASSWORD */}
                            <div className="flex flex-col gap-2 relative">
                                <Label htmlFor="password">Password</Label>
                                {/*<Input*/}
                                {/*    id="password"*/}
                                {/*    type={showPassword ? "text" : "password"}*/}
                                {/*    placeholder="Create password"*/}
                                {/*    required*/}
                                {/*    className="pr-10"*/}
                                {/*/>*/}

                                <Input id="password" value={password} type={showPassword ? "text" : "password"}
                                    placeholder="Create password"
                                    required
                                    className="pr-10" onChange={(e) => setPassword(e.target.value)} />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-9 text-muted-foreground"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div className="flex flex-col gap-2 relative">
                                <Label htmlFor="confirm">Confirm Password</Label>
                                {/*<Input*/}
                                {/*    id="confirm"*/}
                                {/*    type={showConfirmPassword ? "text" : "password"}*/}
                                {/*    placeholder="Confirm password"*/}
                                {/*    required*/}
                                {/*    className="pr-10"*/}
                                {/*/>*/}

                                <Input id="confirm" value={confirmPassword} type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    required
                                    className="pr-10" onChange={(e) => setConfirmPassword(e.target.value)} />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-9 text-muted-foreground"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                        </div>

                        {/* ROLE */}
                        <div className="flex flex-col gap-2">
                            <Label>Role</Label>
                            <Select value={role} onValueChange={setRole} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="personal">Personal</SelectItem>
                                    <SelectItem value="hr">HR</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* TERMS */}
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="terms"
                                checked={agreed}
                                onCheckedChange={(checked) => setAgreed(checked === true)}
                            />
                            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                                I agree to the Terms & Conditions
                            </Label>
                        </div>

                        {/* SUBMIT */}
                        <Button type="submit" size="lg" className="mt-2 w-full" disabled={!agreed}>
                            Create Account
                        </Button>

                        <Button disabled={loading}>
                            {loading ? "Creating..." : "Create Account"}
                        </Button>

                    </form>
                </div>
            </div>
        </div>
    )
}