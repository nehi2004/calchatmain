




//"use client"

//import React, { useState, useRef, useEffect } from "react"

//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Badge } from "@/components/ui/badge"
//import { ScrollArea } from "@/components/ui/scroll-area"
//import { Avatar, AvatarFallback } from "@/components/ui/avatar"
//import { v4 as uuidv4 } from "uuid"



//import {
//    Bot,
//    Send,
//    Calendar,
//    Clock,
//    Sparkles,
//    Mic,
//    Paperclip,
//    Check,
//    X
//} from "lucide-react"

//import { toast } from "sonner"

//interface Message {
//    id: string
//    role: "user" | "assistant"
//    content: string
//    timestamp: string
//    actions?: {
//        type: "confirm" | "edit" | "cancel" | "suggestion"
//        data?: Record<string, any>
//    }[]

//}

//interface SuggestedAction {
//    label: string
//    prompt: string
//    icon: any
//}

//const suggestedActions: SuggestedAction[] = [
//    { label: "Schedule a meeting", prompt: "Schedule a meeting with the team tomorrow at 2 PM", icon: Calendar },
//    { label: "Find free time", prompt: "When am I free this week?", icon: Clock },
//    { label: "Reschedule event", prompt: "Reschedule my 3 PM meeting to Friday", icon: Clock },
//    { label: "Create reminder", prompt: "Remind me about the project deadline next Monday", icon: Sparkles }
//]

//const initialMessages: Message[] = [
//    {
//        id: uuidv4(),
//        role: "assistant",
//        content:
//            "Hello! I'm your CalChat AI assistant. I can help you schedule meetings, find available times, manage your calendar, and more. What would you like to do today?",
//        timestamp: new Date().toISOString()
//    }
//]

//export function ChatView() {

//    const [messages, setMessages] = useState<Message[]>(initialMessages)
//    const [input, setInput] = useState("")
//    const [isTyping, setIsTyping] = useState(false)
//    const [mounted, setMounted] = useState(false)

//    const scrollRef = useRef<HTMLDivElement>(null)
//    const inputRef = useRef<HTMLInputElement>(null)

//    useEffect(() => {
//        setMounted(true)
//    }, [])

//    useEffect(() => {
//        scrollRef.current?.scrollTo({
//            top: scrollRef.current.scrollHeight,
//            behavior: "smooth"
//        })
//    }, [messages])




//    // ✅ SEND MESSAGE TO BACKEND AI
//    const handleSend = async () => {

//        if (!input.trim()) return

//        const userMessage: Message = {
//            id: uuidv4(),
//            role: "user",
//            content: input,
//            timestamp: new Date().toISOString()
//        }

//        setMessages(prev => [...prev, userMessage])
//        setInput("")
//        setIsTyping(true)

//        try {

//            const token = localStorage.getItem("token")

//            if (!token) {
//                toast.error("User not authenticated")
//                setIsTyping(false)
//                return
//            }



//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/ai/chat", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },
//                body: JSON.stringify({
//                    message: userMessage.content
//                })
//            })

//            if (!res.ok) {

//                const text = await res.text()

//                console.error("API error:", res.status, text)

//                throw new Error(text || "API error")

//            }


//            let data

//            try {
//                data = await res.json()
//            } catch {
//                throw new Error("Invalid AI response")
//            }


//            const aiMessage: Message = {
//                id: uuidv4(),
//                role: "assistant",
//                content: data.reply,
//                timestamp: new Date().toISOString(),
//                actions: data.action === "confirm_event"
//                    ? [
//                        { type: "confirm", data: data.eventData },
//                        { type: "edit", data: data.eventData },
//                        { type: "cancel", data: data.eventData }
//                    ]
//                    : undefined
//            }

//            setMessages(prev => [...prev, aiMessage])

//        } catch (error) {

//            console.error(error)

//            setMessages(prev => [...prev, {
//                id: uuidv4(),
//                role: "assistant",
//                content: "⚠️ Failed to connect to AI server.",
//                timestamp: new Date().toISOString()
//            }])

//        }

//        setIsTyping(false)

//    }

//    const sendAICommand = async (command: string) => {

//        const userMessage: Message = {
//            id: uuidv4(),
//            role: "user",
//            content: command,
//            timestamp: new Date().toISOString()
//        }

//        setMessages(prev => [...prev, userMessage])
//        setIsTyping(true)

//        try {

//            const token = localStorage.getItem("token")
//            if (!token) {
//                toast.error("User not authenticated")
//                setIsTyping(false)
//                return
//            }



//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/ai/chat", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },
//                body: JSON.stringify({
//                    message: command
//                })
//            })

//            const data = await res.json()

//            const aiMessage: Message = {
//                id: uuidv4(),
//                role: "assistant",
//                content: data.reply,
//                timestamp: new Date().toISOString()
//            }

//            setMessages(prev => [...prev, aiMessage])

//        } catch (err) {

//            console.error(err)

//        }

//        setIsTyping(false)

//    }
//    const addSuccessSuggestions = () => {

//        const suggestionMessage: Message = {
//            id: uuidv4(),
//            role: "assistant",
//            content: "🎉 Event successfully added to your calendar!\n\nWhat would you like to do next?",
//            timestamp: new Date().toISOString(),
//            actions: [
//                { type: "suggestion", data: { label: "Schedule another meeting", prompt: "Schedule a meeting tomorrow" } },
//                { type: "suggestion", data: { label: "Find free time", prompt: "When am I free tomorrow?" } },
//                { type: "suggestion", data: { label: "Create reminder", prompt: "Remind me about my tasks tomorrow" } }
//            ]
//        }

//        setMessages(prev => [...prev, suggestionMessage])

//    }


//    useEffect(() => {

//        const loadHistory = async () => {

//            try {

//                const token = localStorage.getItem("token")




//                if (!token) {
//                    console.warn("No token found")
//                    return
//                }

//                const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/ai/history", {
//                    method: "GET",
//                    headers: {
//                        "Content-Type": "application/json",
//                        Authorization: `Bearer ${token}`
//                    }
//                })

//                if (!res.ok) {
//                    console.error("History API error:", res.status)
//                    return
//                }

//                const data = await res.json()

//                if (!data || data.length === 0) {
//                    return
//                }

//                const formatted = data.map((m: any) => ({
//                    id: uuidv4(), // always generate unique key
//                    role: m.role === "assistant" ? "assistant" : "user",
//                    content: m.message,
//                    timestamp: m.timestamp || new Date().toISOString()
//                }))

//                setMessages(prev => [...prev, ...formatted])



//            } catch (err) {

//                console.error("Failed to load chat history:", err)

//            }

//        }

//        loadHistory()

//    }, [])


//    const handleCreateCalendarEvent = async (data?: any) => {

//        try {

//            const token = localStorage.getItem("token")

//            if (!token) {
//                toast.error("User not authenticated")
//                setIsTyping(false)
//                return
//            }



//            await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/CalendarEvents", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },
//                body: JSON.stringify({
//                    title: data?.title || "AI Event",
//                    date: new Date(data?.date || Date.now()).toISOString(),
//                    time: data?.time || "09:00",
//                    type: "AI",
//                    priority: "Medium",
//                    color: "#3b82f6"
//                })
//            })

//            toast.success("Event added to calendar")

//        } catch (err) {

//            toast.error("Failed to add event")

//        }

//    }

//    const handleKeyDown = (e: React.KeyboardEvent) => {
//        if (e.key === "Enter") {
//            e.preventDefault()
//            handleSend()
//        }
//    }

//    return (

//        <div className="flex h-[calc(100vh-8rem)] flex-col">

//            {/* HEADER */}

//            <div className="mb-4 flex justify-between items-center">

//                <div>
//                    <h1 className="text-2xl font-bold">AI Assistant</h1>
//                    <p className="text-muted-foreground text-sm">
//                        Chat with CalChat to manage your calendar
//                    </p>
//                </div>

//                <Badge variant="secondary">
//                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
//                    Online
//                </Badge>

//            </div>

//            <div className="grid flex-1 gap-6 lg:grid-cols-4 overflow-hidden">


//                {/* CHAT AREA */}

//                <Card className="flex flex-col lg:col-span-3 h-full overflow-hidden">



//                    <CardHeader className="border-b">

//                        <div className="flex items-center gap-3">

//                            <div className="bg-primary/10 rounded-full p-2">
//                                <Bot className="h-5 w-5 text-primary" />
//                            </div>

//                            <div>
//                                <CardTitle className="text-base">
//                                    CalChat Assistant
//                                </CardTitle>
//                                <p className="text-xs text-muted-foreground">
//                                    Powered by AI
//                                </p>
//                            </div>

//                        </div>

//                    </CardHeader>

//                    {/* MESSAGES */}

//                    <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>

//                        <div>



//                            <div className="space-y-4">

//                                {messages.map((message, index) => (

//                                    <div
//                                        key={message.id}
//                                        className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
//                                    >

//                                        <Avatar className="h-8 w-8">

//                                            <AvatarFallback>

//                                                {message.role === "assistant"
//                                                    ? <Bot className="h-4 w-4" />
//                                                    : "U"}

//                                            </AvatarFallback>

//                                        </Avatar>

//                                        <div className={`max-w-[80%] space-y-1 ${message.role === "user" ? "text-right" : ""}`}>

//                                            <div
//                                                className={`inline-block px-4 py-2 rounded-lg text-sm
//${message.role === "user"
//                                                        ? "bg-primary text-primary-foreground"
//                                                        : "bg-muted"}`}
//                                            >

//                                                <div className="whitespace-pre-wrap">
//                                                    {message.content}
//                                                </div>

//                                            </div>

//                                            {message.actions && (

//                                                <div className="flex gap-2 flex-wrap">
//                                                    {message.actions.map((action, i) => (

//                                                        <div key={i}>

//                                                            {/* CONFIRM EVENT */}
//                                                            {(action.type === "confirm" || action.type === "edit" || action.type === "cancel") && (

//                                                                <>
//                                                                    <Button
//                                                                        size="sm"
//                                                                        onClick={async () => {

//                                                                            await handleCreateCalendarEvent(action.data)

//                                                                            setMessages(prev => [
//                                                                                ...prev,
//                                                                                {
//                                                                                    id: uuidv4(),
//                                                                                    role: "assistant",
//                                                                                    content: "✅ Event added to calendar.",
//                                                                                    timestamp: new Date().toISOString()
//                                                                                }
//                                                                            ])


//                                                                        }}
//                                                                    >
//                                                                        <Check className="h-3 w-3 mr-1" />
//                                                                        Confirm
//                                                                    </Button>

//                                                                    <Button
//                                                                        size="sm"
//                                                                        variant="secondary"
//                                                                        onClick={() => {

//                                                                            setInput(
//                                                                                `reschedule ${action.data?.title} ${action.data?.time}`
//                                                                            )

//                                                                            inputRef.current?.focus()

//                                                                        }}
//                                                                    >
//                                                                        ✏️ Edit
//                                                                    </Button>


//                                                                    <Button
//                                                                        size="sm"
//                                                                        variant="ghost"
//                                                                        onClick={() => {

//                                                                            setMessages(prev => [...prev, {
//                                                                                id: uuidv4(),
//                                                                                role: "assistant",
//                                                                                content: "❌ Event creation cancelled.",
//                                                                                timestamp: new Date().toISOString()
//                                                                            }])

//                                                                        }}
//                                                                    >
//                                                                        <X className="h-3 w-3 mr-1" />
//                                                                        Cancel
//                                                                    </Button>
//                                                                </>

//                                                            )}

//                                                            {/* SUGGESTION BUTTONS */}
//                                                            {action.type === "suggestion" && (

//                                                                <Button
//                                                                    size="sm"
//                                                                    variant="outline"
//                                                                    onClick={() => setInput(action.data?.prompt)}
//                                                                >
//                                                                    {action.data?.label}
//                                                                </Button>

//                                                            )}

//                                                        </div>

//                                                    ))}



//                                                </div>

//                                            )}

//                                            <p
//                                                className="text-[10px] text-muted-foreground"
//                                                suppressHydrationWarning
//                                            >

//                                                {mounted &&
//                                                    new Date(message.timestamp).toLocaleTimeString([], {
//                                                        hour: "2-digit",
//                                                        minute: "2-digit"
//                                                    })}

//                                            </p>

//                                        </div>

//                                    </div>

//                                ))}

//                                {isTyping && (

//                                    <div className="flex gap-2">

//                                        <Bot className="h-4 w-4" />

//                                        <span className="text-xs text-muted-foreground">
//                                            AI is typing...
//                                        </span>

//                                    </div>

//                                )}

//                            </div>
//                        </div>
//</div>

//                    {/* INPUT */}

//                    <CardContent className="border-t p-4">

//                        <div className="flex gap-2">

//                            <Button variant="ghost" size="icon">
//                                <Paperclip className="h-4 w-4" />
//                            </Button>

//                            <Input
//                                ref={inputRef}
//                                value={input}
//                                onChange={e => setInput(e.target.value)}
//                                onKeyDown={handleKeyDown}
//                                placeholder="Type message..."
//                            />

//                            <Button variant="ghost" size="icon">
//                                <Mic className="h-4 w-4" />
//                            </Button>

//                            <Button
//                                onClick={handleSend}
//                                disabled={!input.trim() || isTyping}
//                            >

//                                <Send className="h-4 w-4" />

//                            </Button>

//                        </div>

//                    </CardContent>

//                </Card>

//                {/* SIDEBAR */}

//                <div className="hidden lg:block space-y-4 sticky top-4 h-fit">


//                    <Card>

//                        <CardHeader>
//                            <CardTitle className="text-sm">
//                                Quick Actions
//                            </CardTitle>
//                        </CardHeader>

//                        <CardContent className="space-y-2">

//                            {suggestedActions.map((action, i) => (

//                                <Button
//                                    key={i}
//                                    variant="outline"
//                                    className="w-full justify-start gap-2"
//                                    onClick={() => setInput(action.prompt)}
//                                >

//                                    <action.icon className="h-4 w-4" />
//                                    <span className="text-xs">
//                                        {action.label}
//                                    </span>

//                                </Button>

//                            ))}

//                        </CardContent>

//                    </Card>

//                </div>

//            </div>

//        </div>

//    )
//}





//"use client"

//import React, { useState, useRef, useEffect } from "react"

//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Badge } from "@/components/ui/badge"
//import { Avatar, AvatarFallback } from "@/components/ui/avatar"
//import { v4 as uuidv4 } from "uuid"

//import {
//    Bot,
//    Send,
//    Calendar,
//    Clock,
//    Sparkles,
//    Mic,
//    Paperclip,
//    Check,
//    X
//} from "lucide-react"

//import { toast } from "sonner"

//interface Message {
//    id: string
//    role: "user" | "assistant"
//    content: string
//    timestamp: string
//    actions?: {
//        type: "confirm" | "edit" | "cancel" | "suggestion"
//        data?: Record<string, any>
//    }[]
//}

//interface SuggestedAction {
//    label: string
//    prompt: string
//    icon: any
//}

//const suggestedActions: SuggestedAction[] = [
//    { label: "Schedule a meeting", prompt: "Schedule a meeting tomorrow 2pm", icon: Calendar },
//    { label: "Find free time", prompt: "When am I free this week?", icon: Clock },
//    { label: "Show my Schedule", prompt: "Show my schedule", icon: Clock },
//    { label: "Create reminder", prompt: "Remind me about my task tomorrow", icon: Sparkles }
//]

//const initialMessages: Message[] = [
//    {
//        id: uuidv4(),
//        role: "assistant",
//        content: "Hello! I'm your CalChat AI assistant.",
//        timestamp: new Date().toISOString()
//    }
//]

//export function ChatView() {

//    const [messages, setMessages] = useState<Message[]>(initialMessages)
//    const [input, setInput] = useState("")
//    const [isTyping, setIsTyping] = useState(false)
//    const [mounted, setMounted] = useState(false)

//    const scrollRef = useRef<HTMLDivElement>(null)
//    const inputRef = useRef<HTMLInputElement>(null)

//    useEffect(() => { setMounted(true) }, [])

//    useEffect(() => {
//        scrollRef.current?.scrollTo({
//            top: scrollRef.current.scrollHeight,
//            behavior: "smooth"
//        })
//    }, [messages])

//    useEffect(() => {

//        const loadHistory = async () => {

//            try {

//                const token = localStorage.getItem("token")

//                const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/ai/history", {
//                    headers: {
//                        Authorization: `Bearer ${token}`
//                    }
//                })

//                const data = await res.json()

//                const historyMessages: Message[] = data
//                    .sort((a: any, b: any) =>
//                        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//                    )
//                    .map((item: any) => ({
//                        id: uuidv4(),
//                        role: item.role,
//                        content: item.message,
//                        timestamp: item.timestamp
//                    }))

//                if (historyMessages.length > 0) {
//                    setMessages(historyMessages.length ? historyMessages : initialMessages)
//                }

//            } catch (err) {

//                console.error("History load error", err)

//            }

//        }

//        loadHistory()

//    }, [])

//    const handleSend = async () => {

//        if (!input.trim()) return

//        const userMessage: Message = {
//            id: uuidv4(),
//            role: "user",
//            content: input,
//            timestamp: new Date().toISOString()
//        }

//        setMessages(prev => [...prev, userMessage])
//        setInput("")
//        setIsTyping(true)

//        try {

//            const token = localStorage.getItem("token")

//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/ai/chat", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },
//                body: JSON.stringify({ message: userMessage.content })
//            })

//            const data = await res.json()

//            const aiMessage: Message = {
//                id: uuidv4(),
//                role: "assistant",
//                content: data.reply,
//                timestamp: new Date().toISOString(),
//                actions: data.action === "confirm_event"
//                    ? [
//                        { type: "confirm", data: data.eventData },
//                        { type: "edit", data: data.eventData },
//                        { type: "cancel", data: data.eventData }
//                    ]
//                    : undefined
//            }

//            setMessages(prev => [...prev, aiMessage])

//            // 🔥 SAVE AI MESSAGE
//            await saveMessageToDB("assistant", aiMessage.content)


//        } catch {

//            setMessages(prev => [
//                ...prev,
//                {
//                    id: uuidv4(),
//                    role: "assistant",
//                    content: "⚠️ AI server error",
//                    timestamp: new Date().toISOString()
//                }
//            ])

//        }

//        setIsTyping(false)

//    }

//    const handleCreateCalendarEvent = async (data?: any) => {

//        try {

//            const token = localStorage.getItem("token")

//            await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/CalendarEvents", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },
//                body: JSON.stringify({
//                    title: data?.title || "AI Event",
//                    date: data?.date,
//                    time: data?.time || "09:00",
//                    type: "AI",
//                    priority: "Medium",
//                    color: "#3b82f6"
//                })
//            })

//            toast.success("Event added to calendar")

//        } catch {

//            toast.error("Failed to add event")

//        }

//    }
//    const saveMessageToDB = async (role: "user" | "assistant", content: string) => {
//        try {
//            const token = localStorage.getItem("token")

//            await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/ai/save-action", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${token}`
//                },
//                body: JSON.stringify({
//                    role,
//                    message: content
//                })
//            })
//        } catch (err) {
//            console.error("Save error:", err)
//        }
//    }


//    const handleKeyDown = (e: React.KeyboardEvent) => {
//        if (e.key === "Enter") {
//            e.preventDefault()
//            handleSend()
//        }
//    }

//    return (

//        <div className="flex h-[calc(100vh-8rem)] flex-col">

//            {/* HEADER */}

//            <div className="mb-4 flex justify-between items-center">

//                <div>
//                    <h1 className="text-2xl font-bold">AI Assistant</h1>
//                    <p className="text-muted-foreground text-sm">
//                        Chat with CalChat to manage your calendar
//                    </p>
//                </div>

//                <Badge variant="secondary">
//                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
//                    Online
//                </Badge>

//            </div>

//            <div className="grid flex-1 gap-6 lg:grid-cols-4 overflow-hidden">

//                {/* CHAT */}

//                <Card className="flex flex-col lg:col-span-3 h-full overflow-hidden">

//                    <CardHeader className="border-b">
//                        <CardTitle className="text-base flex gap-2 items-center">
//                            <Bot className="h-5 w-5" />
//                            CalChat Assistant
//                        </CardTitle>
//                    </CardHeader>

//                    {/* MESSAGES */}

//                    <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>

//                        <div className="space-y-4">

//                            {messages.map(message => (
//                                <div
//                                    key={message.id}
//                                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
//                                >

//                                    <Avatar className="h-8 w-8">
//                                        <AvatarFallback>
//                                            {message.role === "assistant" ? <Bot className="h-4 w-4" /> : "U"}
//                                        </AvatarFallback>
//                                    </Avatar>

//                                    <div className={`max-w-[80%] space-y-1 ${message.role === "user" ? "text-right" : ""}`}>

//                                        <div className={`inline-block px-4 py-2 rounded-lg text-sm ${message.role === "user"
//                                                ? "bg-primary text-primary-foreground"
//                                                : "bg-muted"
//                                            }`}>

//                                            <div className="whitespace-pre-wrap">
//                                                {message.content}
//                                            </div>

//                                        </div>

//                                        {message.actions && (

//                                            <div className="flex gap-2 flex-wrap">

//                                                {message.actions.map((action, i) => (
//                                                    <div key={i}>
//                                                        {action.type === "confirm" && (
//                                                            <Button
//                                                                size="sm"
//                                                                onClick={async () => {

//                                                                    await handleCreateCalendarEvent(action.data)

//                                                                    const confirmMessage = `🎉 Event successfully added to your calendar!

//📅 ${action.data?.title}
//🗓 ${action.data?.date}
//⏰ ${action.data?.time}

//You're all set! 🚀`

//                                                                    setMessages(prev => [
//                                                                        ...prev,
//                                                                        {
//                                                                            id: uuidv4(),
//                                                                            role: "assistant",
//                                                                            content: confirmMessage,
//                                                                            timestamp: new Date().toISOString()
//                                                                        }
//                                                                    ])

//                                                                    // 🔥 SAVE (THIS WAS MISSING)
//                                                                    await saveMessageToDB("assistant", confirmMessage)

//                                                                }}
//                                                            >
//                                                                <Check className="h-3 w-3 mr-1" />
//                                                                Confirm
//                                                            </Button>
//                                                        )}




//                                                        {action.type === "edit" && (
//                                                            <Button
//                                                                size="sm"
//                                                                variant="secondary"
//                                                                onClick={() => {
//                                                                    setInput(`schedule ${action.data?.title} ${action.data?.date.split("T")[0]} ${action.data?.time}`)

//                                                                    inputRef.current?.focus()
//                                                                }}
//                                                            >
//                                                                ✏️ Edit
//                                                            </Button>
//                                                        )}
//                                                        {action.type === "cancel" && (
//                                                            <Button
//                                                                size="sm"
//                                                                variant="ghost"
//                                                                onClick={async () => {

//                                                                    const cancelMessage = `❌ No problem!

//The event was not added to your calendar.
//If you'd like, you can schedule another one anytime. 😊`

//                                                                    setMessages(prev => [
//                                                                        ...prev,
//                                                                        {
//                                                                            id: uuidv4(),
//                                                                            role: "assistant",
//                                                                            content: cancelMessage,
//                                                                            timestamp: new Date().toISOString()
//                                                                        }
//                                                                    ])

//                                                                    // 🔥 SAVE
//                                                                    await saveMessageToDB("assistant", cancelMessage)

//                                                                }}
//                                                            >
//                                                                <X className="h-3 w-3 mr-1" />
//                                                                Cancel
//                                                            </Button>
//                                                        )}


//                                                    </div>
//                                                ))}

//                                            </div>

//                                        )}

//                                        <p className="text-[10px] text-muted-foreground">
//                                            {mounted && new Date(message.timestamp).toLocaleTimeString([], {
//                                                hour: "2-digit",
//                                                minute: "2-digit"
//                                            })}
//                                        </p>

//                                    </div>

//                                </div>
//                            ))}

//                            {isTyping && (
//                                <div className="flex gap-2 text-xs text-muted-foreground">
//                                    <Bot className="h-4 w-4" /> AI typing...
//                                </div>
//                            )}

//                        </div>

//                    </div>

//                    {/* INPUT */}

//                    <CardContent className="border-t p-4">

//                        <div className="flex gap-2">

//                            <Button variant="ghost" size="icon">
//                                <Paperclip className="h-4 w-4" />
//                            </Button>

//                            <Input
//                                ref={inputRef}
//                                value={input}
//                                onChange={(e) => setInput(e.target.value)}
//                                onKeyDown={handleKeyDown}
//                                placeholder="Type message..."
//                            />

//                            <Button variant="ghost" size="icon">
//                                <Mic className="h-4 w-4" />
//                            </Button>

//                            <Button
//                                onClick={handleSend}
//                                disabled={!input.trim() || isTyping}
//                            >
//                                <Send className="h-4 w-4" />
//                            </Button>

//                        </div>

//                    </CardContent>

//                </Card>

//                {/* SIDEBAR */}

//                <div className="hidden lg:block space-y-4">

//                    <Card>

//                        <CardHeader>
//                            <CardTitle className="text-sm">
//                                Quick Actions
//                            </CardTitle>
//                        </CardHeader>

//                        <CardContent className="space-y-2">

//                            {suggestedActions.map((action, i) => (
//                                <Button
//                                    key={i}
//                                    variant="outline"
//                                    className="w-full justify-start gap-2"
//                                    onClick={() => setInput(action.prompt)}
//                                >
//                                    <action.icon className="h-4 w-4" />
//                                    <span className="text-xs">{action.label}</span>
//                                </Button>
//                            ))}

//                        </CardContent>

//                    </Card>

//                </div>

//            </div>

//        </div>

//    )

//}





"use client"

import React, { useState, useRef, useEffect } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { v4 as uuidv4 } from "uuid"
import * as signalR from "@microsoft/signalr"

import {
    Bot,
    Send,
    Calendar,
    Clock,
    Sparkles,
    Mic,
    Paperclip,
    Check,
    X
} from "lucide-react"

import { toast } from "sonner"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: string
    actions?: {
        type: "confirm" | "edit" | "cancel" | "suggestion"
        data?: Record<string, any>
    }[]
}

interface SuggestedAction {
    label: string
    prompt: string
    icon: any
}

const suggestedActions: SuggestedAction[] = [
    { label: "Schedule a meeting", prompt: "Schedule a meeting tomorrow 2pm", icon: Calendar },
    { label: "Find free time", prompt: "When am I free this week?", icon: Clock },
    { label: "Show my Schedule", prompt: "Show my schedule", icon: Clock },
    { label: "Create reminder", prompt: "Remind me about my task tomorrow", icon: Sparkles }
]

const initialMessages: Message[] = [
    {
        id: uuidv4(),
        role: "assistant",
        content: "Hello! I'm your CalChat AI assistant.",
        timestamp: new Date().toISOString()
    }
]

export function ChatView() {

    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [mounted, setMounted] = useState(false)

    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null)


   
    useEffect(() => {
        let connection: signalR.HubConnection | null = null

        const startConnection = async () => {
            const token = localStorage.getItem("token")
            if (!token) return

            connection = new signalR.HubConnectionBuilder()
                .withUrl("https://steadfast-warmth-production-31cc.up.railway.app/chatHub", {
                    accessTokenFactory: () => token,
                    transport: signalR.HttpTransportType.WebSockets
                })
                .withAutomaticReconnect()
                .build()

            try {
                await connection.start()
                console.log("✅ SignalR Connected")

                connection.on("ReceiveNotification", (data) => {
                    toast.success(data.message || "New Notification")
                })

                setConnection(connection)
            } catch (err) {
                console.error("❌ Connection failed:", err)
            }
        }

        startConnection()

        // ✅ CLEANUP (VERY IMPORTANT)
        return () => {
            if (connection) {
                connection.stop()
                console.log("🛑 SignalR Disconnected")
            }
        }
    }, [])




    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth"
        })
    }, [messages])

    useEffect(() => {

        const loadHistory = async () => {

            try {

                const token = localStorage.getItem("token")

                const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/ai/history", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const data = await res.json()

                const historyMessages: Message[] = data
                    .sort((a: any, b: any) =>
                        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    )
                    .map((item: any) => ({
                        id: uuidv4(),
                        role: item.role,
                        content: item.message,
                        timestamp: item.timestamp
                    }))
                if (historyMessages.length > 0) {
                    setMessages(historyMessages)
                } else {
                    setMessages(initialMessages)
                }

            } catch (err) {

                console.error("History load error", err)

            }

        }

        loadHistory()

    }, [])

    const handleSend = async () => {

        if (!input.trim()) return

        const userMessage: Message = {
            id: uuidv4(),
            role: "user",
            content: input,
            timestamp: new Date().toISOString()
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsTyping(true)

        try {

            const token = localStorage.getItem("token")

            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/ai/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMessage.content })
            })

            const data = await res.json()

            const aiMessage: Message = {
                id: uuidv4(),
                role: "assistant",
                content: data.reply,
                timestamp: new Date().toISOString(),
                actions: data.action === "confirm_event"
                    ? [
                        { type: "confirm", data: data.eventData },
                        { type: "edit", data: data.eventData },
                        { type: "cancel", data: data.eventData }
                    ]
                    : undefined
            }

            setMessages(prev => [...prev, aiMessage])

            // 🔥 SAVE AI MESSAGE
            //await saveMessageToDB("assistant", aiMessage.content)


        } catch {

            setMessages(prev => [
                ...prev,
                {
                    id: uuidv4(),
                    role: "assistant",
                    content: "⚠️ AI server error",
                    timestamp: new Date().toISOString()
                }
            ])

        }

        setIsTyping(false)

    }

    const handleCreateCalendarEvent = async (data?: any) => {

        try {

            const token = localStorage.getItem("token")

            await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/CalendarEvents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: data?.title || "AI Event",
                    date: data?.date,
                    time: data?.time || "09:00",
                    type: "AI",
                    priority: "Medium",
                    color: "#3b82f6"
                })
            })

            toast.success("Event added to calendar")

        } catch {

            toast.error("Failed to add event")

        }

    }
    const saveMessageToDB = async (role: "user" | "assistant", content: string) => {
        try {
            const token = localStorage.getItem("token")

            await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/ai/save-action", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    role,
                    message: content
                })
            })
        } catch (err) {
            console.error("Save error:", err)
        }
    }


    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleSend()
        }
    }

    return (

        <div className="flex h-[calc(100vh-8rem)] flex-col">

            {/* HEADER */}

            <div className="mb-4 flex justify-between items-center">

                <div>
                    <h1 className="text-2xl font-bold">AI Assistant</h1>
                    <p className="text-muted-foreground text-sm">
                        Chat with CalChat to manage your calendar
                    </p>
                </div>

                <Badge variant="secondary">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                    Online
                </Badge>

            </div>

            <div className="grid flex-1 gap-6 lg:grid-cols-4 overflow-hidden">

                {/* CHAT */}

                <Card className="flex flex-col lg:col-span-3 h-full overflow-hidden">

                    <CardHeader className="border-b">
                        <CardTitle className="text-base flex gap-2 items-center">
                            <Bot className="h-5 w-5" />
                            CalChat Assistant
                        </CardTitle>
                    </CardHeader>

                    {/* MESSAGES */}

                    <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>

                        <div className="space-y-4">

                            {messages.map(message => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                                >

                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            {message.role === "assistant" ? <Bot className="h-4 w-4" /> : "U"}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className={`max-w-[80%] space-y-1 ${message.role === "user" ? "text-right" : ""}`}>

                                        <div className={`inline-block px-4 py-2 rounded-lg text-sm ${message.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                            }`}>

                                            <div className="whitespace-pre-wrap">
                                                {message.content}
                                            </div>

                                        </div>

                                        {message.actions && (

                                            <div className="flex gap-2 flex-wrap">

                                                {message.actions.map((action, i) => (
                                                    <div key={i}>
                                                        {action.type === "confirm" && (
                                                            <Button
                                                                size="sm"
                                                                onClick={async () => {

                                                                    await handleCreateCalendarEvent(action.data)

                                                                    const confirmMessage = `🎉 Event successfully added to your calendar!

📅 ${action.data?.title}
🗓 ${action.data?.date}
⏰ ${action.data?.time}

You're all set! 🚀`

                                                                    setMessages(prev => [
                                                                        ...prev,
                                                                        {
                                                                            id: uuidv4(),
                                                                            role: "assistant",
                                                                            content: confirmMessage,
                                                                            timestamp: new Date().toISOString()
                                                                        }
                                                                    ])

                                                                    // 🔥 SAVE (THIS WAS MISSING)
                                                                    await saveMessageToDB("assistant", confirmMessage)

                                                                }}
                                                            >
                                                                <Check className="h-3 w-3 mr-1" />
                                                                Confirm
                                                            </Button>
                                                        )}




                                                        {action.type === "edit" && (
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                onClick={() => {
                                                                    setInput(`schedule ${action.data?.title} ${action.data?.date.split("T")[0]} ${action.data?.time}`)

                                                                    inputRef.current?.focus()
                                                                }}
                                                            >
                                                                ✏️ Edit
                                                            </Button>
                                                        )}
                                                        {action.type === "cancel" && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={async () => {

                                                                    const cancelMessage = `❌ No problem!

The event was not added to your calendar.
If you'd like, you can schedule another one anytime. 😊`

                                                                    setMessages(prev => [
                                                                        ...prev,
                                                                        {
                                                                            id: uuidv4(),
                                                                            role: "assistant",
                                                                            content: cancelMessage,
                                                                            timestamp: new Date().toISOString()
                                                                        }
                                                                    ])

                                                                    // 🔥 SAVE
                                                                    await saveMessageToDB("assistant", cancelMessage)

                                                                }}
                                                            >
                                                                <X className="h-3 w-3 mr-1" />
                                                                Cancel
                                                            </Button>
                                                        )}


                                                    </div>
                                                ))}

                                            </div>

                                        )}

                                        <p className="text-[10px] text-muted-foreground">
                                            {mounted && new Date(message.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </p>

                                    </div>

                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                    <Bot className="h-4 w-4" /> AI typing...
                                </div>
                            )}

                        </div>

                    </div>

                    {/* INPUT */}

                    <CardContent className="border-t p-4">

                        <div className="flex gap-2">

                            <Button variant="ghost" size="icon">
                                <Paperclip className="h-4 w-4" />
                            </Button>

                            <Input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type message..."
                            />

                            <Button variant="ghost" size="icon">
                                <Mic className="h-4 w-4" />
                            </Button>

                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                            >
                                <Send className="h-4 w-4" />
                            </Button>

                        </div>

                    </CardContent>

                </Card>

                {/* SIDEBAR */}

                <div className="hidden lg:block space-y-4">

                    <Card>

                        <CardHeader>
                            <CardTitle className="text-sm">
                                Quick Actions
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">

                            {suggestedActions.map((action, i) => (
                                <Button
                                    key={i}
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                    onClick={() => setInput(action.prompt)}
                                >
                                    <action.icon className="h-4 w-4" />
                                    <span className="text-xs">{action.label}</span>
                                </Button>
                            ))}

                        </CardContent>

                    </Card>

                </div>

            </div>

        </div>

    )

}


