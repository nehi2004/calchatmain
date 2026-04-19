'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from "@/components/ui/badge"

export default function MeetingDetailPage() {
    const { id } = useParams()
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        fetch(
            `https://steadfast-warmth-production-64c8.up.railway.app/api/meeting/${id}/detail`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(r => r.json())
            .then(setData)
    }, [id])

    if (!data) return <p className="p-6">Loading...</p>

    const summary = (() => {
        try {
            return typeof data.summary === 'string'
                ? JSON.parse(data.summary) : data.summary
        } catch { return null }
    })()

    const speakers = (() => {
        try {
            return typeof data.speakers === 'string'
                ? JSON.parse(data.speakers) : data.speakers
        } catch { return [] }
    })()

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">{data.title}</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    {new Date(data.startTime).toLocaleString()}
                </p>
            </div>

            {/* Summary */}
            {summary && (
                <div className="p-4 rounded-xl border space-y-3">
                    <h2 className="font-medium">Meeting Summary</h2>
                    <p className="text-sm text-muted-foreground">{summary.summary}</p>

                    {summary.key_points?.length > 0 && (
                        <div>
                            <p className="text-xs font-medium mb-1">Key Points</p>
                            {summary.key_points.map((p: string, i: number) => (
                                <p key={i} className="text-sm text-muted-foreground">
                                    • {p}
                                </p>
                            ))}
                        </div>
                    )}

                    {summary.action_items?.length > 0 && (
                        <div>
                            <p className="text-xs font-medium mb-1">Action Items</p>
                            {summary.action_items.map((a: any, i: number) => (
                                <div key={i} className="text-sm text-muted-foreground 
                                                         flex gap-2">
                                    <span>•</span>
                                    <span>{a.task} — <b>{a.assigned_to}</b> by {a.deadline}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Speakers */}
            {speakers?.length > 0 && (
                <div className="p-4 rounded-xl border space-y-2">
                    <h2 className="font-medium">Speakers</h2>
                    {speakers.map((s: any, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-24">{s.label}</span>
                            <div className="flex-1 bg-gray-100 dark:bg-white/10 
                                            rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${s.percentage}%` }}
                                />
                            </div>
                            <span className="text-xs text-muted-foreground w-16">
                                {s.duration}s ({s.percentage}%)
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Transcript */}
            {data.labeledTranscript && (
                <div className="p-4 rounded-xl border">
                    <h2 className="font-medium mb-3">Transcript</h2>
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap 
                                    font-sans leading-relaxed">
                        {data.labeledTranscript}
                    </pre>
                </div>
            )}
        </div>
    )
}