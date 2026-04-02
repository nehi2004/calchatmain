




//"use client"

//import { useState, useEffect } from "react"
//import {
//    ChevronLeft,
//    ChevronRight,
//    Trash2,
//    Pencil,
//    Bell
//} from "lucide-react"

//import { Button } from "@/components/ui/button"
//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle,
//    DialogDescription
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"

//import {
//    Select,
//    SelectContent,
//    SelectItem,
//    SelectTrigger,
//    SelectValue
//} from "@/components/ui/select"

//import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

//interface CalendarEvent {
//    id: string
//    title: string
//    date: string
//    time: string
//    type: string
//    priority: "Low" | "Medium" | "High"
//    color?: string
//    reminderMinutes?: number
//}

//const API_URL = "https://calchatmain-production-75c1.up.railway.app//api/CalendarEvents"

//const MONTHS = [
//    "January", "February", "March", "April", "May", "June",
//    "July", "August", "September", "October", "November", "December"
//]

//const COLORS = [
//    "#ef4444", "#22c55e", "#3b82f6",
//    "#f59e0b", "#a855f7", "#14b8a6", "#f43f5e"
//]

//function getAuthHeaders() {
//    const token = localStorage.getItem("token")
//    return {
//        "Content-Type": "application/json",
//        Authorization: `Bearer ${token}`
//    }
//}

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

//function isToday(dateStr: string) {
//    const today = new Date()
//    return dateStr === formatDate(today)
//}

//export function CalendarView() {

//    const [events, setEvents] = useState<CalendarEvent[]>([])
//    const [currentDate, setCurrentDate] = useState(new Date())
//    const [view, setView] = useState<"monthly" | "daily">("monthly")
//    const [dialogOpen, setDialogOpen] = useState(false)
//    const [editId, setEditId] = useState<string | null>(null)

//    const [notifications, setNotifications] = useState<any[]>([])
//    const [showNotifications, setShowNotifications] = useState(false)
//    const [triggeredEvents, setTriggeredEvents] = useState<Set<string>>(new Set())

//    const [newEvent, setNewEvent] = useState({
//        title: "",
//        date: "",
//        time: "",
//        type: "Meeting",
//        priority: "Low" as "Low" | "Medium" | "High",
//        color: "#3b82f6",
//        reminder: 10
//    })

//    useEffect(() => { fetchEvents() }, [])

//    useEffect(() => {

//        if (Notification.permission === "default") {
//            Notification.requestPermission()
//        }

//        const interval = setInterval(() => {

//            const now = new Date()
//            const todayStr = formatDate(now)

//            events.forEach(event => {

//                // ❌ skip past/future day events
//                if (event.date !== todayStr) return

//                // ❌ skip if already triggered
//                if (triggeredEvents.has(event.id)) return

//                const eventTime = new Date(`${event.date}T${event.time}`)

//                const reminderMinutes = event.reminderMinutes ?? 0

//                const reminderTime = new Date(
//                    eventTime.getTime() - reminderMinutes * 60000
//                )

//                const diff = Math.abs(now.getTime() - reminderTime.getTime())

//                // ✅ trigger only within 20 seconds window
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

//        }, 15000) // check every 15 seconds

//        return () => clearInterval(interval)

//    }, [events, triggeredEvents])

//    async function fetchEvents() {

//        const res = await fetch(API_URL, {
//            headers: getAuthHeaders()
//        })

//        const data = await res.json()

//        const formatted = data.map((e: any) => ({
//            ...e,
//            date: e.date.split("T")[0],
//            color: e.color || "#3b82f6"
//        }))

//        setEvents(formatted)
//    }

//    function getEventsForDate(dateStr: string) {
//        return events
//            .filter(e => e.date === dateStr)
//            .sort((a, b) => a.time.localeCompare(b.time))
//    }

//    async function handleSave() {

//        if (!newEvent.title || !newEvent.date) return

//        const eventData = {
//            title: newEvent.title,
//            date: newEvent.date + "T00:00:00",
//            time: newEvent.time || "09:00",
//            type: newEvent.type,
//            priority: newEvent.priority,
//            color: newEvent.color,
//            reminderMinutes: newEvent.reminder
//        }

//        let response

//        if (editId) {

//            response = await fetch(`${API_URL}/${editId}`, {
//                method: "PUT",
//                headers: getAuthHeaders(),
//                body: JSON.stringify({ id: editId, ...eventData })
//            })

//        } else {

//            response = await fetch(API_URL, {
//                method: "POST",
//                headers: getAuthHeaders(),
//                body: JSON.stringify(eventData)
//            })

//        }
//        if (!response.ok) {
//            const err = await response.text()
//            console.error("API ERROR:", err)
//        }

//        if (response.ok) {
//            await fetchEvents()
//        }


//        setDialogOpen(false)
//        setEditId(null)

//        setNewEvent({
//            title: "",
//            date: "",
//            time: "",
//            type: "Meeting",
//            priority: "Low",
//            color: "#3b82f6",
//            reminder: 10
//        })
//    }

//    async function handleDelete(id: string) {

//        await fetch(`${API_URL}/${id}`, {
//            method: "DELETE",
//            headers: getAuthHeaders()
//        })

//        await fetchEvents()
//    }

//    function handleEdit(event: CalendarEvent) {

//        setNewEvent({
//            title: event.title,
//            date: event.date,
//            time: event.time,
//            type: event.type,
//            priority: event.priority,
//            color: event.color || "#3b82f6",
//            reminder: event.reminderMinutes || 10
//        })

//        setEditId(event.id)
//        setDialogOpen(true)
//    }

//    function handleHourClick(hour: number) {

//        setNewEvent({
//            title: "",
//            date: formatDate(currentDate),
//            time: String(hour).padStart(2, "0") + ":00",
//            type: "Meeting",
//            priority: "Low",
//            color: "#3b82f6",
//            reminder: 10
//        })

//        setEditId(null)
//        setDialogOpen(true)
//    }

//    const year = currentDate.getFullYear()
//    const month = currentDate.getMonth()

//    const daysInMonth = new Date(year, month + 1, 0).getDate()
//    const firstDay = new Date(year, month, 1).getDay()

//    const calendarDays: (number | null)[] = []

//    for (let i = 0; i < firstDay; i++) calendarDays.push(null)
//    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d)

//    const hours = Array.from({ length: 24 }, (_, i) => i)

//    return (

//        <div className="flex flex-col gap-6">

//            {/* HEADER */}

//            <div className="flex justify-between items-center">

//                <div className="flex items-center gap-3">

//                    <Button size="icon" variant="outline"
//                        onClick={() => {
//                            const d = new Date(currentDate)
//                            view === "monthly"
//                                ? d.setMonth(d.getMonth() - 1)
//                                : d.setDate(d.getDate() - 1)
//                            setCurrentDate(new Date(d))
//                        }}>
//                        <ChevronLeft className="h-4 w-4" />
//                    </Button>

//                    <h2 className="text-xl font-bold">
//                        {view === "monthly"
//                            ? `${MONTHS[month]} ${year}`
//                            : currentDate.toDateString()}
//                    </h2>

//                    <Button size="icon" variant="outline"
//                        onClick={() => {
//                            const d = new Date(currentDate)
//                            view === "monthly"
//                                ? d.setMonth(d.getMonth() + 1)
//                                : d.setDate(d.getDate() + 1)
//                            setCurrentDate(new Date(d))
//                        }}>
//                        <ChevronRight className="h-4 w-4" />
//                    </Button>

//                </div>

//                <div className="flex items-center gap-4">

//                    {/* NOTIFICATION BELL */}

//                    <div className="relative">

//                        <Button
//                            variant="outline"
//                            size="icon"
//                            onClick={() => setShowNotifications(!showNotifications)}
//                        >

//                            <Bell className="h-4 w-4" />

//                            {notifications.length > 0 && (
//                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
//                                    {notifications.length}
//                                </span>
//                            )}

//                        </Button>

//                        {showNotifications && (

//                            <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow p-3 z-50">

//                                <h4 className="font-semibold mb-2">
//                                    Notifications
//                                </h4>

//                                {notifications.length === 0 && (
//                                    <p className="text-sm text-gray-500">
//                                        No reminders
//                                    </p>
//                                )}

//                                {notifications.map(n => (
//                                    <div key={n.id} className="text-sm border-b py-1">
//                                        {n.text}
//                                    </div>
//                                ))}

//                            </div>

//                        )}

//                    </div>

//                    <Tabs value={view} onValueChange={(v) => setView(v as any)}>

//                        <TabsList>
//                            <TabsTrigger value="monthly">Monthly</TabsTrigger>
//                            <TabsTrigger value="daily">Daily</TabsTrigger>
//                        </TabsList>

//                    </Tabs>

//                </div>

//            </div>

//            {/* MONTH VIEW */}

//            {view === "monthly" && (

//                <div className="grid grid-cols-7 gap-2">

//                    {calendarDays.map((day, i) => {

//                        const dateStr = day
//                            ? formatDate(new Date(year, month, day))
//                            : ""

//                        const dayEvents = day
//                            ? getEventsForDate(dateStr)
//                            : []

//                        return (

//                            <div
//                                key={i}
//                                className={`border p-2 min-h-28 rounded cursor-pointer
//${isToday(dateStr) ? "border-blue-600 border-2" : ""}`}

//                                onClick={() => {
//                                    if (!day) return
//                                    setCurrentDate(new Date(dateStr))
//                                    setView("daily")
//                                }}>

//                                {day && <div className="font-semibold">{day}</div>}

//                                {dayEvents.slice(0, 2).map(e => (
//                                    <div
//                                        key={e.id}
//                                        style={{ backgroundColor: e.color }}
//                                        className="text-white text-xs rounded px-1 mb-1 truncate">

//                                        {formatTime(e.time)} {e.title}

//                                    </div>
//                                ))}

//                            </div>

//                        )

//                    })}

//                </div>

//            )}

//            {/* DAILY VIEW */}

//            {view === "daily" && (

//                <div className="border rounded p-4 h-[700px] overflow-y-auto">

//                    {hours.map(hour => (

//                        <div
//                            key={hour}
//                            className="border-t h-16 flex items-start cursor-pointer"
//                            onClick={() => handleHourClick(hour)}>

//                            <span className="w-16 text-xs pt-2">

//                                {hour === 0 ? "12 AM"
//                                    : hour < 12 ? `${hour} AM`
//                                        : hour === 12 ? "12 PM"
//                                            : `${hour - 12} PM`}

//                            </span>

//                            <div className="flex-1 pt-2">

//                                {getEventsForDate(formatDate(currentDate))
//                                    .filter(e => Number(e.time.split(":")[0]) === hour)
//                                    .map(e => (

//                                        <div
//                                            key={e.id}
//                                            style={{ backgroundColor: e.color }}
//                                            className="text-white rounded px-2 py-1 text-xs mb-1 flex justify-between items-center"
//                                            onClick={(ev) => ev.stopPropagation()}>

//                                            <span>{formatTime(e.time)} {e.title}</span>

//                                            <div className="flex gap-2">

//                                                <Pencil
//                                                    className="h-3 w-3 cursor-pointer"
//                                                    onClick={() => handleEdit(e)}
//                                                />

//                                                <Trash2
//                                                    className="h-3 w-3 cursor-pointer"
//                                                    onClick={() => handleDelete(e.id)}
//                                                />

//                                            </div>

//                                        </div>

//                                    ))}

//                            </div>

//                        </div>

//                    ))}

//                </div>

//            )}

//            {/* EVENT DIALOG */}

//            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

//                <DialogContent>

//                    <DialogHeader>

//                        <DialogTitle>
//                            {editId ? "Edit Task" : "Add Task"}
//                        </DialogTitle>

//                        <DialogDescription>
//                            Enter task details
//                        </DialogDescription>

//                    </DialogHeader>

//                    <div className="flex flex-col gap-4">

//                        <Input
//                            placeholder="Title"
//                            value={newEvent.title}
//                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
//                        />

//                        <Input
//                            type="date"
//                            value={newEvent.date}
//                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
//                        />

//                        <Input
//                            type="time"
//                            value={newEvent.time}
//                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
//                        />

//                        <Select
//                            value={newEvent.priority}
//                            onValueChange={(v) => setNewEvent({ ...newEvent, priority: v as any })}
//                        >

//                            <SelectTrigger>
//                                <SelectValue />
//                            </SelectTrigger>

//                            <SelectContent>
//                                <SelectItem value="Low">Low</SelectItem>
//                                <SelectItem value="Medium">Medium</SelectItem>
//                                <SelectItem value="High">High</SelectItem>
//                            </SelectContent>

//                        </Select>

//                        <Select
//                            value={String(newEvent.reminder)}
//                            onValueChange={(v) => setNewEvent({ ...newEvent, reminder: Number(v) })}
//                        >

//                            <SelectTrigger>
//                                <SelectValue placeholder="Reminder" />
//                            </SelectTrigger>

//                            <SelectContent>
//                                <SelectItem value="0">At time</SelectItem>
//                                <SelectItem value="5">5 minutes before</SelectItem>
//                                <SelectItem value="10">10 minutes before</SelectItem>
//                                <SelectItem value="15">15 minutes before</SelectItem>
//                            </SelectContent>

//                        </Select>

//                        <div className="flex gap-2 flex-wrap">

//                            {COLORS.map(color => (

//                                <div
//                                    key={color}
//                                    onClick={() => setNewEvent({ ...newEvent, color })}
//                                    className={`w-6 h-6 rounded-full cursor-pointer border-2
//${newEvent.color === color ? "border-black" : "border-transparent"}`}
//                                    style={{ backgroundColor: color }}
//                                />

//                            ))}

//                        </div>

//                        <Button onClick={handleSave}>
//                            {editId ? "Save Changes" : "Add Task"}
//                        </Button>

//                    </div>

//                </DialogContent>

//            </Dialog>

//        </div>

//    )

//}



















//"use client"

//import { useState, useEffect } from "react"
//import {
//    ChevronLeft,
//    ChevronRight,
//    Trash2,
//    Pencil,
//    Bell
//} from "lucide-react"

//import { Button } from "@/components/ui/button"
//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle,
//    DialogDescription
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"

//import {
//    Select,
//    SelectContent,
//    SelectItem,
//    SelectTrigger,
//    SelectValue
//} from "@/components/ui/select"

//import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

//interface CalendarEvent {
//    id: string
//    title: string
//    date: string
//    time: string
//    type: string
//    priority: "Low" | "Medium" | "High"
//    color?: string
//    reminderMinutes?: number
//}

//const API_URL = "https://calchatmain-production-75c1.up.railway.app//api/CalendarEvents"

//const MONTHS = [
//    "January", "February", "March", "April", "May", "June",
//    "July", "August", "September", "October", "November", "December"
//]

//const COLORS = [
//    "#ef4444", "#22c55e", "#3b82f6",
//    "#f59e0b", "#a855f7", "#14b8a6", "#f43f5e"
//]

//function getAuthHeaders() {
//    const token = localStorage.getItem("token")
//    return {
//        "Content-Type": "application/json",
//        Authorization: `Bearer ${token}`
//    }
//}

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

//function isToday(dateStr: string) {
//    const today = new Date()
//    return dateStr === formatDate(today)
//}

//export function CalendarView() {

//    const [events, setEvents] = useState<CalendarEvent[]>([])
//    const [currentDate, setCurrentDate] = useState(new Date())
//    const [view, setView] = useState<"monthly" | "daily">("monthly")
//    const [dialogOpen, setDialogOpen] = useState(false)
//    const [editId, setEditId] = useState<string | null>(null)

//    //const [notifications, setNotifications] = useState<any[]>([])
//    //const [showNotifications, setShowNotifications] = useState(false)
//    //const [triggeredEvents, setTriggeredEvents] = useState<Set<string>>(new Set())

//    const [newEvent, setNewEvent] = useState({
//        title: "",
//        date: "",
//        time: "",
//        type: "Meeting",
//        priority: "Low" as "Low" | "Medium" | "High",
//        color: "#3b82f6",
//        reminder: 10
//    })

//    useEffect(() => { fetchEvents() }, [])

//    //useEffect(() => {

//    //    if (Notification.permission === "default") {
//    //        Notification.requestPermission()
//    //    }

//    //    const interval = setInterval(() => {

//    //        const now = new Date()
//    //        const todayStr = formatDate(now)

//    //        events.forEach(event => {

//    //            // ❌ skip past/future day events
//    //            if (event.date !== todayStr) return

//    //            // ❌ skip if already triggered
//    //            if (triggeredEvents.has(event.id)) return

//    //            const eventTime = new Date(`${event.date}T${event.time}`)

//    //            const reminderMinutes = event.reminderMinutes ?? 0

//    //            const reminderTime = new Date(
//    //                eventTime.getTime() - reminderMinutes * 60000
//    //            )

//    //            const diff = Math.abs(now.getTime() - reminderTime.getTime())

//    //            // ✅ trigger only within 20 seconds window
//    //            if (diff <= 20000) {

//    //                const message = `${event.title} at ${formatTime(event.time)}`

//    //                if (Notification.permission === "granted") {
//    //                    new Notification("Upcoming Event", { body: message })
//    //                }

//    //                setNotifications(prev => [
//    //                    { id: crypto.randomUUID(), text: message },
//    //                    ...prev
//    //                ])

//    //                setTriggeredEvents(prev => new Set(prev).add(event.id))
//    //            }

//    //        })

//    //    }, 15000) // check every 15 seconds

//    //    return () => clearInterval(interval)

//    //}, [events, triggeredEvents])

//    async function fetchEvents() {

//        const res = await fetch(API_URL, {
//            headers: getAuthHeaders()
//        })

//        const data = await res.json()

//        const formatted = data.map((e: any) => ({
//            ...e,
//            date: e.date.split("T")[0],
//            color: e.color || "#3b82f6"
//        }))

//        setEvents(formatted)
//    }

//    function getEventsForDate(dateStr: string) {
//        return events
//            .filter(e => e.date === dateStr)
//            .sort((a, b) => a.time.localeCompare(b.time))
//    }

//    async function handleSave() {

//        if (!newEvent.title || !newEvent.date) return

//        const eventData = {
//            title: newEvent.title,
//            date: newEvent.date + "T00:00:00",
//            time: newEvent.time || "09:00",
//            type: newEvent.type,
//            priority: newEvent.priority,
//            color: newEvent.color,
//            reminderMinutes: newEvent.reminder
//        }

//        let response

//        if (editId) {

//            response = await fetch(`${API_URL}/${editId}`, {
//                method: "PUT",
//                headers: getAuthHeaders(),
//                body: JSON.stringify({ id: editId, ...eventData })
//            })

//        } else {

//            response = await fetch(API_URL, {
//                method: "POST",
//                headers: getAuthHeaders(),
//                body: JSON.stringify(eventData)
//            })

//        }
//        if (!response.ok) {
//            const err = await response.text()
//            console.error("API ERROR:", err)
//        }

//        if (response.ok) {
//            await fetchEvents()
//        }


//        setDialogOpen(false)
//        setEditId(null)

//        setNewEvent({
//            title: "",
//            date: "",
//            time: "",
//            type: "Meeting",
//            priority: "Low",
//            color: "#3b82f6",
//            reminder: 10
//        })
//    }

//    async function handleDelete(id: string) {

//        await fetch(`${API_URL}/${id}`, {
//            method: "DELETE",
//            headers: getAuthHeaders()
//        })

//        await fetchEvents()
//    }

//    function handleEdit(event: CalendarEvent) {

//        setNewEvent({
//            title: event.title,
//            date: event.date,
//            time: event.time,
//            type: event.type,
//            priority: event.priority,
//            color: event.color || "#3b82f6",
//            reminder: event.reminderMinutes || 10
//        })

//        setEditId(event.id)
//        setDialogOpen(true)
//    }

//    function handleHourClick(hour: number) {

//        setNewEvent({
//            title: "",
//            date: formatDate(currentDate),
//            time: String(hour).padStart(2, "0") + ":00",
//            type: "Meeting",
//            priority: "Low",
//            color: "#3b82f6",
//            reminder: 10
//        })

//        setEditId(null)
//        setDialogOpen(true)
//    }

//    const year = currentDate.getFullYear()
//    const month = currentDate.getMonth()

//    const daysInMonth = new Date(year, month + 1, 0).getDate()
//    const firstDay = new Date(year, month, 1).getDay()

//    const calendarDays: (number | null)[] = []

//    for (let i = 0; i < firstDay; i++) calendarDays.push(null)
//    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d)

//    const hours = Array.from({ length: 24 }, (_, i) => i)

//    return (

//        <div className="flex flex-col gap-6">

//            {/* HEADER */}

//            <div className="flex justify-between items-center">

//                <div className="flex items-center gap-3">

//                    <Button size="icon" variant="outline"
//                        onClick={() => {
//                            const d = new Date(currentDate)
//                            view === "monthly"
//                                ? d.setMonth(d.getMonth() - 1)
//                                : d.setDate(d.getDate() - 1)
//                            setCurrentDate(new Date(d))
//                        }}>
//                        <ChevronLeft className="h-4 w-4" />
//                    </Button>

//                    <h2 className="text-xl font-bold">
//                        {view === "monthly"
//                            ? `${MONTHS[month]} ${year}`
//                            : currentDate.toDateString()}
//                    </h2>

//                    <Button size="icon" variant="outline"
//                        onClick={() => {
//                            const d = new Date(currentDate)
//                            view === "monthly"
//                                ? d.setMonth(d.getMonth() + 1)
//                                : d.setDate(d.getDate() + 1)
//                            setCurrentDate(new Date(d))
//                        }}>
//                        <ChevronRight className="h-4 w-4" />
//                    </Button>

//                </div>

//                <div className="flex items-center gap-4">

//                    {/* NOTIFICATION BELL */}

//                    {/*<div className="relative">*/}

//                    {/*    <Button*/}
//                    {/*        variant="outline"*/}
//                    {/*        size="icon"*/}
//                    {/*        onClick={() => setShowNotifications(!showNotifications)}*/}
//                    {/*    >*/}

//                    {/*        <Bell className="h-4 w-4" />*/}

//                    {/*        {notifications.length > 0 && (*/}
//                    {/*            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">*/}
//                    {/*                {notifications.length}*/}
//                    {/*            </span>*/}
//                    {/*        )}*/}

//                    {/*    </Button>*/}

//                    {/*    {showNotifications && (*/}

//                    {/*        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow p-3 z-50">*/}

//                    {/*            <h4 className="font-semibold mb-2">*/}
//                    {/*                Notifications*/}
//                    {/*            </h4>*/}

//                    {/*            {notifications.length === 0 && (*/}
//                    {/*                <p className="text-sm text-gray-500">*/}
//                    {/*                    No reminders*/}
//                    {/*                </p>*/}
//                    {/*            )}*/}

//                    {/*            {notifications.map(n => (*/}
//                    {/*                <div key={n.id} className="text-sm border-b py-1">*/}
//                    {/*                    {n.text}*/}
//                    {/*                </div>*/}
//                    {/*            ))}*/}

//                    {/*        </div>*/}

//                    {/*    )}*/}

//                    {/*</div>*/}

//                    <Tabs value={view} onValueChange={(v) => setView(v as any)}>

//                        <TabsList>
//                            <TabsTrigger value="monthly">Monthly</TabsTrigger>
//                            <TabsTrigger value="daily">Daily</TabsTrigger>
//                        </TabsList>

//                    </Tabs>

//                </div>

//            </div>

//            {/* MONTH VIEW */}

//            {view === "monthly" && (

//                <div className="grid grid-cols-7 gap-2">

//                    {calendarDays.map((day, i) => {

//                        const dateStr = day
//                            ? formatDate(new Date(year, month, day))
//                            : ""

//                        const dayEvents = day
//                            ? getEventsForDate(dateStr)
//                            : []

//                        return (

//                            <div
//                                key={i}
//                                className={`border p-2 min-h-28 rounded cursor-pointer
//${isToday(dateStr) ? "border-blue-600 border-2" : ""}`}

//                                onClick={() => {
//                                    if (!day) return
//                                    setCurrentDate(new Date(dateStr))
//                                    setView("daily")
//                                }}>

//                                {day && <div className="font-semibold">{day}</div>}

//                                {dayEvents.slice(0, 2).map(e => (
//                                    <div
//                                        key={e.id}
//                                        style={{ backgroundColor: e.color }}
//                                        className="text-white text-xs rounded px-1 mb-1 truncate">

//                                        {formatTime(e.time)} {e.title}

//                                    </div>
//                                ))}

//                            </div>

//                        )

//                    })}

//                </div>

//            )}

//            {/* DAILY VIEW */}

//            {view === "daily" && (

//                <div className="border rounded p-4 h-[700px] overflow-y-auto">

//                    {hours.map(hour => (

//                        <div
//                            key={hour}
//                            className="border-t h-16 flex items-start cursor-pointer"
//                            onClick={() => handleHourClick(hour)}>

//                            <span className="w-16 text-xs pt-2">

//                                {hour === 0 ? "12 AM"
//                                    : hour < 12 ? `${hour} AM`
//                                        : hour === 12 ? "12 PM"
//                                            : `${hour - 12} PM`}

//                            </span>

//                            <div className="flex-1 pt-2">

//                                {getEventsForDate(formatDate(currentDate))
//                                    .filter(e => Number(e.time.split(":")[0]) === hour)
//                                    .map(e => (

//                                        <div
//                                            key={e.id}
//                                            style={{ backgroundColor: e.color }}
//                                            className="text-white rounded px-2 py-1 text-xs mb-1 flex justify-between items-center"
//                                            onClick={(ev) => ev.stopPropagation()}>

//                                            <span>{formatTime(e.time)} {e.title}</span>

//                                            <div className="flex gap-2">

//                                                <Pencil
//                                                    className="h-3 w-3 cursor-pointer"
//                                                    onClick={() => handleEdit(e)}
//                                                />

//                                                <Trash2
//                                                    className="h-3 w-3 cursor-pointer"
//                                                    onClick={() => handleDelete(e.id)}
//                                                />

//                                            </div>

//                                        </div>

//                                    ))}

//                            </div>

//                        </div>

//                    ))}

//                </div>

//            )}

//            {/* EVENT DIALOG */}

//            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

//                <DialogContent>

//                    <DialogHeader>

//                        <DialogTitle>
//                            {editId ? "Edit Task" : "Add Task"}
//                        </DialogTitle>

//                        <DialogDescription>
//                            Enter task details
//                        </DialogDescription>

//                    </DialogHeader>

//                    <div className="flex flex-col gap-4">

//                        <Input
//                            placeholder="Title"
//                            value={newEvent.title}
//                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
//                        />

//                        <Input
//                            type="date"
//                            value={newEvent.date}
//                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
//                        />

//                        <Input
//                            type="time"
//                            value={newEvent.time}
//                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
//                        />

//                        <Select
//                            value={newEvent.priority}
//                            onValueChange={(v) => setNewEvent({ ...newEvent, priority: v as any })}
//                        >

//                            <SelectTrigger>
//                                <SelectValue />
//                            </SelectTrigger>

//                            <SelectContent>
//                                <SelectItem value="Low">Low</SelectItem>
//                                <SelectItem value="Medium">Medium</SelectItem>
//                                <SelectItem value="High">High</SelectItem>
//                            </SelectContent>

//                        </Select>

//                        <Select
//                            value={String(newEvent.reminder)}
//                            onValueChange={(v) => setNewEvent({ ...newEvent, reminder: Number(v) })}
//                        >

//                            <SelectTrigger>
//                                <SelectValue placeholder="Reminder" />
//                            </SelectTrigger>

//                            <SelectContent>
//                                <SelectItem value="0">At time</SelectItem>
//                                <SelectItem value="5">5 minutes before</SelectItem>
//                                <SelectItem value="10">10 minutes before</SelectItem>
//                                <SelectItem value="15">15 minutes before</SelectItem>
//                            </SelectContent>

//                        </Select>

//                        <div className="flex gap-2 flex-wrap">

//                            {COLORS.map(color => (

//                                <div
//                                    key={color}
//                                    onClick={() => setNewEvent({ ...newEvent, color })}
//                                    className={`w-6 h-6 rounded-full cursor-pointer border-2
//${newEvent.color === color ? "border-black" : "border-transparent"}`}
//                                    style={{ backgroundColor: color }}
//                                />

//                            ))}

//                        </div>

//                        <Button onClick={handleSave}>
//                            {editId ? "Save Changes" : "Add Task"}
//                        </Button>

//                    </div>

//                </DialogContent>

//            </Dialog>

//        </div>

//    )

//}






"use client"

import { useState, useEffect } from "react"
import {
    ChevronLeft,
    ChevronRight,
    Trash2,
    Pencil,
    Bell
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CalendarEvent {
    id: string
    title: string
    date: string
    time: string
    type: string
    priority: "Low" | "Medium" | "High"
    color?: string
    reminderMinutes?: number
}

const API_URL = "https://calchatmain-production-75c1.up.railway.app//api/CalendarEvents"

// ✅ GLOBAL NOTIFICATION SAVE
const saveGlobalNotification = (message: string) => {
    const existing = JSON.parse(localStorage.getItem("globalNotifications") || "[]")

    const newNotif = {
        id: Date.now(),
        text: message,
        isRead: false
    }

    localStorage.setItem(
        "globalNotifications",
        JSON.stringify([newNotif, ...existing])
    )

    // 🔥 header ne notify karva
    window.dispatchEvent(new Event("new-notification"))
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

const COLORS = [
    "#ef4444", "#22c55e", "#3b82f6",
    "#f59e0b", "#a855f7", "#14b8a6", "#f43f5e"
]

function getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }
}

function formatDate(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function formatTime(time: string) {
    const [hour, minute] = time.split(":")
    const h = Number(hour)
    const ampm = h >= 12 ? "PM" : "AM"
    const formattedHour = h % 12 || 12
    return `${formattedHour}:${minute} ${ampm}`
}

function isToday(dateStr: string) {
    const today = new Date()
    return dateStr === formatDate(today)
}

export function CalendarView() {

    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState<"monthly" | "daily">("monthly")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [triggeredEvents, setTriggeredEvents] = useState<Set<string>>(new Set())

    //const [notifications, setNotifications] = useState<any[]>([])
    //const [showNotifications, setShowNotifications] = useState(false)
    //const [triggeredEvents, setTriggeredEvents] = useState<Set<string>>(new Set())

    const [newEvent, setNewEvent] = useState({
        title: "",
        date: "",
        time: "",
        type: "Meeting",
        priority: "Low" as "Low" | "Medium" | "High",
        color: "#3b82f6",
        reminder: 10
    })

    useEffect(() => { fetchEvents() }, [])

    useEffect(() => {

        const interval = setInterval(() => {

            const now = new Date()
            const todayStr = formatDate(now)

            events.forEach(event => {

                if (event.date !== todayStr) return

                // ✅ prevent duplicate notification
                if (triggeredEvents.has(event.id)) return

                const eventTime = new Date(`${event.date}T${event.time}`)
                const reminderMinutes = event.reminderMinutes ?? 0

                const reminderTime = new Date(
                    eventTime.getTime() - reminderMinutes * 60000
                )

                const diff = Math.abs(now.getTime() - reminderTime.getTime())

                if (diff <= 20000) {

                    const message = `${event.title} at ${formatTime(event.time)}`

                    saveGlobalNotification(message)

                    // ✅ mark as triggered
                    setTriggeredEvents(prev => new Set(prev).add(event.id))
                }

            })

        }, 15000)

        return () => clearInterval(interval)

    }, [events, triggeredEvents])

    

    async function fetchEvents() {

        const res = await fetch(API_URL, {
            headers: getAuthHeaders()
        })

        const data = await res.json()

        const formatted = data.map((e: any) => ({
            ...e,
            date: e.date.split("T")[0],
            color: e.color || "#3b82f6"
        }))

        setEvents(formatted)
    }

    function getEventsForDate(dateStr: string) {
        return events
            .filter(e => e.date === dateStr)
            .sort((a, b) => a.time.localeCompare(b.time))
    }

    async function handleSave() {

        if (!newEvent.title || !newEvent.date) return

        const eventData = {
            title: newEvent.title,
            date: newEvent.date + "T00:00:00",
            time: newEvent.time || "09:00",
            type: newEvent.type,
            priority: newEvent.priority,
            color: newEvent.color,
            reminderMinutes: newEvent.reminder
        }

        let response

        if (editId) {

            response = await fetch(`${API_URL}/${editId}`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify({ id: editId, ...eventData })
            })

        } else {

            response = await fetch(API_URL, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(eventData)
            })

        }
        if (!response.ok) {
            const err = await response.text()
            console.error("API ERROR:", err)
        }

        if (response.ok) {
            await fetchEvents()
        }


        setDialogOpen(false)
        setEditId(null)

        setNewEvent({
            title: "",
            date: "",
            time: "",
            type: "Meeting",
            priority: "Low",
            color: "#3b82f6",
            reminder: 10
        })
    }

    async function handleDelete(id: string) {

        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        })

        await fetchEvents()
    }

    function handleEdit(event: CalendarEvent) {

        setNewEvent({
            title: event.title,
            date: event.date,
            time: event.time,
            type: event.type,
            priority: event.priority,
            color: event.color || "#3b82f6",
            reminder: event.reminderMinutes || 10
        })

        setEditId(event.id)
        setDialogOpen(true)
    }

    function handleHourClick(hour: number) {

        setNewEvent({
            title: "",
            date: formatDate(currentDate),
            time: String(hour).padStart(2, "0") + ":00",
            type: "Meeting",
            priority: "Low",
            color: "#3b82f6",
            reminder: 10
        })

        setEditId(null)
        setDialogOpen(true)
    }

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()

    const calendarDays: (number | null)[] = []

    for (let i = 0; i < firstDay; i++) calendarDays.push(null)
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d)

    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (

        <div className="flex flex-col gap-6">

            {/* HEADER */}

            <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">

                    <Button size="icon" variant="outline"
                        onClick={() => {
                            const d = new Date(currentDate)
                            view === "monthly"
                                ? d.setMonth(d.getMonth() - 1)
                                : d.setDate(d.getDate() - 1)
                            setCurrentDate(new Date(d))
                        }}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <h2 className="text-xl font-bold">
                        {view === "monthly"
                            ? `${MONTHS[month]} ${year}`
                            : currentDate.toDateString()}
                    </h2>

                    <Button size="icon" variant="outline"
                        onClick={() => {
                            const d = new Date(currentDate)
                            view === "monthly"
                                ? d.setMonth(d.getMonth() + 1)
                                : d.setDate(d.getDate() + 1)
                            setCurrentDate(new Date(d))
                        }}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                </div>

                <div className="flex items-center gap-4">

                    {/* NOTIFICATION BELL */}

                    {/*<div className="relative">*/}

                    {/*    <Button*/}
                    {/*        variant="outline"*/}
                    {/*        size="icon"*/}
                    {/*        onClick={() => setShowNotifications(!showNotifications)}*/}
                    {/*    >*/}

                    {/*        <Bell className="h-4 w-4" />*/}

                    {/*        {notifications.length > 0 && (*/}
                    {/*            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">*/}
                    {/*                {notifications.length}*/}
                    {/*            </span>*/}
                    {/*        )}*/}

                    {/*    </Button>*/}

                    {/*    {showNotifications && (*/}

                    {/*        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow p-3 z-50">*/}

                    {/*            <h4 className="font-semibold mb-2">*/}
                    {/*                Notifications*/}
                    {/*            </h4>*/}

                    {/*            {notifications.length === 0 && (*/}
                    {/*                <p className="text-sm text-gray-500">*/}
                    {/*                    No reminders*/}
                    {/*                </p>*/}
                    {/*            )}*/}

                    {/*            {notifications.map(n => (*/}
                    {/*                <div key={n.id} className="text-sm border-b py-1">*/}
                    {/*                    {n.text}*/}
                    {/*                </div>*/}
                    {/*            ))}*/}

                    {/*        </div>*/}

                    {/*    )}*/}

                    {/*</div>*/}

                    <Tabs value={view} onValueChange={(v) => setView(v as any)}>

                        <TabsList>
                            <TabsTrigger value="monthly">Monthly</TabsTrigger>
                            <TabsTrigger value="daily">Daily</TabsTrigger>
                        </TabsList>

                    </Tabs>

                </div>

            </div>

            {/* MONTH VIEW */}

            {view === "monthly" && (

                <div className="grid grid-cols-7 gap-2">

                    {calendarDays.map((day, i) => {

                        const dateStr = day
                            ? formatDate(new Date(year, month, day))
                            : ""

                        const dayEvents = day
                            ? getEventsForDate(dateStr)
                            : []

                        return (

                            <div
                                key={i}
                                className={`border p-2 min-h-28 rounded cursor-pointer
${isToday(dateStr) ? "border-blue-600 border-2" : ""}`}

                                onClick={() => {
                                    if (!day) return
                                    setCurrentDate(new Date(dateStr))
                                    setView("daily")
                                }}>

                                {day && <div className="font-semibold">{day}</div>}

                                {dayEvents.slice(0, 2).map(e => (
                                    <div
                                        key={e.id}
                                        style={{ backgroundColor: e.color }}
                                        className="text-white text-xs rounded px-1 mb-1 truncate">

                                        {formatTime(e.time)} {e.title}

                                    </div>
                                ))}

                            </div>

                        )

                    })}

                </div>

            )}

            {/* DAILY VIEW */}

            {view === "daily" && (

                <div className="border rounded p-4 h-[700px] overflow-y-auto">

                    {hours.map(hour => (

                        <div
                            key={hour}
                            className="border-t h-16 flex items-start cursor-pointer"
                            onClick={() => handleHourClick(hour)}>

                            <span className="w-16 text-xs pt-2">

                                {hour === 0 ? "12 AM"
                                    : hour < 12 ? `${hour} AM`
                                        : hour === 12 ? "12 PM"
                                            : `${hour - 12} PM`}

                            </span>

                            <div className="flex-1 pt-2">

                                {getEventsForDate(formatDate(currentDate))
                                    .filter(e => Number(e.time.split(":")[0]) === hour)
                                    .map(e => (

                                        <div
                                            key={e.id}
                                            style={{ backgroundColor: e.color }}
                                            className="text-white rounded px-2 py-1 text-xs mb-1 flex justify-between items-center"
                                            onClick={(ev) => ev.stopPropagation()}>

                                            <span>{formatTime(e.time)} {e.title}</span>

                                            <div className="flex gap-2">

                                                <Pencil
                                                    className="h-3 w-3 cursor-pointer"
                                                    onClick={() => handleEdit(e)}
                                                />

                                                <Trash2
                                                    className="h-3 w-3 cursor-pointer"
                                                    onClick={() => handleDelete(e.id)}
                                                />

                                            </div>

                                        </div>

                                    ))}

                            </div>

                        </div>

                    ))}

                </div>

            )}

            {/* EVENT DIALOG */}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            {editId ? "Edit Task" : "Add Task"}
                        </DialogTitle>

                        <DialogDescription>
                            Enter task details
                        </DialogDescription>

                    </DialogHeader>

                    <div className="flex flex-col gap-4">

                        <Input
                            placeholder="Title"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        />

                        <Input
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        />

                        <Input
                            type="time"
                            value={newEvent.time}
                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        />

                        <Select
                            value={newEvent.priority}
                            onValueChange={(v) => setNewEvent({ ...newEvent, priority: v as any })}
                        >

                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                            </SelectContent>

                        </Select>

                        <Select
                            value={String(newEvent.reminder)}
                            onValueChange={(v) => setNewEvent({ ...newEvent, reminder: Number(v) })}
                        >

                            <SelectTrigger>
                                <SelectValue placeholder="Reminder" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="0">At time</SelectItem>
                                <SelectItem value="5">5 minutes before</SelectItem>
                                <SelectItem value="10">10 minutes before</SelectItem>
                                <SelectItem value="15">15 minutes before</SelectItem>
                            </SelectContent>

                        </Select>

                        <div className="flex gap-2 flex-wrap">

                            {COLORS.map(color => (

                                <div
                                    key={color}
                                    onClick={() => setNewEvent({ ...newEvent, color })}
                                    className={`w-6 h-6 rounded-full cursor-pointer border-2
${newEvent.color === color ? "border-black" : "border-transparent"}`}
                                    style={{ backgroundColor: color }}
                                />

                            ))}

                        </div>

                        <Button onClick={handleSave}>
                            {editId ? "Save Changes" : "Add Task"}
                        </Button>

                    </div>

                </DialogContent>

            </Dialog>

        </div>

    )

}