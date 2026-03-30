"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Brain, Volume2, VolumeX, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const FOCUS_MODES = [
    { label: "Pomodoro", focusMinutes: 25, breakMinutes: 5, icon: Brain },
    { label: "Deep Work", focusMinutes: 50, breakMinutes: 10, icon: Brain },
    { label: "Short Sprint", focusMinutes: 15, breakMinutes: 3, icon: Brain },
]

const AMBIENT_SOUNDS = [
    { label: "Rain", file: "/sounds/hitslab.mp3" },
    { label: "Forest", file: "/sounds/learning.mp3" },
    { label: "Ocean", file: "/sounds/ocean.mp3" },
    { label: "Cafe", file: "/sounds/cafe.mp3" },
    { label: "Silence", file: null },
]

export function FocusView() {
    const [mode, setMode] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [isBreak, setIsBreak] = useState(false)
    const [seconds, setSeconds] = useState(FOCUS_MODES[0].focusMinutes * 60)
    const [sessions, setSessions] = useState(0)
    const [isLocked, setIsLocked] = useState(false)

    const [soundEnabled, setSoundEnabled] = useState(false)
    const [activeSound, setActiveSound] = useState(AMBIENT_SOUNDS[0])

    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const currentMode = FOCUS_MODES[mode]

    /* =========================
       BLOCK REFRESH
    ==========================*/
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isRunning) {
                e.preventDefault()
                e.returnValue = ""
            }
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [isRunning])

    /* =========================
       TIMER
    ==========================*/
    useEffect(() => {
        if (isRunning && seconds > 0) {
            intervalRef.current = setInterval(() => {
                setSeconds((s) => s - 1)
            }, 1000)
        }

        if (seconds === 0 && isRunning) {
            if (!isBreak) {
                setSessions((s) => s + 1)
                setIsBreak(true)
                setSeconds(currentMode.breakMinutes * 60)
            } else {
                setIsBreak(false)
                setSeconds(currentMode.focusMinutes * 60)
                stopFocus()
            }
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isRunning, seconds, isBreak, currentMode])

    /* =========================
       SOUND LOGIC
    ==========================*/
    useEffect(() => {
        if (!audioRef.current) return
        const audio = audioRef.current

        if (isRunning && soundEnabled && activeSound.file) {
            audio.src = activeSound.file
            audio.loop = true
            audio.volume = 0.6
            audio.play().catch(() => { })
        } else {
            audio.pause()
        }
    }, [isRunning, soundEnabled, activeSound])

    /* =========================
       FULLSCREEN
    ==========================*/
    const enterFullscreen = async () => {
        if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen()
        }
    }

    const exitFullscreen = async () => {
        if (document.fullscreenElement) {
            await document.exitFullscreen()
        }
    }

    /* =========================
       HANDLERS
    ==========================*/
    function startFocus() {
        setIsRunning(true)
        setIsLocked(true)
        enterFullscreen()
    }

    function stopFocus() {
        setIsRunning(false)
        setIsLocked(false)
        exitFullscreen()
    }

    function handleReset() {
        stopFocus()
        setIsBreak(false)
        setSeconds(currentMode.focusMinutes * 60)

        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
    }

    function handleModeChange(index: number) {
        if (isLocked) return
        setMode(index)
        setSeconds(FOCUS_MODES[index].focusMinutes * 60)
    }

    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60

    return (
        <div className="relative flex flex-col gap-6">

            {/* LOCK OVERLAY */}
            {isLocked && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
                    <Lock className="mb-4 h-12 w-12" />
                    <h2 className="text-3xl font-bold mb-2">Focus Mode Active</h2>
                    <p className="text-sm opacity-70 mb-8">
                        Stay focused. Pause to unlock.
                    </p>

                    <Button size="lg" variant="secondary" onClick={stopFocus}>
                        <Pause className="mr-2 h-5 w-5" />
                        Pause Session
                    </Button>
                </div>
            )}

            {/* MODE SELECTION */}
            <div className="grid gap-4 sm:grid-cols-3">
                {FOCUS_MODES.map((m, i) => (
                    <button
                        key={m.label}
                        disabled={isLocked}
                        onClick={() => handleModeChange(i)}
                        className={cn(
                            "flex flex-col items-center gap-1 rounded-xl border p-6 transition-all",
                            isLocked && "opacity-40 cursor-not-allowed",
                            mode === i
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-border bg-card"
                        )}
                    >
                        <m.icon className="h-6 w-6" />
                        <span className="font-semibold">{m.label}</span>
                        <span className="text-xs text-muted-foreground">
                            {m.focusMinutes}m / {m.breakMinutes}m
                        </span>
                    </button>
                ))}
            </div>

            {/* TIMER CARD */}
            <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 rounded-2xl border bg-card p-10">

                <span className="text-sm font-medium">
                    {isBreak ? "Break Time" : "Focus Time"}
                </span>

                <div className="text-5xl font-bold">
                    {String(minutes).padStart(2, "0")}:
                    {String(secs).padStart(2, "0")}
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={isLocked}
                        onClick={() => setSoundEnabled(!soundEnabled)}
                    >
                        {soundEnabled ? <Volume2 /> : <VolumeX />}
                    </Button>
                    {!isRunning ? (
                        <Button size="lg" onClick={startFocus}>
                            <Play className="mr-2 h-5 w-5" />
                            Start
                        </Button>
                    ) : (
                        <Button size="lg" onClick={stopFocus}>
                            <Pause className="mr-2 h-5 w-5" />
                            Pause
                        </Button>
                    )}

                   

                    <Button
                        variant="outline"
                        size="icon"
                        disabled={isLocked}
                        onClick={handleReset}
                    >
                        <RotateCcw />
                    </Button>
                </div>

                <div className="text-center">
                    <p className="text-2xl font-bold">{sessions}</p>
                    <p className="text-xs text-muted-foreground">
                        Completed Sessions
                    </p>
                </div>
            </div>

            {/* AMBIENT SOUNDS */}
            <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold">Ambient Sounds</h3>

                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {AMBIENT_SOUNDS.map((sound) => (
                        <button
                            key={sound.label}
                            disabled={isLocked}
                            onClick={() => {
                                setActiveSound(sound)
                                if (sound.file) setSoundEnabled(true)
                                else setSoundEnabled(false)
                            }}
                            className={cn(
                                "rounded-lg border p-3 text-sm",
                                isLocked && "opacity-40 cursor-not-allowed",
                                activeSound.label === sound.label && soundEnabled
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border text-muted-foreground"
                            )}
                        >
                            {sound.label}
                        </button>
                    ))}
                </div>
            </div>

            <audio ref={audioRef} />
        </div>
    )
}