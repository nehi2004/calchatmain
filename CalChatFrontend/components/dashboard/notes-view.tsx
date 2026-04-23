


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
//import {
//    Select,
//    SelectContent,
//    SelectItem,
//    SelectTrigger,
//    SelectValue,
//} from "@/components/ui/select"

//interface Note {
//    id: string
//    title: string
//    content: string
//    category: string
//    date: string
//    color?: string
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

//    const [role, setRole] = useState<string | null>(null)
//    const [editMode, setEditMode] = useState(false)
//    const [editId, setEditId] = useState<string | null>(null)

//    useEffect(() => {
//        const storedRole = localStorage.getItem("role")
//        setRole(storedRole)
//    }, [])
//    // 🎨 Category Colors
//    const getColor = (category: string) => {
//        switch (category) {
//            case "Work":
//                return "border-l-primary"
//            case "Client":
//                return "border-l-accent"
//            case "Ideas":
//                return "border-l-chart-4"
//            case "Meeting":
//                return "border-l-chart-5"
//            case "Learning":
//                return "border-l-chart-3"
//            default:
//                return "border-l-primary"
//        }
//    }


//    // ✅ Fetch Users (HR only)
//    useEffect(() => {
//        if (role?.toLowerCase() === "hr") {
//            fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/hr/employees", {
//                headers: {
//                    Authorization: `Bearer ${localStorage.getItem("token")}`,
//                },
//            })
//                .then(async (res) => {
//                    console.log("STATUS 👉", res.status)
//                    const data = await res.json()
//                    console.log("EMPLOYEES API RESPONSE 👉", data) // 👈 MOST IMPORTANT
//                    setUsers(data)
//                })
//                .catch((err) => console.error("ERROR 👉", err))
//        }
//    }, [role])

//    // 🔍 Search Filter
//    const filteredNotes = notes.filter(
//        (n) =>
//            n.title.toLowerCase().includes(search.toLowerCase()) ||
//            n.content.toLowerCase().includes(search.toLowerCase())
//    )

//    async function handleSaveNote() {
//        // ✅ Validation
//        if (!newNote.title.trim()) {
//            alert("Title is required")
//            return
//        }

//        if (selectedUsers.length === 0) {
//            alert("Select at least one employee")
//            return
//        }

//        const url = editMode
//            ? `https://steadfast-warmth-production-64c8.up.railway.app/api/Notes/${editId}`
//            : `https://steadfast-warmth-production-64c8.up.railway.app/api/Notes/create`

//        const method = editMode ? "PUT" : "POST"

//        const res = await fetch(url, {
//            method,
//            headers: {
//                "Content-Type": "application/json",
//                Authorization: `Bearer ${localStorage.getItem("token")}`,
//            },
//            body: JSON.stringify({
//                Title: newNote.title,
//                Content: newNote.content,
//                Category: newNote.category,
//                UserIds: selectedUsers,


//            }),
//        })

//        if (!res.ok) {
//            alert("Save failed")
//            return
//        }

//        await fetchNotes()

//        // reset
//        setDialogOpen(false)
//        setNewNote({ title: "", content: "", category: "Work" })
//        setSelectedUsers([])
//        setEditMode(false)
//        setEditId(null)
//    }

//    const fetchNotes = async () => {
//        const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Notes", {
//            headers: {
//                Authorization: `Bearer ${localStorage.getItem("token")}`,
//            },
//        })

//        const data = await res.json()

//        setNotes(
//            data.map((n: Note) => ({
//                ...n,
//                color: getColor(n.category),
//            }))
//        )
//    }

//    useEffect(() => {
//        fetchNotes()
//    }, [])

//    // ❌ Delete (UI only)
//    async function handleDeleteNote(id: string) {
//        const confirmDelete = confirm("Are you sure you want to delete this note?")

//        if (!confirmDelete) return

//        const res = await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/Notes/${id}`, {
//            method: "DELETE",
//            headers: {
//                Authorization: `Bearer ${localStorage.getItem("token")}`,
//            },
//        })

//        if (!res.ok) {
//            alert("Delete failed")
//            return
//        }

//        await fetchNotes()
//    }
//    console.log("USERS STATE 👉", users)
//    return (
//        <div className="flex flex-col gap-6">
//            {/* Header */}
//            <div className="flex items-center justify-between">
//                <div>
//                    <h2 className="font-heading text-xl font-bold text-foreground">
//                        Notes
//                    </h2>
//                    <p className="mt-1 text-sm text-muted-foreground">
//                        {notes.length} notes
//                    </p>
//                </div>

//                {/* ✅ HR ONLY BUTTON (Fixed) */}
//                {role?.toLowerCase() === "hr" && (
//                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                        <DialogTrigger asChild>
//                            <Button className="gap-2">
//                                <Plus className="h-4 w-4" /> New Note
//                            </Button>
//                        </DialogTrigger>

//                        <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">

//                            {/* HEADER */}
//                            <div className="bg-gradient-to-r from-primary/90 to-primary p-5 text-white">
//                                <DialogTitle className="text-lg font-semibold">
//                                    {editMode ? "✏️ Edit Note" : "📝 Create Note"}
//                                </DialogTitle>
//                                <p className="text-xs opacity-80 mt-1">
//                                    Capture important thoughts & share with your team
//                                </p>
//                            </div>

//                            {/* BODY */}
//                            <div className="p-5 space-y-5">

//                                {/* TITLE */}
//                                <div className="space-y-2">
//                                    <Label className="text-sm font-medium">Title</Label>
//                                    <Input
//                                        placeholder="Enter note title..."
//                                        value={newNote.title}
//                                        onChange={(e) =>
//                                            setNewNote({ ...newNote, title: e.target.value })
//                                        }
//                                        className="rounded-xl"
//                                    />
//                                </div>

//                                {/* CONTENT */}
//                                <div className="space-y-2">
//                                    <Label className="text-sm font-medium">Content</Label>
//                                    <Textarea
//                                        placeholder="Write your note here..."
//                                        rows={5}
//                                        value={newNote.content}
//                                        onChange={(e) =>
//                                            setNewNote({ ...newNote, content: e.target.value })
//                                        }
//                                        className="rounded-xl resize-none"
//                                    />
//                                </div>

//                                {/* ✅ UPDATED EMPLOYEE SELECT (CHECKBOX STYLE) */}
//                                {role?.toLowerCase() === "hr" && (
//                                    <div className="space-y-3">
//                                        <Label className="text-sm font-medium">
//                                            Assign to Employees
//                                        </Label>

//                                        {/* SELECTED USERS CHIPS */}
//                                        <div className="flex flex-wrap gap-1">
//                                            {selectedUsers.map(id => {
//                                                const user = users.find(u => u.id === id)
//                                                if (!user) return null

//                                                return (
//                                                    <div
//                                                        key={id}
//                                                        className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-[10px]"
//                                                    >
//                                                        {user.fullName || user.name}
//                                                        <button
//                                                            onClick={() =>
//                                                                setSelectedUsers(prev => prev.filter(uid => uid !== id))
//                                                            }
//                                                            className="text-red-400"
//                                                        >
//                                                            ✕
//                                                        </button>
//                                                    </div>
//                                                )
//                                            })}
//                                        </div>

//                                        {/* USERS LIST */}
//                                        <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-1 space-y-1">

//                                            {users.map(u => {
//                                                const isSelected = selectedUsers.includes(u.id)

//                                                return (
//                                                    <label
//                                                        key={u.id}
//                                                        className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer text-xs
//                                ${isSelected
//                                                                ? "bg-blue-500/20"
//                                                                : "hover:bg-gray-200 dark:hover:bg-white/10"
//                                                            }`}
//                                                    >
//                                                        <div className="flex items-center gap-2">
//                                                            <input
//                                                                type="checkbox"
//                                                                checked={isSelected}
//                                                                onChange={(e) => {
//                                                                    if (e.target.checked) {
//                                                                        setSelectedUsers(prev => [...prev, u.id])
//                                                                    } else {
//                                                                        setSelectedUsers(prev => prev.filter(id => id !== u.id))
//                                                                    }
//                                                                }}
//                                                                className="accent-blue-500"
//                                                            />
//                                                            {u.fullName || u.name}
//                                                        </div>

//                                                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
//                                                            {(u.fullName || u.name)?.charAt(0)}
//                                                        </div>
//                                                    </label>
//                                                )
//                                            })}
//                                        </div>
//                                    </div>
//                                )}

//                                {/* ACTION BUTTON */}
//                                <Button
//                                    onClick={handleSaveNote}
//                                    className="w-full rounded-xl h-11 text-sm font-medium shadow-lg hover:scale-[1.02] transition"
//                                >
//                                    {editMode ? "Update Note ✏️" : "Save Note 🚀"}
//                                </Button>

//                            </div>
//                        </DialogContent>
//                    </Dialog>
//                )}
//            </div>

//            {/* Search */}
//            <div className="relative">
//                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                <Input
//                    placeholder="Search notes..."
//                    value={search}
//                    onChange={(e) => setSearch(e.target.value)}
//                    className="pl-10"
//                />
//            </div>

//            {/* Notes Grid */}
//            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                {filteredNotes.map((note) => (
//                    <div
//                        key={note.id}
//                        onClick={() => {
//                            setEditMode(true)
//                            setEditId(note.id)
//                            setNewNote({
//                                title: note.title,
//                                content: note.content,
//                                category: note.category,
//                            })
//                            setDialogOpen(true)
//                        }}
//                        className={cn(
//                            "cursor-pointer rounded-xl border border-l-4 bg-card p-5 transition-all hover:shadow-md",
//                            note.color,
//                            selectedNote?.id === note.id && "ring-2 ring-primary"
//                        )}
//                    >
//                        <div className="flex items-start justify-between">
//                            <h3 className="font-heading text-sm font-semibold text-card-foreground">
//                                {note.title}
//                            </h3>

//                            {role?.toLowerCase() === "hr" && (
//                                <Button
//                                    variant="ghost"
//                                    size="icon"
//                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
//                                    onClick={(e) => {
//                                        e.stopPropagation()
//                                        handleDeleteNote(note.id)
//                                    }}
//                                >
//                                    <Trash2 className="h-3.5 w-3.5" />
//                                </Button>
//                            )}
//                        </div>

//                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
//                            {note.content}
//                        </p>

//                        <div className="mt-3 flex items-center justify-between">
//                            <Badge variant="secondary" className="text-xs">
//                                {note.category}
//                            </Badge>

//                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
//                                <Clock className="h-3 w-3" /> {note.date && note.date !== "0001-01-01T00:00:00"
//                                    ? new Date(note.date).toLocaleDateString("en-IN", {
//                                        day: "2-digit",
//                                        month: "short",
//                                        year: "numeric"
//                                    })
//                                    : "No Date"}
//                            </span>
//                        </div>
//                    </div>
//                ))}
//            </div>

//            {filteredNotes.length === 0 && (
//                <p className="py-12 text-center text-sm text-muted-foreground">
//                    No notes found
//                </p>
//            )}

//        </div>
//    )
//}


"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Clock, Download, Eye, Paperclip, Plus, Search, Trash2, X } from "lucide-react"

interface Employee {
    id: string
    fullName?: string
    name?: string
}

interface NoteAttachment {
    id: number
    originalFileName: string
    contentType: string
    fileSize: number
    filePath?: string
}

interface Note {
    id: string
    title: string
    content: string
    category: string
    date: string
    createdById?: string
    userIds: string[]
    attachments?: NoteAttachment[]
    color?: string
}

const defaultNote = {
    title: "",
    content: "",
    category: "Work",
}

export function NotesView() {
    const [notes, setNotes] = useState<Note[]>([])
    const [users, setUsers] = useState<Employee[]>([])
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [search, setSearch] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [newNote, setNewNote] = useState(defaultNote)
    const [role, setRole] = useState<string | null>(null)
    const [editMode, setEditMode] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [selectedNote, setSelectedNote] = useState<Note | null>(null)
    const [detailOpen, setDetailOpen] = useState(false)

    useEffect(() => {
        setRole(localStorage.getItem("role"))
    }, [])

    const currentUserId =
        typeof window !== "undefined" ? localStorage.getItem("userId") : null

    const resetForm = () => {
        setEditMode(false)
        setEditId(null)
        setNewNote(defaultNote)
        setSelectedUsers([])
        setSelectedFiles([])
    }

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

    useEffect(() => {
        if (role?.toLowerCase() !== "hr") return

        fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/hr/employees", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Failed to fetch employees")
                const data: Employee[] = await res.json()
                setUsers(data)
            })
            .catch((err) => {
                console.error("Employees fetch error:", err)
            })
    }, [role])

    const fetchNotes = async () => {
        try {
            const res = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/Notes", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            if (!res.ok) throw new Error("Failed to fetch notes")

            const data: Note[] = await res.json()

            setNotes(
                data.map((n) => ({
                    ...n,
                    userIds: n.userIds ?? [],
                    attachments: n.attachments ?? [],
                    color: getColor(n.category),
                }))
            )
        } catch (error) {
            console.error("Notes fetch error:", error)
        }
    }

    useEffect(() => {
        fetchNotes()
    }, [])

    const filteredNotes = notes.filter(
        (n) =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.content.toLowerCase().includes(search.toLowerCase())
    )

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? [])
        setSelectedFiles(files)
    }

    const removeSelectedFile = (fileName: string) => {
        setSelectedFiles((prev) => prev.filter((file) => file.name !== fileName))
    }

    async function handleSaveNote() {
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

        try {
            const formData = new FormData()
            formData.append("Title", newNote.title)
            formData.append("Content", newNote.content)
            formData.append("Category", newNote.category)

            selectedUsers.forEach((userId) => {
                formData.append("UserIds", userId)
            })

            selectedFiles.forEach((file) => {
                formData.append("Files", file)
            })

            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            })

            if (!res.ok) {
                const errorText = await res.text()
                console.error("Save failed:", errorText)
                alert(errorText || "Save failed")
                return
            }

            await fetchNotes()
            setDialogOpen(false)
            resetForm()
        } catch (error) {
            console.error("Save note error:", error)
            alert("Save failed")
        }
    }

    const openAttachment = (attachmentId: number) => {
        const token = localStorage.getItem("token")
        const url = `https://steadfast-warmth-production-64c8.up.railway.app/api/Notes/attachment/${attachmentId}/view?token=${token}`
        window.open(url, "_blank")
    }

    const downloadAttachment = (attachmentId: number) => {
        const token = localStorage.getItem("token")
        const url = `https://steadfast-warmth-production-64c8.up.railway.app/api/Notes/attachment/${attachmentId}/download?token=${token}`
        window.open(url, "_blank")
    }

    const openEditNote = (note: Note) => {
        setEditMode(true)
        setEditId(note.id)
        setNewNote({
            title: note.title,
            content: note.content,
            category: note.category,
        })
        setSelectedUsers(note.userIds || [])
        setSelectedFiles([])
        setDialogOpen(true)
        setDetailOpen(false)
    }

    async function handleDeleteNote(id: string) {
        const confirmDelete = confirm("Are you sure you want to delete this note?")
        if (!confirmDelete) return

        try {
            const res = await fetch(`https://steadfast-warmth-production-64c8.up.railway.app/api/Notes/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            if (!res.ok) {
                const errorText = await res.text()
                alert(errorText || "Delete failed")
                return
            }

            await fetchNotes()
            if (selectedNote?.id === id) {
                setDetailOpen(false)
                setSelectedNote(null)
            }
        } catch (error) {
            console.error("Delete note error:", error)
            alert("Delete failed")
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading text-xl font-bold text-foreground">
                        Notes
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {notes.length} notes
                    </p>
                </div>

                {role?.toLowerCase() === "hr" && (
                    <Dialog
                        open={dialogOpen}
                        onOpenChange={(open) => {
                            setDialogOpen(open)
                            if (!open) resetForm()
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button
                                className="gap-2"
                                onClick={() => {
                                    resetForm()
                                }}
                            >
                                <Plus className="h-4 w-4" /> New Note
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-2xl overflow-hidden rounded-2xl p-0">
                            <div className="flex max-h-[85vh] flex-col">
                                <div className="bg-gradient-to-r from-primary/90 to-primary p-5 text-white">
                                    <DialogTitle className="text-lg font-semibold">
                                        {editMode ? "Edit Note" : "Create Note"}
                                    </DialogTitle>
                                    <p className="mt-1 text-xs opacity-80">
                                        Capture important thoughts and share with your team
                                    </p>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5">
                                    <div className="space-y-5">
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

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Category</Label>
                                                <Select
                                                    value={newNote.category}
                                                    onValueChange={(value) =>
                                                        setNewNote({ ...newNote, category: value })
                                                    }
                                                >
                                                    <SelectTrigger className="rounded-xl">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Work">Work</SelectItem>
                                                        <SelectItem value="Client">Client</SelectItem>
                                                        <SelectItem value="Ideas">Ideas</SelectItem>
                                                        <SelectItem value="Meeting">Meeting</SelectItem>
                                                        <SelectItem value="Learning">Learning</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Attachments</Label>
                                                <Input
                                                    type="file"
                                                    multiple
                                                    onChange={handleFileChange}
                                                    className="rounded-xl"
                                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                                                />
                                            </div>
                                        </div>

                                        {selectedFiles.length > 0 && (
                                            <div className="space-y-2 rounded-xl border bg-muted/30 p-3">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Selected files ({selectedFiles.length})
                                                </p>

                                                <div className="max-h-28 space-y-2 overflow-y-auto">
                                                    {selectedFiles.map((file) => (
                                                        <div
                                                            key={file.name}
                                                            className="flex items-center justify-between rounded-lg bg-background px-3 py-2 text-xs"
                                                        >
                                                            <div className="flex min-w-0 items-center gap-2">
                                                                <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                                                <span className="truncate">{file.name}</span>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => removeSelectedFile(file.name)}
                                                                className="ml-2 text-red-500"
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Content</Label>
                                            <Textarea
                                                placeholder="Write your note here..."
                                                rows={6}
                                                value={newNote.content}
                                                onChange={(e) =>
                                                    setNewNote({ ...newNote, content: e.target.value })
                                                }
                                                className="min-h-[140px] resize-y rounded-xl"
                                            />
                                        </div>

                                        {role?.toLowerCase() === "hr" && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-sm font-medium">
                                                        Assign to Employees
                                                    </Label>
                                                    <span className="text-xs text-muted-foreground">
                                                        {selectedUsers.length} selected
                                                    </span>
                                                </div>

                                                {selectedUsers.length > 0 && (
                                                    <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto rounded-xl border bg-muted/20 p-2">
                                                        {selectedUsers.map((id) => {
                                                            const user = users.find((u) => u.id === id)
                                                            if (!user) return null

                                                            return (
                                                                <div
                                                                    key={id}
                                                                    className="flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/20 px-2 py-1 text-[10px]"
                                                                >
                                                                    {user.fullName || user.name}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setSelectedUsers((prev) =>
                                                                                prev.filter((uid) => uid !== id)
                                                                            )
                                                                        }
                                                                        className="text-red-400"
                                                                    >
                                                                        x
                                                                    </button>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}

                                                <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-white/10 dark:bg-white/5">
                                                    {users.map((u) => {
                                                        const isSelected = selectedUsers.includes(u.id)

                                                        return (
                                                            <label
                                                                key={u.id}
                                                                className={cn(
                                                                    "flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-xs",
                                                                    isSelected
                                                                        ? "bg-blue-500/20"
                                                                        : "hover:bg-gray-200 dark:hover:bg-white/10"
                                                                )}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isSelected}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setSelectedUsers((prev) => [...prev, u.id])
                                                                            } else {
                                                                                setSelectedUsers((prev) =>
                                                                                    prev.filter((id) => id !== u.id)
                                                                                )
                                                                            }
                                                                        }}
                                                                        className="accent-blue-500"
                                                                    />
                                                                    <span>{u.fullName || u.name}</span>
                                                                </div>

                                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                                                                    {(u.fullName || u.name)?.charAt(0)}
                                                                </div>
                                                            </label>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t bg-background/95 p-4 backdrop-blur">
                                    <div className="flex items-center justify-end gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setDialogOpen(false)
                                                resetForm()
                                            }}
                                            className="rounded-xl"
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            onClick={handleSaveNote}
                                            className="h-11 rounded-xl px-6 text-sm font-medium shadow-lg transition hover:scale-[1.02]"
                                        >
                                            {editMode ? "Update Note" : "Save Note"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note) => (
                    <div
                        key={note.id}
                        onClick={() => {
                            setSelectedNote(note)
                            setDetailOpen(true)
                        }}
                        className={cn(
                            "rounded-xl border border-l-4 bg-card p-5 transition-all hover:shadow-md cursor-pointer",
                            note.color
                        )}
                    >
                        <div className="flex items-start justify-between">
                            <h3 className="font-heading text-sm font-semibold text-card-foreground">
                                {note.title}
                            </h3>

                            {role?.toLowerCase() === "hr" &&
                                (!currentUserId || note.createdById === currentUserId) && (
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

                        <p className="mt-2 line-clamp-3 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                            {note.content}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                                {note.category}
                            </Badge>

                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {note.date && note.date !== "0001-01-01T00:00:00"
                                    ? new Date(note.date).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })
                                    : "No Date"}
                            </span>
                        </div>

                        {!!note.attachments?.length && (
                            <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                                <Paperclip className="h-3.5 w-3.5" />
                                {note.attachments.length} attachment{note.attachments.length > 1 ? "s" : ""}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-2xl overflow-hidden rounded-2xl p-0">
                    {selectedNote && (
                        <div className="flex max-h-[85vh] flex-col">
                            <div className="border-b bg-background p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <DialogTitle className="text-lg font-semibold">
                                            {selectedNote.title}
                                        </DialogTitle>
                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {selectedNote.category}
                                            </Badge>

                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {selectedNote.date &&
                                                    selectedNote.date !== "0001-01-01T00:00:00"
                                                    ? new Date(selectedNote.date).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })
                                                    : "No Date"}
                                            </span>
                                        </div>
                                    </div>

                                    {role?.toLowerCase() === "hr" &&
                                        (!currentUserId || selectedNote.createdById === currentUserId) && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => openEditNote(selectedNote)}
                                                className="rounded-xl"
                                            >
                                                Edit Note
                                            </Button>
                                        )}
                                </div>
                            </div>

                            <div className="flex-1 space-y-5 overflow-y-auto p-5">
                                <div className="rounded-xl border bg-muted/20 p-4">
                                    <p className="whitespace-pre-line text-sm leading-7 text-foreground">
                                        {selectedNote.content || "No content"}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                                        <h4 className="text-sm font-medium">Attachments</h4>
                                    </div>

                                    {selectedNote.attachments && selectedNote.attachments.length > 0 ? (
                                        <div className="space-y-2">
                                            {selectedNote.attachments.map((attachment) => (
                                                <div
                                                    key={attachment.id}
                                                    className="flex items-center justify-between rounded-xl border bg-background px-4 py-3"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium">
                                                            {attachment.originalFileName}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {attachment.contentType} •{" "}
                                                            {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>

                                                    <div className="ml-4 flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openAttachment(attachment.id)}
                                                            className="gap-1 rounded-lg"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                            View
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            onClick={() => downloadAttachment(attachment.id)}
                                                            className="gap-1 rounded-lg"
                                                        >
                                                            <Download className="h-3.5 w-3.5" />
                                                            Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                                            No attachments
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {filteredNotes.length === 0 && (
                <p className="py-12 text-center text-sm text-muted-foreground">
                    No notes found
                </p>
            )}
        </div>
    )
}
