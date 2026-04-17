import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

export function FieldGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-4', className)} {...props} />
  )
}

export function Field({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...props} />
  )
}

export function FieldLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Label>) {
  return <Label className={cn('text-sm font-medium', className)} {...props} />
}

export function FieldError({
  errors,
  className,
}: {
  errors: (({ message?: string } | undefined) | null)[]
  className?: string
}) {
  const messages = errors
    .map((e) => e?.message)
    .filter(Boolean) as string[]

  if (messages.length === 0) return null

  return (
    <ul className={cn('space-y-0.5', className)}>
      {messages.map((msg) => (
        <li key={msg} className="text-sm text-red-500">
          {msg}
        </li>
      ))}
    </ul>
  )
}