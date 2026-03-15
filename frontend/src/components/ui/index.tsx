import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

// ─── Loading spinner ─────────────────────────────────────────────────────

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-20', className)}>
      <Loader2 className="w-8 h-8 animate-spin text-accent-400" />
    </div>
  )
}

// ─── Section wrapper ─────────────────────────────────────────────────────

export function Section({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('max-w-6xl mx-auto px-6 py-24', className)}>
      {children}
    </section>
  )
}

// ─── Section heading ─────────────────────────────────────────────────────

export function SectionHeading({
  tag,
  title,
  subtitle,
}: {
  tag: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-14">
      <p className="section-tag">
        <span className="w-6 h-px bg-accent-500 inline-block" />
        {tag}
      </p>
      <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
        {title}
      </h2>
      {subtitle && <p className="text-ink-300 text-lg max-w-xl">{subtitle}</p>}
    </div>
  )
}

// ─── Button ──────────────────────────────────────────────────────────────

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: BtnProps) {
  const base = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-accent-500 hover:bg-accent-400 text-white shadow-lg shadow-accent-500/20 hover:scale-[1.02] active:scale-[0.98]',
    ghost:   'border border-white/10 hover:border-accent-500/50 text-ink-200 hover:text-white hover:scale-[1.02] active:scale-[0.98]',
    danger:  'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
  }

  return (
    <button className={cn(base, variants[variant], className)} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────

export function Badge({ label }: { label: string }) {
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-mono
                     bg-accent-500/10 text-accent-300 border border-accent-500/20">
      {label}
    </span>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-ink-400">
      <div className="w-16 h-16 rounded-2xl bg-ink-800/60 border border-white/[0.06]
                      flex items-center justify-center mb-4">
        <span className="text-2xl">✦</span>
      </div>
      <p className="font-body">{message}</p>
    </div>
  )
}

// ─── Admin page wrapper ───────────────────────────────────────────────────

export function AdminPage({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-white">{title}</h1>
        {action}
      </div>
      {children}
    </div>
  )
}

// ─── Glass card ──────────────────────────────────────────────────────────

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('glass rounded-2xl p-6', className)}>
      {children}
    </div>
  )
}
