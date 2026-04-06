
//"use client"

//import Link from "next/link"
//import { Bell, LogOut, Menu, User, ArrowLeft } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"

//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

//import { useEffect, useState } from "react"

//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"
//import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


//interface DashboardHeaderProps {
//    onMenuClick: () => void
//    title: string
//}

//export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {

//    const [name, setName] = useState("")
//    const [email, setEmail] = useState("")
//    const [nickname, setNickname] = useState("")
//    const [mobile, setMobile] = useState("")
//    const [country, setCountry] = useState("")
//    const [gender, setGender] = useState("")
//    const [image, setImage] = useState<string | null>(null)

//    const [openProfile, setOpenProfile] = useState(false)


//    // LOAD PROFILE FROM BACKEND



//    useEffect(() => {

//        let isMounted = true

//        const loadProfile = async () => {

//            try {

//                const token = localStorage.getItem("token")

//                if (!token) return

//                const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {
//                    headers: {
//                        Authorization: `Bearer ${token}`,
//                        "Content-Type": "application/json"
//                    }
//                })

//                if (!res.ok) {
//                    const errText = await res.text()
//                    console.error("Profile API error:", res.status, errText)
//                    return
//                }

//                const data = await res.json()

//                if (!isMounted) return

//                setName(data.name || "")
//                setEmail(data.email || "")
//                setNickname(data.nickname || "")
//                setGender(data.gender || "")
//                setCountry(data.country || "")
//                setMobile(data.mobile || "")
//                setImage(data.profileImage || null)

//            } catch (error) {
//                console.error("Profile fetch failed:", error)
//            }
//        }

//        loadProfile()

//        return () => {
//            isMounted = false
//        }

//    }, [])


//    const initials = name
//        .split(" ")
//        .map((n) => n[0])
//        .join("")
//        .toUpperCase()


//    // IMAGE UPLOAD

//    const handleImageUpload = (e: any) => {

//        const file = e.target.files[0]

//        if (!file) return

//        const reader = new FileReader()

//        reader.onloadend = () => {

//            const result = reader.result as string
//            setImage(result)

//        }

//        reader.readAsDataURL(file)

//    }


//    // SAVE PROFILE TO BACKEND

//    const saveProfile = async () => {

//        try {

//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {

//                method: "PUT",

//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },

//                body: JSON.stringify({
//                    name,
//                    nickname,
//                    gender,
//                    country,
//                    mobile,
//                    profileImage: image
//                })

//            })

//            if (!res.ok) {
//                console.error("Update failed:", res.status)
//                return
//            }

//            setOpenProfile(false)

//        } catch (error) {

//            console.error("Profile update failed:", error)

//        }

//    }



//    return (

//        <>

//            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-lg lg:px-6">

//                <div className="flex items-center gap-3">

//                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
//                        <Menu className="h-5 w-5" />
//                    </Button>

//                    <h1 className="font-heading text-lg font-semibold text-foreground">
//                        {title}
//                    </h1>

//                </div>

//                <div className="flex items-center gap-2">

//                    <ThemeToggle />

//                    <Button variant="ghost" size="icon" className="relative h-9 w-9">
//                        <Bell className="h-4 w-4" />
//                        <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary" />
//                    </Button>

//                    <DropdownMenu>

//                        <DropdownMenuTrigger asChild>

//                            <Button variant="ghost" className="h-9 gap-2 px-2">

//                                <Avatar className="h-7 w-7">

//                                    {image ? (
//                                        <AvatarImage src={image} />
//                                    ) : (
//                                        <AvatarFallback className="bg-primary/10 text-xs text-primary">
//                                            {initials || "U"}
//                                        </AvatarFallback>
//                                    )}

//                                </Avatar>

//                                <span className="hidden text-sm md:inline-block">
//                                    {name || "User"}
//                                </span>

//                            </Button>

//                        </DropdownMenuTrigger>

//                        <DropdownMenuContent align="end" className="w-48">

//                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
//                                <User className="mr-2 h-4 w-4" /> Profile
//                            </DropdownMenuItem>

//                            <DropdownMenuSeparator />

//                            <DropdownMenuItem asChild>
//                                <Link href="/">
//                                    <LogOut className="mr-2 h-4 w-4" /> Logout
//                                </Link>
//                            </DropdownMenuItem>

//                        </DropdownMenuContent>

//                    </DropdownMenu>

//                </div>

//            </header>


//            {/* PROFILE MODAL */}

//            <Dialog open={openProfile} onOpenChange={setOpenProfile}>

//                <DialogContent className="max-w-3xl">

//                    <div className="space-y-6">


//                        {/* HEADER */}

//                        <div className="flex items-center gap-3">

//                            <Button
//                                variant="ghost"
//                                size="icon"
//                                onClick={() => setOpenProfile(false)}
//                            >

//                                <ArrowLeft className="h-4 w-4" />

//                            </Button>

//                            <h2 className="text-lg font-semibold">
//                                Profile Settings
//                            </h2>

//                        </div>


//                        {/* PROFILE TOP */}

//                        <div className="flex items-center gap-4">

//                            <label className="cursor-pointer">

//                                <Avatar className="h-16 w-16">

//                                    {image ? (
//                                        <AvatarImage src={image} />
//                                    ) : (
//                                        <AvatarFallback className="text-lg">
//                                            {initials || "U"}
//                                        </AvatarFallback>
//                                    )}

//                                </Avatar>

//                                <input
//                                    type="file"
//                                    accept="image/*"
//                                    className="hidden"
//                                    onChange={handleImageUpload}
//                                />

//                            </label>

//                            <div>

//                                <p className="font-semibold">{name || "User"}</p>

//                                <p className="text-sm text-muted-foreground">
//                                    {email || "user@email.com"}
//                                </p>

//                            </div>

//                        </div>


//                        {/* FORM */}

//                        <div className="grid grid-cols-2 gap-4">

//                            <div className="space-y-2">
//                                <Label>Full Name</Label>
//                                <Input value={name} onChange={(e) => setName(e.target.value)} />
//                            </div>

//                            <div className="space-y-2">
//                                <Label>Nick Name</Label>
//                                <Input value={nickname} onChange={(e) => setNickname(e.target.value)} />
//                            </div>


//                            {/* GENDER */}

//                            <div className="space-y-2 col-span-2">

//                                <Label>Gender</Label>

//                                <div className="flex gap-6">

//                                    <label className="flex items-center gap-2">
//                                        <input
//                                            type="radio"
//                                            name="gender"
//                                            value="Male"
//                                            checked={gender === "Male"}
//                                            onChange={(e) => setGender(e.target.value)}
//                                        />
//                                        Male
//                                    </label>

//                                    <label className="flex items-center gap-2">
//                                        <input
//                                            type="radio"
//                                            name="gender"
//                                            value="Female"
//                                            checked={gender === "Female"}
//                                            onChange={(e) => setGender(e.target.value)}
//                                        />
//                                        Female
//                                    </label>

//                                    <label className="flex items-center gap-2">
//                                        <input
//                                            type="radio"
//                                            name="gender"
//                                            value="Other"
//                                            checked={gender === "Other"}
//                                            onChange={(e) => setGender(e.target.value)}
//                                        />
//                                        Other
//                                    </label>

//                                </div>

//                            </div>

//                            <div className="space-y-2">
//                                <Label>Mobile Number</Label>
//                                <Input value={mobile} onChange={(e) => setMobile(e.target.value)} />
//                            </div>

//                            <div className="space-y-2">
//                                <Label>Country</Label>
//                                <Input value={country} onChange={(e) => setCountry(e.target.value)} />
//                            </div>

//                        </div>


//                        {/* EMAIL */}

//                        <div className="space-y-2">

//                            <Label>Email Address</Label>

//                            <Input
//                                type="email"
//                                value={email}
//                                onChange={(e) => setEmail(e.target.value)}
//                            />

//                        </div>


//                        {/* SAVE */}

//                        <div className="flex justify-end">

//                            <Button onClick={saveProfile}>
//                                Save Changes
//                            </Button>

//                        </div>

//                    </div>

//                </DialogContent>
//                <DialogHeader>
//                    <VisuallyHidden>
//                        <DialogTitle>Profile Settings</DialogTitle>
//                    </VisuallyHidden>
//                </DialogHeader>


//            </Dialog>

//        </>

//    )

//}











//"use client"

//import Link from "next/link"
//import { Bell, LogOut, Menu, User, ArrowLeft } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"

//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import { useEffect, useState } from "react"

//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"
//import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

//interface DashboardHeaderProps {
//    onMenuClick: () => void
//    title: string
//}

//interface CalendarEvent {
//    id: string
//    title: string
//    date: string
//    time: string
//    reminderMinutes?: number
//}

//const API_URL = "https://steadfast-warmth-production-31cc.up.railway.app/api/CalendarEvents"

//function formatDate(date: Date) {
//    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
//}

//function formatTime(time: string) {
//    const [hour, minute] = time.split(":")
//    const h = Number(hour)
//    const ampm = h >= 12 ? "PM" : "AM"
//    const formattedHour = h % 12 || 12
//    return `${formattedHour}:${minute} ${ampm}`
//}

//export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {

//    const [name, setName] = useState("")
//    const [email, setEmail] = useState("")
//    const [image, setImage] = useState<string | null>(null)

//    const [openProfile, setOpenProfile] = useState(false)

//    // 🔔 NOTIFICATION STATES
//    const [events, setEvents] = useState<CalendarEvent[]>([])
//    const [notifications, setNotifications] = useState<any[]>([])
//    const [showNotifications, setShowNotifications] = useState(false)
//    const [triggeredEvents, setTriggeredEvents] = useState<Set<string>>(new Set())

//    // PROFILE LOAD
//    useEffect(() => {
//        const loadProfile = async () => {
//            const token = localStorage.getItem("token")
//            if (!token) return

//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()
//            setName(data.name || "")
//            setEmail(data.email || "")
//            setImage(data.profileImage || null)
//        }

//        loadProfile()
//    }, [])

//    // 🔥 FETCH CALENDAR EVENTS
//    useEffect(() => {
//        const fetchEvents = async () => {
//            const token = localStorage.getItem("token")

//            const res = await fetch(API_URL, {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()

//            const formatted = data.map((e: any) => ({
//                ...e,
//                date: e.date.split("T")[0]
//            }))

//            setEvents(formatted)
//        }

//        fetchEvents()
//    }, [])

//    // 🔥 NOTIFICATION LOGIC (GLOBAL)
//    useEffect(() => {

//        if (Notification.permission === "default") {
//            Notification.requestPermission()
//        }

//        const interval = setInterval(() => {

//            const now = new Date()
//            const todayStr = formatDate(now)

//            events.forEach(event => {

//                if (event.date !== todayStr) return
//                if (triggeredEvents.has(event.id)) return

//                const eventTime = new Date(`${event.date}T${event.time}`)
//                const reminderTime = new Date(
//                    eventTime.getTime() - (event.reminderMinutes || 0) * 60000
//                )

//                const diff = Math.abs(now.getTime() - reminderTime.getTime())

//                if (diff <= 20000) {

//                    const message = `${event.title} at ${formatTime(event.time)}`

//                    if (Notification.permission === "granted") {
//                        new Notification("Upcoming Event", { body: message })
//                    }

//                    setNotifications(prev => [
//                        { id: crypto.randomUUID(), text: message },
//                        ...prev
//                    ])

//                    setTriggeredEvents(prev => new Set(prev).add(event.id))
//                }

//            })

//        }, 15000)

//        return () => clearInterval(interval)

//    }, [events, triggeredEvents])

//    const initials = name
//        .split(" ")
//        .map((n) => n[0])
//        .join("")
//        .toUpperCase()

//    return (
//        <>
//            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">

//                <div className="flex items-center gap-3">
//                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
//                        <Menu className="h-5 w-5" />
//                    </Button>
//                    <h1 className="font-semibold">{title}</h1>
//                </div>

//                <div className="flex items-center gap-2">

//                    <ThemeToggle />

//                    {/* 🔔 NOTIFICATION BELL */}
//                    <div className="relative">

//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            onClick={() => setShowNotifications(!showNotifications)}
//                        >
//                            <Bell className="h-4 w-4" />

//                            {notifications.length > 0 && (
//                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
//                                    {notifications.length}
//                                </span>
//                            )}
//                        </Button>

//                        {showNotifications && (
//                            <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow p-3 z-50">

//                                <h4 className="font-semibold mb-2">Notifications</h4>

//                                {notifications.length === 0 && (
//                                    <p className="text-sm text-gray-500">No reminders</p>
//                                )}

//                                {notifications.map(n => (
//                                    <div key={n.id} className="text-sm border-b py-1">
//                                        {n.text}
//                                    </div>
//                                ))}

//                            </div>
//                        )}

//                    </div>

//                    {/* USER */}
//                    <DropdownMenu>
//                        <DropdownMenuTrigger asChild>
//                            <Button variant="ghost" className="gap-2">
//                                <Avatar className="h-7 w-7">
//                                    {image ? (
//                                        <AvatarImage src={image} />
//                                    ) : (
//                                        <AvatarFallback>{initials}</AvatarFallback>
//                                    )}
//                                </Avatar>
//                                {name}
//                            </Button>
//                        </DropdownMenuTrigger>

//                        <DropdownMenuContent align="end">
//                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
//                                <User className="mr-2 h-4 w-4" /> Profile
//                            </DropdownMenuItem>
//                            <DropdownMenuSeparator />
//                            <DropdownMenuItem asChild>
//                                <Link href="/">Logout</Link>
//                            </DropdownMenuItem>
//                        </DropdownMenuContent>
//                    </DropdownMenu>

//                </div>
//            </header>

//            {/* PROFILE MODAL (same as before) */}
//            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
//                <DialogContent>
//                    <DialogHeader>
//                        <DialogTitle>Profile Settings</DialogTitle>
//                    </DialogHeader>
//                    <Input value={name} onChange={(e) => setName(e.target.value)} />
//                    <Button onClick={() => setOpenProfile(false)}>Save</Button>
//                </DialogContent>
//            </Dialog>
//        </>
//    )
//}





//"use client"

//import Link from "next/link"
//import { Bell, LogOut, Menu, User } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"

//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import { useEffect, useState } from "react"

//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"

//interface DashboardHeaderProps {
//    onMenuClick: () => void
//    title: string
//}

//interface CalendarEvent {
//    id: string
//    title: string
//    date: string
//    time: string
//    reminderMinutes?: number
//}

//const API_URL = "https://steadfast-warmth-production-31cc.up.railway.app/api/CalendarEvents"

//function formatDate(date: Date) {
//    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
//}

//function formatTime(time: string) {
//    const [hour, minute] = time.split(":")
//    const h = Number(hour)
//    const ampm = h >= 12 ? "PM" : "AM"
//    const formattedHour = h % 12 || 12
//    return `${formattedHour}:${minute} ${ampm}`
//}

//export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {

//    const [name, setName] = useState("")
//    const [email, setEmail] = useState("")
//    const [image, setImage] = useState<string | null>(null)
//    const [openProfile, setOpenProfile] = useState(false)

//    // 🔔 NOTIFICATION STATES
//    const [events, setEvents] = useState<CalendarEvent[]>([])
//    const [notifications, setNotifications] = useState<any[]>([])
//    const [showNotifications, setShowNotifications] = useState(false)
//    const [triggeredEvents, setTriggeredEvents] = useState<Set<string>>(new Set())

//    // ✅ LOAD PROFILE
//    useEffect(() => {
//        const loadProfile = async () => {
//            const token = localStorage.getItem("token")
//            if (!token) return

//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()
//            setName(data.name || "")
//            setEmail(data.email || "")
//            setImage(data.profileImage || null)
//        }

//        loadProfile()
//    }, [])

//    // ✅ FETCH EVENTS (AUTO REFRESH)
//    useEffect(() => {
//        const fetchEvents = async () => {
//            try {
//                const token = localStorage.getItem("token")

//                const res = await fetch(API_URL, {
//                    headers: { Authorization: `Bearer ${token}` }
//                })

//                const data = await res.json()

//                const formatted = data.map((e: any) => ({
//                    ...e,
//                    date: e.date.split("T")[0]
//                }))

//                setEvents(formatted)
//            } catch (err) {
//                console.error("Event fetch error:", err)
//            }
//        }

//        fetchEvents()

//        const interval = setInterval(fetchEvents, 30000) // refresh every 30 sec

//        return () => clearInterval(interval)
//    }, [])

//    // 🔥 GLOBAL NOTIFICATION LOGIC
//    useEffect(() => {

//        if (Notification.permission === "default") {
//            Notification.requestPermission()
//        }

//        const interval = setInterval(() => {

//            const now = new Date()
//            const todayStr = formatDate(now)

//            events.forEach(event => {

//                if (event.date !== todayStr) return
//                if (triggeredEvents.has(event.id)) return

//                // ✅ FIX TIME FORMAT
//                const cleanTime = event.time.substring(0, 5)

//                const eventTime = new Date(`${event.date}T${cleanTime}`)

//                const reminderTime = new Date(
//                    eventTime.getTime() - (event.reminderMinutes || 0) * 60000
//                )

//                const diff = Math.abs(now.getTime() - reminderTime.getTime())

//                // 🧠 DEBUG (optional)
//                console.log("Checking:", event.title, diff)

//                // ✅ FIX WINDOW (1 min)
//                if (diff <= 60000) {

//                    const message = `${event.title} at ${formatTime(cleanTime)}`

//                    console.log("🔥 TRIGGERED:", message)

//                    if (Notification.permission === "granted") {
//                        new Notification("Upcoming Event", { body: message })
//                    }

//                    setNotifications(prev => [
//                        { id: crypto.randomUUID(), text: message },
//                        ...prev
//                    ])

//                    setTriggeredEvents(prev => new Set(prev).add(event.id))
//                }

//            })

//        }, 10000) // check every 10 sec

//        return () => clearInterval(interval)

//    }, [events, triggeredEvents])

//    const initials = name
//        .split(" ")
//        .map((n) => n[0])
//        .join("")
//        .toUpperCase()

//    return (
//        <>
//            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">

//                <div className="flex items-center gap-3">
//                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
//                        <Menu className="h-5 w-5" />
//                    </Button>
//                    <h1 className="font-semibold">{title}</h1>
//                </div>

//                <div className="flex items-center gap-2">

//                    <ThemeToggle />

//                    {/* 🔔 NOTIFICATION */}
//                    <div className="relative">

//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            onClick={() => setShowNotifications(!showNotifications)}
//                        >
//                            <Bell className="h-4 w-4" />

//                            {notifications.length > 0 && (
//                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
//                                    {notifications.length}
//                                </span>
//                            )}
//                        </Button>

//                        {showNotifications && (
//                            <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow p-3 z-50">

//                                <h4 className="font-semibold mb-2">Notifications</h4>

//                                {notifications.length === 0 && (
//                                    <p className="text-sm text-gray-500">No reminders</p>
//                                )}

//                                {notifications.map(n => (
//                                    <div key={n.id} className="text-sm border-b py-1">
//                                        {n.text}
//                                    </div>
//                                ))}

//                            </div>
//                        )}

//                    </div>

//                    {/* USER */}
//                    <DropdownMenu>
//                        <DropdownMenuTrigger asChild>
//                            <Button variant="ghost" className="gap-2">
//                                <Avatar className="h-7 w-7">
//                                    {image ? (
//                                        <AvatarImage src={image} />
//                                    ) : (
//                                        <AvatarFallback>{initials}</AvatarFallback>
//                                    )}
//                                </Avatar>
//                                {name}
//                            </Button>
//                        </DropdownMenuTrigger>

//                        <DropdownMenuContent align="end">
//                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
//                                <User className="mr-2 h-4 w-4" /> Profile
//                            </DropdownMenuItem>
//                            <DropdownMenuSeparator />
//                            <DropdownMenuItem asChild>
//                                <Link href="/">Logout</Link>
//                            </DropdownMenuItem>
//                        </DropdownMenuContent>
//                    </DropdownMenu>

//                </div>
//            </header>

//            {/* PROFILE */}
//            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
//                <DialogContent>
//                    <DialogHeader>
//                        <DialogTitle>Profile</DialogTitle>
//                    </DialogHeader>

//                    <Input value={name} onChange={(e) => setName(e.target.value)} />
//                    <Button onClick={() => setOpenProfile(false)}>Save</Button>
//                </DialogContent>
//            </Dialog>
//        </>
//    )
//}

//"use client"

//import Link from "next/link"
//import { Bell, Menu, User } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"

//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import { useEffect, useState } from "react"

//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"

///* ---------------- TYPES ---------------- */

//interface DashboardHeaderProps {
//    onMenuClick: () => void
//    title: string
//}

//interface CalendarEvent {
//    id: string
//    title: string
//    date: string
//    time: string
//    reminderMinutes?: number
//}

//interface ChatNotification {
//    id: number
//    fromUserName: string
//    content: string
//    status: string
//}

///* ---------------- CONSTANT ---------------- */

//const EVENT_API = "https://steadfast-warmth-production-31cc.up.railway.app/api/CalendarEvents"

///* ---------------- HELPERS ---------------- */

//function formatDate(date: Date) {
//    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
//}

//function formatTime(time: string) {
//    const [hour, minute] = time.split(":")
//    const h = Number(hour)
//    const ampm = h >= 12 ? "PM" : "AM"
//    const formattedHour = h % 12 || 12
//    return `${formattedHour}:${minute} ${ampm}`
//}

///* ---------------- COMPONENT ---------------- */

//export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {

//    const [name, setName] = useState("")
//    const [image, setImage] = useState<string | null>(null)
//    const [openProfile, setOpenProfile] = useState(false)

//    /* 🔔 STATES */
//    const [events, setEvents] = useState<CalendarEvent[]>([])
//    const [calendarNotifs, setCalendarNotifs] = useState<string[]>([])
//    const [chatNotifs, setChatNotifs] = useState<ChatNotification[]>([])
//    const [showNotifications, setShowNotifications] = useState(false)
//    const [triggeredEvents, setTriggeredEvents] = useState<Set<string>>(new Set())

//    const currentUserId =
//        typeof window !== "undefined"
//            ? localStorage.getItem("userId") ?? ""
//            : ""

//    /* ---------------- PROFILE ---------------- */

//    useEffect(() => {
//        const loadProfile = async () => {
//            const token = localStorage.getItem("token")
//            if (!token) return

//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()
//            setName(data.name || "")
//            setImage(data.profileImage || null)
//        }

//        loadProfile()
//    }, [])

//    /* ---------------- FETCH EVENTS ---------------- */

//    useEffect(() => {
//        const fetchEvents = async () => {
//            try {
//                const token = localStorage.getItem("token")

//                const res = await fetch(EVENT_API, {
//                    headers: { Authorization: `Bearer ${token}` }
//                })

//                const data = await res.json()

//                const formatted = data.map((e: any) => ({
//                    ...e,
//                    date: e.date.split("T")[0]
//                }))

//                setEvents(formatted)
//            } catch {
//                setEvents([])
//            }
//        }

//        fetchEvents()
//        const interval = setInterval(fetchEvents, 30000)

//        return () => clearInterval(interval)
//    }, [])

//    /* ---------------- CALENDAR NOTIFICATION ---------------- */

//    useEffect(() => {

//        if (Notification.permission === "default") {
//            Notification.requestPermission()
//        }

//        const interval = setInterval(() => {

//            const now = new Date()
//            const todayStr = formatDate(now)

//            events.forEach(event => {

//                if (event.date !== todayStr) return
//                if (triggeredEvents.has(event.id)) return

//                const cleanTime = event.time.substring(0, 5)
//                const eventTime = new Date(`${event.date}T${cleanTime}`)

//                const reminderTime = new Date(
//                    eventTime.getTime() - (event.reminderMinutes || 0) * 60000
//                )

//                const diff = Math.abs(now.getTime() - reminderTime.getTime())

//                if (diff <= 60000) {

//                    const message = `${event.title} at ${formatTime(cleanTime)}`

//                    if (Notification.permission === "granted") {
//                        new Notification("📅 Event Reminder", { body: message })
//                    }

//                    setCalendarNotifs(prev => [message, ...prev])
//                    setTriggeredEvents(prev => new Set(prev).add(event.id))
//                }

//            })

//        }, 10000)

//        return () => clearInterval(interval)

//    }, [events, triggeredEvents])

//    /* ---------------- CHAT NOTIFICATION (FROM GROUP STUDY) ---------------- */

//    useEffect(() => {

//        if (!currentUserId) return

//        const fetchNotifications = async () => {
//            try {

//                const res = await fetch(
//                    `https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/${currentUserId}`
//                )

//                const data = await res.json()

//                setChatNotifs(data)

//            } catch {
//                setChatNotifs([])
//            }
//        }

//        fetchNotifications()

//        const interval = setInterval(fetchNotifications, 5000)

//        return () => clearInterval(interval)

//    }, [currentUserId])

//    const totalCount = calendarNotifs.length + chatNotifs.length

//    const initials = name
//        .split(" ")
//        .map(n => n[0])
//        .join("")
//        .toUpperCase()

//    /* ---------------- UI ---------------- */

//    return (
//        <>
//            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">

//                <div className="flex items-center gap-3">
//                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
//                        <Menu className="h-5 w-5" />
//                    </Button>
//                    <h1 className="font-semibold">{title}</h1>
//                </div>

//                <div className="flex items-center gap-2">

//                    <ThemeToggle />

//                    {/* 🔔 BELL */}
//                    <div className="relative">

//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            onClick={() => setShowNotifications(!showNotifications)}
//                        >
//                            <Bell className="h-4 w-4" />

//                            {totalCount > 0 && (
//                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
//                                    {totalCount}
//                                </span>
//                            )}
//                        </Button>

//                        {showNotifications && (
//                            <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow p-3 z-50">

//                                <h4 className="font-semibold mb-2">Notifications</h4>

//                                {/* CALENDAR */}
//                                {calendarNotifs.map((msg, i) => (
//                                    <div key={i} className="text-sm border-b py-1">
//                                        📅 {msg}
//                                    </div>
//                                ))}

//                                {/* CHAT */}
//                                {chatNotifs.map(n => (
//                                    <div key={n.id} className="text-sm border-b py-1">
//                                        💬 <b>{n.fromUserName}</b> {n.content}
//                                    </div>
//                                ))}

//                                {totalCount === 0 && (
//                                    <p className="text-sm text-gray-500">No notifications</p>
//                                )}

//                            </div>
//                        )}

//                    </div>

//                    {/* USER */}
//                    <DropdownMenu>
//                        <DropdownMenuTrigger asChild>
//                            <Button variant="ghost" className="gap-2">
//                                <Avatar className="h-7 w-7">
//                                    {image ? (
//                                        <AvatarImage src={image} />
//                                    ) : (
//                                        <AvatarFallback>{initials}</AvatarFallback>
//                                    )}
//                                </Avatar>
//                                {name}
//                            </Button>
//                        </DropdownMenuTrigger>

//                        <DropdownMenuContent align="end">
//                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
//                                <User className="mr-2 h-4 w-4" /> Profile
//                            </DropdownMenuItem>
//                            <DropdownMenuSeparator />
//                            <DropdownMenuItem asChild>
//                                <Link href="/">Logout</Link>
//                            </DropdownMenuItem>
//                        </DropdownMenuContent>
//                    </DropdownMenu>

//                </div>
//            </header>

//            {/* PROFILE */}
//            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
//                <DialogContent>
//                    <DialogHeader>
//                        <DialogTitle>Profile</DialogTitle>
//                    </DialogHeader>

//                    <Input value={name} onChange={(e) => setName(e.target.value)} />
//                    <Button onClick={() => setOpenProfile(false)}>Save</Button>
//                </DialogContent>
//            </Dialog>
//        </>
//    )
//}




//"use client"

//import Link from "next/link"
//import { Bell, Menu, User } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"

//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import { useEffect, useState } from "react"

//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"

///* ---------------- TYPES ---------------- */

//interface DashboardHeaderProps {
//    onMenuClick: () => void
//    title: string
//}

//interface CalendarEvent {
//    id: string
//    title: string
//    date: string
//    time: string
//    reminderMinutes?: number
//}

//interface Notification {
//    id: number
//    fromUserId: string
//    fromUserName: string
//    toUserId: string
//    content: string
//    status: string
//}

//interface Student {
//    id: string
//    name: string
//}

///* ---------------- CONSTANT ---------------- */

//const EVENT_API = "https://steadfast-warmth-production-31cc.up.railway.app/api/CalendarEvents"

///* ---------------- HELPERS ---------------- */

//function formatDate(date: Date) {
//    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
//}

//function formatTime(time: string) {
//    const [hour, minute] = time.split(":")
//    const h = Number(hour)
//    const ampm = h >= 12 ? "PM" : "AM"
//    const formattedHour = h % 12 || 12
//    return `${formattedHour}:${minute} ${ampm}`
//}

///* ---------------- COMPONENT ---------------- */

//export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {

//    const [name, setName] = useState("")
//    const [image, setImage] = useState<string | null>(null)
//    const [openProfile, setOpenProfile] = useState(false)

//    /* 🔔 STATES */
//    const [events, setEvents] = useState<CalendarEvent[]>([])
//    const [calendarNotifs, setCalendarNotifs] = useState<string[]>([])
//    const [chatNotifs, setChatNotifs] = useState<Notification[]>([])
//    const [students, setStudents] = useState<Student[]>([])
//    const [showNotifications, setShowNotifications] = useState(false)
//    const [triggeredEvents, setTriggeredEvents] = useState<Set<string>>(new Set())

//    const currentUserId =
//        typeof window !== "undefined"
//            ? localStorage.getItem("userId") ?? ""
//            : ""

//    /* ---------------- PROFILE ---------------- */

//    useEffect(() => {
//        const loadProfile = async () => {
//            const token = localStorage.getItem("token")
//            if (!token) return

//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()
//            setName(data.name || "")
//            setImage(data.profileImage || null)
//        }

//        loadProfile()
//    }, [])

//    /* ---------------- FETCH STUDENTS (IMPORTANT FIX) ---------------- */

//    useEffect(() => {
//        fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/users/students")
//            .then(res => res.json())
//            .then(setStudents)
//            .catch(() => setStudents([]))
//    }, [])

//    /* ---------------- FETCH EVENTS ---------------- */

//    useEffect(() => {
//        const fetchEvents = async () => {
//            try {
//                const token = localStorage.getItem("token")

//                const res = await fetch(EVENT_API, {
//                    headers: { Authorization: `Bearer ${token}` }
//                })

//                const data = await res.json()

//                const formatted = data.map((e: any) => ({
//                    ...e,
//                    date: e.date.split("T")[0]
//                }))

//                setEvents(formatted)
//            } catch {
//                setEvents([])
//            }
//        }

//        fetchEvents()
//        const interval = setInterval(fetchEvents, 30000)

//        return () => clearInterval(interval)
//    }, [])

//    /* ---------------- CALENDAR NOTIFICATION ---------------- */

//    useEffect(() => {

//        if (Notification.permission === "default") {
//            Notification.requestPermission()
//        }

//        const interval = setInterval(() => {

//            const now = new Date()
//            const todayStr = formatDate(now)

//            events.forEach(event => {

//                if (event.date !== todayStr) return
//                if (triggeredEvents.has(event.id)) return

//                const cleanTime = event.time.substring(0, 5)
//                const eventTime = new Date(`${event.date}T${cleanTime}`)

//                const reminderTime = new Date(
//                    eventTime.getTime() - (event.reminderMinutes || 0) * 60000
//                )

//                const diff = Math.abs(now.getTime() - reminderTime.getTime())

//                if (diff <= 60000) {

//                    const message = `${event.title} at ${formatTime(cleanTime)}`

//                    if (Notification.permission === "granted") {
//                        new Notification("📅 Event Reminder", { body: message })
//                    }

//                    setCalendarNotifs(prev => [message, ...prev])
//                    setTriggeredEvents(prev => new Set(prev).add(event.id))
//                }

//            })

//        }, 10000)

//        return () => clearInterval(interval)

//    }, [events, triggeredEvents])

//    /* ---------------- FETCH CHAT NOTIFICATIONS ---------------- */

//    const fetchNotifications = async () => {
//        try {
//            const res = await fetch(
//                `https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/${currentUserId}`
//            )
//            const data = await res.json()
//            setChatNotifs(data)
//        } catch {
//            setChatNotifs([])
//        }
//    }

//    useEffect(() => {

//        if (!currentUserId) return

//        fetchNotifications()

//        const interval = setInterval(fetchNotifications, 5000)

//        return () => clearInterval(interval)

//    }, [currentUserId])

//    /* ---------------- ACCEPT / REJECT ---------------- */

//    const handleRequest = async (notifId: number, status: string) => {

//        await fetch(`https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/${notifId}`, {
//            method: "PUT",
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify(status)
//        })

//        fetchNotifications()
//    }

//    /* ---------------- NAME FIX FUNCTION ---------------- */

//    const getUserName = (n: Notification) => {

//        if (n.fromUserName && n.fromUserName !== "Student")
//            return n.fromUserName

//        const user = students.find(s => s.id === n.fromUserId)

//        return user?.name || "Student"
//    }

//    const totalCount = calendarNotifs.length + chatNotifs.length

//    const initials = name
//        .split(" ")
//        .map(n => n[0])
//        .join("")
//        .toUpperCase()

//    /* ---------------- UI ---------------- */

//    return (
//        <>
//            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">

//                <div className="flex items-center gap-3">
//                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
//                        <Menu className="h-5 w-5" />
//                    </Button>
//                    <h1 className="font-semibold">{title}</h1>
//                </div>

//                <div className="flex items-center gap-2">

//                    <ThemeToggle />

//                    {/* 🔔 NOTIFICATIONS */}
//                    <div className="relative">

//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            onClick={() => setShowNotifications(!showNotifications)}
//                        >
//                            <Bell className="h-4 w-4" />

//                            {totalCount > 0 && (
//                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
//                                    {totalCount}
//                                </span>
//                            )}
//                        </Button>

//                        {showNotifications && (
//                            <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow p-3 z-50">

//                                <h4 className="font-semibold mb-2">Notifications</h4>

//                                {/* 📅 EVENTS */}
//                                {calendarNotifs.map((msg, i) => (
//                                    <div key={i} className="text-sm border-b py-1">
//                                        📅 {msg}
//                                    </div>
//                                ))}

//                                {/* 💬 REQUESTS */}
//                                {chatNotifs.map(n => (
//                                    <div key={n.id} className="text-sm border-b py-2">

//                                        <p>
//                                            <b>{getUserName(n)}</b> {n.content}
//                                        </p>

//                                        {n.status === "pending" && (
//                                            <div className="flex gap-2 mt-2">

//                                                <Button
//                                                    size="sm"
//                                                    onClick={() => handleRequest(n.id, "accepted")}
//                                                >
//                                                    Accept
//                                                </Button>

//                                                <Button
//                                                    size="sm"
//                                                    variant="destructive"
//                                                    onClick={() => handleRequest(n.id, "rejected")}
//                                                >
//                                                    Reject
//                                                </Button>

//                                            </div>
//                                        )}

//                                    </div>
//                                ))}

//                                {totalCount === 0 && (
//                                    <p className="text-sm text-gray-500">No notifications</p>
//                                )}

//                            </div>
//                        )}

//                    </div>

//                    {/* USER */}
//                    <DropdownMenu>
//                        <DropdownMenuTrigger asChild>
//                            <Button variant="ghost" className="gap-2">
//                                <Avatar className="h-7 w-7">
//                                    {image ? (
//                                        <AvatarImage src={image} />
//                                    ) : (
//                                        <AvatarFallback>{initials}</AvatarFallback>
//                                    )}
//                                </Avatar>
//                                {name}
//                            </Button>
//                        </DropdownMenuTrigger>

//                        <DropdownMenuContent align="end">
//                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
//                                <User className="mr-2 h-4 w-4" /> Profile
//                            </DropdownMenuItem>
//                            <DropdownMenuSeparator />
//                            <DropdownMenuItem asChild>
//                                <Link href="/">Logout</Link>
//                            </DropdownMenuItem>
//                        </DropdownMenuContent>
//                    </DropdownMenu>

//                </div>
//            </header>

//            {/* PROFILE */}
//            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
//                <DialogContent>
//                    <DialogHeader>
//                        <DialogTitle>Profile</DialogTitle>
//                    </DialogHeader>

//                    <Input value={name} onChange={(e) => setName(e.target.value)} />
//                    <Button onClick={() => setOpenProfile(false)}>Save</Button>
//                </DialogContent>
//            </Dialog>
//        </>
//    )
//}





//"use client"

//import Link from "next/link"
//import { Bell, Menu, User, Video } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"

//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import { useEffect, useState } from "react"

//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"

///* ---------------- TYPES ---------------- */

//interface DashboardHeaderProps {
//    onMenuClick: () => void
//    title: string
//}

//interface Notification {
//    id: number
//    fromUserId: string
//    fromUserName: string
//    toUserId: string
//    content: string
//    status: string
//}

//interface Meeting {
//    id: string
//    title: string
//    startTime: string
//    meetingLink: string
//    participants: string[]
//}

//interface Student {
//    id: string
//    name: string
//}

///* ---------------- COMPONENT ---------------- */

//export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {

//    const [name, setName] = useState("")
//    const [image, setImage] = useState<string | null>(null)
//    const [openProfile, setOpenProfile] = useState(false)

//    const [chatNotifs, setChatNotifs] = useState<Notification[]>([])
//    const [meetingNotifs, setMeetingNotifs] = useState<Meeting[]>([])
//    const [students, setStudents] = useState<Student[]>([])
//    const [showNotifications, setShowNotifications] = useState(false)

//    const currentUserId =
//        typeof window !== "undefined"
//            ? localStorage.getItem("userId") ?? ""
//            : ""

//    /* ---------------- PROFILE ---------------- */

//    useEffect(() => {
//        const loadProfile = async () => {
//            const token = localStorage.getItem("token")
//            if (!token) return

//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()
//            setName(data.name || "")
//            setImage(data.profileImage || null)
//        }

//        loadProfile()
//    }, [])

//    /* ---------------- STUDENTS ---------------- */

//    useEffect(() => {
//        fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/users/students")
//            .then(res => res.json())
//            .then(setStudents)
//            .catch(() => setStudents([]))
//    }, [])

//    /* ---------------- CHAT NOTIFICATIONS ---------------- */

//    const fetchNotifications = async () => {
//        try {
//            const res = await fetch(
//                `https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/${currentUserId}`
//            )
//            const data = await res.json()
//            setChatNotifs(data)
//        } catch {
//            setChatNotifs([])
//        }
//    }

//    /* ---------------- MEETING NOTIFICATIONS ---------------- */

//    const fetchMeetings = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/meeting/my-meetings", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()

//            const now = new Date()

//            // sirf upcoming meetings
//            const upcoming = data.filter(
//                (m: Meeting) =>
//                    new Date(m.startTime) > now &&
//                    m.participants.includes(currentUserId)
//            )

//            setMeetingNotifs(upcoming)

//        } catch {
//            setMeetingNotifs([])
//        }
//    }

//    /* ---------------- POLLING ---------------- */

//    useEffect(() => {
//        if (!currentUserId) return

//        fetchNotifications()
//        fetchMeetings()

//        const interval = setInterval(() => {
//            fetchNotifications()
//            fetchMeetings()
//        }, 5000)

//        return () => clearInterval(interval)

//    }, [currentUserId])

//    /* ---------------- ACCEPT / REJECT ---------------- */

//    const handleRequest = async (notifId: number, status: string) => {

//        await fetch(`https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/${notifId}`, {
//            method: "PUT",
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify(status)
//        })

//        fetchNotifications()
//    }

//    /* ---------------- NAME FIX ---------------- */

//    const getUserName = (n: Notification) => {

//        if (n.fromUserName && n.fromUserName !== "Student")
//            return n.fromUserName

//        const user = students.find(s => s.id === n.fromUserId)

//        return user?.name || "Student"
//    }

//    const totalCount = chatNotifs.length + meetingNotifs.length

//    const initials = name
//        .split(" ")
//        .map(n => n[0])
//        .join("")
//        .toUpperCase()

//    /* ---------------- UI ---------------- */

//    return (
//        <>
//            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">

//                <div className="flex items-center gap-3">
//                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
//                        <Menu className="h-5 w-5" />
//                    </Button>
//                    <h1 className="font-semibold">{title}</h1>
//                </div>

//                <div className="flex items-center gap-2">

//                    <ThemeToggle />

//                    {/* 🔔 NOTIFICATIONS */}
//                    <div className="relative">

//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            onClick={() => setShowNotifications(!showNotifications)}
//                        >
//                            <Bell className="h-4 w-4" />

//                            {totalCount > 0 && (
//                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
//                                    {totalCount}
//                                </span>
//                            )}
//                        </Button>

//                        {showNotifications && (
//                            <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow p-3 z-50">

//                                <h4 className="font-semibold mb-2">Notifications</h4>

//                                {/* 📅 MEETINGS */}
//                                {meetingNotifs.map(m => (
//                                    <div key={m.id} className="text-sm border-b py-2">

//                                        <p>
//                                            📅 <b>{m.title}</b>
//                                        </p>

//                                        <Button
//                                            size="sm"
//                                            className="mt-2"
//                                            onClick={() => window.open(m.meetingLink, "_blank")}
//                                        >
//                                            <Video className="h-4 w-4 mr-1" /> Join
//                                        </Button>

//                                    </div>
//                                ))}

//                                {/* 💬 REQUESTS */}
//                                {chatNotifs.map(n => (
//                                    <div key={n.id} className="text-sm border-b py-2">

//                                        <p>
//                                            <b>{getUserName(n)}</b> {n.content}
//                                        </p>

//                                        {n.status === "pending" && (
//                                            <div className="flex gap-2 mt-2">

//                                                <Button
//                                                    size="sm"
//                                                    onClick={() => handleRequest(n.id, "accepted")}
//                                                >
//                                                    Accept
//                                                </Button>

//                                                <Button
//                                                    size="sm"
//                                                    variant="destructive"
//                                                    onClick={() => handleRequest(n.id, "rejected")}
//                                                >
//                                                    Reject
//                                                </Button>

//                                            </div>
//                                        )}

//                                    </div>
//                                ))}

//                                {totalCount === 0 && (
//                                    <p className="text-sm text-gray-500">No notifications</p>
//                                )}

//                            </div>
//                        )}

//                    </div>

//                    {/* USER */}
//                    <DropdownMenu>
//                        <DropdownMenuTrigger asChild>
//                            <Button variant="ghost" className="gap-2">
//                                <Avatar className="h-7 w-7">
//                                    {image ? (
//                                        <AvatarImage src={image} />
//                                    ) : (
//                                        <AvatarFallback>{initials}</AvatarFallback>
//                                    )}
//                                </Avatar>
//                                {name}
//                            </Button>
//                        </DropdownMenuTrigger>

//                        <DropdownMenuContent align="end">
//                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
//                                <User className="mr-2 h-4 w-4" /> Profile
//                            </DropdownMenuItem>
//                            <DropdownMenuSeparator />
//                            <DropdownMenuItem asChild>
//                                <Link href="/">Logout</Link>
//                            </DropdownMenuItem>
//                        </DropdownMenuContent>
//                    </DropdownMenu>

//                </div>
//            </header>

//            {/* PROFILE */}
//            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
//                <DialogContent>
//                    <DialogHeader>
//                        <DialogTitle>Profile</DialogTitle>
//                    </DialogHeader>

//                    <Input value={name} onChange={(e) => setName(e.target.value)} />
//                    <Button onClick={() => setOpenProfile(false)}>Save</Button>
//                </DialogContent>
//            </Dialog>
//        </>
//    )
//}




//"use client"

//import Link from "next/link"
//import { Bell, Menu, User, Video } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"

//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import { useEffect, useState } from "react"

//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"

///* ---------------- TYPES ---------------- */

//interface DashboardHeaderProps {
//    onMenuClick: () => void
//    title: string
//}

//interface Notification {
//    id: number
//    fromUserId: string
//    fromUserName: string
//    toUserId: string
//    content: string
//    status: string
//}

//interface Meeting {
//    id: string
//    title: string
//    startTime: string
//    meetingLink: string
//}

///* ---------------- COMPONENT ---------------- */

//export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {

//    const [name, setName] = useState("")
//    const [image, setImage] = useState<string | null>(null)
//    const [openProfile, setOpenProfile] = useState(false)

//    const [chatNotifs, setChatNotifs] = useState<Notification[]>([])
//    const [meetingNotifs, setMeetingNotifs] = useState<Meeting[]>([])
//    const [showNotifications, setShowNotifications] = useState(false)

//    const currentUserId =
//        typeof window !== "undefined"
//            ? localStorage.getItem("userId") ?? ""
//            : ""

//    /* ---------------- PROFILE ---------------- */

//    useEffect(() => {
//        const loadProfile = async () => {
//            const token = localStorage.getItem("token")
//            if (!token) return

//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()

//            setName(data.name || data.fullName || "")
//            setImage(data.profileImage || null)
//        }

//        loadProfile()
//    }, [])

//    /* ---------------- CHAT NOTIFICATIONS ---------------- */

//    const fetchNotifications = async () => {
//        try {
//            const res = await fetch(
//                `https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/${currentUserId}`
//            )
//            const data = await res.json()
//            setChatNotifs(data)
//        } catch {
//            setChatNotifs([])
//        }
//    }

//    /* ---------------- MEETING NOTIFICATIONS (FIXED) ---------------- */

//    const fetchMeetings = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/meeting/my-meetings", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()

//            const now = new Date()

//            // ✅ ONLY UPCOMING (NO participants filter)
//            const upcoming = data.filter(
//                (m: Meeting) => new Date(m.startTime) > now
//            )

//            setMeetingNotifs(upcoming)

//        } catch {
//            setMeetingNotifs([])
//        }
//    }

//    /* ---------------- POLLING ---------------- */

//    useEffect(() => {
//        if (!currentUserId) return

//        fetchNotifications()
//        fetchMeetings()

//        const interval = setInterval(() => {
//            fetchNotifications()
//            fetchMeetings()
//        }, 3000) // 🔥 faster refresh

//        return () => clearInterval(interval)

//    }, [currentUserId])

//    /* ---------------- ACCEPT / REJECT ---------------- */

//    const handleRequest = async (notifId: number, status: string) => {

//        await fetch(`https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/${notifId}`, {
//            method: "PUT",
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify(status)
//        })

//        fetchNotifications()
//    }

//    const totalCount = chatNotifs.length + meetingNotifs.length

//    const initials = name
//        ? name.split(" ").map(n => n[0]).join("").toUpperCase()
//        : "U"

//    /* ---------------- UI ---------------- */

//    return (
//        <>
//            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">

//                <div className="flex items-center gap-3">
//                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
//                        <Menu className="h-5 w-5" />
//                    </Button>
//                    <h1 className="font-semibold">{title}</h1>
//                </div>

//                <div className="flex items-center gap-2">

//                    <ThemeToggle />

//                    {/* 🔔 NOTIFICATIONS */}
//                    <div className="relative">

//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            onClick={() => setShowNotifications(!showNotifications)}
//                        >
//                            <Bell className="h-4 w-4" />

//                            {totalCount > 0 && (
//                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
//                                    {totalCount}
//                                </span>
//                            )}
//                        </Button>

//                        {showNotifications && (
//                            <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow p-3 z-50">

//                                <h4 className="font-semibold mb-2">Notifications</h4>

//                                {/* 📅 MEETINGS */}
//                                {meetingNotifs.map(m => (
//                                    <div key={m.id} className="text-sm border-b py-2">

//                                        <p>
//                                            📅 <b>{m.title}</b>
//                                        </p>

//                                        <Button
//                                            size="sm"
//                                            className="mt-2"
//                                            onClick={() => window.open(m.meetingLink, "_blank")}
//                                        >
//                                            <Video className="h-4 w-4 mr-1" /> Join
//                                        </Button>

//                                    </div>
//                                ))}

//                                {/* 💬 REQUESTS */}
//                                {chatNotifs.map(n => (
//                                    <div key={n.id} className="text-sm border-b py-2">

//                                        <p>
//                                            <b>{n.fromUserName || "User"}</b> {n.content}
//                                        </p>

//                                        {n.status === "pending" && (
//                                            <div className="flex gap-2 mt-2">

//                                                <Button
//                                                    size="sm"
//                                                    onClick={() => handleRequest(n.id, "accepted")}
//                                                >
//                                                    Accept
//                                                </Button>

//                                                <Button
//                                                    size="sm"
//                                                    variant="destructive"
//                                                    onClick={() => handleRequest(n.id, "rejected")}
//                                                >
//                                                    Reject
//                                                </Button>

//                                            </div>
//                                        )}

//                                    </div>
//                                ))}

//                                {totalCount === 0 && (
//                                    <p className="text-sm text-gray-500">No notifications</p>
//                                )}

//                            </div>
//                        )}

//                    </div>

//                    {/* USER */}
//                    <DropdownMenu>
//                        <DropdownMenuTrigger asChild>
//                            <Button variant="ghost" className="gap-2">
//                                <Avatar className="h-7 w-7">
//                                    {image ? (
//                                        <AvatarImage src={image} />
//                                    ) : (
//                                        <AvatarFallback>{initials}</AvatarFallback>
//                                    )}
//                                </Avatar>
//                                {name || "User"}
//                            </Button>
//                        </DropdownMenuTrigger>

//                        <DropdownMenuContent align="end">
//                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
//                                <User className="mr-2 h-4 w-4" /> Profile
//                            </DropdownMenuItem>
//                            <DropdownMenuSeparator />
//                            <DropdownMenuItem asChild>
//                                <Link href="/">Logout</Link>
//                            </DropdownMenuItem>
//                        </DropdownMenuContent>
//                    </DropdownMenu>

//                </div>
//            </header>

//            {/* PROFILE */}
//            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
//                <DialogContent>
//                    <DialogHeader>
//                        <DialogTitle>Profile</DialogTitle>
//                    </DialogHeader>

//                    <Input value={name} onChange={(e) => setName(e.target.value)} />
//                    <Button onClick={() => setOpenProfile(false)}>Save</Button>
//                </DialogContent>
//            </Dialog>
//        </>
//    )
//}




//"use client"

//import Link from "next/link"
//import { Bell, Menu, User, Video, ArrowLeft, LogOut } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"

//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import { useEffect, useState } from "react"

//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"

///* ---------------- TYPES ---------------- */

//interface DashboardHeaderProps {
//    onMenuClick: () => void
//    title: string
//}

//interface Notification {
//    id: number
//    fromUserId: string
//    fromUserName: string
//    toUserId: string
//    content: string
//    status: string
//    isRead: boolean   // ✅ ADD THIS
//}

//interface Meeting {
//    id: string
//    title: string
//    startTime: string
//    meetingLink: string
//}

///* ---------------- COMPONENT ---------------- */

//export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {

//    /* ================= PROFILE STATE ================= */

//    const [name, setName] = useState("")
//    const [email, setEmail] = useState("")
//    const [nickname, setNickname] = useState("")
//    const [mobile, setMobile] = useState("")
//    const [country, setCountry] = useState("")
//    const [gender, setGender] = useState("")
//    const [image, setImage] = useState<string | null>(null)
//    const [openProfile, setOpenProfile] = useState(false)

//    /* ================= NOTIFICATION STATE ================= */

//    const [chatNotifs, setChatNotifs] = useState<Notification[]>([])
//    const [meetingNotifs, setMeetingNotifs] = useState<Meeting[]>([])
//    const [showNotifications, setShowNotifications] = useState(false)

//    const currentUserId =
//        typeof window !== "undefined"
//            ? localStorage.getItem("userId") ?? ""
//            : ""

//    /* ================= LOAD PROFILE ================= */

//    useEffect(() => {
//        const loadProfile = async () => {
//            try {
//                const token = localStorage.getItem("token")
//                if (!token) return

//                const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {
//                    headers: { Authorization: `Bearer ${token}` }
//                })

//                if (res.status === 401) {
//                    console.error("Unauthorized ❌")
//                    localStorage.removeItem("token")
//                    window.location.href = "/"
//                    return
//                }

//                if (!res.ok) {
//                    console.error("Profile API failed:", res.status)
//                    return
//                }

//                const data = await res.json()

//                setName(data.name || data.fullName || "")
//                setEmail(data.email || "")
//                setNickname(data.nickname || "")
//                setMobile(data.mobile || "")
//                setCountry(data.country || "")
//                setGender(data.gender || "")
//                setImage(data.profileImage || null)

//            } catch (err) {
//                console.error("Profile load error:", err)
//            }
//        }

//        loadProfile()
//    }, [])

//    /* ================= CHAT NOTIFICATIONS ================= */

//    const fetchNotifications = async () => {
//        try {
//            const res = await fetch(
//                `https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/${currentUserId}`
//            )
//            const data = await res.json()
//            setChatNotifs(data)
//        } catch {
//            setChatNotifs([])
//        }
//    }

//    /* ================= MEETING NOTIFICATIONS ================= */

//    const fetchMeetings = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/meeting/my-meetings", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()
//            const now = new Date()

//            const upcoming = data.filter(
//                (m: Meeting) => new Date(m.startTime) > now
//            )

//            setMeetingNotifs(upcoming)

//        } catch {
//            setMeetingNotifs([])
//        }
//    }

//    /* ================= POLLING ================= */

//    useEffect(() => {
//        if (!currentUserId) return

//        fetchNotifications()
//        fetchMeetings()

//        const interval = setInterval(() => {
//            fetchNotifications()
//            fetchMeetings()
//        }, 3000)

//        return () => clearInterval(interval)

//    }, [currentUserId])

//    /* ================= REQUEST HANDLER ================= */

//    const handleRequest = async (notifId: number, status: string) => {

//        await fetch(`https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/${notifId}`, {
//            method: "PUT",
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify(status)
//        })

//        if (status === "accepted") {
//            await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/chat/create", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json"
//                },
//                body: JSON.stringify({
//                    notificationId: notifId
//                })
//            })

//            window.dispatchEvent(new Event("chat-updated"))
//        }

//        // ✅ REMOVE FROM UI (IMPORTANT)
//        setChatNotifs(prev =>
//            prev.filter(n => n.id !== notifId)
//        )

//        fetchNotifications()
//    }

//    /* ================= PROFILE SAVE ================= */

//    const saveProfile = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {
//                method: "PUT",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },
//                body: JSON.stringify({
//                    name,
//                    nickname,
//                    gender,
//                    country,
//                    mobile,
//                    profileImage: image
//                })
//            })

//            setOpenProfile(false)

//        } catch (err) {
//            console.error("Profile save error:", err)
//        }
//    }

//    /* ================= IMAGE UPLOAD ================= */

//    const handleImageUpload = (e: any) => {
//        const file = e.target.files[0]
//        if (!file) return

//        const reader = new FileReader()
//        reader.onloadend = () => setImage(reader.result as string)
//        reader.readAsDataURL(file)
//    }

//    const initials = name
//        ? name.split(" ").map(n => n[0]).join("").toUpperCase()
//        : "U"

//    const totalCount =
//        chatNotifs.filter(n => !n.isRead).length

//    /* ================= UI ================= */

//    return (
//        <>
//            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">

//                <div className="flex items-center gap-3">
//                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
//                        <Menu className="h-5 w-5" />
//                    </Button>
//                    <h1 className="font-semibold">{title}</h1>
//                </div>

//                <div className="flex items-center gap-2">

//                    <ThemeToggle />

//                    {/* 🔔 NOTIFICATIONS */}
//                    <div className="relative">

//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            onClick={async () => {
//                                setShowNotifications(!showNotifications)

//                                if (!showNotifications) {
//                                    try {
//                                        await fetch(
//                                            `https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/mark-read/${currentUserId}`,
//                                            { method: "PUT" }
//                                        )

//                                        // ✅ instant UI update
//                                        setChatNotifs(prev =>
//                                            prev.map(n => ({ ...n, isRead: true }))
//                                        )

//                                    } catch (err) {
//                                        console.error("Mark read error:", err)
//                                    }
//                                }
//                            }}
//                        >
//                            <Bell className="h-4 w-4" />

//                            {totalCount > 0 && (
//                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
//                                    {totalCount}
//                                </span>
//                            )}
//                        </Button>

//                        {showNotifications && (
//                            <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow p-3 z-50">

//                                <h4 className="font-semibold mb-2">Notifications</h4>

//                                {/* 📅 MEETINGS */}
//                                {meetingNotifs.map(m => (
//                                    <div key={m.id} className="text-sm border-b py-2">

//                                        <p>📅 <b>{m.title}</b></p>

//                                        <Button
//                                            size="sm"
//                                            className="mt-2"
//                                            onClick={() => window.open(m.meetingLink, "_blank")}
//                                        >
//                                            <Video className="h-4 w-4 mr-1" /> Join
//                                        </Button>

//                                    </div>
//                                ))}

//                                {/* 💬 REQUESTS */}
//                                {chatNotifs.map(n => (
//                                    <div
//                                        key={n.id}
//                                        className={`text-sm border-b py-2 ${!n.isRead ? "bg-blue-50" : ""}`}
//                                    >

//                                        <p>
//                                            <b>{n.fromUserName || "User"}</b> {n.content}
//                                        </p>

//                                        {n.status === "pending" && (
//                                            <div className="flex gap-2 mt-2">
//                                                <Button size="sm" onClick={() => handleRequest(n.id, "accepted")}>
//                                                    Accept
//                                                </Button>
//                                                <Button size="sm" variant="destructive" onClick={() => handleRequest(n.id, "rejected")}>
//                                                    Reject
//                                                </Button>
//                                            </div>
//                                        )}

//                                    </div>
//                                ))}

//                                {totalCount === 0 && (
//                                    <p className="text-sm text-gray-500">No notifications</p>
//                                )}

//                            </div>
//                        )}
//                    </div>

//                    {/* USER */}
//                    <DropdownMenu>
//                        <DropdownMenuTrigger asChild>
//                            <Button variant="ghost" className="gap-2">
//                                <Avatar className="h-7 w-7">
//                                    {image ? (
//                                        <AvatarImage src={image} />
//                                    ) : (
//                                        <AvatarFallback>{initials}</AvatarFallback>
//                                    )}
//                                </Avatar>
//                                {name || "User"}
//                            </Button>
//                        </DropdownMenuTrigger>

//                        <DropdownMenuContent align="end">
//                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
//                                <User className="mr-2 h-4 w-4" /> Profile
//                            </DropdownMenuItem>
//                            <DropdownMenuSeparator />
//                            <DropdownMenuItem asChild>
//                                <Link href="/">
//                                    <LogOut className="mr-2 h-4 w-4" /> Logout
//                                </Link>
//                            </DropdownMenuItem>
//                        </DropdownMenuContent>
//                    </DropdownMenu>

//                </div>
//            </header>
//            {/* ================= PROFILE MODAL ================= */}
//            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
//                <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl 
//    border border-border 
//    bg-white text-black 
//    dark:bg-gradient-to-br dark:from-[#020617] dark:to-[#0f172a] dark:text-white 
//    shadow-2xl">

//                    {/* HEADER */}
//                    <div className="flex items-center justify-between px-6 py-4 border-b 
//        bg-gray-100 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 
//        border-border dark:border-white/10">

//                        <div className="flex items-center gap-3 ">
//                            <Button
//                                variant="ghost"
//                                size="icon"
//                                onClick={() => setOpenProfile(false)}
//                                className="hover:bg-black/10 dark:hover:bg-white/20"
//                            >
//                                <ArrowLeft className="h-4 w-4" />
//                            </Button>

//                            <h2 className="text-lg font-semibold tracking-wide ">
//                                Profile Settings
//                            </h2>
//                        </div>
//                    </div>

//                    {/* BODY */}
//                    <div className="p-6 space-y-6">

//                        {/* PROFILE TOP */}
//                        <div className="flex items-center gap-5">

//                            <label className="cursor-pointer relative group">
//                                <Avatar className="h-20 w-20 border-2 border-indigo-500 shadow-lg">
//                                    {image ? (
//                                        <AvatarImage src={image} />
//                                    ) : (
//                                        <AvatarFallback className="text-lg font-bold bg-indigo-600 text-white">
//                                            {initials}
//                                        </AvatarFallback>
//                                    )}
//                                </Avatar>

//                                {/* Hover overlay */}
//                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
//                    rounded-full flex items-center justify-center text-white text-xs font-medium transition">
//                                    Change
//                                </div>

//                                <input type="file" className="hidden" onChange={handleImageUpload} />
//                            </label>

//                            <div>
//                                <p className="text-lg font-semibold">{name}</p>
//                                <p className="text-sm text-muted-foreground">{email}</p>
//                            </div>

//                        </div>

//                        {/* FORM */}
//                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//                            <div className="space-y-1">
//                                <Label>Full Name</Label>
//                                <Input
//                                    value={name}
//                                    onChange={(e) => setName(e.target.value)}
//                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10 
//                        focus-visible:ring-indigo-500"
//                                />
//                            </div>

//                            <div className="space-y-1">
//                                <Label>Nick Name</Label>
//                                <Input
//                                    value={nickname}
//                                    onChange={(e) => setNickname(e.target.value)}
//                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10"
//                                />
//                            </div>

//                            {/* GENDER */}
//                            <div className="md:col-span-2 space-y-2">
//                                <Label>Gender</Label>

//                                <div className="flex gap-3">
//                                    {["Male", "Female", "Other"].map(g => (
//                                        <button
//                                            key={g}
//                                            type="button"
//                                            onClick={() => setGender(g)}
//                                            className={`px-4 py-2 rounded-lg border text-sm transition 
//                                ${gender === g
//                                                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
//                                                    : "bg-gray-100 dark:bg-white/5 border-border dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
//                                                }`}
//                                        >
//                                            {g}
//                                        </button>
//                                    ))}
//                                </div>
//                            </div>

//                            <div className="space-y-1">
//                                <Label>Mobile</Label>
//                                <Input
//                                    value={mobile}
//                                    onChange={(e) => setMobile(e.target.value)}
//                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10"
//                                />
//                            </div>

//                            <div className="space-y-1">
//                                <Label>Country</Label>
//                                <Input
//                                    value={country}
//                                    onChange={(e) => setCountry(e.target.value)}
//                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10"
//                                />
//                            </div>

//                            <div className="md:col-span-2 space-y-1">
//                                <Label>Email</Label>
//                                <Input
//                                    value={email}
//                                    disabled
//                                    className="bg-gray-200 dark:bg-white/10 border-border dark:border-white/10 
//                        text-gray-500 dark:text-gray-400"
//                                />
//                            </div>

//                        </div>

//                    </div>

//                    {/* FOOTER */}
//                    <div className="flex justify-end gap-3 px-6 py-4 border-t 
//        bg-gray-100 dark:bg-white/5 border-border dark:border-white/10">

//                        <Button
//                            variant="outline"
//                            onClick={() => setOpenProfile(false)}
//                            className="hover:bg-gray-200 dark:hover:bg-white/10"
//                        >
//                            Cancel
//                        </Button>

//                        <Button
//                            onClick={saveProfile}
//                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-lg"
//                        >
//                            Save Changes
//                        </Button>

//                    </div>

//                </DialogContent>
//            </Dialog>

//        </>
//    )
//}






//"use client"

//import Link from "next/link"
//import { Bell, Menu, User, Video, ArrowLeft, LogOut } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"

//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import { useEffect, useState } from "react"

//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"

///* ---------------- TYPES ---------------- */

//interface DashboardHeaderProps {
//    onMenuClick: () => void
//    title: string
//}

//interface Notification {
//    id: number
//    fromUserId: string
//    fromUserName: string
//    toUserId: string
//    content: string
//    status: string
//    isRead: boolean   // ✅ ADD THIS
//}

//interface Meeting {
//    id: string
//    title: string
//    startTime: string
//    meetingLink: string
//    isRead?: boolean   // ✅ ADD THIS
//}

///* ---------------- COMPONENT ---------------- */

//export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {

//    /* ================= PROFILE STATE ================= */

//    const [name, setName] = useState("")
//    const [mounted, setMounted] = useState(false)

//    useEffect(() => {
//        setMounted(true)
//        const storedName = localStorage.getItem("name") || ""
//        setName(storedName)
//    }, [])
//    const [email, setEmail] = useState("")
//    const [nickname, setNickname] = useState("")
//    const [mobile, setMobile] = useState("")
//    const [country, setCountry] = useState("")
//    const [gender, setGender] = useState("")
//    const [image, setImage] = useState<string | null>(null)
//    const [openProfile, setOpenProfile] = useState(false)

//    /* ================= NOTIFICATION STATE ================= */

//    const [chatNotifs, setChatNotifs] = useState<Notification[]>([])
//    const [meetingNotifs, setMeetingNotifs] = useState<Meeting[]>([])
//    const [showNotifications, setShowNotifications] = useState(false)

//    const currentUserId =
//        typeof window !== "undefined"
//            ? localStorage.getItem("userId") ?? ""
//            : ""

//    /* ================= LOAD PROFILE ================= */

//    useEffect(() => {
//        const loadProfile = async () => {
//            try {
//                const token = localStorage.getItem("token")
//                if (!token) return

//                const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {
//                    headers: { Authorization: `Bearer ${token}` }
//                })

//                if (res.status === 401) {
//                    console.error("Unauthorized ❌")
//                    localStorage.removeItem("token")
//                    window.location.href = "/"
//                    return
//                }

//                if (!res.ok) {
//                    console.error("Profile API failed:", res.status)
//                    return
//                }

//                const data = await res.json()

//                const finalName = data.name || data.fullName || localStorage.getItem("name") || ""

//                setName(finalName)

//                // 🔥 IMPORTANT: sync localStorage
//                localStorage.setItem("name", finalName)
//                setEmail(data.email || "")
//                setNickname(data.nickname || "")
//                setMobile(data.mobile || "")
//                setCountry(data.country || "")
//                setGender(data.gender || "")
//                setImage(data.profileImage || null)

//            } catch (err) {
//                console.error("Profile load error:", err)
//            }
//        }

//        loadProfile()
//    }, [])

//    /* ================= CHAT NOTIFICATIONS ================= */

//    const fetchNotifications = async () => {
//        try {
//            const res = await fetch(
//                `https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/${currentUserId}`
//            )
//            const data = await res.json()

//            const readIds = getReadIds()

//            setChatNotifs(
//                data.map((n: Notification) => ({
//                    ...n,
//                    isRead: readIds.includes(n.id) || n.isRead
//                }))
//            )
//        } catch {
//            setChatNotifs([])
//        }
//    }

//    /* ================= MEETING NOTIFICATIONS ================= */

//    const fetchMeetings = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/meeting/my-meetings", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()
//            const now = new Date()

//            const upcoming = data.filter(
//                (m: Meeting) => new Date(m.startTime) > now
//            )

//            setMeetingNotifs(prev => {
//                return upcoming.map((m: Meeting) => {
//                    const existing = prev.find(p => p.id === m.id)

//                    return {
//                        ...m,
//                        isRead: existing ? existing.isRead : false // ✅ PRESERVE OLD STATE
//                    }
//                })
//            })

//        } catch {
//            setMeetingNotifs([])
//        }
//    }

//    /* ================= POLLING ================= */

//    useEffect(() => {
//        if (!currentUserId) return

//        fetchNotifications()
//        fetchMeetings()

//        const interval = setInterval(() => {
//            fetchNotifications()
//            fetchMeetings()
//        }, 3000)

//        return () => clearInterval(interval)

//    }, [currentUserId])

//    const getReadIds = () => {
//        if (typeof window === "undefined") return []
//        return JSON.parse(localStorage.getItem("readNotifications") || "[]")
//    }

//    const saveReadIds = (ids: number[]) => {
//        localStorage.setItem("readNotifications", JSON.stringify(ids))
//    }

//    /* ================= REQUEST HANDLER ================= */

//    const handleRequest = async (notifId: number, status: string) => {

//        await fetch(`https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/${notifId}`, {
//            method: "PUT",
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify(status)
//        })

//        if (status === "accepted") {
//            await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/chat/create", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json"
//                },
//                body: JSON.stringify({
//                    notificationId: notifId
//                })
//            })

//            window.dispatchEvent(new Event("chat-updated"))
//        }

//        // ✅ REMOVE FROM UI (IMPORTANT)
//        setChatNotifs(prev =>
//            prev.filter(n => n.id !== notifId)
//        )

//        fetchNotifications()
//    }

//    /* ================= PROFILE SAVE ================= */

//    const saveProfile = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {
//                method: "PUT",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },
//                body: JSON.stringify({
//                    name,
//                    nickname,
//                    gender,
//                    country,
//                    mobile,
//                    profileImage: image
//                })
//            })

//            setOpenProfile(false)

//        } catch (err) {
//            console.error("Profile save error:", err)
//        }
//    }

//    /* ================= IMAGE UPLOAD ================= */

//    const handleImageUpload = (e: any) => {
//        const file = e.target.files[0]
//        if (!file) return

//        const reader = new FileReader()
//        reader.onloadend = () => setImage(reader.result as string)
//        reader.readAsDataURL(file)
//    }

//    const initials = name
//        ? name.split(" ").map(n => n[0]).join("").toUpperCase()
//        : "U"

//    const unreadChatCount = chatNotifs.filter(n => !n.isRead).length
//    const unreadMeetingCount = meetingNotifs.filter(m => !m.isRead).length

//    const totalCount = unreadChatCount + unreadMeetingCount

//    /* ================= UI ================= */
//    if (!mounted) return null

//    return (
//        <>
//            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">

//                <div className="flex items-center gap-3">
//                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
//                        <Menu className="h-5 w-5" />
//                    </Button>
//                    <h1 className="font-semibold">{title}</h1>
//                </div>

//                <div className="flex items-center gap-2">

//                    <ThemeToggle />

//                    {/* 🔔 NOTIFICATIONS */}
//                    <div className="relative">

//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            onClick={async () => {

//                                const opening = !showNotifications
//                                setShowNotifications(opening)

//                                if (opening) {
//                                    try {
//                                        await fetch(
//                                            `https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/mark-read/${currentUserId}`,
//                                            { method: "PUT" }
//                                        )

//                                        // ✅ SAVE ALL IDs AS READ (PERSIST)
//                                        const allIds = chatNotifs.map(n => n.id)
//                                        saveReadIds(allIds)

//                                        // ✅ UI update
//                                        setChatNotifs(prev =>
//                                            prev.map(n => ({ ...n, isRead: true }))
//                                        )

//                                        setMeetingNotifs(prev =>
//                                            prev.map(m => ({ ...m, isRead: true }))
//                                        )

//                                    } catch (err) {
//                                        console.error("Mark read error:", err)
//                                    }
//                                }
//                            }}
//                        >
//                            <Bell className="h-4 w-4" />

//                            {totalCount > 0 && (
//                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
//                                    {totalCount}
//                                </span>
//                            )}
//                        </Button>

//                        {showNotifications && (
//                            <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow p-3 z-50">

//                                <h4 className="font-semibold mb-2">Notifications</h4>

//                                {/* 📅 MEETINGS */}
//                                {meetingNotifs.map(m => (
//                                    <div key={m.id} className="text-sm border-b py-2">

//                                        <p>📅 <b>{m.title}</b></p>

//                                        <Button
//                                            size="sm"
//                                            className="mt-2"
//                                            onClick={() => window.open(m.meetingLink, "_blank")}
//                                        >
//                                            <Video className="h-4 w-4 mr-1" /> Join
//                                        </Button>

//                                    </div>
//                                ))}

//                                {/* 💬 REQUESTS */}
//                                {chatNotifs.map(n => (
//                                    <div
//                                        key={n.id}
//                                        className={`text-sm border-b py-2 ${!n.isRead ? "bg-blue-50" : ""}`}
//                                    >

//                                        <p>
//                                            <b>{n.fromUserName || "User"}</b> {n.content}
//                                        </p>

//                                        {n.status === "pending" && (
//                                            <div className="flex gap-2 mt-2">
//                                                <Button size="sm" onClick={() => handleRequest(n.id, "accepted")}>
//                                                    Accept
//                                                </Button>
//                                                <Button size="sm" variant="destructive" onClick={() => handleRequest(n.id, "rejected")}>
//                                                    Reject
//                                                </Button>
//                                            </div>
//                                        )}

//                                    </div>
//                                ))}

//                                {chatNotifs.length === 0 && meetingNotifs.length === 0 && (
//                                    <p className="text-sm text-gray-500">No notifications</p>
//                                )}

//                            </div>
//                        )}
//                    </div>

//                    {/* USER */}
//                    <DropdownMenu>
//                        <DropdownMenuTrigger asChild>
//                            <Button variant="ghost" className="gap-2">
//                                <Avatar className="h-7 w-7">
//                                    {image ? (
//                                        <AvatarImage src={image} />
//                                    ) : (
//                                        <AvatarFallback>{initials}</AvatarFallback>
//                                    )}
//                                </Avatar>
//                                {name || "User"}
//                            </Button>
//                        </DropdownMenuTrigger>

//                        <DropdownMenuContent align="end">
//                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
//                                <User className="mr-2 h-4 w-4" /> Profile
//                            </DropdownMenuItem>
//                            <DropdownMenuSeparator />
//                            <DropdownMenuItem asChild>
//                                <Link href="/">
//                                    <LogOut className="mr-2 h-4 w-4" /> Logout
//                                </Link>
//                            </DropdownMenuItem>
//                        </DropdownMenuContent>
//                    </DropdownMenu>

//                </div>
//            </header>
//            {/* ================= PROFILE MODAL ================= */}
//            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
//                <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl 
//    border border-border 
//    bg-white text-black 
//    dark:bg-gradient-to-br dark:from-[#020617] dark:to-[#0f172a] dark:text-white 
//    shadow-2xl">

//                    {/* HEADER */}
//                    <div className="flex items-center justify-between px-6 py-4 border-b 
//        bg-gray-100 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 
//        border-border dark:border-white/10">

//                        <div className="flex items-center gap-3 ">
//                            <Button
//                                variant="ghost"
//                                size="icon"
//                                onClick={() => setOpenProfile(false)}
//                                className="hover:bg-black/10 dark:hover:bg-white/20"
//                            >
//                                <ArrowLeft className="h-4 w-4" />
//                            </Button>

//                            <h2 className="text-lg font-semibold tracking-wide ">
//                                Profile Settings
//                            </h2>
//                        </div>
//                    </div>

//                    {/* BODY */}
//                    <div className="p-6 space-y-6">

//                        {/* PROFILE TOP */}
//                        <div className="flex items-center gap-5">

//                            <label className="cursor-pointer relative group">
//                                <Avatar className="h-20 w-20 border-2 border-indigo-500 shadow-lg">
//                                    {image ? (
//                                        <AvatarImage src={image} />
//                                    ) : (
//                                        <AvatarFallback className="text-lg font-bold bg-indigo-600 text-white">
//                                            {initials}
//                                        </AvatarFallback>
//                                    )}
//                                </Avatar>

//                                {/* Hover overlay */}
//                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
//                    rounded-full flex items-center justify-center text-white text-xs font-medium transition">
//                                    Change
//                                </div>

//                                <input type="file" className="hidden" onChange={handleImageUpload} />
//                            </label>

//                            <div>
//                                <p className="text-lg font-semibold">{name}</p>
//                                <p className="text-sm text-muted-foreground">{email}</p>
//                            </div>

//                        </div>

//                        {/* FORM */}
//                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//                            <div className="space-y-1">
//                                <Label>Full Name</Label>
//                                <Input
//                                    value={name}
//                                    onChange={(e) => setName(e.target.value)}
//                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10 
//                        focus-visible:ring-indigo-500"
//                                />
//                            </div>

//                            <div className="space-y-1">
//                                <Label>Nick Name</Label>
//                                <Input
//                                    value={nickname}
//                                    onChange={(e) => setNickname(e.target.value)}
//                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10"
//                                />
//                            </div>

//                            {/* GENDER */}
//                            <div className="md:col-span-2 space-y-2">
//                                <Label>Gender</Label>

//                                <div className="flex gap-3">
//                                    {["Male", "Female", "Other"].map(g => (
//                                        <button
//                                            key={g}
//                                            type="button"
//                                            onClick={() => setGender(g)}
//                                            className={`px-4 py-2 rounded-lg border text-sm transition 
//                                ${gender === g
//                                                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
//                                                    : "bg-gray-100 dark:bg-white/5 border-border dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
//                                                }`}
//                                        >
//                                            {g}
//                                        </button>
//                                    ))}
//                                </div>
//                            </div>

//                            <div className="space-y-1">
//                                <Label>Mobile</Label>
//                                <Input
//                                    value={mobile}
//                                    onChange={(e) => setMobile(e.target.value)}
//                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10"
//                                />
//                            </div>

//                            <div className="space-y-1">
//                                <Label>Country</Label>
//                                <Input
//                                    value={country}
//                                    onChange={(e) => setCountry(e.target.value)}
//                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10"
//                                />
//                            </div>

//                            <div className="md:col-span-2 space-y-1">
//                                <Label>Email</Label>
//                                <Input
//                                    value={email}
//                                    disabled
//                                    className="bg-gray-200 dark:bg-white/10 border-border dark:border-white/10 
//                        text-gray-500 dark:text-gray-400"
//                                />
//                            </div>

//                        </div>

//                    </div>

//                    {/* FOOTER */}
//                    <div className="flex justify-end gap-3 px-6 py-4 border-t 
//        bg-gray-100 dark:bg-white/5 border-border dark:border-white/10">

//                        <Button
//                            variant="outline"
//                            onClick={() => setOpenProfile(false)}
//                            className="hover:bg-gray-200 dark:hover:bg-white/10"
//                        >
//                            Cancel
//                        </Button>

//                        <Button
//                            onClick={saveProfile}
//                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-lg"
//                        >
//                            Save Changes
//                        </Button>

//                    </div>

//                </DialogContent>
//            </Dialog>

//        </>
//    )
//}



//"use client"

//import Link from "next/link"
//import { Bell, Menu, User, Video, ArrowLeft, LogOut } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
//} from "@/components/ui/dropdown-menu"

//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//import { useEffect, useState } from "react"

//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"

///* ---------------- TYPES ---------------- */

//interface DashboardHeaderProps {
//    onMenuClick: () => void
//    title: string
//}

//interface Notification {
//    id: number
//    fromUserId: string
//    fromUserName: string
//    toUserId: string
//    content: string
//    status: string
//    isRead: boolean   // ✅ ADD THIS
//}

//interface Meeting {
//    id: string
//    title: string
//    startTime: string
//    meetingLink: string
//    isRead?: boolean   // ✅ ADD THIS
//}

///* ---------------- COMPONENT ---------------- */

//export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {

//    /* ================= PROFILE STATE ================= */

//    const [name, setName] = useState("")
//    const [mounted, setMounted] = useState(false)

//    useEffect(() => {
//        setMounted(true)
//        const storedName = localStorage.getItem("name") || ""
//        setName(storedName)
//    }, [])
//    const [email, setEmail] = useState("")
//    const [nickname, setNickname] = useState("")
//    const [mobile, setMobile] = useState("")
//    const [country, setCountry] = useState("")
//    const [gender, setGender] = useState("")
//    const [image, setImage] = useState<string | null>(null)
//    const [openProfile, setOpenProfile] = useState(false)

//    /* ================= NOTIFICATION STATE ================= */

//    const [chatNotifs, setChatNotifs] = useState<Notification[]>([])
//    const [meetingNotifs, setMeetingNotifs] = useState<Meeting[]>([])
//    const [calendarNotifs, setCalendarNotifs] = useState<any[]>([])
//    const [showNotifications, setShowNotifications] = useState(false)

//    const currentUserId =
//        typeof window !== "undefined"
//            ? localStorage.getItem("userId") ?? ""
//            : ""

//    /* ================= LOAD PROFILE ================= */

//    useEffect(() => {
//        const loadProfile = async () => {
//            try {
//                const token = localStorage.getItem("token")
//                if (!token) return

//                const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {
//                    headers: { Authorization: `Bearer ${token}` }
//                })

//                if (res.status === 401) {
//                    console.error("Unauthorized ❌")
//                    localStorage.removeItem("token")
//                    window.location.href = "/"
//                    return
//                }

//                if (!res.ok) {
//                    console.error("Profile API failed:", res.status)
//                    return
//                }

//                const data = await res.json()

//                const finalName = data.name || data.fullName || localStorage.getItem("name") || ""

//                setName(finalName)

//                // 🔥 IMPORTANT: sync localStorage
//                localStorage.setItem("name", finalName)
//                setEmail(data.email || "")
//                setNickname(data.nickname || "")
//                setMobile(data.mobile || "")
//                setCountry(data.country || "")
//                setGender(data.gender || "")
//                setImage(data.profileImage || null)

//            } catch (err) {
//                console.error("Profile load error:", err)
//            }
//        }

//        loadProfile()
//    }, [])

//    /* ================= CHAT NOTIFICATIONS ================= */

//    const fetchNotifications = async () => {
//        try {
//            const res = await fetch(
//                `https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/${currentUserId}`
//            )
//            const data = await res.json()

//            const readIds = getReadIds()

//            setChatNotifs(
//                data.map((n: Notification) => ({
//                    ...n,
//                    isRead: readIds.includes(n.id) || n.isRead
//                }))
//            )
//        } catch {
//            setChatNotifs([])
//        }
//    }

//    /* ================= MEETING NOTIFICATIONS ================= */

//    const fetchMeetings = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/meeting/my-meetings", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()
//            const now = new Date()

//            const upcoming = data.filter(
//                (m: Meeting) => new Date(m.startTime) > now
//            )

//            setMeetingNotifs(prev => {
//                return upcoming.map((m: Meeting) => {
//                    const existing = prev.find(p => p.id === m.id)

//                    return {
//                        ...m,
//                        isRead: existing ? existing.isRead : false // ✅ PRESERVE OLD STATE
//                    }
//                })
//            })

//        } catch {
//            setMeetingNotifs([])
//        }
//    }

//    /* ================= POLLING ================= */

//    useEffect(() => {
//        if (!currentUserId) return

//        fetchNotifications()
//        fetchMeetings()

//        const interval = setInterval(() => {
//            fetchNotifications()
//            fetchMeetings()
//        }, 3000)

//        return () => clearInterval(interval)

//    }, [currentUserId])

//    const getReadIds = () => {
//        if (typeof window === "undefined") return []
//        return JSON.parse(localStorage.getItem("readNotifications") || "[]")
//    }

//    const loadGlobalNotifications = () => {
//        const data = JSON.parse(localStorage.getItem("globalNotifications") || "[]")
//        setCalendarNotifs(data)
//    }

//    useEffect(() => {

//        loadGlobalNotifications()

//        const handler = () => loadGlobalNotifications()

//        window.addEventListener("new-notification", handler)

//        return () => {
//            window.removeEventListener("new-notification", handler)
//        }

//    }, [])

//    const saveReadIds = (ids: number[]) => {
//        localStorage.setItem("readNotifications", JSON.stringify(ids))
//    }

//    /* ================= REQUEST HANDLER ================= */

//    const handleRequest = async (notifId: number, status: string) => {

//        await fetch(`https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/${notifId}`, {
//            method: "PUT",
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify(status)
//        })

//        if (status === "accepted") {
//            await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/chat/create", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json"
//                },
//                body: JSON.stringify({
//                    notificationId: notifId
//                })
//            })

//            window.dispatchEvent(new Event("chat-updated"))
//        }

//        // ✅ REMOVE FROM UI (IMPORTANT)
//        setChatNotifs(prev =>
//            prev.filter(n => n.id !== notifId)
//        )

//        fetchNotifications()
//    }

//    /* ================= PROFILE SAVE ================= */

//    const saveProfile = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {
//                method: "PUT",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },
//                body: JSON.stringify({
//                    name,
//                    nickname,
//                    gender,
//                    country,
//                    mobile,
//                    profileImage: image
//                })
//            })

//            setOpenProfile(false)

//        } catch (err) {
//            console.error("Profile save error:", err)
//        }
//    }

//    /* ================= IMAGE UPLOAD ================= */

//    const handleImageUpload = (e: any) => {
//        const file = e.target.files[0]
//        if (!file) return

//        const reader = new FileReader()
//        reader.onloadend = () => setImage(reader.result as string)
//        reader.readAsDataURL(file)
//    }

//    const initials = name
//        ? name.split(" ").map(n => n[0]).join("").toUpperCase()
//        : "U"

//    const unreadChatCount = chatNotifs.filter(n => !n.isRead).length
//    const unreadMeetingCount = meetingNotifs.filter(m => !m.isRead).length

//    const unreadCalendarCount = calendarNotifs.filter(n => !n.isRead).length

//    const totalCount =
//        unreadChatCount +
//        unreadMeetingCount +
//        unreadCalendarCount

//    /* ================= UI ================= */
//    if (!mounted) return null

//    return (
//        <>
//            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">

//                <div className="flex items-center gap-3">
//                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
//                        <Menu className="h-5 w-5" />
//                    </Button>
//                    <h1 className="font-semibold">{title}</h1>
//                </div>

//                <div className="flex items-center gap-2">

//                    <ThemeToggle />

//                    {/* 🔔 NOTIFICATIONS */}
//                    <div className="relative">

//                        <Button
//                            variant="ghost"
//                            size="icon"
//                            onClick={async () => {

//                                const opening = !showNotifications
//                                setShowNotifications(opening)

//                                if (opening) {
//                                    try {
//                                        await fetch(
//                                            `https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/mark-read/${currentUserId}`,
//                                            { method: "PUT" }
//                                        )

//                                        // ✅ calendar notifications read mark
//                                        const updated = calendarNotifs.map(n => ({ ...n, isRead: true }))
//                                        setCalendarNotifs(updated)
//                                        localStorage.setItem("globalNotifications", JSON.stringify(updated))

//                                        // ✅ SAVE ALL IDs AS READ (PERSIST)
//                                        const allIds = chatNotifs.map(n => n.id)
//                                        saveReadIds(allIds)

//                                        // ✅ UI update
//                                        setChatNotifs(prev =>
//                                            prev.map(n => ({ ...n, isRead: true }))
//                                        )

//                                        setMeetingNotifs(prev =>
//                                            prev.map(m => ({ ...m, isRead: true }))
//                                        )

//                                    } catch (err) {
//                                        console.error("Mark read error:", err)
//                                    }
//                                }
//                            }}
//                        >
//                            <Bell className="h-4 w-4" />

//                            {totalCount > 0 && (
//                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
//                                    {totalCount}
//                                </span>
//                            )}
//                        </Button>

//                        {showNotifications && (
//                            <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow p-3 z-50">

//                                <h4 className="font-semibold mb-2">Notifications</h4>

//                                {/* 🗓 CALENDAR */}
//                                {calendarNotifs.map(n => (
//                                    <div key={n.id} className="text-sm border-b py-2">
//                                        ⏰ {n.text}
//                                    </div>
//                                ))}

//                                {/* 📅 MEETINGS */}
//                                {meetingNotifs.map(m => (
//                                    <div key={m.id} className="text-sm border-b py-2">

//                                        <p>📅 <b>{m.title}</b></p>

//                                        <Button
//                                            size="sm"
//                                            className="mt-2"
//                                            onClick={() => window.open(m.meetingLink, "_blank")}
//                                        >
//                                            <Video className="h-4 w-4 mr-1" /> Join
//                                        </Button>

//                                    </div>
//                                ))}

//                                {/* 💬 REQUESTS */}
//                                {chatNotifs.map(n => (
//                                    <div
//                                        key={n.id}
//                                        className={`text-sm border-b py-2 ${!n.isRead ? "bg-blue-50" : ""}`}
//                                    >

//                                        <p>
//                                            <b>{n.fromUserName || "User"}</b> {n.content}
//                                        </p>

//                                        {n.status === "pending" && (
//                                            <div className="flex gap-2 mt-2">
//                                                <Button size="sm" onClick={() => handleRequest(n.id, "accepted")}>
//                                                    Accept
//                                                </Button>
//                                                <Button size="sm" variant="destructive" onClick={() => handleRequest(n.id, "rejected")}>
//                                                    Reject
//                                                </Button>
//                                            </div>
//                                        )}

//                                    </div>
//                                ))}

//                                {chatNotifs.length === 0 &&
//                                    meetingNotifs.length === 0 &&
//                                    calendarNotifs.length === 0 && (
//                                    <p className="text-sm text-gray-500">No notifications</p>
//                                )}

//                            </div>
//                        )}
//                    </div>

//                    {/* USER */}
//                    <DropdownMenu>
//                        <DropdownMenuTrigger asChild>
//                            <Button variant="ghost" className="gap-2">
//                                <Avatar className="h-7 w-7">
//                                    {image ? (
//                                        <AvatarImage src={image} />
//                                    ) : (
//                                        <AvatarFallback>{initials}</AvatarFallback>
//                                    )}
//                                </Avatar>
//                                {name || "User"}
//                            </Button>
//                        </DropdownMenuTrigger>

//                        <DropdownMenuContent align="end">
//                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
//                                <User className="mr-2 h-4 w-4" /> Profile
//                            </DropdownMenuItem>
//                            <DropdownMenuSeparator />
//                            <DropdownMenuItem asChild>
//                                <Link href="/">
//                                    <LogOut className="mr-2 h-4 w-4" /> Logout
//                                </Link>
//                            </DropdownMenuItem>
//                        </DropdownMenuContent>
//                    </DropdownMenu>

//                </div>
//            </header>
//            {/* ================= PROFILE MODAL ================= */}
//            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
//                <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl 
//    border border-border 
//    bg-white text-black 
//    dark:bg-gradient-to-br dark:from-[#020617] dark:to-[#0f172a] dark:text-white 
//    shadow-2xl">

//                    {/* HEADER */}
//                    <div className="flex items-center justify-between px-6 py-4 border-b 
//        bg-gray-100 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 
//        border-border dark:border-white/10">

//                        <div className="flex items-center gap-3 ">
//                            <Button
//                                variant="ghost"
//                                size="icon"
//                                onClick={() => setOpenProfile(false)}
//                                className="hover:bg-black/10 dark:hover:bg-white/20"
//                            >
//                                <ArrowLeft className="h-4 w-4" />
//                            </Button>

//                            <h2 className="text-lg font-semibold tracking-wide ">
//                                Profile Settings
//                            </h2>
//                        </div>
//                    </div>

//                    {/* BODY */}
//                    <div className="p-6 space-y-6">

//                        {/* PROFILE TOP */}
//                        <div className="flex items-center gap-5">

//                            <label className="cursor-pointer relative group">
//                                <Avatar className="h-20 w-20 border-2 border-indigo-500 shadow-lg">
//                                    {image ? (
//                                        <AvatarImage src={image} />
//                                    ) : (
//                                        <AvatarFallback className="text-lg font-bold bg-indigo-600 text-white">
//                                            {initials}
//                                        </AvatarFallback>
//                                    )}
//                                </Avatar>

//                                {/* Hover overlay */}
//                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
//                    rounded-full flex items-center justify-center text-white text-xs font-medium transition">
//                                    Change
//                                </div>

//                                <input type="file" className="hidden" onChange={handleImageUpload} />
//                            </label>

//                            <div>
//                                <p className="text-lg font-semibold">{name}</p>
//                                <p className="text-sm text-muted-foreground">{email}</p>
//                            </div>

//                        </div>

//                        {/* FORM */}
//                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//                            <div className="space-y-1">
//                                <Label>Full Name</Label>
//                                <Input
//                                    value={name}
//                                    onChange={(e) => setName(e.target.value)}
//                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10 
//                        focus-visible:ring-indigo-500"
//                                />
//                            </div>

//                            <div className="space-y-1">
//                                <Label>Nick Name</Label>
//                                <Input
//                                    value={nickname}
//                                    onChange={(e) => setNickname(e.target.value)}
//                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10"
//                                />
//                            </div>

//                            {/* GENDER */}
//                            <div className="md:col-span-2 space-y-2">
//                                <Label>Gender</Label>

//                                <div className="flex gap-3">
//                                    {["Male", "Female", "Other"].map(g => (
//                                        <button
//                                            key={g}
//                                            type="button"
//                                            onClick={() => setGender(g)}
//                                            className={`px-4 py-2 rounded-lg border text-sm transition 
//                                ${gender === g
//                                                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
//                                                    : "bg-gray-100 dark:bg-white/5 border-border dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
//                                                }`}
//                                        >
//                                            {g}
//                                        </button>
//                                    ))}
//                                </div>
//                            </div>

//                            <div className="space-y-1">
//                                <Label>Mobile</Label>
//                                <Input
//                                    value={mobile}
//                                    onChange={(e) => setMobile(e.target.value)}
//                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10"
//                                />
//                            </div>

//                            <div className="space-y-1">
//                                <Label>Country</Label>
//                                <Input
//                                    value={country}
//                                    onChange={(e) => setCountry(e.target.value)}
//                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10"
//                                />
//                            </div>

//                            <div className="md:col-span-2 space-y-1">
//                                <Label>Email</Label>
//                                <Input
//                                    value={email}
//                                    disabled
//                                    className="bg-gray-200 dark:bg-white/10 border-border dark:border-white/10 
//                        text-gray-500 dark:text-gray-400"
//                                />
//                            </div>

//                        </div>

//                    </div>

//                    {/* FOOTER */}
//                    <div className="flex justify-end gap-3 px-6 py-4 border-t 
//        bg-gray-100 dark:bg-white/5 border-border dark:border-white/10">

//                        <Button
//                            variant="outline"
//                            onClick={() => setOpenProfile(false)}
//                            className="hover:bg-gray-200 dark:hover:bg-white/10"
//                        >
//                            Cancel
//                        </Button>

//                        <Button
//                            onClick={saveProfile}
//                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-lg"
//                        >
//                            Save Changes
//                        </Button>

//                    </div>

//                </DialogContent>
//            </Dialog>

//        </>
//    )
//}




"use client"

import Link from "next/link"
import { Bell, Menu, User, Video, ArrowLeft, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as signalR from "@microsoft/signalr"

/* ---------------- TYPES ---------------- */

interface DashboardHeaderProps {
    onMenuClick: () => void
    title: string
}

interface Notification {
    id: number
    fromUserId: string
    fromUserName: string
    toUserId: string
    content: string
    status: string
    isRead: boolean
    createdAt?: string   // ✅ ADD THIS
}

interface Meeting {
    id: string
    title: string
    startTime: string
    meetingLink: string
    isRead?: boolean   // ✅ ADD THIS
}

/* ---------------- COMPONENT ---------------- */

export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {

    /* ================= PROFILE STATE ================= */

    const [name, setName] = useState("")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const storedName = localStorage.getItem("name") || ""
        setName(storedName)
    }, [])
    const [email, setEmail] = useState("")
    const [nickname, setNickname] = useState("")
    const [mobile, setMobile] = useState("")
    const [country, setCountry] = useState("")
    const [gender, setGender] = useState("")
    const [image, setImage] = useState<string | null>(null)
    const [openProfile, setOpenProfile] = useState(false)

    /* ================= NOTIFICATION STATE ================= */

    const [chatNotifs, setChatNotifs] = useState<Notification[]>([])
    const [meetingNotifs, setMeetingNotifs] = useState<Meeting[]>([])
    const [calendarNotifs, setCalendarNotifs] = useState<any[]>([])
    const [showNotifications, setShowNotifications] = useState(false)

    const [currentUserId, setCurrentUserId] = useState("")

    const [userRole, setUserRole] = useState("")


    const getMeetingReadIds = () => {
        const userId = localStorage.getItem("userId")
        return JSON.parse(localStorage.getItem(`readMeetings_${userId}`) || "[]")
    }

    const saveMeetingReadIds = (ids: string[]) => {
        const userId = localStorage.getItem("userId")
        localStorage.setItem(`readMeetings_${userId}`, JSON.stringify(ids))
    }

    const formatTime = (dateString?: string) => {
        if (!dateString) return ""

        const date = new Date(dateString)

        return date.toLocaleString([], {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    // ✅ ADD THIS BELOW 👇
    const formatDateOnly = (dateString?: string) => {
        if (!dateString) return ""

        const date = new Date(dateString)

        return date.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    const formatTimeOnly = (dateString?: string) => {
        if (!dateString) return ""

        const date = new Date(dateString)

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    useEffect(() => {
        const role = localStorage.getItem("role") || ""
        setUserRole(role)
    }, [])

    useEffect(() => {
        const id = localStorage.getItem("userId") || ""
        setCurrentUserId(id)
    }, [])


    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://steadfast-warmth-production-31cc.up.railway.app/chatHub", {
                accessTokenFactory: () => localStorage.getItem("token") || ""
            })
            .withAutomaticReconnect()
            .build()

        connection.start()
            .then(() => console.log("SignalR Connected ✅"))
            .catch(err => console.error("SignalR Error ❌", err))

        // 🔔 LISTEN EVENT
        connection.on("ReceiveNotification", (data) => {
            setChatNotifs(prev => [
                {
                    id: Date.now(),
                    fromUserId: "system",
                    fromUserName: "HR",
                    toUserId: currentUserId,
                    content: `${data.title} - ${data.content}`,
                    status: "info",
                    isRead: false,
                    createdAt: new Date().toISOString() // ✅ FIX
                },
                ...prev
            ])
        })


        return () => {
            connection.stop()
        }
    }, [])

    useEffect(() => {
        const token = localStorage.getItem("token")

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://steadfast-warmth-production-31cc.up.railway.app/chatHub", {
                accessTokenFactory: () => token || ""
            })
            .withAutomaticReconnect()
            .build()

        connection.start()
            .then(() => console.log("SignalR Connected ✅"))
            .catch(err => console.error("SignalR Error ❌", err))

        connection.on("ReceiveNotification", (data) => {

            console.log("NEW ANNOUNCEMENT 🔥", data)

            setChatNotifs(prev => [
                {
                    id: Date.now(),
                    fromUserId: "system",
                    fromUserName: "HR",
                    toUserId: currentUserId,
                    content: `${data.title} - ${data.content}`,
                    status: "info",
                    isRead: false
                },
                ...prev
            ])
        })

        return () => {
            connection.stop()
        }
    }, [currentUserId])
    /* ================= LOAD PROFILE ================= */

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) return

                const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (res.status === 401) {
                    console.error("Unauthorized ❌")
                    localStorage.removeItem("token")
                    window.location.href = "/"
                    return
                }

                if (!res.ok) {
                    console.error("Profile API failed:", res.status)
                    return
                }

                const data = await res.json()

                const finalName = data.name || data.fullName || localStorage.getItem("name") || ""

                setName(finalName)

                // 🔥 IMPORTANT: sync localStorage
                localStorage.setItem("name", finalName)
                setEmail(data.email || "")
                setNickname(data.nickname || "")
                setMobile(data.mobile || "")
                setCountry(data.country || "")
                setGender(data.gender || "")
                setImage(data.profileImage || null)

            } catch (err) {
                console.error("Profile load error:", err)
            }
        }

        loadProfile()
    }, [])

    /* ================= CHAT NOTIFICATIONS ================= */

    const fetchNotifications = async () => {
        try {
            const res = await fetch(
                `https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/${currentUserId}`
            )
            const data = await res.json()

            const readIds = getReadIds()

            //setChatNotifs(
            //    data.map((n: Notification) => ({
            //        ...n,
            //        isRead: readIds.includes(n.id) || n.isRead
            //    }))
            //)

            setChatNotifs(
                data.map((n: Notification) => ({
                    ...n,
                    createdAt: n.createdAt || new Date().toISOString(), // ✅ IMPORTANT
                    isRead: readIds.includes(n.id) ? true : n.isRead
                }))
            )

        } catch {
            setChatNotifs([])
        }
    }

    /* ================= MEETING NOTIFICATIONS ================= */

    const fetchMeetings = async () => {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/meeting/my-meetings", {
                headers: { Authorization: `Bearer ${token}` }
            })

            const data = await res.json()
            const now = new Date()

            const upcoming = data.filter(
                (m: Meeting) => new Date(m.startTime) > now
            )

            const readIds = getMeetingReadIds()

            // ❌ HR ko meeting notification nahi
            if (userRole === "hr") {
                setMeetingNotifs([])
                return
            }

            setMeetingNotifs(
                upcoming.map((m: Meeting) => ({
                    ...m,
                    isRead: readIds.includes(m.id)
                }))
            )

        } catch {
            setMeetingNotifs([])
        }
    }

    // ✅ AUTO TRIGGER EVENT REMINDERS
    useEffect(() => {

        const interval = setInterval(() => {

            const now = new Date().getTime()

            const data = JSON.parse(localStorage.getItem("globalNotifications") || "[]")

            const updated = data.map((n: any) => {

                if (n.triggerTime && !n.triggered) {

                    const diff = Math.abs(now - n.triggerTime)

                    // ⏰ 1 min window
                    if (now >= n.triggerTime && !n.triggered) {

                        return {
                            ...n,
                            triggered: true   // ✅ mark triggered
                        }
                    }
                }

                return n
            })

            localStorage.setItem("globalNotifications", JSON.stringify(updated))
            setCalendarNotifs(updated)

        }, 30000) // check every 30 sec

        return () => clearInterval(interval)

    }, [])

    /* ================= POLLING ================= */

    useEffect(() => {
        if (!currentUserId) return

        fetchNotifications()
        fetchMeetings()

        const interval = setInterval(() => {
            fetchNotifications()
            fetchMeetings()
        }, 3000)

        return () => clearInterval(interval)

    }, [currentUserId])

    const getReadIds = () => {
        if (typeof window === "undefined") return []

        const userId = localStorage.getItem("userId")
        return JSON.parse(localStorage.getItem(`readNotifications_${userId}`) || "[]")
    }

    const loadGlobalNotifications = () => {

        const currentUser = localStorage.getItem("userId")

        const data = JSON.parse(localStorage.getItem("globalNotifications") || "[]")

        // ✅ FILTER ONLY CURRENT USER
        const filtered = data.filter((n: any) => n.userId === currentUser)

        setCalendarNotifs(filtered)
    }

    useEffect(() => {

        loadGlobalNotifications()

        const handler = () => loadGlobalNotifications()

        window.addEventListener("new-notification", handler)

        return () => {
            window.removeEventListener("new-notification", handler)
        }

    }, [])

    const saveReadIds = (ids: number[]) => {
        const userId = localStorage.getItem("userId")
        localStorage.setItem(`readNotifications_${userId}`, JSON.stringify(ids))
    }

    /* ================= REQUEST HANDLER ================= */

    const handleRequest = async (notifId: number, status: string) => {

        await fetch(`https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/${notifId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(status)
        })

        if (status === "accepted") {
            await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/chat/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    notificationId: notifId
                })
            })

            window.dispatchEvent(new Event("chat-updated"))
        }

        // ✅ REMOVE FROM UI (IMPORTANT)
        setChatNotifs(prev =>
            prev.filter(n => n.id !== notifId)
        )

        fetchNotifications()
    }

    /* ================= PROFILE SAVE ================= */

    const saveProfile = async () => {
        try {
            const token = localStorage.getItem("token")

            await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/Account/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    nickname,
                    gender,
                    country,
                    mobile,
                    profileImage: image
                })
            })

            setOpenProfile(false)

        } catch (err) {
            console.error("Profile save error:", err)
        }
    }

    /* ================= IMAGE UPLOAD ================= */

    const handleImageUpload = (e: any) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => setImage(reader.result as string)
        reader.readAsDataURL(file)
    }

    const initials = name
        ? name.split(" ").map(n => n[0]).join("").toUpperCase()
        : "U"

    const unreadChatCount = chatNotifs.filter(n => !n.isRead).length
    const unreadMeetingCount = meetingNotifs.filter(m => !m.isRead).length

    const unreadCalendarCount = calendarNotifs.filter(n => !n.isRead).length

    const totalCount =
        unreadChatCount +
        unreadMeetingCount +
        unreadCalendarCount

    /* ================= UI ================= */
    if (!mounted) return null

    return (
        <>
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="font-semibold">{title}</h1>
                </div>

                <div className="flex items-center gap-2">

                    <ThemeToggle />

                    {/* 🔔 NOTIFICATIONS */}
                    <div className="relative">

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={async () => {

                                const opening = !showNotifications
                                setShowNotifications(opening)

                                if (opening) {
                                    try {
                                        await fetch(
                                            `https://steadfast-warmth-production-31cc.up.railway.app/api/notifications/mark-read/${currentUserId}`,
                                            { method: "PUT" }
                                        )

                                        // ✅ calendar notifications read mark
                                        const updated = calendarNotifs.map(n => ({ ...n, isRead: true }))
                                        setCalendarNotifs(updated)
                                        localStorage.setItem("globalNotifications", JSON.stringify(updated))

                                        //// ✅ SAVE ALL IDs AS READ (PERSIST)
                                        //const allIds = chatNotifs.map(n => n.id)
                                        //saveReadIds(allIds)

                                        const existing = getReadIds()
                                        const newIds = chatNotifs.map(n => n.id)

                                        const merged = Array.from(new Set([...existing, ...newIds]))
                                        saveReadIds(merged)

                                        // ✅ UI update
                                        setChatNotifs(prev =>
                                            prev.map(n => ({ ...n, isRead: true }))
                                        )

                                        setMeetingNotifs(prev =>
                                            prev.map(m => ({ ...m, isRead: true }))
                                        )

                                    } catch (err) {
                                        console.error("Mark read error:", err)
                                    }
                                }
                            }}
                        >
                            <Bell className="h-4 w-4" />

                            {totalCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                                    {totalCount}
                                </span>
                            )}
                        </Button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-[#020617] 
    border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 z-50">

                                <h4 className="font-semibold text-lg mb-3">Notifications</h4>

                                <div className="max-h-96 overflow-y-auto space-y-3">

                                    {/* 🗓 CALENDAR */}
                                    {/* 🗓 CALENDAR */}
                                    {[...calendarNotifs]
                                        .sort((a, b) =>
                                            new Date(b.createdAt || 0).getTime() -
                                            new Date(a.createdAt || 0).getTime()
                                        )
                                        .map(n => (
                                            <div
                                                key={n.id}
                                                className={`p-3 rounded-xl border transition 
            ${!n.isRead
                                                        ? "bg-yellow-50 border-yellow-200"
                                                        : "bg-gray-50 dark:bg-white/5 border-border"
                                                    }`}
                                            >
                                                <p className="text-sm flex items-center gap-2">
                                                    ⏰ <span>{n.text}</span>
                                                </p>
                                            </div>
                                        ))
                                    }


                                    {/* 📅 MEETINGS */}
                                    {[...meetingNotifs]
                                        .sort((a, b) =>
                                            new Date(b.startTime).getTime() -
                                            new Date(a.startTime).getTime()
                                        )
                                        .map(m => (
                                            <div key={m.id}
                                                className={`p-3 rounded-xl border transition 
            ${!m.isRead ? "bg-blue-50 border-blue-200" : "bg-gray-50 dark:bg-white/5 border-border"}`}
                                            >
                                                <div className="flex justify-between items-start">

                                                    {/* LEFT → TITLE */}
                                                    <p className="text-sm font-medium flex items-center gap-2">
                                                        📅 {m.title}
                                                    </p>

                                                    {/* RIGHT → DATE + TIME */}
                                                    <span className="text-[10px] text-gray-500">
                                                        {formatDateOnly(m.startTime)} • {formatTimeOnly(m.startTime)}
                                                    </span>

                                                </div>

                                                <Button
                                                    size="sm"
                                                    className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                                    onClick={() => window.open(m.meetingLink, "_blank")}
                                                >
                                                    <Video className="h-4 w-4 mr-1" /> Join Meeting
                                                </Button>

                                            </div>
                                        ))}


                                    {/* 💬 + 📌 NOTIFICATIONS */}
                                    {/* 💬 + 📌 NOTIFICATIONS */}
                                    {[...chatNotifs]
                                        .sort((a, b) => {
                                            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                                            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                                            return dateB - dateA // newest first
                                        })
                                        .map((n) => {

                                            const isTask = (n.content || "").toLowerCase().includes("task")

                                            return (
                                                <div
                                                    key={n.id}
                                                    className={`p-3 rounded-xl border transition hover:shadow-md
${!n.isRead
                                                            ? "bg-indigo-50 border-indigo-200"
                                                            : "bg-gray-50 dark:bg-white/5 border-border"
                                                        }`}
                                                >

                                                    <div>
                                                        {/* MESSAGE */}
                                                        <p className="text-sm flex items-start gap-2">
                                                            {isTask ? "📌" : "💬"}

                                                            <span>
                                                                <b>{n.fromUserName || "User"}</b> {n.content}
                                                            </span>
                                                        </p>

                                                        {/* TIME */}
                                                        <div className="flex justify-end mt-1">
                                                            <span className="text-[10px] text-gray-500">
                                                                {n.createdAt
                                                                    ? `${formatDateOnly(n.createdAt)} • ${formatTimeOnly(n.createdAt)}`
                                                                    : "Just now"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* ACTION BUTTONS */}
                                                    {n.status === "pending" && !isTask && (
                                                        <div className="flex gap-2 mt-3">
                                                            <Button
                                                                size="sm"
                                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                                onClick={() => handleRequest(n.id, "accepted")}
                                                            >
                                                                Accept
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                className="flex-1"
                                                                onClick={() => handleRequest(n.id, "rejected")}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    )}

                                                </div>
                                            )
                                        })}



                                    {/* EMPTY STATE */}
                                    {chatNotifs.length === 0 &&
                                        meetingNotifs.length === 0 &&
                                        calendarNotifs.length === 0 && (
                                            <div className="text-center py-6 text-gray-500 text-sm">
                                                🚫 No notifications yet
                                            </div>
                                        )}

                                </div>
                            </div>
                        )}
                    </div>

                    {/* USER */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="gap-2">
                                <Avatar className="h-7 w-7">
                                    {image ? (
                                        <AvatarImage src={image} />
                                    ) : (
                                        <AvatarFallback>{initials}</AvatarFallback>
                                    )}
                                </Avatar>
                                {name || "User"}
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setOpenProfile(true)}>
                                <User className="mr-2 h-4 w-4" /> Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/">
                                    <LogOut className="mr-2 h-4 w-4" /> Logout
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </header>
            {/* ================= PROFILE MODAL ================= */}
            <Dialog open={openProfile} onOpenChange={setOpenProfile}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl 
    border border-border 
    bg-white text-black 
    dark:bg-gradient-to-br dark:from-[#020617] dark:to-[#0f172a] dark:text-white 
    shadow-2xl">

                    {/* HEADER */}
                    <div className="flex items-center justify-between px-6 py-4 border-b 
        bg-gray-100 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 
        border-border dark:border-white/10">

                        <div className="flex items-center gap-3 ">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpenProfile(false)}
                                className="hover:bg-black/10 dark:hover:bg-white/20"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>

                            <h2 className="text-lg font-semibold tracking-wide ">
                                Profile Settings
                            </h2>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="p-6 space-y-6">

                        {/* PROFILE TOP */}
                        <div className="flex items-center gap-5">

                            <label className="cursor-pointer relative group">
                                <Avatar className="h-20 w-20 border-2 border-indigo-500 shadow-lg">
                                    {image ? (
                                        <AvatarImage src={image} />
                                    ) : (
                                        <AvatarFallback className="text-lg font-bold bg-indigo-600 text-white">
                                            {initials}
                                        </AvatarFallback>
                                    )}
                                </Avatar>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                    rounded-full flex items-center justify-center text-white text-xs font-medium transition">
                                    Change
                                </div>

                                <input type="file" className="hidden" onChange={handleImageUpload} />
                            </label>

                            <div>
                                <p className="text-lg font-semibold">{name}</p>
                                <p className="text-sm text-muted-foreground">{email}</p>
                            </div>

                        </div>

                        {/* FORM */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div className="space-y-1">
                                <Label>Full Name</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10 
                        focus-visible:ring-indigo-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label>Nick Name</Label>
                                <Input
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10"
                                />
                            </div>

                            {/* GENDER */}
                            <div className="md:col-span-2 space-y-2">
                                <Label>Gender</Label>

                                <div className="flex gap-3">
                                    {["Male", "Female", "Other"].map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setGender(g)}
                                            className={`px-4 py-2 rounded-lg border text-sm transition 
                                ${gender === g
                                                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                                                    : "bg-gray-100 dark:bg-white/5 border-border dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label>Mobile</Label>
                                <Input
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label>Country</Label>
                                <Input
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="bg-gray-50 dark:bg-white/5 border-border dark:border-white/10"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-1">
                                <Label>Email</Label>
                                <Input
                                    value={email}
                                    disabled
                                    className="bg-gray-200 dark:bg-white/10 border-border dark:border-white/10 
                        text-gray-500 dark:text-gray-400"
                                />
                            </div>

                        </div>

                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-end gap-3 px-6 py-4 border-t 
        bg-gray-100 dark:bg-white/5 border-border dark:border-white/10">

                        <Button
                            variant="outline"
                            onClick={() => setOpenProfile(false)}
                            className="hover:bg-gray-200 dark:hover:bg-white/10"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={saveProfile}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-lg"
                        >
                            Save Changes
                        </Button>

                    </div>

                </DialogContent>
            </Dialog>

        </>
    )
}