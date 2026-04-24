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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog"

interface EventItem {
    id: string
    title: string
    date: string
    time: string
    location: string
    attendees: number
    type: string
    status: string
}

const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/Events"

const initialEventState = {
    title: "",
    date: "",
    time: "",
    location: "",
    attendees: 0,
    type: "",
    status: "Upcoming",
}

function getStatusBadgeClasses(status: string) {
    switch ((status || "").toLowerCase()) {
        case "completed":
            return "bg-emerald-100 text-emerald-700 border-emerald-200"
        case "upcoming":
            return "bg-blue-100 text-blue-700 border-blue-200"
        case "cancelled":
            return "bg-red-100 text-red-700 border-red-200"
        default:
            return "bg-slate-100 text-slate-700 border-slate-200"
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

function getDerivedStatus(date?: string) {
    if (!date) return "Upcoming"
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDate = new Date(date)
    eventDate.setHours(0, 0, 0, 0)

    if (eventDate.getTime() < today.getTime()) return "Completed"
    return "Upcoming"
}

export function EventsView() {
    const router = useRouter()

    const [events, setEvents] = useState<EventItem[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [search, setSearch] = useState("")
    const [error, setError] = useState("")

    const [newEvent, setNewEvent] = useState(initialEventState)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/login")
            return
        }
        fetchEvents()
    }, [router])

    function resetForm() {
        setNewEvent(initialEventState)
    }

    function saveEventReminder(event: typeof initialEventState) {
        if (!event.date) return

        const existing = JSON.parse(localStorage.getItem("globalNotifications") || "[]")

        const eventDate = new Date(event.date)
        const reminderDate = new Date(eventDate)
        reminderDate.setDate(reminderDate.getDate() - 1)
        reminderDate.setHours(19, 0, 0, 0)

        const newNotif = {
            id: Date.now(),
            text: `Tomorrow: ${event.title}`,
            isRead: false,
            triggerTime: reminderDate.getTime(),
            eventDate: event.date,
            triggered: false,
            createdAt: new Date().toISOString(),
            userId: localStorage.getItem("userId"),
        }

        localStorage.setItem(
            "globalNotifications",
            JSON.stringify([newNotif, ...existing])
        )

        window.dispatchEvent(new Event("new-notification"))
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
                .map((e: any) => ({
                    ...e,
                    date: e.date?.split("T")[0],
                    status: e.status || getDerivedStatus(e.date),
                    type: e.type || "General",
                }))
                .sort(
                    (a: EventItem, b: EventItem) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                )

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

    async function handleAddEvent() {
        const title = newEvent.title.trim()
        const location = newEvent.location.trim()
        const type = newEvent.type.trim()

        if (!title || !newEvent.date) {
            setError("Title and date are required.")
            return
        }

        setSubmitting(true)
        setError("")

        try {
            const token = localStorage.getItem("token")

            const payload = {
                ...newEvent,
                title,
                location,
                type: type || "General",
                status: getDerivedStatus(newEvent.date),
                date: newEvent.date ? new Date(newEvent.date).toISOString() : null,
            }

            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                throw new Error("Failed to create event")
            }

            saveEventReminder(newEvent)
            await fetchEvents(true)
            setDialogOpen(false)
            resetForm()
        } catch (err) {
            console.error("handleAddEvent error:", err)
            setError("Unable to create event right now.")
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id: string) {
        const confirmed = window.confirm("Delete this event?")
        if (!confirmed) return

        try {
            const token = localStorage.getItem("token")

            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                throw new Error("Failed to delete event")
            }

            await fetchEvents(true)
        } catch (err) {
            console.error("handleDelete error:", err)
            setError("Unable to delete event right now.")
        }
    }

    const filteredEvents = useMemo(() => {
        const q = search.toLowerCase().trim()

        return events.filter((event) => {
            if (!q) return true
            return (
                event.title?.toLowerCase().includes(q) ||
                event.location?.toLowerCase().includes(q) ||
                event.type?.toLowerCase().includes(q) ||
                event.status?.toLowerCase().includes(q)
            )
        })
    }, [events, search])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Events</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage and track your events
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
                                Create Event
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="rounded-2xl">
                            <DialogHeader>
                                <DialogTitle>Create Event</DialogTitle>
                                <DialogDescription>
                                    Fill in the details to create a new event.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-4 space-y-4">
                                <Input
                                    placeholder="Event Title"
                                    value={newEvent.title}
                                    onChange={(e) =>
                                        setNewEvent({ ...newEvent, title: e.target.value })
                                    }
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="date"
                                        value={newEvent.date}
                                        onChange={(e) =>
                                            setNewEvent({ ...newEvent, date: e.target.value })
                                        }
                                    />

                                    <Input
                                        placeholder="Time (e.g. 10:00 AM)"
                                        value={newEvent.time}
                                        onChange={(e) =>
                                            setNewEvent({ ...newEvent, time: e.target.value })
                                        }
                                    />
                                </div>

                                <Input
                                    placeholder="Location"
                                    value={newEvent.location}
                                    onChange={(e) =>
                                        setNewEvent({ ...newEvent, location: e.target.value })
                                    }
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Attendees"
                                        value={newEvent.attendees}
                                        onChange={(e) =>
                                            setNewEvent({
                                                ...newEvent,
                                                attendees: Number(e.target.value) || 0,
                                            })
                                        }
                                    />

                                    <Input
                                        placeholder="Type (Meeting, Workshop...)"
                                        value={newEvent.type}
                                        onChange={(e) =>
                                            setNewEvent({ ...newEvent, type: e.target.value })
                                        }
                                    />
                                </div>

                                {error && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    onClick={handleAddEvent}
                                    disabled={submitting}
                                    className="w-full shadow-md"
                                >
                                    {submitting ? "Saving..." : "Save Event"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
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
                                : "Try a different search term."}
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

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(event.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
