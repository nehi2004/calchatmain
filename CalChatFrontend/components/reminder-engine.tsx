"use client"

import { useEffect } from "react"
import { showNotification, requestNotificationPermission } from "@/lib/reminder-service"

export default function ReminderEngine({ events }: any) {

    useEffect(() => {

        requestNotificationPermission()

        const interval = setInterval(() => {

            const now = new Date()

            events.forEach((event: any) => {

                const eventTime = new Date(`${event.date}T${event.time}`)

                const reminderTime = new Date(
                    eventTime.getTime() - event.reminderMinutes * 60000
                )

                if (
                    Math.abs(now.getTime() - reminderTime.getTime()) < 30000
                ) {

                    showNotification(
                        "Upcoming Event",
                        `${event.title} at ${event.time}`
                    )

                }

            })

        }, 30000)

        return () => clearInterval(interval)

    }, [events])

    return null
}
