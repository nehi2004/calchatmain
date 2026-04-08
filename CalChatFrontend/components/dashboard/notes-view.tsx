//"use client"

//import { useState } from "react"
//import { Plus, Search, StickyNote, Trash2, Edit2, Clock } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Badge } from "@/components/ui/badge"
//import { Textarea } from "@/components/ui/textarea"
//import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
//import { Label } from "@/components/ui/label"
//import { cn } from "@/lib/utils"

//interface Note {
//  id: string
//  title: string
//  content: string
//  category: string
//  date: string
//  color: string
//}

//const INITIAL_NOTES: Note[] = [
//  { id: "1", title: "Sprint Planning Notes", content: "Key takeaways from sprint planning:\n- Focus on user auth module\n- Complete API documentation\n- Fix mobile responsiveness issues\n- Review PR #234", category: "Work", date: "Feb 9", color: "border-l-primary" },
//  { id: "2", title: "Client Requirements", content: "Client needs:\n1. Dashboard redesign\n2. Report export functionality\n3. Multi-language support\n4. SSO integration", category: "Client", date: "Feb 8", color: "border-l-accent" },
//  { id: "3", title: "Architecture Ideas", content: "Consider microservices architecture for the new payment module. Benefits:\n- Better scalability\n- Independent deployments\n- Fault isolation", category: "Ideas", date: "Feb 7", color: "border-l-chart-4" },
//  { id: "4", title: "Meeting Notes - Design Review", content: "Design team proposed:\n- New color scheme (green/teal)\n- Simplified navigation\n- Dark mode support\n- Accessibility improvements", category: "Meeting", date: "Feb 6", color: "border-l-chart-5" },
//  { id: "5", title: "Learning Resources", content: "Useful links:\n- React Server Components docs\n- Next.js 16 migration guide\n- TypeScript best practices\n- Tailwind CSS v4 changes", category: "Learning", date: "Feb 5", color: "border-l-chart-3" },
//  { id: "6", title: "Personal Goals Q1", content: "1. Complete AWS certification\n2. Contribute to 2 open source projects\n3. Launch side project\n4. Read 5 tech books", category: "Personal", date: "Feb 4", color: "border-l-primary" },
//]

//export function NotesView() {
//  const [notes, setNotes] = useState(INITIAL_NOTES)
//  const [search, setSearch] = useState("")
//  const [dialogOpen, setDialogOpen] = useState(false)
//  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
//  const [newNote, setNewNote] = useState({ title: "", content: "", category: "Work" })

//  const filteredNotes = notes.filter(
//    (n) =>
//      n.title.toLowerCase().includes(search.toLowerCase()) ||
//      n.content.toLowerCase().includes(search.toLowerCase())
//  )

//  function handleAddNote() {
//    if (!newNote.title) return
//    const note: Note = {
//      id: Date.now().toString(),
//      title: newNote.title,
//      content: newNote.content,
//      category: newNote.category,
//      date: "Just now",
//      color: "border-l-primary",
//    }
//    setNotes([note, ...notes])
//    setNewNote({ title: "", content: "", category: "Work" })
//    setDialogOpen(false)
//  }

//  function handleDeleteNote(id: string) {
//    setNotes(notes.filter((n) => n.id !== id))
//    if (selectedNote?.id === id) setSelectedNote(null)
//  }

//  return (
//    <div className="flex flex-col gap-6">
//      <div className="flex items-center justify-between">
//        <div>
//          <h2 className="font-heading text-xl font-bold text-foreground">Notes</h2>
//          <p className="mt-1 text-sm text-muted-foreground">{notes.length} notes</p>
//        </div>
//        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//          <DialogTrigger asChild>
//            <Button className="gap-2">
//              <Plus className="h-4 w-4" /> New Note
//            </Button>
//          </DialogTrigger>
//          <DialogContent>
//            <DialogHeader>
//              <DialogTitle>Create Note</DialogTitle>
//            </DialogHeader>
//            <div className="flex flex-col gap-4 pt-4">
//              <div className="flex flex-col gap-2">
//                <Label>Title</Label>
//                <Input
//                  placeholder="Note title"
//                  value={newNote.title}
//                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
//                />
//              </div>
//              <div className="flex flex-col gap-2">
//                <Label>Content</Label>
//                <Textarea
//                  placeholder="Write your note..."
//                  value={newNote.content}
//                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
//                  rows={6}
//                />
//              </div>
//              <Button onClick={handleAddNote}>Save Note</Button>
//            </div>
//          </DialogContent>
//        </Dialog>
//      </div>

//      {/* Search */}
//      <div className="relative">
//        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//        <Input
//          placeholder="Search notes..."
//          value={search}
//          onChange={(e) => setSearch(e.target.value)}
//          className="pl-10"
//        />
//      </div>

//      {/* Notes Grid */}
//      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//        {filteredNotes.map((note) => (
//          <div
//            key={note.id}
//            onClick={() => setSelectedNote(note)}
//            className={cn(
//              "cursor-pointer rounded-xl border border-l-4 bg-card p-5 transition-all hover:shadow-md",
//              note.color,
//              selectedNote?.id === note.id && "ring-2 ring-primary"
//            )}
//          >
//            <div className="flex items-start justify-between">
//              <h3 className="font-heading text-sm font-semibold text-card-foreground">{note.title}</h3>
//              <Button
//                variant="ghost"
//                size="icon"
//                className="h-7 w-7 text-muted-foreground hover:text-destructive"
//                onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id) }}
//              >
//                <Trash2 className="h-3.5 w-3.5" />
//              </Button>
//            </div>
//            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-line">{note.content}</p>
//            <div className="mt-3 flex items-center justify-between">
//              <Badge variant="secondary" className="text-xs">{note.category}</Badge>
//              <span className="flex items-center gap-1 text-xs text-muted-foreground">
//                <Clock className="h-3 w-3" /> {note.date}
//              </span>
//            </div>
//          </div>
//        ))}
//      </div>

//      {filteredNotes.length === 0 && (
//        <p className="py-12 text-center text-sm text-muted-foreground">No notes found</p>
//      )}
//    </div>
//  )
//}



//"use client"

//import { useState, useEffect } from "react"
//import { Plus, Search, Trash2, Clock } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Badge } from "@/components/ui/badge"
//import { Textarea } from "@/components/ui/textarea"
//import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle,
//    DialogTrigger,
//} from "@/components/ui/dialog"
//import { Label } from "@/components/ui/label"
//import { cn } from "@/lib/utils"

//interface Note {
//    id: string
//    title: string
//    content: string
//    category: string
//    date: string
//}

//export function NotesView() {
//    const [notes, setNotes] = useState<Note[]>([])
//    const [users, setUsers] = useState<any[]>([])
//    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

//    const [search, setSearch] = useState("")
//    const [dialogOpen, setDialogOpen] = useState(false)
//    const [selectedNote, setSelectedNote] = useState<Note | null>(null)

//    const [newNote, setNewNote] = useState({
//        title: "",
//        content: "",
//        category: "Work",
//    })

//    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null

//    // ✅ Fetch Notes (Employee-specific)
//    useEffect(() => {
//        fetch("/api/notes")
//            .then((res) => res.json())
//            .then((data) => setNotes(data))
//    }, [])

//    // ✅ Fetch Users (HR only)
//    useEffect(() => {
//        if (role === "HR") {
//            fetch("/api/notes/users")
//                .then((res) => res.json())
//                .then((data) => setUsers(data))
//        }
//    }, [role])

//    // ✅ Filter Notes
//    const filteredNotes = notes.filter(
//        (n) =>
//            n.title.toLowerCase().includes(search.toLowerCase()) ||
//            n.content.toLowerCase().includes(search.toLowerCase())
//    )

//    // ✅ Create Note (API)
//    async function handleAddNote() {
//        if (!newNote.title || selectedUsers.length === 0) {
//            alert("Please fill all fields & select employees")
//            return
//        }

//        await fetch("/api/notes/create", {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//            },
//            body: JSON.stringify({
//                title: newNote.title,
//                content: newNote.content,
//                category: newNote.category,
//                userIds: selectedUsers,
//            }),
//        })

//        // Refresh notes
//        const res = await fetch("/api/notes")
//        const data = await res.json()
//        setNotes(data)

//        setDialogOpen(false)
//        setNewNote({ title: "", content: "", category: "Work" })
//        setSelectedUsers([])
//    }

//    // ❌ Delete (frontend only for now)
//    function handleDeleteNote(id: string) {
//        setNotes(notes.filter((n) => n.id !== id))
//    }

//    return (
//        <div className="flex flex-col gap-6">
//            {/* Header */}
//            <div className="flex items-center justify-between">
//                <div>
//                    <h2 className="text-xl font-bold">Notes</h2>
//                    <p className="text-sm text-muted-foreground">
//                        {notes.length} notes
//                    </p>
//                </div>

//                {/* ✅ Only HR can create */}
//                {role === "HR" && (
//                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                        <DialogTrigger asChild>
//                            <Button className="gap-2">
//                                <Plus className="h-4 w-4" /> New Note
//                            </Button>
//                        </DialogTrigger>

//                        <DialogContent>
//                            <DialogHeader>
//                                <DialogTitle>Create Note</DialogTitle>
//                            </DialogHeader>

//                            <div className="flex flex-col gap-4 pt-4">
//                                {/* Title */}
//                                <div>
//                                    <Label>Title</Label>
//                                    <Input
//                                        value={newNote.title}
//                                        onChange={(e) =>
//                                            setNewNote({ ...newNote, title: e.target.value })
//                                        }
//                                    />
//                                </div>

//                                {/* Content */}
//                                <div>
//                                    <Label>Content</Label>
//                                    <Textarea
//                                        rows={5}
//                                        value={newNote.content}
//                                        onChange={(e) =>
//                                            setNewNote({ ...newNote, content: e.target.value })
//                                        }
//                                    />
//                                </div>

//                                {/* ✅ Employee Selection */}
//                                <div>
//                                    <Label>Select Employees</Label>
//                                    <div className="flex flex-wrap gap-2 mt-2">
//                                        {users.map((user) => (
//                                            <button
//                                                key={user.id}
//                                                type="button"
//                                                onClick={() => {
//                                                    setSelectedUsers((prev) =>
//                                                        prev.includes(user.id)
//                                                            ? prev.filter((id) => id !== user.id)
//                                                            : [...prev, user.id]
//                                                    )
//                                                }}
//                                                className={cn(
//                                                    "px-3 py-1 border rounded-md text-xs",
//                                                    selectedUsers.includes(user.id)
//                                                        ? "bg-primary text-white"
//                                                        : "bg-muted"
//                                                )}
//                                            >
//                                                {user.name}
//                                            </button>
//                                        ))}
//                                    </div>
//                                </div>

//                                <Button onClick={handleAddNote}>Save Note</Button>
//                            </div>
//                        </DialogContent>
//                    </Dialog>
//                )}
//            </div>

//            {/* Search */}
//            <div className="relative">
//                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                <Input
//                    className="pl-10"
//                    placeholder="Search notes..."
//                    value={search}
//                    onChange={(e) => setSearch(e.target.value)}
//                />
//            </div>

//            {/* Notes Grid */}
//            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                {filteredNotes.map((note) => (
//                    <div
//                        key={note.id}
//                        onClick={() => setSelectedNote(note)}
//                        className={cn(
//                            "cursor-pointer rounded-xl border p-5 hover:shadow-md",
//                            selectedNote?.id === note.id && "ring-2 ring-primary"
//                        )}
//                    >
//                        <div className="flex justify-between">
//                            <h3 className="font-semibold text-sm">{note.title}</h3>

//                            {role === "HR" && (
//                                <Button
//                                    size="icon"
//                                    variant="ghost"
//                                    onClick={(e) => {
//                                        e.stopPropagation()
//                                        handleDeleteNote(note.id)
//                                    }}
//                                >
//                                    <Trash2 className="h-4 w-4" />
//                                </Button>
//                            )}
//                        </div>

//                        <p className="mt-2 text-xs text-muted-foreground line-clamp-3 whitespace-pre-line">
//                            {note.content}
//                        </p>

//                        <div className="mt-3 flex justify-between items-center">
//                            <Badge>{note.category}</Badge>

//                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
//                                <Clock className="h-3 w-3" /> {note.date}
//                            </span>
//                        </div>
//                    </div>
//                ))}
//            </div>

//            {filteredNotes.length === 0 && (
//                <p className="text-center text-sm text-muted-foreground py-10">
//                    No notes found
//                </p>
//            )}
//        </div>
//    )
//}



"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Note {
    id: string
    title: string
    content: string
    category: string
    date: string
    color?: string
}

export function NotesView() {
    const [notes, setNotes] = useState<Note[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

    const [search, setSearch] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedNote, setSelectedNote] = useState<Note | null>(null)


    const [newNote, setNewNote] = useState({
        title: "",
        content: "",
        category: "Work",
    })

    const [role, setRole] = useState<string | null>(null)
    const [editMode, setEditMode] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)

    useEffect(() => {
        const storedRole = localStorage.getItem("role")
        setRole(storedRole)
    }, [])
    // 🎨 Category Colors
    const getColor = (category: string) => {
        switch (category) {
            case "Work":
                return "border-l-primary"
            case "Client":
                return "border-l-accent"
            case "Ideas":
                return "border-l-chart-4"
            case "Meeting":
                return "border-l-chart-5"
            case "Learning":
                return "border-l-chart-3"
            default:
                return "border-l-primary"
        }
    }


    // ✅ Fetch Users (HR only)
    useEffect(() => {
        if (role?.toLowerCase() === "hr") {
            fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/hr/employees", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then(async (res) => {
                    console.log("STATUS 👉", res.status)
                    const data = await res.json()
                    console.log("EMPLOYEES API RESPONSE 👉", data) // 👈 MOST IMPORTANT
                    setUsers(data)
                })
                .catch((err) => console.error("ERROR 👉", err))
        }
    }, [role])

    // 🔍 Search Filter
    const filteredNotes = notes.filter(
        (n) =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.content.toLowerCase().includes(search.toLowerCase())
    )

    async function handleSaveNote() {
        // ✅ Validation
        if (!newNote.title.trim()) {
            alert("Title is required")
            return
        }

        if (selectedUsers.length === 0) {
            alert("Select at least one employee")
            return
        }

        const url = editMode
            ? `https://steadfast-warmth-production-64c8.up.railway.app/api/Notes/${editId}`
            : `https://steadfast-warmth-production-64c8.up.railway.app/api/Notes/create`

        const method = editMode ? "PUT" : "POST"

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                Title: newNote.title,
                Content: newNote.content,
                Category: newNote.category,
                UserIds: selectedUsers,
               
                
            }),
        })

        if (!res.ok) {
            alert("Save failed")
            return
        }

        await fetchNotes()

        // reset
        setDialogOpen(false)
        setNewNote({ title: "", content: "", category: "Work" })
        setSelectedUsers([])
        setEditMode(false)
        setEditId(null)
    }

    const fetchNotes = async () => {
        const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Notes", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })

        const data = await res.json()

        setNotes(
            data.map((n: Note) => ({
                ...n,
                color: getColor(n.category),
            }))
        )
    }

    useEffect(() => {
        fetchNotes()
    }, [])
    
    // ❌ Delete (UI only)
    async function handleDeleteNote(id: string) {
        const confirmDelete = confirm("Are you sure you want to delete this note?")

        if (!confirmDelete) return

        const res = await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/Notes/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })

        if (!res.ok) {
            alert("Delete failed")
            return
        }

        await fetchNotes()
    }
    console.log("USERS STATE 👉", users)
    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading text-xl font-bold text-foreground">
                        Notes
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {notes.length} notes
                    </p>
                </div>

                {/* ✅ HR ONLY BUTTON (Fixed) */}
                {role?.toLowerCase() === "hr" && (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" /> New Note
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">

                            {/* HEADER */}
                            <div className="bg-gradient-to-r from-primary/90 to-primary p-5 text-white">
                                <DialogTitle className="text-lg font-semibold">
                                    {editMode ? "✏️ Edit Note" : "📝 Create Note"}
                                </DialogTitle>
                                <p className="text-xs opacity-80 mt-1">
                                    Capture important thoughts & share with your team
                                </p>
                            </div>

                            {/* BODY */}
                            <div className="p-5 space-y-5">

                                {/* TITLE */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Title</Label>
                                    <Input
                                        placeholder="Enter note title..."
                                        value={newNote.title}
                                        onChange={(e) =>
                                            setNewNote({ ...newNote, title: e.target.value })
                                        }
                                        className="rounded-xl"
                                    />
                                </div>

                                {/* CONTENT */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Content</Label>
                                    <Textarea
                                        placeholder="Write your note here..."
                                        rows={5}
                                        value={newNote.content}
                                        onChange={(e) =>
                                            setNewNote({ ...newNote, content: e.target.value })
                                        }
                                        className="rounded-xl resize-none"
                                    />
                                </div>

                                {/* ✅ UPDATED EMPLOYEE SELECT (CHECKBOX STYLE) */}
                                {role?.toLowerCase() === "hr" && (
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">
                                            Assign to Employees
                                        </Label>

                                        {/* SELECTED USERS CHIPS */}
                                        <div className="flex flex-wrap gap-1">
                                            {selectedUsers.map(id => {
                                                const user = users.find(u => u.id === id)
                                                if (!user) return null

                                                return (
                                                    <div
                                                        key={id}
                                                        className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-[10px]"
                                                    >
                                                        {user.fullName || user.name}
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

                                        {/* USERS LIST */}
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
                                                            {u.fullName || u.name}
                                                        </div>

                                                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                                                            {(u.fullName || u.name)?.charAt(0)}
                                                        </div>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* ACTION BUTTON */}
                                <Button
                                    onClick={handleSaveNote}
                                    className="w-full rounded-xl h-11 text-sm font-medium shadow-lg hover:scale-[1.02] transition"
                                >
                                    {editMode ? "Update Note ✏️" : "Save Note 🚀"}
                                </Button>

                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Notes Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note) => (
                    <div
                        key={note.id}
                        onClick={() => {
                            setEditMode(true)
                            setEditId(note.id)
                            setNewNote({
                                title: note.title,
                                content: note.content,
                                category: note.category,
                            })
                            setDialogOpen(true)
                        }}
                        className={cn(
                            "cursor-pointer rounded-xl border border-l-4 bg-card p-5 transition-all hover:shadow-md",
                            note.color,
                            selectedNote?.id === note.id && "ring-2 ring-primary"
                        )}
                    >
                        <div className="flex items-start justify-between">
                            <h3 className="font-heading text-sm font-semibold text-card-foreground">
                                {note.title}
                            </h3>

                            {role?.toLowerCase() === "hr" && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteNote(note.id)
                                    }}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </div>

                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
                            {note.content}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                                {note.category}
                            </Badge>

                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" /> {note.date && note.date !== "0001-01-01T00:00:00"
                                    ? new Date(note.date).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })
                                    : "No Date"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredNotes.length === 0 && (
                <p className="py-12 text-center text-sm text-muted-foreground">
                    No notes found
                </p>
            )}

        </div>
    )
}