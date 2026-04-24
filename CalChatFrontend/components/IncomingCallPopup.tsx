"use client"

import { Phone, PhoneOff } from "lucide-react"
import { useCall } from "@/context/CallContext"

export default function IncomingCallPopup() {
    const { incomingCall, acceptCall, rejectCall } = useCall()

    if (!incomingCall) {
        return null
    }

    return (
        <div className="fixed bottom-5 right-5 z-[9999] w-[340px] overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_25px_70px_-35px_rgba(15,23,42,0.55)]">
            <div className="bg-[linear-gradient(135deg,#ecfeff_0%,#f8fafc_48%,#fef2f2_100%)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Incoming Call
                </p>

                <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
                        {incomingCall.fromUserName?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-slate-900">
                            {incomingCall.fromUserName}
                        </h3>
                        <p className="text-sm text-slate-500">
                            wants to start a voice call
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4">
                <button
                    onClick={rejectCall}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
                >
                    <PhoneOff className="h-4 w-4" />
                    Reject
                </button>

                <button
                    onClick={acceptCall}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
                >
                    <Phone className="h-4 w-4" />
                    Accept
                </button>
            </div>
        </div>
    )
}