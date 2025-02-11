import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <main className="max-w-md mx-auto bg-slate-100">
        {children}
      </main>
    </div>
  )
}
