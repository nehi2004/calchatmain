"use client";

import { useState } from "react";

export default function SendMessageBox({
    conversationId,
    onMessageSent,
}: {
    conversationId: string;
    onMessageSent: (msg: any) => void;
}) {
    const [message, setMessage] = useState("");

    const sendMessage = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("https://localhost:5009/api/user/send-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                conversationId,
                message,
            }),
        });

        const data = await res.json();
        onMessageSent(data);
        setMessage("");
    };

    return (
        <div style={{ marginTop: 10 }}>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}