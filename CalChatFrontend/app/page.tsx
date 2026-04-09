import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Roles } from "@/components/landing/roles"
import { Footer } from "@/components/landing/footer"

export default function Page() {
    return (
        <div className="min-h-screen">
            {/*<Navbar />*/}
            <main>
                <Hero />
                <Features />
                <Roles />
            </main>
            {/*<Footer />*/}
        </div>
    )
}
//export default function Page() {
//    return <div>CalChat</div>
//}
