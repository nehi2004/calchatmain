


//"use client"

//import { useEffect, useState } from "react"
//import { Video, Plus, Clock, Users } from "lucide-react"

//import { Button } from "@/components/ui/button"
//import { Badge } from "@/components/ui/badge"
//import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

//import {
//    Dialog,
//    DialogContent,
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
//    const [userRole, setUserRole] = useState("")

//    const [title, setTitle] = useState("")
//    const [startTime, setStartTime] = useState("")
//    const [endTime, setEndTime] = useState("")
//    const [meetingLink, setMeetingLink] = useState("")
//    const [selectedDate, setSelectedDate] = useState("")
//    const getParticipantCount = (m: any) => {
//        if (m.participants) return m.participants.length
//        if (m.participantIds) return m.participantIds.length
//        if (m.users) return m.users.length
//        return 0
//    }

//    const isSameDate = (date1: string, selected: string) => {
//        if (!selected) return true

//        const d1 = new Date(date1)
//        const d2 = new Date(selected)

//        return d1.toDateString() === d2.toDateString()
//    }

//    const filteredUpcoming = upcomingMeetings.filter(m =>
//        isSameDate(m.startTime, selectedDate)
//    )

//    const filteredPast = pastMeetings.filter(m =>
//        isSameDate(m.startTime, selectedDate)
//    )
//    useEffect(() => {
//        const role = localStorage.getItem("role") || ""
//        setUserRole(role)

//        fetchMeetings()

//        // ✅ ONLY HR CALL USERS API
//        if (role === "hr") {
//            fetchUsers()
//        }

//    }, [])

//    const selectedDateCount = selectedDate
//        ? upcomingMeetings.filter(m =>
//            isSameDate(m.startTime, selectedDate)
//        ).length
//        : 0

//    const fetchMeetings = async () => {
//        const token = localStorage.getItem("token")
//        const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/meeting/create", {
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

//        const data = await res.json()

//        console.log("CREATE RESPONSE 👉", data)

//        if (!res.ok) {
//            alert(data.error || data.inner || "Something failed")
//            return
//        }
//        const now = new Date(Date.now() - 60000) // 1 min buffer
//        setUpcomingMeetings(
//            data
//                .filter((m: any) => new Date(m.startTime) > now)
//                .sort((a: any, b: any) =>
//                    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
//                )
//        )
//        setPastMeetings(
//            data
//                .filter((m: any) => new Date(m.endTime) < now)
//                .sort((a: any, b: any) =>
//                    new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
//                )
//        )
//        setLoading(false)
//    }

//    const fetchUsers = async () => {
//        try {
//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/meeting/users", {
//                headers: { Authorization: `Bearer ${token}` }
//            })

//            if (!res.ok) return   // ✅ avoid crash

//            const data = await res.json()
//            setUsers(data.filter((u: any) => u?.id && u?.fullName))

//        } catch {
//            setUsers([])
//        }
//    }
//const createMeeting = async () => {
//    if (!title || !startTime || !endTime) {
//        alert("Please fill all fields")
//        return
//    }

//    if (new Date(startTime) >= new Date(endTime)) {
//        alert("End time must be after start time")
//        return
//    }

//    const token = localStorage.getItem("token")

//    await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/meeting/create", {
//        method: "POST",
//        headers: {
//            "Content-Type": "application/json",
//            Authorization: `Bearer ${token}`
//        },
//        body: JSON.stringify({
//            title,
//            startTime: new Date(startTime).toISOString(),   // ✅ IMPORTANT
//            endTime: new Date(endTime).toISOString(),       // ✅ IMPORTANT
//            meetingLink: meetingLink || "https://meet.google.com/new",
//            participantIds: selectedUsers
//        })
//    })

//    setOpenModal(false)
//    setTitle("")
//    setStartTime("")
//    setEndTime("")
//    setMeetingLink("")
//    setSelectedUsers([])

//    fetchMeetings()
//}

//    const formatDate = (d: string) => new Date(d).toLocaleDateString()

//    const formatTime = (s: string, e: string) =>
//        `${new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - 
//         ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`

//    const getDuration = (s: string, e: string) => {
//        const diff = (new Date(e).getTime() - new Date(s).getTime()) / 60000
//        return `${diff} min`
//    }

//    const todayCount = upcomingMeetings.filter(
//        m => new Date(m.startTime).toDateString() === new Date().toDateString()
//    ).length

//    if (loading) return <p className="text-center p-6">Loading...</p>

//    return (
//        <div className="flex flex-col gap-6">

//            {/* HEADER */}
//            <div className="flex justify-between items-center">
//                <div>
//                    <h2 className="text-2xl font-bold">Meetings</h2>
//                    <p className="text-muted-foreground text-sm">
//                        Schedule and manage your meetings
//                    </p>
//                </div>

//                {userRole === "hr" && (
//                    <Button onClick={() => setOpenModal(true)}>
//                        <Plus className="h-4 w-4 mr-2" /> Schedule
//                    </Button>
//                )}
//            </div>

//            <div className="flex items-center gap-3">
//                <Input
//                    type="date"
//                    value={selectedDate}
//                    onChange={(e) => setSelectedDate(e.target.value)}
//                    className="w-[200px]"
//                />

//                {selectedDate && (
//                    <Button variant="outline" onClick={() => setSelectedDate("")}>
//                        Clear
//                    </Button>
//                )}
//            </div>

//            {/* STATS */}
//            <div className="grid sm:grid-cols-3 gap-4">
//                {[
//                    { label: "Today", value: todayCount },
//                    { label: "Upcoming", value: upcomingMeetings.length },
//                    { label: "Past", value: pastMeetings.length }
//                ].map((s, i) => (
//                    <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border">
//                        <p className="text-sm text-muted-foreground">{s.label}</p>
//                        <p className="text-2xl font-bold">{s.value}</p>
//                    </div>
//                ))}
//            </div>

//            {/*{selectedDate && (*/}
//            {/*    <div className="p-3 rounded-lg bg-blue-500/10 border text-sm">*/}
//            {/*        📅 {selectedDate} → {selectedDateCount} meetings*/}
//            {/*    </div>*/}
//            {/*)}*/}
//            {selectedDate && (
//                <div className="flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r from-blue-500/10 to-indigo-500/10 shadow-sm">

//                    <div className="flex items-center gap-3">
//                        <div className="p-2 rounded-lg bg-blue-500 text-white">
//                            📅
//                        </div>

//                        <div>
//                            <p className="text-xs text-muted-foreground">
//                                Selected Date
//                            </p>
//                            <p className="text-sm font-semibold">
//                                {new Date(selectedDate).toDateString()}
//                            </p>
//                        </div>
//                    </div>

//                    <div className="text-right">
//                        <p className="text-xs text-muted-foreground">
//                            Meetings
//                        </p>
//                        <p className="text-xl font-bold text-blue-600">
//                            {selectedDateCount}
//                        </p>
//                    </div>

//                </div>
//            )}
//            {/* TABS */}
//            <Tabs defaultValue="upcoming">

//                <TabsList>
//                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
//                    <TabsTrigger value="past">Past</TabsTrigger>
//                </TabsList>

//                {/* UPCOMING */}
//                <TabsContent value="upcoming" className="mt-4 space-y-4">

//                    {filteredUpcoming.length === 0 && (
//                        <div className="text-center text-muted-foreground py-10">
//                            No upcoming meetings 🚀
//                        </div>
//                    )}

//                    {filteredUpcoming.map((m) => (
//                        <div
//                            key={m.id}
//                            className="p-4 rounded-xl border hover:shadow-lg transition flex justify-between items-center"
//                        >

//                            <div className="space-y-1">
//                                <div className="flex items-center gap-2">
//                                    <h3 className="font-semibold">{m.title}</h3>
//                                    <Badge>Upcoming</Badge>
//                                </div>

//                                <p className="text-sm text-muted-foreground">
//                                    {formatDate(m.startTime)} • {formatTime(m.startTime, m.endTime)}
//                                </p>

//                                <div className="flex gap-4 text-xs text-muted-foreground mt-1">
//                                    <span className="flex items-center gap-1">
//                                        <Clock className="h-3 w-3" />
//                                        {getDuration(m.startTime, m.endTime)}
//                                    </span>

//                                    <span className="flex items-center gap-1">
//                                        <Users className="h-3 w-3" />
//                                        {getParticipantCount(m)} people
//                                    </span>
//                                </div>
//                            </div>

//                            <Button size="sm" onClick={() => window.open(m.meetingLink, "_blank")}>
//                                <Video className="h-4 w-4 mr-1" /> Join
//                            </Button>

//                        </div>
//                    ))}
//                </TabsContent>

//                {/* PAST */}
//                <TabsContent value="past" className="mt-4 space-y-4">

//                    {filteredPast.length === 0 && (
//                        <div className="text-center text-muted-foreground py-10">
//                            No past meetings
//                        </div>
//                    )}

//                    {filteredPast.map((m) => (
//                        <div key={m.id} className="p-4 rounded-xl border">
//                            <div className="flex items-center justify-between">
//                                <div>
//                                    <div className="flex items-center gap-2">
//                                        <h3 className="font-medium">{m.title}</h3>
//                                        <Badge variant="secondary">Completed</Badge>
//                                        {m.hasRecording && (
//                                            <Badge className="bg-green-500/10 text-green-600 
//                                         border-green-500/20">
//                                                Recording Ready
//                                            </Badge>
//                                        )}
//                                    </div>
//                                    <p className="text-sm text-muted-foreground mt-1">
//                                        {formatDate(m.startTime)} • {formatTime(m.startTime, m.endTime)}
//                                    </p>
//                                    {m.summary && (
//                                        <p className="text-xs text-muted-foreground mt-2 
//                                  max-w-lg line-clamp-2">
//                                            {(() => {
//                                                try {
//                                                    const s = typeof m.summary === 'string'
//                                                        ? JSON.parse(m.summary) : m.summary
//                                                    return s?.summary || ""
//                                                } catch { return "" }
//                                            })()}
//                                        </p>
//                                    )}
//                                </div>
//                                {m.hasRecording && (
//                                    <Button
//                                        size="sm"
//                                        variant="outline"
//                                        onClick={() => window.location.href = `/meetings/${m.id}`}
//                                    >
//                                        View Details
//                                    </Button>
//                                )}
//                            </div>
//                        </div>
//                    ))}
//                </TabsContent>

//            </Tabs>



//            <Dialog open={openModal} onOpenChange={setOpenModal}>
//                <DialogContent
//                    className="max-w-md p-0 overflow-hidden rounded-2xl border border-white/10
//        bg-white dark:bg-[#020617] text-gray-900 dark:text-white shadow-xl"
//                >

//                    {/* HEADER */}
//                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-white">
//                        <DialogTitle className="text-base font-semibold flex items-center gap-2">
//                            📅 Schedule Meeting
//                        </DialogTitle>
//                        <DialogDescription className="text-xs text-blue-100 mt-1">
//                            Plan meetings quickly
//                        </DialogDescription>
//                    </div>

//                    {/* BODY */}
//                    {/*<div className="p-4 space-y-4">*/}

//                    {/*    */}{/* TITLE */}
//                    {/*    <div className="space-y-1">*/}
//                    {/*        <Label className="text-xs">Meeting Title</Label>*/}
//                    {/*        <Input*/}
//                    {/*            placeholder="Sprint Planning"*/}
//                    {/*            value={title}*/}
//                    {/*            onChange={(e) => setTitle(e.target.value)}*/}
//                    {/*            className="h-9 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg"*/}
//                    {/*        />*/}
//                    {/*    </div>*/}

//                    {/*    */}{/* TIME */}
//                    {/*    <div className="grid grid-cols-2 gap-2">*/}
//                    {/*        <div className="space-y-1">*/}
//                    {/*            <Label className="text-xs">Start</Label>*/}
//                    {/*            <Input*/}
//                    {/*                type="datetime-local"*/}
//                    {/*                value={startTime}*/}
//                    {/*                onChange={(e) => setStartTime(e.target.value)}*/}
//                    {/*                className="h-9 text-xs bg-gray-50 dark:bg-white/5"*/}
//                    {/*            />*/}
//                    {/*        </div>*/}

//                    {/*        <div className="space-y-1">*/}
//                    {/*            <Label className="text-xs">End</Label>*/}
//                    {/*            <Input*/}
//                    {/*                type="datetime-local"*/}
//                    {/*                value={endTime}*/}
//                    {/*                onChange={(e) => setEndTime(e.target.value)}*/}
//                    {/*                className="h-9 text-xs bg-gray-50 dark:bg-white/5"*/}
//                    {/*            />*/}
//                    {/*        </div>*/}
//                    {/*    </div>*/}

//                    {/*    */}{/* LINK */}
//                    {/*    <div className="space-y-1">*/}
//                    {/*        <Label className="text-xs">Meeting Link</Label>*/}
//                    {/*        <Input*/}
//                    {/*            placeholder="meet.google.com/..."*/}
//                    {/*            value={meetingLink}*/}
//                    {/*            onChange={(e) => setMeetingLink(e.target.value)}*/}
//                    {/*            className="h-9 text-sm bg-gray-50 dark:bg-white/5"*/}
//                    {/*        />*/}
//                    {/*    </div>*/}

//                    {/*    */}{/* PARTICIPANTS */}
//                    {/*    <div className="space-y-2">*/}
//                    {/*        <Label className="text-xs">Participants</Label>*/}

//                    {/*        */}{/* CHIPS */}
//                    {/*        <div className="flex flex-wrap gap-1">*/}
//                    {/*            {selectedUsers.map(id => {*/}
//                    {/*                const user = users.find(u => u.id === id)*/}
//                    {/*                if (!user) return null*/}

//                    {/*                return (*/}
//                    {/*                    <div*/}
//                    {/*                        key={id}*/}
//                    {/*                        className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-[10px]"*/}
//                    {/*                    >*/}
//                    {/*                        {user.fullName}*/}
//                    {/*                        <button*/}
//                    {/*                            onClick={() =>*/}
//                    {/*                                setSelectedUsers(prev => prev.filter(uid => uid !== id))*/}
//                    {/*                            }*/}
//                    {/*                            className="text-red-400"*/}
//                    {/*                        >*/}
//                    {/*                            ✕*/}
//                    {/*                        </button>*/}
//                    {/*                    </div>*/}
//                    {/*                )*/}
//                    {/*            })}*/}
//                    {/*        </div>*/}

//                    {/*        */}{/* USER LIST (SMALL HEIGHT) */}
//                    {/*        <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-1 space-y-1">*/}

//                    {/*            {users.map(u => {*/}
//                    {/*                const isSelected = selectedUsers.includes(u.id)*/}

//                    {/*                return (*/}
//                    {/*                    <label*/}
//                    {/*                        key={u.id}*/}
//                    {/*                        className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer text-xs*/}
//                    {/*            ${isSelected*/}
//                    {/*                                ? "bg-blue-500/20"*/}
//                    {/*                                : "hover:bg-gray-200 dark:hover:bg-white/10"*/}
//                    {/*                            }`}*/}
//                    {/*                    >*/}
//                    {/*                        <div className="flex items-center gap-2">*/}
//                    {/*                            <input*/}
//                    {/*                                type="checkbox"*/}
//                    {/*                                checked={isSelected}*/}
//                    {/*                                onChange={(e) => {*/}
//                    {/*                                    if (e.target.checked) {*/}
//                    {/*                                        setSelectedUsers(prev => [...prev, u.id])*/}
//                    {/*                                    } else {*/}
//                    {/*                                        setSelectedUsers(prev => prev.filter(id => id !== u.id))*/}
//                    {/*                                    }*/}
//                    {/*                                }}*/}
//                    {/*                                className="accent-blue-500"*/}
//                    {/*                            />*/}
//                    {/*                            {u.fullName}*/}
//                    {/*                        </div>*/}

//                    {/*                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">*/}
//                    {/*                            {u.fullName.charAt(0)}*/}
//                    {/*                        </div>*/}
//                    {/*                    </label>*/}
//                    {/*                )*/}
//                    {/*            })}*/}
//                    {/*        </div>*/}
//                    {/*    </div>*/}

//                    {/*    */}{/* BUTTON */}
//                    {/*    <Button*/}
//                    {/*        onClick={createMeeting}*/}
//                    {/*        className="w-full h-10 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500"*/}
//                    {/*    >*/}
//                    {/*        Create Meeting*/}
//                    {/*    </Button>*/}

//                    {/*</div>*/}

//                    <div className="p-5 space-y-5">

//                        {/* TITLE */}
//                        <div className="space-y-2">
//                            <Label className="text-xs font-medium">Meeting Title</Label>
//                            <Input
//                                placeholder="Enter meeting title..."
//                                value={title}
//                                onChange={(e) => setTitle(e.target.value)}
//                                className="h-10 text-sm rounded-lg bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500"
//                            />
//                        </div>

//                        <div className="grid grid-cols-2 gap-4">

//                            {/* START */}
//                            <div className="space-y-2">
//                                <Label className="text-xs font-medium">Start Time</Label>

//                                <div className="relative">
//                                    <input
//                                        type="datetime-local"
//                                        value={startTime}
//                                        onChange={(e) => setStartTime(e.target.value)}
//                                        className="w-full h-10 px-3 text-sm rounded-lg border 
//                bg-white dark:bg-white/5 
//                focus:ring-2 focus:ring-blue-500 
//                outline-none"
//                                    />
//                                </div>
//                            </div>

//                            {/* END */}
//                            <div className="space-y-2">
//                                <Label className="text-xs font-medium">End Time</Label>

//                                <div className="relative">
//                                    <input
//                                        type="datetime-local"
//                                        value={endTime}
//                                        onChange={(e) => setEndTime(e.target.value)}
//                                        className="w-full h-10 px-3 text-sm rounded-lg border 
//                bg-white dark:bg-white/5 
//                focus:ring-2 focus:ring-blue-500 
//                outline-none"
//                                    />
//                                </div>
//                            </div>

//                        </div>

//                        {/* LINK */}
//                        <div className="space-y-2">
//                            <Label className="text-xs font-medium">Meeting Link</Label>
//                            <Input
//                                placeholder="https://meet.google.com/..."
//                                value={meetingLink}
//                                onChange={(e) => setMeetingLink(e.target.value)}
//                                className="h-10 text-sm rounded-lg bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500"
//                            />
//                        </div>

//                        {/* PARTICIPANTS */}
//                        <div className="space-y-3">
//                            <Label className="text-xs font-medium">Participants</Label>

//                            {/* SELECTED USERS */}
//                            {selectedUsers.length > 0 && (
//                                <div className="flex flex-wrap gap-2">
//                                    {selectedUsers.map(id => {
//                                        const user = users.find(u => u.id === id)
//                                        if (!user) return null

//                                        return (
//                                            <div
//                                                key={id}
//                                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs"
//                                            >
//                                                {user.fullName}
//                                                <button
//                                                    onClick={() =>
//                                                        setSelectedUsers(prev => prev.filter(uid => uid !== id))
//                                                    }
//                                                    className="text-red-400 hover:text-red-600"
//                                                >
//                                                    ✕
//                                                </button>
//                                            </div>
//                                        )
//                                    })}
//                                </div>
//                            )}

//                            {/* USER LIST */}
//                            <div className="max-h-40 overflow-y-auto rounded-lg border bg-gray-50 dark:bg-white/5 p-2 space-y-1">

//                                {users.map(u => {
//                                    const isSelected = selectedUsers.includes(u.id)

//                                    return (
//                                        <label
//                                            key={u.id}
//                                            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition
//                        ${isSelected
//                                                    ? "bg-blue-500/20"
//                                                    : "hover:bg-gray-200 dark:hover:bg-white/10"
//                                                }`}
//                                        >
//                                            <div className="flex items-center gap-2">
//                                                <input
//                                                    type="checkbox"
//                                                    checked={isSelected}
//                                                    onChange={(e) => {
//                                                        if (e.target.checked) {
//                                                            setSelectedUsers(prev => [...prev, u.id])
//                                                        } else {
//                                                            setSelectedUsers(prev => prev.filter(id => id !== u.id))
//                                                        }
//                                                    }}
//                                                    className="accent-blue-500"
//                                                />
//                                                {u.fullName}
//                                            </div>

//                                            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-500 text-xs text-white">
//                                                {u.fullName.charAt(0)}
//                                            </div>
//                                        </label>
//                                    )
//                                })}
//                            </div>
//                        </div>

//                        {/* BUTTON */}
//                        <Button
//                            onClick={createMeeting}
//                            className="w-full h-11 text-sm rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 transition"
//                        >
//                            Create Meeting 🚀
//                        </Button>

//                    </div>
//                </DialogContent>
//            </Dialog>

//        </div>
//    )
//}


"use client"

import { useEffect, useState } from "react"
import { Video, Plus, Clock, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const API = "https://steadfast-warmth-production-64c8.up.railway.app"

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
    const [selectedDate, setSelectedDate] = useState("")
    const [openSummary, setOpenSummary] = useState(false)
    // ── Detail modal ──
    const [detailOpen, setDetailOpen] = useState(false)
    const [detailData, setDetailData] = useState<any>(null)
    const [detailLoading, setDetailLoading] = useState(false)

    const getParticipantCount = (m: any) => {
        if (m.participants) return m.participants.length
        if (m.participantIds) return m.participantIds.length
        if (m.users) return m.users.length
        return 0
    }

    const isSameDate = (date1: string, selected: string) => {
        if (!selected) return true
        return new Date(date1).toDateString() === new Date(selected).toDateString()
    }

    const filteredUpcoming = upcomingMeetings.filter(m => isSameDate(m.startTime, selectedDate))
    const filteredPast = pastMeetings.filter(m => isSameDate(m.startTime, selectedDate))

    const selectedDateCount = selectedDate
        ? upcomingMeetings.filter(m => isSameDate(m.startTime, selectedDate)).length
        : 0

    useEffect(() => {
        const role = localStorage.getItem("role") || ""
        setUserRole(role)
        fetchMeetings()
        if (role === "hr") fetchUsers()
    }, [])

    // ✅ FIXED: correct URL — my-meetings
    const fetchMeetings = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${API}/api/meeting/my-meetings`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) {
                console.error("fetchMeetings failed:", res.status)
                setLoading(false)
                return
            }
            const data = await res.json()
            const now = new Date(Date.now() - 60000)
            setUpcomingMeetings(
                data
                    .filter((m: any) => new Date(m.startTime) > now)
                    .sort((a: any, b: any) =>
                        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
                    )
            )
            setPastMeetings(
                data
                    .filter((m: any) => new Date(m.endTime) < now)
                    .sort((a: any, b: any) =>
                        new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
                    )
            )
        } catch (e) {
            console.error("fetchMeetings error:", e)
        } finally {
            setLoading(false)
        }
    }

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${API}/api/meeting/users`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) return
            const data = await res.json()
            setUsers(data.filter((u: any) => u?.id && u?.fullName))
        } catch {
            setUsers([])
        }
    }

    const deleteMeeting = async (id: number) => {
        const confirmDelete = confirm("Are you sure you want to delete this meeting?")
        if (!confirmDelete) return

        try {
            const token = localStorage.getItem("token")

            const res = await fetch(`${API}/api/meeting/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!res.ok) {
                const err = await res.json()
                alert(err.error || "Delete failed")
                return
            }

            // ✅ refresh list
            fetchMeetings()
        } catch (e) {
            console.error(e)
        }
    }

    const createMeeting = async () => {
        if (!title || !startTime || !endTime) {
            alert("Please fill all fields")
            return
        }
        if (new Date(startTime) >= new Date(endTime)) {
            alert("End time must be after start time")
            return
        }
        const token = localStorage.getItem("token")
        const res = await fetch(`${API}/api/meeting/create`, {
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
        if (!res.ok) {
            const err = await res.json()
            alert(err.error || "Failed to create meeting")
            return
        }
        setOpenModal(false)
        setTitle(""); setStartTime(""); setEndTime("")
        setMeetingLink(""); setSelectedUsers([])
        fetchMeetings()
    }

    // ✅ Fetch meeting detail with recording
    const openDetail = async (id: number) => {
        setDetailOpen(true)
        setDetailLoading(true)
        setDetailData(null)
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${API}/api/meeting/${id}/detail`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            setDetailData(data)
        } catch (e) {
            console.error(e)
        } finally {
            setDetailLoading(false)
        }
    }

    const formatDate = (d: string) => new Date(d).toLocaleDateString()
    const formatTime = (s: string, e: string) =>
        `${new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    const getDuration = (s: string, e: string) => {
        const diff = (new Date(e).getTime() - new Date(s).getTime()) / 60000
        return `${diff} min`
    }
    const todayCount = upcomingMeetings.filter(
        m => new Date(m.startTime).toDateString() === new Date().toDateString()
    ).length

    // ── Parse helpers ──
    const parseSummary = (raw: any) => {
        try { return typeof raw === "string" ? JSON.parse(raw) : raw }
        catch { return null }
    }
    const parseSpeakers = (raw: any) => {
        try { return typeof raw === "string" ? JSON.parse(raw) : raw }
        catch { return [] }
    }

    if (loading) return <p className="text-center p-6">Loading...</p>

    return (
        <div className="flex flex-col gap-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Meetings</h2>
                    <p className="text-muted-foreground text-sm">Schedule and manage your meetings</p>
                </div>
                {userRole === "hr" && (
                    <Button onClick={() => setOpenModal(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Schedule
                    </Button>
                )}
            </div>

            {/* DATE FILTER */}
            <div className="flex items-center gap-3">
                <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-[200px]"
                />
                {selectedDate && (
                    <Button variant="outline" onClick={() => setSelectedDate("")}>Clear</Button>
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

            {selectedDate && (
                <div className="flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r from-blue-500/10 to-indigo-500/10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500 text-white">📅</div>
                        <div>
                            <p className="text-xs text-muted-foreground">Selected Date</p>
                            <p className="text-sm font-semibold">{new Date(selectedDate).toDateString()}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Meetings</p>
                        <p className="text-xl font-bold text-blue-600">{selectedDateCount}</p>
                    </div>
                </div>
            )}

            {/* TABS */}
            <Tabs defaultValue="upcoming">
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>

                {/* UPCOMING */}
                <TabsContent value="upcoming" className="mt-4 space-y-4">
                    {filteredUpcoming.length === 0 && (
                        <div className="text-center text-muted-foreground py-10">No upcoming meetings 🚀</div>
                    )}
                    {filteredUpcoming.map((m) => (
                        <div key={m.id} className="p-4 rounded-xl border hover:shadow-lg transition flex justify-between items-center">
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
                                        <Clock className="h-3 w-3" />{getDuration(m.startTime, m.endTime)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />{getParticipantCount(m)} people
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 ml-3">
                                <Button size="sm" onClick={() => window.open(m.meetingLink, "_blank")}>
                                    <Video className="h-4 w-4 mr-1" /> Join
                                </Button>

                                {(userRole === "hr") && (
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => deleteMeeting(m.id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </div>

                        </div>
                    ))}
                </TabsContent>

                {/* PAST */}
                <TabsContent value="past" className="mt-4 space-y-4">
                    {filteredPast.length === 0 && (
                        <div className="text-center text-muted-foreground py-10">No past meetings</div>
                    )}
                    {filteredPast.map((m) => (
                        <div key={m.id} className="p-4 rounded-xl border">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-medium">{m.title}</h3>
                                        <Badge variant="secondary">Completed</Badge>
                                        {m.hasRecording && (
                                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                                                🎙 Recording Ready
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {formatDate(m.startTime)} • {formatTime(m.startTime, m.endTime)}
                                    </p>
                                    {m.summary && (
                                        <p className="text-xs text-muted-foreground mt-2 max-w-lg line-clamp-2">
                                            {parseSummary(m.summary)?.summary || ""}
                                        </p>
                                    )}
                                </div>
                                {m.hasRecording && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="ml-3 shrink-0"
                                        onClick={() => openDetail(m.id)}
                                    >
                                        <FileText className="h-3 w-3 mr-1" /> View Details
                                    </Button>
                                )}


                                {(userRole === "hr") && (
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => deleteMeeting(m.id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </TabsContent>
            </Tabs>

            {/* ── MEETING DETAIL MODAL ── */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 -mx-6 -mt-6 px-6 py-4 text-white rounded-t-2xl">
                        <DialogTitle className="text-base font-semibold">
                            {detailData?.title || "Meeting Details"}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-blue-100 mt-1">
                            {detailData?.startTime ? formatDate(detailData.startTime) : ""}
                        </DialogDescription>
                    </div>

                    {detailLoading && <p className="text-center py-8">Loading...</p>}

                    {detailData && !detailLoading && (() => {
                        const summary = parseSummary(detailData.summary)
                        const speakers = parseSpeakers(detailData.speakers)
                        return (
                            <div className="space-y-5 pt-4">

                                {/* SUMMARY */}
                                {/*{summary && (*/}
                                {/*    <div className="p-4 rounded-xl border space-y-3">*/}
                                {/*        <h3 className="font-semibold text-sm">📋 Meeting Summary</h3>*/}
                                {/*        <p className="text-sm text-muted-foreground">{summary.summary}</p>*/}

                                {/*        {summary.key_points?.length > 0 && (*/}
                                {/*            <div>*/}
                                {/*                <p className="text-xs font-medium mb-1">Key Points</p>*/}
                                {/*                {summary.key_points.map((p: string, i: number) => (*/}
                                {/*                    <p key={i} className="text-sm text-muted-foreground">• {p}</p>*/}
                                {/*                ))}*/}
                                {/*            </div>*/}
                                {/*        )}*/}

                                {/*        {summary.action_items?.length > 0 && (*/}
                                {/*            <div>*/}
                                {/*                <p className="text-xs font-medium mb-1">Action Items</p>*/}
                                {/*                {summary.action_items.map((a: any, i: number) => (*/}
                                {/*                    <div key={i} className="text-sm text-muted-foreground flex gap-2">*/}
                                {/*                        <span>•</span>*/}
                                {/*                        <span>{a.task} — <b>{a.assigned_to}</b> by {a.deadline}</span>*/}
                                {/*                    </div>*/}
                                {/*                ))}*/}
                                {/*            </div>*/}
                                {/*        )}*/}

                                {/*        {summary.decisions_made?.length > 0 && (*/}
                                {/*            <div>*/}
                                {/*                <p className="text-xs font-medium mb-1">Decisions</p>*/}
                                {/*                {summary.decisions_made.map((d: string, i: number) => (*/}
                                {/*                    <p key={i} className="text-sm text-muted-foreground">• {d}</p>*/}
                                {/*                ))}*/}
                                {/*            </div>*/}
                                {/*        )}*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                <div className="p-4 rounded-xl border space-y-3">
                                    <button
                                        onClick={() => setOpenSummary(!openSummary)}
                                        className="w-full flex justify-between items-center text-left"
                                    >
                                        <h3 className="font-semibold text-sm">📋 Meeting Summary</h3>
                                        <span className="text-xs text-blue-500">
                                            {openSummary ? "Hide" : "View"}
                                        </span>
                                    </button>

                                    {openSummary && (
                                        <div className="space-y-3">
                                            <p className="text-sm text-muted-foreground">{summary.summary}</p>

                                            {summary.key_points?.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-medium mb-1">Key Points</p>
                                                    {summary.key_points.map((p: string, i: number) => (
                                                        <p key={i} className="text-sm text-muted-foreground">• {p}</p>
                                                    ))}
                                                </div>
                                            )}

                                            {summary.action_items?.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-medium mb-1">Action Items</p>
                                                    {summary.action_items.map((a: any, i: number) => (
                                                        <div key={i} className="text-sm text-muted-foreground flex gap-2">
                                                            <span>•</span>
                                                            <span>
                                                                {a.task} — <b>{a.assigned_to}</b> by {a.deadline}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {summary.decisions_made?.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-medium mb-1">Decisions</p>
                                                    {summary.decisions_made.map((d: string, i: number) => (
                                                        <p key={i} className="text-sm text-muted-foreground">• {d}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* SPEAKERS */}
                                {speakers?.length > 0 && (
                                    <div className="p-4 rounded-xl border space-y-3">
                                        <h3 className="font-semibold text-sm">🎤 Speakers</h3>
                                        {speakers.map((s: any, i: number) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <span className="text-sm font-medium w-24">{s.label}</span>
                                                <div className="flex-1 bg-gray-100 dark:bg-white/10 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full"
                                                        style={{ width: `${s.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-muted-foreground w-20 text-right">
                                                    {s.duration}s ({s.percentage}%)
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* TRANSCRIPT */}
                                {/*{detailData.labeledTranscript && (*/}
                                {/*    <div className="p-4 rounded-xl border">*/}
                                {/*        <h3 className="font-semibold text-sm mb-3">📝 Transcript</h3>*/}
                                {/*        <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed max-h-60 overflow-y-auto">*/}
                                {/*            {detailData.labeledTranscript}*/}
                                {/*        </pre>*/}
                                {/*    </div>*/}
                                {/*)}*/}
                                {(detailData.labeledTranscript || detailData.transcript) && (
                                    <div className="p-4 rounded-xl border">
                                        <h3 className="font-semibold text-sm mb-3">📝 Transcript</h3>
                                        <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed max-h-60 overflow-y-auto">
                                            {detailData.labeledTranscript || detailData.transcript}
                                        </pre>
                                    </div>
                                )}

                                {/* Duration */}
                                {detailData.durationSeconds && (
                                    <p className="text-xs text-muted-foreground text-right">
                                        Duration: {Math.floor(detailData.durationSeconds / 60)}m {detailData.durationSeconds % 60}s
                                    </p>
                                )}
                            </div>
                        )
                    })()}
                </DialogContent>
            </Dialog>

            {/* CREATE MEETING MODAL */}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border border-white/10 bg-white dark:bg-[#020617] text-gray-900 dark:text-white shadow-xl">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-white">
                        <DialogTitle className="text-base font-semibold flex items-center gap-2">
                            📅 Schedule Meeting
                        </DialogTitle>
                        <DialogDescription className="text-xs text-blue-100 mt-1">
                            Plan meetings quickly
                        </DialogDescription>
                    </div>

                    <div className="p-5 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium">Meeting Title</Label>
                            <Input
                                placeholder="Enter meeting title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-10 text-sm rounded-lg bg-gray-50 dark:bg-white/5"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium">Start Time</Label>
                                <input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full h-10 px-3 text-sm rounded-lg border bg-white dark:bg-white/5 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium">End Time</Label>
                                <input
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full h-10 px-3 text-sm rounded-lg border bg-white dark:bg-white/5 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-medium">Meeting Link</Label>
                            <Input
                                placeholder="https://meet.google.com/..."
                                value={meetingLink}
                                onChange={(e) => setMeetingLink(e.target.value)}
                                className="h-10 text-sm rounded-lg bg-gray-50 dark:bg-white/5"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs font-medium">Participants</Label>
                            {selectedUsers.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedUsers.map(id => {
                                        const user = users.find(u => u.id === id)
                                        if (!user) return null
                                        return (
                                            <div key={id} className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs">
                                                {user.fullName}
                                                <button onClick={() => setSelectedUsers(prev => prev.filter(uid => uid !== id))} className="text-red-400">✕</button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                            <div className="max-h-40 overflow-y-auto rounded-lg border bg-gray-50 dark:bg-white/5 p-2 space-y-1">
                                {users.map(u => {
                                    const isSelected = selectedUsers.includes(u.id)
                                    return (
                                        <label key={u.id} className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition ${isSelected ? "bg-blue-500/20" : "hover:bg-gray-200 dark:hover:bg-white/10"}`}>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedUsers(prev => [...prev, u.id])
                                                        else setSelectedUsers(prev => prev.filter(id => id !== u.id))
                                                    }}
                                                    className="accent-blue-500"
                                                />
                                                {u.fullName}
                                            </div>
                                            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                                                {u.fullName.charAt(0)}
                                            </div>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>

                        <Button onClick={createMeeting} className="w-full h-11 text-sm rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 transition">
                            Create Meeting 🚀
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}
