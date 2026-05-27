import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import InstallButton from "@/components/InstallButton"
import AuthNav from "@/components/AuthNav"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Una Parada en las Escrituras",
  description: "Has una parada en tu día y escucha lo que Dios quiere decirte hoy a través de las Escrituras.",
  openGraph: {
    title: "Una Parada en las Escrituras",
    description: "Has una parada en tu día y escucha lo que Dios quiere decirte hoy a través de las Escrituras.",
    images: ["/logo.png"],
  },
  appleWebApp: {
    capable: true,
    title: "Una Parada",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#09090b",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <header className="border-b border-zinc-800">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/" className="shrink-0">
              <img src="/logo.png" alt="Una Parada en las Escrituras" className="w-12 h-12 rounded-lg object-cover" />
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <AuthNav />
            </nav>
            <div className="ml-auto">
              <InstallButton />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-500">
          <p>Una Parada en las Escrituras &copy; {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  )
}
