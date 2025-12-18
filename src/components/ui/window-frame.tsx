import { cn } from '@/lib/utils'
import React from 'react'

interface WindowFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  headerContent: React.ReactNode
}

export function WindowFrame({
  children,
  headerContent,
  className,
  ...props
}: WindowFrameProps) {
  return (
    <div className={cn('relative group', className)} {...props}>
      {/* MODIFICATION START - Trocando as cores do gradiente para branco/cinza */}
      <div
        className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-gray-400 to-gray-200 opacity-20 blur-lg transition duration-500 group-hover:opacity-40"
        aria-hidden="true"
      />
      {/* MODIFICATION END */}
      
      <div className="relative flex h-full w-full flex-col rounded-lg border-2 border-os-border bg-os-window-bg text-os-text shadow-lg">
        <div className="flex-shrink-0 border-b-2 border-os-border bg-os-header px-4 py-2">
          <div className="flex items-center justify-between">
            {headerContent}
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full border border-os-border"></div>
              <div className="h-3 w-3 rounded-full border border-os-border"></div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
