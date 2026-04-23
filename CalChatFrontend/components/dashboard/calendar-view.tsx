




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

//const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/CalendarEvents"

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

//const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/CalendarEvents"

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

//const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/CalendarEvents"

//// ✅ GLOBAL NOTIFICATION SAVE
//const saveGlobalNotification = (message: string) => {
//    const existing = JSON.parse(localStorage.getItem("globalNotifications") || "[]")

//    const newNotif = {
//        id: Date.now(),
//        text: message,
//        isRead: false
//    }

//    localStorage.setItem(
//        "globalNotifications",
//        JSON.stringify([newNotif, ...existing])
//    )

//    // 🔥 header ne notify karva
//    window.dispatchEvent(new Event("new-notification"))
//}

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
//    const [triggeredEvents, setTriggeredEvents] = useState<Set<string>>(new Set())

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

//    useEffect(() => {

//        const interval = setInterval(() => {

//            const now = new Date()
//            const todayStr = formatDate(now)

//            events.forEach(event => {

//                if (event.date !== todayStr) return

//                // ✅ prevent duplicate notification
//                if (triggeredEvents.has(event.id)) return

//                const eventTime = new Date(`${event.date}T${event.time}`)
//                const reminderMinutes = event.reminderMinutes ?? 0

//                const reminderTime = new Date(
//                    eventTime.getTime() - reminderMinutes * 60000
//                )

//                const diff = Math.abs(now.getTime() - reminderTime.getTime())

//                if (diff <= 20000) {

//                    const message = `${event.title} at ${formatTime(event.time)}`

//                    saveGlobalNotification(message)

//                    // ✅ mark as triggered
//                    setTriggeredEvents(prev => new Set(prev).add(event.id))
//                }

//            })

//        }, 15000)

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


//        // ✅ CREATE LOCAL NOTIFICATION (IMPORTANT)

//        const userId = localStorage.getItem("userId")

//        const eventDateTime = new Date(`${newEvent.date}T${newEvent.time || "09:00"}`)

//        // reminder time calculate
//        const triggerTime = new Date(
//            eventDateTime.getTime() - (newEvent.reminder * 60000)
//        )

//        const newNotification = {
//            id: crypto.randomUUID(),
//            userId: userId,
//            text: newEvent.title,
//            eventDate: eventDateTime.toISOString(),
//            triggerTime: triggerTime.toISOString(), // ✅ MUST BE ISO STRING
//            triggered: false,
//            isRead: false,
//            createdAt: new Date().toISOString()
//        }

//        // save to localStorage
//        const existing = JSON.parse(localStorage.getItem("globalNotifications") || "[]")

//        localStorage.setItem(
//            "globalNotifications",
//            JSON.stringify([newNotification, ...existing])
//        )

//        // 🔔 notify dashboard instantly
//        window.dispatchEvent(new Event("new-notification"))

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

import { useEffect, useMemo, useState } from "react"
import {
    ChevronLeft,
    ChevronRight,
    Trash2,
    Pencil,
    Search,
    CalendarDays,
    Clock3,
    FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface CalendarEvent {
    id: string
    title: string
    date: string
    time: string
    type: string
    priority: "Low" | "Medium" | "High"
    color?: string
    reminderMinutes?: number
    description?: string
    isAllDay?: boolean
}

const API_URL = "https://steadfast-warmth-production-64c8.up.railway.app/api/CalendarEvents"

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

const COLORS = [
    "#ef4444", "#22c55e", "#3b82f6",
    "#f59e0b", "#a855f7", "#14b8a6", "#f43f5e",
]

const EVENT_TYPES = ["Meeting", "Task", "Reminder", "Deadline", "Personal"] as const

function getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    return dateStr === formatDate(new Date())
}

function getReminderLabel(minutes: number) {
    if (minutes === 0) return "At time"
    if (minutes < 60) return `${minutes} min before`
    const hours = minutes / 60
    return `${hours} hr before`
}

export function CalendarView() {
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState<"monthly" | "daily">("monthly")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [detailOpen, setDetailOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [editId, setEditId] = useState<string | null>(null)

    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState("All")
    const [priorityFilter, setPriorityFilter] = useState("All")

    const [newEvent, setNewEvent] = useState({
        title: "",
        date: "",
        time: "09:00",
        type: "Meeting",
        priority: "Low" as "Low" | "Medium" | "High",
        color: "#3b82f6",
        reminder: 10,
        description: "",
        isAllDay: false,
    })

    useEffect(() => {
        fetchEvents()
    }, [])

    async function fetchEvents() {
        const res = await fetch(API_URL, {
            headers: getAuthHeaders(),
        })
        const data = await res.json()

        const formatted = data.map((e: any) => ({
            ...e,
            date: e.date.split("T")[0],
            color: e.color || "#3b82f6",
        }))

        setEvents(formatted)
    }

    const filteredEvents = useMemo(() => {
        return events.filter((e) => {
            const matchesSearch = !search.trim() || e.title.toLowerCase().includes(search.toLowerCase())
            const matchesType = typeFilter === "All" || e.type === typeFilter
            const matchesPriority = priorityFilter === "All" || e.priority === priorityFilter
            return matchesSearch && matchesType && matchesPriority
        })
    }, [events, search, typeFilter, priorityFilter])

    function getEventsForDate(dateStr: string) {
        return filteredEvents
            .filter((e) => e.date === dateStr)
            .sort((a, b) => a.time.localeCompare(b.time))
    }

    function getPriorityBadgeClass(priority: CalendarEvent["priority"]) {
        switch (priority) {
            case "High":
                return "bg-red-500/10 text-red-600 border-red-500/20"
            case "Medium":
                return "bg-amber-500/10 text-amber-700 border-amber-500/20"
            default:
                return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
        }
    }

    async function handleSave() {
        if (!newEvent.title || !newEvent.date) return

        const eventData = {
            title: newEvent.title,
            date: `${newEvent.date}T00:00:00`,
            time: newEvent.isAllDay ? "00:00" : newEvent.time || "09:00",
            type: newEvent.type,
            priority: newEvent.priority,
            color: newEvent.color,
            reminderMinutes: newEvent.reminder,
            description: newEvent.description,
            isAllDay: newEvent.isAllDay,
        }

        let response

        if (editId) {
            response = await fetch(`${API_URL}/${editId}`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify({ id: editId, ...eventData }),
            })
        } else {
            response = await fetch(API_URL, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(eventData),
            })
        }

        if (!response.ok) {
            const err = await response.text()
            console.error("API ERROR:", err)
            return
        }

        await fetchEvents()

        setDialogOpen(false)
        setEditId(null)
        setSelectedEvent(null)
        setNewEvent({
            title: "",
            date: "",
            time: "09:00",
            type: "Meeting",
            priority: "Low",
            color: "#3b82f6",
            reminder: 10,
            description: "",
            isAllDay: false,
        })
    }

    async function handleDelete(id: string) {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        })

        await fetchEvents()
        setDetailOpen(false)
        setSelectedEvent(null)
    }

    function handleEdit(event: CalendarEvent) {
        setNewEvent({
            title: event.title,
            date: event.date,
            time: event.time || "09:00",
            type: event.type,
            priority: event.priority,
            color: event.color || "#3b82f6",
            reminder: event.reminderMinutes || 10,
            description: event.description || "",
            isAllDay: !!event.isAllDay,
        })

        setEditId(event.id)
        setDialogOpen(true)
        setDetailOpen(false)
    }

    function handleHourClick(hour: number) {
        setNewEvent({
            title: "",
            date: formatDate(currentDate),
            time: `${String(hour).padStart(2, "0")}:00`,
            type: "Meeting",
            priority: "Low",
            color: "#3b82f6",
            reminder: 10,
            description: "",
            isAllDay: false,
        })

        setEditId(null)
        setDialogOpen(true)
    }

    function openCreateForDay(dateStr: string) {
        setNewEvent({
            title: "",
            date: dateStr,
            time: "09:00",
            type: "Meeting",
            priority: "Low",
            color: "#3b82f6",
            reminder: 10,
            description: "",
            isAllDay: false,
        })
        setEditId(null)
        setDialogOpen(true)
    }

    function openDetail(event: CalendarEvent) {
        setSelectedEvent(event)
        setDetailOpen(true)
    }

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()

    const calendarDays: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) calendarDays.push(null)
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d)

    const hours = Array.from({ length: 24 }, (_, i) => i)

    const todayEvents = filteredEvents.filter((e) => e.date === formatDate(new Date()))
    const upcomingEvents = filteredEvents
        .filter((e) => new Date(`${e.date}T${e.time || "00:00"}`) >= new Date())
        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
        .slice(0, 5)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                            const d = new Date(currentDate)
                            view === "monthly" ? d.setMonth(d.getMonth() - 1) : d.setDate(d.getDate() - 1)
                            setCurrentDate(new Date(d))
                        }}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <h2 className="text-xl font-bold">
                        {view === "monthly" ? `${MONTHS[month]} ${year}` : currentDate.toDateString()}
                    </h2>

                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                            const d = new Date(currentDate)
                            view === "monthly" ? d.setMonth(d.getMonth() + 1) : d.setDate(d.getDate() + 1)
                            setCurrentDate(new Date(d))
                        }}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                        Today
                    </Button>
                </div>

                <Tabs value={view} onValueChange={(v) => setView(v as "monthly" | "daily")}>
                    <TabsList>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search events..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        {EVENT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Priorities</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
                <div className="space-y-6">
                    {view === "monthly" && (
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((day, i) => {
                                const dateStr = day ? formatDate(new Date(year, month, day)) : ""
                                const dayEvents = day ? getEventsForDate(dateStr) : []

                                return (
                                    <div
                                        key={i}
                                        className={`min-h-32 rounded-xl border p-2 transition ${day ? "cursor-pointer hover:shadow-sm" : "bg-muted/20"
                                            } ${isToday(dateStr) ? "border-2 border-blue-600" : ""}`}
                                        onClick={() => {
                                            if (!day) return
                                            setCurrentDate(new Date(dateStr))
                                            setView("daily")
                                        }}
                                        onDoubleClick={() => {
                                            if (!day) return
                                            openCreateForDay(dateStr)
                                        }}
                                    >
                                        {day && (
                                            <div className="mb-2 flex items-center justify-between">
                                                <div className="font-semibold">{day}</div>
                                                {isToday(dateStr) && (
                                                    <Badge className="bg-blue-500/10 text-blue-600">Today</Badge>
                                                )}
                                            </div>
                                        )}

                                        <div className="space-y-1">
                                            {dayEvents.slice(0, 2).map((e) => (
                                                <div
                                                    key={e.id}
                                                    onClick={(ev) => {
                                                        ev.stopPropagation()
                                                        openDetail(e)
                                                    }}
                                                    className="rounded-md border-l-4 px-2 py-1 text-xs shadow-sm"
                                                    style={{
                                                        backgroundColor: `${e.color}22`,
                                                        borderLeftColor: e.color,
                                                    }}
                                                >
                                                    <div className="truncate font-medium">{e.title}</div>
                                                    <div className="text-muted-foreground">
                                                        {e.isAllDay ? "All day" : formatTime(e.time)}
                                                    </div>
                                                </div>
                                            ))}

                                            {dayEvents.length > 2 && (
                                                <div className="text-xs text-muted-foreground">
                                                    +{dayEvents.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {view === "daily" && (
                        <div className="h-[700px] overflow-y-auto rounded-xl border p-4">
                            {hours.map((hour) => (
                                <div
                                    key={hour}
                                    className="flex min-h-16 items-start border-t"
                                    onClick={() => handleHourClick(hour)}
                                >
                                    <span className="w-16 pt-3 text-xs text-muted-foreground">
                                        {hour === 0
                                            ? "12 AM"
                                            : hour < 12
                                                ? `${hour} AM`
                                                : hour === 12
                                                    ? "12 PM"
                                                    : `${hour - 12} PM`}
                                    </span>

                                    <div className="flex-1 pt-2">
                                        {getEventsForDate(formatDate(currentDate))
                                            .filter((e) => e.isAllDay || Number((e.time || "00:00").split(":")[0]) === hour)
                                            .map((e) => (
                                                <div
                                                    key={e.id}
                                                    className="mb-2 rounded-lg border-l-4 px-3 py-2 shadow-sm"
                                                    style={{
                                                        backgroundColor: `${e.color}22`,
                                                        borderLeftColor: e.color,
                                                    }}
                                                    onClick={(ev) => {
                                                        ev.stopPropagation()
                                                        openDetail(e)
                                                    }}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <div className="font-medium text-sm">{e.title}</div>
                                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                                <span>{e.isAllDay ? "All day" : formatTime(e.time)}</span>
                                                                <Badge variant="secondary" className="text-[10px]">
                                                                    {e.type}
                                                                </Badge>
                                                                <Badge className={getPriorityBadgeClass(e.priority)}>
                                                                    {e.priority}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2" onClick={(ev) => ev.stopPropagation()}>
                                                            <Pencil
                                                                className="h-4 w-4 cursor-pointer text-muted-foreground"
                                                                onClick={() => handleEdit(e)}
                                                            />
                                                            <Trash2
                                                                className="h-4 w-4 cursor-pointer text-destructive"
                                                                onClick={() => handleDelete(e.id)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="rounded-xl border p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-blue-600" />
                            <h3 className="font-semibold">Today</h3>
                        </div>

                        {todayEvents.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No events today</p>
                        ) : (
                            <div className="space-y-2">
                                {todayEvents.map((e) => (
                                    <div
                                        key={e.id}
                                        className="cursor-pointer rounded-lg border p-3"
                                        onClick={() => openDetail(e)}
                                    >
                                        <div className="font-medium text-sm">{e.title}</div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            {e.isAllDay ? "All day" : formatTime(e.time)} • {e.type}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-blue-600" />
                            <h3 className="font-semibold">Upcoming</h3>
                        </div>

                        {upcomingEvents.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No upcoming events</p>
                        ) : (
                            <div className="space-y-2">
                                {upcomingEvents.map((e) => (
                                    <div
                                        key={e.id}
                                        className="cursor-pointer rounded-lg border p-3"
                                        onClick={() => openDetail(e)}
                                    >
                                        <div className="font-medium text-sm">{e.title}</div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            {e.date} • {e.isAllDay ? "All day" : formatTime(e.time)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-md rounded-2xl">
                    {selectedEvent && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedEvent.title}</DialogTitle>
                                <DialogDescription>Event details</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="space-y-3 rounded-xl border p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Date</span>
                                        <span className="text-sm font-medium">{selectedEvent.date}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Time</span>
                                        <span className="text-sm font-medium">
                                            {selectedEvent.isAllDay ? "All day" : formatTime(selectedEvent.time)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Type</span>
                                        <Badge variant="secondary">{selectedEvent.type}</Badge>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Priority</span>
                                        <Badge className={getPriorityBadgeClass(selectedEvent.priority)}>
                                            {selectedEvent.priority}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Reminder</span>
                                        <span className="text-sm font-medium">
                                            {getReminderLabel(selectedEvent.reminderMinutes ?? 0)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Color</span>
                                        <div
                                            className="h-5 w-5 rounded-full border"
                                            style={{ backgroundColor: selectedEvent.color }}
                                        />
                                    </div>

                                    {!!selectedEvent.description && (
                                        <div className="rounded-lg bg-muted/40 p-3">
                                            <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                                                <FileText className="h-4 w-4 text-blue-600" />
                                                Description
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedEvent.description}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1" onClick={() => handleEdit(selectedEvent)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>

                                    <Button variant="destructive" className="flex-1" onClick={() => handleDelete(selectedEvent.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white p-0 text-gray-900 shadow-xl dark:bg-[#020617] dark:text-white">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-white">
                        <DialogTitle className="text-base font-semibold">
                            {editId ? "Edit Event" : "Add Event"}
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-xs text-blue-100">
                            Plan your day with clean event details
                        </DialogDescription>
                    </div>

                    <div className="flex flex-col gap-4 p-5">
                        <Input
                            placeholder="Title"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            className="h-10 rounded-lg bg-gray-50 text-sm dark:bg-white/5"
                        />

                        <Input
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            className="h-10 rounded-lg bg-gray-50 text-sm dark:bg-white/5"
                        />

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={newEvent.isAllDay}
                                onChange={(e) => setNewEvent({ ...newEvent, isAllDay: e.target.checked })}
                                className="accent-blue-500"
                            />
                            All day event
                        </label>

                        {!newEvent.isAllDay && (
                            <Input
                                type="time"
                                value={newEvent.time}
                                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                className="h-10 rounded-lg bg-gray-50 text-sm dark:bg-white/5"
                            />
                        )}

                        <Select
                            value={newEvent.type}
                            onValueChange={(v) => setNewEvent({ ...newEvent, type: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {EVENT_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={newEvent.priority}
                            onValueChange={(v) => setNewEvent({ ...newEvent, priority: v as "Low" | "Medium" | "High" })}
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
                                <SelectItem value="30">30 minutes before</SelectItem>
                                <SelectItem value="60">1 hour before</SelectItem>
                            </SelectContent>
                        </Select>

                        <textarea
                            placeholder="Description..."
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            className="min-h-[100px] rounded-lg border bg-gray-50 px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                        />

                        <div className="flex flex-wrap gap-2">
                            {COLORS.map((color) => (
                                <div
                                    key={color}
                                    onClick={() => setNewEvent({ ...newEvent, color })}
                                    className={`h-7 w-7 cursor-pointer rounded-full border-2 ${newEvent.color === color ? "border-black" : "border-transparent"
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>

                        <Button
                            onClick={handleSave}
                            className="h-11 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-sm transition hover:opacity-90"
                        >
                            {editId ? "Save Changes" : "Add Event"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
