"use client"

import { Phone, PhoneOff } from "lucide-react"
import { useCall } from "@/context/CallContext"

export default function IncomingCallPopup() {
    const { incomingCall, acceptCall, rejectCall } = useCall()

    if (!incomingCall) {
        return null
    }

    return (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/55 backdrop-blur-md">
            <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-white/20 bg-white shadow-[0_30px_90px_-30px_rgba(15,23,42,0.65)]">
                <div className="bg-[linear-gradient(135deg,#ecfeff_0%,#eef2ff_45%,#fef2f2_100%)] px-6 py-8 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
                        Incoming Voice Call
                    </p>

                    <div className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 text-3xl font-semibold text-white shadow-lg">
                        {incomingCall.fromUserName?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <h3 className="mt-5 text-2xl font-semibold text-slate-900">
                        {incomingCall.fromUserName}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        is calling you...
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-5">
                    <button
                        onClick={rejectCall}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-4 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
                    >
                        <PhoneOff className="h-4 w-4" />
                        Decline
                    </button>

                    <button
                        onClick={acceptCall}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-4 text-sm font-medium text-white transition hover:bg-emerald-600"
                    >
                        <Phone className="h-4 w-4" />
                        Accept
                    </button>
                </div>
            </div>
        </div>
    )
}