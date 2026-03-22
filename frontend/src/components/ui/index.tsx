import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-20', className)}>
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
    </div>
  )
}

export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('max-w-6xl mx-auto px-6 py-24', className)}>{children}</section>
}

export function SectionHeading({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-14">
      <p className="section-tag">
        <span className="w-6 h-px inline-block" style={{ backgroundColor: 'var(--accent)' }} />
        {tag}
      </p>
      <h2 className="text-4xl md:text-5xl font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg max-w-xl" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
      )}
    </div>
  )
}

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  loading?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', loading = false, children, className, disabled, ...props }: BtnProps) {
  const base = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none'
  const styles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: 'var(--accent)', color: '#fff', boxShadow: '0 4px 14px var(--accent-dim)' },
    ghost:   { border: '1px solid var(--border-strong)', color: 'var(--text-secondary)' },
    danger:  { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' },
  }
  return (
    <button className={cn(base, className)} disabled={disabled || loading} style={styles[variant]} {...props}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}

export function Badge({ label }: { label: string }) {
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-md text-xs font-mono"
      style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
    >
      {label}
    </span>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24" style={{ color: 'var(--text-muted)' }}>
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <span className="text-2xl" style={{ color: 'var(--accent)' }}>&#10022;</span>
      </div>
      <p className="font-body text-center px-4">{message}</p>
    </div>
  )
}

export function AdminPage({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h1>
        {action && <div className="self-start sm:self-auto">{action}</div>}
      </div>
      {children}
    </div>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('glass rounded-2xl p-4 sm:p-6', className)}>{children}</div>
}
