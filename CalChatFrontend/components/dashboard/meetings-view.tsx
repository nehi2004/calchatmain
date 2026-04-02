
//"use client"

//import { useEffect, useState } from "react"
//import {
//    Video, Plus, Clock, Users, Calendar
//} from "lucide-react"

//import { Button } from "@/components/ui/button"
//import { Badge } from "@/components/ui/badge"
//import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle,
//    DialogDescription
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"

//export function MeetingsView() {

//    // STATES
//    const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([])
//    const [pastMeetings, setPastMeetings] = useState<any[]>([])
//    const [users, setUsers] = useState<any[]>([])
//    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
//    const [loading, setLoading] = useState(true)
//    const [openModal, setOpenModal] = useState(false)

//    // FORM
//    const [title, setTitle] = useState("")
//    const [startTime, setStartTime] = useState("")
//    const [endTime, setEndTime] = useState("")
//    const [meetingLink, setMeetingLink] = useState("")

//    useEffect(() => {
//        fetchMeetings()
//        fetchUsers()
//    }, [])

//    // FETCH MEETINGS
//    const fetchMeetings = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchat-backend.onrender.com//api/meeting/my-meetings", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()
//            const now = new Date()

//            setUpcomingMeetings(data.filter((m: any) => new Date(m.startTime) > now))
//            setPastMeetings(data.filter((m: any) => new Date(m.endTime) < now))

//        } catch (err) {
//            console.error(err)
//        } finally {
//            setLoading(false)
//        }
//    }

//    // FETCH USERS
//    const fetchUsers = async () => {
//        const token = localStorage.getItem("token")

//        const res = await fetch("https://calchat-backend.onrender.com//api/meeting/users", {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()
//        setUsers(data)
//    }

//    // CREATE MEETING
//    const createMeeting = async () => {
//        const token = localStorage.getItem("token")

//        const res = await fetch("https://calchat-backend.onrender.com//api/meeting/create", {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`
//            },
//            body: JSON.stringify({
//                title,
//                startTime: new Date(startTime).toISOString(),  // 🔥 UTC FIX
//                endTime: new Date(endTime).toISOString(),
//                meetingLink: meetingLink || "https://meet.google.com/new",
//                participantIds: selectedUsers
//            })
//        })

//        if (!res.ok) {
//            alert(await res.text())
//            return
//        }

//        setOpenModal(false)
//        setTitle("")
//        setStartTime("")
//        setEndTime("")
//        setMeetingLink("")
//        setSelectedUsers([])

//        fetchMeetings()
//    }

//    // FORMAT
//    const formatDate = (d: string) =>
//        new Date(d).toLocaleDateString()

//    const formatTime = (s: string, e: string) =>
//        `${new Date(s).toLocaleTimeString()} - ${new Date(e).toLocaleTimeString()}`

//    const todayCount = upcomingMeetings.filter(
//        m => new Date(m.startTime).toDateString() === new Date().toDateString()
//    ).length

//    if (loading) return <p className="p-4">Loading...</p>

//    return (
//        <div className="flex flex-col gap-6">

//            {/* HEADER */}
//            <div className="flex items-center justify-between">
//                <div>
//                    <h2 className="font-heading text-xl font-bold">Meetings</h2>
//                    <p className="text-sm text-muted-foreground">
//                        Schedule and manage your meetings
//                    </p>
//                </div>

//                <Button onClick={() => setOpenModal(true)} className="gap-2">
//                    <Plus className="h-4 w-4" /> Schedule Meeting
//                </Button>
//            </div>

//            {/* STATS */}
//            <div className="grid gap-4 sm:grid-cols-3">
//                <div className="rounded-xl border p-4 text-center">
//                    <p className="text-sm text-muted-foreground">Today</p>
//                    <p className="text-2xl font-bold">{todayCount}</p>
//                </div>
//                <div className="rounded-xl border p-4 text-center">
//                    <p className="text-sm text-muted-foreground">Upcoming</p>
//                    <p className="text-2xl font-bold">{upcomingMeetings.length}</p>
//                </div>
//                <div className="rounded-xl border p-4 text-center">
//                    <p className="text-sm text-muted-foreground">Past</p>
//                    <p className="text-2xl font-bold">{pastMeetings.length}</p>
//                </div>
//            </div>

//            {/* TABS */}
//            <Tabs defaultValue="upcoming">

//                <TabsList>
//                    <TabsTrigger value="upcoming">
//                        Upcoming ({upcomingMeetings.length})
//                    </TabsTrigger>
//                    <TabsTrigger value="past">
//                        Past ({pastMeetings.length})
//                    </TabsTrigger>
//                </TabsList>

//                {/* UPCOMING UI (🔥 CODE 1 STYLE) */}
//                <TabsContent value="upcoming" className="mt-4">
//                    <div className="flex flex-col gap-4">

//                        {upcomingMeetings.map((m) => (
//                            <div key={m.id} className="rounded-xl border bg-card p-5 hover:shadow-md">

//                                <div className="flex justify-between">

//                                    <div>
//                                        <div className="flex gap-2 items-center">
//                                            <h3 className="font-semibold">{m.title}</h3>
//                                            <Badge>Meeting</Badge>
//                                        </div>

//                                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
//                                            <span className="flex gap-1">
//                                                <Calendar className="h-4 w-4" />
//                                                {formatDate(m.startTime)}
//                                            </span>

//                                            <span className="flex gap-1">
//                                                <Clock className="h-4 w-4" />
//                                                {formatTime(m.startTime, m.endTime)}
//                                            </span>
//                                        </div>
//                                    </div>

//                                    <Button
//                                        size="sm"
//                                        variant="outline"
//                                        onClick={() => window.open(m.meetingLink, "_blank")}
//                                    >
//                                        <Video className="h-4 w-4" /> Join
//                                    </Button>

//                                </div>

//                            </div>
//                        ))}

//                    </div>
//                </TabsContent>

//                {/* PAST */}
//                <TabsContent value="past" className="mt-4">
//                    <div className="flex flex-col gap-4">

//                        {pastMeetings.map((m) => (
//                            <div key={m.id} className="rounded-xl border p-5 opacity-70">
//                                <h3 className="font-semibold">{m.title}</h3>

//                                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
//                                    <span>{formatDate(m.startTime)}</span>
//                                    <span>{formatTime(m.startTime, m.endTime)}</span>
//                                </div>
//                            </div>
//                        ))}

//                    </div>
//                </TabsContent>

//            </Tabs>

//            {/* MODAL */}
//            <Dialog open={openModal} onOpenChange={setOpenModal}>
//                <DialogContent>

//                    <DialogHeader>
//                        <DialogTitle>Schedule Meeting</DialogTitle>
//                        <DialogDescription>
//                            Fill details
//                        </DialogDescription>
//                    </DialogHeader>

//                    <div className="space-y-3">

//                        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

//                        <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

//                        <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

//                        <Input placeholder="Meeting Link" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />

//                        <div>
//                            <Label>Select Participants</Label>

//                            {users.map(u => (
//                                <div key={u.id} className="flex gap-2">
//                                    <input
//                                        type="checkbox"
//                                        onChange={(e) => {
//                                            if (e.target.checked)
//                                                setSelectedUsers([...selectedUsers, u.id])
//                                            else
//                                                setSelectedUsers(selectedUsers.filter(id => id !== u.id))
//                                        }}
//                                    />
//                                    {u.fullName}
//                                </div>
//                            ))}
//                        </div>

//                        <Button onClick={createMeeting}>Create</Button>

//                    </div>

//                </DialogContent>
//            </Dialog>

//        </div>
//    )
//}




//"use client"

//import { useEffect, useState } from "react"
//import {
//    Video, Plus, Clock, Calendar
//} from "lucide-react"

//import { Button } from "@/components/ui/button"
//import { Badge } from "@/components/ui/badge"
//import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle,
//    DialogDescription
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"

//export function MeetingsView() {

//    /* ================= STATE ================= */

//    const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([])
//    const [pastMeetings, setPastMeetings] = useState<any[]>([])
//    const [users, setUsers] = useState<any[]>([])
//    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
//    const [loading, setLoading] = useState(true)
//    const [openModal, setOpenModal] = useState(false)

//    const [userRole, setUserRole] = useState<string>("")

//    /* ================= FORM ================= */

//    const [title, setTitle] = useState("")
//    const [startTime, setStartTime] = useState("")
//    const [endTime, setEndTime] = useState("")
//    const [meetingLink, setMeetingLink] = useState("")

//    /* ================= INIT ================= */

//    useEffect(() => {
//        fetchMeetings()
//        fetchUsers()

//        // 🔥 ROLE FIX
//        const role = localStorage.getItem("role")
//        console.log("USER ROLE:", role)

//        if (role) setUserRole(role)
//    }, [])

//    /* ================= FETCH ================= */

//    const fetchMeetings = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchat-backend.onrender.com//api/meeting/my-meetings", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()
//            const now = new Date()

//            setUpcomingMeetings(data.filter((m: any) => new Date(m.startTime) > now))
//            setPastMeetings(data.filter((m: any) => new Date(m.endTime) < now))

//        } finally {
//            setLoading(false)
//        }
//    }

//    const fetchUsers = async () => {
//        const token = localStorage.getItem("token")

//        const res = await fetch("https://calchat-backend.onrender.com//api/meeting/users", {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()
//        setUsers(data)
//    }

//    /* ================= CREATE ================= */

//    const createMeeting = async () => {
//        const token = localStorage.getItem("token")

//        const res = await fetch("https://calchat-backend.onrender.com//api/meeting/create", {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`
//            },
//            body: JSON.stringify({
//                title,
//                startTime: new Date(startTime).toISOString(),
//                endTime: new Date(endTime).toISOString(),
//                meetingLink: meetingLink || "https://meet.google.com/new",
//                participantIds: selectedUsers
//            })
//        })

//        if (!res.ok) {
//            alert(await res.text())
//            return
//        }

//        // reset
//        setOpenModal(false)
//        setTitle("")
//        setStartTime("")
//        setEndTime("")
//        setMeetingLink("")
//        setSelectedUsers([])

//        fetchMeetings()
//    }

//    /* ================= FORMAT ================= */

//    const formatDate = (d: string) =>
//        new Date(d).toLocaleDateString()

//    const formatTime = (s: string, e: string) =>
//        `${new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`

//    const todayCount = upcomingMeetings.filter(
//        m => new Date(m.startTime).toDateString() === new Date().toDateString()
//    ).length

//    if (loading) return <p className="p-4 text-center">Loading...</p>

//    return (
//        <div className="flex flex-col gap-6">

//            {/* ================= HEADER ================= */}

//            <div className="flex items-center justify-between">
//                <div>
//                    <h2 className="text-xl font-bold">Meetings</h2>
//                    <p className="text-sm text-muted-foreground">
//                        Manage and schedule your meetings
//                    </p>
//                </div>

//                {/* ✅ ONLY HR */}
//                {userRole?.toLowerCase() === "hr" && (
//                    <Button onClick={() => setOpenModal(true)} className="gap-2">
//                        <Plus className="h-4 w-4" /> Schedule
//                    </Button>
//                )}
//            </div>

//            {/* ================= STATS ================= */}

//            <div className="grid gap-4 sm:grid-cols-3">
//                {[
//                    { label: "Today", value: todayCount },
//                    { label: "Upcoming", value: upcomingMeetings.length },
//                    { label: "Past", value: pastMeetings.length }
//                ].map((s, i) => (
//                    <div key={i} className="rounded-xl border bg-muted/40 p-4 text-center hover:shadow-md transition">
//                        <p className="text-sm text-muted-foreground">{s.label}</p>
//                        <p className="text-2xl font-bold">{s.value}</p>
//                    </div>
//                ))}
//            </div>

//            {/* ================= TABS ================= */}

//            <Tabs defaultValue="upcoming">

//                <TabsList>
//                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
//                    <TabsTrigger value="past">Past</TabsTrigger>
//                </TabsList>

//                {/* ================= UPCOMING ================= */}

//                <TabsContent value="upcoming" className="mt-4">
//                    <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">

//                        {upcomingMeetings.map((m) => (
//                            <div key={m.id} className="rounded-2xl border bg-background p-5 hover:shadow-xl transition">

//                                <div className="flex justify-between items-center">

//                                    <div className="flex gap-4 items-center">

//                                        <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-center">
//                                            <p className="text-sm font-semibold">
//                                                {new Date(m.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                                            </p>
//                                            <p className="text-xs">
//                                                {formatDate(m.startTime)}
//                                            </p>
//                                        </div>

//                                        <div>
//                                            <div className="flex items-center gap-2">
//                                                <h3 className="font-semibold">{m.title}</h3>
//                                                <Badge variant="secondary">Live</Badge>
//                                            </div>

//                                            <p className="text-xs text-muted-foreground mt-1">
//                                                {formatTime(m.startTime, m.endTime)}
//                                            </p>
//                                        </div>

//                                    </div>

//                                    <Button
//                                        size="sm"
//                                        variant="outline"
//                                        onClick={() => window.open(m.meetingLink, "_blank")}
//                                    >
//                                        <Video className="h-4 w-4 mr-1" />
//                                        Join
//                                    </Button>

//                                </div>

//                            </div>
//                        ))}

//                    </div>
//                </TabsContent>

//                {/* ================= PAST ================= */}

//                <TabsContent value="past" className="mt-4">
//                    <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">

//                        {pastMeetings.map((m) => (
//                            <div key={m.id} className="rounded-xl border p-5 opacity-70">
//                                <h3 className="font-semibold">{m.title}</h3>

//                                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
//                                    <span>{formatDate(m.startTime)}</span>
//                                    <span>{formatTime(m.startTime, m.endTime)}</span>
//                                </div>
//                            </div>
//                        ))}

//                    </div>
//                </TabsContent>

//            </Tabs>

//            {/* ================= MODAL ================= */}

//            <Dialog open={openModal} onOpenChange={setOpenModal}>
//                <DialogContent className="rounded-2xl">

//                    <DialogHeader>
//                        <DialogTitle>Schedule New Meeting</DialogTitle>
//                        <DialogDescription>
//                            Fill all details properly
//                        </DialogDescription>
//                    </DialogHeader>

//                    <div className="space-y-4">

//                        <div>
//                            <Label>Meeting Title</Label>
//                            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
//                        </div>

//                        <div className="grid grid-cols-2 gap-4">
//                            <div>
//                                <Label>Start Time</Label>
//                                <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
//                            </div>
//                            <div>
//                                <Label>End Time</Label>
//                                <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
//                            </div>
//                        </div>

//                        <div>
//                            <Label>Meeting Link</Label>
//                            <Input value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />
//                        </div>

//                        <div>
//                            <Label>Participants</Label>
//                            <div className="max-h-32 overflow-y-auto border rounded-lg p-2 mt-2">
//                                {users.map(u => (
//                                    <label key={u.id} className="flex items-center gap-2 text-sm py-1">
//                                        <input
//                                            type="checkbox"
//                                            onChange={(e) => {
//                                                if (e.target.checked)
//                                                    setSelectedUsers([...selectedUsers, u.id])
//                                                else
//                                                    setSelectedUsers(selectedUsers.filter(id => id !== u.id))
//                                            }}
//                                        />
//                                        {u.fullName}
//                                    </label>
//                                ))}
//                            </div>
//                        </div>

//                        <Button className="w-full" onClick={createMeeting}>
//                            Create Meeting
//                        </Button>

//                    </div>

//                </DialogContent>
//            </Dialog>

//        </div>
//    )
//}


//"use client"

//import { useEffect, useState } from "react"
//import { Video, Plus } from "lucide-react"

//import { Button } from "@/components/ui/button"
//import { Badge } from "@/components/ui/badge"
//import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle,
//    DialogDescription
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"

//export function MeetingsView() {

//    const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([])
//    const [pastMeetings, setPastMeetings] = useState<any[]>([])
//    const [users, setUsers] = useState<any[]>([])
//    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
//    const [loading, setLoading] = useState(true)
//    const [openModal, setOpenModal] = useState(false)
//    const [userRole, setUserRole] = useState<string>("")

//    const [title, setTitle] = useState("")
//    const [startTime, setStartTime] = useState("")
//    const [endTime, setEndTime] = useState("")
//    const [meetingLink, setMeetingLink] = useState("")

//    useEffect(() => {
//        fetchMeetings()
//        fetchUsers()

//        const role = localStorage.getItem("role")
//        if (role) setUserRole(role)
//    }, [])

//    const fetchMeetings = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchat-backend.onrender.com//api/meeting/my-meetings", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()
//            const now = new Date()

//            setUpcomingMeetings(data.filter((m: any) => new Date(m.startTime) > now))
//            setPastMeetings(data.filter((m: any) => new Date(m.endTime) < now))

//        } finally {
//            setLoading(false)
//        }
//    }

//    const fetchUsers = async () => {
//        const token = localStorage.getItem("token")

//        const res = await fetch("https://calchat-backend.onrender.com//api/meeting/users", {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        // ✅ FINAL FILTER FIX
//        const validUsers = data.filter(
//            (u: any) =>
//                u &&
//                u.id &&
//                u.fullName &&
//                u.fullName.trim() !== ""
//        )

//        setUsers(validUsers)
//    }

//    const createMeeting = async () => {
//        const token = localStorage.getItem("token")

//        const res = await fetch("https://calchat-backend.onrender.com//api/meeting/create", {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`
//            },
//            body: JSON.stringify({
//                title,
//                startTime: new Date(startTime).toISOString(),
//                endTime: new Date(endTime).toISOString(),
//                meetingLink: meetingLink || "https://meet.google.com/new",
//                participantIds: selectedUsers
//            })
//        })

//        if (!res.ok) {
//            alert(await res.text())
//            return
//        }

//        setOpenModal(false)
//        setTitle("")
//        setStartTime("")
//        setEndTime("")
//        setMeetingLink("")
//        setSelectedUsers([])

//        fetchMeetings()
//    }

//    const formatDate = (d: string) =>
//        new Date(d).toLocaleDateString()

//    const formatTime = (s: string, e: string) =>
//        `${new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`

//    if (loading) return <p className="p-4 text-center">Loading...</p>

//    return (
//        <div className="flex flex-col gap-6">

//            <div className="flex items-center justify-between">
//                <h2 className="text-xl font-bold">Meetings</h2>

//                {userRole?.toLowerCase() === "hr" && (
//                    <Button onClick={() => setOpenModal(true)}>
//                        <Plus className="h-4 w-4 mr-1" /> Schedule
//                    </Button>
//                )}
//            </div>

//            <Dialog open={openModal} onOpenChange={setOpenModal}>
//                <DialogContent>

//                    <DialogHeader>
//                        <DialogTitle>Schedule New Meeting</DialogTitle>
//                        <DialogDescription>
//                            Fill all details properly
//                        </DialogDescription>
//                    </DialogHeader>

//                    <div className="space-y-4">

//                        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

//                        <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
//                        <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

//                        <Input placeholder="Meeting Link" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />

//                        {/* ✅ FINAL PARTICIPANTS FIX */}
//                        <div>
//                            <Label>Participants</Label>

//                            <div className="max-h-40 overflow-y-auto border rounded p-2">

//                                {users.length === 0 && (
//                                    <p>No users</p>
//                                )}

//                                {users.map(u => {
//                                    if (!u.id || !u.fullName || u.fullName.trim() === "") return null

//                                    return (
//                                        <label key={u.id} className="flex items-center gap-2 py-1">
//                                            <input
//                                                type="checkbox"
//                                                checked={selectedUsers.includes(u.id)}
//                                                onChange={(e) => {
//                                                    if (e.target.checked) {
//                                                        setSelectedUsers(prev => [...prev, u.id])
//                                                    } else {
//                                                        setSelectedUsers(prev => prev.filter(id => id !== u.id))
//                                                    }
//                                                }}
//                                            />
//                                            {u.fullName}
//                                        </label>
//                                    )
//                                })}

//                            </div>
//                        </div>

//                        <Button onClick={createMeeting}>
//                            Create Meeting
//                        </Button>

//                    </div>

//                </DialogContent>
//            </Dialog>

//        </div>
//    )
//}




//"use client"

//import { useEffect, useState } from "react"
//import { Video, Plus } from "lucide-react"

//import { Button } from "@/components/ui/button"
//import { Badge } from "@/components/ui/badge"
//import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle,
//    DialogDescription
//} from "@/components/ui/dialog"

//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"

//export function MeetingsView() {

//    /* ================= STATE ================= */

//    const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([])
//    const [pastMeetings, setPastMeetings] = useState<any[]>([])
//    const [users, setUsers] = useState<any[]>([])
//    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
//    const [loading, setLoading] = useState(true)
//    const [openModal, setOpenModal] = useState(false)
//    const [userRole, setUserRole] = useState<string>("")

//    /* ================= FORM ================= */

//    const [title, setTitle] = useState("")
//    const [startTime, setStartTime] = useState("")
//    const [endTime, setEndTime] = useState("")
//    const [meetingLink, setMeetingLink] = useState("")

//    /* ================= INIT ================= */

//    useEffect(() => {
//        fetchMeetings()
//        fetchUsers()

//        const role = localStorage.getItem("role")
//        if (role) setUserRole(role)
//    }, [])

//    /* ================= FETCH ================= */

//    const fetchMeetings = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://calchat-backend.onrender.com//api/meeting/my-meetings", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            const data = await res.json()
//            const now = new Date()

//            setUpcomingMeetings(data.filter((m: any) => new Date(m.startTime) > now))
//            setPastMeetings(data.filter((m: any) => new Date(m.endTime) < now))

//        } finally {
//            setLoading(false)
//        }
//    }

//    const fetchUsers = async () => {
//        const token = localStorage.getItem("token")

//        const res = await fetch("https://calchat-backend.onrender.com//api/meeting/users", {
//            headers: { Authorization: `Bearer ${token}` }
//        })

//        const data = await res.json()

//        // ✅ FINAL STRONG FILTER (BUG FIX)
//        const validUsers = data.filter(
//            (u: any) =>
//                u &&
//                u.id &&
//                u.fullName &&
//                u.fullName.trim() !== ""
//        )

//        setUsers(validUsers)
//    }

//    /* ================= CREATE ================= */

//    const createMeeting = async () => {
//        const token = localStorage.getItem("token")

//        const res = await fetch("https://calchat-backend.onrender.com//api/meeting/create", {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${token}`
//            },
//            body: JSON.stringify({
//                title,
//                startTime: new Date(startTime).toISOString(),
//                endTime: new Date(endTime).toISOString(),
//                meetingLink: meetingLink || "https://meet.google.com/new",
//                participantIds: selectedUsers
//            })
//        })

//        if (!res.ok) {
//            alert(await res.text())
//            return
//        }

//        // reset
//        setOpenModal(false)
//        setTitle("")
//        setStartTime("")
//        setEndTime("")
//        setMeetingLink("")
//        setSelectedUsers([])

//        fetchMeetings()
//    }

//    /* ================= FORMAT ================= */

//    const formatDate = (d: string) =>
//        new Date(d).toLocaleDateString()

//    const formatTime = (s: string, e: string) =>
//        `${new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`

//    const todayCount = upcomingMeetings.filter(
//        m => new Date(m.startTime).toDateString() === new Date().toDateString()
//    ).length

//    if (loading) return <p className="p-4 text-center">Loading...</p>

//    return (
//        <div className="flex flex-col gap-6">

//            {/* ================= HEADER ================= */}

//            <div className="flex items-center justify-between">
//                <div>
//                    <h2 className="text-xl font-bold">Meetings</h2>
//                    <p className="text-sm text-muted-foreground">
//                        Manage and schedule your meetings
//                    </p>
//                </div>

//                {userRole?.toLowerCase() === "hr" && (
//                    <Button onClick={() => setOpenModal(true)} className="gap-2">
//                        <Plus className="h-4 w-4" /> Schedule
//                    </Button>
//                )}
//            </div>

//            {/* ================= STATS ================= */}

//            <div className="grid gap-4 sm:grid-cols-3">
//                {[
//                    { label: "Today", value: todayCount },
//                    { label: "Upcoming", value: upcomingMeetings.length },
//                    { label: "Past", value: pastMeetings.length }
//                ].map((s, i) => (
//                    <div key={i} className="rounded-xl border bg-muted/40 p-4 text-center">
//                        <p className="text-sm text-muted-foreground">{s.label}</p>
//                        <p className="text-2xl font-bold">{s.value}</p>
//                    </div>
//                ))}
//            </div>

//            {/* ================= TABS ================= */}

//            <Tabs defaultValue="upcoming">

//                <TabsList>
//                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
//                    <TabsTrigger value="past">Past</TabsTrigger>
//                </TabsList>

//                {/* ================= UPCOMING ================= */}

//                <TabsContent value="upcoming" className="mt-4">
//                    <div className="flex flex-col gap-4">

//                        {upcomingMeetings.map((m) => (
//                            <div key={m.id} className="rounded-xl border p-4 flex justify-between items-center">

//                                <div>
//                                    <h3 className="font-semibold">{m.title}</h3>
//                                    <p className="text-sm text-muted-foreground">
//                                        {formatDate(m.startTime)} | {formatTime(m.startTime, m.endTime)}
//                                    </p>
//                                </div>

//                                <Button size="sm" onClick={() => window.open(m.meetingLink, "_blank")}>
//                                    <Video className="h-4 w-4 mr-1" /> Join
//                                </Button>

//                            </div>
//                        ))}

//                    </div>
//                </TabsContent>

//                {/* ================= PAST ================= */}

//                <TabsContent value="past" className="mt-4">
//                    <div className="flex flex-col gap-4">

//                        {pastMeetings.map((m) => (
//                            <div key={m.id} className="rounded-xl border p-4 opacity-70">
//                                <h3>{m.title}</h3>
//                                <p className="text-sm text-muted-foreground">
//                                    {formatDate(m.startTime)} | {formatTime(m.startTime, m.endTime)}
//                                </p>
//                            </div>
//                        ))}

//                    </div>
//                </TabsContent>

//            </Tabs>

//            {/* ================= MODAL ================= */}

        //    <Dialog open={openModal} onOpenChange={setOpenModal}>
        //        <DialogContent
        //            className="max-w-md p-0 overflow-hidden rounded-2xl border border-white/10
        //bg-white dark:bg-[#020617] text-gray-900 dark:text-white shadow-xl"
        //        >

        //            {/* HEADER */}
        //            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-white">
        //                <DialogTitle className="text-base font-semibold flex items-center gap-2">
        //                    📅 Schedule Meeting
        //                </DialogTitle>
        //                <DialogDescription className="text-xs text-blue-100 mt-1">
        //                    Plan meetings quickly
        //                </DialogDescription>
        //            </div>

        //            {/* BODY */}
        //            <div className="p-4 space-y-4">

        //                {/* TITLE */}
        //                <div className="space-y-1">
        //                    <Label className="text-xs">Meeting Title</Label>
        //                    <Input
        //                        placeholder="Sprint Planning"
        //                        value={title}
        //                        onChange={(e) => setTitle(e.target.value)}
        //                        className="h-9 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg"
        //                    />
        //                </div>

        //                {/* TIME */}
        //                <div className="grid grid-cols-2 gap-2">
        //                    <div className="space-y-1">
        //                        <Label className="text-xs">Start</Label>
        //                        <Input
        //                            type="datetime-local"
        //                            value={startTime}
        //                            onChange={(e) => setStartTime(e.target.value)}
        //                            className="h-9 text-xs bg-gray-50 dark:bg-white/5"
        //                        />
        //                    </div>

        //                    <div className="space-y-1">
        //                        <Label className="text-xs">End</Label>
        //                        <Input
        //                            type="datetime-local"
        //                            value={endTime}
        //                            onChange={(e) => setEndTime(e.target.value)}
        //                            className="h-9 text-xs bg-gray-50 dark:bg-white/5"
        //                        />
        //                    </div>
        //                </div>

        //                {/* LINK */}
        //                <div className="space-y-1">
        //                    <Label className="text-xs">Meeting Link</Label>
        //                    <Input
        //                        placeholder="meet.google.com/..."
        //                        value={meetingLink}
        //                        onChange={(e) => setMeetingLink(e.target.value)}
        //                        className="h-9 text-sm bg-gray-50 dark:bg-white/5"
        //                    />
        //                </div>

        //                {/* PARTICIPANTS */}
        //                <div className="space-y-2">
        //                    <Label className="text-xs">Participants</Label>

        //                    {/* CHIPS */}
        //                    <div className="flex flex-wrap gap-1">
        //                        {selectedUsers.map(id => {
        //                            const user = users.find(u => u.id === id)
        //                            if (!user) return null

        //                            return (
        //                                <div
        //                                    key={id}
        //                                    className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-[10px]"
        //                                >
        //                                    {user.fullName}
        //                                    <button
        //                                        onClick={() =>
        //                                            setSelectedUsers(prev => prev.filter(uid => uid !== id))
        //                                        }
        //                                        className="text-red-400"
        //                                    >
        //                                        ✕
        //                                    </button>
        //                                </div>
        //                            )
        //                        })}
        //                    </div>

        //                    {/* USER LIST (SMALL HEIGHT) */}
        //                    <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-1 space-y-1">

        //                        {users.map(u => {
        //                            const isSelected = selectedUsers.includes(u.id)

        //                            return (
        //                                <label
        //                                    key={u.id}
        //                                    className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer text-xs
        //                        ${isSelected
        //                                            ? "bg-blue-500/20"
        //                                            : "hover:bg-gray-200 dark:hover:bg-white/10"
        //                                        }`}
        //                                >
        //                                    <div className="flex items-center gap-2">
        //                                        <input
        //                                            type="checkbox"
        //                                            checked={isSelected}
        //                                            onChange={(e) => {
        //                                                if (e.target.checked) {
        //                                                    setSelectedUsers(prev => [...prev, u.id])
        //                                                } else {
        //                                                    setSelectedUsers(prev => prev.filter(id => id !== u.id))
        //                                                }
        //                                            }}
        //                                            className="accent-blue-500"
        //                                        />
        //                                        {u.fullName}
        //                                    </div>

        //                                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
        //                                        {u.fullName.charAt(0)}
        //                                    </div>
        //                                </label>
        //                            )
        //                        })}
        //                    </div>
        //                </div>

        //                {/* BUTTON */}
        //                <Button
        //                    onClick={createMeeting}
        //                    className="w-full h-10 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500"
        //                >
        //                    Create Meeting
        //                </Button>

        //            </div>
        //        </DialogContent>
        //    </Dialog>

//        </div>
//    )
//}


"use client"

import { useEffect, useState } from "react"
import { Video, Plus, Clock, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function MeetingsView() {

    const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([])
    const [pastMeetings, setPastMeetings] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [openModal, setOpenModal] = useState(false)
    const [userRole, setUserRole] = useState("")

    const [title, setTitle] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [meetingLink, setMeetingLink] = useState("")
    const getParticipantCount = (m: any) => {
        if (m.participants) return m.participants.length
        if (m.participantIds) return m.participantIds.length
        if (m.users) return m.users.length
        return 0
    }


    useEffect(() => {
        const role = localStorage.getItem("role") || ""
        setUserRole(role)

        fetchMeetings()

        // ✅ ONLY HR CALL USERS API
        if (role === "hr") {
            fetchUsers()
        }

    }, [])

    const fetchMeetings = async () => {
        const token = localStorage.getItem("token")

        const res = await fetch("https://calchat-backend.onrender.com//api/meeting/my-meetings", {
            headers: { Authorization: `Bearer ${token}` }
        })

        const data = await res.json()
        console.log("MEETINGS DATA 👉", data)
        const now = new Date()

        setUpcomingMeetings(data.filter((m: any) => new Date(m.startTime) > now))
        setPastMeetings(data.filter((m: any) => new Date(m.endTime) < now))
        setLoading(false)
    }

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch("https://calchat-backend.onrender.com//api/meeting/users", {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (!res.ok) return   // ✅ avoid crash

            const data = await res.json()
            setUsers(data.filter((u: any) => u?.id && u?.fullName))

        } catch {
            setUsers([])
        }
    }

    const createMeeting = async () => {
        const token = localStorage.getItem("token")

        await fetch("https://calchat-backend.onrender.com//api/meeting/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
                meetingLink: meetingLink || "https://meet.google.com/new",
                participantIds: selectedUsers
            })
        })

        setOpenModal(false)
        setTitle("")
        setStartTime("")
        setEndTime("")
        setMeetingLink("")
        setSelectedUsers([])

        fetchMeetings()
    }

    const formatDate = (d: string) => new Date(d).toLocaleDateString()

    const formatTime = (s: string, e: string) =>
        `${new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - 
         ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`

    const getDuration = (s: string, e: string) => {
        const diff = (new Date(e).getTime() - new Date(s).getTime()) / 60000
        return `${diff} min`
    }

    const todayCount = upcomingMeetings.filter(
        m => new Date(m.startTime).toDateString() === new Date().toDateString()
    ).length

    if (loading) return <p className="text-center p-6">Loading...</p>

    return (
        <div className="flex flex-col gap-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Meetings</h2>
                    <p className="text-muted-foreground text-sm">
                        Schedule and manage your meetings
                    </p>
                </div>

                {userRole === "hr" && (
                    <Button onClick={() => setOpenModal(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Schedule
                    </Button>
                )}
            </div>

            {/* STATS */}
            <div className="grid sm:grid-cols-3 gap-4">
                {[
                    { label: "Today", value: todayCount },
                    { label: "Upcoming", value: upcomingMeetings.length },
                    { label: "Past", value: pastMeetings.length }
                ].map((s, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border">
                        <p className="text-sm text-muted-foreground">{s.label}</p>
                        <p className="text-2xl font-bold">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* TABS */}
            <Tabs defaultValue="upcoming">

                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>

                {/* UPCOMING */}
                <TabsContent value="upcoming" className="mt-4 space-y-4">

                    {upcomingMeetings.length === 0 && (
                        <div className="text-center text-muted-foreground py-10">
                            No upcoming meetings 🚀
                        </div>
                    )}

                    {upcomingMeetings.map((m) => (
                        <div
                            key={m.id}
                            className="p-4 rounded-xl border hover:shadow-lg transition flex justify-between items-center"
                        >

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{m.title}</h3>
                                    <Badge>Upcoming</Badge>
                                </div>

                                <p className="text-sm text-muted-foreground">
                                    {formatDate(m.startTime)} • {formatTime(m.startTime, m.endTime)}
                                </p>

                                <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {getDuration(m.startTime, m.endTime)}
                                    </span>

                                    <span className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {getParticipantCount(m)} people
                                    </span>
                                </div>
                            </div>

                            <Button size="sm" onClick={() => window.open(m.meetingLink, "_blank")}>
                                <Video className="h-4 w-4 mr-1" /> Join
                            </Button>

                        </div>
                    ))}
                </TabsContent>

                {/* PAST */}
                <TabsContent value="past" className="mt-4 space-y-4">

                    {pastMeetings.length === 0 && (
                        <div className="text-center text-muted-foreground py-10">
                            No past meetings
                        </div>
                    )}

                    {pastMeetings.map((m) => (
                        <div key={m.id} className="p-4 rounded-xl border opacity-70">

                            <div className="flex items-center gap-2">
                                <h3>{m.title}</h3>
                                <Badge variant="secondary">Completed</Badge>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                {formatDate(m.startTime)} • {formatTime(m.startTime, m.endTime)}
                            </p>

                        </div>
                    ))}
                </TabsContent>

            </Tabs>


     
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent
                    className="max-w-md p-0 overflow-hidden rounded-2xl border border-white/10
        bg-white dark:bg-[#020617] text-gray-900 dark:text-white shadow-xl"
                >

                    {/* HEADER */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-white">
                        <DialogTitle className="text-base font-semibold flex items-center gap-2">
                            📅 Schedule Meeting
                        </DialogTitle>
                        <DialogDescription className="text-xs text-blue-100 mt-1">
                            Plan meetings quickly
                        </DialogDescription>
                    </div>

                    {/* BODY */}
                    <div className="p-4 space-y-4">

                        {/* TITLE */}
                        <div className="space-y-1">
                            <Label className="text-xs">Meeting Title</Label>
                            <Input
                                placeholder="Sprint Planning"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-9 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg"
                            />
                        </div>

                        {/* TIME */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs">Start</Label>
                                <Input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="h-9 text-xs bg-gray-50 dark:bg-white/5"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">End</Label>
                                <Input
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="h-9 text-xs bg-gray-50 dark:bg-white/5"
                                />
                            </div>
                        </div>

                        {/* LINK */}
                        <div className="space-y-1">
                            <Label className="text-xs">Meeting Link</Label>
                            <Input
                                placeholder="meet.google.com/..."
                                value={meetingLink}
                                onChange={(e) => setMeetingLink(e.target.value)}
                                className="h-9 text-sm bg-gray-50 dark:bg-white/5"
                            />
                        </div>

                        {/* PARTICIPANTS */}
                        <div className="space-y-2">
                            <Label className="text-xs">Participants</Label>

                            {/* CHIPS */}
                            <div className="flex flex-wrap gap-1">
                                {selectedUsers.map(id => {
                                    const user = users.find(u => u.id === id)
                                    if (!user) return null

                                    return (
                                        <div
                                            key={id}
                                            className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-[10px]"
                                        >
                                            {user.fullName}
                                            <button
                                                onClick={() =>
                                                    setSelectedUsers(prev => prev.filter(uid => uid !== id))
                                                }
                                                className="text-red-400"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* USER LIST (SMALL HEIGHT) */}
                            <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-1 space-y-1">

                                {users.map(u => {
                                    const isSelected = selectedUsers.includes(u.id)

                                    return (
                                        <label
                                            key={u.id}
                                            className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer text-xs
                                ${isSelected
                                                    ? "bg-blue-500/20"
                                                    : "hover:bg-gray-200 dark:hover:bg-white/10"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedUsers(prev => [...prev, u.id])
                                                        } else {
                                                            setSelectedUsers(prev => prev.filter(id => id !== u.id))
                                                        }
                                                    }}
                                                    className="accent-blue-500"
                                                />
                                                {u.fullName}
                                            </div>

                                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                                                {u.fullName.charAt(0)}
                                            </div>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>

                        {/* BUTTON */}
                        <Button
                            onClick={createMeeting}
                            className="w-full h-10 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500"
                        >
                            Create Meeting
                        </Button>

                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}