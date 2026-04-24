"use client"

import { Phone, PhoneOff, Users, Video } from "lucide-react"
import { useCall } from "@/context/CallContext"

const getAvatarText = (name: string) => name.trim().charAt(0).toUpperCase() || "U"

export default function IncomingCallPopup() {
    const { incomingCall, acceptCall, rejectCall } = useCall()

    if (!incomingCall) {
        return null
    }

    return (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/55 backdrop-blur-md">
            <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-sky-100 bg-white text-slate-900 shadow-[0_30px_90px_-30px_rgba(15,23,42,0.4)]">
                <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50 px-6 py-4 text-sm text-slate-500">
                    Secure call request
                </div>

                <div className="px-6 py-8 text-center">
                    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-sky-100 text-4xl font-semibold text-sky-700">
                        {getAvatarText(incomingCall.callerName)}
                    </div>

                    <h3 className="mt-5 text-3xl font-semibold">{incomingCall.callerName}</h3>
                    <p className="mt-2 text-base text-slate-500">
                        {incomingCall.isGroup ? "Group " : ""}
                        {incomingCall.callType === "video" ? "video" : "voice"} call
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm text-sky-700">
                        {incomingCall.isGroup ? <Users className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                        <span>
                            {incomingCall.isGroup
                                ? `${incomingCall.participantIds.length + 1} participants`
                                : "Incoming call"}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-5">
                    <button
                        onClick={rejectCall}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-4 text-sm font-medium text-white transition hover:bg-rose-600"
                    >
                        <PhoneOff className="h-4 w-4" />
                        Decline
                    </button>

                    <button
                        onClick={acceptCall}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-4 text-sm font-medium text-white transition hover:bg-sky-700"
                    >
                        {incomingCall.callType === "video" ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                        Accept
                    </button>
                </div>
            </div>
        </div>
    )
}
