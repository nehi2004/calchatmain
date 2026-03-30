"use client"

import { useEffect, useRef, useState } from "react"

export default function VideoCall() {

    const myVideo = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)

    useEffect(() => {

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(currentStream => {

            setStream(currentStream)

            if (myVideo.current) {
                myVideo.current.srcObject = currentStream
            }

        })

    }, [])

    return (
        <div>
            <h2>My Camera</h2>

            <video
                ref={myVideo}
                autoPlay
                muted
                style={{ width: "400px" }}
            />

        </div>
    )
}