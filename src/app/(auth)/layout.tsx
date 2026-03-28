import { Metadata } from 'next'
import "../globals.css"
import { cn } from '@/lib/utils' // Create utils.ts next

export const metadata: Metadata = {
  title: 'Career-Linker - Login & Register',
  description: 'Job marketplace authentication',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background font-sans antialiased bg-gradient-to-br from-slate-50 to-blue-50"
      )}
    >
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

