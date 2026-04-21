import "@/styles/globals.css"
import { Sarabun } from "next/font/google"
import { cn } from "@/lib/utils"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth/auth"

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  return (
    <html lang="th" className={cn("font-sans", sarabun.variable)}>
      <body className="antialiased">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}