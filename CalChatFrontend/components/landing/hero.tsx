import Link from "next/link"
import { ArrowRight, Calendar, MessageSquare, CheckCircle2, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 lg:px-8 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(160_84%_39%/0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            AI-Powered Productivity
          </div>
          <h1 className="font-heading text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            CalChat+ &ndash; AI Powered Calendar & Chat Assistant
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Smart productivity platform for Students, Personal Users, and Working Professionals. Manage your calendar, tasks, and get AI-powered assistance all in one place.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/register">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 px-8 bg-transparent" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>

        {/*<div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">*/}
        {/*  {[*/}
        {/*    { icon: Calendar, label: "Smart Calendar", value: "10k+" },*/}
        {/*    { icon: MessageSquare, label: "AI Chats", value: "50k+" },*/}
        {/*    { icon: CheckCircle2, label: "Tasks Done", value: "100k+" },*/}
        {/*    { icon: BarChart3, label: "Active Users", value: "5k+" },*/}
        {/*  ].map((stat) => (*/}
        {/*    <div*/}
        {/*      key={stat.label}*/}
        {/*      className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm"*/}
        {/*    >*/}
        {/*      <stat.icon className="h-6 w-6 text-primary" />*/}
        {/*      <span className="font-heading text-2xl font-bold text-foreground">{stat.value}</span>*/}
        {/*      <span className="text-sm text-muted-foreground">{stat.label}</span>*/}
        {/*    </div>*/}
        {/*  ))}*/}
        {/*</div>*/}
      </div>
    </section>
  )
}
