import Link from "next/link"
import { Calendar } from "lucide-react"

export function Footer() {
  return (
    <footer id="about" className="border-t border-border bg-card px-4 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold text-foreground">CalChat+</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              AI-powered productivity platform for everyone. Manage your time smarter, not harder.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold text-foreground">Product</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
              <li><Link href="#roles" className="text-sm text-muted-foreground hover:text-foreground">For You</Link></li>
              <li><Link href="/register" className="text-sm text-muted-foreground hover:text-foreground">Get Started</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold text-foreground">Company</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold text-foreground">Legal</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CalChat+. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
