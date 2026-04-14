"use client"

import { useCall } from "@/context/CallContext"

export default function IncomingCallPopup() {

    const { incomingCall, acceptCall, rejectCall } = useCall()

    if (!incomingCall) return null

    return (
        <div className="fixed bottom-5 right-5 bg-white dark:bg-black border shadow-lg rounded-xl p-4 w-[300px] z-[9999]">

            <h3 className="font-semibold text-sm">📞 Incoming Call</h3>

            <p className="text-sm mt-1">
                {incomingCall.fromUserName} is calling...
            </p>

            <div className="flex gap-2 mt-3">

                <button
                    onClick={acceptCall}
                    className="flex-1 bg-green-500 text-white py-1 rounded-md"
                >
                    Accept
                </button>

                <button
                    onClick={rejectCall}
                    className="flex-1 bg-red-500 text-white py-1 rounded-md"
                >
                    Reject
                </button>

            </div>
        </div>
    )
}