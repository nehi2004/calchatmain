//"use client"

//import { useEffect, useState } from "react"
//import { useRouter } from "next/navigation"
//import { CalendarDays, Clock, MapPin, Users, Plus, Trash2 } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { Badge } from "@/components/ui/badge"
//import { Input } from "@/components/ui/input"
//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle,
//    DialogTrigger,
//    DialogDescription,
//} from "@/components/ui/dialog"

//interface EventItem {
//    id: string
//    title: string
//    date: string
//    time: string
//    location: string
//    attendees: number
//    type: string
//    status: string
//}

//const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/Events"

//export function EventsView() {
//    const router = useRouter()
//    const [events, setEvents] = useState<EventItem[]>([])
//    const [dialogOpen, setDialogOpen] = useState(false)

//    const [newEvent, setNewEvent] = useState({
//        title: "",
//        date: "",
//        time: "",
//        location: "",
//        attendees: 0,
//        type: "",
//        status: "Upcoming",
//    })

//    // ================= AUTH CHECK =================
//    useEffect(() => {
//        const token = localStorage.getItem("token")
//        if (!token) {
//            router.push("/login")
//            return
//        }
//        fetchEvents()
//    }, [])

//    // ================= FETCH =================
//    async function fetchEvents() {
//        const token = localStorage.getItem("token")

//        const res = await fetch(API_URL, {
//            headers: {
//                Authorization: `Bearer ${token}`,
//            },
//        })

//        if (res.status === 401) {
//            localStorage.removeItem("token")
//            router.push("/login")
//            return
//        }

//        const data = await res.json()

//        const formatted = data.map((e: any) => ({
//            ...e,
//            date: e.date ? e.date.split("T")[0] : "",
//        }))

//        setEvents(formatted)
//    }

//    // ================= ADD =================
//    async function handleAddEvent() {
//        const token = localStorage.getItem("token")

//        await fetch(API_URL, {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`,
//            },
//            body: JSON.stringify({
//                ...newEvent,
//                date: newEvent.date
//                    ? new Date(newEvent.date).toISOString()
//                    : null,
//            }),
//        })

//        await fetchEvents()
//        setDialogOpen(false)

//        setNewEvent({
//            title: "",
//            date: "",
//            time: "",
//            location: "",
//            attendees: 0,
//            type: "",
//            status: "Upcoming",
//        })
//    }

//    // ================= DELETE =================
//    async function handleDelete(id: string) {
//        const token = localStorage.getItem("token")

//        await fetch(`${API_URL}/${id}`, {
//            method: "DELETE",
//            headers: {
//                Authorization: `Bearer ${token}`,
//            },
//        })

//        await fetchEvents()
//    }

//    return (
//        <div className="flex flex-col gap-6">

//            <div className="flex items-center justify-between">
//                <div>
//                    <h2 className="text-xl font-bold">Events</h2>
//                    <p className="text-sm text-muted-foreground">
//                        Manage and view your events
//                    </p>
//                </div>

//                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                    <DialogTrigger asChild>
//                        <Button className="gap-2">
//                            <Plus className="h-4 w-4" />
//                            Create Event
//                        </Button>
//                    </DialogTrigger>

//                    <DialogContent>
//                        <DialogHeader>
//                            <DialogTitle>Create Event</DialogTitle>
//                            <DialogDescription>
//                                Add a new event
//                            </DialogDescription>
//                        </DialogHeader>

//                        <div className="flex flex-col gap-3 pt-4">
//                            <Input placeholder="Title"
//                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
//                            />
//                            <Input type="date"
//                                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
//                            />
//                            <Input placeholder="Time"
//                                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
//                            />
//                            <Input placeholder="Location"
//                                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
//                            />
//                            <Input type="number" placeholder="Attendees"
//                                onChange={(e) => setNewEvent({ ...newEvent, attendees: Number(e.target.value) })}
//                            />
//                            <Input placeholder="Type"
//                                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
//                            />

//                            <Button onClick={handleAddEvent}>Save Event</Button>
//                        </div>
//                    </DialogContent>
//                </Dialog>
//            </div>

//            <div className="grid gap-4 lg:grid-cols-2">
//                {events.map((event) => (
//                    <div key={event.id}
//                        className="rounded-xl border bg-card p-6 hover:shadow-md">

//                        <div className="flex justify-between">
//                            <div>
//                                <h3 className="font-semibold">{event.title}</h3>

//                                <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
//                                    <span className="flex items-center gap-2">
//                                        <CalendarDays className="h-4 w-4" /> {event.date}
//                                    </span>
//                                    <span className="flex items-center gap-2">
//                                        <Clock className="h-4 w-4" /> {event.time}
//                                    </span>
//                                    <span className="flex items-center gap-2">
//                                        <MapPin className="h-4 w-4" /> {event.location}
//                                    </span>
//                                    <span className="flex items-center gap-2">
//                                        <Users className="h-4 w-4" /> {event.attendees} attendees
//                                    </span>
//                                </div>
//                            </div>

//                            <div className="flex flex-col items-end gap-2">
//                                <Badge>{event.status}</Badge>
//                                <Badge variant="outline">{event.type}</Badge>
//                                <Button variant="ghost" size="icon"
//                                    onClick={() => handleDelete(event.id)}>
//                                    <Trash2 className="h-4 w-4" />
//                                </Button>
//                            </div>
//                        </div>
//                    </div>
//                ))}
//            </div>
//        </div>
//    )
//}








//"use client"

//import { useEffect, useState } from "react"
//import { useRouter } from "next/navigation"
//import {
//    CalendarDays,
//    Clock,
//    MapPin,
//    Users,
//    Plus,
//    Trash2,
//} from "lucide-react"

//import { Button } from "@/components/ui/button"
//import { Badge } from "@/components/ui/badge"
//import { Input } from "@/components/ui/input"
//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle,
//    DialogTrigger,
//    DialogDescription,
//} from "@/components/ui/dialog"

//interface EventItem {
//    id: string
//    title: string
//    date: string
//    time: string
//    location: string
//    attendees: number
//    type: string
//    status: string
//}

//const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/Events"

//export function EventsView() {

//    const router = useRouter()

//    const [events, setEvents] = useState<EventItem[]>([])
//    const [dialogOpen, setDialogOpen] = useState(false)

//    const [newEvent, setNewEvent] = useState({
//        title: "",
//        date: "",
//        time: "",
//        location: "",
//        attendees: 0,
//        type: "",
//        status: "Upcoming",
//    })

//    // ================= INIT =================
//    useEffect(() => {
//        const token = localStorage.getItem("token")
//        if (!token) return router.push("/login")
//        fetchEvents()
//    }, [])

//    // ================= FETCH =================
//    async function fetchEvents() {
//        const token = localStorage.getItem("token")

//        const res = await fetch(API_URL, {
//            headers: { Authorization: `Bearer ${token}` },
//        })

//        const data = await res.json()

//        setEvents(
//            data.map((e: any) => ({
//                ...e,
//                date: e.date?.split("T")[0],
//            }))
//        )
//    }

//    // ================= ADD =================
//    async function handleAddEvent() {
//        if (!newEvent.title || !newEvent.date) {
//            alert("Fill required fields")
//            return
//        }

//        const token = localStorage.getItem("token")

//        await fetch(API_URL, {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`,
//            },
//            body: JSON.stringify({
//                ...newEvent,
//                date: newEvent.date
//                    ? new Date(newEvent.date).toISOString()
//                    : null,
//            }),
//        })

//        fetchEvents()
//        setDialogOpen(false)

//        setNewEvent({
//            title: "",
//            date: "",
//            time: "",
//            location: "",
//            attendees: 0,
//            type: "",
//            status: "Upcoming",
//        })
//    }

//    // ================= DELETE =================
//    async function handleDelete(id: string) {
//        const token = localStorage.getItem("token")

//        await fetch(`${API_URL}/${id}`, {
//            method: "DELETE",
//            headers: { Authorization: `Bearer ${token}` },
//        })

//        fetchEvents()
//    }

//    return (
//        <div className="flex flex-col gap-6">

//            {/* HEADER */}
//            <div className="flex items-center justify-between">
//                <div>
//                    <h2 className="text-2xl font-semibold">Events</h2>
//                    <p className="text-sm text-muted-foreground">
//                        Manage and track your events
//                    </p>
//                </div>

//                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                    <DialogTrigger asChild>
//                        <Button className="gap-2 shadow-lg">
//                            <Plus className="h-4 w-4" />
//                            Create Event
//                        </Button>
//                    </DialogTrigger>

//                    {/* 🔥 MODERN FORM */}
//                    <DialogContent className="rounded-2xl">
//                        <DialogHeader>
//                            <DialogTitle>Create Event 🎉</DialogTitle>
//                            <DialogDescription>
//                                Fill details to create event
//                            </DialogDescription>
//                        </DialogHeader>

//                        <div className="space-y-4 mt-4">

//                            <Input
//                                placeholder="Event Title"
//                                value={newEvent.title}
//                                onChange={(e) =>
//                                    setNewEvent({ ...newEvent, title: e.target.value })
//                                }
//                            />

//                            <div className="grid grid-cols-2 gap-4">
//                                <Input
//                                    type="date"
//                                    value={newEvent.date}
//                                    onChange={(e) =>
//                                        setNewEvent({ ...newEvent, date: e.target.value })
//                                    }
//                                />

//                                <Input
//                                    placeholder="Time (e.g. 10:00 AM)"
//                                    value={newEvent.time}
//                                    onChange={(e) =>
//                                        setNewEvent({ ...newEvent, time: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <Input
//                                placeholder="Location"
//                                value={newEvent.location}
//                                onChange={(e) =>
//                                    setNewEvent({ ...newEvent, location: e.target.value })
//                                }
//                            />

//                            <div className="grid grid-cols-2 gap-4">
//                                <Input
//                                    type="number"
//                                    placeholder="Attendees"
//                                    value={newEvent.attendees}
//                                    onChange={(e) =>
//                                        setNewEvent({
//                                            ...newEvent,
//                                            attendees: Number(e.target.value),
//                                        })
//                                    }
//                                />

//                                <Input
//                                    placeholder="Type (Meeting, Workshop...)"
//                                    value={newEvent.type}
//                                    onChange={(e) =>
//                                        setNewEvent({ ...newEvent, type: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <Button
//                                onClick={handleAddEvent}
//                                className="w-full shadow-md"
//                            >
//                                Save Event
//                            </Button>
//                        </div>
//                    </DialogContent>
//                </Dialog>
//            </div>

//            {/* EMPTY STATE */}
//            {events.length === 0 && (
//                <div className="text-center py-10 text-muted-foreground">
//                    No events found 🚀
//                </div>
//            )}

//            {/* EVENTS GRID */}
//            <div className="grid gap-5 lg:grid-cols-2">
//                {events.map((event) => (
//                    <div
//                        key={event.id}
//                        className="rounded-2xl border bg-background/60 backdrop-blur-md p-5 shadow-sm hover:shadow-xl transition-all duration-300"
//                    >
//                        <div className="flex justify-between gap-4">

//                            {/* LEFT */}
//                            <div>
//                                <h3 className="font-semibold text-lg">
//                                    {event.title}
//                                </h3>

//                                <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">

//                                    <span className="flex items-center gap-2">
//                                        <CalendarDays className="h-4 w-4" />
//                                        {event.date}
//                                    </span>

//                                    <span className="flex items-center gap-2">
//                                        <Clock className="h-4 w-4" />
//                                        {event.time || "Not set"}
//                                    </span>

//                                    <span className="flex items-center gap-2">
//                                        <MapPin className="h-4 w-4" />
//                                        {event.location || "No location"}
//                                    </span>

//                                    <span className="flex items-center gap-2">
//                                        <Users className="h-4 w-4" />
//                                        {event.attendees} attendees
//                                    </span>
//                                </div>
//                            </div>

//                            {/* RIGHT */}
//                            <div className="flex flex-col items-end gap-2">

//                                {/* STATUS BADGE */}
//                                <Badge
//                                    className={
//                                        event.status === "Upcoming"
//                                            ? "bg-blue-100 text-blue-600"
//                                            : "bg-green-100 text-green-600"
//                                    }
//                                >
//                                    {event.status}
//                                </Badge>

//                                {/* TYPE BADGE */}
//                                <Badge
//                                    variant="outline"
//                                    className="border-purple-300 text-purple-600"
//                                >
//                                    {event.type || "General"}
//                                </Badge>

//                                <Button
//                                    variant="ghost"
//                                    size="icon"
//                                    onClick={() => handleDelete(event.id)}
//                                >
//                                    <Trash2 className="h-4 w-4" />
//                                </Button>
//                            </div>

//                        </div>
//                    </div>
//                ))}
//            </div>
//        </div>
//    )
//}








//"use client"

//import { useEffect, useState } from "react"
//import { useRouter } from "next/navigation"
//import {
//    CalendarDays,
//    Clock,
//    MapPin,
//    Users,
//    Plus,
//    Trash2,
//} from "lucide-react"

//import { Button } from "@/components/ui/button"
//import { Badge } from "@/components/ui/badge"
//import { Input } from "@/components/ui/input"
//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle,
//    DialogTrigger,
//    DialogDescription,
//} from "@/components/ui/dialog"

//interface EventItem {
//    id: string
//    title: string
//    date: string
//    time: string
//    location: string
//    attendees: number
//    type: string
//    status: string
//}

//const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/Events"

//export function EventsView() {

//    const router = useRouter()

//    const [events, setEvents] = useState<EventItem[]>([])
//    const [dialogOpen, setDialogOpen] = useState(false)

//    const [newEvent, setNewEvent] = useState({
//        title: "",
//        date: "",
//        time: "",
//        location: "",
//        attendees: 0,
//        type: "",
//        status: "Upcoming",
//    })

//    // ✅ EVENT REMINDER SAVE (1 day before)
//    const saveEventReminder = (event: any) => {

//        const existing = JSON.parse(localStorage.getItem("globalNotifications") || "[]")

//        const eventDate = new Date(event.date)

//        // 👉 1 day before
//        const reminderDate = new Date(eventDate)
//        reminderDate.setDate(reminderDate.getDate() - 1)

//        // 👉 evening time (7 PM)
//        reminderDate.setHours(19, 0, 0, 0)

//        const newNotif = {
//            id: Date.now(),
//            text: `📅 Tomorrow: ${event.title}`,
//            isRead: false,
//            triggerTime: reminderDate.getTime()   // 🔥 IMPORTANT
//        }

//        localStorage.setItem(
//            "globalNotifications",
//            JSON.stringify([newNotif, ...existing])
//        )

//        window.dispatchEvent(new Event("new-notification"))
//    }
//    // ================= INIT =================
//    useEffect(() => {
//        const token = localStorage.getItem("token")
//        if (!token) return router.push("/login")
//        fetchEvents()
//    }, [])

//    // ================= FETCH =================
//    async function fetchEvents() {
//        const token = localStorage.getItem("token")

//        const res = await fetch(API_URL, {
//            headers: { Authorization: `Bearer ${token}` },
//        })


//        const data = await res.json()

//        setEvents(
//            data.map((e: any) => ({
//                ...e,
//                date: e.date?.split("T")[0],
//            }))
//        )
//    }

//    // ================= ADD =================
//    async function handleAddEvent() {
//        if (!newEvent.title || !newEvent.date) {
//            alert("Fill required fields")
//            return
//        }

//        const token = localStorage.getItem("token")

//        await fetch(API_URL, {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`,
//            },
//            body: JSON.stringify({
//                ...newEvent,
//                date: newEvent.date
//                    ? new Date(newEvent.date).toISOString()
//                    : null,
//            }),
//        })

//        // ✅ ADD THIS LINE
//        saveEventReminder(newEvent)

//        fetchEvents()
//        setDialogOpen(false)

//        setNewEvent({
//            title: "",
//            date: "",
//            time: "",
//            location: "",
//            attendees: 0,
//            type: "",
//            status: "Upcoming",
//        })
//    }

//    // ================= DELETE =================
//    async function handleDelete(id: string) {
//        const token = localStorage.getItem("token")

//        await fetch(`${API_URL}/${id}`, {
//            method: "DELETE",
//            headers: { Authorization: `Bearer ${token}` },
//        })

//        fetchEvents()
//    }

//    return (
//        <div className="flex flex-col gap-6">

//            {/* HEADER */}
//            <div className="flex items-center justify-between">
//                <div>
//                    <h2 className="text-2xl font-semibold">Events</h2>
//                    <p className="text-sm text-muted-foreground">
//                        Manage and track your events
//                    </p>
//                </div>

//                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                    <DialogTrigger asChild>
//                        <Button className="gap-2 shadow-lg">
//                            <Plus className="h-4 w-4" />
//                            Create Event
//                        </Button>
//                    </DialogTrigger>

//                    {/* 🔥 MODERN FORM */}
//                    <DialogContent className="rounded-2xl">
//                        <DialogHeader>
//                            <DialogTitle>Create Event 🎉</DialogTitle>
//                            <DialogDescription>
//                                Fill details to create event
//                            </DialogDescription>
//                        </DialogHeader>

//                        <div className="space-y-4 mt-4">

//                            <Input
//                                placeholder="Event Title"
//                                value={newEvent.title}
//                                onChange={(e) =>
//                                    setNewEvent({ ...newEvent, title: e.target.value })
//                                }
//                            />

//                            <div className="grid grid-cols-2 gap-4">
//                                <Input
//                                    type="date"
//                                    value={newEvent.date}
//                                    onChange={(e) =>
//                                        setNewEvent({ ...newEvent, date: e.target.value })
//                                    }
//                                />

//                                <Input
//                                    placeholder="Time (e.g. 10:00 AM)"
//                                    value={newEvent.time}
//                                    onChange={(e) =>
//                                        setNewEvent({ ...newEvent, time: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <Input
//                                placeholder="Location"
//                                value={newEvent.location}
//                                onChange={(e) =>
//                                    setNewEvent({ ...newEvent, location: e.target.value })
//                                }
//                            />

//                            <div className="grid grid-cols-2 gap-4">
//                                <Input
//                                    type="number"
//                                    placeholder="Attendees"
//                                    value={newEvent.attendees}
//                                    onChange={(e) =>
//                                        setNewEvent({
//                                            ...newEvent,
//                                            attendees: Number(e.target.value),
//                                        })
//                                    }
//                                />

//                                <Input
//                                    placeholder="Type (Meeting, Workshop...)"
//                                    value={newEvent.type}
//                                    onChange={(e) =>
//                                        setNewEvent({ ...newEvent, type: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <Button
//                                onClick={handleAddEvent}
//                                className="w-full shadow-md"
//                            >
//                                Save Event
//                            </Button>
//                        </div>
//                    </DialogContent>
//                </Dialog>
//            </div>

//            {/* EMPTY STATE */}
//            {events.length === 0 && (
//                <div className="text-center py-10 text-muted-foreground">
//                    No events found 🚀
//                </div>
//            )}

//            {/* EVENTS GRID */}
//            <div className="grid gap-5 lg:grid-cols-2">
//                {events.map((event) => (
//                    <div
//                        key={event.id}
//                        className="rounded-2xl border bg-background/60 backdrop-blur-md p-5 shadow-sm hover:shadow-xl transition-all duration-300"
//                    >
//                        <div className="flex justify-between gap-4">

//                            {/* LEFT */}
//                            <div>
//                                <h3 className="font-semibold text-lg">
//                                    {event.title}
//                                </h3>

//                                <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">

//                                    <span className="flex items-center gap-2">
//                                        <CalendarDays className="h-4 w-4" />
//                                        {event.date}
//                                    </span>

//                                    <span className="flex items-center gap-2">
//                                        <Clock className="h-4 w-4" />
//                                        {event.time || "Not set"}
//                                    </span>

//                                    <span className="flex items-center gap-2">
//                                        <MapPin className="h-4 w-4" />
//                                        {event.location || "No location"}
//                                    </span>

//                                    <span className="flex items-center gap-2">
//                                        <Users className="h-4 w-4" />
//                                        {event.attendees} attendees
//                                    </span>
//                                </div>
//                            </div>

//                            {/* RIGHT */}
//                            <div className="flex flex-col items-end gap-2">

//                                {/* STATUS BADGE */}
//                                <Badge
//                                    className={
//                                        event.status === "Upcoming"
//                                            ? "bg-blue-100 text-blue-600"
//                                            : "bg-green-100 text-green-600"
//                                    }
//                                >
//                                    {event.status}
//                                </Badge>

//                                {/* TYPE BADGE */}
//                                <Badge
//                                    variant="outline"
//                                    className="border-purple-300 text-purple-600"
//                                >
//                                    {event.type || "General"}
//                                </Badge>

//                                <Button
//                                    variant="ghost"
//                                    size="icon"
//                                    onClick={() => handleDelete(event.id)}
//                                >
//                                    <Trash2 className="h-4 w-4" />
//                                </Button>
//                            </div>

//                        </div>
//                    </div>
//                ))}
//            </div>
//        </div>
//    )
//}








//"use client"

//import { useEffect, useState } from "react"
//import { useRouter } from "next/navigation"
//import {
//    CalendarDays,
//    Clock,
//    MapPin,
//    Users,
//    Plus,
//    Trash2,
//} from "lucide-react"

//import { Button } from "@/components/ui/button"
//import { Badge } from "@/components/ui/badge"
//import { Input } from "@/components/ui/input"
//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle,
//    DialogTrigger,
//    DialogDescription,
//} from "@/components/ui/dialog"

//interface EventItem {
//    id: string
//    title: string
//    date: string
//    time: string
//    location: string
//    attendees: number
//    type: string
//    status: string
//}

//const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/Events"

//export function EventsView() {

//    const router = useRouter()

//    const [events, setEvents] = useState<EventItem[]>([])
//    const [dialogOpen, setDialogOpen] = useState(false)

//    const [newEvent, setNewEvent] = useState({
//        title: "",
//        date: "",
//        time: "",
//        location: "",
//        attendees: 0,
//        type: "",
//        status: "Upcoming",
//    })

//    // ✅ EVENT REMINDER SAVE (1 day before)
//    const saveEventReminder = (event: any) => {

//        const existing = JSON.parse(localStorage.getItem("globalNotifications") || "[]")

//        const eventDate = new Date(event.date)

//        // 👉 1 day before
//        const reminderDate = new Date(eventDate)
//        reminderDate.setDate(reminderDate.getDate() - 1)

//        // 👉 evening time (7 PM)
//        reminderDate.setHours(19, 0, 0, 0)

//        const newNotif = {
//            id: Date.now(),
//            text: `📅 Tomorrow: ${event.title}`,
//            isRead: false,
//            triggerTime: reminderDate.getTime()   // 🔥 IMPORTANT
//        }

//        localStorage.setItem(
//            "globalNotifications",
//            JSON.stringify([newNotif, ...existing])
//        )

//        window.dispatchEvent(new Event("new-notification"))
//    }
//    // ================= INIT =================
//    useEffect(() => {
//        const token = localStorage.getItem("token")
//        if (!token) return router.push("/login")
//        fetchEvents()
//    }, [])

//    // ================= FETCH =================
//    async function fetchEvents() {
//        const token = localStorage.getItem("token")

//        const res = await fetch(API_URL, {
//            headers: { Authorization: `Bearer ${token}` },
//        })


//        const data = await res.json()

//        setEvents(
//            data.map((e: any) => ({
//                ...e,
//                date: e.date?.split("T")[0],
//            }))
//        )
//    }

//    // ================= ADD =================
//    async function handleAddEvent() {
//        if (!newEvent.title || !newEvent.date) {
//            alert("Fill required fields")
//            return
//        }

//        const token = localStorage.getItem("token")

//        await fetch(API_URL, {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`,
//            },
//            body: JSON.stringify({
//                ...newEvent,
//                date: newEvent.date
//                    ? new Date(newEvent.date).toISOString()
//                    : null,
//            }),
//        })

//        // ✅ ADD THIS LINE
//        saveEventReminder(newEvent)

//        // ✅ CREATE REMINDER (1 DAY BEFORE EVENING 6PM)
//        if (newEvent.date) {

//            const eventDate = new Date(newEvent.date)

//            // 1 day before
//            eventDate.setDate(eventDate.getDate() - 1)

//            // set time = evening 6 PM
//            eventDate.setHours(18, 0, 0, 0)

//            const reminder = {
//                id: Date.now(),
//                text: `Reminder: ${newEvent.title}`, // ❌ removed "tomorrow"
//                eventDate: newEvent.date,            // ✅ ADD THIS
//                triggerTime: eventDate.getTime(),
//                isRead: false,
//                triggered: false,
//                userId: localStorage.getItem("userId"),
//                createdAt: new Date().toISOString() // ✅ ADD THIS (sorting ke liye)
//            }

//            const existing = JSON.parse(localStorage.getItem("globalNotifications") || "[]")

//            localStorage.setItem(
//                "globalNotifications",
//                JSON.stringify([...existing, reminder])
//            )

//            window.dispatchEvent(new Event("new-notification"))
//        }

//        fetchEvents()
//        setDialogOpen(false)

//        setNewEvent({
//            title: "",
//            date: "",
//            time: "",
//            location: "",
//            attendees: 0,
//            type: "",
//            status: "Upcoming",
//        })
//    }

//    // ================= DELETE =================
//    async function handleDelete(id: string) {
//        const token = localStorage.getItem("token")

//        await fetch(`${API_URL}/${id}`, {
//            method: "DELETE",
//            headers: { Authorization: `Bearer ${token}` },
//        })

//        fetchEvents()
//    }

//    return (
//        <div className="flex flex-col gap-6">

//            {/* HEADER */}
//            <div className="flex items-center justify-between">
//                <div>
//                    <h2 className="text-2xl font-semibold">Events</h2>
//                    <p className="text-sm text-muted-foreground">
//                        Manage and track your events
//                    </p>
//                </div>

//                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                    <DialogTrigger asChild>
//                        <Button className="gap-2 shadow-lg">
//                            <Plus className="h-4 w-4" />
//                            Create Event
//                        </Button>
//                    </DialogTrigger>

//                    {/* 🔥 MODERN FORM */}
//                    <DialogContent className="rounded-2xl">
//                        <DialogHeader>
//                            <DialogTitle>Create Event 🎉</DialogTitle>
//                            <DialogDescription>
//                                Fill details to create event
//                            </DialogDescription>
//                        </DialogHeader>

//                        <div className="space-y-4 mt-4">

//                            <Input
//                                placeholder="Event Title"
//                                value={newEvent.title}
//                                onChange={(e) =>
//                                    setNewEvent({ ...newEvent, title: e.target.value })
//                                }
//                            />

//                            <div className="grid grid-cols-2 gap-4">
//                                <Input
//                                    type="date"
//                                    value={newEvent.date}
//                                    onChange={(e) =>
//                                        setNewEvent({ ...newEvent, date: e.target.value })
//                                    }
//                                />

//                                <Input
//                                    placeholder="Time (e.g. 10:00 AM)"
//                                    value={newEvent.time}
//                                    onChange={(e) =>
//                                        setNewEvent({ ...newEvent, time: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <Input
//                                placeholder="Location"
//                                value={newEvent.location}
//                                onChange={(e) =>
//                                    setNewEvent({ ...newEvent, location: e.target.value })
//                                }
//                            />

//                            <div className="grid grid-cols-2 gap-4">
//                                <Input
//                                    type="number"
//                                    placeholder="Attendees"
//                                    value={newEvent.attendees}
//                                    onChange={(e) =>
//                                        setNewEvent({
//                                            ...newEvent,
//                                            attendees: Number(e.target.value),
//                                        })
//                                    }
//                                />

//                                <Input
//                                    placeholder="Type (Meeting, Workshop...)"
//                                    value={newEvent.type}
//                                    onChange={(e) =>
//                                        setNewEvent({ ...newEvent, type: e.target.value })
//                                    }
//                                />
//                            </div>

//                            <Button
//                                onClick={handleAddEvent}
//                                className="w-full shadow-md"
//                            >
//                                Save Event
//                            </Button>
//                        </div>
//                    </DialogContent>
//                </Dialog>
//            </div>

//            {/* EMPTY STATE */}
//            {events.length === 0 && (
//                <div className="text-center py-10 text-muted-foreground">
//                    No events found 🚀
//                </div>
//            )}

//            {/* EVENTS GRID */}
//            <div className="grid gap-5 lg:grid-cols-2">
//                {events.map((event) => (
//                    <div
//                        key={event.id}
//                        className="rounded-2xl border bg-background/60 backdrop-blur-md p-5 shadow-sm hover:shadow-xl transition-all duration-300"
//                    >
//                        <div className="flex justify-between gap-4">

//                            {/* LEFT */}
//                            <div>
//                                <h3 className="font-semibold text-lg">
//                                    {event.title}
//                                </h3>

//                                <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">

//                                    <span className="flex items-center gap-2">
//                                        <CalendarDays className="h-4 w-4" />
//                                        {event.date}
//                                    </span>

//                                    <span className="flex items-center gap-2">
//                                        <Clock className="h-4 w-4" />
//                                        {event.time || "Not set"}
//                                    </span>

//                                    <span className="flex items-center gap-2">
//                                        <MapPin className="h-4 w-4" />
//                                        {event.location || "No location"}
//                                    </span>

//                                    <span className="flex items-center gap-2">
//                                        <Users className="h-4 w-4" />
//                                        {event.attendees} attendees
//                                    </span>
//                                </div>
//                            </div>

//                            {/* RIGHT */}
//                            <div className="flex flex-col items-end gap-2">

//                                {/* STATUS BADGE */}
//                                <Badge
//                                    className={
//                                        event.status === "Upcoming"
//                                            ? "bg-blue-100 text-blue-600"
//                                            : "bg-green-100 text-green-600"
//                                    }
//                                >
//                                    {event.status}
//                                </Badge>

//                                {/* TYPE BADGE */}
//                                <Badge
//                                    variant="outline"
//                                    className="border-purple-300 text-purple-600"
//                                >
//                                    {event.type || "General"}
//                                </Badge>

//                                <Button
//                                    variant="ghost"
//                                    size="icon"
//                                    onClick={() => handleDelete(event.id)}
//                                >
//                                    <Trash2 className="h-4 w-4" />
//                                </Button>
//                            </div>

//                        </div>
//                    </div>
//                ))}
//            </div>
//        </div>
//    )
//}













//"use client"

//import { useEffect, useMemo, useState } from "react"
//import { useRouter } from "next/navigation"
//import {
//    CalendarDays,
//    Clock,
//    MapPin,
//    Users,
//    Plus,
//    Trash2,
//    Search,
//    RefreshCw,
//    Inbox,
//    Pencil,
//} from "lucide-react"

//import { Button } from "@/components/ui/button"
//import { Badge } from "@/components/ui/badge"
//import { Input } from "@/components/ui/input"
//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle,
//    DialogTrigger,
//    DialogDescription,
//} from "@/components/ui/dialog"

//interface EventItem {
//    id: string
//    title: string
//    date: string
//    time: string
//    location: string
//    attendees: number
//    type: string
//    status: "Upcoming" | "Today" | "Past" | "Cancelled"
//}

//const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/Events"

//const initialEventState = {
//    id: "",
//    title: "",
//    date: "",
//    time: "",
//    location: "",
//    attendees: 0,
//    type: "",
//    status: "Upcoming" as "Upcoming" | "Today" | "Past" | "Cancelled",
//}

//function getStatusBadgeClasses(status: string) {
//    switch ((status || "").toLowerCase()) {
//        case "today":
//            return "border-orange-200 bg-orange-100 text-orange-700"
//        case "upcoming":
//            return "border-blue-200 bg-blue-100 text-blue-700"
//        case "past":
//            return "border-slate-200 bg-slate-100 text-slate-700"
//        case "cancelled":
//            return "border-red-200 bg-red-100 text-red-700"
//        default:
//            return "border-slate-200 bg-slate-100 text-slate-700"
//    }
//}

//function getTypeBadgeClasses(type: string) {
//    switch ((type || "").toLowerCase()) {
//        case "meeting":
//            return "border-indigo-300 text-indigo-700"
//        case "workshop":
//            return "border-purple-300 text-purple-700"
//        case "training":
//            return "border-amber-300 text-amber-700"
//        default:
//            return "border-slate-300 text-slate-700"
//    }
//}

//function deriveStatus(date?: string, existingStatus?: string) {
//    if ((existingStatus || "").toLowerCase() === "cancelled") return "Cancelled"
//    if (!date) return "Upcoming"

//    const today = new Date()
//    today.setHours(0, 0, 0, 0)

//    const eventDate = new Date(date)
//    eventDate.setHours(0, 0, 0, 0)

//    if (eventDate.getTime() < today.getTime()) return "Past"
//    if (eventDate.getTime() === today.getTime()) return "Today"
//    return "Upcoming"
//}

//function getDateKey(date: string | Date) {
//    const value = new Date(date)
//    const year = value.getFullYear()
//    const month = String(value.getMonth() + 1).padStart(2, "0")
//    const day = String(value.getDate()).padStart(2, "0")
//    return `${year}-${month}-${day}`
//}

//export function EventsView() {
//    const router = useRouter()

//    const [events, setEvents] = useState<EventItem[]>([])
//    const [dialogOpen, setDialogOpen] = useState(false)
//    const [loading, setLoading] = useState(true)
//    const [refreshing, setRefreshing] = useState(false)
//    const [submitting, setSubmitting] = useState(false)
//    const [search, setSearch] = useState("")
//    const [statusFilter, setStatusFilter] = useState("all")
//    const [error, setError] = useState("")
//    const [editingId, setEditingId] = useState<string | null>(null)

//    const [formData, setFormData] = useState(initialEventState)

//    useEffect(() => {
//        const token = localStorage.getItem("token")
//        if (!token) {
//            router.push("/login")
//            return
//        }
//        fetchEvents()
//    }, [router])

//    function resetForm() {
//        setFormData(initialEventState)
//        setEditingId(null)
//    }

//    function saveEventReminder(event: EventItem | typeof initialEventState) {
//        if (!event.date) return

//        const eventStatus = deriveStatus(event.date, event.status)
//        if (eventStatus === "Past" || eventStatus === "Cancelled") return

//        const existing = JSON.parse(localStorage.getItem("globalNotifications") || "[]")
//        const reminderDate = new Date(event.date)
//        reminderDate.setDate(reminderDate.getDate() - 1)
//        reminderDate.setHours(19, 0, 0, 0)

//        const dedupeKey = `event-reminder-${event.title}-${event.date}`

//        const alreadyExists = existing.some((item: any) => item.dedupeKey === dedupeKey)
//        if (alreadyExists) return

//        const newNotif = {
//            id: Date.now(),
//            dedupeKey,
//            text: `Tomorrow: ${event.title}`,
//            isRead: false,
//            triggerTime: reminderDate.getTime(),
//            eventDate: event.date,
//            triggered: false,
//            createdAt: new Date().toISOString(),
//            userId: localStorage.getItem("userId"),
//        }

//        localStorage.setItem(
//            "globalNotifications",
//            JSON.stringify([newNotif, ...existing])
//        )

//        window.dispatchEvent(new Event("new-notification"))
//    }

//    async function fetchEvents(isRefresh = false) {
//        try {
//            if (isRefresh) {
//                setRefreshing(true)
//            } else {
//                setLoading(true)
//            }

//            setError("")
//            const token = localStorage.getItem("token")

//            const res = await fetch(API_URL, {
//                headers: { Authorization: `Bearer ${token}` },
//            })

//            if (!res.ok) {
//                throw new Error("Failed to load events")
//            }

//            const data = await res.json()

//            const formatted = data
//                .map((e: any) => {
//                    const normalizedDate = e.date?.split("T")[0] || ""
//                    return {
//                        ...e,
//                        date: normalizedDate,
//                        status: deriveStatus(normalizedDate, e.status),
//                        type: e.type || "General",
//                        time: e.time || "",
//                        location: e.location || "",
//                        attendees: e.attendees || 0,
//                    }
//                })
//                .sort((a: EventItem, b: EventItem) => {
//                    const order = { Today: 0, Upcoming: 1, Past: 2, Cancelled: 3 }
//                    const statusDiff = order[a.status] - order[b.status]
//                    if (statusDiff !== 0) return statusDiff

//                    if (a.status === "Past") {
//                        return new Date(b.date).getTime() - new Date(a.date).getTime()
//                    }

//                    return new Date(a.date).getTime() - new Date(b.date).getTime()
//                })

//            setEvents(formatted)
//        } catch (err) {
//            console.error("fetchEvents error:", err)
//            setError("Unable to load events right now.")
//            setEvents([])
//        } finally {
//            setLoading(false)
//            setRefreshing(false)
//        }
//    }

//    async function handleSaveEvent() {
//        const title = formData.title.trim()
//        const location = formData.location.trim()
//        const type = formData.type.trim()

//        if (!title || !formData.date) {
//            setError("Title and date are required.")
//            return
//        }

//        setSubmitting(true)
//        setError("")

//        try {
//            const token = localStorage.getItem("token")

//            const payload = {
//                title,
//                date: new Date(formData.date).toISOString(),
//                time: formData.time.trim(),
//                location,
//                attendees: Number(formData.attendees) || 0,
//                type: type || "General",
//                status: deriveStatus(formData.date, formData.status),
//            }

//            const isEdit = Boolean(editingId)
//            const url = isEdit ? `${API_URL}/${editingId}` : API_URL
//            const method = isEdit ? "PUT" : "POST"

//            const res = await fetch(url, {
//                method,
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`,
//                },
//                body: JSON.stringify(payload),
//            })

//            if (!res.ok) {
//                throw new Error(isEdit ? "Failed to update event" : "Failed to create event")
//            }

//            if (!isEdit) {
//                saveEventReminder({
//                    ...formData,
//                    title,
//                    location,
//                    type: type || "General",
//                })
//            }

//            await fetchEvents(true)
//            setDialogOpen(false)
//            resetForm()
//        } catch (err) {
//            console.error("handleSaveEvent error:", err)
//            setError("Unable to save event right now.")
//        } finally {
//            setSubmitting(false)
//        }
//    }

//    function handleEdit(event: EventItem) {
//        setEditingId(event.id)
//        setFormData({
//            id: event.id,
//            title: event.title,
//            date: event.date,
//            time: event.time || "",
//            location: event.location || "",
//            attendees: event.attendees || 0,
//            type: event.type || "",
//            status: event.status,
//        })
//        setError("")
//        setDialogOpen(true)
//    }

//    async function handleDelete(id: string) {
//        const confirmed = window.confirm("Delete this event?")
//        if (!confirmed) return

//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch(`${API_URL}/${id}`, {
//                method: "DELETE",
//                headers: { Authorization: `Bearer ${token}` },
//            })

//            if (!res.ok) {
//                throw new Error("Failed to delete event")
//            }

//            await fetchEvents(true)
//        } catch (err) {
//            console.error("handleDelete error:", err)
//            setError("Unable to delete event right now.")
//        }
//    }

//    const filteredEvents = useMemo(() => {
//        const q = search.toLowerCase().trim()

//        return events.filter((event) => {
//            const matchesSearch =
//                !q ||
//                event.title?.toLowerCase().includes(q) ||
//                event.location?.toLowerCase().includes(q) ||
//                event.type?.toLowerCase().includes(q) ||
//                event.status?.toLowerCase().includes(q)

//            const matchesStatus =
//                statusFilter === "all" ||
//                event.status.toLowerCase() === statusFilter.toLowerCase()

//            return matchesSearch && matchesStatus
//        })
//    }, [events, search, statusFilter])

//    const upcomingCount = events.filter((e) => e.status === "Upcoming").length
//    const todayCount = events.filter((e) => e.status === "Today").length
//    const pastCount = events.filter((e) => e.status === "Past").length

//    return (
//        <div className="flex flex-col gap-6">
//            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                <div>
//                    <h2 className="text-2xl font-semibold">Events</h2>
//                    <p className="text-sm text-muted-foreground">
//                        Manage, search, and track your events professionally
//                    </p>
//                </div>

//                <div className="flex items-center gap-2">
//                    <Button
//                        variant="outline"
//                        onClick={() => fetchEvents(true)}
//                        disabled={refreshing}
//                    >
//                        <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
//                        Refresh
//                    </Button>

//                    <Dialog
//                        open={dialogOpen}
//                        onOpenChange={(open) => {
//                            setDialogOpen(open)
//                            if (!open) {
//                                resetForm()
//                                setError("")
//                            }
//                        }}
//                    >
//                        <DialogTrigger asChild>
//                            <Button className="gap-2 shadow-lg">
//                                <Plus className="h-4 w-4" />
//                                {editingId ? "Edit Event" : "Create Event"}
//                            </Button>
//                        </DialogTrigger>

//                        <DialogContent className="rounded-2xl">
//                            <DialogHeader>
//                                <DialogTitle>
//                                    {editingId ? "Update Event" : "Create Event"}
//                                </DialogTitle>
//                                <DialogDescription>
//                                    Add complete event details below.
//                                </DialogDescription>
//                            </DialogHeader>

//                            <div className="mt-4 space-y-4">
//                                <Input
//                                    placeholder="Event Title"
//                                    value={formData.title}
//                                    onChange={(e) =>
//                                        setFormData({ ...formData, title: e.target.value })
//                                    }
//                                />

//                                <div className="grid grid-cols-2 gap-4">
//                                    <Input
//                                        type="date"
//                                        value={formData.date}
//                                        onChange={(e) =>
//                                            setFormData({ ...formData, date: e.target.value })
//                                        }
//                                    />

//                                    <Input
//                                        placeholder="Time (e.g. 10:00 AM)"
//                                        value={formData.time}
//                                        onChange={(e) =>
//                                            setFormData({ ...formData, time: e.target.value })
//                                        }
//                                    />
//                                </div>

//                                <Input
//                                    placeholder="Location"
//                                    value={formData.location}
//                                    onChange={(e) =>
//                                        setFormData({ ...formData, location: e.target.value })
//                                    }
//                                />

//                                <div className="grid grid-cols-2 gap-4">
//                                    <Input
//                                        type="number"
//                                        min={0}
//                                        placeholder="Attendees"
//                                        value={formData.attendees}
//                                        onChange={(e) =>
//                                            setFormData({
//                                                ...formData,
//                                                attendees: Number(e.target.value) || 0,
//                                            })
//                                        }
//                                    />

//                                    <Input
//                                        placeholder="Type (Meeting, Workshop...)"
//                                        value={formData.type}
//                                        onChange={(e) =>
//                                            setFormData({ ...formData, type: e.target.value })
//                                        }
//                                    />
//                                </div>

//                                {error && (
//                                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//                                        {error}
//                                    </div>
//                                )}

//                                <Button
//                                    onClick={handleSaveEvent}
//                                    disabled={submitting}
//                                    className="w-full shadow-md"
//                                >
//                                    {submitting
//                                        ? editingId
//                                            ? "Updating..."
//                                            : "Saving..."
//                                        : editingId
//                                            ? "Update Event"
//                                            : "Save Event"}
//                                </Button>
//                            </div>
//                        </DialogContent>
//                    </Dialog>
//                </div>
//            </div>

//            <div className="grid gap-4 md:grid-cols-3">
//                <div className="rounded-2xl border bg-card p-5">
//                    <p className="text-sm text-muted-foreground">Upcoming</p>
//                    <h3 className="mt-1 text-2xl font-semibold">{upcomingCount}</h3>
//                </div>

//                <div className="rounded-2xl border bg-card p-5">
//                    <p className="text-sm text-muted-foreground">Today</p>
//                    <h3 className="mt-1 text-2xl font-semibold">{todayCount}</h3>
//                </div>

//                <div className="rounded-2xl border bg-card p-5">
//                    <p className="text-sm text-muted-foreground">Past</p>
//                    <h3 className="mt-1 text-2xl font-semibold">{pastCount}</h3>
//                </div>
//            </div>

//            <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
//                <div className="relative">
//                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                    <Input
//                        placeholder="Search events..."
//                        value={search}
//                        onChange={(e) => setSearch(e.target.value)}
//                        className="pl-10"
//                    />
//                </div>

//                <select
//                    value={statusFilter}
//                    onChange={(e) => setStatusFilter(e.target.value)}
//                    className="h-10 rounded-md border bg-background px-3 text-sm"
//                >
//                    <option value="all">All Status</option>
//                    <option value="Upcoming">Upcoming</option>
//                    <option value="Today">Today</option>
//                    <option value="Past">Past</option>
//                    <option value="Cancelled">Cancelled</option>
//                </select>
//            </div>

//            {loading ? (
//                <div className="grid gap-5 lg:grid-cols-2">
//                    {Array.from({ length: 4 }).map((_, index) => (
//                        <div key={index} className="rounded-2xl border bg-card p-5">
//                            <div className="animate-pulse space-y-3">
//                                <div className="h-5 w-40 rounded bg-muted" />
//                                <div className="h-4 w-28 rounded bg-muted" />
//                                <div className="h-4 w-32 rounded bg-muted" />
//                                <div className="h-4 w-24 rounded bg-muted" />
//                            </div>
//                        </div>
//                    ))}
//                </div>
//            ) : filteredEvents.length === 0 ? (
//                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-12 text-center">
//                    <Inbox className="h-10 w-10 text-muted-foreground" />
//                    <div>
//                        <p className="font-medium">
//                            {events.length === 0 ? "No events found" : "No matching events"}
//                        </p>
//                        <p className="text-sm text-muted-foreground">
//                            {events.length === 0
//                                ? "Create your first event to get started."
//                                : "Try a different search term or filter."}
//                        </p>
//                    </div>
//                </div>
//            ) : (
//                <div className="grid gap-5 lg:grid-cols-2">
//                    {filteredEvents.map((event) => (
//                        <div
//                            key={event.id}
//                            className="rounded-2xl border bg-background/60 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-xl"
//                        >
//                            <div className="flex justify-between gap-4">
//                                <div className="min-w-0">
//                                    <h3 className="text-lg font-semibold">{event.title}</h3>

//                                    <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
//                                        <span className="flex items-center gap-2">
//                                            <CalendarDays className="h-4 w-4" />
//                                            {event.date}
//                                        </span>

//                                        <span className="flex items-center gap-2">
//                                            <Clock className="h-4 w-4" />
//                                            {event.time || "Not set"}
//                                        </span>

//                                        <span className="flex items-center gap-2">
//                                            <MapPin className="h-4 w-4" />
//                                            {event.location || "No location"}
//                                        </span>

//                                        <span className="flex items-center gap-2">
//                                            <Users className="h-4 w-4" />
//                                            {event.attendees} attendees
//                                        </span>
//                                    </div>
//                                </div>

//                                <div className="flex flex-col items-end gap-2">
//                                    <Badge className={getStatusBadgeClasses(event.status)}>
//                                        {event.status}
//                                    </Badge>

//                                    <Badge
//                                        variant="outline"
//                                        className={getTypeBadgeClasses(event.type)}
//                                    >
//                                        {event.type || "General"}
//                                    </Badge>

//                                    <div className="flex items-center gap-1">
//                                        <Button
//                                            variant="ghost"
//                                            size="icon"
//                                            onClick={() => handleEdit(event)}
//                                        >
//                                            <Pencil className="h-4 w-4" />
//                                        </Button>

//                                        <Button
//                                            variant="ghost"
//                                            size="icon"
//                                            onClick={() => handleDelete(event.id)}
//                                        >
//                                            <Trash2 className="h-4 w-4" />
//                                        </Button>
//                                    </div>
//                                </div>
//                            </div>
//                        </div>
//                    ))}
//                </div>
//            )}
//        </div>
//    )
//}













"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
    CalendarDays,
    Clock,
    MapPin,
    Users,
    Plus,
    Trash2,
    Search,
    RefreshCw,
    Inbox,
    Pencil,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface EventItem {
    id: string
    title: string
    date: string
    time: string
    location: string
    attendees: number
    type: string
    status: "Upcoming" | "Today" | "Past" | "Cancelled"
}

interface StoredDashboardNotification {
    id: string
    userId: string
    type: string
    isRead: boolean
    createdAt: string
    eventId?: string
    eventTitle?: string
    eventDate?: string
    eventTime?: string
    location?: string
    message?: string
    text?: string
    triggerTime?: number
    triggered?: boolean
}

const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/Events"

const initialEventState = {
    id: "",
    title: "",
    date: "",
    time: "",
    location: "",
    attendees: 0,
    type: "",
    status: "Upcoming" as "Upcoming" | "Today" | "Past" | "Cancelled",
}

function getStatusBadgeClasses(status: string) {
    switch ((status || "").toLowerCase()) {
        case "today":
            return "border-orange-200 bg-orange-100 text-orange-700"
        case "upcoming":
            return "border-blue-200 bg-blue-100 text-blue-700"
        case "past":
            return "border-slate-200 bg-slate-100 text-slate-700"
        case "cancelled":
            return "border-red-200 bg-red-100 text-red-700"
        default:
            return "border-slate-200 bg-slate-100 text-slate-700"
    }
}

function getTypeBadgeClasses(type: string) {
    switch ((type || "").toLowerCase()) {
        case "meeting":
            return "border-indigo-300 text-indigo-700"
        case "workshop":
            return "border-purple-300 text-purple-700"
        case "training":
            return "border-amber-300 text-amber-700"
        default:
            return "border-slate-300 text-slate-700"
    }
}

function deriveStatus(date?: string, existingStatus?: string) {
    if ((existingStatus || "").toLowerCase() === "cancelled") return "Cancelled"
    if (!date) return "Upcoming"

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const eventDate = new Date(date)
    eventDate.setHours(0, 0, 0, 0)

    if (eventDate.getTime() < today.getTime()) return "Past"
    if (eventDate.getTime() === today.getTime()) return "Today"
    return "Upcoming"
}

function getDateKey(date: string | Date) {
    const value = new Date(date)
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, "0")
    const day = String(value.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

function parseStoredNotifications(): StoredDashboardNotification[] {
    try {
        return JSON.parse(localStorage.getItem("globalNotifications") || "[]")
    } catch {
        return []
    }
}

function writeStoredNotifications(items: StoredDashboardNotification[]) {
    localStorage.setItem("globalNotifications", JSON.stringify(items))
    window.dispatchEvent(new Event("new-notification"))
}

function buildEventDateLabel(event: Pick<EventItem, "date" | "time">) {
    if (!event.date) return ""

    const dateLabel = new Date(event.date).toLocaleDateString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })

    return event.time ? `${dateLabel} at ${event.time}` : dateLabel
}

function pushEventActivityNotification(
    action: "event_created" | "event_updated" | "event_deleted",
    event: Pick<EventItem, "id" | "title" | "date" | "time" | "location">,
    userId: string
) {
    const existing = parseStoredNotifications()
    const eventDateLabel = buildEventDateLabel(event)
    const actionText = action === "event_created"
        ? "created"
        : action === "event_updated"
            ? "updated"
            : "deleted"

    const message = `Event "${event.title}" has been ${actionText}${eventDateLabel ? ` for ${eventDateLabel}` : ""}${event.location ? ` at ${event.location}` : ""}.`

    const next: StoredDashboardNotification = {
        id: `${action}-${event.id}-${Date.now()}`,
        userId,
        type: action,
        isRead: false,
        createdAt: new Date().toISOString(),
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        location: event.location,
        message,
    }

    writeStoredNotifications([next, ...existing])
}

function clearEventReminders(eventId: string) {
    const existing = parseStoredNotifications()
    const filtered = existing.filter((item) => !(item.eventId === eventId && (item.type === "calendar" || item.triggerTime)))
    writeStoredNotifications(filtered)
}

function saveEventReminder(event: Pick<EventItem, "id" | "title" | "date" | "time" | "status">) {
    if (!event.date || !event.id) return

    const eventStatus = deriveStatus(event.date, event.status)
    if (eventStatus === "Past" || eventStatus === "Cancelled") {
        clearEventReminders(event.id)
        return
    }

    const existing = parseStoredNotifications()
    const filtered = existing.filter((item) => !(item.eventId === event.id && (item.type === "calendar" || item.triggerTime)))

    const reminderDate = new Date(event.date)
    reminderDate.setDate(reminderDate.getDate() - 1)
    reminderDate.setHours(19, 0, 0, 0)

    const reminder: StoredDashboardNotification = {
        id: `event-reminder-${event.id}`,
        userId: localStorage.getItem("userId") || "",
        type: "calendar",
        isRead: false,
        createdAt: new Date().toISOString(),
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        text: `Reminder: "${event.title}" is scheduled ${buildEventDateLabel(event)}.`,
        triggerTime: reminderDate.getTime(),
        triggered: false,
    }

    writeStoredNotifications([reminder, ...filtered])
}

export function EventsView() {
    const router = useRouter()

    const [events, setEvents] = useState<EventItem[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [error, setError] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)

    const [formData, setFormData] = useState(initialEventState)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/login")
            return
        }
        fetchEvents()
    }, [router])

    function resetForm() {
        setFormData(initialEventState)
        setEditingId(null)
    }

    async function fetchEvents(isRefresh = false) {
        try {
            if (isRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            setError("")
            const token = localStorage.getItem("token")

            const res = await fetch(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                throw new Error("Failed to load events")
            }

            const data = await res.json()

            const formatted = data
                .map((e: any) => {
                    const normalizedDate = e.date?.split("T")[0] || ""
                    return {
                        ...e,
                        date: normalizedDate,
                        status: deriveStatus(normalizedDate, e.status),
                        type: e.type || "General",
                        time: e.time || "",
                        location: e.location || "",
                        attendees: e.attendees || 0,
                    }
                })
                .sort((a: EventItem, b: EventItem) => {
                    const order = { Today: 0, Upcoming: 1, Past: 2, Cancelled: 3 }
                    const statusDiff = order[a.status] - order[b.status]
                    if (statusDiff !== 0) return statusDiff

                    if (a.status === "Past") {
                        return new Date(b.date).getTime() - new Date(a.date).getTime()
                    }

                    return new Date(a.date).getTime() - new Date(b.date).getTime()
                })

            setEvents(formatted)
        } catch (err) {
            console.error("fetchEvents error:", err)
            setError("Unable to load events right now.")
            setEvents([])
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    async function handleSaveEvent() {
        const title = formData.title.trim()
        const location = formData.location.trim()
        const type = formData.type.trim()

        if (!title || !formData.date) {
            setError("Title and date are required.")
            return
        }

        setSubmitting(true)
        setError("")

        try {
            const token = localStorage.getItem("token")
            const userId = localStorage.getItem("userId") || ""

            const payload = {
                title,
                date: new Date(formData.date).toISOString(),
                time: formData.time.trim(),
                location,
                attendees: Number(formData.attendees) || 0,
                type: type || "General",
                status: deriveStatus(formData.date, formData.status),
            }

            const isEdit = Boolean(editingId)
            const url = isEdit ? `${API_URL}/${editingId}` : API_URL
            const method = isEdit ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                throw new Error(isEdit ? "Failed to update event" : "Failed to create event")
            }

            let savedEventId = editingId || ""
            const responseData = await res.json().catch(() => null)
            if (responseData?.id) {
                savedEventId = responseData.id
            }

            const savedEvent: EventItem = {
                id: savedEventId,
                title,
                date: formData.date,
                time: formData.time.trim(),
                location,
                attendees: Number(formData.attendees) || 0,
                type: type || "General",
                status: deriveStatus(formData.date, formData.status),
            }

            pushEventActivityNotification(
                isEdit ? "event_updated" : "event_created",
                savedEvent,
                userId
            )
            saveEventReminder(savedEvent)

            await fetchEvents(true)
            setDialogOpen(false)
            resetForm()
        } catch (err) {
            console.error("handleSaveEvent error:", err)
            setError("Unable to save event right now.")
        } finally {
            setSubmitting(false)
        }
    }

    function handleEdit(event: EventItem) {
        setEditingId(event.id)
        setFormData({
            id: event.id,
            title: event.title,
            date: event.date,
            time: event.time || "",
            location: event.location || "",
            attendees: event.attendees || 0,
            type: event.type || "",
            status: event.status,
        })
        setError("")
        setDialogOpen(true)
    }

    async function handleDelete(event: EventItem) {
        const confirmed = window.confirm("Delete this event?")
        if (!confirmed) return

        try {
            const token = localStorage.getItem("token")
            const userId = localStorage.getItem("userId") || ""

            const res = await fetch(`${API_URL}/${event.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                throw new Error("Failed to delete event")
            }

            clearEventReminders(event.id)
            pushEventActivityNotification("event_deleted", event, userId)

            await fetchEvents(true)
        } catch (err) {
            console.error("handleDelete error:", err)
            setError("Unable to delete event right now.")
        }
    }

    const filteredEvents = useMemo(() => {
        const q = search.toLowerCase().trim()

        return events.filter((event) => {
            const matchesSearch =
                !q ||
                event.title?.toLowerCase().includes(q) ||
                event.location?.toLowerCase().includes(q) ||
                event.type?.toLowerCase().includes(q) ||
                event.status?.toLowerCase().includes(q) ||
                getDateKey(event.date).includes(q)

            const matchesStatus =
                statusFilter === "all" ||
                event.status.toLowerCase() === statusFilter.toLowerCase()

            return matchesSearch && matchesStatus
        })
    }, [events, search, statusFilter])

    const upcomingCount = events.filter((e) => e.status === "Upcoming").length
    const todayCount = events.filter((e) => e.status === "Today").length
    const pastCount = events.filter((e) => e.status === "Past").length

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Events</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage, search, and track your events professionally
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => fetchEvents(true)}
                        disabled={refreshing}
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>

                    <Dialog
                        open={dialogOpen}
                        onOpenChange={(open) => {
                            setDialogOpen(open)
                            if (!open) {
                                resetForm()
                                setError("")
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button className="gap-2 shadow-lg">
                                <Plus className="h-4 w-4" />
                                {editingId ? "Edit Event" : "Create Event"}
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="rounded-2xl">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingId ? "Update Event" : "Create Event"}
                                </DialogTitle>
                                <DialogDescription>
                                    Add complete event details below.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-4 space-y-4">
                                <Input
                                    placeholder="Event Title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({ ...formData, date: e.target.value })
                                        }
                                    />

                                    <Input
                                        placeholder="Time (e.g. 10:00 AM)"
                                        value={formData.time}
                                        onChange={(e) =>
                                            setFormData({ ...formData, time: e.target.value })
                                        }
                                    />
                                </div>

                                <Input
                                    placeholder="Location"
                                    value={formData.location}
                                    onChange={(e) =>
                                        setFormData({ ...formData, location: e.target.value })
                                    }
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Attendees"
                                        value={formData.attendees}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                attendees: Number(e.target.value) || 0,
                                            })
                                        }
                                    />

                                    <Input
                                        placeholder="Type (Meeting, Workshop...)"
                                        value={formData.type}
                                        onChange={(e) =>
                                            setFormData({ ...formData, type: e.target.value })
                                        }
                                    />
                                </div>

                                {error && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    onClick={handleSaveEvent}
                                    disabled={submitting}
                                    className="w-full shadow-md"
                                >
                                    {submitting
                                        ? editingId
                                            ? "Updating..."
                                            : "Saving..."
                                        : editingId
                                            ? "Update Event"
                                            : "Save Event"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border bg-card p-5">
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <h3 className="mt-1 text-2xl font-semibold">{upcomingCount}</h3>
                </div>

                <div className="rounded-2xl border bg-card p-5">
                    <p className="text-sm text-muted-foreground">Today</p>
                    <h3 className="mt-1 text-2xl font-semibold">{todayCount}</h3>
                </div>

                <div className="rounded-2xl border bg-card p-5">
                    <p className="text-sm text-muted-foreground">Past</p>
                    <h3 className="mt-1 text-2xl font-semibold">{pastCount}</h3>
                </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search events..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                >
                    <option value="all">All Status</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Today">Today</option>
                    <option value="Past">Past</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {loading ? (
                <div className="grid gap-5 lg:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="rounded-2xl border bg-card p-5">
                            <div className="animate-pulse space-y-3">
                                <div className="h-5 w-40 rounded bg-muted" />
                                <div className="h-4 w-28 rounded bg-muted" />
                                <div className="h-4 w-32 rounded bg-muted" />
                                <div className="h-4 w-24 rounded bg-muted" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-12 text-center">
                    <Inbox className="h-10 w-10 text-muted-foreground" />
                    <div>
                        <p className="font-medium">
                            {events.length === 0 ? "No events found" : "No matching events"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {events.length === 0
                                ? "Create your first event to get started."
                                : "Try a different search term or filter."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                    {filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="rounded-2xl border bg-background/60 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-xl"
                        >
                            <div className="flex justify-between gap-4">
                                <div className="min-w-0">
                                    <h3 className="text-lg font-semibold">{event.title}</h3>

                                    <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4" />
                                            {event.date}
                                        </span>

                                        <span className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            {event.time || "Not set"}
                                        </span>

                                        <span className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {event.location || "No location"}
                                        </span>

                                        <span className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            {event.attendees} attendees
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <Badge className={getStatusBadgeClasses(event.status)}>
                                        {event.status}
                                    </Badge>

                                    <Badge
                                        variant="outline"
                                        className={getTypeBadgeClasses(event.type)}
                                    >
                                        {event.type || "General"}
                                    </Badge>

                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(event)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(event)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
