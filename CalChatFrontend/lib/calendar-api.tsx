export interface CalendarEventPayload {
    title: string
    date: string
    time: string
    type?: string
    priority?: "Low" | "Medium" | "High"
    color?: string
}

const API_URL = "https://calchat-backend.onrender.com/api/CalendarEvents"

export async function createCalendarEvent(event: CalendarEventPayload) {

    const token = localStorage.getItem("token")

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            ...event,
            date: new Date(event.date).toISOString()
        })
    })

    if (!response.ok) {
        const err = await response.text()
        throw new Error(err)
    }

    return await response.json()
}